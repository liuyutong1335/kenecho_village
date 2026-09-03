"use strict";
/*
 * kenecho Village - コーチ台詞抽選エンジン（KE_DIALOGUE）
 * 1) ペット種類＋回答分類 → 2) コーチタイプ＋回答分類 → 3) 回答分類のみ → 4) 共通の安全な台詞
 * の順で候補を絞り、重み付きで抽選する。同じ台詞の連続は直近ID一覧で回避する。
 */
(function () {
  const U = globalThis.KE_UTIL;

  function matches(entry, field, value) {
    const list = entry[field];
    if (!Array.isArray(list) || list.length === 0) return true; // 未指定は全条件で有効
    if (value == null) return false;
    return list.indexOf(value) >= 0;
  }

  function isCandidate(entry, ctx) {
    return matches(entry, "petTypes", ctx.petType) &&
      matches(entry, "coachTypes", ctx.coachType) &&
      matches(entry, "growthStages", ctx.stage) &&
      matches(entry, "petConditions", ctx.condition) &&
      matches(entry, "sceneTags", ctx.sceneTag) &&
      matches(entry, "relationLevels", ctx.npcRelationLevel) &&
      matches(entry, "petRelationLevels", ctx.petRelationLevel);
  }

  function byAnswerType(entries, ctx) {
    const at = ctx.answerType;
    return entries.filter(function (e) {
      if (e.answerType && e.answerType !== at) return false;
      return isCandidate(e, ctx);
    });
  }

  function applyRecentAvoid(candidates, recentIds) {
    if (!Array.isArray(recentIds) || recentIds.length === 0) return candidates;
    const blocked = candidates.filter(function (c) { return recentIds.indexOf(c.id) >= 0; });
    const rest = candidates.filter(function (c) { return recentIds.indexOf(c.id) < 0; });
    return rest.length > 0 ? rest : blocked;
  }

  /**
   * ctx: { petType, coachType, stage, condition, answerType, sceneTag,
   *        npcRelationLevel, petRelationLevel, purpose, recentIds }
   * 戻り値: { id, text, tier }
   */
  function pick(ctx) {
    const pool = globalThis.KE_COACH_SPEECH || [];
    const c = ctx || {};
    const answers = byAnswerType(pool, c);

    let candidates = [];
    let tier = 4;
    if (c.petType) candidates = answers.filter(function (e) { return e.petTypes.indexOf(c.petType) >= 0; });
    if (candidates.length > 0 && c.answerType) {
      const byPet = candidates.filter(function (e) {
        return e.answerType === c.answerType || !e.answerType;
      });
      candidates = byPet.length > 0 ? byPet : candidates;
      tier = 1;
    } else if (c.coachType && c.answerType) {
      candidates = answers.filter(function (e) { return e.coachTypes.indexOf(c.coachType) >= 0; });
      tier = 2;
    } else if (c.answerType) {
      candidates = answers.filter(function (e) { return e.answerType === c.answerType; });
      tier = 3;
    }
    if (candidates.length === 0) {
      candidates = pool.filter(function (e) { return e.purpose === "fallback"; });
      tier = 4;
    }
    candidates = applyRecentAvoid(candidates, c.recentIds);
    const chosen = U.pickWeighted(candidates);
    if (!chosen) return { id: null, text: "", tier: 0 };
    return { id: chosen.id, text: chosen.text, tier: tier };
  }

  /** 直近ID一覧を更新（最大 keep 件） */
  function pushRecent(recentIds, id, keep) {
    const max = keep || 10;
    const arr = Array.isArray(recentIds) ? recentIds.slice() : [];
    if (id && arr[arr.length - 1] !== id) arr.push(id);
    return arr.slice(-max);
  }

  const KE_DIALOGUE = {
    pick: pick,
    pushRecent: pushRecent
  };

  if (globalThis) globalThis.KE_DIALOGUE = KE_DIALOGUE;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_DIALOGUE };
})();
