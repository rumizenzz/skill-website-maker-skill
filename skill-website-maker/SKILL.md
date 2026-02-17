---
name: skill-website-maker
description: "Use when you want to publish a Codex skill as a public skill-only GitHub repo plus a private website GitHub repo (deployed publicly on Netlify) with short one-line installers and PR deploy previews."
---

# Skill Website Maker

## Overview (Plain English)

This master skill publishes any Codex skill as two GitHub repos:
1) A public skill-only repo (this is what users install)
2) A private website repo (deployed publicly on Netlify) that hosts short one-liner installers at `/install.sh` and `/install.ps1`

It is designed for non-coders: you run it once in a workspace, answer a few setup questions, and it remembers the config per workspace.

## Workspace Requirement (Per-Skill Memory)

This skill requires a dedicated workspace folder for each published skill project.

Workspace = a folder on your computer where this skill stores its state under:
- `<workspace>/.codex/skill-website-maker/`

This prevents mixing configs between different skills.

## What It Creates

Defaults (you can override):
- Public skill repo: `<skill-slug>-skill`
- Private website repo: `<skill-slug>`

Website requirements:
- The website repo is private, but the deployed Netlify site is public.
- PRs create Netlify Deploy Previews (Netlify GitHub integration).
- The generated site template ships with:
  - full i18n: 9 languages enabled (en, es, fr, de, pt, ja, ko, zh, ar) with RTL for Arabic
  - an original "SkillStream Originals" Pilot section (3D animated stage + captions)
  - no Netflix branding/assets and no celebrity impersonation
  - no runtime ElevenLabs calls (audio is pre-generated and served as static files)

## Safety Rules (Non-Negotiable)

- Never publish secrets. This skill scans for risky files/patterns and stops if found.
- Require explicit confirmation before:
  - creating GitHub repos
  - pushing to `main`
  - creating tags/releases
  - changing repo visibility
- Never commit API keys to repos. If an API key was pasted into chat logs, treat it as compromised and rotate it.

## Start Here (Copy/Paste Prompts)

1) Publish an existing skill from your local Codex install:
- "Use `$skill-website-maker`. Create a workspace on my Desktop called `publish-my-skill`, initialize it, then publish the skill folder `~/.codex/skills/<skill-slug>` to GitHub (public skill repo + private website repo)."

2) Update only the website repo for a published skill:
- "Use `$skill-website-maker`. In this workspace, update the website repo to the latest template and regenerate installers."

3) Create a new release for an existing published skill:
- "Use `$skill-website-maker`. In this workspace, create a GitHub tag+release that matches the VERSION file."

4) Dogfood (publish this skill itself):
- "Use `$skill-website-maker`. Publish the `skill-website-maker` skill itself (public skill repo + private website repo), then show me the Netlify GitHub integration steps."

## Deterministic CLI (scripts/swm.py)

This skill ships a deterministic CLI you can run directly:

```powershell
$skillDir = "$env:USERPROFILE\\.codex\\skills\\skill-website-maker"
python "$skillDir\\scripts\\swm.py" doctor

# In a workspace folder:
python "$skillDir\\scripts\\swm.py" workspace init
python "$skillDir\\scripts\\swm.py" project init --skill-slug <skill-slug> --source "<path-to-skill-folder>" --owner <githubOwner>
python "$skillDir\\scripts\\swm.py" project status

# Publishes (requires explicit --confirm):
python "$skillDir\\scripts\\swm.py" project publish --confirm
```

## Definition Of Done

A publish is complete when:
- Skill repo is public and contains `<skill-slug>/VERSION`
- A Git tag and GitHub Release exist with the same value as `VERSION`
- Website repo is private and contains:
  - `/install.sh` and `/install.ps1` (auto-update installers)
  - `/changelog.md` synced from the skill repo
  - `netlify.toml` configured for deploy previews + SPA routing
- Users can install/update via:
  - macOS: `curl -fsSL https://<site>/install.sh | bash`
  - Windows: `iwr -useb https://<site>/install.ps1 | iex`

## References (Progressive Disclosure)

- Templates (skill repo + website repo): `references/templates/`
- Internal CLI docs: `scripts/swm.py --help`
