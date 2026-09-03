"use strict";
/*
 * kenecho Village - プリセット運動（KE_EXERCISES）
 * 架空の参考データ。消費カロリーは METs と体重から推定されます。
 *
 * ExerciseDef: { id, name, mets, note }
 *   recipeCount: 収録目標 20件（M4 で収録・検証）
 */
(function () {
  const KE_EXERCISES = [
    // { id: "ex_walk", name: "歩く（ふつう）", mets: 3.5, note: "…" },
    // ↑ 中身は M4（運動記録）で収録するため、現在は骨格のみ。
  ];

  if (globalThis) globalThis.KE_EXERCISES = KE_EXERCISES;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_EXERCISES: KE_EXERCISES };
})();
