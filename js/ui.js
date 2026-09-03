"use strict";
/*
 * kenecho Village - UI層（KE_UI）
 * 画面生成・トップバー・モーダル・通知・フォーム検証。
 * ユーザー入力やDB由来の文字列は必ず textContent で表示する（innerHTML 不使用）。
 * M1 は骨格（ホーム・通知・画面切り替え）。各画面は今後のマイルストーンで構築する。
 */
(function () {
  const U = globalThis.KE_UTIL;

  const refs = { appRoot: null, modalRoot: null };

  /** 要素生成ヘルパ。attrs はプロパティ/属性、children は文字列 or Node 配列 */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        const v = attrs[k];
        if (v == null) return;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "dataset") Object.assign(node.dataset, v);
        else if (k.indexOf("on") === 0 && typeof v === "function") node.addEventListener(k.slice(2), v);
        else if (k === "html") node.innerHTML = v; // 静的な構造のみに使用
        else if (k in node && k.indexOf("aria-") !== 0) node[k] = v;
        else node.setAttribute(k, v);
      });
    }
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        node.append(c.nodeType ? c : document.createTextNode(c));
      });
    }
    return node;
  }

  function clear(root) {
    if (root) root.replaceChildren();
  }

  function showNotice(message) {
    if (!refs.modalRoot) return;
    const toast = el("div", { class: "toast", role: "status" }, message);
    refs.modalRoot.append(toast);
    const remove = function () { toast.remove(); };
    setTimeout(remove, 4000);
    toast.addEventListener("click", remove);
  }

  function showErrorNotice(message) {
    if (!refs.modalRoot) return;
    const toast = el("div", { class: "toast toast--error", role: "alert" }, message);
    refs.modalRoot.append(toast);
    const remove = function () { toast.remove(); };
    setTimeout(remove, 5000);
    toast.addEventListener("click", remove);
  }

  /** ホーム画面（M1 骨格）。プロフィール/保存状態の概要を表示 */
  function renderHome(data) {
    const root = refs.appRoot;
    clear(root);
    const hasProfile = globalThis.KE_DB.hasProfile();

    const panel = el("section", { class: "panel", "aria-labelledby": "homeTitle" }, [
      el("h1", { id: "homeTitle", text: "kenecho Village" }),
      el("p", { class: "lead", text: "健康を記録して、会話の達人をめざそう。研修用・本番利用不可。" }),
      el("div", { class: "card" }, [
        el("h2", { text: "データの状態" }),
        el("ul", { class: "list" }, [
          el("li", { text: "スキーマバージョン: " + data.schemaVersion }),
          el("li", { text: "プロフィール: " + (hasProfile ? "あり（" + (data.profile.displayName || "") + "）" : "未設定") }),
          el("li", { text: "ペット: " + (data.currentPet ? (data.currentPet.name || "") + "（" + data.currentPet.stage + "）" : "未取得") })
        ])
      ])
    ]);
    root.append(panel);
  }

  /** 未実装画面のプレースホルダ（後のマイルストーンで置き換え） */
  function renderPlaceholder(title, message) {
    const root = refs.appRoot;
    clear(root);
    root.append(el("section", { class: "panel" }, [
      el("h2", { text: title }),
      el("p", { text: message || "この画面は今後のマイルストーンで実装されます。" })
    ]));
  }

  /** インストール：DOM 参照の確保とトップバー操作の結線 */
  function install(onNavigate) {
    refs.appRoot = document.getElementById("app-root");
    refs.modalRoot = document.getElementById("modal-root");
    const navButtons = document.querySelectorAll("[data-nav]");
    for (let i = 0; i < navButtons.length; i++) {
      navButtons[i].addEventListener("click", function () {
        const target = this.getAttribute("data-nav");
        if (typeof onNavigate === "function") onNavigate(target);
      });
    }
  }

  const KE_UI = {
    el: el,
    clear: clear,
    showNotice: showNotice,
    showErrorNotice: showErrorNotice,
    renderHome: renderHome,
    renderPlaceholder: renderPlaceholder,
    install: install
  };

  if (globalThis) globalThis.KE_UI = KE_UI;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_UI: KE_UI };
})();
