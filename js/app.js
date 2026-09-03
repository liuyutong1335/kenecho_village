"use strict";
/*
 * kenecho Village - 起動とナビゲーション（KE_APP）
 * ロジック層の最後に読み込む。DB初期化 → 画面表示 → トップバー遷移を担う。
 * M1 では骨格のみ（ナビ先はホームまたはプレースホルダ）。
 */
(function () {
  const U = globalThis.KE_UTIL;
  const C = globalThis.KE_CONFIG;
  const DB = globalThis.KE_DB;
  const UI = globalThis.KE_UI;

  const BUILT_SCREENS = {
    home: true
    // record / pet / quest / notebook / memories / encyclopedia / settings は今後追加
  };

  function navigate(target) {
    const data = DB.get();
    if (target === "home" || BUILT_SCREENS[target]) {
      UI.renderHome(data);
      return;
    }
    const labels = {
      record: "記録",
      pet: "ペット",
      quest: "会話クエスト",
      notebook: "交流ノート",
      memories: "思い出",
      encyclopedia: "図鑑",
      settings: "設定"
    };
    UI.renderPlaceholder(labels[target] || target, "「" + (labels[target] || target) + "」は今後のマイルストーンで実装されます。");
  }

  function start() {
    const result = DB.load();
    if (result === "quarantined") {
      UI.showErrorNotice("保存データに異常があったため、安全な初期値で起動しました。");
      return;
    }
    UI.install(navigate);
    const data = DB.get();
    // M2 で初期設定フローへ差し替え
    UI.renderHome(data);
    if (result === "new") {
      UI.showNotice("ようこそ！ 初期設定は次のマイルストーンで追加されます。");
    }
  }

  const KE_APP = {
    start: start,
    navigate: navigate
  };

  if (globalThis) globalThis.KE_APP = KE_APP;

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", start);
  }

  if (typeof module !== "undefined" && module.exports) module.exports = { KE_APP: KE_APP };
})();
