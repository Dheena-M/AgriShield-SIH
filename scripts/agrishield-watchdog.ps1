# Starts AgriShield in the background if it is not already listening on all interfaces.
# Also starts Ollama (LLM) when the ollama program is installed.

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Port = 8000
$Py = Join-Path $Root ".venv\Scripts\python.exe"
$LogDir = Join-Path $Root "logs"
$WatchLog = Join-Path $LogDir "watchdog.log"
$PidFile = Join-Path $LogDir "agrishield.pid"

function Test-LanListening {
    try {
        $rows = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        if (-not $rows) { return $false }
        foreach ($row in $rows) {
            if ($row.LocalAddress -eq "0.0.0.0" -or $row.LocalAddress -eq "::" -or $row.LocalAddress -eq "::1") {
                if ($row.LocalAddress -eq "0.0.0.0" -or $row.LocalAddress -eq "::") { return $true }
            }
        }
        return $false
    } catch {
        return $false
    }
}

function Stop-OldServer {
    Get-CimInstance Win32_Process -Filter "Name = 'python.exe' OR Name = 'pythonw.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -and $_.CommandLine -match "uvicorn backend.app" } |
        ForEach-Object {
            "$(Get-Date -Format o) Stopping old uvicorn pid $($_.ProcessId)" | Add-Content $WatchLog
            Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
        }
}

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$ollamaCmd = Get-Command ollama -ErrorAction SilentlyContinue
if ($ollamaCmd) {
    $ollamaUp = Get-NetTCPConnection -LocalPort 11434 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $ollamaUp) {
        "$(Get-Date -Format o) Starting Ollama" | Add-Content $WatchLog
        Start-Process -FilePath $ollamaCmd.Source -ArgumentList "serve" -WindowStyle Hidden
    }
}

if (-not (Test-Path $Py)) {
    "$(Get-Date -Format o) Missing venv python at $Py" | Add-Content $WatchLog
    exit 1
}

if (Test-LanListening) {
    exit 0
}

Stop-OldServer
Start-Sleep -Milliseconds 800

$stamp = Get-Date -Format o
"$stamp Starting AgriShield on 0.0.0.0:$Port (phone Wi-Fi)" | Add-Content $WatchLog

$proc = Start-Process -FilePath $Py `
    -ArgumentList @("-m", "uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "$Port") `
    -WorkingDirectory $Root `
    -WindowStyle Hidden `
    -PassThru

$proc.Id | Set-Content $PidFile

for ($i = 0; $i -lt 40; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-LanListening) { exit 0 }
}

"$(Get-Date -Format o) Server did not bind 0.0.0.0:$Port" | Add-Content $WatchLog
exit 1
