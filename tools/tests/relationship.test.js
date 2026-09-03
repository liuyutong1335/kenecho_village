"use strict";
/*
 * M8 きずな度のテスト。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "relationship-rules.js"));
require(path.join(root, "data", "npc-data.js"));
const { KE_RELATIONSHIP: REL } = require(path.join(root, "relationship.js"));
const { KE_DB } = require(path.join(root, "db.js"));

function dbWithPet() {
  const d = KE_DB.defaultData();
  d.currentPet = {
    generationId: "gen_001", name: "モモ", petBond: 20, lastQuestDate: null, questDays: 0
  };
  return d;
}

test("NPC未発見は false、ensureNpc で初期値40が登録される", () => {
  const d = dbWithPet();
  assert.equal(REL.isNpcDiscovered(d, "npc_sato"), false);
  REL.ensureNpc(d, "npc_sato");
  assert.equal(REL.isNpcDiscovered(d, "npc_sato"), true);
  assert.equal(REL.getNpcBond(d, "npc_sato"), 40);
  // 二度目も初期化しない
  REL.ensureNpc(d, "npc_sato");
  assert.equal(REL.getNpcBond(d, "npc_sato"), 40);
});

test("applyNpcBondChange が +8/+3/−4 を0〜100に補正する", () => {
  const d = dbWithPet();
  REL.ensureNpc(d, "npc_sato");
  assert.equal(REL.applyNpcBondChange(d, "npc_sato", 8).after, 48);
  assert.equal(REL.applyNpcBondChange(d, "npc_sato", 3).after, 51);
  assert.equal(REL.applyNpcBondChange(d, "npc_sato", -4).after, 47);
  // 上限・下限へクランプ
  for (let i = 0; i < 10; i++) REL.applyNpcBondChange(d, "npc_sato", 100);
  assert.equal(REL.getNpcBond(d, "npc_sato"), 100);
  REL.applyNpcBondChange(d, "npc_sato", -999);
  assert.equal(REL.getNpcBond(d, "npc_sato"), 0);
});

test("applyPetBondQuestClear が1日1回・世代ごとに+2する", () => {
  const d = dbWithPet();
  let r = REL.applyPetBondQuestClear(d, "2026-09-05");
  assert.equal(r.ok, true);
  assert.equal(r.after, 22);
  assert.equal(d.currentPet.petBond, 22);
  assert.equal(d.currentPet.lastQuestDate, "2026-09-05");
  assert.equal(REL.getPetBondState(d, "gen_001").questsCompleted, 1);
  // 同日は再更新しない
  const again = REL.applyPetBondQuestClear(d, "2026-09-05");
  assert.equal(again.ok, false);
  assert.equal(again.reason, "already");
  assert.equal(REL.getPetBondState(d, "gen_001").bond, 22);
  // 別日は更新できる
  r = REL.applyPetBondQuestClear(d, "2026-09-06");
  assert.equal(r.after, 24);
});

test("総合きずな度 = round(ペット×0.4 ＋ NPC×0.6)", () => {
  const d = dbWithPet();
  REL.ensureNpc(d, "npc_sato"); // npc 40
  assert.equal(REL.getTotalBond(d, "npc_sato"), Math.round(20 * 0.4 + 40 * 0.6)); // 32
  REL.applyNpcBondChange(d, "npc_sato", 8); // 48
  assert.equal(REL.getTotalBond(d, "npc_sato"), Math.round(20 * 0.4 + 48 * 0.6)); // 36.8 → 37
  assert.equal(REL.getTotalBondByValues(50, 40), Math.round(50 * 0.4 + 40 * 0.6)); // 44
  // 未発見NPCは null
  assert.equal(REL.getTotalBond(d, "npc_hanada"), null);
});

test("recordHistory と getDiscoveredNpcIds", () => {
  const d = dbWithPet();
  REL.recordHistory(d, { key: "npc_sato", delta: 8, why: "quest" });
  REL.recordHistory(d, { key: "npc_kato", delta: -4, why: "quest" });
  assert.equal(d.relationshipHistory.length, 2);
  assert.ok(d.relationshipHistory[0].at);
  assert.deepEqual(REL.getDiscoveredNpcIds(d), []);
  REL.ensureNpc(d, "npc_kato");
  assert.deepEqual(REL.getDiscoveredNpcIds(d), ["npc_kato"]);
});

test("NPCデータは8名・全国でなければならない", () => {
  const npcs = globalThis.KE_NPCS;
  assert.equal(npcs.length, 8);
  const ids = new Set(npcs.map((n) => n.id));
  assert.equal(ids.size, 8);
  npcs.forEach((n) => assert.ok(n.intro && n.metPlace && n.nextHint, n.id));
});
