import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { siteConfig } from "../siteConfig";
import type { Os } from "../types";
import { cn } from "../utils/cn";
import { CopyButton } from "./CopyButton";

function getOrigin(): string {
  return window.location.origin;
}

function cmdFor(os: Os, origin: string): string {
  return os === "mac"
    ? `curl -fsSL ${origin}/install.sh | bash`
    : `iwr -useb ${origin}/install.ps1 | iex`;
}

function advancedCmdFor(os: Os, origin: string): string {
  return os === "mac"
    ? `CODEX_HOME=\"$HOME/.codex\" curl -fsSL ${origin}/install.sh | bash`
    : `$env:CODEX_HOME=\"$env:USERPROFILE\\\\.codex\"; iwr -useb ${origin}/install.ps1 | iex`;
}

export function Quickstart(props: { os: Os; setOs: (os: Os) => void }) {
  const { t } = useTranslation();
  const origin = useMemo(() => getOrigin(), []);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const cmd = cmdFor(props.os, origin);
  const adv = advancedCmdFor(props.os, origin);

  return (
    <div className="space-y-6">
      <div className="swm-card rounded-3xl p-5 md:p-6">
        <div className="text-sm swm-muted">{t("quickstart.requires")}</div>

        <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-xl transition-colors",
                props.os === "mac" ? "bg-white/15" : "hover:bg-white/10",
              )}
              onClick={() => props.setOs("mac")}
            >
              {t("quickstart.os.mac")}
            </button>
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-xl transition-colors",
                props.os === "windows" ? "bg-white/15" : "hover:bg-white/10",
              )}
              onClick={() => props.setOs("windows")}
            >
              {t("quickstart.os.windows")}
            </button>
          </div>

          <div className="text-sm swm-muted">{t("quickstart.update_note")}</div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/50 p-4">
          <div className="flex items-start justify-between gap-3">
            <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              <code>{cmd}</code>
            </pre>
            <CopyButton text={cmd} />
          </div>
        </div>

        <button
          type="button"
          className={cn(
            "mt-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
            "bg-white/0 hover:bg-white/5 border border-white/10",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-white/25",
          )}
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced ? "true" : "false"}
        >
          {t("quickstart.advanced")}
          <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced ? "rotate-180" : "rotate-0")} />
        </button>

        {showAdvanced ? (
          <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                <code>{adv}</code>
              </pre>
              <CopyButton text={adv} />
            </div>
          </div>
        ) : null}
      </div>

      <div className="swm-card rounded-3xl p-5 md:p-6">
        <div className="text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          {t("quickstart.after_install.title")}
        </div>
        <ul className="mt-4 space-y-2 text-sm swm-muted">
          <li>{t("quickstart.after_install.one")}</li>
          <li>{t("quickstart.after_install.two").replace("__SKILL_SLUG__", siteConfig.skillSlug)}</li>
        </ul>
      </div>
    </div>
  );
}
