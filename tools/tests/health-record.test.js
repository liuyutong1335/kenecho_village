"use strict";
/*
 * M4 運動・睡眠・体重・目標・BMI/BMR のテスト。
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

function db() { return KE_DB.defaultData(); }

/* ---------------- 運動 ---------------- */
test("プリセット運動が20件・ID重複なし", () => {
  const list = globalThis.KE_EXERCISES;
  assert.equal(Array.isArray(list), true);
  assert.ok(list.length >= 20, "20件以上（現: " + list.length + "）");
  const ids = new Set(list.map((e) => e.id));
  assert.equal(ids.size, list.length);
  list.forEach((e) => assert.ok(e.mets > 0));
});

test("calcExerciseCalories が METs 法で計算する", () => {
  // METs3.5 × 3.5 × 65kg ÷ 200 × 30分 = 119.4? → 3.5*3.5*65/200*30 = 119.4? calc: 3.5*3.5=12.25; 12.25*65=796.25; /200=3.981; *30=119.43 → round1 119.4
  assert.equal(H.calcExerciseCalories(3.5, 30, 65), 119.4);
  assert.equal(H.calcExerciseCalories(6.0, 20, 50), 105.0); // 6*3.5*50/200*20 = 6*3.5=21;*50=1050;/200=5.25;*20=105
  assert.equal(H.calcExerciseCalories(3.5, 0, 65), 0);
});

test("validateExerciseInput が異常を拒否する", () => {
  const d = db();
  const ok = H.validateExerciseInput(d, { exerciseId: "ex_walk01", minutes: 30, calcMode: "mets", date: "2026-09-02" });
  assert.equal(ok.ok, true);
  assert.ok(H.validateExerciseInput(d, { exerciseId: "x", minutes: 30, calcMode: "mets", date: "2026-09-02" }).errors.exerciseId);
  assert.ok(H.validateExerciseInput(d, { exerciseId: "ex_walk01", minutes: 0, calcMode: "mets", date: "2026-09-02" }).errors.minutes);
  assert.ok(H.validateExerciseInput(d, { exerciseId: "ex_walk01", minutes: 30, calcMode: "manual", calories: -1, date: "2026-09-02" }).errors.calories);
});

test("運動の追加・合計・削除", () => {
  const d = db();
  H.addExercise(d, "2026-09-02", { id: "e1", name: "a", minutes: 20, calories: 80, calcMode: "mets" });
  H.addExercise(d, "2026-09-02", { id: "e2", name: "b", minutes: 10, calories: 40, calcMode: "manual" });
  const t = H.getExerciseTotals(d, "2026-09-02");
  assert.equal(t.minutes, 30);
  assert.equal(t.calories, 120);
  assert.equal(H.removeExercise(d, "2026-09-02", "e1"), true);
  assert.equal(H.getExercises(d, "2026-09-02").length, 1);
});

test("カスタム運動の追加・利用・削除", () => {
  const d = db();
  const r = H.addCustomExercise(d, { name: "草むしり", mets: 2.5, note: "" });
  assert.equal(r.ok, true);
  const hit = H.searchExercises(d, "草むしり", 5);
  assert.equal(hit.length, 1);
  const rec = H.buildExerciseRecord(d, { exerciseId: r.exercise.id, minutes: 30, calcMode: "mets" }, 65);
  assert.equal(rec.name, "草むしり");
  assert.ok(rec.calories > 0);
  assert.equal(H.removeCustomExercise(d, r.exercise.id), true);
});

/* ---------------- 睡眠 ---------------- */
test("calcSleepHours が日跨ぎを正しく計算する", () => {
  assert.equal(H.calcSleepHours("23:00", "06:30"), 7.5);
  assert.equal(H.calcSleepHours("01:00", "07:00"), 6);
  assert.equal(H.calcSleepHours("22:30", "00:15"), 1.8); // +105分 = 1.75 → round1 1.8
  assert.equal(H.calcSleepHours("23:00", "23:00"), null); // 同時刻は計算しない(フォールバック0時間ではなく保存不可)
});

test("validateSleepInput が同時刻を拒否する", () => {
  const r = H.validateSleepInput({ sleepAt: "23:00", wakeAt: "23:00", date: "2026-09-02" });
  assert.equal(r.ok, false);
  assert.ok(r.errors.wakeAt);
  assert.equal(H.validateSleepInput({ sleepAt: "23:00", wakeAt: "06:30", date: "2026-09-02" }).ok, true);
});

test("saveSleep が記録と削除を扱う", () => {
  const d = db();
  const rec = H.saveSleep(d, "2026-09-02", "23:00", "06:30");
  assert.equal(rec.hours, 7.5);
  assert.equal(H.getSleepOnDate(d, "2026-09-02").sleepAt, "23:00");
  assert.equal(H.removeSleep(d, "2026-09-02"), true);
  assert.equal(H.getSleepOnDate(d, "2026-09-02"), null);
});

