#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


LANGS = ["en", "es", "fr", "de", "pt", "ja", "ko", "zh", "ar"]


def eprint(msg: str) -> None:
    print(msg, file=os.sys.stderr)


def fail(msg: str, code: int = 1) -> None:
    eprint(f"Error: {msg}")
    raise SystemExit(code)


def run(cmd: list[str]) -> None:
    cp = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if cp.returncode != 0:
        eprint(cp.stdout)
        eprint(cp.stderr)
        fail(f"command failed: {' '.join(cmd)}")


def format_ts(sec: float) -> str:
    if sec < 0:
        sec = 0.0
    ms = int(round(sec * 1000))
    hh = ms // 3_600_000
    mm = (ms % 3_600_000) // 60_000
    ss = (ms % 60_000) // 1000
    mmm = ms % 1000
    return f"{hh:02d}:{mm:02d}:{ss:02d}.{mmm:03d}"


def load_json(path: Path) -> dict[str, Any]:
    # Allow UTF-8 with BOM (PowerShell Set-Content -Encoding utf8 writes BOM on Windows PowerShell).
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def write_json(path: Path, obj: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def sha1_hex(s: str) -> str:
    return hashlib.sha1(s.encode("utf-8")).hexdigest()


def ffprobe_duration_sec(path: Path) -> float:
    cp = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if cp.returncode != 0:
        eprint(cp.stdout)
        eprint(cp.stderr)
        fail("ffprobe failed (install ffmpeg and ensure ffprobe is on PATH)")
    try:
        return float(cp.stdout.strip())
    except Exception:
        fail(f"could not parse ffprobe duration: {cp.stdout.strip()}")
    raise AssertionError("unreachable")


def atempo_chain(factor: float) -> list[float]:
    # ffmpeg atempo supports 0.5..2.0 per filter. Chain as needed.
    if factor <= 0:
        return [1.0]
    parts: list[float] = []
    f = factor
    while f > 2.0:
        parts.append(2.0)
        f /= 2.0
    while f < 0.5:
        parts.append(0.5)
        f /= 0.5
    parts.append(f)
    return parts


def elevenlabs_tts_mp3(api_key: str, voice_id: str, text: str, model_id: str, out_path: Path) -> None:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0,
            "use_speaker_boost": True,
        },
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("xi-api-key", api_key)
    req.add_header("accept", "audio/mpeg")
    req.add_header("content-type", "application/json")

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
    except urllib.error.HTTPError as e:
        try:
            details = e.read().decode("utf-8", errors="ignore")
        except Exception:
            details = ""
        fail(f"ElevenLabs HTTP {e.code}: {details}".strip())
    except Exception as e:
        fail(f"ElevenLabs request failed: {e}")

    if not data:
        fail("ElevenLabs returned empty audio")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(data)


def normalize_segment_to_wav(in_mp3: Path, out_wav: Path, desired_dur: float) -> None:
    actual = ffprobe_duration_sec(in_mp3)
    if desired_dur <= 0.05:
        desired_dur = max(0.05, actual)
    # atempo factor: speed multiplier. new_dur = actual / factor.
    factor = actual / desired_dur
    chain = atempo_chain(factor)
    filters = ",".join([f"atempo={c:.6f}" for c in chain])
    # Ensure exact duration with apad+atrim.
    filt = f"{filters},apad,atrim=duration={desired_dur:.6f}"
    run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(in_mp3),
            "-filter:a",
            filt,
            "-ar",
            "48000",
            "-ac",
            "2",
            str(out_wav),
        ]
    )


def make_silence_wav(out_wav: Path, dur: float) -> None:
    if dur <= 0.001:
        return
    run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=48000:cl=stereo",
            "-t",
            f"{dur:.6f}",
            str(out_wav),
        ]
    )


