"use strict";
/*
 * M9 会話クエストのテスト：シーン整合・ロック・1日1回更新。
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
require(path.join(root, "data", "foods.js"));
require(path.join(root, "data", "exercises.js"));
require(path.join(root, "health.js"));
require(path.join(root, "pet-game.js"));
require(path.join(root, "relationship.js"));
require(path.join(root, "dialogue-engine.js"));
const { KE_CONVERSATION: CONV } = require(path.join(root, "conversation-game.js"));
const { KE_DB } = require(path.join(root, "db.js"));

function dbRevealed() {
  const d = KE_DB.defaultData();
  d.currentPet = { generationId: "gen_001", name: "モモ", speciesId: "rabbit", speciesRevealed: true, stage: "child", recentDialogueIds: [], lastQuestDate: null, cumulativeExp: 0, questDays: 0, petBond: 20 };
  return d;
}

/* ---- データ整合 ---- */
test("シーン20件・ID一意・NPC参照が有効・分類内訳（日常8/仕事6/食事6）", () => {
  const scenes = globalThis.KE_SCENES;
  assert.equal(scenes.length, 20);
  const ids = new Set(scenes.map((s) => s.id));
  assert.equal(ids.size, 20);
  const npcIds = new Set(globalThis.KE_NPCS.map((n) => n.id));
  scenes.forEach((s) => {
    assert.ok(npcIds.has(s.npcId), "NPC参照不正: " + s.npcId + " in " + s.id);
    assert.ok(s.rounds.length >= 4, "rounds不足: " + s.id);
    assert.ok(s.rounds[0].answers.length === 3, "3択であること: " + s.id);
    s.rounds.forEach((r) => r.answers.forEach((a) => assert.ok(["good", "short", "bad"].indexOf(a.type) >= 0)));
  });
  const count = (cat) => scenes.filter((s) => s.category === cat).length;
  assert.equal(count("daily"), 8);
  assert.equal(count("work"), 6);
  assert.equal(count("food"), 6);
});

test("獲得したNPCのシーンだけが利用可能になる", () => {
  const d = dbRevealed();
  assert.equal(CONV.getAvailableScenes(d).length, 0); // まだ誰も発現していない
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  const s = CONV.getAvailableScenes(d);
  assert.ok(s.length >= 2);
  assert.ok(s.every((sc) => sc.npcId === "npc_sato"));
});

test("isConversationUnlocked は種類公開後にのみ true", () => {
  const d = KE_DB.defaultData();
  d.currentPet = { speciesRevealed: false };
  assert.equal(CONV.isConversationUnlocked(d), false);
  d.currentPet.speciesRevealed = true;
  assert.equal(CONV.isConversationUnlocked(d), true);
});

/* ---- クエスト実行と1日1回制 ---- */
test("completeDailyQuest が初回のみNPC/ペットきずな度を更新する", () => {
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  const today = "2026-09-05";
  const scene = CONV.getAvailableScenes(d).find((s) => s.rounds[0].answers[0].type === "good");
  const goodIdx = scene.rounds[0].answers.findIndex((a) => a.type === "good");

  const r = CONV.completeDailyQuest(d, scene.id, goodIdx, today);
  assert.equal(r.ok, true);
  assert.equal(r.firstToday, true);
  assert.equal(r.updates.applied, true);
  // NPC +8（初期40→48）・ペット +2（20→22）
  assert.equal(r.updates.npc.delta, 8);
  assert.equal(r.updates.npc.after, 48);
  assert.equal(r.updates.pet.after, 22);
  assert.equal(d.conversation.dailyQuestDate, today);
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcState(d, scene.npcId).conversations, 1);
  assert.ok(r.advice.text.length > 0);
  assert.equal(d.currentPet.recentDialogueIds.length, 1);

  // 同日再プレイ：更新なし
  const r2 = CONV.completeDailyQuest(d, scene.id, goodIdx, today);
  assert.equal(r2.firstToday, false);
  assert.equal(r2.updates.applied, false);
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcState(d, scene.npcId).bond, 48);
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcState(d, scene.npcId).conversations, 1);
  assert.equal(d.currentPet.petBond, 22);

  // 別日は更新できる（NPC・ペットとも）
  const r3 = CONV.completeDailyQuest(d, scene.id, goodIdx, "2026-09-06");
  assert.equal(r3.firstToday, true);
  assert.equal(r3.updates.npc.after, 56);
  assert.equal(r3.updates.pet.after, 24);
});

test("未公開の卵ではクエストを実行できない", () => {
  const d = KE_DB.defaultData();
  d.currentPet = { speciesRevealed: false, generationId: "gen_001" };
  const r = CONV.completeDailyQuest(d, "scn_001", 0, "2026-09-05");
  assert.equal(r.ok, false);
  assert.equal(r.reason, "locked");
});

test("getAnswerMeta が分類ラベルと変化量を返す", () => {
  const d = dbRevealed();
  const meta = CONV.getAnswerMeta(d, { type: "good", explanation: "よい", nextHint: "次" });
  assert.equal(meta.label, "会話が続きやすい");
  assert.equal(meta.delta, 8);
});
