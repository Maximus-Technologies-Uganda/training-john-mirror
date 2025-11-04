# Quick Start: Expense UI Implementation

**Feature**: Expense UI Implementation (Validation & Filters)
**Date**: November 2, 2025
**Branch**: `003-expense-ui`

## Overview

This guide provides step-by-step instructions for implementing the expense tracking UI with robust validation and filtering capabilities.

## Prerequisites

- Node.js 18+ and npm
- Access to `apps/expense/core/` module
- Familiarity with React, TypeScript, and testing

## Project Setup

### 1. Navigate to UI Directory

```bash
cd apps/expense/ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Core Module Access

Ensure the expense core module is available:

```typescript
import { addExpense, getExpenses, filterExpenses } from '../../core';
```

## Implementation Steps

### Phase 1: Core Infrastructure

#### 1. Create Type Definitions

```typescript
// src/types/expense.ts
export interface Expense {
  id: string;
  amount: number; // cents
  description: string;
  month: string;
  category: string;
}

export interface ExpenseFilter {
  month?: string;
  category?: string;
}

export interface ExpenseFormData {
  amount: string; // decimal format
  description: string;
  month: string;
  category: string;
}
```

#### 2. Implement Utility Functions

```typescript
// src/utils/currency.ts
export const toCents = (decimalString: string): number => {
  const num = parseFloat(decimalString);
  return Math.round(num * 100);
};

