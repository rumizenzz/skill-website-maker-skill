from __future__ import annotations

import shutil
from pathlib import Path


TEXT_EXTS = {
    ".md",
    ".txt",
    ".json",
    ".yml",
    ".yaml",
    ".toml",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".css",
    ".html",
    ".sh",
    ".ps1",
}


def is_text_file(path: Path) -> bool:
    return path.suffix.lower() in TEXT_EXTS


def copy_dir(src: Path, dst: Path) -> None:
    dst.mkdir(parents=True, exist_ok=True)
    for p in src.iterdir():
        out = dst / p.name
        if p.is_dir():
            shutil.copytree(p, out, dirs_exist_ok=True)
        else:
            shutil.copy2(p, out)


def replace_placeholders_in_tree(root: Path, subs: dict[str, str]) -> None:
    for p in root.rglob("*"):
        if p.is_dir():
            continue
        if not is_text_file(p):
            continue
        try:
            text = p.read_text(encoding="utf-8")
        except Exception:
            continue
        changed = text
        for k, v in subs.items():
            changed = changed.replace(k, v)
        if changed != text:
            p.write_text(changed, encoding="utf-8")


def wipe_repo_contents(repo_root: Path) -> None:
    # Remove everything except .git
    for p in repo_root.iterdir():
        if p.name == ".git":
            continue
        if p.is_dir():
            shutil.rmtree(p)
        else:
            p.unlink()
