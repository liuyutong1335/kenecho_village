"use strict";
/*
 * kenecho Village - ペット別コーチ台詞データ（KE_COACH_SPEECH）
 * 台詞は画面処理へ直接書かず、ここへ集約する。
 * M9 時点で 19件の土台（種類×回答分類＋共通＋フォールバック）を用意し、
 * 条件バリエーション（成長段階・健康状態・シーン・関係段階・イベント）は M11 で 150〜180件へ拡張する。
 */
(function () {
  const KE_COACH_SPEECH = [
    /* ---- うさぎ（優しい型） ---- */
    { id: "coach_rabbit_feedback_good_001", petTypes: ["rabbit"], coachTypes: ["gentle"], growthStages: [], petConditions: [], answerType: "good", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "共感してから質問を返せたね。相手も話しやすそう！", weight: 10 },
    { id: "coach_rabbit_feedback_short_001", petTypes: ["rabbit"], coachTypes: ["gentle"], growthStages: [], petConditions: [], answerType: "short", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "あっさりしてるけど、失礼にはならなかったよ。次は感想をひとつ足すと、もっと顔がほころぶかも。", weight: 10 },
    { id: "coach_rabbit_feedback_bad_001", petTypes: ["rabbit"], coachTypes: ["gentle"], growthStages: [], petConditions: [], answerType: "bad", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "うーん、ちょっと話が止まりそうな返しだったよ。まず相手の言葉に乗ってみると、会話が続きやすい。", weight: 10 },
    /* ---- きつね（冷静型） ---- */
    { id: "coach_fox_feedback_good_001", petTypes: ["fox"], coachTypes: ["calm"], growthStages: [], petConditions: [], answerType: "good", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "相手の状況を具体的に考えられた返しだ。情報が多くなるほど、会話は続きやすい。", weight: 10 },
    { id: "coach_fox_feedback_short_001", petTypes: ["fox"], coachTypes: ["calm"], growthStages: [], petConditions: [], answerType: "short", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "短い返しは悪くない。ただ、目的が「続けること」なら、ひと言の理由があると効果的だ。", weight: 10 },
    { id: "coach_fox_feedback_bad_001", petTypes: ["fox"], coachTypes: ["calm"], growthStages: [], petConditions: [], answerType: "bad", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "会話の糸を切ってしまいがちな返しだ。次は相手の言葉を一文繰り返してから返すと、道がつながる。", weight: 10 },
    /* ---- こぐま（元気型） ---- */
    { id: "coach_bearcub_feedback_good_001", petTypes: ["bearcub"], coachTypes: ["energetic"], growthStages: [], petConditions: [], answerType: "good", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "いいね、その返し、明るく続いてく気がする！ この調子！", weight: 10 },
    { id: "coach_bearcub_feedback_short_001", petTypes: ["bearcub"], coachTypes: ["energetic"], growthStages: [], petConditions: [], answerType: "short", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "短くても大丈夫！ 次は笑顔で一言ふくらませてみよう。それだけでトゲトゲが消えるよ。", weight: 10 },
    { id: "coach_bearcub_feedback_bad_001", petTypes: ["bearcub"], coachTypes: ["energetic"], growthStages: [], petConditions: [], answerType: "bad", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "おっと、それだと相手が返事に困っちゃうかも。気持ちは分かるけど、まずは相手の話にのってみよう！", weight: 10 },
    /* ---- ねこ（好奇心型） ---- */
    { id: "coach_cat_feedback_good_001", petTypes: ["cat"], coachTypes: ["curious"], growthStages: [], petConditions: [], answerType: "good", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "いいね、そこから相手のどんな話が飛び出すか、興味が涌く返しだったよ。", weight: 10 },
    { id: "coach_cat_feedback_short_001", petTypes: ["cat"], coachTypes: ["curious"], growthStages: [], petConditions: [], answerType: "short", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "ふつうの短い返しだね。あと「あなたはどうなの？」を添えると、話が続きやすくなる気配。", weight: 10 },
    { id: "coach_cat_feedback_bad_001", petTypes: ["cat"], coachTypes: ["curious"], growthStages: [], petConditions: [], answerType: "bad", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "うーん、その返しだと相手の興味が切れちゃうかも。質問をひとつ足してみるといいよ。", weight: 10 },
    /* ---- ことり（慎重型） ---- */
    { id: "coach_bird_feedback_good_001", petTypes: ["bird"], coachTypes: ["cautious"], growthStages: [], petConditions: [], answerType: "good", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "相手の様子をよく見て、安全な返しを選べたね。信頼は一歩ずつ積まれる。", weight: 10 },
    { id: "coach_bird_feedback_short_001", petTypes: ["bird"], coachTypes: ["cautious"], growthStages: [], petConditions: [], answerType: "short", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "短くても失礼のない返しなら安心。次の一歩として、相手の好みを聞く質問を足すと良い。", weight: 10 },
    { id: "coach_bird_feedback_bad_001", petTypes: ["bird"], coachTypes: ["cautious"], growthStages: [], petConditions: [], answerType: "bad", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "その返しは、相手をじっと俯かせてしまう危険があるね。短文でも、まず同意から始めよう。", weight: 10 },
    /* ---- たぬき（お調子者型） ---- */
    { id: "coach_tanuki_feedback_good_001", petTypes: ["tanuki"], coachTypes: ["playful"], growthStages: [], petConditions: [], answerType: "good", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "おっ、いいノリじゃん！ その返しだと、相手もつられて笑顔になりそう。", weight: 10 },
    { id: "coach_tanuki_feedback_short_001", petTypes: ["tanuki"], coachTypes: ["playful"], growthStages: [], petConditions: [], answerType: "short", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "そっけないくらいがちょうどいい時もあるよね。でも、笑いをひとつ添えると、届きやすくなるかも。", weight: 10 },
    { id: "coach_tanuki_feedback_bad_001", petTypes: ["tanuki"], coachTypes: ["playful"], growthStages: [], petConditions: [], answerType: "bad", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "あちゃー、それは空振りしちゃったかな。冗談が空回りしたら、素直な一言に切り替えるのが早い。", weight: 10 },
    /* ---- 回答分類のみ（フォールバック3段階目） ---- */
    { id: "coach_common_good_001", petTypes: [], coachTypes: [], growthStages: [], petConditions: [], answerType: "good", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "会話が続きやすい返しだったね。相手も次の言葉を探しやすくなる。", weight: 10 },
    { id: "coach_common_short_001", petTypes: [], coachTypes: [], growthStages: [], petConditions: [], answerType: "short", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "自然な短い返しだったよ。失礼にはならないので、安心して使って大丈夫。", weight: 10 },
    { id: "coach_common_bad_001", petTypes: [], coachTypes: [], growthStages: [], petConditions: [], answerType: "bad", sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "feedback", text: "少し会話が止まりやすい返しだったね。次は相手の言葉にオウム返しで乗ってみよう。", weight: 10 },
    /* ---- 共通の安全な台詞（フォールバック最終段） ---- */
    { id: "coach_common_fallback_001", petTypes: [], coachTypes: [], growthStages: [], petConditions: [], answerType: null, sceneTags: [], relationLevels: [], petRelationLevels: [], purpose: "fallback", text: "自分のペースで話せたのがよかったよ。次もその調子！", weight: 10 }
  ];

  if (globalThis) globalThis.KE_COACH_SPEECH = KE_COACH_SPEECH;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_COACH_SPEECH };
})();
