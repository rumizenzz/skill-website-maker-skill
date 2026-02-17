# __SKILL_DISPLAY_NAME__ (Website)

This repository is the private website source for the Codex skill `__SKILL_SLUG__`.

- Skill-only repo (public, what the installer downloads): `__GITHUB_OWNER__/__SKILL_REPO__`
- Website repo (this repo, private): `__GITHUB_OWNER__/__SKILL_SLUG__`

## What This Site Does

- Explains what the skill is and how to install it
- Hosts short one-line installers:
  - `/install.sh` (macOS)
  - `/install.ps1` (Windows PowerShell)
- Shows realistic terminal demo output for common install scenarios
- Renders the skill changelog locally from `/changelog.md` (synced by GitHub Actions)
- Includes an original "streaming-style" Pilot section (`SkillStream Originals`) with a 3D animated stage and caption tracks

Notes:
- This template is not affiliated with any streaming service. The branding, UI, audio, and characters are original.
- The public site does not call ElevenLabs (or any voice API) at runtime. Audio is shipped as static assets.
- Maintainers can regenerate pilot assets offline: see `scripts/pilot/README.md`.

## Netlify (GitHub Integration + PR Deploy Previews)

Recommended deployment is Netlify GitHub integration:
- PRs create Deploy Previews automatically
- pushes to `main` deploy to production

One-time Netlify UI setup:
1. In Netlify: Site configuration -> Build & deploy -> Link site to a Git repository
2. Repo: `__GITHUB_OWNER__/__SKILL_SLUG__`
3. Branch: `main`
4. Build command: `pnpm build`
5. Publish directory: `dist/public`
6. Enable Deploy Previews

(`netlify.toml` is included and defines build/publish settings + SPA redirect.)

## Local Development

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm build
```
