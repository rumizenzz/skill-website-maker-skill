#!/usr/bin/env bash
set -euo pipefail

print_header() {
  echo "__SKILL_DISPLAY_NAME__ Skill Installer"
}

fail() {
  echo "Error: $1"
  exit 1
}

fail_codex_missing() {
  local reason="$1"
  echo "Error: Codex is not installed or not initialized on this machine."
  echo "Reason: $reason"
  echo "1) Install Codex (IDE extension on Windows/macOS, or Codex app on macOS)"
  echo "2) Sign in"
  echo "3) Run Codex once (so it creates your Codex folder)"
  echo "4) Re-run this command"
  echo "If you use a custom Codex folder, set CODEX_HOME and try again."
  echo "CODEX_HOME: $CODEX_HOME"
  exit 1
}

CODEX_HOME="${CODEX_HOME:-"$HOME/.codex"}"
SKILLS_DIR="$CODEX_HOME/skills"
SYSTEM_INSTALLER="$SKILLS_DIR/.system/skill-installer/scripts/install-skill-from-github.py"
AUTH_JSON="$CODEX_HOME/auth.json"
DEST_DIR="$SKILLS_DIR/__SKILL_SLUG__"

VERSION_URL="https://raw.githubusercontent.com/__GITHUB_OWNER__/__SKILL_REPO__/main/__SKILL_SLUG__/VERSION"
REPO_ZIP_BASE="https://codeload.github.com/__GITHUB_OWNER__/__SKILL_REPO__/zip/refs/tags"

print_header
echo "CODEX_HOME: $CODEX_HOME"

if ! command -v curl >/dev/null 2>&1; then
  fail "curl is required."
fi

if ! command -v unzip >/dev/null 2>&1; then
  fail "unzip is required."
fi

if [[ ! -d "$CODEX_HOME" ]]; then
  fail_codex_missing "missing directory: $CODEX_HOME"
fi

if [[ ! -d "$SKILLS_DIR" ]]; then
  fail_codex_missing "missing directory: $SKILLS_DIR"
fi

if [[ ! -f "$SYSTEM_INSTALLER" ]]; then
  fail_codex_missing "missing file: $SYSTEM_INSTALLER"
fi

if [[ ! -f "$AUTH_JSON" ]]; then
  fail_codex_missing "missing file: $AUTH_JSON"
fi

echo "Checking latest version..."
latest_version="$(curl -fsSL "$VERSION_URL" | tr -d '\r\n ')"
if [[ -z "${latest_version:-}" ]]; then
  fail "could not determine latest version."
fi
if [[ ! "$latest_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  fail "unexpected latest version: $latest_version"
fi

installed_version=""
backup_dir=""
install_ok=0

tmp_dir="$(mktemp -d 2>/dev/null || mktemp -d -t __SKILL_SLUG__)"
cleanup() {
  if [[ "$install_ok" -ne 1 && -n "${backup_dir:-}" && -d "$backup_dir" && ! -e "$DEST_DIR" ]]; then
    mv "$backup_dir" "$DEST_DIR" >/dev/null 2>&1 || true
  fi
  rm -rf "$tmp_dir" >/dev/null 2>&1 || true
}
trap cleanup EXIT

if [[ -e "$DEST_DIR" ]]; then
  installed_version="unknown"
  if [[ -f "$DEST_DIR/VERSION" ]]; then
    installed_version="$(tr -d '\r\n ' < "$DEST_DIR/VERSION" || true)"
    installed_version="${installed_version:-unknown}"
  fi

  if [[ "${FORCE:-}" != "1" && "$installed_version" == "$latest_version" ]]; then
    echo "Already installed and up to date: __SKILL_SLUG__ v$installed_version at $DEST_DIR"
    exit 0
  fi

  echo "Updating __SKILL_SLUG__: v$installed_version -> v$latest_version"
  backup_dir="${DEST_DIR}.bak-$(date -u +%Y%m%dT%H%M%SZ)"
  mv "$DEST_DIR" "$backup_dir"
else
  echo "Installing __SKILL_SLUG__ v$latest_version"
fi

zip_url="$REPO_ZIP_BASE/$latest_version"
zip_path="$tmp_dir/repo.zip"

echo "Downloading..."
curl -fsSL "$zip_url" -o "$zip_path"

echo "Extracting..."
unzip -q "$zip_path" -d "$tmp_dir"

skill_md_path="$(find "$tmp_dir" -type f -path '*/__SKILL_SLUG__/SKILL.md' | head -n 1 || true)"
if [[ -z "${skill_md_path:-}" ]]; then
  fail "skill files not found in downloaded archive."
fi
skill_src="$(cd "$(dirname "$skill_md_path")" && pwd)"

echo "Installing..."
mkdir -p "$SKILLS_DIR"
if ! cp -R "$skill_src" "$DEST_DIR"; then
  rm -rf "$DEST_DIR" >/dev/null 2>&1 || true
  if [[ -n "${backup_dir:-}" && -d "$backup_dir" ]]; then
    mv "$backup_dir" "$DEST_DIR" >/dev/null 2>&1 || true
  fi
  fail "install failed."
fi

install_ok=1

if [[ -n "${backup_dir:-}" && -d "$backup_dir" && "${KEEP_BACKUP:-}" != "1" ]]; then
  rm -rf "$backup_dir" >/dev/null 2>&1 || true
fi

echo "Installed __SKILL_SLUG__ v$latest_version"
echo "Restart Codex to pick up new skills"
echo "Then run: /__SKILL_SLUG__"

