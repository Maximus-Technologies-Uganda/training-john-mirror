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
  let invalid = false;

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === '--storage') {
      // Legacy flag retained for compatibility, but no storage is used here.
      if (i + 1 >= args.length) {
        invalid = true;
        break;
      }
      i += 1;
      continue;
    }

    command = token;
    break;
  }

  return { command, invalid };
}

function runCommand(command, stopwatch) {
  switch (command) {
    case 'start':
      if (stopwatch.isRunning) {
        console.log('Stopwatch is already running. Use "status" to view elapsed time.');
        return stopwatch;
      }
      const started = startStopwatch(stopwatch);
      console.log(`Stopwatch started at ${new Date().toLocaleTimeString()}`);
      return started;

    case 'stop':
      if (!stopwatch.isRunning) {
        console.log('Stopwatch has not been started. Use "start" to begin.');
        return stopwatch;
      }
      const stopped = stopStopwatch(stopwatch);
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
      console.log('Stopwatch reset');
      return reset;

    default:
      printUsage();
      return stopwatch;
  }
}

export function runStopwatchCLI(argv = process.argv) {
  const { command, invalid } = parseArguments(argv);

  if (invalid) {
    printUsage();
    return 1;
  }

  let stopwatch = createStopwatch();

  if (!command) {
    printUsage();
    return 0;
  }

  try {
    stopwatch = runCommand(command, stopwatch);
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

