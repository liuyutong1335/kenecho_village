"use strict";
/*
 * kenecho Village - NPC描画（KE_NPC_SPRITE）
 * js/data/pixel-art/npcs.js（KE_PIXEL_NPCS）のchibi人型定義をCanvasへ描画する。
 * - 共通ボディ＋髪型＋配色で8名を描き分け、表情（目・口）をフレームで差し替える。
 * - 既存のペット描画（sprite.js）は変更せず、本モジュールは読み取りのみで利用する。
 * 外部画像は使わない（実行時描画）。
 */
(function () {
  const PX = globalThis.KE_PIXEL_NPCS;

  const SKIN = "#F2D3AD";
  const EYE = "#3A2A24";
  const MOUTH = "#5A3A2A";
  const GLASS = "#2A2A30";

  /** 表情フレーム（行4=目・行5=口のセル座標 [row, col]） */
  const FACE_CELLS = {
    normal: { eyes: [[4, 4], [4, 7]], mouth: [[5, 5]] },
    smile: { eyes: [[4, 4], [4, 7]], mouth: [[5, 5], [5, 6]] },
    happy: { eyes: [[4, 4], [4, 7]], mouth: [[5, 4], [5, 5], [5, 6], [5, 7]] },
    shy: { eyes: [[4, 4], [4, 5], [4, 6], [4, 7]], mouth: [[5, 5]] },
    troubled: { eyes: [[5, 4], [5, 7]], mouth: [[5, 5], [5, 6]] },
    talk: { eyes: [[4, 4], [4, 7]], mouth: [[5, 4], [5, 5], [5, 6]] }
  };

  /** 会話シーンの npcExpression → 表情キー（未定義は normal） */
  function expressionToFace(expression) {
    switch (expression) {
      case "happy":
      case "warm":
        return "happy";
      case "smile":
      case "soft":
      case "curious":
      case "humorous":
        return "smile";
      case "shy":
        return "shy";
      case "troubled":
      case "sad":
        return "troubled";
      case "talk":
        return "talk";
      default: // neutral / concise / cautious など
        return "normal";
    }
  }

  /** Canvas生成（document 非依存のピュア描画。Nodeテストでは stub を注入） */
  function makeCanvas(cols, rows, s) {
    const canvas = document.createElement("canvas");
    canvas.width = cols * s;
    canvas.height = rows * s;
    canvas.style = canvas.style || {};
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    return { canvas: canvas, ctx: ctx, s: s };
  }

  function paint(c, x, y, color) {
    if (!color) return;
    c.ctx.fillStyle = color;
    c.ctx.fillRect(x * c.s, y * c.s, c.s, c.s);
  }

  function paintRow(c, row, cells, color) {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] !== "." && cells[i] !== " ") paint(c, i, row, color);
    }
  }

  /** NPCの1コマを Canvas で返す（npcId 不明ならシルエット） */
  function renderNpcFrame(npcId, faceKey, scale, opts) {
    const o = opts || {};
    const s = Math.max(1, Math.floor(scale || 3));
    const npc = (PX && PX.NPCS && PX.NPCS[npcId]) || null;
    const body = (PX && PX.BODY) || [];
    const hairRows = npc ? (((PX.HAIR_STYLES && PX.HAIR_STYLES[npc.hairStyle]) || (PX.HAIR_STYLES && PX.HAIR_STYLES.short)) || []) : [];
    const dimmed = !!o.dim; // 未公開・未発見のシルエット表現（予約）
    const cols = body[0] ? body[0].length : 12;
    const rows = body.length || 16;
    const c = makeCanvas(cols, rows, s);
    const def = {
      F: SKIN,
      S: npc ? npc.shirtColor : "#5A554E",
      P: npc ? npc.pantsColor : "#3A3430",
      K: npc ? npc.shoesColor : "#241F1D"
    };
    // ボディ
    for (let y = 0; y < rows; y++) {
      const row = body[y] || "";
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        const color = dimmed ? "#4A4442" : def[ch];
        if (ch === "F" || ch === "S" || ch === "P" || ch === "K") paint(c, x, y, color);
      }
    }
    // エプロン（店員系）は胴（行9-11）の中央へ
    if (npc && npc.apronColor) {
      for (let y = 9; y <= 11; y++) {
        for (let x = 3; x <= 8; x++) paint(c, x, y, dimmed ? "#4A4442" : npc.apronColor);
      }
      // エプロン紐（胸元）
      for (let x = 2; x <= 9; x += 1) paint(c, x, 8, dimmed ? "#4A4442" : shade(npc.apronColor, -40));
    }
    // 髪
    for (let y = 0; y < hairRows.length; y++) {
      const row = hairRows[y] || "";
      for (let x = 0; x < row.length; x++) {
        if (row[x] === "H") paint(c, x, y, dimmed ? "#6A625E" : npc.hairColor);
      }
    }
    // 表情（目・口）
    const face = FACE_CELLS[faceKey] || FACE_CELLS.normal;
    (face.eyes || []).forEach(function (p2) { paint(c, p2[1], p2[0], dimmed ? "#5A524E" : EYE); });
    (face.mouth || []).forEach(function (p2) { paint(c, p2[1], p2[0], dimmed ? "#5A524E" : MOUTH); });
    // メガネ（好奇心の知人）
    if (npc && npc.glasses && !dimmed) {
      paint(c, 3, 4, GLASS);
      paint(c, 8, 4, GLASS);
      paint(c, 4, 4, GLASS);
      paint(c, 7, 4, GLASS);
    }
    return c.canvas;
  }

  /** 色を明/暗へ寄せる簡易ヘルパ */
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 0xff) + amt, b = (n & 0xff) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  /** canvas へ class/aria を付与して要素として返す */
  function canvasTag(canvas, alt, className) {
    canvas.setAttribute("class", className || "sprite-canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", alt || "");
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    return canvas;
  }

  const KE_NPC_SPRITE = {
    renderNpcFrame: renderNpcFrame,
    expressionToFace: expressionToFace,
    FACE_CELLS: FACE_CELLS,
    canvasTag: canvasTag
  };

  if (globalThis) globalThis.KE_NPC_SPRITE = KE_NPC_SPRITE;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_NPC_SPRITE };
})();
