"use strict";
/*
 * kenecho Village - 架空NPCデータ（KE_NPCS）
 * 実在人物・実際の社員をモデルにしないオリジナルキャラクター（8名）。
 * 会話シーンの割当（sceneIds）は M9 で行う。
 */
(function () {
  const KE_NPCS = [
    {
      id: "npc_sato", displayName: "佐藤さん", role: "職場の先輩",
      personality: "gentle", speechStyle: "soft", sceneIds: ["scn_work_a", "scn_work_b"],
      spriteId: "npc_sato", initialBond: 40,
      intro: "穏やかで話しやすい先輩。初心者の質問にも笑顔で答えてくれる。",
      metPlace: "初出勤の日に、エレベーター前で声をかけられた",
      nextHint: "仕事の悩みを打ち明けると話が広がりそう"
    },
    {
      id: "npc_yamada", displayName: "山田さん", role: "慎重な同僚",
      personality: "cautious", speechStyle: "considerate", sceneIds: ["scn_work_c"],
      spriteId: "npc_yamada", initialBond: 40,
      intro: "言葉を選ぶように話す、落ち着いた同期の同僚。",
      metPlace: "入社研修のグループワークで一緒になった",
      nextHint: "締め切りの話など、実務の話題をきっかけにすると距離が縮まる"
    },
    {
      id: "npc_konno", displayName: "今野さん", role: "明るい店員",
      personality: "bright", speechStyle: "cheerful", sceneIds: ["scn_food_a"],
      spriteId: "npc_konno", initialBond: 40,
      intro: "いつも元気な声で迎えてくれる、商店街のパン屋さん。",
      metPlace: "通勤路のパン屋で朝のパンを買ったとき",
      nextHint: "おすすめを聞いてみると、よく話してくれる"
    },
    {
      id: "npc_nakamura", displayName: "中村さん", role: "好奇心の強い知人",
      personality: "curious", speechStyle: "inquisitive", sceneIds: ["scn_daily_a", "scn_daily_b"],
      spriteId: "npc_nakamura", initialBond: 40,
      intro: "いろんな趣味に首を突っ込む、話好きの知人。",
      metPlace: "ジムの更衣室で時間つぶしに話した",
      nextHint: "趣味の話をすると目を輝かせる"
    },
    {
      id: "npc_tanaka", displayName: "田中さん", role: "簡潔に話す上司",
      personality: "concise", speechStyle: "brief", sceneIds: ["scn_work_d", "scn_work_e"],
      spriteId: "npc_tanaka", initialBond: 40,
      intro: "必要なことだけを短く伝える、さっぱりした上司。",
      metPlace: "配属初日の夜に声をかけられた",
      nextHint: "簡潔な報告・確認が信頼につながる"
    },
    {
      id: "npc_suzuki", displayName: "鈴木さん", role: "人見知りの近所の住人",
      personality: "shy", speechStyle: "quiet", sceneIds: ["scn_daily_c", "scn_daily_d", "scn_daily_e"],
      spriteId: "npc_suzuki", initialBond: 40,
      intro: "気持ちは優しいけれど、自分から話すのが苦手な住人。",
      metPlace: "朝、家の前に立っているのを見かけた",
      nextHint: "短いあいさつを重ねるだけでも、少しずつ打ち解ける"
    },
    {
      id: "npc_hanada", displayName: "花田さん", role: "世話好きな食堂スタッフ",
      personality: "caring", speechStyle: "warm", sceneIds: ["scn_food_b", "scn_food_c"],
      spriteId: "npc_hanada", initialBond: 40,
      intro: "体のことを気づかってくれる、アットホームな食堂のスタッフ。",
      metPlace: "残業帰りに寄った夜食屋台で話した",
      nextHint: "食事の話や元気の話をすると気遣われやすい"
    },
    {
      id: "npc_kato", displayName: "加藤さん", role: "ユーモアのある友人",
      personality: "humorous", speechStyle: "light", sceneIds: ["scn_daily_f", "scn_daily_g", "scn_daily_h"],
      spriteId: "npc_kato", initialBond: 40,
      intro: "いつも面白い話を探している、気軽な友人。",
      metPlace: "週末の野球観戦帰りに隣の席になった",
      nextHint: "軽いノリに一緒に乗れると関係が深まる"
    }
  ];

  if (globalThis) globalThis.KE_NPCS = KE_NPCS;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_NPCS };
})();
