"use strict";
/*
 * 短編物語「小さな約束」（feat/story-small-promise）のテスト。
 * - データ整合：4章・各章の導入/2ターン×3択・結果/助言・結末A/B・約束ルート
 * - 開始条件（孵化済み＋面識・朝昼夕・1日1章・日次スロット共有）
 * - 進行：章フロー・約束の確定と変更・結末A/B・途中再開・読み返し
 * - 報酬：きずな度は章完了時に一度だけ・健康EXPは付与しない
 * - 保存互換：旧セーブ（storyProgress なし）・世代交代・デモ分離
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");

const root = path.join(__dirname, "..", "..", "js");
require(path.join(root, "config.js"));
require(path.join(root, "util.js"));
require(path.join(root, "data", "relationship-rules.js"));
require(path.join(root, "data", "foods.js"));
require(path.join(root, "data", "exercises.js"));
require(path.join(root, "data", "pets.js"));
require(path.join(root, "data", "pet-coach-speech.js"));
require(path.join(root, "data", "npc-data.js"));
require(path.join(root, "data", "conversation-scenes.js"));
require(path.join(root, "data", "story-lines.js"));
require(path.join(root, "data", "story-small-promise.js"));
require(path.join(root, "health.js"));
require(path.join(root, "pet-game.js"));
require(path.join(root, "relationship.js"));
require(path.join(root, "npc-memory.js"));
require(path.join(root, "dialogue-engine.js"));
require(path.join(root, "conversation-game.js"));
const { KE_DB } = require(path.join(root, "db.js"));
const { KE_STORY } = require(path.join(root, "story-small-promise.js"));

const C = globalThis.KE_CONFIG;
const DATA = globalThis.KE_STORY_SMALL_PROMISE;
const FACETS = C.ANSWER_FACETS;

const T1 = "2026-09-01";
const T2 = "2026-09-02";
const T3 = "2026-09-03";
const T4 = "2026-09-04";
const T5 = "2026-09-05";

function baseDb(profileId) {
  const d = KE_DB.defaultData();
  d.profile = { displayName: "テスト", profileId: profileId || "p_story_test" };
  d.currentPet = {
    generationId: "gen_001", name: "モモ", speciesId: "rabbit", speciesRevealed: true,
    stage: "child", recentDialogueIds: [], lastQuestDate: null, cumulativeExp: 0,
    questDays: 0, recordedDays: 0, petBond: 20
  };
  globalThis.KE_RELATIONSHIP.ensureNpc(d, "npc_sato");
  return d;
}

function noSave() { return { save: false }; }

/** 章1を最後まで倒し、完了結果を返す */
function playChapter(db, ch, t1Idx, t2Idx, today) {
  const s = KE_STORY.startChapter(db, Object.assign({ today: today, band: "daytime" }, noSave()));
  assert.equal(s.ok, true, "章開始 第" + ch + "章");
  assert.equal(KE_STORY.getProgress(db).chapter, ch);
  const r1 = KE_STORY.chooseAnswer(db, ch, 0, t1Idx, Object.assign({ today: today }, noSave()));
  assert.equal(r1.ok, true, "ターン1");
  assert.equal(r1.final, false);
  const r2 = KE_STORY.chooseAnswer(db, ch, 1, t2Idx, Object.assign({ today: today }, noSave()));
  assert.equal(r2.ok, true, "ターン2");
  assert.equal(r2.final, true);
  return r2;
}

/* ==================================================================== */
/* データ整合                                                             */
/* ==================================================================== */

