import path from 'path';

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
import { createStopwatchStorage } from './stopwatch-storage.js';

const defaultTimeFile = path.join(process.cwd(), 'data/time.json');

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
  let storagePath = defaultTimeFile;
  let command = null;
  let rest = [];
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
    rest = args.slice(i + 1);
    break;
  }

  return { storagePath, command, rest, invalid };
}

function ensureStopwatch(state) {
  if (!state || typeof state !== 'object') {
    return createStopwatch();
  }

  const { startTime = null, isRunning = false, totalElapsed = 0 } = state;

  return {
    startTime,
    isRunning: Boolean(isRunning),
    totalElapsed: Number.isFinite(totalElapsed) ? totalElapsed : 0
  };
}

function handleStopCommand(stopwatch, storage) {
  if (!stopwatch.isRunning) {
    console.log('Stopwatch has not been started. Use "start" to begin.');
    return stopwatch;
  }

  const stopped = stopStopwatch(stopwatch);
  storage.save(stopped);

  const status = getStopwatchStatus(stopped);
  console.log(formatStopwatchOutput(status));
  return stopped;
}

function handleStatusCommand(stopwatch) {
  const status = getStopwatchStatus(stopwatch);
  console.log(formatStopwatchOutput(status));
}

export function runCLI(argv = process.argv) {
  const { storagePath, command, invalid } = parseArguments(argv);

  if (invalid) {
    printUsage();
    return 1;
  }

  const storage = createStopwatchStorage(storagePath);
  let stopwatch = ensureStopwatch(storage.load());

  if (!command) {
    printUsage();
    return 0;
  }

  try {
    switch (command) {
      case 'start':
        if (stopwatch.isRunning) {
          console.log('Stopwatch is already running. Use "status" to view elapsed time.');
          return 0;
        }
        stopwatch = startStopwatch(stopwatch);
        storage.save(stopwatch);
        console.log(`Stopwatch started at ${new Date().toLocaleTimeString()}`);
        return 0;

      case 'stop':
        stopwatch = handleStopCommand(stopwatch, storage);
        return 0;

      case 'status':
      case 'summary':
        handleStatusCommand(stopwatch);
        return 0;

      case 'lap':
        if (!stopwatch.isRunning) {
          console.log('Stopwatch has not been started. Use "start" to begin.');
          return 0;
        }
        console.log(`Lap time: ${formatElapsedTime(getElapsedTime(stopwatch))}`);
        return 0;

      case 'reset':
        stopwatch = resetStopwatch();
        storage.save(stopwatch);
        console.log('Stopwatch reset');
        return 0;

      default:
        printUsage();
        return 0;
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('stopwatch-cli.js')) {
  const exitCode = runCLI(process.argv);
  if (Number.isInteger(exitCode)) {
    process.exit(exitCode);
  }
}


