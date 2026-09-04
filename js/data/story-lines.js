"use strict";
/*
 * kenecho Village - ストーリー枠の台詞プール（KE_STORY_LINES）
 * 「導入・展開・応答・締め（open/develop/respond/close）」の役割を持つミニ回合の候補プール。
 * 既存シーン（KE_SCENES）の canonical 回合を「置き換え」る候補として dialogue-engine が
 * 条件（役割・場面カテゴリ/タグ・NPC性格・関係段階・直前の選択facet）で絞り込み、
 * 重み付きで抽選する。候補が無い場合は各シーンの固定回合へフォールバックする。
 *
 * 回答は text / type(good|short|bad) / facet(会話スキル) / npcReply / npcExpression /
 * explanation / nextHint / weight を持つ。facet は KE_CONFIG.ANSWER_FACETS のキー。
 * 丁寧な断り（polite_decline）は type を bad にしない（断ること自体を減点しない）。
 */
(function () {
  const KE_STORY_LINES = [
    /* ==================== open（導入） ==================== */
    {
      id: "story_open_work_001", role: "open", sceneCategories: ["work"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "お疲れさま。きょうはどう？ 何か進んだことある？", npcExpression: "smile",
      answers: [
        { text: "はい、こないだの資料を仕上げまで進めました。", type: "good", facet: "self_disclose", npcReply: "お、しっかり進んでるね。それで次は何するの？", npcExpression: "happy", explanation: "進捗と内容を伝えると、相手は具体的に返しやすい。", nextHint: "次の予定まで話すとさらに続く。", weight: 10 },
        { text: "ぼちぼちです。", type: "short", facet: "onward", npcReply: "そっか、無理してないならいいね。", npcExpression: "neutral", explanation: "自然な返し。ただし具体性は薄い。", nextHint: "できたことを一言添えると良い。", weight: 10 },
        { text: "あんまりです…。", type: "short", facet: "self_disclose", npcReply: "そう？ 何に手間取ってるか、よかったら話して。", npcExpression: "smile", explanation: "正直な状態を伝えると、相手は助けに入りやすい。", nextHint: "具体的な壁を挙げると話が深まる。", weight: 10 }
      ]
    },
    {
      id: "story_open_daily_001", role: "open", sceneCategories: ["daily"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "あ、こんにちは。今日はいい天気だね。何か予定ある？", npcExpression: "smile",
      answers: [
        { text: "散歩がてら買い物に。天気が良くて気持ちいいです。", type: "good", facet: "self_disclose", npcReply: "いいね。歩くのは気分転換になるよね。", npcExpression: "happy", explanation: "予定と気持ちを重ねると、共感されやすい。", nextHint: "「あなたはどう？」と返すと会話が続く。", weight: 10 },
        { text: "特にないです。", type: "short", facet: "onward", npcReply: "そうなんだ。のんびりするのも大事だよ。", npcExpression: "neutral", explanation: "短いが自然。深掘りはされない。", nextHint: "「何して過ごす？」と聞き返すと良い。", weight: 10 },
        { text: "ちょっと早起きしすぎました。", type: "short", facet: "self_disclose", npcReply: "あら、それは大変。でも朝は気持ちいいよね。", npcExpression: "smile", explanation: "素直な感想は、相手も返しやすい。", nextHint: "「お互い今日を楽しみましょう」と続けると良い。", weight: 10 }
      ]
    },
    {
      id: "story_open_food_001", role: "open", sceneCategories: ["food"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "いらっしゃい！ 今日は何にしようか？ おすすめあるよ。", npcExpression: "happy",
      answers: [
        { text: "おすすめ、いいですね。それは何ですか？", type: "good", facet: "question", npcReply: "今日入った野菜の煮物だよ。体にいいよ。", npcExpression: "happy", explanation: "おすすめを具体的に聞くと、会話が弾む。", nextHint: "注文の相談まですると自然に続く。", weight: 10 },
        { text: "じゃあおすすめで。", type: "short", facet: "onward", npcReply: "はいよ！ すぐ用意するね。", npcExpression: "smile", explanation: "短いが、店員の話は進む。", nextHint: "「楽しみにしてます」を添えると好印象。", weight: 10 },
        { text: "今日はあっさり系がいいです。", type: "short", facet: "polite_decline", npcReply: "あっさり系ね、それならこれが良さそう。", npcExpression: "smile", explanation: "おすすめを断る代わりに好みを伝えると、相手は選びやすい。", nextHint: "実際に選んでもらったら感謝を添えよう。", weight: 10 }
      ]
    },
    {
      id: "story_open_gentle_001", role: "open",
      sceneCategories: [], tags: [], personalities: ["gentle", "caring"], relationLevels: [], requiresPrev: false,
      weight: 8,
      npcLine: "こんにちは。今日もおつかれさま。無理してない？", npcExpression: "soft",
      answers: [
        { text: "ありがとうございます。ちょっと疲れてたので、声かけられて救われました。", type: "good", facet: "self_disclose", npcReply: "そう？ それなら、お茶でも飲んでひと休みして。", npcExpression: "smile", explanation: "本音を返すと、気遣いの相手も喜ぶ。", nextHint: "「回復の話」を一言添えるとさらに良い。", weight: 10 },
        { text: "大丈夫です。", type: "short", facet: "onward", npcReply: "そう？ それなら良かった。無理しないでね。", npcExpression: "smile", explanation: "短いが自然。気遣いは伝わる。", nextHint: "「あなたはどう？」と返すと続く。", weight: 10 },
        { text: "まあ、なんとか…。", type: "short", facet: "self_disclose", npcReply: "なんとか、か。困ったら頼ってね。", npcExpression: "soft", explanation: "弱音を少して見せるのは、距離を縮めるきっかけ。", nextHint: "具体的な困りごとを話すと助けを得やすい。", weight: 10 }
      ]
    },
    {
      id: "story_open_fun_001", role: "open",
      sceneCategories: ["daily", "food"], tags: [], personalities: ["bright", "curious", "humorous"], relationLevels: [], requiresPrev: false,
      weight: 8,
      npcLine: "こんにちは！ 最近、何か楽しいことあった？", npcExpression: "humorous",
      answers: [
        { text: "最近、朝の散歩を始めたんです。写真を撮るのが楽しくて。", type: "good", facet: "self_disclose", npcReply: "お、いいね！ どんなの撮ってるの？", npcExpression: "happy", explanation: "内角の話題を出すと、相手も興味を持ちやすい。", nextHint: "具体例をひとつ話すと弾む。", weight: 10 },
        { text: "特にないですね。", type: "short", facet: "onward", npcReply: "そうか？ じゃあ、これから作ればいいよ！", npcExpression: "humorous", explanation: "短いが、相手のノリなら続きやすい。", nextHint: "「あなたは？」と聞き返すと続く。", weight: 10 },
        { text: "楽しいことは、おいしいごはんですね。", type: "short", facet: "self_disclose", npcReply: "それ大事！ 最近うまいもの食べた？", npcExpression: "happy", explanation: "無難だけど具体的な話題へつなげやすい。", nextHint: "店や料理名を出すと共感しやすい。", weight: 10 }
      ]
    },
    {
      id: "story_open_trust_001", role: "open",
      sceneCategories: ["work"], tags: [], personalities: [], relationLevels: ["trusted", "partner"], requiresPrev: false,
      weight: 8,
      npcLine: "お、ちょうどいいところに。最近の調子、どう？", npcExpression: "smile",
      answers: [
        { text: "お陰様で、落ち着いて回ってます。", type: "good", facet: "self_disclose", npcReply: "それは何より。頼りにしてるよ。", npcExpression: "happy", explanation: "信頼関係では、近況の共有が信頼を深める。", nextHint: "困り事があれば添えるのも自然。", weight: 10 },
        { text: "いつも通りです。", type: "short", facet: "onward", npcReply: "いい傾向だ。", npcExpression: "neutral", explanation: "短いが、こなれてきた返し。", nextHint: "ここ数日のことを一言話すとさらに良い。", weight: 10 },
        { text: "気になることがちょっと…。", type: "short", facet: "self_disclose", npcReply: "そうか。よかったら話していく？", npcExpression: "smile", explanation: "信頼相手には相談を持ちかけやすい。", nextHint: "具体的な内容へ進むと解決に近づく。", weight: 10 }
      ]
    },

    {
      id: "story_open_rain_001", role: "open",
      sceneCategories: [], tags: [], personalities: [], relationLevels: [], requiresPrev: false, weather: ["rain"],
      weight: 8,
      npcLine: "今日は雨だね。お互い、かぜをひかないように。", npcExpression: "smile",
      answers: [
        { text: "ありがとうございます。ちゃんと傘を持ってきました。", type: "good", facet: "self_disclose", npcReply: "えらい！ 雨の日は足元も気をつけてね。", npcExpression: "happy", explanation: "無事に備える姿勢を伝えると、気遣いが報われる。", nextHint: "天気から体調の話へ続けられる。", weight: 10 },
        { text: "はい、気をつけます。", type: "short", facet: "onward", npcReply: "うん、気をつけてね。", npcExpression: "smile", explanation: "短いが自然。相手の気遣いを受け取れる。", nextHint: "「あなたも」を添えると良い。", weight: 10 },
        { text: "雨はちょっと苦手です。", type: "short", facet: "self_disclose", npcReply: "そう？ でも、おかげで静かで落ち着くよ。", npcExpression: "neutral", explanation: "素直な感想も無理はない。", nextHint: "雨の良いところを探すと話せる。", weight: 10 }
      ]
    },
    {
      id: "story_open_fair_001", role: "open",
      sceneCategories: [], tags: [], personalities: [], relationLevels: [], requiresPrev: false, weather: ["clear", "cloudy"],
      weight: 8,
      npcLine: "今日はいい天気で、気分もさわやかだね。", npcExpression: "happy",
      answers: [
        { text: "本当ですね。散歩が気持ちよさそうです。", type: "good", facet: "self_disclose", npcReply: "いいね。空気がきれいなうちに歩くと気分がいいよ。", npcExpression: "happy", explanation: "天気に自分の予定を重ねると共感されやすい。", nextHint: "散歩の話へ自然に続く。", weight: 10 },
        { text: "そうですね。", type: "short", facet: "onward", npcReply: "ね。", npcExpression: "smile", explanation: "短いが自然な相づち。", nextHint: "「何するの？」と聞くと続く。", weight: 10 },
        { text: "晴れてもやることだらけで…。", type: "short", facet: "self_disclose", npcReply: "それは大変だ。でも、空気だけは吸ってね。", npcExpression: "smile", explanation: "愚痴を軽く伝えても、相手は寄り添える。", nextHint: "「少し休もう」と返せると良い。", weight: 10 }
      ]
    },

    /* ==================== develop（展開） ==================== */
    {
      id: "story_dev_work_001", role: "develop", sceneCategories: ["work"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "具体てきには、どれくらい進んでるの？ 教えてもらえると助かるな。", npcExpression: "neutral",
      answers: [
        { text: "全体の7割ですね。残りは明日の午前で仕上げます。", type: "good", facet: "self_disclose", npcReply: "把握した。そのペースなら安心だ。", npcExpression: "smile", explanation: "数値と期限で答えると、相手は管理しやすい。", nextHint: "壁があれば添えると相談しやすい。", weight: 10 },
        { text: "だいたいです。", type: "short", facet: "onward", npcReply: "だいたい、か。わからなかったら言ってね。", npcExpression: "neutral", explanation: "短いが、相手は曖昧さを感じる。", nextHint: "できる範囲を言い換えると良い。", weight: 10 },
        { text: "ちょっと行き詰まってます…。", type: "short", facet: "self_disclose", npcReply: "じゃあ、どの辺で詰まってる？ 一緒に見よう。", npcExpression: "smile", explanation: "壁を正直に話すと、助けを得やすい。", nextHint: "詰まっている箇所を具体的に伝えよう。", weight: 10 }
      ]
    },
    {
      id: "story_dev_daily_001", role: "develop", sceneCategories: ["daily"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "いいね。それは、いつ頃から始めたの？", npcExpression: "curious",
      answers: [
        { text: "最近の週末からです。少しずつ続けてます。", type: "good", facet: "self_disclose", npcReply: "週末から？ それなら続いてるじゃん。", npcExpression: "happy", explanation: "きっかけと継続を伝えると、相手も興味を持つ。", nextHint: "「あなたはどう？」と返すと続く。", weight: 10 },
        { text: "まあ、なんとなくです。", type: "short", facet: "onward", npcReply: "なんとなくも、続けるには大事だよ。", npcExpression: "smile", explanation: "短いが自然。深掘りはされにくい。", nextHint: "ひとつ具体的なことを足すと良い。", weight: 10 },
        { text: "実は三日坊主なんですよね…。", type: "short", facet: "self_disclose", npcReply: "あはは、それなら一緒に続けようか。", npcExpression: "humorous", explanation: "欠点を笑いに変えると、親しみが出る。", nextHint: "無理のない続け方を話すと盛り上がる。", weight: 10 }
      ]
    },
    {
      id: "story_dev_food_001", role: "develop", sceneCategories: ["food"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "それ、自分で作ってるの？ それともお店で食べてるの？", npcExpression: "curious",
      answers: [
        { text: "お店で食べてます。自分だと同じものばかりで…。", type: "good", facet: "self_disclose", npcReply: "それなら、ここで新しいの試してみる？", npcExpression: "happy", explanation: "素直な状況を伝えると、相手は提案しやすい。", nextHint: "注文の相談まで行くと自然。", weight: 10 },
        { text: "お店です。", type: "short", facet: "onward", npcReply: "なるほど。外食も楽しみだよね。", npcExpression: "smile", explanation: "短いが、話題はそこそこ続く。", nextHint: "好きなジャンルを一言添えると良い。", weight: 10 },
        { text: "昨日、自分で野菜スープ作りましたよ。", type: "short", facet: "self_disclose", npcReply: "お、いいね！ どんなの作ったの？", npcExpression: "happy", explanation: "自分で作った話は、相手の興味を引きやすい。", nextHint: "レシピの工夫を話すと弾む。", weight: 10 }
      ]
    },
    {
      id: "story_dev_afterstory_001", role: "develop",
      sceneCategories: [], tags: [], personalities: [], relationLevels: [], requiresPrev: true, prevFacets: ["self_disclose", "empathy"],
      weight: 8,
      npcLine: "へえ、そうだったんだ。それで、それはどうだった？", npcExpression: "smile",
      answers: [
        { text: "やってみると、思ってたより楽しかったです。", type: "good", facet: "self_disclose", npcReply: "それは何より！ 大事なのは楽しめることだよね。", npcExpression: "happy", explanation: "前の自分の話の続きを気持ちよく返すと会話が続く。", nextHint: "次に試したいことを言うと次へつながる。", weight: 10 },
        { text: "まあ、そんな感じでした。", type: "short", facet: "onward", npcReply: "うん、それなら十分かな。", npcExpression: "neutral", explanation: "短いが自然。終わりにしやすい流れ。", nextHint: "感想を一言添えると温かい。", weight: 10 },
        { text: "少し難しくて、途中で休みました。", type: "short", facet: "self_disclose", npcReply: "無理せず休めるのは、えらいことだよ。", npcExpression: "smile", explanation: "反省も共有できると、会話は深まる。", nextHint: "休んだ後の工夫を話すと続く。", weight: 10 }
      ]
    },
    {
      id: "story_dev_afterdecline_001", role: "develop",
      sceneCategories: [], tags: [], personalities: ["gentle", "caring", "concise"], relationLevels: [], requiresPrev: true, prevFacets: ["polite_decline"],
      weight: 8,
      npcLine: "そうだよね、無理しなくていいよ。時間があるときでいいから、また話そう。", npcExpression: "soft",
      answers: [
        { text: "ありがとうございます。それなら、別の日に声かけます。", type: "good", facet: "promise", npcReply: "うん、いつでも待ってるから。", npcExpression: "happy", explanation: "断った後に代案や約束を出せると、関係は保たれる。", nextHint: "実際に声をかけると信頼が深まる。", weight: 10 },
        { text: "考えておきます。", type: "short", facet: "polite_decline", npcReply: "うん、急がなくていいよ。", npcExpression: "smile", explanation: "相手は迷いを残すが、責めにはしない。", nextHint: "「◯日なら」と絞ると決まりやすい。", weight: 10 },
        { text: "では、また今度で。", type: "short", facet: "natural_close", npcReply: "うん、また今度。気をつけてね。", npcExpression: "smile", explanation: "丁寧に閉じられると、また会いやすい。", nextHint: "「お互い」と添えると温かい。", weight: 10 }
      ]
    },
    {
      id: "story_dev_trust_001", role: "develop",
      sceneCategories: [], tags: [], personalities: ["gentle", "caring"], relationLevels: ["trusted", "partner"], requiresPrev: false,
      weight: 8,
      npcLine: "最近、ちょっと悩み事がある？ よかったら聞くよ。", npcExpression: "soft",
      answers: [
        { text: "実は、仕事の優先順で迷ってて…。", type: "good", facet: "self_disclose", npcReply: "それ、わかるな。今は何が重いの？", npcExpression: "smile", explanation: "悩みを共有すると、相談相手になりやすい。", nextHint: "具体的な状況を話すと助けを得やすい。", weight: 10 },
        { text: "特にないです。", type: "short", facet: "onward", npcReply: "それなら安心だ。", npcExpression: "neutral", explanation: "短いが、心配は解ける。", nextHint: "「ありがとう」を添えると好印象。", weight: 10 },
        { text: "大したことじゃないんですけど…。", type: "short", facet: "self_disclose", npcReply: "そう？ 大したことじゃなくても、聞くよ。", npcExpression: "soft", explanation: "遠慮しながらでも話すと、関係は深まる。", nextHint: "少しだけ切り出すと続く。", weight: 10 }
      ]
    },

    /* ==================== respond（応答） ==================== */
    {
      id: "story_res_question_001", role: "respond",
      sceneCategories: [], tags: [], personalities: [], relationLevels: [], requiresPrev: true, prevFacets: ["question"],
      weight: 8,
      npcLine: "ふふ、そう聞かれるとうれしいな。自分の方も、話をしてみたいと思ってたんだ。", npcExpression: "happy",
      answers: [
        { text: "ぜひ聞きたいです。最近どんなことしてますか？", type: "good", facet: "question", npcReply: "それじゃ、最近はまってることを話すね。", npcExpression: "happy", explanation: "質問を重ねると、相手は話しやすくなる。", nextHint: "興味を具体的に示すと弾む。", weight: 10 },
        { text: "もう少しだけ聞かせてください。", type: "short", facet: "onward", npcReply: "いいよ、いくらでも。", npcExpression: "smile", explanation: "短いが、続きを促す返し。", nextHint: "とまどいなく話せる雰囲気に。", weight: 10 },
        { text: "それは気になります。でも今日は時間がなくて。", type: "short", facet: "polite_decline", npcReply: "そう？ じゃあまた今度、ゆっくり話そう。", npcExpression: "smile", explanation: "興味と都合を伝えられると、相手も納得できる。", nextHint: "「また今度」を約束にすると良い。", weight: 10 }
      ]
    },
    {
      id: "story_res_empathy_001", role: "respond",
      sceneCategories: [], tags: [], personalities: [], relationLevels: [], requiresPrev: true, prevFacets: ["empathy", "self_disclose"],
      weight: 8,
      npcLine: "ありがとう、そう言ってもらえると助かるよ。", npcExpression: "soft",
      answers: [
        { text: "こちらこそ、聞いてもらえて助かりました。", type: "good", facet: "onward", npcReply: "お互い様だよ。また何かあるときは話そう。", npcExpression: "happy", explanation: "感謝を返すと、信頼が育つ。", nextHint: "次につながる一言があると良い。", weight: 10 },
        { text: "いえいえ。", type: "short", facet: "onward", npcReply: "ふふ、謙虚だね。", npcExpression: "smile", explanation: "短いが、照れくさい自然な返し。", nextHint: "照れを笑いにして続けやすい。", weight: 10 },
        { text: "そう言ってもらえて、自分も安心しました。", type: "short", facet: "self_disclose", npcReply: "安心したなら、よかった。", npcExpression: "smile", explanation: "相手の言葉に対する自分の気持ちを返すと通じやすい。", nextHint: "余韻を残す終わり方でも良い。", weight: 10 }
      ]
    },
    {
      id: "story_res_promise_001", role: "respond",
      sceneCategories: [], tags: [], personalities: ["bright", "gentle"], relationLevels: [], requiresPrev: true, prevFacets: ["promise"],
      weight: 8,
      npcLine: "いいね、それで決まり！ 楽しみにしてるよ。", npcExpression: "happy",
      answers: [
        { text: "はい、それで決まりですね。その日のうちに連絡します。", type: "good", facet: "promise", npcReply: "うん、待ってる。忘れないでね！", npcExpression: "happy", explanation: "約束の詳細まで伝えると、相手は安心する。", nextHint: "実際に守ると信頼がグッと上がる。", weight: 10 },
        { text: "はい。", type: "short", facet: "promise", npcReply: "よし、それじゃまた。", npcExpression: "smile", explanation: "短いが、約束は成立する。", nextHint: "日時を一言添えると確実になる。", weight: 10 },
        { text: "あ、でも体調次第でごめんなさい。", type: "short", facet: "polite_decline", npcReply: "そっか、無理はしないでね。体調が一番だよ。", npcExpression: "smile", explanation: "条件付きでも約束を伝えると、相手は納得しやすい。", nextHint: "「元気だったら」の言い方で成立する。", weight: 10 }
      ]
    },
    {
      id: "story_res_work_001", role: "respond", sceneCategories: ["work"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "うん、その進め方なら、大丈夫そうだね。", npcExpression: "neutral",
      answers: [
        { text: "ありがとうございます。次の確認、またお願いします。", type: "good", facet: "promise", npcReply: "いいよ。また声かけて。", npcExpression: "smile", explanation: "確認のお願いまで伝えると、前向きに締められる。", nextHint: "次回の予定を一言添えると良い。", weight: 10 },
        { text: "よかったです。", type: "short", facet: "onward", npcReply: "うん。", npcExpression: "neutral", explanation: "短いが自然。相手も安心する。", nextHint: "「参考にしました」を添えると喜ばれる。", weight: 10 },
        { text: "少し不安ですが、進めてみます。", type: "short", facet: "self_disclose", npcReply: "不安でも進める姿勢、大事だよ。困ったら声かけて。", npcExpression: "smile", explanation: "不安も伝えると、相手は目配りしてくれる。", nextHint: "チェックポイントを決めると安心。", weight: 10 }
      ]
    },
    {
      id: "story_res_daily_001", role: "respond", sceneCategories: ["daily"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "そうなんだ。聞いてると、自分もなんだかいい気分になるよ。", npcExpression: "smile",
      answers: [
        { text: "そう言ってもらえると、話してよかったです。", type: "good", facet: "onward", npcReply: "また何かあったら、聞かせてね。", npcExpression: "happy", explanation: "相手の反応に感謝を返すと、関係が続く。", nextHint: "次話したいことを心に置くと良い。", weight: 10 },
        { text: "また話します。", type: "short", facet: "promise", npcReply: "うん、待ってるよ。", npcExpression: "smile", explanation: "短くても、次を約束すると続く。", nextHint: "話題のヒントを残すと次も話しやすい。", weight: 10 },
        { text: "今日はもう行きますね。", type: "short", facet: "natural_close", npcReply: "うん、気をつけて。またね。", npcExpression: "neutral", explanation: "自然に締めると、相手も気持ちよく別れられる。", nextHint: "「お互い」と添えると温かい。", weight: 10 }
      ]
    },
    {
      id: "story_res_food_001", role: "respond", sceneCategories: ["food"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "そう言われると、こっちも元気になっちゃうな。", npcExpression: "happy",
      answers: [
        { text: "本当においしいので、また来ますね。", type: "good", facet: "promise", npcReply: "うん、いつでも待ってるよ！", npcExpression: "happy", explanation: "再来を約束すると、店主も喜ぶ。", nextHint: "実際に通うと常連になります。", weight: 10 },
        { text: "また来ます。", type: "short", facet: "promise", npcReply: "はーい、待ってるね。", npcExpression: "smile", explanation: "短いが、来店の約束は伝わる。", nextHint: "「楽しみにしてます」を添えると良い。", weight: 10 },
        { text: "おなかいっぱいなので、そろそろ。", type: "short", facet: "natural_close", npcReply: "うん、ゆっくり休んでね。", npcExpression: "smile", explanation: "満足と帰る理由を伝えると、相手も気持ちよく送れる。", nextHint: "「ごちそうさま」を忘れずに。", weight: 10 }
      ]
    },

    /* ==================== close（締め） ==================== */
    {
      id: "story_close_work_001", role: "close", sceneCategories: ["work"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "そろそろ続きに戻るね。また何かあったら、いつでも声かけて。", npcExpression: "smile",
      answers: [
        { text: "ありがとうございます。また明日、よろしくお願いします。", type: "good", facet: "promise", npcReply: "ああ、また明日。", npcExpression: "smile", explanation: "別れ際に次の約束を添えると、締まりが良い。", nextHint: "明日のことを一言添えると好印象。", weight: 10 },
        { text: "お疲れさまです。", type: "short", facet: "natural_close", npcReply: "おつかれさま。", npcExpression: "neutral", explanation: "短くても、労われれば自然に締められる。", nextHint: "「ありがとう」を添えると温かい。", weight: 10 },
        { text: "はい、気をつけます。", type: "short", facet: "onward", npcReply: "それなら安心だ。", npcExpression: "smile", explanation: "心配への返しとして十分。", nextHint: "「また相談します」を添えると良い。", weight: 10 }
      ]
    },
    {
      id: "story_close_daily_001", role: "close", sceneCategories: ["daily"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "じゃあ、また近いうちにね。気をつけて。", npcExpression: "smile",
      answers: [
        { text: "はい、ありがとうございます。またお会いしましょう。", type: "good", facet: "promise", npcReply: "うん、またね！", npcExpression: "happy", explanation: "また会う約束をすると、別れが明るくなる。", nextHint: "「そのときは◯◯を」と添えると続く。", weight: 10 },
        { text: "またね。", type: "short", facet: "natural_close", npcReply: "またね。", npcExpression: "smile", explanation: "短いが自然な別れ。", nextHint: "「お互い気をつけて」を添えると良い。", weight: 10 },
        { text: "今日は話せてよかったです。", type: "short", facet: "natural_close", npcReply: "自分も楽しかったよ。また話そう。", npcExpression: "happy", explanation: "感想を残すと、次の会話がつながる。", nextHint: "次回の話題の種を残すと会いやすい。", weight: 10 }
      ]
    },
    {
      id: "story_close_food_001", role: "close", sceneCategories: ["food"],
      tags: [], personalities: [], relationLevels: [], requiresPrev: false,
      weight: 10,
      npcLine: "おいしかった？ また来てもらえると嬉しいな。", npcExpression: "happy",
      answers: [
        { text: "本当においしかったです。また必ず来ます。", type: "good", facet: "promise", npcReply: "うん、約束だよ！ 待ってるね。", npcExpression: "happy", explanation: "味の感想と再来を贈ると、店主は喜ぶ。", nextHint: "次に食べたいものを言うと楽しみが残る。", weight: 10 },
        { text: "おいしかったです。", type: "short", facet: "natural_close", npcReply: "それはよかった。またどうぞ。", npcExpression: "smile", explanation: "短くても、感想は伝わる。", nextHint: "「ありがとう」を添えると好印象。", weight: 10 },
        { text: "ごちそうさまでした。そろそろ失礼します。", type: "short", facet: "natural_close", npcReply: "はい、お気をつけて。", npcExpression: "smile", explanation: "満足して締めると、また来やすい。", nextHint: "「また来ます」を添えると良い。", weight: 10 }
      ]
    },
    {
      id: "story_close_trust_001", role: "close",
      sceneCategories: [], tags: [], personalities: [], relationLevels: ["trusted", "partner"], requiresPrev: false,
      weight: 8,
      npcLine: "今日も話せてよかったよ。また近いうちに会おうね。", npcExpression: "smile",
      answers: [
        { text: "はい、こちらこそ。次は◯◯を一緒に見に行きましょう。", type: "good", facet: "promise", npcReply: "それ、いいね。日程、後で決めよう。", npcExpression: "happy", explanation: "次に会う予定を出すと、関係は続く。", nextHint: "実際に日程を決めると深まる。", weight: 10 },
        { text: "はい、また。", type: "short", facet: "natural_close", npcReply: "うん、また。", npcExpression: "smile", explanation: "短いが、心は通っている。", nextHint: "「楽しみにしてます」を添えると良い。", weight: 10 },
        { text: "今日はありがとうございました。", type: "short", facet: "natural_close", npcReply: "こちらこそ、ありがとう。", npcExpression: "smile", explanation: "感謝を伝えると、信頼が締まる。", nextHint: "次回の予定を添えると次へ続く。", weight: 10 }
      ]
    },
    {
      id: "story_close_shy_001", role: "close",
      sceneCategories: [], tags: [], personalities: ["shy"], relationLevels: [], requiresPrev: false,
      weight: 8,
      npcLine: "また…。お話しできたら、うれしいです。", npcExpression: "shy",
      answers: [
        { text: "私もです。また会ったら、ぜひ声をかけてください。", type: "good", facet: "promise", npcReply: "ぜひ…！ お願いします。", npcExpression: "shy", explanation: "相手の勇気を受け止めると、関係が育つ。", nextHint: "短い声かけからでも続く。", weight: 10 },
        { text: "はい、また。", type: "short", facet: "natural_close", npcReply: "…はい。", npcExpression: "shy", explanation: "短いが、相手は十分温かく感じる。", nextHint: "「また」を添えると相手の背中を押す。", weight: 10 },
        { text: "また今度ですね。", type: "short", facet: "natural_close", npcReply: "は、はい…。ありがとうございます。", npcExpression: "shy", explanation: "自然な締めで、人見知りには負担が少ない。", nextHint: "「お互い」を添えると安心させる。", weight: 10 }
      ]
    },

    /* ==================== 共通フォールバック（最終段） ==================== */
    {
      id: "story_open_fallback_001", role: "open",
      sceneCategories: [], tags: [], personalities: [], relationLevels: [], requiresPrev: false, weight: 6,
      npcLine: "こんにちは。今日はどうでしたか？", npcExpression: "smile",
      answers: [
        { text: "いい一日でした。", type: "good", facet: "onward", npcReply: "それはよかったですね。", npcExpression: "happy", explanation: "素直な感想は、相手も返しやすい。", nextHint: "具体的なことを一言添えると続く。", weight: 10 },
        { text: "いつも通りです。", type: "short", facet: "onward", npcReply: "そうですか。", npcExpression: "neutral", explanation: "短いが自然な答え。", nextHint: "「あなたは？」と聞き返すと良い。", weight: 10 },
        { text: "まあまあです。", type: "short", facet: "onward", npcReply: "まあまあがいいくらいですよね。", npcExpression: "smile", explanation: "無難な返し。広がりは控えめ。", nextHint: "話題を足すと続きやすい。", weight: 10 }
      ]
    },
    {
      id: "story_develop_fallback_001", role: "develop",
      sceneCategories: [], tags: [], personalities: [], relationLevels: [], requiresPrev: true,
      weight: 6,
      npcLine: "なるほど。それで、そのあとはどうでしたか？", npcExpression: "curious",
      answers: [
        { text: "そのあと、少しずつ落ち着いてきました。", type: "good", facet: "self_disclose", npcReply: "そうですか、よかったですね。", npcExpression: "smile", explanation: "経過を話すと、相手は安心する。", nextHint: "今の状況を添えると続く。", weight: 10 },
        { text: "そのあとは特になしです。", type: "short", facet: "onward", npcReply: "そうですか。", npcExpression: "neutral", explanation: "短いが自然な流れ。", nextHint: "「今はどう？」と重ねると続く。", weight: 10 },
        { text: "少し悩んでいます。", type: "short", facet: "self_disclose", npcReply: "よかったら、少し話してみますか？", npcExpression: "smile", explanation: "悩みを出すと、相手も寄り添える。", nextHint: "具体的な内容へ進むと解決しやすい。", weight: 10 }
      ]
    },
    {
      id: "story_respond_fallback_001", role: "respond",
      sceneCategories: [], tags: [], personalities: [], relationLevels: [], requiresPrev: true,
      weight: 6,
      npcLine: "なるほど、そういうことだったんですね。", npcExpression: "neutral",
      answers: [
        { text: "はい、そういうことです。伝わってよかったです。", type: "good", facet: "onward", npcReply: "うん、伝わってよかった。", npcExpression: "smile", explanation: "理解を確認し合うと、会話がひとつ重なる。", nextHint: "次の話題へつなげると続く。", weight: 10 },
        { text: "同じです。", type: "short", facet: "onward", npcReply: "そうなんですね。", npcExpression: "neutral", explanation: "短いが、話は通じている。", nextHint: "「うなづき」を添えると通じやすい。", weight: 10 },
        { text: "ちょっと難しいです…。", type: "short", facet: "self_disclose", npcReply: "無理に片付けなくていいですよ。少しずつで。", npcExpression: "smile", explanation: "難しいと正直に言えると、相手も合わせやすい。", nextHint: "わからない点を挙げると助けを得やすい。", weight: 10 }
      ]
    },
    {
      id: "story_close_fallback_001", role: "close",
      sceneCategories: [], tags: [], personalities: [], relationLevels: [], requiresPrev: true,
      weight: 6,
      npcLine: "今日はいろいろ聞いてくれて、ありがとう。", npcExpression: "smile",
      answers: [
        { text: "こちらこそ、ありがとうございました。またぜひ。", type: "good", facet: "promise", npcReply: "うん、また。楽しみにしてるよ。", npcExpression: "happy", explanation: "感謝と次への約束で、良い締めになる。", nextHint: "実際に次が実現すると信頼になる。", weight: 10 },
        { text: "ありがとうございました。", type: "short", facet: "natural_close", npcReply: "はい、また。", npcExpression: "smile", explanation: "感謝だけで自然に締められる。", nextHint: "一言添えると温かい。", weight: 10 },
        { text: "はい、また今度。", type: "short", facet: "natural_close", npcReply: "また今度。", npcExpression: "smile", explanation: "短いが、良い別れ。", nextHint: "日時を絞ると実現しやすい。", weight: 10 }
      ]
    }
  ];

  if (globalThis) globalThis.KE_STORY_LINES = KE_STORY_LINES;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_STORY_LINES };
})();
