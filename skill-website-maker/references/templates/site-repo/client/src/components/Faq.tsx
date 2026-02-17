import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "../utils/cn";

export function Faq() {
  const { t } = useTranslation();

  const items: { q: string; a: string }[] = [
    { q: t("faq.items.codex_skill.q"), a: t("faq.items.codex_skill.a") },
    { q: t("faq.items.generates.q"), a: t("faq.items.generates.a") },
    { q: t("faq.items.private_repo.q"), a: t("faq.items.private_repo.a") },
    { q: t("faq.items.installer_refuses.q"), a: t("faq.items.installer_refuses.a") },
    { q: t("faq.items.custom_codex_home.q"), a: t("faq.items.custom_codex_home.a") },
    { q: t("faq.items.updates.q"), a: t("faq.items.updates.a") },
    { q: t("faq.items.secrets.q"), a: t("faq.items.secrets.a") },
    { q: t("faq.items.failed_update.q"), a: t("faq.items.failed_update.a") },
    { q: t("faq.items.affiliated.q"), a: t("faq.items.affiliated.a") },
    { q: t("faq.items.voices.q"), a: t("faq.items.voices.a") },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          {t("faq.title")}
        </div>
        <div className="text-sm swm-muted max-w-2xl">{t("faq.subtitle")}</div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.q} className="group swm-card rounded-3xl p-5 md:p-6">
            <summary
              className={cn(
                "list-none cursor-pointer select-none",
                "flex items-start justify-between gap-4",
                "focus:outline-none",
              )}
            >
              <div className="text-base font-semibold leading-snug">{item.q}</div>
              <ChevronDown className="mt-0.5 h-5 w-5 text-white/70 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pt-4 text-sm swm-muted leading-relaxed">{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

