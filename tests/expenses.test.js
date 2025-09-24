import { describe, it, expect } from 'vitest';
// Make sure to import both functions
import { addExpense, summarizeExpenses } from '../src/expenses-core.js';

// ... your existing 'addExpense' describe block is here ...

describe('summarizeExpenses function', () => {
  it('should correctly summarize a list of expenses', () => {
    const expenses = [
      { id: 1, category: 'Food', amount: 10 },
      { id: 2, category: 'Transport', amount: 5 },
      { id: 3, category: 'Food', amount: 15 }
    ];

    const summary = summarizeExpenses(expenses);

    // Check the total
    expect(summary.total).toBe(30);

    // Check the breakdown by category
    expect(summary.byCategory.Food).toBe(25);
    expect(summary.byCategory.Transport).toBe(5);
  });

  it('should return a total of 0 for an empty list', () => {
    const expenses = [];
    const summary = summarizeExpenses(expenses);
    expect(summary.total).toBe(0);
  });
});