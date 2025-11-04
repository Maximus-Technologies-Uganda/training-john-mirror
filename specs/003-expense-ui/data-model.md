# Data Model: Expense UI Implementation

**Date**: November 2, 2025
**Feature**: Expense UI Implementation (Validation & Filters)

## Overview

This document defines the data structures and validation rules for the expense tracking UI. The model supports expense creation, storage, retrieval, and filtering operations.

## Core Entities

### Expense

Represents a single expense entry with all necessary attributes for tracking and filtering.

**Attributes**:
- `id`: `string` - Auto-generated unique identifier (implementation detail)
- `amount`: `number` - Amount in cents (integer, always positive)
- `description`: `string` - Expense description (1-200 characters)
- `month`: `string` - Full month name (January, February, March, April, May, June, July, August, September, October, November, December)
- `category`: `string` - Predefined category or custom input

**Validation Rules**:
- `amount`: Must be positive integer (cents), maximum 99999999 (999,999.99 USD)
- `description`: Required, non-empty, trimmed whitespace
- `month`: Must be one of the 12 full month names (case-sensitive)
- `category`: Required, non-empty, trimmed whitespace

**Uniqueness Constraints**:
- Composite key: (amount, description, month) - prevents duplicate entries
- Note: This allows same expense amounts in different months or with different descriptions

**Relationships**:
- Filtered by ExpenseFilter criteria
- Persisted to localStorage as JSON array

### ExpenseFilter

Represents filtering criteria for expense queries.

**Attributes**:
- `month?`: `string | undefined` - Filter by specific month (full month name)
- `category?`: `string | undefined` - Filter by specific category

**Validation Rules**:
- If provided, `month` must be valid month name
- If provided, `category` must be non-empty string
- At least one filter criterion should be provided for meaningful filtering

**Behavior**:
- `undefined` values mean "no filter" for that attribute
- Filters are combined with AND logic (must match all specified criteria)
- Empty results are valid (no expenses match the criteria)

## Derived Types

### ExpenseFormData

Input type for expense creation form (before cents conversion).

```typescript
interface ExpenseFormData {
  amount: string;      // Decimal format (e.g., "10.50")
  description: string;
  month: string;       // Full month name
  category: string;    // From dropdown or custom input
}
```

**Conversion Logic**:
- `amount`: Parse decimal string → multiply by 100 → round to nearest integer → store as cents

### ExpenseDisplayData

Type for expense display (after cents conversion).

```typescript
interface ExpenseDisplayData {
  id: string;
  amount: string;      // Formatted decimal (e.g., "10.50")
  description: string;
  month: string;
  category: string;
}
```

**Formatting Logic**:
- `amount`: Divide cents by 100 → format with 2 decimal places

## Predefined Values

### Categories

System provides these predefined categories with option for custom input:
- Food
- Transportation
- Entertainment
- Utilities
- Other

**Custom Category Rules**:
- Can be any non-empty string
- Stored as-is (no normalization)
- Filtering works with exact string matching

### Months

Fixed list of valid months (full names, title case):
- January, February, March, April, May, June
- July, August, September, October, November, December

## Data Storage Schema

### localStorage Structure

```json
{
  "expenses": [
    {
      "id": "exp-001",
      "amount": 1050,
      "description": "Coffee and pastry",
      "month": "January",
      "category": "Food"
    }
  ]
}
```

**Storage Rules**:
- JSON serialization of Expense array
- Key: `"expenses"`
- Persisted on every add/update operation
- Loaded on application startup
- Error handling for corrupted data

## Validation Logic

### Amount Validation

```typescript
// Input validation (decimal string)
const isValidAmountInput = (input: string): boolean => {
  const num = parseFloat(input);
  return !isNaN(num) && num > 0 && num <= 999999.99;
};

// Cents conversion
const toCents = (decimalString: string): number => {
  const num = parseFloat(decimalString);
  return Math.round(num * 100);
};
```

### Month Validation

```typescript
const VALID_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const isValidMonth = (month: string): boolean => {
  return VALID_MONTHS.includes(month);
};
```

### Uniqueness Validation

```typescript
const isDuplicateExpense = (
  newExpense: Omit<Expense, 'id'>,
  existingExpenses: Expense[]
): boolean => {
  return existingExpenses.some(expense =>
    expense.amount === newExpense.amount &&
    expense.description === newExpense.description &&
    expense.month === newExpense.month
  );
};
```

## Error Types

### ValidationError

```typescript
interface ValidationError {
  field: 'amount' | 'description' | 'month' | 'category';
  message: string;
  value: any;
}
```

**Common Error Messages**:
- Amount: "Amount must be a positive number"
- Description: "Description is required"
- Month: "Please select a valid month"
- Category: "Category is required"
- Duplicate: "This expense already exists"

## Migration Considerations

### Schema Evolution

- Current version: No explicit versioning
- Future versions: Consider adding version field to localStorage data
- Backward compatibility: Handle missing fields gracefully

### Data Integrity

- Validate all loaded expenses on startup
- Provide migration path for invalid data
- Consider backup/restore functionality for user data safety
