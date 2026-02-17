import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "framer-motion";

import type { Os } from "../types";
import { siteConfig } from "../siteConfig";
import { cn } from "../utils/cn";

type Step = { text: string; delayMs: number };

type ScenarioKey =
  | "success"
  | "codex_missing"
  | "not_initialized"
  | "custom_codex_home"
  | "up_to_date"
  | "update_available"
  | "force_reinstall"
  | "keep_backup";

function cmd(os: Os, origin: string, extraEnv?: string): string {
  if (os === "mac") {
    const base = `curl -fsSL ${origin}/install.sh | bash`;
    return extraEnv ? `${extraEnv} ${base}` : base;
  }
  const base = `iwr -useb ${origin}/install.ps1 | iex`;
  return extraEnv ? `${extraEnv}; ${base}` : base;
}

function defaultCodexHome(os: Os): string {
  if (os === "windows") return "C:\\\\Users\\\\You\\\\.codex";
  return "$HOME/.codex";
}

function stepsForScenario(os: Os, origin: string, scenario: ScenarioKey): Step[] {
  const header = `${siteConfig.skillDisplayName} Skill Installer`;
  const codexHome = defaultCodexHome(os);

  const line = (text: string, delayMs = 80): Step => ({ text, delayMs });
  const prompt = os === "windows" ? "PS> " : "$ ";

  const commonStart: Step[] = [
    line(`${prompt}${cmd(os, origin)}`, 140),
    line(header, 160),
    line(`CODEX_HOME: ${codexHome}`, 120),
  ];

  if (scenario === "codex_missing") {
    return [
      ...commonStart,
      line("Error: Codex is not installed or not initialized on this machine.", 220),
      line(`Reason: missing directory: ${codexHome}`, 120),
      line("1) Install Codex (IDE extension on Windows/macOS, or Codex app on macOS)", 120),
      line("2) Sign in", 90),
      line("3) Run Codex once (so it creates your Codex folder)", 90),
      line("4) Re-run this command", 90),
      line("If you use a custom Codex folder, set CODEX_HOME and try again.", 120),
      line(`CODEX_HOME: ${codexHome}`, 90),
    ];
  }

  if (scenario === "not_initialized") {
    return [
      ...commonStart,
      line("Error: Codex is not installed or not initialized on this machine.", 220),
      line(`Reason: missing file: ${codexHome}/auth.json`, 120),
      line("1) Install Codex (IDE extension on Windows/macOS, or Codex app on macOS)", 120),
      line("2) Sign in", 90),
      line("3) Run Codex once (so it creates your Codex folder)", 90),
      line("4) Re-run this command", 90),
      line("If you use a custom Codex folder, set CODEX_HOME and try again.", 120),
      line(`CODEX_HOME: ${codexHome}`, 90),
    ];
  }

  if (scenario === "custom_codex_home") {
    const custom = os === "windows" ? "D:\\\\Codex" : "$HOME/dev/codex";
    const extra = os === "windows" ? `$env:CODEX_HOME="${custom}"` : `CODEX_HOME="${custom}"`;
    return [
      line(`${prompt}${cmd(os, origin, extra)}`, 140),
      line(header, 160),
      line(`CODEX_HOME: ${custom}`, 120),
      line("Checking latest version...", 180),
      line(`Installing ${siteConfig.skillSlug} v1.0.0`, 160),
      line("Downloading...", 220),
      line("Extracting...", 140),
      line("Installing...", 140),
      line(`Installed ${siteConfig.skillSlug} v1.0.0`, 160),
      line("Restart Codex to pick up new skills", 110),
      line(`Then run: /${siteConfig.skillSlug}`, 110),
    ];
  }

  if (scenario === "up_to_date") {
    return [
      ...commonStart,
      line("Checking latest version...", 180),
      line(
        `Already installed and up to date: ${siteConfig.skillSlug} v1.1.0 at ${codexHome}/skills/${siteConfig.skillSlug}`,
        220,
      ),
    ];
  }

  if (scenario === "force_reinstall") {
    const extra = os === "windows" ? "$env:FORCE=1" : "FORCE=1";
    return [
      line(`${prompt}${cmd(os, origin, extra)}`, 140),
      line(header, 160),
      line(`CODEX_HOME: ${codexHome}`, 120),
      line("Checking latest version...", 180),
      line(`Updating ${siteConfig.skillSlug}: v1.1.0 -> v1.1.0`, 180),
      line("Downloading...", 220),
      line("Extracting...", 140),
      line("Installing...", 140),
      line(`Installed ${siteConfig.skillSlug} v1.1.0`, 160),
      line("Restart Codex to pick up new skills", 110),
      line(`Then run: /${siteConfig.skillSlug}`, 110),
    ];
  }

  if (scenario === "keep_backup") {
    const extra = os === "windows" ? "$env:KEEP_BACKUP=1" : "KEEP_BACKUP=1";
    return [
      line(`${prompt}${cmd(os, origin, extra)}`, 140),
      line(header, 160),
      line(`CODEX_HOME: ${codexHome}`, 120),
      line("Checking latest version...", 180),
      line(`Updating ${siteConfig.skillSlug}: v1.0.0 -> v1.1.0`, 180),
      line("Downloading...", 220),
      line("Extracting...", 140),
      line("Installing...", 140),
      line(`Installed ${siteConfig.skillSlug} v1.1.0`, 160),
      line("Restart Codex to pick up new skills", 110),
      line(`Then run: /${siteConfig.skillSlug}`, 110),
      line("KEEP_BACKUP=1: kept backup folder (bak-*)", 120),
    ];
  }

  if (scenario === "update_available") {
    return [
      ...commonStart,
      line("Checking latest version...", 180),
      line(`Updating ${siteConfig.skillSlug}: v1.0.0 -> v1.1.0`, 180),
      line("Downloading...", 220),
      line("Extracting...", 140),
      line("Installing...", 140),
      line(`Installed ${siteConfig.skillSlug} v1.1.0`, 160),
      line("Restart Codex to pick up new skills", 110),
      line(`Then run: /${siteConfig.skillSlug}`, 110),
    ];
  }

  return [
    ...commonStart,
    line("Checking latest version...", 180),
    line(`Installing ${siteConfig.skillSlug} v1.0.0`, 160),
    line("Downloading...", 220),
    line("Extracting...", 140),
    line("Installing...", 140),
    line(`Installed ${siteConfig.skillSlug} v1.0.0`, 160),
    line("Restart Codex to pick up new skills", 110),
    line(`Then run: /${siteConfig.skillSlug}`, 110),
  ];
}

