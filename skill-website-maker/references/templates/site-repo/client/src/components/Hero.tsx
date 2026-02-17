import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import { siteConfig, siteUrls } from "../siteConfig";
import { cn } from "../utils/cn";

function scrollToId(id: string, reduceMotion: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export function Hero() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:pt-20 md:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <motion.div
          className="lg:col-span-7 space-y-6"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs swm-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
            {t("hero.bullets.one_liner")}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {siteConfig.skillDisplayName}
          </h1>
          <p className="text-lg md:text-xl swm-muted leading-relaxed max-w-2xl">{t("hero.subtitle")}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
                "bg-emerald-300/15 hover:bg-emerald-300/20 border border-emerald-300/25",
                "transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300/25",
              )}
              onClick={() => scrollToId("quickstart", !!reduceMotion)}
            >
              {t("actions.install")}
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
                "bg-white/10 hover:bg-white/15 border border-white/10",
                "transition-colors focus:outline-none focus:ring-2 focus:ring-white/25",
              )}
              onClick={() => scrollToId("documentation", !!reduceMotion)}
            >
              {t("actions.view_docs")}
            </button>
            <a
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold",
                "bg-white/0 hover:bg-white/5 border border-white/10",
                "transition-colors focus:outline-none focus:ring-2 focus:ring-white/25",
              )}
              href={siteUrls.releases}
              target="_blank"
              rel="noreferrer"
            >
              {t("hero.ctas.releases")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="swm-card rounded-2xl p-4">
              <div className="text-sm font-semibold">{t("hero.cards.hard_gate_title")}</div>
              <div className="text-sm swm-muted mt-1">{t("hero.bullets.hard_gate")}</div>
            </div>
            <div className="swm-card rounded-2xl p-4">
              <div className="text-sm font-semibold">{t("hero.cards.updates_title")}</div>
              <div className="text-sm swm-muted mt-1">{t("hero.bullets.updates")}</div>
            </div>
            <div className="swm-card rounded-2xl p-4">
              <div className="text-sm font-semibold">{t("hero.cards.simple_title")}</div>
              <div className="text-sm swm-muted mt-1">{t("hero.cards.simple_body")}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="swm-card rounded-3xl p-5 md:p-6">
            <div className="text-sm swm-muted">{t("hero.how.title")}</div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-300/80" />
                <div>{t("hero.how.steps.one")}</div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-300/80" />
                <div>{t("hero.how.steps.two")}</div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-amber-300/80" />
                <div>{t("hero.how.steps.three")}</div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-white/60" />
                <div>{t("hero.how.steps.four")}</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="text-xs swm-muted">{t("hero.how.next_title")}</div>
              <div className="mt-2 text-sm">{t("hero.how.next_body")}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
