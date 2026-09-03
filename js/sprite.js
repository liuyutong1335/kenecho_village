"use strict";
/*
 * kenecho Village - ピクセル描画（KE_SPRITE）
 * ピクセル定義（配色マス配列）→ Canvas 描画・キャッシュ・整数倍拡大・シルエット表現。
 * 実装は M14 で追加する。
 */
(function () {
  const KE_SPRITE = {};

  if (globalThis) globalThis.KE_SPRITE = KE_SPRITE;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_SPRITE: KE_SPRITE };
})();
