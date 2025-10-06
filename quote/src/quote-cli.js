import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { loadQuotes, getQuote as getQuoteResult, formatQuote } from './quote-core.js';

/**
 * Run the CLI. Returns an exit code. Does not call process.exit().
 * @param {string[]} argv
 * @returns {number}
 */
export function run(argv = process.argv) {
  const parser = yargs(hideBin(argv))
    .scriptName('quote')
    .usage('Usage: $0 [options]')
    .option('by', {
      type: 'string',
      describe: 'Filter quotes by author (case-insensitive)'
    })
    .help('h')
    .alias('h', 'help')
    .version();

  const args = parser.parse();
  const quotes = loadQuotes();
  const result = getQuoteResult({
    quotes,
    author: args.by,
    formatter: formatQuote
  });

  console.log(result.data);
  return result.success ? 0 : 1;
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}` ||
    (import.meta.url.endsWith('quote-cli.js') && process.argv[1] && process.argv[1].endsWith('quote-cli.js'))) {
  const code = run(process.argv);
  // Intentionally do not call process.exit to keep composability/testability
  // Propagate exit status for shells and CI
  if (typeof code === 'number') {
    process.exitCode = code;
  }
}


