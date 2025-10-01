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

### Basic Commands

```bash
# Add a new expense
node src/expenses-core.js add "Food" 25.50
# Output: Added expense: Food - $25.5

# View expense summary
node src/expenses-core.js summary
# Output:
# Expense Summary:
# Total: $25.50
# By Category:
#   Food: $25.50

# List all expenses
node src/expenses-core.js list
# Output:
# All Expenses:
# 1. Food - $25.5 (10/30/2025)
```

### Filtering by Month

```bash
# Filter expenses by month (1-12)
node src/expenses-core.js summary --month 10
# Output:
# Expense Summary for October:
# Total: $25.50
# By Category:
#   Food: $25.50

# Filter by month using short flag
node src/expenses-core.js summary -m 3
# Output:
# Expense Summary for March:
# Total: $0.00
# By Category:
```

### Error Handling

```bash
# Invalid month (too high)
node src/expenses-core.js summary --month 13
# Output: Error: --month must be a number between 1 and 12
# Exit code: 1

# Invalid month (too low)
node src/expenses-core.js summary --month 0
# Output: Error: --month must be a number between 1 and 12
# Exit code: 1

# Invalid month (non-numeric)
node src/expenses-core.js summary --month abc
# Output: Error: --month must be a number between 1 and 12
# Exit code: 1

# Missing required arguments
node src/expenses-core.js add
# Output: [Help message with usage information]
# Exit code: 1
```

### Help and Examples

```bash
# Show help
node src/expenses-core.js --help
# Output:
# Usage: expenses-core.js <command> [options]
# 
# Commands:
#   expenses-core.js add <category> <amount>  Add a new expense
#   expenses-core.js summary                  Show expense summary
#   expenses-core.js list                     List all expenses
# 
# Options:
#   -m, --month    Filter by month (1-12)                 [number] [default: null]
#   -h, --help     Show help                                             [boolean]
#       --version  Show version number                                   [boolean]
```

## Features

- ✅ **Add Expenses**: Track expenses with categories and amounts
- ✅ **Month Filtering**: Filter expenses by month (1-12) with validation
- ✅ **Summary Reports**: View total expenses and breakdown by category
- ✅ **Data Persistence**: Expenses are automatically saved to `expenses.json`
- ✅ **Error Handling**: Clear error messages for invalid inputs
- ✅ **Help System**: Built-in help and usage information

## API

### CLI Commands

#### `add <category> <amount>`
Adds a new expense to the expense tracker.

**Parameters:**
- `category` (string): Category of the expense (e.g., "Food", "Transport")
- `amount` (number): Amount of the expense

**Example:**
```bash
node src/expenses-core.js add "Food" 25.50
```

#### `summary [--month <1-12>]`
Shows expense summary with optional month filtering.

**Options:**
- `--month, -m`: Filter by month (1-12). Validates input and shows error for invalid values.

**Examples:**
```bash
node src/expenses-core.js summary
node src/expenses-core.js summary --month 10
```

#### `list`
Lists all expenses with dates and categories.

### Programmatic API

#### `addExpense(expenses, category, amount)`
Adds a new expense to the expenses array.

**Parameters:**
- `expenses` (Array): Array of expense objects
- `category` (string): Category of the expense
- `amount` (number): Amount of the expense

**Returns:** Updated expenses array

#### `summarizeExpenses(expenses)`
Summarizes expenses by total and category.

**Parameters:**
- `expenses` (Array): Array of expense objects

**Returns:** Object with total and category breakdown

## Validation

The CLI includes robust input validation:

- **Month Validation**: The `--month` flag accepts only numbers between 1-12
- **Error Handling**: Invalid inputs return exit code 1 with clear error messages
- **Required Arguments**: Commands validate that required parameters are provided

### Validation Examples

```bash
# ✅ Valid month
node src/expenses-core.js summary --month 10

# ❌ Invalid month (too high)
node src/expenses-core.js summary --month 13
# Error: --month must be a number between 1 and 12

# ❌ Invalid month (too low)  
node src/expenses-core.js summary --month 0
# Error: --month must be a number between 1 and 12

# ❌ Non-numeric month
node src/expenses-core.js summary --month abc
# Error: --month must be a number between 1 and 12
```

## Testing

The project includes comprehensive table-driven tests covering:

- ✅ Month validation (valid and invalid inputs)
- ✅ CLI command functionality
- ✅ Error handling and exit codes
- ✅ Filtering by month
- ✅ Data persistence

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci
```

## License

MIT
