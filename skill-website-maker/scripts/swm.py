#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import re
import shutil
import sys
import time
from pathlib import Path
from typing import Any

from lib.secret_scan import scan_dir
from lib.semver import is_semver
from lib.subprocessx import CmdError, run
from lib.templates import copy_dir, replace_placeholders_in_tree, wipe_repo_contents
from lib.workspace import (
    init_workspace,
    load_json,
    project_config_path,
    require_workspace,
    save_json,
    state_dir,
    workspace_marker_path,
)


TOOL_VERSION = "1.0.1"


def eprint(msg: str) -> None:
    print(msg, file=sys.stderr)


def fail(msg: str, code: int = 1) -> None:
    eprint(f"Error: {msg}")
    raise SystemExit(code)


def header(title: str) -> None:
    print(title)


def utc_stamp() -> str:
    return time.strftime("%Y%m%dT%H%M%SZ", time.gmtime())


def default_codex_home() -> Path:
    # Mirrors the installer scripts convention.
    env = os.environ.get("CODEX_HOME", "").strip()
    if env:
        return Path(env).expanduser()
    if os.name == "nt":
        return Path(os.environ.get("USERPROFILE", str(Path.home()))) / ".codex"
    return Path.home() / ".codex"


def infer_skill_source(skill_slug: str) -> Path:
    return default_codex_home() / "skills" / skill_slug


def tool_ok(name: str) -> bool:
    return shutil.which(name) is not None


def gh_active_login() -> str:
    if not tool_ok("gh"):
        return ""
    cp = run(["gh", "api", "user", "-q", ".login"], check=False)
    if cp.returncode != 0:
        return ""
    return cp.stdout.strip()


def print_fix(tool: str) -> None:
    if tool == "git":
        print("Fix: install git (https://git-scm.com/downloads)")
        return
    if tool == "gh":
        print("Fix: install GitHub CLI (https://cli.github.com/)")
        return
    if tool == "node":
        print("Fix: install Node.js LTS (https://nodejs.org/)")
        return
    if tool == "pnpm":
        print("Fix: npm install -g pnpm")
        return
    print(f"Fix: install {tool} and ensure it is on PATH")


def cmd_doctor(_: argparse.Namespace) -> int:
    header("Skill Website Maker Doctor")

    ok = True
    for tool in ["git", "gh", "node", "pnpm"]:
        if tool_ok(tool):
            print(f"OK: {tool} found")
        else:
            ok = False
            print_fix(tool)

    print(f"OK: python {sys.version.split()[0]}")

    if tool_ok("gh"):
        try:
            cp = run(["gh", "auth", "status"], check=False)
            if cp.returncode == 0:
                print("OK: gh auth status")
            else:
                ok = False
                print("Fix: gh auth login")
        except Exception:
            ok = False
            print("Fix: gh auth login")

    if ok:
        print("Doctor result: OK")
        return 0
    print("Doctor result: issues detected")
    return 2


def cmd_workspace_init(_: argparse.Namespace) -> int:
    ws_root = Path.cwd()
    init_workspace(ws_root, tool_version=TOOL_VERSION)
    print(f"Workspace initialized: {ws_root}")
    print(f"Marker: {workspace_marker_path(ws_root)}")
    print(f"State dir: {state_dir(ws_root)}")
    return 0


def _load_project_or_fail(ws_root: Path) -> dict[str, Any]:
    cfg_path = project_config_path(ws_root)
    if not cfg_path.is_file():
        fail("project not initialized. Run: python <skillDir>/scripts/swm.py project init --skill-slug <slug> --owner <owner>")
    try:
        return load_json(cfg_path)
    except Exception as e:
        fail(f"failed to read project.json: {e}")
    raise AssertionError("unreachable")


