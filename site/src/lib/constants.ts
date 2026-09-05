export const langOptions = [
  { label: "Auto", value: "auto" },
  { label: "العربية", value: "ar" },
  { label: "العربية (مصر)", value: "ar-EG" },
  { label: "Deutsch", value: "de" },
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "فارسی", value: "fa" },
  { label: "Français", value: "fr" },
  { label: "Bahasa Indonesia", value: "id" },
  { label: "Italiano", value: "it" },
  { label: "日本語", value: "ja" },
  { label: "한국어", value: "ko" },
  { label: "Nederlands", value: "nl" },
  { label: "Polski", value: "pl" },
  { label: "Português", value: "pt" },
  { label: "Português (Brasil)", value: "pt-BR" },
  { label: "Русский", value: "ru" },
  { label: "tlhIngan Hol", value: "tlh" },
  { label: "Türkçe", value: "tr" },
  { label: "українська", value: "uk" },
  { label: "українська (Україна)", value: "uk-UA" },
  { label: "中文", value: "zh" },
  { label: "中文（简体）", value: "zh-CN" },
  { label: "繁體中文", value: "zh-TW" }
] as const;

export const themeOptions = [
  { label: "Auto", value: "auto" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" }
] as const;

export const sizeOptions = [
  { label: "Normal", value: "normal" },
  { label: "Compact", value: "compact" },
  { label: "Flexible", value: "flexible" },
  { label: "Invisible", value: "invisible" }
] as const;

export const siteKeyOptions = [
  { label: "Always pass", value: "pass" },
  { label: "Always fail", value: "fail" },
  { label: "Always pass (invisible)", value: "passInvisible" },
  { label: "Always fail (invisible)", value: "failInvisible" },
  { label: "Force interactive challenge", value: "interactive" },
  { label: "Empty site key", value: "empty" }
] as const;

export const secretOptions = [
  { label: "Always pass", value: "pass" },
  { label: "Always fail", value: "fail" },
  { label: '"Token already spent" error', value: "spent" }
] as const;

export enum DEMO_SITEKEY {
  pass = "1x00000000000000000000AA",
  fail = "2x00000000000000000000AB",
  /** Invisible-type key: the widget never shows, the challenge still runs. */
  passInvisible = "1x00000000000000000000BB",
  failInvisible = "2x00000000000000000000BB",
  interactive = "3x00000000000000000000FF",
  /** Rejected by `turnstile.render` before the widget is created, so the failure
   * surfaces as a thrown validation message instead of an error code. */
  empty = ""
}

export enum DEMO_SECRET {
  pass = "1x0000000000000000000000000000000AA",
  fail = "2x0000000000000000000000000000000AA",
  spent = "3x0000000000000000000000000000000AA"
}

export const executionOptions = [
  { label: "On render (default)", value: "render" },
  { label: "On execute()", value: "execute" }
] as const;

export const appearanceOptions = [
  { label: "Always (default)", value: "always" },
  { label: "On execute()", value: "execute" },
  { label: "On interaction only", value: "interaction-only" }
] as const;

export const refreshExpiredOptions = [
  { label: "Auto (default)", value: "auto" },
  { label: "Manual", value: "manual" },
  { label: "Never", value: "never" }
] as const;

export const navGroups = [
  {
    title: null,
    pages: [{ title: "Playground", href: "/" }]
  },
  {
    title: "Examples",
    pages: [
      { title: "Multiple widgets", href: "/examples/multiple-widgets" },
      { title: "Script loading", href: "/examples/script-loading" }
    ]
  }
];
