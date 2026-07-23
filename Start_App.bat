@echo off
title LabCollect Pro Launcher
cd /d "%~dp0"
echo Starting LabCollect Pro local server...
start http://localhost:8000

python --version >nul 2>&1
if %errorlevel% == 0 (
    python -m http.server 8000
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$l = New-Object System.Net.HttpListener; $l.Prefixes.Add('http://localhost:8000/'); $l.Start(); while ($l.IsListening) { $c = $l.GetContext(); $p = Join-Path (Get-Location) ($c.Request.Url.LocalPath -replace '^/',''); if (Test-Path $p -PathType Container) { $p = Join-Path $p 'index.html' }; if (Test-Path $p -PathType Leaf) { $b = [System.IO.File]::ReadAllBytes($p); $c.Response.ContentLength64 = $b.Length; $c.Response.OutputStream.Write($b, 0, $b.Length) } else { $c.Response.StatusCode = 404 }; $c.Response.Close() }"
)