Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "Stopping Gradle daemons..." -ForegroundColor Yellow
Set-Location -Path "android"
\.\gradlew --stop
Set-Location -Path ..

Write-Host "Removing corrupted NDK 27.0.12077973..." -ForegroundColor Yellow
$ndkPath = "C:\Users\abrar\AppData\Local\Android\Sdk\ndk\27.0.12077973"
if (Test-Path $ndkPath) {
    Remove-Item -Recurse -Force $ndkPath
    Write-Host "Removed: $ndkPath" -ForegroundColor Green
} else {
    Write-Host "NDK 27.0.12077973 not found (already removed)" -ForegroundColor Green
}

Write-Host "Cleaning Android build..." -ForegroundColor Yellow
Set-Location -Path "android"
.\gradlew clean
Set-Location -Path ..

Write-Host "Building and installing app..." -ForegroundColor Yellow
npx react-native run-android

Write-Host "Done!" -ForegroundColor Green
