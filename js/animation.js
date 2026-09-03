"use strict";
/*
 * kenecho Village - アニメーション再生（KE_ANIMATION）
 * フレーム再生・優先順位制御・prefers-reduced-motion 対応。
 * 実装は M14 で追加する。
 */
(function () {
  const KE_ANIMATION = {};

  if (globalThis) globalThis.KE_ANIMATION = KE_ANIMATION;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_ANIMATION: KE_ANIMATION };
})();
