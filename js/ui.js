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

  /**
   * 確認モーダル（木枠＋紙）。message を表示し、実行時のみ onConfirm を呼ぶ。
   * Escape / 背後のクリックでキャンセル。
   */
  function confirmDialog(title, message, onConfirm, okLabel) {
    const overlay = el("div", { class: "overlay", "aria-modal": "true", role: "dialog", "aria-label": title || "確認" });
    const dialog = el("div", { class: "dialog" }, [
      el("h2", { class: "dialog-title", text: title || "確認" }),
      el("p", { class: "dialog-body", text: message }),
      el("div", { class: "form-actions" }, [
        el("button", { type: "button", class: "btn btn--ghost", text: "キャンセル", onclick: function () { overlay.remove(); } }),
        el("button", { type: "button", class: "btn btn--confirm", text: okLabel || "実行", onclick: function () {
          overlay.remove();
          if (typeof onConfirm === "function") onConfirm();
        } })
      ])
    ]);
    overlay.append(dialog);
    dialog.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") overlay.remove();
    });
    refs.modalRoot.append(overlay);
    const okBtn = dialog.querySelector("button:last-child");
    if (okBtn) okBtn.focus();
  }

  /* ==================================================================== */
  /* 記録画面（M3: 食事タブ / 他タブは M4 で実装）                          */
  /* ==================================================================== */

  const RECORD_TABS = [
    { key: "meal", label: "食事" },
    { key: "exercise", label: "運動" },
    { key: "sleep", label: "睡眠" },
    { key: "weight", label: "体重" }
  ];

  function fmtNum(n, digits) {
    const d = digits == null ? 1 : digits;
    return Number(n || 0).toFixed(d);
  }

  function statBox(label, value) {
    return el("div", { class: "stat" }, [el("span", { class: "stat-label", text: label }), el("span", { class: "stat-value", text: value })]);
  }

  /* ---------------------------------------------------------------- */
  /* 記録画面の本体                                                     */
  /* ---------------------------------------------------------------- */
  function renderRecordScreen() {
    const root = refs.appRoot;
    const DB = globalThis.KE_DB;
    const H = globalThis.KE_HEALTH;

    const state = {
      date: U.todayStr(),
      tab: "meal",
      editingId: null,
      selectedFood: null,
      foodQty: "",
      mealType: "breakfast",
      searchText: "",
      // 運動
      exSel: null,
      exSearch: "",
      exMinutes: "",
      exCalcMode: "mets",
      exCalories: ""
    };

    function mutate(fn) {
      const db = DB.get();
      fn(db);
      const ok = DB.save();
      if (!ok) showErrorNotice("保存に失敗しました。データが変更されていない場合があります。");
    }

    function findMeal(id) {
      const list = H.getMeals(DB.get(), state.date);
      return list.find(function (r) { return r.id === id; }) || null;
    }

    function draw() {
      clear(root);
      root.append(buildFrame());
    }

    function buildFrame() {
      const dateInput = el("input", {
        type: "date", value: state.date, max: U.todayStr(), id: "record_date",
        onchange: function () { state.date = dateInput.value || U.todayStr(); draw(); }
      });
      const tabs = RECORD_TABS.map(function (t) {
        return el("button", {
          type: "button", class: "tab" + (state.tab === t.key ? " tab--active" : ""), text: t.label,
          role: "tab", "aria-selected": state.tab === t.key ? "true" : "false",
          onclick: function () { state.tab = t.key; draw(); }
        });
      });
      return el("section", { class: "panel", "aria-labelledby": "recordTitle" }, [
        el("div", { class: "record-datebar" }, [
          el("h1", { id: "recordTitle", text: "健康記録" }),
          el("div", { class: "record-datefield" }, [el("label", { for: "record_date", text: "記録する日付" }), dateInput])
        ]),
        el("div", { class: "tabs", role: "tablist", "aria-label": "健康記録の分類" }, tabs),
        el("div", { class: "tab-panel", role: "tabpanel" }, buildTabContent()),
        buildEvaluationCard(state.date),
        buildSummaryBar()
      ]);
    }

    function buildTabContent() {
      if (state.tab === "meal") return buildMealTab();
      if (state.tab === "exercise") return buildExerciseTab();
      if (state.tab === "sleep") return buildSleepTab();
      if (state.tab === "weight") return buildWeightTab();
      return [el("div", { class: "card" }, el("p", { class: "lead", text: "準備中" }))];
    }

    /** 日次健康評価とEXP確定（全タブ共通） */
    function buildEvaluationCard(date) {
      const db = DB.get();
      const st = H.getEvaluationState(db, date);
      const card = el("div", { class: "card eval-card" }, [el("h2", { text: "日次健康評価（" + date + "）" })]);
      if (st.granted) {
        const ev = st.stored;
        card.append(
          el("p", { class: "field-hint", text: "この日は評価済みです。確定済みのEXP・きずな度は、過去の記録変更で再計算されません。" }),
          el("div", { class: "stat-row" }, [
            statBox("食事", ev.scores.meal + " 点"),
            statBox("運動", ev.scores.exercise + " 点"),
            statBox("睡眠", ev.scores.sleep + " 点"),
            statBox("合計", ev.total + " 点"),
            statBox("獲得EXP", "+" + ev.exp)
          ])
        );
        return card;
      }
      const p = st.preview;
      const expLabel = p.scores.hasAny ? "+" + p.exp : "未記録（EXP +" + p.exp + "）";
      const petName = db.currentPet ? db.currentPet.name : "ペット";
      card.append(
        el("p", { class: "field-hint", text: "この日の記録（食事/運動/睡眠 各0〜2点・合計0〜6点）からEXPを計算します。確定すると1回だけ加算されます。" }),
        el("div", { class: "stat-row" }, [
          statBox("食事", p.scores.meal + " 点"),
          statBox("運動", p.scores.exercise + " 点"),
          statBox("睡眠", p.scores.sleep + " 点"),
          statBox("合計", p.total + " 点"),
          statBox("EXP（目安）", expLabel)
        ]),
        el("div", { class: "form-actions" }, [
          el("button", { type: "button", class: "btn btn--confirm", text: "この日の評価を確定する", onclick: function () {
            confirmDialog("健康EXPの確定", "この日の評価（合計" + p.total + "点・EXP +" + p.exp + "）を確定しますか？", function () {
              const r = H.evaluateDay(DB.get(), date);
              if (!r.ok) { showErrorNotice(r.message || "評価を確定できませんでした。"); return; }
              mutate(function () { });
              showStampNotice("健康EXP +" + r.exp);
              showNotice(petName + " の経験値が増えました。");
            });
          } })
        ])
      );
      return card;
    }

    /** 目標とBMI・基礎代謝の参考表示（全タブ共通） */
    function buildSummaryBar() {
      const db = DB.get();
      const profile = db.profile;
      const weight = H.getWeightForCalculation(db);
      const bmi = H.calcBMI(weight, profile && profile.heightCm);
      const bmr = profile ? H.calcBMR(weight, profile.heightCm, profile.age, profile.gender) : null;
      const goals = H.getHealthGoals(db);
      return el("div", { class: "card summary-bar" }, [
        el("h2", { text: "目標と計算（参考情報）" }),
        el("div", { class: "stat-row" }, [
          statBox("BMI（参考）", bmi != null ? fmtNum(bmi, 1) : "—"),
          statBox("基礎代謝（kcal/日）", bmr != null ? String(bmr) : "—"),
          statBox("カロリー上限", goals.calorieLimitKcal + " kcal"),
          statBox("蛋白質目標", goals.proteinGoalG + " g"),
          statBox("運動目標", goals.exerciseMinutes + " 分"),
          statBox("睡眠目標", goals.sleepHours + " h")
        ]),
        el("button", { type: "button", class: "btn btn--ghost btn--sm", text: "健康目標を設定", onclick: renderGoalModal })
      ]);
    }

    function buildMealTab() {
      return [
        buildMealForm(),
        buildMealListSection(),
        el("p", { class: "field-hint", text: "栄養値は基準分量と実摂取量（g）から按分した参考値です。こうした食事データは記録と学習の補助を目的としています。" })
      ];
    }

    /* ---- 食事フォーム ---- */
    function mealTypeSelect(current) {
      const sel = el("select", { "aria-label": "食事の分類", onchange: function () { state.mealType = sel.value; } });
      Object.keys(C.MEAL_TYPES).forEach(function (k) {
        const opt = el("option", { value: k, text: C.MEAL_TYPES[k] });
        if (k === (current || state.mealType)) opt.selected = true;
        sel.append(opt);
      });
      return sel;
    }

    function selectFood(food) {
      state.selectedFood = food;
      state.foodQty = String(food.baseAmountGram);
      state.searchText = "";
      draw();
    }

    function foodSearchControl() {
      const wrap = el("div", { class: "food-search" });
      const input = el("input", { type: "search", placeholder: "食品名で検索（例：ごはん）", "aria-label": "食品検索", value: state.searchText });
      const list = el("div", { class: "food-suggest", role: "listbox", "aria-label": "検索結果" });
      input.addEventListener("input", function () {
        state.searchText = input.value;
        const foods = H.searchFoods(DB.get(), state.searchText, 8);
        list.replaceChildren();
        if (!state.searchText.trim()) return;
        foods.forEach(function (f) {
          list.append(el("button", {
            type: "button", class: "food-suggest-item", role: "option",
            onclick: function () { selectFood(f); }
          }, [el("span", { text: f.name }), el("span", { class: "field-hint", text: "基準 " + f.baseAmountGram + "g／1食約" + Math.round(f.kcal) + "kcal" })]));
        });
      });
      wrap.append(input, list);
      return wrap;
    }

    function buildMealForm() {
      const card = el("div", { class: "card meal-form" }, []);
      const editing = state.editingId ? findMeal(state.editingId) : null;
      if (editing) {
        state.mealType = editing.mealType;
        state.foodQty = String(editing.actualQty);
        card.append(el("h2", { text: "食事記録の編集" }));
      } else {
        card.append(el("h2", { text: "食事を記録する" }));
      }

      const food = state.selectedFood;
      if (food) {
        card.append(el("div", { class: "food-selected" }, [
          el("strong", { text: food.name }),
          el("span", { class: "field-hint", text: "基準分量 " + food.baseAmountGram + "g／" + food.unitName + " 栄養 " + Math.round(food.kcal) + "kcal " + fnum(food.protein) + "P" })
        ]));
      }
      card.append(el("div", { class: "field" }, [el("span", { class: "field-label-inline", html: "食品を選ぶ" }), foodSearchControl()]));

      const qtyInput = el("input", {
        type: "number", min: "0.1", max: "3000", step: "1", value: state.foodQty, "aria-label": "実摂取量",
        oninput: function () { state.foodQty = qtyInput.value; }
      });
      card.append(el("div", { class: "form-grid" }, [
        el("div", { class: "field" }, [el("label", { for: "meal_qty", text: "実摂取量（g）" }), qtyInput]),
        el("div", { class: "field" }, [el("label", { for: "meal_type", text: "食事の分類" }), mealTypeSelect(editing ? editing.mealType : state.mealType)])
      ]));

      const actions = el("div", { class: "form-actions" });
      if (food) {
        actions.append(el("button", {
          type: "button", class: "btn btn--primary", text: editing ? "更新する" : "追加する",
          onclick: function () {
            const db = DB.get();
            const input = { foodId: food.id, mealType: state.mealType, actualQty: state.foodQty, date: state.date };
            const v = H.validateMealInput(db, input);
            if (!v.ok) {
              const msgs = Object.values(v.errors).join(" ");
              showErrorNotice(msgs || "入力内容を確認してください。");
              return;
            }
            const nutrients = H.calcFoodNutrients(food, Number(state.foodQty));
            const record = {
              id: editing ? editing.id : U.generateId("meal"),
              foodId: food.id,
              name: food.name,
              category: food.category,
              mealType: state.mealType,
              unitName: food.unitName,
              baseQty: Number(food.baseAmountGram),
              actualQty: U.round1(Number(state.foodQty)),
              kcal: nutrients.kcal, protein: nutrients.protein, fat: nutrients.fat, carbs: nutrients.carbs,
              isCustom: !!(db.customFoods || []).some(function (cf) { return cf.id === food.id; })
            };
            mutate(function (d) {
              if (editing) H.updateMeal(d, state.date, editing.id, record);
              else H.addMeal(d, state.date, record);
            });
            if (editing) showNotice("食事記録を更新しました。");
            else showStampNotice("記録しました");
            state.editingId = null;
            state.selectedFood = null;
          }
        }));
        if (editing) {
          actions.append(el("button", {
            type: "button", class: "btn btn--ghost", text: "キャンセル",
            onclick: function () { state.editingId = null; state.selectedFood = null; draw(); }
          }));
        }
      } else {
        card.append(el("p", { class: "field-hint", text: "食品を検索して選ぶと追加できます。" }));
      }
      card.append(actions);
      return card;
    }

    function fnum(v) {
      return Number(v || 0).toFixed(1);
    }

    function showStampNotice(msg) {
      // スタンプ演出は M14 で強化（現段階では通知）
      showNotice(msg);
    }

    /* ---- 食事一覧と合計 ---- */
    function buildMealListSection() {
      const db = DB.get();
      const meals = H.getMeals(db, state.date);
      const totals = H.getMealTotals(db, state.date);
      const groups = { breakfast: [], lunch: [], dinner: [], snack: [] };
      meals.forEach(function (r) {
        (groups[r.mealType] || groups.dinner).push(r);
      });

      const card = el("div", { class: "card" }, [
        el("h2", { text: state.date + " の食事記録" }),
        el("div", { class: "stat-row" }, [
          statBox("カロリー", fmtNum(totals.kcal, 0) + " kcal"),
          statBox("タンパク質", fnum(totals.protein) + " g"),
          statBox("脂質", fnum(totals.fat) + " g"),
          statBox("炭水化物", fnum(totals.carbs) + " g"),
          statBox("件数", String(totals.count) + " 件")
        ])
      ]);

      if (meals.length === 0) {
        card.append(el("p", { class: "field-hint", text: "この日の記録はまだありません。" }));
      } else {
        H.MEAL_TYPE_ORDER.forEach(function (mt) {
          const list = groups[mt];
          if (!list || list.length === 0) return;
          card.append(el("h3", { class: "meal-group-title", text: C.MEAL_TYPES[mt] }));
          list.forEach(function (r) {
            const row = el("div", { class: "meal-row" }, [
              el("div", { class: "meal-row-main" }, [
                el("strong", { text: r.name + "（" + fmtNum(r.actualQty, 0) + "g）" }),
                el("span", { class: "field-hint", text: "約" + fmtNum(r.kcal, 0) + "kcal  P" + fnum(r.protein) + " F" + fnum(r.fat) + " C" + fnum(r.carbs) })
              ]),
              el("div", { class: "meal-row-actions" }, [
                el("button", { type: "button", class: "btn btn--ghost btn--sm", text: "編集", onclick: function () {
                  state.editingId = r.id;
                  state.mealType = r.mealType;
                  state.selectedFood = H.getFoodById(db, r.foodId) || { name: r.name, baseAmountGram: r.baseQty, kcal: r.kcal, protein: r.protein, fat: r.fat, carbs: r.carbs, unitName: r.unitName, category: r.category, id: r.foodId };
                  state.foodQty = String(r.actualQty);
                  draw();
                } }),
                el("button", { type: "button", class: "btn btn--ghost btn--sm btn--danger-text", text: "削除", onclick: function () {
                  confirmDialog("記録の削除", "この食事記録を削除しますか？", function () {
                    mutate(function (d) { H.removeMeal(d, state.date, r.id); });
                    showNotice("食事記録を削除しました。");
                  });
                } })
              ])
            ]);
            card.append(row);
          });
        });
      }

      card.append(el("div", { class: "form-actions" }, [
        el("button", { type: "button", class: "btn btn--ghost", text: "カスタム食品を管理", onclick: function () { renderCustomFoodModal(); } })
      ]));
      return card;
    }

    /* ---- カスタム食品管理モーダル ---- */
    function renderCustomFoodModal() {
      const db = DB.get();
      const overlay = el("div", { class: "overlay", role: "dialog", "aria-modal": "true", "aria-label": "カスタム食品の管理" });
      const body = el("div", { class: "dialog dialog--wide" }, []);
      function drawDialog() {
        body.replaceChildren();
        body.append(el("h2", { class: "dialog-title", text: "カスタム食品の管理" }));
        const customs = H.listCustomFoods(DB.get());
        if (customs.length === 0) body.append(el("p", { class: "field-hint", text: "登録済みのカスタム食品はありません。下のフォームから追加できます。" }));
        customs.forEach(function (cf) {
          body.append(el("div", { class: "meal-row" }, [
            el("div", { class: "meal-row-main" }, [
              el("strong", { text: cf.name }),
              el("span", { class: "field-hint", text: "基準 " + fmtNum(cf.baseAmountGram, 0) + "g  " + Math.round(cf.kcal) + "kcal  P" + fnum(cf.protein) })
            ]),
            el("div", { class: "meal-row-actions" }, [
              el("button", { type: "button", class: "btn btn--ghost btn--sm", text: "編集", onclick: function () { customForm(cf); } }),
              el("button", { type: "button", class: "btn btn--ghost btn--sm btn--danger-text", text: "削除", onclick: function () {
                confirmDialog("カスタム食品の削除", cf.name + " を削除しますか？既存の記録には影響しません。", function () {
                  mutate(function (d) { H.removeCustomFood(d, cf.id); });
                  showNotice("カスタム食品を削除しました。");
                  drawDialog();
                });
              } })
            ])
          ]));
        });
        body.append(customForm(null));
        body.append(el("div", { class: "form-actions" }, [el("button", { type: "button", class: "btn btn--ghost", text: "閉じる", onclick: function () { overlay.remove(); } })]));
      }
      function customForm(existing) {
        const wrap = el("div", { class: "field" }, []);
        const isEdit = !!existing;
        const name = el("input", { type: "text", maxlength: "30", placeholder: "例：低糖パン", value: existing ? existing.name : "" });
        const unit = el("input", { type: "text", maxlength: "6", placeholder: "g", value: existing ? existing.unitName : "g" });
        const base = el("input", { type: "number", min: "0.1", placeholder: "50", value: existing ? existing.baseAmountGram : "" });
        const kcal = el("input", { type: "number", min: "0", placeholder: "0", value: existing ? existing.kcal : "" });
        const protein = el("input", { type: "number", min: "0", placeholder: "0", value: existing ? existing.protein : "" });
        const fat = el("input", { type: "number", min: "0", placeholder: "0", value: existing ? existing.fat : "" });
        const carbs = el("input", { type: "number", min: "0", placeholder: "0", value: existing ? existing.carbs : "" });
        const errBox = el("p", { class: "field-error" });
        wrap.append(
          el("h3", { class: "meal-group-title", text: isEdit ? "カスタム食品の編集" : "カスタム食品を追加" }),
          el("div", { class: "form-grid" }, [
            el("div", { class: "field" }, [el("label", { text: "食品名" }), name]),
            el("div", { class: "field" }, [el("label", { text: "単位" }), unit]),
            el("div", { class: "field" }, [el("label", { text: "基準分量（g）" }), base])
          ]),
          el("div", { class: "form-grid" }, [
            el("div", { class: "field" }, [el("label", { text: "カロリー（kcal）" }), kcal]),
            el("div", { class: "field" }, [el("label", { text: "タンパク質（g）" }), protein]),
            el("div", { class: "field" }, [el("label", { text: "脂質（g）" }), fat]),
            el("div", { class: "field" }, [el("label", { text: "炭水化物（g）" }), carbs])
          ]),
          errBox,
          el("div", { class: "form-actions" }, [
            el("button", { type: "button", class: "btn btn--primary", text: isEdit ? "更新する" : "追加する", onclick: function () {
              const input = { name: name.value, unitName: unit.value, baseAmountGram: base.value, kcal: kcal.value, protein: protein.value, fat: fat.value, carbs: carbs.value };
              const v = isEdit ? H.updateCustomFood(DB.get(), existing.id, input) : H.addCustomFood(DB.get(), input);
              if (!v.ok) {
                errBox.textContent = Object.values(v.errors).join(" ");
                return;
              }
              mutate(function () {});
              showNotice(isEdit ? "カスタム食品を更新しました。" : "カスタム食品を追加しました。");
              drawDialog();
            } })
          ])
        );
        return wrap;
      }
      overlay.append(body);
      body.addEventListener("keydown", function (ev) { if (ev.key === "Escape") overlay.remove(); });
      refs.modalRoot.append(overlay);
      drawDialog();
    }

    /* ---- 運動タブ ---- */
    function selectExercise(exObj) {
      state.exSel = exObj;
      state.exSearch = "";
      state.exMinutes = "";
      draw();
    }

    function exerciseSearchControl() {
      const wrap = el("div", { class: "food-search" });
      const input = el("input", { type: "search", placeholder: "運動名で検索（例：ウォーキング）", "aria-label": "運動検索", value: state.exSearch || "" });
      const list = el("div", { class: "food-suggest", role: "listbox", "aria-label": "検索結果" });
      input.addEventListener("input", function () {
        state.exSearch = input.value;
        const items = H.searchExercises(DB.get(), input.value, 8);
        list.replaceChildren();
        if (!String(input.value).trim()) return;
        items.forEach(function (exObj) {
          list.append(el("button", { type: "button", class: "food-suggest-item", role: "option", onclick: function () { selectExercise(exObj); } }, [
            el("span", { text: exObj.name }),
            el("span", { class: "field-hint", text: "METs " + exObj.mets + (exObj.note ? "／" + exObj.note : "") })
          ]));
        });
      });
      wrap.append(input, list);
      return wrap;
    }

    function buildExerciseTab() {
      return [buildExerciseForm(), buildExerciseListSection()];
    }

    function buildExerciseForm() {
      const card = el("div", { class: "card" }, [el("h2", { text: "運動を記録する" })]);
      const exObj = state.exSel;
      if (exObj) {
        card.append(el("div", { class: "food-selected" }, [el("strong", { text: exObj.name }), el("span", { class: "field-hint", text: "METs " + exObj.mets })]));
      }
      card.append(el("div", { class: "field" }, [el("span", { class: "field-label-inline", html: "運動を選ぶ" }), exerciseSearchControl()]));

      const minutes = el("input", { type: "number", min: "1", max: "1440", step: "1", id: "ex_min", value: state.exMinutes || "", "aria-label": "運動時間（分）", oninput: function () { state.exMinutes = minutes.value; } });
      const manual = el("input", { type: "number", min: "0", step: "1", id: "ex_manual", value: state.exCalories || "", "aria-label": "消費カロリー（直接入力）", oninput: function () { state.exCalories = manual.value; } });
      const metsRadio = el("input", { type: "radio", name: "calcMode", value: "mets" });
      const manRadio = el("input", { type: "radio", name: "calcMode", value: "manual" });
      if (state.exCalcMode === "manual") manRadio.checked = true; else metsRadio.checked = true;
      metsRadio.addEventListener("change", function () { state.exCalcMode = "mets"; draw(); });
      manRadio.addEventListener("change", function () { state.exCalcMode = "manual"; draw(); });

      const weightKg = H.getWeightForCalculation(DB.get());
      const modeField = el("div", { class: "field" }, [
        el("span", { class: "field-label-inline", html: "消費カロリーの入力方法" }),
        el("div", { class: "radio-group" }, [
          el("label", { class: "radio-row" }, [metsRadio, el("span", { class: "radio-label", text: "METsで自動計算" })]),
          el("label", { class: "radio-row" }, [manRadio, el("span", { class: "radio-label", text: "直接入力する" })])
        ])
      ]);
      const fields = [el("div", { class: "field" }, [el("label", { for: "ex_min", text: "運動時間（分）" }), minutes])];
      if (state.exCalcMode === "manual") {
        fields.push(el("div", { class: "field" }, [el("label", { for: "ex_manual", text: "消費カロリー（kcal）" }), manual]));
      }
      card.append(el("div", { class: "form-grid" }, fields));
      card.append(modeField);
      card.append(el("p", { class: "field-hint", text: "METs法: 消費kcal = METs × 3.5 × 体重（最新 " + fmtNum(weightKg, 1) + "kg）÷ 200 × 分。参考値です。" }));

      const actions = el("div", { class: "form-actions" });
      if (exObj) {
        actions.append(el("button", { type: "button", class: "btn btn--primary", text: "記録する", onclick: function () {
          const input = { exerciseId: exObj.id, minutes: state.exMinutes, calories: state.exCalories, calcMode: state.exCalcMode || "mets", date: state.date };
          const v = H.validateExerciseInput(DB.get(), input);
          if (!v.ok) { showErrorNotice(Object.values(v.errors).join(" ")); return; }
          const rec = H.buildExerciseRecord(DB.get(), input, weightKg);
          mutate(function (d) { H.addExercise(d, state.date, rec); });
          state.exSel = null; state.exMinutes = ""; state.exCalories = ""; state.exCalcMode = "mets";
          showStampNotice("運動を記録しました");
        } }));
      } else {
        card.append(el("p", { class: "field-hint", text: "運動を検索して選ぶと記録できます。" }));
      }
      card.append(actions);
      return card;
    }

    function buildExerciseListSection() {
      const db = DB.get();
      const list = H.getExercises(db, state.date);
      const t = H.getExerciseTotals(db, state.date);
      const card = el("div", { class: "card" }, [
        el("h2", { text: state.date + " の運動記録" }),
        el("div", { class: "stat-row" }, [
          statBox("合計時間", t.minutes + " 分"),
          statBox("合計消費カロリー", fmtNum(t.calories, 0) + " kcal"),
          statBox("件数", t.count + " 件")
        ])
      ]);
      if (list.length === 0) card.append(el("p", { class: "field-hint", text: "この日の記録はまだありません。" }));
      list.forEach(function (r) {
        card.append(el("div", { class: "meal-row" }, [
          el("div", { class: "meal-row-main" }, [
            el("strong", { text: r.name + "（" + r.minutes + "分）" }),
            el("span", { class: "field-hint", text: "消費カロリー 約" + fmtNum(r.calories, 0) + " kcal（" + (r.calcMode === "manual" ? "直接入力" : "METs推定") + "）" })
          ]),
          el("div", { class: "meal-row-actions" }, [
            el("button", { type: "button", class: "btn btn--ghost btn--sm btn--danger-text", text: "削除", onclick: function () {
              confirmDialog("運動記録の削除", "この運動記録を削除しますか？", function () {
                mutate(function (d) { H.removeExercise(d, state.date, r.id); });
                showNotice("運動記録を削除しました。");
              });
            } })
          ])
        ]));
      });
      card.append(el("div", { class: "form-actions" }, [
        el("button", { type: "button", class: "btn btn--ghost", text: "カスタム運動を管理", onclick: renderCustomExerciseModal })
      ]));
      return card;
    }

    function renderCustomExerciseModal() {
      const overlay = el("div", { class: "overlay", role: "dialog", "aria-modal": "true", "aria-label": "カスタム運動の管理" });
      const body = el("div", { class: "dialog dialog--wide" }, []);
      function drawDialog() {
        body.replaceChildren();
        body.append(el("h2", { class: "dialog-title", text: "カスタム運動の管理" }));
        const customs = (DB.get().customExercises || []);
        if (customs.length === 0) body.append(el("p", { class: "field-hint", text: "登録済みのカスタム運動はありません。下のフォームから追加できます。" }));
        customs.forEach(function (ce) {
          body.append(el("div", { class: "meal-row" }, [
            el("div", { class: "meal-row-main" }, [el("strong", { text: ce.name }), el("span", { class: "field-hint", text: "METs " + ce.mets + (ce.note ? "／" + ce.note : "") })]),
            el("div", { class: "meal-row-actions" }, [
              el("button", { type: "button", class: "btn btn--ghost btn--sm btn--danger-text", text: "削除", onclick: function () {
                confirmDialog("カスタム運動の削除", ce.name + " を削除しますか？", function () {
                  mutate(function (d) { H.removeCustomExercise(d, ce.id); });
                  showNotice("カスタム運動を削除しました。");
                  drawDialog();
                });
              } })
            ])
          ]));
        });
        body.append(customExerciseForm());
        body.append(el("div", { class: "form-actions" }, [el("button", { type: "button", class: "btn btn--ghost", text: "閉じる", onclick: function () { overlay.remove(); } })]));
      }
      function customExerciseForm() {
        const name = el("input", { type: "text", maxlength: "30", placeholder: "例：庭の草むしり" });
        const mets = el("input", { type: "number", min: "0.1", max: "20", step: "0.1", placeholder: "4.0" });
        const note = el("input", { type: "text", maxlength: "40", placeholder: "備考（任意）" });
        const err = el("p", { class: "field-error" });
        const wrap = el("div", { class: "field" }, [
          el("h3", { class: "meal-group-title", text: "カスタム運動を追加" }),
          el("div", { class: "form-grid" }, [
            el("div", { class: "field" }, [el("label", { text: "運動名" }), name]),
            el("div", { class: "field" }, [el("label", { text: "METs" }), mets]),
            el("div", { class: "field" }, [el("label", { text: "備考" }), note])
          ]),
          err,
          el("div", { class: "form-actions" }, [el("button", { type: "button", class: "btn btn--primary", text: "追加する", onclick: function () {
            const r = H.addCustomExercise(DB.get(), { name: name.value, mets: mets.value, note: note.value });
            if (!r.ok) { err.textContent = Object.values(r.errors).join(" "); return; }
            mutate(function () { });
            showNotice("カスタム運動を追加しました。");
            drawDialog();
          } })])
        ]);
        return wrap;
      }
      overlay.append(body);
      body.addEventListener("keydown", function (ev) { if (ev.key === "Escape") overlay.remove(); });
      refs.modalRoot.append(overlay);
      drawDialog();
    }

    /* ---- 睡眠タブ ---- */
    function buildSleepTab() {
      const db = DB.get();
      const rec = H.getSleepOnDate(db, state.date);
      const card = el("div", { class: "card" }, [el("h2", { text: "睡眠を記録する（起床日基準）" })]);
      const sleepAt = el("input", { type: "time", id: "sl_at", value: rec ? rec.sleepAt : "" });
      const wakeAt = el("input", { type: "time", id: "wl_at", value: rec ? rec.wakeAt : "" });
      const err = el("p", { class: "field-error" });
      const hint = el("p", { class: "field-hint", text: "" });
      function updateHint() {
        const h = H.calcSleepHours(sleepAt.value, wakeAt.value);
        hint.textContent = h != null ? "睡眠時間は約 " + fmtNum(h, 1) + " 時間です。" : "";
      }
      sleepAt.addEventListener("change", updateHint);
      wakeAt.addEventListener("change", updateHint);
      updateHint();
      card.append(
        el("p", { class: "field-hint", text: "入眠時刻と起床時刻を記録します。就寝と起床が同じ時刻の場合は保存されません。" }),
        el("div", { class: "form-grid" }, [
          el("div", { class: "field" }, [el("label", { for: "sl_at", text: "入眠時刻" }), sleepAt]),
          el("div", { class: "field" }, [el("label", { for: "wl_at", text: "起床時刻" }), wakeAt])
        ]),
        hint,
        err,
        el("div", { class: "form-actions" }, [
          el("button", { type: "button", class: "btn btn--primary", text: rec ? "更新する" : "保存する", onclick: function () {
            const v = H.validateSleepInput({ sleepAt: sleepAt.value, wakeAt: wakeAt.value, date: state.date });
            if (!v.ok) { err.textContent = Object.values(v.errors).join(" "); return; }
            mutate(function (d) { H.saveSleep(d, state.date, sleepAt.value, wakeAt.value); });
            showStampNotice("睡眠を記録しました");
          } }),
          rec ? el("button", { type: "button", class: "btn btn--ghost btn--danger-text", text: "記録を削除", onclick: function () {
            confirmDialog("睡眠記録の削除", "この日の睡眠記録を削除しますか？", function () {
              mutate(function (d) { H.removeSleep(d, state.date); });
              showNotice("睡眠記録を削除しました。");
            });
          } }) : null
        ])
      );
      return [card];
    }

    /* ---- 体重タブ ---- */
    function buildTrendChart(entries) {
      const wrap = el("div", { class: "trend", role: "img", "aria-label": "直近の体重トレンドグラフ" });
      if (entries.length === 0) {
        wrap.append(el("p", { class: "field-hint", text: "記録があると直近30日のグラフが表示されます。" }));
        return wrap;
      }
      const values = entries.map(function (e) { return e.kg; });
      const min = Math.min.apply(null, values);
      const max = Math.max.apply(null, values);
      const span = (max - min) || 1;
      entries.forEach(function (e) {
        const h = Math.round((e.kg - min) / span * 64) + 8;
        wrap.append(el("div", { class: "trend-col", title: e.date + " " + fmtNum(e.kg, 1) + "kg" }, [
          el("div", { class: "trend-bar", style: "height:" + h + "px" }),
          el("span", { class: "trend-label", text: e.date.slice(5) })
        ]));
      });
      return wrap;
    }

    function buildWeightTab() {
      const db = DB.get();
      const entries = H.getWeightEntries(db);
      const existing = H.hasWeightOnDate(db, state.date);
      const card = el("div", { class: "card" }, [el("h2", { text: "体重を記録する（1日1件）" })]);
      const kg = el("input", { type: "number", min: "20", max: "400", step: "0.1", id: "kg_input", value: existing ? db.healthRecords.weight[state.date].kg : "" });
      const err = el("p", { class: "field-error" });
      card.append(
        el("div", { class: "form-grid" }, [el("div", { class: "field" }, [el("label", { for: "kg_input", text: "体重（kg）" }), kg])]),
        existing ? el("p", { class: "field-hint", text: "この日付には体重が登録済みです。上書きする場合は確認が表示されます。" }) : null,
        err,
        el("div", { class: "form-actions" }, [el("button", { type: "button", class: "btn btn--primary", text: existing ? "上書き登録" : "登録する", onclick: function () {
          const v = H.validateWeightInput({ kg: kg.value, date: state.date });
          if (!v.ok) { err.textContent = Object.values(v.errors).join(" "); return; }
          const doSave = function () {
            mutate(function (d) { H.saveWeight(d, state.date, Number(kg.value)); });
            showStampNotice(existing ? "体重を上書きしました" : "体重を記録しました");
          };
          if (existing) confirmDialog("体重の上書き", "この日付の体重は上書きされます。よろしいですか？", doSave);
          else doSave();
        } })])
      );
      const listCard = el("div", { class: "card" }, [el("h2", { text: "体重の履歴とトレンド" })]);
      listCard.append(buildTrendChart(H.getRecentWeights(db, 30)));
      if (entries.length === 0) {
        listCard.append(el("p", { class: "field-hint", text: "記録はまだありません。" }));
      } else {
        entries.slice(0, 30).forEach(function (e) {
          listCard.append(el("div", { class: "meal-row" }, [
            el("div", { class: "meal-row-main" }, [el("strong", { text: e.date }), el("span", { class: "field-hint", text: fmtNum(e.kg, 1) + " kg" })]),
            el("div", { class: "meal-row-actions" }, [el("button", { type: "button", class: "btn btn--ghost btn--sm btn--danger-text", text: "削除", onclick: function () {
              confirmDialog("体重記録の削除", e.date + " の体重記録を削除しますか？", function () {
                mutate(function (d) { H.removeWeight(d, e.date); });
                showNotice("体重記録を削除しました。");
              });
            } })])
          ]));
        });
      }
      return [card, listCard];
    }

    /* ---- 健康目標モーダル ---- */
    function renderGoalModal() {
      const g = H.getHealthGoals(DB.get());
      const overlay = el("div", { class: "overlay", role: "dialog", "aria-modal": "true", "aria-label": "健康目標の設定" });
      const dialog = el("div", { class: "dialog dialog--wide" }, []);
      const cal = el("input", { type: "number", min: "500", max: "10000", value: g.calorieLimitKcal });
      const pro = el("input", { type: "number", min: "10", max: "300", value: g.proteinGoalG });
      const ex = el("input", { type: "number", min: "1", max: "1440", value: g.exerciseMinutes });
      const sl = el("input", { type: "number", min: "1", max: "16", step: "0.5", value: g.sleepHours });
      const err = el("p", { class: "field-error" });
      dialog.append(
        el("h2", { class: "dialog-title", text: "健康目標の設定" }),
        el("p", { class: "field-hint", text: "目標は日次の評価とペットの状態に使われます。未設定時は初期値を使います。" }),
        el("div", { class: "form-grid" }, [
          el("div", { class: "field" }, [el("label", { text: "1日の摂取カロリー上限（kcal）" }), cal]),
          el("div", { class: "field" }, [el("label", { text: "蛋白質目標（g）" }), pro]),
          el("div", { class: "field" }, [el("label", { text: "運動時間目標（分）" }), ex]),
          el("div", { class: "field" }, [el("label", { text: "睡眠時間目標（時間）" }), sl])
        ]),
        err,
        el("div", { class: "form-actions" }, [
          el("button", { type: "button", class: "btn btn--ghost", text: "閉じる", onclick: function () { overlay.remove(); } }),
          el("button", { type: "button", class: "btn btn--confirm", text: "保存する", onclick: function () {
            const r = H.setHealthGoals(DB.get(), { calorieLimitKcal: cal.value, proteinGoalG: pro.value, exerciseMinutes: ex.value, sleepHours: sl.value });
            if (!r.ok) { err.textContent = Object.values(r.errors).join(" "); return; }
            mutate(function () { });
            showNotice("健康目標を保存しました。");
            overlay.remove();
          } })
        ])
      );
      overlay.append(dialog);
      dialog.addEventListener("keydown", function (ev) { if (ev.key === "Escape") overlay.remove(); });
      refs.modalRoot.append(overlay);
    }

    draw();
  }

  /** ペット小屋画面（卵またはペット・掲示板・外出入口） */
  function renderPetScreen() {
    const root = refs.appRoot;
    const DB = globalThis.KE_DB;
    const H9 = globalThis.KE_HEALTH;
    const PET = globalThis.KE_PET;
    const SPR = globalThis.KE_SPRITE;
    clear(root);
    const db = DB.get();
    const pet = db.currentPet;
    if (!pet) { renderPlaceholder("ペット", "ペットが見つかりません。"); return; }
    PET.refreshStage(db);
    const today = U.todayStr();
    const condition = PET.getCondition(db, today);
    const condMeta = PET.getConditionMeta(condition);
    const stageKey = pet.speciesRevealed ? PET.getPetStage(pet, today) : "egg";
    const stageLabel = pet.stage === "egg" ? "卵" : PET.getStageLabel(stageKey);
    const species = pet.speciesRevealed ? PET.getSpeciesById(pet.speciesId) : null;

    // 中央表示（卵は共通スプライト・種類非公開。公開後は種類色のペット）
    const stage = el("div", { class: "pet-stage" });
    let canvas;
    if (!pet.speciesRevealed || pet.stage === "egg") {
      canvas = SPR.canvasTag(SPR.renderEgg(5), pet.name + "（卵）", "sprite-canvas");
    } else {
      const color = (species && species.color) || "#7fa650";
      canvas = SPR.canvasTag(SPR.renderPet(color, 5), pet.name + " " + condMeta.label, "sprite-canvas");
    }
    stage.append(canvas);

    // 掲示板（今日の記録状況）
    const meals = H9.getMealTotals(db, today);
    const ex = H9.getExerciseTotals(db, today);
    const sleep = H9.getSleepOnDate(db, today);
    const weight = H9.hasWeightOnDate(db, today);
    const evalSt = H9.getEvaluationState(db, today);
    const bulletItems = [
      ["食事", meals.count > 0, meals.count + " 件"],
      ["運動", ex.count > 0, ex.minutes + " 分"],
      ["睡眠", !!sleep, sleep ? sleep.hours + " 時間" : "未記録"],
      ["体重", weight, weight ? "記録あり" : "未記録"]
    ];
    const bulletin = el("div", { class: "bulletin" }, [
      el("h3", { text: "今日の記録状況（木製掲示板）" }),
      el("ul", { class: "checklist" }, bulletItems.map(function (row) {
        return el("li", { class: row[1] ? "check--done" : "check--todo", text: (row[1] ? "✓ " : "… ") + row[0] + "：" + row[2] });
      })),
      evalSt.granted
        ? el("p", { class: "field-hint", text: "今日の健康EXPは確定済み（+" + evalSt.stored.exp + "）" })
        : el("p", { class: "field-hint", text: "今日の評価はまだです。「記録」画面で確定できます。" })
    ]);

    const exitButton = el("button", {
      type: "button", class: "btn btn--primary",
      text: pet.stage === "egg" ? "外へ出る（卵を持って）" : "外へ出る",
      onclick: startOuting
    });

    const panel = el("section", { class: "panel pet-house", "aria-labelledby": "petHouseTitle" }, [
      el("h1", { id: "petHouseTitle", text: "ペット小屋" }),
      el("div", { class: "pet-house-layout" }, [
        stage,
        el("div", { class: "pet-house-info" }, [
          el("h2", { text: pet.name }),
          el("p", { class: "field-hint", text: "成長段階：" + stageLabel + (species ? " ／ 種類：" + species.name + "（" + species.coachTypeLabel + "）" : " ／ 種類はまだ分かりません") }),
          el("p", { class: "field-hint", text: "健康状態：" + condMeta.label + "（" + condMeta.desc + "）" }),
          bulletin,
          el("div", { class: "stat-row" }, [
            statBox("累計EXP", String(pet.cumulativeExp)),
            statBox("ペットきずな度", String(pet.petBond)),
            statBox("記録日数", String(pet.recordedDays))
          ]),
          buildDepartureAction(),
          el("div", { class: "form-actions" }, [exitButton])
        ])
      ])
    ]);
    root.append(panel);
  }

  /* ==================================================================== */
  /* 村の入口・孵化・種類公開（M7）                                         */
  /* ==================================================================== */

  /** 小屋の外へ出る。未公開の卵なら孵化フローへ */
  function startOuting() {
    const db = globalThis.KE_DB.get();
    const pet = db.currentPet;
    if (!pet || !pet.speciesRevealed) {
      renderVillageEntrance();
      return;
    }
    showNotice("村の道を進むと、NPCとの会話クエストができるようになります（次のマイルストーンで実装予定）。");
  }

  function renderVillageEntrance() {
    const root = refs.appRoot;
    const DB = globalThis.KE_DB;
    const PET = globalThis.KE_PET;
    const SPR = globalThis.KE_SPRITE;
    clear(root);
    const pet = DB.get().currentPet;
    const panel = el("section", { class: "panel village-entrance", "aria-labelledby": "villageTitle" }, [
      el("h1", { id: "villageTitle", text: "村の入口" }),
      el("p", { class: "lead", text: "ペット小屋を出て、村の入口に着きました。" }),
      el("p", { class: "field-hint", text: "卵がぴくぴく動いています…。種類はここで初めて決まります。" }),
      el("div", { class: "pet-stage egg-shake", "aria-label": pet.name + "の卵" }, [
        SPR.canvasTag(SPR.renderEgg(6), pet.name + "の卵", "sprite-canvas")
      ]),
      el("p", { class: "field-hint", text: "「自分で選ぶ」または「おまかせ（" + (pet.selectionMode === "random" ? "ランダム決定" : "6種類から選択") + "）」でかえる予定です。" }),
      el("div", { class: "form-actions" }, [
        el("button", { type: "button", class: "btn btn--confirm", text: "卵をかえす（孵化）", onclick: hatchNow }),
        el("button", { type: "button", class: "btn btn--ghost", text: "小屋に戻る", onclick: function () {
          if (globalThis.KE_APP && globalThis.KE_APP.navigate) globalThis.KE_APP.navigate("pet");
        } })
      ])
    ]);
    root.append(panel);

    function hatchNow() {
      const db = DB.get();
      const pet = db.currentPet;
      if (pet.selectionMode === "random") {
        const r = PET.revealRandomSpecies(db);
        if (!r.ok) { showErrorNotice(r.message || "孵化できませんでした。"); return; }
        finishHatch(r.speciesId, r.firstDiscover);
      } else {
        renderSpeciesChoice();
      }
    }
  }

  /** 孵化確定後の締め処理：最初のNPCと出会い、同一保存して公開演出へ */
  function finishHatch(speciesId, firstDiscover) {
    const db = globalThis.KE_DB.get();
    const REL = globalThis.KE_RELATIONSHIP;
    REL.ensureNpc(db, "npc_sato"); // 種類公開後にのみ登場させる
    if (!db.relationshipHistory) db.relationshipHistory = [];
    if (!globalThis.KE_DB.save()) showErrorNotice("保存に失敗しました。");
    renderSpeciesReveal(speciesId, firstDiscover);
  }

  function renderSpeciesChoice() {
    const root = refs.appRoot;
    const DB = globalThis.KE_DB;
    const PET = globalThis.KE_PET;
    const SPR = globalThis.KE_SPRITE;
    clear(root);
    const candidates = PET.getHatchCandidates(DB.get());
    const panel = el("section", { class: "panel", "aria-labelledby": "choiceTitle" }, [
      el("h1", { id: "choiceTitle", text: "卵がかえった！ 仲間を選ぼう" }),
      el("p", { class: "field-hint", text: "ここで仲間の種類が決まります。選ぶと図鑑にも登録されます。" }),
      el("div", { class: "species-grid role-grid" }, candidates.map(function (sp) {
        return el("button", { type: "button", class: "species-card", onclick: function () {
          const r = PET.applyHatch(DB.get(), sp.id);
          if (!r.ok) { showErrorNotice(r.message || "選べない種類です。"); return; }
          finishHatch(r.speciesId, r.firstDiscover);
        } }, [
          SPR.canvasTag(SPR.renderPet(sp.color, 4), sp.name + " の姿", "sprite-canvas"),
          el("span", { class: "species-name", text: sp.name }),
          el("span", { class: "species-coach", text: sp.coachTypeLabel }),
          el("span", { class: "field-hint", text: sp.summary })
        ]);
      })),
      el("div", { class: "form-actions" }, [
        el("button", { type: "button", class: "btn btn--ghost", text: "まだ決めない（卵に戻る）", onclick: function () {
          if (globalThis.KE_APP && globalThis.KE_APP.navigate) globalThis.KE_APP.navigate("pet");
        } })
      ])
    ]);
    root.append(panel);
  }

  function renderSpeciesReveal(speciesId, firstDiscover) {
    const root = refs.appRoot;
    const DB = globalThis.KE_DB;
    const PET = globalThis.KE_PET;
    const SPR = globalThis.KE_SPRITE;
    clear(root);
    const db = DB.get();
    const pet = db.currentPet;
    const sp = PET.getSpeciesById(speciesId);
    const npcSato = (globalThis.KE_NPCS || []).find(function (n) { return n.id === "npc_sato"; });
    const panel = el("section", { class: "panel species-reveal", "aria-labelledby": "revealTitle" }, [
      el("h1", { id: "revealTitle", text: "その子、かえりました！" }),
      el("div", { class: "pet-stage" }, [SPR.canvasTag(SPR.renderPet(sp.color, 6), pet.name + "（" + sp.name + "）", "sprite-canvas")]),
      el("p", { class: "lead", text: pet.name + " は「" + sp.name + "」でした！" }),
      el("p", { class: "field-hint", text: "コーチタイプ：" + sp.coachTypeLabel + " ／ " + sp.summary }),
      el("p", { class: "field-hint", text: (firstDiscover ? "図鑑に新しく登録されました。" : "図鑑の登録が更新されました。") + " これで、ペットのコーチ台詞を使えるようになります。" }),
      el("div", { class: "card" }, [
        el("h2", { text: "最初のNPCと出会った" }),
        el("p", { text: "…村の入り口で女性が手を振っていた。どうやら" + (npcSato ? npcSato.displayName : "佐藤さん") + "という名前らしい。" }),
        el("p", { class: "field-hint", text: npcSato ? npcSato.intro : "" }),
        el("p", { class: "field-hint", text: "「会話クエスト」から話しかけられるようになります（次のマイルストーンで実装）。" })
      ]),
      el("div", { class: "form-actions" }, [
        el("button", { type: "button", class: "btn btn--primary", text: "ペット小屋へ戻る", onclick: function () {
          if (globalThis.KE_APP && globalThis.KE_APP.navigate) globalThis.KE_APP.navigate("pet");
        } })
      ])
    ]);
    root.append(panel);
  }

  /* ==================================================================== */
  /* 今日の会話クエスト（M9）                                               */
  /* ==================================================================== */

  function speciesColorOf(db) {
    const pet = db.currentPet;
    if (pet && pet.speciesId) {
      const sp = globalThis.KE_PET.getSpeciesById(pet.speciesId);
      if (sp) return sp.color;
    }
    return "#7FA650";
  }

  function renderQuestScreen() {
    const root = refs.appRoot;
    const DB = globalThis.KE_DB;
    const CONV = globalThis.KE_CONVERSATION;
    const PET = globalThis.KE_PET;
    const SPR = globalThis.KE_SPRITE;
    clear(root);
    const db = DB.get();
    const today = U.todayStr();

    if (!CONV.isConversationUnlocked(db)) {
      root.append(el("section", { class: "panel", "aria-labelledby": "questTitle" }, [
        el("h1", { id: "questTitle", text: "会話クエスト" }),
        el("p", { class: "field-hint", text: "ペットの種類が公開されるまで、NPCは村に姿を現しません。まずペット小屋から「外へ出る」を選んでください。" }),
        el("div", { class: "form-actions" }, [el("button", { type: "button", class: "btn btn--primary", text: "ペット小屋へ", onclick: function () { if (globalThis.KE_APP) globalThis.KE_APP.navigate("pet"); } })])
      ]));
      return;
    }
    const scene = CONV.pickQuestScene(db);
    if (!scene) {
      root.append(el("section", { class: "panel" }, [
        el("h1", { text: "会話クエスト" }),
        el("p", { class: "field-hint", text: "話しかけられるNPCがまだいません。ペット小屋から外に出て、NPCと出会ってください。" })
      ]));
      return;
    }
    draw(scene, null);

    function draw(sc, result) {
      clear(root);
      root.append(buildFrame(sc, result));
    }

    function buildFrame(sc, result) {
      const npc = CONV.getNpcById(sc.npcId) || { displayName: sc.npcId };
      const status = CONV.getQuestStatus(db, today);
      return el("section", { class: "panel conv-panel", "aria-labelledby": "questTitle" }, [
        el("h1", { id: "questTitle", text: "今日の会話クエスト：" + sc.title }),
        el("p", { class: "field-hint", text: status.done ? "今日のきずな度は更新済みです。再プレイでは更新されません。" : "今日のクエストです。きずな度が更新されます。" }),
        el("div", { class: "form-actions" }, [el("button", { type: "button", class: "btn btn--ghost btn--sm", text: "会話練習モードへ", onclick: renderPracticeScreen })]),
        el("div", { class: "conv-bg bg-" + sc.background, "aria-hidden": "true" }),
        el("div", { class: "conv-stage", "aria-label": "会話のようす" }, [
          el("div", { class: "conv-char conv-char--user", "aria-label": "あなた" }, [el("div", { class: "conv-avatar conv-avatar--user", "aria-hidden": "true" }), el("span", { class: "nameplate", text: "あなた" })]),
          el("div", { class: "conv-char conv-char--pet", "aria-label": db.currentPet.name }, [
            SPR.canvasTag(SPR.renderPet(speciesColorOf(db), 3), db.currentPet.name + "（一緒にいる）", "sprite-canvas conv-avatar"),
            el("span", { class: "nameplate", text: db.currentPet.name })
          ]),
          el("div", { class: "conv-char conv-char--npc", "aria-label": npc.displayName }, [
            SPR.canvasTag(SPR.renderSilhouette("#5a554e", 3), npc.displayName, "sprite-canvas conv-avatar"),
            el("span", { class: "nameplate", text: npc.displayName })
          ])
        ]),
        el("p", { class: "conv-context", text: sc.context }),
        result ? buildResult(sc, npc, result) : buildQuestion(sc)
      ]);
    }

    function buildQuestion(sc) {
      const round = sc.rounds[0];
      const box = el("div", { class: "conv-box", "aria-live": "polite" }, [
        el("span", { class: "nameplate", text: CONV.getNpcById(sc.npcId).displayName }),
        el("p", { class: "conv-bubble", text: round.npcLine })
      ]);
      const choices = el("div", { class: "conv-choices" }, [el("p", { class: "field-hint", text: "あなたの返答を選んでください（分類は表示しません）。" })]);
      round.answers.forEach(function (a, i) {
        choices.append(el("button", { type: "button", class: "btn btn--primary conv-choice", text: a.text, onclick: function () {
          const r = CONV.completeDailyQuest(DB.get(), sc.id, i, today);
          if (!r.ok) { showErrorNotice(r.message || "クエストを完了できませんでした。"); return; }
          if (r.updates.applied && !DB.save()) showErrorNotice("保存に失敗しました。");
          else if (!r.updates.applied) DB.save();
          draw(sc, r);
        } }));
      });
      return el("div", { class: "conv-flow" }, [box, choices]);
    }

    function buildResult(sc, npc, r) {
      const meta = CONV.getAnswerMeta(db, r.answer);
      const box = el("div", { class: "conv-box conv-result", "aria-live": "polite" }, [
        el("span", { class: "nameplate", text: npc.displayName }),
        el("p", { class: "conv-bubble", text: r.answer.npcReply }),
        el("div", { class: "card result-card" }, [
          el("h3", { text: "解説（ここで分類を公開します）" }),
          el("p", { text: meta.label + "：" + meta.explanation }),
          el("p", { class: "field-hint", text: meta.nextHint || "" }),
          el("h3", { text: "きずな度の変化" }),
          r.updates.applied
            ? el("p", { class: "result-bond", text: "NPC（" + bondLine(r.updates.npc) + "）／ペット（" + bondLine(r.updates.pet) + "）" })
            : el("p", { class: "field-hint", text: "今日はすでに更新済みのため、きずな度は変わりません。" })
        ]),
        el("div", { class: "card result-card result-advice" }, [
          el("h3", { text: db.currentPet.name + " のアドバイス" }),
          el("p", { text: r.advice.text || "" })
        ])
      ]);
      const actions = el("div", { class: "form-actions" }, [
        el("button", { type: "button", class: "btn btn--ghost", text: "もう一度プレイ", onclick: function () {
          draw(CONV.pickQuestScene(DB.get()) || sc, null);
        } }),
        el("button", { type: "button", class: "btn btn--primary", text: "ペット小屋へ戻る", onclick: function () { if (globalThis.KE_APP) globalThis.KE_APP.navigate("pet"); } })
      ]);
      return el("div", { class: "conv-flow" }, [box, actions]);
    }

    function bondLine(u) {
      return u ? u.before + " → " + u.after + "（" + (u.delta >= 0 ? "+" : "") + u.delta + "）" : "変化なし";
    }
  }

  /* ==================================================================== */
  /* 会話練習モード（M10・きずな度は変化しない）                             */
  /* ==================================================================== */

  function renderPracticeScreen() {
    const root = refs.appRoot;
    const DB = globalThis.KE_DB;
    const CONV = globalThis.KE_CONVERSATION;
    const SPR = globalThis.KE_SPRITE;
    const st = { phase: "select", scene: null, idx: 0, goodCount: 0, bonusRound: null, bonusPlayed: false, last: null };
    clear(root);
    const db = DB.get();

    if (!CONV.isConversationUnlocked(db)) {
      root.append(el("section", { class: "panel" }, [
        el("h1", { text: "会話練習モード" }),
        el("p", { class: "field-hint", text: "ペットの種類が公開されるまで、NPCは登場しません。" }),
        el("div", { class: "form-actions" }, [el("button", { type: "button", class: "btn btn--primary", text: "ペット小屋へ", onclick: function () { if (globalThis.KE_APP) globalThis.KE_APP.navigate("pet"); } })])
      ]));
      return;
    }
    drawSelect();

    function setScene(scene) {
      st.scene = scene;
      st.idx = 0;
      st.goodCount = 0;
      st.bonusRound = null;
      st.bonusPlayed = false;
      st.last = null;
      drawPlay();
    }

    function effectiveRounds() {
      return CONV.practiceRounds(st.scene).concat(st.bonusRound ? [st.bonusRound] : []);
    }

    function drawSelect() {
      clear(root);
      const scenes = CONV.getScenes();
      const panel = el("section", { class: "panel", "aria-labelledby": "practiceTitle" }, [
        el("h1", { id: "practiceTitle", text: "会話練習モード" }),
        el("p", { class: "field-hint", text: "シーンを選ぶか、ランダムで始められます。基本4ターン。きずな度は増減しません（何度でも練習できます）。" }),
        el("div", { class: "form-actions" }, [
          el("button", { type: "button", class: "btn btn--primary", text: "ランダムに始める", onclick: function () {
            const list = CONV.getScenes();
            setScene(list[U.randInt(0, list.length - 1)]);
          } }),
          el("button", { type: "button", class: "btn btn--ghost", text: "会話クエストへ戻る", onclick: function () { if (globalThis.KE_APP) globalThis.KE_APP.navigate("quest"); } })
        ])
      ]);
      const grid = el("div", { class: "species-grid" });
      scenes.forEach(function (s) {
        const npc = CONV.getNpcById(s.npcId);
        grid.append(el("button", { type: "button", class: "species-card", onclick: function () { setScene(s); } }, [
          el("span", { class: "species-name", text: s.title }),
          el("span", { class: "species-coach", text: (C.SCENE_CATEGORIES[s.category] || s.category) + "／" + (npc ? npc.displayName : "") }),
          el("span", { class: "field-hint", text: "背景：" + (C.SCENE_BACKGROUNDS[s.background] || s.background) })
        ]));
      });
      panel.append(grid);
      root.append(panel);
    }

    function drawPlay() {
      clear(root);
      const sc = st.scene;
      const npc = CONV.getNpcById(sc.npcId) || { displayName: sc.npcId };
      const rounds = effectiveRounds();
      const finished = st.idx >= rounds.length;

      if (finished) {
        root.append(el("section", { class: "panel", "aria-labelledby": "practiceTitle" }, [
          el("h1", { id: "practiceTitle", text: "練習おつかれさまでした！" }),
          el("p", { class: "lead", text: "「会話が続きやすい」を「" + st.goodCount + "回」選びました。" }),
          el("p", { class: "field-hint", text: "ボーナスタンの有無：" + (st.bonusPlayed ? "あり（条件成立）" : "条件は good を2回以上") }),
          el("p", { class: "field-hint", text: "この練習では、きずな度や健康EXPは変化しません。" }),
          el("div", { class: "form-actions" }, [
            el("button", { type: "button", class: "btn btn--primary", text: "もう一度", onclick: function () { setScene(st.scene); } }),
            el("button", { type: "button", class: "btn btn--ghost", text: "シーンを選び直す", onclick: drawSelect }),
            el("button", { type: "button", class: "btn btn--ghost", text: "会話クエストへ", onclick: function () { if (globalThis.KE_APP) globalThis.KE_APP.navigate("quest"); } })
          ])
        ]));
        return;
      }

      const round = rounds[st.idx];
      const isBonusTurn = st.bonusRound && st.idx >= CONV.practiceRounds(sc).length;
      const panel = el("section", { class: "panel conv-panel", "aria-labelledby": "practiceTitle" }, [
        el("h1", { id: "practiceTitle", text: "会話練習：" + sc.title + "（" + (st.idx + 1) + " / " + rounds.length + "ターン" + (isBonusTurn ? "・ボーナス" : "") + "）" }),
        el("div", { class: "conv-bg bg-" + sc.background, "aria-hidden": "true" }),
        el("div", { class: "conv-stage", "aria-label": "会話のようす" }, [
          el("div", { class: "conv-char conv-char--user", "aria-label": "あなた" }, [el("div", { class: "conv-avatar conv-avatar--user", "aria-hidden": "true" }), el("span", { class: "nameplate", text: "あなた" })]),
          el("div", { class: "conv-char conv-char--pet", "aria-label": db.currentPet.name }, [SPR.canvasTag(SPR.renderPet(speciesColorOf(db), 3), db.currentPet.name, "sprite-canvas conv-avatar"), el("span", { class: "nameplate", text: db.currentPet.name })]),
          el("div", { class: "conv-char conv-char--npc", "aria-label": npc.displayName }, [SPR.canvasTag(SPR.renderSilhouette("#5a554e", 3), npc.displayName, "sprite-canvas conv-avatar"), el("span", { class: "nameplate", text: npc.displayName })])
        ]),
        el("p", { class: "conv-context", text: st.idx === 0 ? sc.context : "会話は続いています…" }),
        el("div", { class: "conv-box", "aria-live": "polite" }, [
          el("span", { class: "nameplate", text: npc.displayName }),
          el("p", { class: "conv-bubble", text: round.npcLine })
        ]),
        st.last ? buildPracticeResult(round, npc) : buildPracticeChoices(round)
      ]);
      root.append(panel);
    }

    function buildPracticeChoices(round) {
      const wrap = el("div", { class: "conv-choices" }, [el("p", { class: "field-hint", text: "返答を選んでください（分類は表示しません）。" })]);
      round.answers.forEach(function (a, i) {
        wrap.append(el("button", { type: "button", class: "btn btn--primary conv-choice", text: a.text, onclick: function () {
          const ev = CONV.evaluatePracticeAnswer(st.scene, st.idx, i);
          if (!ev.ok) { showErrorNotice("回答を評価できませんでした。"); return; }
          if (ev.meta.type === "good") st.goodCount += 1;
          st.last = ev;
          drawPlay();
        } }));
      });
      return wrap;
    }

    function buildPracticeResult(round, npc) {
      const ev = st.last;
      const pet = db.currentPet;
      const advice = globalThis.KE_DIALOGUE.pick({
        petType: pet.speciesId || null,
        coachType: pet.speciesId ? (globalThis.KE_PETS.find((p) => p.id === pet.speciesId) || {}).coachType : null,
        stage: pet.stage, condition: globalThis.KE_PET.getCondition(db),
        answerType: ev.meta.type, sceneTag: st.scene.category, purpose: "feedback", recentIds: []
      });
      return el("div", { class: "conv-flow" }, [
        el("div", { class: "conv-box" }, [
          el("span", { class: "nameplate", text: npc.displayName }),
          el("p", { class: "conv-bubble", text: ev.answer.npcReply })
        ]),
        el("div", { class: "card result-card" }, [
          el("h3", { text: "解説（分類を公開）" }),
          el("p", { text: ev.meta.label + "：" + ev.meta.explanation }),
          el("p", { class: "field-hint", text: ev.meta.nextHint || "" })
        ]),
        el("div", { class: "card result-card result-advice" }, [
          el("h3", { text: pet.name + " のアドバイス" }),
          el("p", { text: advice.text })
        ]),
        el("div", { class: "form-actions" }, [
          el("button", { type: "button", class: "btn btn--primary", text: "次の返答へ", onclick: function () {
            const base = CONV.practiceRounds(st.scene);
            st.idx += 1;
            // 4ターン終了時にボーナス条件成立ならボーナスタンを1回追加
            if (!st.bonusPlayed && st.idx >= base.length && CONV.isBonusEligible(st.goodCount)) {
              st.bonusPlayed = true;
              st.bonusRound = CONV.makeBonusRound();
            }
            st.last = null;
            drawPlay();
          } })
        ])
      ]);
    }
  }

  /* ==================================================================== */
  /* M12: 交流ノート・図鑑・思い出・旅立ち・次世代                           */
  /* ==================================================================== */

  function buildDepartureAction() {
    const db = globalThis.KE_DB.get();
    const pet = db.currentPet;
    const PET = globalThis.KE_PET;
    const today = U.todayStr();
    if (!pet || !PET.checkDepartureReady(pet, today, pet.petBond)) return null;
    return el("div", { class: "departure-area" }, [
      el("p", { class: "field-hint", text: "旅立ちの準備ができたようです…。思い出をつくって、新しい卵を迎えられます。" }),
      el("button", { type: "button", class: "btn btn--danger", text: "旅立ちの準備をする", onclick: function () {
        confirmDialog("旅立ちの確認", pet.name + " との思い出を残し、新しい卵を迎えます。よろしいですか？", function () {
          const r = PET.completeDeparture(db);
          if (!r.ok) { showErrorNotice(r.message || "旅立ちを実行できませんでした。"); return; }
          if (!globalThis.KE_DB.save()) showErrorNotice("保存に失敗しました。");
          else showNotice("思い出ができました。新しい世代を迎えましょう。");
          renderNextGenerationScreen();
        }, "旅立たせる");
      } })
    ]);
  }

  /** 次世代：新しい卵の名前と決定方式を決める */
  function renderNextGenerationScreen() {
    const root = refs.appRoot;
    clear(root);
    const db = globalThis.KE_DB.get();
    const PET = globalThis.KE_PET;
    const SPR = globalThis.KE_SPRITE;
    const name = el("input", { type: "text", maxlength: "12", placeholder: "新しいペットの名前" });
    const err = el("p", { class: "field-error" });
    const modeState = { value: "choose" };
    const radios = Object.keys({ choose: "自分で選ぶ", random: "おまかせ" }).map(function (k) {
      const inp = el("input", { type: "radio", name: "gen_mode", value: k, checked: k === modeState.value, onchange: function () { modeState.value = k; } });
      return el("label", { class: "radio-row" }, [inp, el("span", { class: "radio-label", text: k === "choose" ? "自分で選ぶ（孵化時に6種類から）" : "おまかせ（孵化時にランダム決定）" })]);
    });
    const panel = el("section", { class: "panel", "aria-labelledby": "nextGenTitle" }, [
      el("h1", { id: "nextGenTitle", text: "新しい世代を迎えます" }),
      el("p", { class: "field-hint", text: "前の世代は思い出になりました。新しい卵の名前と、種類の決め方を設定しましょう。種類はまだ決まりません。" }),
      el("div", { class: "pet-stage" }, [SPR.canvasTag(SPR.renderEgg(5), "新しい卵", "sprite-canvas")]),
      el("div", { class: "field" }, [el("label", { for: "next_name", text: "新しいペットの名前" }), name]),
      el("div", { class: "radio-group" }, radios),
      err,
      el("div", { class: "form-actions" }, [
        el("button", { type: "button", class: "btn btn--ghost", text: "思い出を見る", onclick: renderMemoriesScreen }),
        el("button", { type: "button", class: "btn btn--confirm", text: "新しい卵をはじめよう", onclick: function () {
          const petName = String(name.value || "").trim();
          if (!petName) { err.textContent = "ペットの名前を入力してください。"; return; }
          if (petName.length > 12) { err.textContent = "ペットの名前は12文字以内で入力してください。"; return; }
          const r = PET.startNextGeneration(db, petName, modeState.value);
          if (!r.ok) { err.textContent = r.message || "次世代を始められませんでした。"; return; }
          if (!globalThis.KE_DB.save()) showErrorNotice("保存に失敗しました。");
          showNotice("新しい卵をお迎えしました！");
          if (globalThis.KE_APP) globalThis.KE_APP.navigate("pet");
        } })
      ])
    ]);
    root.append(panel);
  }

  /** 交流ノート（NPC一覧＋詳細） */
  function renderNotebookScreen() {
    const root = refs.appRoot;
    clear(root);
    const db = globalThis.KE_DB.get();
    const REL = globalThis.KE_RELATIONSHIP;
    const SPR = globalThis.KE_SPRITE;
    const npcs = globalThis.KE_NPCS || [];
    const panel = el("section", { class: "panel", "aria-labelledby": "bookTitle" }, [
      el("h1", { id: "bookTitle", text: "交流ノート（住民手帳）" }),
      el("p", { class: "field-hint", text: "村のNPCとの関係を確認できます。出会った人は顔と情報が載ります。" })
    ]);
    const grid = el("div", { class: "species-grid" });
    npcs.forEach(function (npc) {
      const met = REL.isNpcDiscovered(db, npc.id);
      const state = met ? REL.getNpcState(db, npc.id) : null;
      const cardBody = met ? [
        SPR.canvasTag(SPR.renderSilhouette("#5a554e", 4), npc.displayName, "sprite-canvas"),
        el("span", { class: "species-name", text: npc.displayName }),
        el("span", { class: "species-coach", text: npc.role }),
        el("span", { class: "field-hint", text: "きずな度 " + state.bond + "（" + REL.getNpcBondLevelLabel(db, npc.id) + "）" }),
        el("span", { class: "field-hint", text: "会話 " + (state.conversations || 0) + " 回／最終 " + (state.lastTalkedAt || "なし") })
      ] : [
        SPR.canvasTag(SPR.renderSilhouette("#5a554e", 4), "未遭遇の住人", "sprite-canvas"),
        el("span", { class: "species-name", text: "？？？" }),
        el("span", { class: "field-hint", text: "まだ出会っていません" })
      ];
      grid.append(el("button", { type: "button", class: "species-card", onclick: function () {
        if (met) renderNpcDetailModal(npc); else showNotice("まだ出会っていないため、詳しい情報は分かりません。");
      } }, cardBody));
    });
    panel.append(grid);
    root.append(panel);
  }

  function renderNpcDetailModal(npc) {
    const REL = globalThis.KE_RELATIONSHIP;
    const db = globalThis.KE_DB.get();
    const state = REL.getNpcState(db, npc.id);
    const level = REL.getNpcBondLevelLabel(db, npc.id);
    const overlay = el("div", { class: "overlay", role: "dialog", "aria-modal": "true", "aria-label": npc.displayName });
    overlay.append(el("div", { class: "dialog dialog--wide" }, [
      el("h2", { class: "dialog-title", text: npc.displayName + "（" + npc.role + "）" }),
      el("p", { text: "自己紹介：" + npc.intro }),
      el("p", { class: "field-hint", text: "出会った場所：" + npc.metPlace }),
      el("div", { class: "stat-row" }, [
        statBox("きずな度", String(state.bond)),
        statBox("関係段階", level || "—"),
        statBox("会話回数", String(state.conversations || 0)),
        statBox("最終会話日", state.lastTalkedAt || "—")
      ]),
      el("p", { class: "field-hint", text: "次の会話のヒント：" + npc.nextHint }),
      el("div", { class: "form-actions" }, [
        el("button", { type: "button", class: "btn btn--ghost", text: "会話クエストへ", onclick: function () {
          overlay.remove();
          if (globalThis.KE_APP) globalThis.KE_APP.navigate("quest");
        } }),
        el("button", { type: "button", class: "btn btn--primary", text: "閉じる", onclick: function () { overlay.remove(); } })
      ])
    ]));
    overlay.addEventListener("keydown", function (ev) { if (ev.key === "Escape") overlay.remove(); });
    refs.modalRoot.append(overlay);
  }

  /** ペット図鑑 */
  function renderEncyclopediaScreen() {
    const root = refs.appRoot;
    clear(root);
    const db = globalThis.KE_DB.get();
    const PET = globalThis.KE_PET;
    const SPR = globalThis.KE_SPRITE;
    const species = globalThis.KE_PETS || [];
    const panel = el("section", { class: "panel", "aria-labelledby": "encyTitle" }, [
      el("h1", { id: "encyTitle", text: "村の生き物図鑑" }),
      el("p", { class: "field-hint", text: "種類が決まったペットだけが図鑑に登録されます。初めて見つけた日を記録します。" })
    ]);
    const grid = el("div", { class: "species-grid" });
    species.forEach(function (sp) {
      const found = db.petEncyclopedia && db.petEncyclopedia[sp.id] && db.petEncyclopedia[sp.id].discovered;
      const body = found ? [
        SPR.canvasTag(SPR.renderPet(sp.color, 4), sp.name, "sprite-canvas"),
        el("span", { class: "species-name", text: sp.name }),
        el("span", { class: "species-coach", text: sp.coachTypeLabel }),
        el("span", { class: "field-hint", text: "発見：" + (db.petEncyclopedia[sp.id].discoveredAt || "—") })
      ] : [
        SPR.canvasTag(SPR.renderSilhouette(sp.color, 4), "未発見の生き物", "sprite-canvas"),
        el("span", { class: "species-name", text: "？？？" }),
        el("span", { class: "field-hint", text: "まだ図鑑に載っていません" })
      ];
      grid.append(el("div", { class: "species-card", "aria-hidden": !found }, body));
    });
    panel.append(grid);
    root.append(panel);
  }

  /** 思い出（世代のアルバム） */
  function renderMemoriesScreen() {
    const root = refs.appRoot;
    clear(root);
    const db = globalThis.KE_DB.get();
    const PET = globalThis.KE_PET;
    const memories = (db.petMemories || []).slice().reverse();
    const panel = el("section", { class: "panel", "aria-labelledby": "memTitle" }, [
      el("h1", { id: "memTitle", text: "思い出（古いアルバム）" }),
      el("p", { class: "field-hint", text: "旅立ったペットたちの記録です。" })
    ]);
    if (memories.length === 0) {
      panel.append(el("p", { class: "lead", text: "まだ思い出はありません。ペットとの時間を重ねると、ここに記録が残ります。" }));
    }
    memories.forEach(function (m) {
      const sp = m.speciesId ? PET.getSpeciesById(m.speciesId) : null;
      const mainNpc = m.mainNpcId ? (globalThis.KE_NPCS || []).find(function (n) { return n.id === m.mainNpcId; }) : null;
      panel.append(el("article", { class: "card memory-card" }, [
        el("h2", { text: m.name + (sp ? "（" + sp.name + "）" : "（種類不明）") + "　" + m.generationId }),
        el("ul", { class: "list" }, [
          el("li", { text: "誕生：" + m.birthDate + " ／ 孵化：" + (m.hatchedAt || "—") + " ／ 旅立ち：" + m.departedAt }),
          el("li", { text: "一緒に過ごした日数：" + m.daysTogether + "日 ／ 最終成長段階：" + PET.getStageLabel(m.finalStage) }),
          el("li", { text: "健康記録日数：" + m.healthRecordDays + "日 ／ 会話クエスト完了日数：" + m.questDays + "日" }),
          el("li", { text: "最終きずな度：" + m.finalBond + (mainNpc ? " ／ よく話したNPC：" + mainNpc.displayName : "") })
        ])
      ]));
    });
    root.append(panel);
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
    confirmDialog: confirmDialog,
    validateProfileFields: validateProfileFields,
    validateStepFields: validateStepFields,
    renderSetup: renderSetup,
    renderHome: renderHome,
    renderPlaceholder: renderPlaceholder,
    renderRecordScreen: renderRecordScreen,
    renderPetScreen: renderPetScreen,
    renderQuestScreen: renderQuestScreen,
    renderPracticeScreen: renderPracticeScreen,
    renderNotebookScreen: renderNotebookScreen,
    renderEncyclopediaScreen: renderEncyclopediaScreen,
    renderMemoriesScreen: renderMemoriesScreen,
    renderNextGenerationScreen: renderNextGenerationScreen,
    install: install
  };

  if (globalThis) globalThis.KE_UI = KE_UI;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_UI: KE_UI };
})();
