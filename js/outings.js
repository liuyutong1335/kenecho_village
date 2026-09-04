"use strict";
/*
 * kenecho Village - 外出の時間帯・天気・場面選択（KE_OUTING）
 * 端末のローカル時刻を時間帯（朝/昼/夕方/夜/深夜）へ分類し、場面・NPC・天気を抽選する。
 * - 天気は実天気ではなくローカル抽選のゲーム内設定（保存して会話の条件を固定）
 * - 場面の時間帯は KE_CONFIG.OUTING.SCENE_BANDS（未指定は全時間帯で可）
 * - 候補が無い場合は時間帯の安全な場面（SAFE_SCENES）を用意
 * - 会話開始時の条件（外出状態）は conversation.outing に保存し、途中で時刻が変わっても
 *   場面を切り替えない（保存・復元で維持）。
 * 時刻・乱数は引数（now / rng）で固定でき、テストで検証できる。
 */
(function () {
  const C = globalThis.KE_CONFIG;
  const U = globalThis.KE_UTIL;

  function outcfg() {
    return C.OUTING || {};
  }

  /** 0時からの分 → 時間帯キー（morning/daytime/evening/night/late_night） */
  function getTimeBand(minutes) {
    const m = ((Number(minutes) || 0) % 1440 + 1440) % 1440;
    const O = outcfg();
    if (m < (O.TIME_MINUTES_WRAP != null ? O.TIME_MINUTES_WRAP : 300)) return "late_night";
    const bands = O.TIME_BANDS || [];
    for (let i = 0; i < bands.length; i++) {
      if (m >= bands[i].from && m <= bands[i].to) return bands[i].key;
    }
    return "late_night";
  }

  /** Date（または null=現在）→ 時間帯キー */
  function timeBandFromDate(d) {
    const dt = d || new Date();
    return getTimeBand(dt.getHours() * 60 + dt.getMinutes());
  }

  function timeBandLabel(key) {
    const b = (outcfg().TIME_BANDS || []).find(function (x) { return x.key === key; });
    return b ? b.label : key;
  }

  /** 時間帯に応じた天気を重み付きで抽選（rng で固定可能） */
  function pickWeather(band, rng) {
    const O = outcfg();
    const w = (O.WEATHER_WEIGHTS || {})[band] || (O.WEATHER_WEIGHTS || {}).daytime || { clear: 50 };
    const cands = Object.keys(w).map(function (k) { return { key: k, weight: w[k] }; });
    const picked = U.pickWeighted(cands, rng);
    return picked ? picked.key : "clear";
  }

  function weatherLabel(key) {
    return (outcfg().WEATHER && outcfg().WEATHER[key]) || key;
  }

  /** 場面が時間帯に出現できるか（未指定は全時間帯で可） */
  function bandAllowed(sceneId, band) {
    const bands = outcfg().SCENE_BANDS && outcfg().SCENE_BANDS[sceneId];
    if (!bands) return true;
    return bands.indexOf(band) >= 0;
  }

  /** 出会っているNPCの場面（利用可能なシーン） */
  function availableScenes(db) {
    const rels = (db && db.relationships && db.relationships.npcs) || {};
    return (globalThis.KE_SCENES || []).filter(function (s) { return rels[s.npcId]; });
  }

  /**
   * 時間帯・天気・NPCに合う場面を選んで返す。
   * 戻り値: { scene, band, weather }（候補なしは scene: null）
   */
  function pickSceneForOuting(db, now, rng) {
    const band = timeBandFromDate(now);
    const avail = availableScenes(db);
    const cands = avail.filter(function (s) { return bandAllowed(s.id, band); });
    // 直近の外出で出会ったNPCの場面を優先（同帯域にあれば）
    const featured = db.conversation && db.conversation.lastOutingNpcId;
    let pool = cands;
    if (featured) {
      const sub = cands.filter(function (s) { return s.npcId === featured; });
      if (sub.length > 0) pool = sub;
    }
    // 候補なし → 時間帯の安全な場面（出会っているNPCに限定）
    if (pool.length === 0) {
      const safe = (outcfg().SAFE_SCENES || {})[band] || [];
      const safeScenes = avail.filter(function (s) { return safe.indexOf(s.id) >= 0; });
      if (safeScenes.length > 0) pool = safeScenes;
    }
    // 最終フォールバック：利用可能な場面へ
    if (pool.length === 0) pool = avail;
    if (pool.length === 0) return { scene: null, band: band, weather: pickWeather(band, rng) };
    const chosen = U.pickWeighted(pool.map(function (s) { return { scene: s, weight: 10 }; }), rng);
    return { scene: chosen.scene, band: band, weather: pickWeather(band, rng) };
  }

  /** 外出開始：場面・時間帯・天気を決定して conversation.outing に保存（条件固定） */
  function startOutingState(db, now, rng) {
    const r = pickSceneForOuting(db, now, rng);
    if (!r.scene) return null;
    if (!db.conversation) db.conversation = {};
    db.conversation.outing = {
      date: U.todayStr(now),
      timeBand: r.band,
      weather: r.weather,
      sceneId: r.scene.id,
      npcId: r.scene.npcId,
      startedAt: now && now.toISOString ? now.toISOString() : new Date().toISOString()
    };
    return db.conversation.outing;
  }

  /** 今日の外出で固定された場面（無ければ null）。途中で時刻が変わっても切替しない */
  function getTodayScene(db, today) {
    const o = db.conversation && db.conversation.outing;
    if (!o || o.date !== (today || U.todayStr())) return null;
    return (globalThis.KE_SCENES || []).find(function (s) { return s.id === o.sceneId; }) || null;
  }

  /** 今日の外出の時間帯・天気メタ（表示用） */
  function getOutingMeta(db, today) {
    const o = db.conversation && db.conversation.outing;
    if (!o || o.date !== (today || U.todayStr())) return null;
    return {
      timeBand: o.timeBand,
      weather: o.weather,
      timeBandLabel: timeBandLabel(o.timeBand),
      weatherLabel: weatherLabel(o.weather)
    };
  }

  const KE_OUTING = {
    getTimeBand: getTimeBand,
    timeBandFromDate: timeBandFromDate,
    timeBandLabel: timeBandLabel,
    pickWeather: pickWeather,
    weatherLabel: weatherLabel,
    bandAllowed: bandAllowed,
    availableScenes: availableScenes,
    pickSceneForOuting: pickSceneForOuting,
    startOutingState: startOutingState,
    getTodayScene: getTodayScene,
    getOutingMeta: getOutingMeta
  };

  if (globalThis) globalThis.KE_OUTING = KE_OUTING;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_OUTING };
})();
