"use strict";
/*
 * kenecho Village - NPCアニメーション再生（KE_NPC_ANIMATION）
 * KE_ANIMATION（既存の再生コア）を読み取り利用し、NPCのモーションを再生する。
 * モーション: idle / talk / happy / smile / shy / neutral / troubled / appear / special
 *  - talk: 口（発言中）に合わせ normal/talk を交互
 *  - それ以外: 表情キーに応じた顔をループ
 * 既存のマニフェスト（common.npc）のフレーム数・fps・優先順位を利用する。
 */
(function () {
  const ANI = globalThis.KE_ANIMATION;
  const NPC_SPRITE = globalThis.KE_NPC_SPRITE;
  const MANIFEST = globalThis.KE_ANIMATION_MANIFEST;

  /** モーション名 → 表情キー（talk は交互なので特別扱い） */
  function faceForMotion(motion, frame) {
    if (motion === "talk") return frame % 2 === 0 ? "normal" : "talk";
    return NPC_SPRITE.expressionToFace(motion);
  }

  /** NPCを再生する。opts: { scale, loop (既定 true), aria, after, dim } */
  function playNpc(hostEl, npcId, motion, opts) {
    const o = opts || {};
    const m = motion || "idle";
    const cfg = (MANIFEST && MANIFEST.common && MANIFEST.common.npc && MANIFEST.common.npc[m]) || { frames: 4, fps: 4, priority: 4 };
    const loop = o.loop != null ? o.loop : (m !== "appear" && m !== "special");
    return ANI.play(hostEl, function (f) {
      return NPC_SPRITE.renderNpcFrame(npcId, faceForMotion(m, f), o.scale || 3, { dim: o.dim });
    }, { frames: cfg.frames, fps: cfg.fps, loop: loop, aria: o.aria, after: o.after });
  }

  /** 会話の态势（good/short/bad）→ モーション */
  function motionForAnswerType(type) {
    return type === "good" ? "happy" : type === "bad" ? "troubled" : "smile";
  }

  const KE_NPC_ANIMATION = {
    playNpc: playNpc,
    motionForAnswerType: motionForAnswerType,
    faceForMotion: faceForMotion
  };

  if (globalThis) globalThis.KE_NPC_ANIMATION = KE_NPC_ANIMATION;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_NPC_ANIMATION };
})();
