"use strict";
const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
const { KE_DB } = require(path.join(root, "db.js"));

/** テスト用の単純な localStorage モック */
function makeMockStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    _map: map
  };
}

let storage;
beforeEach(() => {
  // 各テストは必ず空のストレージから開始する（load()/resetData() はテスト内で明示的に呼ぶ）
  storage = makeMockStorage();
  globalThis.localStorage = storage;
});
afterEach(() => {
  delete globalThis.localStorage;
});

test("defaultData がスキーマの必須キーを持つ", () => {
  const d = KE_DB.defaultData();
  assert.equal(d.schemaVersion, 1);
  for (const k of ["profile", "settings", "healthGoals", "foods", "exercises", "healthRecords",
    "dailyEvaluations", "currentPet", "petMemories", "petEncyclopedia", "relationships",
    "conversation", "relationshipHistory"]) {
    assert.ok(k in d, "missing key: " + k);
  }
  assert.equal(d.currentPet, null);
  assert.deepEqual(d.foods, { meals: {} });
});

test("空ストレージでは new、初期データが返る", () => {
  const result = KE_DB.load();
  assert.equal(result, "new");
  assert.equal(KE_DB.get().schemaVersion, 1);
  assert.equal(KE_DB.hasProfile(), false);
});

test("save → load でラウンドトリップできる", () => {
  const d = KE_DB.get();
  d.profile = { displayName: "高橋 翔太", age: 23, gender: "male", heightCm: 170, weightKg: 65, profileId: "p_test" };
  assert.equal(KE_DB.save(), true);
  assert.ok(storage.getItem(KE_CONFIG_LOCAL_STORAGE_KEY()));

  const result = KE_DB.load();
  assert.equal(result, "loaded");
  assert.equal(KE_DB.get().profile.displayName, "高橋 翔太");
  assert.equal(KE_DB.hasProfile(), true);
});

function KE_CONFIG_LOCAL_STORAGE_KEY() {
  // モジュールを2回 require しないよう、保存に使われるキーは設定から取得
  return globalThis.KE_CONFIG.LOCAL_STORAGE_KEY;
}

test("validateSchema が破損を検出する", () => {
  assert.equal(KE_DB.validateSchema(null), false);
  assert.equal(KE_DB.validateSchema("text"), false);
  assert.equal(KE_DB.validateSchema([1, 2]), false);
  assert.equal(KE_DB.validateSchema({ schemaVersion: "v1" }), false);
  const d = KE_DB.defaultData();
  assert.equal(KE_DB.validateSchema(d), true);
  delete d.conversation;
  assert.equal(KE_DB.validateSchema(d), false);
});

test("JSON 破損データは隔離後に初期値で起動する", () => {
  storage.setItem(globalThis.KE_CONFIG.LOCAL_STORAGE_KEY, "{broken json!!");
  const result = KE_DB.load();
  assert.equal(result, "quarantined");
  assert.equal(KE_DB.get().schemaVersion, 1);
  // 隔離キーに退避されている
  let quarantined = 0;
  for (const key of storage._map.keys()) {
    if (key.startsWith(globalThis.KE_CONFIG.CORRUPT_KEY_PREFIX)) quarantined++;
  }
  assert.ok(quarantined >= 1, "隔離キーが存在すること");
});

test("resetData がスキーマを初期状態へ戻す", () => {
  const d = KE_DB.get();
  d.profile = { profileId: "x" };
  KE_DB.save();
  KE_DB.resetData();
  assert.equal(KE_DB.get().profile, null);
  assert.equal(storage.getItem(globalThis.KE_CONFIG.LOCAL_STORAGE_KEY) !== null, true);
});

test("canSerialize が循環参照等を検出できる", () => {
  const ok = { a: 1 };
  assert.equal(KE_DB.canSerialize(ok), true);
  const circular = {};
  circular.self = circular;
  assert.equal(KE_DB.canSerialize(circular), false);
});
