import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";

export type Language = {
  code: string;
  label: string;
  dir: "ltr" | "rtl";
  enabled: boolean;
};

const STORAGE_KEY = "language";

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", dir: "ltr", enabled: true },
  { code: "es", label: "Espanol", dir: "ltr", enabled: false },
  { code: "fr", label: "Francais", dir: "ltr", enabled: false },
  { code: "de", label: "Deutsch", dir: "ltr", enabled: false },
  { code: "pt", label: "Portugues", dir: "ltr", enabled: false },
  { code: "ja", label: "Japanese", dir: "ltr", enabled: false },
  { code: "ko", label: "Korean", dir: "ltr", enabled: false },
  { code: "zh", label: "Chinese", dir: "ltr", enabled: false },
  { code: "ar", label: "Arabic", dir: "rtl", enabled: false },
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
  resources: { en: { translation: en } },
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

