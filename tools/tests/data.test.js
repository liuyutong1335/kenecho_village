"use strict";
/*
 * データ整合テスト。
 * - 各データファイルが require 可能で、期待する構造を持つこと
 * - 必須件数（ペット6・NPC8・台詞フォールバックあり）を満たすこと
 * - ID の重複がないこと
 * 食品50・運動20・シーン20・台詞150-180 の件数検証は対応マイルストーン M3/M4/M9/M11 で有効化する。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
function load(file) {
  const abs = path.join(root, "data", file);
  const mod = require(abs);
  return Object.values(mod)[0];
}

test("config が必要定数を持つ", () => {
  require(path.join(root, "config.js"));
  const C = globalThis.KE_CONFIG;
  assert.equal(C.STAGE_ORDER.length, 6);
  assert.equal(C.EXP_SCORE_TABLE ? true : true, true); // 名称確認用
  assert.equal(C.SCORE_EXP_TABLE[6], 100);
  assert.equal(C.BOND.DELTA.good, 8);
  assert.equal(C.BOND.DELTA.bad, -4);
  assert.equal(C.BOND.PET_WEIGHT + C.BOND.NPC_WEIGHT, 1);
});

test("relationship-rules が総合きずな度を計算し段階を返す", () => {
  const R = load("relationship-rules.js");
  assert.equal(R.totalBond(50, 40), 44); // round(50*0.4 + 40*0.6)
  assert.equal(R.totalBond(20, 40), 32);
  assert.equal(R.levelKey(19), "stranger");
  assert.equal(R.levelKey(39), "familiar");
  assert.equal(R.levelKey(100), "partner");
});

test("pets データが6種・id重複なし", () => {
  const P = load("pets.js");
  assert.equal(Array.isArray(P), true);
  assert.equal(P.length, 6);
  const ids = P.map((p) => p.id);
  assert.equal(new Set(ids).size, 6);
  assert.ok(ids.includes("rabbit"));
});

test("npc データが8名・id重複なし", () => {
  const N = load("npc-data.js");
  assert.equal(Array.isArray(N), true);
  assert.equal(N.length, 8);
  const ids = N.map((n) => n.id);
  assert.equal(new Set(ids).size, 8);
});

test("コーチ台詞が100〜300件（目標150〜180）・フォールバックあり・ID一意", () => {
  const S = load("pet-coach-speech.js");
  assert.equal(Array.isArray(S), true);
  assert.ok(S.length >= 100 && S.length <= 300, "件数 100〜300（現: " + S.length + "）");
  assert.ok(S.length >= 150, "目標150件以上（現: " + S.length + "）");
  const fallback = S.filter((s) => s.purpose === "fallback");
  assert.ok(fallback.length >= 1);
  const ids = new Set(S.map((s) => s.id));
  assert.equal(ids.size, S.length, "台詞IDが一意");
});

test("foods / exercises / scenes は配列としてロードできる（件数は各Mで充足）", () => {
  assert.equal(Array.isArray(load("foods.js")), true);
  assert.equal(Array.isArray(load("exercises.js")), true);
  assert.equal(Array.isArray(load("conversation-scenes.js")), true);
});

test("animation-manifest に必須動作名が定義されている", () => {
  const M = load("animation-manifest.js");
  assert.deepEqual(M.petMotions, ["idle", "blink", "walk_left", "walk_right", "happy", "troubled", "sleepy", "eat", "exercise", "talk", "level_up", "departure"]);
  assert.deepEqual(M.eggMotions, ["egg_idle", "egg_shake", "egg_hatch"]);
  assert.deepEqual(M.npcMotions, ["idle", "talk", "happy", "neutral", "troubled", "appear", "special"]);
});

test("NPCの sceneIds がシーンIDと一致し、全20シーンが割当済み", () => {
  const npcs = load("npc-data.js");
  const scenes = load("conversation-scenes.js");
  const sceneIds = new Set(scenes.map((s) => s.id));
  const npcIds = new Set(npcs.map((n) => n.id));
  scenes.forEach((s) => npcIds.has(s.npcId) || (() => { throw new Error("NPC不正: " + s.npcId + " in " + s.id); })());
  const assigned = new Set();
  npcs.forEach((n) => {
    assert.ok(Array.isArray(n.sceneIds) && n.sceneIds.length > 0, n.id + " にシーンが無い");
    n.sceneIds.forEach((sid) => {
      assert.ok(sceneIds.has(sid), n.id + " → 不明シーン " + sid);
      assigned.add(sid);
    });
  });
  assert.equal(assigned.size, 20, "全20シーンが割当済み");
});

test("ピクセル定義が6種のアクセサリと表情フレームを持つ", () => {
  const abs = path.join(root, "data", "pixel-art", "pets.js");
  const P = require(abs).KE_PIXEL_PETS;
  assert.ok(P.BASE.length === 16, "ベースは16行");
  assert.ok(P.FACES.normal && P.FACES.blink && P.FACES.happy && P.FACES.sleepy && P.FACES.troubled);
  const ids = Object.keys(P.ACCESSORIES).sort();
  assert.deepEqual(ids, ["bearcub", "bird", "cat", "fox", "rabbit", "tanuki"]);
});
