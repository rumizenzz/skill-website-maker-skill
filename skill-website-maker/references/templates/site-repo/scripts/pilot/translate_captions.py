#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


LANGS = ["en", "es", "fr", "de", "pt", "ja", "ko", "zh", "ar"]


def format_ts(sec: float) -> str:
    if sec < 0:
        sec = 0.0
    ms = int(round(sec * 1000))
    hh = ms // 3_600_000
    mm = (ms % 3_600_000) // 60_000
    ss = (ms % 60_000) // 1000
    mmm = ms % 1000
    return f"{hh:02d}:{mm:02d}:{ss:02d}.{mmm:03d}"


def load_spec(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser(description="Generate WebVTT caption tracks from pilot_v1.script.json (no network calls).")
    p.add_argument("--spec", default=str(Path(__file__).with_name("pilot_v1.script.json")), help="Path to pilot script spec JSON")
    p.add_argument(
        "--out-dir",
        default="",
        help="Output captions directory (default: <repo>/client/public/show/pilot-v1/captions)",
    )
    args = p.parse_args(argv)

    spec_path = Path(args.spec).expanduser().resolve()
    spec = load_spec(spec_path)

    repo_root = Path(__file__).resolve().parents[2]
    out_dir = Path(args.out_dir).expanduser().resolve() if args.out_dir else repo_root / "client" / "public" / "show" / "pilot-v1" / "captions"
    out_dir.mkdir(parents=True, exist_ok=True)

    lines = spec.get("lines") or []
    if not isinstance(lines, list) or not lines:
        raise SystemExit("Error: spec has no lines[]")

    for lang in LANGS:
        out_path = out_dir / f"{lang}.vtt"
        buf: list[str] = ["WEBVTT", ""]
        for line in lines:
            try:
                from_sec = float(line["from_sec"])
                to_sec = float(line["to_sec"])
                en_text = str(line.get("text") or "").strip()
                tr = line.get("t") if isinstance(line.get("t"), dict) else {}
                text = en_text if lang == "en" else str(tr.get(lang) or en_text).strip()
            except Exception:
                continue
            if not text:
                continue
            buf.append(f"{format_ts(from_sec)} --> {format_ts(to_sec)}")
            buf.append(text)
            buf.append("")

        out_path.write_text("\n".join(buf).rstrip() + "\n", encoding="utf-8")
        print(f"Wrote: {out_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main(__import__("sys").argv[1:]))

