"use strict";
/*
 * kenecho Village - 短編物語「小さな約束」ロジック（KE_STORY）
 * データ（KE_STORY_SMALL_PROMISE）を元に、4章構成の物語を profileId に紐づく
 * db.storyProgress へ保存して進行する。
 *
 * - 開始条件：孵化済み（speciesRevealed）かつ物語NPCと面識がある。「未面識なら通常の出会いへ案内」
 * - 1日1章。開始または完了で「日次スロット」を使用し、会話クエストの新規更新と相互に排他
 *   （completeDailyQuest 側は isDailyUsedByStory を参照して本編更新を止める）
 * - 各章 = 導入 + 3択2ターン + 結果・助言。章2・3で「参加（participate）／手伝い（help）」の約束を管理し
 *   章3で変更可。結末A（参加）・結末B（手伝い）は約束で決まり、きずな度で優劣を決めない
 * - きずな度は既存計算・0〜100補正に従い「章完了時に一度だけ」合計delta分を反映。健康EXPは付与しない
 * - 完了章の読み返しは本編状態・報酬を一切変更しない
 * - デモモードは独立した一時データ（メモリのみ）で4章を連続体験でき、本編保存・報酬に影響しない
 * - ペットの世代交代で物語はリセットしない（companionHistory に各章の同行ペット名・世代を残す）
 * - 手紙機能は実装しない
 */
