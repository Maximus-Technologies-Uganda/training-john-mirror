import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';

/**
 * Adds a new expense to the expenses array.
 * @param {Array<Object>} expenses - The array of expense objects.
 * @param {string} category - The category of the expense.
 * @param {number} amount - The amount of the expense.
 * @returns {Array<Object>} The updated expenses array.
 */
export function addExpense(expenses, category, amount) {
  const newExpense = {
    category,
    amount,
    date: new Date().toISOString()
  };
  return [...expenses, newExpense];
}

/**
 * Summarizes a list of expenses by total and by category.
 * @param {Array<Object>} expenses - The array of expense objects.
 * @returns {Object} An object containing the total and a category breakdown.
 */
export function summarizeExpenses(expenses) {
  const summary = expenses.reduce((acc, expense) => {
    // Add to the total amount
    acc.total += expense.amount;

    // Add to the category amount
    acc.byCategory[expense.category] = (acc.byCategory[expense.category] || 0) + expense.amount;
    
    return acc;
  }, { total: 0, byCategory: {} }); // Initial value for the accumulator

  return summary;
}

// Data persistence functions
const dataFile = path.join(process.cwd(), 'expenses.json');

function loadExpenses() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading expenses:', error.message);
  }
  return [];
}

function saveExpenses(expenses) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(expenses, null, 2));
  } catch (error) {
    console.error('Error saving expenses:', error.message);
  }
}

// CLI interface
function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .command('add <category> <amount>', 'Add a new expense', (yargs) => {
      return yargs
        .positional('category', {
          describe: 'Category of the expense',
          type: 'string'
        })
        .positional('amount', {
          describe: 'Amount of the expense',
          type: 'number'
        });
    })
    .command('summary', 'Show expense summary')
    .command('list', 'List all expenses')
    .option('month', {
      alias: 'm',
      type: 'number',
      description: 'Filter by month (1-12)',
      default: null
    })
    .help('h')
    .alias('h', 'help')
    .version()
    .example('$0 add "Food" 25.50', 'Add a $25.50 food expense')
    .example('$0 summary', 'Show expense summary')
    .example('$0 summary --month 3', 'Show summary for March')
    .example('$0 list', 'List all expenses')
    .demandCommand(1, 'You need to specify a command')
    .argv;

  // Validate --month flag if provided
  if (argv.month !== null) {
    if (!Number.isInteger(argv.month) || argv.month < 1 || argv.month > 12) {
      console.error('Error: --month must be a number between 1 and 12');
      process.exit(1);
    }
  }

  const command = argv._[0];
  const expenses = loadExpenses();

  switch (command) {
    case 'add':
      const category = argv.category;
      const amount = argv.amount;
      
      if (!category || amount === undefined) {
        console.error('Error: Both category and amount are required for add command');
        process.exit(1);
      }
      
      const updatedExpenses = addExpense(expenses, category, amount);
      saveExpenses(updatedExpenses);
      console.log(`Added expense: ${category} - $${amount}`);
      break;
      
    case 'summary':
      let filteredExpenses = expenses;
      
      // Filter by month if --month flag is provided
      if (argv.month !== null) {
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() + 1 === argv.month; // getMonth() returns 0-11, so add 1
        });
      }
      
      const summary = summarizeExpenses(filteredExpenses);
      
      if (argv.month !== null) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        console.log(`\nExpense Summary for ${monthNames[argv.month - 1]}:`);
      } else {
        console.log('\nExpense Summary:');
      }
      
      console.log(`Total: $${summary.total.toFixed(2)}`);
      console.log('\nBy Category:');
      Object.entries(summary.byCategory).forEach(([category, amount]) => {
        console.log(`  ${category}: $${amount.toFixed(2)}`);
      });
      break;
      
    case 'list':
      if (expenses.length === 0) {
        console.log('No expenses found.');
      } else {
        console.log('\nAll Expenses:');
        expenses.forEach((expense, index) => {
          const date = new Date(expense.date).toLocaleDateString();
          console.log(`${index + 1}. ${expense.category} - $${expense.amount} (${date})`);
        });
      }
      break;
      
    default:
      console.error('Error: Unknown command. Use --help for usage information.');
      process.exit(1);
  }
}

// Run CLI if this file is executed directly (not when imported by tests)
if (import.meta.url === `file://${process.argv[1]}` || 
    (import.meta.url.endsWith('expenses-core.js') && process.argv[1] && process.argv[1].endsWith('expenses-core.js'))) {
  main();
}
