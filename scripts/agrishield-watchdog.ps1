# Starts AgriShield in the background if it is not already listening.
# Also starts Ollama (LLM) when the ollama program is installed.

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Port = 8000
$LogDir = Join-Path $Root "logs"
$WatchLog = Join-Path $LogDir "watchdog.log"
$ErrLog = Join-Path $LogDir "server-start.err.log"
$PidFile = Join-Path $LogDir "agrishield.pid"
$StatusFile = Join-Path $LogDir "launcher-status.txt"

function Write-Log([string]$msg) {
    $line = "{0} {1}" -f (Get-Date -Format o), $msg
    Add-Content -Path $WatchLog -Value $line
}

function Write-Status([string]$msg) {
    Set-Content -Path $StatusFile -Value $msg -Encoding UTF8
}

function Resolve-AgriPython {
    $candidates = @(
        (Join-Path $Root ".venv-ml\Scripts\python.exe"),
        (Join-Path $Root ".venv\Scripts\python.exe"),
        (Join-Path $Root ".venv-ml\Scripts\pythonw.exe"),
        (Join-Path $Root ".venv\Scripts\pythonw.exe")
    )
    foreach ($py in $candidates) {
        if (-not (Test-Path $py)) { continue }
        $probe = & $py -c "import fastapi, uvicorn; print('ok')" 2>$null
        if ($LASTEXITCODE -eq 0 -and ("$probe" -match "ok")) {
            return $py
        }
        Write-Log ("Skip broken python (missing fastapi/uvicorn): " + $py)
    }
    $cmd = Get-Command python -ErrorAction SilentlyContinue
    if ($cmd) {
        $probe = & $cmd.Source -c "import fastapi, uvicorn; print('ok')" 2>$null
        if ($LASTEXITCODE -eq 0 -and ("$probe" -match "ok")) {
            return $cmd.Source
        }
    }
    return $null
}

function Test-PortListening {
    try {
        $rows = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        if (-not $rows) { return $false }
        foreach ($row in $rows) {
            if ($row.LocalAddress -in @("0.0.0.0", "::", "127.0.0.1", "::1")) {
                return $true
            }
        }
        return $false
    } catch {
        return $false
    }
}

function Test-HttpHealth {
    try {
        $uri = "http://127.0.0.1:{0}/api/health" -f $Port
        $r = Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 2
        return ($r.StatusCode -eq 200)
    } catch {
        return $false
    }
}

function Stop-OldServer {
    Get-CimInstance Win32_Process -Filter "Name = 'python.exe' OR Name = 'pythonw.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -and $_.CommandLine -match "uvicorn backend\.app" } |
        ForEach-Object {
            Write-Log ("Stopping old uvicorn pid " + $_.ProcessId)
            Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
        }
}

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$ollamaCmd = Get-Command ollama -ErrorAction SilentlyContinue
if ($ollamaCmd) {
    $ollamaUp = Get-NetTCPConnection -LocalPort 11434 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $ollamaUp) {
        Write-Log "Starting Ollama"
        Start-Process -FilePath $ollamaCmd.Source -ArgumentList "serve" -WindowStyle Hidden
    }
}

$Py = Resolve-AgriPython
if (-not $Py) {
    $msg = "No working Python with FastAPI/uvicorn. Run: .venv-ml\Scripts\python.exe -m pip install -r requirements.txt"
    Write-Log $msg
    Write-Status ("ERROR: " + $msg)
    exit 1
}
Write-Log ("Using python: " + $Py)
Write-Status ("Starting with " + $Py)

if ((Test-PortListening) -and (Test-HttpHealth)) {
    Write-Status "OK already running"
    exit 0
}

if (Test-PortListening) {
    Write-Log ("Port " + $Port + " in use but /api/health failed - restarting")
    Stop-OldServer
    Start-Sleep -Milliseconds 1000
}

Stop-OldServer
Start-Sleep -Milliseconds 600

Write-Log ("Starting AgriShield on 0.0.0.0:" + $Port + " (phone Wi-Fi)")
if (Test-Path $ErrLog) { Remove-Item $ErrLog -Force -ErrorAction SilentlyContinue }

$proc = Start-Process -FilePath $Py `
    -ArgumentList @("-m", "uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "$Port") `
    -WorkingDirectory $Root `
    -WindowStyle Hidden `
    -RedirectStandardError $ErrLog `
    -PassThru

Set-Content -Path $PidFile -Value $proc.Id

for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Milliseconds 500
    if ((Test-PortListening) -and (Test-HttpHealth)) {
        Write-Status "OK"
        Write-Log ("Server healthy on port " + $Port)
        exit 0
    }
    if ($proc.HasExited) {
        $tail = ""
        if (Test-Path $ErrLog) { $tail = Get-Content $ErrLog -Raw -ErrorAction SilentlyContinue }
        Write-Log ("Server process exited early. Exit=" + $proc.ExitCode + ". Err=" + $tail)
        Write-Status "ERROR: Server crashed on start. See logs/server-start.err.log"
        exit 1
    }
}

$tail = ""
if (Test-Path $ErrLog) {
    $lines = @(Get-Content $ErrLog -Tail 20 -ErrorAction SilentlyContinue)
    $tail = [string]::Join(" // ", $lines)
}
Write-Log ("Server did not become healthy on :" + $Port + ". " + $tail)
Write-Status ("ERROR: Server did not start on port " + $Port + ". See logs/watchdog.log")
exit 1
