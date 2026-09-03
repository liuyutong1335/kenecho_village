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

  /** 今日のクエストに使うシーンを選ぶ（利用可能からランダム） */
  function pickQuestScene(db) {
    const list = getAvailableScenes(db);
    if (list.length === 0) return null;
    return list[U.randInt(0, list.length - 1)];
  }

  function getQuestStatus(db, today) {
    const cv = db.conversation || {};
    return { done: cv.dailyQuestDate === today, completed: !!cv.dailyQuestCompleted };
  }

  /** 台詞抽選用の文脈を組み立てる */
  function buildSpeechContext(db, scene, answerType) {
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
  function completeDailyQuest(db, sceneId, answerIndex, today) {
    const scene = getSceneById(sceneId);
    if (!scene) return { ok: false, reason: "scene_not_found", message: "シーンが見つかりません。" };
    const round = scene.rounds[0];
    const answer = round.answers[answerIndex];
    if (!answer) return { ok: false, reason: "bad_answer", message: "回答が見つかりません。" };
    if (!isConversationUnlocked(db)) return { ok: false, reason: "locked", message: "種類公開後に会話できます。" };

    const npc = getNpcById(scene.npcId) || { id: scene.npcId, displayName: scene.npcId };
    REL.ensureNpc(db, scene.npcId);
    const d = today || U.todayStr();
    const firstToday = (db.conversation || {}).dailyQuestDate !== d;

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
    }

    // 台詞抽選（重複回避のために recentDialogueIds を更新）
    const ctx = buildSpeechContext(db, scene, answer.type);
    const chosen = DIAG.pick(ctx);
    if (db.currentPet && chosen.id) {
      db.currentPet.recentDialogueIds = DIAG.pushRecent(db.currentPet.recentDialogueIds, chosen.id, 10);
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
    return { type: answer.type, label: meta.label || answer.type, delta: meta.delta != null ? meta.delta : 0, explanation: answer.explanation, nextHint: answer.nextHint };
  }

  const KE_CONVERSATION = {
    getScenes,
    getSceneById,
    getNpcById,
    isConversationUnlocked,
    getAvailableScenes,
    pickQuestScene,
    getQuestStatus,
    completeDailyQuest,
    getAnswerMeta,
    buildSpeechContext
  };

  if (globalThis) globalThis.KE_CONVERSATION = KE_CONVERSATION;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_CONVERSATION };
})();
