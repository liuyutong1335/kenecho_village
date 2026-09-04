"use strict";
/*
 * ストーリー枠（導入・展開・応答・締め）のテスト。
 * - 役割マッピング / ストーリー台詞プールの整合
 * - 条件フィルタ（場面カテゴリ・タグ・NPC性格・関係段階・直前の選択facet・連続回避・フォールバック）
 * - 回答 facet の全シーン付与と「丁寧な断りは減点しない」
 * - アドバイス＝今回のポイント＋改善例（種で口調が変わり、内容の正しさは不変）
 * - 練習モードはデータを一切変更しない
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "relationship-rules.js"));
require(path.join(root, "data", "npc-data.js"));
require(path.join(root, "data", "pets.js"));
require(path.join(root, "data", "pet-coach-speech.js"));
require(path.join(root, "data", "conversation-scenes.js"));
require(path.join(root, "data", "story-lines.js"));
require(path.join(root, "data", "foods.js"));
require(path.join(root, "data", "exercises.js"));
require(path.join(root, "health.js"));
require(path.join(root, "pet-game.js"));
require(path.join(root, "relationship.js"));
const { KE_DIALOGUE: DIAG } = require(path.join(root, "dialogue-engine.js"));
const { KE_CONVERSATION: CONV } = require(path.join(root, "conversation-game.js"));
const { KE_DB } = require(path.join(root, "db.js"));

const C = globalThis.KE_CONFIG;
const SCENES = globalThis.KE_SCENES;
const STORY = globalThis.KE_STORY_LINES;
const FACETS = C.ANSWER_FACETS;

test("各シーンの4ターンが 導入→展開→応答→締め の順にマッピングされる", () => {
  assert.deepEqual(C.STORY.ROLES, ["open", "develop", "respond", "close"]);
  SCENES.forEach((s) => {
    for (let i = 0; i < 4; i++) {
      assert.equal(CONV.roundRole(i), C.STORY.ROLES[i], s.id + " round" + i);
    }
  });
  assert.equal(CONV.roundRole(0), "open");
  assert.equal(CONV.roundRole(4), "close"); // 余剰は最後の役割
});

test("ストーリー台詞プールの整合（役割・構造・facet・参照）", () => {
  const npcIds = new Set(globalThis.KE_NPCS.map((n) => n.id));
  const personalities = Object.keys(C.NPC_PERSONALITIES);
  const relations = C.BOND.LEVELS.map((l) => l.key);
  assert.ok(STORY.length >= 20, "プール件数（現: " + STORY.length + "）");
  const ids = new Set();
  STORY.forEach((e) => {
    assert.ok(C.STORY.ROLES.indexOf(e.role) >= 0, "role不正: " + e.id);
    assert.ok(Number.isFinite(e.weight) && e.weight > 0, "weight不正: " + e.id);
    assert.ok(e.npcLine && e.npcLine.length > 0, "npcLine不足: " + e.id);
    assert.equal(e.answers.length, 3, "3択であること: " + e.id);
    e.answers.forEach((a) => {
      assert.ok(["good", "short", "bad"].indexOf(a.type) >= 0);
      assert.ok(FACETS[a.facet], "facet不正: " + e.id);
      assert.ok(a.npcReply && a.npcReply.length > 0, "npcReply不足: " + e.id);
      assert.ok(a.explanation && a.nextHint, "解説不足: " + e.id);
    });
    (e.personalities || []).forEach((p) => { assert.ok(personalities.indexOf(p) >= 0); });
    (e.relationLevels || []).forEach((r) => { assert.ok(relations.indexOf(r) >= 0); });
    (e.sceneCategories || []).forEach((cat) => { assert.ok(["work", "daily", "food"].indexOf(cat) >= 0); });
    ids.add(e.id);
  });
  assert.equal(ids.size, STORY.length, "IDが一意");
});

test("全シーンの全回答に有効な facet が付与されている（20シーン×4ターン×3択）", () => {
  let count = 0;
  SCENES.forEach((s) => {
    s.rounds.forEach((r) => {
      r.answers.forEach((a) => {
        count++;
        assert.ok(FACETS[a.facet], s.id + " 回答にfacetなし: " + a.text.slice(0, 12));
      });
    });
  });
  assert.equal(count, 20 * 4 * 3);
});

test("丁寧な断り（polite_decline）は type を bad にしない（断罪しない）", () => {
  const targets = [];
  SCENES.forEach((s) => s.rounds.forEach((r) => r.answers.forEach((a) => {
    if (a.facet === "polite_decline") targets.push({ scene: s.id, type: a.type, text: a.text });
  })));
  STORY.forEach((e) => e.answers.forEach((a) => {
    if (a.facet === "polite_decline") targets.push({ scene: e.id, type: a.type, text: a.text });
  }));
  assert.ok(targets.length >= 3, "polite_decline が存在すること");
  targets.forEach((t) => {
    assert.notEqual(t.type, "bad", "polite_decline が bad になっている: " + t.scene + "「" + t.text + "」");
  });
});

test("pickStoryRound が役割と場面カテゴリで絞り込み、正しい候補を返す（乱数固定）", () => {
  const scene = SCENES.find((s) => s.id === "scn_001"); // work / sato(gentle)
  const npc = globalThis.KE_NPCS.find((n) => n.id === "npc_sato");
  const r = DIAG.pickStoryRound({
    role: "open", scene: scene, npc: npc, relationLevel: null, prevFacet: null, recentIds: [], rng: () => 0
  });
  assert.equal(r.source, "story");
  assert.equal(r.id, "story_open_work_001");
  assert.equal(r.round.npcLine, "お疲れさま。きょうはどう？ 何か進んだことある？");
});

test("facet が異なると抽選結果が絞り込まれる（直前の選択に依存しない台詞は除外）", () => {
  const scene = SCENES.find((s) => s.id === "scn_001");
  const npc = globalThis.KE_NPCS.find((n) => n.id === "npc_sato");
  // 直前の選択facet が無い場合、requiresPrev の板は出ない（正規の展開回合へ）
  const without = DIAG.pickStoryRound({ role: "develop", scene, npc, relationLevel: null, prevFacet: null, recentIds: [], rng: () => 0 });
  assert.equal(without.source, "story");
  assert.equal(without.id, "story_dev_work_001");
  // self_disclose のあとには、前の話を引き継ぐ「展開」の板が候補になる
  // （正規/共通の板を recentIds で除外して、引き継ぐ板に確実に当たることを確認）
  const after = DIAG.pickStoryRound({
    role: "develop", scene, npc, relationLevel: null, prevFacet: "self_disclose",
    recentIds: ["story_dev_work_001", "story_develop_fallback_001"], rng: () => 0
  });
  assert.equal(after.source, "story");
  assert.equal(after.id, "story_dev_afterstory_001");
});

test("候補が無ければ正規回合（scene.rounds）へフォールバックし、直近IDも回避する", () => {
  const scene = SCENES.find((s) => s.id === "scn_001");
  const npc = globalThis.KE_NPCS.find((n) => n.id === "npc_sato");
  const all = STORY.filter((e) => e.role === "open").map((e) => e.id);
  const r = DIAG.pickStoryRound({
    role: "open", scene, npc, relationLevel: null, prevFacet: null, recentIds: all, rng: () => 0,
    fallbackRound: scene.rounds[0]
  });
  assert.equal(r.source, "scene");
  assert.equal(r.round.npcLine, scene.rounds[0].npcLine);
  assert.equal(r.id, null);
});

test("buildPracticeRounds は4ターンを解決し、それぞれに役割を持つ（データを変更しない）", () => {
  const scene = SCENES.find((s) => s.id === "scn_001");
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  const before = JSON.parse(JSON.stringify(d));
  const turns = CONV.buildPracticeRounds(scene, { db: d, prevFacet: null });
  assert.equal(turns.length, 4);
  assert.deepEqual(turns.map((t) => t.role), ["open", "develop", "respond", "close"]);
  turns.forEach((t) => {
    assert.ok(t.round && t.round.npcLine, "回合不足");
    assert.ok(["scene", "story"].indexOf(t.source) >= 0, "source不正: " + t.source);
  });
  // 練習解決ではデータを一切変更しない
  assert.deepEqual(d, before);
});

test("evaluateRoundAnswer がストーリー回合も評価でき、データを変更しない", () => {
  const scene = SCENES.find((s) => s.id === "scn_001");
  const storyTurn = DIAG.pickStoryRound({ role: "develop", scene, npc: { personality: "gentle" }, relationLevel: null, prevFacet: null, recentIds: [], rng: () => 0 });
  const ev = CONV.evaluateRoundAnswer(storyTurn.round, 0);
  assert.equal(ev.ok, true);
  assert.ok(["good", "short", "bad"].indexOf(ev.meta.type) >= 0);
  assert.ok(FACETS[ev.facet]);
  // 既存互換 API（scene 基準）も維持
  const ev2 = CONV.evaluatePracticeAnswer(scene, 0, 0);
  assert.equal(ev2.ok, true);
  assert.equal(ev2.isBonus, false);
});

test("アドバイスは「今回のポイント＋改善例」を持ち、種で口調が変わっても内容は不変", () => {
  // completeDailyQuest（クエスト1ターン＝導入）で advice に text と example が付く
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  const scene = SCENES.find((s) => s.id === "scn_001");
  const goodIdx = scene.rounds[0].answers.findIndex((a) => a.type === "good");
  const r = CONV.completeDailyQuest(d, scene.id, goodIdx, "2026-09-05");
  assert.equal(r.ok, true);
  assert.equal(r.firstToday, true);
  assert.ok(r.advice.text && r.advice.text.length > 0, "ポイント（text）がある");
  assert.ok(r.advice.example && r.advice.example.length > 0, "改善例（example）がある");

  // 種が違っても「改善例」の核（オウム返し→共感）は変わらない（口調のみ変化）
  const aRabbit = DIAG.pick({ petType: "rabbit", coachType: "gentle", stage: "child", answerType: "bad" });
  const aTanuki = DIAG.pick({ petType: "tanuki", coachType: "playful", stage: "child", answerType: "bad" });
  assert.ok(aRabbit.id !== aTanuki.id, "口調（point）が種で区別される");
  assert.ok(aRabbit.example.indexOf("オウム返し") >= 0);
  assert.ok(aTanuki.example.indexOf("オウム返し") >= 0);
});

test("練習モード（ストーリー回合含む）で記憶・きずな度・クエスト日付は変化しない", () => {
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  const scene = SCENES.find((s) => s.id === "scn_001");
  const beforeBond = globalThis.KE_RELATIONSHIP.getNpcState(d, "npc_sato").bond;
  const beforeRecent = (d.currentPet.recentDialogueIds || []).slice();
  const beforeQuest = (d.conversation && d.conversation.dailyQuestDate) || null;
  CONV.buildPracticeRounds(scene, { db: d, prevFacet: "self_disclose" });
  const turns = CONV.buildPracticeRounds(scene, { db: d, prevFacet: "self_disclose" });
  turns.forEach((t) => {
    for (let i = 0; i < 3; i++) {
      const ev = CONV.evaluateRoundAnswer(t.round, i);
      assert.equal(ev.ok, true);
    }
  });
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcState(d, "npc_sato").bond, beforeBond);
  assert.deepEqual(d.currentPet.recentDialogueIds, beforeRecent);
  assert.equal((d.conversation && d.conversation.dailyQuestDate) || null, beforeQuest);
});

function dbRevealed() {
  const d = KE_DB.defaultData();
  d.currentPet = { generationId: "gen_001", name: "モモ", speciesId: "rabbit", speciesRevealed: true, stage: "child", recentDialogueIds: [], lastQuestDate: null, cumulativeExp: 0, questDays: 0, petBond: 20 };
  return d;
}

/* ==================================================================== */
/* エンジン拡張：時間帯条件・記憶条件・facet助言                          */
/* ==================================================================== */

