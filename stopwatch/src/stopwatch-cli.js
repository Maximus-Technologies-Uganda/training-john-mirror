#!/usr/bin/env node

import {
  createStopwatch,
  startStopwatch,
  stopStopwatch,
  getElapsedTime,
  resetStopwatch,
  getStopwatchStatus,
  formatElapsedTime,
  formatStopwatchOutput
} from './stopwatch-core.js';
import fs from 'fs';
import path from 'path';

function printUsage() {
  console.log('Usage: node stopwatch.js [--storage <path>] <command>');
  console.log('Commands:');
  console.log('  start    - Start the stopwatch');
  console.log('  stop     - Stop the stopwatch and show a summary');
  console.log('  status   - Show current status');
  console.log('  summary  - Alias for status');
  console.log('  lap      - Record a lap time');
  console.log('  reset    - Reset the stopwatch');
  console.log('Options:');
  console.log('  --storage <path> - Specify storage file path');
}

function parseArguments(argv = []) {
  const args = Array.isArray(argv) ? argv.slice(2) : [];
  let command = null;
  let storagePath = path.join(process.cwd(), 'data', 'time.json');
  let invalid = false;

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === '--storage') {
      if (i + 1 >= args.length) {
        invalid = true;
        break;
      }
      storagePath = args[i + 1];
      i += 1;
      continue;
    }

    command = token;
    break;
  }

  return { command, storagePath, invalid };
}

function loadStopwatch(storagePath) {
  try {
    if (!fs.existsSync(storagePath)) {
      return createStopwatch();
    }

    const raw = fs.readFileSync(storagePath, 'utf8');
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      startTime: parsed.startTime ?? null,
      isRunning: Boolean(parsed.isRunning),
      totalElapsed: Number.isFinite(parsed.totalElapsed) ? parsed.totalElapsed : 0
    };
  } catch {
    return createStopwatch();
  }
}

function saveStopwatch(storagePath, stopwatch) {
  try {
    const directory = path.dirname(storagePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const serialisable = {
      startTime: stopwatch.startTime,
      isRunning: stopwatch.isRunning,
      totalElapsed: stopwatch.totalElapsed
    };

    fs.writeFileSync(storagePath, JSON.stringify(serialisable, null, 2));
  } catch {
    // Ignore persistence failures for CLI usage
  }
}

function runCommand(command, stopwatch, storagePath) {
  switch (command) {
    case 'start':
      if (stopwatch.isRunning) {
        console.log('Stopwatch is already running. Use "status" to view elapsed time.');
        return stopwatch;
      }
      const started = startStopwatch(stopwatch);
      saveStopwatch(storagePath, started);
      console.log(`Stopwatch started at ${new Date().toLocaleTimeString()}`);
      return started;

    case 'stop':
      if (!stopwatch.isRunning) {
        console.log('Stopwatch has not been started. Use "start" to begin.');
        return stopwatch;
      }
      const stopped = stopStopwatch(stopwatch);
      saveStopwatch(storagePath, stopped);
      console.log('Stopwatch stopped');
      console.log(formatStopwatchOutput(getStopwatchStatus(stopped)));
      return stopped;

    case 'status':
    case 'summary':
      console.log(formatStopwatchOutput(getStopwatchStatus(stopwatch)));
      return stopwatch;

    case 'lap':
      if (!stopwatch.isRunning) {
        console.log('Stopwatch has not been started. Use "start" to begin.');
        return stopwatch;
      }
      console.log(`Lap time: ${formatElapsedTime(getElapsedTime(stopwatch))}`);
      return stopwatch;

    case 'reset':
      const reset = resetStopwatch();
      saveStopwatch(storagePath, reset);
      console.log('Stopwatch reset');
      return reset;

    default:
      printUsage();
      return stopwatch;
  }
}

export function runStopwatchCLI(argv = process.argv) {
  const { command, storagePath, invalid } = parseArguments(argv);

  if (invalid) {
    printUsage();
    return 0;
  }

  let _stopwatch = loadStopwatch(storagePath);
  if (!command) {
    printUsage();
    return 0;
  }

  try {
    _stopwatch = runCommand(command, _stopwatch, storagePath);
    return 0;
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('stopwatch-cli.js')) {
  const exitCode = runStopwatchCLI(process.argv);
  if (Number.isInteger(exitCode)) {
    process.exit(exitCode);
  }
}

