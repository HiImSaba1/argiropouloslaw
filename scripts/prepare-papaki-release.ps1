[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ReleaseRoot = Join-Path $ProjectRoot "artifacts\releases"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$Stage = Join-Path $ReleaseRoot "argiropouloslaw-papaki-$Timestamp"
$Archive = "$Stage.zip"

Set-Location -LiteralPath $ProjectRoot
New-Item -ItemType Directory -Force -Path $Stage | Out-Null

foreach ($Directory in @("public", "src")) {
    Copy-Item -LiteralPath (Join-Path $ProjectRoot $Directory) -Destination $Stage -Recurse
}

New-Item -ItemType Directory -Force -Path (Join-Path $Stage "scripts") | Out-Null
foreach ($Script in @("check-production-site.mjs", "prepare-standalone.mjs", "production-preflight.mjs")) {
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot $Script) -Destination (Join-Path $Stage "scripts")
}

foreach ($File in @(".env.example", "package.json", "package-lock.json", "next.config.ts", "postcss.config.mjs", "tsconfig.json", "start.js", "DEPLOYMENT.md")) {
    Copy-Item -LiteralPath (Join-Path $ProjectRoot $File) -Destination $Stage
}

Add-Type -AssemblyName System.IO.Compression
$ArchiveStream = [System.IO.File]::Open($Archive, [System.IO.FileMode]::CreateNew)
try {
    $Zip = [System.IO.Compression.ZipArchive]::new($ArchiveStream, [System.IO.Compression.ZipArchiveMode]::Create, $false)
    try {
        Get-ChildItem -LiteralPath $Stage -Recurse -File | ForEach-Object {
            $RelativePath = $_.FullName.Substring($Stage.Length).TrimStart("\", "/").Replace("\", "/")
            $Entry = $Zip.CreateEntry($RelativePath, [System.IO.Compression.CompressionLevel]::Optimal)
            $EntryStream = $Entry.Open()
            $SourceStream = [System.IO.File]::OpenRead($_.FullName)
            try { $SourceStream.CopyTo($EntryStream) }
            finally { $SourceStream.Dispose(); $EntryStream.Dispose() }
        }
    }
    finally { $Zip.Dispose() }
}
finally { $ArchiveStream.Dispose() }

$Hash = (Get-FileHash -LiteralPath $Archive -Algorithm SHA256).Hash
Set-Content -LiteralPath "$Archive.sha256" -Value "$Hash  $([System.IO.Path]::GetFileName($Archive))" -Encoding ascii

Write-Host "Papaki source release created: $Archive" -ForegroundColor Green
Write-Host "SHA-256: $Hash" -ForegroundColor Green
Write-Host "Secrets, .env.local files, SQL/XML exports, node_modules, .next, tests, caches, and WordPress artifacts are excluded."
