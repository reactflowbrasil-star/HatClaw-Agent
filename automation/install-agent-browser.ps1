$ErrorActionPreference = 'Stop'
$PnpmRoot = Join-Path $env:LOCALAPPDATA 'pnpm'
$PnpmBin = Join-Path $PnpmRoot 'bin'

New-Item -ItemType Directory -Force -Path $PnpmRoot, $PnpmBin | Out-Null
$env:PNPM_HOME = $PnpmRoot
$env:Path = "$PnpmBin;$PnpmRoot;$env:Path"
[Environment]::SetEnvironmentVariable('PNPM_HOME', $PnpmRoot, 'User')

$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
foreach ($item in @($PnpmRoot, $PnpmBin)) {
    if (($userPath -split ';') -notcontains $item) {
        $userPath = ($userPath.TrimEnd(';') + ';' + $item).TrimStart(';')
    }
}
[Environment]::SetEnvironmentVariable('Path', $userPath, 'User')

corepack prepare pnpm@11.1.3 --activate
corepack pnpm add -g agent-browser@0.31.2

$agentBrowser = Get-Command agent-browser.cmd -ErrorAction SilentlyContinue
if (-not $agentBrowser) {
    $agentBrowser = Get-ChildItem -Path $PnpmRoot -Filter 'agent-browser.cmd' -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
}
if (-not $agentBrowser) {
    throw 'O executável agent-browser não foi instalado.'
}

& $agentBrowser.Source install
& $agentBrowser.Source --version
Write-Host 'agent-browser instalado e validado para o HatClaw.'
