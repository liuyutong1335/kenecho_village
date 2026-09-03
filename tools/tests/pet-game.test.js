"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "pet-game.js"));

test("createEgg が卵の初期状態（種類非公開）を返す", () => {
  const KE_PET = globalThis.KE_PET;
  const egg = KE_PET.createEgg("gen_001", "モモ", "choose");
  assert.equal(egg.generationId, "gen_001");
  assert.equal(egg.name, "モモ");
  assert.equal(egg.stage, "egg");
  assert.equal(egg.speciesId, null);
  assert.equal(egg.speciesRevealed, false);
  assert.equal(egg.selectionMode, "choose");
  assert.equal(egg.hatchedAt, null);
  assert.equal(egg.cumulativeExp, 0);
  assert.equal(egg.recordedDays, 0);
  assert.equal(egg.petBond, 20);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(egg.birthDate));
});

test("createEgg が不正な決定方式を choose へ補正する", () => {
  const KE_PET = globalThis.KE_PET;
  assert.equal(KE_PET.createEgg("g", "a", "invalid").selectionMode, "choose");
  assert.equal(KE_PET.createEgg("g", "a", "random").selectionMode, "random");
});
