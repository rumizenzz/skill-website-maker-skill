import {
  Captions,
  FastForward,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Rewind,
  SkipForward,
  Volume2,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { pilotV1 } from "../show/pilotMeta";
import type { PilotScript, Stage3DApi } from "../show/Stage3D";
import { Stage3D } from "../show/Stage3D";
import { cn } from "../utils/cn";
import i18n from "../i18n";
import { ShowcaseRail } from "./ShowcaseRail";

type Speed = 0.75 | 1 | 1.25 | 1.5 | 2;

function baseLang(): string {
  return (i18n.language || "en").split("-")[0] || "en";
}

function storageKey(suffix: string) {
  return `show.${pilotV1.id}.${suffix}`;
}

export function ShowcasePlayer() {
  const { t } = useTranslation();
  const reduceMotion = !!useReducedMotion();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const stageRef = useRef<Stage3DApi | null>(null);
  const audienceRef = useRef<{
    ctx: AudioContext;
    ambientSrc: AudioBufferSourceNode;
    ambientGain: GainNode;
    lp: BiquadFilterNode;
    lastLaughIdx: number;
  } | null>(null);
  const laughIdxRef = useRef<number>(0);
  const offlinePrefetchRef = useRef<Promise<void> | null>(null);

  const [script, setScript] = useState<PilotScript | null>(null);
  const [scriptError, setScriptError] = useState<string | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [offlineState, setOfflineState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(() => localStorage.getItem(storageKey("cc")) === "1");
  const [captionLang, setCaptionLang] = useState<string>(() => localStorage.getItem(storageKey("ccLang")) || baseLang());
  const [cueText, setCueText] = useState("");

  const [speed, setSpeed] = useState<Speed>(() => {
    const raw = Number(localStorage.getItem(storageKey("speed")) || "1");
    if (raw === 0.75 || raw === 1 || raw === 1.25 || raw === 1.5 || raw === 2) return raw;
    return 1;
  });

  const [volume, setVolume] = useState<number>(() => {
    const raw = Number(localStorage.getItem(storageKey("vol")) || "0.9");
    if (!Number.isFinite(raw)) return 0.9;
    return Math.min(1, Math.max(0, raw));
  });

  const [audienceMode, setAudienceMode] = useState<boolean>(() => localStorage.getItem(storageKey("audience")) === "1");
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  const savedTime = useMemo(() => {
    const raw = Number(localStorage.getItem(storageKey("time")) || "0");
    if (!Number.isFinite(raw) || raw < 5) return 0;
    return raw;
  }, []);
  const [showResume, setShowResume] = useState<boolean>(savedTime > 0);

  const introEndSec = script?.introEndSec ?? 32;

  const laughs = useMemo(() => {
    const list =
      script?.events
        ?.filter((e) => e.type === "laugh")
        .map((e) => e as Extract<PilotScript["events"][number], { type: "laugh" }>) ?? [];
    return list.slice().sort((a, b) => a.atSec - b.atSec);
  }, [script]);

  useEffect(() => {
    return () => {
      const aud = audienceRef.current;
      if (!aud) return;
      try {
        aud.ambientSrc.stop();
      } catch {
        // ignore
      }
      try {
        void aud.ctx.close();
      } catch {
        // ignore
      }
      audienceRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(pilotV1.scriptSrc);
        if (!res.ok) throw new Error(`Failed to load script (${res.status})`);
        const json = (await res.json()) as PilotScript;
        if (!cancelled) setScript(json);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load script";
        if (!cancelled) setScriptError(msg);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.playbackRate = speed;
  }, [speed, volume]);

  useEffect(() => {
    const onFs = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Keep active speaker and saved time in sync while playing.
  useEffect(() => {
    if (!playing) return;
    const v = videoRef.current;
    if (!v) return;

    let lastSaveAt = 0;
    let raf = 0;

    const lines =
      script?.events?.filter((e) => e.type === "line").map((e) => e as Extract<PilotScript["events"][number], { type: "line" }>) ?? [];

    // Re-sync laugh cursor when (re)starting playback.
    laughIdxRef.current = laughs.findIndex((l) => l.atSec > (v.currentTime || 0));
    if (laughIdxRef.current < 0) laughIdxRef.current = laughs.length;

    const tick = () => {
      const tNow = v.currentTime || 0;
      if (lines.length) {
        const line = lines.find((l) => l.fromSec <= tNow && tNow <= l.toSec);
        setActiveSpeaker(line?.speaker || null);
      } else {
        setActiveSpeaker(null);
      }

      // Audience "laugh track" (subtle, synthesized). Only after user interaction.
      if (audienceMode) {
        const aud = audienceRef.current;
        if (aud) {
          // Keep ambience quiet; never autoplay (context created only on click).
          const targetVol = playing ? 0.025 : 0.0;
          aud.ambientGain.gain.value = reduceMotion ? targetVol * 0.6 : targetVol;

          while (laughIdxRef.current < laughs.length && laughs[laughIdxRef.current].atSec <= tNow) {
            const intensity = Math.min(1, Math.max(0, laughs[laughIdxRef.current].intensity || 0.6));
            // Generate a short, filtered noise burst with a pulsing envelope to suggest crowd laughter.
            try {
              const ctx = aud.ctx;
              const dur = 0.55 + intensity * 0.25;
              const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
              const buf = ctx.createBuffer(1, len, ctx.sampleRate);
              const data = buf.getChannelData(0);
              const baseFreq = 900 + Math.random() * 400;

              // Envelope: exponential decay + rhythmic pulses.
              for (let i = 0; i < len; i++) {
                const tt = i / ctx.sampleRate;
                const decay = Math.exp(-tt * 3.2);
                const pulse = 0.65 + 0.35 * Math.sin(tt * Math.PI * 10 + (i % 17));
                data[i] = (Math.random() * 2 - 1) * decay * pulse * 0.6;
              }

              const src = ctx.createBufferSource();
              src.buffer = buf;

              const bp = ctx.createBiquadFilter();
              bp.type = "bandpass";
              bp.frequency.value = baseFreq;
              bp.Q.value = 0.9;

              const g = ctx.createGain();
              g.gain.value = (0.02 + intensity * 0.03) * (reduceMotion ? 0.7 : 1);

              src.connect(bp);
              bp.connect(g);
              g.connect(ctx.destination);

              src.start();
              src.stop(ctx.currentTime + dur + 0.05);
            } catch {
              // ignore
            }
            laughIdxRef.current += 1;
          }
        }
      }

      if (tNow - lastSaveAt >= 5) {
        localStorage.setItem(storageKey("time"), String(tNow));
        lastSaveAt = tNow;
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [audienceMode, laughs, playing, reduceMotion, script]);

  // Captions: use video textTracks in hidden mode and render cues ourselves.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tracks = Array.from(v.textTracks || []);
    for (const tr of tracks) tr.mode = "disabled";

    const selected = tracks.find((tr) => (tr.language || "").toLowerCase() === captionLang.toLowerCase());
    if (!captionsEnabled || !selected) {
      setCueText("");
      return;
    }

    selected.mode = "hidden";

    const onCueChange = () => {
      // TextTrackCueList isn't a real array.
      const cues = selected.activeCues ? Array.from(selected.activeCues as unknown as Array<{ text?: string }>) : [];
      const text = cues
        .map((c) => (typeof c.text === "string" ? c.text : ""))
        .filter(Boolean)
        .join("\n");
      setCueText(text);
    };

    selected.oncuechange = onCueChange;
    onCueChange();

    return () => {
      if (selected.oncuechange === onCueChange) selected.oncuechange = null;
    };
  }, [captionLang, captionsEnabled, ready, playing]);

  const ensureMedia = () => {
    const v = videoRef.current;
    if (!v) return;
    const hasSrc = !!v.getAttribute("src");
    if (!hasSrc) {
      v.setAttribute("src", pilotV1.audioSrc);
      v.load();
    }
    setReady(true);
  };

  const prefetchOffline = async () => {
    if (!("caches" in window)) return;
    try {
      setOfflineState((s) => (s === "saved" ? s : "saving"));
      const cache = await caches.open("swm-site:show:v1");
      const urls = [pilotV1.audioSrc, pilotV1.posterSrc, pilotV1.scriptSrc, ...pilotV1.captions.map((c) => c.src)];
      for (const url of urls) {
        const key = new Request(url, { method: "GET" });
        const existing = await cache.match(key);
        if (existing) continue;
        const res = await fetch(url);
        if (res && res.ok) await cache.put(key, res.clone());
      }
      try {
        // Best-effort: ask the browser to persist storage so offline assets are less likely to be evicted.
        await navigator.storage?.persist?.();
      } catch {
        // ignore
      }
      setOfflineState("saved");
    } catch {
      setOfflineState("error");
    }
  };

  const ensureOfflinePrefetch = () => {
    if (offlinePrefetchRef.current) return;
    offlinePrefetchRef.current = prefetchOffline().finally(() => {
      offlinePrefetchRef.current = null;
    });
  };

  const ensureAudienceAudio = () => {
    if (audienceRef.current) return;
    const Ctx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    try {
      const ctx = new Ctx();

      // Low-mix ambience: low-passed noise as "room tone".
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.12;
      }
      const ambientSrc = ctx.createBufferSource();
      ambientSrc.buffer = buf;
      ambientSrc.loop = true;

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 650;
      lp.Q.value = 0.7;

      const ambientGain = ctx.createGain();
      ambientGain.gain.value = 0.0;

      ambientSrc.connect(lp);
      lp.connect(ambientGain);
      ambientGain.connect(ctx.destination);
      ambientSrc.start();

      audienceRef.current = { ctx, ambientSrc, ambientGain, lp, lastLaughIdx: 0 };
      void ctx.resume();
    } catch {
      // ignore: best effort
    }
  };

  const play = async (opts?: { from?: number }) => {
    const v = videoRef.current;
    if (!v) return;
    ensureMedia();
    try {
      stageRef.current?.enableAudioAnalysis();
    } catch {
      // ignore: audio analysis is best-effort
    }
    if (audienceMode) {
      // Safe: called only after user interaction (Play click).
      ensureAudienceAudio();
    }
    // Best-effort: cache large show assets after the first user interaction so rewatching is instant.
    ensureOfflinePrefetch();
    if (typeof opts?.from === "number") {
      v.currentTime = Math.max(0, opts.from);
    }
    await v.play();
    setPlaying(true);
    setShowResume(false);
  };

  const pause = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
  };

  const togglePlay = async () => {
    if (playing) {
      pause();
      return;
    }
    const from = showResume ? savedTime : undefined;
    await play({ from });
  };

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    ensureMedia();
    v.currentTime = Math.max(0, (v.currentTime || 0) + delta);
  };

  const skipIntro = () => {
    const v = videoRef.current;
    if (!v) return;
    ensureMedia();
    v.currentTime = Math.max(0, introEndSec);
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const toggleCaptions = () => {
    setCaptionsEnabled((v) => {
      const next = !v;
      localStorage.setItem(storageKey("cc"), next ? "1" : "0");
      return next;
    });
  };

  const updateCaptionLang = (lang: string) => {
    setCaptionLang(lang);
    localStorage.setItem(storageKey("ccLang"), lang);
  };

  const updateSpeed = (s: Speed) => {
    setSpeed(s);
    localStorage.setItem(storageKey("speed"), String(s));
    const v = videoRef.current;
    if (v) v.playbackRate = s;
  };

  const updateVolume = (v: number) => {
    const next = Math.min(1, Math.max(0, v));
    setVolume(next);
    localStorage.setItem(storageKey("vol"), String(next));
    const el = videoRef.current;
    if (el) el.volume = next;
  };

  const toggleAudienceMode = () => {
    setAudienceMode((v) => {
      const next = !v;
      localStorage.setItem(storageKey("audience"), next ? "1" : "0");
      if (next) {
        // Safe: called from a user click.
        ensureAudienceAudio();
      } else {
        const aud = audienceRef.current;
        if (aud) aud.ambientGain.gain.value = 0.0;
      }
      return next;
    });
  };

  const onKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      await togglePlay();
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      seekBy(-10);
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      seekBy(10);
      return;
    }
    if (e.key.toLowerCase() === "c") {
      e.preventDefault();
      toggleCaptions();
      return;
    }
    if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      await toggleFullscreen();
    }
  };

  // If current UI language has captions, default to it. Otherwise English.
  useEffect(() => {
    const lang = baseLang();
    const has = pilotV1.captions.some((c) => c.lang === lang);
    if (!localStorage.getItem(storageKey("ccLang"))) {
      setCaptionLang(has ? lang : "en");
    }
  }, []);

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <div className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          {t("show.title")}
        </div>
        <div className="text-sm swm-muted max-w-2xl">{t("show.subtitle")}</div>
      </div>

      <ShowcaseRail activeId={pilotV1.id} />

      <div
        ref={containerRef}
        className={cn(
          "swm-card rounded-3xl p-4 md:p-5",
          "outline-none focus-visible:ring-2 focus-visible:ring-white/25",
        )}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60">
          <div className="absolute inset-0">
            <img
              src={pilotV1.posterSrc}
              alt={t("show.episode_title")}
              className={cn(
                "h-full w-full object-cover opacity-70",
                reduceMotion ? "" : "scale-[1.02]",
              )}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15" />
          </div>

          <Stage3D
            ref={stageRef}
            video={videoEl}
            script={script}
            reduceMotion={reduceMotion}
            audienceMode={audienceMode}
            activeSpeaker={activeSpeaker}
            className="absolute inset-0 h-full w-full"
          />

          {/* Hidden media element (audio-first) */}
          <video
            ref={(el) => {
              videoRef.current = el;
              setVideoEl(el);
            }}
            preload="none"
            playsInline
            crossOrigin="anonymous"
            className="absolute -left-[9999px] -top-[9999px] h-0 w-0 opacity-0"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          >
            {pilotV1.captions.map((c) => (
              <track key={c.lang} kind="subtitles" srcLang={c.lang} label={c.label} src={c.src} />
            ))}
          </video>

          <div className="relative p-5 md:p-7">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs swm-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                  {t("show.episode_meta")}
                </div>
                <div className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {t("show.episode_title")}
                </div>
                {scriptError ? <div className="text-xs text-amber-200/80">{scriptError}</div> : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                    "bg-white/10 hover:bg-white/15 transition-colors",
                  )}
                  onClick={() => skipIntro()}
                  aria-label={t("show.controls.skip_intro")}
                >
                  <SkipForward className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                    "bg-white/10 hover:bg-white/15 transition-colors",
                  )}
                  onClick={() => seekBy(-10)}
                  aria-label={t("show.controls.rewind_10")}
                >
                  <Rewind className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                    "bg-white/10 hover:bg-white/15 transition-colors",
                  )}
                  onClick={() => seekBy(10)}
                  aria-label={t("show.controls.forward_10")}
                >
                  <FastForward className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                    "bg-emerald-300/15 hover:bg-emerald-300/20 border-emerald-300/25 transition-colors",
                  )}
                  onClick={() => void togglePlay()}
                  aria-label={playing ? t("actions.pause") : t("actions.play")}
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {showResume ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/55 p-4">
                <div className="text-sm font-semibold">{t("show.controls.continue_title")}</div>
                <div className="mt-1 text-xs swm-muted">{t("show.controls.continue_body")}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                      "bg-white/10 hover:bg-white/15 transition-colors",
                    )}
                    onClick={() => {
                      const v = videoRef.current;
                      if (!v) return;
                      ensureMedia();
                      v.currentTime = 0;
                      localStorage.setItem(storageKey("time"), "0");
                      setShowResume(false);
                    }}
                  >
                    {t("show.controls.start_over")}
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                      "bg-emerald-300/15 hover:bg-emerald-300/20 border-emerald-300/25 transition-colors",
                    )}
                    onClick={() => void play({ from: savedTime })}
                  >
                    {t("show.controls.resume")}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Captions overlay */}
            {captionsEnabled && cueText ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-24 md:bottom-20 flex justify-center px-4">
                <div className="max-w-3xl rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-center text-sm md:text-base leading-relaxed">
                  {cueText}
                </div>
              </div>
            ) : null}

            {/* Control bar */}
            <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                    "bg-white/10 hover:bg-white/15 transition-colors",
                  )}
                  onClick={toggleCaptions}
                >
                  <Captions className="h-4 w-4" />
                  {t("show.controls.captions")}
                </button>

                <select
                  className={cn(
                    "h-9 rounded-xl px-3 text-sm",
                    "bg-white/5 border border-white/10 text-white/90",
                    "focus:outline-none focus:ring-2 focus:ring-white/25",
                  )}
                  value={captionLang}
                  onChange={(e) => updateCaptionLang(e.target.value)}
                  aria-label={t("show.controls.captions")}
                >
                  {pilotV1.captions.map((c) => (
                    <option key={c.lang} value={c.lang}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                    audienceMode ? "bg-emerald-300/15 border-emerald-300/25" : "bg-white/10",
                    "hover:bg-white/15 transition-colors",
                  )}
                  onClick={toggleAudienceMode}
                >
                  {t("show.controls.audience_mode")}
                </button>

                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                    offlineState === "saved" ? "bg-emerald-300/15 border-emerald-300/25" : "bg-white/10",
                    offlineState === "saving" ? "opacity-80 cursor-wait" : "hover:bg-white/15",
                    "transition-colors",
                  )}
                  onClick={() => ensureOfflinePrefetch()}
                  disabled={offlineState === "saving" || offlineState === "saved"}
                >
                  {offlineState === "saving"
                    ? t("show.controls.saving_offline")
                    : offlineState === "saved"
                      ? t("show.controls.saved_offline")
                      : offlineState === "error"
                        ? t("show.controls.save_offline_retry")
                        : t("show.controls.save_offline")}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm swm-muted">
                  <span className="inline-flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-white/70" />
                    {t("show.controls.volume")}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={volume}
                    onChange={(e) => updateVolume(Number(e.target.value))}
                  />
                </label>

                <label className="inline-flex items-center gap-2 text-sm swm-muted">
                  <span>{t("show.controls.speed")}</span>
                  <select
                    className={cn(
                      "h-9 rounded-xl px-3 text-sm",
                      "bg-white/5 border border-white/10 text-white/90",
                      "focus:outline-none focus:ring-2 focus:ring-white/25",
                    )}
                    value={speed}
                    onChange={(e) => updateSpeed(Number(e.target.value) as Speed)}
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </label>

                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold border border-white/10",
                    "bg-white/10 hover:bg-white/15 transition-colors",
                  )}
                  onClick={() => void toggleFullscreen()}
                >
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  {fullscreen ? t("show.controls.exit_fullscreen") : t("show.controls.fullscreen")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs swm-muted">{t("show.note")}</div>
      </div>
    </div>
  );
}
