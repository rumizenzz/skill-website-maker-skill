from __future__ import annotations

import subprocess
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
    cp = subprocess.run(
        list(cmd),
        cwd=str(cwd) if cwd else None,
        text=True,
        capture_output=capture,
        shell=False,
    )
    if check and cp.returncode != 0:
        raise CmdError(cmd, cp.returncode, cp.stdout or "", cp.stderr or "")
    return cp