(function () {
  const U = globalThis.KE_UTIL;
  const STORY_ACTIVE_BANDS = ["morning", "daytime", "evening"];

  function data() {
    return globalThis.KE_STORY_SMALL_PROMISE || null;
  }

  function chapterData(num) {
    const list = (data() && data().chapters) || [];
    return list.find(function (c) { return c.chapter === num; }) || null;
  }

  function npcIdOf() {
    return (data() && data().npcId) || "npc_sato";
  }

  function storySceneId() {
    return (data() && data().id) || "story_small_promise";
  }

  /** 現在の時間帯キー（outings があれば利用） */
  function currentBand() {
    if (globalThis.KE_OUTING && globalThis.KE_OUTING.timeBandFromDate) {
      return globalThis.KE_OUTING.timeBandFromDate(new Date());
    }
    return "daytime";
  }

  function defaultProgress(db) {
    const d = data();
    return {
      version: 1,
      storyId: (d && d.id) || "story_small_promise",
      npcId: npcIdOf(),
      profileId: (db && db.profile && db.profile.profileId) || null,
      started: false,
      chapter: 0,
      turn: 0,          // 0=導入/ターン1 / 1=ターン1後 / 2=ターン2後（結果へ）
      resolved: false,  // 現在の章が完了・結果表示済みか
      choices: {},      // "<chapter>": { intro, t1, t2 }
      promise: { route: null, note: null, since: null },
      chapterMeta: null, // { chapter, date, timeBand, weather, sceneId, startedAt }
      completedChapters: [],
      lastChapterCompletedAt: null,
      slotUsedDate: null, // 日次スロット消費日（開始または完了）
      ending: null,
      endingCard: null,
      companionHistory: []
    };
  }

  /** 保存領域（db.storyProgress）を整える。null 時代は初期値を作る（migrate 後安全） */
  function getProgress(db) {
    if (!db.storyProgress || typeof db.storyProgress !== "object") db.storyProgress = defaultProgress(db);
    const p = db.storyProgress;
    if (p.version == null) p.version = 1;
    if (!p.choices || typeof p.choices !== "object") p.choices = {};
    if (!p.promise || typeof p.promise !== "object") p.promise = { route: null, note: null, since: null };
    if (!p.completedChapters || !Array.isArray(p.completedChapters)) p.completedChapters = [];
    if (!p.companionHistory || !Array.isArray(p.companionHistory)) p.companionHistory = [];
    if (typeof p.started !== "boolean") p.started = !!p.started;
    if (typeof p.resolved !== "boolean") p.resolved = !!p.resolved;
    if (typeof p.turn !== "number") p.turn = 0;
    if (typeof p.chapter !== "number") p.chapter = 0;
    return p;
  }

  /** 会話クエスト側から参照される「物語が今日の日次スロットを使用したか」 */
  function isDailyUsedByStory(db, today) {
    if (!db || !db.storyProgress || !db.storyProgress.slotUsedDate) return false;
    return db.storyProgress.slotUsedDate === (today || U.todayStr());
  }

  /** 会話クエストが今日完了済みか（同日は物語の新規進行を不可にする） */
  function questUsedToday(db, today) {
    const t = today || U.todayStr();
    const cv = db && db.conversation;
    return !!(cv && cv.dailyQuestDate === t && cv.dailyQuestCompleted);
  }

  function bandOk(band) {
    return STORY_ACTIVE_BANDS.indexOf(band) >= 0;
  }

  function npcOk(db) {
    const pet = db && db.currentPet;
    if (!pet || !pet.speciesRevealed) return false;
    const REL = globalThis.KE_RELATIONSHIP;
    return !!(REL && REL.isNpcDiscovered(db, npcIdOf()));
  }

  /** 章1のターン1選択（facet）から、引き継ぐ話題の定義を返す */
  function topicOf(p) {
    const d = data();
    if (!d) return null;
    const c1 = p && p.choices && p.choices["1"];
    let facet = null;
    if (c1 && c1.t1 != null) {
      const ch1 = chapterData(1);
      const r0 = ch1 && ch1.rounds[0];
      const a = r0 && r0.answers[c1.t1];
      if (a) facet = a.facet;
    }
    return d.topics[facet] || d.topics.empathy || null;
  }

  /** 対象章のターンを、現在の約束ルート（章3・4）と前ターン選択（章2・3）から解決する */
  function getRound(p, chapterNo, turnIndex) {
    const ch = chapterData(chapterNo);
    if (!ch) return null;
    let group = ch;
    if (ch.routeRounds) {
      const route = (p && p.promise && p.promise.route) || "participate";
      group = ch.routeRounds[route] || ch;
    }
    if (turnIndex === 1 && group.round2ByTurn1) {
      const c = p && p.choices && p.choices[String(chapterNo)];
      const key = String(c && c.t1 != null ? c.t1 : 0);
      if (group.round2ByTurn1[key]) return group.round2ByTurn1[key];
    }
    const list = (group && group.rounds) || [];
    return list[turnIndex] || null;
  }

  /** 章の導入文（差分・話題引き継ぎ・ルート差分。約束と矛盾しない） */
  function introFor(p, chapterNo) {
    const ch = chapterData(chapterNo);
    if (!ch) return "";
    if (ch.introVariants && ch.introVariants.length) {
      const c = p && p.choices && p.choices[String(chapterNo)];
      const idx = c && c.intro != null ? c.intro : 0;
      return ch.introVariants[idx % ch.introVariants.length];
    }
    if (ch.introByTopic) {
      const t = topicOf(p);
      return (t && ch.introByTopic[t.key]) || ch.introByTopic.empathy;
    }
    if (ch.introByRoute) {
      const route = (p && p.promise && p.promise.route) || "participate";
      return ch.introByRoute[route] || ch.introByRoute.participate;
    }
    return "";
  }

  /** 章の結果テキスト（ルート差分対応）と助言（既存UIと同じポイント＋改善例形式） */
  function getChapterResult(chapterNo, route) {
    const ch = chapterData(chapterNo);
    if (!ch || !ch.result) return { text: "", advice: null };
    if (ch.result.byRoute) {
      return { text: (ch.result.byRoute[route] || ""), advice: adviceBy(ch, route) };
    }
    return { text: ch.result.text || "", advice: ch.result.advice || null };
  }

  function adviceBy(ch, route) {
    if (ch.result && ch.result.advice) {
      return route && ch.result.advice[route] ? ch.result.advice[route] : ch.result.advice;
    }
    return null;
  }

  /** 開始チェック（本編用） */
  function checkStart(db, today, band) {
    const p = getProgress(db);
    if (!data()) return { ok: false, reason: "story_missing", message: "物語データを読み込めませんでした。" };
    if (p.ending) return { ok: false, reason: "done", message: "物語は完結しています。" };
    if (!bandOk(band)) return { ok: false, reason: "night_band", message: "夜・深夜は、話の続きを聞ける時間帯ではありません。朝・昼・夕方にお越しください。" };
    if (!npcOk(db)) return { ok: false, reason: "not_met", message: "まずは通常の外出で佐藤さんと出会ってから、物語に入りましょう。" };
    if (isDailyUsedByStory(db, today)) return { ok: false, reason: "story_today", message: "今日はすでに物語を進めました。明日また聞いてみましょう。" };
    if (questUsedToday(db, today)) return { ok: false, reason: "quest_today", message: "今日はすでに会話クエストを完了しました。物語は明日から進められます。" };
    return { ok: true, reason: null, message: "" };
  }

  /** 物語の進行状態（入口パネル・物語画面の表示に使う） */
  function getStatus(db, today, band) {
    const p = getProgress(db);
    const d = data();
    const bandKey = band != null ? band : currentBand();
    const okB = bandOk(bandKey);
    const met = npcOk(db);
    const questToday = questUsedToday(db, today);
    const storyToday = isDailyUsedByStory(db, today);

    let state = "none";
    if (p.ending) state = "done";
    else if (p.started && !p.resolved) state = "in_progress";
    else if (p.started && p.resolved) state = "between";

    let can = false;
    let reason = null;
    if (!d) reason = "story_missing";
    else if (state === "done") reason = null;
    else if (state === "in_progress") {
      // 進行中の章は、時間帯さえ良ければ残りターンを再開できる（保存・復元でも維持）
      if (okB) { can = true; reason = null; } else reason = "night_band";
    } else {
      if (!okB) reason = "night_band";
      else if (!met) reason = "not_met";
      else if (storyToday) reason = "story_today";
      else if (questToday) reason = "quest_today";
      else can = true;
    }

    const next = p.completedChapters.length + 1;
    const nextCh = chapterData(next) || null;
    const curCh = chapterData(p.started && !p.ending ? (p.chapter || next) : next) || null;

    return {
      storyExists: !!d,
      npcId: npcIdOf(),
      npcName: ((globalThis.KE_NPCS || []).find(function (n) { return n.id === npcIdOf(); }) || {}).displayName || npcIdOf(),
      profileId: p.profileId,
      title: (d && d.title) || "",
      state: state,
      done: p.ending != null,
      ending: p.ending || null,
      chapter: (p.ending ? p.chapter : (p.started ? p.chapter : next)) || next,
      turn: p.turn,
      resolved: p.resolved,
      completedChapters: (p.completedChapters || []).slice(),
      currentChapterTitle: curCh ? curCh.title : null,
      nextChapterTitle: nextCh ? nextCh.title : null,
      promiseRoute: p.promise.route,
      band: bandKey,
      bandOk: okB,
      npcMet: met,
      questToday: questToday,
      storyToday: storyToday,
      canEngage: can,
      reason: reason
    };
  }

  /** 進行中の章の表示状態（導入・リロード時にも維持） */
  function getTurnState(db, chapterNo, today) {
    const p = getProgress(db);
    const ch = chapterData(chapterNo);
    const choice = p.choices[String(chapterNo)] || { t1: null, t2: null };
    return {
      chapter: chapterNo,
      title: ch ? ch.title : "",
      intro: introFor(p, chapterNo),
      turn: p.turn,
      resolved: p.resolved,
      round0: getRound(p, chapterNo, 0),
      round1: (p.turn >= 1 && getRound(p, chapterNo, 1)) || null,
      choice: { t1: choice.t1, t2: choice.t2 },
      route: p.promise.route,
      meta: p.chapterMeta || null
    };
  }

  function recordCompanion(p, chapterNo, pet, today) {
    if (!pet) return;
    p.companionHistory.push({
      chapter: chapterNo,
      petName: pet.name != null ? String(pet.name) : "",
      speciesId: pet.speciesId || null,
      generationId: pet.generationId || null,
      date: today
    });
  }

  /** 章の進行だけを進めるコア（報酬・保存は呼び出し側）。デモと本編で共用 */
  function startChapterCore(p, chapterNo, today, pet, meta) {
    const ch = chapterData(chapterNo);
    if (!ch) return { ok: false, reason: "chapter_not_found" };
    let introIdx = null;
    if (ch.introVariants && ch.introVariants.length) introIdx = U.randInt(0, ch.introVariants.length - 1);
    p.started = true;
    p.chapter = chapterNo;
    p.turn = 0;
    p.resolved = false;
    p.choices[String(chapterNo)] = { intro: introIdx, t1: null, t2: null };
    p.chapterMeta = meta || {
      chapter: chapterNo,
      date: today,
      timeBand: currentBand(),
      weather: "clear",
      sceneId: storySceneId() + "_ch" + chapterNo,
      startedAt: new Date().toISOString()
    };
    p.slotUsedDate = today;
    recordCompanion(p, chapterNo, pet, today);
    return { ok: true, chapter: chapterNo };
  }

  /** 本編：対象章を開始する（1日1章・日次スロット共有・開始時の時間帯・天気を維持） */
  function startChapter(db, opts) {
    const o = opts || {};
    const p = getProgress(db);
    const today = o.today || U.todayStr();
    const band = o.band != null ? o.band : currentBand();
    const check = checkStart(db, today, band);
    if (!check.ok) return { ok: false, reason: check.reason, message: check.message };
    const next = p.completedChapters.length + 1;
    const out = (db.conversation && db.conversation.outing) || {};
    const meta = o.meta || {
      chapter: next,
      date: today,
      timeBand: out.timeBand || band,
      weather: out.weather || "clear",
      sceneId: out.sceneId || (storySceneId() + "_ch" + next),
      startedAt: new Date().toISOString()
    };
    const r = startChapterCore(p, next, today, o.pet || db.currentPet, meta);
    if (!r.ok) return r;
    if (o.save !== false && globalThis.KE_DB) globalThis.KE_DB.save();
    return { ok: true, chapter: next, progress: p };
  }

  /** 回答を進めるコア（p のみ変更。報酬・保存は呼び出し側） */
  function answerChapterCore(p, chapterNo, turnIndex, answerIndex, today) {
    if ((p.completedChapters || []).indexOf(chapterNo) >= 0) {
      return { ok: false, reason: "already_completed", message: "この章はすでに完了しています。" };
    }
    if (p.chapter !== chapterNo) {
      return { ok: false, reason: "wrong_chapter", message: "章が一致しません。" };
    }
    const choice = p.choices[String(chapterNo)] || p.choices[chapterNo];
    if (!choice) return { ok: false, reason: "not_started", message: "この章は開始されていません。" };
    if (turnIndex === 0 && choice.t1 != null) return { ok: false, reason: "duplicate_turn", message: "このターンは回答済みです。" };
    if (turnIndex === 1 && choice.t2 != null) return { ok: false, reason: "duplicate_turn", message: "このターンは回答済みです。" };

    const round = getRound(p, chapterNo, turnIndex);
    const answer = round && round.answers[answerIndex];
    if (!answer) return { ok: false, reason: "bad_answer", message: "回答が見つかりません。" };

    const rules = globalThis.KE_RELATIONSHIP_RULES;
    const delta = ((rules && rules.answerTypes && rules.answerTypes[answer.type]) || {}).delta || 0;

    if (turnIndex === 0) {
      choice.t1 = answerIndex;
      p.turn = 1;
      return {
        ok: true, chapter: chapterNo, turn: 1, resolved: false,
        answer: answer, round: round, answered: answerIndex,
        role: "open", delta: delta, final: false, ending: null,
        promiseRoute: p.promise.route
      };
    }

    // ---- ターン2：章完了 ----
    choice.t2 = answerIndex;
    if (answer.promiseRoute != null && (chapterNo === 2 || chapterNo === 3)) {
      p.promise.route = answer.promiseRoute;
      p.promise.since = chapterNo;
    }
    if (p.completedChapters.indexOf(chapterNo) < 0) p.completedChapters.push(chapterNo);
    p.lastChapterCompletedAt = today;
    p.slotUsedDate = today;
    p.chapter = (chapterNo === (data() && data().chapterCount)) ? chapterNo : chapterNo + 1;
    p.turn = 0;
    p.resolved = true;

    // 結末：最終ルートで確定（きずな度で優劣は決めない）
    const d = data();
    if (chapterNo === (d && d.chapterCount) && d && d.endings) {
      const key = p.promise.route === "help" ? "B" : "A";
      const e = d.endings[key];
      if (e) {
        p.ending = { key: e.key, id: e.id, title: e.title, at: today, route: p.promise.route || "participate" };
        p.endingCard = {
          type: "story",
          storyId: d.id,
          storyTitle: d.title,
          npcId: d.npcId,
          endingKey: e.key,
          endingTitle: e.title,
          catchline: e.catchline,
          summary: e.summary,
          finishedAt: today
        };
      }
    }

    return {
      ok: true, chapter: chapterNo, turn: 2, resolved: true,
      answer: answer, round: round, answered: answerIndex,
      role: "develop", delta: delta, final: true,
      ending: p.ending || null, promiseRoute: p.promise.route
    };
  }

  /** 章完了時の報酬適用（きずな度・会話記録・約束解決。本編のみ・健康EXPは付けない） */
  function applyChapterRewards(db, result, today) {
    const npcId = npcIdOf();
    const REL = globalThis.KE_RELATIONSHIP;
    if (!REL) return;
    const npcState = REL.ensureNpc(db, npcId);
    const before = npcState.bond;
    const applied = REL.applyNpcBondChange(db, npcId, result.deltaSum);
    npcState.conversations = (npcState.conversations || 0) + 1;
    npcState.lastTalkedAt = today;
    REL.recordHistory(db, {
      key: "npc:" + npcId,
      delta: result.deltaSum,
      from: before,
      to: applied.after,
      why: "story",
      chapter: result.chapter,
      sceneId: storySceneId()
    });
    if (result.ending && globalThis.KE_NPC_MEMORY && globalThis.KE_NPC_MEMORY.resolvePromises) {
      globalThis.KE_NPC_MEMORY.resolvePromises(db, npcId);
    }
  }

  function promiseNote(answer) {
    if (!answer || !answer.promiseRoute) return null;
    return answer.promiseRoute === "help"
      ? "「小さな約束」散歩会の案内文を手伝う"
      : "「小さな約束」散歩会に参加する";
  }

  /** NPC記憶へ話題・約束・結果を反映（本編のみ・デモ/練習には書かない） */
  function recordChapterMemory(db, chapterNo, today, t1Answer, t2Answer) {
    const MEM = globalThis.KE_NPC_MEMORY;
    if (!MEM || !MEM.ensureMemory || !MEM.pushRecent) return null;
    const npcId = npcIdOf();
    const m = MEM.ensureMemory(db, npcId);
    const d = data();
    const ch = chapterData(chapterNo);
    const label = ch ? ch.title : ("第" + chapterNo + "章");
    const topicLabel = "小さな約束・" + label;
    m.topics = MEM.pushRecent(m.topics, { topic: topicLabel, at: today, sceneId: storySceneId() }, 8);
    m.lastSceneId = storySceneId();
    m.lastTopic = topicLabel;
    m.lastChoiceFacet = (t2Answer && t2Answer.facet) || (t1Answer && t1Answer.facet) || null;
    const text = promiseNote(t2Answer);
    if (text) {
      const plist = Array.isArray(m.promises) ? m.promises.slice() : [];
      const idx = plist.findIndex(function (x) { return x.sceneId === storySceneId(); });
      const entry = { text: text, status: "pending", since: today, sceneId: storySceneId() };
      if (idx >= 0) plist[idx] = entry; else plist.push(entry);
      m.promises = plist.slice(-5);
    }
    m.greetingCount = (m.greetingCount || 0) + 1;
    m.updatedAt = today;
    return m;
  }

  /** 本編：選択を処理する。2ターン目を選ぶと章完了 → 報酬適用 → 保存 */
  function chooseAnswer(db, chapterNo, turnIndex, answerIndex, opts) {
    const o = opts || {};
    const p = getProgress(db);
    const today = o.today || U.todayStr();
    const r = answerChapterCore(p, chapterNo, turnIndex, answerIndex, today);
    if (!r.ok) { if (o.save !== false && globalThis.KE_DB) globalThis.KE_DB.save(); return r; }
    if (r.final) {
      const r0 = getRound(p, chapterNo, 0);
      const t1 = r0 && r0.answers[(p.choices[String(chapterNo)] || {}).t1];
      r.t1Answer = t1;
      r.t2Answer = r.answer;
      const d1 = ((globalThis.KE_RELATIONSHIP_RULES && globalThis.KE_RELATIONSHIP_RULES.answerTypes && globalThis.KE_RELATIONSHIP_RULES.answerTypes[t1 && t1.type]) || {}).delta || 0;
      r.deltaSum = d1 + r.delta;
      if (!o.demo) {
        applyChapterRewards(db, r, today);
        recordChapterMemory(db, chapterNo, today, t1, r.answer);
      }
      // デモ（o.demo）では本編のきずな度・記憶・保存に一切触れない
    }
    if (o.save !== false && globalThis.KE_DB) globalThis.KE_DB.save();
    return r;
  }

  /** 完了章の読み返し（データのみ。本編状態と報酬を変更しない） */
  function getReadback(db, chapterNo) {
    const p = getProgress(db);
    if ((p.completedChapters || []).indexOf(chapterNo) < 0 && !(p.chapter === chapterNo && p.resolved)) {
      return { ok: false, reason: "not_completed", message: "この章はまだ読み返せません。" };
    }
    const ch = chapterData(chapterNo);
    if (!ch) return { ok: false, reason: "not_found" };
    const choice = p.choices[String(chapterNo)] || {};
    const r0 = getRound(p, chapterNo, 0);
    const r1 = getRound(p, chapterNo, 1);
    const a0 = r0 && r0.answers[choice.t1];
    const a1 = r1 && r1.answers[choice.t2];
    const route = (a1 && a1.promiseRoute) || p.promise.route;
    const res = getChapterResult(chapterNo, route);
    const d = data();
    let ending = null;
    if (chapterNo === (d && d.chapterCount) && d && d.endings) {
      const key = (a1 && a1.promiseRoute) || route || "participate";
      const e = d.endings[key === "help" ? "B" : "A"];
      if (e) ending = { key: e.key, title: e.title };
    }
    return {
      ok: true,
      chapter: chapterNo,
      title: ch.title,
      intro: introFor(p, chapterNo),
      route: route,
      round0: r0,
      round1: r1,
      t1: a0,
      t2: a1,
      t1Index: choice.t1,
      t2Index: choice.t2,
      result: res,
      ending: ending
    };
  }

  /** 記念カード（物語の思い出）。未完了なら null */
  function getEndingCard(db) {
    const p = getProgress(db);
    return p.endingCard || null;
  }

  /** 交流ノート向けの進捗（指定NPCが物語NPCのときのみ） */
  function getNotebookProgress(db, npcId) {
    if (npcId !== npcIdOf()) return null;
    const p = getProgress(db);
    const d = data();
    const base = {
      title: (d && d.title) || "",
      npcId: npcIdOf(),
      started: p.started,
      done: p.ending != null,
      completed: (p.completedChapters || []).length
    };
    if (!p.started) {
      return Object.assign(base, {
        chapter: 0,
        turn: 0,
        nextChapterTitle: (chapterData(1) || {}).title || null,
        hint: "佐藤さんに「散歩会」の話を聞いてみるところから始まりそう。",
        promise: null,
        ending: null
      });
    }
    if (p.ending) {
      return Object.assign(base, {
        chapter: (d && d.chapterCount) || 0,
        turn: 0,
        nextChapterTitle: null,
        hint: "物語は完結しました。思い出画面の「物語の思い出」から記念カードを確認できます。",
        promise: p.promise,
        ending: p.ending
      });
    }
    const next = chapterData(p.completedChapters.length + 1) || null;
    let hint = "第" + p.completedChapters.length + "章まで読了。次の手がかりは「" + (next ? next.title : "…") + "」。";
    if (p.promise && p.promise.route) {
      hint += "　現在の約束：" + (p.promise.route === "help" ? "散歩会の案内文を手伝う" : "散歩会に参加する");
    }
    return Object.assign(base, {
      chapter: p.chapter,
      turn: p.turn,
      nextChapterTitle: next ? next.title : null,
      hint: hint,
      promise: p.promise,
      ending: null
    });
  }

  /** 章ごとに同行したペット（名前・世代）。無ければ null */
  function getCompanionAt(db, chapterNo) {
    const p = getProgress(db);
    return (p.companionHistory || []).find(function (c) { return c.chapter === chapterNo; }) || null;
  }

  /* =================================================================== */
  /* デモモード：独立した一時データ（メモリのみ・保存/報酬なし・4章連続）  */
  /* =================================================================== */
  let demo = null;

  function demoPet() {
    return { name: "そよ", generationId: "demo_gen_001", speciesId: "rabbit" };
  }

  function demoBegin() {
    demo = { p: defaultProgress(null) };
    const p = demo.p;
    const today = "demo-day-1";
    const meta = { chapter: 1, date: today, timeBand: "daytime", weather: "clear", sceneId: storySceneId() + "_demo_1", startedAt: new Date().toISOString() };
    startChapterCore(p, 1, today, demoPet(), meta);
    return demoStatus();
  }

  function demoStatus() {
    if (!demo) return { started: false };
    const p = demo.p;
    const next = p.completedChapters.length + 1;
    return {
      started: true,
      chapter: p.chapter || next,
      turn: p.turn,
      resolved: p.resolved,
      completedChapters: (p.completedChapters || []).slice(),
      done: p.ending != null,
      ending: p.ending || null,
      route: p.promise.route,
      currentChapterTitle: (chapterData(p.chapter) || {}).title || null,
      nextChapterTitle: (chapterData(next) || {}).title || null
    };
  }

  function demoChoose(turnIndex, answerIndex) {
    if (!demo) return { ok: false, reason: "not_started" };
    const p = demo.p;
    const today = "demo-day-" + (p.chapter || 1);
    return answerChapterCore(p, p.chapter, turnIndex, answerIndex, today);
  }

  function demoTurnState() {
    if (!demo) return null;
    // getTurnState の第1引数は db（getProgress が db.storyProgress を見る）ため包む
    return getTurnState({ storyProgress: demo.p }, demo.p.chapter);
  }

  function demoNextChapter() {
    if (!demo) return { ok: false, reason: "not_started" };
    const p = demo.p;
    if (p.ending) return { ok: false, reason: "done", ending: p.ending };
    const next = p.completedChapters.length + 1;
    if (next <= 1) return { ok: false, reason: "finish_first" };
    if (!chapterData(next)) return { ok: false, reason: "no_more" };
    const today = "demo-day-" + next;
    const meta = { chapter: next, date: today, timeBand: "daytime", weather: "clear", sceneId: storySceneId() + "_demo_" + next, startedAt: new Date().toISOString() };
    startChapterCore(p, next, today, demoPet(), meta);
    return { ok: true, chapter: next };
  }

  function demoReadback(chapterNo) {
    if (!demo) return null;
    const p = demo.p;
    const choice = p.choices[String(chapterNo)] || {};
    const r0 = getRound(p, chapterNo, 0);
    const r1 = getRound(p, chapterNo, 1);
    const a0 = r0 && r0.answers[choice.t1];
    const a1 = r1 && r1.answers[choice.t2];
    const route = (a1 && a1.promiseRoute) || p.promise.route;
    const ch = chapterData(chapterNo);
    return {
      chapter: chapterNo,
      title: ch ? ch.title : "",
      intro: introFor(p, chapterNo),
      round0: r0,
      round1: r1,
      t1: a0,
      t2: a1,
      t1Index: choice.t1,
      t2Index: choice.t2,
      result: ch ? getChapterResult(chapterNo, route) : null,
      ending: p.ending || null
    };
  }

  function demoReset() {
    demo = null;
  }

  const KE_STORY = {
    getProgress: getProgress,
    getStatus: getStatus,
    getTurnState: getTurnState,
    startChapter: startChapter,
    chooseAnswer: chooseAnswer,
    getReadback: getReadback,
    getEndingCard: getEndingCard,
    getNotebookProgress: getNotebookProgress,
    getCompanionAt: getCompanionAt,
    getChapterResult: getChapterResult,
    getChapterAdvice: function (chapterNo, route) {
      return adviceBy(chapterData(chapterNo), route);
    },
    isDailyUsedByStory: isDailyUsedByStory,
    questUsedToday: questUsedToday,
    bandOk: bandOk,
    npcOk: npcOk,
    introFor: introFor,
    getRound: getRound,
    chapterData: chapterData,
    topicOf: topicOf,
    npcIdOf: npcIdOf,
    demoBegin: demoBegin,
    demoStatus: demoStatus,
    demoChoose: demoChoose,
    demoTurnState: demoTurnState,
    demoNextChapter: demoNextChapter,
    demoReadback: demoReadback,
    demoReset: demoReset
  };

  if (globalThis) globalThis.KE_STORY = KE_STORY;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_STORY };
})();
