const os = require('os');
const { spawn } = require('child_process');

function getLanIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, entries] of Object.entries(interfaces)) {
    if (!entries) continue;
    for (const entry of entries) {
      if (
        entry &&
        entry.family === 'IPv4' &&
        !entry.internal &&
        !entry.address.startsWith('169.254.')
      ) {
        const lowerName = name.toLowerCase();
        const lowerAddress = entry.address.toLowerCase();
        const isVirtual =
          lowerName.includes('virtual') ||
          lowerName.includes('vmware') ||
          lowerName.includes('vbox') ||
          lowerName.includes('hyper-v') ||
          lowerName.includes('veth') ||
          lowerName.includes('docker') ||
          lowerAddress.startsWith('192.168.56.');

        const isPreferredAdapter =
          lowerName.includes('wi-fi') ||
          lowerName.includes('wifi') ||
          lowerName.includes('wlan') ||
          lowerName.includes('ethernet');

        const score = (isVirtual ? 0 : 100) + (isPreferredAdapter ? 20 : 0);
        candidates.push({ score, address: entry.address, name });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] ?? null;
}

const selected = getLanIp();
const ip = process.env.EXPO_LAN_IP || selected?.address || null;

if (!ip) {
  console.error('Could not detect a LAN IPv4 address. Connect to Wi-Fi and try again.');
  process.exit(1);
}

if (process.env.EXPO_LAN_IP) {
  console.log(`Using EXPO_LAN_IP override: ${ip}`);
} else {
  console.log(`Using LAN IP: ${ip}${selected ? ` (${selected.name})` : ''}`);
}

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: ip,
  EXPO_DEVTOOLS_LISTEN_ADDRESS: '0.0.0.0',
};

const child =
  process.platform === 'win32'
    ? spawn('cmd.exe', ['/d', '/s', '/c', 'npx expo start --host lan --clear'], {
        stdio: 'inherit',
        env,
      })
    : spawn('npx', ['expo', 'start', '--host', 'lan', '--clear'], {
        stdio: 'inherit',
        env,
      });

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
