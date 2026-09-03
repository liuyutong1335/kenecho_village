"use strict";
/*
 * kenecho Village - コーチ台詞抽選エンジン（KE_DIALOGUE）
 * 条件マッチ→重み付き抽選、フォールバック4段階、直近IDの連続回避。
 * 実装は M9〜M11 で追加する。
 */
(function () {
  const KE_DIALOGUE = {};

  if (globalThis) globalThis.KE_DIALOGUE = KE_DIALOGUE;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_DIALOGUE: KE_DIALOGUE };
})();
