"use strict";
/*
 * 会話シーンの表示（feat/conv-scene-visuals）テスト。
 * - NPCピクセル定義の整合（8名・ボディ/髪型/配色・表情）
 * - シーンに使われる npcExpression の表情マッピング完全性（未定義の表情がないこと）
 * - NPC/背景/合成シーンのCanvas描画（document stub で検証）
 * - 合成シーン再生（呼吸・talk）と停止
 */
const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");

/** 最小限の Canvas スタブ（Node には Canvas が無いため） */
function installCanvasStub() {
  const storedDocument = globalThis.document;
  function canvasEl() {
    const ctx = {
      imageSmoothingEnabled: false,
      fillStyle: "",
      fillRect() {}, clearRect() {}, strokeRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, fill() {}, setLineDash() {},
      drawImage() {}
    };
    return {
      width: 0, height: 0, style: {},
      getContext: () => ctx,
      setAttribute() {}, appendChild() {}, remove() {}, classList: { add() {}, remove() {} }
    };
  }
  const host = {
    replaceChildren() {}, append() {}, querySelectorAll: () => [], setAttribute() {}, addEventListener() {}
  };
  globalThis.document = {
    createElement: (tag) => (tag === "canvas" ? canvasEl() : host),
    querySelector: null,
    body: host
  };
  return { storedDocument, host };
}

const canvasDoc = installCanvasStub();

require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "relationship-rules.js"));
require(path.join(root, "data", "npc-data.js"));
require(path.join(root, "data", "pets.js"));
require(path.join(root, "data", "pet-coach-speech.js"));
require(path.join(root, "data", "conversation-scenes.js"));
require(path.join(root, "data", "story-lines.js"));
require(path.join(root, "data", "pixel-art", "pets.js"));
require(path.join(root, "data", "pixel-art", "npcs.js"));
require(path.join(root, "sprite.js"));
require(path.join(root, "animation.js"));
const { KE_NPC_SPRITE } = require(path.join(root, "npc-sprite.js"));
const { KE_NPC_ANIMATION } = require(path.join(root, "npc-animation.js"));
const { KE_CONV_SCENE } = require(path.join(root, "conv-scene.js"));

const PX = globalThis.KE_PIXEL_NPCS;
const SCENES = globalThis.KE_SCENES;
const STORY = globalThis.KE_STORY_LINES;
const NPCS = globalThis.KE_NPCS;
const FACES = KE_NPC_SPRITE.FACE_CELLS;

test("NPCピクセル定義：8名が KE_NPCS と一致し、髪型・配色・表情を持つ", () => {
  const ids = Object.keys(PX.NPCS).sort();
  const npcIds = NPCS.map((n) => n.id).sort();
  assert.deepEqual(ids, npcIds);
  assert.equal(PX.BODY.length, 16, "ボディは16行");
  assert.ok(PX.HAIR_STYLES.short && PX.HAIR_STYLES.bob && PX.HAIR_STYLES.curly && PX.HAIR_STYLES.bun);
  ids.forEach((id) => {
    const d = PX.NPCS[id];
    assert.ok(PX.HAIR_STYLES[d.hairStyle], id + " の髪型");
    assert.ok(/^#/.test(d.hairColor) && /^#/.test(d.shirtColor) && /^#/.test(d.pantsColor));
  });
});

test("シーン・ストーリー台詞の全 npcExpression に表情マッピングがある（未定義なし）", () => {
  const used = new Set();
  SCENES.forEach((s) => {
    if (s.npcExpression) used.add(s.npcExpression);
    s.rounds.forEach((r) => {
      if (r.npcExpression) used.add(r.npcExpression);
      r.answers.forEach((a) => { if (a.npcExpression) used.add(a.npcExpression); });
    });
  });
  STORY.forEach((e) => {
    if (e.npcExpression) used.add(e.npcExpression);
    e.answers.forEach((a) => { if (a.npcExpression) used.add(a.npcExpression); });
  });
  assert.ok(used.size >= 8, "表情の利用があること");
  used.forEach((expr) => {
    const face = KE_NPC_SPRITE.expressionToFace(expr);
    assert.ok(FACES[face], "表情が未定義: " + expr);
  });
});

test("renderNpcFrame が NPCごとに期待サイズのCanvasを返す（表情違い含む）", () => {
  Object.keys(PX.NPCS).forEach((id) => {
    const cv = KE_NPC_SPRITE.renderNpcFrame(id, "normal", 3);
    assert.equal(cv.width, 12 * 3);
    assert.equal(cv.height, 16 * 3);
  });
  const cvTalk = KE_NPC_SPRITE.renderNpcFrame("npc_sato", "talk", 4);
  assert.equal(cvTalk.width, 12 * 4);
});

test("renderBackground が5種の背景すべてを描画できる", () => {
  ["office", "elevator", "breakroom", "dining", "outdoor"].forEach((k) => {
    const cv = KE_CONV_SCENE.renderBackground(k, 3);
    assert.equal(cv.width, 120 * 3);
    assert.equal(cv.height, 28 * 3);
  });
  // 未知キーは outdoor 扱い（安全）
  assert.equal(KE_CONV_SCENE.renderBackground("mystery", 2).width, 120 * 2);
});

test("renderSceneFrame が背景＋人物の合成Canvasを返す（呼吸フレーム違い）", () => {
  const st = {
    background: "outdoor",
    gender: "female",
    pet: { speciesId: "rabbit", condition: "happy" },
    npcId: "npc_sato",
    npcMotion: "talk",
    scale: 3
  };
  const f0 = KE_CONV_SCENE.renderSceneFrame(st, 0);
  const f1 = KE_CONV_SCENE.renderSceneFrame(st, 1);
  assert.equal(f0.width, 120 * 3);
  assert.equal(f0.height, 28 * 3);
  assert.equal(f1.width, f0.width);
});

test("playScene は再生ハンドルを返し、stop() でループを止められる", () => {
  const handle = KE_CONV_SCENE.playScene(canvasDoc.host, {
    background: "office", gender: "male", pet: { speciesId: "fox", condition: "normal" }, npcId: "npc_tanaka", npcMotion: "happy", scale: 2
  }, {});
  assert.ok(handle && typeof handle.stop === "function");
  handle.stop();
  // モーション→表情の変換は既存マニフェストの枠組みを壊さない
  const f1 = KE_NPC_ANIMATION.faceForMotion("talk", 1);
  assert.equal(f1, "talk");
  const f0 = KE_NPC_ANIMATION.faceForMotion("talk", 0);
  assert.equal(f0, "normal");
});
