/**
 * Unified Dev Runner
 * Menjalankan Backend Express Server & Frontend Vite secara simultan dalam 1 perintah.
 * Jika node_modules belum terpasang, skrip ini akan otomatis melakukan instalasi.
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const nodeModulesPath = path.join(rootDir, 'node_modules');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

const runCommand = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
      ...options
    });

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command ${command} ${args.join(' ')} exited with code ${code}`));
    });

    proc.on('error', (err) => reject(err));
  });
};

const startDev = async () => {
  console.log('\n🚀 [MultiCMS Unified Engine] Menyiapkan lingkungan pengembangan...\n');

  // 1. Cek apakah node_modules sudah ada, jika belum otomatis install
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 node_modules belum terpasang. Menjalankan "npm install" otomatis...');
    try {
      await runCommand(npmCmd, ['install']);
      console.log('✅ Dependensi berhasil dipasang!\n');
    } catch (err) {
      console.error('❌ Gagal memasang dependensi:', err.message);
      process.exit(1);
    }
  }

  console.log('🌟 Menjalankan Backend API Express & Frontend Vite bersamaan:');
  console.log('   👉 Frontend Web App:  http://127.0.0.1:3005');
  console.log('   👉 Backend Serverless: http://127.0.0.1:5005\n');

  // 2. Jalankan Backend Server (/server)
  const serverProc = spawn('node', ['server/index.js'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });

  // 3. Jalankan Frontend Vite
  const clientProc = spawn(npxCmd, ['vite'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });

  // Graceful shutdown handler saat Ctrl+C
  const cleanup = () => {
    console.log('\n🛑 Menghentikan seluruh proses dev server...');
    try {
      if (isWindows) {
        if (serverProc.pid) spawn('taskkill', ['/pid', serverProc.pid, '/f', '/t']);
        if (clientProc.pid) spawn('taskkill', ['/pid', clientProc.pid, '/f', '/t']);
      } else {
        serverProc.kill('SIGTERM');
        clientProc.kill('SIGTERM');
      }
    } catch {}
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  serverProc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[Backend Server] Berhenti dengan kode: ${code}`);
    }
  });

  clientProc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[Frontend Client] Berhenti dengan kode: ${code}`);
    }
  });
};

startDev();
