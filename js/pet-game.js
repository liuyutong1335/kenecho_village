"use strict";
/*
 * kenecho Village - ペット育成ロジック（KE_PET）
 * 卵/成長/孵化/種類決定/図鑑/思い出/旅立ち/次世代。
 * M2: createEgg（卵の初期状態生成）。
 * 成長・孵化の判定は M6 / M7、思い出・旅立ちは M12 で追加する。
 */
(function () {
  const C = globalThis.KE_CONFIG;
  const U = globalThis.KE_UTIL;

  /**
   * 新しい世代の卵を生成する。
   * 卵段階では種類を決定しない（speciesId: null / speciesRevealed: false）。
   */
  function createEgg(generationId, name, selectionMode) {
    const mode = ["choose", "random"].indexOf(selectionMode) >= 0 ? selectionMode : "choose";
    return {
      generationId: generationId,
      name: String(name || "").trim(),
      stage: "egg",
      speciesId: null,
      speciesRevealed: false,
      selectionMode: mode,
      birthDate: U.todayStr(),
      hatchedAt: null,
      cumulativeExp: 0,
      recordedDays: 0,
      questDays: 0,
      lastQuestDate: null,
      recentDialogueIds: [],
      petBond: C.BOND.PET_INITIAL
    };
  }

  const KE_PET = {
    createEgg: createEgg
  };

  if (globalThis) globalThis.KE_PET = KE_PET;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_PET: KE_PET };
})();
