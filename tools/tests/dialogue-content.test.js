"use strict";
/*
 * 会話データ拡張（feat/dialogue-content-expansion）の検証テスト。
 * - シーン件数（カテゴリ別フロア）・ID一意・NPC参照・4回合3択・facet・条件の整合
 * - NPC sceneIds の全シーン割当と SCENE_BANDS 網羅
 * - 時間帯ルール（朝＝職場内なし）の維持
 * - ストーリー枠の (役割×カテゴリ) 候補の最低件数（要件2件以上）
 * - 助言の総数・ペット種別の最低件数
 * フロア値は拡張の進行に合わせて引き上げる（最終目標: シーン各カテゴリ20・計60 / 助言各ペット50以上）。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
["config", "util", "data/relationship-rules", "data/npc-data", "data/pets", "data/pet-coach-speech",
  "data/conversation-scenes", "data/story-lines", "data/foods", "data/exercises",
  "health", "pet-game", "relationship", "dialogue-engine", "conversation-game", "db", "npc-memory", "outings"].forEach((m) => {
  require(path.join(root, m + ".js"));
});

const C = globalThis.KE_CONFIG;
const SCENES = globalThis.KE_SCENES;
const NPCS = globalThis.KE_NPCS;
const STORY = globalThis.KE_STORY_LINES;
const ADVICE = globalThis.KE_COACH_SPEECH;

/* 進行に応じて引き上げるフロア（最終: 20/20/20・60 / 各ペット50 / 助言300） */
const FLOORS = {
  totalScenes: 43,
  byCategory: { daily: 15, work: 15, food: 13 },
  storyPerRoleCategory: 2,
  adviceTotal: 164,
  advicePerSpecies: 22
};

const CATEGORIES = ["daily", "work", "food"];

test("会話シーンの件数フロア（各カテゴリ）とID一意・NPC参照", () => {
  assert.ok(SCENES.length >= FLOORS.totalScenes, "総シーン " + SCENES.length + "（フロア " + FLOORS.totalScenes + "）");
  const ids = new Set(SCENES.map((s) => s.id));
  assert.equal(ids.size, SCENES.length, "シーンID一意");
  const npcIds = new Set(NPCS.map((n) => n.id));
  CATEGORIES.forEach((cat) => {
    const list = SCENES.filter((s) => s.category === cat);
    assert.ok(list.length >= FLOORS.byCategory[cat], cat + " シーン " + list.length + "（フロア " + FLOORS.byCategory[cat] + "）");
  });
  SCENES.forEach((s) => {
    assert.ok(npcIds.has(s.npcId), s.id + " のNPC参照不正");
    assert.equal(s.rounds.length, 4, s.id + " は4回合");
    s.rounds.forEach((r) => {
      assert.equal(r.answers.length, 3, s.id + " は3択");
      r.answers.forEach((a) => {
        assert.ok(["good", "short", "bad"].indexOf(a.type) >= 0, s.id + " type不正");
        assert.ok(C.ANSWER_FACETS[a.facet], s.id + " facet不正: " + (a.facet || "(なし)"));
      });
    });
  });
});

test("全シーンがNPCへ割当済み・SCENE_BANDS が全シーンを網羅", () => {
  const sceneIds = new Set(SCENES.map((s) => s.id));
  const assigned = new Set();
  NPCS.forEach((n) => {
    assert.ok(Array.isArray(n.sceneIds) && n.sceneIds.length > 0, n.id + " にシーンが無い");
    n.sceneIds.forEach((sid) => {
      assert.ok(sceneIds.has(sid), n.id + " → 不明シーン " + sid);
      assigned.add(sid);
    });
  });
  assert.equal(assigned.size, sceneIds.size, "全シーン（" + sceneIds.size + "）がNPCへ割当済み");
  Object.entries(C.OUTING.SCENE_BANDS || {}).forEach(([sid, bands]) => {
    assert.ok(sceneIds.has(sid), "SCENE_BANDS に未知シーン " + sid);
    assert.ok(Array.isArray(bands) && bands.length > 0, sid + " のSCENE_BANDSが空");
  });
});

test("時間帯ルール維持：朝（morning）に職場内シーンは出現しない", () => {
  const bands = (id) => (C.OUTING.SCENE_BANDS || {})[id] || [];
  // 職場内（work カテゴリ / office背景）は朝に出さない
  SCENES.filter((s) => s.category === "work" || s.background === "office").forEach((s) => {
    assert.ok(bands(s.id).indexOf("morning") < 0, s.id + " が朝に出現してしまう");
  });
});

test("ストーリー枠：(役割×カテゴリ) の候補が要件2件以上ある", () => {
  const roles = C.STORY.ROLES; // open/develop/respond/close
  roles.forEach((role) => {
    CATEGORIES.forEach((cat) => {
      const n = STORY.filter((e) => {
        if (e.role !== role) return false;
        if (!Array.isArray(e.sceneCategories) || e.sceneCategories.length === 0) return true; // 汎用
        return e.sceneCategories.indexOf(cat) >= 0;
      }).length;
      assert.ok(n >= FLOORS.storyPerRoleCategory, role + "/" + cat + " の候補 " + n + "（要件 " + FLOORS.storyPerRoleCategory + "）");
    });
  });
});

test("ストーリー枠の条件整合：時間帯・天気・記憶の値が有効で、答えにfacetがある", () => {
  const bandKeys = (C.OUTING.TIME_BANDS || []).map((b) => b.key);
  const weatherKeys = Object.keys(C.OUTING.WEATHER || {});
  const ids = new Set();
  STORY.forEach((e) => {
    assert.ok(!ids.has(e.id), "ストーリーID重複: " + e.id);
    ids.add(e.id);
    (e.timeBands || []).forEach((b) => assert.ok(bandKeys.indexOf(b) >= 0, e.id + " timeBands不正: " + b));
    (e.weather || []).forEach((w) => assert.ok(weatherKeys.indexOf(w) >= 0, e.id + " weather不正: " + w));
    (e.requiresMemory || []).forEach((k) => assert.ok(["topic", "promise", "expectation", "misunderstanding"].indexOf(k) >= 0, e.id + " memory不正: " + k));
    (e.answers || []).forEach((a) => assert.ok(C.ANSWER_FACETS[a.facet], e.id + " 答えのfacet不正"));
  });
});

test("助言の件数フロア（総数・ペット種別）とID一意", () => {
  assert.ok(ADVICE.length >= FLOORS.adviceTotal, "助言 " + ADVICE.length + "（フロア " + FLOORS.adviceTotal + "）");
  const ids = new Set(ADVICE.map((a) => a.id));
  assert.equal(ids.size, ADVICE.length, "助言ID一意");
  const per = {};
  ADVICE.forEach((a) => {
    (a.petTypes && a.petTypes[0] ? [a.petTypes[0]] : ["any"]).forEach((t) => { per[t] = (per[t] || 0) + 1; });
  });
  (globalThis.KE_PETS || []).forEach((p) => {
    assert.ok((per[p.id] || 0) >= FLOORS.advicePerSpecies, p.id + " の助言 " + (per[p.id] || 0) + "（フロア " + FLOORS.advicePerSpecies + "）");
  });
  // facet付き助言の条件整合
  ADVICE.filter((a) => Array.isArray(a.facets)).forEach((a) => {
    a.facets.forEach((f) => assert.ok(C.ANSWER_FACETS[f], a.id + " facets不正: " + f));
  });
});
