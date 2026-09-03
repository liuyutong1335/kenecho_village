"use strict";
/*
 * kenecho Village - ペット育成ロジック（KE_PET）
 * 卵/成長段階/健康状態/孵化/種類決定/図鑑/思い出/旅立ち/次世代。
 * M2: createEgg / M6: 成長と健康状態 / M7: 孵化・種類決定 / M12: 図鑑・思い出・旅立ち。
 */
(function () {
  const C = globalThis.KE_CONFIG;
  const U = globalThis.KE_UTIL;

  const CONDITION_META = {
    perfect: { label: "絶好調", desc: "よく記録ができています。" },
    happy: { label: "ご機嫌", desc: "いい記録が続いています。" },
    normal: { label: "ふつう", desc: "いつもどおりの様子です。" },
    lonely: { label: "少し寂しそう", desc: "今日は記録がまだありません。" },
    sleepy: { label: "眠そう", desc: "睡眠が短いようです。" }
  };

  /** 新しい世代の卵を生成する（種類非公開） */
  function createEgg(generationId, name, selectionMode) {
    const mode = ["choose", "random"].indexOf(selectionMode) >= 0 ? selectionMode : "choose";
    return {
      generationId: generationId,
      name: String(name || "").trim(),
      stage: "egg",
      speciesId: null,
      speciesRevealed: false,
      selectionMode: mode,
      birthDate: U.todayStr(),
      hatchedAt: null,
      cumulativeExp: 0,
      recordedDays: 0,
      questDays: 0,
      lastQuestDate: null,
      recentDialogueIds: [],
      petBond: C.BOND.PET_INITIAL
    };
  }

  /**
   * 現在のEXP・経過日数から到達可能な成長段階を計算する。
   * - egg: 未孵化（hatchedAt なし）
   * - child..companion: 累計EXP と 孵化後最低日数で判定
   * - departure（旅立ち）は checkDepartureReady で判定（この関数は companion まで）
   */
  function computeStage(pet, ref) {
    const today = ref || U.todayStr();
    if (!pet || !pet.hatchedAt) return "egg";
    const days = U.daysBetween(pet.hatchedAt, today);
    let current = "child";
    for (let i = 0; i < C.STAGE_ORDER.length; i++) {
      const st = C.STAGE_ORDER[i];
      if (st === "egg" || st === "child" || st === "departure") continue;
      const thr = C.STAGE_EXP_THRESHOLDS[st];
      if (thr != null && pet.cumulativeExp >= thr && days >= C.STAGE_MIN_DAYS[st]) {
        current = st;
      }
    }
    return current;
  }

  /** 表示用の成長段階キーを返す */
  function getPetStage(pet, ref) {
    if (!pet) return "egg";
    return computeStage(pet, ref);
  }

  function getStageLabel(stage) {
    return C.STAGE_LABELS[stage] || stage;
  }

  /** currentPet.stage を計算と同期し、変化があれば {from,to} を返す */
  function refreshStage(db, ref) {
    const pet = db && db.currentPet;
    if (!pet) return { changed: false };
    const from = pet.stage || "egg";
    const to = computeStage(pet, ref);
    if (to !== from) {
      pet.stage = to;
      return { changed: true, from: from, to: to };
    }
    return { changed: false, from: from, to: from };
  }

  /** 旅立ち可能か（陪伴期・累計EXP・最低日数・ペットきずな度） */
  function checkDepartureReady(pet, ref, petBond) {
    if (!pet || !pet.hatchedAt) return false;
    const today = ref || U.todayStr();
    const stage = getPetStage(pet, today);
    if (stage !== "companion") return false;
    const days = U.daysBetween(pet.hatchedAt, today);
    const thr = C.STAGE_EXP_THRESHOLDS.departure;
    const bond = petBond != null ? petBond : pet.petBond;
    return pet.cumulativeExp >= thr && days >= C.STAGE_MIN_DAYS.departure && bond >= C.DEPARTURE_MIN_PET_BOND;
  }

  /**
   * 健康状態（ペットの表情・待機動作・台詞の前置きに影響。会話評価には影響しない）。
   * 眠そう（睡眠時間が目標の半分未満）を最優先。
   */
  function getCondition(db, ref) {
    const H2 = globalThis.KE_HEALTH;
    const today = ref || U.todayStr();
    const goals = H2.getHealthGoals(db);
    const sleep = H2.getSleepOnDate(db, today);
    if (sleep && sleep.hours != null && sleep.hours < goals.sleepHours * 0.5) return "sleepy";
    const s = H2.getDailyScores(db, today);
    const vals = [s.meal, s.exercise, s.sleep];
    if (s.hasAny && vals.every(function (v) { return v === 2; })) return "perfect";
    if (s.hasAny && vals.some(function (v) { return v === 2; })) return "happy";
    if (!s.hasAny) return "lonely";
    return "normal";
  }

  function getConditionMeta(condition) {
    return CONDITION_META[condition] || { label: condition, desc: "" };
  }

  function getSpeciesById(speciesId) {
    const pets = globalThis.KE_PETS || [];
    for (let i = 0; i < pets.length; i++) {
      if (pets[i].id === speciesId) return pets[i];
    }
    return null;
  }

  /** 種類決定の候補。直近世代と同じ種類は除外する */
  function getSelectableSpecies(previousSpeciesId) {
    return (globalThis.KE_PETS || []).filter(function (p) { return p.id !== previousSpeciesId; });
  }

  /** 直前の世代の種類（思い出の末尾から取得）。初代は null */
  function getPreviousSpeciesId(db) {
    const mem = (db && db.petMemories) || [];
    return mem.length > 0 ? mem[mem.length - 1].speciesId : null;
  }

  /** 孵化で選べる候補一覧（次世代は直前世代と同種を除外） */
  function getHatchCandidates(db) {
    return getSelectableSpecies(getPreviousSpeciesId(db));
  }

  /**
   * 種類を決定して公開し、同一保存対象として図鑑へ登録する。
   * - 未公開（speciesRevealed=false）の卵のみ有効
   * - 図鑑は初回発見日を維持（同じ種類を再取得しても変更しない）
   * - stage を child にし hatchedAt を記録
   */
  function applyHatch(db, speciesId) {
    const pet = db.currentPet;
    if (!pet) return { ok: false, reason: "no_pet", message: "ペットが見つかりません。" };
    if (pet.speciesRevealed) return { ok: false, reason: "already", message: "種類は公開済みです。" };
    const candidates = getHatchCandidates(db);
    if (!candidates.some(function (p) { return p.id === speciesId; })) {
      return { ok: false, reason: "invalid", message: "選べない種類です。" };
    }
    if (!db.petEncyclopedia) db.petEncyclopedia = {};
    const existing = db.petEncyclopedia[speciesId];
    const firstDiscover = !(existing && existing.discovered);
    pet.speciesId = speciesId;
    pet.speciesRevealed = true;
    pet.hatchedAt = U.todayStr();
    pet.stage = "child";
    if (firstDiscover) {
      db.petEncyclopedia[speciesId] = { discovered: true, discoveredAt: pet.hatchedAt };
    }
    return { ok: true, speciesId: speciesId, hatchedAt: pet.hatchedAt, firstDiscover: firstDiscover };
  }

  /** おまかせ：候補からランダムに決定して公開する */
  function revealRandomSpecies(db) {
    const candidates = getHatchCandidates(db);
    if (!candidates.length) return { ok: false, reason: "empty", message: "選べる種類がありません。" };
    const pick = candidates[U.randInt(0, candidates.length - 1)];
    return applyHatch(db, pick.id);
  }

  const KE_PET = {
    createEgg: createEgg,
    computeStage: computeStage,
    getPetStage: getPetStage,
    getStageLabel: getStageLabel,
    refreshStage: refreshStage,
    checkDepartureReady: checkDepartureReady,
    getCondition: getCondition,
    getConditionMeta: getConditionMeta,
    getSpeciesById: getSpeciesById,
    getSelectableSpecies: getSelectableSpecies,
    getPreviousSpeciesId: getPreviousSpeciesId,
    getHatchCandidates: getHatchCandidates,
    applyHatch: applyHatch,
    revealRandomSpecies: revealRandomSpecies,
    CONDITION_META: CONDITION_META
  };

  if (globalThis) globalThis.KE_PET = KE_PET;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_PET: KE_PET };
})();
