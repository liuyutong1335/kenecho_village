"use strict";
/*
 * kenecho Village - 会話シーン20件（KE_SCENES）
 * 全て架空のオリジナル。日常8 / 仕事6 / 食事・交流6を8名のNPCへ割り当てる。
 * - クエスト: rounds[0] を1ターンの3択に使う
 * - 練習: rounds を順に4ターン実施。bonus があれば条件成立時（good 2回以上）に1ターン追加
 * 回答: text / type(good|short|bad) / npcReply / npcExpression / explanation / nextHint
 *   分類は回答前に表示しない。
 */
(function () {
  const KE_SCENES = [

    /* ============ 仕事（6） ============ */
    {
      id: "scn_001", title: "朝の相談", category: "work", npcId: "npc_sato", background: "office",
      tags: ["work", "advice"],
      context: "朝、オフィスで資料のつくり方がわからず、佐藤さんに相談しました。",
      rounds: [
        {
          npcLine: "おはよう。何かあった？ ちょっと顔色が曇ってるよ。", npcExpression: "neutral",
          answers: [
            { text: "実は昨日の資料のつくり方がわからなくて…", type: "good", npcReply: "ああ、わかるわかる。一緒に確認しようか。", npcExpression: "smile", explanation: "困りごとを具体的に伝えると、相手は助けに入りやすい。", nextHint: "具体的な部分を見せると、より深い相談に発展。", weight: 10 },
            { text: "大丈夫です、頑張ります！", type: "short", npcReply: "そう？ 無理はしないでね。", npcExpression: "neutral", explanation: "気持ちは伝わるが、困り中の背景が相手には見えない。", nextHint: "困っている内容に触れると話が続きやすい。", weight: 10 },
            { text: "別に何もないです。", type: "bad", npcReply: "そう…。じゃあ、またね。", npcExpression: "troubled", explanation: "気遣いを断るのは、相手を戸惑わせやすい。", nextHint: "ひと言でも感謝を添えると印象が違う。", weight: 10 }
          ]
        },
        {
          npcLine: "資料のどのへんがわからなかったの？", npcExpression: "smile",
          answers: [
            { text: "グラフの載せ方と、まとめの書き方が…", type: "good", npcReply: "そこ、私も最初に悩んだよ。コツを教えるね。", npcExpression: "smile", explanation: "具体的な箇所を挙げると、相手は答えやすくなる。", nextHint: "相手の助言に反応すると会話が続く。", weight: 10 },
            { text: "全部です。", type: "short", npcReply: "あらら。じゃあ最初から見てみよう。", npcExpression: "happy", explanation: "短いが自然。状況は伝わるが詳しさは少ない。", nextHint: "細かい部分へ踏み込むと話が広がる。", weight: 10 },
            { text: "まあなんとか自分でやります。", type: "bad", npcReply: "…そう？ 聞いてくれてよかったのに。", npcExpression: "troubled", explanation: "せっかくの助けの手を止めてしまう。", nextHint: "相手の申し出を受け取るだけでも良好に。", weight: 10 }
          ]
        },
        {
          npcLine: "グラフは「いちばん伝えたい数字」を大きく見せるのがコツだよ。", npcExpression: "happy",
          answers: [
            { text: "なるほど、数字を大きくするんですね。やってみます！", type: "good", npcReply: "うん、それで十分。あとで見せてね。", npcExpression: "happy", explanation: "学んだことを言い返すと、相手は教えがいを感じる。", nextHint: "教わった成果を報告すると関係が深まる。", weight: 10 },
            { text: "へー。", type: "short", npcReply: "…それだけ？ まあ、わかったらOK。", npcExpression: "neutral", explanation: "聞いてはいるが、熱意が伝わりにくい。", nextHint: "自分の言葉でおさらいすると意欲が伝わる。", weight: 10 },
            { text: "でも、エクセル、使いにくいですよね。", type: "bad", npcReply: "あ、えっと…まあ、慣れだよ。", npcExpression: "troubled", explanation: "アドバイスへの文句は、助言者を困らせがち。", nextHint: "まず感謝してから課題を伝えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、今日の夕方は資料の確認ついでにコーヒーでもどう？", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。ぜひお願いします！", type: "good", npcReply: "よし、決まり。わからなさそうな顔をしてれば迎えに行くよ。", npcExpression: "happy", explanation: "誘いを気持ちよく受けると、関係が一歩進む。", nextHint: "約束の時間を気にするとさらに信頼が増す。", weight: 10 },
            { text: "考えておきます。", type: "short", npcReply: "うん、急がなくていいよ。", npcExpression: "neutral", explanation: "曖昧な返事は、相手に迷いを残す。", nextHint: "日時を絞ると決まりやすい。", weight: 10 },
            { text: "ちょっと今は無理です。", type: "bad", npcReply: "そっか…じゃあまた今度ね。", npcExpression: "neutral", explanation: "断り方としては最短だが、代案があると続きやすい。", nextHint: "「◯日なら」と対案を出すと良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_002", title: "報告のしかた", category: "work", npcId: "npc_sato", background: "office",
      tags: ["work", "report"],
      context: "仕事の進み具合を、佐藤さんに報告しています。",
      rounds: [
        {
          npcLine: "今日の作業、どうだった？", npcExpression: "neutral",
          answers: [
            { text: "3分の2までは進みました。明日、まとめに入ります。", type: "good", npcReply: "いいね、前より報告が具体的になった。", npcExpression: "happy", explanation: "今の状態と次の予定を伝えると、相手は安心する。", nextHint: "壁にぶつかった点も添えると相談しやすい。", weight: 10 },
            { text: "まあ、ぼちぼちです。", type: "short", npcReply: "うん、無理せずね。", npcExpression: "neutral", explanation: "自然だが、進捗の答えになっていない。", nextHint: "具体的な数字やタスク名があると良い。", weight: 10 },
            { text: "終わりました。", type: "bad", npcReply: "終わった…？ 全部？", npcExpression: "troubled", explanation: "結果だけの短い報告は、信頼につながりにくい。", nextHint: "どんな内容を終えたか説明すると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "進んでるみたいで安心したよ。何か気になる点はある？", npcExpression: "smile",
          answers: [
            { text: "実は、チェックの順番がこれで合ってるか心配で…", type: "good", npcReply: "そこ、大事だよね。見てあげる。", npcExpression: "smile", explanation: "不安を共有すると、相手は相談相手になりやすい。", nextHint: "安心できた感謝を伝えると好印象。", weight: 10 },
            { text: "特にないです。", type: "short", npcReply: "それなら良かった。", npcExpression: "neutral", explanation: "短いが自然。ただし隠しごとがあると見抜かれやすい。", nextHint: "本当に不安が無いか一度整理すると良い。", weight: 10 },
            { text: "聞かなくても大丈夫ですよ。", type: "bad", npcReply: "…まあ、そう言うなら。", npcExpression: "troubled", explanation: "せっかくの気づかいに蓋をしてしまう。", nextHint: "相手の意図をくみ取ると関係が育つ。", weight: 10 }
          ]
        },
        {
          npcLine: "もし困ったら、書きかけでも見せてね。", npcExpression: "soft",
          answers: [
            { text: "ありがとうございます。書きかけのを一度見てもらえますか？", type: "good", npcReply: "もちろん。じゃあ昼休みに見よう。", npcExpression: "happy", explanation: "申し出をすぐに使うと、信頼へつながる。", nextHint: "その後の改善点を活かすとさらに良好。", weight: 10 },
            { text: "わかりました。", type: "short", npcReply: "うん、気が向いたらでいいからね。", npcExpression: "neutral", explanation: "返事はあるが、利用する気が伝わらない。", nextHint: "「それなら今」と踏み込むと話が進む。", weight: 10 },
            { text: "自分で何とかします。", type: "bad", npcReply: "そう…。頼っていいんだよ。", npcExpression: "troubled", explanation: "孤立を選ぶと、相手も距離を置きがち。", nextHint: "助けを受け入れることも強さのひとつ。", weight: 10 }
          ]
        },
        {
          npcLine: "ちなみに、週末は何してるの？ 息抜きも大切だよ。", npcExpression: "happy",
          answers: [
            { text: "最近は散歩を始めました。一歩ずつ歩くのが気持ちよくて。", type: "good", npcReply: "いいね、私も休みは公園を歩くよ。", npcExpression: "happy", explanation: "相手の話題に真実の自分の話を重ねると盛り上がる。", nextHint: "相手の趣味を引き出してあげると良い。", weight: 10 },
            { text: "寝てます。", type: "short", npcReply: "それも休養だよね。", npcExpression: "neutral", explanation: "事例は短いが自然。深掘りはされにくい。", nextHint: "一言添えると会話の間がふさがる。", weight: 10 },
            { text: "話してよかったですか？ プライベートなので。", type: "bad", npcReply: "あ、ごめん。聞かなくてよかったのに。", npcExpression: "troubled", explanation: "相手の好意を拒絶すると、その後話しにくくなる。", nextHint: "話せる範囲で受け応えすると良好。", weight: 10 }
          ]
        }
      ]
    },

    {
      id: "scn_003", title: "進捗の確認", category: "work", npcId: "npc_tanaka", background: "office",
      tags: ["work", "report"],
      context: "田中さん（上司）に、タスクの進捗を確認されています。",
      rounds: [
        {
          npcLine: "件進捗は。", npcExpression: "concise",
          answers: [
            { text: "全体の8割です。残りは明日の午前で仕上げます。", type: "good", npcReply: "了解。期日は守れそうか。", npcExpression: "neutral", explanation: "項目・数値・期限をそろえると上司には一番伝わる。", nextHint: "期限の明言が次に返ってくる。", weight: 10 },
            { text: "だいたい進んでます。", type: "short", npcReply: "だいたい、か。", npcExpression: "concise", explanation: "抽象的だと確認が重なり続ける。", nextHint: "数値で言い直せると信頼が上がる。", weight: 10 },
            { text: "もう少し待ってください。", type: "bad", npcReply: "期限と内容を出せ。", npcExpression: "concise", explanation: "期日がないと上司は追い詰められる。", nextHint: "できるところまでを先に見せるのが良い。", weight: 10 }
          ]
        },
        {
          npcLine: "期日は守れそうか。", npcExpression: "concise",
          answers: [
            { text: "はい。今日中に一度確認を回して、明日の朝までに仕上げます。", type: "good", npcReply: "よし。確認点を先に送っておけ。", npcExpression: "neutral", explanation: "具体的なスケジュールを言うと上司は動きやすい。", nextHint: "確認点を事前共有すると一層スムーズ。", weight: 10 },
            { text: "なんとかします。", type: "short", npcReply: "それが一番不安だ。", npcExpression: "concise", explanation: "「なんとか」は根拠が見えない禁句にされやすい。", nextHint: "具体的な段取りを言い換えよう。", weight: 10 },
            { text: "あとで説明します。", type: "bad", npcReply: "今、聞いている。", npcExpression: "concise", explanation: "先送りは上司の信用を削る。", nextHint: "今わかる範囲から答えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "確認点は送った。目を通せ。", npcExpression: "concise",
          answers: [
            { text: "承知しました。今から確認して、わからない点は備考にまとめます。", type: "good", npcReply: "いい対応だ。", npcExpression: "neutral", explanation: "受けた指示を自分の行動へ落とし込むと理解が良い。", nextHint: "気づいた点を返すとより評価される。", weight: 10 },
            { text: "了解です。", type: "short", npcReply: "うむ。", npcExpression: "neutral", explanation: "短いが自然。上司側は完了と受け取りがち。", nextHint: "具体的に何をするか付けると丁寧。", weight: 10 },
            { text: "後でまとめて見ます。", type: "bad", npcReply: "後で、は死語だ。今見てくれ。", npcExpression: "concise", explanation: "先延ばしは上司が最も嫌う反応のひとつ。", nextHint: "その場で開いて確認姿勢を見せる。", weight: 10 }
          ]
        },
        {
          npcLine: "そろそろ帰れ。残業は今日までにしろ。", npcExpression: "concise",
          answers: [
            { text: "ありがとうございます。じゃあ明日の確認、よろしくお願いします。", type: "good", npcReply: "ああ、明日な。", npcExpression: "neutral", explanation: "気遣いに短く応えて先の約束を添えると締まりが良い。", nextHint: "明日のことを一言添えると好印象。", weight: 10 },
            { text: "お疲れさまです。", type: "short", npcReply: "おつかれ。", npcExpression: "neutral", explanation: "短いが自然。上司にも伝わる労い。", nextHint: "明日の一言を添えるとさらに良い。", weight: 10 },
            { text: "あ、でも終わらないんで、残ります。", type: "bad", npcReply: "…それなら今、段取りを見せろ。", npcExpression: "concise", explanation: "指示を無視すると、管理側はますます問い詰める。", nextHint: "理由ではなく段取りを先に出すと良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_004", title: "会議後のひと言", category: "work", npcId: "npc_tanaka", background: "breakroom",
      tags: ["work", "smalltalk"],
      context: "会議が終わり、休憩室で田中さんと二人きりになりました。",
      rounds: [
        {
          npcLine: "会議、どうだった。", npcExpression: "neutral",
          answers: [
            { text: "議題がはっきりしていて、進め方のお手本になると思いました。", type: "good", npcReply: "要点だけに絞ってるからだ。", npcExpression: "neutral", explanation: "具体的な感想は、硬い上司にも刺さりやすい。", nextHint: "自分の課題を一つ添えると更に良い。", weight: 10 },
            { text: "よかったです。", type: "short", npcReply: "そうか。", npcExpression: "neutral", explanation: "短いが自然。深くは広がらない。", nextHint: "どこが良かったか挙げると通じやすい。", weight: 10 },
            { text: "いつも通りですね。", type: "bad", npcReply: "…意味がわからん。", npcExpression: "concise", explanation: "空気の読めない一言は、上司を閉じさせる。", nextHint: "具体的な反応を心がけよう。", weight: 10 }
          ]
        },
        {
          npcLine: "君は会議で発言してなかったな。", npcExpression: "concise",
          answers: [
            { text: "まだ自信がないんです。でも次は、確認したい点を1つ挙げたいと思ってます。", type: "good", npcReply: "それでいい。1つから始めろ。", npcExpression: "neutral", explanation: "課題を素直に出して次への行動を示すと信頼される。", nextHint: "次の会議で発言すると上司は覚えている。", weight: 10 },
            { text: "話すことがなかったので。", type: "short", npcReply: "聞くだけの会議は無意味だ。", npcExpression: "concise", explanation: "短いが厳しさを招きやすい返し。", nextHint: "「1件は確認」と決めると良い。", weight: 10 },
            { text: "発言すると目立つので。", type: "bad", npcReply: "…それは会社としては困る。", npcExpression: "concise", explanation: "消極的すぎると上司は評価に困る。", nextHint: "小さくても参加する姿勢が第一歩。", weight: 10 }
          ]
        },
        {
          npcLine: "コーヒー、飲むか。", npcExpression: "neutral",
          answers: [
            { text: "いただきます。先生のコーヒー、おいしいですよね。", type: "good", npcReply: "豆を少し変えてる。今度教えるか。", npcExpression: "neutral", explanation: "相手の趣味へ触れると、仕事以外の関係が始まる。", nextHint: "「今度教えてください」の一言が次につながる。", weight: 10 },
            { text: "はい、お願いします。", type: "short", npcReply: "ほい。", npcExpression: "neutral", explanation: "要件は伝わるが相手の気遣いに触れない。", nextHint: "一口飲んで感想を言うと続く。", weight: 10 },
            { text: "すみません、今はいいです。", type: "bad", npcReply: "ふうん、そうか。", npcExpression: "concise", explanation: "好意のシーンで断ると会話が止まりやすい。", nextHint: "「後でいただきます」でも伝わり方は変わる。", weight: 10 }
          ]
        },
        {
          npcLine: "休憩室の掃除、当番って決まってるのか。", npcExpression: "concise",
          answers: [
            { text: "表が棚に貼ってありますよ。今週は私が当番です。", type: "good", npcReply: "そうか。休み時間に声をかけてくれ。手伝う。", npcExpression: "neutral", explanation: "すぐ答えられる情報を出すと、雑談が仕事効率に変わる。", nextHint: "「ありがとうございます」を添えよう。", weight: 10 },
            { text: "表にあります。", type: "short", npcReply: "どこだ。", npcExpression: "concise", explanation: "短いが位置まで伝えず上司が探すことになる。", nextHint: "場所まで案内すると丁寧さが伝わる。", weight: 10 },
            { text: "知らないです。", type: "bad", npcReply: "…調べる気はないのか。", npcExpression: "concise", explanation: "「知らない」で止めると、協業に響きかける。", nextHint: "「確認してきます」が最善の返し。", weight: 10 }
          ]
        }
      ]
    },

    {
      id: "scn_005", title: "タスクの引き継ぎ", category: "work", npcId: "npc_yamada", background: "elevator",
      tags: ["work", "handover"],
      context: "エレベーターで、引き継ぎ資料について山田さんと話しています。",
      rounds: [
        {
          npcLine: "引き継ぎの資料、確認した？", npcExpression: "cautious",
          answers: [
            { text: "まだ半分までです。保管場所の一覧が途中で途切れてまして…", type: "good", npcReply: "あ、そこ、追記したつもりだったのに。直しておくね。", npcExpression: "cautious", explanation: "進捗と壁を具体的に言うと、相手は差し替えやすい。", nextHint: "指示をもらった後はお礼を添えよう。", weight: 10 },
            { text: "見てます。", type: "short", npcReply: "うん…、不明点があったら言ってね。", npcExpression: "cautious", explanation: "返事はあるが、状態が伝わりにくい。", nextHint: "進捗度を伝えると安心される。", weight: 10 },
            { text: "まだです。", type: "bad", npcReply: "明日までには見てほしい。", npcExpression: "cautious", explanation: "期限が迫る作業の先延ばしは、相手を不安にする。", nextHint: "いつまでに見るか伝えると対応しやすい。", weight: 10 }
          ]
        },
        {
          npcLine: "保管場所、どうしてる？", npcExpression: "cautious",
          answers: [
            { text: "共有フォルダの「引き継ぎ」に入れて、名前は日付を先頭にしました。", type: "good", npcReply: "統一してもらえると助かる。ありがとう。", npcExpression: "cautious", explanation: "自分なりの整理方針を伝えると、相手は安心する。", nextHint: "整理方針を事前にすり合わせると更に良い。", weight: 10 },
            { text: "まとめてます。", type: "short", npcReply: "うん…、場所だけ分かれば大丈夫。", npcExpression: "neutral", explanation: "曖昧だが、とりあえずは通じる返し。", nextHint: "具体的な場所名だと正確さが増す。", weight: 10 },
            { text: "適当に置いてます。", type: "bad", npcReply: "…それじゃ引き継ぎにならないよ。", npcExpression: "troubled", explanation: "軽すぎる返しは、後任を不安にする。", nextHint: "整理の手順を決めると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "期限が迫ってるんだ。優先順をつけてくれない？", npcExpression: "cautious",
          answers: [
            { text: "承知しました。明日の朝までに、担当ごとの優先順をまとめます。", type: "good", npcReply: "期限があると助かる。よろしく。", npcExpression: "cautious", explanation: "期限を自ら区切ると、相手は管理しやすい。", nextHint: "提出時の内容も一言伝えると更に良い。", weight: 10 },
            { text: "わかりました。", type: "short", npcReply: "…期限は？", npcExpression: "cautious", explanation: "受諾だけでは、相手はいつできるか分からない。", nextHint: "「いつまでに」を添えると安心される。", weight: 10 },
            { text: "できるところからやります。", type: "bad", npcReply: "それでは優先順がずれていくよ。", npcExpression: "troubled", explanation: "守れそうな範囲でも、具体性がないと不安を残す。", nextHint: "順序を小さく宣言すると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "エレベーター、ここで降りるね。資料、よろしく。", npcExpression: "cautious",
          answers: [
            { text: "ありがとうございます。明日の朝、まとめたのを送りますね。", type: "good", npcReply: "うん、待ってる。", npcExpression: "cautious", explanation: "別れ際にも次を約束すると、安心して渡せる。", nextHint: "約束の時間を守ることが次の信頼。", weight: 10 },
            { text: "はい、失礼します。", type: "short", npcReply: "うん。", npcExpression: "neutral", explanation: "失礼はない短い別れ。ただし約束は薄い。", nextHint: "「明日送ります」を添えると良い。", weight: 10 },
            { text: "(何も言わず降りる)", type: "bad", npcReply: "…あれ？", npcExpression: "troubled", explanation: "無言の別れは相手を置き去りにする。", nextHint: "短くても反応することが大切。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_006", title: "帰り支度の気遣い", category: "work", npcId: "npc_yamada", background: "elevator",
      tags: ["work", "kindness"],
      context: "帰り際のエレベーターで、山田さんが荷物を抱えています。",
      rounds: [
        {
          npcLine: "この書類、重くてね…。", npcExpression: "neutral",
          answers: [
            { text: "一段だけでも、持ちますよ。", type: "good", npcReply: "いいの？ ありがとう。では一番下の箱を。", npcExpression: "smile", explanation: "手を貸す申し出は、自然に距離を近づける。", nextHint: "実際に手伝った後も、一言交わすと良い。", weight: 10 },
            { text: "大変ですね。", type: "short", npcReply: "まあね…。", npcExpression: "neutral", explanation: "思いやりは伝わるが、行動にはならない。", nextHint: "手を貸す一言まで届くと更に良い。", weight: 10 },
            { text: "自分もコピーが多くて手挙げたら隙間ないです。", type: "bad", npcReply: "あ、そう…。うん、お互い大変だね。", npcExpression: "troubled", explanation: "話題を自分へ引き寄せるだけでは共感に届かない。", nextHint: "相手の状況に寄り添う一言が大切。", weight: 10 }
          ]
        },
        {
          npcLine: "うわ、ごめん。バランス崩した。", npcExpression: "neutral",
          answers: [
            { text: "大丈夫ですよ。つまずきませんでしたか？", type: "good", npcReply: "大丈夫、ありがとう。気づかってくれて。", npcExpression: "smile", explanation: "相手の安否を気づかうと、頼りやすい関係になる。", nextHint: "続けておしゃべりすると距離が縮む。", weight: 10 },
            { text: "気をつけてください。", type: "short", npcReply: "うん、そうする。", npcExpression: "neutral", explanation: "親切だが、会話はそこで止まりがち。", nextHint: "安否を尋ねると会話が続く。", weight: 10 },
            { text: "危ないですね。見てましたよ。", type: "bad", npcReply: "…助けてくれるかどうか、それよりどうなの？", npcExpression: "troubled", explanation: "行動を伴わない感想は、意図と逆効果に。", nextHint: "先に手を貸すのが一番。", weight: 10 }
          ]
        },
        {
          npcLine: "最近、残業が続いててね。", npcExpression: "neutral",
          answers: [
            { text: "自分の今週も忙しかったので、お互い無理しない程度にいきましょう。", type: "good", npcReply: "そうだね。お互い息抜きはしなきゃね。", npcExpression: "smile", explanation: "共感と自分の状況を合わせると、話は通じやすい。", nextHint: "息抜きの話題へ続けると自然に発展。", weight: 10 },
            { text: "大変ですね。", type: "short", npcReply: "まあね。", npcExpression: "neutral", explanation: "共感はするが、その先へは進みにくい。", nextHint: "自分の状況と重ねると話が広がる。", weight: 10 },
            { text: "うちの課も同じですよ。誰か辞めそうですし。", type: "bad", npcReply: "…ちょっとそれは。", npcExpression: "troubled", explanation: "社内の噂話は、慎重な相手を引かせる。", nextHint: "安全な話題に戻すのが無難。", weight: 10 }
          ]
        },
        {
          npcLine: "気をつけて帰ってね。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。山田さんも、お気をつけて。", type: "good", npcReply: "うん、また明日。", npcExpression: "smile", explanation: "相手の言葉を受け、同じ形で返すと好印象。", nextHint: "明日の約束を添えるとより良い。", weight: 10 },
            { text: "はい。", type: "short", npcReply: "うん。", npcExpression: "neutral", explanation: "簡潔で失礼はないが、気持ちは返りにくい。", nextHint: "「お気をつけて」と返すと自然。", weight: 10 },
            { text: "(返事をせず、急いで降りる)", type: "bad", npcReply: "…あれ？", npcExpression: "troubled", explanation: "別れ際の無反応は、相手の気遣いを無視しがち。", nextHint: "一言返してから向かうのが礼儀。", weight: 10 }
          ]
        }
      ]
    },

    /* ============ 食事・交流（6） ============ */
    {
      id: "scn_007", title: "パンのおすすめ", category: "food", npcId: "npc_konno", background: "dining",
      tags: ["food", "recommend"],
      context: "通いのパン屋で、今野さんに新商品をすすめられました。",
      rounds: [
        {
          npcLine: "おはよう！ 今日はね、新しく塩パン入ったんだよ！", npcExpression: "happy",
          answers: [
            { text: "いいですね。じゃあそれと、いつものミルクパンをください。", type: "good", npcReply: "はいよ！ もちもちでしょ？ ぜひ！", npcExpression: "happy", explanation: "すすめに乗りつつ、頼みごとを添えると自然。", nextHint: "味の感想が、店員との会話のネタになる。", weight: 10 },
            { text: "じゃあそれで。", type: "short", npcReply: "まいど！", npcExpression: "happy", explanation: "買い物としては成立するが笑顔は薄い。", nextHint: "「楽しみにしてます」を添えると良い。", weight: 10 },
            { text: "あー、塩パンは今いらないです。", type: "bad", npcReply: "はーい、じゃあいつもの……でいい？", npcExpression: "neutral", explanation: "すすめをきっぱり断ると、会話が途切れがち。", nextHint: "「また今度ね」と一言添えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "お仕事はどう？ 最近顔色がいいね。", npcExpression: "smile",
          answers: [
            { text: "運動を始めたので、ちょっと調子がいいんですよ。", type: "good", npcReply: "おー、いいね！ 私も気になってたんだ、運動。", npcExpression: "happy", explanation: "健康の話題は、このシーンで話しやすい話題。", nextHint: "具体的な運動を語ると相手も興味を持つ。", weight: 10 },
            { text: "まあ、ぼちぼちです。", type: "short", npcReply: "うん、それが一番だよ。", npcExpression: "neutral", explanation: "無難だが、相手との共通点は生まれない。", nextHint: "最近の変化を一言話すと続きやすい。", weight: 10 },
            { text: "仕事の話はやめましょうよ。", type: "bad", npcReply: "あ、ごめんごめん。", npcExpression: "troubled", explanation: "相手の気安さを拒むと、気軽な店の空気が止まる。", nextHint: "「仕事はひと段落しました」等と返すと滑らか。", weight: 10 }
          ]
        },
        {
          npcLine: "運動ってどこでしてるの？", npcExpression: "curious",
          answers: [
            { text: "駅から一駅ぶん歩きにして、会社まで通ってます。", type: "good", npcReply: "それなら私も始められそうだな！", npcExpression: "happy", explanation: "無理のない具体例は、相手にも取り入れやすい。", nextHint: "相手の「私も」に相乗りすると会話が弾む。", weight: 10 },
            { text: "近所で。", type: "short", npcReply: "へー、いいね。", npcExpression: "neutral", explanation: "答えにはなるが、その先が生まれない。", nextHint: "場所のヒントを出すと続く。", weight: 10 },
            { text: "ジムですけど、入会するなら紹介しますよ。", type: "bad", npcReply: "あー、それはちょっと今は…。", npcExpression: "neutral", explanation: "商談めいた返しは、気安さを壊しかける。", nextHint: "相手のペースを尊重するのが大切。", weight: 10 }
          ]
        },
        {
          npcLine: "また明日も来てね！", npcExpression: "happy",
          answers: [
            { text: "もちろんです。新しい常連になれると思います（笑）。", type: "good", npcReply: "ははっ、それ、こっちのセリフだから！", npcExpression: "happy", explanation: "店との関係を約束する言葉は、店主を喜ばせる。", nextHint: "次に来たとき顔を覚えてくれる。", weight: 10 },
            { text: "また来ます。", type: "short", npcReply: "うん、待ってるね！", npcExpression: "happy", explanation: "短くても、来店の約束は伝わる。", nextHint: "メニューの感想を添えられるとなお。", weight: 10 },
            { text: "お金が続けば来ますよ。", type: "bad", npcReply: "…え、あ、はは。どうぞ。", npcExpression: "troubled", explanation: "冗談が空回りすると、店の雰囲気にひびく。", nextHint: "「おいしいから」と言えると最高。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_008", title: "朝の会話", category: "food", npcId: "npc_konno", background: "dining",
      tags: ["food", "morning"],
      context: "朝のパン屋で、今野さんが話しかけてきました。",
      rounds: [
        {
          npcLine: "今日は寒いね。ホットミルクとかどう？", npcExpression: "smile",
          answers: [
            { text: "いいですね。体が温まりそうです。お願いします。", type: "good", npcReply: "よし、すぐ作るね！ 最近さむいもんね。", npcExpression: "happy", explanation: "相手の気遣いを受け取ると、会話は温まる。", nextHint: "また寒さの話題で続けやすい。", weight: 10 },
            { text: "じゃあ、それで。", type: "short", npcReply: "はーい。", npcExpression: "smile", explanation: "注文は通るが、やりとりは短く終わる。", nextHint: "「ありがとう」を添えると好印象。", weight: 10 },
            { text: "いらないです。黒糖のパンはありますか。", type: "bad", npcReply: "…黒糖は明日入るかな。冷たいねぇ。", npcExpression: "neutral", explanation: "すすめを即座に無視すると、相手は肩すかし。", nextHint: "気遣いには一度反応してから頼もう。", weight: 10 }
          ]
        },
        {
          npcLine: "黒糖のパンかー。黒糖って好きなの？", npcExpression: "curious",
          answers: [
            { text: "小さい頃から、黒糖のお菓子が大好きなんです。", type: "good", npcReply: "わかるー！ 懐かしい味だよね。", npcExpression: "happy", explanation: "子供の頃の話は、人とつながりやすい話題。", nextHint: "相手の思い出話へスライドしやすい。", weight: 10 },
            { text: "なんとなくです。", type: "short", npcReply: "そっか。じゃあ、明日楽しみにしてて。", npcExpression: "smile", explanation: "理由がない返しは、会話が伸びにくい。", nextHint: "「懐かしい味だから」と続けやすい。", weight: 10 },
            { text: "黒糖はカロリー高いんでしょ？", type: "bad", npcReply: "…え、いや、でも美味しいですよ？", npcExpression: "troubled", explanation: "楽しみを即否定すると、シーンを暗くする。", nextHint: "楽しみを共有する言葉に変えよう。", weight: 10 }
          ]
        },
        {
          npcLine: "私も黒糖ラテ、好きでさ。", npcExpression: "happy",
          answers: [
            { text: "黒糖ラテってあるんですか？ それ、明日のおすすめにしますね。", type: "good", npcReply: "おー、賢い！ じゃあメニューに載せるね。", npcExpression: "happy", explanation: "相手の話を形にすると、強い信頼になる。", nextHint: "実現されたら、お祝いを言えると最高。", weight: 10 },
            { text: "いいですね。", type: "short", npcReply: "でしょ？", npcExpression: "smile", explanation: "同意はするが、賛同がこちらから出ない。", nextHint: "「飲んでみたい」と言うと続く。", weight: 10 },
            { text: "店長のセンス、変わってますね。", type: "bad", npcReply: "…はっは、そうかも。", npcExpression: "neutral", explanation: "冗談でも空気を悪くしかねない。", nextHint: "話題の中身に触れるのが無難。", weight: 10 }
          ]
        },
        {
          npcLine: "また明日、黒糖パンとラテ楽しみにしてるね！", npcExpression: "happy",
          answers: [
            { text: "はい、明日も来ます。そのときはホットでお願いします。", type: "good", npcReply: "オッケー！ そのつもりで仕込んでおくね。", npcExpression: "happy", explanation: "来店の予約と注文の希望を一言添えると温かい。", nextHint: "常連化すると、店のやりとりが楽しくなる。", weight: 10 },
            { text: "また明日。", type: "short", npcReply: "うん、待ってるね！", npcExpression: "smile", explanation: "短いが自然な来店の約束。", nextHint: "注文の希望を添えると印象に残る。", weight: 10 },
            { text: "明日は他の店にしようかな。", type: "bad", npcReply: "あ、そ、そう？ …じゃあね。", npcExpression: "troubled", explanation: "直前の楽しみを削ぐ引きは、相手を落とす。", nextHint: "「気が向いたら来る」でも声の調子で変わる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_009", title: "栄養バランス", category: "food", npcId: "npc_hanada", background: "dining",
      tags: ["food", "health"],
      context: "食堂で、花田さんが食事のバランスを気にしてくれました。",
      rounds: [
        {
          npcLine: "今日は野菜が少ないね。キャベツ、足しとく？", npcExpression: "warm",
          answers: [
            { text: "ありがとうございます。お願いします、元気が出ます。", type: "good", npcReply: "いいねー。じゃあ大盛りで行こう。", npcExpression: "happy", explanation: "気遣いを喜んで受け取ると、世話好きは嬉しい。", nextHint: "食事の感想を言うと続きやすい。", weight: 10 },
            { text: "じゃあお願いします。", type: "short", npcReply: "はーい。", npcExpression: "smile", explanation: "自然な受け取り。感謝は言葉にしない。", nextHint: "「ありがとう」を言うと更に柔らかく。", weight: 10 },
            { text: "時間がないんで早くしてください。", type: "bad", npcReply: "あ、うん…。急いでどうぞ。", npcExpression: "neutral", explanation: "気遣いへの返しとしては、慌ただしさが出る。", nextHint: "「ありがとう、あとでいただく」でも良い。", weight: 10 }
          ]
        },
        {
          npcLine: "今日は残業だったの？ 目が寝てるよ。", npcExpression: "warm",
          answers: [
            { text: "当たりです。でも、ここに来ると元気になるので。", type: "good", npcReply: "そう言われると、こっちも元気になるよ！", npcExpression: "happy", explanation: "店の存在を褒める言葉は、店主を喜ばせる。", nextHint: "メニューの具体的な感想を言うと更に良い。", weight: 10 },
            { text: "まあ、ね。", type: "short", npcReply: "おつかれさま。早く食べて帰ろう。", npcExpression: "smile", explanation: "共感は得られるが、会話は終わってしまう。", nextHint: "頑張りを認めてもらう一言を返すと良い。", weight: 10 },
            { text: "そんなにわかりやすいですか？ 鏡見せてください。", type: "bad", npcReply: "…あら、冗談よ。早く食べなさい。", npcExpression: "neutral", explanation: "お節介を防御すると、親しみが冷める。", nextHint: "冗談として受け流すと空気が戻る。", weight: 10 }
          ]
        },
        {
          npcLine: "ちゃんとタンパク質取ってる？ 若いのに甘い物ばっか。", npcExpression: "warm",
          answers: [
            { text: "最近、卵と豆腐は毎日取るようにしてますよ。", type: "good", npcReply: "おー、えらい！ じゃあ今日はタマゴスープにしよう。", npcExpression: "happy", explanation: "健康習慣を語ると、世話好きな店主は満足。", nextHint: "具体的な習慣が評価の材料になる。", weight: 10 },
            { text: "まあ、適当に。", type: "short", npcReply: "もう、適当じゃダメよ。", npcExpression: "neutral", explanation: "謙遜に取れるが、心配もされる返し。", nextHint: "「少し意識してます」等を添えると安心。", weight: 10 },
            { text: "甘い物が悪いんですか？", type: "bad", npcReply: "…そうじゃないんだけどね。", npcExpression: "neutral", explanation: "反論調は、相談ではなくなってしまう。", nextHint: "話を飲んでから感想を言おう。", weight: 10 }
          ]
        },
        {
          npcLine: "ごちそうさまの時に、笑顔を見せてくれると嬉しいよ。", npcExpression: "warm",
          answers: [
            { text: "ごちそうさまでした！ 今日もおいしかったです、また来ます。", type: "good", npcReply: "うんうん、また来てね！ 待ってるよ。", npcExpression: "happy", explanation: "笑顔と労いは、どんなお店にも通じる万能な一言。", nextHint: "常連交流の第一歩になる。", weight: 10 },
            { text: "ごちそうさまでした。", type: "short", npcReply: "はい、またね。", npcExpression: "smile", explanation: "礼儀は十分だが、声のトーンで変わる。", nextHint: "「おいしかった」を添えると更に好印象。", weight: 10 },
            { text: "(食べてそのまま無言で立つ)", type: "bad", npcReply: "…あら。まあ、いいわ。", npcExpression: "neutral", explanation: "無言の退店は、店主に残念な印象を残す。", nextHint: "一句でも声をかけてから去ろう。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_010", title: "残業が続く日", category: "food", npcId: "npc_hanada", background: "dining",
      tags: ["food", "sympathy"],
      context: "残業続きで食欲が細くなっている日に、花田さんが話しかけました。",
      rounds: [
        {
          npcLine: "最近量を残してるね。大丈夫？", npcExpression: "warm",
          answers: [
            { text: "気づかってくれてありがとうございます。ちょっと疲れが溜まってて。", type: "good", npcReply: "そっか。じゃあ今日は、あっさりの生姜スープにしようか。", npcExpression: "warm", explanation: "状態を正直に伝えると、相手は最適な動きができる。", nextHint: "食欲がない日の話題は相手が歩み寄る。", weight: 10 },
            { text: "大丈夫です。", type: "short", npcReply: "そっか…、無理しないでね。", npcExpression: "warm", explanation: "頑張ってる様子を打ち消すと、心配は続く。", nextHint: "「少し疲れてて」と添えると安心される。", weight: 10 },
            { text: "気にしないでください。", type: "bad", npcReply: "…うん。まあ、好きにして。", npcExpression: "neutral", explanation: "好意を遮断すると、気遣いの糸口を断つ。", nextHint: "相手の好意を一度受け取ろう。", weight: 10 }
          ]
        },
        {
          npcLine: "仕事、落ち着かないの？", npcExpression: "warm",
          answers: [
            { text: "来週の締め切りが迫ってて、ちょっと止まらない…。でもこのスープで元気出ます。", type: "good", npcReply: "そうだね、温まるんでしょ？ 締切、がんばって。", npcExpression: "happy", explanation: "愚痴を言いすぎず、店の力で回復を語ると好印象。", nextHint: "締切後の話をすると未来へ向かう。", weight: 10 },
            { text: "なんとかしてます。", type: "short", npcReply: "がんばってるね。", npcExpression: "warm", explanation: "無難だが、疲れは隠れがちになる。", nextHint: "具体的な締切を言うと共感しやすい。", weight: 10 },
            { text: "仕事が全部嫌です。", type: "bad", npcReply: "…そ、そう。大変だね。", npcExpression: "neutral", explanation: "愚痴をため込むと、相手も返しに困る。", nextHint: "小さな悩みから出して共有するのが良い。", weight: 10 }
          ]
        },
        {
          npcLine: "甘い物、食べる？ あんこなら少し。", npcExpression: "warm",
          answers: [
            { text: "あんこ、大好きです。少しだけ、いただきます。", type: "good", npcReply: "よし、じゃあ小さめのを出すね。", npcExpression: "happy", explanation: "おすすめを喜んで受けると、店主も喜ぶ。", nextHint: "「少しだけ」の付き合い方が学べる。", weight: 10 },
            { text: "それでいいです。", type: "short", npcReply: "はいよ。", npcExpression: "smile", explanation: "気遣いは受けるが、喜びは伝わらない。", nextHint: "「小さめで」等の希望を言うと良い。", weight: 10 },
            { text: "あんこよりチョコのほうが好きなので。", type: "bad", npcReply: "…あら、そう。じゃあね。", npcExpression: "neutral", explanation: "差し出しを否定すると、次から出しにくくなる。", nextHint: "「ありがとう、でも今日は」が丁寧。", weight: 10 }
          ]
        },
        {
          npcLine: "体を休めるのが一番よ。今日は早く帰ってね。", npcExpression: "warm",
          answers: [
            { text: "そうします。今日はこれから散歩して帰ろうと思います。", type: "good", npcReply: "いいね、散歩は心にもいいよ。おやすみ。", npcExpression: "happy", explanation: "健康習慣を語ると、気づかいを形にできる。", nextHint: "翌日「おかげで元気」と言えると温かい。", weight: 10 },
            { text: "早く帰ります。", type: "short", npcReply: "うん、おつかれさま。", npcExpression: "smile", explanation: "受け取りは良いが、その先がない。", nextHint: "「散歩してな」等、明日の行動を言うと良い。", weight: 10 },
            { text: "おばあちゃんみたいなこと言われても、やることがあって…。", type: "bad", npcReply: "…はぁ。まあ、勝手にしなさい。", npcExpression: "neutral", explanation: "年長扱いは、親切な相手を傷つける。", nextHint: "気遣いにまず感謝しよう。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_011", title: "昼ごはんの誘い", category: "food", npcId: "npc_kato", background: "dining",
      tags: ["food", "invite"],
      context: "お昼に、加藤さんが一緒にごはんを食べようと誘ってきました。",
      rounds: [
        {
          npcLine: "腹減ってない？ 新しくできたラーメン屋、行ってみない？", npcExpression: "humorous",
          answers: [
            { text: "行きたいです！ ラーメンは何系ですか？", type: "good", npcReply: "あっさり系らしいぞ。気になる！", npcExpression: "happy", explanation: "誘いに乗り、興味の詳細を聞く自然な流れ。", nextHint: "どんな店か予習すると会話が弾む。", weight: 10 },
            { text: "いいですね。", type: "short", npcReply: "よし、決まり！ 一緒に行こう。", npcExpression: "happy", explanation: "誘いに乗ることは決まるが、ノリは薄い。", nextHint: "注文の相談をすると話が広がる。", weight: 10 },
            { text: "ラーメンは最近控えてて…。", type: "bad", npcReply: "そっかー。じゃあまた今度な！", npcExpression: "neutral", explanation: "申し出を切ると、誘いは一回で終わる。", nextHint: "「次は別ので」と対案を出すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "え、お昼どうする？ 俺はカレー気分。", npcExpression: "humorous",
          answers: [
            { text: "あー、カレーもいいな。でも、今日は軽めにそばにしようかな。", type: "good", npcReply: "お、そばもありだな。じゃあそばにしよ！ 決まり。", npcExpression: "happy", explanation: "希望を伝えつつ一緒に行く姿勢は丸く収まりやすい。", nextHint: "選択に相手を巻き込むとスムーズ。", weight: 10 },
            { text: "なんでもいいです。", type: "short", npcReply: "なんでもかー。じゃあカレーで。", npcExpression: "neutral", explanation: "決めやすさはあるが、こだわりは見せない。", nextHint: "希望を言うと店選びが楽になる。", weight: 10 },
            { text: "お昼はいいや。", type: "bad", npcReply: "そっか。じゃあ先にいくわ。", npcExpression: "neutral", explanation: "促しを断ると、一緒にいる儀が減る。", nextHint: "「今日は抜き」でも理由があると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "午後も会議で疲れそうだな。", npcExpression: "humorous",
          answers: [
            { text: "わかります、お昼にしっかり食べて午後は乗り切りましょう。", type: "good", npcReply: "そうだな。午後は腕立てするわ（冗談）。", npcExpression: "happy", explanation: "相手の冗談に笑って返すと、ノリが合う印象に。", nextHint: "冗談に軽く返すと場が温まる。", weight: 10 },
            { text: "頑張りましょう。", type: "short", npcReply: "おう。", npcExpression: "neutral", explanation: "励ましにはなるが、会話は軽く流れる。", nextHint: "「お茶でも挟もう」等を添えると良い。", weight: 10 },
            { text: "会議って時間の無駄ですよね。", type: "bad", npcReply: "おいおい、若手がそんなこと言ったらダメだぞ。", npcExpression: "neutral", explanation: "職場の価値観を否定すると、冗談でも冷める。", nextHint: "前向きな一言に変えるのが無難。", weight: 10 }
          ]
        },
        {
          npcLine: "またお昼、誘うね。", npcExpression: "humorous",
          answers: [
            { text: "ぜひ！ 次は俺がランチスポット見つけますね。", type: "good", npcReply: "お、頼もしい！ 楽しみにしてる。", npcExpression: "happy", explanation: "次を自分から提案すると、関係が続きやすい。", nextHint: "実際に見つけると信頼レベルが上がる。", weight: 10 },
            { text: "また誘ってください。", type: "short", npcReply: "おう、任せろ。", npcExpression: "smile", explanation: "誘い待ちの姿勢は自然だが受動的。", nextHint: "「そのときは◯◯がいい」も添えよう。", weight: 10 },
            { text: "じゃあその時、奢ってくださいよ。", type: "bad", npcReply: "…え、えーっと、はは。", npcExpression: "neutral", explanation: "冗談でも要求を出すと、相手は困る。", nextHint: "冗談でも「ごちそうさま」に変えよう。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_012", title: "休日の趣味談義", category: "food", npcId: "npc_nakamura", background: "dining",
      tags: ["food", "hobby"],
      context: "休日の話をしていて、中村さんの意外な趣味を知りました。",
      rounds: [
        {
          npcLine: "休みの日、なにしてる？ 俺は最近カメラだよ。", npcExpression: "curious",
          answers: [
            { text: "え、カメラやってるんですか？ どんな写真を撮ってるんですか？", type: "good", npcReply: "朝の公園の風景が多いかな。光がとてもきれいで。", npcExpression: "happy", explanation: "相手の話に具体的な質問を重ねると、どんどん伸びる。", nextHint: "写真を見せてもらうと一段深まる。", weight: 10 },
            { text: "へー、いいですね。", type: "short", npcReply: "まあ、自己満足だけどね。", npcExpression: "neutral", explanation: "感心は伝わるが、追及がないと途切れる。", nextHint: "「どんな？」と続けると良い。", weight: 10 },
            { text: "カメラはお金かかりそうですよね。", type: "bad", npcReply: "…まあ、それはそうだけど。", npcExpression: "neutral", explanation: "相手の趣味を費用面でくじくと、気まずい。", nextHint: "興味の方向で応じるのが上手。", weight: 10 }
          ]
        },
        {
          npcLine: "俺は散歩がてらに撮ってるんだ。", npcExpression: "curious",
          answers: [
            { text: "散歩もカメラも、自分のペースで進められるのがいいですよね。", type: "good", npcReply: "そうそう、そこいいんだよ！ わかってる。", npcExpression: "happy", explanation: "共感の根拠を自分の言葉で言えると強い。", nextHint: "自分も散歩する話題と重ねると自然。", weight: 10 },
            { text: "いいですね。", type: "short", npcReply: "ね！", npcExpression: "happy", explanation: "一致はするが、その理由まで進まない。", nextHint: "「のんびりできそう」と重ねると和む。", weight: 10 },
            { text: "俺は効率重視なんで。", type: "bad", npcReply: "…あ、そうなんだ。", npcExpression: "neutral", explanation: "相手の楽しみを引く比較は、雑談を閉じる。", nextHint: "比較ではなく共鳴から入ろう。", weight: 10 }
          ]
        },
        {
          npcLine: "近所にいいスポットがあるから、今度見に行く？", npcExpression: "curious",
          answers: [
            { text: "見てみたいです。いつでも声をかけてください。", type: "good", npcReply: "よし、今度の土曜の朝はどう？", npcExpression: "happy", explanation: "誘いを受けて日程を誘導すると、話は進む。", nextHint: "日程に合う一言を返すと即実現に。", weight: 10 },
            { text: "考えます。", type: "short", npcReply: "うん、急がなくていいよ。", npcExpression: "neutral", explanation: "曖昧な返事は、相手は本当に来るか迷う。", nextHint: "「土曜なら」等と日を返そう。", weight: 10 },
            { text: "写真には興味ないんで。", type: "bad", npcReply: "…あ、そう。じゃあいいか。", npcExpression: "neutral", explanation: "「見る」と「撮る」は別物なのに、断って閉じる。", nextHint: "散歩としての話題に変えられると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ土曜の朝、駅前の公園で待ち合わせね。", npcExpression: "curious",
          answers: [
            { text: "了解です。朝の光の写真、楽しみにしてます。", type: "good", npcReply: "いいね、それ、ぜひ見せてあげる。", npcExpression: "happy", explanation: "約束を楽しみにしていると伝えると、相手も楽しみになる。", nextHint: "当日の写真リベンジは次回の話に。", weight: 10 },
            { text: "わかりました。", type: "short", npcReply: "じゃあな。", npcExpression: "neutral", explanation: "約束は成立するが、期待が伝わらない。", nextHint: "「楽しみに」一言が離れない縁に。", weight: 10 },
            { text: "朝は起きられないかもです。", type: "bad", npcReply: "…じゃあ、また今度改めて。", npcExpression: "neutral", explanation: "先にハードルを出してしまうと、誘いが消える。", nextHint: "「朝なら◯時なら」等、妥協点を出すと良い。", weight: 10 }
          ]
        }
      ]
    },

    /* ============ 日常（8） ============ */
    {
      id: "scn_013", title: "朝のあいさつ", category: "daily", npcId: "npc_suzuki", background: "outdoor",
      tags: ["daily", "greeting"],
      context: "朝、家の前で鈴木さんと会いました。",
      rounds: [
        {
          npcLine: "（おずおず）あ、おはようございます。", npcExpression: "shy",
          answers: [
            { text: "おはようございます。いい朝ですね、今日もよろしくお願いします。", type: "good", npcReply: "え、ええ…。こちらこそ。", npcExpression: "shy", explanation: "あいさつに一言添えると、人見知りの相手も返しやすい。", nextHint: "何日か続けると、目が合うようになる。", weight: 10 },
            { text: "おはようございます。", type: "short", npcReply: "おはようございます。", npcExpression: "shy", explanation: "最短のあいさつ。人見知りには負担が少ない。", nextHint: "返事が続けば次も続けやすい。", weight: 10 },
            { text: "（無言で通り過ぎる）", type: "bad", npcReply: "（下を向く）…。", npcExpression: "troubled", explanation: "無言のすれ違いは、相手の心の距離を広げる。", nextHint: "うなずくだけでも伝わる。", weight: 10 }
          ]
        },
        {
          npcLine: "（小さく）今日も、いってらっしゃい。", npcExpression: "shy",
          answers: [
            { text: "ありがとうございます。いってきます！ 鈴木さんも気をつけて。", type: "good", npcReply: "は、はい…。ありがとう。", npcExpression: "shy", explanation: "相手の言葉を返しつつ気遣いを添えると、近い関係に。", nextHint: "名前を呼ぶだけでも親しみが増す。", weight: 10 },
            { text: "いってきます。", type: "short", npcReply: "いってらっしゃい…。", npcExpression: "shy", explanation: "自然な応酬だが、それ以上は広がらない。", nextHint: "「ありがとう」を添えると心が開く。", weight: 10 },
            { text: "（足早に去る）", type: "bad", npcReply: "（うつむく）…。", npcExpression: "troubled", explanation: "せっかくの声かけを無視すると、翌日以降も嫌う。", nextHint: "ふり返ってうなずくだけで良い。", weight: 10 }
          ]
        },
        {
          npcLine: "今日は、お天気いいですね。", npcExpression: "shy",
          answers: [
            { text: "そうですね。洗濯物が乾きそうです。鈴木さんは今日はお休みですか？", type: "good", npcReply: "ええ…。庭の手入れをしようかと。", npcExpression: "shy", explanation: "天気の話を膨らまして相手の情報を聞くと、会話が活きる。", nextHint: "庭の話になると、住人同士の会話が育つ。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "…はい。", npcExpression: "shy", explanation: "普通の相づち。途切れやすい。", nextHint: "「乾きますね」と自分から足すと良い。", weight: 10 },
            { text: "晴れても降っても、仕事は一緒ですよ。", type: "bad", npcReply: "（小さく）…そう、ですね。", npcExpression: "troubled", explanation: "気の利いた一人負けの一言は、相手を黙らせる。", nextHint: "一緒に気持ちのいい話を重ねよう。", weight: 10 }
          ]
        },
        {
          npcLine: "また、明日も…。よろしくお願いします。", npcExpression: "shy",
          answers: [
            { text: "こちらこそよろしくお願いします。今日声をかけられて、うれしかったです。", type: "good", npcReply: "えっ…？ そ、そうですか？ ふふ。", npcExpression: "shy", explanation: "相手の行動への評価を言葉にすると、信頼の土台になる。", nextHint: "ひと言の感謝で関係が続きやすくなる。", weight: 10 },
            { text: "また明日。", type: "short", npcReply: "はい、また明日。", npcExpression: "shy", explanation: "十分な距離感のあいさつ。", nextHint: "「また聞かせてね」でも良い。", weight: 10 },
            { text: "（何も言わないで入る）", type: "bad", npcReply: "（小さくため息）…。", npcExpression: "troubled", explanation: "相手の勇気を返さないと、関係は後戻りしやすい。", nextHint: "一言で閉じる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_014", title: "ゴミ出しの日", category: "daily", npcId: "npc_suzuki", background: "outdoor",
      tags: ["daily", "neighbor"],
      context: "ゴミ出しの日に、鈴木さんとすれ違いました。",
      rounds: [
        {
          npcLine: "あ、今日は燃えるゴミの日でしたよね…？", npcExpression: "shy",
          answers: [
            { text: "そうですよ、ちょうど出してきたところです。鈴木さんのも出ますか？", type: "good", npcReply: "え、あ…。じゃあ今、出してきます。", npcExpression: "shy", explanation: "情報を提供し、相手の行動を助けると感謝される。", nextHint: "「お互いさまで」を添えると柔らかく。", weight: 10 },
            { text: "そうです。", type: "short", npcReply: "よかった…。ありがとうございます。", npcExpression: "shy", explanation: "最短で助けにはなるが、会話はそこで止まる。", nextHint: "「よかった」を返してあげると和む。", weight: 10 },
            { text: "（知ってるくせに）そうですね。", type: "bad", npcReply: "…。そ、そうですか。", npcExpression: "troubled", explanation: "棘のある返しは、親切な相手から信頼を失う。", nextHint: "普通に教えてあげるのが一番。", weight: 10 }
          ]
        },
        {
          npcLine: "いつもゴミ、ちゃんと出されてて、きれいですよね。", npcExpression: "shy",
          answers: [
            { text: "ありがとうございます。鈴木さんのおかげで教えてもらいました。", type: "good", npcReply: "わ、私なんか…。でも、うれしいです。", npcExpression: "shy", explanation: "相手の言葉に乗って感謝を返すと、垣根が低くなる。", nextHint: "お互いが褒め合う良い関係ができる。", weight: 10 },
            { text: "そうですか。", type: "short", npcReply: "はい…。", npcExpression: "shy", explanation: "褒められても控えめに流すと、距離は縮まらない。", nextHint: "「ありがとう」を返すと変わる。", weight: 10 },
            { text: "そんなに褒められて、照れますね。", type: "bad", npcReply: "（赤くなる）あ、は、はい…。", npcExpression: "troubled", explanation: "からかい調は、人見知りの相手には辛い。", nextHint: "素直に受け取ろう。", weight: 10 }
          ]
        },
        {
          npcLine: "今日は、お仕事、行かれますか？", npcExpression: "shy",
          answers: [
            { text: "はい、これから出ます。鈴木さんは今日はお休みですか？", type: "good", npcReply: "はい。今日は病院に検査に…。", npcExpression: "shy", explanation: "お互いの予定を聞くと、生活の輪郭が見える。", nextHint: "体調を気づかわれると、近い縁に。", weight: 10 },
            { text: "行きます。", type: "short", npcReply: "お気をつけて。", npcExpression: "shy", explanation: "自然な短い返し。深掘りはされにくい。", nextHint: "「あなたは？」を添えると続く。", weight: 10 },
            { text: "まあ、仕事は行きますよ。行かなきゃ金にならないので。", type: "bad", npcReply: "…そう、ですね。", npcExpression: "troubled", explanation: "私生活の愚痴は、人見知りの相手を怯えさせがち。", nextHint: "元気な一言が無難。", weight: 10 }
          ]
        },
        {
          npcLine: "（少し勇気を出して）また、お話しできたら、うれしいです。", npcExpression: "shy",
          answers: [
            { text: "私もです。朝、会ったら、ぜひ声をかけてください。", type: "good", npcReply: "ぜ、ぜひ…！ お願いします。", npcExpression: "shy", explanation: "相手の勇気を生かす約束をすると、人間関係が育つ。", nextHint: "これが近所の良い縁の始まりになる。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "…はい。", npcExpression: "shy", explanation: "受け入れはするが、相手は勇気の見返りが薄い。", nextHint: "「ぜひ」を返すと相手の背中を押す。", weight: 10 },
            { text: "（あいまいに笑って去る）", type: "bad", npcReply: "（肩を落とす）…はい。", npcExpression: "troubled", explanation: "大勢に流される曖昧さは、人見知りを傷つける。", nextHint: "短くても「ぜひ」が効く。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_015", title: "天気の話", category: "daily", npcId: "npc_suzuki", background: "outdoor",
      tags: ["daily", "weather"],
      context: "出かけようとしたら、空模様を心配する鈴木さんと会いました。",
      rounds: [
        {
          npcLine: "雨、降りそうですね…。傘、持っていかれますか？", npcExpression: "shy",
          answers: [
            { text: "あ、確かに。ありがとうございます、じゃあ折りたたみを持っていきます。", type: "good", npcReply: "よかったです。気を付けて行ってらっしゃい。", npcExpression: "shy", explanation: "相手の指摘を活かして行動に移すと、気遣いが報われる。", nextHint: "帰りは「おかげで」と言える関係に。", weight: 10 },
            { text: "持っていきます。", type: "short", npcReply: "はい。よかった。", npcExpression: "shy", explanation: "事情の受容。しかし感謝は薄い。", nextHint: "「助かりました」を添えると答える。", weight: 10 },
            { text: "大丈夫です、走れば。", type: "bad", npcReply: "そ、そうですか…。お気をつけて。", npcExpression: "troubled", explanation: "気遣いを軽く流すと、次から出しにくくなる。", nextHint: "「ありがとう」を一度残すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "夕方にはやみそう…と、ニュースで言ってました。", npcExpression: "shy",
          answers: [
            { text: "ありがとうございます。それなら夜の散歩はやめとこう…。楽しみにしていたので、残念ですが。", type: "good", npcReply: "また、晴れた日に…。一緒に歩けますと、嬉しいです。", npcExpression: "shy", explanation: "自分の予定を共有すると、相手も合わせられる。", nextHint: "晴れの日に声をかけあう約束に発展できる。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "はい…。", npcExpression: "shy", explanation: "相づちで止まる。情報は受け取るだけに。", nextHint: "「散歩してるの？」と続けると良い。", weight: 10 },
            { text: "天気予報って当たりませんよね。", type: "bad", npcReply: "…え、あ…。そうでしたね。", npcExpression: "troubled", explanation: "相手の情報を否定すると、会話の芽を摘む。", nextHint: "「参考にします」が安全。", weight: 10 }
          ]
        },
        {
          npcLine: "この辺りは、朝散歩してる人が多いんですよ。", npcExpression: "shy",
          answers: [
            { text: "そうなんですか。私も最近、歩くのを始めたところなんです。", type: "good", npcReply: "え、じゃあ…。よかったら、明日の朝、ご一緒に…。", npcExpression: "shy", explanation: "自分の話と相手の話を重ねると、同じ趣味が見つかる。", nextHint: "散歩仲間の約束へと発展しやすい。", weight: 10 },
            { text: "へー。", type: "short", npcReply: "…はい。", npcExpression: "shy", explanation: "気のない相づちは、相手の熱意を冷ます。", nextHint: "「いいですね」を添えると続く。", weight: 10 },
            { text: "散歩なんて、時間の無駄ですよ。", type: "bad", npcReply: "（声が出ない）…。", npcExpression: "troubled", explanation: "相手の楽しみを否定すると、信頼が揺らぐ。", nextHint: "無理に否定しないのが健康。", weight: 10 }
          ]
        },
        {
          npcLine: "あの…。本当は、話すの、苦手なんです。でも、少し話せて、うれしいです。", npcExpression: "shy",
          answers: [
            { text: "私も、鈴木さんと話せてうれしいですよ。同じくらい、少し緊張してます。", type: "good", npcReply: "え…。同じなんですね。ふふ。", npcExpression: "shy", explanation: "相手の弱点に自分を重ねることで、対等な関係に。", nextHint: "緊張がとけると、会話の質が上がる。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "はい…。", npcExpression: "shy", explanation: "理解は伝わるが、返す言葉は不足気味。", nextHint: "「私も」が最強の返し。", weight: 10 },
            { text: "苦手なのに話してるんですか？", type: "bad", npcReply: "…すみません。", npcExpression: "troubled", explanation: "勇気を出した告白を問い詰めると、心が閉じる。", nextHint: "「話してくれてうれしい」と返そう。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_016", title: "花壇の話", category: "daily", npcId: "npc_suzuki", background: "outdoor",
      tags: ["daily", "flower"],
      context: "鈴木さんの家の前にある花壇を見て、声をかけました。",
      rounds: [
        {
          npcLine: "花、きれいですね…。", npcExpression: "shy",
          answers: [
            { text: "ほんとですね。この橙色の花、名前は何ていうんですか？", type: "good", npcReply: "マリーゴールド…。真夏は強いんです。", npcExpression: "shy", explanation: "具体的な質問は、相手の好きな話題を開く。", nextHint: "花の話に興味が出ると会話が続く。", weight: 10 },
            { text: "きれいですね。", type: "short", npcReply: "はい…。", npcExpression: "shy", explanation: "感想は通じるが、その先へは進めない。", nextHint: "「何ていう花？」が入り口になる。", weight: 10 },
            { text: "近所の手入れがいいからですね。", type: "bad", npcReply: "（小声で）…手入れしてるのは、私なんですけど。", npcExpression: "troubled", explanation: "他人任せの褒め言葉は、当事者を落ち込ませる。", nextHint: "相手の苦労をねぎらおう。", weight: 10 }
          ]
        },
        {
          npcLine: "毎日、水をやってるんです…。", npcExpression: "shy",
          answers: [
            { text: "毎日ですか、すごいですね。雨の日も？", type: "good", npcReply: "雨の日はいいかなって思って、休んじゃいます…。", npcExpression: "shy", explanation: "相手の努力に具体的に敬意を払うと、心を開きやすい。", nextHint: "「おかげで」と言える関係に。", weight: 10 },
            { text: "大変ですね。", type: "short", npcReply: "…慣れました。", npcExpression: "shy", explanation: "大変さは伝わるが、作業としてしか見られない。", nextHint: "「きれいだよ」を添えると喜ぶ。", weight: 10 },
            { text: "水やり、好きなんですか？", type: "bad", npcReply: "…好き、ですか？ うーん。", npcExpression: "troubled", explanation: "答えにくい質問は、相手を詰まらせる。", nextHint: "見た目を褒めてあげよう。", weight: 10 }
          ]
        },
        {
          npcLine: "花が咲くと、なんか、うれしくて。", npcExpression: "shy",
          answers: [
            { text: "わかります。育てた花が咲くのは、たまりませんよね。", type: "good", npcReply: "そうですよね！（にこっと）", npcExpression: "happy", explanation: "相手の気持ちに共鳴すると、花の話がより深く続く。", nextHint: "共通の喜びが見つかる。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "…はい。", npcExpression: "shy", explanation: "共感はするが、感情の返しは薄い。", nextHint: "「うれしさ」を形にする言葉が良い。", weight: 10 },
            { text: "咲かなかったら、悲しいですよね。", type: "bad", npcReply: "…まあ、それも。", npcExpression: "troubled", explanation: "喜びを打ち消す返しは、相手の気分を曇らせる。", nextHint: "今咲いている喜びを大切に。", weight: 10 }
          ]
        },
        {
          npcLine: "よかったら…。この花、一輪、持って帰って？", npcExpression: "shy",
          answers: [
            { text: "いただけますか？ 大事に飾ります。ありがとうございます。", type: "good", npcReply: "本当？ …うれしい。", npcExpression: "happy", explanation: "相手の差し出しを喜んで受けると、心の距離が近くなる。", nextHint: "部屋に飾る喜びを伝えると更に。", weight: 10 },
            { text: "じゃあ、一輪だけ。", type: "short", npcReply: "はい…。どうぞ。", npcExpression: "shy", explanation: "受け取りはするが、喜びがあまり伝わらない。", nextHint: "「きれい」と一言添えると変わる。", weight: 10 },
            { text: "花瓶、ないんで。", type: "bad", npcReply: "あ…。じゃあ、いいです。", npcExpression: "troubled", explanation: "断りやすさも大事だが、一度は受け取る心遣いが欲しい。", nextHint: "「でも水だけでも」等、別の受け方を。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_017", title: "帰り道の話", category: "daily", npcId: "npc_kato", background: "outdoor",
      tags: ["daily", "chit-chat"],
      context: "仕事帰りに加藤さんと一緒の帰り道になりました。",
      rounds: [
        {
          npcLine: "お疲れー！ 今日は早いな。", npcExpression: "humorous",
          answers: [
            { text: "お疲れさまです！ 早く上がれて、ちょっとうれしいです。", type: "good", npcReply: "そうだろ？ 俺も今日は早いんだ。", npcExpression: "happy", explanation: "気軽な話題に自分の気持ちを重ねると、同じ方向を向ける。", nextHint: "「何食べた？」等へ自然に続く。", weight: 10 },
            { text: "お疲れさまです。", type: "short", npcReply: "おう。", npcExpression: "neutral", explanation: "労いの返しとしては成立。深くは伸びない。", nextHint: "「早いでしょ？」と話題を出すと良い。", weight: 10 },
            { text: "早いって、あなたは何時なの？", type: "bad", npcReply: "…あ、はは。まあね。", npcExpression: "neutral", explanation: "詰められると、気軽なノリが軽はずみになる。", nextHint: "まずは話に乗ろう。", weight: 10 }
          ]
        },
        {
          npcLine: "今日仕事、どうだった？", npcExpression: "humorous",
          answers: [
            { text: "まあまあでしたよ。午後の会議で自分の番が来て、うまく回りました。", type: "good", npcReply: "お、成果が出たんじゃん！ すごいじゃん。", npcExpression: "happy", explanation: "具体的な出来事を共有すると、相手も反応しやすい。", nextHint: "仕事の話を続けられる雰囲気になる。", weight: 10 },
            { text: "普通です。", type: "short", npcReply: "ま、そんな日もあるよね。", npcExpression: "neutral", explanation: "無難だが、話の材料が無い。", nextHint: "「まあまあ」と付けただけでも続く。", weight: 10 },
            { text: "残業続きで死にそうですわ。", type: "bad", npcReply: "あちゃー…。まあ、頑張って。", npcExpression: "neutral", explanation: "大げさな愚痴は、空気を重くしがち。", nextHint: "軽い工夫の話題のほうが楽しく。", weight: 10 }
          ]
        },
        {
          npcLine: "この近くに、うまい焼き鳥屋さんを知ってるよ。", npcExpression: "humorous",
          answers: [
            { text: "いいですね！ 今週中に行きません？ 俺も連れてってください。", type: "good", npcReply: "お、決まり！ 金曜の仕事帰りはどう？", npcExpression: "happy", explanation: "誘いを受けて日程に誘導すると、その場で決まりやすい。", nextHint: "金曜が約束になると、楽しみが生まれる。", weight: 10 },
            { text: "気になります。", type: "short", npcReply: "連れて行ってあげようか？", npcExpression: "smile", explanation: "気になるが、誘導は相手任せ。", nextHint: "「じゃあぜひ」と決めると早い。", weight: 10 },
            { text: "飲み会は無理なんで。", type: "bad", npcReply: "あー、そうなんだ。じゃあまた今度。", npcExpression: "neutral", explanation: "即断すると相手の気分が冷める。", nextHint: "「ごはんであれば」等の対案が良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ金曜、駅前でね。", npcExpression: "humorous",
          answers: [
            { text: "了解です。楽しみにしています。お腹空かせて待ってますね。", type: "good", npcReply: "もっと腹を空かせて来いよ！（笑）", npcExpression: "happy", explanation: "約束を楽しみにすると、相手も楽しい予定になる。", nextHint: "実際に楽しめば、次の誘いが続く。", weight: 10 },
            { text: "はい、よろしくです。", type: "short", npcReply: "おう、任せとけ。", npcExpression: "smile", explanation: "約束は成立、ノリは控えめ。", nextHint: "「たのしみ」を添えると温かい。", weight: 10 },
            { text: "無断で遅れたらごめん。", type: "bad", npcReply: "…初めてなんだから、遅れるなよ？", npcExpression: "neutral", explanation: "最初から遅延を約束するのは、気が利かない。", nextHint: "「必ず行く」を言おう。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_018", title: "週末の誘い", category: "daily", npcId: "npc_kato", background: "outdoor",
      tags: ["daily", "invite"],
      context: "週末の予定について、加藤さんと話しています。",
      rounds: [
        {
          npcLine: "週末、なんか予定ある？", npcExpression: "humorous",
          answers: [
            { text: "特にないですよ。何かいい話あります？", type: "good", npcReply: "んー、スポーツ観戦に行こうかなって。", npcExpression: "happy", explanation: "予定の有無を先に伝え、相手の話を促すと進みやすい。", nextHint: "「一緒に？」の雰囲気が出る。", weight: 10 },
            { text: "特にないです。", type: "short", npcReply: "そうなんだ。", npcExpression: "neutral", explanation: "情報は伝わるが、会話はそこで止まる。", nextHint: "「何かあるの？」と聞き返すと続く。", weight: 10 },
            { text: "友達の予定あるんだよ。", type: "bad", npcReply: "あ、そっか。じゃあいいや。", npcExpression: "neutral", explanation: "先に断ると、相手は話を引っ込める。", nextHint: "「でも土曜は大丈夫」等で柔軟に。", weight: 10 }
          ]
        },
        {
          npcLine: "せっかくなら、野球でも見に行かない？", npcExpression: "humorous",
          answers: [
            { text: "いいですね！ チケット、どうやってとるんですか？", type: "good", npcReply: "ネットで買えるよ。俺がまとめてとるわ。", npcExpression: "happy", explanation: "受けて次の手順を聞くと、誘いが具体化する。", nextHint: "当日のことを決めると盛り上がる。", weight: 10 },
            { text: "楽しそうですね。", type: "short", npcReply: "でしょ？ 行こうよ。", npcExpression: "smile", explanation: "興味はありそうと見えるが、返事は不明確。", nextHint: "「行こう」と返すと決まる。", weight: 10 },
            { text: "野球はあんまりです。", type: "bad", npcReply: "そっかー。じゃあ何が好きなの？", npcExpression: "neutral", explanation: "断り方としては明確だが、代案が無いと終わる。", nextHint: "「サッカーなら」等の代案を出すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ土曜の昼、駅前ね。", npcExpression: "humorous",
          answers: [
            { text: "了解です。楽しみにしてます。お昼は何食べましょう？", type: "good", npcReply: "お、今から考えるとか、気合入ってるな！（笑）", npcExpression: "happy", explanation: "集合前の楽しみを共有し、次の話題へつなげる。", nextHint: "行く先の話で会話は弾む。", weight: 10 },
            { text: "了解。", type: "short", npcReply: "おう。", npcExpression: "neutral", explanation: "約束は成立するが、待ち遠しさが無い。", nextHint: "「どこから行く？」を考えると良い。", weight: 10 },
            { text: "ご飯は適当にコンビニで。", type: "bad", npcReply: "…せっかくなら、うまいの食べようよ。", npcExpression: "neutral", explanation: "共有の楽しみを縮める発言は、盛り下げる。", nextHint: "お祝いの空気を作ろう。", weight: 10 }
          ]
        },
        {
          npcLine: "当日は晴れてほしいなあ。", npcExpression: "humorous",
          answers: [
            { text: "晴れたらビール、降ったら屋内でも会話練習、のどっちにしましょうね。", type: "good", npcReply: "ははっ、いいテンションだ！ 何でも楽しんでやろう。", npcExpression: "happy", explanation: "同じノリに軽く返すと、ノリが合った印象になる。", nextHint: "共に何かを楽しむ仲の良さへ。", weight: 10 },
            { text: "雨でも行きますよ。", type: "short", npcReply: "雨でも来るって、強いな！", npcExpression: "happy", explanation: "短いが、行きたい気持ちは伝わる。", nextHint: "空を話題に一言足すと良い。", weight: 10 },
            { text: "雨だったら、俺はみないほうがいいかなあ。", type: "bad", npcReply: "…じゃあ、俺ひとりか？ まあいいけど。", npcExpression: "neutral", explanation: "「だったら行かない」は、相手を1人にさせる。", nextHint: "「行く」を先に言おう。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_019", title: "ジムの声かけ", category: "daily", npcId: "npc_nakamura", background: "outdoor",
      tags: ["daily", "gym"],
      context: "ジムの帰りに中村さんと鉢合わせました。",
      rounds: [
        {
          npcLine: "あ、こんばんは！ このジム通ってるの？", npcExpression: "curious",
          answers: [
            { text: "はい、最近通い始めました。中村さんもなんですか？", type: "good", npcReply: "俺は週3で来てるよ。筋トレ中心。", npcExpression: "happy", explanation: "共通の場所を話題に、相手の事情を聞くと会話が育つ。", nextHint: "トレーニングの話へスライドできる。", weight: 10 },
            { text: "まあ、来てます。", type: "short", npcReply: "意外だなー。", npcExpression: "neutral", explanation: "返事はあるが、それ以上は広がらない。", nextHint: "「最近始めた」と添えると続く。", weight: 10 },
            { text: "人のこと、ジロジロ見ないでください。", type: "bad", npcReply: "え、見てないよ！？ ただ声掛けただけだし。", npcExpression: "troubled", explanation: "親切の気配りへの敵対は、相手を信じられなくする。", nextHint: "普通に返すのが一番。", weight: 10 }
          ]
        },
        {
          npcLine: "筋肉つけるなら、プロテインより先にお肉だよ。", npcExpression: "curious",
          answers: [
            { text: "肉、大事ですよね。でも体調に合わせて鶏を多めにしてます。", type: "good", npcReply: "お、ちゃんと考えてるじゃん。いいね。", npcExpression: "happy", explanation: "相手の助言を受け、自分の判断も返すと対話になる。", nextHint: "食事と運動の両立の話へ広がる。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "まあ、参考までにね。", npcExpression: "neutral", explanation: "受けるが、自分の考えは出さない。", nextHint: "「実際どう？」と聞き返すと良い。", weight: 10 },
            { text: "サプリのほうが効率的でしょ。", type: "bad", npcReply: "…その考え方、やめたほうがいいぞ。", npcExpression: "neutral", explanation: "助言の否定は、アドバイスが減る原因になる。", nextHint: "まずは「なるほど」と受けよう。", weight: 10 }
          ]
        },
        {
          npcLine: "最近、夜のランニングも始めたんだ。", npcExpression: "curious",
          answers: [
            { text: "夜のラン、気持ちいいですよね。私は朝が多めですが、時間があると夜も走ります。", type: "good", npcReply: "お、朝ランナーでもあるの？ すごいな。", npcExpression: "happy", explanation: "相手の行動に自分の経験を重ねると、共感が深まる。", nextHint: "走る時間の話で親近感が増す。", weight: 10 },
            { text: "いい運動ですね。", type: "short", npcReply: "まあね！", npcExpression: "smile", explanation: "賛同はするが、具体性は出ない。", nextHint: "「朝も走る？」と聞くと続く。", weight: 10 },
            { text: "夜走ると、すぐ追いかけられたりしませんか？", type: "bad", npcReply: "…それは心配しすぎ（笑）。", npcExpression: "neutral", explanation: "冗談でも不安を身体の話にすると、相手の励みを削ぐ。", nextHint: "前向きな話題に戻す。", weight: 10 }
          ]
        },
        {
          npcLine: "またジムで会おうね！", npcExpression: "curious",
          answers: [
            { text: "はい！ あのマシンの使い方、次回教えてくださいね。", type: "good", npcReply: "任せろ！ じゃあまた明日！", npcExpression: "happy", explanation: "次会う理由を作ると、関係が途切れない。", nextHint: "実際に教わるオフの交流へ。", weight: 10 },
            { text: "またね。", type: "short", npcReply: "おう！", npcExpression: "smile", explanation: "気軽な別れ。次の約束はない。", nextHint: "「明日のこの時間」程度を添えると良い。", weight: 10 },
            { text: "会えたら会いましょう。", type: "bad", npcReply: "…ん？ まあ、いいや。またね。", npcExpression: "neutral", explanation: "投げやりな受け答えは、気軽さを台なしにする。", nextHint: "「共有していてうれしい」を返そう。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_020", title: "新しく始めたこと", category: "daily", npcId: "npc_nakamura", background: "outdoor",
      tags: ["daily", "new"],
      context: "中村さんが最近始めたことを話し始めました。",
      rounds: [
        {
          npcLine: "最近、古いカメラを直すのにはまってるんだ。", npcExpression: "curious",
          answers: [
            { text: "おもしろいですね！ 自分で直すんですか？ すごい。", type: "good", npcReply: "部品を注文して、ネジを回すのが楽しくてね。", npcExpression: "happy", explanation: "相手の新しい挑戦に興味を示すと、自信がつく。", nextHint: "「どうやって直すの？」等の質問が続きやすい。", weight: 10 },
            { text: "へー、すごいですね。", type: "short", npcReply: "まあね。", npcExpression: "neutral", explanation: "感心は伝わるが、質問が無いと止まる。", nextHint: "「難しくない？」と続けよう。", weight: 10 },
            { text: "そんなの、買ったほうが安いんじゃない？", type: "bad", npcReply: "…はは。まあ、そうかもね。", npcExpression: "neutral", explanation: "相手の趣味をコスパで切り下げると、心が離れる。", nextHint: "面白さに興味を持とう。", weight: 10 }
          ]
        },
        {
          npcLine: "直すのも買うのも、結局、過程が楽しいんだよな。", npcExpression: "curious",
          answers: [
            { text: "わかります、過程を大事にする人の話は、いつも面白いですね。", type: "good", npcReply: "そう言ってくれるのは、ありがたいな。", npcExpression: "happy", explanation: "相手の価値観を言葉にして返すと、信頼が生まれる。", nextHint: "相手の話を深掘りしていくと関係が深い。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "まあね。", npcExpression: "neutral", explanation: "同意はするが、理解が伝わらない。", nextHint: "「過程が一番大事」と重ねると良い。", weight: 10 },
            { text: "過程って、時間の無駄じゃないかな。", type: "bad", npcReply: "…それは、人それぞれだね。", npcExpression: "neutral", explanation: "価値観の否定は、会話の土台を壊す。", nextHint: "共感から入るのが大切。", weight: 10 }
          ]
        },
        {
          npcLine: "俺、いろいろ手を出すけど、どれも半端でさ。", npcExpression: "curious",
          answers: [
            { text: "いろんなことを試すのは、すごいと思いますよ。無理して一つに絞らなくても。", type: "good", npcReply: "そう言われると、気楽になるな。ありがとう。", npcExpression: "happy", explanation: "自己評価の低い言葉に、そのままを受けて肯定すると心に響く。", nextHint: "相手の良さを見つけて返すと更に。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "まあね。", npcExpression: "neutral", explanation: "聞くだけだと、相手は話す気持ちを失う。", nextHint: "「半端でも楽しそう」と返すと良い。", weight: 10 },
            { text: "それって集中力が無いんじゃないですか？", type: "bad", npcReply: "…はあ、そうかもしれませんね。", npcExpression: "troubled", explanation: "自己開示を責めると、関係が後退する。", nextHint: "「悪いことじゃない」と前を向こう。", weight: 10 }
          ]
        },
        {
          npcLine: "興味があるなら、今度自分の部屋にあるのを見せてあげるよ。", npcExpression: "curious",
          answers: [
            { text: "ぜひ見せてください。機会があったらでいいんで、声をかけてください。", type: "good", npcReply: "じゃあ次の休みに！ 楽しみにしてて。", npcExpression: "happy", explanation: "誘いを受け、相手のペースに委ねる誠実な返し。", nextHint: "実際に見に行くことが約束に。", weight: 10 },
            { text: "気が向いたらで。", type: "short", npcReply: "うん、じゃあ声かけるね。", npcExpression: "neutral", explanation: "曖昧だが、期待は残る。", nextHint: "「ぜひ」に変えると深まる。", weight: 10 },
            { text: "部屋には呼ばれても行けないんで。", type: "bad", npcReply: "…そう。じゃあ、また何かあったらランチでも。", npcExpression: "neutral", explanation: "警戒を全面に出すと、せっかくの好意を逃す。", nextHint: "「じゃあ外でいいです」と地点を変えよう。", weight: 10 }
          ]
        }
      ]
    }
  ];

  if (globalThis) globalThis.KE_SCENES = KE_SCENES;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_SCENES };
})();
