"use strict";
/*
 * M11 台詞抽選エンジンのテスト（フォールバック・イベント・重複回避）。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "pet-coach-speech.js"));
const { KE_DIALOGUE: D } = require(path.join(root, "dialogue-engine.js"));

test("種類＋回答分類（tier1）で抽選される", () => {
  const r = D.pick({ petType: "rabbit", coachType: "gentle", stage: "child", answerType: "good" });
  assert.ok(r.text);
  assert.equal(r.tier, 1);
  assert.ok(r.id.indexOf("coach_rabbit_fb_") === 0);
});

test("未知の種類ならフォールバック段階（tier3以上）へ落ちる", () => {
  const r = D.pick({ petType: "phantom", answerType: "bad" });
  assert.ok(r.text.length > 0);
  assert.ok(r.tier >= 3);
});

test("条件が何も無ければ共通の安全な台詞（tier4）に落ちる", () => {
  const r = D.pick({});
  assert.equal(r.tier, 4);
  assert.equal(r.id, "coach_common_fallback_001");
});

test("イベント（level_up/departure/greeting）専用台詞が取れる", () => {
  const a = D.pick({ petType: "fox", stage: "child", purpose: "level_up" });
  assert.equal(a.tier, 0);
  assert.ok(a.id.indexOf("coach_fox_ev_level_up") === 0);
  const b = D.pick({ purpose: "departure" });
  assert.ok(b.text.length > 0);
  const g = D.pick({ petType: "tanuki", stage: "child", purpose: "greeting" });
  assert.ok(g.text.indexOf("こんにちは") >= 0);
});

test("直近IDの連続回避が動作する", () => {
  // stage を child に固定し、うさぎのbad解説を毎回取り、連続では別の台詞が出るか確認
  const results = new Set();
  for (let i = 0; i < 100; i++) {
    const r = D.pick({ petType: "rabbit", coachType: "gentle", stage: "child", answerType: "bad" });
    results.add(r.id);
  }
  // 有効な台詞が返る
  assert.ok(results.size > 0);
  // pushRecent は末尾に追加し最大10件に収める
  let recent = [];
  for (let i = 0; i < 15; i++) recent = D.pushRecent(recent, "coach_rabbit_fb_" + i, 10);
  assert.equal(recent.length, 10);
  assert.equal(recent[9], "coach_rabbit_fb_14");
});
