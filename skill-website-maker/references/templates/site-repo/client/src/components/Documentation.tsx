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
          <div className="mt-3 text-sm swm-muted">
            Go to <code>#quickstart</code>, copy the one-liner, and run it in your terminal.
          </div>
          <div className="mt-2 text-sm swm-muted">
            When it finishes: restart Codex and run <code>/{siteConfig.skillSlug}</code>.
          </div>
        </div>

        <div>
          <div className="text-xl font-semibold">{t("docs.sections.update")}</div>
          <div className="mt-3 text-sm swm-muted">
            Re-run the same one-liner any time. The installer reads <code>VERSION</code> from the public skill repo and upgrades if needed.
          </div>
          <div className="mt-2 text-sm swm-muted">
            If you want to repair a broken install, set <code>FORCE=1</code> and run it again. If you want to keep backups, set <code>KEEP_BACKUP=1</code>.
          </div>
        </div>

        <div>
          <div className="text-xl font-semibold">{t("docs.sections.troubleshoot")}</div>
          <div className="mt-3 text-sm swm-muted">{t("docs.troubleshoot.codex_not_detected")}</div>
        </div>
      </div>
    </div>
  );
}

