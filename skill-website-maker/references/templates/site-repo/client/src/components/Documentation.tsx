import { useTranslation } from "react-i18next";

import { siteConfig } from "../siteConfig";

export function Documentation() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          {t("docs.title")}
        </div>
        <div className="text-sm swm-muted max-w-2xl">{t("docs.subtitle")}</div>
      </div>

      <div className="swm-card rounded-3xl p-5 md:p-6 space-y-6">
        <div>
          <div className="text-xl font-semibold">{t("docs.sections.requirements")}</div>
          <ul className="mt-3 space-y-2 text-sm swm-muted">
            <li>{t("docs.reqs.one")}</li>
            <li>{t("docs.reqs.two")}</li>
            <li>{t("docs.reqs.three")}</li>
            <li>{t("docs.reqs.four")}</li>
          </ul>
        </div>

        <div>
          <div className="text-xl font-semibold">{t("docs.sections.install")}</div>
          <div className="mt-3 text-sm swm-muted">{t("docs.install.body1")}</div>
          <div className="mt-2 text-sm swm-muted">
            {t("docs.install.body2").replace("__SKILL_SLUG__", siteConfig.skillSlug)}
          </div>
        </div>

        <div>
          <div className="text-xl font-semibold">{t("docs.sections.update")}</div>
          <div className="mt-3 text-sm swm-muted">{t("docs.update.body1")}</div>
          <div className="mt-2 text-sm swm-muted">{t("docs.update.body2")}</div>
        </div>

        <div>
          <div className="text-xl font-semibold">{t("docs.sections.troubleshoot")}</div>
          <div className="mt-3 text-sm swm-muted">{t("docs.troubleshoot.codex_not_detected")}</div>
        </div>
      </div>
    </div>
  );
}
