import { Bug, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Streamdown } from "streamdown";

import { siteUrls } from "../siteConfig";
import { cn } from "../utils/cn";

export function Changelog() {
  const { t } = useTranslation();
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/changelog.md");
        if (!res.ok) throw new Error(`Failed to load changelog (${res.status})`);
        const text = await res.text();
        if (!cancelled) setMarkdown(text);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load changelog";
        if (!cancelled) setError(msg);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-3">
          <div className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {t("changelog.title")}
          </div>
          <div className="text-sm swm-muted max-w-2xl">{t("changelog.subtitle")}</div>
        </div>

        <div className="flex items-center gap-2">
          <a
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
              "bg-white/10 hover:bg-white/15 border border-white/10 transition-colors",
            )}
            href={siteUrls.releases}
            target="_blank"
            rel="noreferrer"
          >
            {t("changelog.view_github")}
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
              "bg-white/10 hover:bg-white/15 border border-white/10 transition-colors",
            )}
            href={siteUrls.issues}
            target="_blank"
            rel="noreferrer"
          >
            {t("changelog.report_issue")}
            <Bug className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="swm-card rounded-3xl p-6 md:p-8" aria-busy={markdown === null && error === null ? "true" : "false"}>
        {markdown === null && error === null ? (
          <div className="space-y-3">
            <div className="h-5 w-56 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-4 w-full rounded-lg bg-white/5 animate-pulse" />
            <div className="h-4 w-5/6 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-4 w-4/6 rounded-lg bg-white/5 animate-pulse" />
          </div>
        ) : error ? (
          <div className="space-y-3">
            <div className="text-lg font-semibold">{t("changelog.error_title")}</div>
            <div className="text-sm swm-muted">{error}</div>
            <div className="pt-2">
              <a
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
                  "bg-emerald-300/15 hover:bg-emerald-300/20 border border-emerald-300/25 transition-colors",
                )}
                href={siteUrls.releases}
                target="_blank"
                rel="noreferrer"
              >
                {t("changelog.error_cta")}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="[&_.streamdown]:max-w-none">
            <Streamdown>{markdown ?? ""}</Streamdown>
          </div>
        )}
      </div>
    </div>
  );
}
