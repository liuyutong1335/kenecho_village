"use strict";
/*
 * スモークテスト。
 * - kenecho-village.html の <script src> がすべて実在し、依存順で require できること
 * - 各モジュールが期待する名前空間を globalThis へ公開していること
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const INDEX = fs.readFileSync(path.join(ROOT, "kenecho-village.html"), "utf8");

const SCRIPT_ORDER = [
  "js/util.js",
  "js/config.js",
  "js/data/relationship-rules.js",
  "js/data/foods.js",
  "js/data/exercises.js",
  "js/data/pets.js",
  "js/data/pet-coach-speech.js",
  "js/data/npc-data.js",
  "js/data/conversation-scenes.js",
  "js/data/story-lines.js",
  "js/data/story-small-promise.js",
  "js/data/animation-manifest.js",
  "js/data/pixel-art/pets.js",
  "js/data/pixel-art/npcs.js",
  "js/db.js",
  "js/health.js",
  "js/pet-game.js",
  "js/relationship.js",
  "js/npc-memory.js",
  "js/outings.js",
  "js/dialogue-engine.js",
  "js/conversation-game.js",
  "js/story-small-promise.js",
  "js/sprite.js",
  "js/animation.js",
  "js/npc-sprite.js",
  "js/npc-animation.js",
  "js/conv-scene.js",
  "js/ui.js",
  "js/app.js"
];

test("kenecho-village.html が外部リソース（url 等）を含まない", () => {
  assert.equal(/<script[^>]+src="https?:/i.test(INDEX), false, "外部URLのscript");
  assert.equal(/<img[^>]+src="https?:/i.test(INDEX), false, "外部画像URL");
  assert.equal(/@import[^;]+url/i.test(INDEX), false, "CSS url import");
});

test("kenecho-village.html の script 順が定義と一致し、ファイルがすべて実在する", () => {
  const tags = [];
  const re = /<script[^>]+src="([^"]+)"/g;
  let m;
  while ((m = re.exec(INDEX)) !== null) tags.push(m[1]);
  assert.deepEqual(tags, SCRIPT_ORDER, "script の並びと実装順が不一致");
  for (const t of tags) {
    assert.ok(fs.existsSync(path.join(ROOT, t)), "存在しないscript: " + t);
  }
});

test("全モジュールを依存順に require できる（構文・読込エラーなし）", () => {
  for (const rel of SCRIPT_ORDER) {
    const abs = path.join(ROOT, rel);
    delete require.cache[abs];
    require(abs);
  }
});

test("期待する名前空間が公開されている", () => {
  for (const key of ["KE_UTIL", "KE_CONFIG", "KE_RELATIONSHIP_RULES", "KE_FOODS", "KE_EXERCISES",
    "KE_PETS", "KE_COACH_SPEECH", "KE_NPCS", "KE_SCENES", "KE_STORY_LINES", "KE_STORY_SMALL_PROMISE", "KE_ANIMATION_MANIFEST",
    "KE_DB", "KE_HEALTH", "KE_PET", "KE_RELATIONSHIP", "KE_DIALOGUE", "KE_CONVERSATION", "KE_STORY",
    "KE_SPRITE", "KE_ANIMATION", "KE_PIXEL_NPCS", "KE_NPC_SPRITE", "KE_NPC_ANIMATION", "KE_CONV_SCENE",
    "KE_NPC_MEMORY", "KE_OUTING", "KE_UI", "KE_APP"]) {
    assert.ok(globalThis[key] !== undefined, "namespace未公開: " + key);
  }
});
