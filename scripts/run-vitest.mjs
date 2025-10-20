import { mkdirSync, existsSync, rmSync, cpSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';

async function buildCoverageIndex() {
  try {
    await import('./create-coverage-index.mjs');
  } catch (error) {
    console.warn('Failed to generate coverage index:', error instanceof Error ? error.message : error);
  }
}

const cwd = process.cwd();

const createDir = (relativePath) => {
  const dir = resolve(cwd, relativePath);
  mkdirSync(dir, { recursive: true });
};

createDir('test-results');
createDir('review-artifacts');

function copyDir(source, destination) {
  try {
    rmSync(destination, { recursive: true, force: true });
    cpSync(source, destination, { recursive: true });
  } catch (error) {
    console.warn(`Failed to copy coverage from ${source} to ${destination}:`, error instanceof Error ? error.message : error);
  }
}

function copyCoverageArtifacts() {
  const workspaceCoverage = resolve(cwd, 'coverage');
  const artifactsRoot = resolve(cwd, 'review-artifacts');

  if (existsSync(workspaceCoverage) && statSync(workspaceCoverage).isDirectory()) {
    copyDir(workspaceCoverage, join(artifactsRoot, 'coverage'));

    const summaryPath = join(workspaceCoverage, 'coverage-summary.json');
    if (existsSync(summaryPath)) {
      try {
        cpSync(summaryPath, join(artifactsRoot, 'coverage-summary.json'));
      } catch (error) {
        console.warn('Failed to copy root coverage summary:', error instanceof Error ? error.message : error);
      }
    }
  }
}

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
  Promise.resolve()
    .then(() => copyCoverageArtifacts())
    .then(() => buildCoverageIndex())
    .finally(() => {
      process.exit(code ?? 1);
    });
});
