"use strict";
/*
 * kenecho Village - きずな度・関係段階のルール定義（KE_RELATIONSHIP_RULES）
 * 数値は KE_CONFIG から参照し、表示用ラベル・導出ルールをここへ集約する。
 */
(function () {
  const C = globalThis.KE_CONFIG;

  const KE_RELATIONSHIP_RULES = {
    /** 回答分類ごとの NPC きずな度変化と表示 */
    answerTypes: {
      good: { delta: C.BOND.DELTA.good, label: "会話が続きやすい", desc: "「続ける力」の高い返答です" },
      short: { delta: C.BOND.DELTA.short, label: "短いが自然", desc: "失礼にならない、あっさりした返答です" },
      bad: { delta: C.BOND.DELTA.bad, label: "会話が続きにくい", desc: "話を止めてしまう可能性のある返答です" }
    },
    /** 共通の関係段階（0〜100） */
    levels: C.BOND.LEVELS,
    /** きずな度数値の扱い */
    bounds: { min: C.BOND.MIN, max: C.BOND.MAX },
    /** 総合きずな度の重み */
    totalWeights: { pet: C.BOND.PET_WEIGHT, npc: C.BOND.NPC_WEIGHT },

    /** 数値 → 関係段階キー */
    levelKey(bond) {
      for (let i = 0; i < this.levels.length; i++) {
        if (bond <= this.levels[i].max) return this.levels[i].key;
      }
      return this.levels[this.levels.length - 1].key;
    },
    /** 数値 → 関係段階ラベル */
    levelLabel(bond) {
      for (let i = 0; i < this.levels.length; i++) {
        if (bond <= this.levels[i].max) return this.levels[i].label;
      }
      return this.levels[this.levels.length - 1].label;
    },
    /** 総合きずな度 = round(ペット×0.4 ＋ NPC×0.6) */
    totalBond(petBond, npcBond) {
      return Math.round(petBond * this.totalWeights.pet + npcBond * this.totalWeights.npc);
    }
  };

  if (globalThis) globalThis.KE_RELATIONSHIP_RULES = KE_RELATIONSHIP_RULES;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_RELATIONSHIP_RULES: KE_RELATIONSHIP_RULES };
})();
