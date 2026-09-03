"use strict";
/*
 * 初期設定の入力検証（純粋関数）テスト。ブラウザ非依存。
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "ui.js"));

const V = globalThis.KE_UI.validateProfileFields;

const VALID = {
  displayName: "高橋 翔太",
  age: "23",
  gender: "male",
  heightCm: "170",
  weightKg: "65.0",
  petName: "モモ",
  selectionMode: "choose"
};

test("正しい入力は ok=true・エラーなし", () => {
  const r = V(VALID);
  assert.equal(r.ok, true);
  assert.deepEqual(r.errors, {});
});

test("各必須項目の未入力がエラーになる", () => {
  const r = V({});
  assert.equal(r.ok, false);
  for (const f of ["displayName", "age", "gender", "heightCm", "weightKg", "petName", "selectionMode"]) {
    assert.ok(r.errors[f], "エラーが無い: " + f);
  }
});

test("数値範囲の境界", () => {
  assert.match(V(Object.assign({}, VALID, { age: "17" })).errors.age, /範囲/);
  assert.match(V(Object.assign({}, VALID, { age: "121" })).errors.age, /範囲/);
  assert.equal(V(Object.assign({}, VALID, { age: "18" })).ok, true);
  assert.match(V(Object.assign({}, VALID, { heightCm: "99" })).errors.heightCm, /範囲/);
  assert.equal(V(Object.assign({}, VALID, { weightKg: "401" })).ok, false);
  assert.equal(V(Object.assign({}, VALID, { weightKg: "19.9" })).ok, false);
  assert.equal(V(Object.assign({}, VALID, { weightKg: "301" })).ok, true);
  assert.equal(V(Object.assign({}, VALID, { weightKg: "20.05" })).ok, true);
});

test("文字数制限（表示名20・ペット名12）", () => {
  assert.match(V(Object.assign({}, VALID, { displayName: "あ".repeat(21) })).errors.displayName, /20文字以内/);
  assert.equal(V(Object.assign({}, VALID, { displayName: "あ".repeat(20) })).ok, true);
  assert.match(V(Object.assign({}, VALID, { petName: "あ".repeat(13) })).errors.petName, /12文字以内/);
});

test("性別・決定方式の選択肢検証", () => {
  assert.ok(V(Object.assign({}, VALID, { gender: "other" })).errors.gender);
  assert.ok(V(Object.assign({}, VALID, { selectionMode: "auto" })).errors.selectionMode);
  assert.equal(V(Object.assign({}, VALID, { gender: "female" })).ok, true);
});

test("validateStepFields は指定フィールドだけ検証する", () => {
  const UI = globalThis.KE_UI;
  const r = UI.validateStepFields({ displayName: "" }, ["displayName"]);
  assert.equal(r.ok, false);
  assert.ok(r.errors.displayName);
  assert.equal(r.errors.age, undefined);
});
