"use strict";
/*
 * kenecho Village - ペットのピクセル定義（KE_PIXEL_PETS）
 * 共通のボディ（16×16文字グリッド）に、種類別の「耳・しっぽ・模様」を
 * アクセサリとして重ね、顔（目・口）は表情フレームで差し替える。
 * 色は UI 基本色パレットと各ペットのテーマ色を使う。
 * すべて本作品独自のオリジナルデザイン。
 *
 * グリッド文字: B=body / E=eye(標準) / M=mouth / F=foot / D=dark shading
 */
(function () {
  const BASE = [
    "......BB......",
    ".....BBBB.....",
    "....BBBBBB....",
    "...BBBBBBBB...",
    "..BBBBBBBBBB..",
    "..BBBBBBBBBB..",
    ".BBBBBBBBBBBB.",
    ".BBBEBBBBEBBB.",
    ".BBBBBBBBBBBB.",
    "..BBBBMMBBBB..",
    "..BBBBBBBBBB..",
    "...BBBBBBBB...",
    "....BBBBBB....",
    ".....BBBB.....",
    ".....F..F.....",
    ".....F..F....."
  ];

  const ACCESSORIES = {
    rabbit: {
      color: "#EFE1C6", dark: "#C9B185",
      ears: [
        { x: 4, y: 0, cells: "EE", color: "#EFE1C6" },
        { x: 10, y: 0, cells: "EE", color: "#EFE1C6" },
        { x: 4, y: 1, cells: "EE", color: "#C9B185" },
        { x: 10, y: 1, cells: "EE", color: "#C9B185" }
      ],
      tail: null, note: "長い耳のうさぎ"
    },
    fox: {
      color: "#D9824B", dark: "#A94E45",
      ears: [
        { x: 3, y: 0, cells: "E", color: "#D9824B" },
        { x: 12, y: 0, cells: "E", color: "#D9824B" },
        { x: 3, y: 1, cells: "E", color: "#EFE1C6" },
        { x: 12, y: 1, cells: "E", color: "#EFE1C6" }
      ],
      tail: { x: 14, y: 12, cells: "TT", color: "#D9824B" }, note: "しっぽのきつね"
    },
    bearcub: {
      color: "#9A6642", dark: "#5B3A29",
      ears: [
        { x: 4, y: 1, cells: "E", color: "#9A6642" },
        { x: 11, y: 1, cells: "E", color: "#9A6642" },
        { x: 5, y: 2, cells: "E", color: "#5B3A29" },
        { x: 10, y: 2, cells: "E", color: "#5B3A29" }
      ],
      tail: null, note: "丸い耳のこぐま"
    },
    cat: {
      color: "#A9A9A0", dark: "#7A766F",
      ears: [
        { x: 3, y: 0, cells: "E", color: "#A9A9A0" },
        { x: 12, y: 0, cells: "E", color: "#A9A9A0" },
        { x: 3, y: 1, cells: "E", color: "#EFE1C6" },
        { x: 12, y: 1, cells: "E", color: "#EFE1C6" }
      ],
      tail: { x: 14, y: 10, cells: "TT", color: "#A9A9A0" }, note: "とがった耳のねこ"
    },
    bird: {
      color: "#7FA650", dark: "#56733E",
      ears: null,
      tail: { x: 14, y: 9, cells: "TT", color: "#56733E" },
      beak: "ornage", note: "小さなことり"
    },
    tanuki: {
      color: "#C9965B", dark: "#8A6240",
      ears: [
        { x: 4, y: 0, cells: "E", color: "#C9965B" },
        { x: 11, y: 0, cells: "E", color: "#C9965B" }
      ],
      tail: { x: 0, y: 12, cells: "TT", color: "#C9965B" }, note: "縞しっぽのたぬき"
    }
  };

  /** 表情フレーム: 目Eと口Mのセルを差し替える { eyes:[[x,y,color]...], mouth:[[x,y,color]...] } */
  const FACES = {
    normal: { eyes: [["E", 7, 7], ["E", 10, 7]], mouth: [["M", 9, 9], ["M", 10, 9]] },
    blink: { eyes: [["-", 7, 7], ["-", 10, 7]], mouth: [["M", 9, 9], ["M", 10, 9]] },
    happy: { eyes: [["u", 7, 7], ["u", 10, 7]], mouth: [["o", 9, 9], ["O", 10, 9]] },
    happyOpen: { eyes: [["u", 7, 7], ["u", 10, 7]], mouth: [["O", 8, 9], ["O", 9, 9], ["O", 10, 9]] },
    sleepy: { eyes: [["-", 7, 7], ["-", 10, 7]], mouth: [["~", 9, 9], ["~", 10, 9]] },
    troubled: { eyes: [["v", 7, 7], ["v", 10, 7]], mouth: [["w", 9, 9], ["v", 10, 9]] },
    talk: { eyes: [["E", 7, 7], ["E", 10, 7]], mouth: [["O", 9, 9], ["O", 10, 9]] },
    eat: { eyes: [["E", 7, 7], ["E", 10, 7]], mouth: [["M", 8, 9], ["M", 9, 9], ["M", 11, 9]] }
  };

  const FACES_COLORS = { E: "#3E2F28", M: "#3E2F28", "-": null, u: "#3E2F28", o: "#3E2F28", O: "#3E2F28", v: "#3E2F28", "~": "#3E2F28", w: "#3E2F28" };

  const KE_PIXEL_PETS = {
    BASE: BASE,
    ACCESSORIES: ACCESSORIES,
    FACES: FACES,
    FACES_COLORS: FACES_COLORS
  };

  if (globalThis) globalThis.KE_PIXEL_PETS = KE_PIXEL_PETS;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_PIXEL_PETS };
})();