def render_stage_script(spec: dict[str, Any]) -> dict[str, Any]:
    cast = spec.get("cast") or []
    lines = spec.get("lines") or []
    stage_events = spec.get("stage_events") or []
    scenes_spec = spec.get("scenes") or []

    characters = []
    for c in cast:
        characters.append(
            {
                "id": c.get("id", ""),
                "displayName": c.get("display_name", ""),
                "color": c.get("color", "#ffffff"),
            }
        )

    events: list[dict[str, Any]] = []
    for line in lines:
        events.append(
            {
                "type": "line",
                "fromSec": float(line["from_sec"]),
                "toSec": float(line["to_sec"]),
                "speaker": line.get("speaker", ""),
                "text": line.get("text", ""),
            }
        )
    for e in stage_events:
        if e.get("type") == "gesture":
            events.append(
                {
                    "type": "gesture",
                    "atSec": float(e["at_sec"]),
                    "target": e.get("target", ""),
                    "kind": e.get("kind", "nod"),
                }
            )
        elif e.get("type") == "laugh":
            events.append(
                {
                    "type": "laugh",
                    "atSec": float(e["at_sec"]),
                    "intensity": float(e.get("intensity", 0.6)),
                }
            )

    # Sort events for consumers.
    def key(ev: dict[str, Any]) -> float:
        if ev.get("type") == "line":
            return float(ev.get("fromSec") or 0.0)
        return float(ev.get("atSec") or 0.0)

    events.sort(key=key)

    intro_end = float(spec.get("intro_end_sec") or 0.0)
    max_to = max([float(l["to_sec"]) for l in lines], default=0.0)
    max_scene_to = 0.0

    scenes: list[dict[str, Any]] = []
    if isinstance(scenes_spec, list) and scenes_spec:
        for s in scenes_spec:
            if not isinstance(s, dict):
                continue
            from_sec = float(s.get("from_sec") or 0.0)
            to_sec = float(s.get("to_sec") or 0.0)
            if to_sec <= from_sec:
                continue
            scenes.append(
                {
                    "id": str(s.get("id") or "stage"),
                    "fromSec": from_sec,
                    "toSec": to_sec,
                    "camera": str(s.get("camera") or "wide"),
                }
            )
            max_scene_to = max(max_scene_to, to_sec)

    # Keep a 22m container for the stage until maintainers regenerate a full episode.
    stage_to = max(1320.0, max_to + 1.0, intro_end + 1.0, max_scene_to + 1.0)

    if not scenes:
        scenes = [{"id": "stage", "fromSec": 0.0, "toSec": stage_to, "camera": "wide"}]
    else:
        scenes.sort(key=lambda s: float(s.get("fromSec") or 0.0))
        # Ensure coverage from 0..stage_to (best effort).
        if float(scenes[0].get("fromSec") or 0.0) > 0.0:
            scenes.insert(0, {"id": "stage", "fromSec": 0.0, "toSec": float(scenes[0]["fromSec"]), "camera": "wide"})
        if float(scenes[-1].get("toSec") or 0.0) < stage_to:
            scenes[-1]["toSec"] = stage_to

    return {
        "version": str(spec.get("id") or "pilot-v1"),
        "introEndSec": intro_end,
        "characters": characters,
        "scenes": scenes,
        "events": events,
    }


def write_captions(spec: dict[str, Any], captions_dir: Path) -> None:
    captions_dir.mkdir(parents=True, exist_ok=True)
    lines = spec.get("lines") or []
    for lang in LANGS:
        out_path = captions_dir / f"{lang}.vtt"
        buf: list[str] = ["WEBVTT", ""]
        for line in lines:
            from_sec = float(line["from_sec"])
            to_sec = float(line["to_sec"])
            en_text = str(line.get("text") or "").strip()
            tr = line.get("t") if isinstance(line.get("t"), dict) else {}
            text = en_text if lang == "en" else str(tr.get(lang) or en_text).strip()
            if not text:
                continue
            buf.append(f"{format_ts(from_sec)} --> {format_ts(to_sec)}")
            buf.append(text)
            buf.append("")
        write_text(out_path, "\n".join(buf).rstrip() + "\n")
        print(f"Wrote: {out_path}")


