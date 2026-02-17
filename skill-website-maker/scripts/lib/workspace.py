from __future__ import annotations

import json
import os
import time
from pathlib import Path
from typing import Any

STATE_DIR_REL = Path(".codex") / "skill-website-maker"
WORKSPACE_MARKER = "workspace.json"
PROJECT_CONFIG = "project.json"


def state_dir(workspace_root: Path) -> Path:
    return workspace_root / STATE_DIR_REL


def workspace_marker_path(workspace_root: Path) -> Path:
    return state_dir(workspace_root) / WORKSPACE_MARKER


def project_config_path(workspace_root: Path) -> Path:
    return state_dir(workspace_root) / PROJECT_CONFIG


def find_workspace_root(start: Path) -> Path | None:
    cur = start.resolve()
    while True:
        marker = workspace_marker_path(cur)
        if marker.is_file():
            return cur
        parent = cur.parent
        if parent == cur:
            return None
        cur = parent


def require_workspace(start: Path) -> Path:
    ws = find_workspace_root(start)
    if ws is None:
        raise RuntimeError(
            "Workspace not initialized. Run: python <skillDir>/scripts/swm.py workspace init"
        )
    return ws


def init_workspace(workspace_root: Path, tool_version: str) -> None:
    sd = state_dir(workspace_root)
    sd.mkdir(parents=True, exist_ok=True)

    marker = workspace_marker_path(workspace_root)
    payload: dict[str, Any] = {
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "tool": "skill-website-maker",
        "tool_version": tool_version,
        "cwd": str(workspace_root.resolve()),
        "platform": os.name,
    }
    marker.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, obj: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, sort_keys=True) + "\n", encoding="utf-8")

