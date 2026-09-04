"use strict";
/*
 * kenecho Village - 短編物語「小さな約束」データ（KE_STORY_SMALL_PROMISE）
 * 既存NPC（佐藤さん）・公園背景（outdoor）・ペット・会話UI（3択）を再利用する4章構成の短編。
 * - 各章 = 短い導入 + 3択会話2ターン + 結果・助言
 * - 章2終了時に「参加（participate）」か「案内文の手伝い（help）」の約束を確定
 * - 章3で約束の変更可能（参加⇔手伝い）。自由入力はない（手伝いルートは用意した案内文から選ぶ）
 * - 結末A「一緒に歩いた日」（参加ルート）／結末B「言葉でつないだ日」（手伝いルート）は両方とも肯定的
 * - 丁寧な断りは減点理由にせず、きずな度で結末の優劣を決めない
 * - 手紙（レター）機能は実装しない
 * 回答の型は既存の慣例（text/type/facet/npcReply/npcExpression/explanation/nextHint/weight）に従う。
 */
(function () {
  const KE_STORY_SMALL_PROMISE = {
    id: "story_small_promise",
    title: "小さな約束",
    subtitle: "佐藤さんと、公園で交わす ちいさな約束",
    npcId: "npc_sato",
    background: "outdoor",
    chapterCount: 4,

    /** 章1の選択（共感/質問/経験の共有）から引く話題フレーズ。次章の導入や交流ノートの手がかりに使う */
    topics: {
      empathy: {
        key: "empathy", label: "きみの話を聞くこと",
        phrase: "佐藤さんの「話したい」に、心を寄せた",
        note: "その日、あなたは佐藤さんの話を静かに聞いた。"
      },
      question: {
        key: "question", label: "散歩会のことを尋ねること",
        phrase: "散歩会のことを、くわしく尋ねた",
        note: "その日、あなたの質問で周会用の話は具体的になった。"
      },
      self_disclose: {
        key: "self_disclose", label: "自分の散歩の経験を話すこと",
        phrase: "自分の散歩の経験を、重ねて話した",
        note: "その日、あなたは自分の散歩の話を、佐藤さんに重ねて話した。"
      }
    },

    chapters: [
      /* ==================================================================== */
      /* 第1章「話してみたいこと」                                              */
      /* ==================================================================== */
      {
        chapter: 1,
        title: "話してみたいこと",
        introVariants: [
          "仕事帰りの公園で、佐藤さんがベンチに座っていた。あなたの姿を見つけて、ゆっくり手を振っている。",
          "夕方の公園は、やわらかな風が吹いている。散歩をしていた佐藤さんが、ぽつりと話しかけてきた。",
          "陽のあたる公園の広場で、佐藤さんがあなたのペットの姿を見つけて、やさしく微笑んだ。"
        ],
        rounds: [
          {
            npcLine: "実はね、ずっと思ってたことがあって。……よかったら、聞いてくれる？",
            npcExpression: "smile",
            answers: [
              { text: "うん、いいよ。ゆっくり聞きたいです。", type: "good", facet: "empathy",
                npcReply: "ありがとう。……散歩会、開いてみたいんだよね。一人じゃなくて、誰かと公園を歩く会。",
                npcExpression: "soft", explanation: "相手の話を受け止めて聞く姿勢を示すと、心を開いてくれる。", nextHint: "その先の「どんなことをしたいか」を尋ねると、話が広がる。", weight: 10 },
              { text: "どんなことをしたいんですか？", type: "short", facet: "question",
                npcReply: "公園を一周して、軽くおしゃべりする、そんな集まり。敷居が低いといいなって思ってる。",
                npcExpression: "curious", explanation: "具体的な質問は、相手のイメージを引き出して続きにつながる。", nextHint: "「誰とやりたい？」と重ねると、さらに具体的になる。", weight: 10 },
              { text: "私も、散歩を続けたくて公園に来てるんです。", type: "good", facet: "self_disclose",
                npcReply: "そうなんだ！ それなら、歩きながら話せる相手がいるといいよね。",
                npcExpression: "happy", explanation: "自分の経験を重ねると、共通点から会話が温かくなる。", nextHint: "自分の散歩の感想を一言添えると、より共感される。", weight: 10 }
            ]
          },
          {
            npcLine: "散歩会って、張り切ると続かなくてね。ゆるく、でも続く形がいいと思うんだ。",
            npcExpression: "soft",
            answers: [
              { text: "ゆるく続くのが一番ですよね。私も無理のないペースが合います。", type: "good", facet: "self_disclose",
                npcReply: "そう言ってもらえると安心する。……なんだか、その話、好きだな。",
                npcExpression: "happy", explanation: "相手の考えに自分の価値観を重ねると、親しみが増す。", nextHint: "「また聞きたいです」と添えると、次につながる。", weight: 10 },
              { text: "最初は、どれくらいの人数で考えてるんですか？", type: "short", facet: "question",
                npcReply: "まずは2〜3人かな。少ないと始めやすいでしょ？",
                npcExpression: "smile", explanation: "現実的な質問ほど、相手の抱負を具体化しやすい。", nextHint: "「私も人数に入るね」と伝えると、お誘いに自然に続く。", weight: 10 },
              { text: "今日、その話を聞けてよかったです。", type: "good", facet: "empathy",
                npcReply: "……うん、私も。話せて、なんだか気持ちが軽くなった。",
                npcExpression: "happy", explanation: "相手の話に「よかった」と返すと、開かれた気持ちが残る。", nextHint: "最後に「また公園で」とつなげると、次章への糸ができる。", weight: 10 }
            ]
          }
        ],
        result: {
          text: "佐藤さんは、誰かに本音を話せたことがうれしそう。道端の花を指さして、また話そうね、と笑った。",
          advice: {
            text: "相手の「話したい」に、まずは寄り添えたね。会話は、受け止めるところから始まるよ。",
            example: "「うん、聞くよ」の一言でも、相手は話しやすくなるね。"
          }
        }
      },

      /* ==================================================================== */
      /* 第2章「小さなお誘い」                                                  */
      /* ==================================================================== */
      {
        chapter: 2,
        title: "小さなお誘い",
        introByTopic: {
          empathy: "前回、佐藤さんが話してくれた散歩会のこと。今日も公園で、佐藤さんが待っていてくれた。",
          question: "前回、あなたの質問で具体的になった散歩会。今日も公園で、佐藤さんが声をかけてきた。",
          self_disclose: "前回、あなたが話してくれた散歩の話を、佐藤さんはうれしそうに聞いていた。今日も、公園で会った。"
        },
        rounds: [
          {
            npcLine: "ねえ、散歩会のこと。あの時のみんなで……かなうなら、あなたにも協力してほしいんだ。",
            npcExpression: "smile",
            answers: [
              { text: "うん、私も参加したいです！", type: "good", facet: "promise",
                npcReply: "本当？ じゃあ、どんな形がいいか一緒に考えよう。",
                npcExpression: "happy", explanation: "乗り気を伝えると、相手は心強い。", nextHint: "続けて「楽しみです」を添えると、気持ちが伝わる。", weight: 10 },
              { text: "話を聞かせてよ、どうするのか詳しく。", type: "short", facet: "question",
                npcReply: "もちろん。時間と場所、それに集まる人数のことを、話すね。",
                npcExpression: "smile", explanation: "聞いてから決める姿勢は、失礼ではない。", nextHint: "説明を聞いた段階で、参加か手伝いかを決められる。", weight: 10 },
              { text: "参加は難しいかも。でも案内文を作るのは手伝えるよ。", type: "good", facet: "polite_decline",
                npcReply: "手伝ってくれる？ 案内文があると、参加ハードルが下がる気がするんだ。",
                npcExpression: "happy", explanation: "無理に参加するよりも、できる形で力を貸す選択もある。", nextHint: "具体的に「何を手伝うか」を決めると、約束らしくなる。", weight: 10 }
            ]
          }
        ],
        round2ByTurn1: {
          "0": {
            npcLine: "ありがとう。じゃあ、まずはこじんまり、公園の広場で待ち合わせにする。その約束でいい？",
            npcExpression: "smile",
            answers: [
              { text: "うん、楽しみにしてます。その日は開けておくね。", type: "good", facet: "promise", promiseRoute: "participate",
                npcReply: "うん、約束！ 当日が、もう待ち遠しい。",
                npcExpression: "happy", explanation: "具体的な日を約束すると、相手は安心する。", nextHint: "小さな変更があっても、早めに伝えるのが信頼を守る。", weight: 10 },
              { text: "うん。もし予定がずれそうなら、早めに知らせるね。", type: "short", facet: "promise", promiseRoute: "participate",
                npcReply: "それがいい。頼りにしてるよ。",
                npcExpression: "smile", explanation: "変更への心配を先に伝えるのも、誠実さになる。", nextHint: "当日を楽しみに待てば、そのまま約束は育っていく。", weight: 10 },
              { text: "ごめんね、当日の参加は難しそう。案内文の手伝いに替えてもいい？", type: "good", facet: "polite_decline", promiseRoute: "help",
                npcReply: "そうか……無理はしないで。それなら、案内文を最後まで見届けてほしいな。",
                npcExpression: "soft", explanation: "断る代わりに「できる形」を出せると、関係は保たれる。", nextHint: "替えた約束も、ちゃんと果たすことが大切。", weight: 10 }
            ]
          },
          "1": {
            npcLine: "説明すると、公園の広場を朝と昼の2班で、少人数で歩いて、途中のベンチでおしゃべり。料金も準備もなし。それでも大丈夫そう？",
            npcExpression: "smile",
            answers: [
              { text: "大丈夫、それなら参加したいです。", type: "good", facet: "promise", promiseRoute: "participate",
                npcReply: "よかった！ じゃあ、その一言が最初の約束になるね。",
                npcExpression: "happy", explanation: "説明を受けてから参加を決めても、十分に誠実。", nextHint: "次は「どんな歩き方をしたいか」を話す番。", weight: 10 },
              { text: "分かった。それなら参加の予定で進めてください。", type: "short", facet: "promise", promiseRoute: "participate",
                npcReply: "うん、予定にいれておくよ。",
                npcExpression: "smile", explanation: "条件に合うなら、参加を決めるのは自然な流れ。", nextHint: "決断した気持ちを言葉にすると、支えになる。", weight: 10 },
              { text: "歩くのは難しいかも。でも案内文を広める手伝いはできるよ。", type: "good", facet: "polite_decline", promiseRoute: "help",
                npcReply: "それも助かる！ 言葉で、人をつなぐ手伝いができるね。",
                npcExpression: "happy", explanation: "参加の形も種類がある。無理をしない選択を尊重する。", nextHint: "手伝いルートは、用意された案内文から選んで協力を完了する。", weight: 10 }
            ]
          },
          "2": {
            npcLine: "案内文、本当？ 助かる。言葉にするのが苦手で……自然に伝わる書き方を、見てほしいんだ。",
            npcExpression: "soft",
            answers: [
              { text: "うん、一緒にいい一文を考えよう。", type: "good", facet: "promise", promiseRoute: "help",
                npcReply: "ありがとう……そう言ってもらえると、肩の力が抜けるよ。",
                npcExpression: "happy", explanation: "「一緒に」を作ると、手伝いが二人の協力になる。", nextHint: "次は、伝えたい言葉を一緒に選んでいくよ。", weight: 10 },
              { text: "草案を書いてくるから、添削してもらえる？", type: "short", facet: "promise", promiseRoute: "help",
                npcReply: "いいね、草案を見るのを楽しみにしてる。",
                npcExpression: "smile", explanation: "具体的な役割を申し出ると、協力が進みやすい。", nextHint: "無理のない分担が、長く続く支えになる。", weight: 10 },
              { text: "手伝うよ。あとは、当日も顔を出せるか、また連絡するね。", type: "good", facet: "promise", promiseRoute: "help",
                npcReply: "うん、必ずしもしなくていいから。顔を出せる日があったら、うれしいな。",
                npcExpression: "happy", explanation: "手伝いと同時に、ゆるい参加の気持ちを伝えてもよい。", nextHint: "約束は、自分に無理のない形でこそ続く。", weight: 10 }
            ]
          }
        },
        result: {
          byRoute: {
            participate: "「散歩会に参加する」小さな約束が、生まれた。佐藤さんは明るい顔で、またね、と手を振った。",
            help: "「案内文を手伝う」小さな約束が、生まれた。言葉にこまっていた佐藤さんの、肩の力が抜けたようだった。"
          },
          advice: {
            participate: {
              text: "「参加すると決めて伝える」ことが、相手との約束になるね。決めたことを、心に留めておこう。",
              example: "「その日は開けておくね」と、一言添えると約束は確かなものになるよ。"
            },
            help: {
              text: "参加できなくても、「できる形で応える」のは、十分に相手を支えているよ。",
              example: "「一緒に案内文を作ろう」と、協力の一言を伝えると伝わるね。"
            }
          }
        }
      },

      /* ==================================================================== */
      /* 第3章「自分の言葉で」                                                  */
      /* ==================================================================== */
      {
        chapter: 3,
        title: "自分の言葉で",
        introByRoute: {
          participate: "散歩会参加の約束の翌日。あなたは自分の言葉で、どんな歩き方をしたいかを話す番だ。",
          help: "案内文の約束の続き。あなたは、用意された案内文から、伝えたい言葉を選ぶ番だ。"
        },
        routeRounds: {
          participate: {
            rounds: [
              {
                npcLine: "いい？　あなたとどう歩きたいかを、聞かせてほしいな。",
                npcExpression: "smile",
                answers: [
                  { text: "私の希望は、ゆっくりペースでいいってことです。", type: "good", facet: "self_disclose",
                    npcReply: "うん、それいいね。急がないのは大事だよ。",
                    npcExpression: "happy", explanation: "自分の希望を伝えると、相手は歩調を合わせやすい。", nextHint: "続けて「公園のどこを歩きたいか」も言えると良い。", weight: 10 },
                  { text: "佐藤さんは、どう歩こうと思ってるんですか？", type: "short", facet: "question",
                    npcReply: "私は、途中のベンチで写真を撮りながら、でいいかな。",
                    npcExpression: "smile", explanation: "相手の考えを確認すると、歩調が合いやすい。", nextHint: "「それなら私も一緒に写真を見てもいい？」と続くと距離が縮まる。", weight: 10 },
                  { text: "相談なんだけど、参加は難しい日が出てきそうで。案内文の手伝いに替えてもいい？", type: "good", facet: "polite_decline",
                    npcReply: "そうか……無理はしないでね。それなら手伝ってもらおうかな。",
                    npcExpression: "soft", explanation: "約束を変えるときは、理由と代替を伝えると相手は安心する。", nextHint: "続けて「手伝いの具体的な分担」を聞くと、新しい形が決まる。", weight: 10 }
                ]
              }
            ],
            round2ByTurn1: {
              "0": {
                npcLine: "よし、じゃあ小さな目標を決めようか。散歩会の日は、どれくらい歩く？",
                npcExpression: "smile",
                answers: [
                  { text: "30分くらいで、のんびり歩こう。", type: "good", facet: "self_disclose", promiseRoute: "participate",
                    npcReply: "それ、ちょうどいい。無理のない散歩になりそうだ。",
                    npcExpression: "happy", explanation: "具体的な目標を合わせると、約束が形になる。", nextHint: "当日が、いよいよ近づいてくる。", weight: 10 },
                  { text: "天気のいい日に、を目安にしよう。", type: "short", facet: "promise", promiseRoute: "participate",
                    npcReply: "うん、天気のいい日が一番だね。ゆるく決められるのがいい。",
                    npcExpression: "smile", explanation: "条件付きの約束も、無理のない形の一部。", nextHint: "雨の日の代わりも考えておくと安心。", weight: 10 },
                  { text: "やっぱり、案内文の手伝いに一本でいきたい。", type: "good", facet: "polite_decline", promiseRoute: "help",
                    npcReply: "そうか、わかった。それなら、もう一度案内文の話から始めよう。",
                    npcExpression: "soft", explanation: "自分の言葉で約束を変えるのは、相手への誠実さでもある。", nextHint: "新しい約束に合わせて、次の相談が始まる。", weight: 10 }
                ]
              },
              "1": {
                npcLine: "よし、じゃあ小さな目標を決めようか。散歩会の日は、どれくらい歩く？",
                npcExpression: "smile",
                answers: [
                  { text: "30分くらいで、のんびり歩こう。", type: "good", facet: "self_disclose", promiseRoute: "participate",
                    npcReply: "それ、ちょうどいい。無理のない散歩になりそうだ。",
                    npcExpression: "happy", explanation: "具体的な目標を合わせると、約束が形になる。", nextHint: "当日が、いよいよ近づいてくる。", weight: 10 },
                  { text: "天気のいい日に、を目安にしよう。", type: "short", facet: "promise", promiseRoute: "participate",
                    npcReply: "うん、天気のいい日が一番だね。ゆるく決められるのがいい。",
                    npcExpression: "smile", explanation: "条件付きの約束も、無理のない形の一部。", nextHint: "雨の日の代わりも考えておくと安心。", weight: 10 },
                  { text: "聞いたうえで、やっぱり手伝いに替えたい。", type: "good", facet: "polite_decline", promiseRoute: "help",
                    npcReply: "そうか。聞いてくれたうえでなら、納得できるよ。案内文の話を始めよう。",
                    npcExpression: "soft", explanation: "相手の考えを尊重したうえで決めた変更は、誠実に伝わる。", nextHint: "新しい約束に合わせて、次の相談が始まる。", weight: 10 }
                ]
              },
              "2": {
                npcLine: "うん、オーケー。じゃあ改めて、案内文のことを。どんな人を想定して書こうか？",
                npcExpression: "smile",
                answers: [
                  { text: "近所の人向けで、やさしい言葉がいいね。", type: "good", facet: "empathy", promiseRoute: "help",
                    npcReply: "うん、初めての人にも伝わる言葉がいい。",
                    npcExpression: "happy", explanation: "伝える相手を想定すると、言葉が選びやすくなる。", nextHint: "案内文の方向が、少しずつ決まってくる。", weight: 10 },
                  { text: "参加ハードルの低い言葉で作ろう。", type: "short", facet: "self_disclose", promiseRoute: "help",
                    npcReply: "「のんびり」「途中からでも」「無料」そんな言葉が鍵になりそう。",
                    npcExpression: "smile", explanation: "気軽さを言語化すると、案内文になる。", nextHint: "言葉が決まると、佐藤さんの気持ちも固まる。", weight: 10 },
                  { text: "2つ作って、どちらにするか明日決めよう。", type: "good", facet: "promise", promiseRoute: "help",
                    npcReply: "それも手だね。比べると、いい言葉が残りそう。",
                    npcExpression: "happy", explanation: "選択肢を持つのも、協力の形。", nextHint: "決めた言葉が、参加する人につながっていく。", weight: 10 }
                ]
              }
            }
          },
          help: {
            rounds: [
              {
                npcLine: "案内文の素材ができたの。伝えたいことを書き出してみた……よかったら、見てくれる？",
                npcExpression: "soft",
                answers: [
                  { text: "いいね。この「ゆっくり歩こう」って一文が好きだな。", type: "good", facet: "empathy",
                    npcReply: "それ、私も気に入ってたんだ。入れてみようか。",
                    npcExpression: "happy", explanation: "具体的な一文を褒めると、選ぶ言葉が決まる。", nextHint: "選んだ言葉で、次に文章がまとまっていく。", weight: 10 },
                  { text: "「話ができたら」ってさらっとした一文、柔らかくていいね。", type: "short", facet: "empathy",
                    npcReply: "うん、無理に盛らないのが、この会のらしさかもしれない。",
                    npcExpression: "smile", explanation: "らしさを言葉にすると、案内文に温かさが出る。", nextHint: "残りの一文も、一緒に選んでいく。", weight: 10 },
                  { text: "「初めてでも大丈夫」を、入れてほしいな。", type: "good", facet: "self_disclose",
                    npcReply: "それ大事！ 迷っている人に向けての一文になるよ。",
                    npcExpression: "happy", explanation: "迷う人の気持ちを想う言葉は、届きやすい。", nextHint: "そうした気遣いが、協力の形になる。", weight: 10 }
                ]
              },
              {
                npcLine: "ありがとう、ぼんやりしていた言葉が、こうして形になっていくんだね。",
                npcExpression: "soft",
                answers: [
                  { text: "うん、この言葉なら、きっと届くと思う。", type: "good", facet: "promise", promiseRoute: "help",
                    npcReply: "……うん、そう言ってもらえると安心する。",
                    npcExpression: "happy", explanation: "完成したものを認めると、協力が報われる。", nextHint: "次の章で、その言葉がどう働いたかが分かる。", weight: 10 },
                  { text: "私が選んだ一文、気に入ってくれてよかった。", type: "short", facet: "empathy", promiseRoute: "help",
                    npcReply: "選んでくれた一文が、今は一番のお気に入りだよ。",
                    npcExpression: "happy", explanation: "選んだ気持ちと、それを受け取る気持ちが重なると、協力が深まる。", nextHint: "その言葉が、次章でどう届くのか。", weight: 10 },
                  { text: "あとは当日、参加者に会えるのを楽しみにしてるね。", type: "good", facet: "natural_close", promiseRoute: "help",
                    npcReply: "うん。言葉が、人をつないでくれるといいな。",
                    npcExpression: "happy", explanation: "協力の先にある姿を言葉にするのもうれしい。", nextHint: "つないだ言葉の結果を、次章で聞ける。", weight: 10 }
                ]
              }
            ]
          }
        },
        result: {
          byRoute: {
            participate: "あなたの言葉で、参加がより自分のものになった。佐藤さんは、その形をうれしそうに受け止めた。",
            help: "用意した案内文から選んだ言葉で、協力が完了した。佐藤さんの気持ちが、ひとつに固まった。"
          },
          advice: {
            participate: {
              text: "「自分はどうしたいか」を言葉にできると、約束が自分のものになるね。",
              example: "「ゆっくり歩こう」と具体的に言うと、相手も合わせやすくなるよ。"
            },
            help: {
              text: "伝えたいことの中から、言葉を選ぶこと。それも立派な協力だよ。",
              example: "「初めてでも大丈夫」のように、相手を想う一文は届きやすいね。"
            }
          }
        }
      },

      /* ==================================================================== */
      /* 第4章「それぞれのありがとう」                                           */
      /* ==================================================================== */
      {
        chapter: 4,
        title: "それぞれのありがとう",
        introByRoute: {
          participate: "約束の日。公園の広場に、佐藤さんといくつかの人影。朝の空気が、心を清らかにしていく。",
          help: "案内文がきっかけで、散歩会に初めての人が顔を出した。公園のベンチで、佐藤さんがあなたを待っていた。"
        },
        routeRounds: {
          participate: {
            rounds: [
              {
                npcLine: "来てくれたんだね。あなたがいると思うと、今日は特別に楽しみだった。",
                npcExpression: "happy",
                answers: [
                  { text: "私も来れてよかったです。空気がすがすがしいですね。", type: "good", facet: "self_disclose",
                    npcReply: "うん。こういう朝を、ずっと一緒に歩きたかったんだ。",
                    npcExpression: "happy", explanation: "その場の実感を言葉にすると、約束が喜びになる。", nextHint: "帰り際に、またの約束を交わすと温かい。", weight: 10 },
                  { text: "歩くのはやっぱり気持ちいいですね。ありがとう。", type: "short", facet: "empathy",
                    npcReply: "こちらこそ。一緒に歩く人がいて、心強いよ。",
                    npcExpression: "smile", explanation: "感謝を返すと、相手も歩いた甲斐を感じる。", nextHint: "少しだけ感想を続けると、会話がなめらかになる。", weight: 10 },
                  { text: "楽しい散歩会になりそう。次も誘ってもらえたら、うれしいです。", type: "good", facet: "promise",
                    npcReply: "もちろん！ それが聞けただけで、今日は大成功だよ。",
                    npcExpression: "happy", explanation: "次の約束を見せると、関係が続いていく。", nextHint: "約束が重なると、ふたりの日々に育っていく。", weight: 10 }
                ]
              },
              {
                npcLine: "……小さな約束が、こうして大きな一日のかたちになって。本当に、ありがとう。",
                npcExpression: "soft",
                answers: [
                  { text: "こちらこそ、誘ってくれてありがとうございました。", type: "good", facet: "empathy",
                    npcReply: "うん、またゆっくり、ね。",
                    npcExpression: "happy", explanation: "互いにありがとうを渡し合えると、約束は完成する。", nextHint: "結末A「一緒に歩いた日」。", weight: 10 },
                  { text: "またこうして、ゆっくり歩けるのを楽しみにしてます。", type: "short", facet: "promise",
                    npcReply: "私も。それが、次の小さな約束だね。",
                    npcExpression: "happy", explanation: "次の約束を言葉にすると、物語は新しい一歩を刻む。", nextHint: "結末A「一緒に歩いた日」。", weight: 10 },
                  { text: "佐藤さんが開いてくれた会に参加できて、よかったです。", type: "good", facet: "empathy",
                    npcReply: "……それを聞けて、本当にうれしいよ。ありがとう。",
                    npcExpression: "soft", explanation: "主催した人の気持ちを思うと、相手は報われる。", nextHint: "結末A「一緒に歩いた日」。", weight: 10 }
                ]
              }
            ]
          },
          help: {
            rounds: [
              {
                npcLine: "ねえ、聞いてほしいの。案内文、とっても反響があったの。初めての人も来てくれて。",
                npcExpression: "happy",
                answers: [
                  { text: "よかった！ 言葉が、届いたんですね。", type: "good", facet: "empathy",
                    npcReply: "うん。「ゆっくり歩こう」の一文に、背中を押されたって言われたの。",
                    npcExpression: "happy", explanation: "結果を喜ぶと、手伝いの価値が相手に伝わる。", nextHint: "次の一文も、また選びたくなる。", weight: 10 },
                  { text: "初めての人は、緊張しても来れたんですか？", type: "short", facet: "question",
                    npcReply: "「途中からでも大丈夫」って一文が、勇気をくれたみたい。",
                    npcExpression: "smile", explanation: "実際の反応を聞くと、協力の意味が実感できる。", nextHint: "「その言葉でよかった」と返すと、話がまとまる。", weight: 10 },
                  { text: "次の案内も、また一緒に作れるといいですね。", type: "good", facet: "promise",
                    npcReply: "うん……それが、次の約束になりそうだね。",
                    npcExpression: "happy", explanation: "次の約束を見せると、言葉の縁が続いていく。", nextHint: "つないだ言葉が、新しい縁を生んでいる。", weight: 10 }
                ]
              },
              {
                npcLine: "あなたに手伝ってもらった一文が……来てくれた人の背中を、押したのかな。ありがとう。",
                npcExpression: "soft",
                answers: [
                  { text: "こちらこそ、頼ってくれてありがとう。", type: "good", facet: "empathy",
                    npcReply: "うん。頼ってよかったって、心から思ってる。",
                    npcExpression: "happy", explanation: "頼る側と助ける側のありがとうが、交わり合う。", nextHint: "結末B「言葉でつないだ日」。", weight: 10 },
                  { text: "背中を押せたなら、うれしいです。", type: "short", facet: "empathy",
                    npcReply: "押せたよ。間違いなく。あなたの言葉でね。",
                    npcExpression: "happy", explanation: "相手が実感を返すと、協力は確かな物語になる。", nextHint: "結末B「言葉でつないだ日」。", weight: 10 },
                  { text: "また、言葉が必要なときは、呼んでください。", type: "good", facet: "promise",
                    npcReply: "もちろん。それが、次の小さな約束になりそうだね。",
                    npcExpression: "happy", explanation: "「また呼んで」と伝えると、これからも続いていく。", nextHint: "結末B「言葉でつないだ日」。", weight: 10 }
                ]
              }
            ]
          }
        },
        result: {
          byRoute: {
            participate: "散歩会は、穏やかな時間のまま終わった。佐藤さんは、何度もありがとうを繰り返していた。",
            help: "あなたの言葉が、誰かの足を公園へ向けさせた。佐藤さんは、これからも長く縁が続く気がすると話した。"
          },
          advice: {
            participate: {
              text: "約束を、当日と一緒に歩くまで続けられたね。小さな約束は、大きな喜びになった。",
              example: "「また、のんびり歩こう」と続けると、次の約束も生まれていくよ。"
            },
            help: {
              text: "あなたの言葉が、誰かをつないだね。舞台に立たなくても、言葉は人を動かせるよ。",
              example: "「また呼んでね」の一言が、次の縁の種になる。"
            }
          }
        }
      }
    ],

    /** 結末：参加ルートA「一緒に歩いた日」／手伝いルートB「言葉でつないだ日」（どちらも肯定的） */
    endings: {
      A: {
        key: "A",
        id: "ending_walk",
        title: "一緒に歩いた日",
        catchline: "小さな約束が、一歩ずつ、一緒に歩く日のかたちになった。",
        summary: "「散歩会に参加する」という約束は、朝の公園を並んで歩く一日へと育った。佐藤さんは、何度も何度も、ありがとうを言っていた。"
      },
      B: {
        key: "B",
        id: "ending_words",
        title: "言葉でつないだ日",
        catchline: "小さな約束が、あなたの言葉で、誰かと誰かを結ぶ日になった。",
        summary: "「案内文を手伝う」という約束は、迷っていた誰かの足を公園へ向けさせる言葉になった。つないだ縁は、これからも続いていく。"
      }
    }
  };

  if (globalThis) globalThis.KE_STORY_SMALL_PROMISE = KE_STORY_SMALL_PROMISE;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_STORY_SMALL_PROMISE };
})();
