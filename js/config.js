"use strict";
/*
 * kenecho Village - 定数一覧（KE_CONFIG）
 * 成長閾値・目標初期値・EXP表・きずな度・関係段階など、仕様上の数値を一元管理する。
 * 実装・文書（docs/02_詳細設計書.md）と数値を一致させること。
 */
(function () {
  const KE_CONFIG = {
    /** データスキーマバージョン（db.js と連動） */
    SCHEMA_VERSION: 1,

    /** localStorage キー（専用名前空間） */
    LOCAL_STORAGE_KEY: "kenechoVillage.db.v1",
    CORRUPT_KEY_PREFIX: "kenechoVillage.db.corrupt.",

    /** アプリ表示 */
    APP_DISPLAY_NAME: "kenecho Village",
    APP_FORBIDDEN_LABEL: "研修用・本番利用不可",

    /** ---- 成長段階 ---- */
    STAGE_ORDER: ["egg", "child", "growing", "adult", "companion", "departure"],
    // 到達に必要な累計EXP。egg は孵化前、child は孵化イベントで到達。
    STAGE_EXP_THRESHOLDS: { egg: null, child: 0, growing: 150, adult: 450, companion: 800, departure: 1200 },
    // 孵化後の最低経過日数（child は孵化当日から）
    STAGE_MIN_DAYS: { egg: 0, child: 0, growing: 3, adult: 7, companion: 14, departure: 21 },
    DEPARTURE_MIN_PET_BOND: 60,
    STAGE_LABELS: {
      egg: "卵",
      child: "幼体",
      growing: "成長期",
      adult: "成体",
      companion: "陪伴期",
      departure: "旅立ち"
    },

    /** ---- 健康EXP ---- */
    DAILY_EXP_CAP: 100,
    // 健康スコア合計0〜6 → EXP。未記録（none）は0。
    SCORE_EXP_TABLE: { none: 0, 0: 15, 1: 25, 2: 40, 3: 55, 4: 70, 5: 85, 6: 100 },

    /** ---- 健康目標（未設定時の初期値）---- */
    HEALTH_GOAL_DEFAULTS: {
      calorieLimitKcal: 2000, // 1日の摂取カロリー上限 (kcal)
      proteinPerKg: 1.0,      // 蛋白質目標 = 体重kg × this (g)
      exerciseMinutes: 30,    // 1日の運動時間目標 (分)
      sleepHours: 7           // 1日の睡眠時間目標 (h)
    },

    /** ---- 健康目標タイプ（初期設定で選択、推薦値を算出）----
     * calorieDelta: BMRに対する摂取カロリー比（1.0 = 維持）
     * proteinPerKg: 蛋白質 = 体重kg × 係数
     * exerciseMinutes / sleepHours: タイプごとの推奨目標
     */
    HEALTH_GOAL_TYPES: {
      lose: { label: "減量", calorieRatio: 0.9, proteinPerKg: 1.6, exerciseMinutes: 45, sleepHours: 8, desc: "少し控えめな摂取と運動で、ゆるやかな減量をめざします" },
      gain: { label: "増量（体づくり）", calorieRatio: 1.1, proteinPerKg: 1.7, exerciseMinutes: 40, sleepHours: 8, desc: "エネルギーとたんぱく質をしっかりとり、からだづくりを応援します" },
      maintain: { label: "健康維持", calorieRatio: 1.0, proteinPerKg: 1.2, exerciseMinutes: 30, sleepHours: 7, desc: "無理のない範囲で、毎日の健康をキープします" }
    },
    /** 目標タイプ未選択時の既定 */
    DEFAULT_GOAL_TYPE: "maintain",

    /** ---- 状態「病気」（明らかに目標から外れた日のペナルティ）---- */
    SICK: {
      // 睡眠時間が目標のこの割合未満 → 重大な睡眠不足（※既存「眠そう」判定より深刻）
      SLEEP_RATIO_SICK: 0.25,
      // 摂取カロリーが目標以上にこの量（kcal）超えたら → 重度の過剰摂取
      CALORIE_OVER_KCAL: 1000,
      // 状態名・説明
      meta: { label: "体調不良", desc: "今日は大きな負担がありました。" }
    },

    /** ---- きずな度 ---- */
    BOND: {
      NPC_INITIAL: 40,   // NPCきずな度 初期値
      PET_INITIAL: 20,   // ペットきずな度 初期値（世代ごと）
      DELTA: { good: 8, short: 3, bad: -4 }, // 回答分類別のNPC変化量
      QUEST_CLEAR_PET: 2, // クエスト完了でのペット+2
      PET_WEIGHT: 0.4,    // 総合きずな度のペット重み
      NPC_WEIGHT: 0.6,    // 総合きずな度のNPC重み
      MIN: 0,
      MAX: 100,
      LEVELS: [
        { key: "stranger", max: 19, label: "出会ったばかり" },
        { key: "familiar", max: 39, label: "少し慣れてきた" },
        { key: "connected", max: 59, label: "心が通い始めた" },
        { key: "trusted", max: 79, label: "信頼し合っている" },
        { key: "partner", max: 100, label: "大切な仲間" }
      ]
    },

    /** ---- 健康スコア判定（各0〜2） ---- */
    SCORE: {
      MEAL_ZERO: "未記録", // 0点: 食事記録なし
      EXERCISE_ZERO: "未記録", // 0点: 運動記録なし
      SLEEP_ZERO: "未記録" // 0点: 睡眠記録なし
    },

    /** ---- 数量・入力範囲 ---- */
    AGE: { min: 18, max: 120, hint: "成人を対象に計算できる18〜120歳を入力してください" },
    HEIGHT: { min: 100, max: 300 }, // cm
    WEIGHT: { min: 20, max: 400 }, // kg
    MEAL_QUANTITY: { min: 0.1 }, // 基準分量に対する実摂取倍数（0より大きい）
    EXERCISE_MINUTES: { min: 1, max: 1440 },

    /** ---- 分類ラベル ---- */
    MEAL_TYPES: { breakfast: "朝食", lunch: "昼食", dinner: "夕食", snack: "間食" },
    GENDER_OPTIONS: { male: "男性", female: "女性" },
    ANSWER_TYPES: { good: "会話が続きやすい", short: "短いが自然", bad: "会話が続きにくい" },
    SCENE_CATEGORIES: { daily: "日常", work: "仕事", food: "食事・交流" },
    SCENE_BACKGROUNDS: { office: "職場", elevator: "エレベーター", breakroom: "休憩室", dining: "飲食", outdoor: "屋外" },
    NPC_PERSONALITIES: {
      gentle: "穏やか",
      cautious: "慎重",
      bright: "明るい",
      curious: "好奇心旺盛",
      concise: "簡潔",
      shy: "人見知り",
      caring: "世話好き",
      humorous: "ユーモア"
    },

    /** ---- ストーリー枠（導入・展開・応答・締め）----
     * ROLES: 練習4ターン / クエスト1ターン（open）の役割順。rounds のインデックスと対応。
     * WEIGHT_BONUS: 抽選時の重み加算の初期案。データ側の weight を基準に条件合致で加算する。
     */
    STORY: {
      ROLES: ["open", "develop", "respond", "close"],
      ROLE_LABELS: { open: "導入", develop: "展開", respond: "応答", close: "締め" },
      WEIGHT_BONUS: { category: 6, personality: 6, relation: 4, facet: 6, topic: 4 },
      DEFAULT_WEIGHT: 10,
      RECENT_KEEP: 8 // ストーリー枠の連続回避に使う直近ID保持数
    },

    /** ---- 回答の会話スキル（facet）----
     * 3択の「内容の型」。good/short/bad（きずな度軸）とは別軸で、会話スキル・記憶・連続性に使う。
     * 丁寧な断り自体は減点理由にしない（type は文脈と対案の有無で good/short へ振る）。
     */
    ANSWER_FACETS: {
      empathy: "共感",
      question: "質問",
      self_disclose: "自己開示",
      polite_decline: "丁寧な断り",
      natural_close: "自然な終了",
      promise: "約束",
      onward: "会話を続ける",
      avoid: "回避・そらす"
    }
  };

  if (globalThis) globalThis.KE_CONFIG = KE_CONFIG;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_CONFIG: KE_CONFIG };
})();