def generate_audio(spec: dict[str, Any], out_mp3: Path, cache_dir: Path, force: bool, keep_backup: bool) -> None:
    api_key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not api_key:
        fail("ELEVENLABS_API_KEY is not set. Rotate your key if it was pasted into chat, then set it in your shell env.")

    model_id = os.environ.get("ELEVENLABS_MODEL_ID", "").strip() or "eleven_multilingual_v2"

    voice_by_speaker = {
        "host": os.environ.get("ELEVENLABS_VOICE_ID_HOST", "").strip(),
        "friend1": os.environ.get("ELEVENLABS_VOICE_ID_FRIEND1", "").strip(),
        "friend2": os.environ.get("ELEVENLABS_VOICE_ID_FRIEND2", "").strip(),
        "ops": os.environ.get("ELEVENLABS_VOICE_ID_OPS", "").strip(),
    }

    missing = [k for k, v in voice_by_speaker.items() if not v]
    if missing:
        fail(
            "missing ElevenLabs voice IDs. Set env vars:\n"
            "  ELEVENLABS_VOICE_ID_HOST\n"
            "  ELEVENLABS_VOICE_ID_FRIEND1\n"
            "  ELEVENLABS_VOICE_ID_FRIEND2\n"
            "  ELEVENLABS_VOICE_ID_OPS"
        )

    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        fail("ffmpeg/ffprobe not found. Install ffmpeg and ensure ffmpeg + ffprobe are on PATH.")

    lines = spec.get("lines") or []
    if not lines:
        fail("spec has no lines[]")

    cache_dir.mkdir(parents=True, exist_ok=True)

    # Back up existing audio.
    bak_path: Path | None = None
    if out_mp3.exists():
        stamp = time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())
        bak_path = out_mp3.with_name(out_mp3.name + f".bak-{stamp}")
        shutil.copy2(out_mp3, bak_path)

    with tempfile.TemporaryDirectory(prefix="pilot_audio_") as td:
        tmp_dir = Path(td)
        wav_dir = tmp_dir / "wav"
        wav_dir.mkdir(parents=True, exist_ok=True)

        # Build a timeline of wav segments (silence + normalized line audio).
        files: list[Path] = []

        # Ensure sorted by from_sec.
        lines_sorted = sorted(lines, key=lambda l: float(l.get("from_sec") or 0.0))

        # Initial silence.
        first_from = float(lines_sorted[0]["from_sec"])
        if first_from > 0:
            s0 = wav_dir / "0000_silence.wav"
            make_silence_wav(s0, first_from)
            files.append(s0)

        for i, line in enumerate(lines_sorted):
            speaker = str(line.get("speaker") or "")
            text = str(line.get("text") or "")
            from_sec = float(line["from_sec"])
            to_sec = float(line["to_sec"])
            desired = max(0.05, to_sec - from_sec)

            voice_id = voice_by_speaker.get(speaker, "")
            if not voice_id:
                fail(f"no voice id mapping for speaker: {speaker}")

            key = sha1_hex(f"{speaker}|{voice_id}|{model_id}|{text}")
            raw_mp3 = cache_dir / f"{i:04d}-{speaker}-{key[:12]}.mp3"
            if force and raw_mp3.exists():
                raw_mp3.unlink()

            if not raw_mp3.exists():
                print(f"Generating TTS: {speaker} ({i + 1}/{len(lines_sorted)})")
                elevenlabs_tts_mp3(api_key, voice_id, text, model_id, raw_mp3)
            else:
                print(f"Cache hit: {raw_mp3.name}")

            out_wav = wav_dir / f"{i:04d}_{speaker}.wav"
            normalize_segment_to_wav(raw_mp3, out_wav, desired)
            files.append(out_wav)

            # Gap to next line.
            if i + 1 < len(lines_sorted):
                next_from = float(lines_sorted[i + 1]["from_sec"])
                gap = max(0.0, next_from - to_sec)
                if gap > 0.001:
                    s = wav_dir / f"{i:04d}_gap.wav"
                    make_silence_wav(s, gap)
                    files.append(s)

        # Concat into mp3.
        list_path = tmp_dir / "concat.txt"
        # ffmpeg concat file format: single-quoted paths. Convert to forward slashes for Windows compatibility.
        # (Paths with a literal single quote are exceedingly rare; best-effort only.)
        lines_for_concat = [f"file '{str(p).replace('\\\\', '/')}'" for p in files]
        list_path.write_text("\n".join(lines_for_concat) + "\n", encoding="utf-8")

        out_tmp = tmp_dir / "pilot.mp3"
        run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(list_path),
                "-c:a",
                "libmp3lame",
                "-b:a",
                "64k",
                "-ar",
                "48000",
                "-ac",
                "2",
                str(out_tmp),
            ]
        )

        # Only replace the published asset after successful build.
        out_mp3.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(out_tmp, out_mp3)
        print(f"Wrote: {out_mp3}")

    if bak_path and not keep_backup:
        try:
            bak_path.unlink()
        except Exception:
            pass


def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser(description="Generate pilot assets (script.json + VTT; optional mp3 via ElevenLabs).")
    p.add_argument("--spec", default=str(Path(__file__).with_name("pilot_v1.script.json")), help="Path to pilot script spec JSON")
    p.add_argument("--audio", action="store_true", help="Generate pilot.mp3 using ElevenLabs (requires ELEVENLABS_API_KEY + voice IDs + ffmpeg)")
    p.add_argument("--force", action="store_true", help="Regenerate cached segments (repair mode)")
    p.add_argument("--keep-backup", action="store_true", help="Keep pilot.mp3 backup after successful generation")
    args = p.parse_args(argv)

    spec_path = Path(args.spec).expanduser().resolve()
    spec = load_json(spec_path)

    repo_root = Path(__file__).resolve().parents[2]
    show_root = repo_root / "client" / "public" / "show" / "pilot-v1"
    captions_dir = show_root / "captions"
    stage_script_path = show_root / "script.json"
    audio_path = show_root / "pilot.mp3"
    cache_dir = repo_root / "output" / "pilot-cache" / "segments"

    # Always update script.json + VTTs (deterministic; no network).
    stage = render_stage_script(spec)
    write_json(stage_script_path, stage)
    print(f"Wrote: {stage_script_path}")
    write_captions(spec, captions_dir)

    # Optional: generate audio (network + ffmpeg).
    if args.audio:
        generate_audio(spec, audio_path, cache_dir, force=args.force, keep_backup=args.keep_backup)
    else:
        print("Note: --audio not set. Keeping existing pilot.mp3 (public-safe default).")

    return 0


if __name__ == "__main__":
    raise SystemExit(main(__import__("sys").argv[1:]))