/** 一時的に KE_STORY_LINES を差し替えて pickQuestRound(open) を検証する */
function qrWithPool(d, scene, pool, ctxExtras, rng) {
  const prev = globalThis.KE_STORY_LINES;
  globalThis.KE_STORY_LINES = pool;
  try {
    return CONV.pickQuestRound(d, scene, [], rng || (() => 0), ctxExtras.weather || "clear", ctxExtras.timeBand || null, ctxExtras.memoryKinds || null);
  } finally {
    globalThis.KE_STORY_LINES = prev;
  }
}

test("ストーリー枠の時間帯条件：朝限定の台詞は朝のみ候補になる（夜は選ばない）", () => {
  const d = KE_DB.defaultData();
  const scene = SCENES.find((s) => s.category === "daily");
  globalThis.KE_RELATIONSHIP.ensureNpc(d, scene.npcId);
  const line = {
    id: "zz_test_time_001", role: "open", sceneCategories: [scene.category], timeBands: ["morning"],
    tags: [], personalities: [], relationLevels: [], requiresPrev: false, weather: null, weight: 10,
    npcLine: "朝の散歩、気持ちいいね。", npcExpression: "smile",
    answers: [{ text: "おはようございます！", type: "good", facet: "onward", npcReply: "おはよう！", npcExpression: "happy", explanation: "朝の挨拶を返すと自然に会話が始まる。", nextHint: "さわやかさを一言添えると良い。", weight: 10 }]
  };
  const morning = qrWithPool(d, scene, [line], { timeBand: "morning" }, () => 0);
  assert.equal(morning.source, "story");
  assert.equal(morning.id, line.id);
  const night = qrWithPool(d, scene, [line], { timeBand: "night" }, () => 0);
  assert.equal(night.source, "scene", "朝以外の時間帯には朝限定の台詞を選ばず正規回合へフォールバック");
  assert.equal(night.round.npcLine, scene.rounds[0].npcLine);
});

