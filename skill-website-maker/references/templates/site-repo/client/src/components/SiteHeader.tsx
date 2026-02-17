import { useReducedMotion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import { siteConfig, siteUrls } from "../siteConfig";
import { cn } from "../utils/cn";
import { LanguageSelector } from "./LanguageSelector";

function scrollToId(id: string, reduceMotion: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export function SiteHeader() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2",
            "hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/25",
          )}
          onClick={() => scrollToId("top", !!reduceMotion)}
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400/30 to-blue-400/30 border border-white/10" />
          <div className="text-left leading-tight">
            <div className="font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              {siteConfig.skillDisplayName}
            </div>
            <div className="text-xs swm-muted">{t("site.tagline")}</div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => scrollToId("what", !!reduceMotion)}
          >
            {t("nav.what")}
          </button>
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => scrollToId("quickstart", !!reduceMotion)}
          >
            {t("nav.quickstart")}
          </button>
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => scrollToId("show", !!reduceMotion)}
          >
            {t("nav.watch")}
          </button>
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => scrollToId("demo", !!reduceMotion)}
          >
            {t("nav.demo")}
          </button>
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => scrollToId("faq", !!reduceMotion)}
          >
            {t("nav.faq")}
          </button>
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => scrollToId("documentation", !!reduceMotion)}
          >
            {t("nav.documentation")}
          </button>
          <button
            type="button"
            className="rounded-xl px-3 py-2 text-sm hover:bg-white/5"
            onClick={() => scrollToId("changelog", !!reduceMotion)}
          >
            {t("nav.changelog")}
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <a
            className={cn(
              "hidden sm:inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold",
              "bg-white/10 hover:bg-white/15 border border-white/10",
              "transition-colors",
            )}
            href={siteUrls.skillRepo}
            target="_blank"
            rel="noreferrer"
          >
            {t("nav.github")}
            <ExternalLink className="h-4 w-4" />
          </a>
          <LanguageSelector className="hidden sm:inline-flex" />
        </div>
      </div>
    </header>
  );
}
