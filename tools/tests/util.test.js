"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");

const path = require("path");
const utilPath = path.join(__dirname, "..", "..", "js", "util.js");
require(utilPath);
const { KE_UTIL: U } = require(utilPath);

test("formatDate / todayStr がローカル日付文字列を返す", () => {
  assert.equal(U.formatDate(new Date(2026, 8, 3)), "2026-09-03");
  const d = new Date(2026, 11, 31);
  assert.equal(U.formatDate(d), "2026-12-31");
  assert.match(U.todayStr(new Date(2026, 0, 5)), /^2026-01-05$/);
});

test("parseDate が実在しない日付を拒否する", () => {
  assert.deepEqual(U.parseDate("2026-09-03"), { y: 2026, m: 9, d: 3 });
  assert.equal(U.parseDate("2026-02-30"), null); // 実在しない日
  assert.equal(U.parseDate("2026-13-01"), null);
  assert.equal(U.parseDate("abc"), null);
  assert.equal(U.parseDate(null), null);
});

test("addDays / daysBetween がカレンダー日数を返す", () => {
  assert.equal(U.addDays("2026-09-03", 1), "2026-09-04");
  assert.equal(U.addDays("2026-09-03", -1), "2026-09-02");
  assert.equal(U.addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(U.daysBetween("2026-09-03", "2026-09-03"), 0);
  assert.equal(U.daysBetween("2026-09-03", "2026-09-10"), 7);
  assert.equal(U.daysBetween("2026-02-28", "2026-03-01"), 1);
});

test("isFutureDate が未来判定", () => {
  assert.equal(U.isFutureDate("2026-09-04", new Date(2026, 8, 3)), true);
  assert.equal(U.isFutureDate("2026-09-03", new Date(2026, 8, 3)), false);
  assert.equal(U.isFutureDate("2026-09-02", new Date(2026, 8, 3)), false);
  assert.equal(U.isFutureDate("", new Date(2026, 8, 3)), false);
});

test("parseTime が HH:mm を分へ変換", () => {
  assert.equal(U.parseTime("23:00"), 1380);
  assert.equal(U.parseTime("00:30"), 30);
  assert.equal(U.parseTime("23:60"), null);
  assert.equal(U.parseTime("24:00"), null);
  assert.equal(U.parseTime("abc"), null);
});

test("clamp / round1", () => {
  assert.equal(U.clamp(5, 0, 10), 5);
  assert.equal(U.clamp(-3, 0, 10), 0);
  assert.equal(U.clamp(105, 0, 100), 100);
  assert.equal(U.round1(1591.25), 1591.3);
  assert.equal(U.round1(2.44), 2.4);
});

test("generateId がプレフィックス付きで重複しにくい", () => {
  const a = U.generateId("meal");
  const b = U.generateId("meal");
  assert.match(a, /^meal_/);
  assert.notEqual(a, b);
});

test("pickWeighted が null を安全に扱う", () => {
  assert.equal(U.pickWeighted([]), null);
  assert.equal(U.pickWeighted(null), null);
  const w = U.pickWeighted([{ id: "a", weight: 0 }, { id: "b", weight: 0 }]);
  assert.ok(w.id === "a" || w.id === "b"); // 全0は先頭
});
