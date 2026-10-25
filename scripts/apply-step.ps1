param(
  [Parameter(Mandatory=$true)]
  [ValidateRange(1,7)]
  [int]$Step
)

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$stageDir = Join-Path $root ("_stages\{0:D2}" -f $Step)
if (-not (Test-Path $stageDir)) { throw "Cannot find stage: $stageDir" }
$files = Get-ChildItem $stageDir -Recurse -File
foreach ($file in $files) {
  $relative = $file.FullName.Substring($stageDir.Length).TrimStart('\')
  $destination = Join-Path $root $relative
  $directory = Split-Path $destination -Parent
  if (-not (Test-Path $directory)) { New-Item -ItemType Directory -Path $directory -Force | Out-Null }
  Copy-Item -Path $file.FullName -Destination $destination -Force
  Write-Host "  Updated: $relative" -ForegroundColor Green
}
Write-Host "Checkpoint $Step applied. Review the changes, then commit using COMMIT_GUIDE.md." -ForegroundColor Cyan
