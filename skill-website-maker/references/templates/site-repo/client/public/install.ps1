$ErrorActionPreference = "Stop"

try {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
} catch { }

function Write-Header {
  Write-Output "__SKILL_DISPLAY_NAME__ Skill Installer"
}

function Fail {
  param([string]$Message)
  Write-Output ("Error: " + $Message)
  exit 1
}

function Fail-CodexMissing {
  param([string]$Reason)
  Write-Output "Error: Codex is not installed or not initialized on this machine."
  Write-Output ("Reason: " + $Reason)
  Write-Output "1) Install Codex (IDE extension on Windows/macOS, or Codex app on macOS)"
  Write-Output "2) Sign in"
  Write-Output "3) Run Codex once (so it creates your Codex folder)"
  Write-Output "4) Re-run this command"
  Write-Output "If you use a custom Codex folder, set CODEX_HOME and try again."
  Write-Output ("CODEX_HOME: " + $CODEX_HOME)
  exit 1
}

$CODEX_HOME = $env:CODEX_HOME
if ([string]::IsNullOrWhiteSpace($CODEX_HOME)) {
  $CODEX_HOME = Join-Path $env:USERPROFILE ".codex"
}

$SKILLS_DIR = Join-Path $CODEX_HOME "skills"
$SYSTEM_INSTALLER = Join-Path $SKILLS_DIR ".system\\skill-installer\\scripts\\install-skill-from-github.py"
$AUTH_JSON = Join-Path $CODEX_HOME "auth.json"
$DEST_DIR = Join-Path $SKILLS_DIR "__SKILL_SLUG__"

$VERSION_URL = "https://raw.githubusercontent.com/__GITHUB_OWNER__/__SKILL_REPO__/main/__SKILL_SLUG__/VERSION"
$REPO_ZIP_BASE = "https://codeload.github.com/__GITHUB_OWNER__/__SKILL_REPO__/zip/refs/tags"

Write-Header
Write-Output ("CODEX_HOME: " + $CODEX_HOME)

if (-not (Test-Path -LiteralPath $CODEX_HOME -PathType Container)) {
  Fail-CodexMissing "missing directory: $CODEX_HOME"
}

if (-not (Test-Path -LiteralPath $SKILLS_DIR -PathType Container)) {
  Fail-CodexMissing "missing directory: $SKILLS_DIR"
}

if (-not (Test-Path -LiteralPath $SYSTEM_INSTALLER -PathType Leaf)) {
  Fail-CodexMissing "missing file: $SYSTEM_INSTALLER"
}

if (-not (Test-Path -LiteralPath $AUTH_JSON -PathType Leaf)) {
  Fail-CodexMissing "missing file: $AUTH_JSON"
}

Write-Output "Checking latest version..."
try {
  $latest_version = (Invoke-RestMethod -Uri $VERSION_URL -Method Get).ToString().Trim()
} catch {
  Fail "could not determine latest version."
}

if ([string]::IsNullOrWhiteSpace($latest_version)) {
  Fail "could not determine latest version."
}

if ($latest_version -notmatch "^[0-9]+\\.[0-9]+\\.[0-9]+$") {
  Fail ("unexpected latest version: " + $latest_version)
}

function Read-InstalledVersion {
  param([string]$Path)
  $vp = Join-Path $Path "VERSION"
  if (Test-Path -LiteralPath $vp -PathType Leaf) {
    try { return (Get-Content -LiteralPath $vp -Raw).Trim() } catch { return "unknown" }
  }
  return "unknown"
}

$installed_version = ""
$backup_dir = ""

if (Test-Path -LiteralPath $DEST_DIR) {
  $installed_version = Read-InstalledVersion $DEST_DIR

  if ($env:FORCE -ne "1" -and $installed_version -eq $latest_version) {
    Write-Output ("Already installed and up to date: __SKILL_SLUG__ v" + $installed_version + " at " + $DEST_DIR)
    exit 0
  }

  Write-Output ("Updating __SKILL_SLUG__: v" + $installed_version + " -> v" + $latest_version)
  $backup_dir = $DEST_DIR + ".bak-" + (Get-Date -AsUTC -Format "yyyyMMddTHHmmssZ")
  Move-Item -LiteralPath $DEST_DIR -Destination $backup_dir -Force
} else {
  Write-Output ("Installing __SKILL_SLUG__ v" + $latest_version)
}

$tmp_dir = Join-Path ([System.IO.Path]::GetTempPath()) ("__SKILL_SLUG__-" + [System.Guid]::NewGuid().ToString("n"))
New-Item -ItemType Directory -Force -Path $tmp_dir | Out-Null

$zip_url = "$REPO_ZIP_BASE/$latest_version"
$zip_path = Join-Path $tmp_dir "repo.zip"

try {
  Write-Output "Downloading..."
  Invoke-WebRequest -Uri $zip_url -OutFile $zip_path -UseBasicParsing

  Write-Output "Extracting..."
  Expand-Archive -LiteralPath $zip_path -DestinationPath $tmp_dir -Force

  $skillMd = Get-ChildItem -Path $tmp_dir -Recurse -File -Filter "SKILL.md" | Where-Object {
    $_.FullName -match "\\\\__SKILL_SLUG__\\\\SKILL\\.md$"
  } | Select-Object -First 1

  if (-not $skillMd) {
    throw "skill files not found in downloaded archive."
  }

  $skillSrc = Split-Path -Parent $skillMd.FullName

  Write-Output "Installing..."
  if (Test-Path -LiteralPath $DEST_DIR) {
    Remove-Item -LiteralPath $DEST_DIR -Recurse -Force -ErrorAction SilentlyContinue
  }

  Copy-Item -Recurse -Force -LiteralPath $skillSrc -Destination $SKILLS_DIR

  if ($backup_dir -and (Test-Path -LiteralPath $backup_dir) -and ($env:KEEP_BACKUP -ne "1")) {
    Remove-Item -LiteralPath $backup_dir -Recurse -Force -ErrorAction SilentlyContinue
  }

  Write-Output ("Installed __SKILL_SLUG__ v" + $latest_version)
  Write-Output "Restart Codex to pick up new skills"
  Write-Output "Then run: /__SKILL_SLUG__"
} catch {
  $msg = $_.Exception.Message

  try { if (Test-Path -LiteralPath $DEST_DIR) { Remove-Item -LiteralPath $DEST_DIR -Recurse -Force -ErrorAction SilentlyContinue } } catch { }
  try { if ($backup_dir -and (Test-Path -LiteralPath $backup_dir)) { Move-Item -LiteralPath $backup_dir -Destination $DEST_DIR -Force } } catch { }
  try { Remove-Item -LiteralPath $tmp_dir -Recurse -Force -ErrorAction SilentlyContinue } catch { }

  Fail ("install failed. " + $msg)
} finally {
  try { Remove-Item -LiteralPath $tmp_dir -Recurse -Force -ErrorAction SilentlyContinue } catch { }
}

