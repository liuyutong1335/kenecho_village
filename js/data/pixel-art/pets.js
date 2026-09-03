"use strict";
/*
 * kenecho Village - ペットのピクセル定義（KE_PIXEL_PETS）
 * 6種それぞれに独立した 16×16 の輪郭（body）を持ち、種類がひと目でわかる。
 * 顔（目・口）は FACES のフレームで差し替える（座標は全種共通）。
 * 色は UI 基本色パレットと各ペットのテーマ色を使う。
 * すべて本作品独自のオリジナルデザイン。
 *
 * グリッド文字: B=body / D=dark(濃い側影) / d=dark(淡い側影)
 *   / F=foot(足) / T=tail(しっぽ・アクセント) / W=white(薄い腹・口元) / .=透明
 * body を定義した種は耳・しっぽも body に含める（sprite.js は body 優先で合成する）。
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
    /* うさぎ：立つ長い耳・丸い身体・白い腹 */
    rabbit: {
      color: "#EFE1C6", dark: "#C9B185",
      ears: null, tail: null, note: "長い耳のうさぎ",
      body: [
        "...BB......BB...",
        "...BB......BB...",
        "...BB......BB...",
        "...BB......BB...",
        "..BBB.BBBB.BBB..",
        "..BBBBBBBBBBBB..",
        ".BBBBBBBBBBBBBB.",
        ".BBBBBBBBBBBBBB.",
        ".BBBBWWWWWWWWBB.",
        "..BBBWBBBBBWBB..",
        "..BBWWBBBBWWBB..",
        "...BBBBWWBBBB...",
        "....BBBBBBBB....",
        ".F....BBBB....F.",
        "..F...BBBB...F..",
        "................"
      ]
    },
    /* きつね：三角の尖耳・尖った口元・ふさふさの大きなしっぽ */
    fox: {
      color: "#D9824B", dark: "#A94E45",
      ears: null, tail: null, note: "ふさふさしっぽのきつね",
      body: [
        "..B...........B.",
        "..B...........B.",
        "...B.........B..",
        "...BBBBBBBBBB...",
        "..BBBBWBBBBWBB..",
        ".BBBBBBBBBBBBBB.",
        ".BBWWWWWWWWWWBB.",
        "BBWWWWWWWWWWWWBB",
        ".BBWWWWWWWWWWBB.",
        "..BBBBWBBBBBB...",
        "..BBBBBBBBBB.BB.",
        "...BBBBBBBB..TT.",
        "....BBBBBB..TTT.",
        ".F....BBB..TTTT.",
        "..F...BB...TTT..",
        "................"
      ]
    },
    /* こぐま：丸い耳・大きくて丸い身体・太い足 */
    bearcub: {
      color: "#9A6642", dark: "#5B3A29",
      ears: null, tail: null, note: "丸い耳のこぐま",
      body: [
        "................",
        "................",
        "....B......B....",
        "....BB....BB....",
        "...BBBBBBBBBB...",
        "..BBBBBBBBBBBB..",
        ".BBBBBBBBBBBBBB.",
        ".BBBBBBBBBBBBBB.",
        ".BBBBBBBWBBBBBB.",
        ".BB..BBWWBB..BB.",
        ".BBBBBBWWBBBBBB.",
        ".BBBBBBBBBBBBBB.",
        ".BBBBWWWWWWBBBB.",
        ".F...BBBBBB...F.",
        ".FF..BBBBBB..FF.",
        ".F...BBBBBB...F."
      ]
    },
    /* ねこ：とんがり耳・スマートな身体・長いしっぽ */
    cat: {
      color: "#A9A9A0", dark: "#7A766F",
      ears: null, tail: null, note: "とがった耳のねこ",
      body: [
        ".B............B.",
        ".B............B.",
        ".BB..........BB.",
        "..BBBBBBBBBBBB..",
        "..BBBBBBBBBBBB..",
        "..BBBBBBBBBBBB..",
        ".BBBBBBBBBBBBBB.",
        ".BBBBBBBBBBBBBB.",
        "..BBWWWWWWWBB...",
        "..BBBBBBBBBB....",
        "...BBBBBBBB.BB..",
        "...BBBBBBBB..BB.",
        "....BBBBBB...BB.",
        "....BBBBB.....T.",
        ".F....BBB.....T.",
        "..F...BBB....T.."
      ]
    },
    /* ことり：丸い身体・尖ったくちばし・翼と小さなしっぽ */
    bird: {
      color: "#7FA650", dark: "#56733E",
      ears: null, tail: null, note: "小さなことり",
      body: [
        "................",
        ".TT.............",
        ".TT.............",
        "..TTT...........",
        "....BBBBBBBB....",
        "..BBBBBBBBBBBB..",
        ".BBBBBBBBBBBBBB.",
        ".BBBBBBBBBBBBBB.",
        "..BBBBWBBBBBBB..",
        "...BBWDDDBBB....",
        "..BBBBBBBBB.....",
        ".BWBWWBBBBBB....",
        "..BBBBBBBBB.....",
        "..F..BBB..F.....",
        "..F..F..F.......",
        "................"
      ]
    },
    /* たぬき：丸い耳・丸い身体・縞しっぽ */
    tanuki: {
      color: "#C9965B", dark: "#8A6240",
      ears: null, tail: null, note: "縞しっぽのたぬき",
      body: [
        "................",
        "................",
        "...B........B...",
        "...BB.BBBB.BB...",
        "..BBBBBBBBBBBB..",
        ".BBBBBBBBBBBBBB.",
        ".BBBBBBBBBBBBBB.",
        ".BBBBBBBBBBBBBB.",
        "..BBBBBBBBBBBB..",
        "..BBWWWBBWWWBB..",
        "..BBBBBBBBBBBB..",
        "...BBBBWWBBBB...",
        "....BBBBBBBB....",
        ".F...BBBB...TTT.",
        "..F..BBBB...TT..",
        "..F..BBBB...TT.."
      ]
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