export const fromCents = (cents: number): string => {
  return (cents / 100).toFixed(2);
};
```

#### 3. Create localStorage Hook

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### Phase 2: Core Components

#### 1. Add Expense Form

```typescript
// src/components/AddExpenseForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const expenseSchema = z.object({
  amount: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Amount must be a positive number'),
  description: z.string().min(1, 'Description is required'),
  month: z.enum(['January', 'February', /* ... all months */]),
  category: z.string().min(1, 'Category is required'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseFormProps {
  onAddExpense: (expense: ExpenseFormData) => void;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAddExpense }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmit = (data: ExpenseFormData) => {
    onAddExpense(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} role="form" aria-label="Add expense">
      <div>
        <label htmlFor="amount">Amount ($)</label>
        <input
          id="amount"
          type="text"
          placeholder="10.50"
          {...register('amount')}
          aria-describedby={errors.amount ? 'amount-error' : undefined}
        />
        {errors.amount && (
          <span id="amount-error" role="alert">{errors.amount.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          {...register('description')}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <span id="description-error" role="alert">{errors.description.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="month">Month</label>
        <select
          id="month"
          {...register('month')}
          aria-describedby={errors.month ? 'month-error' : undefined}
        >
          <option value="">Select month</option>
          {/* Add all months */}
        </select>
        {errors.month && (
          <span id="month-error" role="alert">{errors.month.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          {...register('category')}
          aria-describedby={errors.category ? 'category-error' : undefined}
        >
          <option value="">Select category</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <span id="category-error" role="alert">{errors.category.message}</span>
        )}
      </div>

      <button type="submit">Add Expense</button>
    </form>
  );
};
```

#### 2. Expense List Component

```typescript
// src/components/ExpenseList.tsx
import React from 'react';
import { Expense } from '../types/expense';
import { fromCents } from '../utils/currency';

interface ExpenseListProps {
  expenses: Expense[];
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <div role="status" aria-live="polite">
        No expenses found.
      </div>
    );
  }

  return (
    <table role="table" aria-label="Expense list">
      <thead>
        <tr>
          <th>Amount</th>
          <th>Description</th>
          <th>Month</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>${fromCents(expense.amount)}</td>
            <td>{expense.description}</td>
            <td>{expense.month}</td>
            <td>{expense.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

#### 3. Expense Filters Component

```typescript
// src/components/ExpenseFilters.tsx
import React from 'react';
import { ExpenseFilter as FilterType } from '../types/expense';

interface ExpenseFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleMonthChange = (month: string) => {
    onFiltersChange({
      ...filters,
      month: month || undefined,
    });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category || undefined,
    });
  };

  return (
    <div role="group" aria-label="Expense filters">
      <div>
        <label htmlFor="filter-month">Filter by Month</label>
        <select
          id="filter-month"
          value={filters.month || ''}
          onChange={(e) => handleMonthChange(e.target.value)}
        >
          <option value="">All Months</option>
          {/* Add all months */}
        </select>
      </div>

      <div>
        <label htmlFor="filter-category">Filter by Category</label>
        <select
          id="filter-category"
          value={filters.category || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
};
```

### Phase 3: Integration & Testing

#### 1. Main App Component

```typescript
// src/App.tsx
import React from 'react';
import { AddExpenseForm } from './components/AddExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseFilters } from './components/ExpenseFilters';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseFormData } from './types/expense';

export const App: React.FC = () => {
  const { expenses, filters, addExpense, setFilters, filteredExpenses } = useExpenses();

  const handleAddExpense = async (formData: ExpenseFormData) => {
    try {
      await addExpense(formData);
    } catch (error) {
      // Handle error (show toast, etc.)
      console.error('Failed to add expense:', error);
    }
  };

  return (
    <div>
      <h1>Expense Tracker</h1>

      <section aria-labelledby="add-expense-heading">
        <h2 id="add-expense-heading">Add Expense</h2>
        <AddExpenseForm onAddExpense={handleAddExpense} />
      </section>

      <section aria-labelledby="filter-expenses-heading">
        <h2 id="filter-expenses-heading">Filter Expenses</h2>
        <ExpenseFilters filters={filters} onFiltersChange={setFilters} />
      </section>

      <section aria-labelledby="expense-list-heading">
        <h2 id="expense-list-heading">Expenses</h2>
        <ExpenseList expenses={filteredExpenses} />
      </section>
    </div>
  );
};
```

#### 2. Custom Hook for Expenses

```typescript
// src/hooks/useExpenses.ts
import { useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Expense, ExpenseFilter, ExpenseFormData } from '../types/expense';
import { toCents } from '../utils/currency';
import { addExpense as coreAddExpense, filterExpenses as coreFilterExpenses } from '../../core';

export const useExpenses = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [filters, setFilters] = useState<ExpenseFilter>({});

  const addExpense = async (formData: ExpenseFormData) => {
    const expenseInput = {
      amount: toCents(formData.amount),
      description: formData.description.trim(),
      month: formData.month,
      category: formData.category.trim(),
    };

    const newExpense = await coreAddExpense(expenseInput);
    setExpenses([...expenses, newExpense]);
  };

  const filteredExpenses = useMemo(() => {
    if (!filters.month && !filters.category) {
      return expenses;
    }
    return coreFilterExpenses(expenses, filters);
  }, [expenses, filters]);

  return {
    expenses,
    filters,
    setFilters,
    addExpense,
    filteredExpenses,
  };
};
```

## Testing Setup

### 1. Component Test Example

```typescript
// src/components/AddExpenseForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddExpenseForm } from './AddExpenseForm';

test('validates required fields', async () => {
  const mockOnAdd = jest.fn();
  render(<AddExpenseForm onAddExpense={mockOnAdd} />);

  const submitButton = screen.getByRole('button', { name: /add expense/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
  });

  expect(mockOnAdd).not.toHaveBeenCalled();
});
```

### 2. E2E Test Example

```typescript
// e2e/expense-workflow.spec.ts
import { test, expect } from '@playwright/test';

test('complete expense workflow', async ({ page }) => {
  await page.goto('/');

  // Add expense
  await page.fill('[placeholder="10.50"]', '25.99');
  await page.fill('[placeholder="Description"]', 'Lunch');
  await page.selectOption('select', 'January');
  await page.selectOption('select', 'Food');
  await page.click('button:has-text("Add Expense")');

  // Verify expense appears
  await expect(page.locator('table')).toContainText('$25.99');
  await expect(page.locator('table')).toContainText('Lunch');
  await expect(page.locator('table')).toContainText('January');
  await expect(page.locator('table')).toContainText('Food');

  // Filter by category
  await page.selectOption('#filter-category', 'Food');
  await expect(page.locator('table')).toContainText('Lunch');

  // Filter by non-matching category
  await page.selectOption('#filter-category', 'Transportation');
  await expect(page.locator('text=No expenses found')).toBeVisible();
});
```

## Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

## Key Implementation Notes

1. **Accessibility**: All form elements include proper labels, ARIA attributes, and keyboard navigation
2. **Validation**: Client-side validation with clear error messages, server-side validation via core module
3. **Error Handling**: Graceful error handling with user feedback
4. **Performance**: Efficient filtering and rendering for up to 1000 expenses
5. **Persistence**: Automatic localStorage saving with error recovery

## Troubleshooting

- **Core module not found**: Ensure `apps/expense/core/` exists and exports required functions
- **TypeScript errors**: Check type definitions match the API contracts
- **Test failures**: Verify component queries use accessible selectors
- **localStorage issues**: Check browser storage quota and CORS settings
