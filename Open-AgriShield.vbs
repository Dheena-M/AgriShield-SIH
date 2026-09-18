' Double-click this (or the Desktop AgriShield icon). No commands. No black window.
Option Explicit
Dim sh, fs, root, ps1, cmd, url, http, timeoutSeconds, waitedSeconds
Set sh = CreateObject("WScript.Shell")
Set fs = CreateObject("Scripting.FileSystemObject")
root = fs.GetParentFolderName(WScript.ScriptFullName)
ps1 = root & "\scripts\agrishield-watchdog.ps1"
cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & ps1 & """"
url = "http://127.0.0.1:8000/api/health"

sh.Run cmd, 0, True

' Wait until the backend is actually listening; browsers opened too early can land on a blank/error tunnel page.
timeoutSeconds = 45
waitedSeconds = 0
Do While waitedSeconds < timeoutSeconds
    Set http = CreateObject("WinHttp.WinHttpRequest.5.1")
    On Error Resume Next
    http.Open "GET", url, False
    http.Send
    If Err.Number = 0 And http.Status = 200 Then
        Exit Do
    End If
    On Error GoTo 0
    WScript.Sleep 1000
    waitedSeconds = waitedSeconds + 1
Loop
Set http = Nothing

sh.Run "http://127.0.0.1:8000/phone", 1, False
