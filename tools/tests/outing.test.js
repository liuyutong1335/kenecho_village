"use strict";
/*
 * 外出まわりの会話（feat/outing-dialogue-variety）のテスト。
 * - 外出時のNPC発見（佐藤以外のNPCにも会える）
 * - クエストシーンの優先（直近の外出で出会ったNPC）
 * - クエストの回合抽選（ストーリー枠・連続回避・正規フォールバック）
 * - completeDailyQuest がストーリー回合を正しく評価し、直近ストーリーIDを記録
 * - 既存セーブへ新しい会話状態（recentStoryIds / lastOutingNpcId）が初期値で補完される
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
require(path.join(root, "dialogue-engine.js"));
const { KE_CONVERSATION: CONV } = require(path.join(root, "conversation-game.js"));
const { KE_DB } = require(path.join(root, "db.js"));

const SCENES = globalThis.KE_SCENES;
const NPCS = globalThis.KE_NPCS;
const STORY = globalThis.KE_STORY_LINES;

function dbRevealed() {
  const d = KE_DB.defaultData();
  d.currentPet = { generationId: "gen_001", name: "モモ", speciesId: "rabbit", speciesRevealed: true, stage: "child", recentDialogueIds: [], lastQuestDate: null, cumulativeExp: 0, questDays: 0, petBond: 20 };
  return d;
}

test("外出で未発見のNPCが1名ずつ発見され、全員発見後は null（乱数固定）", () => {
  const d = dbRevealed();
  // 初回の「最初のNPC＝佐藤」は孵化時に発見済みの前提
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  const met1 = CONV.meetNewNpc(d, () => 0);
  assert.ok(met1, "NPCと出会う");
  assert.equal(met1.id, "npc_yamada"); // NPC定義順の先頭（佐藤以外）
  assert.equal(d.conversation.lastOutingNpcId, "npc_yamada");
  const met2 = CONV.meetNewNpc(d, () => 0);
  assert.equal(met2.id, "npc_konno");
  // 残りすべてを発見し切る
  let guard = 0;
  while (guard++ < 20) {
    const m = CONV.meetNewNpc(d, () => 0);
    if (!m) break;
  }
  assert.equal(globalThis.KE_RELATIONSHIP.getDiscoveredNpcIds(d).length, NPCS.length, "全員発見済み");
  assert.equal(CONV.meetNewNpc(d, () => 0), null, "全員発見後は null");
});

test("クエストのシーンは直近の外出で出会ったNPCのシーンが優先される", () => {
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_yamada");
  d.conversation.lastOutingNpcId = "npc_yamada";
  for (let i = 0; i < 20; i++) {
    const sc = CONV.pickQuestScene(d);
    assert.ok(sc, "シーンがある");
    assert.equal(sc.npcId, "npc_yamada");
  }
});

test("クエストの回合はストーリー枠から抽選され、直近使用を避けて正規回合へフォールバックする", () => {
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  const scene = SCENES.find((s) => s.id === "scn_001");
  // ① ストーリー回合が引ける（乱数固定で先頭候補）
  const r1 = CONV.pickQuestRound(d, scene, [], () => 0);
  assert.equal(r1.source, "story");
  assert.equal(r1.id, "story_open_work_001");
  assert.equal(r1.round.npcLine, "お疲れさま。きょうはどう？ 何か進んだことある？");
  // ② 全ストーリー回合を直近使用済みにすると正規回合（rounds[0]）へフォールバック
  const allOpenIds = STORY.filter((e) => e.role === "open").map((e) => e.id);
  const r2 = CONV.pickQuestRound(d, scene, allOpenIds);
  assert.equal(r2.source, "scene");
  assert.equal(r2.round.npcLine, scene.rounds[0].npcLine);
  assert.equal(r2.id, null);
});

test("completeDailyQuest がストーリー回合を評価し、直近ストーリーIDへ記録する", () => {
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  const scene = SCENES.find((s) => s.id === "scn_001");
  const qr = CONV.pickQuestRound(d, scene, [], () => 0);
  const goodIdx = qr.round.answers.findIndex((a) => a.type === "good");
  const r = CONV.completeDailyQuest(d, "scn_001", goodIdx, "2026-09-05", qr.round);
  assert.equal(r.ok, true);
  assert.equal(r.firstToday, true);
  // 評価対象は「表示したストーリー回合」の回答
  assert.equal(r.answer.text, qr.round.answers[goodIdx].text);
  assert.ok(r.advice.text && r.advice.example, "助言（ポイント＋改善例）");
  // 直近ストーリーIDへ記録（連続回避）
  assert.deepEqual(d.conversation.recentStoryIds, [qr.id]);
  // 同一日再プレイはきずな度を更新しない（既存ガード維持）
  const r2 = CONV.completeDailyQuest(d, "scn_001", goodIdx, "2026-09-05", qr.round);
  assert.equal(r2.updates.applied, false);
});

test("既存セーブへ new 会話状態が初期値で補完される（キック・非破壊）", () => {
  const base = KE_DB.defaultData();
  assert.deepEqual(base.conversation.recentStoryIds, []);
  assert.equal(base.conversation.lastOutingNpcId, null);
  // conversation に新フィールドが無い旧データがマイグレーションで補完される
  const old = KE_DB.defaultData();
  old.conversation = { dailyQuestDate: "2026-09-03", dailyQuestCompleted: true, recentDialogueIds: [], unlockedSceneIds: [] };
  const migrated = KE_DB.migrate(old);
  assert.equal(migrated.conversation.dailyQuestDate, "2026-09-03");
  assert.deepEqual(migrated.conversation.recentStoryIds, []);
  assert.equal(migrated.conversation.lastOutingNpcId, null);
});