/** 全回合の answers を列挙（再帰ヘルパ） */
function allRounds(ch) {
  const out = [];
  function pushRound(r, label) { if (r && r.answers) out.push({ label: label, round: r }); }
  if (ch.rounds) ch.rounds.forEach(function (r, i) { pushRound(r, ch.chapter + ":rounds[" + i + "]"); });
  if (ch.round2ByTurn1) {
    Object.keys(ch.round2ByTurn1).forEach(function (k) { pushRound(ch.round2ByTurn1[k], ch.chapter + ":round2ByTurn1[" + k + "]"); });
  }
  if (ch.routeRounds) {
    Object.keys(ch.routeRounds).forEach(function (route) {
      const g = ch.routeRounds[route];
      if (g.rounds) g.rounds.forEach(function (r, i) { pushRound(r, ch.chapter + ":" + route + ".rounds[" + i + "]"); });
      if (g.round2ByTurn1) {
        Object.keys(g.round2ByTurn1).forEach(function (k) { pushRound(g.round2ByTurn1[k], ch.chapter + ":" + route + ".round2ByTurn1[" + k + "]"); });
      }
    });
  }
  return out;
}

test("短編データ：4章・章番号順・結末A/B・物語NPC（佐藤さん）", () => {
  assert.ok(DATA, "データが存在");
  assert.equal(DATA.npcId, "npc_sato");
  assert.equal(DATA.background, "outdoor");
  assert.equal(DATA.chapterCount, 4);
  assert.deepEqual(DATA.chapters.map((c) => c.chapter), [1, 2, 3, 4]);
  const titles = DATA.chapters.map((c) => c.title);
  assert.deepEqual(titles, ["話してみたいこと", "小さなお誘い", "自分の言葉で", "それぞれのありがとう"]);
  assert.ok(DATA.endings.A.title === "一緒に歩いた日" && DATA.endings.A.catchline, "結末A");
  assert.ok(DATA.endings.B.title === "言葉でつないだ日" && DATA.endings.B.catchline, "結末B");
});

test("短編データ：各章の導入と3択2ターン・全選択に解説/助言があり bad が無い", () => {
  const npcIdSet = new Set(globalThis.KE_NPCS.map((n) => n.id));
  DATA.chapters.forEach((ch) => {
    assert.ok(ch.title && ch.title.length, "章見出し");
    const hasIntro = (ch.introVariants && ch.introVariants.length) || ch.introByTopic || ch.introByRoute;
    assert.ok(hasIntro, ch.chapter + " 導入がある");
    for (const r of allRounds(ch)) {
      assert.equal(r.round.answers.length, 3, r.label + " は3択");
      r.round.answers.forEach((a) => {
        assert.ok(["good", "short", "bad"].indexOf(a.type) >= 0, r.label + " type");
        assert.ok(FACETS[a.facet], r.label + " facet: " + a.text.slice(0, 10));
        assert.ok(a.npcReply && a.npcReply.length, r.label + " npcReply");
        assert.ok(a.explanation && a.nextHint, r.label + " 解説");
        assert.notEqual(a.type, "bad", "断罪しない（bad回答なし）: " + r.label + "「" + a.text.slice(0, 10) + "」");
        if (a.facet === "polite_decline") assert.notEqual(a.type, "bad", "丁寧な断りは減点にしない");
        if (a.promiseRoute != null) assert.ok(["participate", "help"].indexOf(a.promiseRoute) >= 0, r.label + " promiseRoute");
      });
    }
  });
  // 章2・3には「約束の確定／変更」がある（promiseRoute の回答が存在）
  const routes = allRounds(DATA.chapters[1]).some((r) => r.round.answers.some((a) => a.promiseRoute != null));
  const routes3 = allRounds(DATA.chapters[2]).some((r) => r.round.answers.some((a) => a.promiseRoute != null));
  assert.equal(routes, true, "章2に約束確定の選択肢");
  assert.equal(routes3, true, "章3に約束選択肢");
  // 章1はルート非依存（イントロ差分/話題引き継ぎ用）
  assert.equal(allRounds(DATA.chapters[0]).length, 2, "章1は共通2ターン");
});

