import fs from 'fs';
import path from 'path';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { fileURLToPath } from 'url';
import { getExpenses } from './expense-core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.resolve(__dirname, '..', 'expenses.json');

function loadExpenses() {
  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error('Failed to load expenses data:', error.message);
    process.exit(1);
  }

  return [];
}

function _saveExpenses(expenses) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(expenses, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to save expenses data:', error.message);
    return false;
  }
}

function parseArgs(argv = process.argv) {
  const parser = yargs(hideBin(argv))
    .scriptName('expenses')
    .usage('Usage: $0 [options]')
    .option('month', {
      alias: 'm',
      type: 'number',
      describe: 'Filter expenses by month (1-12)'
    })
    .option('category', {
      alias: 'c',
      type: 'string',
      describe: 'Filter expenses by category'
    })
    .help('h')
    .alias('h', 'help')
    .version();

  return parser.parse();
}

function formatSummary(result, { month, category }) {
  const { summary } = result;
  const lines = [];

  if (Number.isInteger(month)) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    lines.push(`\nExpense Summary for ${monthNames[month - 1]}:`);
  } else {
    lines.push('\nExpense Summary:');
  }

  if (category) {
    lines.push(`Category: ${category}`);
  }

  lines.push(`Total: $${summary.total.toFixed(2)}`);

  const categories = Object.entries(summary.byCategory);
  if (categories.length === 0) {
    lines.push('No expenses found for the specified filters.');
  } else {
    lines.push('\nBy Category:');
    categories.forEach(([name, amount]) => {
      lines.push(`  ${name}: $${amount.toFixed(2)}`);
    });
  }

  return lines.join('\n');
}

export function run(argv = process.argv) {
  const args = parseArgs(argv);
  const { month, category } = args;
  const _allExpenses = loadExpenses();
  const result = getExpenses(_allExpenses, { month, category });

  if (result.success) {
    console.log(formatSummary(result.data, { month, category }));
    return 0;
  }

  console.error(result.error);
  return 1;
}

if (import.meta.url === `file://${process.argv[1]}` ||
    (process.argv[1] && import.meta.url.endsWith('expense-cli.js') && process.argv[1].endsWith('expense-cli.js'))) {
  const exitCode = run(process.argv);
  if (typeof exitCode === 'number') {
    process.exit(exitCode);
  }
}


