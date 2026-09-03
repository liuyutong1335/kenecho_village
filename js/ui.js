"use strict";
/*
 * kenecho Village - UI層（KE_UI）
 * 画面生成・トップバー・モーダル・通知・フォーム検証・初期設定ウィザード。
 * ユーザー入力やDB由来の文字列は必ず textContent で表示する（innerHTML は静的構造のみ）。
 * 検証ロジック（validateProfileFields 等）はブラウザ非依存の純粋関数とし、Node テスト可能にする。
 */
(function () {
  const U = globalThis.KE_UTIL;
  const C = globalThis.KE_CONFIG;

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

  /**
   * 初期設定の入力検証（純粋関数）。
   * values は文字列（フォーム入力値）。{ ok, errors } を返し、
   * errors はフィールド名 → エラー文章。
   */
  function validateProfileFields(values) {
    const v = values || {};
    const errors = {};

    if (!v.displayName || !String(v.displayName).trim()) {
      errors.displayName = "表示名を入力してください。";
    } else if (String(v.displayName).trim().length > 20) {
      errors.displayName = "表示名は20文字以内で入力してください。";
    }

    const age = v.age === "" || v.age == null ? NaN : Number(v.age);
    if (v.age === "" || v.age == null) errors.age = "年齢を入力してください。";
    else if (!Number.isInteger(age) || age < C.AGE.min || age > C.AGE.max) {
      errors.age = "年齢は整数で" + C.AGE.min + "〜" + C.AGE.max + "の範囲で入力してください。";
    }

    if (!v.gender) errors.gender = "性別を選択してください。";
    else if (!C.GENDER_OPTIONS[v.gender]) errors.gender = "性別を選択してください。";

    const height = v.heightCm === "" || v.heightCm == null ? NaN : Number(v.heightCm);
    if (v.heightCm === "" || v.heightCm == null) errors.heightCm = "身長を入力してください。";
    else if (!Number.isFinite(height) || height < C.HEIGHT.min || height > C.HEIGHT.max) {
      errors.heightCm = "身長は" + C.HEIGHT.min + "〜" + C.HEIGHT.max + "cmの範囲で入力してください。";
    }

    const weight = v.weightKg === "" || v.weightKg == null ? NaN : Number(v.weightKg);
    if (v.weightKg === "" || v.weightKg == null) errors.weightKg = "体重を入力してください。";
    else if (!Number.isFinite(weight) || weight < C.WEIGHT.min || weight > C.WEIGHT.max) {
      errors.weightKg = "体重は" + C.WEIGHT.min + "〜" + C.WEIGHT.max + "kgの範囲で入力してください。";
    }

    if (!v.petName || !String(v.petName).trim()) {
      errors.petName = "ペットの名前を入力してください。";
    } else if (String(v.petName).trim().length > 12) {
      errors.petName = "ペットの名前は12文字以内で入力してください。";
    }

    if (!v.selectionMode) errors.selectionMode = "決定方式を選択してください。";
    else if (!["choose", "random"].includes(v.selectionMode)) errors.selectionMode = "決定方式を選択してください。";

    return { ok: Object.keys(errors).length === 0, errors: errors };
  }

  /** 特定ステップの入力だけを検証 */
  function validateStepFields(values, fields) {
    const all = validateProfileFields(values);
    const errors = {};
    fields.forEach(function (f) {
      if (all.errors[f]) errors[f] = all.errors[f];
    });
    return { ok: Object.keys(errors).length === 0, errors: errors };
  }

  /** 入力欄＋エラー表示をまとめて生成 */
  function fieldWrap(labelText, controlNode, errorKey, errors, options) {
    const opts = options || {};
    const id = opts.id || "fld_" + errorKey;
    const errMsg = errors && errors[errorKey];
    const descId = id + "_err";
    const label = el("label", { for: id, text: labelText });
    const control = controlNode;
    control.id = id;
    if (errMsg) {
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", descId);
    }
    const wrap = el("div", { class: "field" + (errMsg ? " field--invalid" : "") }, [label, control]);
    if (opts.hint) wrap.append(el("p", { class: "field-hint", text: opts.hint }));
    if (errMsg) wrap.append(el("p", { class: "field-error", id: descId, text: errMsg }));
    return wrap;
  }

  /** 初期設定ウィザード（分割5枚） */
  function renderSetup(onComplete) {
    const root = refs.appRoot;
    const state = { step: 1, values: {} };
    const maxStep = 5;

    const stepRadio = [
      {
        key: "gender",
        title: "性別",
        choices: Object.keys(C.GENDER_OPTIONS).map(function (k) {
          return { value: k, label: C.GENDER_OPTIONS[k] };
        })
      },
      {
        key: "selectionMode",
        title: "ペットの決定方式",
        choices: [
          { value: "choose", label: "自分で選ぶ", note: "孵化時に6種類のペットから選びます" },
          { value: "random", label: "おまかせ", note: "孵化時にランダムで決定されます" }
        ]
      }
    ];

    function currentStepLabel(n) {
      const labels = {
        1: "あなたの表示名",
        2: "年齢・性別",
        3: "身長・体重",
        4: "ペットの名前",
        5: "ペットの決定方式"
      };
      return labels[n];
    }

    function renderRadioGroup(opt, errors) {
      const name = "setup_" + opt.key;
      const radios = opt.choices.map(function (ch) {
        const input = el("input", {
          type: "radio", name: name, value: ch.value,
          dataset: { field: opt.key },
          onchange: function () { state.values[opt.key] = ch.value; }
        });
        if (state.values[opt.key] === ch.value) input.checked = true;
        const label = el("label", { class: "radio-row" }, [
          input,
          el("span", { class: "radio-label", text: ch.label }),
          ch.note ? el("span", { class: "field-hint", text: ch.note }) : null
        ]);
        return label;
      });
      const group = el("div", { role: "radiogroup", "aria-label": opt.title, class: "radio-group" }, radios);
      const errMsg = errors && errors[opt.key];
      if (errMsg) {
        group.setAttribute("aria-invalid", "true");
        group.append(el("p", { class: "field-error", text: errMsg }));
      }
      return group;
    }

    function step1Content(errors) {
      const input = el("input", {
        type: "text", autocomplete: "off", maxlength: "20", placeholder: "例：高橋 翔太",
        oninput: function () { state.values.displayName = input.value; }
      });
      if (state.values.displayName) input.value = state.values.displayName;
      return [
        el("p", { class: "field-hint", text: "ホームや記録に表示される名前です。架空の名前をおすすめします。" }),
        fieldWrap("表示名", input, "displayName", errors, { id: "fld_displayName" })
      ];
    }

    function step2Content(errors) {
      const age = el("input", {
        type: "number", min: String(C.AGE.min), max: String(C.AGE.max), placeholder: "23",
        oninput: function () { state.values.age = age.value; }
      });
      if (state.values.age) age.value = state.values.age;
      const gender = renderRadioGroup(stepRadio[0], errors);
      return [
        fieldWrap("年齢（歳）", age, "age", errors, { id: "fld_age", hint: C.AGE.hint }),
        el("div", { class: "field" }, [el("span", { class: "field-label-inline", html: "性別" }), gender])
      ];
    }

    function step3Content(errors) {
      const height = el("input", {
        type: "number", min: String(C.HEIGHT.min), max: String(C.HEIGHT.max), step: "1", placeholder: "170",
        oninput: function () { state.values.heightCm = height.value; }
      });
      if (state.values.heightCm) height.value = state.values.heightCm;
      const weight = el("input", {
        type: "number", min: String(C.WEIGHT.min), max: String(C.WEIGHT.max), step: "0.1", placeholder: "65.0",
        oninput: function () { state.values.weightKg = weight.value; }
      });
      if (state.values.weightKg) weight.value = state.values.weightKg;
      return [
        el("div", { class: "form-grid" }, [
          fieldWrap("身長（cm）", height, "heightCm", errors, { id: "fld_heightCm" }),
          fieldWrap("体重（kg）", weight, "weightKg", errors, { id: "fld_weightKg" })
        ]),
        el("p", { class: "field-hint", text: "BMIと基礎代謝の目安の算出に使います。参考情報として扱います。" })
      ];
    }

    function step4Content(errors) {
      const input = el("input", {
        type: "text", maxlength: "12", placeholder: "例：モモ",
        oninput: function () { state.values.petName = input.value; }
      });
      if (state.values.petName) input.value = state.values.petName;
      return [
        el("p", { class: "field-hint", text: "第1世代のペットの名前です。卵のうちからこの名前で呼びます。" }),
        fieldWrap("ペットの名前", input, "petName", errors, { id: "fld_petName" })
      ];
    }

    function step5Content(errors) {
      const mode = renderRadioGroup(stepRadio[1], errors);
      return [
        el("p", { class: "field-hint", text: "ペットの種類はこの時点では決まりません。初めて外へ出て卵がかえるときに決定されます。" }),
        el("div", { class: "field" }, [el("span", { class: "field-label-inline", html: "決定方式" }), mode])
      ];
    }

    function draw() {
      clear(root);
      const contents = [step1Content, step2Content, step3Content, step4Content, step5Content];
      const errs = validateProfileFields(state.values).errors;

      const header = el("header", { class: "setup-header" }, [
        el("h1", { id: "setupTitle", text: "はじめまして！ 初期設定をしましょう" }),
        el("p", { class: "setup-steps", "aria-live": "polite", text: "ステップ " + state.step + " / " + maxStep + "：" + currentStepLabel(state.step) })
      ]);

      const panel = el("section", { class: "panel setup-panel", "aria-labelledby": "setupTitle" }, [header]);
      panel.append.apply(panel, contents[state.step - 1](errs));

      const actions = el("div", { class: "form-actions" });
      if (state.step > 1) {
        actions.append(el("button", { type: "button", class: "btn btn--ghost", text: "← 戻る", onclick: function () { state.step -= 1; draw(); } }));
      }
      if (state.step < maxStep) {
        actions.append(el("button", { type: "button", class: "btn btn--primary", text: "次へ →", onclick: function () {
          const fields = [["displayName"], ["age", "gender"], ["heightCm", "weightKg"], ["petName"], ["selectionMode"]][state.step - 1];
          const r = validateStepFields(state.values, fields);
          if (!r.ok) { draw(); return; }
          state.step += 1;
          draw();
        } }));
      } else {
        actions.append(el("button", { type: "button", class: "btn btn--confirm", text: "設定を完了する", onclick: function () {
          const fields = ["selectionMode"];
          const r = validateStepFields(state.values, fields);
          if (!r.ok) { draw(); return; }
          if (typeof onComplete === "function") onComplete(Object.assign({}, state.values));
        } }));
      }
      panel.append(actions);
      root.append(panel);
    }

    draw();
  }

  /** ホーム画面（プロフィール済み向け） */
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
          el("li", { text: "ペット: " + (data.currentPet ? (data.currentPet.name || "") + "（" + (data.currentPet.stage === "egg" ? "卵" : data.currentPet.stage) + "）" : "未取得") })
        ])
      ])
    ]);
    root.append(panel);
  }

  /** 未実装画面のプレースホルダ */
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
    validateProfileFields: validateProfileFields,
    validateStepFields: validateStepFields,
    renderSetup: renderSetup,
    renderHome: renderHome,
    renderPlaceholder: renderPlaceholder,
    install: install
  };

  if (globalThis) globalThis.KE_UI = KE_UI;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_UI: KE_UI };
})();