def cmd_project_init(args: argparse.Namespace) -> int:
    ws_root = require_workspace(Path.cwd())
    cfg_path = project_config_path(ws_root)

    skill_slug = args.skill_slug.strip()
    if not re.match(r"^[a-z0-9-]+$", skill_slug):
        fail("invalid --skill-slug (must be hyphen-case)")

    source = Path(args.source).expanduser() if args.source else infer_skill_source(skill_slug)
    display_name = args.display_name.strip() if args.display_name else skill_slug.replace("-", " ").title()

    owner = args.owner.strip() if args.owner else ""
    skill_repo = args.skill_repo.strip() if args.skill_repo else f"{skill_slug}-skill"
    site_repo = args.site_repo.strip() if args.site_repo else skill_slug

    if not source.is_dir():
        fail(f"skill source directory not found: {source}")
    if not (source / "SKILL.md").is_file():
        fail(f"skill source missing SKILL.md: {source}")

    obj: dict[str, Any] = {
        "skill_slug": skill_slug,
        "skill_display_name": display_name,
        "skill_source_dir": str(source.resolve()),
        "github_owner": owner,
        "skill_repo": skill_repo,
        "site_repo": site_repo,
        "site_repo_private": True,
        "skill_repo_public": True,
        "netlify": {"site_name": "", "site_url": "", "linked": False},
        "last_publish_at": "",
    }

    save_json(cfg_path, obj)
    print("Project initialized.")
    print(f"Config: {cfg_path}")
    if not owner:
        print("Note: github_owner is empty. Set it by re-running with: --owner <githubOwner>")
    return 0


def cmd_project_status(_: argparse.Namespace) -> int:
    ws_root = require_workspace(Path.cwd())
    cfg = _load_project_or_fail(ws_root)

    header("Skill Website Maker Project Status")
    print(f"Workspace: {ws_root}")
    print(f"skill_slug: {cfg.get('skill_slug','')}")
    print(f"skill_display_name: {cfg.get('skill_display_name','')}")
    print(f"skill_source_dir: {cfg.get('skill_source_dir','')}")
    owner = str(cfg.get("github_owner", "") or "").strip()
    skill_repo = str(cfg.get("skill_repo", "") or "").strip()
    site_repo = str(cfg.get("site_repo", "") or "").strip()
    print(f"github_owner: {owner}")
    print(f"skill_repo: {skill_repo}")
    print(f"site_repo: {site_repo}")
    if owner and skill_repo:
        print(f"url.skill_repo: https://github.com/{owner}/{skill_repo}")
    if owner and site_repo:
        print(f"url.site_repo: https://github.com/{owner}/{site_repo}")
    repos_root = state_dir(ws_root) / "repos"
    if skill_repo:
        print(f"local.skill_repo: {repos_root / skill_repo}")
    if site_repo:
        print(f"local.site_repo: {repos_root / site_repo}")
    print(f"site_repo_private: {cfg.get('site_repo_private', True)}")
    print(f"skill_repo_public: {cfg.get('skill_repo_public', True)}")
    netlify = cfg.get("netlify", {}) if isinstance(cfg.get("netlify"), dict) else {}
    print(f"netlify.site_name: {netlify.get('site_name','')}")
    print(f"netlify.site_url: {netlify.get('site_url','')}")
    print(f"netlify.linked: {netlify.get('linked', False)}")
    print(f"last_publish_at: {cfg.get('last_publish_at','')}")
    return 0


def gh_repo_full(owner: str, repo: str) -> str:
    return f"{owner}/{repo}"


def ensure_repo_exists(owner: str, repo: str, private: bool, description: str) -> None:
    full = gh_repo_full(owner, repo)
    cp = run(["gh", "repo", "view", full], check=False)
    if cp.returncode == 0:
        print(f"OK: repo exists: {full}")
        return

    vis_flag = "--private" if private else "--public"
    print(f"Creating repo: {full} ({'private' if private else 'public'})")
    run(
        [
            "gh",
            "repo",
            "create",
            full,
            vis_flag,
            "--add-readme",
            "--description",
            description,
            "--confirm",
        ]
    )


def ensure_clone(owner: str, repo: str, dest: Path) -> None:
    full = gh_repo_full(owner, repo)
    if dest.is_dir() and (dest / ".git").is_dir():
        run(["git", "fetch", "--all", "--prune"], cwd=dest)
        # Best effort sync main.
        run(["git", "checkout", "main"], cwd=dest, check=False)
        run(["git", "pull", "--ff-only"], cwd=dest, check=False)
        return

    if dest.exists():
        fail(f"destination exists but is not a git repo: {dest}")

    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"Cloning: {full} -> {dest}")
    run(["gh", "repo", "clone", full, str(dest)])


def ensure_git_identity(repo_root: Path) -> None:
    # If the user has no git identity configured, commits will fail.
    name = run(["git", "config", "user.name"], cwd=repo_root, check=False).stdout.strip()
    email = run(["git", "config", "user.email"], cwd=repo_root, check=False).stdout.strip()
    if name and email:
        return
    # Do not invent identity. Provide actionable fix.
    fail(
        "git user identity not configured. Set it first:\n"
        "  git config --global user.name \"Your Name\"\n"
        "  git config --global user.email \"you@example.com\""
    )


