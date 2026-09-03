"use strict";
/*
 * kenecho Village - ペット別コーチ台詞データ（KE_COACH_SPEECH）
 * 台詞は画面処理へ直接書かず、ここへ集約する（目標 150〜180件、M11 で拡張）。
 *
 * CoachSpeech: {
 *   id, petTypes[], coachTypes[], growthStages[], petConditions[], answerType, sceneTags[],
 *   relationLevels[], petRelationLevels[], purpose, text, weight
 * }
 */
(function () {
  const KE_COACH_SPEECH = [
    // 共通の安全な台詞（フォールバック最終段）
    {
      id: "coach_common_fallback_001",
      petTypes: [], coachTypes: [], growthStages: [], petConditions: [],
      answerType: null, sceneTags: [], relationLevels: [], petRelationLevels: [],
      purpose: "fallback",
      text: "自分のペースで話せたのがよかったよ。次もその調子！",
      weight: 10
    }
  ];

  if (globalThis) globalThis.KE_COACH_SPEECH = KE_COACH_SPEECH;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_COACH_SPEECH: KE_COACH_SPEECH };
})();