test("短編ロジック：開始条件（孵化済み＋面識・朝昼夕・未面識は通常の出会いへ案内）", () => {
  const dEgg = baseDb();
  dEgg.currentPet.speciesRevealed = false;
  const rEgg = KE_STORY.startChapter(dEgg, Object.assign({ today: T1, band: "daytime" }, noSave()));
  assert.equal(rEgg.ok, false);
  assert.equal(rEgg.reason, "not_met");

  const dNoNpc = baseDb();
  dNoNpc.relationships.npcs = {};
  const rNo = KE_STORY.startChapter(dNoNpc, { today: T1, band: "daytime", save: false });
  assert.equal(rNo.ok, false);
  assert.equal(rNo.reason, "not_met");

  const d = baseDb();
  const rNight = KE_STORY.startChapter(d, { today: T1, band: "night", save: false });
  assert.equal(rNight.ok, false);
  assert.equal(rNight.reason, "night_band");
  assert.equal(KE_STORY.getStatus(d, T1, "night").canEngage, false);

  const rOk = KE_STORY.startChapter(d, { today: T1, band: "daytime", save: false });
  assert.equal(rOk.ok, true);
});

test("短編ロジック：開始時の時間帯・天気・場面を維持する（chapterMeta）", () => {
  const d = baseDb();
  d.conversation.outing = { date: T1, timeBand: "evening", weather: "rain", sceneId: "scn_001" };
  const s = KE_STORY.startChapter(d, { today: T1, band: "evening", save: false });
  assert.equal(s.ok, true);
  const meta = KE_STORY.getProgress(d).chapterMeta;
  assert.equal(meta.timeBand, "evening");
  assert.equal(meta.weather, "rain");
  assert.equal(meta.date, T1);
});

test("短編ロジック：第1章のみで進み、ターン2選択で章完了→きずな度1回・健康EXPなし", () => {
  const d = baseDb();
  const bondBefore = globalThis.KE_RELATIONSHIP.getNpcBond(d, "npc_sato");
  assert.equal(bondBefore, 40);
  const r2 = playChapter(d, 1, 0, 0, T1); // good + good = +16
  const p = KE_STORY.getProgress(d);
  assert.deepEqual(p.completedChapters, [1]);
  assert.equal(p.resolved, true);
  assert.equal(p.slotUsedDate, T1);
  assert.equal(p.lastChapterCompletedAt, T1);
  // きずな度は「章完了時に一度だけ」既存計算（+8/+3/−4・0〜100補正）
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcBond(d, "npc_sato"), 40 + 16);
  assert.equal(r2.deltaSum, 16);
  const hist = d.relationshipHistory.filter((h) => h.why === "story");
  assert.equal(hist.length, 1);
  assert.equal(hist[0].chapter, 1);
  // 会話回数は1回加算
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcState(d, "npc_sato").conversations, 1);
  // 健康EXP・ペットきずな度は付与しない
  assert.equal(d.currentPet.cumulativeExp, 0);
  assert.equal(d.currentPet.petBond, 20);
  // 1日1章：同じ日の再開始は不可
  const again = KE_STORY.startChapter(d, { today: T1, band: "daytime", save: false });
  assert.equal(again.ok, false);
  assert.equal(again.reason, "story_today");
  // 同行ペットの記録（名前・世代）
  assert.equal(p.companionHistory.length, 1);
  assert.equal(p.companionHistory[0].chapter, 1);
  assert.equal(p.companionHistory[0].petName, "モモ");
  assert.equal(p.companionHistory[0].generationId, "gen_001");
});

test("短編ロジック：章2の約束（参加／確認→手伝い／手伝い）が確定する", () => {
  // 参加ルート
  const dP = baseDb();
  playChapter(dP, 1, 0, 0, T1);
  playChapter(dP, 2, 0, 0, T2);
  assert.equal(KE_STORY.getProgress(dP).promise.route, "participate");
  // 確認 → 手伝いルート
  const dH = baseDb();
  playChapter(dH, 1, 1, 0, T1);
  playChapter(dH, 2, 1, 2, T2);
  assert.equal(KE_STORY.getProgress(dH).promise.route, "help");
  // 直接手伝いルート
  const dH2 = baseDb();
  playChapter(dH2, 1, 2, 0, T1);
  playChapter(dH2, 2, 2, 0, T2);
  assert.equal(KE_STORY.getProgress(dH2).promise.route, "help");
});