def git_commit_push(repo_root: Path, msg: str) -> None:
    ensure_git_identity(repo_root)
    run(["git", "add", "-A"], cwd=repo_root)
    cp = run(["git", "status", "--porcelain=v1"], cwd=repo_root)
    if not cp.stdout.strip():
        print("No changes to commit.")
        return
    run(["git", "commit", "-m", msg], cwd=repo_root)
    run(["git", "push", "origin", "main"], cwd=repo_root)


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def render_skill_repo(
    ws_root: Path,
    cfg: dict[str, Any],
    templates_root: Path,
    repo_root: Path,
) -> str:
    skill_slug = str(cfg["skill_slug"])
    display_name = str(cfg.get("skill_display_name") or skill_slug)
    source_dir = Path(str(cfg["skill_source_dir"]))

    # Only fully render into an empty repo. If the repo already has content,
    # update the skill folder without clobbering README/CHANGELOG/LICENSE, etc.
    non_git = [p for p in repo_root.iterdir() if p.name != ".git"]
    blankish = all(p.name in {"README.md", "LICENSE", ".gitignore"} for p in non_git)
    if blankish:
        wipe_repo_contents(repo_root)

    # Copy skill folder into repo root (replace existing folder on updates).
    dest_skill_dir = repo_root / skill_slug
    if dest_skill_dir.exists():
        shutil.rmtree(dest_skill_dir)
    shutil.copytree(
        source_dir,
        dest_skill_dir,
        ignore=shutil.ignore_patterns("__pycache__", "*.pyc", "*.pyo", ".DS_Store", "Thumbs.db", "node_modules", "dist"),
    )

    version_path = dest_skill_dir / "VERSION"
    if version_path.is_file():
        version = version_path.read_text(encoding="utf-8", errors="ignore").strip()
    else:
        version = "1.0.0"
        write_text(version_path, version + "\n")

    if not is_semver(version):
        fail(f"invalid VERSION (expected X.Y.Z): {version}")

    # Root docs
    skill_tmpl = templates_root / "skill-repo"
    subs = {
        "__SKILL_SLUG__": skill_slug,
        "__SKILL_DISPLAY_NAME__": display_name,
        "__VERSION__": version,
        "__DATE__": time.strftime("%Y-%m-%d", time.gmtime()),
        "__YEAR__": time.strftime("%Y", time.gmtime()),
    }

    def render_root_doc(name: str) -> str:
        src = skill_tmpl / name
        if not src.is_file():
            fail(f"missing template file: {src}")
        text = src.read_text(encoding="utf-8")
        for k, v in subs.items():
            text = text.replace(k, v)
        return text

    root_docs = ["README.md", "CHANGELOG.md", "LICENSE", ".gitignore"]
    if blankish:
        for name in root_docs:
            write_text(repo_root / name, render_root_doc(name))
    else:
        for name in root_docs:
            out = repo_root / name
            if not out.exists():
                write_text(out, render_root_doc(name))

        # Best-effort changelog update: if the current version entry is missing,
        # insert a stub entry after [Unreleased]. Maintainers can edit later.
        ch_path = repo_root / "CHANGELOG.md"
        try:
            if ch_path.is_file():
                text = ch_path.read_text(encoding="utf-8", errors="ignore")
                if f"## [{version}]" not in text:
                    stamp = time.strftime("%Y-%m-%d", time.gmtime())
                    stub = f"## [{version}] - {stamp}\\n### Changed\\n- Updated skill package.\\n\\n"
                    marker = "## [Unreleased]"
                    idx = text.find(marker)
                    if idx != -1:
                        insert_at = idx + len(marker)
                        # Insert after the next newline(s).
                        nl = text.find("\\n", insert_at)
                        if nl != -1:
                            insert_at = nl + 1
                        text = text[:insert_at] + "\\n" + stub + text[insert_at:]
                        ch_path.write_text(text, encoding="utf-8")
        except Exception:
            pass

    # Keep a marker so update-site can detect generated repos (best effort).
    write_text(repo_root / ".swm-generated", f"generated_at={utc_stamp()}\nworkspace={ws_root}\n")

    return version


