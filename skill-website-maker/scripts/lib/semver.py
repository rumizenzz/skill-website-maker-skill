from __future__ import annotations

import re

SEMVER_RE = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+$")


def is_semver(s: str) -> bool:
    return bool(SEMVER_RE.match(s.strip()))

