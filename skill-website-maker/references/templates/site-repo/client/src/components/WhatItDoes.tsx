import { useTranslation } from "react-i18next";

export function WhatItDoes() {
  const { t } = useTranslation();

  const cards: { title: string; body: string; accent: "emerald" | "blue" | "amber" | "violet" | "zinc" }[] = [
    { title: t("what.cards.skill_repo_title"), body: t("what.cards.skill_repo_body"), accent: "emerald" },
    { title: t("what.cards.site_repo_title"), body: t("what.cards.site_repo_body"), accent: "blue" },
    { title: t("what.cards.installers_title"), body: t("what.cards.installers_body"), accent: "amber" },
    { title: t("what.cards.updates_title"), body: t("what.cards.updates_body"), accent: "violet" },
    { title: t("what.cards.secrets_title"), body: t("what.cards.secrets_body"), accent: "zinc" },
  ];

  const dot = (accent: (typeof cards)[number]["accent"]) => {
    const cls =
      accent === "emerald"
        ? "bg-emerald-300/80"
        : accent === "blue"
          ? "bg-blue-300/80"
          : accent === "amber"
            ? "bg-amber-300/80"
            : accent === "violet"
              ? "bg-violet-300/80"
              : "bg-white/60";
    return <div className={`mt-1.5 h-2 w-2 rounded-full ${cls}`} />;
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          {t("what.title")}
        </div>
        <div className="text-sm swm-muted max-w-2xl">{t("what.subtitle")}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.title} className="swm-card rounded-3xl p-5 md:p-6">
            <div className="flex gap-3">
              {dot(c.accent)}
              <div>
                <div className="text-base font-semibold tracking-tight">{c.title}</div>
                <div className="mt-2 text-sm swm-muted leading-relaxed">{c.body}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

