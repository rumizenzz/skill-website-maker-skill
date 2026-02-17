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

  # Header nav: What -> Watch -> FAQ
  Invoke-PwCli run-code "(page) => page.getByRole('button', { name: 'What it does' }).first().click()"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(400)"
  Invoke-PwCli screenshot --filename "output/playwright/what-desktop.png" --full-page

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

  # Show player: verify lazy audio load
  Invoke-PwCli run-code "(page) => page.getByRole('button', { name: 'Watch' }).first().click()"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(600)"
  Invoke-PwCli run-code "(page) => page.evaluate(() => { const v=document.querySelector('video'); if(!v) throw new Error('video not found'); if(v.getAttribute('src')) throw new Error('expected video src to be empty before Play'); })"
  Invoke-PwCli screenshot --filename "output/playwright/show-before-play.png" --full-page

  Invoke-PwCli run-code "(page) => page.locator('#show').getByRole('button', { name: 'Play' }).first().click()"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(1200)"
  Invoke-PwCli run-code "(page) => page.evaluate(() => { const v=document.querySelector('video'); if(!v) throw new Error('video not found'); if(!v.getAttribute('src')) throw new Error('expected video src after Play'); if(v.currentTime <= 0) throw new Error('expected video to start playing'); })"
  Invoke-PwCli run-code "(page) => page.locator('#show').getByRole('button', { name: 'Skip intro' }).first().click()"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(300)"
  Invoke-PwCli run-code "(page) => page.evaluate(() => { const v=document.querySelector('video'); if(!v) throw new Error('video not found'); if(v.currentTime < 25) throw new Error('expected skip intro jump'); })"
  Invoke-PwCli screenshot --filename "output/playwright/show-after-play.png" --full-page

  # i18n: switch to Arabic and verify RTL
  Invoke-PwCli run-code "(page) => page.locator('header select').first().selectOption('ar')"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(600)"
  Invoke-PwCli run-code "(page) => page.evaluate(() => { if(document.documentElement.dir !== 'rtl') throw new Error('expected dir=rtl'); })"
  Invoke-PwCli screenshot --filename "output/playwright/home-ar-rtl.png" --full-page

  Invoke-PwCli resize 390 844
  Invoke-PwCli goto "http://localhost:4173"
  Invoke-PwCli run-code "(page) => page.waitForTimeout(300)"
  Invoke-PwCli screenshot --filename "output/playwright/home-mobile.png" --full-page

  Invoke-PwCli close-all
} finally {
  try { Stop-Process -Id $preview.Id -Force -ErrorAction SilentlyContinue } catch { }
}

Write-Host "Playwright artifacts written to output/playwright/"
