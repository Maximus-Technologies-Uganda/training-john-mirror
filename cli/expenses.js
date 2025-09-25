const fs = require('fs');
const path = require('path');

const command = process.argv[2];
const amount = parseFloat(process.argv[3]);
const description = process.argv[4];
const expenseFile = path.join(__dirname, '../data/persistence/expenses.json');

// Helper function to read expenses
function getExpenses() {
    if (fs.existsSync(expenseFile)) {
        const content = fs.readFileSync(expenseFile);
        return JSON.parse(content);
    }
    return []; // Return empty array if file doesn't exist
}

// Helper function to save expenses
function saveExpenses(expenses) {
    fs.writeFileSync(expenseFile, JSON.stringify(expenses, null, 2));
}

// Main logic
switch (command) {
    case 'add':
        if (!amount || !description) {
            console.log('Usage: node src/expense.js add <amount> <description>');
            break;
        }
        const expenses = getExpenses();
        expenses.push({ description, amount });
        saveExpenses(expenses);
        console.log('Expense added.');
        break;

    case 'list':
        const allExpenses = getExpenses();
        if (allExpenses.length === 0) {
            console.log('No expenses recorded.');
        } else {
            console.log('All Expenses:');
            allExpenses.forEach(exp => {
                console.log(`- ${exp.description}: $${exp.amount.toFixed(2)}`);
            });
        }
        break;

    case 'total':
        const existingExpenses = getExpenses();
        const total = existingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        console.log(`Total expenses: $${total.toFixed(2)}`);
        break;

    default:
        console.log('Unknown command. Use "add", "list", or "total".');
        break;
}