def ensure_tag_and_release(owner: str, repo: str, repo_root: Path, version: str, notes_path: Path | None) -> None:
    # Tag
    tags = run(["git", "tag", "--list", version], cwd=repo_root).stdout.strip()
    if tags:
        print(f"OK: tag exists: {version}")
    else:
        print(f"Creating tag: {version}")
        run(["git", "tag", version], cwd=repo_root)
        run(["git", "push", "origin", version], cwd=repo_root)

    full = gh_repo_full(owner, repo)
    cp = run(["gh", "release", "view", version, "-R", full], check=False)
    if cp.returncode == 0:
        print(f"OK: release exists: {version}")
        return

    print(f"Creating GitHub Release: {version}")
    cmd = ["gh", "release", "create", version, "-R", full, "--title", version]
    if notes_path and notes_path.is_file():
        cmd += ["--notes-file", str(notes_path)]
    else:
        cmd += ["--notes", f"Release {version}"]
    run(cmd)


def render_site_repo(
    ws_root: Path,
    cfg: dict[str, Any],
    templates_root: Path,
    repo_root: Path,
    version: str,
) -> None:
    skill_slug = str(cfg["skill_slug"])
    display_name = str(cfg.get("skill_display_name") or skill_slug)
    owner = str(cfg["github_owner"])
    skill_repo = str(cfg["skill_repo"])

    site_tmpl = templates_root / "site-repo"
    wipe_repo_contents(repo_root)
    copy_dir(site_tmpl, repo_root)

    subs = {
        "__SKILL_SLUG__": skill_slug,
        "__SKILL_DISPLAY_NAME__": display_name,
        "__GITHUB_OWNER__": owner,
        "__SKILL_REPO__": skill_repo,
        "__VERSION__": version,
    }
    replace_placeholders_in_tree(repo_root, subs)

    # Ensure these always exist.
    write_text(repo_root / "client" / "public" / "skill-version.txt", version + "\n")

    # Seed changelog from the skill repo clone if available (GitHub Action will keep it synced).
    seed = ""
    try:
        skill_local = state_dir(ws_root) / "repos" / skill_repo
        seed_path = skill_local / "CHANGELOG.md"
        if seed_path.is_file():
            seed = seed_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        seed = ""

    # Fallback: link to releases.
    if not seed.strip():
        seed = f"# Changelog\n\nSee GitHub Releases: https://github.com/{owner}/{skill_repo}/releases\n"

    write_text(
        repo_root / "client" / "public" / "changelog.md",
        seed,
    )

    write_text(repo_root / ".swm-generated", f"generated_at={utc_stamp()}\nworkspace={ws_root}\n")


def update_site_artifacts(
    ws_root: Path,
    cfg: dict[str, Any],
    templates_root: Path,
    repo_root: Path,
    version: str,
) -> None:
    """
    Minimal site update: installers, sync workflow, seed changelog/version, and identity links.

    This intentionally avoids overwriting the full website source, so owners can customize the site.
    """
    skill_slug = str(cfg["skill_slug"])
    display_name = str(cfg.get("skill_display_name") or skill_slug)
    owner = str(cfg["github_owner"])
    skill_repo = str(cfg["skill_repo"])

    subs = {
        "__SKILL_SLUG__": skill_slug,
        "__SKILL_DISPLAY_NAME__": display_name,
        "__GITHUB_OWNER__": owner,
        "__SKILL_REPO__": skill_repo,
        "__VERSION__": version,
    }

    site_tmpl = templates_root / "site-repo"

    def render_file(rel: str) -> None:
        src = site_tmpl / rel
        if not src.is_file():
            fail(f"missing site template file: {src}")
        text = src.read_text(encoding="utf-8")
        for k, v in subs.items():
            text = text.replace(k, v)
        write_text(repo_root / rel, text)

    # Installers
    render_file("client/public/install.sh")
    render_file("client/public/install.ps1")

    # Sync workflow
    render_file(".github/workflows/sync-skill-changelog.yml")

    # Identity links (so GitHub/Support buttons always point to the public skill repo)
    render_file("client/src/siteConfig.ts")

    # Version/changelog files served by the site origin
    write_text(repo_root / "client" / "public" / "skill-version.txt", version + "\n")

    seed = ""
    try:
        skill_local = state_dir(ws_root) / "repos" / skill_repo
        seed_path = skill_local / "CHANGELOG.md"
        if seed_path.is_file():
            seed = seed_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        seed = ""

    if not seed.strip():
        seed = "# Changelog\n\nThis file is synced from the public skill repo.\n"

    write_text(repo_root / "client" / "public" / "changelog.md", seed)


