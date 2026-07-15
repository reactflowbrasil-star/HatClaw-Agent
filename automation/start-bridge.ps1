$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Venv = Join-Path $Root '.venv'
$ProjectRoot = Split-Path -Parent $Root
$PnpmRoot = Join-Path $env:LOCALAPPDATA 'pnpm'
$PnpmBin = Join-Path $PnpmRoot 'bin'
$env:Path = "$PnpmBin;$PnpmRoot;$env:Path"

$LocalAgentBrowser = Join-Path $ProjectRoot 'agent-browser-main\bin\agent-browser-win32-x64.exe'
if (-not (Get-Command agent-browser -ErrorAction SilentlyContinue) -and (Test-Path $LocalAgentBrowser)) {
    $env:AGENT_BROWSER_BIN = $LocalAgentBrowser
}
if (-not (Get-Command agent-browser -ErrorAction SilentlyContinue) -and -not $env:AGENT_BROWSER_BIN) {
    Write-Warning 'agent-browser não encontrado. Execute .\automation\install-agent-browser.ps1 para ativar o motor avançado.'
}

if (-not (Test-Path (Join-Path $Venv 'Scripts\python.exe'))) {
    python -m venv $Venv
}

& (Join-Path $Venv 'Scripts\python.exe') -m pip install -r (Join-Path $Root 'requirements.txt')
& (Join-Path $Venv 'Scripts\python.exe') (Join-Path $Root 'bridge.py')
