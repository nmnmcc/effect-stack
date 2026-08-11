import { resolveSupportedLocale, translate } from "./localization";

describe("localization", () => {
  it("selects Simplified Chinese without treating Traditional Chinese as Simplified", () => {
    expect(resolveSupportedLocale([{ languageCode: "zh", languageTag: "zh-Hans-CN", regionCode: "CN" }])).toBe(
      "zh-Hans",
    );
    expect(resolveSupportedLocale([{ languageCode: "zh", languageTag: "zh-Hant-TW", regionCode: "TW" }])).toBe("en");
  });

  it("checks later preferences before falling back to English", () => {
    expect(
      resolveSupportedLocale([
        { languageCode: "fr", languageTag: "fr-FR", regionCode: "FR" },
        { languageCode: "zh", languageTag: "zh-SG", regionCode: "SG" },
      ]),
    ).toBe("zh-Hans");
  });

  it("provides English and Simplified Chinese resources", () => {
    expect(translate("en", "todo.add")).toBe("Add todo");
    expect(translate("zh-Hans", "todo.add")).toBe("添加待办");
  });
});
