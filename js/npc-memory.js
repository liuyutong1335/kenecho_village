"use strict";
/*
 * kenecho Village - NPC別の会話記憶（KE_NPC_MEMORY）
 * プレイヤー（profileId）とNPC（npcId）の組ごとに、過去の話題・約束・未解決の誤解・
 * 次回への期待を保存する。ペットが次世代になっても維持される（top-level の npcMemory）。
 *
 * - 「期待」はスコアではなく状態（続きを聞きたい／誘い・提案への返事待ち）。
 * - プレイヤーの意図は「実際の選択（facet）」からだけ記録する（勝手に推測しない）。
 * - 練習モードは読み取り専用（getMemorySummary / getNextGreeting）。本編（記録）は
 *   recordFromQuest のみが書く。練習では本編の関係・約束・記憶を書き換えない。
 */
(function () {
  const U = globalThis.KE_UTIL;

  /** profileId:npcId のキー（プロフィール切替でも干渉しない） */
  function memoryKey(db, npcId) {
    const profileId = (db && db.profile && db.profile.profileId) || "profile_default";
    return String(profileId) + ":" + String(npcId);
  }

  /** 読み取り専用の取得（無ければ null。練習でも書き込みをしない） */
  function getMemory(db, npcId) {
    if (!db || !db.npcMemory) return null;
    return db.npcMemory[memoryKey(db, npcId)] || null;
  }

  /** 記録用（無ければ初期化して返す） */
  function ensureMemory(db, npcId) {
    if (!db) return null;
    if (!db.npcMemory) db.npcMemory = {};
    const key = memoryKey(db, npcId);
    if (!db.npcMemory[key]) {
      db.npcMemory[key] = {
        key: key,
        profileId: (db.profile && db.profile.profileId) || null,
        npcId: npcId,
        topics: [],
        promises: [],
        expectations: [],
        misunderstandings: [],
        lastSceneId: null,
        lastTopic: null,
        lastChoiceFacet: null,
        greetingCount: 0,
        updatedAt: null
      };
    }
    return db.npcMemory[key];
  }

  /** リストへ末尾追加し重複は最新扱い（最大 keep 件） */
  function pushRecent(list, item, keep) {
    const max = keep || 5;
    const arr = Array.isArray(list) ? list.slice() : [];
    const idx = arr.findIndex(function (i) { return (i.topic || i.kind) === (item.topic !== undefined ? item.topic : item.kind); });
    if (idx >= 0) arr.splice(idx, 1);
    arr.push(item);
    return arr.slice(-max);
  }

  /**
   * 本編（会話クエスト）の記録。回答の facet・promiseNote・type からだけで導出する。
   * - 話題: シーンのタグ（またはカテゴリ）
   * - 約束: promiseNote を持つ回答を選んだときのみ
   * - 期待: question → 続きを聞きたい / polite_decline → 返事待ち
   * - 誤解: bad（回避）で終わったとき
   */
  function recordFromQuest(db, npcId, scene, answer, today) {
    const m = ensureMemory(db, npcId);
    if (!m || !answer) return null;
    const d = today || U.todayStr();
    const tags = (Array.isArray(scene.tags) && scene.tags.length) ? scene.tags : [scene.category || "other"];
    tags.forEach(function (t) {
      m.topics = pushRecent(m.topics, { topic: t, at: d, sceneId: scene.id }, 5);
    });
    m.lastSceneId = scene.id;
    m.lastTopic = m.topics.length ? m.topics[m.topics.length - 1].topic : null;
    m.lastChoiceFacet = answer.facet || null;

    if (answer.promiseNote) {
      m.promises.push({ text: answer.promiseNote, status: "pending", since: d, sceneId: scene.id });
      m.promises = m.promises.slice(-5);
    }
    if (answer.facet === "question") {
      m.expectations = pushRecent(m.expectations, { kind: "hear_more", text: "続きを聞きたい", since: d }, 5);
    } else if (answer.facet === "polite_decline") {
      m.expectations = pushRecent(m.expectations, { kind: "await_player_reply", text: "誘い・提案への返事待ち", since: d }, 5);
    }
    if (answer.type === "bad" && (answer.facet === "avoid" || !answer.facet)) {
      m.misunderstandings.push({ text: "会話がぎこちなく終わった", at: d, resolved: false });
      m.misunderstandings = m.misunderstandings.slice(-3);
    }
    m.greetingCount = (m.greetingCount || 0) + 1;
    m.updatedAt = d;
    return m;
  }

  /** 次回の挨拶・会話のきっかけ（記憶と関係段階を反映。無ければ null） */
  function getNextGreeting(db, npcId) {
    const m = getMemory(db, npcId);
    if (!m) return null;
    const misu = (m.misunderstandings || []).slice().reverse().find(function (x) { return !x.resolved; });
    if (misu) return "この前は、あんなふうに話してしまって、ごめんね。";
    const expect = (m.expectations || []).slice().reverse().find(function (e) { return e.kind === "await_player_reply"; });
    if (expect) return "この前の話、どうなった？ 返事を待ってたんだ。";
    const pending = (m.promises || []).slice().reverse().find(function (p) { return p.status === "pending"; });
    if (pending) return "そういえば、この前の約束（" + pending.text + "）、覚えてる？";
    const hear = (m.expectations || []).slice().reverse().find(function (e) { return e.kind === "hear_more"; });
    if (hear) return "この前の話、続きを聞かせてくれない？";
    return null;
  }

  /** 練習モード用の読み取りサマリ（書き込みなし・本編を変化させない） */
  function getMemorySummary(db, npcId) {
    const m = getMemory(db, npcId);
    return {
      topics: (m && m.topics || []).slice(-3),
      pendingPromises: (m && m.promises || []).filter(function (p) { return p.status === "pending"; }),
      expectations: (m && m.expectations || []).slice(-3),
      misunderstandings: (m && m.misunderstandings || []).filter(function (x) { return !x.resolved; }),
      nextGreeting: getNextGreeting(db, npcId)
    };
  }

  /** 約束をすべて解決済み（kept）にする（実行を確認したとき等） */
  function resolvePromises(db, npcId) {
    const m = ensureMemory(db, npcId);
    if (!m) return null;
    (m.promises || []).forEach(function (p) { if (p.status === "pending") p.status = "kept"; });
    return m;
  }

  const KE_NPC_MEMORY = {
    getMemory: getMemory,
    recordFromQuest: recordFromQuest,
    getNextGreeting: getNextGreeting,
    getMemorySummary: getMemorySummary,
    resolvePromises: resolvePromises
  };

  if (globalThis) globalThis.KE_NPC_MEMORY = KE_NPC_MEMORY;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_NPC_MEMORY };
})();
