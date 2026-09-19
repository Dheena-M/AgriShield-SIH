' Double-click this (or the Desktop AgriShield icon). No commands. No black window.
Option Explicit
Dim sh, fs, root, ps1, cmd, url, http, timeoutSeconds, waitedSeconds, statusPath, statusText, exitCode
Set sh = CreateObject("WScript.Shell")
Set fs = CreateObject("Scripting.FileSystemObject")
root = fs.GetParentFolderName(WScript.ScriptFullName)
' Support launch from AgriShield-SIH-main\ wrapper folder
If Not fs.FileExists(root & "\scripts\agrishield-watchdog.ps1") Then
  If fs.FileExists(fs.GetParentFolderName(root) & "\scripts\agrishield-watchdog.ps1") Then
    root = fs.GetParentFolderName(root)
  End If
End If
ps1 = root & "\scripts\agrishield-watchdog.ps1"
statusPath = root & "\logs\launcher-status.txt"
If Not fs.FileExists(ps1) Then
  MsgBox "AgriShield watchdog missing:" & vbCrLf & ps1, 16, "AgriShield"
  WScript.Quit 1
End If

cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & ps1 & """"
url = "http://127.0.0.1:8000/api/health"
exitCode = sh.Run(cmd, 0, True)

timeoutSeconds = 50
waitedSeconds = 0
Do While waitedSeconds < timeoutSeconds
    Set http = CreateObject("WinHttp.WinHttpRequest.5.1")
    On Error Resume Next
    Err.Clear
    http.Open "GET", url, False
    http.Send
    If Err.Number = 0 And http.Status = 200 Then
        On Error GoTo 0
        Set http = Nothing
        sh.Run "http://127.0.0.1:8000/phone", 1, False
        WScript.Quit 0
    End If
    On Error GoTo 0
    WScript.Sleep 1000
    waitedSeconds = waitedSeconds + 1
Loop
Set http = Nothing

statusText = ""
If fs.FileExists(statusPath) Then
  statusText = Trim(fs.OpenTextFile(statusPath, 1).ReadAll())
End If
If statusText = "" Then statusText = "Server did not start. Open logs\watchdog.log for details."
MsgBox "AgriShield one-click failed." & vbCrLf & vbCrLf & statusText & vbCrLf & vbCrLf & "Watchdog exit: " & exitCode, 16, "AgriShield"
WScript.Quit 1
