"use strict";
/*
 * M7 孵化・種類決定・図鑑登録の原子性テスト。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "pets.js"));
const { KE_PET: PET } = require(path.join(root, "pet-game.js"));
const { KE_DB } = require(path.join(root, "db.js"));

function dbWithEgg() {
  const d = KE_DB.defaultData();
  d.currentPet = PET.createEgg("gen_002", "モモ", "choose");
  return d;
}

test("孵化候補は直近世代（思い出末尾）と同じ種類を除外する", () => {
  const d = dbWithEgg();
  assert.equal(PET.getHatchCandidates(d).length, 6);
  d.petMemories = [{ speciesId: "rabbit", name: "おととし" }];
  const candidates = PET.getHatchCandidates(d);
  assert.equal(candidates.length, 5);
  assert.ok(!candidates.some((p) => p.id === "rabbit"));
});

test("applyHatch が種類公開と図鑑登録を同時に行う（原子性）", () => {
  const d = dbWithEgg();
  const r = PET.applyHatch(d, "fox");
  assert.equal(r.ok, true);
  const pet = d.currentPet;
  assert.equal(pet.speciesId, "fox");
  assert.equal(pet.speciesRevealed, true);
  assert.equal(pet.stage, "child");
  assert.ok(pet.hatchedAt);
  assert.equal(d.petEncyclopedia.fox.discovered, true);
  assert.equal(d.petEncyclopedia.fox.discoveredAt, pet.hatchedAt);
  // 二重公開は不可
  const again = PET.applyHatch(d, "cat");
  assert.equal(again.ok, false);
  assert.equal(again.reason, "already");
});

test("applyHatch は候補外（直前世代と同種）を拒否する", () => {
  const d = dbWithEgg();
  d.petMemories = [{ speciesId: "cat", name: "前の子" }];
  const r = PET.applyHatch(d, "cat");
  assert.equal(r.ok, false);
  assert.equal(r.reason, "invalid");
  assert.equal(d.currentPet.speciesRevealed, false); // 中断時は卵のまま
  // 未確定のままなら卵状態を維持
  assert.equal(d.currentPet.stage, "egg");
  assert.equal(d.currentPet.speciesId, null);
});

test("同じ種類の再取得では初回発見日を維持する", () => {
  const d = dbWithEgg();
  d.petEncyclopedia = { rabbit: { discovered: true, discoveredAt: "2026-01-01" } };
  const r = PET.applyHatch(d, "rabbit");
  assert.equal(r.ok, true);
  assert.equal(r.firstDiscover, false);
  assert.equal(d.petEncyclopedia.rabbit.discoveredAt, "2026-01-01");
});

test("revealRandomSpecies が候補内から選ぶ", () => {
  const d = dbWithEgg();
  const ids = PET.getHatchCandidates(d).map((p) => p.id);
  const r = PET.revealRandomSpecies(d);
  assert.equal(r.ok, true);
  assert.ok(ids.includes(r.speciesId));
  assert.equal(d.currentPet.speciesRevealed, true);
});

test("初回発見時は firstDiscover true", () => {
  const d = dbWithEgg();
  const r = PET.applyHatch(d, "tanuki");
  assert.equal(r.firstDiscover, true);
});
