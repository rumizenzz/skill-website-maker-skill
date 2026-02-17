# Skill Website Maker (Codex Skill)

This is the **skill-only** repository for the Codex skill `skill-website-maker`.

It is intended to be installed into your Codex skills folder (not run as a standalone app).

## Requirements

- Codex installed and signed in (IDE extension on Windows/macOS, or Codex app on macOS)
- Run Codex once so it creates your `CODEX_HOME` folder

## Install

Recommended: use the public website one-liner installer (it also supports auto-updates).

Manual install (advanced):
1. Locate your Codex home folder:
   - macOS: `~/.codex` (or `CODEX_HOME`)
   - Windows: `%USERPROFILE%\\.codex` (or `CODEX_HOME`)
2. Copy the folder `skill-website-maker/` into:
   - `<CODEX_HOME>/skills/skill-website-maker/`
3. Restart Codex.

## Use

In Codex, run:
- `/skill-website-maker`

## Versioning

- Source of truth: `skill-website-maker/VERSION`
- Release tag names match VERSION exactly (example: `1.0.0`).

## What It Generates (Quick Summary)

Skill Website Maker publishes any Codex skill as:
1. A public skill-only repo (what installers download)
2. A private website source repo deployed publicly (Netlify) that hosts `/install.sh` and `/install.ps1`

The generated site template ships with:
- Full i18n: 9 languages enabled (including RTL for Arabic)
- An original "SkillStream Originals" Pilot section (3D animated stage + captions)
- No runtime ElevenLabs calls (audio is served as static assets; maintainers can regenerate offline)

