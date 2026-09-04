"use strict";
/*
 * kenecho Village - 会話シーン（KE_SCENES）
 * 全て架空のオリジナル。日常・散歩 / 仕事・職場 / 食事・買い物・交流を8名のNPCへ割り当てる。
 * feat/dialogue-content-expansion で各カテゴリ20件（計60件）へ拡張中（現 23件）。
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
      context: "午前中、オフィスで資料のつくり方がわからず、佐藤さんに相談しました。",
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
    },

    /* ============ 拡張バッチ1（feat/dialogue-content-expansion） ============
     * 新条件を試す3シーン：
     *  scn_021 朝の散歩（daily/朝限定・suzuki） / scn_022 午前の進捗確認（work/昼限定・tanaka）
     *  scn_023 夜の定食屋さん（food/夕方・夜限定・konno）
     * timeBands はシーン単位（config.SCENE_BANDS）で固定し、台詞の時間帯条件はストーリー枠で付与。 */

    {
      id: "scn_021", title: "朝の散歩で出会う", category: "daily", npcId: "npc_suzuki", background: "outdoor",
      tags: ["daily", "walk", "morning"],
      context: "朝、散歩道で同じ時間に歩いている鈴木さんと出会いました。",
      rounds: [
        {
          npcLine: "あ、おはようございます…。この時間に歩かれてるんですね。", npcExpression: "shy",
          answers: [
            { text: "はい、朝は空気が澄んでいて好きで。鈴木さんも続けてるんですね。", type: "good", npcReply: "…はい。小さい頃からこの道を歩くのが好きで、今も続けてます。", npcExpression: "smile", explanation: "自分の理由を話すと、控えめな相手も安心して本音を出しやすい。", nextHint: "相手の習慣へ関心を示すと続く。", weight: 10 },
            { text: "おつかれさまです。", type: "short", npcReply: "あ、はい…。おつかれさまです。", npcExpression: "neutral", explanation: "短い挨拶でも、人見知りには負担が少なく自然。", nextHint: "ひと言、天気や道の話題を添えると続きやすい。", weight: 10 },
            { text: "（視線をそらして通り過ぎる）", type: "bad", npcReply: "あ…（慌てて道を譲る）", npcExpression: "troubled", explanation: "挨拶を返さないと、相手は気まずい思いをしてしまう。", nextHint: "短くても目を合わせて返すことが大切。", weight: 10 }
          ]
        },
        {
          npcLine: "ここから先は、いつもカモの親子がいるんですよ…。", npcExpression: "curious",
          answers: [
            { text: "へえ、それ、どこで見えるんですか？ 見てみたいです。", type: "good", npcReply: "あ、あの橋の下です…。この時間なら、いることが多いです。", npcExpression: "smile", explanation: "具体的な話題に興味を示すと、話しやすさが増す。", nextHint: "実際に一緒に行く約束になると続く。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "はい…。よかったら、今度見てみてください。", npcExpression: "neutral", explanation: "相づちでも、相手の話は受け止められる。", nextHint: "「どこら辺？」と続けて聞くと自然に話が伸びる。", weight: 10 },
            { text: "カモには興味ないです。", type: "bad", npcReply: "あ…そうでしたか。すみません。", npcExpression: "troubled", explanation: "相手が差し出した話題を断ると、会話が閉じやすい。", nextHint: "興味がなくても相づちだけでも印象が違う。", weight: 10 }
          ]
        },
        {
          npcLine: "…そうですか。雨の日は、あえて人が少ないのがいいんですよ。", npcExpression: "smile",
          answers: [
            { text: "雨の日の落ち着き、わかります。いいですよね。", type: "good", npcReply: "…！ わかってくれる人がいて、うれしいです。", npcExpression: "happy", explanation: "共感を返すと、人見知りの相手が心を開くきっかけになる。", nextHint: "その日の天気の話まで広げると弾む。", weight: 10 },
            { text: "それ、実はありますね。", type: "short", npcReply: "…よかった。分かってもらえて。", npcExpression: "smile", explanation: "短くても同意を示すと、相手は安心する。", nextHint: "「静かでいいですよね」と返すと共感が深まる。", weight: 10 },
            { text: "人は多いほうが楽しいと思いますけど。", type: "bad", npcReply: "…そうですか。人それぞれですね。", npcExpression: "neutral", explanation: "反対意見をぶつけると、気弱な相手は引いてしまう。", nextHint: "まず「そういう考えもあるんですね」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "それじゃあ、私はこのへんで。…また、お会いしましたら。", npcExpression: "shy",
          answers: [
            { text: "はい、またお会いしましょう。今度はカモ、教えてくださいね。", type: "good", npcReply: "ええ…。それなら、ぜひ。おやすみなさい。", npcExpression: "happy", explanation: "次に会う約束をすると、人見知りでも再会がしやすくなる。", nextHint: "実際に教えてもらうと、信頼が育つ。", weight: 10 },
            { text: "はい、またお会いしましょう。", type: "short", npcReply: "はい…。お元気で。", npcExpression: "smile", explanation: "短い別れでも、相手は温かく受け取る。", nextHint: "「お互い気をつけて」を添えると温かい。", weight: 10 },
            { text: "（返事もせず歩き去る）", type: "bad", npcReply: "…（その後ろ姿を見つめる）", npcExpression: "troubled", explanation: "黙って去ると、相手はまた声をかけてよいか迷う。", nextHint: "振り返って一言返すだけで印象が変わる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_022", title: "午前の進捗確認", category: "work", npcId: "npc_tanaka", background: "office",
      tags: ["work", "progress", "daytime"],
      context: "午前中、仕事の進み具合を田中さんに確認されました。",
      rounds: [
        {
          npcLine: "進捗、どう？ さっきの続き、できてる？", npcExpression: "neutral",
          answers: [
            { text: "先ほどの資料、仕上げまで終わりました。確認をお願いしたいです。", type: "good", npcReply: "OK。見るよ。あとで声かける。", npcExpression: "neutral", explanation: "簡潔に「完了＋依頼」を伝えると、相手はすぐ動ける。", nextHint: "どこを見てほしいか添えるとラク。", weight: 10 },
            { text: "だいたいできてます。", type: "short", npcReply: "だいたい？ 量で言うと？", npcExpression: "neutral", explanation: "曖昧な返答は、確認をしにくくする。", nextHint: "割合や数値に置き換えると良い。", weight: 10 },
            { text: "聞かないでください。", type: "bad", npcReply: "…。それじゃ確認できない。", npcExpression: "troubled", explanation: "確認を拒否すると、相手は手が止まる。", nextHint: "短くても「◯時までに」と伝えると動ける。", weight: 10 }
          ]
        },
        {
          npcLine: "締切を明日にしたい。ムリそうなら今のうちに言って。", npcExpression: "neutral",
          answers: [
            { text: "明日の午前なら、仕上げられます。今週中なら、手分けをお願いしたいです。", type: "good", npcReply: "どっちなら確実？ …午前ね。それで進めよう。", npcExpression: "smile", explanation: "期限へ近づける具体案を出すと、相手は決めやすくなる。", nextHint: "「◯時までに連絡します」を添えると安心。", weight: 10 },
            { text: "なんとか頑張ります。", type: "short", npcReply: "頑張る、じゃなくて日程で答えて。", npcExpression: "neutral", explanation: "気合いだけでは、相手は見通せない。", nextHint: "できる量と日時で答えると良い。", weight: 10 },
            { text: "無理かも。", type: "bad", npcReply: "無理、だけだと進まない。どこが詰まってる？", npcExpression: "sad", explanation: "結論だけの否定は、次の案につながらない。", nextHint: "詰まっている箇所を挙げると助けを得やすい。", weight: 10 }
          ]
        },
        {
          npcLine: "詰まってるところがあるなら、先にそこを片付けよう。", npcExpression: "neutral",
          answers: [
            { text: "ありがとうございます。データの整合で詰まってます。先に一緒に見てもらえますか？", type: "good", npcReply: "いいよ。10分だけ。そっちが終わったら回して。", npcExpression: "smile", explanation: "具体的な対象と時間を伝えると、相手も動きやすい。", nextHint: "終わったら結果を報告すると信頼が増す。", weight: 10 },
            { text: "はい、やります。", type: "short", npcReply: "うん、何をやるか言ってから動いて。", npcExpression: "neutral", explanation: "行動だけ宣言しても、内容が見えにくい。", nextHint: "「まず◯をしてから◯を」と順序を言うと良い。", weight: 10 },
            { text: "大丈夫です、自分でやります。", type: "bad", npcReply: "その方が時間かかりそうだけど。まあいいよ。", npcExpression: "neutral", explanation: "手伝いを断るのも、状況が伝われば渋い。", nextHint: "期限の見込みを一言添えると納得されやすい。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、10分後に俺が行く。それまではデータ直してて。", npcExpression: "neutral",
          answers: [
            { text: "はい、10分後に。ここで待ってます。", type: "good", npcReply: "OK。そっちで待ってて。", npcExpression: "neutral", explanation: "約束を復唱すると、相手も安心する。", nextHint: "待つ間に「要点をまとめておく」と伝えると良い。", weight: 10 },
            { text: "了解です。", type: "short", npcReply: "うん。よろしく。", npcExpression: "neutral", explanation: "短くても合意は伝わる。", nextHint: "ひとこと「資料を開けておきます」を添えると効率的。", weight: 10 },
            { text: "（無言で離席する）", type: "bad", npcReply: "…おい。どこ行くんだ？", npcExpression: "troubled", explanation: "合意なしに離れると、相手は状況を掴めない。", nextHint: "「少しだけ席を外します」と伝えてから動くと良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_023", title: "夜の定食屋さん", category: "food", npcId: "npc_konno", background: "dining",
      tags: ["food", "dinner", "night"],
      context: "夜、近所の定食屋で帰りのごはんを食べています。店主の今野さんが話しかけてきました。",
      rounds: [
        {
          npcLine: "お！ お疲れ！ また来てくれたね。今日は何食べる？", npcExpression: "bright",
          answers: [
            { text: "今日はさっぱりしたものが欲しくて。おすすめはありますか？", type: "good", npcReply: "今日はかれいの煮つけが入ったよ！ めっちゃ合う。", npcExpression: "happy", explanation: "気分とおすすめを求めるのは自然で、会話が弾む。", nextHint: "注文の相談まで行くと良い。", weight: 10 },
            { text: "定番で。", type: "short", npcReply: "はいよ、定番の生姜焼きね！ 待ってて。", npcExpression: "smile", explanation: "短いが、店主には十分伝わる。", nextHint: "「今日は元気出そう」と一言足すと喜ばれる。", weight: 10 },
            { text: "（無視してメニューを見る）", type: "bad", npcReply: "…おっと。じゃあ、ゆっくり決めてね。", npcExpression: "neutral", explanation: "声かけを無視すると、店主は気を遣ってしまう。", nextHint: "短くても「ありがとう」が返せると好印象。", weight: 10 }
          ]
        },
        {
          npcLine: "今日は仕事、大変だった？ ちょっと元気ない顔してたよ。", npcExpression: "curious",
          answers: [
            { text: "実は、午後の会議が長引いて、ちょっと疲れてました。", type: "good", npcReply: "そかそか、それはお疲れ。今日は特盛にしとく？", npcExpression: "caring", explanation: "疲れを共有すると、相手も自然に寄り添える。", nextHint: "「遠慮します」など返しで好みを示すと良い。", weight: 10 },
            { text: "まあまあでした。", type: "short", npcReply: "まあまあ、ね。無理してないならいいよ。", npcExpression: "smile", explanation: "短いが自然。詳細は求めていない。", nextHint: "「気にかけてくれてありがとう」を添えると温かい。", weight: 10 },
            { text: "聞かないで。", type: "bad", npcReply: "あらら。ごめんね、余計なこと聞いた。", npcExpression: "troubled", explanation: "気づかいを拒否すると、店主は引いてしまう。", nextHint: "「疲れてるだけ」と一言添えると伝わりやすい。", weight: 10 }
          ]
        },
        {
          npcLine: "そうか…。よかったら、今日はカボチャの煮物、サービスしとくよ。", npcExpression: "bright",
          answers: [
            { text: "ありがとうございます！ そういうの、すごく元気出ます。", type: "good", npcReply: "ははは、うちの裏メニューパワーだよ！", npcExpression: "happy", explanation: "気配りに感謝を返すと、相手も嬉しくなる。", nextHint: "食べた感想を伝えると、さらに喜ばれる。", weight: 10 },
            { text: "ありがとうございます。", type: "short", npcReply: "どういたしまして。食べて元気出しな。", npcExpression: "smile", explanation: "短くても感謝は十分伝わる。", nextHint: "「おいしい」を添えると、相手は報われる。", weight: 10 },
            { text: "いらないです。", type: "bad", npcReply: "お、遠慮すんなよ。じゃあ、味見だけでも。", npcExpression: "neutral", explanation: "好意を強く断ると、空気が少し固くなる。", nextHint: "「ありがとう」と受け取るだけで場が温まる。", weight: 10 }
          ]
        },
        {
          npcLine: "そろそろ閉店近いけど、ゆっくりして行きな。ごちそうさまはいただくよ。", npcExpression: "bright",
          answers: [
            { text: "ごちそうさまでした！ また来週も来ますね。", type: "good", npcReply: "おう、待ってるよ！ 次の新作も考えとく。", npcExpression: "happy", explanation: "再来を約束すると、常連として育てられる。", nextHint: "実際に来ると、関係が深まる。", weight: 10 },
            { text: "ごちそうさまでした。", type: "short", npcReply: "はいよ、またいつでも！", npcExpression: "smile", explanation: "短い締めでも、店主は満足そう。", nextHint: "「おいしかった」を一言添えると好印象。", weight: 10 },
            { text: "（席を立ち、黙って会計だけする）", type: "bad", npcReply: "…あいよ。またね。", npcExpression: "neutral", explanation: "気配りに無反応だと、店主は少し寂しそう。", nextHint: "顔を見て一言あいさつすると、常連になれる。", weight: 10 }
          ]
        }
      ]
    },

    /* ============ 拡張バッチ2（feat/dialogue-content-expansion） ============
     * 各カテゴリを増量（daily 12 / work 11 / food 10 ＝ 計33件）。
     * 話題・性格・関係段階のバリエーションを広げる。 */

    {
      id: "scn_024", title: "近所の花壇", category: "daily", npcId: "npc_hanada", background: "outdoor",
      tags: ["daily", "neighbor", "garden"],
      context: "夕方、近所の花壇に水をやる花田さんに会いました。",
      rounds: [
        {
          npcLine: "まあ、こんばんは。花壇を見てくれてるの？", npcExpression: "smile",
          answers: [
            { text: "はい、花の色がきれいで、足を止めてました。", type: "good", npcReply: "そう言ってもらえると、手入れした甲斐があるわね。", npcExpression: "happy", explanation: "相手の持ち物や成果を褒めると、関係は和む。", nextHint: "好きな花の話を振ると続く。", weight: 10 },
            { text: "こんばんは。", type: "short", npcReply: "こんばんは。お散歩がてら？", npcExpression: "smile", explanation: "短い挨拶でも、近所づきあいは育つ。", nextHint: "天気や花のひと言を添えると続く。", weight: 10 },
            { text: "（足早に通り過ぎる）", type: "bad", npcReply: "あら、忙しそうね。", npcExpression: "neutral", explanation: "挨拶を返さないと、相手は気を遣う。", nextHint: "短くても返すことが大切。", weight: 10 }
          ]
        },
        {
          npcLine: "このバラ、もうすぐ満開でね。今週末がたぶん見頃よ。", npcExpression: "smile",
          answers: [
            { text: "見頃、ぜひ見に来ます。週末の何時ごろがいいですか？", type: "good", npcReply: "朝の9時ごろが、いい光が当たるのよ。", npcExpression: "happy", explanation: "具体的な時間を聞くと、約束に近づく。", nextHint: "「花の名前一覧」を聞くと深まる。", weight: 10 },
            { text: "楽しみにしてます。", type: "short", npcReply: "うん、待ってるからね。", npcExpression: "smile", explanation: "短いが、相手は気力を得る。", nextHint: "「何の花が好き？」と返すと続く。", weight: 10 },
            { text: "花はあまり詳しくないんです。", type: "bad", npcReply: "あら、そう？ 見てるだけでも癒されるわよ。", npcExpression: "neutral", explanation: "興味のなさを出すと、相手は話を畳みがち。", nextHint: "「それでもきれいだと思います」と続けられる。", weight: 10 }
          ]
        },
        {
          npcLine: "よかったら、一株、分けてあげようか？", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます！ 今度の日曜に、一緒にお世話できませんか？", type: "good", npcReply: "まあ、うれしい。そうしましょう。", npcExpression: "happy", explanation: "好意を受け、さらに一歩踏み込むと、交流が育つ。", nextHint: "実際に一緒に楽しむと信頼になる。", weight: 10 },
            { text: "ありがとうございます。", type: "short", npcReply: "どういたしまして。育てるの、楽しいわよ。", npcExpression: "smile", explanation: "感謝だけでも、相手は喜ぶ。", nextHint: "育て方の質問を足すと続く。", weight: 10 },
            { text: "いらないです。", type: "short", npcReply: "あら…、そう。気が向いたら、また声かけてね。", npcExpression: "neutral", explanation: "断っても、代わりに「また」を残せば失礼でない。", nextHint: "「機会があればお願いします」と添えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "もう暗くなってきたから、今日はこれで。またね。", npcExpression: "smile",
          answers: [
            { text: "はい、ありがとうございます。週末にまた来ます。", type: "good", npcReply: "約束よ。楽しみにしてるわ。", npcExpression: "happy", explanation: "再会を約束すると、近所の縁が続く。", nextHint: "大事に育てる気持ちを伝えると良い。", weight: 10 },
            { text: "またお会いしましょう。", type: "short", npcReply: "またね。気をつけて。", npcExpression: "smile", explanation: "短くても、自然な別れ。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（挨拶もせず去る）", type: "bad", npcReply: "…。（少し残念そう）", npcExpression: "neutral", explanation: "黙って去ると、相手は言葉を失う。", nextHint: "一言返すだけで印象が変わる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_025", title: "公園の日なた", category: "daily", npcId: "npc_kato", background: "outdoor",
      tags: ["daily", "park", "relax"],
      context: "昼下がり、公園のベンチで隣り合わせた陽気な加藤さんと話しました。",
      rounds: [
        {
          npcLine: "こんにちは！ 今日は暑いけど、ここは涼しいでしょ？", npcExpression: "humorous",
          answers: [
            { text: "そうですね。木陰が気持ちよくて、のんびりしてました。", type: "good", npcReply: "いいねえ。ここは知る人ぞ知る特等席なんだ。", npcExpression: "happy", explanation: "気持ちを共有すると、相手も打ち解ける。", nextHint: "「何度も来てるの？」と聞くと続く。", weight: 10 },
            { text: "こんにちは、そうですね。", type: "short", npcReply: "気持ちいいでしょ。風が通ると最高だよ。", npcExpression: "smile", explanation: "相づちでも、居心地は共有される。", nextHint: "「どこが特等席？」と聞くと弾む。", weight: 10 },
            { text: "（無言で席を立つ）", type: "bad", npcReply: "あれ、行っちゃった。まあいいか。", npcExpression: "neutral", explanation: "無視は、気さくな相手にも寂しい印象。", nextHint: "返事ひとつで場が和む。", weight: 10 }
          ]
        },
        {
          npcLine: "ここはね、野良猫の『タマ』に会えるんだ。ほら、あっち。", npcExpression: "humorous",
          answers: [
            { text: "本当だ！ タマって、いつもここにいるんですか？", type: "good", npcReply: "夕方はだいたいここだな。人なつっこいんだよ。", npcExpression: "happy", explanation: "相手の話の中心に興味を向けると、話が弾む。", nextHint: "タマの話を続けると、仲良くなれる。", weight: 10 },
            { text: "へえ、かわいいですね。", type: "short", npcReply: "でしょ？ 気が向いたら撫でてもいいよ。", npcExpression: "smile", explanation: "短くても、相手の話題は受け止められる。", nextHint: "「名前つけたの？」と聞くと続く。", weight: 10 },
            { text: "猫は苦手です。", type: "short", npcReply: "あらら。じゃあ、鳥の話にしようか。", npcExpression: "humorous", explanation: "断っても、相手は別の話題を差し出せる。", nextHint: "話を畳む代わりに新話題を受けよう。", weight: 10 }
          ]
        },
        {
          npcLine: "こうやってのんびりが、いちばん大事だと思うんだ。", npcExpression: "neutral",
          answers: [
            { text: "わかります。何もしない時間って、案外大事ですよね。", type: "good", npcReply: "そうそう！ わかってくれる人がいて嬉しいよ。", npcExpression: "happy", explanation: "価値観に共感すると、距離が縮まる。", nextHint: "自分の過ごし方を添えると深まる。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "そうそう。急がなくていいよ。", npcExpression: "smile", explanation: "短い同意でも、相手は満足する。", nextHint: "「あなたは何してるの？」と返すと続く。", weight: 10 },
            { text: "時間がもったいないです。", type: "short", npcReply: "おっと、考え方は人それぞれだね。", npcExpression: "neutral", explanation: "反対意見は、話を閉じさせがち。", nextHint: "相手の価値をまず認めると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "そろそろ行くね。また会ったら声かけて。", npcExpression: "smile",
          answers: [
            { text: "はい、また。タマにも会いに来ます。", type: "good", npcReply: "おう、待ってるよ。タマは逃げないから！", npcExpression: "happy", explanation: "再訪の約束を、話題と結びつけて残せる。", nextHint: "実際に来ると、常連になれる。", weight: 10 },
            { text: "はい、また。", type: "short", npcReply: "またね。いい休日を。", npcExpression: "smile", explanation: "短い別れでも、相手は気持ちよく帰れる。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（黙って去る）", type: "bad", npcReply: "…（名残惜しそうに背を見送る）", npcExpression: "neutral", explanation: "返事をしないと、相手は途方に暮れる。", nextHint: "一言返すだけで次につながる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_026", title: "引っ越してきた縁", category: "daily", npcId: "npc_nakamura", background: "outdoor",
      tags: ["daily", "talk", "neighborhood"],
      context: "近所でよく会う中村さんに、この辺りに来たてだと話しかけられました。",
      rounds: [
        {
          npcLine: "あの、この辺りに、お引っ越しされたんですか？", npcExpression: "curious",
          answers: [
            { text: "はい、最近です。まだ道に慣れていなくて。", type: "good", npcReply: "ああ、じゃあ近くのお店とか、まだ知らないですよね。", npcExpression: "curious", explanation: "自分の状況を話すと、相手は助けに入りやすい。", nextHint: "「何があるんですか？」と返すと続く。", weight: 10 },
            { text: "はい、引っ越してきました。", type: "short", npcReply: "そうなんですね。慣れないうちは大変ですよね。", npcExpression: "smile", explanation: "短くても、話のきっかけにはなる。", nextHint: "困っていることを添えると助けを得やすい。", weight: 10 },
            { text: "なんでですか？", type: "bad", npcReply: "あ、いや、聞き方が変でしたか？ すみません。", npcExpression: "neutral", explanation: "詰め寄る返しは、相手を委縮させる。", nextHint: "まず返してから、聞き返すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "この辺はね、裏道にいいパン屋さんがあるんですよ。", npcExpression: "curious",
          answers: [
            { text: "それ、どこにあるんですか？ 教えてもらえますか？", type: "good", npcReply: "あそこの路地を入ったとこの、白い建物ですよ。", npcExpression: "happy", explanation: "具体的に尋ねると、相手は案内したくなる。", nextHint: "「名前は？」と聞くと記憶にも残る。", weight: 10 },
            { text: "へえ、そうなんですね。", type: "short", npcReply: "よかったら、一度行ってみてください。", npcExpression: "smile", explanation: "短い相づちでも、情報は受け止められる。", nextHint: "「行ってみます」と続けると弾む。", weight: 10 },
            { text: "パンはあまり食べないです。", type: "short", npcReply: "あら、そうですか…。他に何かお好きですか？", npcExpression: "neutral", explanation: "話題を閉じる代わりに、相手は別のを探す。", nextHint: "好きなものを伝えると会話が続く。", weight: 10 }
          ]
        },
        {
          npcLine: "住み始めて、何か困ってることはあります？", npcExpression: "curious",
          answers: [
            { text: "実は、ゴミの出し方がまだよくわからなくて…。", type: "good", npcReply: "ああ、じゃあ次に会ったときに、一緒に確認しましょ。", npcExpression: "smile", explanation: "具体的な困りごとに答えると、助けを得やすい。", nextHint: "感謝を伝えると、さらに心を開く。", weight: 10 },
            { text: "特にないです。", type: "short", npcReply: "それなら安心です。", npcExpression: "smile", explanation: "短いが、相手の気遣いは解ける。", nextHint: "「ありがとう」を添えると好印象。", weight: 10 },
            { text: "教えてもらわなくて大丈夫です。", type: "short", npcReply: "そうですか…。それでは、また。", npcExpression: "neutral", explanation: "助けを断ると、相手は距離を置く。", nextHint: "「相談します」と一度受け取ると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "あ、時間ですね。また何かあれば、声をかけてくださいね。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。ゴミの件、ぜひお願いします。", type: "good", npcReply: "ええ、覚えてますよ。ではまた。", npcExpression: "happy", explanation: "約束を預けると、相手も頼りにされる喜びを得る。", nextHint: "次の約束の場を決めると続く。", weight: 10 },
            { text: "はい、お時間ありがとうございました。", type: "short", npcReply: "いえいえ。お気をつけて。", npcExpression: "smile", explanation: "感謝とともに自然に別れられる。", nextHint: "「またお会いしましょう」を添えると良い。", weight: 10 },
            { text: "（会釈だけして去る）", type: "bad", npcReply: "…（少し気にかかる）", npcExpression: "neutral", explanation: "言葉なく去ると、相手は腑に落ちない。", nextHint: "一言返すだけで、縁が続く。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_027", title: "資料の二重チェック", category: "work", npcId: "npc_yamada", background: "office",
      tags: ["work", "documents", "daytime"],
      context: "午後、山田さんに資料の数値の再確認をお願いしました。",
      rounds: [
        {
          npcLine: "資料、拝見したよ。内容はいいけど、最後の数値だけ確認したい。", npcExpression: "neutral",
          answers: [
            { text: "あ、そこ、私も自信がなくて。出典を確認しました。", type: "good", npcReply: "そう言ってくれると安心だ。出典、どこに載せた？", npcExpression: "smile", explanation: "自信のなさを正直に言うと、相手は助けに入れる。", nextHint: "出典のページを共有すると進む。", weight: 10 },
            { text: "はい、確認します。", type: "short", npcReply: "うん、急がないから。今のうちだね。", npcExpression: "neutral", explanation: "短い承諾でも、相手は安心する。", nextHint: "どの数値にするか明示すると良い。", weight: 10 },
            { text: "大丈夫です、ちゃんとやりました。", type: "short", npcReply: "…そう言われても、万が一があるからな。", npcExpression: "neutral", explanation: "「大丈夫」だけでは、根拠が伝わらない。", nextHint: "根拠をひとつ示すと納得される。", weight: 10 }
          ]
        },
        {
          npcLine: "数値が1箇所違ってた。ここの、チェックした？", npcExpression: "neutral",
          answers: [
            { text: "すみません、見落としてました。正しく直します。", type: "good", npcReply: "見つかってよかった。直したら見せて。", npcExpression: "smile", explanation: "指摘を受け入れると、確認はスムーズに。", nextHint: "直した根拠も添えると信頼。", weight: 10 },
            { text: "直します。", type: "short", npcReply: "うん。じゃあ直したら連絡して。", npcExpression: "neutral", explanation: "短くても、速やかな対応は伝わる。", nextHint: "「◯時までに直します」と添えると良い。", weight: 10 },
            { text: "たぶん間違ってないです。", type: "bad", npcReply: "いや、ここ、計算が合わないよ。もう一度見て。", npcExpression: "troubled", explanation: "ミスを認めないと、相手の時間を奪う。", nextHint: "いったん受け止めてから確認しよう。", weight: 10 }
          ]
        },
        {
          npcLine: "二重チェックはね、間違いを探すためじゃなく、『お互いを守る』ためなんだ。", npcExpression: "neutral",
          answers: [
            { text: "なるほど。確かに、自分だけだと気づけないものですね。", type: "good", npcReply: "そう。そういう意識が、結局みんなを助けるんだよ。", npcExpression: "smile", explanation: "相手の考えに納得を示すと、信頼は深まる。", nextHint: "自分の気づいた点を一言返すと良い。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "うん、わかってくれたかな。", npcExpression: "neutral", explanation: "短い同意だけでは、理解度が見えにくい。", nextHint: "意味を一言復唱すると伝わる。", weight: 10 },
            { text: "チェックするのが面倒です。", type: "bad", npcReply: "…いや、面倒だとは思ってほしくないな。", npcExpression: "troubled", explanation: "本音を出すのは大事だが、仕事の場では損に。", nextHint: "「大事だとわかりました」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "直せたね。これで提出できるよ。お疲れさま。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。次は最初から丁寧に確認します。", type: "good", npcReply: "その調子。またあとで見るよ。", npcExpression: "smile", explanation: "学びを宣言すると、相手も引き続き任せられる。", nextHint: "実際に次に活かすと信頼。", weight: 10 },
            { text: "お疲れさまです。", type: "short", npcReply: "お疲れさま。気をつけて帰ってね。", npcExpression: "neutral", explanation: "短い労いでも、仕事は締まる。", nextHint: "成果を一言添えると好印象。", weight: 10 },
            { text: "（何も言わずに去る）", type: "bad", npcReply: "…（首をかしげる）", npcExpression: "neutral", explanation: "締めの言葉が無いと、働きが報われない。", nextHint: "「ありがとう」だけで十分。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_028", title: "退勤前のひとこと", category: "work", npcId: "npc_sato", background: "office",
      tags: ["work", "closing", "evening"],
      context: "退勤前、佐藤さんに明日の段取りを確認されました。",
      rounds: [
        {
          npcLine: "今日は早めに上がれる？ 明日の朝イチの用意、もうした？", npcExpression: "neutral",
          answers: [
            { text: "はい、資料はもう机の上に置いてます。朝は確認だけで大丈夫です。", type: "good", npcReply: "おー、抜かりないね。それなら安心だ。", npcExpression: "happy", explanation: "準備済みを具体的に伝えると、相手は安心する。", nextHint: "明日の確認事項も添えると良い。", weight: 10 },
            { text: "だいたい終わりました。", type: "short", npcReply: "そう？ じゃあ無理せず上がって。", npcExpression: "smile", explanation: "短くても、完了感は伝わる。", nextHint: "残りがある場合は添えると良い。", weight: 10 },
            { text: "明日のことは明日考えます。", type: "short", npcReply: "…あら、まあ、気持ちはわかるけど。", npcExpression: "neutral", explanation: "投げ遣りな返しは、相手を不安にする。", nextHint: "一つでも確認事項を言うと安心される。", weight: 10 }
          ]
        },
        {
          npcLine: "明日は朝から打ち合わせがあるから、資料だけは置いといてね。", npcExpression: "neutral",
          answers: [
            { text: "はい、表紙に明日の日付を入れて置いておきます。", type: "good", npcReply: "助かるわ。じゃあ朝イチに確認するね。", npcExpression: "smile", explanation: "布石を踏んで準備すると、信頼が高まる。", nextHint: "場所も言っておくと親切。", weight: 10 },
            { text: "了解です。", type: "short", npcReply: "うん、よろしくね。", npcExpression: "smile", explanation: "短い承諾でも、役割は伝わる。", nextHint: "「置き場所はこの棚です」と足すと親切。", weight: 10 },
            { text: "忘れたらすみません。", type: "bad", npcReply: "ええっ、それは困るな…。", npcExpression: "troubled", explanation: "覚束ない返しは、信頼を揺らす。", nextHint: "「忘れないよう書いておきます」と切り替えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "今日、疲れてるでしょ。休みなさいよ。", npcExpression: "caring",
          answers: [
            { text: "ありがとうございます。実は少し眠くて…。お言葉に甘えます。", type: "good", npcReply: "無理は禁物よ。明日に備えて早めに休んでね。", npcExpression: "caring", explanation: "体調を隠さず伝えると、相手は気遣う心を温める。", nextHint: "明日の予定を確認すると安心。", weight: 10 },
            { text: "ありがとうございます。", type: "short", npcReply: "どういたしまして。また明日ね。", npcExpression: "smile", explanation: "短くても、気遣いは受け止められる。", nextHint: "「明日もよろしく」を添えると良い。", weight: 10 },
            { text: "まだやることあります。", type: "short", npcReply: "うーん、それが明日に響くから考えどころだね。", npcExpression: "neutral", explanation: "頑張りは伝わるが、無理は次日に響く。", nextHint: "「◯時までに片付けます」と区切ると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、私はもう行くね。あ、明日の打ち合わせ、がんばろう！", npcExpression: "smile",
          answers: [
            { text: "はい、お疲れさまでした。明日、よろしくお願いします。", type: "good", npcReply: "うん、よろしく！ 気をつけて帰ってね。", npcExpression: "happy", explanation: "別れ際のねぎらいと明日の約束で、締まりが良い。", nextHint: "明日の予定を一言添えると好印象。", weight: 10 },
            { text: "お疲れさまです。", type: "short", npcReply: "おつかれさま。また明日。", npcExpression: "smile", explanation: "短くても、労い合えば自然に締まる。", nextHint: "「ありがとう」を添えると温かい。", weight: 10 },
            { text: "（黙って席を立つ）", type: "bad", npcReply: "…あれ？ じゃあ、また明日。", npcExpression: "neutral", explanation: "締めの言葉がないと、相手は不安が残る。", nextHint: "一言返すだけで働きが輝く。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_029", title: "ミーティングでの発言", category: "work", npcId: "npc_tanaka", background: "office",
      tags: ["work", "meeting", "daytime"],
      context: "ミーティングで、田中さんに発言を促されました。",
      rounds: [
        {
          npcLine: "どう思う？ みんなの意見、聞きたいから。", npcExpression: "neutral",
          answers: [
            { text: "私は、最初の案がいいと思います。理由は、時間が短いからです。", type: "good", npcReply: "具体的だな。そう言われると意見が立つ。", npcExpression: "smile", explanation: "結論と理由をセットで言うと、意見として立つ。", nextHint: "比較対象を添えると、さらに明確。", weight: 10 },
            { text: "いいと思います。", type: "short", npcReply: "いい？ どこが？", npcExpression: "neutral", explanation: "味方のない評価は、再質問を招く。", nextHint: "根拠をひとつ足すと伝わる。", weight: 10 },
            { text: "特にないです。", type: "short", npcReply: "…じゃあ次、行くぞ。", npcExpression: "neutral", explanation: "無言は、チャンスを逃す。", nextHint: "小さくでも、感じたことを言おう。", weight: 10 }
          ]
        },
        {
          npcLine: "理由を、もう一言でいいので短く言って。", npcExpression: "neutral",
          answers: [
            { text: "手間は増えますが、確実性が増すからです。", type: "good", npcReply: "それでいい。その一言があるのと無いのとでは違う。", npcExpression: "smile", explanation: "一言で理由を言えると、説得力が増す。", nextHint: "数値で補足すると、さらに強い。", weight: 10 },
            { text: "理由は…、うーん。", type: "short", npcReply: "言い切れないなら、それはまだ決められてないってことだよ。", npcExpression: "neutral", explanation: "曖昧さは、判断を預けさせてしまう。", nextHint: "先に結論を仮置きすると話せる。", weight: 10 },
            { text: "（黙る）", type: "bad", npcReply: "…。時間を止めるのが得意なわけじゃないよ？", npcExpression: "neutral", explanation: "沈黙は、周囲のペースを乱す。", nextHint: "「考え中です」と一言あると安心。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、その案で進める。できたら今週中だ。", npcExpression: "neutral",
          answers: [
            { text: "はい、今週の金曜までにまとめます。", type: "good", npcReply: "金曜ね。OK。終わったらすぐ回して。", npcExpression: "smile", explanation: "期日を具体化すると、相手も段取りできる。", nextHint: "報告の手段も決めると効率的。", weight: 10 },
            { text: "了解です。", type: "short", npcReply: "うん、よろしく。", npcExpression: "neutral", explanation: "短い承諾でも、役割は決まる。", nextHint: "「◯時までに」を添えると良い。", weight: 10 },
            { text: "もう少し時間くれませんか。", type: "short", npcReply: "どれくらい？ 具体的に。", npcExpression: "neutral", explanation: "要求だけでは、根拠を問われる。", nextHint: "「◯日の午後までなら」と範囲を示すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "今日は発言、良かった。次も頼む。", npcExpression: "neutral",
          answers: [
            { text: "ありがとうございます。次は持ち帰り資料も作ります。", type: "good", npcReply: "それは助かる。用意してきて。", npcExpression: "smile", explanation: "感謝と次の提供をセットにすると、評価が続く。", nextHint: "実際に用意すると、信頼が育つ。", weight: 10 },
            { text: "ありがとうございます。", type: "short", npcReply: "うん、お疲れ。", npcExpression: "neutral", explanation: "短くても、ねぎらいは受け取れる。", nextHint: "「次もがんばります」を添えると好印象。", weight: 10 },
            { text: "（何も言わず）", type: "bad", npcReply: "…えーと。じゃあ解散。", npcExpression: "neutral", explanation: "評価への反応がないと、対話が冷える。", nextHint: "「ありがとう」だけで十分。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_030", title: "週末の散歩の誘い", category: "work", npcId: "npc_sato", background: "outdoor",
      tags: ["work", "schedule", "relax"],
      context: "退勤時に、佐藤さんが週末の散歩に誘ってくれました。",
      rounds: [
        {
          npcLine: "今週末、何か予定ある？ 良かったら一緒に散歩でも。", npcExpression: "smile",
          answers: [
            { text: "土曜の午前なら大丈夫です。散歩、いいですね。", type: "good", npcReply: "やった。じゃあ、午前9時に駅前で？", npcExpression: "happy", explanation: "空いている時間を示すと、予定が固まる。", nextHint: "集合場所を決めると進む。", weight: 10 },
            { text: "空いてますよ。", type: "short", npcReply: "じゃあ土曜に、どこか行こうか。", npcExpression: "smile", explanation: "短い承諾でも、誘いは成立する。", nextHint: "「どこに行く？」と返すと弾む。", weight: 10 },
            { text: "人と会うのはちょっと…。", type: "short", npcReply: "あら…。じゃあ、また今度、気が向いたときに。", npcExpression: "neutral", explanation: "断っても、理由を添えれば失礼でない。", nextHint: "「また今度」を残すと、縁は続く。", weight: 10 }
          ]
        },
        {
          npcLine: "どっち方面が好き？ 川沿いとか、公園とか。", npcExpression: "smile",
          answers: [
            { text: "川沿いが好きです。景色が広くて気持ちいいので。", type: "good", npcReply: "いいね、川沿いは自分も好き。じゃあ土曜は川沿いコースにしよう。", npcExpression: "happy", explanation: "好みを伝えると、相手も一緒に楽しめる。", nextHint: "道中の予定も話すと続く。", weight: 10 },
            { text: "どっちでも。", type: "short", npcReply: "んー、じゃあ川沿いにしとくね。", npcExpression: "smile", explanation: "任せても成立するが、好みは残る。", nextHint: "「ある景色が好き」と添えると良い。", weight: 10 },
            { text: "道は疲れるので嫌です。", type: "short", npcReply: "じゃあ、コーヒーだけでも？ 無理はしないで。", npcExpression: "smile", explanation: "断る代わりに別の形を提案されやすい。", nextHint: "「コーヒーなら」と受け取ると続く。", weight: 10 }
          ]
        },
        {
          npcLine: "楽しみだな。最近、散歩してなかったからさ。", npcExpression: "smile",
          answers: [
            { text: "私も、話せる人がいて嬉しいです。最近、家と職場の往復だったので。", type: "good", npcReply: "そうか。たまには外に出ると、気分が変わるよ。", npcExpression: "happy", explanation: "率直な気持ちを開くと、距離が縮まる。", nextHint: "お互いの過ごし方を話すと深まる。", weight: 10 },
            { text: "楽しみです。", type: "short", npcReply: "うん、お天気だといいね。", npcExpression: "smile", explanation: "短い言葉でも、期待感は伝わる。", nextHint: "「何を期待する？」と聞くと続く。", weight: 10 },
            { text: "散歩って何が楽しいのか。", type: "short", npcReply: "おっと、それじゃ、何が楽しいか話し合おう。", npcExpression: "humorous", explanation: "素直な疑問も、言葉にすれば話題になる。", nextHint: "相手の楽しみを聞くと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、土曜の朝9時に。駅前の花壇の前ね。", npcExpression: "smile",
          answers: [
            { text: "はい、分かりました。楽しみにしてます。", type: "good", npcReply: "私も。じゃあ、また！", npcExpression: "happy", explanation: "具体的な約束を復唱すると、確実になる。", nextHint: "実際に会うと、信頼が深まる。", weight: 10 },
            { text: "はい、よろしくお願いします。", type: "short", npcReply: "うん、よろしくね。またね。", npcExpression: "smile", explanation: "短くても、約束は成立する。", nextHint: "「忘れないようにします」を添えると良い。", weight: 10 },
            { text: "（ぼんやり返事）", type: "bad", npcReply: "…聞こえたかな？ まあ、土曜にね。", npcExpression: "neutral", explanation: "気のない返事は、約束が危うくなる。", nextHint: "しっかり返すだけで信頼になる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_031", title: "昼どきの定食屋", category: "food", npcId: "npc_hanada", background: "dining",
      tags: ["food", "lunch", "daily"],
      context: "昼時、よく来る定食屋の花田さんに、今日のおすすめを聞かれました。",
      rounds: [
        {
          npcLine: "いらっしゃい！ 今日のお昼、どうする？", npcExpression: "smile",
          answers: [
            { text: "今日は生姜焼きの気分です。おすすめはあります？", type: "good", npcReply: "じゃあ、今日の生姜焼きはスープがついてるよ！ それにする？", npcExpression: "happy", explanation: "気分を伝えて聞くと、店主も合わせやすい。", nextHint: "「それでお願いします」と続けると良い。", weight: 10 },
            { text: "いつものお願いします。", type: "short", npcReply: "はいよ、いつものね！", npcExpression: "smile", explanation: "常連らしい短い注文も、十分通じる。", nextHint: "「今日も元気出そう」を添えると喜ばれる。", weight: 10 },
            { text: "（メニューを見て黙る）", type: "bad", npcReply: "…決まったら言ってね。", npcExpression: "neutral", explanation: "固まっていると、店主は気を遣う。", nextHint: "「まだ決めてます」と一言返すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "今日の生姜焼き、ちょっとだけ辛めに出来上がってるよ。", npcExpression: "smile",
          answers: [
            { text: "じゃあ、たまごをひとつお願いします。辛いのが少し苦手で。", type: "good", npcReply: "あいよ、たまごサービスしとくね。", npcExpression: "caring", explanation: "苦手を伝えると、相手は対応してくれる。", nextHint: "「助かります」を添えると良い。", weight: 10 },
            { text: "それで大丈夫です。", type: "short", npcReply: "ん、じゃあそのまま行くね。", npcExpression: "smile", explanation: "短い承諾でも、注文は通じる。", nextHint: "体調の話を添えると会話になる。", weight: 10 },
            { text: "辛いのは食べられません。", type: "short", npcReply: "あら、じゃあ辛さは抜いておこうか？", npcExpression: "caring", explanation: "断る代わりに要望を伝えると、解決しやすい。", nextHint: "「お願いします」で整う。", weight: 10 }
          ]
        },
        {
          npcLine: "ここのところ、仕事落ち着いてきた？", npcExpression: "smile",
          answers: [
            { text: "今日は午前で山が越えたので、ほっとしてます。", type: "good", npcReply: "そりゃよかった。ちゃんと食べて回復しなね。", npcExpression: "smile", explanation: "近況を伝えると、相手は気持ちよく寄り添う。", nextHint: "「応援ありがとう」と返すと温かい。", weight: 10 },
            { text: "ぼちぼちです。", type: "short", npcReply: "ぼちぼち、ね。無理はしないでよ。", npcExpression: "smile", explanation: "短いながら、気遣いは受け取れる。", nextHint: "「ありがとう」を添えると良い。", weight: 10 },
            { text: "話せる状態じゃないです。", type: "bad", npcReply: "…そうか。じゃあ黙って食べるのを応援しとく。", npcExpression: "neutral", explanation: "頑なに閉じると、相手も戸惑う。", nextHint: "「疲れてるだけ」と添えると伝わる。", weight: 10 }
          ]
        },
        {
          npcLine: "ごちそうさま、またね。今度、新作も出るから。", npcExpression: "smile",
          answers: [
            { text: "楽しみにしてます。また来ますね。", type: "good", npcReply: "うん、待ってるよ。新作、見に来てね。", npcExpression: "happy", explanation: "再来を約束すると、常連になれる。", nextHint: "実際に来ると、関係が深まる。", weight: 10 },
            { text: "ごちそうさまでした。", type: "short", npcReply: "はいよ、またいつでも。", npcExpression: "smile", explanation: "短い締めでも、店主は満足そう。", nextHint: "「おいしかった」を添えると好印象。", weight: 10 },
            { text: "（お金を置いて去る）", type: "bad", npcReply: "…あいよ。お気をつけて。", npcExpression: "neutral", explanation: "気配りに無反応だと、寂しい離れ方になる。", nextHint: "顔を見て一言あいさつすると良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_032", title: "新メニューの試食", category: "food", npcId: "npc_konno", background: "dining",
      tags: ["food", "new", "daytime"],
      context: "昼下がり、今野さんに新メニューの試食を勧められました。",
      rounds: [
        {
          npcLine: "お、いいところに！ 今週の新作『にら玉』、試食しない？", npcExpression: "bright",
          answers: [
            { text: "新作、楽しみにしてました。いただきます！", type: "good", npcReply: "おー、いいね！ じゃあ今日のサービスだ！", npcExpression: "happy", explanation: "期待を表すと、相手は張り切って応える。", nextHint: "感想を具体的に伝えると喜ばれる。", weight: 10 },
            { text: "すすめられたら断れないので。", type: "short", npcReply: "はは、正直だね。じゃあ勝手に置くよ。", npcExpression: "humorous", explanation: "軽いノリで乗れば、店主も嬉しい。", nextHint: "「楽しみ」を添えると弾む。", weight: 10 },
            { text: "今日は食欲がないので。", type: "short", npcReply: "あら…。じゃあ次回にとっておくよ。", npcExpression: "neutral", explanation: "断っても、理由があれば失礼ではない。", nextHint: "「また今度お願いします」を添えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "にら玉はね、たまごの半熟がポイントなんだ。", npcExpression: "bright",
          answers: [
            { text: "半熟、どうやってうまく作るんですか？", type: "good", npcReply: "フライパンを火からあげて、余熱で仕上げるのがコツさ。", npcExpression: "happy", explanation: "作り方に興味を示すと、店主は教えがいを感じる。", nextHint: "「家で試してみます」と続けると良い。", weight: 10 },
            { text: "へえ、そうなんですね。", type: "short", npcReply: "でしょ？ 家でも試してみな。", npcExpression: "smile", explanation: "短い相づちでも、話題は受け止められる。", nextHint: "「時間のあるときに」と返すと続く。", weight: 10 },
            { text: "半熟は生っぽくて嫌です。", type: "short", npcReply: "おっと、それならしっかり火を通すよ。好みは大事！", npcExpression: "smile", explanation: "好みを伝えると、相手も合わせられる。", nextHint: "「お願いします」で整う。", weight: 10 }
          ]
        },
        {
          npcLine: "味、どう？ 辛さは抑えたけど、どうかな。", npcExpression: "curious",
          answers: [
            { text: "すごくおいしいです。にらの香りとたまご、合ってます。", type: "good", npcReply: "よっしゃ、その言葉が欲しかった！ 今週の推しにしよう。", npcExpression: "happy", explanation: "具体的な感想は、相手の胸に響く。", nextHint: "「また食べに来ます」を添えると良い。", weight: 10 },
            { text: "おいしいです。", type: "short", npcReply: "それでいい、シンプルにそれでいいよ！", npcExpression: "happy", explanation: "短い感想でも、相手は満足する。", nextHint: "どこがおいしいか、足すとさらに良い。", weight: 10 },
            { text: "正直、口に合いませんでした。", type: "short", npcReply: "おっと、そうか。じゃあ次は別の味で研究するよ。", npcExpression: "neutral", explanation: "正直な感想は挑戦的だが、交流にはなる。", nextHint: "「好みはこうです」と具体化すると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "今日はありがとね。また新作できたら呼ぶから。", npcExpression: "bright",
          answers: [
            { text: "はい、楽しみにしてます。また来ますね。", type: "good", npcReply: "おう、狙って来てね！", npcExpression: "happy", explanation: "再来を約束すると、新作を楽しみにできる。", nextHint: "実際に来ると、常連に育てられる。", weight: 10 },
            { text: "ごちそうさまでした。", type: "short", npcReply: "はいよ、またね。", npcExpression: "smile", explanation: "短くても、新しい出会いが生まれる。", nextHint: "「おいしかった」を添えると好印象。", weight: 10 },
            { text: "（黙って会計）", type: "bad", npcReply: "…また来てくれよな。", npcExpression: "neutral", explanation: "気配りに無反応だと、店主は名残惜しい。", nextHint: "顔を見て一言あいさつすると良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_033", title: "甘味処のひととき", category: "food", npcId: "npc_kato", background: "dining",
      tags: ["food", "sweets", "shopping"],
      context: "買い物帰りに、甘味処の前で加藤さんに呼び止められました。",
      rounds: [
        {
          npcLine: "あ、買い物帰り？ 一緒に甘味どう？ ここ、絶品だから。", npcExpression: "humorous",
          answers: [
            { text: "あんみつ、いいですね。少し休みたい気分だったので。", type: "good", npcReply: "いい選択！ 私もさっき、これでひと息ついたところだよ。", npcExpression: "happy", explanation: "気分を伝えると、相手も一緒に過ごしやすい。", nextHint: "「何がおすすめ？」と聞くと弾む。", weight: 10 },
            { text: "じゃあ、お願いします。", type: "short", npcReply: "ようこそ！ 席、取っておくね。", npcExpression: "smile", explanation: "軽い承諾でも、ひとときが始まる。", nextHint: "「何がおいしい？」と聞くと続く。", weight: 10 },
            { text: "甘いものは苦手です。", type: "short", npcReply: "おっと、じゃあ団子は？ 塩味のもあるよ。", npcExpression: "humorous", explanation: "断る代わりに別の形を提案されやすい。", nextHint: "「それなら」と受け取ると続く。", weight: 10 }
          ]
        },
        {
          npcLine: "ここのクリームあんみつ、冷たいのと温かいのがあるんだ。", npcExpression: "humorous",
          answers: [
            { text: "どっちが人気なんですか？", type: "good", npcReply: "断然、温かい方が人気かな。ほっこりするんだよ。", npcExpression: "happy", explanation: "人気を聞くと、相手も語りたくなる。", nextHint: "「じゃあ温かいので」と続けると自然。", weight: 10 },
            { text: "じゃあ、温かいので。", type: "short", npcReply: "了解、温かいひとつ！ 私も合わせてもらおう。", npcExpression: "happy", explanation: "短い選択でも、注文は成立する。", nextHint: "「どんな味？」と聞くと弾む。", weight: 10 },
            { text: "考えてからにします。", type: "short", npcReply: "考えるのも、いいけど冷めるよー！ 冗談。", npcExpression: "humorous", explanation: "迷っても、相手は軽く受け止める。", nextHint: "「じゃあ、こっちで」と決めると続く。", weight: 10 }
          ]
        },
        {
          npcLine: "仕事はどう？ たまの息抜き、大事だよね。", npcExpression: "humorous",
          answers: [
            { text: "そうですね、今日はもう休むと決めてきたので。", type: "good", npcReply: "その決断、正解！ 甘いものは人生の潤滑油だよ。", npcExpression: "happy", explanation: "リラックスする決断を共有すると、場が和む。", nextHint: "「あなたはどう？」と返すと続く。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "でしょ？ 甘味は争いのない平和だ。", npcExpression: "smile", explanation: "短い同意でも、居心地は共有される。", nextHint: "「何を楽しみに？」と聞くと弾む。", weight: 10 },
            { text: "働かないといけないので。", type: "short", npcReply: "休むのも仕事のうちだよ。心を休めるんだ。", npcExpression: "neutral", explanation: "頑なな返しには、相手も言葉を選ぶ。", nextHint: "「たまには休みます」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "さて、そろそろ行こうか。また何か話したいときに来てよ。", npcExpression: "smile",
          answers: [
            { text: "はい、ありがとうございます。また来ますね。", type: "good", npcReply: "おう、待ってるよ。次は抹茶の話でもしよう！", npcExpression: "happy", explanation: "再訪を約束すると、続きが生まれる。", nextHint: "実際に来ると、話が弾む。", weight: 10 },
            { text: "ごちそうさまでした。", type: "short", npcReply: "はいよ、またね。", npcExpression: "smile", explanation: "短い締めでも、甘味の余韻は残る。", nextHint: "「おいしかった」を添えると好印象。", weight: 10 },
            { text: "（黙って立ち去る）", type: "bad", npcReply: "…あれ、急いでたのかな。また今度ね。", npcExpression: "neutral", explanation: "黙って去ると、相手は置いて行かれる。", nextHint: "一言返すだけで、次につながる。", weight: 10 }
          ]
        }
      ]
    },

    /* ============ 拡張バッチ3（feat/dialogue-content-expansion） ============
     * 各カテゴリをさらに増量（daily 15 / work 15 / food 13 ＝ 計43件）。 */

    {
      id: "scn_034", title: "雨の日の軒下", category: "daily", npcId: "npc_suzuki", background: "outdoor",
      tags: ["daily", "rain", "shelter"],
      context: "雨宿りをしていた軒下で、同じく雨宿りをする鈴木さんと出会いました。",
      rounds: [
        {
          npcLine: "あ…。雨が上がるまで、ここで待たせてもらいますね。", npcExpression: "shy",
          answers: [
            { text: "どうぞどうぞ。私も雨宿りしてたところです。", type: "good", npcReply: "そ、そうなんですか…。よかった、ひとりじゃなくて。", npcExpression: "smile", explanation: "同じ状況を共有すると、気まずさが和らぐ。", nextHint: "天気の話を続けると打ち解ける。", weight: 10 },
            { text: "こんにちは。", type: "short", npcReply: "こんにちは…。結構降ってきましたね。", npcExpression: "neutral", explanation: "短い挨拶でも、居合わせた者が繋がる。", nextHint: "「しばらくはやみそうにないですね」と添えると良い。", weight: 10 },
            { text: "（無言で反対の端へ移動する）", type: "bad", npcReply: "あ…（縮こまる）", npcExpression: "troubled", explanation: "避けられると、控えめな相手はますます縮こまる。", nextHint: "一言返すだけで良い印象になる。", weight: 10 }
          ]
        },
        {
          npcLine: "雨の音は、嫌いじゃないんですよ。静かになれるので。", npcExpression: "shy",
          answers: [
            { text: "わかります。人の声が消える時間、いいですよね。", type: "good", npcReply: "…そう、言ってもらえて、うれしいです。", npcExpression: "happy", explanation: "感性を共有できると、距離がぐっと近くなる。", nextHint: "好きな雨音を聞くと深まる。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "…同じように晴れの日が好きな人もいるんでしょうね。", npcExpression: "smile", explanation: "相づちでも、相手の心は通じる。", nextHint: "「私はこうです」を足すと続く。", weight: 10 },
            { text: "雨はやっぱり憂鬱です。", type: "short", npcReply: "あ…そうですか。人それぞれですね。", npcExpression: "neutral", explanation: "反対意見は、気弱な相手には伝わりにくい。", nextHint: "「あなたはどう？」と返すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "よかったら、傘なら…私、二本持ってるので、貸しましょうか？", npcExpression: "shy",
          answers: [
            { text: "ありがとうございます。お借りしてもいいですか？", type: "good", npcReply: "はい、どうぞ。…玄関先でいいので、返してくださいね。", npcExpression: "smile", explanation: "好意を受け取ると、相手は勇気を出せた甲斐がある。", nextHint: "「返しにいきます」と添えると安心させる。", weight: 10 },
            { text: "ありがとうございます。", type: "short", npcReply: "どうぞ。…雨に濡れないでくださいね。", npcExpression: "smile", explanation: "短い感謝でも、相手はほっとする。", nextHint: "「また返しに来ます」を添えると良い。", weight: 10 },
            { text: "大丈夫です、走って帰ります。", type: "short", npcReply: "…そうですか。お気をつけて。", npcExpression: "neutral", explanation: "断るのも自由だが、好意は温かく受け取りたい。", nextHint: "「気にかけてくれてありがとう」を添えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "どうやら上がってきましたね。…またどこかでお会いしたら。", npcExpression: "shy",
          answers: [
            { text: "はい、傘、必ず返します。またお会いしましょう。", type: "good", npcReply: "ええ…。ありがとうございます。それでは。", npcExpression: "happy", explanation: "約束を果たす意志は、関係を育てる。", nextHint: "実際に返すと、信頼に変わる。", weight: 10 },
            { text: "はい、お気をつけて。", type: "short", npcReply: "はい、お気をつけて。", npcExpression: "smile", explanation: "短い別れでも、雨宿りの縁は残る。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（黙って去る）", type: "bad", npcReply: "…（見送る）", npcExpression: "neutral", explanation: "言葉を残さず去ると、親切が報われない。", nextHint: "一言返すだけで、よい記憶に残る。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_035", title: "朝市での買い物", category: "daily", npcId: "npc_hanada", background: "outdoor",
      tags: ["daily", "shopping", "morning"],
      context: "朝市で野菜を買う花田さんに、選び方を相談されました。",
      rounds: [
        {
          npcLine: "おはよう！ 朝市の野菜、今日はどれも立派だね。", npcExpression: "smile",
          answers: [
            { text: "おはようございます。朝市に来ると、元気が出ますね。", type: "good", npcReply: "そうよね。日の光と野菜の色は、朝にぴったりね。", npcExpression: "happy", explanation: "共通の楽しみを言葉にすると、場が和む。", nextHint: "「何を買うんですか？」と聞くと続く。", weight: 10 },
            { text: "おはようございます。", type: "short", npcReply: "おはよう。今日はいい天気だね。", npcExpression: "smile", explanation: "短い挨拶でも、朝市は明るく始まる。", nextHint: "天気の話を足すと続きやすい。", weight: 10 },
            { text: "（会釈だけして通り過ぎる）", type: "bad", npcReply: "…朝から忙しいのかな。", npcExpression: "neutral", explanation: "挨拶を返さないと、土地の方も寂しい。", nextHint: "短くても返すと、縁が続く。", weight: 10 }
          ]
        },
        {
          npcLine: "トマト、どれがいいと思う？ こっちは粒が詰まってるんだ。", npcExpression: "smile",
          answers: [
            { text: "この、へたの緑が濃いのが新鮮そうです。", type: "good", npcReply: "へえ、さすがだね。その選び方、覚えたよ。", npcExpression: "happy", explanation: "根拠がある意見を出すと、相手は頼りになる。", nextHint: "実際の使う料理の話をすると弾む。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "だよね。じゃあ、お揃いにしようか。", npcExpression: "smile", explanation: "短い同意でも、選択は進む。", nextHint: "「新鮮に見えます」と足すと良い。", weight: 10 },
            { text: "よく分からないので。", type: "short", npcReply: "あら、そう？ じゃあ私の目で選ぶね。", npcExpression: "neutral", explanation: "無関心だと、相談が閉じてしまう。", nextHint: "「どっちがおすすめ？」と聞くと続く。", weight: 10 }
          ]
        },
        {
          npcLine: "帰ったら、これでサラダにしようと思ってるんだ。", npcExpression: "smile",
          answers: [
            { text: "それ、いいですね。私はトマトの冷製スープをよく作ります。", type: "good", npcReply: "冷製スープ？ それは今度教えてほしいな。", npcExpression: "happy", explanation: "自分の工夫を共有すると、話題が広がる。", nextHint: "レシピを語るときに盛り上がる。", weight: 10 },
            { text: "いいですね。", type: "short", npcReply: "でしょ？ 季節の味はやっぱり旬だよね。", npcExpression: "smile", explanation: "短い共感でも、前に進める。", nextHint: "「何と合わせる？」と聞くと続く。", weight: 10 },
            { text: "私はサラダはあんまり。", type: "short", npcReply: "あら、じゃあスープにしようかしら。", npcExpression: "neutral", explanation: "好みの違いを述べるのは自然だが、話題は閉じる。", nextHint: "好みを逆に話すと続く。", weight: 10 }
          ]
        },
        {
          npcLine: "そろそろ行くね。また朝市で会ったら声かけて。", npcExpression: "smile",
          answers: [
            { text: "はい、また。スープ、今度お裾分けしますね。", type: "good", npcReply: "それは楽しみ！ 待ってるわ。", npcExpression: "happy", explanation: "次の楽しみを約束すると、縁が続く。", nextHint: "実際に届けると信頼に変わる。", weight: 10 },
            { text: "はい、またお会いしましょう。", type: "short", npcReply: "またね。気をつけて帰って。", npcExpression: "smile", explanation: "短い別れでも、近所の縁は残る。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（返事もせず立ち去る）", type: "bad", npcReply: "…あら。じゃあ、またね。", npcExpression: "neutral", explanation: "約束を残さないと、再会は偶然次第に。", nextHint: "一言返すだけで良い印象。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_036", title: "犬の散歩", category: "daily", npcId: "npc_kato", background: "outdoor",
      tags: ["daily", "walk", "dog"],
      context: "公園で犬の散歩をしている加藤さんに会いました。",
      rounds: [
        {
          npcLine: "お！ こんにちは。この子、うちの『こはる』だよ。", npcExpression: "humorous",
          answers: [
            { text: "かわいいですね！ こはるちゃん、何歳なんですか？", type: "good", npcReply: "もう8歳になるんだよ。なのにまだ子犬みたいに走り回るんだ。", npcExpression: "happy", explanation: "相手の大切なものに興味を示すと、会話が弾む。", nextHint: "自分のペット経験を話すと続く。", weight: 10 },
            { text: "こんにちは、かわいいですね。", type: "short", npcReply: "でしょ？ 散歩してると、話しかけられやすいの、有名だよ。", npcExpression: "smile", explanation: "短い褒め言葉でも、相手は嬉しい。", nextHint: "「何犬？」と聞くと続く。", weight: 10 },
            { text: "（犬をじっと見て黙る）", type: "bad", npcReply: "…あれ、どうしたの？ 犬、怖い？", npcExpression: "neutral", explanation: "黙り込むと、相手は気を遣ってしまう。", nextHint: "一言「かわいいですね」で良い印象。", weight: 10 }
          ]
        },
        {
          npcLine: "こはるはね、この橋を渡るたびに、写真スポットで止まるんだよ。", npcExpression: "humorous",
          answers: [
            { text: "いいですね。こはるちゃんの定点観測、楽しそう。", type: "good", npcReply: "はは、そう！ 毎日の日課みたいなものだよ。", npcExpression: "happy", explanation: "相手の日常の面白さに乗ると、笑いが生まれる。", nextHint: "「今日はどんな顔？」と聞くと弾む。", weight: 10 },
            { text: "へえ。", type: "short", npcReply: "えへへ、犬って賢いんだよ。見てて楽しいしね。", npcExpression: "smile", explanation: "短い相づちでも、相手の話は受け止められる。", nextHint: "「よく見てるんですね」と続けると良い。", weight: 10 },
            { text: "犬の躾って大変ですよね。", type: "short", npcReply: "そうでもないよ。こはるは協力的だから。", npcExpression: "neutral", explanation: "話題を変えると、相手は一瞬止まる。", nextHint: "相手の話に戻ると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "散歩してると、いろんな人と話すきっかけになるんだよな。", npcExpression: "humorous",
          answers: [
            { text: "確かに。こはるちゃんが橋渡ししてくれてるんですね。", type: "good", npcReply: "そう！ 犬は最高のアイスブレイカーさ！", npcExpression: "happy", explanation: "相手の言葉を言葉遊びで返すと、場が弾む。", nextHint: "「今日は何かありました？」と聞くと続く。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "でしょ？ 今日も話しかけられてさ、楽しいんだ。", npcExpression: "smile", explanation: "短い同意でも、居心地は共有できる。", nextHint: "「どんな人と会いました？」と聞くと続く。", weight: 10 },
            { text: "私は犬を飼う気はないです。", type: "short", npcReply: "あら、それは残念。でも、わかるよ。責任あるしね。", npcExpression: "neutral", explanation: "断りの気持ちも、天気が和めば話題になる。", nextHint: "「でも、見てるのは好き」と添えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、こはるの休憩タイムだ。また会ったら、話そうね。", npcExpression: "smile",
          answers: [
            { text: "はい、また。こはるちゃん、元気でね。", type: "good", npcReply: "ありがと！ 伝えておくよ。", npcExpression: "happy", explanation: "ペットにも手を振ると、さらに縁が温まる。", nextHint: "実際に再会すると、話が弾む。", weight: 10 },
            { text: "はい、また。", type: "short", npcReply: "またね！ こはるもバイバイしてるよ。", npcExpression: "smile", explanation: "短い別れでも、犬との縁は続く。", nextHint: "「かわいかったです」を添えると好印象。", weight: 10 },
            { text: "（振り返らず去る）", type: "bad", npcReply: "…早足だな。まあ、いいか。", npcExpression: "neutral", explanation: "別れの言葉がないと、ふれあいが霞む。", nextHint: "一言返すだけで、次が変わる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_037", title: "締切前の助け合い", category: "work", npcId: "npc_yamada", background: "office",
      tags: ["work", "deadline", "help"],
      context: "締切間際の資料に追われている山田さんに、手伝いを申し出ました。",
      rounds: [
        {
          npcLine: "おっと、すまない。今、ちょっと手が離せなくて。", npcExpression: "neutral",
          answers: [
            { text: "何をお手伝いできますか？ 少しお手伝いしますよ。", type: "good", npcReply: "助かるよ。この表の数値の入れ替え、頼める？", npcExpression: "smile", explanation: "能動的に助けを申し出ると、相手は助かる。", nextHint: "具体的な仕事を引き受けると信頼になる。", weight: 10 },
            { text: "大丈夫ですか？", type: "short", npcReply: "ああ、なんとか。見ててくれれば十分さ。", npcExpression: "neutral", explanation: "気遣いだけでも、相手は孤立しない。", nextHint: "「何かあったら言って」と足すと良い。", weight: 10 },
            { text: "私にも手伝わせてくださいって、キツくないですか？", type: "short", npcReply: "いや、頼みすぎかも。すまない。", npcExpression: "neutral", explanation: "遠慮の出し方も、相手に負担をかけることがある。", nextHint: "「大丈夫です」と安心させると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "数値の入れ替えは、ミスしたら大変だから、慎重にお願い。", npcExpression: "neutral",
          answers: [
            { text: "承知しました。コピーを取ってから、1つずつ照合します。", type: "good", npcReply: "その手順、いいね。安心して任せられる。", npcExpression: "smile", explanation: "安全な手順まで述べると、任せてもらえる。", nextHint: "終わった連絡の仕方を決めると効率的。", weight: 10 },
            { text: "分かりました。", type: "short", npcReply: "うん、無理のない範囲でね。", npcExpression: "neutral", explanation: "短い承諾でも、役割は分担される。", nextHint: "「終わったら声かけます」を足すと良い。", weight: 10 },
            { text: "まあ、大丈夫でしょ。", type: "bad", npcReply: "いや、ここは慎重にいきたいんだ。" , npcExpression: "troubled", explanation: "軽いノリは、締切間際には怖がられる。", nextHint: "真剣さを伝えると信頼。", weight: 10 }
          ]
        },
        {
          npcLine: "助かった。これは本当に助かったよ。", npcExpression: "smile",
          answers: [
            { text: "お役に立ててよかったです。困ってるときは、いつでも声かけてください。", type: "good", npcReply: "そう言ってもらえると心強い。次は私が借りを返すよ。", npcExpression: "smile", explanation: "今後も助ける関係を伝えると、職場は強くなる。", nextHint: "お互いの得意分野を話すと弾む。", weight: 10 },
            { text: "どういたしまして。", type: "short", npcReply: "いや、かなり助かった。ありがとね。", npcExpression: "smile", explanation: "短い返しでも、恩は伝わる。", nextHint: "「いつでも」を添えると安心させる。", weight: 10 },
            { text: "（無言で自分の席へ戻る）", type: "bad", npcReply: "…（感謝の言葉に、返事が無くてやや寂しそう）", npcExpression: "neutral", explanation: "仕事は終わっても、人と人との間は残る。", nextHint: "一言返すだけでも、良い印象が残る。", weight: 10 }
          ]
        },
        {
          npcLine: "締切、これで乗り越えられそうだ。お礼に、今日はお茶でもごちそうするよ。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。じゃあ、遠慮なくお願いします。", type: "good", npcReply: "よし、じゃあ落ち着いたら行こう。", npcExpression: "happy", explanation: "好意を受け取ると、関係がギブアンドテイクになる。", nextHint: "行く時間を決めると確実。", weight: 10 },
            { text: "ありがとうございます。", type: "short", npcReply: "うん、またあとで声かけるよ。", npcExpression: "smile", explanation: "短い感謝でも、好意は受け取れる。", nextHint: "「楽しみにしてます」を添えると良い。", weight: 10 },
            { text: "お気遣いなく。", type: "short", npcReply: "そうか？ 気が向いたら、いつでも声かけてね。", npcExpression: "neutral", explanation: "断っても、深追いはしない配慮が残る。", nextHint: "「また今度」でつないでおくと良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_038", title: "お昼休みの雑談", category: "work", npcId: "npc_sato", background: "breakroom",
      tags: ["work", "lunch", "relax"],
      context: "お昼休み、休憩室で佐藤さんと雑談しました。",
      rounds: [
        {
          npcLine: "あれ、今日のお昼はコンビニ？ 毎日それじゃ飽きない？", npcExpression: "smile",
          answers: [
            { text: "たまには冷たい麺とか、気分で変えてます。", type: "good", npcReply: "気分で変えるのは大事だよね。私もこだわってるよ。", npcExpression: "smile", explanation: "自分の工夫を話すと、雑談が弾む。", nextHint: "「ナニ食べてるの？」と聞くと続く。", weight: 10 },
            { text: "そうですね、たまには。", type: "short", npcReply: "よかったら、今度一緒に食べよう。知ってるいい店があるよ。", npcExpression: "happy", explanation: "短い返しでも、誘いが生まれるきっかけになる。", nextHint: "「ぜひ」と返すと続く。", weight: 10 },
            { text: "自分の弁当の方が好きです。", type: "short", npcReply: "あら、手作り？ それはいいね。", npcExpression: "smile", explanation: "好みを言うのは自然。答えが返って続くことも。", nextHint: "「何を作るの？」と聞くと話が広がる。", weight: 10 }
          ]
        },
        {
          npcLine: "今日の午後は会議だから、ゆっくり休んでおきなね。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。議題を確認してから備えます。", type: "good", npcReply: "しっかりしてるね。それなら安心。", npcExpression: "smile", explanation: "備えを語ると、相手は頼もしくなる。", nextHint: "会議の要点を共有すると良い。", weight: 10 },
            { text: "分かりました。", type: "short", npcReply: "うん、ゆっくりね。", npcExpression: "smile", explanation: "短い承諾でも、気遣いは受け取れる。", nextHint: "「何を話すんですか？」と聞くと続く。", weight: 10 },
            { text: "会議は苦手です。", type: "short", npcReply: "あら、でも、誰もがそうだよ。焦らなくて大丈夫。", npcExpression: "caring", explanation: "本音を出すと、相手は励ましたくなる。", nextHint: "「共存策は？」と聞くと前向きに。", weight: 10 }
          ]
        },
        {
          npcLine: "そういえば、最近、何か楽しいことあった？", npcExpression: "smile",
          answers: [
            { text: "実は、朝の散歩を始めたんです。写真も撮ってます。", type: "good", npcReply: "へえ、いいね！ どんなの撮ってるの？", npcExpression: "curious", explanation: "自分から話題を出せると、雑談は深まる。", nextHint: "具体的な一枚を語ると弾む。", weight: 10 },
            { text: "特にないですね。", type: "short", npcReply: "そっか。じゃあ、これから作ればいいよ！", npcExpression: "smile", explanation: "短いながら、相手は前向きに返せる。", nextHint: "「何か探します」と返すと続く。", weight: 10 },
            { text: "楽しいことより、眠いことのほうが多いです。", type: "short", npcReply: "あはは、それも元気の証拠だよ。", npcExpression: "humorous", explanation: "軽いぼやきでも、受け止めてもらえる。", nextHint: "睡眠の話をすることで共感できる。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、そろそろ午後の準備だね。がんばろう！", npcExpression: "smile",
          answers: [
            { text: "はい、お互いがんばりましょう。", type: "good", npcReply: "うん、互いにね。また後で。", npcExpression: "happy", explanation: "前向きな締めは、午後の気分を整える。", nextHint: "「任せて」を添えると頼もしい。", weight: 10 },
            { text: "はい、おつかれさまです。", type: "short", npcReply: "うん、おつかれ。またあとで。", npcExpression: "smile", explanation: "短い労いでも、午後に切り替わる。", nextHint: "「ありがとう」を添えると温かい。", weight: 10 },
            { text: "（だるそうに立ち上がる）", type: "bad", npcReply: "…まあ、がんばろうね。", npcExpression: "neutral", explanation: "締めに元気がないと、周囲まで沈む。", nextHint: "一言前向きに返すと良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_039", title: "引継ぎ資料の相談", category: "work", npcId: "npc_tanaka", background: "office",
      tags: ["work", "handover", "daytime"],
      context: "引継ぎ資料のまとめ方について、田中さんに相談しました。",
      rounds: [
        {
          npcLine: "引継ぎ資料、どれくらい進んだ？", npcExpression: "neutral",
          answers: [
            { text: "目次まで書きました。中身の優先順位に迷ってます。", type: "good", npcReply: "目次は先に書けるから良いな。優先は「止まったら損」順だ。", npcExpression: "smile", explanation: "進捗と迷いを伝えると、相談が始められる。", nextHint: "「どんな順に書けば？」と聞くと続く。", weight: 10 },
            { text: "まだ手を付けてないです。", type: "short", npcReply: "…明日渡す予定だぞ。今日中に始められる？", npcExpression: "neutral", explanation: "進捗に遅れがあれば、早めに共有が大事。", nextHint: "今日できる量を言うと進む。", weight: 10 },
            { text: "ぼちぼちです。", type: "short", npcReply: "ぼちぼち？ 引継ぎは期限厳守だからな。", npcExpression: "neutral", explanation: "曖昧な返答だと、相手は確認しにくい。", nextHint: "割合で答えると伝わる。", weight: 10 }
          ]
        },
        {
          npcLine: "優先度は、『引き継いだ人が次に詰まるところ』を最優先にするといい。", npcExpression: "neutral",
          answers: [
            { text: "なるほど。じゃあ、まずトラブルの対応手順から書きます。", type: "good", npcReply: "その通り。手順書はトラブル起点で組むと読める。", npcExpression: "smile", explanation: "アドバイスを反映して進める姿勢が伝わる。", nextHint: "完成したら見せると信頼になる。", weight: 10 },
            { text: "そうですか。", type: "short", npcReply: "うん。頭からでなく、『困る順』で書くのがコツだ。", npcExpression: "neutral", explanation: "短い相づちでも、受け取ったら続けられる。", nextHint: "具体的に聞き返すと深まる。", weight: 10 },
            { text: "全部、時系列で書いてたので、変えられません。", type: "bad", npcReply: "読む人の立場で考え直してみな。", npcExpression: "troubled", explanation: "柔軟でないと、相手は助言を引っ込める。", nextHint: "「参考にします」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "あと、操作の画面コピーは、必ず日付を入れて残してね。", npcExpression: "neutral",
          answers: [
            { text: "はい、キャプチャに作成日を入れるかたちにします。", type: "good", npcReply: "それでいい。後から見たときに誰が分かる。", npcExpression: "smile", explanation: "具体的な対応を言うと、承認が得られる。", nextHint: "その場で一枚取ると確実。", weight: 10 },
            { text: "分かりました。", type: "short", npcReply: "うん。あとでチェックするから、残しておいて。", npcExpression: "neutral", explanation: "短い承諾でも、内容は伝わる。", nextHint: "「この形式でいいですか？」と確認すると良い。", weight: 10 },
            { text: "画面コピーって、なんのために取るんですか？", type: "short", npcReply: "証拠と手順の両方に要るんだ。聞いてくれてるのはいいね。", npcExpression: "smile", explanation: "素直な質問は、相手に関心を示すことになる。", nextHint: "「分かりました」で締めると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、今日中に一度、流れでも見せてくれ。", npcExpression: "neutral",
          answers: [
            { text: "はい、夕方に一度、通しで見ていただきます。", type: "good", npcReply: "OK。夕方は俺も空けておく。", npcExpression: "smile", explanation: "時間を約束すると、相手も段取りできる。", nextHint: "実際に見てもらって、さらに磨くと良い。", weight: 10 },
            { text: "了解です。", type: "short", npcReply: "うん、よろしく。", npcExpression: "neutral", explanation: "短い承諾でも、確認の予定は立つ。", nextHint: "「◯時ごろに」を足すと確実。", weight: 10 },
            { text: "まだ見せられる状態じゃないです。", type: "short", npcReply: "じゃあ、どこまでできたら見せられる？ 日時をくれ。", npcExpression: "neutral", explanation: "断るなら、代替の日時を示すと進む。", nextHint: "「夕方までに整えます」と区切ると良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_040", title: "打ち合わせの準備", category: "work", npcId: "npc_yamada", background: "office",
      tags: ["work", "meeting", "prep"],
      context: "午後、明日の打ち合わせ準備を山田さんと一緒に進めています。",
      rounds: [
        {
          npcLine: "明日の打ち合わせ、資料は揃ってる？", npcExpression: "neutral",
          answers: [
            { text: "はい、議題ごとに分けた資料を用意しました。", type: "good", npcReply: "議題別は見やすいね。じゃあ、順に確認しよう。", npcExpression: "smile", explanation: "整理済みを具体的に示すと、相手はすぐ確認できる。", nextHint: "不足に気づいたら、その場で足す。", weight: 10 },
            { text: "だいたい揃ってます。", type: "short", npcReply: "だいたい、ね。揃ってない分は何？", npcExpression: "neutral", explanation: "曖昧さは、相手に確認を強いる。", nextHint: "欠品を先に言うと良い。", weight: 10 },
            { text: "まだ全然です。", type: "short", npcReply: "…明日だろう。今何時だと思ってる？", npcExpression: "troubled", explanation: "遅れの共有なしだと、相手は驚く。", nextHint: "今すぐ着手する意志を伝える。", weight: 10 }
          ]
        },
        {
          npcLine: "では、初めの議題から。数字の根拠、ここに残ってる？", npcExpression: "neutral",
          answers: [
            { text: "はい、資料の3ページ目に、出典と計算式を入れました。", type: "good", npcReply: "根拠が頁で示せるのは、質が高いね。", npcExpression: "smile", explanation: "根拠の場所まで示すと、信頼が強まる。", nextHint: "相手が触れそうな箇所を先に見せる。", weight: 10 },
            { text: "根拠は口頭で話します。", type: "short", npcReply: "口頭は、あとで追えないから、残してくれ。", npcExpression: "neutral", explanation: "口頭だけでは、諾否が記録されない。", nextHint: "簡単にでもページを足すと良い。", weight: 10 },
            { text: "数字は、なんとなくです。", type: "bad", npcReply: "なんとなくは、打ち合わせでは通らないぞ。", npcExpression: "troubled", explanation: "根拠があいまいだと、成立しない。", nextHint: "一度、出どころを調べると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "明日は先方も緊張してる。こちらはリラックスしていこう。", npcExpression: "smile",
          answers: [
            { text: "そうですね。しっかり準備したので、落ち着いていきます。", type: "good", npcReply: "その態度が、一番相手を安心させるよ。", npcExpression: "smile", explanation: "準備と余裕を重ねると、仲間として頼もしい。", nextHint: "チームとしての役割を確認すると良い。", weight: 10 },
            { text: "緊張します。", type: "short", npcReply: "誰でも緊張はするよ。準備した分、大丈夫だ。", npcExpression: "caring", explanation: "率直な気持ちに、相手は寄り添える。", nextHint: "「助けてください」と添えると良い。", weight: 10 },
            { text: "別に緊張しません。", type: "short", npcReply: "そうか。それなら、むしろしっかり頼むよ。", npcExpression: "neutral", explanation: "強がりでも、役割は預けられる。", nextHint: "実際の役割を確認すると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、あとは当日だな。今夜はゆっくり休んで。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。明日、よろしくお願いします。", type: "good", npcReply: "ああ、こちらこそ。いい打ち合わせにしよう。", npcExpression: "smile", explanation: "明日への思いを共有すると、一体感が生まれる。", nextHint: "開始時間だけ確認すると落ち着く。", weight: 10 },
            { text: "おつかれさまです。", type: "short", npcReply: "おつかれ。あとは眠るだけだ。", npcExpression: "smile", explanation: "短い労いでも、一日が締まる。", nextHint: "「明日もよろしく」を添えると良い。", weight: 10 },
            { text: "（居眠りしそうな顔で去る）", type: "short", npcReply: "…早く帰って休めよ。", npcExpression: "neutral", explanation: "疲れは素直に表現を。相手は気づかう。", nextHint: "「ありがとう」を返すと良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_041", title: "昼のランチ相談", category: "food", npcId: "npc_konno", background: "dining",
      tags: ["food", "lunch", "recommend"],
      context: "昼時、今野さんの店で、今日のランチを相談しました。",
      rounds: [
        {
          npcLine: "お、昼ごはん！ 今日は何にしよっか？", npcExpression: "bright",
          answers: [
            { text: "今日はたっぷり食べたい気分です。おすすめは？", type: "good", npcReply: "なら、今日の二郎系ラーメンはボリューム満点だよ！", npcExpression: "happy", explanation: "気分に合わせて聞くと、店主も張り切る。", nextHint: "注文の相談まで行くと自然。", weight: 10 },
            { text: "お任せで。", type: "short", npcReply: "はいよ、お昼は頭を使ってるから、がっつり行こう！", npcExpression: "smile", explanation: "任せれば、店主も応える。", nextHint: "「何が出るか楽しみ」を添えると良い。", weight: 10 },
            { text: "（メニューとにらめっこ）", type: "short", npcReply: "迷ってるね！ わかるよ。今日は天丼、おすすめだ。", npcExpression: "smile", explanation: "迷いを察して、相手が助けてくれることも。", nextHint: "「じゃあそれで」と決めると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "今日の天丼、海老が2本入ってるよ。お得な日なんだ。", npcExpression: "bright",
          answers: [
            { text: "海老が2本！ それ、いいですね。いただきます。", type: "good", npcReply: "よし、天丼ひとつ！ 揚げたてを出すよ。", npcExpression: "happy", explanation: "具体的な魅力に反応すると、注文が楽しい。", nextHint: "「野菜も多い？」と聞くと弾む。", weight: 10 },
            { text: "じゃあ、それで。", type: "short", npcReply: "はいよ、天丼ね！ 待ってて。", npcExpression: "smile", explanation: "短い決定でも、注文は進む。", nextHint: "「楽しみにしてます」を添えると良い。", weight: 10 },
            { text: "海老は苦手なので、別ので。", type: "short", npcReply: "あら、じゃあかけそばにする？ それも美味しいよ。", npcExpression: "smile", explanation: "好みを伝えると、別案を出してもらえる。", nextHint: "「それで」で自然に決まる。", weight: 10 }
          ]
        },
        {
          npcLine: "腹ペコでしょ？ 食べてる今が、一番うれしそうだなあ。", npcExpression: "humorous",
          answers: [
            { text: "そうですか？ 確かに、昼ごはんは一番の楽しみです。", type: "good", npcReply: "わかる！ 俺も昼は待ち遠しくて仕方ないんだよ。", npcExpression: "happy", explanation: "共感し合うと、ランチタイムは賑やかになる。", nextHint: "「おすすめの食べ方」を聞くと続く。", weight: 10 },
            { text: "はい、おいしいです。", type: "short", npcReply: "でしょ？ うちの味は自信あるからね。", npcExpression: "smile", explanation: "短い満足でも、店主は報われる。", nextHint: "具体的な感想を添えると喜ばれる。", weight: 10 },
            { text: "仕事の合間なので、味わう余裕はないです。", type: "short", npcReply: "そっか。じゃあ、ここだけはゆっくりしてね。", npcExpression: "caring", explanation: "忙しさを伝えると、相手は気遣ってくれる。", nextHint: "「ありがとう」を添えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "ごちそうさま、またね。明日は違う『当たり』を用意して待ってるよ。", npcExpression: "bright",
          answers: [
            { text: "明日の当たり、気になります。また来ますね。", type: "good", npcReply: "その言葉、まってた！ 明日は特別に教えるよ。", npcExpression: "happy", explanation: "再来を約束すると、常連として育てられる。", nextHint: "実際に来ると、関係が深まる。", weight: 10 },
            { text: "ごちそうさまでした。", type: "short", npcReply: "はいよ、またいつでも！", npcExpression: "smile", explanation: "短い締めでも、明日への縁は残る。", nextHint: "「おいしかった」を添えると好印象。", weight: 10 },
            { text: "（黙って会計）", type: "bad", npcReply: "…また来てよ。", npcExpression: "neutral", explanation: "気配りに無反応だと、店主は名残惜しい。", nextHint: "顔を見て一言あいさつすると良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_042", title: "お惣菜の試食", category: "food", npcId: "npc_hanada", background: "dining",
      tags: ["food", "side", "taste"],
      context: "夕方、花田さんの店で、新作の惣菜を試食させてもらいました。",
      rounds: [
        {
          npcLine: "いらっしゃい！ 夕方ごはん、何にしよう？ 新作の味見、してみる？", npcExpression: "smile",
          answers: [
            { text: "新作、楽しみです。ぜひ味見させてください。", type: "good", npcReply: "じゃあ、これ。きんぴらごぼう、だけどこは、ちょっと甘めにしてみたの。", npcExpression: "happy", explanation: "試食に乗ると、相手も張り切る。", nextHint: "感想を具体的に伝えると喜ばれる。", weight: 10 },
            { text: "じゃあ、お願いします。", type: "short", npcReply: "はいよ、じゃあちょっとだけね。", npcExpression: "smile", explanation: "短い承諾でも、試食は始まる。", nextHint: "「どうおいしい？」と聞くと弾む。", weight: 10 },
            { text: "今日は買うだけなので。", type: "short", npcReply: "あら、そう？ じゃあ試食だけでもしていく？", npcExpression: "neutral", explanation: "断っても、相手は気さくに返せる。", nextHint: "「じゃあ、いただきます」とすると続く。", weight: 10 }
          ]
        },
        {
          npcLine: "甘めに作ってみたのはね、甘いと子供にも好評だからなの。", npcExpression: "smile",
          answers: [
            { text: "なるほど。家庭の味を意識したんですね。", type: "good", npcReply: "そうそう。忙しい家庭に寄り添いたいんだ。", npcExpression: "happy", explanation: "作り手の意図に共感すると、会話が深まる。", nextHint: "「どんな方に食べてほしい？」と聞くと続く。", weight: 10 },
            { text: "へえ、そうなんですね。", type: "short", npcReply: "でしょ？ 味って、ちょうどいい塩梅が難しいのよ。", npcExpression: "smile", explanation: "短い相づちでも、相手の思いは共有される。", nextHint: "「今日の塩梅はどう？」と聞くと続く。", weight: 10 },
            { text: "甘いのはちょっと…。", type: "short", npcReply: "あら、反対派もいるのね。じゃあ、しょっぱくもしてるよ。", npcExpression: "neutral", explanation: "好みを言っても、相手は別案を持っている。", nextHint: "「じゃあそっちを」と受けると続く。", weight: 10 }
          ]
        },
        {
          npcLine: "味、どう？ 砂糖を少し控えて、出汁で整えたのよ。", npcExpression: "curious",
          answers: [
            { text: "すごく上品な味です。出汁の香りがふわっとします。", type: "good", npcReply: "まあ、うれしい！ その表現、残しておくわ。", npcExpression: "happy", explanation: "具体的な感想は、作り手の胸に響く。", nextHint: "「何で出汁を取った？」と聞くと深まる。", weight: 10 },
            { text: "おいしいです。", type: "short", npcReply: "それなら、今週の定番にしようかな。", npcExpression: "smile", explanation: "短い感想でも、相手は満足する。", nextHint: "「おかずにぴったり」と添えると良い。", weight: 10 },
            { text: "好みじゃなかったです。", type: "short", npcReply: "あら、そう。じゃあ、もう一つの味を試してみる？", npcExpression: "neutral", explanation: "正直な感想も、次の案に続ける。", nextHint: "「お願いします」で前に進む。", weight: 10 }
          ]
        },
        {
          npcLine: "今日は味見に付き合ってくれて、ありがとう。また来てね。", npcExpression: "smile",
          answers: [
            { text: "こちらこそ、ありがとうございます。新作、楽しみにしてます。", type: "good", npcReply: "じゃあ、出来上がったら教えるから来てね。", npcExpression: "happy", explanation: "再訪を約束すると、新作の縁が続く。", nextHint: "実際に来ると、常連になる。", weight: 10 },
            { text: "ごちそうさまでした。", type: "short", npcReply: "はいよ、また。", npcExpression: "smile", explanation: "短い締めでも、交流は残る。", nextHint: "「おいしかった」を添えると好印象。", weight: 10 },
            { text: "（黙って立ち去る）", type: "bad", npcReply: "…あら。じゃあ、またね。", npcExpression: "neutral", explanation: "感想を残さず去ると、相手は損をする。", nextHint: "一言返すだけで、作り手は報われる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_043", title: "食料品店での出会い", category: "food", npcId: "npc_nakamura", background: "dining",
      tags: ["food", "shopping", "talk"],
      context: "直売所で食材を選んでいた中村さんに、話しかけられました。",
      rounds: [
        {
          npcLine: "あれ、ここで会うんですね。ここの野菜は新鮮で、よく来るんですよ。", npcExpression: "curious",
          answers: [
            { text: "そうなんですね。私も最近、ここをよく使ってます。", type: "good", npcReply: "じゃあ、まさに常連ですね！ おすすめありますよ。", npcExpression: "curious", explanation: "共通の場所があると、話が弾む。", nextHint: "「何がおすすめ？」と聞くと続く。", weight: 10 },
            { text: "ええ、たまに来ます。", type: "short", npcReply: "たまたま会えてよかった。何を買いに来ました？", npcExpression: "smile", explanation: "短い返しでも、きっかけは残る。", nextHint: "「おすすめあります？」と聞くと続く。", weight: 10 },
            { text: "（会釈だけして離れる）", type: "bad", npcReply: "…ああ、ごめんなさい。邪魔でしたね。", npcExpression: "neutral", explanation: "避けられると、相手は引けてしまう。", nextHint: "一言返すだけで、出会いが続く。", weight: 10 }
          ]
        },
        {
          npcLine: "この直売所、品物が代わるのが早いから、足繁く通わないといけないんですよ。", npcExpression: "curious",
          answers: [
            { text: "それで新鮮なんですね。何日おきに来られてます？", type: "good", npcReply: "週に3回は来てるかな。それでも売り切れてることが多いんです。", npcExpression: "curious", explanation: "相手の習慣に興味を示すと、話が続く。", nextHint: "「一緒に来る？」と誘っても良い。", weight: 10 },
            { text: "へえ、そうなんですね。", type: "short", npcReply: "だから、見つけたら買い！なんですよ。", npcExpression: "smile", explanation: "短い相づちでも、情報は受け止められる。", nextHint: "「今、何を買いに？」と聞くと続く。", weight: 10 },
            { text: "買い物は週末だけです。", type: "short", npcReply: "じゃあ、週末は品薄かもですね。早めがいいですよ。", npcExpression: "neutral", explanation: "自分の状況に話を向けると、相手も合わせる。", nextHint: "「じゃあ今日買っておく」と続けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "今日の青菜、見てください。葉っぱの色が濃いでしょう？", npcExpression: "curious",
          answers: [
            { text: "本当に鮮やかですね。何か違いがあるんですか？", type: "good", npcReply: "朝採りで、水のやり方にも気を使ってるらしいですよ。", npcExpression: "happy", explanation: "相手が見せたいポイントに興味を示すと、喜ぶ。", nextHint: "「色で選ぶんですか？」と聞くと深まる。", weight: 10 },
            { text: "そんな気がします。", type: "short", npcReply: "ですよね。目で買うのが、いちばん確かです。", npcExpression: "smile", explanation: "短い同意でも、相手は満足する。", nextHint: "「どれを買ったらいい？」と聞くと続く。", weight: 10 },
            { text: "野菜は見た目がわからないんで。", type: "short", npcReply: "あら、じゃあ、今度は一緒に選びましょ。", npcExpression: "smile", explanation: "苦手を伝えると、相手は提案してくれる。", nextHint: "「その時はお願いします」と受けると続く。", weight: 10 }
          ]
        },
        {
          npcLine: "そろそろ、選別して帰ります。またここで会えたら、教えてくださいね。", npcExpression: "smile",
          answers: [
            { text: "はい、また。おすすめの野菜、ありがとうございました。", type: "good", npcReply: "どういたしまして。また会ったら、鮮度の話をしましょう！", npcExpression: "happy", explanation: "再会を約束すると、買い物が楽しくなる。", nextHint: "実際に会うと、常連同士で楽しい。", weight: 10 },
            { text: "はい、また。お気をつけて。", type: "short", npcReply: "ありがとうございます。またね。", npcExpression: "smile", explanation: "短い別れでも、縁は残る。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（返事もせず立ち去る）", type: "bad", npcReply: "…あ、待って、おすすめだけでも。", npcExpression: "neutral", explanation: "黙って去ると、親切が失われる。", nextHint: "一言返すだけで、情報を貰える。", weight: 10 }
          ]
        }
      ]
    },

    /* ============ 拡張バッチ4（feat/dialogue-content-expansion） ============
     * 各カテゴリを増量（daily 18 / work 18 / food 17 ＝ 計53件）。夜・縁日・居酒屋など
     * 時間帯バリエーションを追加（酒会・黒場は夜のみのルールを維持）。 */

    {
      id: "scn_044", title: "図書館での出会い", category: "daily", npcId: "npc_nakamura", background: "outdoor",
      tags: ["daily", "library", "talk"],
      context: "地域の図書館で、同じ本を手にした中村さんと顔を合わせました。",
      rounds: [
        {
          npcLine: "あれ、それ、私も借りようか迷ってた本です。", npcExpression: "curious",
          answers: [
            { text: "そうなんですか？ よかったら、貸しますよ。読み終わったら。", type: "good", npcReply: "本当ですか？ じゃあ、そのときに感想も聞かせてください。", npcExpression: "happy", explanation: "貸し借りの約束は、出会いを続けるきっかけになる。", nextHint: "読んだら感想を語ると弾む。", weight: 10 },
            { text: "こういう本、好きなんですか？", type: "good", npcReply: "はい、最近は推理ものが多くて。この辺の棚を渡り歩いてます。", npcExpression: "curious", explanation: "相手の好みに興味を示すと、会話が続く。", nextHint: "「おすすめは？」と聞くと弾む。", weight: 10 },
            { text: "（黙って本を棚に戻す）", type: "bad", npcReply: "あ、いや、すみません。気使わせました？", npcExpression: "neutral", explanation: "引き下がると、相手は落ち着かなくなる。", nextHint: "一言返すだけで出会いが続く。", weight: 10 }
          ]
        },
        {
          npcLine: "ここの図書館、新刊の入りが早いから、よく来るんですよ。", npcExpression: "curious",
          answers: [
            { text: "へえ、じゃあ新刊コーナーは逃さないんですね。", type: "good", npcReply: "そうなんです。予約もしてますけど、やっぱり店頭で見つけるのが好きで。", npcExpression: "smile", explanation: "相手の習慣に共感すると、距離が縮まる。", nextHint: "「何を予約してるの？」と聞くと続く。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "特に金曜の入りがいいんですよ。", npcExpression: "smile", explanation: "短い相づちでも、情報は受け取れる。", nextHint: "「金曜に来ると良いんですね」と足すと良い。", weight: 10 },
            { text: "図書館はちゃんと予約していく派です。", type: "short", npcReply: "ああ、確実ですね。私と逆ですね。", npcExpression: "smile", explanation: "違いを話しても、相手は面白がる。", nextHint: "「使い分けてます」と続けると弾む。", weight: 10 }
          ]
        },
        {
          npcLine: "読み物って、その日の気分で変わりますよね。", npcExpression: "curious",
          answers: [
            { text: "本当にそうですね。今日は気持ちを軽くしたくて、こちらを選びました。", type: "good", npcReply: "わかります。私は逆に、じっくり読みたくなる日があって。", npcExpression: "smile", explanation: "気分の話を共有すると、読書の話は広がる。", nextHint: "「今日はどんな気分でした？」と聞くと深まる。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "でしょ？ 本って、相手を選びますよね。", npcExpression: "smile", explanation: "短い同意でも、会話は前に進む。", nextHint: "「選んでる本」を話題にすると続く。", weight: 10 },
            { text: "私は本は全部、通勤のときだけです。", type: "short", npcReply: "通勤読書、いいですね。時間がその日なってるんですね。", npcExpression: "smile", explanation: "習慣を語ると、相手も興味を持つ。", nextHint: "「どんな本を読む？」と聞くと深まる。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、私はこれを借りて帰ります。また、ここの棚で会ったら。", npcExpression: "smile",
          answers: [
            { text: "はい、また。借りた本、読み終わったらお伝えしますね。", type: "good", npcReply: "ぜひ！ 楽しみにしてます。ではまた。", npcExpression: "happy", explanation: "次に会う約束が読書の楽しみに繋がる。", nextHint: "実際に読んで感想を語ると深まる。", weight: 10 },
            { text: "はい、また。", type: "short", npcReply: "また、誰かが本を探す隣で会いましょう。", npcExpression: "smile", explanation: "短い別れでも、本棚の縁は残る。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（振り返りもせず立ち去る）", type: "bad", npcReply: "…あ、そうだメモを。（名残惜しそう）", npcExpression: "neutral", explanation: "言葉を残さず去ると、出会いが消える。", nextHint: "一言返すだけで、次の縁に繋がる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_045", title: "花火大会の帰り", category: "daily", npcId: "npc_suzuki", background: "outdoor",
      tags: ["daily", "festival", "night"],
      context: "花火大会の帰り道、同じ方向へ歩く鈴木さんと合流しました。",
      rounds: [
        {
          npcLine: "あ、おつかれさまです。…きれいでしたね、花火。", npcExpression: "shy",
          answers: [
            { text: "本当にきれいでした。最後の連発、すごかったですね。", type: "good", npcReply: "はい…。あの、音が胸に響く感じが、いいです。", npcExpression: "smile", explanation: "同じ感動を言葉にすると、一体感が生まれる。", nextHint: "お気に入りの一発を聞くと弾む。", weight: 10 },
            { text: "そうですね、きれいでした。", type: "short", npcReply: "見られて、よかったです。", npcExpression: "smile", explanation: "短い同意でも、出会いは温かい。", nextHint: "「帰り道、一緒に」と続けると良い。", weight: 10 },
            { text: "人ごみは疲れました。", type: "short", npcReply: "あ、それは…。足元、お気をつけて。", npcExpression: "neutral", explanation: "疲れの話は自然だが、返しは難しい。", nextHint: "「でも見られて良かった」と足すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "帰りは駅まで、この道でいいんですか？ 電灯が少ないですが。", npcExpression: "shy",
          answers: [
            { text: "そうです。途中までご一緒してもいいですか？", type: "good", npcReply: "はい、ぜひ。…暗いのは、少し怖いので。", npcExpression: "smile", explanation: "同行を頼むと、相手も安心する。", nextHint: "「駅まで何本かある」と話すと続く。", weight: 10 },
            { text: "大丈夫です、慣れてます。", type: "short", npcReply: "よかったです。それなら安心しました。", npcExpression: "smile", explanation: "頼りになる返しは、相手も安心させる。", nextHint: "「一緒に帰りましょう」を足しても良い。", weight: 10 },
            { text: "そこに誰がいるか分かりませんし、結構です。", type: "short", npcReply: "あ…はい。そうですよね。失礼しました。", npcExpression: "troubled", explanation: "警戒を出すと、相手は引いてしまう。", nextHint: "「暗いですよね」と受けて続けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "花火は、小さいころから好きなんですよ。家族で見てたので。", npcExpression: "shy",
          answers: [
            { text: "いいですね。思い出がいっぱいあるんですね。", type: "good", npcReply: "…はい。今はひとりですが、見るときはここに来てます。", npcExpression: "smile", explanation: "思い出に共感すると、相手は心を開く。", nextHint: "「ここはいい場所ですね」と返すと続く。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "はい。…今日も、いい思い出になりそうです。", npcExpression: "smile", explanation: "短い相づちでも、相手の思いは受け止められる。", nextHint: "「今日はどうでした？」と聞くと深まる。", weight: 10 },
            { text: "花火は好きじゃないので、よくわからないです。", type: "short", npcReply: "あ…そうですか。では、その話はここまでに。", npcExpression: "neutral", explanation: "否定すると、相手は話を閉じる。", nextHint: "「でもきれいでしたね」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "あ、駅が見えてきましたね。今日は、ありがとうございました。", npcExpression: "shy",
          answers: [
            { text: "こちらこそ、ありがとうございました。またどこかで。", type: "good", npcReply: "はい…。また、何かの帰りに会えたら。", npcExpression: "happy", explanation: "感謝と再会の言葉は、出会いを温める。", nextHint: "「また一緒に帰りましょう」を添えると良い。", weight: 10 },
            { text: "はい、おやすみなさい。", type: "short", npcReply: "おやすみなさい。お気をつけて。", npcExpression: "smile", explanation: "短い別れでも、夜の縁は優しく閉じる。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（無言で改札へ向かう）", type: "bad", npcReply: "─（少し寂しそうに駅へ）", npcExpression: "neutral", explanation: "言葉を残さず別れると、夜は明け方が変わる。", nextHint: "一言返すだけで、出会いが輝く。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_046", title: "縁日でくじ引き", category: "daily", npcId: "npc_kato", background: "outdoor",
      tags: ["daily", "festival", "game"],
      context: "縁日のくじ引き台で、加藤さんと勝負しました。",
      rounds: [
        {
          npcLine: "お、挑戦する？ くじはね、目を閉じて引くのがコツだよ。", npcExpression: "humorous",
          answers: [
            { text: "へえ、どういうことですか？ 面白いですね。", type: "good", npcReply: "目で選ぶと迷うけど、手は正直だからね！", npcExpression: "humorous", explanation: "相手のコツに興味を示すと、縁日は賑やかになる。", nextHint: "「じゃあ目を閉じて引く」と乗ると弾む。", weight: 10 },
            { text: "じゃあ、やってみます。", type: "short", npcReply: "よし、勝負だ！ 俺が先に引くね。", npcExpression: "happy", explanation: "軽いノリで乗れば、遊びは始まる。", nextHint: "結果を比べると盛り上がる。", weight: 10 },
            { text: "大人がくじは、ちょっと恥ずかしいです。", type: "short", npcReply: "恥ずかしいことないよ！ 縁日はみんなで遊ぶんだ。", npcExpression: "humorous", explanation: "遠慮を言っても、相手は誘い込んでくれる。", nextHint: "「じゃあ一回だけ」と付き合うと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "俺は…えっと、三等！ せんべいだ！ 嬉しい！", npcExpression: "happy",
          answers: [
            { text: "三等、いいですね！ じゃあ、私、何が出るかな…。", type: "good", npcReply: "お、目を閉じて…ほら、引いて！ ", npcExpression: "humorous", explanation: "相手の喜びに乗ると、一緒に盛り上がれる。", nextHint: "引いた結果で、さらに語り合う。", weight: 10 },
            { text: "おめでとうございます！", type: "short", npcReply: "ありがとう！ じゃあ、このせんべい、半分こどう？", npcExpression: "happy", explanation: "短い祝いでも、相手は共有したくなる。", nextHint: "「それ、いいですね」と受けると続く。", weight: 10 },
            { text: "（無言でくじを引く）", type: "bad", npcReply: "おー、何々？ え、" , npcExpression: "neutral", explanation: "反応がないと、楽しさが伝わらない。", nextHint: "「楽しみだな」と口にすると弾む。", weight: 10 }
          ]
        },
        {
          npcLine: "俺の三等は、今日の縁日で一番嬉しかったなあ。", npcExpression: "humorous",
          answers: [
            { text: "一等より心に残るって、いいですね。", type: "good", npcReply: "だろ？ 縁日は、こういう小さい幸せが詰まってるんだ。", npcExpression: "happy", explanation: "相手の価値観に共感すると、思い出が膨らむ。", nextHint: "「今度は何を狙う？」と聞くと続く。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "縁日はいいなあ。年イチだから、積もるのが嬉しいんだ。", npcExpression: "smile", explanation: "短い同意でも、相手は語り続ける。", nextHint: "「何年通ってる？」と聞くと弾む。", weight: 10 },
            { text: "私は一等が欲しかったです。", type: "short", npcReply: "欲張りすぎ！ でも、そういうのも縁日の楽しみだよ。", npcExpression: "humorous", explanation: "欲を言っても、相手は軽く返す。", nextHint: "「じゃあ来年まで練習」と返すと弾む。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、俺は屋台を回って帰るね。またどこかで！", npcExpression: "smile",
          answers: [
            { text: "はい、ありがとうございます。縁日、楽しかったです。", type: "good", npcReply: "こちらこそ！ くじの話、またしようね。", npcExpression: "happy", explanation: "感謝と感想は、縁日を良い思い出にする。", nextHint: "「また来年」を約束すると続く。", weight: 10 },
            { text: "はい、また。", type: "short", npcReply: "またな！ くじの腕は磨いておけよ！", npcExpression: "smile", explanation: "短い別れでも、来年の縁が残る。", nextHint: "「来年、勝負だ」を添えると弾む。", weight: 10 },
            { text: "（振り返らず去る）", type: "bad", npcReply: "…あれ、急いでる？ まあ、いいか。", npcExpression: "neutral", explanation: "黙って去ると、縁日の余韻が薄まる。", nextHint: "一言返すだけで、良い思い出になる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_047", title: "作業の割り振り", category: "work", npcId: "npc_tanaka", background: "office",
      tags: ["work", "allocation", "daytime"],
      context: "午後、新しい作業の割り振りを田中さんと相談しました。",
      rounds: [
        {
          npcLine: "次の仕事、3つある。どれでも好きな方を選んでいいよ。", npcExpression: "neutral",
          answers: [
            { text: "それでは、時間のかかる案件を引き受けます。", type: "good", npcReply: "時間のかかる方を、自分から？ いい度胸だ。任せた。", npcExpression: "smile", explanation: "負荷を進んで担うと、信頼が増す。", nextHint: "「残り担当は決まってますか？」と確認すると良い。", weight: 10 },
            { text: "じゃあ、こちらのを。", type: "short", npcReply: "OK。じゃあ残りは俺が回すね。", npcExpression: "neutral", explanation: "短い選択でも、割り振りは進む。", nextHint: "「期日はいつですか？」と確認すると良い。", weight: 10 },
            { text: "どれでもいいんで、決めてください。", type: "short", npcReply: "自分で選ばないと、後で不出来になっても困るぞ。", npcExpression: "neutral", explanation: "丸投げは、責任を持ちにくくなる。", nextHint: "「じゃあこれを」と一つ選ぶと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "ちなみに、どの案件も期限は金曜だ。急がない方はないよ。", npcExpression: "neutral",
          answers: [
            { text: "金曜ですね。では、明日から着手して、木曜までに仕上げます。", type: "good", npcReply: "それでいい。木曜に一度、途中を見せてくれ。", npcExpression: "smile", explanation: "着手と期限を明示すると、相手は安心する。", nextHint: "途中確認の予定まで決めると良い。", weight: 10 },
            { text: "了解です。", type: "short", npcReply: "うん、よろしく。", npcExpression: "neutral", explanation: "短い承諾でも、期限は伝わる。", nextHint: "「木曜に一度見せます」を足すと良い。", weight: 10 },
            { text: "金曜までに、全部終わるか不安です。", type: "short", npcReply: "不安なら、今日できる分から始めよう。", npcExpression: "caring", explanation: "不安を口にすると、相手は区切りを提案できる。", nextHint: "「じゃあ今日からやります」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "割り振りは、他の人の負荷も考えると、進め方も変わるよ。", npcExpression: "neutral",
          answers: [
            { text: "そうですね。私が時間のかかる方を取ったのも、周りに合わせてです。", type: "good", npcReply: "その考え方は、いいね。チームが助かる。", npcExpression: "smile", explanation: "チーム視点を語ると、相手は頼もしくなる。", nextHint: "「他に手伝えることは？」と聞くとさらに良い。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "うん、一人で抱え込むなよ。", npcExpression: "neutral", explanation: "短い相づちでも、割り振りの意味は伝わる。", nextHint: "「聞いてよかったです」を添えると良い。", weight: 10 },
            { text: "周りは関係ないと思います。", type: "short", npcReply: "いや、仕事はみんなで回すものだよ。", npcExpression: "neutral", explanation: "孤立した考えは、チームとズレる。", nextHint: "「一緒に回します」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、明日から進めて、木曜の午前中に見せてくれ。", npcExpression: "neutral",
          answers: [
            { text: "はい、木曜の午前中に、途中を見ていただきます。", type: "good", npcReply: "OK。それまでに、形になるもので頼む。", npcExpression: "smile", explanation: "確認の約束を復唱すると、確実になる。", nextHint: "実際に見せると、信頼が育つ。", weight: 10 },
            { text: "了解です。", type: "short", npcReply: "うん、よろしく。", npcExpression: "neutral", explanation: "短い承諾でも、取り決めは成立。", nextHint: "「木曜の◯時ごろ」を足すと確実。", weight: 10 },
            { text: "（曖昧にうなずく）", type: "bad", npcReply: "けがした顔だな。本当にわかってる？", npcExpression: "troubled", explanation: "賛同だけでは、確認をしにくい。", nextHint: "「◯時に見せます」と返すと良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_048", title: "クレーム対応の報告", category: "work", npcId: "npc_yamada", background: "office",
      tags: ["work", "report", "daytime"],
      context: "対応したクレームの報告を、山田さんにしています。",
      rounds: [
        {
          npcLine: "クレームの件、対応したんだって？ どうだった？", npcExpression: "neutral",
          answers: [
            { text: "はい、お客さまにお詫びし、原因の調査まで進めました。", type: "good", npcReply: "そこまでやったか。全体として、うまくいったんだな。", npcExpression: "smile", explanation: "事実を順に述べると、報告は伝わりやすい。", nextHint: "対応の流れを一言で締めると良い。", weight: 10 },
            { text: "なんとか落ち着きました。", type: "short", npcReply: "落ち着いた、だけだと、原因は？", npcExpression: "neutral", explanation: "締めくくりだけでは、再発防止に届かない。", nextHint: "原因と対策を先に言うと良い。", weight: 10 },
            { text: "まだ解決してないです。", type: "short", npcReply: "…それは、まだ報告が早いね。もう少し進めてから来て。", npcExpression: "troubled", explanation: "未解決のままの報告は、確度が低い。", nextHint: "「◯時までに調査します」と区切ると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "原因は、どこにあると見立ててる？", npcExpression: "neutral",
          answers: [
            { text: "入力ミスの可能性が高いです。該当箇所を確認中です。", type: "good", npcReply: "その見立てなら、早めに確実にできる。確認を急ごう。", npcExpression: "smile", explanation: "見立てと根拠を結ぶと、信頼される。", nextHint: "確認後の報告を約束すると良い。", weight: 10 },
            { text: "まだ分かってないです。", type: "short", npcReply: "じゃあ、まず探す優先順を決めよう。", npcExpression: "neutral", explanation: "未確定でも、次にやることは返せる。", nextHint: "優先順を言うと進む。", weight: 10 },
            { text: "なぜか、よく分からないんですが、直りました。", type: "bad", npcReply: "原因不明が、再発に繋がるんだ。調べよう。", npcExpression: "troubled", explanation: "原因を追わないと、再発は防げない。", nextHint: "ログや手順を確認するのは惜しくない。", weight: 10 }
          ]
        },
        {
          npcLine: "クレームは、正直に受けて、早く謝るのがいちばん大事だ。", npcExpression: "neutral",
          answers: [
            { text: "そうですね。今回は、早く謝れたので、怒りも収まりました。", type: "good", npcReply: "それが正しい。誤魔化さず謝ると、次は信頼になる。", npcExpression: "smile", explanation: "対応を振り返えると、学びが固まる。", nextHint: "「次からは最初に謝ります」と続けると良い。", weight: 10 },
            { text: "そうですよね。", type: "short", npcReply: "うん。クレームは、実は信頼を返すチャンスだよ。", npcExpression: "neutral", explanation: "短い同意でも、相手の言葉は残る。", nextHint: "「言われてみればそうです」と足すと良い。", weight: 10 },
            { text: "謝りすぎると、不利になるのでは？", type: "short", npcReply: "それは誤解だ。謝るのは誠意で、不利にはならない。", npcExpression: "neutral", explanation: "疑問を出しても、相手は丁寧に説明する。", nextHint: "「分かりました」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、原因の確認が終わったら、また報告して。", npcExpression: "neutral",
          answers: [
            { text: "はい、確認し次第、すぐ報告します。", type: "good", npcReply: "うん、それを待ってる。", npcExpression: "smile", explanation: "報告の約束をすると、次に進める。", nextHint: "「◯時ごろには整います」と添えると良い。", weight: 10 },
            { text: "了解です。", type: "short", npcReply: "うん、よろしく。", npcExpression: "neutral", explanation: "短い承諾でも、報告の期待は伝わる。", nextHint: "「終わったらすぐ」を足すと確実。", weight: 10 },
            { text: "（生返事で立ち去る）", type: "bad", npcReply: "…おい、報告忘れるなよ。", npcExpression: "neutral", explanation: "気のない返事は、報告を危うくする。", nextHint: "「必ずします」と返すと安心させる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_049", title: "初めての出張", category: "work", npcId: "npc_sato", background: "office",
      tags: ["work", "business", "talk"],
      context: "初めての出張を控え、佐藤さんに準備の話を聞かれました。",
      rounds: [
        {
          npcLine: "来週、出張だって？ 初めてか。何か不安なことはある？", npcExpression: "smile",
          answers: [
            { text: "実は、新幹線の乗り換えが不安で、予行演習してみました。", type: "good", npcReply: "予行演習？ しっかりしてるね。それなら大丈夫よ。", npcExpression: "happy", explanation: "不安を具体的に語ると、相手は安心して共同体に。", nextHint: "「乗り換えは何分空ける？」と聞くと深まる。", weight: 10 },
            { text: "まあ、なんとかなると思います。", type: "short", npcReply: "その余裕が、一番の武器だね。", npcExpression: "smile", explanation: "短い返しでも、不安は受け止められる。", nextHint: "「持ち物は確認しました？」と足すと良い。", weight: 10 },
            { text: "初めてなので、正直、不安です。", type: "short", npcReply: "それは誰でもそうよ。初日は、とにかく間に合わせれば十分。", npcExpression: "caring", explanation: "素直な不安に、相手は寄り添ってくれる。", nextHint: "「そんなに大きくないですよね？」と聞くと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "出張の宿は、駅近くがいいよ。朝の移動が楽だから。", npcExpression: "smile",
          answers: [
            { text: "駅から3分のところを予約しました。", type: "good", npcReply: "ナイス判断。それで問題ないね。", npcExpression: "happy", explanation: "具体的な準備を伝えると、信頼が増す。", nextHint: "「何時には出そう？」と聞くと深まる。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "うん。朝に慌てると、気が散るのよ。", npcExpression: "smile", explanation: "短い相づちでも、備えは整う。", nextHint: "「じゃあ予約を変えます」と足すと良い。", weight: 10 },
            { text: "安い宿なら、どこでもいいです。", type: "short", npcReply: "安さも大事だけど、移動の時間も計算に入れてね。", npcExpression: "neutral", explanation: "自分の基準を話すと、相手は助言しやすい。", nextHint: "「結局、駅近が夫得でした」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "向こうでは、取引先に挨拶だけでも行ってくるといいよ。", npcExpression: "smile",
          answers: [
            { text: "そうします。名刺も余分に用意しました。", type: "good", npcReply: "いいね。名刺が媒体になるってのは、本当よ。", npcExpression: "happy", explanation: "準備まで語ると、相手は知っていて安心する。", nextHint: "「挨拶の言葉も考えよう」と話すと深まる。", weight: 10 },
            { text: "分かりました。", type: "short", npcReply: "うん、人と人の関係から仕事は生まれるからね。", npcExpression: "smile", explanation: "短い承諾でも、向こうの縁を大事にできる。", nextHint: "「どんな挨拶がいいですか？」と聞くと続く。", weight: 10 },
            { text: "挨拶だけでなく、仕事の話もしたいです。", type: "short", npcReply: "仕事の話も大切だけど、まずは顔見せね。", npcExpression: "neutral", explanation: "前向きだが、段取りもある。", nextHint: "「それも含めて、全体を組みます」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "がんばっておいで。何かあれば、いつでも連絡してね。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。困ったら、すぐ相談します。", type: "good", npcReply: "それでいいのよ。無事、行っておいで。", npcExpression: "happy", explanation: "相談の約束をすると、出張は心強い。", nextHint: "帰ったら報告する約束で締めると良い。", weight: 10 },
            { text: "ありがとうございます。", type: "short", npcReply: "うん、気をつけて。よい出張をね。", npcExpression: "smile", explanation: "短い感謝でも、見送りは温かい。", nextHint: "「帰ったら電話します」を添えると良い。", weight: 10 },
            { text: "（気のない返事で席を立つ）", type: "bad", npcReply: "…まあ、行ってらっしゃい。", npcExpression: "neutral", explanation: "見送りに応えないと、出張の縁が薄い。", nextHint: "一言返すだけで、気持ちよく送られる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_050", title: "夜の居酒屋カウンター", category: "food", npcId: "npc_konno", background: "dining",
      tags: ["food", "izakaya", "night"],
      context: "夜、仕事帰りの居酒屋のカウンターで、今野さんと隣り合わせました。",
      rounds: [
        {
          npcLine: "お、夜勤帰り？ それとも、仕事上がり？ とりあえず、乾杯しよう。", npcExpression: "bright",
          answers: [
            { text: "仕事上がりです。お疲れさまです、乾杯！", type: "good", npcReply: "おつかれ！ 今日は何にします？ 差し入れ、1品サービスだ！", npcExpression: "happy", explanation: "労い合って乾杯すると、夜が始まる。", nextHint: "「おすすめは何？」と返すと弾む。", weight: 10 },
            { text: "じゃあ、お願いします。", type: "short", npcReply: "はいよ、まずはビールで行こう！", npcExpression: "smile", explanation: "短い承諾でも、乾杯は成立する。", nextHint: "「仕事、終わってホッとしてます」を添えると良い。", weight: 10 },
            { text: "酔ったら帰れなくなるので。", type: "short", npcReply: "おっと、じゃあソフトドリンクにしとく？ 話はできるよ。", npcExpression: "humorous", explanation: "断る代わりに別の形を選べる。", nextHint: "「じゃあウーロン茶で」と受けると続く。", weight: 10 }
          ]
        },
        {
          npcLine: "今日のツマミは、豚の角煮が出てるよ。絶品だ！ ", npcExpression: "bright",
          answers: [
            { text: "角煮、いいですね。それと、あれ、おすすめは？", type: "good", npcReply: "お、分かってるね！ じゃあ残りの一品は、旬の刺身でどう？", npcExpression: "happy", explanation: "好みを伝えて、選んでもらうと楽しい。", nextHint: "「刺身もいいですね」と受けると続く。", weight: 10 },
            { text: "じゃあ、角煮で。", type: "short", npcReply: "角煮ひとつ、あがった！ 熱いのをすぐ出すよ。", npcExpression: "smile", explanation: "短い注文でも、店主は張り切る。", nextHint: "「火傷注意」なんて言うと弾む。", weight: 10 },
            { text: "今日はあっさりがいいです。", type: "short", npcReply: "じゃあ、冷奴とポテトサラダはどう？ あっさりだよ。", npcExpression: "smile", explanation: "好みを伝えると、店主は合わせてくれる。", nextHint: "「それで」と受けると決まる。", weight: 10 }
          ]
        },
        {
          npcLine: "夜に居酒屋で食うごはんって、なんであんなにうまいんだろうな。", npcExpression: "bright",
          answers: [
            { text: "仕事の後に食べると、味がしみますよね。", type: "good", npcReply: "そうそう！ 疲れが味方をしてくれるんだよ！", npcExpression: "happy", explanation: "共感し合うと、夜は賑やかになる。", nextHint: "「今日は何があった？」と話すと弾む。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "でしょ？ 家で食べるのと、ここでは味が違うらしいんだ。", npcExpression: "smile", explanation: "短い相づちでも、店の味は受け取れる。", nextHint: "「何が違うんですか？」と聞くと深まる。", weight: 10 },
            { text: "本当に、なんででしょうね。", type: "short", npcReply: "各種あるってやつだよ！ 今日は何があった？", npcExpression: "humorous", explanation: "短いながら、話題は返りやすい。", nextHint: "「今日の出来事」を話すと弾む。", weight: 10 }
          ]
        },
        {
          npcLine: "そろそろ店じまいだから、ほどほどにね。また来てよ。", npcExpression: "smile",
          answers: [
            { text: "はい、ごちそうさまでした。今日は、いい夜でした。", type: "good", npcReply: "その言葉、ありがとう！ また、仕事の仲間とでも来てよ。", npcExpression: "happy", explanation: "満足を伝えると、常連として迎えられる。", nextHint: "実際にまた来ると、関係が深まる。", weight: 10 },
            { text: "ごちそうさまでした。", type: "short", npcReply: "はいよ、またいつでも。", npcExpression: "smile", explanation: "短い締めでも、夜の縁は残る。", nextHint: "「おいしかった」を添えると好印象。", weight: 10 },
            { text: "（黙って会計して去る）", type: "bad", npcReply: "…あいよ。また来てよ。", npcExpression: "neutral", explanation: "顔を見ない去り方は、店を寂しくする。", nextHint: "一言返すだけで、常連になれる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_051", title: "夕食の買い出し", category: "food", npcId: "npc_hanada", background: "outdoor",
      tags: ["food", "shopping", "evening"],
      context: "夕方の買い物帰りに、今夜のおかずを相談した花田さんに会いました。",
      rounds: [
        {
          npcLine: "あら、こんばんは。今夜のおかず、もう決まった？", npcExpression: "smile",
          answers: [
            { text: "まだです。何か、すぐ作れておいしいものありますか？", type: "good", npcReply: "じゃあ、今朝のうちに煮たひじきはどう？ 家で食べるのにちょうどいいわ。", npcExpression: "happy", explanation: "相談を投げると、相手は気分よく応える。", nextHint: "「それ、いただきます」と受けると続く。", weight: 10 },
            { text: "これから決めるところです。", type: "short", npcReply: "じゃあ、この野菜、入れてみたら？ 今日は特売よ。", npcExpression: "smile", explanation: "短い返しでも、相手は助言できる。", nextHint: "「どれが特売？」と聞くと続く。", weight: 10 },
            { text: "一人前なので、難しいです。", type: "short", npcReply: "一人前、ね。それなら半額の惣菜が手軽よ。", npcExpression: "caring", explanation: "事情を伝えると、相手は合わせてくれる", nextHint: "「それ、参考にします」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "ひと手間かけるなら、白菜を塩もみして、即席の浅漬けにするのはどう？", npcExpression: "smile",
          answers: [
            { text: "それ、いいですね。明日の朝にも合いそうです。", type: "good", npcReply: "そうなの。せっかくなら、保存もできるわよ。", npcExpression: "happy", explanation: "気が利く返しをすると、相手は嬉しくなる。", nextHint: "「作り方教えて」と続けると良い。", weight: 10 },
            { text: "へえ、そうですね。", type: "short", npcReply: "塩もみは、意外と簡単だから、おすすめよ。", npcExpression: "smile", explanation: "短い相づちでも、助言は受け取れる。", nextHint: "「分量は？」と聞くと深まる。", weight: 10 },
            { text: "最近、漬物が流行ってないです。", type: "short", npcReply: "流行りは関係ないのよ。おいしいものはおいしいの。", npcExpression: "smile", explanation: "反論しても、相手は着実に勧める。", nextHint: "「分かりました、試します」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "お惣菜より、できたてはやっぱり幸福度が違うのよね。", npcExpression: "smile",
          answers: [
            { text: "わかります。できたての香りだけで、疲れが取れます。", type: "good", npcReply: "そうそう！ 料理は五感で楽しめるものが、いちばんね。", npcExpression: "happy", explanation: "感覚に共感すると、買い物は楽しい。", nextHint: "「何の香りが好き？」と聞くと深まる。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "でしょ？ 今夜、がんばって作ってみてね。", npcExpression: "smile", explanation: "短い同意でも、買い物は前向きになる。", nextHint: "「応援ありがとう」を添えると良い。", weight: 10 },
            { text: "一人だと、つい手抜きしちゃいます。", type: "short", npcReply: "手抜きも立派な方法よ。今日は、少しだけがんばってみて。", npcExpression: "caring", explanation: "正直な話も、相手は肯定的に受ける。", nextHint: "「じゃあ浅漬けだけ」と具体的にすると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、私はこの辺で。おいしい夕食をね。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。浅漬け、作ってみますね。", type: "good", npcReply: "楽しみね。また、どうだったか教えて。", npcExpression: "happy", explanation: "作る約束まで話すと、次に会える。", nextHint: "実際に作って感想を伝えると良い。", weight: 10 },
            { text: "ありがとうございます。また。", type: "short", npcReply: "またね。気をつけて。", npcExpression: "smile", explanation: "短い別れでも、買い物の縁は残る。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（礼も言わず立ち去る）", type: "bad", npcReply: "…あら。じゃあ、また今度。", npcExpression: "neutral", explanation: "感謝を残さないと、助言が霞む。", nextHint: "一言返すだけで、縁が続く。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_052", title: "焼き芋屋さん", category: "food", npcId: "npc_kato", background: "outdoor",
      tags: ["food", "street", "evening"],
      context: "夕方、石焼き芋の屋台の前で、加藤さんに出会いました。",
      rounds: [
        {
          npcLine: "お、いい香りでしょ？ この石焼き芋、香りだけで買いたくなるんだ。", npcExpression: "humorous",
          answers: [
            { text: "本当にいい香りですね。じゃあ二人分、買いましょうか？", type: "good", npcReply: "いいね！ 選ぶなら、細いのが甘いんだよ。", npcExpression: "happy", explanation: "一緒に買う提案をすると、夜が楽しくなる。", nextHint: "「どうやって選ぶの？」と聞くと深まる。", weight: 10 },
            { text: "こんにちは。いい香りですね。", type: "short", npcReply: "でしょ？ 寒くなると、この屋台が来るんだよ。", npcExpression: "smile", explanation: "短い挨拶でも、屋台前は賑やかになる。", nextHint: "「何で焼いてるんですか？」と聞くと続く。", weight: 10 },
            { text: "（香りに誘われて、どんなものか無言で眺める）", type: "short", npcReply: "迷ってる？ 食べるべきだよ、絶対に。", npcExpression: "humorous", explanation: "迷いを察して、相手が後押しする。", nextHint: "「じゃあ一本」と決めると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "焼き芋はね、皮ごと食べると、食物繊維がすごいんだって。", npcExpression: "humorous",
          answers: [
            { text: "へえ、知りませんでした。じゃあ、余計に食べたいです。", type: "good", npcReply: "でしょ？ しかも、甘さも増すんだってよ。", npcExpression: "happy", explanation: "情報に反応すると、会話がはずむ。", nextHint: "「どう焼くと甘いの？」と聞くと深まる。", weight: 10 },
            { text: "ほう、そうなんですね。", type: "short", npcReply: "そうみたい。店の人は、じっくり弱火だと言ってたよ。", npcExpression: "smile", explanation: "短い反応でも、情報は受け止められる。", nextHint: "「弱火の焼き芋」と話題にすると良い。", weight: 10 },
            { text: "皮ごと食べると、汚れませんか？", type: "short", npcReply: "食べる前に拭けば大丈夫だよ。意外と平気だ。", npcExpression: "humorous", explanation: "疑問を出しても、相手は軽く返す。", nextHint: "「じゃあ食べます」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "そういえば、ここで会うと、いつもいい匂いの日なんだよね。", npcExpression: "humorous",
          answers: [
            { text: "いい匂いがする日に、いい方に出会えるってことですね。", type: "good", npcReply: "はは、その言い方、いいね！ 使わせてもらうよ。", npcExpression: "happy", explanation: "気の利いた返しをすると、場が明るくなる。", nextHint: "「今日は何買う？」と返すと弾む。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "焼き芋は、いい出会いの予感がするんだよ。", npcExpression: "smile", explanation: "短い相づちでも、会話は続く。", nextHint: "「どんな出会いはありました？」と聞くと良い。", weight: 10 },
            { text: "私は偶然の出会いには、あまり期待しないんです。", type: "short", npcReply: "おっと、それも一つの生き方だね。", npcExpression: "neutral", explanation: "考え方の違いは、相手も受け入れる。", nextHint: "「でも屋台は信じます」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、私はそろそろ温かいのを買って帰るね。またここで！", npcExpression: "smile",
          answers: [
            { text: "はい、お気をつけて。私も一本買って帰ります。", type: "good", npcReply: "いい選択だ！ また、屋台前で会おう！", npcExpression: "happy", explanation: "お互いの行動を祝福すると、別れが温かい。", nextHint: "「どれを買ったか教えて」を添えると良い。", weight: 10 },
            { text: "はい、また。", type: "short", npcReply: "またな！ いい匂いのときに会おう！", npcExpression: "smile", explanation: "短い別れでも、屋台の縁は残る。", nextHint: "「いつもいい匂いですから」を添えると良い。", weight: 10 },
            { text: "（香りに誘われて、いつの間にか並んでいる）", type: "short", npcReply: "お、もう並んでる？ じゃあ、あとでゆっくりね！", npcExpression: "smile", explanation: "行動が語れば、言葉は少なくても大丈夫。", nextHint: "買うときに一言あいさつすると良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_053", title: "取り寄せグルメの話", category: "food", npcId: "npc_nakamura", background: "dining",
      tags: ["food", "talk", "delivery"],
      context: "休憩中、中村さんと、お取り寄せグルメの話になりました。",
      rounds: [
        {
          npcLine: "この前、通販で取り寄せた醤油、すごく良かったんですよ。", npcExpression: "curious",
          answers: [
            { text: "へえ、どこの醤油ですか？ 私はよく島の塩を取り寄せます。", type: "good", npcReply: "醤油はあの『白醤油』、塩は…そういうの私も好きですね！", npcExpression: "curious", explanation: "自分の好みも交えると、話は弾む。", nextHint: "「他に何を？」と聞くと深まる。", weight: 10 },
            { text: "そうなんですね。", type: "short", npcReply: "何に使っても出汁が活きるんですよ。今度、味見させますね。", npcExpression: "smile", explanation: "短い相づちでも、相手は語り続ける。", nextHint: "「味見、楽しみ」と受けると続く。", weight: 10 },
            { text: "取り寄せは送料がかかるので、苦手です。", type: "short", npcReply: "ああ、それはわかります。でも、本場の味は買う価値がありますよ。", npcExpression: "neutral", explanation: "事情を話しても、相手は勧め方を変える。", nextHint: "「今度、良かったらですが」と返すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "去年、行った旅行先の名産が忘れられなくて、取り寄せてるんですよ。", npcExpression: "curious",
          answers: [
            { text: "思い出の味を取り寄せるの、いいですね。何の名産ですか？", type: "good", npcReply: "旅先で食べた干物なんです。あの塩加減が最高で！", npcExpression: "happy", explanation: "相手の思い出に興味を示すと、話が広がる。", nextHint: "「どこに行ったんですか？」と聞くと続く。", weight: 10 },
            { text: "いいですね。", type: "short", npcReply: "でしょ？ 旅行の思い出が、ずっと食卓にある感じなんです。", npcExpression: "smile", explanation: "短い共感でも、相手は満足する。", nextHint: "「旅行の話も聞かせて」と続けると良い。", weight: 10 },
            { text: "旅行は、もう行かない派です。", type: "short", npcReply: "あ、そうですか…。じゃあ、取り寄せで食べられるのは良さそうですね。", npcExpression: "neutral", explanation: "考え方の違いでも、取り寄せの話には戻れる。", nextHint: "「それなら良さそう」と返すと続く。", weight: 10 }
          ]
        },
        {
          npcLine: "取り寄せは、一度食べると、もう普通のは戻れなくなるから要注意よ。", npcExpression: "curious",
          answers: [
            { text: "わかります、麻痺しますよね。でも、それが幸せなんです。", type: "good", npcReply: "はは、それ、名言ですね！ 今日の話で一番いいです。", npcExpression: "happy", explanation: "ユーモアで返すと、場が弾む。", nextHint: "「他に何かハマってる？」と聞くと続く。", weight: 10 },
            { text: "そうですね、わかります。", type: "short", npcReply: "でしょ？ 味が変わるって、語り尽くせないです。", npcExpression: "smile", explanation: "短い共感でも、食の楽しみは共有される。", nextHint: "「何が変わりました？」と聞くと深まる。", weight: 10 },
            { text: "私は普通の生活が好きです。", type: "short", npcReply: "ああ、それも幸せの形ですよね。", npcExpression: "neutral", explanation: "価値観の違いを認め合うと、会話は穏やか。", nextHint: "「でも、時々は冒険したい」と返すと続く。", weight: 10 }
          ]
        },
        {
          npcLine: "そろそろ時間ですね。今度、良かったら醤油、分けますよ。", npcExpression: "smile",
          answers: [
            { text: "ぜひ！ じゃあ、今度、お味噌汁を煮て待ってますね。", type: "good", npcReply: "それ、いいですね！ では、そのときに醤油を。", npcExpression: "happy", explanation: "交換の約束をすると、食の縁がつながる。", nextHint: "実際に交わすと、話が弾む。", weight: 10 },
            { text: "ありがとうございます。", type: "short", npcReply: "いえいえ。では、また。", npcExpression: "smile", explanation: "短い感謝でも、取り寄せの縁は続く。", nextHint: "「お待ちしてます」を添えると良い。", weight: 10 },
            { text: "（生返事で立ち去る）", type: "bad", npcReply: "…あ、醤油の話、また今度で。", npcExpression: "neutral", explanation: "曖昧な返事だと、交換が流れる。", nextHint: "「必ず飲みます」と返すと良い。", weight: 10 }
          ]
        }
      ]
    },

    /* ============ 拡張バッチ5（最終シーン群）============
     * 各カテゴリ20件に到達（daily 20 / work 20 / food 20 ＝ 計60件）。 */

    {
      id: "scn_054", title: "洗濯物をたたむ午後", category: "daily", npcId: "npc_sato", background: "outdoor",
      tags: ["daily", "house", "relax"],
      context: "休日の午後、庭で洗濯物をたたむ佐藤さんに声をかけました。",
      rounds: [
        {
          npcLine: "あら、こんにちは。日和がよくて、洗濯日和ですね。", npcExpression: "smile",
          answers: [
            { text: "そうですね。休日にこういう時間があるの、好きです。", type: "good", npcReply: "わかります。洗濯物、見上げると嬉しくなるんですよ。", npcExpression: "happy", explanation: "穏やかな時間の感じ方を共有すると、和む。", nextHint: "「どんな香りが好き？」と聞くと続く。", weight: 10 },
            { text: "こんにちは、いいてんきですね。", type: "short", npcReply: "ええ、ほんと気持ちいいですね。", npcExpression: "smile", explanation: "短い挨拶でも、休日は穏やかに始まる。", nextHint: "天気の話を添えると続きやすい。", weight: 10 },
            { text: "（無言で眺めて去る）", type: "bad", npcReply: "…あら。じゃあ、また。", npcExpression: "neutral", explanation: "返事を返さないと、相手は話を畳む。", nextHint: "一言返すだけで和やかになる。", weight: 10 }
          ]
        },
        {
          npcLine: "休日は、だいたい何して過ごしてるの？", npcExpression: "smile",
          answers: [
            { text: "本を読んだり、近所を散歩したりです。", type: "good", npcReply: "穏やかな休み方、いいねえ。私も真似しよう。", npcExpression: "smile", explanation: "休日の過ごし方を語ると、共感が生まれる。", nextHint: "「最近の一冊は？」と聞くと弾む。", weight: 10 },
            { text: "特に決めてません。", type: "short", npcReply: "決めてないのも、休日らしくていいね。", npcExpression: "smile", explanation: "短い返しでも、休日の雰囲気は伝わる。", nextHint: "「じゃあ、ゆっくりできるね」と足すと良い。", weight: 10 },
            { text: "どうでもいいです。", type: "short", npcReply: "…あら、ごめんね。無理に聞いてるみたいで。", npcExpression: "neutral", explanation: "突き放すと、相手は話を閉じる。", nextHint: "一言返すだけで、会話が続く。", weight: 10 }
          ]
        },
        {
          npcLine: "こうして手を動かすと、気持ちが整うんですよ。", npcExpression: "smile",
          answers: [
            { text: "なんとなく、わかります。単純な作業って、頭が休まりますね。", type: "good", npcReply: "そうそう。それがいいんです。", npcExpression: "happy", explanation: "感覚に共感すると、会話が深まる。", nextHint: "「どんな作業が好き？」と聞くと続く。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "でしょ？ 気がつくと、いい気分になってます。", npcExpression: "smile", explanation: "短い同意でも、相手は満足する。", nextHint: "「他に何してる？」と聞くと続く。", weight: 10 },
            { text: "私は、時間の無駄に思えます。", type: "short", npcReply: "あら、それも一つの考え方ね。", npcExpression: "neutral", explanation: "反対意見でも、相手は引くに引けない。", nextHint: "「でも、たまにはいいですね」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、そろそろ中に取り込まないと。またね。", npcExpression: "smile",
          answers: [
            { text: "はい、お邪魔しました。またお会いしましょう。", type: "good", npcReply: "はい、また。今度はお茶でも飲みましょうね。", npcExpression: "happy", explanation: "再会を約束すると、近所の縁が続く。", nextHint: "実際に会うと、関係が深まる。", weight: 10 },
            { text: "はい、また。", type: "short", npcReply: "またね。気をつけて。", npcExpression: "smile", explanation: "短い別れでも、自然に終わる。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（振り返らず去る）", type: "bad", npcReply: "…あ、そうだメモを。（名残惜しそう）", npcExpression: "neutral", explanation: "言葉を残さず去ると、縁が切れる。", nextHint: "一言返すだけで、次に繋がる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_055", title: "近所のランニング", category: "daily", npcId: "npc_tanaka", background: "outdoor",
      tags: ["daily", "sport", "morning"],
      context: "朝、近所のランニングコースで田中さんに並走しました。",
      rounds: [
        {
          npcLine: "お、朝ランニング？ いいペースだね。", npcExpression: "neutral",
          answers: [
            { text: "おはようございます。最近始めました。続けられるか心配で。", type: "good", npcReply: "続けられるよ。続けられない人は、まず始めないから。", npcExpression: "smile", explanation: "不安を正直に話すと、相手は背中を押す。", nextHint: "「何キロ走るの？」と聞くと続く。", weight: 10 },
            { text: "おはようございます。", type: "short", npcReply: "おはよう。気分良さそうだね。", npcExpression: "smile", explanation: "短い挨拶でも、朝は軽やかになる。", nextHint: "「調子どう？」と聞くと続く。", weight: 10 },
            { text: "（会釈して、ペースを上げる）", type: "bad", npcReply: "お、急いでる？ まあいいか。先行くよ。", npcExpression: "neutral", explanation: "気さくな相手を避けると、縁が逃げる。", nextHint: "一言返すだけで、一緒に走れる。", weight: 10 }
          ]
        },
        {
          npcLine: "コースは決めてるの？ ここを周回するといいよ。", npcExpression: "neutral",
          answers: [
            { text: "何周くらいが、ちょうどいいですか？", type: "good", npcReply: "1周2キロだから、5周で10キロ。まずは3周からかな。", npcExpression: "smile", explanation: "具体的な距離を教わると、始められる。", nextHint: "「じゃあ3周にします」と受けると良い。", weight: 10 },
            { text: "じゃあ、3周にします。", type: "short", npcReply: "いいね。ペースは、無理しなくていいよ。", npcExpression: "smile", explanation: "短い決定でも、目標が立つ。", nextHint: "「一緒に走りましょう」を添えると良い。", weight: 10 },
            { text: "コースのことは、自分で決めるので。", type: "short", npcReply: "…はいはい。自分で決めて。", npcExpression: "neutral", explanation: "助言を断ると、相手は引く。", nextHint: "「参考にします」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "走ってると、仕事のことも、少し離れて考えられるんだよ。", npcExpression: "neutral",
          answers: [
            { text: "わかります。走ってる間は、深呼吸と足音だけです。", type: "good", npcReply: "それよ、それがいいんだ。", npcExpression: "smile", explanation: "感性を共有すると、並走が楽しい。", nextHint: "「何を考えるの？」と聞くと深まる。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "でしょ？ 頭をからっぽにする時間だよ。", npcExpression: "smile", explanation: "短い同意でも、一緒に走れる。", nextHint: "「今日は何を考えた？」と聞くと続く。", weight: 10 },
            { text: "仕事のことから逃げるのは、逃げてるのと同じです。", type: "short", npcReply: "…それ、ちょっと極端だと思うよ。", npcExpression: "neutral", explanation: "説教じみると、会話が固くなる。", nextHint: "「たまには離れてもいいですね」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、俺はここらで。また走ってるとこで会おう。", npcExpression: "smile",
          answers: [
            { text: "はい、また。続けられるよう、がんばります。", type: "good", npcReply: "その意気だ。いい汗かこう。", npcExpression: "smile", explanation: "継続の意志を伝えると、励まし合える。", nextHint: "「何キロ走ったか報告する」を添えると良い。", weight: 10 },
            { text: "はい、また。", type: "short", npcReply: "またな。いい走りを。", npcExpression: "smile", explanation: "短い別れでも、朝の縁は続く。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（戻らず走り去る）", type: "bad", npcReply: "…まあ、いいか。お元気で。", npcExpression: "neutral", explanation: "別れの言葉を残さないと、縁が薄い。", nextHint: "一言返すだけでも、朝は輝く。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_056", title: "在宅勤務の切り替え", category: "work", npcId: "npc_tanaka", background: "office",
      tags: ["work", "remote", "daytime"],
      context: "午前、在宅勤務から出社へ切り替える田中さんに、席のことを確認しました。",
      rounds: [
        {
          npcLine: "お、今日は出社してきた？ 席は空いてるよ。", npcExpression: "neutral",
          answers: [
            { text: "はい、久々に出社しました。在宅だと切り替えが難しいので。", type: "good", npcReply: "切り替え、わかるよ。俺も週2で在宅だけど、最初は大変だった。", npcExpression: "smile", explanation: "経験を共有すると、話が弾む。", nextHint: "「どうやって切り替えてるの？」と聞くと続く。", weight: 10 },
            { text: "お世話になります。", type: "short", npcReply: "うん、適当にやっていって。", npcExpression: "neutral", explanation: "短い挨拶でも、出社は受け入れられる。", nextHint: "「仕事、始めます」を添えると良い。", weight: 10 },
            { text: "まだ在宅の感覚が抜けてません。", type: "short", npcReply: "…まあ、徐々にな。", npcExpression: "neutral", explanation: "戸惑いを話すと、相手も様子を見る。", nextHint: "「今日は朝イチから集中します」と足すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "在宅と出社、どっちの方が仕事しやすい？", npcExpression: "neutral",
          answers: [
            { text: "どちらも利点がありますが、詰まったときは出社の方が助かります。", type: "good", npcReply: "そう言ってくれると、出社の価値があるな。", npcExpression: "smile", explanation: "率直な評価は、職場を磨く。", nextHint: "「どんな時に出社したい？」と聞くと深まる。", weight: 10 },
            { text: "どちらもですね。", type: "short", npcReply: "うん、使い分けるのが正解だと思うよ。", npcExpression: "neutral", explanation: "短い返しでも、話題は続く。", nextHint: "「使い分け、どうしてる？」と聞くと良い。", weight: 10 },
            { text: "どっちでも仕事はできます。", type: "short", npcReply: "…まあ、それがベストなら、いいけど。", npcExpression: "neutral", explanation: "無関心な返しは、話題を閉じる。", nextHint: "「出社してよかったこともあります」と足すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "在宅の時の、話しかけられる頻度の差は、結構大きいよな。", npcExpression: "neutral",
          answers: [
            { text: "そうですね。横向いて聞けるのは、出社ならではです。", type: "good", npcReply: "それな。だから会議はちゃんと出ろよ。", npcExpression: "smile", explanation: "共通の実感に共感すると、職場は温かい。", nextHint: "「他に出社のいいところは？」と聞くと深まる。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "うん、顔を合わせるのも仕事のうちだよ。", npcExpression: "neutral", explanation: "短い同意でも、相手は納得する。", nextHint: "「じゃあ朝イチは顔を出します」を添えると良い。", weight: 10 },
            { text: "コミュニケーションは電話で十分です。", type: "short", npcReply: "…いや、顔は見せるもんだよ。", npcExpression: "neutral", explanation: "意見の相違はあるが、指摘は受け止める。", nextHint: "「分かりました」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、午後の会議、よろしく。また後で。", npcExpression: "neutral",
          answers: [
            { text: "はい、よろしくお願いします。資料、送っておきます。", type: "good", npcReply: "OK、受け取るよ。", npcExpression: "smile", explanation: "次に渡すものを約束すると、会議が進む。", nextHint: "実際に送ると、信頼になる。", weight: 10 },
            { text: "おつかれさまです。", type: "short", npcReply: "うん、また後で。", npcExpression: "neutral", explanation: "短い労いでも、場は切り替わる。", nextHint: "「資料お願いします」を添えると良い。", weight: 10 },
            { text: "（無視して席へ）", type: "bad", npcReply: "…じゃあ、あとでな。", npcExpression: "neutral", explanation: "応えないと、相手は気を揉む。", nextHint: "一言返すだけで、職場は回る。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_057", title: "退勤前の引き継ぎ", category: "work", npcId: "npc_yamada", background: "office",
      tags: ["work", "handover", "evening"],
      context: "夕方、早く帰る日の前に、山田さんへ引き継ぎの話をしました。",
      rounds: [
        {
          npcLine: "今日は早く帰るの？ じゃあ、明日のこと、引き継いでおいてね。", npcExpression: "neutral",
          answers: [
            { text: "はい、資料と進捗をまとめました。ここに置いておきます。", type: "good", npcReply: "準備がいいね。引き継ぎ一覧、ありがとう。", npcExpression: "smile", explanation: "引き継ぎを具体的に示すと、安心される。", nextHint: "「置き場所も明記しました」と足すと良い。", weight: 10 },
            { text: "分かりました。", type: "short", npcReply: "うん、置いておいてくれたら見るよ。", npcExpression: "neutral", explanation: "短い承諾でも、引き継ぎは進行する。", nextHint: "「今日中に置いておきます」を添えると良い。", weight: 10 },
            { text: "忘れたらすみません。", type: "bad", npcReply: "…忘れないでくれよ。明日それを使うんだ。", npcExpression: "troubled", explanation: "投げ遣りだと、相手は不安になる。", nextHint: "「今、書きます」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "引き継ぎは、『どこまでやったか』『次に何をするか』を書くのが大事だ。", npcExpression: "neutral",
          answers: [
            { text: "はい、『完了』『進行中』『次回の手順』で分けて書きました。", type: "good", npcReply: "完璧だ。読みやすい引き継ぎだよ。", npcExpression: "smile", explanation: "相手の型に沿って書けると、信頼になる。", nextHint: "「残りは明日、続けます」と添えると良い。", weight: 10 },
            { text: "分かりました。", type: "short", npcReply: "うん、頭に叩き込んでおいて。", npcExpression: "neutral", explanation: "短い承諾でも、型は伝わる。", nextHint: "「すぐ書きます」を添えると良い。", weight: 10 },
            { text: "口頭で説明します。", type: "bad", npcReply: "口頭だけは、あとで追えないから、書いてくれ。", npcExpression: "troubled", explanation: "記録を残さないと、曖昧になる。", nextHint: "「書いておきます」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "早く帰るのはいいことだ。明日の仕事は、明日の自分に任せよう。", npcExpression: "smile",
          answers: [
            { text: "そうですね。今日はすっきり片付けて帰れそうで、嬉しいです。", type: "good", npcReply: "その調子。仕事は、一区切りつけるのも大事だよ。", npcExpression: "smile", explanation: "区切りの良さを共有すると、帰宅が明るい。", nextHint: "「明日もよろしく」を添えると良い。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "うん、帰る前に頭を空にしなよ。", npcExpression: "neutral", explanation: "短い同意でも、区切りはできる。", nextHint: "「気分転換します」を足すと良い。", weight: 10 },
            { text: "片付けないと、落ち着かないです。", type: "short", npcReply: "それはそれで、真面目でいいけどね。", npcExpression: "neutral", explanation: "真面目さも、受け止められる。", nextHint: "「今日は少し片付けてから帰ります」と足すと良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、今日はもう大丈夫だ。気をつけて帰って。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。明日、よろしくお願いします。", type: "good", npcReply: "ああ、任せて。いい週末を。", npcExpression: "smile", explanation: "明日への任せを言葉にすると、安心できる。", nextHint: "「では、また明日」でしっかり閉じる。", weight: 10 },
            { text: "お疲れさまです。", type: "short", npcReply: "おつかれ。気をつけて帰ってね。", npcExpression: "neutral", explanation: "短い労いでも、一日は締まる。", nextHint: "「ありがとう」を添えると温かい。", weight: 10 },
            { text: "（無言で帰る）", type: "bad", npcReply: "…あ、明日のこと、よろしくね！", npcExpression: "neutral", explanation: "締めの言葉がないと、引き継ぎが残る。", nextHint: "一言返すだけで、明日が繋がる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_058", title: "朝食のおすすめ", category: "food", npcId: "npc_hanada", background: "dining",
      tags: ["food", "breakfast", "morning"],
      context: "朝、定食屋の花田さんに、朝ごはんの新作を紹介してもらいました。",
      rounds: [
        {
          npcLine: "おはよう！ 朝の定食、今日から新作だよ。味噌汁と卵焼きセット。", npcExpression: "smile",
          answers: [
            { text: "おはようございます。いいですね、朝から温かいのは。", type: "good", npcReply: "そうでしょ？ 朝に卵焼きがあると、1日が変わるのよ。", npcExpression: "happy", explanation: "気持ちを伝えると、相手も張り切る。", nextHint: "「じゃあそれで」と続けると良い。", weight: 10 },
            { text: "おはようございます。じゃあ、それで。", type: "short", npcReply: "はいよ、味噌汁と卵焼きセットね！", npcExpression: "smile", explanation: "短い注文でも、朝は始まる。", nextHint: "「楽しみにしてます」を添えると良い。", weight: 10 },
            { text: "朝はパン派なので。", type: "short", npcReply: "あら、じゃあトーストも焼けるわよ。コーヒーと。", npcExpression: "smile", explanation: "好みを伝えると、別の提案が出る。", nextHint: "「じゃあ、それで」と受けると続く。", weight: 10 }
          ]
        },
        {
          npcLine: "この卵焼き、昨日試作したんだけど、昆布だしを入れてみたの。", npcExpression: "smile",
          answers: [
            { text: "昆布だしですか？ どんな風味が変わりますか？", type: "good", npcReply: "甘みがふわっと出るの。だしがきく感じよ。", npcExpression: "happy", explanation: "作り方に興味を示すと、教えがいがある。", nextHint: "「縁側か」と面白がると弾む。", weight: 10 },
            { text: "楽しみです。", type: "short", npcReply: "うん、食べてみてね。", npcExpression: "smile", explanation: "短い期待でも、相手は嬉しい。", nextHint: "「どんなだしを入れた？」と聞くと深まる。", weight: 10 },
            { text: "卵焼きは、砂糖で固めて欲しいです。", type: "short", npcReply: "あら、お好みね。じゃあ、そっちで焼くわ。", npcExpression: "neutral", explanation: "好みを伝えると、相手は合わせる。", nextHint: "「お願いします」で整う。", weight: 10 }
          ]
        },
        {
          npcLine: "どう？ 昆布だし、わかる？", npcExpression: "curious",
          answers: [
            { text: "わかります！ 出汁の奥行きがありますね。", type: "good", npcReply: "ふふ、わかってもらえて嬉しいわ。", npcExpression: "happy", explanation: "具体的な感想は、作り手の胸に響く。", nextHint: "「家でも真似してみます」を添えると良い。", weight: 10 },
            { text: "おいしいです。", type: "short", npcReply: "それでよし！ 今日も1日、がんばってね。", npcExpression: "smile", explanation: "短い感想でも、朝は始まる。", nextHint: "「どこがおいしい？」と足すと更に良い。", weight: 10 },
            { text: "だしは、感じませんでした。", type: "short", npcReply: "あら、それは残念。でも好みは大事よ。", npcExpression: "neutral", explanation: "正直でも、相手は受け止める。", nextHint: "「好みがあるので」と続けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "ごちそうさま。また、明日もおいで。朝ごはん、作って待ってるわ。", npcExpression: "smile",
          answers: [
            { text: "ありがとうございます。明日も食べに来ますね。", type: "good", npcReply: "約束よ。明日は、違う新作も試すわね。", npcExpression: "happy", explanation: "再来を約束すると、朝が楽しみになる。", nextHint: "実際に来ると、常連になる。", weight: 10 },
            { text: "ごちそうさまでした。", type: "short", npcReply: "はいよ、また明日ね。", npcExpression: "smile", explanation: "短い締めでも、朝の縁は続く。", nextHint: "「おいしかった」を添えると好印象。", weight: 10 },
            { text: "（黙って会計）", type: "bad", npcReply: "…じゃあ、またね。", npcExpression: "neutral", explanation: "気配りに無反応だと、店主は寂しい。", nextHint: "顔を見て一言あいさつすると良い。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_059", title: "雨の日の持ち帰り", category: "food", npcId: "npc_konno", background: "dining",
      tags: ["food", "takeout", "rain"],
      context: "雨の日、今野さんの店で、持ち帰りの注文をしました。",
      rounds: [
        {
          npcLine: "おっと、雨の日はやっぱり持ち帰りが多いな。どうする？", npcExpression: "bright",
          answers: [
            { text: "はい、家で食べたい気分なので、持ち帰りでお願いします。", type: "good", npcReply: "りょーかい！ 冷めないように、ぬるめにしておくね。", npcExpression: "happy", explanation: "気分を伝えると、相手も合わせる。", nextHint: "「何がおすすめ？」と聞くと続く。", weight: 10 },
            { text: "はい、お願いします。", type: "short", npcReply: "いいよ！ 温かいうちに、家まで持って帰ってね。", npcExpression: "smile", explanation: "短い承諾でも、持ち帰りは楽しみになる。", nextHint: "「何にしようかな」と聞くと続く。", weight: 10 },
            { text: "（無言で指差し注文）", type: "short", npcReply: "はい、これね！ ご注文ありがとう！", npcExpression: "neutral", explanation: "言葉がなくても、注文は通る。", nextHint: "一言「ありがとう」を添えると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "雨の日は、これ『煮込みうどん』が人気なんだよ。", npcExpression: "bright",
          answers: [
            { text: "煮込みうどん、いいですね。おすすめの具はありますか？", type: "good", npcReply: "葉っぱ類をたっぷり入れると、あったまるよ。", npcExpression: "happy", explanation: "おすすめを聞くと、注文が楽しい。", nextHint: "「じゃあそれで」と受けると良い。", weight: 10 },
            { text: "じゃあ、それで。", type: "short", npcReply: "煮込みうどんひとつ、あがった！", npcExpression: "smile", explanation: "短い決定でも、注文は進む。", nextHint: "「楽しみ」を添えると良い。", weight: 10 },
            { text: "うどんはあまり…。", type: "short", npcReply: "じゃあ、あんかけ焼きそばはどう？ これも人気だよ。", npcExpression: "smile", explanation: "好みを伝えると、別案が出る。", nextHint: "「それで」と受けると続く。", weight: 10 }
          ]
        },
        {
          npcLine: "雨の日は、家で温かいものを食べるのが、一番の幸せだよね。", npcExpression: "bright",
          answers: [
            { text: "本当にそうですね。雨音と温かいもの、最高です。", type: "good", npcReply: "そうそう！ わかってくれる人がいて嬉しいよ。", npcExpression: "happy", explanation: "感覚を共有すると、会話が和む。", nextHint: "「帰ったら、何で食べる？」と聞くと弾む。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "でしょ？ 雨の日は、家が天国になるんだよ。", npcExpression: "smile", explanation: "短い同意でも、居心地は共有される。", nextHint: "「今日はそれに決めた」と足すと良い。", weight: 10 },
            { text: "雨は、やっぱり憂鬱です。", type: "short", npcReply: "あらら。じゃあ、これを食べて元気出そう。", npcExpression: "smile", explanation: "素直な感想で、話題が温まる。", nextHint: "「ありがとう」で受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "はい、お待ち！ 汁がついてるから、歩いてる間にこぼさないでね。", npcExpression: "bright",
          answers: [
            { text: "ありがとうございます。気をつけて、持ち帰ります。", type: "good", npcReply: "うん、あったかいうちにどうぞ。また来てね！", npcExpression: "happy", explanation: "感謝と安心を伝えると、店主も嬉しい。", nextHint: "「ごちそうさまでした」で閉じると良い。", weight: 10 },
            { text: "ありがとうございます。", type: "short", npcReply: "はいよ、おつかれさま！", npcExpression: "smile", explanation: "短い感謝でも、渡し合える。", nextHint: "「また来ます」を添えると良い。", weight: 10 },
            { text: "（黙って受け取って去る）", type: "bad", npcReply: "…あいよ。また来てよ。", npcExpression: "neutral", explanation: "声をかけずに去ると、縁が逃げる。", nextHint: "一言返すだけで、常連になれる。", weight: 10 }
          ]
        }
      ]
    },
    {
      id: "scn_060", title: "駄菓子屋の思い出", category: "food", npcId: "npc_kato", background: "outdoor",
      tags: ["food", "sweets", "talk"],
      context: "昼下がり、懐かしい駄菓子屋で加藤さんと、子どもの頃の話になりました。",
      rounds: [
        {
          npcLine: "やあ、懐かしいだろ？ この駄菓子屋、子どもの頃からあるんだよ。", npcExpression: "humorous",
          answers: [
            { text: "懐かしいです。こういう店、子どもの頃に住んでたとこにあって。", type: "good", npcReply: "だろう？ 駄菓子屋は、タイムマシンみたいなもんだよ。", npcExpression: "happy", explanation: "記憶を共有すると、懐かしさが弾む。", nextHint: "「よく何を買ってた？」と聞くと続く。", weight: 10 },
            { text: "いいですね、懐かしいです。", type: "short", npcReply: "でしょ？ 駄菓子の匂いだけで、昔に戻れるんだ。", npcExpression: "smile", explanation: "短い共感でも、懐かしさは伝わる。", nextHint: "「何を買ってた？」と聞くと続く。", weight: 10 },
            { text: "大人になったので、もう来ることはありません。", type: "short", npcReply: "おっと、それはもったいない。童心を思い出そうよ。", npcExpression: "humorous", explanation: "素っ気ない返しでも、相手は軽く受け止める。", nextHint: "「じゃあ、少しだけ」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "当時は、10円握りしめてここに来たんだ。何を買うか、本当に迷ってた。", npcExpression: "humorous",
          answers: [
            { text: "わかります。私は、いつもラムネと酢コンブで悩んでました。", type: "good", npcReply: "その悩み、よくわかる！ 今は、両方買えるのが最高だよ。", npcExpression: "happy", explanation: "昔の選択を共有すると、笑いが生まれる。", nextHint: "「他には？」と聞くと続く。", weight: 10 },
            { text: "懐かしいですね。", type: "short", npcReply: "だろう？ 子ども時代の決断は、人生の縮図だよ。", npcExpression: "smile", explanation: "短い共感でも、思い出は温かい。", nextHint: "「何を買うか迷った？」と聞くと続く。", weight: 10 },
            { text: "今は、好きなだけ買えるのが不思議です。", type: "short", npcReply: "いいね、リアルな感想だ。大人の特権ってやつよ。", npcExpression: "smile", explanation: "率直な感想は、話しやすい。", nextHint: "「じゃあ今日は買い放題？」と返すと弾む。", weight: 10 }
          ]
        },
        {
          npcLine: "大人になると、お金はあるけど、『買う時間』がなくなるからね。", npcExpression: "humorous",
          answers: [
            { text: "本当にそうですね。大人の贅沢は、時間ですね。", type: "good", npcReply: "それ、名言！ 大人の奢侈品は時間だよ。", npcExpression: "happy", explanation: "相手の言葉に乗っかると、会話が弾む。", nextHint: "「今日は時間を贅沢した？」と聞くと続く。", weight: 10 },
            { text: "そうですね。", type: "short", npcReply: "でしょ？ だから、今日は時間を無駄遣いしに来た。", npcExpression: "smile", explanation: "短い同意でも、言葉は通じる。", nextHint: "「ゆっくりできますね」と足すと良い。", weight: 10 },
            { text: "時間はお金で買えませんし。", type: "short", npcReply: "…それが、いちばん難しいところだよね。", npcExpression: "neutral", explanation: "反論も、相手は受け止める。", nextHint: "「じゃあ、今の時間は大事に」と受けると良い。", weight: 10 }
          ]
        },
        {
          npcLine: "じゃあ、俺は、めんこ買って帰るね。また、この店で会おう。", npcExpression: "smile",
          answers: [
            { text: "はい、楽しみにしてます。私は、するめを買って帰ります。", type: "good", npcReply: "いい選択だ！ またな、駄菓子仲間！", npcExpression: "happy", explanation: "それぞれの買い物を祝うと、別れが楽しい。", nextHint: "「どれを買ったか教えて」を添えると良い。", weight: 10 },
            { text: "はい、また。", type: "short", npcReply: "またな。いい童心を。", npcExpression: "smile", explanation: "短い別れでも、駄菓子の縁は残る。", nextHint: "「お互い」を添えると温かい。", weight: 10 },
            { text: "（黙って眺めて去る）", type: "bad", npcReply: "…また来てよ。今度こそ、何か買おう。", npcExpression: "neutral", explanation: "言葉を残さず去ると、懐かしさが薄まる。", nextHint: "一言返すだけで、童心が戻る。", weight: 10 }
          ]
        }
      ]
    }
  ];

  /* ====================================================================
   * 回答 facet 付与（会話スキル拡張）
   * 各回答に「会話の型」facet（KE_CONFIG.ANSWER_FACETS）を割り当てる。
   * good/short/bad（きずな度軸）とは別軸。抽選・連続性・NPC記憶・表示に使う。
   * key = "sceneId:roundIndex:answerIndex"、値 { f: facet, t?: type上書き, p?: promiseNote }。
   * 丁寧な断り（polite_decline かつ対案がある場合）は type を bad にしない（断罪しない）。
   * ==================================================================== */
  const AUGMENTS = {
    /* ---- scn_001 朝の相談（sato/work） ---- */
    "scn_001:0:0": { f: "self_disclose" }, "scn_001:0:1": { f: "onward" }, "scn_001:0:2": { f: "avoid" },
    "scn_001:1:0": { f: "self_disclose" }, "scn_001:1:1": { f: "onward" }, "scn_001:1:2": { f: "avoid" },
    "scn_001:2:0": { f: "onward" }, "scn_001:2:1": { f: "onward" }, "scn_001:2:2": { f: "avoid" },
    "scn_001:3:0": { f: "promise", p: "夕方のコーヒーの誘いを承諾した" }, "scn_001:3:1": { f: "polite_decline" }, "scn_001:3:2": { f: "polite_decline", t: "short" },

    /* ---- scn_002 報告のしかた（sato/work） ---- */
    "scn_002:0:0": { f: "self_disclose" }, "scn_002:0:1": { f: "onward" }, "scn_002:0:2": { f: "avoid" },
    "scn_002:1:0": { f: "self_disclose" }, "scn_002:1:1": { f: "onward" }, "scn_002:1:2": { f: "avoid" },
    "scn_002:2:0": { f: "onward" }, "scn_002:2:1": { f: "onward" }, "scn_002:2:2": { f: "avoid" },
    "scn_002:3:0": { f: "self_disclose" }, "scn_002:3:1": { f: "onward" }, "scn_002:3:2": { f: "avoid" },

    /* ---- scn_003 進捗の確認（tanaka/work） ---- */
    "scn_003:0:0": { f: "self_disclose" }, "scn_003:0:1": { f: "onward" }, "scn_003:0:2": { f: "avoid" },
    "scn_003:1:0": { f: "self_disclose" }, "scn_003:1:1": { f: "onward" }, "scn_003:1:2": { f: "avoid" },
    "scn_003:2:0": { f: "onward" }, "scn_003:2:1": { f: "onward" }, "scn_003:2:2": { f: "avoid" },
    "scn_003:3:0": { f: "promise", p: "明日の確認をよろしく頼んだ" }, "scn_003:3:1": { f: "natural_close" }, "scn_003:3:2": { f: "avoid" },

    /* ---- scn_004 会議後のひと言（tanaka/work） ---- */
    "scn_004:0:0": { f: "self_disclose" }, "scn_004:0:1": { f: "onward" }, "scn_004:0:2": { f: "avoid" },
    "scn_004:1:0": { f: "self_disclose" }, "scn_004:1:1": { f: "avoid" }, "scn_004:1:2": { f: "avoid" },
    "scn_004:2:0": { f: "empathy" }, "scn_004:2:1": { f: "onward" }, "scn_004:2:2": { f: "polite_decline", t: "short" },
    "scn_004:3:0": { f: "self_disclose" }, "scn_004:3:1": { f: "onward" }, "scn_004:3:2": { f: "avoid" },

    /* ---- scn_005 タスクの引き継ぎ（yamada/work） ---- */
    "scn_005:0:0": { f: "self_disclose" }, "scn_005:0:1": { f: "onward" }, "scn_005:0:2": { f: "avoid" },
    "scn_005:1:0": { f: "self_disclose" }, "scn_005:1:1": { f: "onward" }, "scn_005:1:2": { f: "avoid" },
    "scn_005:2:0": { f: "promise", p: "明日の朝までに優先順をまとめる約束" }, "scn_005:2:1": { f: "onward" }, "scn_005:2:2": { f: "avoid" },
    "scn_005:3:0": { f: "promise", p: "明日の朝、まとめた資料を送る約束" }, "scn_005:3:1": { f: "natural_close" }, "scn_005:3:2": { f: "avoid" },

    /* ---- scn_006 帰り支度の気遣い（yamada/work） ---- */
    "scn_006:0:0": { f: "promise", p: "荷物を持ってあげる約束" }, "scn_006:0:1": { f: "empathy" }, "scn_006:0:2": { f: "avoid" },
    "scn_006:1:0": { f: "empathy" }, "scn_006:1:1": { f: "onward" }, "scn_006:1:2": { f: "avoid" },
    "scn_006:2:0": { f: "self_disclose" }, "scn_006:2:1": { f: "empathy" }, "scn_006:2:2": { f: "avoid" },
    "scn_006:3:0": { f: "onward" }, "scn_006:3:1": { f: "natural_close" }, "scn_006:3:2": { f: "avoid" },

    /* ---- scn_007 パンのおすすめ（konno/food） ---- */
    "scn_007:0:0": { f: "onward" }, "scn_007:0:1": { f: "onward" }, "scn_007:0:2": { f: "avoid" },
    "scn_007:1:0": { f: "self_disclose" }, "scn_007:1:1": { f: "onward" }, "scn_007:1:2": { f: "avoid" },
    "scn_007:2:0": { f: "self_disclose" }, "scn_007:2:1": { f: "onward" }, "scn_007:2:2": { f: "avoid" },
    "scn_007:3:0": { f: "promise", p: "また来店して常連になると約束" }, "scn_007:3:1": { f: "promise", p: "また来店の約束" }, "scn_007:3:2": { f: "avoid" },

    /* ---- scn_008 朝の会話（konno/food） ---- */
    "scn_008:0:0": { f: "onward" }, "scn_008:0:1": { f: "onward" }, "scn_008:0:2": { f: "avoid" },
    "scn_008:1:0": { f: "self_disclose" }, "scn_008:1:1": { f: "onward" }, "scn_008:1:2": { f: "avoid" },
    "scn_008:2:0": { f: "onward" }, "scn_008:2:1": { f: "onward" }, "scn_008:2:2": { f: "avoid" },
    "scn_008:3:0": { f: "promise", p: "明日も来てホットで注文すると約束" }, "scn_008:3:1": { f: "promise", p: "また明日来ると約束" }, "scn_008:3:2": { f: "avoid" },

    /* ---- scn_009 栄養バランス（hanada/food） ---- */
    "scn_009:0:0": { f: "onward" }, "scn_009:0:1": { f: "onward" }, "scn_009:0:2": { f: "avoid" },
    "scn_009:1:0": { f: "self_disclose" }, "scn_009:1:1": { f: "onward" }, "scn_009:1:2": { f: "avoid" },
    "scn_009:2:0": { f: "self_disclose" }, "scn_009:2:1": { f: "onward" }, "scn_009:2:2": { f: "avoid" },
    "scn_009:3:0": { f: "promise", p: "また来店の約束" }, "scn_009:3:1": { f: "natural_close" }, "scn_009:3:2": { f: "avoid" },

    /* ---- scn_010 残業が続く日（hanada/food） ---- */
    "scn_010:0:0": { f: "self_disclose" }, "scn_010:0:1": { f: "onward" }, "scn_010:0:2": { f: "avoid" },
    "scn_010:1:0": { f: "self_disclose" }, "scn_010:1:1": { f: "onward" }, "scn_010:1:2": { f: "self_disclose" },
    "scn_010:2:0": { f: "onward" }, "scn_010:2:1": { f: "onward" }, "scn_010:2:2": { f: "avoid" },
    "scn_010:3:0": { f: "self_disclose" }, "scn_010:3:1": { f: "promise", p: "早く帰ると約束" }, "scn_010:3:2": { f: "avoid" },

    /* ---- scn_011 昼ごはんの誘い（kato/food） ---- */
    "scn_011:0:0": { f: "question" }, "scn_011:0:1": { f: "onward" }, "scn_011:0:2": { f: "avoid" },
    "scn_011:1:0": { f: "onward" }, "scn_011:1:1": { f: "onward" }, "scn_011:1:2": { f: "avoid" },
    "scn_011:2:0": { f: "onward" }, "scn_011:2:1": { f: "onward" }, "scn_011:2:2": { f: "avoid" },
    "scn_011:3:0": { f: "promise", p: "次にランチスポットを見つける約束" }, "scn_011:3:1": { f: "onward" }, "scn_011:3:2": { f: "avoid" },

    /* ---- scn_012 休日の趣味談義（nakamura/food） ---- */
    "scn_012:0:0": { f: "question" }, "scn_012:0:1": { f: "onward" }, "scn_012:0:2": { f: "avoid" },
    "scn_012:1:0": { f: "empathy" }, "scn_012:1:1": { f: "onward" }, "scn_012:1:2": { f: "avoid" },
    "scn_012:2:0": { f: "promise", p: "写真スポットに行く約束" }, "scn_012:2:1": { f: "polite_decline" }, "scn_012:2:2": { f: "avoid" },
    "scn_012:3:0": { f: "promise", p: "土曜の朝の待ち合わせを約束" }, "scn_012:3:1": { f: "onward" }, "scn_012:3:2": { f: "avoid" },

    /* ---- scn_013 朝のあいさつ（suzuki/daily） ---- */
    "scn_013:0:0": { f: "onward" }, "scn_013:0:1": { f: "onward" }, "scn_013:0:2": { f: "avoid" },
    "scn_013:1:0": { f: "empathy" }, "scn_013:1:1": { f: "onward" }, "scn_013:1:2": { f: "avoid" },
    "scn_013:2:0": { f: "question" }, "scn_013:2:1": { f: "onward" }, "scn_013:2:2": { f: "avoid" },
    "scn_013:3:0": { f: "empathy" }, "scn_013:3:1": { f: "promise", p: "また明日あいさつする約束" }, "scn_013:3:2": { f: "avoid" },

    /* ---- scn_014 ゴミ出しの日（suzuki/daily） ---- */
    "scn_014:0:0": { f: "question" }, "scn_014:0:1": { f: "onward" }, "scn_014:0:2": { f: "avoid" },
    "scn_014:1:0": { f: "empathy" }, "scn_014:1:1": { f: "onward" }, "scn_014:1:2": { f: "avoid" },
    "scn_014:2:0": { f: "question" }, "scn_014:2:1": { f: "onward" }, "scn_014:2:2": { f: "avoid" },
    "scn_014:3:0": { f: "promise", p: "また会ったら声をかけ合う約束" }, "scn_014:3:1": { f: "onward" }, "scn_014:3:2": { f: "avoid" },

    /* ---- scn_015 天気の話（suzuki/daily） ---- */
    "scn_015:0:0": { f: "onward" }, "scn_015:0:1": { f: "onward" }, "scn_015:0:2": { f: "avoid" },
    "scn_015:1:0": { f: "self_disclose" }, "scn_015:1:1": { f: "onward" }, "scn_015:1:2": { f: "avoid" },
    "scn_015:2:0": { f: "self_disclose" }, "scn_015:2:1": { f: "onward" }, "scn_015:2:2": { f: "avoid" },
    "scn_015:3:0": { f: "empathy" }, "scn_015:3:1": { f: "onward" }, "scn_015:3:2": { f: "avoid" },

    /* ---- scn_016 花壇の話（suzuki/daily） ---- */
    "scn_016:0:0": { f: "question" }, "scn_016:0:1": { f: "onward" }, "scn_016:0:2": { f: "avoid" },
    "scn_016:1:0": { f: "question" }, "scn_016:1:1": { f: "empathy" }, "scn_016:1:2": { f: "avoid" },
    "scn_016:2:0": { f: "empathy" }, "scn_016:2:1": { f: "onward" }, "scn_016:2:2": { f: "avoid" },
    "scn_016:3:0": { f: "promise", p: "いただいた花を大切に飾ると約束" }, "scn_016:3:1": { f: "onward" }, "scn_016:3:2": { f: "avoid" },

    /* ---- scn_017 帰り道の話（kato/daily） ---- */
    "scn_017:0:0": { f: "self_disclose" }, "scn_017:0:1": { f: "onward" }, "scn_017:0:2": { f: "avoid" },
    "scn_017:1:0": { f: "self_disclose" }, "scn_017:1:1": { f: "onward" }, "scn_017:1:2": { f: "avoid" },
    "scn_017:2:0": { f: "promise", p: "金曜に焼き鳥屋へ行く約束" }, "scn_017:2:1": { f: "onward" }, "scn_017:2:2": { f: "avoid" },
    "scn_017:3:0": { f: "promise", p: "金曜の駅前の待ち合わせを約束" }, "scn_017:3:1": { f: "onward" }, "scn_017:3:2": { f: "avoid" },

    /* ---- scn_018 週末の誘い（kato/daily） ---- */
    "scn_018:0:0": { f: "question" }, "scn_018:0:1": { f: "onward" }, "scn_018:0:2": { f: "avoid" },
    "scn_018:1:0": { f: "question" }, "scn_018:1:1": { f: "onward" }, "scn_018:1:2": { f: "avoid" },
    "scn_018:2:0": { f: "promise", p: "土曜の昼の駅前を約束" }, "scn_018:2:1": { f: "onward" }, "scn_018:2:2": { f: "avoid" },
    "scn_018:3:0": { f: "onward" }, "scn_018:3:1": { f: "onward" }, "scn_018:3:2": { f: "avoid" },

    /* ---- scn_019 ジムの声かけ（nakamura/daily） ---- */
    "scn_019:0:0": { f: "question" }, "scn_019:0:1": { f: "onward" }, "scn_019:0:2": { f: "avoid" },
    "scn_019:1:0": { f: "onward" }, "scn_019:1:1": { f: "onward" }, "scn_019:1:2": { f: "avoid" },
    "scn_019:2:0": { f: "self_disclose" }, "scn_019:2:1": { f: "onward" }, "scn_019:2:2": { f: "avoid" },
    "scn_019:3:0": { f: "promise", p: "マシンの使い方を教わる約束" }, "scn_019:3:1": { f: "onward" }, "scn_019:3:2": { f: "avoid" },

    /* ---- scn_020 新しく始めたこと（nakamura/daily） ---- */
    "scn_020:0:0": { f: "question" }, "scn_020:0:1": { f: "onward" }, "scn_020:0:2": { f: "avoid" },
    "scn_020:1:0": { f: "empathy" }, "scn_020:1:1": { f: "onward" }, "scn_020:1:2": { f: "avoid" },
    "scn_020:2:0": { f: "empathy" }, "scn_020:2:1": { f: "onward" }, "scn_020:2:2": { f: "avoid" },
    "scn_020:3:0": { f: "promise", p: "部屋の写真を見せてもらう約束（機会があれば）" }, "scn_020:3:1": { f: "onward" }, "scn_020:3:2": { f: "avoid" },

    /* ---- scn_021 朝の散歩で出会う（suzuki/daily・朝限定） ---- */
    "scn_021:0:0": { f: "self_disclose" }, "scn_021:0:1": { f: "onward" }, "scn_021:0:2": { f: "avoid" },
    "scn_021:1:0": { f: "question" }, "scn_021:1:1": { f: "onward" }, "scn_021:1:2": { f: "avoid" },
    "scn_021:2:0": { f: "empathy" }, "scn_021:2:1": { f: "onward" }, "scn_021:2:2": { f: "avoid" },
    "scn_021:3:0": { f: "promise", p: "朝の散歩でカモの親子を一緒に見る約束（また会ったら）" }, "scn_021:3:1": { f: "natural_close" }, "scn_021:3:2": { f: "avoid" },

    /* ---- scn_022 午前の進捗確認（tanaka/work・昼限定） ---- */
    "scn_022:0:0": { f: "self_disclose" }, "scn_022:0:1": { f: "onward" }, "scn_022:0:2": { f: "avoid" },
    "scn_022:1:0": { f: "self_disclose" }, "scn_022:1:1": { f: "onward" }, "scn_022:1:2": { f: "avoid" },
    "scn_022:2:0": { f: "question" }, "scn_022:2:1": { f: "onward" }, "scn_022:2:2": { f: "avoid" },
    "scn_022:3:0": { f: "promise", p: "10分後に確認しに来てもらう約束" }, "scn_022:3:1": { f: "natural_close" }, "scn_022:3:2": { f: "avoid" },

    /* ---- scn_023 夜の定食屋さん（konno/food・夕方・夜限定） ---- */
    "scn_023:0:0": { f: "question" }, "scn_023:0:1": { f: "onward" }, "scn_023:0:2": { f: "avoid" },
    "scn_023:1:0": { f: "self_disclose" }, "scn_023:1:1": { f: "onward" }, "scn_023:1:2": { f: "avoid" },
    "scn_023:2:0": { f: "empathy" }, "scn_023:2:1": { f: "onward" }, "scn_023:2:2": { f: "avoid" },
    "scn_023:3:0": { f: "promise", p: "また来週、定食屋に来る約束" }, "scn_023:3:1": { f: "natural_close" }, "scn_023:3:2": { f: "avoid" },

    /* ---- バッチ2（scn_024〜033）facets ---- */
    "scn_024:0:0": { f: "empathy" }, "scn_024:0:1": { f: "onward" }, "scn_024:0:2": { f: "avoid" },
    "scn_024:1:0": { f: "question" }, "scn_024:1:1": { f: "onward" }, "scn_024:1:2": { f: "avoid" },
    "scn_024:2:0": { f: "question" }, "scn_024:2:1": { f: "onward" }, "scn_024:2:2": { f: "polite_decline" },
    "scn_024:3:0": { f: "promise", p: "週末に花壇のバラを見に来る約束" }, "scn_024:3:1": { f: "natural_close" }, "scn_024:3:2": { f: "avoid" },

    "scn_025:0:0": { f: "self_disclose" }, "scn_025:0:1": { f: "onward" }, "scn_025:0:2": { f: "avoid" },
    "scn_025:1:0": { f: "question" }, "scn_025:1:1": { f: "onward" }, "scn_025:1:2": { f: "polite_decline" },
    "scn_025:2:0": { f: "empathy" }, "scn_025:2:1": { f: "onward" }, "scn_025:2:2": { f: "avoid" },
    "scn_025:3:0": { f: "promise", p: "公園のタマに会いに来る約束" }, "scn_025:3:1": { f: "natural_close" }, "scn_025:3:2": { f: "avoid" },

    "scn_026:0:0": { f: "self_disclose" }, "scn_026:0:1": { f: "onward" }, "scn_026:0:2": { f: "avoid" },
    "scn_026:1:0": { f: "question" }, "scn_026:1:1": { f: "onward" }, "scn_026:1:2": { f: "self_disclose" },
    "scn_026:2:0": { f: "self_disclose" }, "scn_026:2:1": { f: "onward" }, "scn_026:2:2": { f: "polite_decline" },
    "scn_026:3:0": { f: "promise", p: "ゴミ出しルールを教えてもらう約束" }, "scn_026:3:1": { f: "natural_close" }, "scn_026:3:2": { f: "avoid" },

    "scn_027:0:0": { f: "self_disclose" }, "scn_027:0:1": { f: "onward" }, "scn_027:0:2": { f: "avoid" },
    "scn_027:1:0": { f: "self_disclose" }, "scn_027:1:1": { f: "onward" }, "scn_027:1:2": { f: "avoid" },
    "scn_027:2:0": { f: "question" }, "scn_027:2:1": { f: "onward" }, "scn_027:2:2": { f: "avoid" },
    "scn_027:3:0": { f: "promise", p: "次回から最初から丁寧に確認する約束" }, "scn_027:3:1": { f: "natural_close" }, "scn_027:3:2": { f: "avoid" },

    "scn_028:0:0": { f: "self_disclose" }, "scn_028:0:1": { f: "onward" }, "scn_028:0:2": { f: "avoid" },
    "scn_028:1:0": { f: "self_disclose" }, "scn_028:1:1": { f: "onward" }, "scn_028:1:2": { f: "avoid" },
    "scn_028:2:0": { f: "self_disclose" }, "scn_028:2:1": { f: "onward" }, "scn_028:2:2": { f: "avoid" },
    "scn_028:3:0": { f: "promise", p: "明日の打ち合わせをよろしくお願いする約束" }, "scn_028:3:1": { f: "natural_close" }, "scn_028:3:2": { f: "avoid" },

    "scn_029:0:0": { f: "self_disclose" }, "scn_029:0:1": { f: "onward" }, "scn_029:0:2": { f: "avoid" },
    "scn_029:1:0": { f: "self_disclose" }, "scn_029:1:1": { f: "onward" }, "scn_029:1:2": { f: "avoid" },
    "scn_029:2:0": { f: "promise" }, "scn_029:2:1": { f: "onward" }, "scn_029:2:2": { f: "polite_decline" },
    "scn_029:3:0": { f: "promise", p: "次のミーティングに資料を持ち帰る約束" }, "scn_029:3:1": { f: "natural_close" }, "scn_029:3:2": { f: "avoid" },

    "scn_030:0:0": { f: "self_disclose" }, "scn_030:0:1": { f: "onward" }, "scn_030:0:2": { f: "polite_decline" },
    "scn_030:1:0": { f: "self_disclose" }, "scn_030:1:1": { f: "onward" }, "scn_030:1:2": { f: "polite_decline" },
    "scn_030:2:0": { f: "self_disclose" }, "scn_030:2:1": { f: "onward" }, "scn_030:2:2": { f: "avoid" },
    "scn_030:3:0": { f: "promise", p: "土曜の朝9時、駅前の花壇で散歩の約束" }, "scn_030:3:1": { f: "natural_close" }, "scn_030:3:2": { f: "avoid" },

    "scn_031:0:0": { f: "self_disclose" }, "scn_031:0:1": { f: "onward" }, "scn_031:0:2": { f: "avoid" },
    "scn_031:1:0": { f: "self_disclose" }, "scn_031:1:1": { f: "onward" }, "scn_031:1:2": { f: "polite_decline" },
    "scn_031:2:0": { f: "self_disclose" }, "scn_031:2:1": { f: "onward" }, "scn_031:2:2": { f: "avoid" },
    "scn_031:3:0": { f: "promise", p: "新作の定食を食べに定食屋に来る約束" }, "scn_031:3:1": { f: "natural_close" }, "scn_031:3:2": { f: "avoid" },

    "scn_032:0:0": { f: "self_disclose" }, "scn_032:0:1": { f: "onward" }, "scn_032:0:2": { f: "polite_decline" },
    "scn_032:1:0": { f: "question" }, "scn_032:1:1": { f: "onward" }, "scn_032:1:2": { f: "polite_decline" },
    "scn_032:2:0": { f: "self_disclose" }, "scn_032:2:1": { f: "onward" }, "scn_032:2:2": { f: "self_disclose" },
    "scn_032:3:0": { f: "promise", p: "新しいメニューを試しに定食屋に来る約束" }, "scn_032:3:1": { f: "natural_close" }, "scn_032:3:2": { f: "avoid" },

    "scn_033:0:0": { f: "self_disclose" }, "scn_033:0:1": { f: "onward" }, "scn_033:0:2": { f: "polite_decline" },
    "scn_033:1:0": { f: "question" }, "scn_033:1:1": { f: "onward" }, "scn_033:1:2": { f: "onward" },
    "scn_033:2:0": { f: "self_disclose" }, "scn_033:2:1": { f: "onward" }, "scn_033:2:2": { f: "avoid" },
    "scn_033:3:0": { f: "promise", p: "また甘味処で加藤さんと会う約束" }, "scn_033:3:1": { f: "natural_close" }, "scn_033:3:2": { f: "avoid" },

    /* ---- バッチ3（scn_034〜043）facets ---- */
    "scn_034:0:0": { f: "self_disclose" }, "scn_034:0:1": { f: "onward" }, "scn_034:0:2": { f: "avoid" },
    "scn_034:1:0": { f: "empathy" }, "scn_034:1:1": { f: "onward" }, "scn_034:1:2": { f: "avoid" },
    "scn_034:2:0": { f: "onward" }, "scn_034:2:1": { f: "onward" }, "scn_034:2:2": { f: "polite_decline" },
    "scn_034:3:0": { f: "promise", p: "借りた傘を返しに行く約束" }, "scn_034:3:1": { f: "natural_close" }, "scn_034:3:2": { f: "avoid" },

    "scn_035:0:0": { f: "self_disclose" }, "scn_035:0:1": { f: "onward" }, "scn_035:0:2": { f: "avoid" },
    "scn_035:1:0": { f: "self_disclose" }, "scn_035:1:1": { f: "onward" }, "scn_035:1:2": { f: "avoid" },
    "scn_035:2:0": { f: "self_disclose" }, "scn_035:2:1": { f: "onward" }, "scn_035:2:2": { f: "avoid" },
    "scn_035:3:0": { f: "promise", p: "朝市でスープをお裾分けする約束" }, "scn_035:3:1": { f: "natural_close" }, "scn_035:3:2": { f: "avoid" },

    "scn_036:0:0": { f: "question" }, "scn_036:0:1": { f: "onward" }, "scn_036:0:2": { f: "avoid" },
    "scn_036:1:0": { f: "self_disclose" }, "scn_036:1:1": { f: "onward" }, "scn_036:1:2": { f: "avoid" },
    "scn_036:2:0": { f: "empathy" }, "scn_036:2:1": { f: "onward" }, "scn_036:2:2": { f: "avoid" },
    "scn_036:3:0": { f: "promise", p: "公園で加藤さんの犬に会う約束" }, "scn_036:3:1": { f: "natural_close" }, "scn_036:3:2": { f: "avoid" },

    "scn_037:0:0": { f: "onward" }, "scn_037:0:1": { f: "empathy" }, "scn_037:0:2": { f: "avoid" },
    "scn_037:1:0": { f: "self_disclose" }, "scn_037:1:1": { f: "onward" }, "scn_037:1:2": { f: "avoid" },
    "scn_037:2:0": { f: "onward" }, "scn_037:2:1": { f: "onward" }, "scn_037:2:2": { f: "avoid" },
    "scn_037:3:0": { f: "promise", p: "山田さんとお茶に行く約束（落ち着いたら）" }, "scn_037:3:1": { f: "onward" }, "scn_037:3:2": { f: "polite_decline" },

    "scn_038:0:0": { f: "self_disclose" }, "scn_038:0:1": { f: "onward" }, "scn_038:0:2": { f: "self_disclose" },
    "scn_038:1:0": { f: "self_disclose" }, "scn_038:1:1": { f: "onward" }, "scn_038:1:2": { f: "self_disclose" },
    "scn_038:2:0": { f: "self_disclose" }, "scn_038:2:1": { f: "onward" }, "scn_038:2:2": { f: "onward" },
    "scn_038:3:0": { f: "onward" }, "scn_038:3:1": { f: "natural_close" }, "scn_038:3:2": { f: "avoid" },

    "scn_039:0:0": { f: "self_disclose" }, "scn_039:0:1": { f: "self_disclose" }, "scn_039:0:2": { f: "avoid" },
    "scn_039:1:0": { f: "self_disclose" }, "scn_039:1:1": { f: "onward" }, "scn_039:1:2": { f: "avoid" },
    "scn_039:2:0": { f: "self_disclose" }, "scn_039:2:1": { f: "onward" }, "scn_039:2:2": { f: "question" },
    "scn_039:3:0": { f: "promise", p: "夕方に引継ぎ資料を田中さんへ確認してもらう約束" }, "scn_039:3:1": { f: "onward" }, "scn_039:3:2": { f: "polite_decline" },

    "scn_040:0:0": { f: "self_disclose" }, "scn_040:0:1": { f: "onward" }, "scn_040:0:2": { f: "avoid" },
    "scn_040:1:0": { f: "self_disclose" }, "scn_040:1:1": { f: "onward" }, "scn_040:1:2": { f: "avoid" },
    "scn_040:2:0": { f: "onward" }, "scn_040:2:1": { f: "self_disclose" }, "scn_040:2:2": { f: "onward" },
    "scn_040:3:0": { f: "onward" }, "scn_040:3:1": { f: "natural_close" }, "scn_040:3:2": { f: "avoid" },

    "scn_041:0:0": { f: "self_disclose" }, "scn_041:0:1": { f: "onward" }, "scn_041:0:2": { f: "onward" },
    "scn_041:1:0": { f: "self_disclose" }, "scn_041:1:1": { f: "onward" }, "scn_041:1:2": { f: "polite_decline" },
    "scn_041:2:0": { f: "self_disclose" }, "scn_041:2:1": { f: "onward" }, "scn_041:2:2": { f: "onward" },
    "scn_041:3:0": { f: "promise", p: "明日、今野さんの店にランチに来る約束" }, "scn_041:3:1": { f: "natural_close" }, "scn_041:3:2": { f: "avoid" },

    "scn_042:0:0": { f: "self_disclose" }, "scn_042:0:1": { f: "onward" }, "scn_042:0:2": { f: "polite_decline" },
    "scn_042:1:0": { f: "empathy" }, "scn_042:1:1": { f: "onward" }, "scn_042:1:2": { f: "polite_decline" },
    "scn_042:2:0": { f: "self_disclose" }, "scn_042:2:1": { f: "onward" }, "scn_042:2:2": { f: "onward" },
    "scn_042:3:0": { f: "promise", p: "新作ができたら試食しに店に来る約束" }, "scn_042:3:1": { f: "natural_close" }, "scn_042:3:2": { f: "avoid" },

    "scn_043:0:0": { f: "self_disclose" }, "scn_043:0:1": { f: "onward" }, "scn_043:0:2": { f: "avoid" },
    "scn_043:1:0": { f: "question" }, "scn_043:1:1": { f: "onward" }, "scn_043:1:2": { f: "onward" },
    "scn_043:2:0": { f: "question" }, "scn_043:2:1": { f: "onward" }, "scn_043:2:2": { f: "self_disclose" },
    "scn_043:3:0": { f: "promise", p: "直売所で中村さんに野菜の選び方を教わる約束" }, "scn_043:3:1": { f: "natural_close" }, "scn_043:3:2": { f: "avoid" },

    /* ---- バッチ4（scn_044〜053）facets ---- */
    "scn_044:0:0": { f: "promise" }, "scn_044:0:1": { f: "question" }, "scn_044:0:2": { f: "avoid" },
    "scn_044:1:0": { f: "empathy" }, "scn_044:1:1": { f: "onward" }, "scn_044:1:2": { f: "onward" },
    "scn_044:2:0": { f: "self_disclose" }, "scn_044:2:1": { f: "onward" }, "scn_044:2:2": { f: "onward" },
    "scn_044:3:0": { f: "promise", p: "貸した本の感想を伝える約束" }, "scn_044:3:1": { f: "natural_close" }, "scn_044:3:2": { f: "avoid" },

    "scn_045:0:0": { f: "self_disclose" }, "scn_045:0:1": { f: "onward" }, "scn_045:0:2": { f: "avoid" },
    "scn_045:1:0": { f: "onward" }, "scn_045:1:1": { f: "onward" }, "scn_045:1:2": { f: "polite_decline" },
    "scn_045:2:0": { f: "empathy" }, "scn_045:2:1": { f: "onward" }, "scn_045:2:2": { f: "avoid" },
    "scn_045:3:0": { f: "promise", p: "また何かの帰りに一緒に帰る約束（機会があれば）" }, "scn_045:3:1": { f: "natural_close" }, "scn_045:3:2": { f: "avoid" },

    "scn_046:0:0": { f: "question" }, "scn_046:0:1": { f: "onward" }, "scn_046:0:2": { f: "onward" },
    "scn_046:1:0": { f: "onward" }, "scn_046:1:1": { f: "onward" }, "scn_046:1:2": { f: "avoid" },
    "scn_046:2:0": { f: "empathy" }, "scn_046:2:1": { f: "onward" }, "scn_046:2:2": { f: "onward" },
    "scn_046:3:0": { f: "promise", p: "来年の縁日でくじ引き勝負する約束" }, "scn_046:3:1": { f: "natural_close" }, "scn_046:3:2": { f: "avoid" },

    "scn_047:0:0": { f: "self_disclose" }, "scn_047:0:1": { f: "onward" }, "scn_047:0:2": { f: "avoid" },
    "scn_047:1:0": { f: "self_disclose" }, "scn_047:1:1": { f: "onward" }, "scn_047:1:2": { f: "self_disclose" },
    "scn_047:2:0": { f: "self_disclose" }, "scn_047:2:1": { f: "onward" }, "scn_047:2:2": { f: "avoid" },
    "scn_047:3:0": { f: "promise", p: "木曜の午前中に途中経過を田中さんへ見せる約束" }, "scn_047:3:1": { f: "onward" }, "scn_047:3:2": { f: "avoid" },

    "scn_048:0:0": { f: "self_disclose" }, "scn_048:0:1": { f: "onward" }, "scn_048:0:2": { f: "avoid" },
    "scn_048:1:0": { f: "self_disclose" }, "scn_048:1:1": { f: "onward" }, "scn_048:1:2": { f: "avoid" },
    "scn_048:2:0": { f: "self_disclose" }, "scn_048:2:1": { f: "onward" }, "scn_048:2:2": { f: "question" },
    "scn_048:3:0": { f: "promise", p: "原因確認が終わったら山田さんへ報告する約束" }, "scn_048:3:1": { f: "onward" }, "scn_048:3:2": { f: "avoid" },

    "scn_049:0:0": { f: "self_disclose" }, "scn_049:0:1": { f: "onward" }, "scn_049:0:2": { f: "self_disclose" },
    "scn_049:1:0": { f: "self_disclose" }, "scn_049:1:1": { f: "onward" }, "scn_049:1:2": { f: "self_disclose" },
    "scn_049:2:0": { f: "self_disclose" }, "scn_049:2:1": { f: "onward" }, "scn_049:2:2": { f: "onward" },
    "scn_049:3:0": { f: "promise", p: "出張中、困ったら佐藤さんに相談する約束" }, "scn_049:3:1": { f: "onward" }, "scn_049:3:2": { f: "avoid" },

    "scn_050:0:0": { f: "onward" }, "scn_050:0:1": { f: "onward" }, "scn_050:0:2": { f: "polite_decline" },
    "scn_050:1:0": { f: "self_disclose" }, "scn_050:1:1": { f: "onward" }, "scn_050:1:2": { f: "polite_decline" },
    "scn_050:2:0": { f: "empathy" }, "scn_050:2:1": { f: "onward" }, "scn_050:2:2": { f: "onward" },
    "scn_050:3:0": { f: "promise", p: "仕事の仲間と今野さんの店に来る約束" }, "scn_050:3:1": { f: "natural_close" }, "scn_050:3:2": { f: "avoid" },

    "scn_051:0:0": { f: "question" }, "scn_051:0:1": { f: "onward" }, "scn_051:0:2": { f: "self_disclose" },
    "scn_051:1:0": { f: "onward" }, "scn_051:1:1": { f: "onward" }, "scn_051:1:2": { f: "avoid" },
    "scn_051:2:0": { f: "empathy" }, "scn_051:2:1": { f: "onward" }, "scn_051:2:2": { f: "self_disclose" },
    "scn_051:3:0": { f: "promise", p: "浅漬けを作ったら花田さんに感想を伝える約束" }, "scn_051:3:1": { f: "natural_close" }, "scn_051:3:2": { f: "avoid" },

    "scn_052:0:0": { f: "onward" }, "scn_052:0:1": { f: "onward" }, "scn_052:0:2": { f: "onward" },
    "scn_052:1:0": { f: "question" }, "scn_052:1:1": { f: "onward" }, "scn_052:1:2": { f: "question" },
    "scn_052:2:0": { f: "empathy" }, "scn_052:2:1": { f: "onward" }, "scn_052:2:2": { f: "onward" },
    "scn_052:3:0": { f: "promise", p: "屋台前でまた加藤さんと会う約束" }, "scn_052:3:1": { f: "natural_close" }, "scn_052:3:2": { f: "onward" },

    "scn_053:0:0": { f: "self_disclose" }, "scn_053:0:1": { f: "onward" }, "scn_053:0:2": { f: "polite_decline" },
    "scn_053:1:0": { f: "question" }, "scn_053:1:1": { f: "onward" }, "scn_053:1:2": { f: "onward" },
    "scn_053:2:0": { f: "self_disclose" }, "scn_053:2:1": { f: "onward" }, "scn_053:2:2": { f: "onward" },
    "scn_053:3:0": { f: "promise", p: "醤油をもらって、その返しにお味噌汁を作る約束" }, "scn_053:3:1": { f: "natural_close" }, "scn_053:3:2": { f: "avoid" },

    /* ---- バッチ5（scn_054〜060）facets ---- */
    "scn_054:0:0": { f: "self_disclose" }, "scn_054:0:1": { f: "onward" }, "scn_054:0:2": { f: "avoid" },
    "scn_054:1:0": { f: "self_disclose" }, "scn_054:1:1": { f: "onward" }, "scn_054:1:2": { f: "avoid" },
    "scn_054:2:0": { f: "empathy" }, "scn_054:2:1": { f: "onward" }, "scn_054:2:2": { f: "avoid" },
    "scn_054:3:0": { f: "promise", p: "休日に佐藤さんとお茶をする約束（機会があれば）" }, "scn_054:3:1": { f: "natural_close" }, "scn_054:3:2": { f: "avoid" },

    "scn_055:0:0": { f: "self_disclose" }, "scn_055:0:1": { f: "onward" }, "scn_055:0:2": { f: "avoid" },
    "scn_055:1:0": { f: "question" }, "scn_055:1:1": { f: "onward" }, "scn_055:1:2": { f: "polite_decline" },
    "scn_055:2:0": { f: "empathy" }, "scn_055:2:1": { f: "onward" }, "scn_055:2:2": { f: "avoid" },
    "scn_055:3:0": { f: "promise", p: "また朝のランニングで田中さんと走る約束" }, "scn_055:3:1": { f: "natural_close" }, "scn_055:3:2": { f: "avoid" },

    "scn_056:0:0": { f: "self_disclose" }, "scn_056:0:1": { f: "onward" }, "scn_056:0:2": { f: "self_disclose" },
    "scn_056:1:0": { f: "self_disclose" }, "scn_056:1:1": { f: "onward" }, "scn_056:1:2": { f: "avoid" },
    "scn_056:2:0": { f: "empathy" }, "scn_056:2:1": { f: "onward" }, "scn_056:2:2": { f: "avoid" },
    "scn_056:3:0": { f: "promise", p: "午後の会議に資料を送る約束" }, "scn_056:3:1": { f: "natural_close" }, "scn_056:3:2": { f: "avoid" },

    "scn_057:0:0": { f: "self_disclose" }, "scn_057:0:1": { f: "onward" }, "scn_057:0:2": { f: "avoid" },
    "scn_057:1:0": { f: "self_disclose" }, "scn_057:1:1": { f: "onward" }, "scn_057:1:2": { f: "avoid" },
    "scn_057:2:0": { f: "empathy" }, "scn_057:2:1": { f: "onward" }, "scn_057:2:2": { f: "self_disclose" },
    "scn_057:3:0": { f: "promise", p: "明日の仕事を山田さんに任せて帰る約束" }, "scn_057:3:1": { f: "natural_close" }, "scn_057:3:2": { f: "avoid" },

    "scn_058:0:0": { f: "self_disclose" }, "scn_058:0:1": { f: "onward" }, "scn_058:0:2": { f: "polite_decline" },
    "scn_058:1:0": { f: "question" }, "scn_058:1:1": { f: "onward" }, "scn_058:1:2": { f: "polite_decline" },
    "scn_058:2:0": { f: "self_disclose" }, "scn_058:2:1": { f: "onward" }, "scn_058:2:2": { f: "onward" },
    "scn_058:3:0": { f: "promise", p: "明日も花田さんの店に朝ごはんを食べに来る約束" }, "scn_058:3:1": { f: "natural_close" }, "scn_058:3:2": { f: "avoid" },

    "scn_059:0:0": { f: "self_disclose" }, "scn_059:0:1": { f: "onward" }, "scn_059:0:2": { f: "onward" },
    "scn_059:1:0": { f: "question" }, "scn_059:1:1": { f: "onward" }, "scn_059:1:2": { f: "polite_decline" },
    "scn_059:2:0": { f: "empathy" }, "scn_059:2:1": { f: "onward" }, "scn_059:2:2": { f: "onward" },
    "scn_059:3:0": { f: "promise", p: "雨の日に今野さんの店の持ち帰りを頼む約束" }, "scn_059:3:1": { f: "natural_close" }, "scn_059:3:2": { f: "avoid" },

    "scn_060:0:0": { f: "self_disclose" }, "scn_060:0:1": { f: "onward" }, "scn_060:0:2": { f: "onward" },
    "scn_060:1:0": { f: "self_disclose" }, "scn_060:1:1": { f: "onward" }, "scn_060:1:2": { f: "onward" },
    "scn_060:2:0": { f: "empathy" }, "scn_060:2:1": { f: "onward" }, "scn_060:2:2": { f: "avoid" },
    "scn_060:3:0": { f: "promise", p: "また駄菓子屋で加藤さんと会う約束" }, "scn_060:3:1": { f: "natural_close" }, "scn_060:3:2": { f: "avoid" }
  };

  /** 回答へ facet を適用（facet 付与・type 上書き・promiseNote 追加） */
  function applyAnswerAugments(scenes) {
    scenes.forEach(function (s) {
      s.rounds.forEach(function (round, ri) {
        (round.answers || []).forEach(function (a, ai) {
          const aug = AUGMENTS[s.id + ":" + ri + ":" + ai];
          if (!aug) return;
          if (aug.f) a.facet = aug.f;
          if (aug.t) a.type = aug.t;
          if (aug.p) a.promiseNote = aug.p;
        });
      });
    });
    return scenes;
  }
  applyAnswerAugments(KE_SCENES);

  if (globalThis) globalThis.KE_SCENES = KE_SCENES;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_SCENES };
})();
