"use strict";
/*
 * kenecho Village - 起動とナビゲーション（KE_APP）
 * ロジック層の最後に読み込む。DB初期化 → 初期設定／ホーム判定 → 画面表示 → トップバー遷移。
 */
(function () {
  const U = globalThis.KE_UTIL;
  const C = globalThis.KE_CONFIG;
  const DB = globalThis.KE_DB;
  const UI = globalThis.KE_UI;
  const PET = globalThis.KE_PET;

  const BUILT_SCREENS = {
    home: true,
    record: true
    // pet / quest / notebook / memories / encyclopedia / settings は今後追加
  };

  const SCREEN_LABELS = {
    record: "記録",
    pet: "ペット",
    quest: "会話クエスト",
    notebook: "交流ノート",
    memories: "思い出",
    encyclopedia: "図鑑",
    settings: "設定"
  };

  /** 初期設定完了時の処理：プロフィールと第1世代卵を作成し保存する */
  function handleSetupComplete(values) {
    const db = DB.get();
    const generationId = "gen_001";
    const pet = PET.createEgg(generationId, values.petName, values.selectionMode);
    db.profile = {
      displayName: String(values.displayName).trim(),
      age: Number(values.age),
      gender: values.gender,
      heightCm: Number(values.heightCm),
      weightKg: Number(values.weightKg),
      profileId: U.generateId("p")
    };
    db.currentPet = pet;
    db.relationships.pet[generationId] = { bond: pet.petBond, questsCompleted: 0 };
    // 健康目標（初期設定で決めたタイプと各目標）を保存
    const gh = globalThis.KE_HEALTH.setHealthGoals(db, {
      goalType: values.goalType,
      calorieLimitKcal: values.calorieLimitKcal,
      proteinGoalG: values.proteinGoalG,
      exerciseMinutes: values.exerciseMinutes,
      sleepHours: values.sleepHours
    });
    if (!gh.ok) {
      UI.showErrorNotice("健康目標を保存できませんでした。もう一度お試しください。");
      return;
    }
    if (!DB.save()) {
      UI.showErrorNotice("初期設定を保存できませんでした。もう一度お試しください。");
      return;
    }
    UI.showNotice("初期設定が完了しました。ペットの卵をお預かりしました！");
    UI.showOnboarding(function () { navigate("home"); });
  }

  function navigate(target) {
    if (!DB.hasProfile() && target !== "settings") {
      // 未設定なら常に初期設定へ（設定以外）
      UI.renderSetup(handleSetupComplete);
      return;
    }
    if (target === "record") {
      UI.renderRecordScreen();
      return;
    }
    if (target === "pet") {
      UI.renderPetScreen();
      return;
    }
    if (target === "quest") {
      UI.renderQuestScreen();
      return;
    }
    if (target === "notebook") {
      UI.renderNotebookScreen();
      return;
    }
    if (target === "memories") {
      UI.renderMemoriesScreen();
      return;
    }
    if (target === "encyclopedia") {
      UI.renderEncyclopediaScreen();
      return;
    }
    if (target === "settings") {
      UI.renderSettingsScreen();
      return;
    }
    if (target === "home" || BUILT_SCREENS[target]) {
      UI.renderHome(DB.get());
      return;
    }
    UI.renderPlaceholder(SCREEN_LABELS[target] || target, "「" + (SCREEN_LABELS[target] || target) + "」は今後のマイルストーンで実装されます。");
  }

  function start() {
    const result = DB.load();
    if (result === "quarantined") {
      UI.showErrorNotice("保存データに異常があったため、安全な初期値で起動しました。");
    }
    UI.install(navigate);
    if (!DB.hasProfile()) {
      UI.renderSetup(handleSetupComplete);
    } else {
      const seenOnboarding = !!(DB.get().settings && DB.get().settings.onboardingDone);
      if (seenOnboarding) {
        UI.renderHome(DB.get());
      } else {
        UI.showOnboarding(function () { UI.renderHome(DB.get()); });
      }
    }
  }

  const KE_APP = {
    start: start,
    navigate: navigate,
    handleSetupComplete: handleSetupComplete
  };

  if (globalThis) globalThis.KE_APP = KE_APP;

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", start);
  }

  if (typeof module !== "undefined" && module.exports) module.exports = { KE_APP: KE_APP };
})();
