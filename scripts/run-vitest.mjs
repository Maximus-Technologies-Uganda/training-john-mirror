import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const cwd = process.cwd();

const createDir = (relativePath) => {
  const dir = resolve(cwd, relativePath);
  mkdirSync(dir, { recursive: true });
};

createDir('test-results');
createDir('review-artifacts');

const rawArgs = process.argv.slice(2).filter((arg) => arg !== '--');

let needsRunCommand = true;
let needsCoverageFlag = true;
const forwardedArgs = rawArgs.map((arg) => {
  if (arg === 'run' && needsRunCommand) {
    needsRunCommand = false;
    return arg;
  }

  if (arg.startsWith('--coverage') && needsCoverageFlag) {
    needsCoverageFlag = false;
    return arg;
  }

  return arg;
});

const vitestArgs = [];

if (needsRunCommand) {
  vitestArgs.push('run');
}

if (needsCoverageFlag) {
  vitestArgs.push('--coverage');
}

vitestArgs.push(...forwardedArgs);

const vitestProcess = spawn(process.execPath, ['node_modules/vitest/vitest.mjs', ...vitestArgs], {
  stdio: 'inherit',
  cwd,
});

vitestProcess.on('close', (code) => {
  process.exit(code ?? 1);
});