/* ---------------- 体重・BMI・基礎代謝 ---------------- */
test("体重の保存（上書き判定）・履歴・直近取得", () => {
  const d = db();
  let r = H.saveWeight(d, "2026-09-01", 66);
  assert.equal(r.overwritten, false);
  r = H.saveWeight(d, "2026-09-02", 65.5);
  r = H.saveWeight(d, "2026-09-02", 65.2); // 上書き
  assert.equal(r.overwritten, true);
  const entries = H.getWeightEntries(d);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].date, "2026-09-02");
  assert.equal(entries[0].kg, 65.2);
  const recent = H.getRecentWeights(d, 30);
  assert.equal(recent[0].date, "2026-09-01");
  assert.equal(H.getLatestWeight(d).kg, 65.2);
  assert.equal(H.removeWeight(d, "2026-09-01"), true);
});

test("getWeightForCalculation が体重記録を優先し、なければプロフィール値", () => {
  const d = db();
  assert.equal(H.getWeightForCalculation(d, { weightKg: 70 }), 70);
  H.saveWeight(d, "2026-09-02", 65);
  assert.equal(H.getWeightForCalculation(d, { weightKg: 70 }), 65);
});

test("calcBMI / calcBMR（Mifflin–St Jeor）", () => {
  assert.equal(H.calcBMI(65, 170), 22.5); // 65 / 1.7^2 = 22.49 → 22.5
  // male: 10*65 + 6.25*170 - 5*23 + 5 = 1602.5 → round 1603
  assert.equal(H.calcBMR(65, 170, 23, "male"), 1603);
  // female: 同式 - 161 = 1436.5 → round 1437
  assert.equal(H.calcBMR(65, 170, 23, "female"), 1437);
});

test("validateWeightInput が未来日付や範囲外を拒否する", () => {
  assert.equal(H.validateWeightInput({ kg: "65", date: "2026-09-02" }).ok, true);
  assert.ok(H.validateWeightInput({ kg: "10", date: "2026-09-02" }).errors.kg);
  assert.ok(H.validateWeightInput({ kg: "65", date: "9999-01-01" }).errors.date);
});

/* ---------------- 目標 ---------------- */
test("getHealthGoals が未設定時に初期値を返す", () => {
  const d = db();
  const g = H.getHealthGoals(d);
  assert.equal(g.calorieLimitKcal, 2000);
  assert.ok(g.proteinGoalG > 0);
  assert.equal(g.exerciseMinutes, 30);
  assert.equal(g.sleepHours, 7);
});

test("setHealthGoals で保存と検証ができる", () => {
  const d = db();
  const r = H.setHealthGoals(d, { calorieLimitKcal: 1800, proteinGoalG: 70, exerciseMinutes: 45, sleepHours: 8 });
  assert.equal(r.ok, true);
  assert.equal(H.getHealthGoals(d).calorieLimitKcal, 1800);
  assert.ok(H.setHealthGoals(d, { calorieLimitKcal: 100, proteinGoalG: 70, exerciseMinutes: 45, sleepHours: 8 }).errors.calorieLimitKcal);
  assert.ok(H.setHealthGoals(d, { calorieLimitKcal: 1800, proteinGoalG: "xx", exerciseMinutes: 45, sleepHours: 8 }).errors.proteinGoalG);
});

test("recommendGoals が身体データと目的で個別の推薦を出す（初期設定ウィザード用の回帰）", () => {
  // DB にプロフィールが未保存（ウィザード途中）でも profileOverride から算出できる
  const dry = db(); // profile なし
  const rec = H.recommendGoals(dry, "maintain", { heightCm: 170, weightKg: 65, age: 23, gender: "male" });
  assert.equal(rec.bmr, 1603);            // Mifflin–St Jeor
  // 基礎代謝×1.0（維持）＋ 活動分
  assert.equal(rec.calorieLimitKcal, 2003);
  assert.notEqual(rec.calorieLimitKcal, 2000, "固定デフォルト2000を使わない");
  assert.equal(rec.proteinGoalG, 78);      // 65 × 1.2（維持）
  assert.equal(rec.exerciseMinutes, 30);
  assert.equal(rec.sleepHours, 7);
});

test("recommendGoals が目的別（減量/増量/維持）と体格別に値を変える", () => {
  const dry = db();
  const body = { heightCm: 170, weightKg: 65, age: 23, gender: "male" };
  const lose = H.recommendGoals(dry, "lose", body);
  const gain = H.recommendGoals(dry, "gain", body);
  assert.equal(lose.calorieLimitKcal, 1843); // 1603 × 0.9 ＋ 400
  assert.equal(gain.calorieLimitKcal, 2163); // 1603 × 1.1 ＋ 400
  assert.equal(lose.proteinGoalG, 104);      // 65 × 1.6
  assert.equal(gain.proteinGoalG, 111);      // 65 × 1.7
  assert.equal(lose.exerciseMinutes, 45);
  assert.equal(gain.sleepHours, 8);
  // 体格が違えば、同じ目的でも別の推薦になる
  const big = H.recommendGoals(dry, "lose", { heightCm: 180, weightKg: 80, age: 30, gender: "male" });
  assert.equal(big.bmr, 1780);
  assert.equal(big.calorieLimitKcal, 2002); // 1780 × 0.9 ＋ 400
  assert.equal(big.proteinGoalG, 128);
  // 既定挙動（上書きなし・プロフィールなし）はデフォルトへ落ちる
  const fallback = H.recommendGoals(dry, "maintain");
  assert.equal(fallback.calorieLimitKcal, 2000);
  assert.equal(fallback.bmr, null);
});
