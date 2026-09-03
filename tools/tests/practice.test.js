"use strict";
/*
 * M10 会話練習モードのテスト（きずな度不変・4ターン＋ボーナス）。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "relationship-rules.js"));
require(path.join(root, "data", "npc-data.js"));
require(path.join(root, "data", "conversation-scenes.js"));
const { KE_CONVERSATION: CONV } = require(path.join(root, "conversation-game.js"));

test("練習は基本4ターン", () => {
  const scenes = globalThis.KE_SCENES;
  scenes.forEach((s) => {
    const rounds = CONV.practiceRounds(s);
    assert.equal(rounds.length, 4, "基本4ターン: " + s.id);
    rounds.forEach((r) => assert.equal(r.answers.length, 3));
  });
});

test("ボーナスタン条件は good 2回以上", () => {
  assert.equal(CONV.isBonusEligible(0), false);
  assert.equal(CONV.isBonusEligible(1), false);
  assert.equal(CONV.isBonusEligible(2), true);
  assert.equal(CONV.isBonusEligible(3), true);
});

test("evaluatePracticeAnswer が分類を返し、5ターン目はボーナス", () => {
  const scene = globalThis.KE_SCENES[0];
  const goodIdx = scene.rounds[0].answers.findIndex((a) => a.type === "good");
  const ev = CONV.evaluatePracticeAnswer(scene, 0, goodIdx);
  assert.equal(ev.ok, true);
  assert.equal(ev.meta.type, "good");
  assert.equal(ev.meta.label, "会話が続きやすい");
  assert.equal(ev.isBonus, false);

  const bonus = CONV.evaluatePracticeAnswer(scene, 4, 0);
  assert.equal(bonus.ok, true);
  assert.equal(bonus.isBonus, true);
  assert.equal(CONV.makeBonusRound().answers.length, 3);
});

test("練習でデータは一切変更されない", () => {
  const scene = globalThis.KE_SCENES[0];
  const before = globalThis.KE_CONFIG.SCHEMA_VERSION;
  const ev = CONV.evaluatePracticeAnswer(scene, 0, 0);
  // 評価結果が得られること、そしてモジュール内には保存・更新処理が無いこと
  assert.ok(ev.answer.text);
  assert.equal(before, 1);
});
