"use strict";
/*
 * kenecho Village - ペット別コーチ台詞データ（KE_COACH_SPEECH）約150件
 * 台詞は画面処理へ直接書かず、ここへ集約する。条件（種類/コーチ/成長段階/健康状態/
 * 回答分類/シーン分類/関係段階）に応じて dialogue-engine が重み付きで抽選する。
 *
 * 各ペット種の「声」（フィードバック・状態・シーン・イベント）を元に、
 * 成長段階グループ分けを含めて生成する（単純な複写ではなく、段階ごとのひとことを付す）。
 */
(function () {
  const VOICES = {
    rabbit: {
      coachType: "gentle",
      fb: {
        good: "共感してから質問を返せたね。",
        short: "あっさりしてたけど、失礼にはなってなかったよ。",
        bad: "話が止まりそうな返しだったね。"
      },
      cond: {
        perfect: "きょうはいい記録の連続だよ。まぶしいくらい！",
        happy: "記録がそろって、なんだか心がぽかぽかしてる。",
        lonely: "今日はまだ何もないみたい…。少し寂しいな。",
        sleepy: "眠そう…。今日はゆっくり休もうね。"
      },
      scene: {
        work: "お仕事の話は、ゆっくり自分の言葉で話すと伝わるよ。",
        daily: "毎日の小さなあいさつ、積み重ねが大事だね。",
        food: "ごはんの話は、誰とでも話しやすいね。"
      },
      ev: {
        level_up: "わあ、大きくなったね！ ここまで強くなったんだ。",
        departure: "元気をくれて、ありがとう。旅立つね…。",
        special: "特別な時間を一緒に過ごせて、うれしいよ。"
      },
      greet: "はじめまして。やさしく、ゆっくり話そうね。"
    },
    fox: {
      coachType: "calm",
      fb: {
        good: "相手の状況を考えた、理にかなった返しだった。",
        short: "短い返しは悪くない。ひと言の理由があるとより強い。",
        bad: "その返しは、会話の糸を切ってしまいがちだ。"
      },
      cond: {
        perfect: "すべて好調だ。この調子なら、どこへでも行ける。",
        happy: "きょうの記録は上々だ。この流れを保とう。",
        lonely: "記録がないと、何も掴めない。ひとつでも埋めよう。",
        sleepy: "睡眠不足は判断を鈍らせる。休むのも作戦だ。"
      },
      scene: {
        work: "仕事では、事実と期限を先に話すと伝わりやすい。",
        daily: "日常の観察は、あなたの引き出しを増やす。",
        food: "食事の話題は、共通の実感から入ると続く。"
      },
      ev: {
        level_up: "成長を確認した。次の段階が見えてきた。",
        departure: "この先も、冷静に歩いてゆけ。ささやかながら、誇りに思う。",
        special: "特別な機会だ。しっかり記録に残しておこう。"
      },
      greet: "こんにちは。私は、静かにどの子の進みを見ていたい。"
    },
    bearcub: {
      coachType: "energetic",
      fb: {
        good: "いいね！ その元気な返し、相手にも伝わるよ！",
        short: "短くても元気があれば十分！ 次は笑顔を足そう。",
        bad: "おっとー、それだと相手が困っちゃうかも！ 切り替えよう。"
      },
      cond: {
        perfect: "絶好調！ 今日は何にも負けない気分だ！",
        happy: "ご機嫌だね！ この調子でいこう！",
        lonely: "寂しいなあ…。今日は一緒に記録してみようよ！",
        sleepy: "眠いと元気も出ないよ。しっかり寝よう！"
      },
      scene: {
        work: "仕事も元気に、ひとつずつクリアしていこう！",
        daily: "毎日を明るく過ごすのが、いちばんの元気のモト！",
        food: "おいしいものを笑って食べよう！ 元気になるよ！"
      },
      ev: {
        level_up: "おお！ すごい大きくなるもんだ！ はじめ出したよ！",
        departure: "たくさん遊べてうれしかった。ありがとう！ いってきます！",
        special: "今日は特別だ！ はりきって、とびきりの笑顔を！"
      },
      greet: "ようこそ！ 元気があれば何だってできるぞ！"
    },
    cat: {
      coachType: "curious",
      fb: {
        good: "いいね、そこから相手のどんな話が出るか、気になる返しだった。",
        short: "ふつうの返しだね。ひと言足すと、話がぐんと動く気配。",
        bad: "その返しだと、相手の興味がしぼんじゃうかも。"
      },
      cond: {
        perfect: "完璧な1日だ。いろんな気づきがあったね。",
        happy: "ごきげんな一日。次の会話が楽しみだな。",
        lonely: "きょうはなんにもないの？ そ、そう…（つん）。",
        sleepy: "眠そうね…。私も陽だまりで微睡みたい気分。"
      },
      scene: {
        work: "仕事の会話も、小さな「なぜ？」で深くなるよ。",
        daily: "毎日の何気ない会話に、意外な発見が隠れてる。",
        food: "食べものの話は、記憶に残りやすい話題だね。"
      },
      ev: {
        level_up: "ふむ、ずいぶん成長したね。観察のしがいはある。",
        departure: "楽しかったよ。次の冒険も、ちゃんと見ているから。",
        special: "特別なことって、いつもひっそりと近づくんだよ。"
      },
      greet: "こんにちは。君の話、じっくり聞いてみたくなったよ。"
    },
    bird: {
      coachType: "cautious",
      fb: {
        good: "相手の反応をうかがった、安全な返しを選べたね。",
        short: "無難な返しなら一歩前進。次の言葉を少し足してみよう。",
        bad: "その返しは、相手を俯かせてしまうかも。同意から始めよう。"
      },
      cond: {
        perfect: "うんうん、今日はすごく落ち着いていたね。安心した。",
        happy: "いい気分そうだ。風が穏やかで、飛びやすい日だ。",
        lonely: "静かだね…。君の声が聞こえないと、心細いよ。",
        sleepy: "眠そうだね。鳥はねぐらで休むから、君も休もう。"
      },
      scene: {
        work: "仕事では、確認してから返すのが安心の作法だよ。",
        daily: "毎日のあいさつは、安全で優しい一歩だね。",
        food: "食事の会話は、魔やかな話題で始めるといいよ。"
      },
      ev: {
        level_up: "ずいぶんと育ったね。空の高さに驚いてるよ。",
        departure: "飛んでゆくね…。出会えてよかった。またどこかで。",
        special: "特別な日は、そっと写真に残すみたいに心に留めよう。"
      },
      greet: "こんにちは。私は遠くから見守るのが得意です。"
    },
    tanuki: {
      coachType: "playful",
      fb: {
        good: "お、いいノリじゃん！ その返し、思わずニヤリとしちゃう。",
        short: "そっけないくらいが、たまにはいいよね（笑）。",
        bad: "あちゃー、それは空振り！ 冗談はひとつまでにしておこう。"
      },
      cond: {
        perfect: "絶好調ドンガラガッチャ！ 今日の運は最強だ！",
        happy: "ご機嫌ドン！ この調子なら、何が出会っても大丈夫。",
        lonely: "今日はしょんぼりだね…。いつものドン、どこいった？",
        sleepy: "眠そうドン…。起きてるふりしてるの、バレバレだよ。"
      },
      scene: {
        work: "仕事の場でも、軽いひと言が心を解すことがあるよ。",
        daily: "日常に、ちょっとしたおもしろさを見つけよう！",
        food: "おいしい話は、とっておきのレシピ付きでくるんだよ。"
      },
      ev: {
        level_up: "おおきくなったドン！ 立派になるとわっしも鼻が高い！",
        departure: "楽しい思い出がいっぱいだドン。また会おう！",
        special: "特別な日は、こっそり幸せを集めておくのがコツだドン。"
      },
      greet: "こんにちはドン！ 今日はどんな面白いことが待ってるかな。"
    }
  };

  const STAGE_GROUPS = [
    { key: "child", stages: ["child"], tail: "まずは一緒にゆっくり覚えていこう。" },
    { key: "growing", stages: ["growing"], tail: "だんだん勘が良くなってきたね。" },
    { key: "settled", stages: ["adult", "companion"], tail: "経験を積んだ、堂々とした言葉になってきた。" }
  ];

  const COND_KEYS = ["perfect", "happy", "lonely", "sleepy"];
  const SCENE_TAGS = ["work", "daily", "food"];
  const RELATION_LEVELS = ["stranger", "familiar", "connected", "trusted", "partner"];

  /** 改善例（アドバイスの「今回のポイント＋改善例」のうち改善例）の口調・内容。
   *  内容（ADVICE_EXAMPLE）は全種共通で正しさを担保し、口調（ADVICE_LEAD）だけ種で変える。 */
  const ADVICE_LEAD = {
    rabbit: "たとえば、",
    fox: "例えば、",
    bearcub: "こうしてみよう。",
    cat: "試しに、",
    bird: "ええと、丁寧に言うなら、",
    tanuki: "おっと、この手もあるドン。"
  };
  const ADVICE_EXAMPLE = {
    good: "相手の言葉からひとつ質問を返すと、話がより続きやすくなるよ。",
    short: "「はい／いいえ」に、一言だけ自分の状況を添えると伝わりやすくなるよ。",
    bad: "まず相手の言葉を「そうなんだ」とオウム返ししてから、感想をひとつ添えてみよう。"
  };
  function adviceText(speciesId, at) {
    return (ADVICE_LEAD[speciesId] || "たとえば、") + ADVICE_EXAMPLE[at];
  }

  function build() {
    const out = [];
    const push = function (e) { out.push(e); };

    // ペット種別ごと
    Object.keys(VOICES).forEach(function (speciesId) {
      const v = VOICES[speciesId];
      STAGE_GROUPS.forEach(function (sg) {
        ["good", "short", "bad"].forEach(function (at) {
          push({
            id: "coach_" + speciesId + "_fb_" + sg.key + "_" + at,
            petTypes: [speciesId], coachTypes: [v.coachType],
            growthStages: sg.stages, petConditions: [],
            answerType: at, sceneTags: [], relationLevels: [], petRelationLevels: [],
            purpose: "feedback", text: v.fb[at] + sg.tail, adviceExample: adviceText(speciesId, at), weight: 10
          });
        });
      });
      COND_KEYS.forEach(function (ck) {
        push({
          id: "coach_" + speciesId + "_cond_" + ck,
          petTypes: [speciesId], coachTypes: [v.coachType],
          growthStages: ["child", "growing", "adult", "companion"], petConditions: [ck],
          answerType: null, sceneTags: [], relationLevels: [], petRelationLevels: [],
          purpose: "feedback", text: v.cond[ck], weight: 10
        });
      });
      SCENE_TAGS.forEach(function (tag) {
        push({
          id: "coach_" + speciesId + "_scene_" + tag,
          petTypes: [speciesId], coachTypes: [v.coachType],
          growthStages: ["child", "growing", "adult", "companion"], petConditions: [],
          answerType: null, sceneTags: [tag], relationLevels: [], petRelationLevels: [],
          purpose: "feedback", text: v.scene[tag], weight: 10
        });
      });
      ["level_up", "departure", "special"].forEach(function (purpose) {
        push({
          id: "coach_" + speciesId + "_ev_" + purpose,
          petTypes: [speciesId], coachTypes: [v.coachType],
          growthStages: ["child", "growing", "adult", "companion"], petConditions: [],
          answerType: null, sceneTags: [], relationLevels: [], petRelationLevels: [],
          purpose: purpose, text: v.ev[purpose], weight: 10
        });
      });
      push({
        id: "coach_" + speciesId + "_greet",
        petTypes: [speciesId], coachTypes: [v.coachType],
        growthStages: ["child", "growing", "adult", "companion"], petConditions: [],
        answerType: null, sceneTags: [], relationLevels: [], petRelationLevels: [],
        purpose: "greeting", text: v.greet, weight: 10
      });
    });

    // コーチタイプ×回答分類
    const COACH_TYPES = { gentle: "やさしいひとこと、うれしいよね。", calm: "落ち着いて、理由から話せると良かったね。", energetic: "元気いっぱいの返しだった。声が弾んでたよ。", curious: "視点を広げられる返しだった。次も楽しみ。", cautious: "慎重さは財産だ。必要な時、必ず役に立つ。", playful: "軽妙な一言、相手もほっとしたかもしれないね。" };
    Object.keys(COACH_TYPES).forEach(function (ct) {
      ["good", "short", "bad"].forEach(function (at) {
        push({
          id: "coach_coachtype_" + ct + "_" + at, petTypes: [], coachTypes: [ct],
          growthStages: ["child", "growing", "adult", "companion"], petConditions: [],
          answerType: at, sceneTags: [], relationLevels: [], petRelationLevels: [],
          purpose: "feedback", text: COACH_TYPES[ct], adviceExample: ADVICE_EXAMPLE[at], weight: 10
        });
      });
    });

    // 回答分類のみ（汎用）
    const GENERIC_AT = {
      good: "会話が続きやすい返しだったね。相手も次の言葉を探しやすくなる。",
      short: "自然な短い返しだったよ。失礼にはならないので、安心して使って大丈夫。",
      bad: "少し会話が止まりやすい返しだったね。次は相手の言葉にオウム返しで乗ってみよう。"
    };
    ["good", "short", "bad"].forEach(function (at) {
      push({
        id: "coach_common_" + at, petTypes: [], coachTypes: [], growthStages: [], petConditions: [],
        answerType: at, sceneTags: [], relationLevels: [], petRelationLevels: [],
        purpose: "feedback", text: GENERIC_AT[at], adviceExample: ADVICE_EXAMPLE[at], weight: 10
      });
    });

    // 関係段階別
    const LEVEL_TEXTS = {
      stranger: "まだ出会ったばかり。まずは短いあいさつを重ねよう。",
      familiar: "少しずつ打ち解けてきたね。相手も笑顔になってる。",
      connected: "心が通い始めたよ。あいまいな返しより、正直が効く。",
      trusted: "信頼ができている。悩みを話しても大丈夫な間柄だ。",
      partner: "大切な仲間だね。認め合う言葉が、ふたりを強くする。"
    };
    RELATION_LEVELS.forEach(function (lv) {
      push({
        id: "coach_common_level_" + lv, petTypes: [], coachTypes: [], growthStages: [],
        petConditions: [], answerType: null, sceneTags: [], relationLevels: [lv], petRelationLevels: [],
        purpose: "feedback", text: LEVEL_TEXTS[lv], weight: 10
      });
      // ペットとの関係段階（同じ段階キーを再利用）
      push({
        id: "coach_common_petlevel_" + lv, petTypes: [], coachTypes: [], growthStages: [],
        petConditions: [], answerType: null, sceneTags: [], relationLevels: [], petRelationLevels: [lv],
        purpose: "feedback", text: "私たちのきずなも「" + LEVEL_TEXTS[lv].split("。")[0] + "」の段階だね。", weight: 10
      });
    });

    // 共通の安全な台詞（フォールバック最終段）
    push({
      id: "coach_common_fallback_001", petTypes: [], coachTypes: [], growthStages: [], petConditions: [],
      answerType: null, sceneTags: [], relationLevels: [], petRelationLevels: [],
      purpose: "fallback", text: "自分のペースで話せたのがよかったよ。次もその調子！", weight: 10
    });

    return out;
  }

  const KE_COACH_SPEECH = build();

  if (globalThis) globalThis.KE_COACH_SPEECH = KE_COACH_SPEECH;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_COACH_SPEECH };
})();
