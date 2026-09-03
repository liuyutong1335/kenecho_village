"use strict";
/*
 * kenecho Village - きずな度ロジック（KE_RELATIONSHIP）
 * NPC別・ペット世代別のきずな度を管理する。
 * - NPC: 初期値40。回答分類で +8/+3/−4。0〜100へ補正。
 * - ペット: 初期値20。今日の会話クエスト完了で +2（1日1回・減点なし）。世代ごと。
 * - 総合きずな度 = round(ペット×0.4 ＋ NPC×0.6)。
 * 1日1回の更新ガードは conversation-game 側でも行い、ここでは数値更新と履歴を担う。
 */
(function () {
  const C = globalThis.KE_CONFIG;
  const U = globalThis.KE_UTIL;
  const R = globalThis.KE_RELATIONSHIP_RULES;

  function getRelationships(db) {
    if (!db.relationships) db.relationships = { pet: {}, npcs: {} };
    if (!db.relationships.pet) db.relationships.pet = {};
    if (!db.relationships.npcs) db.relationships.npcs = {};
    return db.relationships;
  }

  function npcDefault(npc) {
    return {
      bond: (npc && npc.initialBond != null) ? npc.initialBond : C.BOND.NPC_INITIAL,
      conversations: 0,
      lastTalkedAt: null,
      unlockedEvents: 0
    };
  }

  /** 遭遇済みか（relationships.npcs に登録があるか） */
  function isNpcDiscovered(db, npcId) {
    const rel = getRelationships(db);
    return !!rel.npcs[npcId];
  }

  /** 遭遇登録（未登録なら初期値で作成） */
  function ensureNpc(db, npcId) {
    const rel = getRelationships(db);
    if (!rel.npcs[npcId]) {
      const npc = (globalThis.KE_NPCS || []).find(function (n) { return n.id === npcId; });
      rel.npcs[npcId] = npcDefault(npc);
    }
    return rel.npcs[npcId];
  }

  function getNpcState(db, npcId) {
    const rel = getRelationships(db);
    return rel.npcs[npcId] || null;
  }

  function getNpcBond(db, npcId) {
    const s = getNpcState(db, npcId);
    return s ? s.bond : null;
  }

  /** NPCきずな度を変更（0〜100補正）。日付ガードは呼び出し側で行うこと */
  function applyNpcBondChange(db, npcId, delta) {
    const s = ensureNpc(db, npcId);
    const before = s.bond;
    s.bond = U.clamp(before + delta, C.BOND.MIN, C.BOND.MAX);
    return { ok: true, npcId: npcId, before: before, after: s.bond, delta: s.bond - before };
  }

  /** ペット世代別のきずな度レコード（あれば取得・なければ作成） */
  function getPetBondState(db, generationId) {
    const rel = getRelationships(db);
    const gen = generationId || (db.currentPet && db.currentPet.generationId) || "gen_001";
    if (!rel.pet[gen]) rel.pet[gen] = { bond: C.BOND.PET_INITIAL, questsCompleted: 0 };
    return rel.pet[gen];
  }

  /**
   * 会話クエスト完了でペットきずな度を+2する（1日1回・世代ごと・減点なし）。
   * date の変更ガードは currentPet.lastQuestDate で行う。
   */
  function applyPetBondQuestClear(db, date) {
    const pet = db.currentPet;
    if (!pet) return { ok: false, reason: "no_pet", message: "ペットがいません。" };
    if (pet.lastQuestDate === date) {
      return { ok: false, reason: "already", message: "今日のペットきずな度は更新済みです。" };
    }
    const gen = pet.generationId;
    const rec = getPetBondState(db, gen);
    const before = rec.bond;
    rec.bond = U.clamp(rec.bond + C.BOND.QUEST_CLEAR_PET, C.BOND.MIN, C.BOND.MAX);
    rec.questsCompleted = (rec.questsCompleted || 0) + 1;
    pet.lastQuestDate = date;
    pet.petBond = rec.bond;
    pet.questDays = (pet.questDays || 0) + 1;
    return { ok: true, before: before, after: rec.bond, delta: rec.bond - before, questsCompleted: rec.questsCompleted };
  }

  /** 総合きずな度（ペット×0.4 ＋ NPC×0.6） */
  function getTotalBond(db, npcId) {
    const petBond = getPetBondState(db).bond;
    const npcBond = getNpcBond(db, npcId);
    if (npcBond == null) return null;
    return R.totalBond(petBond, npcBond);
  }

  function getTotalBondByValues(petBond, npcBond) {
    if (npcBond == null) return null;
    return R.totalBond(petBond, npcBond);
  }

  /** 履歴へ追記（会話後の記録に使用） */
  function recordHistory(db, entry) {
    if (!db.relationshipHistory) db.relationshipHistory = [];
    db.relationshipHistory.push(Object.assign({ at: new Date().toISOString() }, entry));
  }

  /** 遭遇済みNPCの一覧（idの配列） */
  function getDiscoveredNpcIds(db) {
    const rel = getRelationships(db);
    return Object.keys(rel.npcs || {});
  }

  function getNpcBondLevelLabel(db, npcId) {
    const b = getNpcBond(db, npcId);
    return b == null ? null : R.levelLabel(b);
  }

  const KE_RELATIONSHIP = {
    getRelationships,
    isNpcDiscovered,
    ensureNpc,
    getNpcState,
    getNpcBond,
    applyNpcBondChange,
    getPetBondState,
    applyPetBondQuestClear,
    getTotalBond,
    getTotalBondByValues,
    recordHistory,
    getDiscoveredNpcIds,
    getNpcBondLevelLabel
  };

  if (globalThis) globalThis.KE_RELATIONSHIP = KE_RELATIONSHIP;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_RELATIONSHIP };
})();
