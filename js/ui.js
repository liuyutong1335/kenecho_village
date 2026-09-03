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
      searchText: ""
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
        el("div", { class: "tab-panel", role: "tabpanel" }, buildTabContent())
      ]);
    }

    function buildTabContent() {
      if (state.tab === "meal") return [buildMealTab()];
      const msgs = {
        exercise: "運動の記録は次のマイルストーン（M4）で実装されます。",
        sleep: "睡眠の記録は次のマイルストーン（M4）で実装されます。",
        weight: "体重の記録は次のマイルストーン（M4）で実装されます。"
      };
      return [el("div", { class: "card" }, el("p", { class: "lead", text: msgs[state.tab] }))];
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

    draw();
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
    install: install
  };

  if (globalThis) globalThis.KE_UI = KE_UI;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_UI: KE_UI };
})();
