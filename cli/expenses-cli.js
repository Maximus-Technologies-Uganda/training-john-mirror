import path from 'path';
import { addExpense, summarizeExpenses } from './src/expenses-core.js';
import { loadData, saveData } from './src/storage.js';

const expensesFilePath = path.join(process.cwd(), 'data', 'expenses.json');
const [command, category, amount] = process.argv.slice(2);

let expenses = loadData(expensesFilePath);

switch (command) {
  case 'add':
    const numericAmount = parseFloat(amount);
    expenses = addExpense(expenses, category, numericAmount);
    saveData(expenses, expensesFilePath);
    console.log(`Added expense: ${category} - $${numericAmount}`);
    break;

  case 'summary':
    const summary = summarizeExpenses(expenses);
    console.log('--- EXPENSE SUMMARY ---');
    console.log(`Total: $${summary.total.toFixed(2)}`);
    console.log('By Category:');
    for (const cat in summary.byCategory) {
      console.log(`- ${cat}: $${summary.byCategory[cat].toFixed(2)}`);
    }
    break;

  default:
    console.log('Usage: node expenses-cli.js <add|summary> [arguments]');
    break;
}
