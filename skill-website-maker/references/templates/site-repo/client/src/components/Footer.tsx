import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { siteUrls } from "../siteConfig";
import { cn } from "../utils/cn";

function scrollToId(id: string, reduceMotion: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export function Footer() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const link = (id: string, label: string) => (
    <button
      type="button"
      className={cn("text-sm swm-muted hover:text-white transition-colors")}
      onClick={() => scrollToId(id, !!reduceMotion)}
    >
      {label}
    </button>
  );

  return (
    <footer className="border-t border-white/10 bg-black/25">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-sm swm-muted">{t("footer.blurb")}</div>

        <div className="flex flex-wrap items-center gap-4">
          {link("what", t("nav.what"))}
          {link("quickstart", t("nav.quickstart"))}
          {link("show", t("nav.watch"))}
          {link("demo", t("nav.demo"))}
          {link("faq", t("nav.faq"))}
          {link("documentation", t("nav.documentation"))}
          {link("changelog", t("nav.changelog"))}
          <a className="text-sm swm-muted hover:text-white transition-colors" href={siteUrls.skillRepo} target="_blank" rel="noreferrer">
            {t("nav.github")}
          </a>
          <a className="text-sm swm-muted hover:text-white transition-colors" href={siteUrls.issues} target="_blank" rel="noreferrer">
            {t("nav.support")}
          </a>
        </div>
      </div>
    </footer>
  );
}
