# __SKILL_DISPLAY_NAME__ (Codex Skill)

This is the **skill-only** repository for the Codex skill `__SKILL_SLUG__`.

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
2. Copy the folder `__SKILL_SLUG__/` into:
   - `<CODEX_HOME>/skills/__SKILL_SLUG__/`
3. Restart Codex.

## Use

In Codex, run:
- `/__SKILL_SLUG__`

## Versioning

- Source of truth: `__SKILL_SLUG__/VERSION`
- Release tag names match VERSION exactly (example: `__VERSION__`).

