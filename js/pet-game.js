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
    sleepy: { label: "眠そう", desc: "睡眠が短いようです。" },
    sick: C.SICK.meta
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
   * 優先順位: 病気（大きな負担）> 眠そう > perfect > happy > lonely > normal。
   * 病気（sick）は、睡眠が目標の約1/4未満、または摂取が目標+1000kcal超の日。
   * ただし「外に出て遊んだ」（外出・会話で回復）当日は病気扱いにしない。
   */
  function getCondition(db, ref) {
    const H2 = globalThis.KE_HEALTH;
    const today = ref || U.todayStr();
    const goals = H2.getHealthGoals(db);
    const sleep = H2.getSleepOnDate(db, today);
    const meals = H2.getMealTotals(db, today);

    // 外出で回復した当日は、病気・眠そう（不調）にならない（記録はそのまま活きる）
    const recovered = !!(db.settings && db.settings.recoveredAt === today);
    if (recovered) {
      const s2 = H2.getDailyScores(db, today);
      const v2 = [s2.meal, s2.exercise, s2.sleep];
      if (s2.hasAny && v2.every(function (v) { return v === 2; })) return "perfect";
      if (s2.hasAny && v2.some(function (v) { return v === 2; })) return "happy";
      if (!s2.hasAny) return "lonely";
      return "normal";
    }
    // 明確な過剰摂取（目標+1000kcal超）→ 体調不良
    const tooCalorie = meals.count > 0 && meals.kcal >= goals.calorieLimitKcal + C.SICK.CALORIE_OVER_KCAL;
    if (tooCalorie) return "sick";
    // 睡眠不足は「眠そう」で表現（既存仕様を維持）
    if (sleep && sleep.hours != null && sleep.hours < goals.sleepHours * 0.5) return "sleepy";
    const s = H2.getDailyScores(db, today);
    const vals = [s.meal, s.exercise, s.sleep];
    if (s.hasAny && vals.every(function (v) { return v === 2; })) return "perfect";
    if (s.hasAny && vals.some(function (v) { return v === 2; })) return "happy";
    if (!s.hasAny) return "lonely";
    return "normal";
  }

  /** 外出（会話クエスト・練習）した日に回復済みとして記録する */
  function markRecovered(db, ref) {
    const today = ref || U.todayStr();
    if (!db.settings) db.settings = {};
    db.settings.recoveredAt = today;
    return today;
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

  /** 直前の世代の種類（旅立った世代のうち最新から取得）。初代は null */
  function isDepartureMemory(m) {
    // 従来データ（type なし）は旅立ちの思い出として扱う
    return !m.type || m.type === "departure";
  }
  function getPreviousSpeciesId(db) {
    const mem = db.petMemories || [];
    for (let i = mem.length - 1; i >= 0; i--) {
      const m = mem[i];
      if (m && isDepartureMemory(m) && m.speciesId) return m.speciesId;
    }
    return null;
  }

  /** 現在の世代の思い出レコードを組み立てる */
  function buildPetMemory(db) {
    const pet = db.currentPet;
    const today = U.todayStr();
    const days = pet.hatchedAt ? U.daysBetween(pet.hatchedAt, today) : 0;
    let mainNpcId = null;
    let maxBond = -1;
    const npcs = (db.relationships && db.relationships.npcs) || {};
    Object.keys(npcs).forEach(function (id) {
      const b = npcs[id].bond;
      if (typeof b === "number" && b > maxBond) { maxBond = b; mainNpcId = id; }
    });
    return {
      type: "departure",
      generationId: pet.generationId,
      name: pet.name,
      speciesId: pet.speciesRevealed ? pet.speciesId : null,
      birthDate: pet.birthDate,
      hatchedAt: pet.hatchedAt,
      departedAt: today,
      daysTogether: days,
      finalStage: pet.stage,
      healthRecordDays: pet.recordedDays,
      questDays: pet.questDays,
      finalBond: pet.petBond,
      mainNpcId: mainNpcId
    };
  }

  /** 旅立ち：現在のペットを思い出へ保存する */
  function completeDeparture(db) {
    const pet = db.currentPet;
    if (!pet) return { ok: false, reason: "no_pet", message: "ペットがいません。" };
    if (pet.stage === "egg" || !pet.speciesRevealed) {
      return { ok: false, reason: "not_ready", message: "旅立つ準備ができていません。" };
    }
    const already = (db.petMemories || []).some(function (m) {
      return isDepartureMemory(m) && m.generationId === pet.generationId;
    });
    if (already) return { ok: false, reason: "already_departed", message: "この世代は旅立ち済みです。" };
    const memory = buildPetMemory(db);
    if (!db.petMemories) db.petMemories = [];
    db.petMemories.push(memory);
    return { ok: true, memory: memory };
  }

  /** 次世代の新しい卵を開始する（呼び出し前に completeDeparture 済みであること） */
  function startNextGeneration(db, name, selectionMode) {
    // 世代番号は「旅立った世代」から決める（孵化の思い出は含めない）
    const departedCount = (db.petMemories || []).filter(function (m) {
      return isDepartureMemory(m);
    }).length;
    const genNo = departedCount + 1;
    const nextGenId = "gen_" + String(genNo).padStart(3, "0");
    const pet = createEgg(nextGenId, name, selectionMode);
    db.currentPet = pet;
    if (!db.relationships) db.relationships = { pet: {}, npcs: {} };
    if (!db.relationships.pet) db.relationships.pet = {};
    db.relationships.pet[nextGenId] = { bond: pet.petBond, questsCompleted: 0 };
    if (db.conversation) db.conversation.dailyQuestCompleted = false;
    return { ok: true, pet: pet, generationId: nextGenId };
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
    // 生まれた瞬間の思い出（最初の1枚）を残す
    addHatchMemory(db, pet);
    return { ok: true, speciesId: speciesId, hatchedAt: pet.hatchedAt, firstDiscover: firstDiscover };
  }

  /** 孵化した瞬間（生まれた！）の思い出を先頭に追加する */
  function addHatchMemory(db, pet) {
    if (!db.petMemories) db.petMemories = [];
    const already = db.petMemories.some(function (m) {
      return m.type === "hatch" && m.generationId === pet.generationId;
    });
    if (already) return;
    db.petMemories.push({
      type: "hatch",
      generationId: pet.generationId,
      name: pet.name,
      speciesId: pet.speciesId || null,
      birthDate: pet.birthDate,
      hatchedAt: pet.hatchedAt,
      // エフェクト画像の種類（UIが描画）
      image: "egg_hatch"
    });
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
    markRecovered: markRecovered,
    getSpeciesById: getSpeciesById,
    getSelectableSpecies: getSelectableSpecies,
    getPreviousSpeciesId: getPreviousSpeciesId,
    getHatchCandidates: getHatchCandidates,
    applyHatch: applyHatch,
    revealRandomSpecies: revealRandomSpecies,

    // 思い出・旅立ち・次世代（M12）
    buildPetMemory: buildPetMemory,
    addHatchMemory: addHatchMemory,
    completeDeparture: completeDeparture,
    startNextGeneration: startNextGeneration,

    CONDITION_META: CONDITION_META
  };

  if (globalThis) globalThis.KE_PET = KE_PET;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_PET: KE_PET };
})();
