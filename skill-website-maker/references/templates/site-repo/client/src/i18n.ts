import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { ar } from "./locales/ar";
import { de } from "./locales/de";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { ja } from "./locales/ja";
import { ko } from "./locales/ko";
import { pt } from "./locales/pt";
import { zh } from "./locales/zh";

export type Language = {
  code: string;
  label: string;
  dir: "ltr" | "rtl";
  enabled: boolean;
};

const STORAGE_KEY = "language";

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", dir: "ltr", enabled: true },
  { code: "es", label: "Español", dir: "ltr", enabled: true },
  { code: "fr", label: "Français", dir: "ltr", enabled: true },
  { code: "de", label: "Deutsch", dir: "ltr", enabled: true },
  { code: "pt", label: "Português", dir: "ltr", enabled: true },
  { code: "ja", label: "日本語", dir: "ltr", enabled: true },
  { code: "ko", label: "한국어", dir: "ltr", enabled: true },
  { code: "zh", label: "中文", dir: "ltr", enabled: true },
  { code: "ar", label: "العربية", dir: "rtl", enabled: true },
];

function getLanguageMeta(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

function normalizeLang(maybe: string | null | undefined): string {
  const code = (maybe || "").trim().toLowerCase();
  if (!code) return "en";
  const base = code.split("-")[0] || "en";
  return base;
}

function getInitialLanguage(): string {
  const saved = normalizeLang(localStorage.getItem(STORAGE_KEY));
  if (getLanguageMeta(saved)?.enabled) return saved;
  const detected = normalizeLang(navigator.language);
  if (getLanguageMeta(detected)?.enabled) return detected;
  return "en";
}

function applyDocumentLang(code: string) {
  const meta = getLanguageMeta(code) || getLanguageMeta("en")!;
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    pt: { translation: pt },
    ja: { translation: ja },
    ko: { translation: ko },
    zh: { translation: zh },
    ar: { translation: ar },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

applyDocumentLang(i18n.language);

i18n.on("languageChanged", (lng) => {
  const normalized = normalizeLang(lng);
  applyDocumentLang(normalized);
  localStorage.setItem(STORAGE_KEY, normalized);
});

export default i18n;
