import { createContext, createElement, useContext, type ReactNode } from "react";

const english = {
  "app.description": "A server-rendered todo application built with Effect and React Router.",
  "app.errorDetails": "The application could not complete this request.",
  "app.errorTitle": "Something went wrong",
  "app.goHome": "Go home",
  "app.loading": "Loading…",
  "app.notFound": "This page does not exist.",
  "app.notFoundTitle": "Page not found",
  "app.retry": "Retry",
  "app.title": "effect-stack",
  "auth.createAccount": "Create account",
  "auth.account": "Account",
  "auth.email": "Email",
  "auth.emailInvalid": "Enter a valid email address.",
  "auth.hasAccount": "Already have an account?",
  "auth.name": "Name",
  "auth.nameRequired": "Enter your name.",
  "auth.noAccount": "Need an account?",
  "auth.password": "Password",
  "auth.passwordTooShort": "Use at least 8 characters.",
  "auth.rejected": "Those details could not be accepted. Check them and try again.",
  "auth.requestFailed": "Authentication is unavailable. Check your connection and try again.",
  "auth.retrySignOut": "Retry sign out",
  "auth.signIn": "Sign in",
  "auth.signInHelp": "Use your email and password to continue.",
  "auth.signOut": "Sign out",
  "auth.signUp": "Sign up",
  "auth.signUpHelp": "Create an account to add and manage your own todos.",
  "todo.add": "Add todo",
  "todo.completed": "Completed",
  "todo.createFailed": "The todo was not added. Your text is still here so you can retry.",
  "todo.delete": "Delete",
  "todo.empty": "No todos yet.",
  "todo.loadFailed": "Todos could not be loaded.",
  "todo.manageHint": "Sign in to create and manage your own todos.",
  "todo.mutationFailed": "That change did not complete. Refresh and try again.",
  "todo.newPlaceholder": "What needs to be done?",
  "todo.readOnly": "Created by another user",
  "todo.refreshing": "Refreshing…",
  "todo.title": "Todos",
  "todo.toggle": "Toggle",
};

export type TranslationKey = keyof typeof english;
export type SupportedLocale = "en" | "zh-Hans";

const simplifiedChinese = {
  "app.description": "使用 Effect 与 React Router 构建的服务端渲染待办应用。",
  "app.errorDetails": "应用无法完成此请求。",
  "app.errorTitle": "发生错误",
  "app.goHome": "返回首页",
  "app.loading": "正在加载…",
  "app.notFound": "此页面不存在。",
  "app.notFoundTitle": "页面不存在",
  "app.retry": "重试",
  "app.title": "effect-stack",
  "auth.createAccount": "创建账户",
  "auth.account": "账户",
  "auth.email": "邮箱",
  "auth.emailInvalid": "请输入有效的邮箱地址。",
  "auth.hasAccount": "已有账户？",
  "auth.name": "姓名",
  "auth.nameRequired": "请输入姓名。",
  "auth.noAccount": "还没有账户？",
  "auth.password": "密码",
  "auth.passwordTooShort": "密码至少需要 8 个字符。",
  "auth.rejected": "无法接受这些账户信息，请检查后重试。",
  "auth.requestFailed": "认证服务暂不可用，请检查网络后重试。",
  "auth.retrySignOut": "重试退出",
  "auth.signIn": "登录",
  "auth.signInHelp": "使用邮箱和密码继续。",
  "auth.signOut": "退出登录",
  "auth.signUp": "注册",
  "auth.signUpHelp": "创建账户后即可添加和管理自己的待办事项。",
  "todo.add": "添加待办",
  "todo.completed": "已完成",
  "todo.createFailed": "待办未能添加，输入内容已保留，可以直接重试。",
  "todo.delete": "删除",
  "todo.empty": "还没有待办事项。",
  "todo.loadFailed": "无法加载待办事项。",
  "todo.manageHint": "登录后可以创建并管理自己的待办事项。",
  "todo.mutationFailed": "操作未完成，请刷新后重试。",
  "todo.newPlaceholder": "接下来要做什么？",
  "todo.readOnly": "由其他用户创建",
  "todo.refreshing": "正在刷新…",
  "todo.title": "待办事项",
  "todo.toggle": "切换状态",
} satisfies Record<TranslationKey, string>;

const translations = {
  en: english,
  "zh-Hans": simplifiedChinese,
} satisfies Record<SupportedLocale, Record<TranslationKey, string>>;

const simplifiedRegions = new Set(["CN", "MY", "SG"]);
const traditionalRegions = new Set(["HK", "MO", "TW"]);

export const resolveSupportedLocale = (languageTags: readonly string[]): SupportedLocale => {
  for (const rawLanguageTag of languageTags) {
    const languageTag = rawLanguageTag.trim().toLowerCase();
    if (languageTag.startsWith("en")) return "en";
    if (!languageTag.startsWith("zh")) continue;

    const parts = languageTag.split("-");
    const region = parts.find((part) => part.length === 2)?.toUpperCase();
    const isTraditional = languageTag.includes("-hant") || traditionalRegions.has(region ?? "");
    const isSimplified = languageTag.includes("-hans") || simplifiedRegions.has(region ?? "") || !isTraditional;

    if (isSimplified) return "zh-Hans";
  }

  return "en";
};

export const localeFromRequest = (request: Request) =>
  resolveSupportedLocale(
    (request.headers.get("accept-language") ?? "")
      .split(",")
      .map((entry) => entry.split(";", 1)[0] ?? "")
      .filter((entry) => entry.length > 0),
  );

export const translate = (locale: SupportedLocale, key: TranslationKey) => translations[locale][key];

const LocalizationContext = createContext<SupportedLocale>("en");

export function LocalizationProvider({
  children,
  locale,
}: {
  readonly children: ReactNode;
  readonly locale: SupportedLocale;
}) {
  return createElement(LocalizationContext, { value: locale }, children);
}

export const useTranslation = () => {
  const locale = useContext(LocalizationContext);
  return { locale, t: (key: TranslationKey) => translate(locale, key) };
};