test("短編ロジック：章3で約束を変更できる（参加→手伝い）", () => {
  const d = baseDb();
  playChapter(d, 1, 0, 0, T1);
  playChapter(d, 2, 0, 0, T2); // 参加
  assert.equal(KE_STORY.getProgress(d).promise.route, "participate");
  playChapter(d, 3, 2, 0, T3); // 約束の変更 → 手伝い
  assert.equal(KE_STORY.getProgress(d).promise.route, "help");
  // 変更しなければ維持
  const d2 = baseDb();
  playChapter(d2, 1, 0, 0, T1);
  playChapter(d2, 2, 0, 0, T2);
  playChapter(d2, 3, 0, 0, T3);
  assert.equal(KE_STORY.getProgress(d2).promise.route, "participate");
});

test("短編ロジック：結末A（参加）と結末B（手伝い）が約束ルートで決まる（きずな度は不関与）", () => {
  const dA = baseDb();
  playChapter(dA, 1, 0, 0, T1);
  playChapter(dA, 2, 0, 0, T2);
  playChapter(dA, 3, 0, 0, T3);
  const eA = playChapter(dA, 4, 0, 0, T5);
  assert.equal(eA.ok, true);
  const pA = KE_STORY.getProgress(dA);
  assert.equal(pA.ending.key, "A");
  assert.equal(pA.ending.title, "一緒に歩いた日");
  assert.ok(pA.endingCard, "記念カード（物語の思い出）");
  assert.equal(pA.endingCard.type, "story");
  assert.equal(pA.endingCard.storyTitle, "小さな約束");
  assert.equal(pA.endingCard.endingKey, "A");
  assert.equal(pA.endingCard.finishedAt, T5);
  assert.deepEqual(pA.completedChapters, [1, 2, 3, 4]);

  const dB = baseDb();
  playChapter(dB, 1, 2, 0, T1);
  playChapter(dB, 2, 2, 1, T2);
  playChapter(dB, 3, 0, 0, T3);
  const eB = playChapter(dB, 4, 0, 1, T5);
  assert.equal(eB.ok, true);
  const pB = KE_STORY.getProgress(dB);
  assert.equal(pB.ending.key, "B");
  assert.equal(pB.ending.title, "言葉でつないだ日");
});

test("短編ロジック：終了後は開始不可（done）", () => {
  const d = baseDb();
  playChapter(d, 1, 0, 0, T1);
  playChapter(d, 2, 0, 0, T2);
  playChapter(d, 3, 0, 0, T3);
  const last = playChapter(d, 4, 0, 0, T5);
  assert.equal(last.ok, true);
  assert.equal(KE_STORY.getStatus(d, T5, "daytime").state, "done");
  const r = KE_STORY.startChapter(d, { today: T5, band: "daytime", save: false });
  assert.equal(r.ok, false);
  assert.equal(r.reason, "done");
});

test("短編ロジック：途中再開（保存→復元）で章・ターン・選択・約束が維持される", () => {
  const d = baseDb();
  playChapter(d, 1, 0, 0, T1);
  const s = KE_STORY.startChapter(d, { today: T2, band: "daytime", save: false });
  assert.equal(s.ok, true);
  const r1 = KE_STORY.chooseAnswer(d, 2, 0, 1, { today: T2, save: false }); // 質問
  assert.equal(r1.ok, true);
  assert.equal(r1.final, false);
  // リロード相当：スナップショットを複製して同じ state を復元
  const restored = JSON.parse(JSON.stringify(d));
  const st = KE_STORY.getStatus(restored, T2, "daytime");
  assert.equal(st.state, "in_progress");
  assert.equal(st.turn, 1);
  const ts = KE_STORY.getTurnState(restored, 2, T2);
  assert.equal(ts.chapter, 2);
  assert.equal(ts.choice.t1, 1);
  assert.equal(ts.round1 != null, true, "ターン2の回合が提示される");
  const r2 = KE_STORY.chooseAnswer(restored, 2, 1, 0, { today: T2, save: false });
  assert.equal(r2.ok, true);
  assert.equal(r2.final, true);
  assert.deepEqual(KE_STORY.getProgress(restored).completedChapters, [1, 2]);
  assert.equal(KE_STORY.getProgress(restored).promise.route, "participate");
});

