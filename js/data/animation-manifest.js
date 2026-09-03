"use strict";
/*
 * kenecho Village - アニメーションマニフェスト（KE_ANIMATION_MANIFEST）
 * 動作ごとのフレーム数・fps・優先順位を一元管理する。
 * ピクセル定義（js/data/pixel-art/）とスプライト描画（js/sprite.js）は M14 で実装する。
 *
 * priority が小さいほど優先（成長・旅立ち0 > 孵化・種類公開1 > 記録・会話結果2 >
 * 食事・運動3 > 会話中4 > 健康状態5 > 通常待機6）。
 */
(function () {
  const KE_ANIMATION_MANIFEST = {
    petMotions: ["idle", "blink", "walk_left", "walk_right", "happy", "troubled", "sleepy", "eat", "exercise", "talk", "level_up", "departure"],
    eggMotions: ["egg_idle", "egg_shake", "egg_hatch"],
    npcMotions: ["idle", "talk", "happy", "neutral", "troubled", "appear", "special"],
    effects: ["stamp", "exp_gain", "bond_up", "bond_down", "level_up", "discover", "hatch_light", "departure_light", "new_egg"],
    common: {
      petMotions: {
        idle: { frames: 4, fps: 4, priority: 6 },
        blink: { frames: 4, fps: 4, priority: 6 },
        walk_left: { frames: 4, fps: 6, priority: 4 },
        walk_right: { frames: 4, fps: 6, priority: 4 },
        happy: { frames: 4, fps: 5, priority: 5 },
        troubled: { frames: 4, fps: 4, priority: 5 },
        sleepy: { frames: 4, fps: 3, priority: 5 },
        eat: { frames: 4, fps: 5, priority: 3 },
        exercise: { frames: 6, fps: 6, priority: 3 },
        talk: { frames: 4, fps: 5, priority: 4 },
        level_up: { frames: 6, fps: 6, priority: 0 },
        departure: { frames: 6, fps: 5, priority: 0 }
      },
      egg: {
        egg_idle: { frames: 4, fps: 3, priority: 6 },
        egg_shake: { frames: 4, fps: 6, priority: 3 },
        egg_hatch: { frames: 8, fps: 6, priority: 1 }
      },
      npc: {
        idle: { frames: 4, fps: 4, priority: 6 },
        talk: { frames: 4, fps: 5, priority: 4 },
        happy: { frames: 4, fps: 5, priority: 5 },
        neutral: { frames: 2, fps: 3, priority: 6 },
        troubled: { frames: 4, fps: 4, priority: 5 },
        appear: { frames: 6, fps: 6, priority: 1 },
        special: { frames: 6, fps: 6, priority: 1 }
      }
    }
  };

  if (globalThis) globalThis.KE_ANIMATION_MANIFEST = KE_ANIMATION_MANIFEST;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_ANIMATION_MANIFEST: KE_ANIMATION_MANIFEST };
})();
