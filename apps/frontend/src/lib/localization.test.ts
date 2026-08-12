import { resolveSupportedLocale, translate } from "./localization";

describe("localization", () => {
  it("selects Simplified Chinese without treating Traditional Chinese as Simplified", () => {
    expect(resolveSupportedLocale(["zh-Hans-CN"])).toBe("zh-Hans");
    expect(resolveSupportedLocale(["zh-Hant-TW"])).toBe("en");
  });

  it("checks later preferences before falling back to English", () => {
    expect(resolveSupportedLocale(["fr-FR", "zh-SG"])).toBe("zh-Hans");
  });

  it("provides English and Simplified Chinese resources", () => {
    expect(translate("en", "todo.add")).toBe("Add todo");
    expect(translate("zh-Hans", "todo.add")).toBe("添加待办");
  });
});
