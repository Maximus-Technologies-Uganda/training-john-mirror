#!/usr/bin/env node

/**
 * Stopwatch CLI Tool
 * A command-line stopwatch application
 */

import { runStopwatchCLI } from '../stopwatch/src/stopwatch-cli.js';

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('stopwatch.js')) {
  const exitCode = runStopwatchCLI(process.argv);
  if (Number.isInteger(exitCode)) {
    process.exit(exitCode);
  }
}
