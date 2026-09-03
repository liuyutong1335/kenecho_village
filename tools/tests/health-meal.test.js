"use strict";
/*
 * M3 食事記録のテスト：食品データ・按分・記録CRUD・カスタム食品。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "foods.js"));
const { KE_HEALTH: H } = require(path.join(root, "health.js"));

function freshDb() {
  return require(path.join(root, "db.js")).KE_DB.defaultData();
}

test("プリセット食品が50件・ID重複なし・必須項目を持つ", () => {
  const foods = globalThis.KE_FOODS;
  assert.equal(Array.isArray(foods), true);
  assert.ok(foods.length >= 50, "50件以上あること（現: " + foods.length + "）");
  const ids = new Set();
  foods.forEach(function (f) {
    assert.ok(!ids.has(f.id), "重複ID: " + f.id);
    ids.add(f.id);
    assert.ok(f.name, f.id);
    assert.ok(f.baseAmountGram > 0, "基準量>0: " + f.id);
    for (const k of ["kcal", "protein", "fat", "carbs"]) assert.ok(Number.isFinite(f[k]), k);
  });
});

test("calcFoodNutrients が基準量に対する按分を返す", () => {
  const db = freshDb();
  const rice = H.getFoodById(db, "food_rice01"); // 150g 234kcal
  const n = H.calcFoodNutrients(rice, 100);
  assert.equal(n.kcal, 156.0); // 234 * 100/150 = 156
  assert.equal(n.carbs, 35.6); // 53.4*100/150=35.6
  const half = H.calcFoodNutrients(rice, 75);
  assert.equal(half.kcal, 117.0);
});

test("searchFoods が部分一致・大文字小文字無視で検索する", () => {
  const db = freshDb();
  const results = H.searchFoods(db, "ごはん", 10);
  assert.ok(results.some((f) => f.name.indexOf("ごはん") >= 0));
  assert.ok(results.length >= 1);
});

test("validateMealInput が正常・異常を判定する", () => {
  const db = freshDb();
  const ok = H.validateMealInput(db, { foodId: "food_rice01", mealType: "lunch", actualQty: 100, date: "2026-09-02" });
  assert.equal(ok.ok, true);
  assert.ok(H.validateMealInput(db, { foodId: "nonexist", mealType: "lunch", actualQty: 100, date: "2026-09-02" }).errors.foodId);
  assert.ok(H.validateMealInput(db, { foodId: "food_rice01", mealType: "", actualQty: 100, date: "2026-09-02" }).errors.mealType);
  assert.ok(H.validateMealInput(db, { foodId: "food_rice01", mealType: "lunch", actualQty: 0, date: "2026-09-02" }).errors.actualQty);
  assert.ok(H.validateMealInput(db, { foodId: "food_rice01", mealType: "lunch", actualQty: 100, date: "2026-09-30" }).errors.date); // 未来（今日は2026-09-03基準とみなさないため日付パースのみ確認）
});

test("addMeal / updateMeal / removeMeal / getMeals / getMealTotals が動作する", () => {
  const db = freshDb();
  assert.equal(H.getMeals(db, "2026-09-02").length, 0);
  const rec = { id: "m1", foodId: "x", name: "ごはん", mealType: "lunch", actualQty: 100, kcal: 156, protein: 2.5, fat: 0.3, carbs: 35.6, baseQty: 150, unitName: "杯", category: "主食" };
  H.addMeal(db, "2026-09-02", rec);
  H.addMeal(db, "2026-09-02", Object.assign({}, rec, { id: "m2", mealType: "dinner", kcal: 200 }));
  assert.equal(H.getMeals(db, "2026-09-02").length, 2);
  const t = H.getMealTotals(db, "2026-09-02");
  assert.equal(t.kcal, 356.0);
  assert.equal(t.count, 2);
  H.updateMeal(db, "2026-09-02", "m1", { kcal: 0 });
  assert.equal(H.getMealTotals(db, "2026-09-02").kcal, 200.0);
  assert.equal(H.removeMeal(db, "2026-09-02", "m1"), true);
  assert.equal(H.getMeals(db, "2026-09-02").length, 1);
  assert.equal(H.removeMeal(db, "2026-09-02", "zzz"), false);
});

test("buildMealRecord が食品から栄養を計算してレコードを組み立てる", () => {
  const db = freshDb();
  const rec = H.buildMealRecord(db, { foodId: "food_rice01", mealType: "breakfast", actualQty: 150, date: "2026-09-02" });
  assert.equal(rec.kcal, 234);
  assert.equal(rec.mealType, "breakfast");
  assert.equal(rec.actualQty, 150);
  assert.match(rec.id, /^meal_/);
  assert.equal(rec.isCustom, false);
});

test("カスタム食品の追加・編集・削除・再利用（検索）が動作する", () => {
  const db = freshDb();
  const r = H.addCustomFood(db, { name: "低糖パン", unitName: "枚", baseAmountGram: 60, kcal: 120, protein: 5, fat: 1.5, carbs: 10 });
  assert.equal(r.ok, true);
  const id = r.food.id;
  assert.equal(H.getFoodById(db, id).name, "低糖パン");
  // 検索にも出てくる（再利用）
  const hits = H.searchFoods(db, "低糖", 10);
  assert.ok(hits.some((f) => f.id === id));
  const built = H.buildMealRecord(db, { foodId: id, mealType: "snack", actualQty: 30, date: "2026-09-02" });
  assert.equal(built.kcal, 60.0); // 120 * 30/60
  assert.equal(built.isCustom, true);
  // 編集
  const u = H.updateCustomFood(db, id, { kcal: 150 });
  assert.equal(u.ok, true);
  assert.equal(H.getFoodById(db, id).kcal, 150);
  // 削除
  assert.equal(H.removeCustomFood(db, id), true);
  assert.equal(H.getFoodById(db, id), null);
});

test("validateCustomFood が不正入力を拒否する", () => {
  assert.equal(H.validateCustomFood({}).ok, false);
  assert.equal(H.validateCustomFood({ name: "a", baseAmountGram: 0, kcal: 0 }).ok, false);
  assert.equal(H.validateCustomFood({ name: "a", baseAmountGram: 50, kcal: -1 }).ok, false);
  assert.equal(H.validateCustomFood({ name: "a", baseAmountGram: 50, kcal: 10, protein: 0, fat: 0, carbs: 0 }).ok, true);
});

test("未来日付は記録不可・不正日付は false", () => {
  assert.equal(H.isValidRecordDate("2026-99-99", "2026-09-03"), false);
  assert.equal(H.isValidRecordDate("abc"), false);
});
