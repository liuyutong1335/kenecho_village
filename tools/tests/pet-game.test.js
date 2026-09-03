"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "pets.js"));
const { KE_PET: PET } = require(path.join(root, "pet-game.js"));
const { KE_DB } = require(path.join(root, "db.js"));

// 健康状態のテストには health.js が必要
require(path.join(root, "data", "foods.js"));
require(path.join(root, "data", "exercises.js"));
const { KE_HEALTH: HEALTH } = require(path.join(root, "health.js"));

function pet(hatched, exp, opts) {
  return Object.assign({
    generationId: "gen_001",
    name: "モモ",
    stage: "egg",
    speciesId: null,
    speciesRevealed: false,
    hatchedAt: hatched || null,
    cumulativeExp: exp || 0,
    recordedDays: 0,
    petBond: 20
  }, opts || {});
}

/* ---- 卵生成 ---- */
test("createEgg が卵の初期状態（種類非公開）を返す", () => {
  const egg = PET.createEgg("gen_001", "モモ", "choose");
  assert.equal(egg.stage, "egg");
  assert.equal(egg.speciesId, null);
  assert.equal(egg.speciesRevealed, false);
  assert.equal(egg.selectionMode, "choose");
  assert.equal(egg.petBond, 20);
  const egg2 = PET.createEgg("g", "a", "invalid");
  assert.equal(egg2.selectionMode, "choose");
  const egg3 = PET.createEgg("g", "a", "random");
  assert.equal(egg3.selectionMode, "random");
});

/* ---- 成長段階 ---- */
test("computeStage が累計EXPと最低日数で段階を進める", () => {
  const ref = "2026-09-30";
  // 未孵化は卵
  assert.equal(PET.computeStage(pet(null, 0), ref), "egg");
  // 孵化当日・EXP少は幼体
  assert.equal(PET.computeStage(pet("2026-09-01", 0), ref), "child");
  assert.equal(PET.computeStage(pet("2026-09-01", 100), ref), "child");
  // 成長期：EXP150 かつ 3日目
  assert.equal(PET.computeStage(pet("2026-09-01", 149), ref), "child"); // EXP不足
  assert.equal(PET.computeStage(pet("2026-09-29", 150), ref), "child"); // 日数不足（1日）
  assert.equal(PET.computeStage(pet("2026-09-01", 150), ref), "growing");
  // 成体：EXP450 かつ 7日
  assert.equal(PET.computeStage(pet("2026-09-01", 500), ref), "adult");
  assert.equal(PET.computeStage(pet("2026-09-25", 500), ref), "growing"); // 5日→成体に届かず成長期
  // 陪伴期：EXP800 かつ 14日
  assert.equal(PET.computeStage(pet("2026-09-01", 850), ref), "companion");
  // 最大でも companion（departure は checkDepartureReady）
  assert.equal(PET.computeStage(pet("2026-09-01", 5000), ref), "companion");
});

test("getPetStage と refreshStage", () => {
  const d = KE_DB.defaultData();
  d.currentPet = pet("2026-09-01", 500);
  const r = PET.refreshStage(d, "2026-09-30");
  assert.equal(r.changed, true);
  assert.equal(r.to, "adult");
  assert.equal(d.currentPet.stage, "adult");
  assert.equal(PET.getStageLabel("adult"), "成体");
  // 変わらない場合
  const r2 = PET.refreshStage(d, "2026-09-30");
  assert.equal(r2.changed, false);
});

test("checkDepartureReady が旅立ち条件（companion/EXP1200/21日/きずな度60）を判定する", () => {
  const ref = "2026-09-30";
  const p = pet("2026-09-01", 1300, { petBond: 60 });
  assert.equal(PET.getPetStage(p, ref), "companion");
  // きずな度不足
  const p2 = pet("2026-09-01", 1300, { petBond: 59 });
  assert.equal(PET.checkDepartureReady(p2, ref, p2.petBond), false);
  // 日数不足
  const p3 = pet("2026-09-20", 1300, { petBond: 80 });
  assert.equal(PET.checkDepartureReady(p3, ref, p3.petBond), false);
  // 条件充足
  assert.equal(PET.checkDepartureReady(p, ref, p.petBond), true);
  // EXP不足
  const p4 = pet("2026-09-01", 1100, { petBond: 80 });
  assert.equal(PET.checkDepartureReady(p4, ref, p4.petBond), false);
  // 未孵化は不可
  assert.equal(PET.checkDepartureReady(pet(null, 5000, { petBond: 100 }), ref, 100), false);
});

/* ---- 健康状態 ---- */
function dbWithGoals() {
  const d = KE_DB.defaultData();
  d.healthGoals = { calorieLimitKcal: 1000, proteinGoalG: 50, exerciseMinutes: 30, sleepHours: 7 };
  return d;
}

test("getCondition が睡眠不足（目標の半分未満）を優先する", () => {
  const d = dbWithGoals();
  HEALTH.saveSleep(d, "2026-09-30", "23:00", "01:00"); // 2h < 3.5
  assert.equal(PET.getCondition(d, "2026-09-30"), "sleepy");
  const d2 = dbWithGoals();
  HEALTH.saveSleep(d2, "2026-09-30", "23:00", "04:00"); // 5h（3.5以上）→ sleepy ではない
  assert.equal(PET.getCondition(d2, "2026-09-30"), "normal"); // 2点項目なしなので normal
});

test("getCondition が perfect / happy / lonely / normal を返す", () => {
  const d = dbWithGoals();
  // 未記録 → lonely
  assert.equal(PET.getCondition(d, "2026-09-30"), "lonely");
  // 満点 → perfect
  const d3 = dbWithGoals();
  HEALTH.addMeal(d3, "2026-09-30", { id: "m", kcal: 800, protein: 60, mealType: "lunch", fat: 0, carbs: 0, baseQty: 100, actualQty: 100 });
  HEALTH.addExercise(d3, "2026-09-30", { id: "e", minutes: 35, calories: 100 });
  HEALTH.saveSleep(d3, "2026-09-30", "23:00", "07:00"); // 8h
  assert.equal(PET.getCondition(d3, "2026-09-30"), "perfect");
  // 部分良い → happy
  const d4 = dbWithGoals();
  HEALTH.saveSleep(d4, "2026-09-30", "23:00", "08:00"); // 9h → 2点
  assert.equal(PET.getCondition(d4, "2026-09-30"), "happy");
  // 記録ありだが2点なし → normal
  const d5 = dbWithGoals();
  HEALTH.addMeal(d5, "2026-09-30", { id: "m", kcal: 1500, protein: 40, mealType: "lunch", fat: 0, carbs: 0, baseQty: 100, actualQty: 100 });
  assert.equal(PET.getCondition(d5, "2026-09-30"), "normal");
});

/* ---- 種類決定候補 ---- */
test("getSelectableSpecies が直近世代と同じ種類を除外する", () => {
  const all = PET.getSelectableSpecies(null);
  assert.equal(all.length, 6);
  const without = PET.getSelectableSpecies("rabbit");
  assert.equal(without.length, 5);
  assert.ok(!without.some((p) => p.id === "rabbit"));
});

test("getSpeciesById / getConditionMeta", () => {
  assert.equal(PET.getSpeciesById("rabbit").coachTypeLabel, "優しい型");
  assert.equal(PET.getConditionMeta("perfect").label, "絶好調");
  assert.equal(PET.getConditionMeta("sleepy").label, "眠そう");
});