test("短編ロジック：読み返しは本編状態・報酬を変更しない", () => {
  const d = baseDb();
  playChapter(d, 1, 1, 0, T1);
  const before = JSON.parse(JSON.stringify(d));
  const rb = KE_STORY.getReadback(d, 1);
  assert.equal(rb.ok, true);
  assert.equal(rb.title, "話してみたいこと");
  assert.equal(rb.t1Index, 1);
  assert.ok(rb.t1 && rb.t2 && rb.result, "読み返し内容");
  assert.deepEqual(JSON.parse(JSON.stringify(d)), before);
  // 未完了章は読み返せない
  const d2 = baseDb();
  const rNot = KE_STORY.getReadback(d2, 1);
  assert.equal(rNot.ok, false);
  assert.equal(rNot.reason, "not_completed");
});

test("短編ロジック：二重処理を防止（同ターン回答、完了章の再回答）", () => {
  const d = baseDb();
  KE_STORY.startChapter(d, { today: T1, band: "daytime", save: false });
  const a1 = KE_STORY.chooseAnswer(d, 1, 0, 0, { today: T1, save: false });
  assert.equal(a1.ok, true);
  const d1 = KE_STORY.chooseAnswer(d, 1, 0, 1, { today: T1, save: false });
  assert.equal(d1.ok, false);
  assert.equal(d1.reason, "duplicate_turn");
  KE_STORY.chooseAnswer(d, 1, 1, 0, { today: T1, save: false });
  const d2 = KE_STORY.chooseAnswer(d, 1, 1, 0, { today: T1, save: false });
  assert.equal(d2.ok, false);
  assert.equal(d2.reason, "already_completed");
});

test("短編ロジック：日次枠の共有（クエスト完了日の章開始不可／章開始日はクエスト本編更新不可）", () => {
  // クエスト完了 → 物語開始不可
  const dQ = baseDb();
  const sceneSato = globalThis.KE_SCENES.find((s) => s.npcId === "npc_sato");
  const goodIdx = sceneSato.rounds[0].answers.findIndex((a) => a.type === "good");
  const q = globalThis.KE_CONVERSATION.completeDailyQuest(dQ, sceneSato.id, goodIdx, T1);
  assert.equal(q.firstToday, true);
  const rB = KE_STORY.startChapter(dQ, { today: T1, band: "daytime", save: false });
  assert.equal(rB.ok, false);
  assert.equal(rB.reason, "quest_today");

  // 物語開始 → クエスト本編更新不可（firstToday=false・報酬なし）
  const dS = baseDb();
  const s = KE_STORY.startChapter(dS, { today: T1, band: "daytime", save: false });
  assert.equal(s.ok, true);
  const bondBefore = globalThis.KE_RELATIONSHIP.getNpcBond(dS, "npc_sato");
  const q2 = globalThis.KE_CONVERSATION.completeDailyQuest(dS, sceneSato.id, goodIdx, T1);
  assert.equal(q2.ok, true);
  assert.equal(q2.firstToday, false);
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcBond(dS, "npc_sato"), bondBefore, "クエストのきずな度は更新されない");
  assert.equal(dS.currentPet.lastQuestDate, null, "ペットきずな度ボーナスも付与されない");
  assert.equal((dS.conversation && dS.conversation.dailyQuestDate) || null, null);
});

