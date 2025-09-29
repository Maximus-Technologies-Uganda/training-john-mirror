# Expense Tracker CLI

A command-line interface for managing personal expenses with category tracking and summary reports.

## Features

- Add new expenses with categories
- Track expenses by category
- Generate expense summaries
- Export expense data

## Installation

```bash
npm install
```

## Usage

```bash
# Add a new expense
node src/expenses-core.js add "Food" 25.50

# View expense summary
node src/expenses-core.js summary

# List all expenses
node src/expenses-core.js list
```

## API

### addExpense(expenses, category, amount)
Adds a new expense to the expenses array.

**Parameters:**
- `expenses` (Array): Array of expense objects
- `category` (string): Category of the expense
- `amount` (number): Amount of the expense

**Returns:** Updated expenses array

### summarizeExpenses(expenses)
Summarizes expenses by total and category.

**Parameters:**
- `expenses` (Array): Array of expense objects

**Returns:** Object with total and category breakdown

## Testing

```bash
npm test
```

## License

MIT
