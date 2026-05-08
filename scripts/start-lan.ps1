$ErrorActionPreference = "Stop"

# Kill stale Metro/Expo node processes so ports and host settings are clean.
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

$ip = $null

try {
  $ip = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
      $_.InterfaceAlias -eq "Wi-Fi" -and
      $_.IPAddress -notlike "169.254.*" -and
      $_.IPAddress -ne "127.0.0.1"
    } |
    Select-Object -First 1 -ExpandProperty IPAddress
} catch {
  $ip = $null
}

if (-not $ip) {
  $ip = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
      $_.IPAddress -notlike "169.254.*" -and
      $_.IPAddress -ne "127.0.0.1" -and
      $_.PrefixOrigin -ne "WellKnown"
    } |
    Select-Object -First 1 -ExpandProperty IPAddress
}

if (-not $ip) {
  Write-Error "Could not detect a LAN IPv4 address. Connect to Wi-Fi and try again."
}

Write-Host "Using LAN IP: $ip"
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $ip
$env:EXPO_DEVTOOLS_LISTEN_ADDRESS = "0.0.0.0"

npx expo start --host lan --clear
