"use strict";
/*
 * kenecho Village - NPCのピクセル定義（KE_PIXEL_NPCS）
 * 8名の架空NPCを16（行）×12（列）のchibi人型で表現する。
 * ボディ（共通テンプレート）＋髪型（スタイル別）＋配色（hair/shirt/pants/shoes/apron）で個性を出す。
 * 顔（目・口）は npc-sprite.js が表情フレームで差し替える。
 *
 * グリッド文字: H=髪 / F=肌 / S=服 / A=エプロン等のアクセサリ / P=ズボン / K=靴 / .=透明
 * すべて本作品独自のオリジナルデザイン。
 */
(function () {
  /** 共通ボディ（16行）。顔領域は行3-7、目は行4、口は行5（npc-sprite がオーバーレイ） */
  const NPC_BODY = [
    "............", //  0 髪上
    "............", //  1 髪
    "............", //  2 髪
    "....FFFF....", //  3 額
    "...FFFFFF...", //  4 顔（目）
    "...FFFFFF...", //  5 顔（口）
    "...FFFFFF...", //  6 顔・顎
    "...FF..FF...", //  7 首元
    "..SSSSSSSS..", //  8 肩
    ".SSSSSSSSSS.", //  9 胴
    ".SSSSSSSSSS.", // 10 胴（エプロンはここへ重ねる）
    ".SSSSSSSSSS.", // 11 胴下
    "..PPPPPPPP..", // 12 腰
    "..PPPPPPPP..", // 13 腰下
    "..PP....PP..", // 14 脚
    "..KK....KK.."  // 15 靴
  ];

  /** 髪型（行0-2の先頭 & 行3のサイドロック）。'.' は下のボディを透かす */
  const HAIR_STYLES = {
    short: [
      "....HHHH....",
      "...HHHHHH...",
      "..HHHHHHHH..",
      "..H.......H.."
    ],
    bob: [
      "....HHHH....",
      "...HHHHHH...",
      "..HHHHHHHH..",
      "..HHHHHHHH.."
    ],
    curly: [
      "....HH......",
      "...HHHHH....",
      "...HHHHHHH..",
      "..H......HH.."
    ],
    bun: [
      ".HH..HHH....",   // 頭頂のまとめ髪
      "...HHHHHH...",
      "..HHHHHHHH..",
      "..HHHFFFFH.."
    ]
  };

  /** 8名のNPC定義。ヘア・服・ズボン・靴の配色と、店員系はエプロンを持つ */
  const NPCS = {
    npc_sato: {
      label: "佐藤さん", hairStyle: "short", hairColor: "#8A6A4A", shirtColor: "#6A8FA8", pantsColor: "#7A7A7A", shoesColor: "#4A3A2A", apronColor: null, glasses: false
    },
    npc_yamada: {
      label: "山田さん", hairStyle: "short", hairColor: "#3A3A40", shirtColor: "#4A6FA5", pantsColor: "#44495A", shoesColor: "#33333A", apronColor: null, glasses: false
    },
    npc_konno: {
      label: "今野さん", hairStyle: "bob", hairColor: "#D9A93B", shirtColor: "#F4F4F4", pantsColor: "#8A6A4A", shoesColor: "#6A4A3A", apronColor: "#B0523A", glasses: false
    },
    npc_nakamura: {
      label: "中村さん", hairStyle: "curly", hairColor: "#7A5230", shirtColor: "#C96F35", pantsColor: "#5A6F9A", shoesColor: "#3A3A40", apronColor: null, glasses: true
    },
    npc_tanaka: {
      label: "田中さん", hairStyle: "short", hairColor: "#6A6A6A", shirtColor: "#4A4A52", pantsColor: "#2F2F35", shoesColor: "#1F1F24", apronColor: null, glasses: false
    },
    npc_suzuki: {
      label: "鈴木さん", hairStyle: "bob", hairColor: "#2A2A30", shirtColor: "#5A8A5A", pantsColor: "#C9A06A", shoesColor: "#6A523A", apronColor: null, glasses: false
    },
    npc_hanada: {
      label: "花田さん", hairStyle: "bun", hairColor: "#9A4A3A", shirtColor: "#8A3A4A", pantsColor: "#5A4A3A", shoesColor: "#3A3030", apronColor: "#6A8A5A", glasses: false
    },
    npc_kato: {
      label: "加藤さん", hairStyle: "short", hairColor: "#33333A", shirtColor: "#E3B32A", pantsColor: "#5A6F9A", shoesColor: "#3A3A40", apronColor: null, glasses: false
    }
  };

  const KE_PIXEL_NPCS = {
    BODY: NPC_BODY,
    HAIR_STYLES: HAIR_STYLES,
    NPCS: NPCS
  };

  if (globalThis) globalThis.KE_PIXEL_NPCS = KE_PIXEL_NPCS;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_PIXEL_NPCS };
})();