test("ストーリー枠の記憶条件：約束の記憶があるときだけ再訪台詞が出る", () => {
  const d = KE_DB.defaultData();
  const scene = SCENES.find((s) => s.id === "scn_001");
  globalThis.KE_RELATIONSHIP.ensureNpc(d, scene.npcId);
  const line = {
    id: "zz_test_mem_001", role: "open", sceneCategories: [scene.category], requiresMemory: ["promise"],
    tags: ["work"], personalities: [], relationLevels: [], requiresPrev: false, timeBands: null, weather: null, weight: 10,
    npcLine: "そういえば、この前の約束、覚えてる？", npcExpression: "smile",
    answers: [{ text: "覚えてますよ！", type: "good", facet: "promise", npcReply: "よかった！", npcExpression: "happy", explanation: "約束を覚えていると伝えると信頼が深まる。", nextHint: "守る日を言うと良い。", weight: 10 }]
  };
  const withPromise = qrWithPool(d, scene, [line], { timeBand: "daytime", memoryKinds: ["promise"] }, () => 0);
  assert.equal(withPromise.source, "story");
  const withoutPromise = qrWithPool(d, scene, [line], { timeBand: "daytime", memoryKinds: [] }, () => 0);
  assert.equal(withoutPromise.source, "scene", "約束の記憶が無ければ再訪台詞を出さない");
});

