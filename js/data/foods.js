"use strict";
/*
 * kenecho Village - プリセット食品（KE_FOODS）
 * 架空の参考データ。カロリー・栄養素は1食分（基準量）あたりの値です。
 * 本データは医療・栄養診断の基準ではなく、記録と学習のための目安です。
 *
 * FoodDef: { id, name, category, unitName, baseAmountGram, kcal, protein, fat, carbs }
 *   recipeCount: 収録目標 50件（M3 で収録・検証）
 */
(function () {
  const KE_FOODS = [
    // 主食
    // { id: "food_rice", name: "ごはん（茶碗1杯）", category: "staple", unitName: "杯", baseAmountGram: 150, kcal: 234, protein: 3.8, fat: 0.5, carbs: 53.4 },
    // ↑ 中身は M3（健康記録・食事）で収録するため、現在は骨格のみ。
  ];

  if (globalThis) globalThis.KE_FOODS = KE_FOODS;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_FOODS: KE_FOODS };
})();
