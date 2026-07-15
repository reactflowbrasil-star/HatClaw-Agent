$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Venv = Join-Path $Root '.venv'

if (-not (Test-Path (Join-Path $Venv 'Scripts\python.exe'))) {
    python -m venv $Venv
}

& (Join-Path $Venv 'Scripts\python.exe') -m pip install -r (Join-Path $Root 'requirements.txt')
& (Join-Path $Venv 'Scripts\python.exe') (Join-Path $Root 'bridge.py')
