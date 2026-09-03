"use strict";
/*
 * kenecho Village - プリセット運動（KE_EXERCISES）20件
 * 架空の参考データ。METs は一般的な活動強度の目安で、体重と時間から
 * 消費カロリーを推定します。医療・運動指導の基準ではありません。
 *
 * ExerciseDef: { id, name, mets, note }
 *   消費kcal = METs × 3.5 × 体重kg ÷ 200 × 時間(分)
 */
(function () {
  const KE_EXERCISES = [
    { id: "ex_walk01", name: "ウォーキング（ふつう）", mets: 3.5, note: "息が軽く上がる程度" },
    { id: "ex_walk02", name: "ウォーキング（速い）", mets: 4.3, note: "少し汗ばむ速さ" },
    { id: "ex_jog01", name: "ジョギング（ゆっくり）", mets: 6.0, note: "会話ができる程度" },
    { id: "ex_run01", name: "ランニング（やや速い）", mets: 8.0, note: "呼吸が続けて苦しい程度" },
    { id: "ex_strength", name: "筋力トレーニング", mets: 4.0, note: "ダンベルやマシン" },
    { id: "ex_stretch", name: "ストレッチ", mets: 2.5, note: "ゆったり伸ばす" },
    { id: "ex_yoga", name: "ヨガ", mets: 2.5, note: "呼吸に合わせて" },
    { id: "ex_bike", name: "自転車（通勤・買い物）", mets: 6.0, note: "やや息を切らす程度" },
    { id: "ex_swim01", name: "水泳（ゆっくり）", mets: 6.0, note: "クロールや平泳ぎをゆっくり" },
    { id: "ex_squat", name: "スクワット・自重運動", mets: 4.0, note: "自分の体重を支える運動" },
    { id: "ex_crunch", name: "腹筋・背筋運動", mets: 3.5, note: "床に寝て行う" },
    { id: "ex_taiso", name: "軽い体操・ラジオ体操", mets: 3.0, note: "朝の体操など" },
    { id: "ex_stairs", name: "階段のぼり", mets: 8.0, note: "息が上がりやすい" },
    { id: "ex_homework", name: "掃除・家事（はげしく）", mets: 3.0, note: "モップ掛け・拭き掃除" },
    { id: "ex_shopping", name: "買い物・歩行", mets: 3.0, note: "店内の移動をふくむ" },
    { id: "ex_dance", name: "ダンス（軽め）", mets: 6.0, note: "音楽にあわせて" },
    { id: "ex_badminton", name: "バドミントン", mets: 5.5, note: "レクリエーション程度" },
    { id: "ex_tabletennis", name: "卓球", mets: 4.0, note: "ラリーを楽しむ程度" },
    { id: "ex_tennis", name: "テニス（ふつう）", mets: 7.0, note: "シングルス・基礎打ち" },
    { id: "ex_soccer", name: "サッカー（軽め）", mets: 8.0, note: "練習・ミニゲーム" }
  ];

  if (globalThis) globalThis.KE_EXERCISES = KE_EXERCISES;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_EXERCISES: KE_EXERCISES };
})();
