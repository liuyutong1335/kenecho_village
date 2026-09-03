"use strict";
/*
 * M5 日次健康評価とEXP付与のテスト。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "foods.js"));
require(path.join(root, "data", "exercises.js"));
const { KE_HEALTH: H } = require(path.join(root, "health.js"));
const { KE_DB } = require(path.join(root, "db.js"));

function dbWithPet() {
  const d = KE_DB.defaultData();
  d.currentPet = { cumulativeExp: 0, recordedDays: 0, name: "モモ" };
  d.healthGoals = { calorieLimitKcal: 1000, proteinGoalG: 50, exerciseMinutes: 30, sleepHours: 7 };
  return d;
}

function addMeal(db, date, kcal, protein) {
  H.addMeal(db, date, { id: "m" + date, name: "x", mealType: "lunch", kcal, protein, fat: 0, carbs: 0, baseQty: 100, actualQty: 100, unitName: "g" });
}

test("getDailyScores が未記録・部分・満点を判定する", () => {
  const d = dbWithPet();
  let s = H.getDailyScores(d, "2026-09-02");
  assert.deepEqual([s.meal, s.exercise, s.sleep, s.total], [0, 0, 0, 0]);
  assert.equal(s.hasAny, false);

  addMeal(d, "2026-09-02", 800, 60);
  s = H.getDailyScores(d, "2026-09-02");
  assert.equal(s.meal, 2); // 上限内かつ蛋白質達成
  assert.equal(s.total, 2);
  assert.equal(s.hasAny, true);

  addMeal(d, "2026-09-03", 1500, 40);
  s = H.getDailyScores(d, "2026-09-03");
  assert.equal(s.meal, 1); // 上限超過または蛋白質不足

  H.addExercise(d, "2026-09-04", { id: "e", minutes: 15, calories: 50 });
  s = H.getDailyScores(d, "2026-09-04");
  assert.equal(s.exercise, 1);

  H.saveSleep(d, "2026-09-05", "23:00", "06:00"); // 7.0h
  s = H.getDailyScores(d, "2026-09-05");
  assert.equal(s.sleep, 2);

  H.saveSleep(d, "2026-09-06", "23:00", "05:00"); // 6.0h
  s = H.getDailyScores(d, "2026-09-06");
  assert.equal(s.sleep, 1);
});

test("EXP表（未記録・各スコア合計）が仕様どおり", () => {
  const samples = [
    [{ meal: 0, exercise: 0, sleep: 0, total: 0, hasAny: false }, 0], // 未記録
    [{ meal: 0, exercise: 0, sleep: 0, total: 0, hasAny: true }, 15],
    [{ meal: 1, exercise: 0, sleep: 0, total: 1, hasAny: true }, 25],
    [{ meal: 2, exercise: 0, sleep: 0, total: 2, hasAny: true }, 40],
    [{ meal: 2, exercise: 1, sleep: 0, total: 3, hasAny: true }, 55],
    [{ meal: 2, exercise: 2, sleep: 0, total: 4, hasAny: true }, 70],
    [{ meal: 2, exercise: 2, sleep: 1, total: 5, hasAny: true }, 85],
    [{ meal: 2, exercise: 2, sleep: 2, total: 6, hasAny: true }, 100]
  ];
  samples.forEach(function ([s, exp]) {
    assert.equal(H.getExpForScores(s), exp, "score=" + s.total + " hasAny=" + s.hasAny);
  });
});

test("evaluateDay が1回だけEXPを付与し、二重付与・過去変更で再計算しない", () => {
  const d = dbWithPet();
  addMeal(d, "2026-09-02", 800, 60);
  H.addExercise(d, "2026-09-02", { id: "e", minutes: 40, calories: 100 });
  H.saveSleep(d, "2026-09-02", "23:00", "07:00"); // 8h → 2

  const r = H.evaluateDay(d, "2026-09-02");
  assert.equal(r.ok, true);
  assert.equal(r.exp, 100); // 2+2+2=6
  assert.equal(d.currentPet.cumulativeExp, 100);
  assert.equal(d.currentPet.recordedDays, 1);
  assert.equal(d.dailyEvaluations["2026-09-02"].granted, true);

  const second = H.evaluateDay(d, "2026-09-02");
  assert.equal(second.ok, false);
  assert.equal(second.reason, "already_granted");
  assert.equal(d.currentPet.cumulativeExp, 100); // 変化なし

  // 過去日付の記録を変更しても、確定済みの評価は再計算されない
  addMeal(d, "2026-09-02", 9000, 900); // 上限超え
  const st = H.getEvaluationState(d, "2026-09-02");
  assert.equal(st.granted, true);
  assert.equal(st.stored.total, 6);
  assert.equal(d.currentPet.cumulativeExp, 100);
  assert.equal(H.evaluateDay(d, "2026-09-02").reason, "already_granted");
});

test("evaluateDay が未来日付・ペット不在を拒否する", () => {
  const d = dbWithPet();
  assert.equal(H.evaluateDay(d, "9999-01-01").reason, "future_date");
  const d2 = KE_DB.defaultData(); // currentPet なし
  assert.equal(H.evaluateDay(d2, "2026-09-02").reason, "no_pet");
});

test("getEvaluationState が確定済みとプレビューを返す", () => {
  const d = dbWithPet();
  let st = H.getEvaluationState(d, "2026-09-02");
  assert.equal(st.granted, false);
  assert.equal(st.preview.exp, 0); // 未記録
  addMeal(d, "2026-09-02", 800, 60);
  st = H.getEvaluationState(d, "2026-09-02");
  assert.equal(st.preview.total, 2);
  assert.equal(st.preview.exp, 40);
  H.evaluateDay(d, "2026-09-02");
  st = H.getEvaluationState(d, "2026-09-02");
  assert.equal(st.granted, true);
  assert.equal(st.stored.exp, 40);
});
