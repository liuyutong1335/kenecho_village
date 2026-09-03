"use strict";
/*
 * kenecho Village - アニメーション再生（KE_ANIMATION）
 * - フレーム生成関数を渡して setInterval で再生する
 * - 呼び出し時に同じホストへの再生を止める = 優先順位の横取りを実現
 * - prefers-reduced-motion: reduce では最初のフレームを静止表示し、ループしない
 */
(function () {
  const U = globalThis.KE_UTIL;
  const SPR = globalThis.KE_SPRITE;

  const active = new WeakMap(); // hostEl -> { stop }

  function prefersReduced() {
    try {
      if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      }
    } catch (e) { /* noop */ }
    return false;
  }

  /**
   * hostEl 内へフレームを繰り返し表示する。
   * options: { frames, fps, loop=false, aria, after, reducedOk=false }
   * renderFrame(frameIndex) => Canvas を返す
   */
  function play(hostEl, renderFrame, options) {
    const o = options || {};
    const frames = o.frames || 4;
    const fps = o.fps || 4;
    const loop = !!o.loop;
    if (!hostEl) return { stop: function () {} };

    // 既存の再生を止める（優先順位の横取り）
    const prev = active.get(hostEl);
    if (prev) prev.stop();

    let frame = 0;
    let timer = null;
    let stopped = false;

    function draw() {
      hostEl.replaceChildren();
      const cvs = renderFrame(frame);
      if (cvs && cvs.nodeType === 1) {
        cvs.setAttribute("class", "sprite-canvas");
        if (o.aria) cvs.setAttribute("aria-label", o.aria);
        hostEl.append(cvs);
      }
    }

    function stop() {
      if (stopped) return;
      stopped = true;
      if (timer) { clearInterval(timer); timer = null; }
      if (active.get(hostEl) === handle) active.delete(hostEl);
      if (typeof o.after === "function") o.after();
    }

    function tick() {
      frame = (frame + 1) % frames;
      draw();
    }

    const handle = { stop: stop };
    active.set(hostEl, handle);
    draw();

    if (prefersReduced()) {
      // 静止表示。終了扱いにする
      if (!loop && typeof o.after === "function") setTimeout(o.after, 40);
      return handle;
    }
    timer = setInterval(tick, Math.max(60, Math.round(1000 / fps)));
    if (!loop && timer) {
      setTimeout(function () {
        stop();
      }, (frames / fps) * 1000 + 120);
    }
    return handle;
  }

  /** 1回限りの演出（成長・孵化・旅立ちなど） */
  function playOnce(hostEl, renderFrame, options) {
    return play(hostEl, renderFrame, Object.assign({ loop: false }, options));
  }

  /** ペットの待機アニメーション（健康状態に応じたモーション） */
  function playPetIdle(hostEl, speciesId, condition, scale) {
    const motion = {
      perfect: "happy",
      happy: "happy",
      normal: "idle",
      lonely: "troubled",
      sleepy: "sleepy"
    }[condition] || "idle";
    const cfg = globalThis.KE_ANIMATION_MANIFEST.common.petMotions[motion] || { frames: 4, fps: 4 };
    return play(hostEl, function (f) {
      return SPR.renderPetFrame(speciesId, motion, f, scale || 4);
    }, { frames: cfg.frames, fps: cfg.fps, loop: true });
  }

  function playPetMotion(hostEl, speciesId, motion, scale, after) {
    return play(hostEl, function (f) {
      return SPR.renderPetFrame(speciesId, motion, f, scale || 4);
    }, { frames: 6, fps: 6, loop: false, after: after });
  }

  function playEgg(hostEl, motion, scale, after) {
    const cfg = globalThis.KE_ANIMATION_MANIFEST.common.egg[motion] || { frames: 4, fps: 4 };
    return play(hostEl, function (f) {
      return SPR.renderEggFrame(motion, f, scale || 4);
    }, { frames: cfg.frames, fps: cfg.fps, loop: motion === "egg_idle", after: after });
  }

  const KE_ANIMATION = {
    preferReduced: prefersReduced,
    play: play,
    playOnce: playOnce,
    playPetIdle: playPetIdle,
    playPetMotion: playPetMotion,
    playEgg: playEgg
  };

  if (globalThis) globalThis.KE_ANIMATION = KE_ANIMATION;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_ANIMATION };
})();
