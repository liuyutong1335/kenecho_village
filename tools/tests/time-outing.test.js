"use strict";
/*
 * 外出の時間帯・天気・場面選択（feat/time-aware-outing）テスト。
 * - 時間帯の境界（朝/昼/夕方/夜/深夜）
 * - 朝に職場内が出ない／場面ごとの時間帯制約・安全場面フォールバック
 * - 天気の重み付き抽選（乱数固定）
 * - 外出状態の保存・復元と「途中で時刻が変わっても場面を切替えない」
 * - 練習モードは外出状態を変更しない
 * - 報酬の二重加算防止（クエスト1日1回ガード）
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "relationship-rules.js"));
require(path.join(root, "data", "npc-data.js"));
require(path.join(root, "data", "pets.js"));
require(path.join(root, "data", "pet-coach-speech.js"));
require(path.join(root, "data", "conversation-scenes.js"));
require(path.join(root, "data", "story-lines.js"));
require(path.join(root, "data", "foods.js"));
require(path.join(root, "data", "exercises.js"));
require(path.join(root, "health.js"));
require(path.join(root, "pet-game.js"));
require(path.join(root, "relationship.js"));
require(path.join(root, "npc-memory.js"));
require(path.join(root, "dialogue-engine.js"));
const { KE_OUTING: OUT } = require(path.join(root, "outings.js"));
const { KE_CONVERSATION: CONV } = require(path.join(root, "conversation-game.js"));
const { KE_DB } = require(path.join(root, "db.js"));

const C = globalThis.KE_CONFIG;
const SCENES = globalThis.KE_SCENES;
const WEATHER_KEYS = Object.keys(C.OUTING.WEATHER);

function mkDb() {
  const d = KE_DB.defaultData();
  d.profile = { displayName: "高橋 翔太", age: 23, gender: "male", heightCm: 170, weightKg: 65, profileId: "p_test" };
  d.currentPet = { generationId: "gen_001", name: "モモ", speciesId: "rabbit", speciesRevealed: true, stage: "child", recentDialogueIds: [], lastQuestDate: null, cumulativeExp: 0, questDays: 0, petBond: 20 };
  return d;
}
function minDate(m) {
  const d = new Date(2026, 8, 6, 0, 0, 0);
  d.setMinutes(m);
  return d;
}

test("時間帯の境界（朝/昼/夕方/夜/深夜）", () => {
  const expect = function (m, key) {
    assert.equal(OUT.getTimeBand(m), key, m + "分 → " + key);
  };
  expect(299, "late_night");
  expect(0, "late_night");
  expect(300, "morning");   // 05:00
  expect(659, "morning");   // 10:59
  expect(660, "daytime");   // 11:00
  expect(959, "daytime");   // 15:59
  expect(960, "evening");   // 16:00
  expect(1139, "evening");  // 18:59
  expect(1140, "night");    // 19:00
  expect(1379, "night");    // 22:59
  expect(1380, "late_night"); // 23:00
  expect(1439, "late_night");
});

test("朝に職場内（office/elevator/breakroom）の場面は出ない", () => {
  const officeBg = ["office", "elevator", "breakroom"];
  SCENES.forEach((s) => {
    const bands = C.OUTING.SCENE_BANDS[s.id];
    if (bands && bands.indexOf("morning") >= 0) {
      assert.ok(officeBg.indexOf(s.background) < 0, s.id + " は朝に職場内に出ない");
    }
  });
  // 場面ごとの時間帯制約
  assert.equal(OUT.bandAllowed("scn_001", "daytime"), true);
  assert.equal(OUT.bandAllowed("scn_001", "morning"), false);
  assert.equal(OUT.bandAllowed("scn_013", "morning"), true);
  assert.equal(OUT.bandAllowed("scn_013", "night"), false);
  // 未指定（存在しないID）は全時間帯で可
  assert.equal(OUT.bandAllowed("scn_999", "morning"), true);
});

test("深夜で該当場面が無いときは安全な場面（または利用可能な場面）へフォールバック", () => {
  const d = mkDb();
  // 今野さん（パン屋＝朝・昼）だけ発見：夜/深夜の候補は無い
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_konno");
  const joined = OUT.pickSceneForOuting(d, minDate(1380), () => 0); // 深夜
  assert.ok(joined.scene, "深夜でも場面が選ばれる");
  // 花田さん（残業＝夜/深夜）も発見していれば深夜の安全場面（scn_010）が出る
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_hanada");
  const joinedSafe = OUT.pickSceneForOuting(d, minDate(1380), () => 0);
  assert.equal(joinedSafe.scene.id, "scn_010", "深夜の安全場面へフォールバック");
});

test("時間帯に合う場面を選び、直近に会ったNPCの場面を優先する（乱数固定）", () => {
  const d = mkDb();
  // 佐藤（昼のみ・office）と鈴木（朝・夕など outdoor）を発見
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_suzuki");
  d.conversation.lastOutingNpcId = "npc_suzuki";
  // 朝 → 直近の鈴木の屋外場面（scn_013 等）
  const morning = OUT.pickSceneForOuting(d, minDate(360), () => 0);
  assert.equal(morning.band, "morning");
  assert.equal(morning.scene.npcId, "npc_suzuki");
  // 昼 → 直近を佐藤に変えると office 場面が選ばれる
  d.conversation.lastOutingNpcId = "npc_sato";
  const daytime = OUT.pickSceneForOuting(d, minDate(660), () => 0);
  assert.equal(daytime.band, "daytime");
  assert.equal(daytime.scene.npcId, "npc_sato");
});

test("天気は時間帯の重みで抽選され、乱数で固定できる", () => {
  const r1 = OUT.pickWeather("morning", () => 0);
  assert.ok(WEATHER_KEYS.indexOf(r1) >= 0);
  // 重みの合計が正・天気キーが有効
  const w = C.OUTING.WEATHER_WEIGHTS.morning;
  assert.equal(Object.keys(w).length, WEATHER_KEYS.length);
  const sum = Object.keys(w).reduce((a, k) => a + w[k], 0);
  assert.equal(sum, 100);
});

test("外出状態を保存し、復元後に同じ場面が維持される（時刻が変わっても切替えない）", () => {
  const d = mkDb();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_suzuki");
  const st = OUT.startOutingState(d, minDate(300), () => 0); // 朝05:00
  assert.ok(st, "外出状態が作られる");
  assert.equal(st.timeBand, "morning");
  assert.ok(WEATHER_KEYS.indexOf(st.weather) >= 0);
  assert.ok(st.sceneId && st.npcId);
  assert.equal(d.conversation.outing.date, "2026-09-06");

  // 保存・復元（JSONラウンドトリップ）後も同じ場面
  const clone = JSON.parse(JSON.stringify(d));
  const today = "2026-09-06";
  const sc = OUT.getTodayScene(clone, today);
  assert.ok(sc && sc.id === st.sceneId, "復元後も同じ場面");
  // 途中で時刻が昼になっても場面は切替えない（固定条件）
  const sc2 = OUT.getTodayScene(clone, today);
  assert.equal(sc2.id, st.sceneId);
  // 日付が変われば固定は無効（新たな外出で選び直す）
  assert.equal(OUT.getTodayScene(clone, "2026-09-07"), null);
});

test("練習モードでは外出状態を変更しない", () => {
  const d = mkDb();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  OUT.startOutingState(d, minDate(660), () => 0);
  const before = JSON.stringify(d.conversation.outing);
  const sc = OUT.getTodayScene(d, "2026-09-06");
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      const ev = CONV.evaluateRoundAnswer(sc.rounds[i], j);
      assert.equal(ev.ok, true);
    }
  }
  assert.equal(JSON.stringify(d.conversation.outing), before);
});

test("報酬の二重加算防止：外出で固定した場面を同日再プレイしてもきずな度は1回しか更新されない", () => {
  const d = mkDb();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  OUT.startOutingState(d, minDate(660), () => 0);
  const sc = OUT.getTodayScene(d, "2026-09-06");
  const goodIdx = sc.rounds[0].answers.findIndex((a) => a.type === "good");
  const r1 = CONV.completeDailyQuest(d, sc.id, goodIdx, "2026-09-06", sc.rounds[0]);
  assert.equal(r1.updates.applied, true);
  const after1 = globalThis.KE_RELATIONSHIP.getNpcState(d, "npc_sato").bond;
  const r2 = CONV.completeDailyQuest(d, sc.id, goodIdx, "2026-09-06", sc.rounds[0]);
  assert.equal(r2.updates.applied, false);
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcState(d, "npc_sato").bond, after1);
});

test("天気に紐づくストーリー回合が抽選で活用される（乱数固定）", () => {
  const d = mkDb();
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_suzuki");
  const scene = SCENES.find((s) => s.id === "scn_013");
  // 雨の日 → rain 専用の open 回合が候補に入る（他の汎用 open 板は直近使用で除外）
  const r = CONV.pickQuestRound(d, scene, ["story_open_daily_001", "story_open_fallback_001"], () => 0, "rain");
  assert.equal(r.source, "story");
  assert.equal(r.id, "story_open_rain_001");
  assert.ok(r.round.npcLine.indexOf("雨") >= 0, "雨の回合が選ばれる");
});
