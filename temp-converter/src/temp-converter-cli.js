#!/usr/bin/env node

import { convertTemperature } from './temp-converter-core.js';

function printUsage() {
  console.log('Usage: node temp-converter-cli.js <value> --from <C|F> --to <C|F>');
  console.log('Example: node temp-converter-cli.js 0 --from C --to F');
}

function parseArgs(argv = process.argv) {
  const args = Array.isArray(argv) ? argv.slice(2) : [];
  let value = null;
  let from = null;
  let to = null;
  const positional = [];

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];

    if (token === '--value' && i + 1 < args.length) {
      value = args[i + 1];
      i += 1;
      continue;
    }

    if (token === '--from' && i + 1 < args.length) {
      from = args[i + 1];
      i += 1;
      continue;
    }

    if (token === '--to' && i + 1 < args.length) {
      to = args[i + 1];
      i += 1;
      continue;
    }

    positional.push(token);
  }

  if (value === null && positional.length > 0) {
    value = positional.shift();
  }

  if (from === null && positional.length > 0) {
    from = positional.shift();
  }

  if (to === null && positional.length > 0) {
    to = positional.shift();
  }

  return { value, from, to };
}

export function runCLI(argv = process.argv) {
  const { value, from, to } = parseArgs(argv);

  if (value === null || from === null || to === null) {
    printUsage();
    return 1;
  }

  const result = convertTemperature({ value, from, to });

  if (!result.success) {
    console.error(`Error: ${result.error}`);
    return 1;
  }

  console.log(result.data);
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('temp-converter-cli.js')) {
  const exitCode = runCLI(process.argv);
  if (Number.isInteger(exitCode)) {
    process.exit(exitCode);
  }
}
