import { useTranslation } from "react-i18next";

import { pilotV1 } from "../show/pilotMeta";
import { cn } from "../utils/cn";

export function ShowcaseRail(props: { className?: string; activeId?: string; onSelect?: (id: string) => void }) {
  const { t } = useTranslation();

  const active = props.activeId ?? pilotV1.id;

  return (
    <div className={cn("swm-card rounded-3xl p-4 md:p-5", props.className)}>
      <div className="text-xs swm-muted">{t("nav.watch")}</div>
      <div className="mt-3 flex gap-3 overflow-auto pb-1">
        <button
          type="button"
          className={cn(
            "min-w-[260px] md:min-w-[320px] text-left rounded-2xl border border-white/10 overflow-hidden",
            "bg-black/40 hover:bg-black/55 transition-colors",
            active === pilotV1.id ? "ring-2 ring-emerald-300/25" : "",
          )}
          onClick={() => props.onSelect?.(pilotV1.id)}
        >
          <div className="h-28 md:h-32 bg-[linear-gradient(135deg,rgba(0,255,198,0.16),rgba(76,140,255,0.12),rgba(255,178,85,0.10))] border-b border-white/10" />
          <div className="p-4">
            <div className="text-sm font-semibold">{t("show.episode_title")}</div>
            <div className="mt-1 text-xs swm-muted">{t("show.episode_meta")}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
