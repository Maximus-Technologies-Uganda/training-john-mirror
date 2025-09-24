import { describe, it, expect } from 'vitest';
import { addExpense } from '../src/expenses-core.js';

describe('addExpense function', () => {
  it('should add a new expense to an empty list', () => {
    const initialExpenses = [];
    const category = 'Food';
    const amount = 10;

    const newExpenses = addExpense(initialExpenses, category, amount);

    // Check that the new list has one item
    expect(newExpenses).toHaveLength(1);

    // Check the properties of the new expense
    expect(newExpenses[0].category).toBe('Food');
    expect(newExpenses[0].amount).toBe(10);
  });

  it('should not modify the original array', () => {
    const initialExpenses = [];
    addExpense(initialExpenses, 'Transport', 5);

    // Check that the original array is still empty
    expect(initialExpenses).toHaveLength(0);
  });
});