test("短編ロジック：日付をまたいだ再開・完了（開始T2・完了T3）でも報酬は一度だけ", () => {
  const d = baseDb();
  KE_STORY.startChapter(d, { today: T2, band: "daytime", save: false });
  KE_STORY.chooseAnswer(d, 1, 0, 0, { today: T2, save: false });
  const bondBefore = globalThis.KE_RELATIONSHIP.getNpcBond(d, "npc_sato");
  const r2 = KE_STORY.chooseAnswer(d, 1, 1, 0, { today: T3, save: false });
  assert.equal(r2.final, true);
  assert.equal(KE_STORY.getProgress(d).lastChapterCompletedAt, T3);
  assert.equal(KE_STORY.getProgress(d).slotUsedDate, T3);
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcBond(d, "npc_sato"), bondBefore + 16);
  // T3の日次枠は使われている（同じ日付に三度目を開始しない）
  const rAgain = KE_STORY.startChapter(d, { today: T3, band: "daytime", save: false });
  assert.equal(rAgain.ok, false);
  assert.equal(rAgain.reason, "story_today");
});

test("短編ロジック：NPC記憶と交流ノートへ話題・約束・結果を反映", () => {
  const MEM = globalThis.KE_NPC_MEMORY;
  const d = baseDb();
  playChapter(d, 1, 0, 0, T1);
  let m = MEM.getMemory(d, "npc_sato");
  assert.ok(m && m.topics.some((t) => t.topic.indexOf("小さな約束") >= 0), "話題が記録される");
  assert.equal(m.promises.length, 0);
  playChapter(d, 2, 0, 0, T2);
  m = MEM.getMemory(d, "npc_sato");
  const pending = m.promises.filter((p) => p.status === "pending" && p.sceneId === "story_small_promise");
  assert.equal(pending.length, 1);
  assert.ok(pending[0].text.indexOf("参加") >= 0, "約束の内容（参加）");

  // 交流ノート向け進捗
  const nb = KE_STORY.getNotebookProgress(d, "npc_sato");
  assert.ok(nb && nb.started && nb.completed === 2);
  assert.ok(nb.hint.indexOf("次の手がかり") >= 0);
  assert.equal(KE_STORY.getNotebookProgress(d, "npc_yamada"), null, "他NPCには表示しない");

  // 結末で約束は解決（kept）
  playChapter(d, 3, 0, 0, T3);
  playChapter(d, 4, 0, 0, T5);
  m = MEM.getMemory(d, "npc_sato");
  const storyPromises = m.promises.filter((p) => p.sceneId === "story_small_promise");
  assert.equal(storyPromises.every((p) => p.status === "kept"), true, "結末で約束を果たした");
});

test("短編ロジック：生成交代では物語をリセットせず、各章の同行ペットを残す", () => {
  const d = baseDb();
  playChapter(d, 1, 0, 0, T1);
  // 世代交代（物語は維持される）。旅立ち→新卵→孵化を経て続行
  const PET = globalThis.KE_PET;
  assert.equal(PET.completeDeparture(d).ok, true, "第1世代を旅立ち");
  PET.startNextGeneration(d, "つぎ", "choose");
  const hatch = PET.applyHatch(d, "fox");
  assert.equal(hatch.ok, true, "次世代を孵化");
  assert.equal(d.currentPet.generationId, "gen_002");
  assert.ok(KE_STORY.getProgress(d), "storyProgress が生きている");
  assert.equal(KE_STORY.getStatus(d, T2, "daytime").npcMet, true, "孵化後は面識NPCで続行可");
  playChapter(d, 2, 0, 0, T2);
  const p = KE_STORY.getProgress(d);
  assert.equal(p.companionHistory.length, 2);
  assert.equal(p.companionHistory[0].petName, "モモ");
  assert.equal(p.companionHistory[0].generationId, "gen_001");
  assert.equal(p.companionHistory[1].petName, "つぎ");
  assert.equal(p.companionHistory[1].generationId, "gen_002");
  assert.deepEqual(p.completedChapters, [1, 2], "章の進行は維持");
});

