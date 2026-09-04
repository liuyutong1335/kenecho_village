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

  /** 助言の選択内容（facet）対応：同じ階層の候補内で、回答のfacetに一致する助言を優先する。
   *  一致が無ければ階層を変えず、そのまま使う（種類・分類に合った無関係でない助言を保つ）。 */
  function preferFacet(candidates, ctx) {
    const facet = ctx && ctx.facet;
    if (!facet || !Array.isArray(candidates) || candidates.length === 0) return candidates;
    const hit = candidates.filter(function (e) {
      return Array.isArray(e.facets) && e.facets.indexOf(facet) >= 0;
    });
    return hit.length > 0 ? hit : candidates;
  }

  /**
   * ctx: { petType, coachType, stage, condition, answerType, sceneTag,
   *        npcRelationLevel, petRelationLevel, purpose, recentIds }
   * 戻り値: { id, text, tier }
   */
  /** 成長・旅立ち・特別会話など、回答分類に依存しないイベント台詞の抽選 */
  function pickEvent(c) {
    const pool = globalThis.KE_COACH_SPEECH || [];
    // ① 全条件合致 → ② purpose＋種類のみ → ③ purposeのみ → ④ フォールバック
    let candidates = pool.filter(function (e) {
      return e.purpose === c.purpose && isCandidate(e, c);
    });
    if (candidates.length === 0 && c.petType) {
      candidates = pool.filter(function (e) {
        return e.purpose === c.purpose && e.petTypes.indexOf(c.petType) >= 0;
      });
    }
    if (candidates.length === 0) candidates = pool.filter((e) => e.purpose === c.purpose);
    if (candidates.length === 0) candidates = pool.filter((e) => e.purpose === "fallback");
    candidates = applyRecentAvoid(candidates, c.recentIds);
    const chosen = U.pickWeighted(candidates);
    if (!chosen) return { id: null, text: "", tier: 0, example: null };
    return { id: chosen.id, text: chosen.text, tier: 0, example: chosen.adviceExample || null };
  }

  function pick(ctx) {
    const pool = globalThis.KE_COACH_SPEECH || [];
    const c = ctx || {};
    if (["level_up", "departure", "special", "greeting", "hatch", "new_egg"].indexOf(c.purpose) >= 0) {
      return pickEvent(c);
    }
    const answers = byAnswerType(pool, c);
    const byAt = function (list) {
      if (!c.answerType) return list;
      return list.filter(function (e) { return e.answerType === c.answerType; });
    };

    let candidates = [];
    let tier = 4;

    // 1) ペット種類＋回答分類
    if (c.petType && c.answerType) {
      candidates = byAt(answers.filter(function (e) { return e.petTypes.indexOf(c.petType) >= 0; }));
      if (candidates.length > 0) tier = 1;
    }
    // 2) コーチタイプ＋回答分類
    if (candidates.length === 0 && c.coachType && c.answerType) {
      candidates = byAt(answers.filter(function (e) { return e.coachTypes.indexOf(c.coachType) >= 0; }));
      if (candidates.length > 0) tier = 2;
    }
    // 3) 回答分類のみ
    if (candidates.length === 0 && c.answerType) {
      candidates = byAt(answers);
      if (candidates.length > 0) tier = 3;
    }
    // 4) 共通の安全な台詞
    if (candidates.length === 0) {
      candidates = pool.filter(function (e) { return e.purpose === "fallback"; });
      tier = 4;
    }
    // 同じ階層内で、選択したfacet（共感・質問・自己開示等）に合う助言を優先する
    candidates = preferFacet(candidates, c);
    candidates = applyRecentAvoid(candidates, c.recentIds);
    const chosen = U.pickWeighted(candidates);
    if (!chosen) return { id: null, text: "", tier: 0, example: null };
    return { id: chosen.id, text: chosen.text, tier: tier, example: chosen.adviceExample || null };
  }

  /** 直近ID一覧を更新（最大 keep 件） */
  function pushRecent(recentIds, id, keep) {
    const max = keep || 10;
    const arr = Array.isArray(recentIds) ? recentIds.slice() : [];
    if (id && arr[arr.length - 1] !== id) arr.push(id);
    return arr.slice(-max);
  }

  /** タグ交差（line.tags 未指定は全タグで有効） */
  function tagOverlap(list, tags) {
    if (!Array.isArray(list) || list.length === 0) return true;
    if (!Array.isArray(tags)) return false;
    return tags.some(function (t) { return list.indexOf(t) >= 0; });
  }

  /**
   * ストーリー枠の回合を重み付きで抽選する（KE_STORY_LINES）。
   * ctx: {
   *   role,                    // open|develop|respond|close
   *   scene,                   // 対象シーン（category/tags 参照）
   *   npc,                     // NPC（personality 参照）
   *   relationLevel,           // 関係段階キー or null
   *   weather,                 // 天気キー or null（e.weather 指定の台詞は一致のみ）
   *   timeBand,                // 時間帯キー or null（e.timeBands 指定の台詞は一致のみ）
   *   memoryKinds,             // NPCに現在ある記憶種別 ["topic","promise",...]（e.requiresMemory 指定の台詞のみ）
   *   prevFacet,               // 直前の回答 facet or null
   *   recentIds,               // 連続回避用（KE_STORY_LINES の id）
   *   rng,                     // 抽選用 [0,1) 関数（テストで固定）
   *   fallbackRound            // 候補が無いときの正規回合（scene.rounds[n]）
   * }
   * 戻り値: { source: "story"|"scene"|"none", round, id }
   *  - 条件に合う候補だけを場面・NPC・関係段階・天気・時間帯・記憶・直前の選択で絞り込み、
   *  - 同じ台詞（正規回合と同一）と直近使用IDを避け、
   *  - データ側の weight に条件一致ボーナス（KE_CONFIG.STORY.WEIGHT_BONUS）を加算して抽選する。
   */
  function pickStoryRound(ctx) {
    const c = ctx || {};
    const pool = globalThis.KE_STORY_LINES || [];
    const C = globalThis.KE_CONFIG;
    const S = C && C.STORY;
    const bonus = (S && S.WEIGHT_BONUS) || { category: 6, personality: 6, relation: 4, facet: 6, topic: 4 };
    const defaultWeight = (S && S.DEFAULT_WEIGHT) || 10;
    const scene = c.scene || {};
    const npc = c.npc || {};
    const recent = Array.isArray(c.recentIds) ? c.recentIds : [];
    const fallbackNpcLine = c.fallbackRound ? c.fallbackRound.npcLine : null;
    const none = c.fallbackRound ? { source: "scene", round: c.fallbackRound, id: null } : { source: "none", round: null, id: null };

    const scored = [];
    for (let i = 0; i < pool.length; i++) {
      const e = pool[i];
      if (e.role !== c.role) continue;
      if (!matches({ sceneCategories: e.sceneCategories }, "sceneCategories", scene.category)) continue;
      if (!tagOverlap(e.tags, scene.tags)) continue;
      if (!matches({ personalities: e.personalities }, "personalities", npc.personality)) continue;
      if (!matches({ relationLevels: e.relationLevels }, "relationLevels", c.relationLevel)) continue;
      // 天気に紐づく台詞（指定があれば一致する場合のみ・一致で重み加算）
      let weatherMatched = false;
      if (Array.isArray(e.weather) && e.weather.length) {
        if (!c.weather || e.weather.indexOf(c.weather) < 0) continue;
        weatherMatched = true;
      }
      // 時間帯に紐づく台詞（指定があれば一致する場合のみ・一致で重み加算。時間帯不明なら除外）
      let timeBandMatched = false;
      if (Array.isArray(e.timeBands) && e.timeBands.length) {
        if (c.timeBand == null || e.timeBands.indexOf(c.timeBand) < 0) continue;
        timeBandMatched = true;
      }
      // 記憶に紐づく台詞（指定した種別の記憶が無ければ出さない・あれば重み加算）
      let memoryMatched = false;
      if (Array.isArray(e.requiresMemory) && e.requiresMemory.length) {
        const kinds = Array.isArray(c.memoryKinds) ? c.memoryKinds : [];
        if (!e.requiresMemory.some(function (k) { return kinds.indexOf(k) >= 0; })) continue;
        memoryMatched = true;
      }
      // 直前の選択に依存する台詞（前の選択が無い、またはfacet不一致なら除外）
      if (e.requiresPrev && c.prevFacet == null) continue;
      if (Array.isArray(e.prevFacets) && e.prevFacets.length > 0 && e.prevFacets.indexOf(c.prevFacet) < 0) continue;
      // 同じ台詞・直近使用IDは避ける
      if (fallbackNpcLine && e.npcLine === fallbackNpcLine) continue;
      if (recent.indexOf(e.id) >= 0) continue;

      let w = Number.isFinite(e.weight) && e.weight > 0 ? e.weight : defaultWeight;
      if (matches({ sceneCategories: e.sceneCategories }, "sceneCategories", scene.category)) w += bonus.category;
      if (matches({ personalities: e.personalities }, "personalities", npc.personality)) w += bonus.personality;
      if (matches({ relationLevels: e.relationLevels }, "relationLevels", c.relationLevel)) w += bonus.relation;
      if (Array.isArray(e.prevFacets) && e.prevFacets.indexOf(c.prevFacet) >= 0) w += bonus.facet;
      if (tagOverlap(e.tags, scene.tags)) w += bonus.topic;
      if (weatherMatched) w += (C.OUTING && C.OUTING.WEATHER_BONUS) || 5;
      if (timeBandMatched) w += bonus.timeBand || 6;
      if (memoryMatched) w += bonus.memory || 6;
      scored.push({ entry: e, weight: w, e: e });
    }

    if (scored.length === 0) return none;
    const chosen = U.pickWeighted(scored, c.rng);
    if (!chosen) return none;
    return { source: "story", round: chosen.entry, id: chosen.entry.id };
  }

  const KE_DIALOGUE = {
    pick: pick,
    pushRecent: pushRecent,
    pickStoryRound: pickStoryRound
  };

  if (globalThis) globalThis.KE_DIALOGUE = KE_DIALOGUE;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_DIALOGUE };
})();
