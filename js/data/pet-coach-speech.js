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

  /** ペット種別・facet に対応する専用助言（feat/dialogue-content-expansion 版）。
   *  生成ループ産とは別に、選択の型（facet）に合う助言を明示的に用意する。
   *  text＝今回のポイント / adviceExample＝改善例（種ごとの口調）。 */
  const EXTRA_ADVICE = [
    // rabbit（優しい型）
    { id: "coach_rabbit_adv_selfgood_001", petTypes: ["rabbit"], coachTypes: [], growthStages: [], petConditions: [], answerType: "good", facets: ["self_disclose"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "自分のことを言葉にできて、優しく受け止めてもらえたね。そういう正直さが、関係を育てるんだよ。", adviceExample: "たとえば、「実は〜で…」と、失敗や弱さも少し見せると、相手はもっと近くに居ようと思ってくれるよ。", weight: 10 },
    { id: "coach_rabbit_adv_shortq_001", petTypes: ["rabbit"], coachTypes: [], growthStages: [], petConditions: [], answerType: "short", facets: ["question"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "短い返しでも質問を添えられたね。相手に「話していいよ」というやさしい合図になるんだ。", adviceExample: "たとえば、「お店はこっちで合ってる？」と、相手のことについてひとつ聞き返すと、会話がやんわり続くよ。", weight: 10 },

    // fox（冷静型）
    { id: "coach_fox_adv_question_001", petTypes: ["fox"], coachTypes: [], growthStages: [], petConditions: [], answerType: "good", facets: ["question"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "質問で効率的に相手の情報を引き出せた。会話を前に進められるときは、遠慮せず聞くのが得策だ。", adviceExample: "例えば、「具体的には、どれくらい？」と、結論を急がず大切な数字や状況を引き出してみよう。", weight: 10 },
    { id: "coach_fox_adv_decline_001", petTypes: ["fox"], coachTypes: [], growthStages: [], petConditions: [], answerType: "short", facets: ["polite_decline"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "丁寧に断ることで、失わずに済んだ。断りは減点ではなく、次の選択肢を残す技術だ。", adviceExample: "例えば、「今回は遠慮します。◯日なら空いています」と、代案をひとつ添えると、相手はより納得しやすい。", weight: 10 },

    // bearcub（元気型）
    { id: "coach_bearcub_adv_selfgood_001", petTypes: ["bearcub"], coachTypes: [], growthStages: [], petConditions: [], answerType: "good", facets: ["self_disclose"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "元気いっぱい自分の話をして、場の空気を温めてくれた！ その勢いは大きな武器だ。", adviceExample: "こうしてみよう。勢いだけじゃなく、自分がいちばん楽しいと思った瞬間をひとつ足すと、もっと弾むよ。", weight: 10 },
    { id: "coach_bearcub_adv_promise_001", petTypes: ["bearcub"], coachTypes: [], growthStages: [], petConditions: [], answerType: "short", facets: ["promise"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "短いなかにも「次」の約束を込められて、頼もしさが出たぞ！", adviceExample: "こうしてみよう。「◯曜日にやろう！」と、日時を決めると約束がぐっと強くなる。", weight: 10 },

    // cat（好奇心型）
    { id: "coach_cat_adv_question_001", petTypes: ["cat"], coachTypes: [], growthStages: [], petConditions: [], answerType: "good", facets: ["question"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "聞きたかったことを、ちゃんと聞けたね。好奇心を出してOK。相手も聞かれて嬉しいものだよ。", adviceExample: "試しに、理由まで「それ、どうして？」と重ねて聞くと、話題がさらに掘り下がるよ。", weight: 10 },
    { id: "coach_cat_adv_onward_001", petTypes: ["cat"], coachTypes: [], growthStages: [], petConditions: [], answerType: "short", facets: ["onward"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "短くても興味の匂いは伝わってた。でも、もうちょっとだけ針を出しても良かったね。", adviceExample: "試しに、相手の言葉に「へえ、それで？」をひとつ足すと、好奇心が伝わって続きやすいよ。", weight: 10 },

    // bird（慎重型）
    { id: "coach_bird_adv_safe_001", petTypes: ["bird"], coachTypes: [], growthStages: [], petConditions: [], answerType: "good", facets: ["self_disclose"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "安心できる範囲で自分のことを話せて、堅実だった。焦らず少しずつが、長い目では一番速い。", adviceExample: "ええと、丁寧に言うなら、相手の興味に合わせて「自分が大事にしていること」をひとつだけ伝えてみよう。", weight: 10 },
    { id: "coach_bird_adv_decline_001", petTypes: ["bird"], coachTypes: [], growthStages: [], petConditions: [], answerType: "short", facets: ["polite_decline"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "無理せず丁寧に言葉を選べて、敬意を保てた。慎重さは、失礼とは別物だからね。", adviceExample: "ええと、丁寧に言うなら、「その日は行けませんが、また声をかけてください」と、窓を開けておくのが安心だよ。", weight: 10 },

    // tanuki（お調子者型）
    { id: "coach_tanuki_adv_selfgood_001", petTypes: ["tanuki"], coachTypes: [], growthStages: [], petConditions: [], answerType: "good", facets: ["self_disclose"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "脱線しながらも自分の話で場を和ませて、見事に掴んでたドン！ それがお前の魅力だ。", adviceExample: "おっと、この手もあるドン。笑いのあとに「でも本気でやってるドンよ」と本音をひとつ入れると、味が出るドン。", weight: 10 },
    { id: "coach_tanuki_adv_promise_001", petTypes: ["tanuki"], coachTypes: [], growthStages: [], petConditions: [], answerType: "short", facets: ["promise"], sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "約束まで言って、お調子者が急に頼もしく見えたドン！ そのまま守れば信頼もゲットだ。", adviceExample: "おっと、この手もあるドン。約束したら「ちゃんとやるからな」と一言添えると、はずれないドンよ。", weight: 10 },

    /* ============ 文脈別助言（職場・日常・食事 × good/short/bad） ============
     * 場面と回答分類に応じた、種ごとの口調で独立した内容の助言。要件「各ペット50件以上」へ。 */
    { id: "coach_rabbit_ctx_work_good", petTypes: ["rabbit"], answerType: "good", sceneTags: ["work"], text: "職場で具体的な報告ができて、信頼を積めたね。優しい口調のまま、数字も添えると完璧よ。", adviceExample: "たとえば、「3時までに、ここまで終わりました」と、状況を添えると頼もしくなる。", weight: 10 },
    { id: "coach_rabbit_ctx_work_short", petTypes: ["rabbit"], answerType: "short", sceneTags: ["work"], text: "職場の短い返しでも、結論さえ言えれば大丈夫。あとは、少しだけ締めの言葉を足そう。", adviceExample: "たとえば、「はい、◯時までに直します、ありがとう」と笑顔を添えると良い。", weight: 10 },
    { id: "coach_rabbit_ctx_work_bad", petTypes: ["rabbit"], answerType: "bad", sceneTags: ["work"], text: "職場では理由を伴わない返しほど、誤解を招きやすいの。今日は寄り添い方を学べたね。", adviceExample: "たとえば、まず「そうですね」と受けてから、理由をひとつ添えてみよう。", weight: 10 },
    { id: "coach_rabbit_ctx_daily_good", petTypes: ["rabbit"], answerType: "good", sceneTags: ["daily"], text: "日常のふれあいで自分のことを話せて、温かい空気になったね。そういう正直さを大切に。", adviceExample: "たとえば、好きな花や散歩の話を、ひとつだけ開けてみるといいよ。", weight: 10 },
    { id: "coach_rabbit_ctx_daily_short", petTypes: ["rabbit"], answerType: "short", sceneTags: ["daily"], text: "日常の短い会話でも、返しただけで安心を渡せるのよ。ひと声だけでも十分だよ。", adviceExample: "たとえば、「こんにちは、いい天気ですね」と、相づちをひとつ添えよう。", weight: 10 },
    { id: "coach_rabbit_ctx_daily_bad", petTypes: ["rabbit"], answerType: "bad", sceneTags: ["daily"], text: "近所の会話を避けると、縁が減ってしまうの。今日は、それに気づけただけでも進歩よ。", adviceExample: "たとえば、立ち止まって「おはよう」とだけ返してみよう。それだけでも変わる。", weight: 10 },
    { id: "coach_rabbit_ctx_food_good", petTypes: ["rabbit"], answerType: "good", sceneTags: ["food"], text: "お店の人に気分を伝えて、楽しく過ごせたね。食卓の縁は、こうして生まれるのよ。", adviceExample: "たとえば、「今日はさっぱりしたものが欲しくて」と、理由を添えてみよう。", weight: 10 },
    { id: "coach_rabbit_ctx_food_short", petTypes: ["rabbit"], answerType: "short", sceneTags: ["food"], text: "食事の場の短い注文でも、気持ちは十分届くのよ。あとは感謝をひとつ。", adviceExample: "たとえば、「ありがとう、楽しみにしてます」と添えると、店主も嬉しい。", weight: 10 },
    { id: "coach_rabbit_ctx_food_bad", petTypes: ["rabbit"], answerType: "bad", sceneTags: ["food"], text: "お店の人の気配りを無視すると、縁が逃げていくの。今日は返す大切さを見られたね。", adviceExample: "たとえば、注文の前に「お世話になります」と一言だけでも、空気が変わるよ。", weight: 10 },

    { id: "coach_fox_ctx_work_good", petTypes: ["fox"], answerType: "good", sceneTags: ["work"], text: "職場の報告を結論から言えて、短く通じたのは理想的だ。その切れ味を忘れるな。", adviceExample: "例えば、「◯時までに直します。次に◯をします」と、続きも先回りしよう。", weight: 10 },
    { id: "coach_fox_ctx_work_short", petTypes: ["fox"], answerType: "short", sceneTags: ["work"], text: "職場で短く済ませるのは効率的だが、行き先が見えないと相手は迷う。", adviceExample: "例えば、「◯をしました。次に◯をします」と、次を補うと完璧だ。", weight: 10 },
    { id: "coach_fox_ctx_work_bad", petTypes: ["fox"], answerType: "bad", sceneTags: ["work"], text: "職場で投げた返しは、後に自分へ返ってくる。ミスは先回りで防ごう。", adviceExample: "例えば、「今のうちに◯だけ確認します」と、立て直しを一つ言おう。", weight: 10 },
    { id: "coach_fox_ctx_daily_good", petTypes: ["fox"], answerType: "good", sceneTags: ["daily"], text: "日常で的確に返せるのは、頭の良さの証だ。無理に話を増やさなくて構わない。", adviceExample: "例えば、「そうですね、風が気持ちいいです」と、一言で十分共感できる。", weight: 10 },
    { id: "coach_fox_ctx_daily_short", petTypes: ["fox"], answerType: "short", sceneTags: ["daily"], text: "日常の短い返しは、失礼にはならない。むしろ、そっけなさが印象を残すこともある。", adviceExample: "例えば、「こんにちは」だけで、相手は返しやすい。そこから話が始まれば十分だ。", weight: 10 },
    { id: "coach_fox_ctx_daily_bad", petTypes: ["fox"], answerType: "bad", sceneTags: ["daily"], text: "日常で相手を避けるのは得策ではない。居合わせた縁は、流れに任せてよい。", adviceExample: "例えば、会釈だけでも、今日の縁は損ねずに済む。", weight: 10 },
    { id: "coach_fox_ctx_food_good", petTypes: ["fox"], answerType: "good", sceneTags: ["food"], text: "食事の場で好みを伝えるのは、遠慮でも失礼でもない。店員は案内しやすくなる。", adviceExample: "例えば、「あっさりでお願いします」と、方向で注文を整えよう。", weight: 10 },
    { id: "coach_fox_ctx_food_short", petTypes: ["fox"], answerType: "short", sceneTags: ["food"], text: "食事の短い注文は、形式さえ守れば十分成立する。締めの言葉だけ添えよう。", adviceExample: "例えば、「ごちそうさまでした」だけでも、店主は満足する。", weight: 10 },
    { id: "coach_fox_ctx_food_bad", petTypes: ["fox"], answerType: "bad", sceneTags: ["food"], text: "食事の場で無視すると、情報も味も遠ざかる。目の前の相手に目を向けよう。", adviceExample: "例えば、「おすすめをください」と、会話を一つ交わすと楽しい。", weight: 10 },

    { id: "coach_bearcub_ctx_work_good", petTypes: ["bearcub"], answerType: "good", sceneTags: ["work"], text: "職場で元気に返せて、場が明るくなったぞ！ その勢いに結果も伴えば最強だ。", adviceExample: "こうしてみよう。返事のあとに「◯時までにやります！」と締めると、頼もしく見える。", weight: 10 },
    { id: "coach_bearcub_ctx_work_short", petTypes: ["bearcub"], answerType: "short", sceneTags: ["work"], text: "職場の短い返しも、ハキハキ言えば十分だ。あとは「やります」の一言だな。", adviceExample: "こうしてみよう。「了解です、今からやります！」と、動きを足すと◎。", weight: 10 },
    { id: "coach_bearcub_ctx_work_bad", petTypes: ["bearcub"], answerType: "bad", sceneTags: ["work"], text: "職場で黙り込むと、相手が困ってしまうぞ。借りは、一言で返せば十分だ。", adviceExample: "こうしてみよう。「すみません、◯がわかりません。教えてください」と、勇気を出そう。", weight: 10 },
    { id: "coach_bearcub_ctx_daily_good", petTypes: ["bearcub"], answerType: "good", sceneTags: ["daily"], text: "日常で明るく話せて、周りを照らしたぞ！ その元気は、みんなのお日様だ。", adviceExample: "こうしてみよう。笑顔で「こんにちは！」と、声の大きさも届けよう。", weight: 10 },
    { id: "coach_bearcub_ctx_daily_short", petTypes: ["bearcub"], answerType: "short", sceneTags: ["daily"], text: "日常の短い挨拶でも、元気さは十分伝わってる。あとひとつ、今日の話を足すと弾むな。", adviceExample: "こうしてみよう。「いい天気だね！」のひと言を足すと、会話が始まるぞ。", weight: 10 },
    { id: "coach_bearcub_ctx_daily_bad", petTypes: ["bearcub"], answerType: "bad", sceneTags: ["daily"], text: "日常で通り過ぎると、せっかくの出会いが消えるぞ。勇気を出して、一言だ！", adviceExample: "こうしてみよう。立ち止まらずとも「どうも！」と手を振るだけで十分だ。", weight: 10 },
    { id: "coach_bearcub_ctx_food_good", petTypes: ["bearcub"], answerType: "good", sceneTags: ["food"], text: "食事で元気に注文して、店主も嬉しそうだったぞ！ 食べるも食うも、楽しんで。", adviceExample: "こうしてみよう。「おすすめ、ください！」と、思い切って聞くと弾むぞ。", weight: 10 },
    { id: "coach_bearcub_ctx_food_short", petTypes: ["bearcub"], answerType: "short", sceneTags: ["food"], text: "食事の短い注文は、元気さで十分伝わる。あとは「うまい！」を言うだけだな。", adviceExample: "こうしてみよう。「うまい！」を添えると、店主の目が輝くぞ。", weight: 10 },
    { id: "coach_bearcub_ctx_food_bad", petTypes: ["bearcub"], answerType: "bad", sceneTags: ["food"], text: "食事でだんまりだと、おいしさまで逃げていくぞ。食卓は、声が命だ。", adviceExample: "こうしてみよう。「今日は何がおすすめ？」と、聞くだけで会話が始まる。", weight: 10 },

    { id: "coach_cat_ctx_work_good", petTypes: ["cat"], answerType: "good", sceneTags: ["work"], text: "職場で好奇心のまま聞いて、道を開けたね。聞くことは、探すことの近道だ。", adviceExample: "試しに、「それは、どういう理由で？」と、ひとつ深掘りすると面白い。", weight: 10 },
    { id: "coach_cat_ctx_work_short", petTypes: ["cat"], answerType: "short", sceneTags: ["work"], text: "職場の短い返しでも、あなたの目がキラッとしてたよ。興味は、声に出すと届く。", adviceExample: "試しに、「それ、詳しく知りたいです」と、一言足してみよう。", weight: 10 },
    { id: "coach_cat_ctx_work_bad", petTypes: ["cat"], answerType: "bad", sceneTags: ["work"], text: "職場でそっけないと、チャンスを見逃してしまう。今日は、それに気づけたね。", adviceExample: "試しに、「もう一度、説明してもらえますか？」と、聞き直せば良い。", weight: 10 },
    { id: "coach_cat_ctx_daily_good", petTypes: ["cat"], answerType: "good", sceneTags: ["daily"], text: "日常で興味を持って話せて、好奇心が輝いてたよ。その目線は、宝を探してる。", adviceExample: "試しに、「それ、どうやって始めたの？」と、相手の物語を聞いてみよう。", weight: 10 },
    { id: "coach_cat_ctx_daily_short", petTypes: ["cat"], answerType: "short", sceneTags: ["daily"], text: "日常の短い返しでも、目が語ってたよ。もうちょっとだけ、針を出しても良かったな。", adviceExample: "試しに、「へえ、それで？」を、ひとつ足すと続きやすい。", weight: 10 },
    { id: "coach_cat_ctx_daily_bad", petTypes: ["cat"], answerType: "bad", sceneTags: ["daily"], text: "日常で避けると、好奇心のアンテナが静かになる。今日は出会いを逃したな。", adviceExample: "試しに、通り過ぎる前に「おはよう」だけでも、耳が生き返る。", weight: 10 },
    { id: "coach_cat_ctx_food_good", petTypes: ["cat"], answerType: "good", sceneTags: ["food"], text: "食事でお店のことを聞けて、食の世界が広がったね。それが良い狩りだ。", adviceExample: "試しに、「それは、どうやって作るの？」と、店主に聞いてみよう。", weight: 10 },
    { id: "coach_cat_ctx_food_short", petTypes: ["cat"], answerType: "short", sceneTags: ["food"], text: "食事での短い注文も、あなたの興味で美味しくなる。あとひとつ、聞いてみよう。", adviceExample: "試しに、「おすすめは？」と聞くと、店主も話したくなる。", weight: 10 },
    { id: "coach_cat_ctx_food_bad", petTypes: ["cat"], answerType: "bad", sceneTags: ["food"], text: "食事の場で無視すると、未知の味に気づけないよ。前に進もう。", adviceExample: "試しに、黙らず「今月の新作は？」と、嗅覚を働かせよう。", weight: 10 },

    { id: "coach_bird_ctx_work_good", petTypes: ["bird"], answerType: "good", sceneTags: ["work"], text: "職場で慎重に言葉を選べて、堅実だった。急がば回れ、その調子でいい。", adviceExample: "ええと、丁寧に言うなら、「確認して、◯時までにご連絡します」と、余裕を見せよう。", weight: 10 },
    { id: "coach_bird_ctx_work_short", petTypes: ["bird"], answerType: "short", sceneTags: ["work"], text: "職場の短い返しも、慎重に選んできたね。返した後に、根拠を一つ足そう。", adviceExample: "ええと、丁寧に言うなら、「はい、◯を確認しました」と、確認済みを添えると安心。", weight: 10 },
    { id: "coach_bird_ctx_work_bad", petTypes: ["bird"], answerType: "bad", sceneTags: ["work"], text: "職場で黙るのは、慎重さとは別物よ。言いたいことを、小さくでも出して。", adviceExample: "ええと、丁寧に言うなら、「少し時間をください」と、一文だけ伝えよう。", weight: 10 },
    { id: "coach_bird_ctx_daily_good", petTypes: ["bird"], answerType: "good", sceneTags: ["daily"], text: "日常で安心できる範囲で話せて、堅実に距離をちぢめたね。急がないのが一番だ。", adviceExample: "ええと、丁寧に言うなら、「私も、ここが好きです」と、ひとつだけ正直に。", weight: 10 },
    { id: "coach_bird_ctx_daily_short", petTypes: ["bird"], answerType: "short", sceneTags: ["daily"], text: "日常の短い返しでも、一歩前に出たのは大きいね。次は、もう一寸だけ。", adviceExample: "ええと、丁寧に言うなら、「こんにちは。いい日ですね」と、天気を添えよう。", weight: 10 },
    { id: "coach_bird_ctx_daily_bad", petTypes: ["bird"], answerType: "bad", sceneTags: ["daily"], text: "日常で引いてしまうのは、鳥の癖だから仕方ない。でも、一度だけ顔を上げよう。", adviceExample: "ええと、丁寧に言うなら、「おはようございます」とだけ、まず返してみて。", weight: 10 },
    { id: "coach_bird_ctx_food_good", petTypes: ["bird"], answerType: "good", sceneTags: ["food"], text: "食事の場で無理なく頼めて、形式も整ってたね。堅実な注文は、店主も喜ぶ。", adviceExample: "ええと、丁寧に言うなら、「定番でお願いします」と、安心できる選び方をしよう。", weight: 10 },
    { id: "coach_bird_ctx_food_short", petTypes: ["bird"], answerType: "short", sceneTags: ["food"], text: "食事の短い注文も、作法さえあれば失礼ではない。安心して頼ってよ。", adviceExample: "ええと、丁寧に言うなら、「おすすめをいただけますか」と、聞いてみよう。", weight: 10 },
    { id: "coach_bird_ctx_food_bad", petTypes: ["bird"], answerType: "bad", sceneTags: ["food"], text: "食事でだんまりだと、気配りも味も逃げてしまう。小さな一言から始めよう。", adviceExample: "ええと、丁寧に言うなら、「ちょっと悩んでます」と、迷いから話すのも手だよ。", weight: 10 },

    { id: "coach_tanuki_ctx_work_good", petTypes: ["tanuki"], answerType: "good", sceneTags: ["work"], text: "職場で気を利かせて返せて、場がぱっと明るくなったドン！ 頭が回ってたな。", adviceExample: "おっと、この手もあるドン。「◯を終えました、次は◯に手をつけます」と、先読みで行こう。", weight: 10 },
    { id: "coach_tanuki_ctx_work_short", petTypes: ["tanuki"], answerType: "short", sceneTags: ["work"], text: "職場の短い返しも、笑顔を忘れなければ十分ドン。あと一言、締めを足すと好印象だ。", adviceExample: "おっと、この手もあるドン。「了解です、任された！」と、意気込みを添えよう。", weight: 10 },
    { id: "coach_tanuki_ctx_work_bad", petTypes: ["tanuki"], answerType: "bad", sceneTags: ["work"], text: "職場でさぼると借りが残るドン。返すのは、笑いでなく誠意だドンよ。", adviceExample: "おっと、この手もあるドン。「すまん！ 今から直すから」と、元気に謝ろう。", weight: 10 },
    { id: "coach_tanuki_ctx_daily_good", petTypes: ["tanuki"], answerType: "good", sceneTags: ["daily"], text: "日常で人を笑わせて、日々を盛り上げられたドン！ それがお前の役回りだ。", adviceExample: "おっと、この手もあるドン。笑いのあとに、ちょっとだけ本音を足すと味が出るドン。", weight: 10 },
    { id: "coach_tanuki_ctx_daily_short", petTypes: ["tanuki"], answerType: "short", sceneTags: ["daily"], text: "日常の短い返しでも、ノリは伝わってたドン。あとは、続きを待つ余裕だ。", adviceExample: "おっと、この手もあるドン。「またな！」と、気軽に別れの一言を添えよう。", weight: 10 },
    { id: "coach_tanuki_ctx_daily_bad", petTypes: ["tanuki"], answerType: "bad", sceneTags: ["daily"], text: "日常で知らん顔してると、お調子者の株が下がるドン。声はかけとくものだ。", adviceExample: "おっと、この手もあるドン。「おーい！」と、一声かけるだけで株は上がる。", weight: 10 },
    { id: "coach_tanuki_ctx_food_good", petTypes: ["tanuki"], answerType: "good", sceneTags: ["food"], text: "食事で場を楽しませて、料理もふえて、もう最高ドン！ 食卓の名人だな。", adviceExample: "おっと、この手もあるドン。「おかわり！」の一言で、店主も笑うドン。" , weight: 10 },
    { id: "coach_tanuki_ctx_food_short", petTypes: ["tanuki"], answerType: "short", sceneTags: ["food"], text: "食事の短い注文も、にんまり笑えば、もう一丁前ドン。あとは味を褒めるだけだ。", adviceExample: "おっと、この手もあるドン。「うまい！」を添えると、お代わりも無料になるかもドン。", weight: 10 },
    { id: "coach_tanuki_ctx_food_bad", petTypes: ["tanuki"], answerType: "bad", sceneTags: ["food"], text: "食事でだんまりは、お調子者の根城が寂しくなるドン。食卓は笑いで満たそう。", adviceExample: "おっと、この手もあるドン。「今日の一押しは？」と聞くだけで、場が咲くドン。", weight: 10 },

    /* ============ facet専用の仕上げ（各ペット4件 → 合計50件/種） ============ */
    { id: "coach_rabbit_facet_q_good", petTypes: ["rabbit"], answerType: "good", facets: ["question"], text: "優しく質問を返せて、相手も安心して話せたね。その聞き方が宝物よ。", adviceExample: "たとえば、「それはどうやって？」と、相手の話をひとつ広げてみよう。", weight: 10 },
    { id: "coach_rabbit_facet_emp_good", petTypes: ["rabbit"], answerType: "good", facets: ["empathy"], text: "共感の言葉が優しく届いて、相手の心もほぐれたね。それがいちばんの癒しだよ。", adviceExample: "たとえば、「わかるよ、私も同じ気持ち」と、感じたことを返してみよう。", weight: 10 },
    { id: "coach_rabbit_facet_sd_short", petTypes: ["rabbit"], answerType: "short", facets: ["self_disclose"], text: "短い返しに自分のことを少し添えて、かえって自然だったね。続けていこう。", adviceExample: "たとえば、「ありがとう。こういう話は好きです」と、ひとつだけ足そう。", weight: 10 },
    { id: "coach_rabbit_facet_av_bad", petTypes: ["rabbit"], answerType: "bad", facets: ["avoid"], text: "避けてしまうのは、優しさじゃない時もあるよ。今日は一歩踏み出す日だったね。", adviceExample: "たとえば、逃げる前に「大丈夫ですか？」と、声の一つでも残そう。", weight: 10 },

    { id: "coach_fox_facet_q_good", petTypes: ["fox"], answerType: "good", facets: ["question"], text: "質問で要点を引き出せた。会話を前へ進める聞き方は、攻略の鍵だ。", adviceExample: "例えば、「具体的には、どれだけ？」と、数値を引き出すと強い。", weight: 10 },
    { id: "coach_fox_facet_emp_good", petTypes: ["fox"], answerType: "good", facets: ["empathy"], text: "共感も計算ずくなら便利だ。心を込めて、言葉も短く通じたね。", adviceExample: "例えば、「そうだね、それ、わかるよ」と、一拍だけ余計に。", weight: 10 },
    { id: "coach_fox_facet_sd_short", petTypes: ["fox"], answerType: "short", facets: ["self_disclose"], text: "短い返しに自分の状況を添えると、相手の迷子が減る。効率的だ。", adviceExample: "例えば、「今日は早めに切り上げます」と、一言添えてみよう。", weight: 10 },
    { id: "coach_fox_facet_av_bad", petTypes: ["fox"], answerType: "bad", facets: ["avoid"], text: "回避は、状況によっては逃げになる。切り抜けたほうが得だった。次からは正面から。", adviceExample: "例えば、「一度、時間をもらえますか」と、立て直しの一言を置こう。", weight: 10 },

    { id: "coach_bearcub_facet_q_good", petTypes: ["bearcub"], answerType: "good", facets: ["question"], text: "思いきって聞けて、ぐっと前に進んだぞ！ 質問はドアを開くのだ。", adviceExample: "こうしてみよう。「それ、どうやるの？」と、聞けば道が開ける。", weight: 10 },
    { id: "coach_bearcub_facet_emp_good", petTypes: ["bearcub"], answerType: "good", facets: ["empathy"], text: "相手の気持ちを察して、元気に受け止めたな。そのぬくもり、大事にしろ！", adviceExample: "こうしてみよう。「いいね、その気持ち！」と、勢いで受け止めよう。", weight: 10 },
    { id: "coach_bearcub_facet_sd_short", petTypes: ["bearcub"], answerType: "short", facets: ["self_disclose"], text: "短くても自分のことを話すと、距離がグッと近づくぞ。今日はいい一歩だ。", adviceExample: "こうしてみよう。「俺は〜が好きなんだ！」と、短く宣言しよう。", weight: 10 },
    { id: "coach_bearcub_facet_av_bad", petTypes: ["bearcub"], answerType: "bad", facets: ["avoid"], text: "避けてばかりじゃ、元気も届かないぞ。ちゃんと振り返って、声をかけよう。", adviceExample: "こうしてみよう。「おーい！」と、まず一声あげてみよう。", weight: 10 },

    { id: "coach_cat_facet_q_good", petTypes: ["cat"], answerType: "good", facets: ["question"], text: "興味をぶつけて、相手の心をこじ開けたね。好奇心は最高の鍵だ。", adviceExample: "試しに、「それ、なんで面白いの？」と、理由を聞いてみよう。", weight: 10 },
    { id: "coach_cat_facet_emp_good", petTypes: ["cat"], answerType: "good", facets: ["empathy"], text: "にゃりと共感できて、相手も油断してくれたね。良い狩りだった。", adviceExample: "試しに、「わかる、それ好き」と、すっきり寄り添ってみよう。", weight: 10 },
    { id: "coach_cat_facet_sd_short", petTypes: ["cat"], answerType: "short", facets: ["self_disclose"], text: "短い返しに自分の話を混ぜると、相手も安心するよ。それが気配りだ。", adviceExample: "試しに、「そうですね、私も好きです」と、一つだけ添えてみよう。", weight: 10 },
    { id: "coach_cat_facet_av_bad", petTypes: ["cat"], answerType: "bad", facets: ["avoid"], text: "避けてばかりじゃ、獲物は逃げっぱなし。今日はアンテナを戻そう。", adviceExample: "試しに、無視せず「うん」とだけでも、顔を向けてみよう。", weight: 10 },

    { id: "coach_bird_facet_q_good", petTypes: ["bird"], answerType: "good", facets: ["question"], text: "控えめに質問できて、失礼なく踏み込めたね。丁寧な探りは鳥の得意技だ。", adviceExample: "ええと、丁寧に言うなら、「よかったら、詳しく聞いてもいいですか？」と、一文で。", weight: 10 },
    { id: "coach_bird_facet_emp_good", petTypes: ["bird"], answerType: "good", facets: ["empathy"], text: "慎重な共感で、相手も安心しておしゃべりできたね。それが美しさだ。", adviceExample: "ええと、丁寧に言うなら、「それ、よくわかります」と、静かに返そう。", weight: 10 },
    { id: "coach_bird_facet_sd_short", petTypes: ["bird"], answerType: "short", facets: ["self_disclose"], text: "短い返しに少しだけ胸を開いて、堅実に近づけた。それで十分だよ。", adviceExample: "ええと、丁寧に言うなら、「私も、よくここに来ます」と、一つだけ。", weight: 10 },
    { id: "coach_bird_facet_av_bad", petTypes: ["bird"], answerType: "bad", facets: ["avoid"], text: "避けるのは癖だけど、今日の相手は逃がしたくないね。一度だけ羽を広げよう。", adviceExample: "ええと、丁寧に言うなら、「あの、すみません」と、自分の声を出そう。", weight: 10 },

    { id: "coach_tanuki_facet_q_good", petTypes: ["tanuki"], answerType: "good", facets: ["question"], text: "気さくに質問を飛ばして、場の主導権を握ったドン！ 上等だ。", adviceExample: "おっと、この手もあるドン。「それ、どうなん？」と、気楽に聞いてみよう。", weight: 10 },
    { id: "coach_tanuki_facet_emp_good", petTypes: ["tanuki"], answerType: "good", facets: ["empathy"], text: "相手の心に寄り添って、笑いと温かさを両方積めたドン。お手柄だ！", adviceExample: "おっと、この手もあるドン。「わかるわかる！」から、一声励まそう。", weight: 10 },
    { id: "coach_tanuki_facet_sd_short", petTypes: ["tanuki"], answerType: "short", facets: ["self_disclose"], text: "短くても本音が出れば、お調子者の価値が上がるドン。今日は実入りだ。", adviceExample: "おっと、この手もあるドン。「俺は、〜が好きなんだ」と、短く打ち明けよう。", weight: 10 },
    { id: "coach_tanuki_facet_av_bad", petTypes: ["tanuki"], answerType: "bad", facets: ["avoid"], text: "避けっぱなしは、天狗の恥ドン。振り返って一声、気の利いたのを返そう。", adviceExample: "おっと、この手もあるドン。「また今度！」と、逃げる前に挨拶を置こう。", weight: 10 }
  ];

  /** 関係段階（stranger〜partner）ごとの助言（各ペット15件）。“今回のポイント”を種ごと・段階ごとに。
   *  改善例（adviceExample）は共通の型＋種ごとの口調（adviceText）で生成する。 */
  const RELATION_POINT = {
    rabbit: {
      stranger: { good: "出会ったばかりでも、優しい返しができて好印象を残せたよ。", short: "出会ったばかりの短い返しは、失礼にはならない。安心していいよ。", bad: "出会ったばかりでぎこちなくても、次があるよ。今日は縁ができただけでも一歩。" },
      familiar: { good: "ちょっと打ち解けてきて、話が続いたね。肩の力が抜けてきた証拠だよ。", short: "仲良くなりかけても、短い返しで大丈夫。続けることが優しさになるよ。", bad: "打ち解けかけの時期に会話を避けると、心が離れる。一度だけ寄り添おう。" },
      connected: { good: "心が通ってきて、正直な話ができたね。それが一番温かい道だよ。", short: "気心が知れて、短い返しも通じ合えるようになったね。それで十分だよ。", bad: "心が通っても避けたら悲しくなる。その一歩を踏み出そう。" },
      trusted: { good: "信頼の中では、素直さがいちばん効くよ。今日も真摯に話せてた。", short: "信頼関係なら短い返しも許される。むしろ正直でいいんだよ。", bad: "信頼があるからこそ、曖昧な返しは残念がられる。正直でいこう。" },
      partner: { good: "大切な仲間になれて、言葉が届きやすくなったね。その関係が宝物だよ。", short: "パートナーなら短くても気持ちは伝わる。あとは続けることだね。", bad: "大切な仲間への無反応は、一番寂しい。いつもの優しさを返そう。" }
    },
    fox: {
      stranger: { good: "出会ったばかりで端的に話せたのは利口だ。まずは様子見が基本。", short: "初対面では短く無難に済ませるのが賢明だ。今日はそれで良い。", bad: "初対面のミスは次から修正すれば損はない。不明分を覚えておけ。" },
      familiar: { good: "少し関係が見えてきた。距離感を保ちつつ、正直も交ぜると良い。", short: "なじみかけでも短い返しで十分。無理に話す必要はない。", bad: "なじみかけで避けると先の情報を失う。損だ。会話は続けるが得。" },
      connected: { good: "信頼が働き始めた。対等な会話でさらに深く見えてきた。", short: "気心が知れれば短い返しでも意図は伝わる。効率は上がる。", bad: "信頼が働く段階で曖昧は誤解を招く。明確に返すことだ。" },
      trusted: { good: "信頼された分は率直さで返すのが筋だ。今日は正しく動けた。", short: "信頼があるなら短くても頼れる。余計な飾りはいらない。", bad: "信頼している相手にそらすような返しは不要だ。実直であれ。" },
      partner: { good: "対等な仲間として、言葉が最短で通じるようになった。それこそ最強だ。", short: "パートナーとは短い言葉で足りる。無駄を省けたのは美徳だ。", bad: "大切な間柄で無視するようでは位が下がる。誠実さを保て。" }
    },
    bearcub: {
      stranger: { good: "初対面で元気に挨拶できて、好印象を蹴り出したぞ！ その調子だ。", short: "初対面の短い挨拶は、ハキハキ言えば十分。不安になるな！", bad: "初対面でしょんぼりしてたら、相手も困っちゃうぞ。笑顔を借してくれ。" },
      familiar: { good: "なじみが出て元気に話せて、廊下まで明るかったぞ！", short: "仲良くなりかけでも短く返れば十分だ。あとは笑顔でいい！", bad: "打ち解けかけで黙ると、君の元気も届かなくなっちゃうぞ。声を出せ！" },
      connected: { good: "心が通って、本音で笑い合えたぞ！ それがいちばんだ。", short: "気心が知れて、短い返しも通じるようになったな。それでいいんだ。", bad: "心が通っても黙り込むと響かない。無理をせず、声は上げよう。" },
      trusted: { good: "信頼の中で全力で近づけたな。その熱意が仲間を守るんだ。", short: "信頼された分、短い返しでも「任せろ！」で通じるぞ。", bad: "信頼してる相手にしょんぼり返すのは台無しだ。いつも通りでいい。" },
      partner: { good: "最強の仲間になれて、満開の笑顔が場を照らしてたぞ！", short: "パートナーなら、短くても熱が伝わる。「おう！」で十分だ。", bad: "大事な仲間を横目に黙っちゃダメだぞ。全力の挨拶を返そう。" }
    },
    cat: {
      stranger: { good: "初対面で好奇心を出して、相手も面白がってくれたね。それが猫の魅力だ。", short: "初対面はまず観察。短く反応して、様子を見るのが猫流だ。", bad: "初対面で糸を引っ込めると、会話が始まらない。一度は針を出そう。" },
      familiar: { good: "なじみが出て、探り探りでも会話ができたね。少しずつ捕まえてる。", short: "なじみが出ても短く完了するのが賢い。また様子を見に行ける。", bad: "興味があるのに黙るのは、猫じゃない。鳴けば、餌が来るよ。" },
      connected: { good: "相手の話に興味が生まれて、深く聞けたね。それが心を掴む。", short: "気心が知れれば短い相づちでも通じる。無理に狩る必要はない。", bad: "心が通っているのに何も聞かないのは勿体ない。好奇心を出そう。" },
      trusted: { good: "信頼の上で遠慮なく聞けて、確実に踏み込めたね。いよいよ捕まえた。", short: "信頼があるなら短くても質問は響く。聞きたいことは聞いていい。", bad: "信頼してる相手の話に無関心な姿勢は、猫として失格。耳を向けよう。" },
      partner: { good: "大切な仲間と何でも気軽に聞き合える関係になったね。贅沢だよ。", short: "パートナーとはひと言で通じ合える。それが一番の猫流だ。", bad: "本当に大事な相手を無視するのは、猫でもありえない。首を傾げよう。" }
    },
    bird: {
      stranger: { good: "初対面で慎重に話せて、好印象を守れた。次の一手を待つ鳥流だ。", short: "初対面では短く安全に。無理に飛び出す必要はない。", bad: "初対面で巣に引っ込むと、何も始まらない。一度だけ羽を鳴らそう。" },
      familiar: { good: "少しずつ近づいて、堅実に距離を詰められたね。その調子だ。", short: "なじみが出ても短く安全な返しで十分。ゆっくり進めて。", bad: "打ち解けかけの相手を避けるとまた一から。勇気をひとかけら。" },
      connected: { good: "心がつながって、肩の力が抜けた会話ができたね。信頼は少しずつ。", short: "気心が知れれば短い返しでも安心できる。急がず、どっしりと。", bad: "心が通ったのに萎縮すると、紡いだ糸が切れる。深呼吸を。" },
      trusted: { good: "信頼の中で安心して話せるようになった。急がなくて大丈夫だよ。", short: "信頼があるなら短い返しでも、あなたの誠実さは伝わる。", bad: "信頼した相手に黙り込むのは辛いこと。少しだけ飛んでみよう。" },
      partner: { good: "大切な仲間と風を切って飛べるようになった。それが鳥の幸せだ。", short: "パートナーならひと言で安心を渡せる。それが堅実な絆だ。", bad: "大事な仲間を無視するのは、鳥として悲しい。必ず羽を返そう。" }
    },
    tanuki: {
      stranger: { good: "初対面で笑わせて、場を温めたドン！ 初対面から儲けもんだ。", short: "初対面でも気楽に返せば十分ドン。肩の力抜いて行こう。", bad: "初対面でだんまりだと、お調子者の看板に傷が付くドン。一本ぐっと！" },
      familiar: { good: "なじみが出て軽口を叩き合えるようになったドン！ 上出来だ。", short: "仲良くなりかけでも短く気軽に返せば十分ドン。堅苦しくなるな。", bad: "打ち解けかけで黙ると、せっかくのノリが抜けるドン。続きを言おう。" },
      connected: { good: "心が通って、本音の軽口も受け止めてもらえたドン！ 最高だ。", short: "気心が知れれば短い一言でも笑いにできるドン。それがお前だ。", bad: "心が通ったのに知らん顔は、お調子者の悪手ドン。返しを忘れるな。" },
      trusted: { good: "信頼された分、実もコメも返せたドン。お前はただの道化じゃないな。", short: "信頼してる相手には短くても真剣が伝わるドン。気負わなくていい。", bad: "信頼にかけて、ふざけて済ませるのは逆効果ドン。たまには真面目だ。" },
      partner: { good: "最強の仲間と、笑いと本音を両方分け合えるドン！ それこそ天狗の友だ。", short: "パートナーとは、にっと一つの笑いで通じるドン。それが最高だ。", bad: "大事な仲間を横に、通り過ぎるのは天狗の恥ドン。一声かけよう。" }
    }
  };

  /** 関係段階別の種別助言を生成（各ペット 5段階×3分類＝15件） */
  function buildRelationAdvice() {
    const out = [];
    Object.keys(RELATION_POINT).forEach(function (speciesId) {
      const table = RELATION_POINT[speciesId];
      RELATION_LEVELS.forEach(function (lv) {
        const col = table[lv];
        if (!col) return;
        ["good", "short", "bad"].forEach(function (at) {
          if (!col[at]) return;
          out.push({
            id: "coach_" + speciesId + "_rel_" + lv + "_" + at,
            petTypes: [speciesId], coachTypes: [], growthStages: [], petConditions: [],
            answerType: at, facets: [], sceneTags: [], relationLevels: [lv], petRelationLevels: [],
            purpose: "feedback", text: col[at], adviceExample: adviceText(speciesId, at), weight: 10
          });
        });
      });
    });
    return out;
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

    return out.concat(EXTRA_ADVICE, buildRelationAdvice());
  }

  const KE_COACH_SPEECH = build();

  if (globalThis) globalThis.KE_COACH_SPEECH = KE_COACH_SPEECH;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_COACH_SPEECH };
})();
