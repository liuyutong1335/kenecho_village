"use strict";
/*
 * kenecho Village - 会話シーンの合成描画（KE_CONV_SCENE）
 * 「背景（ピクセル風景）＋人物（あなた/ペット/NPC）」を1枚の Canvas へ合成し、
 * 呼吸・発言（talk）・表情変化のアニメーションとして再生する。
 * 既存の描画（sprite.js）とNPC描画（npc-sprite.js）は読み取り利用のみ。
 * 外部画像は使わない（実行時描画）。
 */
(function () {
  const SPR = globalThis.KE_SPRITE;
  const NPC_SPRITE = globalThis.KE_NPC_SPRITE;
  const ANI = globalThis.KE_ANIMATION;

  /* ---- 基本パレット（css/style.css のトークンと一致） ---- */
  const SKY = "#A9D6D2";
  const GRASS = "#7FA650";
  const GRASS_DARK = "#56733E";
  const WOOD = "#9A6642";
  const WOOD_DARK = "#5B3A29";
  const WOOD_LIGHT = "#B57C52";
  const SOIL = "#C9965B";
  const PAPER = "#F4DDAA";
  const SUN = "#E9B949";
  const CLOUD = "#E8F1F0";
  const WINDOW = "#BBD6E8";
  const WINDOW_FRAME = "#7A9A8A";
  const HORIZON = "#7FA9A2";
  const FLOOR = "#B98A55";

  const KNOWN_BG = { office: 1, elevator: 1, breakroom: 1, dining: 1, outdoor: 1 };

  function makeCanvas(cols, rows, s) {
    const canvas = document.createElement("canvas");
    canvas.width = cols * s;
    canvas.height = rows * s;
    canvas.style = canvas.style || {};
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    return { cv: canvas, ctx: ctx, s: s };
  }

  /** 背景（ピクセル風景）を描く。120×28グリッド（scale s で拡大） */
  function renderBackground(backgroundKey, scale) {
    const s = Math.max(1, Math.floor(scale || 3));
    const c = makeCanvas(120, 28, s);
    const P = function (x, y, w, h, color) {
      if (!color) return;
      c.ctx.fillStyle = color;
      c.ctx.fillRect(x * s, y * s, w * s, h * s);
    };
    const key = KNOWN_BG[backgroundKey] ? backgroundKey : "outdoor";

    // 空
    P(0, 0, 120, 16, SKY);
    // 太陽
    P(6, 3, 2, 2, SUN);
    P(6, 1, 2, 1, SUN);
    P(5, 2, 1, 1, SUN); P(9, 2, 1, 1, SUN);
    // 雲
    P(30, 4, 6, 2, CLOUD); P(33, 3, 3, 1, CLOUD);
    P(60, 6, 7, 2, CLOUD); P(63, 5, 3, 1, CLOUD);
    P(96, 4, 5, 2, CLOUD);

    if (key === "office") {
      P(0, 16, 120, 1, HORIZON);
      P(0, 17, 120, 11, FLOOR);
      // 窓
      P(96, 4, 18, 10, WINDOW); P(96, 4, 18, 1, WINDOW_FRAME); P(105, 4, 1, 10, WINDOW_FRAME); P(96, 11, 18, 2, WINDOW_FRAME);
      // 机
      P(18, 15, 30, 2, WOOD_LIGHT); P(18, 20, 30, 2, WOOD); P(18, 15, 2, 7, WOOD); P(46, 15, 2, 7, WOOD);
      // モニタ
      P(30, 11, 14, 4, "#2E4C62"); P(28, 11, 18, 1, WOOD_DARK); P(34, 10, 4, 1, WOOD_DARK);
      // 棚
      P(6, 8, 12, 8, WOOD); P(8, 10, 8, 1, PAPER); P(8, 12, 8, 1, PAPER); P(8, 14, 8, 1, PAPER);
    } else if (key === "elevator") {
      P(0, 16, 120, 1, HORIZON);
      P(0, 17, 120, 3, "#3A3A40"); P(0, 24, 120, 4, "#5A5A62");
      P(0, 0, 3, 28, "#6A6A72"); P(117, 0, 3, 28, "#6A6A72");
      // 中央扉
      P(46, 2, 12, 24, "#8A8A92"); P(62, 2, 12, 24, "#8A8A92"); P(58, 2, 2, 24, "#3A3A40");
      P(38, 10, 8, 1, "#9A9AA2"); P(74, 10, 8, 1, "#9A9AA2");
    } else if (key === "breakroom") {
      P(0, 16, 120, 1, HORIZON); P(0, 17, 120, 11, WOOD);
      P(36, 3, 24, 11, WINDOW); P(48, 3, 2, 11, WINDOW_FRAME);
      P(16, 17, 30, 9, WOOD_DARK); P(18, 16, 26, 2, "#D9A93B"); P(16, 16, 3, 8, "#B5832E"); P(43, 16, 3, 8, "#B5832E");
      P(96, 20, 14, 2, WOOD_LIGHT); P(96, 22, 2, 4, WOOD); P(108, 22, 2, 4, WOOD);
    } else if (key === "dining") {
      P(0, 16, 120, 1, HORIZON); P(0, 17, 120, 11, SOIL);
      P(16, 15, 30, 2, PAPER); P(16, 17, 30, 8, WOOD_DARK); P(16, 25, 30, 2, WOOD);
      P(24, 12, 4, 3, "#BBD6E8"); P(38, 11, 6, 2, "#EFD9B8");
      P(66, 2, 2, 13, WOOD); P(58, 5, 18, 6, PAPER); P(60, 7, 14, 1, WOOD_DARK); P(60, 9, 9, 1, WOOD_DARK);
    } else {
      // outdoor
      P(0, 16, 120, 1, HORIZON);
      P(0, 17, 120, 7, GRASS); P(0, 24, 120, 4, GRASS_DARK);
      P(56, 17, 8, 11, SOIL); P(54, 17, 2, 1, SOIL); P(66, 17, 2, 1, SOIL);
      P(10, 14, 3, 10, WOOD_DARK); P(4, 8, 15, 9, GRASS_DARK); P(7, 5, 9, 6, GRASS);
      P(104, 14, 3, 10, WOOD_DARK); P(98, 8, 15, 9, GRASS_DARK); P(101, 5, 9, 6, GRASS);
      P(30, 22, 1, 1, "#C96FA0"); P(80, 22, 1, 1, SUN); P(118, 23, 1, 1, "#C96FA0");
    }
    return c.cv;
  }

  /** NPCモーション → 表情キー（talk は喋っている口を交互に） */
  function npcFaceForMotion(motion, frame) {
    if (motion === "talk") return frame % 2 === 0 ? "normal" : "talk";
    return NPC_SPRITE.expressionToFace(motion || "idle");
  }

  /**
   * 背景＋人物を1枚に合成した1コマを返す。
   * state: { background, gender, pet:{speciesId, condition}, npcId, npcMotion, scale }
   * 人物は地面線上に立って、フレームごとに呼吸（上下1ドット）する。
   */
  function renderSceneFrame(state, frame) {
    const st = state || {};
    const s = Math.max(1, Math.floor(st.scale || 3));
    const c = makeCanvas(120, 28, s);
    const ctx = c.ctx;
    // 背景
    ctx.drawImage(renderBackground(st.background, s), 0, 0);

    const f = (frame == null ? 0 : frame) % 4;
    const breath = f % 2 === 0 ? 0 : s; // 呼吸
    const groundY = 25 * s;

    // あなた（顔アイコン。背景の地面へ）
    const userCv = SPR.renderUserAvatar((st.gender || "male"), s);
    // ペット（待機モーション＋呼吸）
    let petCv = null;
    if (st.pet && st.pet.speciesId) {
      petCv = SPR.renderPetFrame(st.pet.speciesId, petMotionForCondition(st.pet.condition), f, s, {});
    }
    // NPC（モーションに応じた表情＋呼吸）
    const npcCv = NPC_SPRITE.renderNpcFrame(st.npcId, npcFaceForMotion(st.npcMotion, f), s);

    function drawAt(cv, col) {
      if (!cv) return;
      ctx.drawImage(cv, col * s - cv.width / 2, groundY - cv.height - breath);
    }
    drawAt(userCv, 12);
    drawAt(petCv, 50);
    drawAt(npcCv, 96);
    return c.cv;
  }

  function petMotionForCondition(condition) {
    return { perfect: "happy", happy: "happy", normal: "idle", lonely: "troubled", sleepy: "sleepy", sick: "sleepy" }[condition] || "idle";
  }

  /** 会話シーンをループ再生する（呼吸・発言・表情が動く「画像」になる） */
  function playScene(hostEl, state, opts) {
    const o = opts || {};
    const frames = o.frames || 4;
    const fps = o.fps || 4;
    return ANI.play(hostEl, function (f) {
      return renderSceneFrame(state, f);
    }, { frames: frames, fps: fps, loop: true, aria: o.aria, after: o.after });
  }

  const KE_CONV_SCENE = {
    renderBackground: renderBackground,
    renderSceneFrame: renderSceneFrame,
    playScene: playScene,
    npcFaceForMotion: npcFaceForMotion
  };

  if (globalThis) globalThis.KE_CONV_SCENE = KE_CONV_SCENE;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_CONV_SCENE };
})();
