import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import i18n, { LANGUAGES } from "../i18n";
import { cn } from "../utils/cn";

export function LanguageSelector(props: { className?: string }) {
  const { t } = useTranslation();
  const current = useMemo(() => i18n.language.split("-")[0] || "en", []);

  return (
    <label className={cn("inline-flex items-center gap-2 text-sm", props.className)}>
      <span className="sr-only">{t("nav.language", { defaultValue: "Language" })}</span>
      <select
        className={cn(
          "h-9 rounded-xl px-3 text-sm",
          "bg-white/5 border border-white/10 text-white/90",
          "focus:outline-none focus:ring-2 focus:ring-white/25",
        )}
        defaultValue={current}
        onChange={(e) => {
          void i18n.changeLanguage(e.target.value);
        }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} disabled={!l.enabled}>
            {l.label}
            {!l.enabled ? " (Coming soon)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
