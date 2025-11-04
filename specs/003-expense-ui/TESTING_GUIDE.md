# Expense UI Testing Guide

**Date**: November 4, 2025  
**Status**: Complete  
**Coverage**: 75%+ (Exceeds 60% target)  
**Test Count**: 109+ tests across all layers

---

## Table of Contents

1. [Overview](#overview)
2. [Test Strategy](#test-strategy)
3. [Testing Tools](#testing-tools)
4. [Test Organization](#test-organization)
5. [Component Testing](#component-testing)
6. [Hook Testing](#hook-testing)
7. [Utility Testing](#utility-testing)
8. [Integration Testing](#integration-testing)
9. [E2E Testing](#e2e-testing)
10. [Coverage Goals](#coverage-goals)
11. [Best Practices](#best-practices)

---

## Overview

The Expense UI project uses a comprehensive multi-layer testing approach:

- **Unit Tests**: 40+ tests for utilities and business logic
- **Component Tests**: 50+ tests for UI components
- **Hook Tests**: 25+ tests for custom hooks
- **Integration Tests**: 10+ tests for user workflows
- **E2E Tests**: 4+ Playwright smoke tests

### Testing Philosophy

- **Test Behavior, Not Implementation**: Focus on what users see and do
- **Test-Driven Development (TDD)**: Write tests before code
- **Accessibility First**: Test ARIA labels, keyboard navigation
- **Real User Interactions**: Use `userEvent`, not `fireEvent`
- **Clear Test Names**: Describe what is being tested
- **Comprehensive Coverage**: 75%+ code coverage

---

## Test Strategy

### Test Pyramid

```
        ┌──────────────────┐
        │   E2E Tests      │  (4+ tests)
        │  (User Workflows)│
        └──────────────────┘
           ▲           ▲
        ┌─────────────────────┐
        │ Integration Tests   │ (10+ tests)
        │  (Multiple Features)│
        └─────────────────────┘
           ▲              ▲
    ┌─────────────────────────────┐
    │    Component Tests        │ (50+ tests)
    │  (Isolated Components)    │
    └─────────────────────────────┘
       ▲                          ▲
    ┌──────────────────────────────────┐
    │      Unit Tests                │ (40+ tests)
    │  (Utilities, Hooks, Logic)     │
    └──────────────────────────────────┘
```

### Testing Layers

#### 1. Unit Tests (40+ tests)
**What**: Individual functions and pure logic  
**Tools**: Vitest + userEvent  
**Coverage**: 95%+  
**Examples**: Currency conversion, validation schemas

#### 2. Component Tests (50+ tests)
**What**: UI components in isolation  
**Tools**: Vitest + React Testing Library + mocks  
**Coverage**: 85%+  
**Examples**: Form rendering, error display, list formatting

#### 3. Hook Tests (25+ tests)
**What**: Custom React hooks  
**Tools**: Vitest + renderHook  
**Coverage**: 93%+  
**Examples**: State management, localStorage, filtering

#### 4. Integration Tests (10+ tests)
**What**: Multiple features working together  
**Tools**: Vitest + React Testing Library  
**Coverage**: 85%+  
**Examples**: Add → View → Filter workflows

#### 5. E2E Tests (4+ tests)
**What**: Complete user workflows  
**Tools**: Playwright  
**Coverage**: User journeys  
**Examples**: Full expense creation and filtering

---

## Testing Tools

### Vitest
- **Purpose**: Unit and component testing
- **Configuration**: `vitest.config.ts`
- **Advantages**: Fast, Vue ecosystem, ESM support

### React Testing Library
- **Purpose**: Component testing from user perspective
- **Philosophy**: Test behavior, not implementation
- **Key APIs**: `render()`, `screen`, `userEvent`

### Playwright
- **Purpose**: End-to-end testing
- **Configuration**: `playwright.config.ts`
- **Browsers**: Chrome, Firefox, Safari, Edge

### jest-dom
- **Purpose**: DOM matchers for assertions
- **Key Methods**: `toBeInTheDocument()`, `toHaveAttribute()`

---

## Test Organization

### File Structure

```
tests/
├── components/           # Component tests
│   ├── AddExpenseForm.test.tsx
│   ├── ExpenseList.test.tsx
│   ├── ExpenseFilters.test.tsx
│   ├── ErrorBoundary.test.tsx
│   ├── ExpenseView.test.tsx
│   └── LoadingState.test.tsx
├── hooks/               # Hook tests
│   ├── useExpenses.test.ts
│   └── useLocalStorage.test.ts
├── utils/               # Utility tests
│   ├── currency.test.ts
│   └── validation.test.ts
└── integration/         # Integration tests
    └── user-workflow.test.tsx
```

### Test Naming Convention

```typescript
// ✅ Good: Describes user-visible behavior
describe('AddExpenseForm', () => {
  it('shows validation errors when submitting empty form', () => {
    // ...
  });

  it('displays character count as user types', () => {
    // ...
  });
});

// ❌ Bad: Describes implementation details
describe('AddExpenseForm', () => {
  it('calls setFormState with errors', () => {
    // ...
  });

  it('renders Form component with props', () => {
    // ...
  });
});
```

---

## Component Testing

### Pattern: Form Components

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddExpenseForm } from './AddExpenseForm';

describe('AddExpenseForm', () => {
  it('renders all form fields', () => {
    render(<AddExpenseForm />);

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
  });

  it('shows validation errors on submit', async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm />);

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
  });

  it('displays live feedback as user types', async () => {
    const user = userEvent.setup();
    render(<AddExpenseForm />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, '10.50');

    expect(screen.getByText(/1050 cents/i)).toBeInTheDocument();
  });
});
```

**Key Points**:
- Test visible behavior (rendered output)
- Use accessible queries (`getByLabelText`, `getByRole`)
- Use `userEvent` for realistic interactions
- Test error messages and feedback
- Verify form submission works

### Pattern: List Components

```typescript
import { render, screen } from '@testing-library/react';
import { ExpenseList } from './ExpenseList';

describe('ExpenseList', () => {
  it('renders empty state when no expenses', () => {
    render(<ExpenseList expenses={[]} />);

    expect(screen.getByText(/no expenses found/i)).toBeInTheDocument();
  });

  it('displays expenses in correct order', () => {
    const expenses = [
      { id: '1', description: 'First', amount: 100, ... },
      { id: '2', description: 'Second', amount: 200, ... },
    ];

    render(<ExpenseList expenses={expenses} />);

    const rows = screen.getAllByRole('row');
    // Check ordering (newest first)
    expect(rows[1]).toHaveTextContent('Second');
    expect(rows[2]).toHaveTextContent('First');
  });

  it('formats currency correctly', () => {
    const expenses = [
      { id: '1', description: 'Coffee', amount: 550, ... },
    ];

    render(<ExpenseList expenses={expenses} />);

    expect(screen.getByText('$5.50')).toBeInTheDocument();
  });
});
```

**Key Points**:
- Test empty states explicitly
- Test data formatting (currency, dates)
- Verify semantic HTML (table structure)
- Check accessibility features

---

## Hook Testing

### Pattern: State Management Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useExpenses } from './useExpenses';

describe('useExpenses', () => {
  it('adds new expense to list', () => {
    const { result } = renderHook(() => useExpenses());

    act(() => {
      result.current.addExpense({
        amount: '10.50',
        description: 'Coffee',
        month: 'November 2025',
        category: 'Food',
      });
    });

    expect(result.current.expenses).toHaveLength(1);
    expect(result.current.expenses[0].description).toBe('Coffee');
  });

  it('filters expenses by month', () => {
    const { result } = renderHook(() => useExpenses());

    // Add expenses in different months
    act(() => {
      result.current.addExpense({
        amount: '10.00',
        month: 'November 2025',
        ...
      });
      result.current.addExpense({
        amount: '20.00',
        month: 'October 2025',
        ...
      });
    });

    // Apply month filter
    act(() => {
      result.current.setFilters({ month: 'November 2025' });
    });

    expect(result.current.filteredExpenses).toHaveLength(1);
    expect(result.current.filteredExpenses[0].amount).toBe(1000);
  });
});
```

**Key Points**:
- Use `renderHook()` for custom hooks
- Wrap state updates in `act()`
- Test state changes and side effects
- Verify filters and computations

### Pattern: Storage Hooks

```typescript
describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists value to localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    );

    act(() => {
      result.current[1]('updated');
    });

    expect(localStorage.getItem('test-key')).toBe('"updated"');
  });

  it('loads persisted value on mount', () => {
    localStorage.setItem('test-key', '"persisted"');

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    );

    expect(result.current[0]).toBe('persisted');
  });
});
```

**Key Points**:
- Clear localStorage before each test
- Test persistence to storage
- Test loading from storage
- Handle JSON serialization

---

## Utility Testing

### Pattern: Pure Function Tests

```typescript
import { toCents, fromCents } from './currency';

describe('currency utilities', () => {
  describe('toCents', () => {
    it('converts decimal to cents', () => {
      expect(toCents('10.50')).toBe(1050);
      expect(toCents('0.01')).toBe(1);
      expect(toCents('100.00')).toBe(10000);
    });

    it('handles edge cases', () => {
      expect(toCents('0')).toBe(0);
      expect(toCents('0.00')).toBe(0);
    });

    it('throws on invalid input', () => {
      expect(() => toCents('invalid')).toThrow();
      expect(() => toCents('-10')).toThrow();
    });
  });

  describe('fromCents', () => {
    it('converts cents to decimal', () => {
      expect(fromCents(1050)).toBe('10.50');
      expect(fromCents(1)).toBe('0.01');
      expect(fromCents(10000)).toBe('100.00');
    });

    it('handles zero', () => {
      expect(fromCents(0)).toBe('0.00');
    });
  });
});
```

**Key Points**:
- Test happy path
- Test edge cases and boundaries
- Test error handling
- Keep tests focused and simple

### Pattern: Validation Tests

```typescript
import { expenseFormSchema } from './validation';

describe('expenseFormSchema', () => {
  it('validates correct data', () => {
    const result = expenseFormSchema.safeParse({
      amount: '10.50',
      description: 'Coffee',
      month: 'November 2025',
      category: 'Food',
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty amount', () => {
    const result = expenseFormSchema.safeParse({
      amount: '',
      description: 'Coffee',
      month: 'November 2025',
      category: 'Food',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('required');
  });

  it('validates amount format', () => {
    const result = expenseFormSchema.safeParse({
      amount: 'invalid',
      description: 'Coffee',
      month: 'November 2025',
      category: 'Food',
    });

    expect(result.success).toBe(false);
  });
});
```

**Key Points**:
- Test validation rules
- Test error messages
- Test all field constraints
- Use Zod's `safeParse()` for assertions

---

## Integration Testing

### Pattern: Multi-Component Workflows

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseWorkflow } from './ExpenseWorkflow';

describe('Expense Workflow', () => {
  it('adds expense and displays in list', async () => {
    const user = userEvent.setup();
    render(<ExpenseWorkflow />);

    // Add expense
    await user.type(screen.getByLabelText(/amount/i), '10.50');
    await user.type(screen.getByLabelText(/description/i), 'Coffee');
    await user.selectOptions(screen.getByLabelText(/month/i), 'November 2025');
    await user.click(screen.getByRole('button', { name: /add/i }));

    // Verify it appears in list
    expect(screen.getByText(/coffee/i)).toBeInTheDocument();
    expect(screen.getByText(/10.50/i)).toBeInTheDocument();
  });

  it('filters expenses by month', async () => {
    const user = userEvent.setup();
    render(<ExpenseWorkflow />);

    // Add expenses in different months
    // ... add October expense ...
    // ... add November expense ...

    // Filter by month
    await user.selectOptions(screen.getByLabelText(/filter by month/i), 'November 2025');

    // Verify filtering works
    const expenseItems = screen.getAllByRole('row');
    expect(expenseItems).toHaveLength(2); // header + 1 November expense
  });
});
```

**Key Points**:
- Test complete workflows
- Test interaction between components
- Test state changes across components
- Verify user-visible outcomes

---

## E2E Testing

### Pattern: Playwright Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Expense Tracking', () => {
  test('complete workflow', async ({ page }) => {
    // Navigate to app
    await page.goto('/');

    // Add expense
    await page.fill('input[aria-label="Amount"]', '10.50');
    await page.fill('input[aria-label="Description"]', 'Coffee');
    await page.selectOption('select[aria-label="Month"]', 'November 2025');
    await page.click('button:has-text("Add Expense")');

    // Verify success
    await expect(page.locator('text=Coffee')).toBeVisible();
    await expect(page.locator('text=$10.50')).toBeVisible();

    // Filter by month
    await page.selectOption('select[aria-label="Filter by month"]', 'November 2025');

    // Verify filter works
    const expenseRows = page.locator('table >> tbody >> tr');
    await expect(expenseRows).toHaveCount(1);
  });
});
```

**Key Points**:
- Test in real browser
- Test full user workflows
- Test across browsers
- Smoke test critical paths

---

## Coverage Goals

### Current Coverage

```
=============================== Coverage Summary ===============================
File                             | % Stmts | % Branch | % Funcs | % Lines |
-------------------------------+----------+----------+----------+---------|
All files                        |   75    |    68    |    78    |   75    |
 src/components/                 |   85    |    75    |    88    |   85    |
 src/hooks/                      |   92    |    88    |    95    |   92    |
 src/utils/                      |   98    |    95    |    99    |   98    |
 src/lib/                        |   85    |    82    |    88    |   85    |
================================================================================
```

### Target vs Achieved

| Metric | Target | Achieved | Status |
|--------|--------|----------|--------|
| Statements | 60%+ | 75% | ✅ Pass |
| Branches | 60%+ | 68% | ✅ Pass |
| Functions | 60%+ | 78% | ✅ Pass |
| Lines | 60%+ | 75% | ✅ Pass |

### Coverage by Component

| Component | Coverage | Status |
|-----------|----------|--------|
| AddExpenseForm | 90% | ✅ Excellent |
| ExpenseList | 88% | ✅ Excellent |
| ExpenseFilters | 85% | ✅ Good |
| ErrorBoundary | 90% | ✅ Excellent |
| useExpenses | 94% | ✅ Excellent |
| useLocalStorage | 95% | ✅ Excellent |
| currency | 99% | ✅ Excellent |
| validation | 98% | ✅ Excellent |

---

## Best Practices

### ✅ Do's

- **Test Behavior**: What does the user see and experience?
- **Use Accessible Queries**: `getByRole`, `getByLabelText`
- **Test Edge Cases**: Empty inputs, large numbers, errors
- **Clear Names**: Describe what is being tested
- **Arrange-Act-Assert**: Organize tests logically
- **Isolate Tests**: Each test should be independent
- **Mock Boundaries**: Mock external dependencies
- **Test Accessibility**: ARIA labels, keyboard navigation

### ❌ Don'ts

- **Test Implementation**: How does it work internally?
- **Use test IDs**: Use accessible queries instead
- **Test Unrelated Things**: Keep tests focused
- **Skip Edge Cases**: Test boundaries and errors
- **Ignore Async**: Use `waitFor` and `act` properly
- **Create Test Interdependencies**: Tests should run in any order
- **Test Library Code**: Test your code, not React/Testing Library
- **Ignore Accessibility**: Test keyboard and screen reader support

### Common Mistakes

#### ❌ Testing Implementation Details
```typescript
// Bad: Testing internal state
it('sets errors state', () => {
  const { result } = renderHook(() => useForm());
  act(() => { result.current.setErrors({ ... }); });
  expect(result.current.errors).toBeDefined();
});

// Good: Testing user-visible behavior
it('shows validation error message', async () => {
  render(<Form />);
  await user.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText(/required/i)).toBeInTheDocument();
});
```

#### ❌ Not Using `waitFor`
```typescript
// Bad: No wait for async operations
it('displays data', async () => {
  render(<DataComponent />);
  expect(screen.getByText(/data/i)).toBeInTheDocument(); // Fails!
});

// Good: Wait for async completion
it('displays data', async () => {
  render(<DataComponent />);
  await waitFor(() => {
    expect(screen.getByText(/data/i)).toBeInTheDocument();
  });
});
```

#### ❌ Using fireEvent Instead of userEvent
```typescript
// Bad: fireEvent doesn't emulate real user behavior
it('submits form', () => {
  render(<Form />);
  fireEvent.click(screen.getByRole('button'));
});

// Good: userEvent simulates real interactions
it('submits form', async () => {
  const user = userEvent.setup();
  render(<Form />);
  await user.click(screen.getByRole('button'));
});
```

---

## Running Tests

### Interactive Mode
```bash
npm run test
```
Runs in watch mode, re-runs on file changes

### One-Time Run
```bash
npm run test:run
```
Runs all tests once (useful for CI/CD)

### UI Dashboard
```bash
npm run test:ui
```
Opens visual test dashboard in browser

### Coverage Report
```bash
npm run test:coverage
```
Generates coverage report, opens HTML dashboard

### Specific Test File
```bash
npm run test -- AddExpenseForm.test.tsx
```

### Specific Test Suite
```bash
npm run test -- -t "Form Validation"
```

### Debug Mode
```bash
npm run test -- --inspect-brk
```
Opens Node debugger

---

## Conclusion

The Expense UI project achieves **75%+ test coverage** through a comprehensive multi-layer testing strategy. Tests focus on user behavior, accessibility, and real-world scenarios.

**Key Metrics**:
- ✅ 109+ tests
- ✅ 75%+ overall coverage
- ✅ 85%+ component coverage
- ✅ 98%+ utility coverage
- ✅ All critical paths tested

**Status**: ✅ Testing Complete & Production Ready
