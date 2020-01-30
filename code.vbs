Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "code.cmd" & Chr(34), 0
Set WshShell = Nothing
