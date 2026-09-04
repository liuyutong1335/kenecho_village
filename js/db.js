"use strict";
/*
 * kenecho Village - データベース層（KE_DB）
 * localStorage への統一スキーマ保存・復元・破損データ隔離・初期化を担う。
 * - 保存キーは KE_CONFIG.LOCAL_STORAGE_KEY（専用名前空間）のみ。
 * - 破損・スキーマ不一致は隔離キーへ退避して安全な初期値で起動する。
 * - Node テストからは globalThis.localStorage へモックを注入して利用する。
 */
(function () {
  const C = globalThis.KE_CONFIG;
  const U = globalThis.KE_UTIL;

  /** ブラウザの localStorage を取得。無い場合（Node等）は内部メモリへフォールバック */
  function getStorage() {
    try {
      if (globalThis.localStorage) return globalThis.localStorage;
    } catch (e) {
      /* アクセス不可（プライバシーモード等）は null */
    }
    return null;
  }

  const memoryStore = {};

  function rawGet(key) {
    const s = getStorage();
    if (s) {
      try {
        return s.getItem(key);
      } catch (e) {
        return null;
      }
    }
    return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
  }

  function rawSet(key, value) {
    const s = getStorage();
    if (s) {
      try {
        s.setItem(key, value);
        return true;
      } catch (e) {
        return false; // 容量超過・無効化など
      }
    }
    memoryStore[key] = value;
    return true;
  }

  function rawRemove(key) {
    const s = getStorage();
    if (s) {
      try {
        s.removeItem(key);
      } catch (e) {
        /* 握る */
      }
    } else {
      delete memoryStore[key];
    }
  }

  /** 新しい初期スキーマのオブジェクトを作る（毎回独立した値） */
  function defaultData() {
    return {
      schemaVersion: C.SCHEMA_VERSION,
      profile: null, // { displayName, age, gender, heightCm, weightKg, profileId }
      settings: {},
      healthGoals: {}, // 未設定なら画面は初期値（KE_CONFIG.HEALTH_GOAL_DEFAULTS）を利用
      foods: { meals: {} }, // "YYYY-MM-DD" -> MealRecord[]
      exercises: {}, // "YYYY-MM-DD" -> ExerciseRecord[]
      healthRecords: { sleep: {}, weight: {} }, // sleep: date -> {sleepAt,wakeAt,hours} / weight: date -> {kg}
      dailyEvaluations: {}, // date -> { date, scores, total, exp, cumulated, granted }
      customFoods: [], // FoodDef[]
      customExercises: [], // ExerciseDef[]
      currentPet: null, // PetState（詳細設計参照）
      petMemories: [],
      petEncyclopedia: {}, // speciesId -> { discovered, discoveredAt }
      relationships: { pet: {}, npcs: {} }, // pet: gen -> {bond, questsCompleted} / npcs: npcId -> {bond, conversations, lastTalkedAt, unlockedEvents}
      conversation: { dailyQuestDate: null, dailyQuestCompleted: false, recentDialogueIds: [], unlockedSceneIds: [], recentStoryIds: [], lastOutingNpcId: null },
      relationshipHistory: [], // { at, key, delta, from, to, why }
      npcMemory: {} // "<profileId>:<npcId>" -> NpcMemory（NPC別の会話記憶・約束・期待。世代を超えて維持）
    };
  }

  /** 破損データを隔離キーへ移動したうえで結果を返す（true=隔離した） */
  function quarantine(reason) {
    const raw = rawGet(C.LOCAL_STORAGE_KEY);
    if (raw == null) return true;
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const key = C.CORRUPT_KEY_PREFIX + ts;
    if (rawSet(key, raw)) {
      rawRemove(C.LOCAL_STORAGE_KEY);
    }
    if (globalThis.console && console.warn) console.warn("[KE_DB] データを隔離しました:", reason, "->", key);
    return true;
  }

  /**
   * スキーマ検証。致命的な構造（オブジェクトでない・schemaVersion不一致・
   * 必須トップレベルキー欠落）を検出したら false。
   * 個別フィールドの欠損はマイグレーション（migrate）で初期値補完する。
   */
  function validateSchema(data) {
    if (data === null || typeof data !== "object" || Array.isArray(data)) return false;
    if (typeof data.schemaVersion !== "number") return false;
    if (data.schemaVersion !== C.SCHEMA_VERSION) return false;
    const required = ["profile", "settings", "healthGoals", "foods", "exercises", "healthRecords",
      "dailyEvaluations", "customFoods", "customExercises", "currentPet", "petMemories",
      "petEncyclopedia", "relationships", "conversation", "relationshipHistory"];
    for (let i = 0; i < required.length; i++) {
      if (!(required[i] in data)) return false;
    }
    return true;
  }

  /** 不正な値の緩和復旧。安全でない個所へ初期値を充てる（バージョン維持を優先） */
  function migrate(data) {
    const base = defaultData();
    const out = base;
    out.schemaVersion = data.schemaVersion;
    out.profile = data.profile && typeof data.profile === "object" ? data.profile : null;
    out.settings = data.settings && typeof data.settings === "object" ? data.settings : {};
    out.healthGoals = data.healthGoals && typeof data.healthGoals === "object" ? data.healthGoals : {};
    out.foods = data.foods && typeof data.foods === "object" && data.foods.meals ? data.foods : base.foods;
    out.exercises = data.exercises && typeof data.exercises === "object" ? data.exercises : {};
    out.healthRecords = data.healthRecords && typeof data.healthRecords === "object" ? data.healthRecords : { sleep: {}, weight: {} };
    out.dailyEvaluations = data.dailyEvaluations && typeof data.dailyEvaluations === "object" ? data.dailyEvaluations : {};
    out.customFoods = Array.isArray(data.customFoods) ? data.customFoods : [];
    out.customExercises = Array.isArray(data.customExercises) ? data.customExercises : [];
    // currentPet は保存値を保持する（最小限の形だけチェック。厳格化は段階的に）
    out.currentPet = data.currentPet && typeof data.currentPet === "object" ? data.currentPet : null;
    out.petMemories = Array.isArray(data.petMemories) ? data.petMemories : [];
    out.petEncyclopedia = data.petEncyclopedia && typeof data.petEncyclopedia === "object" ? data.petEncyclopedia : {};
    out.relationships = data.relationships && typeof data.relationships === "object" ? data.relationships : { pet: {}, npcs: {} };
    out.conversation = data.conversation && typeof data.conversation === "object" ? Object.assign({}, defaultData().conversation, data.conversation) : defaultData().conversation;
    out.relationshipHistory = Array.isArray(data.relationshipHistory) ? data.relationshipHistory : [];
    out.npcMemory = data.npcMemory && typeof data.npcMemory === "object" && !Array.isArray(data.npcMemory) ? data.npcMemory : {};
    return out;
  }

  const state = { data: null };

  /** 起動時読込。破損なら隔離後に初期値。戻り値はロード結果の説明文字列 */
  function load() {
    const raw = rawGet(C.LOCAL_STORAGE_KEY);
    if (raw == null) {
      state.data = defaultData();
      return "new";
    }
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      quarantine("JSONパース失敗");
      state.data = defaultData();
      return "quarantined";
    }
    if (!validateSchema(parsed)) {
      quarantine("スキーマ不一致または構造不正");
      state.data = defaultData();
      return "quarantined";
    }
    state.data = migrate(parsed);
    return "loaded";
  }

  /** 現在のデータ参照を返す（変更後は必ず save する） */
  function get() {
    if (!state.data) load();
    return state.data;
  }

  /** 現在のスナップショットを localStorage へ保存。成功 true / 失敗 false */
  function save() {
    if (!state.data) return false;
    try {
      const text = JSON.stringify(state.data);
      return rawSet(C.LOCAL_STORAGE_KEY, text);
    } catch (e) {
      return false;
    }
  }

  /** 深いコピー */
  function clone(obj) {
    return obj === undefined ? undefined : JSON.parse(JSON.stringify(obj));
  }

  /** データ初期化（呼び出し側で確認モーダルを通すこと） */
  function resetData() {
    rawRemove(C.LOCAL_STORAGE_KEY);
    state.data = defaultData();
    return save();
  }

  /** 保存失敗時に直前の内容を失わないよう、serialized で検証する補助 */
  function canSerialize(obj) {
    try {
      JSON.stringify(obj);
      return true;
    } catch (e) {
      return false;
    }
  }

  /** プロフィール有無 */
  function hasProfile() {
    const d = get();
    return !!(d && d.profile && d.profile.profileId);
  }

  const KE_DB = {
    defaultData: defaultData,
    validateSchema: validateSchema,
    migrate: migrate,
    quarantine: quarantine,
    load: load,
    get: get,
    save: save,
    clone: clone,
    resetData: resetData,
    canSerialize: canSerialize,
    hasProfile: hasProfile
  };

  if (globalThis) globalThis.KE_DB = KE_DB;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_DB: KE_DB };
})();
