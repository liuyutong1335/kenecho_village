"use strict";
/*
 * kenecho Village - 汎用ヘルパ（KE_UTIL）
 * 日付（ローカル時刻ベース）・ID生成・クランプ・乱数・重み付き抽選など。
 * ブラウザでは globalThis へ公開し、Node テストでは require() で利用できる。
 */
(function () {
  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  /** Date をローカル日付文字列 YYYY-MM-DD にする */
  function formatDate(d) {
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  /** 今日の日付文字列（ローカル） */
  function todayStr(now) {
    return formatDate(now && now instanceof Date ? now : new Date());
  }

  /**
   * YYYY-MM-DD を {y,m,d} へ安全にパース（UTC解釈による時差ずれを防ぐ）。
   * 不正な値は null を返す。
   */
  function parseDate(dateStr) {
    if (typeof dateStr !== "string") return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (!(mo >= 1 && mo <= 12)) return null;
    if (!(d >= 1 && d <= 31)) return null;
    if (new Date(Date.UTC(y, mo - 1, d)).getUTCMonth() !== mo - 1) return null; // 実在日チェック
    return { y: y, m: mo, d: d };
  }

  function toUTC(dateStr) {
    const p = parseDate(dateStr);
    return p ? Date.UTC(p.y, p.m - 1, p.d) : NaN;
  }

  /** dateStr へ n 日を加算した日付文字列（n は負も可） */
  function addDays(dateStr, n) {
    const p = parseDate(dateStr);
    if (!p) return dateStr;
    const dt = new Date(p.y, p.m - 1, p.d + n);
    return formatDate(dt);
  }

  /** a〜b（a<=b を想定）のカレンダー日数差（整数）。b-a を日数で返す */
  function daysBetween(aStr, bStr) {
    const a = toUTC(aStr);
    const b = toUTC(bStr);
    if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
    return Math.round((b - a) / 86400000);
  }

  /** dateStr が ref（既定=今日）より未来なら true */
  function isFutureDate(dateStr, ref) {
    if (!dateStr) return false;
    if (ref && ref instanceof Date) ref = todayStr(ref);
    const today = ref || todayStr();
    return daysBetween(today, dateStr) > 0;
  }

  /** HH:mm（24時間表記）を 0〜1439 の分へ変換。不正は null */
  function parseTime(hhmm) {
    if (typeof hhmm !== "string") return null;
    const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
    if (!m) return null;
    const h = Number(m[1]);
    const mi = Number(m[2]);
    if (h < 0 || h > 23 || mi < 0 || mi > 59) return null;
    return h * 60 + mi;
  }

  function clamp(v, min, max) {
    if (typeof v !== "number" || Number.isNaN(v)) return NaN;
    if (v < min) return min;
    if (v > max) return max;
    return v;
  }

  /** 小数第1位に丸める */
  function round1(v) {
    return Math.round(v * 10) / 10;
  }

  /** ユニークID生成。prefix_<36進タイムスタンプ>_<乱数> */
  function generateId(prefix) {
    const ts = Date.now().toString(36);
    const rnd = Math.floor(Math.random() * 0xfffff).toString(36).toUpperCase();
    return (prefix || "id") + "_" + ts + "_" + rnd;
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** 破壊的ではなく新しい配列をシャッフルして返す */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  /**
   * 重み付き抽選。候補 [{ weight: number, ... }] を渡し、weight に比例して1件返す。
   * total が 0 以下なら最初の要素を返す。
   */
  function pickWeighted(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) return null;
    const total = candidates.reduce(function (acc, c) {
      return acc + (Number.isFinite(c.weight) && c.weight > 0 ? c.weight : 0);
    }, 0);
    if (total <= 0) return candidates[0];
    let r = Math.random() * total;
    for (let i = 0; i < candidates.length; i++) {
      const w = Number.isFinite(candidates[i].weight) && candidates[i].weight > 0 ? candidates[i].weight : 0;
      r -= w;
      if (r < 0) return candidates[i];
    }
    return candidates[candidates.length - 1];
  }

  /** textContent 用に < や & などを実体参照に（安全表示の補助） */
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const KE_UTIL = {
    pad2: pad2,
    formatDate: formatDate,
    todayStr: todayStr,
    parseDate: parseDate,
    addDays: addDays,
    daysBetween: daysBetween,
    isFutureDate: isFutureDate,
    parseTime: parseTime,
    clamp: clamp,
    round1: round1,
    generateId: generateId,
    randInt: randInt,
    shuffle: shuffle,
    pickWeighted: pickWeighted,
    escapeHtml: escapeHtml
  };

  if (globalThis) globalThis.KE_UTIL = KE_UTIL;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_UTIL: KE_UTIL };
})();
