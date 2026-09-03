"use strict";
/*
 * M12 思い出・旅立ち・次世代のテスト。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "pets.js"));
require(path.join(root, "data", "npc-data.js"));
const { KE_PET: PET } = require(path.join(root, "pet-game.js"));
const { KE_DB } = require(path.join(root, "db.js"));

function dbRevealed() {
  const d = KE_DB.defaultData();
  d.currentPet = Object.assign(PET.createEgg("gen_001", "モモ", "choose"), {
    speciesId: "rabbit", speciesRevealed: true, stage: "adult", hatchedAt: "2026-08-01",
    cumulativeExp: 800, recordedDays: 20, questDays: 5, petBond: 70
  });
  d.healthRecords = { sleep: {}, weight: {} };
  d.relationships = { pet: { gen_001: { bond: 70, questsCompleted: 5 } }, npcs: { npc_sato: { bond: 60 }, npc_kato: { bond: 80 } } };
  return d;
}

test("completeDeparture が思い出を保存し、二重登録を拒否する", () => {
  const d = dbRevealed();
  const r = PET.completeDeparture(d);
  assert.equal(r.ok, true);
  const m = r.memory;
  assert.equal(m.generationId, "gen_001");
  assert.equal(m.speciesId, "rabbit");
  assert.equal(m.finalStage, "adult");
  assert.equal(m.healthRecordDays, 20);
  assert.equal(m.questDays, 5);
  assert.equal(m.finalBond, 70);
  assert.equal(m.mainNpcId, "npc_kato"); // きずな度最大
  assert.ok(m.daysTogether >= 0);
  assert.equal(d.petMemories.length, 1);

  const again = PET.completeDeparture(d);
  assert.equal(again.ok, false);
  assert.equal(again.reason, "already_departed");
});

test("卵は旅立てない", () => {
  const d = KE_DB.defaultData();
  d.currentPet = PET.createEgg("gen_001", "モモ", "choose");
  const r = PET.completeDeparture(d);
  assert.equal(r.ok, false);
});

test("startNextGeneration が新世代の卵を開始し、直前と同種を除外する", () => {
  const d = dbRevealed();
  PET.completeDeparture(d);
  const r = PET.startNextGeneration(d, "ポポ", "random");
  assert.equal(r.ok, true);
  assert.equal(r.pet.generationId, "gen_002");
  assert.equal(r.pet.name, "ポポ");
  assert.equal(r.pet.stage, "egg");
  assert.equal(r.pet.speciesId, null);
  assert.equal(r.pet.speciesRevealed, false);
  assert.equal(d.relationships.pet.gen_002.bond, 20);
  assert.equal(d.currentPet.generationId, "gen_002");
  // 直前世代（rabbit）は孵化候補から除外
  const candidates = PET.getHatchCandidates(d);
  assert.ok(!candidates.some(function (p) { return p.id === "rabbit"; }));
  assert.equal(candidates.length, 5);
});

test("第2世代を孵化させ、思い出を2つにできる", () => {
  const d = dbRevealed();
  PET.completeDeparture(d);
  PET.startNextGeneration(d, "ポポ", "choose");
  PET.applyHatch(d, "fox");
  // 日数・EXPで成長は問わず、旅立ち自体は可能（卵では不可）
  d.currentPet.stage = "companion";
  assert.equal(PET.completeDeparture(d).ok, true);
  assert.equal(d.petMemories.length, 2);
});
