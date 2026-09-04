"use strict";
/*
 * NPC別の会話記憶（feat/npc-memory）テスト。
 * - profileId:npcId のキーで分離
 * - 実際の選択（facet/promiseNote/type）からのみ記録（推測しない）
 * - クエスト（本編）は1日1回のみ記録・再プレイでは増えない
 * - 次回の挨拶に記憶を反映（返事待ち/約束/誤解）
 * - 練習モードは読み取り専用（本編の関係・約束・記憶を書き換えない）
 * - ペットの世代交代後も記憶を維持
 * - 既存セーブへ npcMemory が初期値で補完される
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
const { KE_NPC_MEMORY: MEM } = require(path.join(root, "npc-memory.js"));
require(path.join(root, "dialogue-engine.js"));
const { KE_CONVERSATION: CONV } = require(path.join(root, "conversation-game.js"));
const { KE_DB } = require(path.join(root, "db.js"));

const SCENES = globalThis.KE_SCENES;

function dbRevealed() {
  const d = KE_DB.defaultData();
  d.profile = { displayName: "高橋 翔太", age: 23, gender: "male", heightCm: 170, weightKg: 65, profileId: "p_test" };
  d.currentPet = { generationId: "gen_001", name: "モモ", speciesId: "rabbit", speciesRevealed: true, stage: "child", recentDialogueIds: [], lastQuestDate: null, cumulativeExp: 0, questDays: 0, petBond: 20 };
  return d;
}

test("記憶は profileId:npcId のキーで分離される", () => {
  const d1 = dbRevealed();
  const d2 = dbRevealed();
  d2.profile.profileId = "p_other";
  MEM.recordFromQuest(d1, "npc_sato", SCENES[0], { facet: "question" }, "2026-09-05");
  assert.ok(MEM.getMemory(d1, "npc_sato"));
  assert.equal(MEM.getMemory(d2, "npc_sato"), null, "別プロフィールには記憶が無い");
});

test("実際の選択からだけ記録される（話題・約束・期待・誤解）", () => {
  const d = dbRevealed();
  const scene = SCENES.find((s) => s.id === "scn_001");
  // 質問（facet=question）→ 続きを聞きたい
  MEM.recordFromQuest(d, "npc_sato", scene, { facet: "question" }, "2026-09-05");
  // 約束（promiseNote）→ 約束 pending
  MEM.recordFromQuest(d, "npc_sato", scene, { facet: "promise", promiseNote: "夕方のコーヒーの誘いを承諾した" }, "2026-09-06");
  // bad（回避）→ 未解決の誤解
  MEM.recordFromQuest(d, "npc_sato", scene, { type: "bad", facet: "avoid" }, "2026-09-07");
  const m = MEM.getMemory(d, "npc_sato");
  assert.ok(m.topics.some((t) => t.topic === "work"), "シーンタグが話題に記録される");
  assert.equal(m.promises.length, 1);
  assert.equal(m.promises[0].status, "pending");
  assert.ok(m.expectations.some((e) => e.kind === "hear_more"));
  assert.equal(m.misunderstandings.length, 1);
  // 選択しなかった項目は記録しない（facet が question でも約束は立たない）
  assert.equal(m.misunderstandings.length, 1, "neutralな選択で誤解は増えない");
});

test("クエスト完了（本編）で記憶が記録され、同日再プレイでは増えない", () => {
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  const scene = SCENES.find((s) => s.id === "scn_001");
  const promiseRound = scene.rounds[3];
  const r = CONV.completeDailyQuest(d, "scn_001", 0, "2026-09-05", promiseRound);
  assert.equal(r.ok, true);
  assert.equal(r.firstToday, true);
  const m = MEM.getMemory(d, "npc_sato");
  assert.ok(m, "記憶が作られる");
  assert.ok(m.promises.length >= 1, "約束が記録される");
  const promisesAfter = m.promises.length;
  // 同日再プレイ：きずな度の更新も記憶の増加もなし
  const r2 = CONV.completeDailyQuest(d, "scn_001", 0, "2026-09-05", promiseRound);
  assert.equal(r2.firstToday, false);
  assert.equal(MEM.getMemory(d, "npc_sato").promises.length, promisesAfter);
});

test("次回の挨拶に記憶が反映される（返事待ち→約束→誤解の順）", () => {
  const d = dbRevealed();
  const scene = SCENES.find((s) => s.id === "scn_001");
  // 返事待ち
  MEM.recordFromQuest(d, "npc_konno", scene, { facet: "polite_decline" }, "2026-09-05");
  const g1 = MEM.getNextGreeting(d, "npc_konno");
  assert.ok(g1.indexOf("返事") >= 0, "返事待ちが挨拶になる: " + g1);
  // 約束（返事待ちが無いNPC）
  MEM.recordFromQuest(d, "npc_kato", scene, { facet: "promise", promiseNote: "金曜に焼き鳥屋へ行く約束" }, "2026-09-05");
  const g2 = MEM.getNextGreeting(d, "npc_kato");
  assert.ok(g2.indexOf("約束") >= 0);
  // 誤解が最優先
  MEM.recordFromQuest(d, "npc_hanada", scene, { type: "bad", facet: "avoid" }, "2026-09-05");
  assert.ok(MEM.getNextGreeting(d, "npc_hanada").indexOf("ごめん") >= 0);
  // 何も無ければ null
  assert.equal(MEM.getNextGreeting(d, "npc_sato"), null);
});

test("練習モードでは本編の関係・約束・記憶を書き換えない（読み取り専用）", () => {
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_yamada");
  MEM.recordFromQuest(d, "npc_yamada", SCENES.find((s) => s.id === "scn_001"), { facet: "question" }, "2026-09-05");
  const before = JSON.parse(JSON.stringify(d));
  const scene = SCENES.find((s) => s.id === "scn_005");
  const turns = CONV.buildPracticeRounds(scene, { db: d, prevFacet: "self_disclose" });
  turns.forEach((t) => {
    for (let i = 0; i < 3; i++) {
      const ev = CONV.evaluateRoundAnswer(t.round, i);
      assert.equal(ev.ok, true);
    }
  });
  assert.deepEqual(d, before, "練習ではデータが一切変わらない");
  // 読み取りAPIは参照できる
  const sum = MEM.getMemorySummary(d, "npc_yamada");
  assert.ok(sum.topics.length >= 1);
});

test("ペットが次世代になってもNPCの関係・記憶は維持される", () => {
  const d = dbRevealed();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_yamada");
  MEM.recordFromQuest(d, "npc_yamada", SCENES.find((s) => s.id === "scn_001"), { facet: "promise", promiseNote: "引き継ぎの約束" }, "2026-09-05");
  const r = globalThis.KE_PET.startNextGeneration(d, "次世代", "choose");
  assert.equal(r.ok, true);
  const m = MEM.getMemory(d, "npc_yamada");
  assert.ok(m, "次世代後も記憶が残る");
  assert.ok(m.promises.length >= 1);
  assert.ok(globalThis.KE_RELATIONSHIP.getNpcState(d, "npc_yamada"), "NPC関係も残る");
});

test("既存セーブへ npcMemory が初期値で補完され、読み取りAPIは書き込まない", () => {
  assert.deepEqual(KE_DB.defaultData().npcMemory, {});
  const old = KE_DB.defaultData();
  delete old.npcMemory;
  const migrated = KE_DB.migrate(old);
  assert.deepEqual(migrated.npcMemory, {});
  // 読み取り専用の getMemory / getMemorySummary はその後の保存対象を汚さない
  const d = dbRevealed();
  MEM.getMemorySummary(d, "npc_sato");
  MEM.getNextGreeting(d, "npc_sato");
  assert.equal(MEM.getMemory(d, "npc_sato"), null);
  assert.deepEqual(d.npcMemory, {});
});

test("resolvePromises が約束を解決（kept）する", () => {
  const d = dbRevealed();
  const scene = SCENES.find((s) => s.id === "scn_001");
  MEM.recordFromQuest(d, "npc_kato", scene, { facet: "promise", promiseNote: "昼ごはんの約束" }, "2026-09-05");
  MEM.resolvePromises(d, "npc_kato");
  assert.equal(MEM.getMemory(d, "npc_kato").promises[0].status, "kept");
  assert.equal(MEM.getNextGreeting(d, "npc_kato"), null, "解決済み約束は挨拶に出ない");
});
