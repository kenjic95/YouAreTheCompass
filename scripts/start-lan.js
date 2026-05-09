const os = require('os');
const { spawn } = require('child_process');

function getLanIp() {
  const interfaces = os.networkInterfaces();

  for (const entries of Object.values(interfaces)) {
    if (!entries) continue;
    for (const entry of entries) {
      if (
        entry &&
        entry.family === 'IPv4' &&
        !entry.internal &&
        !entry.address.startsWith('169.254.')
      ) {
        return entry.address;
      }
    }
  }

  return null;
}

const ip = getLanIp();

if (!ip) {
  console.error('Could not detect a LAN IPv4 address. Connect to Wi-Fi and try again.');
  process.exit(1);
}

console.log(`Using LAN IP: ${ip}`);

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: ip,
  EXPO_DEVTOOLS_LISTEN_ADDRESS: '0.0.0.0',
};

const expoCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(expoCmd, ['expo', 'start', '--host', 'lan', '--clear'], {
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
