# CLAUDE.md

プロジェクト「kenecho Village」を開発・保守するための説明書。このファイルは本プロジェクトに取り組む開発エージェント向け。

## プロジェクト概要

- 名称：kenecho Village ― 健康と会話で育てるピクセルペット ―
- 種別：ローカルWebアプリ（サーバ不要・データ送信なし）
- 用途：健康記録（食事・運動・睡眠・体重）→ 健康EXP → ペット育成 → 架空NPCとの会話クエスト（3択）→ きずな度 → 思い出・旅立ち・次世代の中心ループを持つ研修・学習用教材
- 対象ブラウザ：PC版 Chrome / Edge の最新版
- 制作目的：医療・栄養・心理・人格を診断しない。表示値は健康管理と会話練習の参考情報

## 絶対条件（技術制約）

1. HTML / CSS / JavaScript のみ。外部フレームワーク・外部API・外部DB・CDN・外部画像・外部フォントは一切使用しない
2. サーバーへデータを送信しない。データは localStorage へ保存
3. `kenecho-village.html` を `file://` で直接開いて動作すること（読み込み用のサーバ起動を前提にしない）
4. `fetch()` を使わない。独立データはローカル JavaScript ファイルとして読み込む
5. **ES Modules は使わない**（file:// で CORS により読み込めないため）。classic `<script>` タグを依存順で並べ、各ファイルは `globalThis` に名前空間を公開する
6. ユーザー入力は `textContent` 等で安全に表示し、HTML 文字列へ直接埋め込まない
7. 画面に「研修用・本番利用不可」を常時表示する
8. 実在人物・企業・顧客・勤務情報・実際の健康記録は使用しない（架空データのみ）
9. ピクセル素材は実行時 Canvas 描画方式（PNG ファイルは持たない。ピクセル定義＝配色マス配列を `js/data/pixel-art/` に保有）

## ファイル構成

```
kenecho-village.html              … 全画面の骨格・script/css 読み込み（依存順）
css/style.css           … 田園生活風ピクセルUI（8pxグリッド・基本色パレット）
js/config.js            … 定数集約（現実・成長閾値・目標初期値・EXP表・関係段階・スコア基準）
js/util.js              … 汎用ヘルパ（日付/時刻・ID生成・クランプ・乱数・重み付き抽選）
js/data/                … データ（スポット使用禁止、UI描画へ直接書かない）
  foods.js              … プリセット食品50件
  exercises.js          … プリセット運動20件
  pets.js               … 6種ペット＋卵の定義
  pet-coach-speech.js   … コーチ台詞（150〜180件）
  npc-data.js           … 8名の架空NPC
  conversation-scenes.js… 会話シーン20件（クエスト＋練習用）
  story-lines.js        … ストーリー枠の台詞（導入/展開/応答/締めのミニ回合プール）
  relationship-rules.js … きずな度・関係段階のルール定義
  animation-manifest.js … アニメーション動作一覧（フレーム数・fps・優先順位）
  pixel-art/pets.js     … ペットのピクセル定義（共通ボディ＋種類別アクセサリ＋表情）
  pixel-art/npcs.js     … NPC8名のピクセル定義（chibi人型・ボディ/髪型/配色/エプロン/メガネ）
js/db.js                … localStorage統一スキーマ・保存/復元/隔離/初期化
js/health.js            … BMI/基礎代謝・食事/運動/睡眠/体重のCRUD・目標・健康スコア/EXP
js/pet-game.js          … 卵/成長/孵化/種類決定/図鑑/思い出/旅立ち/次世代
js/relationship.js      … きずな度・会話回数・関係段階・交流ノート集計
js/npc-memory.js        … NPC別の会話記憶（話題・約束・期待・誤解。世代を越えて維持・練習は読み取り専用）
js/outings.js           … 外出の時間帯・天気・場面選択（時間帯境界・天気抽選・安全場面・固定条件）
js/dialogue-engine.js   … コーチ台詞の抽選・フォールバック・連続回避
js/conversation-game.js … 会話クエスト（1ターン）/練習モード（4ターン+ボーナス）
js/sprite.js            … ピクセル定義→Canvas描画・モーション合成・シルエット表現
js/animation.js         … アニメ再生・優先順位制御・prefers-reduced-motion対応
js/npc-sprite.js        … NPC描画（ピクセル定義→Canvas・表情フレーム・expression→face）
js/npc-animation.js     … NPCアニメーション再生（既存再生コアを読み取り利用）
js/conv-scene.js        … 会話シーン合成描画（背景＋人物を1枚に・呼吸/talkアニメ）
js/ui.js                … 画面生成・トップバー・モーダル・通知・フォーム検証・初期設定・各画面
js/app.js               … 起動・初期設定フロー・画面遷移・イベント配線（最後に読み込む）
tools/tests/            … Node標準テスト（node --test）
docs/                   … 要件定義・詳細設計・UI仕様・テスト仕様
```

`kenecho-village.html` の `<script>` は「data → ロジック → sprite/animation → ui → app」の順で読み込む。app.js が必ず最後。

## データ・設計の一致ルール

- `docs/` の文書と実装で、用語・数値・ID・状態名を一致させる。変更時は両方更新する
- 成長閾値・目標初期値・EXP表などの数値は `js/config.js` に一元管理し、散在させない
- 仕様変更時は必ず文書と実装をセットで更新し、テストを更新する

## 用語・ID の統一規約

- 成長段階キー：`egg` / `child` / `growing` / `adult` / `companion` / `departure`
- ペット種別：`rabbit`（優しい型）/ `fox`(冷静型) / `bearcub`(元気型) / `cat`(好奇心型) / `bird`(慎重型) / `tanuki`(お調子者型)
- NPC ID：`npc_sato` / `npc_yamada` / `npc_konno` / `npc_nakamura` / `npc_tanaka` / `npc_suzuki` / `npc_hanada` / `npc_kato`
- 回答分類：`good`(会話が続きやすい) / `short`(短いが自然) / `bad`(会話が続きにくい)
- 関係段階キー：`stranger`/`familiar`/`connected`/`trusted`/`partner`
- 日付は `YYYY-MM-DD`（ローカル日時）、時刻は `HH:mm`（24時間表記）

## 開発フロー（各マイルストーン共通）

1. 変更内容と対象ファイルをユーザーに説明してから着手
2. 実装後 `node --test tools/tests/` でロジック検証（Green を維持）
3. ブラウザ確認手順をユーザーに提示（Chrome/Edge・コンソールとNetworkタブの確認を含む）
4. 正常確認後 Git コミットし、コミットメッセージを報告
5. 問題を残したまま次へ進まない

## アクセシビリティ・品質

- 本文16px以上・ボタン高さ48px以上・`focus-visible` 表示・`aria-live` の会話結果通知・`prefers-reduced-motion` 対応
- エラーは入力欄直下へ文章で表示
- ピクセルアートは整数倍率で拡大し、なめらかな補間をしない