test("短編ロジック：旧セーブ互換（storyProgress なしでも読込→進行→保存OK）", () => {
  const map = new Map();
  const storage = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); }
  };
  globalThis.localStorage = storage;
  try {
    // 旧スキーマ（storyProgress キーなし）を保存
    const old = KE_DB.defaultData();
    old.schemaVersion = C.SCHEMA_VERSION;
    old.profile = { displayName: "旧", profileId: "p_old" };
    old.currentPet = {
      generationId: "gen_001", name: "モモ", speciesId: "rabbit", speciesRevealed: true,
      stage: "child", recentDialogueIds: [], lastQuestDate: null, cumulativeExp: 0,
      questDays: 0, recordedDays: 0, petBond: 20
    };
    old.relationships.npcs.npc_sato = { bond: 40, conversations: 1, lastTalkedAt: "2026-08-01", unlockedEvents: 0 };
    delete old.storyProgress;
    storage.setItem(C.LOCAL_STORAGE_KEY, JSON.stringify(old));
    const r = KE_DB.load();
    assert.equal(r, "loaded", "storyProgress なしでも隔離されない");
    assert.equal(KE_DB.get().storyProgress, null, "旧セーブは null のまま維持");
    // 進行開始 → 初回保存で storyProgress が書き込まれる
    const d = KE_DB.get();
    const s = KE_STORY.startChapter(d, { today: T1, band: "daytime", save: false });
    assert.equal(s.ok, true);
    KE_DB.save();
    KE_DB.load();
    assert.ok(KE_DB.get().storyProgress && KE_DB.get().storyProgress.started === true, "再読込後も進行が維持");
  } finally {
    delete globalThis.localStorage;
  }
});

test("短編デモ：独立した一時データで4章を連続体験し、本編の保存・報酬に触れない", () => {
  const d = baseDb();
  const bondBefore = globalThis.KE_RELATIONSHIP.getNpcBond(d, "npc_sato");
  const st = KE_STORY.demoBegin();
  assert.equal(st.started, true);
  assert.equal(KE_STORY.demoStatus().chapter, 1);

  const pick = (turn, idx) => KE_STORY.demoChoose(turn, idx);
  for (let ch = 1; ch <= 4; ch++) {
    const cur = KE_STORY.demoStatus().chapter;
    assert.equal(cur, ch, "デモが順に章 " + ch);
    assert.equal(pick(0, 0).ok, true);   // ターン1
    const r2 = pick(1, 0).ok;            // ターン2（完了）
    assert.equal(r2, true);
    if (ch < 4) assert.equal(KE_STORY.demoNextChapter().ok, true);
  }
  const done = KE_STORY.demoStatus();
  assert.equal(done.done, true);
  assert.ok(done.ending, "デモでも結末が分かる");
  assert.ok(KE_STORY.demoReadback(1).t1, "デモ読み返し");
  // 本編へは一切影響しない
  assert.equal(d.storyProgress, null, "本編の storyProgress は作成されない");
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcBond(d, "npc_sato"), bondBefore, "本編のきずな度は変わらない");
  assert.equal(globalThis.KE_NPC_MEMORY.getMemory(d, "npc_sato"), null, "本編のNPC記憶は変わらない");
  KE_STORY.demoReset();
  assert.equal(KE_STORY.demoStatus().started, false);
});

test("日次スロット共有：会話クエストの既存テストに影響しない（KE_STORY なしでも動く）", () => {
  // KE_STORY が undefined 相当でも completeDailyQuest が従来通り firstToday を返す
  const d = baseDb();
  d.currentPet.lastQuestDate = null;
  const sceneSato = globalThis.KE_SCENES.find((s) => s.npcId === "npc_sato");
  const goodIdx = sceneSato.rounds[0].answers.findIndex((a) => a.type === "good");
  const q = globalThis.KE_CONVERSATION.completeDailyQuest(d, sceneSato.id, goodIdx, T1);
  assert.equal(q.firstToday, true);
  assert.equal(globalThis.KE_RELATIONSHIP.getNpcBond(d, "npc_sato"), 40 + 8);
});
