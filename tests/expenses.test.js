import { describe, it, expect } from 'vitest';
// Make sure to import both functions
import { addExpense, summarizeExpenses } from '../src/expenses-core.js';

describe('addExpense function', () => {
  it('should add an expense to the list', () => {
    const expenses = [];
    const newExpense = addExpense(expenses, 'Food', 10);
    
    expect(newExpense).toHaveLength(1);
    expect(newExpense[0]).toMatchObject({
      category: 'Food',
      amount: 10
    });
    expect(newExpense[0]).toHaveProperty('id');
    expect(typeof newExpense[0].id).toBe('number');
  });
});

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