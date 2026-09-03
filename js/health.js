"use strict";
/*
 * kenecho Village - 健康管理ロジック（KE_HEALTH）
 * BMI/基礎代謝・食事/運動/睡眠/体重の記録CRUD・目標・健康スコア/EXP。
 * ブラウザ非依存の純粋関数として実装し、Node テストで検証する。
 * M3: 食事記録（按分計算・検索・カスタム食品・日次合計）。
 * M4: 運動・睡眠・体重・目標・BMI/BMR。M5: スコア/EXP。
 */
(function () {
  const C = globalThis.KE_CONFIG;
  const U = globalThis.KE_UTIL;
  const PRESET_FOODS = (globalThis.KE_FOODS || []);

  /* ------------------------------------------------------------------ */
  /* 共通（日付・食品参照）                                              */
  /* ------------------------------------------------------------------ */

  /**
   * 記録可能な日付か検証する。未来日付は登録できない。
   * dateStr: YYYY-MM-DD / ref: 参照日（既定=今日）
   */
  function isValidRecordDate(dateStr, ref) {
    if (!U.parseDate(dateStr)) return false;
    return !U.isFutureDate(dateStr, ref);
  }

  function getCustomFoodById(db, id) {
    const customs = (db && db.customFoods) || [];
    for (let i = 0; i < customs.length; i++) {
      if (customs[i].id === id) return customs[i];
    }
    return null;
  }

  /** プリセット＋カスタムから食品を探す */
  function getFoodById(db, id) {
    for (let i = 0; i < PRESET_FOODS.length; i++) {
      if (PRESET_FOODS[i].id === id) return PRESET_FOODS[i];
    }
    return getCustomFoodById(db, id);
  }

  /** 食品名の部分一致検索（プリセット＋カスタム）。limit 件まで */
  function searchFoods(db, keyword, limit) {
    const kw = String(keyword || "").trim().toLowerCase();
    const max = limit || 10;
    const out = [];
    const sources = PRESET_FOODS.concat((db && db.customFoods) || []);
    for (let i = 0; i < sources.length; i++) {
      if (kw === "" || sources[i].name.toLowerCase().indexOf(kw) >= 0) {
        out.push(sources[i]);
        if (out.length >= max) break;
      }
    }
    return out;
  }

  /**
   * 栄養の按分計算。
   * ratio = 実摂取量g ÷ 基準分量g。各栄養値は小数第1位へ丸める。
   */
  function calcFoodNutrients(food, actualQtyGram) {
    const qty = Number(actualQtyGram);
    const base = Number(food.baseAmountGram);
    const ratio = base > 0 ? qty / base : 0;
    return {
      kcal: U.round1((food.kcal || 0) * ratio),
      protein: U.round1((food.protein || 0) * ratio),
      fat: U.round1((food.fat || 0) * ratio),
      carbs: U.round1((food.carbs || 0) * ratio)
    };
  }

  /* ------------------------------------------------------------------ */
  /* 食事記録                                                            */
  /* ------------------------------------------------------------------ */

  const MEAL_TYPE_ORDER = ["breakfast", "lunch", "dinner", "snack"];

  /** 食事記録の入力検証 */
  function validateMealInput(db, input) {
    const in2 = input || {};
    const errors = {};
    const food = getFoodById(db, in2.foodId);
    if (!food) {
      errors.foodId = "食品を選んでください（検索から選択）。";
    }
    if (!C.MEAL_TYPES[in2.mealType]) errors.mealType = "食事の分類を選んでください。";
    const qty = in2.actualQty === "" || in2.actualQty == null ? NaN : Number(in2.actualQty);
    if (!Number.isFinite(qty) || qty <= 0) errors.actualQty = "実摂取量は0より大きい数値で入力してください。";
    else if (qty > 3000) errors.actualQty = "実摂取量が大きすぎます（3000gまで）。";
    if (!in2.date || !U.parseDate(in2.date)) errors.date = "日付が不正です。";
    else if (U.isFutureDate(in2.date)) errors.date = "未来の日付には記録できません。";
    return { ok: Object.keys(errors).length === 0, errors: errors };
  }

  /** 日付別の食事記録一覧（新しい順） */
  function getMeals(db, date) {
    const list = (db.foods && db.foods.meals && db.foods.meals[date]) || [];
    return list.slice().reverse(); // 新しい順で表示用
  }

  /** 食事記録を追加（record は完成済み MealRecord） */
  function addMeal(db, date, record) {
    if (!db.foods) db.foods = { meals: {} };
    if (!db.foods.meals) db.foods.meals = {};
    if (!db.foods.meals[date]) db.foods.meals[date] = [];
    db.foods.meals[date].push(record);
    return record;
  }

  /** 食事記録を更新 */
  function updateMeal(db, date, id, patch) {
    const list = (db.foods && db.foods.meals && db.foods.meals[date]) || [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        Object.assign(list[i], patch);
        return list[i];
      }
    }
    return null;
  }

  /** 食事記録を削除（実際に削除できたか） */
  function removeMeal(db, date, id) {
    const list = (db.foods && db.foods.meals && db.foods.meals[date]) || [];
    const idx = list.findIndex(function (r) { return r.id === id; });
    if (idx >= 0) {
      list.splice(idx, 1);
      return true;
    }
    return false;
  }

  /** 日付別の栄養合計 { kcal, protein, fat, carbs, count } */
  function getMealTotals(db, date) {
    const list = (db.foods && db.foods.meals && db.foods.meals[date]) || [];
    const t = { kcal: 0, protein: 0, fat: 0, carbs: 0, count: list.length };
    list.forEach(function (r) {
      t.kcal += r.kcal || 0;
      t.protein += r.protein || 0;
      t.fat += r.fat || 0;
      t.carbs += r.carbs || 0;
    });
    t.kcal = U.round1(t.kcal);
    t.protein = U.round1(t.protein);
    t.fat = U.round1(t.fat);
    t.carbs = U.round1(t.carbs);
    return t;
  }

  /**
   * 記録用のレコードを組み立てる（食品・分量から栄養を計算し保存用レコードを返す）。
   * actualQtyGram はグラム実摂取量。
   */
  function buildMealRecord(db, input) {
    const food = getFoodById(db, input.foodId);
    const nutrients = calcFoodNutrients(food, input.actualQty);
    return {
      id: U.generateId("meal"),
      foodId: food.id,
      name: food.name,
      category: food.category,
      mealType: input.mealType,
      unitName: food.unitName,
      baseQty: Number(food.baseAmountGram),
      actualQty: U.round1(Number(input.actualQty)),
      kcal: nutrients.kcal,
      protein: nutrients.protein,
      fat: nutrients.fat,
      carbs: nutrients.carbs,
      isCustom: !!getCustomFoodById(db, food.id)
    };
  }

  /* ------------------------------------------------------------------ */
  /* カスタム食品                                                        */
  /* ------------------------------------------------------------------ */

  function validateCustomFood(input) {
    const in2 = input || {};
    const errors = {};
    if (!in2.name || !String(in2.name).trim()) errors.name = "食品名を入力してください。";
    else if (String(in2.name).trim().length > 30) errors.name = "食品名は30文字以内で入力してください。";
    const base = Number(in2.baseAmountGram);
    if (!Number.isFinite(base) || base <= 0) errors.baseAmountGram = "基準分量は0より大きい数値で入力してください。";
    ["kcal", "protein", "fat", "carbs"].forEach(function (k) {
      const v = Number(in2[k]);
      if (!Number.isFinite(v) || v < 0) errors[k] = k + "は0以上で入力してください。";
    });
    return { ok: Object.keys(errors).length === 0, errors: errors };
  }

  function addCustomFood(db, input) {
    const v = validateCustomFood(input);
    if (!v.ok) return { ok: false, errors: v.errors };
    const def = {
      id: U.generateId("cfood"),
      name: String(input.name).trim(),
      category: "カスタム",
      unitName: input.unitName && String(input.unitName).trim() ? String(input.unitName).trim() : "g",
      baseAmountGram: U.round1(Number(input.baseAmountGram)),
      kcal: U.round1(Number(input.kcal || 0)),
      protein: U.round1(Number(input.protein || 0)),
      fat: U.round1(Number(input.fat || 0)),
      carbs: U.round1(Number(input.carbs || 0))
    };
    if (!db.customFoods) db.customFoods = [];
    db.customFoods.push(def);
    return { ok: true, food: def };
  }

  function updateCustomFood(db, id, input) {
    const target = getCustomFoodById(db, id);
    if (!target) return { ok: false, errors: { name: "対象が見つかりません" } };
    const next = Object.assign({}, target, {
      name: (input.name != null ? input.name : target.name),
      unitName: (input.unitName != null ? input.unitName : target.unitName),
      baseAmountGram: (input.baseAmountGram != null ? input.baseAmountGram : target.baseAmountGram),
      kcal: input.kcal != null ? input.kcal : target.kcal,
      protein: input.protein != null ? input.protein : target.protein,
      fat: input.fat != null ? input.fat : target.fat,
      carbs: input.carbs != null ? input.carbs : target.carbs
    });
    const v = validateCustomFood(next);
    if (!v.ok) return { ok: false, errors: v.errors };
    Object.assign(target, next);
    return { ok: true, food: target };
  }

  function removeCustomFood(db, id) {
    if (!Array.isArray(db.customFoods)) return false;
    const idx = db.customFoods.findIndex(function (f) { return f.id === id; });
    if (idx >= 0) {
      db.customFoods.splice(idx, 1);
      return true;
    }
    return false;
  }

  function listCustomFoods(db) {
    return (db.customFoods || []).slice();
  }

  const KE_HEALTH = {
    MEAL_TYPE_ORDER: MEAL_TYPE_ORDER,
    isValidRecordDate: isValidRecordDate,
    getFoodById: getFoodById,
    searchFoods: searchFoods,
    calcFoodNutrients: calcFoodNutrients,
    validateMealInput: validateMealInput,
    getMeals: getMeals,
    addMeal: addMeal,
    updateMeal: updateMeal,
    removeMeal: removeMeal,
    getMealTotals: getMealTotals,
    buildMealRecord: buildMealRecord,
    validateCustomFood: validateCustomFood,
    addCustomFood: addCustomFood,
    updateCustomFood: updateCustomFood,
    removeCustomFood: removeCustomFood,
    listCustomFoods: listCustomFoods
  };

  if (globalThis) globalThis.KE_HEALTH = KE_HEALTH;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_HEALTH: KE_HEALTH };
})();
