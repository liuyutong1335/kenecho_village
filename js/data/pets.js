"use strict";
/*
 * kenecho Village - ペット種類定義（KE_PETS）
 * 6種類の架空ペット。名前・色・輪郭・性格・スプライトは本作品独自のデザイン。
 * フル定義（性格説明・コーチ台詞キー・ピクセル定義）は M6 / M14 で拡充する。
 *
 * PetSpecies: { id, name, coachType, coachTypeLabel, summary, color }
 */
(function () {
  const KE_PETS = [
    { id: "rabbit", name: "うさぎ", coachType: "gentle", coachTypeLabel: "優しい型", summary: "ゆっくり、やさしい言葉で教えてくれます", color: "#EFE1C6" },
    { id: "fox", name: "きつね", coachType: "calm", coachTypeLabel: "冷静型", summary: "落ち着いて、理由から説明してくれます", color: "#D9824B" },
    { id: "bearcub", name: "こぐま", coachType: "energetic", coachTypeLabel: "元気型", summary: "元気いっぱい背中を押してくれます", color: "#9A6642" },
    { id: "cat", name: "ねこ", coachType: "curious", coachTypeLabel: "好奇心型", summary: "新たな視点をどんどん示してくれます", color: "#A9A9A0" },
    { id: "bird", name: "ことり", coachType: "cautious", coachTypeLabel: "慎重型", summary: "ひとつずつ確かめるように助言します", color: "#7FA650" },
    { id: "tanuki", name: "たぬき", coachType: "playful", coachTypeLabel: "お調子者型", summary: "軽妙な言葉で会話を明るくします", color: "#C9965B" }
  ];

  if (globalThis) globalThis.KE_PETS = KE_PETS;
  if (typeof module !== "undefined" && module.exports) module.exports = { KE_PETS: KE_PETS };
})();
