from __future__ import annotations

import os
import subprocess
import shutil
from pathlib import Path
from typing import Sequence


class CmdError(RuntimeError):
    def __init__(self, cmd: Sequence[str], returncode: int, stdout: str, stderr: str):
        super().__init__(f"command failed ({returncode}): {' '.join(cmd)}")
        self.cmd = list(cmd)
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr


def run(
    cmd: Sequence[str],
    cwd: Path | None = None,
    check: bool = True,
    capture: bool = True,
) -> subprocess.CompletedProcess[str]:
    argv = list(cmd)

    # Windows: tools installed via npm/pnpm often resolve to .cmd shims, which
    # are not directly executable via CreateProcess when shell=False.
    if os.name == "nt" and argv:
        resolved = shutil.which(argv[0])
        if resolved and resolved.lower().endswith((".cmd", ".bat")):
            argv = ["cmd.exe", "/d", "/s", "/c"] + argv

    cp = subprocess.run(
        argv,
        cwd=str(cwd) if cwd else None,
        text=True,
        capture_output=capture,
        shell=False,
    )
    if check and cp.returncode != 0:
        raise CmdError(cmd, cp.returncode, cp.stdout or "", cp.stderr or "")
    return cp
