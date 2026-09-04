"use strict";
/*
 * kenecho Village - 会話クエスト／練習モードのロジック（KE_CONVERSATION）
 * - 今日の会話クエスト: 1シーン1ターン・3択。NPC/ペットのきずな度を「1日1回」だけ更新。
 *   同日の再プレイは更新しない。会話EXPは付与しない。
 * - 練習モード: きずな度を変化させず、シーンを練習できる。
 * NPCは種類公開後にのみ登場する（speciesRevealed でガード）。
 */
(function () {
  const C = globalThis.KE_CONFIG;
  const U = globalThis.KE_UTIL;
  const REL = globalThis.KE_RELATIONSHIP;
  const DIAG = globalThis.KE_DIALOGUE;

  function getScenes() {
    return globalThis.KE_SCENES || [];
  }

  function getSceneById(sceneId) {
    return getScenes().find(function (s) { return s.id === sceneId; }) || null;
  }

  function getNpcById(npcId) {
    return (globalThis.KE_NPCS || []).find(function (n) { return n.id === npcId; }) || null;
  }

  /** NPCが種類公開後に獲得できる。公開前は会話を開始できない */
  function isConversationUnlocked(db) {
    const pet = db.currentPet;
    return !!(pet && pet.speciesRevealed);
  }

  /** 利用可能なシーン一覧（発注済みNPCのシーン） */
  function getAvailableScenes(db) {
    const discovered = REL.getDiscoveredNpcIds(db);
    return getScenes().filter(function (s) { return discovered.indexOf(s.npcId) >= 0; });
  }

  /** 今日のクエストに使うシーンを選ぶ（直近の外出で出会ったNPCを優先し、その中からランダム） */
  function pickQuestScene(db) {
    const list = getAvailableScenes(db);
    if (list.length === 0) return null;
    const featured = db.conversation && db.conversation.lastOutingNpcId;
    if (featured) {
      const sub = list.filter(function (s) { return s.npcId === featured; });
      if (sub.length > 0) return sub[U.randInt(0, sub.length - 1)];
    }
    return list[U.randInt(0, list.length - 1)];
  }

  /** 未発見のNPCを1名ランダムに発見登録し、そのNPCを返す。全員発見済みなら null */
  function meetNewNpc(db, rng) {
    const all = globalThis.KE_NPCS || [];
    const undiscovered = all.filter(function (n) { return !REL.isNpcDiscovered(db, n.id); });
    const useRnd = typeof rng === "function" ? function (min, max) { return min + Math.floor(rng() * (max - min + 1)); } : null;
    const idx = useRnd ? useRnd(0, undiscovered.length - 1) : U.randInt(0, undiscovered.length - 1);
    if (undiscovered.length === 0) return null;
    const npc = undiscovered[idx];
    REL.ensureNpc(db, npc.id);
    if (!db.conversation) db.conversation = {};
    db.conversation.lastOutingNpcId = npc.id;
    return npc;
  }

  function getQuestStatus(db, today) {
    const cv = db.conversation || {};
    return { done: cv.dailyQuestDate === today, completed: !!cv.dailyQuestCompleted };
  }

  /** 台詞抽選用の文脈を組み立てる */
  function buildSpeechContext(db, scene, answerType, facet) {
    const pet = db.currentPet;
    const species = pet && pet.speciesId ? (globalThis.KE_PETS || []).find(function (p) { return p.id === pet.speciesId; }) : null;
    const npcBond = REL.getNpcBond(db, scene.npcId);
    const petBond = REL.getPetBondState(db).bond;
    const npcLevel = npcBond != null ? REL.getRelationshipLevelKey(npcBond) : null; // 未実装なら undefined
    const stage = pet ? (pet.stage === "egg" ? "egg" : pet.stage) : "egg";
    return {
      petType: species ? species.id : null,
      coachType: species ? species.coachType : null,
      stage: stage,
      condition: globalThis.KE_PET.getCondition(db),
      answerType: answerType,
      facet: facet || null,
      sceneTag: scene.category,
      npcRelationLevel: npcLevel,
      petRelationLevel: REL.getRelationshipLevelKey && REL.getRelationshipLevelKey(petBond),
      purpose: "feedback",
      recentIds: (pet && pet.recentDialogueIds) || []
    };
  }

  /**
   * 今日の会話クエストを完了する。
   * 戻り値: { ok, scene, answer, npc, firstToday, updates, advice }
   *  - firstToday=true のときだけ NPC/ペットのきずな度を更新（1日1回）
   */
  function completeDailyQuest(db, sceneId, answerIndex, today, questRound) {
    const scene = getSceneById(sceneId);
    if (!scene) return { ok: false, reason: "scene_not_found", message: "シーンが見つかりません。" };
    const round = questRound || scene.rounds[0];
    const answer = round && round.answers ? round.answers[answerIndex] : undefined;
    if (!answer) return { ok: false, reason: "bad_answer", message: "回答が見つかりません。" };
    if (!isConversationUnlocked(db)) return { ok: false, reason: "locked", message: "種類公開後に会話できます。" };

    const npc = getNpcById(scene.npcId) || { id: scene.npcId, displayName: scene.npcId };
    REL.ensureNpc(db, scene.npcId);
    const d = today || U.todayStr();
    // 短編物語「小さな約束」が今日の日次スロットを使用している日は、クエストの本編更新を行わない
    const storyUsedToday = !!(globalThis.KE_STORY && globalThis.KE_STORY.isDailyUsedByStory && globalThis.KE_STORY.isDailyUsedByStory(db, d));
    const firstToday = (db.conversation || {}).dailyQuestDate !== d && !storyUsedToday;

    const updates = {
      npc: null,
      pet: null,
      applied: firstToday
    };
    if (firstToday) {
      const npcState = REL.getNpcState(db, scene.npcId);
      const delta = (globalThis.KE_RELATIONSHIP_RULES.answerTypes[answer.type] || {}).delta || 0;
      const npcRes = REL.applyNpcBondChange(db, scene.npcId, delta);
      npcState.conversations = (npcState.conversations || 0) + 1;
      npcState.lastTalkedAt = d;
      const petRes = REL.applyPetBondQuestClear(db, d);
      if (!db.conversation) db.conversation = {};
      db.conversation.dailyQuestDate = d;
      db.conversation.dailyQuestCompleted = true;
      REL.recordHistory(db, { key: "npc:" + scene.npcId, delta: delta, from: npcRes.before, to: npcRes.after, why: "quest", sceneId: sceneId });
      if (petRes.ok) {
        REL.recordHistory(db, { key: "pet:" + db.currentPet.generationId, delta: petRes.delta, from: petRes.before, to: petRes.after, why: "quest", sceneId: sceneId });
      }
      updates.npc = { before: npcRes.before, after: npcRes.after, delta: delta };
      updates.pet = petRes.ok ? { before: petRes.before, after: petRes.after, delta: petRes.delta } : null;
      // NPC別の会話記憶（話題・約束・期待）を記録（本編・1日1回）
      if (globalThis.KE_NPC_MEMORY) {
        globalThis.KE_NPC_MEMORY.recordFromQuest(db, scene.npcId, scene, answer, d);
      }
    }

    // 台詞抽選（重複回避のために recentDialogueIds を更新。facet は助言の選択内容対応に使う）
    const ctx = buildSpeechContext(db, scene, answer.type, answer.facet);
    const chosen = DIAG.pick(ctx);
    if (db.currentPet && chosen.id) {
      db.currentPet.recentDialogueIds = DIAG.pushRecent(db.currentPet.recentDialogueIds, chosen.id, 10);
    }
    // ストーリー回合（id を持つ回合）を使った場合は、連続回避用に直近IDへ記録（外出しても同じ会話にしない）
    if (round && round.id) {
      if (!db.conversation) db.conversation = {};
      db.conversation.recentStoryIds = DIAG.pushRecent(db.conversation.recentStoryIds || [], round.id, (C.STORY && C.STORY.RECENT_KEEP) || 8);
    }

    return {
      ok: true,
      scene: scene,
      answer: answer,
      npc: npc,
      firstToday: firstToday,
      updates: updates,
      advice: chosen,
      unlocked: true
    };
  }

  /** 答えの分類ラベルと解説 */
  function getAnswerMeta(db, answer) {
    const rules = globalThis.KE_RELATIONSHIP_RULES;
    const meta = rules.answerTypes[answer.type] || {};
    return { type: answer.type, label: meta.label || answer.type, delta: meta.delta != null ? meta.delta : 0, explanation: answer.explanation, nextHint: answer.nextHint, facet: answer.facet || null };
  }

  /* ------------------------------------------------------------------ */
  /* ストーリー枠（導入・展開・応答・締め）                                 */
  /* ------------------------------------------------------------------ */

  /** rounds のインデックス → 役割キー（STORY.ROLES: open/develop/respond/close） */
  function roundRole(roundIndex) {
    const roles = C.STORY && C.STORY.ROLES;
    if (!roles || roles.length === 0) return "open";
    return roles[roundIndex] || roles[roles.length - 1];
  }

  /**
   * ターンに使う回合を決定する。ストーリー枠の条件に合う候補を KE_DIALOGUE.pickStoryRound が
   * 重み付きで抽選し、無ければ正規の回合（scene.rounds[n]）へフォールバックする。
   * opts: { db, prevFacet, recentIds, rng, weather, timeBand, memoryKinds }
   * （relationLevel は db から導出）
   */
  function resolveRound(scene, roundIndex, opts) {
    const o = opts || {};
    const fallback = scene.rounds[roundIndex];
    if (!fallback) return { source: "none", round: null, role: roundRole(roundIndex), id: null };
    const npc = getNpcById(scene.npcId) || {};
    let relationLevel = null;
    if (o.db && REL.getRelationshipLevelKey) {
      const bond = REL.getNpcBond(o.db, scene.npcId);
      if (bond != null) relationLevel = REL.getRelationshipLevelKey(bond);
    }
    const picked = DIAG.pickStoryRound({
      role: roundRole(roundIndex),
      scene: scene,
      npc: npc,
      relationLevel: relationLevel,
      prevFacet: o.prevFacet != null ? o.prevFacet : null,
      recentIds: o.recentIds || [],
      rng: o.rng,
      weather: o.weather || null,
      timeBand: o.timeBand != null ? o.timeBand : null,
      memoryKinds: Array.isArray(o.memoryKinds) ? o.memoryKinds : (globalThis.KE_NPC_MEMORY && o.db ? globalThis.KE_NPC_MEMORY.getMemoryKinds(o.db, scene.npcId) : null),
      fallbackRound: fallback
    });
    return { source: picked.source, round: picked.round, role: roundRole(roundIndex), id: picked.id };
  }

  /**
   * クエストに使う回合を選択する（ロール＝オープン）。
   * 場面・NPC・関係段階・天気・時間帯・記憶に合うストーリー回合を重み付きで抽選し、
   * 候補が無ければ正規の rounds[0] へ落とす。
   * 外出を重ねても毎回同じ会話にならないよう、過去に使ったストーリー回合（recentIds）を避ける。
   */
  function pickQuestRound(db, scene, recentIds, rng, weather, timeBand, memoryKinds) {
    const round0 = scene.rounds[0];
    if (!round0) return { source: "none", round: null, id: null };
    const npc = getNpcById(scene.npcId) || {};
    let relationLevel = null;
    if (REL.getRelationshipLevelKey) {
      const bond = REL.getNpcBond(db, scene.npcId);
      if (bond != null) relationLevel = REL.getRelationshipLevelKey(bond);
    }
    return DIAG.pickStoryRound({
      role: "open",
      scene: scene,
      npc: npc,
      relationLevel: relationLevel,
      prevFacet: null,
      recentIds: recentIds || [],
      rng: rng,
      weather: weather || null,
      timeBand: timeBand != null ? timeBand : null,
      memoryKinds: Array.isArray(memoryKinds) ? memoryKinds : (globalThis.KE_NPC_MEMORY ? globalThis.KE_NPC_MEMORY.getMemoryKinds(db, scene.npcId) : null),
      fallbackRound: round0
    });
  }

  /* ------------------------------------------------------------------ */
  /* 会話練習モード（きずな度は変化させない）                              */
  /* ------------------------------------------------------------------ */

  /** 練習の基本4ターン */
  function practiceRounds(scene) {
    return scene.rounds.slice(0, 4);
  }

  /** ボーナスタン成立条件：4ターン中「会話が続きやすい」を2回以上 */
  function isBonusEligible(goodCount) {
    return goodCount >= 2;
  }

  /** ボーナスターンのまとめの会話（シーンに付属しない共通の締め） */
  function makeBonusRound() {
    return {
      npcLine: "今日はいろいろ話せて楽しかったよ。またいつでも話そうね。",
      npcExpression: "happy",
      answers: [
        { text: "こちらこそ、また話そうね！", type: "good", npcReply: "うん、約束！ 楽しみにしてる。", npcExpression: "happy", explanation: "別れ際に次を約束すると、関係は続いていく。", nextHint: "実際にまた会うと、練習が実りになる。", weight: 10 },
        { text: "はい、ありがとうございました。", type: "short", npcReply: "うん、またね。", npcExpression: "neutral", explanation: "礼儀正しい短い締め。失礼はない。", nextHint: "一言、気持ちを添えると温かい。", weight: 10 },
        { text: "（うまく言えず、ぼんやりしてしまう）", type: "bad", npcReply: "…？ どうしたの？ また今度ね。", npcExpression: "troubled", explanation: "無言の締めは、相手に戸惑いを残す。", nextHint: "短くても返事をすることが大切。", weight: 10 }
      ]
    };
  }

  /**
   * 練習の1タンを評価する。データは一切変更しない。
   * fullRounds: 基本4ターン＋（ボーナス成立時）ボーナスターンを連結した配列
   */
  function evaluatePracticeAnswer(scene, roundIndex, answerIndex) {
    const base = practiceRounds(scene);
    const round = roundIndex < base.length ? base[roundIndex] : makeBonusRound();
    const answer = round.answers[answerIndex];
    if (!answer) return { ok: false };
    const meta = getAnswerMeta(null, answer);
    return { ok: true, answer: answer, meta: meta, roundNpcLine: round.npcLine, isBonus: roundIndex >= base.length };
  }

  /** ストーリー枠で解決済みの練習4ターン（ボーナス含まない）を返す */
  function buildPracticeRounds(scene, opts) {
    const out = [];
    for (let i = 0; i < 4; i++) out.push(resolveRound(scene, i, opts || {}));
    return out;
  }

  /** 任意の回合オブジェクト（ストーリー枠を含む）の1問を評価する。データは一切変更しない */
  function evaluateRoundAnswer(round, answerIndex) {
    if (!round || !round.answers) return { ok: false };
    const answer = round.answers[answerIndex];
    if (!answer) return { ok: false };
    const meta = getAnswerMeta(null, answer);
    return { ok: true, answer: answer, meta: meta, roundNpcLine: round.npcLine, facet: answer.facet || null, isBonus: false };
  }

  const KE_CONVERSATION = {
    getScenes,
    roundRole,
    resolveRound,
    buildPracticeRounds,
    evaluateRoundAnswer,
    getSceneById,
    getNpcById,
    isConversationUnlocked,
    getAvailableScenes,
    pickQuestScene,
    meetNewNpc,
    pickQuestRound,
    getQuestStatus,
    completeDailyQuest,
    getAnswerMeta,
    buildSpeechContext,
    practiceRounds,
    isBonusEligible,
    makeBonusRound,
    evaluatePracticeAnswer
  };

  if (globalThis) globalThis.KE_CONVERSATION = KE_CONVERSATION;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_CONVERSATION };
})();