test("NPC記憶の種別（getMemoryKinds）が記録内容に応じて出る", () => {
  const { KE_NPC_MEMORY } = require(path.join(root, "npc-memory.js"));
  const d = KE_DB.defaultData();
  assert.deepEqual(KE_NPC_MEMORY.getMemoryKinds(d, "npc_sato"), []);
  const scene = SCENES.find((s) => s.npcId === "npc_sato");
  const ans = { text: "約束します", type: "good", facet: "promise", promiseNote: "明日、コーヒーを飲む" };
  KE_NPC_MEMORY.recordFromQuest(d, "npc_sato", scene, ans, "2026-09-05");
  const kinds = KE_NPC_MEMORY.getMemoryKinds(d, "npc_sato");
  assert.ok(kinds.indexOf("topic") >= 0, "話題タグが記録される（" + JSON.stringify(kinds) + "）");
  assert.ok(kinds.indexOf("promise") >= 0, "約束の pending が記憶される");
});

test("コーチ助言が選択facet一致を優先する（無関係な助言を出さない・階層は下げない）", () => {
  const prev = globalThis.KE_COACH_SPEECH;
  globalThis.KE_COACH_SPEECH = [
    { id: "zz_adv_self", petTypes: ["rabbit"], coachTypes: [], growthStages: [], petConditions: [], answerType: "good", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "自己開示の助言", facets: ["self_disclose"], weight: 10 },
    { id: "zz_adv_generic", petTypes: ["rabbit"], coachTypes: [], growthStages: [], petConditions: [], answerType: "good", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "汎用の助言", weight: 10 }
  ];
  try {
    const withSelf = DIAG.pick({ petType: "rabbit", answerType: "good", facet: "self_disclose", purpose: "feedback", recentIds: [] });
    assert.equal(withSelf.id, "zz_adv_self", "facet一致の助言を優先する");
    const withOther = DIAG.pick({ petType: "rabbit", answerType: "good", facet: "question", purpose: "feedback", recentIds: [] });
    assert.ok(withOther.id === "zz_adv_self" || withOther.id === "zz_adv_generic", "facet非一致でも同階層の候補から選ぶ（無関係な下位階層へは落とさない）");
  } finally {
    globalThis.KE_COACH_SPEECH = prev;
  }
});
