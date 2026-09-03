"use strict";
/*
 * kenecho Village - プリセット食品（KE_FOODS）50件
 * 架空の参考データです。栄養値は「基準分量（baseAmountGram）あたり」で、
 * 医療・栄養管理の基準ではなく、記録と学習のための目安値です。
 *
 * FoodDef: { id, name, category, unitName, baseAmountGram, kcal, protein, fat, carbs }
 *   category: 主食 / 主菜 / 副菜 / 汁物 / 乳製品 / 果物 / 菓子 / 飲み物
 */
(function () {
  const KE_FOODS = [
    // ---- 主食 ----
    { id: "food_rice01", name: "ごはん（茶碗1杯）", category: "主食", unitName: "杯", baseAmountGram: 150, kcal: 234, protein: 3.8, fat: 0.5, carbs: 53.4 },
    { id: "food_rice02", name: "おにぎり（具なし）", category: "主食", unitName: "個", baseAmountGram: 110, kcal: 165, protein: 3.0, fat: 0.6, carbs: 36.0 },
    { id: "food_bread01", name: "食パン（6枚切り1枚）", category: "主食", unitName: "枚", baseAmountGram: 60, kcal: 149, protein: 4.5, fat: 2.5, carbs: 26.0 },
    { id: "food_bread02", name: "ロールパン1個", category: "主食", unitName: "個", baseAmountGram: 30, kcal: 90, protein: 3.0, fat: 2.2, carbs: 14.5 },
    { id: "food_noodle01", name: "ゆでうどん1玉", category: "主食", unitName: "玉", baseAmountGram: 220, kcal: 260, protein: 6.0, fat: 1.5, carbs: 56.0 },
    { id: "food_noodle02", name: "ゆでそば1束", category: "主食", unitName: "束", baseAmountGram: 200, kcal: 260, protein: 9.0, fat: 2.0, carbs: 50.0 },
    { id: "food_noodle03", name: "そうめん（ゆで）1束", category: "主食", unitName: "束", baseAmountGram: 150, kcal: 200, protein: 5.5, fat: 1.2, carbs: 41.0 },
    { id: "food_mochi", name: "もち1個", category: "主食", unitName: "個", baseAmountGram: 50, kcal: 112, protein: 1.8, fat: 0.3, carbs: 25.0 },
    { id: "food_cereal", name: "コーンフレーク", category: "主食", unitName: "袋", baseAmountGram: 30, kcal: 116, protein: 2.5, fat: 0.3, carbs: 25.0 },

    // ---- 主菜 ----
    { id: "food_sakana01", name: "焼き魚（さば1切れ）", category: "主菜", unitName: "切れ", baseAmountGram: 70, kcal: 131, protein: 14.0, fat: 7.8, carbs: 0.1 },
    { id: "food_karaage", name: "鶏のから揚げ（4個）", category: "主菜", unitName: "個", baseAmountGram: 100, kcal: 290, protein: 16.0, fat: 21.0, carbs: 8.0 },
    { id: "food_hamburg", name: "ハンバーグ1個", category: "主菜", unitName: "個", baseAmountGram: 120, kcal: 280, protein: 18.0, fat: 19.0, carbs: 10.0 },
    { id: "food_shogayaki", name: "豚のしょうが焼き", category: "主菜", unitName: "人前", baseAmountGram: 100, kcal: 260, protein: 16.0, fat: 18.0, carbs: 9.0 },
    { id: "food_tamagoyaki", name: "卵焼き（卵1個分）", category: "主菜", unitName: "人前", baseAmountGram: 50, kcal: 90, protein: 6.0, fat: 6.5, carbs: 1.5 },
    { id: "food_medamayaki", name: "目玉焼き（卵1個）", category: "主菜", unitName: "個", baseAmountGram: 50, kcal: 86, protein: 6.0, fat: 6.0, carbs: 0.3 },
    { id: "food_tofuh", name: "豆腐ハンバーグ1個", category: "主菜", unitName: "個", baseAmountGram: 120, kcal: 190, protein: 14.0, fat: 9.0, carbs: 13.0 },
    { id: "food_nikujaga", name: "肉じゃが（1人分）", category: "主菜", unitName: "人前", baseAmountGram: 150, kcal: 160, protein: 7.5, fat: 5.5, carbs: 20.5 },
    { id: "food_curry", name: "カレーライス", category: "主菜", unitName: "人前", baseAmountGram: 350, kcal: 580, protein: 16.0, fat: 18.0, carbs: 88.0 },
    { id: "food_chicken", name: "ゆで鶏のグリル", category: "主菜", unitName: "人前", baseAmountGram: 100, kcal: 190, protein: 22.0, fat: 10.0, carbs: 1.0 },

    // ---- 副菜 ----
    { id: "food_hourenso", name: "ほうれん草のおひたし", category: "副菜", unitName: "人前", baseAmountGram: 80, kcal: 35, protein: 2.0, fat: 0.4, carbs: 6.0 },
    { id: "food_asazuke", name: "きゅうりの浅づけ", category: "副菜", unitName: "人前", baseAmountGram: 50, kcal: 6, protein: 0.4, fat: 0, carbs: 1.3 },
    { id: "food_potesara", name: "ポテトサラダ", category: "副菜", unitName: "人前", baseAmountGram: 100, kcal: 150, protein: 2.5, fat: 10.0, carbs: 13.0 },
    { id: "food_yasaiitame", name: "野菜炒め", category: "副菜", unitName: "人前", baseAmountGram: 120, kcal: 80, protein: 3.0, fat: 4.5, carbs: 7.0 },
    { id: "food_edamame", name: "枝豆（さや付き）", category: "副菜", unitName: "人前", baseAmountGram: 80, kcal: 60, protein: 4.5, fat: 2.0, carbs: 5.5 },
    { id: "food_salad", name: "グリーンサラダ", category: "副菜", unitName: "人前", baseAmountGram: 100, kcal: 35, protein: 1.5, fat: 0.3, carbs: 7.0 },

    // ---- 汁物 ----
    { id: "food_misoshiru", name: "味噌汁1杯", category: "汁物", unitName: "杯", baseAmountGram: 160, kcal: 40, protein: 2.5, fat: 1.5, carbs: 5.0 },
    { id: "food_consome", name: "コンソメスープ1杯", category: "汁物", unitName: "杯", baseAmountGram: 150, kcal: 20, protein: 1.0, fat: 0.5, carbs: 3.0 },
    { id: "food_tonjiru", name: "豚汁1杯", category: "汁物", unitName: "杯", baseAmountGram: 200, kcal: 120, protein: 6.0, fat: 6.0, carbs: 10.0 },

    // ---- 乳製品・大豆 ----
    { id: "food_milk", name: "牛乳1杯", category: "乳製品", unitName: "杯", baseAmountGram: 200, kcal: 134, protein: 6.6, fat: 7.6, carbs: 9.6 },
    { id: "food_yogurt", name: "ヨーグルト（無糖）", category: "乳製品", unitName: "個", baseAmountGram: 100, kcal: 62, protein: 3.6, fat: 3.0, carbs: 4.9 },
    { id: "food_cheese", name: "チーズ1切れ", category: "乳製品", unitName: "切れ", baseAmountGram: 20, kcal: 70, protein: 4.0, fat: 5.8, carbs: 0.3 },
    { id: "food_tonyu", name: "豆乳1杯", category: "乳製品", unitName: "杯", baseAmountGram: 200, kcal: 90, protein: 6.0, fat: 4.0, carbs: 8.0 },
    { id: "food_natto", name: "納豆1パック", category: "乳製品", unitName: "パック", baseAmountGram: 50, kcal: 100, protein: 8.2, fat: 5.0, carbs: 6.0 },

    // ---- 果物 ----
    { id: "food_ringo", name: "りんご1個", category: "果物", unitName: "個", baseAmountGram: 250, kcal: 120, protein: 0.5, fat: 0.8, carbs: 30.0 },
    { id: "food_banana", name: "バナナ1本", category: "果物", unitName: "本", baseAmountGram: 100, kcal: 86, protein: 1.1, fat: 0.2, carbs: 21.4 },
    { id: "food_mikan", name: "みかん1個", category: "果物", unitName: "個", baseAmountGram: 80, kcal: 37, protein: 0.6, fat: 0.1, carbs: 9.2 },
    { id: "food_budou", name: "ぶどう1房", category: "果物", unitName: "房", baseAmountGram: 120, kcal: 75, protein: 0.6, fat: 0.1, carbs: 18.5 },
    { id: "food_ichigo", name: "いちご5粒", category: "果物", unitName: "粒", baseAmountGram: 50, kcal: 18, protein: 0.5, fat: 0.2, carbs: 4.5 },

    // ---- 菓子・デザート ----
    { id: "food_yokan", name: "ようかん1個", category: "菓子", unitName: "個", baseAmountGram: 50, kcal: 128, protein: 1.5, fat: 0.3, carbs: 30.0 },
    { id: "food_cookie", name: "クッキー2枚", category: "菓子", unitName: "枚", baseAmountGram: 20, kcal: 100, protein: 1.2, fat: 5.0, carbs: 13.0 },
    { id: "food_ice", name: "バニラアイス", category: "菓子", unitName: "カップ", baseAmountGram: 100, kcal: 210, protein: 3.5, fat: 10.0, carbs: 20.0 },
    { id: "food_donut", name: "ドーナツ1個", category: "菓子", unitName: "個", baseAmountGram: 60, kcal: 240, protein: 3.0, fat: 14.0, carbs: 25.0 },
    { id: "food_chips", name: "ポテトチップス", category: "菓子", unitName: "袋", baseAmountGram: 30, kcal: 170, protein: 2.0, fat: 11.0, carbs: 16.0 },
    { id: "food_choco", name: "板チョコ1枚", category: "菓子", unitName: "枚", baseAmountGram: 50, kcal: 280, protein: 3.5, fat: 17.0, carbs: 28.0 },

    // ---- 飲み物 ----
    { id: "food_greentea", name: "緑茶（ペットボトル）", category: "飲み物", unitName: "本", baseAmountGram: 500, kcal: 0, protein: 0, fat: 0, carbs: 0 },
    { id: "food_blackcoffee", name: "ブラックコーヒー", category: "飲み物", unitName: "杯", baseAmountGram: 200, kcal: 4, protein: 0.2, fat: 0, carbs: 1.0 },
    { id: "food_milkcoffee", name: "缶コーヒー（ミルク入り）", category: "飲み物", unitName: "本", baseAmountGram: 190, kcal: 66, protein: 1.2, fat: 1.8, carbs: 11.0 },
    { id: "food_orange", name: "オレンジジュース", category: "飲み物", unitName: "杯", baseAmountGram: 200, kcal: 90, protein: 0.8, fat: 0.2, carbs: 21.5 },
    { id: "food_soda", name: "炭酸飲料", category: "飲み物", unitName: "本", baseAmountGram: 250, kcal: 110, protein: 0, fat: 0, carbs: 27.0 },
    { id: "food_beer", name: "ビール（中瓶）", category: "飲み物", unitName: "本", baseAmountGram: 350, kcal: 140, protein: 1.0, fat: 0, carbs: 11.0 }
  ];

  if (globalThis) globalThis.KE_FOODS = KE_FOODS;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_FOODS: KE_FOODS };
})();
