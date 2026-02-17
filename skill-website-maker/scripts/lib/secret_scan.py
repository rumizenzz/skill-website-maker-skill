from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Finding:
    path: str
    reason: str


# Conservative: block risky files outright.
BLOCKED_BASENAMES = {
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    "auth.json",
    "credentials.json",
    "service-account.json",
    "id_rsa",
    "id_ed25519",
}

ALLOWED_BASENAMES = {
    ".env.example",
    ".env.sample",
}

BLOCKED_EXTS = {
    ".pem",
    ".p12",
    ".pfx",
    ".key",
}

# Content patterns (avoid false positives like "OPENAI_API_KEY" docs).
CONTENT_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"-----BEGIN (?:RSA |EC |)PRIVATE KEY-----"), "private key block"),
    (re.compile(r"\\bAKIA[0-9A-Z]{16}\\b"), "possible AWS access key id"),
    (re.compile(r"\\bgh[opsu]_[A-Za-z0-9]{20,}\\b"), "possible GitHub token"),
    (re.compile(r"\\bsk-[A-Za-z0-9]{20,}\\b"), "possible API key"),
    (re.compile(r"\\bxox[baprs]-[A-Za-z0-9-]{10,}\\b"), "possible Slack token"),
]

TEXT_EXTS = {
    ".md",
    ".txt",
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".sh",
    ".ps1",
    ".html",
    ".css",
}


def scan_dir(root: Path) -> list[Finding]:
    findings: list[Finding] = []

    for p in root.rglob("*"):
        if p.is_dir():
            continue

        name = p.name
        lower = name.lower()

        if lower in ALLOWED_BASENAMES:
            continue

        if lower in BLOCKED_BASENAMES:
            findings.append(Finding(str(p), f"blocked filename: {name}"))
            continue

        if p.suffix.lower() in BLOCKED_EXTS:
            findings.append(Finding(str(p), f"blocked extension: {p.suffix}"))
            continue

        if p.suffix.lower() not in TEXT_EXTS:
            continue

        try:
            text = p.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue

        for rx, reason in CONTENT_PATTERNS:
            if rx.search(text):
                findings.append(Finding(str(p), reason))
                break

    return findings

