"use strict";
/*
 * kenecho Village - 健康管理ロジック（KE_HEALTH）
 * BMI/基礎代謝・食事/運動/睡眠/体重の記録CRUD・目標・健康スコア/EXP。
 * ブラウザ非依存の純粋関数として実装し、Node テストで検証する。
 * M3: 食事 / M4: 運動・睡眠・体重・目標・BMI/BMR。M5: スコア/EXP。
 */
(function () {
  const C = globalThis.KE_CONFIG;
  const U = globalThis.KE_UTIL;
  const PRESET_FOODS = (globalThis.KE_FOODS || []);
  const PRESET_EXERCISES = (globalThis.KE_EXERCISES || []);

  /* ------------------------------------------------------------------ */
  /* 共通                                                                */
  /* ------------------------------------------------------------------ */

  function isValidRecordDate(dateStr, ref) {
    if (!U.parseDate(dateStr)) return false;
    return !U.isFutureDate(dateStr, ref);
  }

  /* ------------------------------------------------------------------ */
  /* 食事（M3）                                                          */
  /* ------------------------------------------------------------------ */

  const MEAL_TYPE_ORDER = ["breakfast", "lunch", "dinner", "snack"];

  function getFoodById(db, id) {
    for (let i = 0; i < PRESET_FOODS.length; i++) {
      if (PRESET_FOODS[i].id === id) return PRESET_FOODS[i];
    }
    return getCustomFoodById(db, id);
  }

  function getCustomFoodById(db, id) {
    const customs = (db && db.customFoods) || [];
    for (let i = 0; i < customs.length; i++) {
      if (customs[i].id === id) return customs[i];
    }
    return null;
  }

  function searchFoods(db, keyword, limit) {
    const kw = String(keyword || "").trim().toLowerCase();
    const max = limit || 10;
    const out = [];
    // 一覧表示（キーワードなし）時は、カスタム食品を先頭に（新しく足したものが見えるように）
    const sources = kw === ""
      ? ((db && db.customFoods) || []).concat(PRESET_FOODS)
      : PRESET_FOODS.concat((db && db.customFoods) || []);
    for (let i = 0; i < sources.length; i++) {
      if (kw === "" || sources[i].name.toLowerCase().indexOf(kw) >= 0) {
        out.push(sources[i]);
        if (out.length >= max) break;
      }
    }
    return out;
  }

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

  function validateMealInput(db, input) {
    const errors = {};
    if (!getFoodById(db, input.foodId)) errors.foodId = "食品を選んでください。";
    if (!C.MEAL_TYPES[input.mealType]) errors.mealType = "食事の分類を選んでください。";
    const qty = input.actualQty === "" || input.actualQty == null ? NaN : Number(input.actualQty);
    if (!Number.isFinite(qty) || qty <= 0) errors.actualQty = "実摂取量は0より大きい数値で入力してください。";
    else if (qty > 3000) errors.actualQty = "実摂取量が大きすぎます（3000gまで）。";
    if (!input.date || !U.parseDate(input.date)) errors.date = "日付が不正です。";
    else if (U.isFutureDate(input.date)) errors.date = "未来の日付には記録できません。";
    return { ok: Object.keys(errors).length === 0, errors };
  }

  function getMeals(db, date) {
    const list = (db.foods && db.foods.meals && db.foods.meals[date]) || [];
    return list.slice().reverse();
  }

  function addMeal(db, date, record) {
    if (!db.foods) db.foods = { meals: {} };
    if (!db.foods.meals) db.foods.meals = {};
    if (!db.foods.meals[date]) db.foods.meals[date] = [];
    db.foods.meals[date].push(record);
    return record;
  }

  function updateMeal(db, date, id, patch) {
    const list = (db.foods && db.foods.meals && db.foods.meals[date]) || [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) { Object.assign(list[i], patch); return list[i]; }
    }
    return null;
  }

  function removeMeal(db, date, id) {
    const list = (db.foods && db.foods.meals && db.foods.meals[date]) || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) { list.splice(idx, 1); return true; }
    return false;
  }

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

  function buildMealRecord(db, input) {
    const food = getFoodById(db, input.foodId);
    const n = calcFoodNutrients(food, input.actualQty);
    return {
      id: U.generateId("meal"),
      foodId: food.id,
      name: food.name,
      category: food.category,
      mealType: input.mealType,
      unitName: food.unitName,
      baseQty: Number(food.baseAmountGram),
      actualQty: U.round1(Number(input.actualQty)),
      kcal: n.kcal, protein: n.protein, fat: n.fat, carbs: n.carbs,
      isCustom: !!getCustomFoodById(db, food.id)
    };
  }

  function validateCustomFood(input) {
    const errors = {};
    if (!input.name || !String(input.name).trim()) errors.name = "食品名を入力してください。";
    else if (String(input.name).trim().length > 30) errors.name = "食品名は30文字以内で入力してください。";
    const base = Number(input.baseAmountGram);
    if (!Number.isFinite(base) || base <= 0) errors.baseAmountGram = "基準分量は0より大きい数値で入力してください。";
    ["kcal", "protein", "fat", "carbs"].forEach(function (k) {
      const v = Number(input[k]);
      if (!Number.isFinite(v) || v < 0) errors[k] = k + "は0以上で入力してください。";
    });
    return { ok: Object.keys(errors).length === 0, errors };
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
      name: input.name != null ? input.name : target.name,
      unitName: input.unitName != null ? input.unitName : target.unitName,
      baseAmountGram: input.baseAmountGram != null ? input.baseAmountGram : target.baseAmountGram,
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
    const idx = db.customFoods.findIndex((f) => f.id === id);
    if (idx >= 0) { db.customFoods.splice(idx, 1); return true; }
    return false;
  }

  function listCustomFoods(db) {
    return (db.customFoods || []).slice();
  }

  /* ------------------------------------------------------------------ */
  /* 運動                                                                */
  /* ------------------------------------------------------------------ */

  function getExerciseById(db, id) {
    for (let i = 0; i < PRESET_EXERCISES.length; i++) {
      if (PRESET_EXERCISES[i].id === id) return PRESET_EXERCISES[i];
    }
    const customs = (db && db.customExercises) || [];
    for (let j = 0; j < customs.length; j++) {
      if (customs[j].id === id) return customs[j];
    }
    return null;
  }

  function searchExercises(db, keyword, limit) {
    const kw = String(keyword || "").trim().toLowerCase();
    const max = limit || 10;
    const out = [];
    // 一覧表示（キーワードなし）時は、カスタム運動を先頭に（新しく足したものが見えるように）
    const sources = kw === ""
      ? ((db && db.customExercises) || []).concat(PRESET_EXERCISES)
      : PRESET_EXERCISES.concat((db && db.customExercises) || []);
    for (let i = 0; i < sources.length; i++) {
      if (kw === "" || sources[i].name.toLowerCase().indexOf(kw) >= 0) {
        out.push(sources[i]);
        if (out.length >= max) break;
      }
    }
    return out;
  }

  /** METs 法による消費カロリー推定。weightKg は最新体重を使用 */
  function calcExerciseCalories(mets, minutes, weightKg) {
    const m = Number(minutes);
    if (!Number.isFinite(m) || m <= 0) return 0;
    const kg = Number(weightKg) || 50;
    return U.round1(mets * 3.5 * kg / 200 * m);
  }

  function validateExerciseInput(db, input) {
    const errors = {};
    if (!getExerciseById(db, input.exerciseId)) errors.exerciseId = "運動を選んでください。";
    const min = input.minutes === "" || input.minutes == null ? NaN : Number(input.minutes);
    if (!Number.isInteger(min) || min < C.EXERCISE_MINUTES.min || min > C.EXERCISE_MINUTES.max) {
      errors.minutes = "時間は整数で" + C.EXERCISE_MINUTES.min + "〜" + C.EXERCISE_MINUTES.max + "分の範囲で入力してください。";
    }
    if (input.calcMode === "manual") {
      const cal = Number(input.calories);
      if (!Number.isFinite(cal) || cal < 0) errors.calories = "消費カロリーは0以上で入力してください。";
      else if (cal > 20000) errors.calories = "消費カロリーが大きすぎます。";
    }
    if (!input.date || !U.parseDate(input.date)) errors.date = "日付が不正です。";
    else if (U.isFutureDate(input.date)) errors.date = "未来の日付には記録できません。";
    return { ok: Object.keys(errors).length === 0, errors };
  }

  function getExercises(db, date) {
    const list = (db.exercises && db.exercises[date]) || [];
    return list.slice().reverse();
  }

  function addExercise(db, date, record) {
    if (!db.exercises) db.exercises = {};
    if (!db.exercises[date]) db.exercises[date] = [];
    db.exercises[date].push(record);
    return record;
  }

  function updateExercise(db, date, id, patch) {
    const list = (db.exercises && db.exercises[date]) || [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) { Object.assign(list[i], patch); return list[i]; }
    }
    return null;
  }

  function removeExercise(db, date, id) {
    const list = (db.exercises && db.exercises[date]) || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx >= 0) { list.splice(idx, 1); return true; }
    return false;
  }

  function getExerciseTotals(db, date) {
    const list = (db.exercises && db.exercises[date]) || [];
    let minutes = 0;
    let calories = 0;
    list.forEach(function (r) {
      minutes += r.minutes || 0;
      calories += r.calories || 0;
    });
    return { minutes: minutes, calories: U.round1(calories), count: list.length };
  }

  function buildExerciseRecord(db, input, weightKg) {
    const ex = getExerciseById(db, input.exerciseId);
    let calories;
    let calcMode;
    if (input.calcMode === "manual") {
      calories = U.round1(Number(input.calories));
      calcMode = "manual";
    } else {
      calories = calcExerciseCalories(ex.mets, Number(input.minutes), weightKg);
      calcMode = "mets";
    }
    return {
      id: U.generateId("exr"),
      exerciseId: ex.id,
      name: ex.name,
      mets: ex.mets,
      minutes: Number(input.minutes),
      calories: calories,
      calcMode: calcMode
    };
  }

  function validateCustomExercise(input) {
    const errors = {};
    if (!input.name || !String(input.name).trim()) errors.name = "運動名を入力してください。";
    else if (String(input.name).trim().length > 30) errors.name = "運動名は30文字以内で入力してください。";
    const mets = Number(input.mets);
    if (!Number.isFinite(mets) || mets <= 0 || mets > 20) errors.mets = "METsは0より大きく20以下の数値で入力してください。";
    return { ok: Object.keys(errors).length === 0, errors };
  }

  function addCustomExercise(db, input) {
    const v = validateCustomExercise(input);
    if (!v.ok) return { ok: false, errors: v.errors };
    const def = {
      id: U.generateId("cex"),
      name: String(input.name).trim(),
      mets: U.round1(Number(input.mets)),
      note: input.note ? String(input.note).trim() : ""
    };
    if (!db.customExercises) db.customExercises = [];
    db.customExercises.push(def);
    return { ok: true, exercise: def };
  }

  function updateCustomExercise(db, id, input) {
    const target = getExerciseById(db, id);
    if (!target || target.__preset) return { ok: false, errors: { name: "対象が見つかりません" } };
    const next = Object.assign({}, target, {
      name: input.name != null ? input.name : target.name,
      mets: input.mets != null ? input.mets : target.mets,
      note: input.note != null ? input.note : target.note
    });
    const v = validateCustomExercise(next);
    if (!v.ok) return { ok: false, errors: v.errors };
    Object.assign(target, next);
    return { ok: true, exercise: target };
  }

  function removeCustomExercise(db, id) {
    if (!Array.isArray(db.customExercises)) return false;
    const idx = db.customExercises.findIndex((e) => e.id === id);
    if (idx >= 0) { db.customExercises.splice(idx, 1); return true; }
    return false;
  }

  /* ------------------------------------------------------------------ */
  /* 睡眠                                                                */
  /* ------------------------------------------------------------------ */

  function calcSleepHours(sleepAt, wakeAt) {
    const s = U.parseTime(sleepAt);
    const w = U.parseTime(wakeAt);
    if (s == null || w == null) return null;
    if (s === w) return null; // 同時刻は不明瞭なため扱わない（保存も許可しない）
    let diff = w - s;
    if (diff < 0) diff += 24 * 60; // 日跨ぎ
    return U.round1(diff / 60);
  }

  function validateSleepInput(input) {
    const errors = {};
    if (U.parseTime(input.sleepAt) == null) errors.sleepAt = "入眠時刻をHH:mmの形式で入力してください。";
    if (U.parseTime(input.wakeAt) == null) errors.wakeAt = "起床時刻をHH:mmの形式で入力してください。";
    if (!errors.sleepAt && !errors.wakeAt) {
      if (String(input.sleepAt).trim() === String(input.wakeAt).trim()) {
        errors.wakeAt = "就寝時刻と起床時刻が同じです。もう一度入力してください。";
      }
    }
    if (!input.date || !U.parseDate(input.date)) errors.date = "日付が不正です。";
    else if (U.isFutureDate(input.date)) errors.date = "未来の日付には記録できません。";
    return { ok: Object.keys(errors).length === 0, errors };
  }

  function getSleepOnDate(db, date) {
    return (db.healthRecords && db.healthRecords.sleep && db.healthRecords.sleep[date]) || null;
  }

  function saveSleep(db, date, sleepAt, wakeAt) {
    if (!db.healthRecords) db.healthRecords = { sleep: {}, weight: {} };
    if (!db.healthRecords.sleep) db.healthRecords.sleep = {};
    db.healthRecords.sleep[date] = {
      sleepAt: sleepAt,
      wakeAt: wakeAt,
      hours: calcSleepHours(sleepAt, wakeAt)
    };
    return db.healthRecords.sleep[date];
  }

  function removeSleep(db, date) {
    if (db.healthRecords && db.healthRecords.sleep && db.healthRecords.sleep[date]) {
      delete db.healthRecords.sleep[date];
      return true;
    }
    return false;
  }

  /* ------------------------------------------------------------------ */
  /* 体重・BMI・基礎代謝                                                  */
  /* ------------------------------------------------------------------ */

  function getWeightEntries(db) {
    const w = (db.healthRecords && db.healthRecords.weight) || {};
    return Object.keys(w).map(function (d) {
      return { date: d, kg: w[d].kg };
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }

  function getRecentWeights(db, n) {
    const entries = getWeightEntries(db);
    return entries.slice(0, n || 30).reverse().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  }

  function getLatestWeight(db) {
    const entries = getWeightEntries(db);
    return entries.length > 0 ? entries[0] : null;
  }

  /** 計算用の体重：最新の体重記録、なければ初期設定時の体重 */
  function getWeightForCalculation(db, profile) {
    const latest = getLatestWeight(db);
    if (latest) return latest.kg;
    const p = profile || (db && db.profile);
    return p && p.weightKg ? Number(p.weightKg) : 50;
  }

  function hasWeightOnDate(db, date) {
    return !!(db.healthRecords && db.healthRecords.weight && db.healthRecords.weight[date]);
  }

  function saveWeight(db, date, kg) {
    const overwritten = hasWeightOnDate(db, date);
    if (!db.healthRecords) db.healthRecords = { sleep: {}, weight: {} };
    if (!db.healthRecords.weight) db.healthRecords.weight = {};
    db.healthRecords.weight[date] = { kg: U.round1(Number(kg)) };
    return { ok: true, overwritten: overwritten };
  }

  function removeWeight(db, date) {
    if (db.healthRecords && db.healthRecords.weight && db.healthRecords.weight[date]) {
      delete db.healthRecords.weight[date];
      return true;
    }
    return false;
  }

  function validateWeightInput(input) {
    const errors = {};
    const kg = input.kg === "" || input.kg == null ? NaN : Number(input.kg);
    if (!Number.isFinite(kg) || kg < C.WEIGHT.min || kg > C.WEIGHT.max) {
      errors.kg = "体重は" + C.WEIGHT.min + "〜" + C.WEIGHT.max + "kgの範囲で入力してください。";
    }
    if (!input.date || !U.parseDate(input.date)) errors.date = "日付が不正です。";
    else if (U.isFutureDate(input.date)) errors.date = "未来の日付には記録できません。";
    return { ok: Object.keys(errors).length === 0, errors };
  }

  function calcBMI(weightKg, heightCm) {
    const h = Number(heightCm) / 100;
    if (!Number.isFinite(h) || h <= 0 || !Number.isFinite(Number(weightKg))) return null;
    return U.round1(Number(weightKg) / (h * h));
  }

  /** 成人用 Mifflin–St Jeor 式（kcal/日）。参考情報。 */
  function calcBMR(weightKg, heightCm, age, gender) {
    const w = Number(weightKg);
    const h = Number(heightCm);
    const a = Number(age);
    if (![w, h, a].every(Number.isFinite)) return null;
    const base = 10 * w + 6.25 * h - 5 * a;
    const factor = gender === "female" ? -161 : 5;
    return Math.round(base + factor);
  }

  /* ------------------------------------------------------------------ */
  /* 健康目標                                                            */
  /* ------------------------------------------------------------------ */

  /**
   * 目標タイプ別の推薦目標を算出する（初期設定・未カスタマイズ時の提示用）。
   * profile（体重・身長・年齢・性別）とタイプの係数から、
   * 摂取カロリー（BMR×比）・蛋白質（体重×係数）・運動・睡眠を返す。
   */
  function recommendGoals(db, goalType) {
    const profile = (db && db.profile) || {};
    const type = C.HEALTH_GOAL_TYPES[goalType] || C.HEALTH_GOAL_TYPES[C.DEFAULT_GOAL_TYPE];
    const weight = getWeightForCalculation(db);
    const bmr = calcBMR(weight, profile.heightCm, profile.age, profile.gender);
    const calorieLimitKcal = bmr != null ? Math.round(bmr * type.calorieRatio) : C.HEALTH_GOAL_DEFAULTS.calorieLimitKcal;
    return {
      goalType: type === C.HEALTH_GOAL_TYPES[goalType] ? goalType : C.DEFAULT_GOAL_TYPE,
      bmr: bmr != null ? bmr : null,
      calorieLimitKcal: calorieLimitKcal,
      proteinGoalG: Math.round(weight * type.proteinPerKg),
      exerciseMinutes: type.exerciseMinutes,
      sleepHours: type.sleepHours
    };
  }

  /** 保存値・初期値・タイプを合成した目標を返す。蛋白質は基準（体重×係数）で自動設定 */
  function getHealthGoals(db) {
    const stored = (db && db.healthGoals) || {};
    const defaults = C.HEALTH_GOAL_DEFAULTS;
    const weight = getWeightForCalculation(db);
    const proteinDefault = Math.round(weight * defaults.proteinPerKg);
    const typeKey = stored.goalType && C.HEALTH_GOAL_TYPES[stored.goalType] ? stored.goalType : C.DEFAULT_GOAL_TYPE;
    const type = C.HEALTH_GOAL_TYPES[typeKey];
    return {
      goalType: typeKey,
      calorieLimitKcal: stored.calorieLimitKcal != null ? Number(stored.calorieLimitKcal) : defaults.calorieLimitKcal,
      proteinGoalG: stored.proteinGoalG != null ? Number(stored.proteinGoalG) : proteinDefault,
      exerciseMinutes: stored.exerciseMinutes != null ? Number(stored.exerciseMinutes) : (type ? type.exerciseMinutes : defaults.exerciseMinutes),
      sleepHours: stored.sleepHours != null ? Number(stored.sleepHours) : (type ? type.sleepHours : defaults.sleepHours)
    };
  }

  function validateGoalInput(input) {
    const errors = {};
    const rules = {
      calorieLimitKcal: [500, 10000, "摂取カロリー上限"],
      proteinGoalG: [10, 300, "蛋白質目標"],
      exerciseMinutes: [1, 1440, "運動時間目標"],
      sleepHours: [1, 16, "睡眠時間目標"]
    };
    Object.keys(rules).forEach(function (k) {
      const v = input[k] === "" || input[k] == null ? NaN : Number(input[k]);
      const [min, max, jp] = rules[k];
      if (!Number.isFinite(v) || v < min || v > max) {
        errors[k] = jp + "は" + min + "〜" + max + "の範囲で入力してください。";
      }
    });
    if (input.goalType != null && input.goalType !== "" && !C.HEALTH_GOAL_TYPES[input.goalType]) {
      errors.goalType = "目標タイプを選択してください。";
    }
    return { ok: Object.keys(errors).length === 0, errors };
  }

  function setHealthGoals(db, input) {
    const v = validateGoalInput(input);
    if (!v.ok) return { ok: false, errors: v.errors };
    db.healthGoals = {
      goalType: input.goalType && C.HEALTH_GOAL_TYPES[input.goalType] ? input.goalType : C.DEFAULT_GOAL_TYPE,
      calorieLimitKcal: Number(input.calorieLimitKcal),
      proteinGoalG: Number(input.proteinGoalG),
      exerciseMinutes: Number(input.exerciseMinutes),
      sleepHours: Number(input.sleepHours)
    };
    return { ok: true, goals: db.healthGoals };
  }

  /* ------------------------------------------------------------------ */
  /* 日次健康評価とEXP（M5）                                              */
  /* ------------------------------------------------------------------ */

  /**
   * 日付の健康スコアを計算する（各0〜2、合計0〜6）。
   * 目標との達成度で緩めに判定する（すぐ満点にせず、半分から許容）。
   * hasAny: 記録が1件でもあるか（未記録判定に使う）
   */
  function getDailyScores(db, date) {
    const goals = getHealthGoals(db);
    const meals = getMealTotals(db, date);
    const ex = getExerciseTotals(db, date);
    const sleep = getSleepOnDate(db, date);

    let meal = 0;
    if (meals.count > 0) {
      // 目標内なら2（ただしカロリーは1.1倍まで、蛋白は0.9倍までを許容＝厳しくしない）
      const inKcal = meals.kcal <= goals.calorieLimitKcal * 1.1;
      const inProtein = meals.protein >= goals.proteinGoalG * 0.9;
      meal = (inKcal && inProtein) ? 2 : 1; // 記録がある限り最低1点
    }
    let exercise = 0;
    if (ex.count > 0) {
      exercise = ex.minutes >= goals.exerciseMinutes * 0.8 ? 2 : 1; // 80%で満点、記録があれば最低1
    }
    let sleepScore = 0;
    if (sleep && sleep.hours != null) {
      // 目標の約9割から、1.3倍までを満点（少し短くてもOK。厳しくしない）
      const within = sleep.hours >= goals.sleepHours * 0.9 && sleep.hours <= goals.sleepHours * 1.3;
      sleepScore = within ? 2 : 1;
    }
    const hasAny = meals.count > 0 || ex.count > 0 || !!sleep;
    return {
      meal: meal,
      exercise: exercise,
      sleep: sleepScore,
      total: meal + exercise + sleepScore,
      hasAny: hasAny
    };
  }

  /** EXP表のキー（未記録なら none、なければ合計スコア） */
  function getExpKey(scores) {
    return scores.hasAny ? String(scores.total) : "none";
  }

  function getExpForScores(scores) {
    const v = C.SCORE_EXP_TABLE[getExpKey(scores)];
    return typeof v === "number" ? v : 0;
  }

  /**
   * 評価の状態を返す。
   * - granted: 確定済みか
   * - stored : 確定済みなら保存された評価
   * - preview: 未確定なら現在の記録から再計算したスコアとEXP
   */
  function getEvaluationState(db, date) {
    const stored = db.dailyEvaluations && db.dailyEvaluations[date];
    if (stored && stored.granted) {
      return { granted: true, stored: stored, preview: null };
    }
    const scores = getDailyScores(db, date);
    const exp = getExpForScores(scores);
    return {
      granted: false,
      stored: stored || null,
      preview: { scores: scores, total: scores.total, exp: exp }
    };
  }

  /**
   * 日次評価を確定し EXP を付与する。
   * - 二重付与はしない（granted 確定済みは拒否）
   * - 未来日付は不可
   * - currentPet.cumulativeExp / recordedDays を更新
   */
  function evaluateDay(db, date) {
    if (!U.parseDate(date)) return { ok: false, reason: "invalid_date", message: "日付が不正です。" };
    if (U.isFutureDate(date)) return { ok: false, reason: "future_date", message: "未来の日付は評価できません。" };
    if (!db.currentPet) return { ok: false, reason: "no_pet", message: "ペットが見つかりません。" };
    const st = getEvaluationState(db, date);
    if (st.granted) return { ok: false, reason: "already_granted", message: "この日の評価は確定済みです。" };
    const s = st.preview.scores;
    const exp = st.preview.exp;
    if (!db.dailyEvaluations) db.dailyEvaluations = {};
    db.dailyEvaluations[date] = {
      date: date,
      scores: { meal: s.meal, exercise: s.exercise, sleep: s.sleep },
      total: s.total,
      exp: exp,
      granted: true,
      cumulativeExpAtGrant: db.currentPet.cumulativeExp
    };
    db.currentPet.cumulativeExp += exp;
    db.currentPet.recordedDays = (db.currentPet.recordedDays || 0) + 1;
    return { ok: true, exp: exp, total: s.total, scores: db.dailyEvaluations[date].scores, cumulativeExp: db.currentPet.cumulativeExp };
  }

  /* ------------------------------------------------------------------ */
  /* 集約エクスポート                                                    */
  /* ------------------------------------------------------------------ */

  const KE_HEALTH = {
    MEAL_TYPE_ORDER,

    isValidRecordDate,

    // 食事
    getFoodById, searchFoods, calcFoodNutrients, validateMealInput,
    getMeals, addMeal, updateMeal, removeMeal, getMealTotals, buildMealRecord,
    validateCustomFood, addCustomFood, updateCustomFood, removeCustomFood, listCustomFoods,

    // 運動
    getExerciseById, searchExercises, calcExerciseCalories, validateExerciseInput,
    getExercises, addExercise, updateExercise, removeExercise, getExerciseTotals, buildExerciseRecord,
    validateCustomExercise, addCustomExercise, updateCustomExercise, removeCustomExercise,

    // 睡眠
    calcSleepHours, validateSleepInput, getSleepOnDate, saveSleep, removeSleep,

    // 体重・BMI・基礎代謝
    getWeightEntries, getRecentWeights, getLatestWeight, getWeightForCalculation,
    hasWeightOnDate, saveWeight, removeWeight, validateWeightInput, calcBMI, calcBMR,

    // 目標
    getHealthGoals, recommendGoals, validateGoalInput, setHealthGoals,

    // 日次評価・EXP
    getDailyScores, getExpKey, getExpForScores, getEvaluationState, evaluateDay
  };

  if (globalThis) globalThis.KE_HEALTH = KE_HEALTH;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_HEALTH };
})();
