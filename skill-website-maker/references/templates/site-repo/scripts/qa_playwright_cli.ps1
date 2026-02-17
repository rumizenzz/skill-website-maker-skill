$ErrorActionPreference = "Stop"

# Run from repo root.
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

New-Item -ItemType Directory -Force -Path "output\\playwright" | Out-Null

function Invoke-PwCli {
  param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$PwArgs
  )

  npx -y --package @playwright/cli playwright-cli @PwArgs
  if ($LASTEXITCODE -ne 0) {
    throw "playwright-cli failed: $($PwArgs -join ' ')"
  }
}

Write-Host "Starting preview server on http://localhost:4173 ..."
pnpm build
$previewCmd = "Set-Location -LiteralPath `"$repoRoot`"; pnpm preview -- --port 4173 --strictPort"
$preview = Start-Process -FilePath "powershell" -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $previewCmd) -WorkingDirectory $repoRoot -PassThru -WindowStyle Hidden

try {
  for ($i = 0; $i -lt 60; $i++) {
    if ((Test-NetConnection -ComputerName "localhost" -Port 4173).TcpTestSucceeded) { break }
    Start-Sleep -Milliseconds 500
  }

  Invoke-PwCli open "http://localhost:4173"
  Invoke-PwCli resize 1366 768
  Invoke-PwCli screenshot --filename "output/playwright/home-desktop.png" --full-page

  Invoke-PwCli run-code "(page) => page.getByRole('button', { name: 'Quickstart' }).first().click()"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(600)"
  Invoke-PwCli screenshot --filename "output/playwright/quickstart-desktop.png" --full-page

  Invoke-PwCli run-code "(page) => page.locator('#quickstart').getByRole('button', { name: 'Copy' }).first().click()"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(300)"
  Invoke-PwCli screenshot --filename "output/playwright/quickstart-copy.png" --full-page

  Invoke-PwCli run-code "(page) => page.locator('#demo').scrollIntoViewIfNeeded()"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(300)"
  Invoke-PwCli run-code "(page) => page.locator('#demo').getByRole('button', { name: 'Update available' }).click()"
  Invoke-PwCli run-code "(page) => page.locator('#demo').getByRole('button', { name: 'Play' }).click()"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(1200)"
  Invoke-PwCli screenshot --filename "output/playwright/demo-update.png" --full-page

  Invoke-PwCli resize 390 844
  Invoke-PwCli goto "http://localhost:4173"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(300)"
  Invoke-PwCli screenshot --filename "output/playwright/home-mobile.png" --full-page

  Invoke-PwCli close-all
} finally {
  try { Stop-Process -Id $preview.Id -Force -ErrorAction SilentlyContinue } catch { }
}

Write-Host "Playwright artifacts written to output/playwright/"