export function TerminalDemo(props: { os: Os }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const origin = useMemo(() => window.location.origin, []);

  const scenarios: { key: ScenarioKey; label: string }[] = [
    { key: "success", label: t("demo.scenarios.success") },
    { key: "codex_missing", label: t("demo.scenarios.codex_missing") },
    { key: "not_initialized", label: t("demo.scenarios.not_initialized") },
    { key: "custom_codex_home", label: t("demo.scenarios.custom_codex_home") },
    { key: "up_to_date", label: t("demo.scenarios.up_to_date") },
    { key: "update_available", label: t("demo.scenarios.update_available") },
    { key: "force_reinstall", label: t("demo.scenarios.force_reinstall") },
    { key: "keep_backup", label: t("demo.scenarios.keep_backup") },
  ];

  const [scenario, setScenario] = useState<ScenarioKey>("success");
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const outRef = useRef<HTMLDivElement | null>(null);

  const steps = useMemo(() => stepsForScenario(props.os, origin, scenario), [origin, props.os, scenario]);
  const done = index >= steps.length;

  useEffect(() => {
    setPlaying(false);
    setIndex(0);
    setLines([]);
  }, [scenario, props.os]);

  useEffect(() => {
    if (!playing) return;
    if (done) {
      setPlaying(false);
      return;
    }

    const step = steps[index];
    const id = window.setTimeout(() => {
      setLines((prev) => [...prev, step.text]);
      setIndex((v) => v + 1);
    }, reduceMotion ? 0 : step.delayMs);
    return () => window.clearTimeout(id);
  }, [done, index, playing, reduceMotion, steps]);

  useEffect(() => {
    const el = outRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  const playLabel = playing ? t("actions.pause") : t("actions.play");

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2">
          <div className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {t("demo.title")}
          </div>
          <div className="text-sm swm-muted max-w-2xl">{t("demo.subtitle")}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
              "bg-white/10 hover:bg-white/15 transition-colors",
            )}
            onClick={() => {
              setLines([]);
              setIndex(0);
              setPlaying(false);
            }}
          >
            {t("actions.restart")}
          </button>
          <button
            type="button"
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
              "bg-emerald-300/15 hover:bg-emerald-300/20 border-emerald-300/25 transition-colors",
            )}
            onClick={() => {
              if (done) {
                setLines([]);
                setIndex(0);
                setPlaying(true);
                return;
              }
              setPlaying((v) => !v);
            }}
          >
            {playLabel}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.key}
            type="button"
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
              "transition-colors",
              s.key === scenario ? "bg-white/15" : "bg-white/5 hover:bg-white/10",
            )}
            onClick={() => setScenario(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="swm-card rounded-3xl p-4 md:p-5">
        <div className="text-xs swm-muted">Output</div>
        <div
          ref={outRef}
          className="mt-3 h-72 overflow-auto rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-sm whitespace-pre-wrap"
          aria-live="polite"
        >
          {lines.join("\n")}
          {playing && !done ? (
            <span className={cn("inline-block w-2", reduceMotion ? "" : "animate-pulse")}>|</span>
          ) : null}
        </div>

        <div className="mt-3 text-xs swm-muted">
          Scenarios are a front-end simulation. Real output comes from <code>/install.sh</code> and <code>/install.ps1</code>.
        </div>
      </div>
    </div>
  );
}
