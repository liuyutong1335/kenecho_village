"use strict";
/*
 * kenecho Village - 会話シーン20件（KE_SCENES）
 * 日常8 / 仕事6 / 食事・交流6 を架空NPCへ割り当てる。全て架空のオリジナル。
 * 収録は M9（クエスト）/ M10（練習）で行う。
 *
 * Scene: {
 *   id, title, category, npcId, background, tags[], context,
 *   rounds: [ { promptNpcLine, npcExpression, answers: [ { text, type, npcReply, npcExpression, explanation, nextHint } ] } ]
 * }
 */
(function () {
  const KE_SCENES = [
    // ↓ M9 で収録
  ];

  if (globalThis) globalThis.KE_SCENES = KE_SCENES;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_SCENES: KE_SCENES };
})();
