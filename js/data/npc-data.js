"use strict";
/*
 * kenecho Village - 架空NPCデータ（KE_NPCS）
 * 実在人物・実際の社員をモデルにしないオリジナルキャラクター（8名）。
 * 導入文・出会い・解放ヒント・シーン割当の詳細は M8 / M9 で拡充する。
 *
 * Npc: { id, displayName, role, personality, speechStyle, sceneIds[], spriteId, initialBond, intro, metPlace, nextHint }
 */
(function () {
  const KE_NPCS = [
    { id: "npc_sato", displayName: "佐藤さん", role: "職場の先輩", personality: "gentle", speechStyle: "soft", sceneIds: [], spriteId: "npc_sato", initialBond: 40, intro: "", metPlace: "", nextHint: "" },
    { id: "npc_yamada", displayName: "山田さん", role: "慎重な同僚", personality: "cautious", speechStyle: "considerate", sceneIds: [], spriteId: "npc_yamada", initialBond: 40, intro: "", metPlace: "", nextHint: "" },
    { id: "npc_konno", displayName: "今野さん", role: "明るい店員", personality: "bright", speechStyle: "cheerful", sceneIds: [], spriteId: "npc_konno", initialBond: 40, intro: "", metPlace: "", nextHint: "" },
    { id: "npc_nakamura", displayName: "中村さん", role: "好奇心の強い知人", personality: "curious", speechStyle: "inquisitive", sceneIds: [], spriteId: "npc_nakamura", initialBond: 40, intro: "", metPlace: "", nextHint: "" },
    { id: "npc_tanaka", displayName: "田中さん", role: "簡潔に話す上司", personality: "concise", speechStyle: "brief", sceneIds: [], spriteId: "npc_tanaka", initialBond: 40, intro: "", metPlace: "", nextHint: "" },
    { id: "npc_suzuki", displayName: "鈴木さん", role: "人見知りの近所の住人", personality: "shy", speechStyle: "quiet", sceneIds: [], spriteId: "npc_suzuki", initialBond: 40, intro: "", metPlace: "", nextHint: "" },
    { id: "npc_hanada", displayName: "花田さん", role: "世話好きな食堂スタッフ", personality: "caring", speechStyle: "warm", sceneIds: [], spriteId: "npc_hanada", initialBond: 40, intro: "", metPlace: "", nextHint: "" },
    { id: "npc_kato", displayName: "加藤さん", role: "ユーモアのある友人", personality: "humorous", speechStyle: "light", sceneIds: [], spriteId: "npc_kato", initialBond: 40, intro: "", metPlace: "", nextHint: "" }
  ];

  if (globalThis) globalThis.KE_NPCS = KE_NPCS;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_NPCS: KE_NPCS };
})();