def cmd_project_publish(args: argparse.Namespace) -> int:
    ws_root = require_workspace(Path.cwd())
    cfg_path = project_config_path(ws_root)
    cfg = _load_project_or_fail(ws_root)

    if not args.confirm:
        fail("refusing to publish without --confirm")

    owner = str(cfg.get("github_owner") or "").strip()
    if not owner:
        fail("github_owner is empty. Re-run: project init --owner <githubOwner>")

    skill_repo = str(cfg.get("skill_repo") or "").strip()
    site_repo = str(cfg.get("site_repo") or "").strip()
    if not skill_repo or not site_repo:
        fail("skill_repo/site_repo missing in project.json")

    if not tool_ok("git") or not tool_ok("gh"):
        fail("missing git or gh. Run: python scripts/swm.py doctor")

    active = gh_active_login()
    if active:
        print(f"gh.active_user: {active}")
        if owner.lower() != active.lower():
            print(f"Note: github_owner is '{owner}' but active gh user is '{active}'.")
            print(f"      If repo creation fails, run: gh auth switch -u {owner}")

    # Secret scan
    source_dir = Path(str(cfg["skill_source_dir"]))
    header("Secret scan (source skill folder)")
    findings = scan_dir(source_dir)
    if findings:
        print("Findings:")
        for f in findings:
            print(f"- {f.path}: {f.reason}")
        fail("refusing to publish until findings are removed")
    print("OK: no blocked files/patterns detected")

    templates_root = Path(__file__).resolve().parents[1] / "references" / "templates"
    repos_root = state_dir(ws_root) / "repos"
    repos_root.mkdir(parents=True, exist_ok=True)

    # Skill repo (public)
    ensure_repo_exists(
        owner,
        skill_repo,
        private=False,
        description=f"Codex skill repo for {cfg.get('skill_display_name', cfg.get('skill_slug',''))}",
    )
    skill_local = repos_root / f"{skill_repo}"
    ensure_clone(owner, skill_repo, skill_local)
    version = render_skill_repo(ws_root, cfg, templates_root, skill_local)
    git_commit_push(skill_local, f"chore: publish {cfg.get('skill_slug','skill')} v{version}")
    ensure_tag_and_release(owner, skill_repo, skill_local, version, notes_path=None)

    # Site repo (private)
    ensure_repo_exists(
        owner,
        site_repo,
        private=True,
        description=f"Website for Codex skill {cfg.get('skill_display_name', cfg.get('skill_slug',''))}",
    )
    site_local = repos_root / f"{site_repo}"
    ensure_clone(owner, site_repo, site_local)

    # Only fully render the site template into a blank repo. If the repo already
    # has content, update only installers/workflows/links to avoid clobbering
    # customizations.
    non_git = [p for p in site_local.iterdir() if p.name != ".git"]
    blankish = all(p.name in {"README.md", "LICENSE", ".gitignore"} for p in non_git)
    if blankish:
        render_site_repo(ws_root, cfg, templates_root, site_local, version)
    else:
        update_site_artifacts(ws_root, cfg, templates_root, site_local, version)

    # Build checks (requires pnpm)
    if not tool_ok("pnpm"):
        fail("pnpm not found. Install: npm install -g pnpm")
    if not tool_ok("node"):
        fail("node not found. Install Node.js LTS")

    header("Website build check")
    try:
        run(["pnpm", "install"], cwd=site_local)
        run(["pnpm", "check"], cwd=site_local)
        run(["pnpm", "build"], cwd=site_local)
    except CmdError as e:
        eprint(e.stdout)
        eprint(e.stderr)
        fail("website build failed")

    git_commit_push(site_local, f"chore: render website template for {cfg.get('skill_slug','skill')} v{version}")

    cfg["last_publish_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    save_json(cfg_path, cfg)

    print("Publish complete.")
    print(f"Skill repo: https://github.com/{owner}/{skill_repo}")
    print(f"Site repo (private): https://github.com/{owner}/{site_repo}")
    print("")
    print("Next: link the site repo to Netlify GitHub integration to enable PR Deploy Previews.")
    return 0


def cmd_project_update_site(args: argparse.Namespace) -> int:
    ws_root = require_workspace(Path.cwd())
    cfg_path = project_config_path(ws_root)
    cfg = _load_project_or_fail(ws_root)

    if not args.confirm:
        fail("refusing to update site without --confirm")

    owner = str(cfg.get("github_owner") or "").strip()
    site_repo = str(cfg.get("site_repo") or "").strip()
    skill_repo = str(cfg.get("skill_repo") or "").strip()
    if not owner or not site_repo or not skill_repo:
        fail("project.json missing github_owner/site_repo/skill_repo")

    repos_root = state_dir(ws_root) / "repos"
    site_local = repos_root / site_repo
    ensure_clone(owner, site_repo, site_local)

    # Infer current version from the skill repo clone if available.
    version = "1.0.0"
    skill_local = repos_root / skill_repo
    if skill_local.is_dir():
        slug = str(cfg.get("skill_slug") or "")
        vp = skill_local / slug / "VERSION"
        if vp.is_file():
            version = vp.read_text(encoding="utf-8", errors="ignore").strip() or version

    templates_root = Path(__file__).resolve().parents[1] / "references" / "templates"
    update_site_artifacts(ws_root, cfg, templates_root, site_local, version)

    git_commit_push(site_local, f"chore: update website template for {cfg.get('skill_slug','skill')} v{version}")

    cfg["last_publish_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    save_json(cfg_path, cfg)
    print("Website update complete.")
    return 0


def cmd_project_release(args: argparse.Namespace) -> int:
    ws_root = require_workspace(Path.cwd())
    cfg = _load_project_or_fail(ws_root)

    if not args.confirm:
        fail("refusing to release without --confirm")

    owner = str(cfg.get("github_owner") or "").strip()
    skill_repo = str(cfg.get("skill_repo") or "").strip()
    skill_slug = str(cfg.get("skill_slug") or "").strip()
    if not owner or not skill_repo or not skill_slug:
        fail("project.json missing github_owner/skill_repo/skill_slug")

    repos_root = state_dir(ws_root) / "repos"
    skill_local = repos_root / skill_repo
    ensure_clone(owner, skill_repo, skill_local)

    version_path = skill_local / skill_slug / "VERSION"
    if not version_path.is_file():
        fail(f"VERSION not found in skill repo clone: {version_path}")
    version = version_path.read_text(encoding="utf-8", errors="ignore").strip()
    if not is_semver(version):
        fail(f"invalid VERSION (expected X.Y.Z): {version}")

    ensure_tag_and_release(owner, skill_repo, skill_local, version, notes_path=None)
    print("Release complete.")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="swm", description="Skill Website Maker (publish skills to GitHub + Netlify-ready site)")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("doctor", help="Check dependencies (git/gh/node/pnpm) and gh auth").set_defaults(fn=cmd_doctor)

    ws = sub.add_parser("workspace", help="Workspace management")
    ws_sub = ws.add_subparsers(dest="ws_cmd", required=True)
    ws_sub.add_parser("init", help="Initialize a skill-website-maker workspace in the current folder").set_defaults(
        fn=cmd_workspace_init
    )

    proj = sub.add_parser("project", help="Project config + publishing")
    proj_sub = proj.add_subparsers(dest="proj_cmd", required=True)

    pi = proj_sub.add_parser("init", help="Initialize project.json in this workspace")
    pi.add_argument("--skill-slug", required=True, help="Skill slug (hyphen-case), e.g. my-skill")
    pi.add_argument("--source", default="", help="Local skill folder path (default: CODEX_HOME/skills/<slug>)")
    pi.add_argument("--display-name", default="", help="Human display name (optional)")
    pi.add_argument("--owner", default="", help="GitHub owner/org for repos (required before publish)")
    pi.add_argument("--skill-repo", default="", help="Skill repo name (default: <skill_slug>-skill)")
    pi.add_argument("--site-repo", default="", help="Website repo name (default: <skill_slug>)")
    pi.set_defaults(fn=cmd_project_init)

    proj_sub.add_parser("status", help="Show saved project config").set_defaults(fn=cmd_project_status)

    pp = proj_sub.add_parser("publish", help="Create/update repos and publish (requires --confirm)")
    pp.add_argument("--confirm", action="store_true", help="Required safety gate for publishing")
    pp.set_defaults(fn=cmd_project_publish)

    pu = proj_sub.add_parser("update-site", help="Update only the website repo from templates (requires --confirm)")
    pu.add_argument("--confirm", action="store_true", help="Required safety gate for updating")
    pu.set_defaults(fn=cmd_project_update_site)

    pr = proj_sub.add_parser("release", help="Create tag+GitHub Release matching VERSION (requires --confirm)")
    pr.add_argument("--confirm", action="store_true", help="Required safety gate for releasing")
    pr.set_defaults(fn=cmd_project_release)

    return p


def main(argv: list[str]) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return int(args.fn(args))
    except CmdError as e:
        eprint(e.stdout)
        eprint(e.stderr)
        fail(str(e))
    except RuntimeError as e:
        fail(str(e))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
