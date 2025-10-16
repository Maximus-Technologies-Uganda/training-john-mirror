import { describe, it, expect } from 'vitest';
// Make sure to import all functions
import { addExpense, getExpenses, summarizeExpenses } from '../../expenses/src/expense-core.js';

function listExpenses(expenses) {
  const result = getExpenses(expenses);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data.expenses;
}

describe('addExpense function', () => {
  it('should add an expense to the list', () => {
    const expenses = [];
    const newExpense = addExpense(expenses, 'Food', 10);
    
    expect(newExpense).toHaveLength(1);
    expect(newExpense[0]).toMatchObject({
      category: 'Food',
      amount: 10
    });
    expect(newExpense[0]).toHaveProperty('date');
    expect(typeof newExpense[0].date).toBe('string');
    expect(newExpense[0].date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should not mutate the original expenses array', () => {
    const expenses = [];
    const originalLength = expenses.length;
    addExpense(expenses, 'Food', 10);
    
    expect(expenses).toHaveLength(originalLength);
  });

  it('should add multiple expenses correctly', () => {
    let expenses = [];
    expenses = addExpense(expenses, 'Food', 10);
    expenses = addExpense(expenses, 'Transport', 5);
    
    expect(expenses).toHaveLength(2);
    expect(expenses[0].category).toBe('Food');
    expect(expenses[1].category).toBe('Transport');
  });
});

describe('listExpenses function', () => {
  it('should format expenses with readable dates', () => {
    const expenses = [
      { category: 'Food', amount: 10, date: '2024-01-15T10:30:00.000Z' },
      { category: 'Transport', amount: 5, date: '2024-01-16T14:20:00.000Z' }
    ];

    const formattedExpenses = listExpenses(expenses);

    expect(formattedExpenses).toHaveLength(2);
    expect(formattedExpenses[0]).toMatchObject({
      category: 'Food',
      amount: 10,
      timestamp: '2024-01-15T10:30:00.000Z'
    });
    expect(formattedExpenses[0]).toHaveProperty('date');
    expect(typeof formattedExpenses[0].date).toBe('string');
    expect(formattedExpenses[1]).toMatchObject({
      category: 'Transport',
      amount: 5,
      timestamp: '2024-01-16T14:20:00.000Z'
    });
  });

  it('should handle empty expenses list', () => {
    const expenses = [];
    const formattedExpenses = listExpenses(expenses);

    expect(formattedExpenses).toHaveLength(0);
    expect(Array.isArray(formattedExpenses)).toBe(true);
  });

  it('should not mutate the original expenses array', () => {
    const expenses = [
      { category: 'Food', amount: 10, date: '2024-01-15T10:30:00.000Z' }
    ];
    const originalExpenses = [...expenses];
    
    listExpenses(expenses);
    
    expect(expenses).toEqual(originalExpenses);
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

  it('should handle expenses with decimal amounts', () => {
    const expenses = [
      { category: 'Food', amount: 10.50 },
      { category: 'Transport', amount: 5.25 }
    ];

    const summary = summarizeExpenses(expenses);

    expect(summary.total).toBe(15.75);
    expect(summary.byCategory.Food).toBe(10.50);
    expect(summary.byCategory.Transport).toBe(5.25);
  });

  it('should not mutate the original expenses array', () => {
    const expenses = [
      { category: 'Food', amount: 10 },
      { category: 'Transport', amount: 5 }
    ];
    const originalExpenses = [...expenses];
    
    summarizeExpenses(expenses);
    
    expect(expenses).toEqual(originalExpenses);
  });
});

describe('Integration tests', () => {
  it('should work with the complete add/list/summarize flow', () => {
    // Start with empty expenses
    let expenses = [];
    
    // Add some expenses
    expenses = addExpense(expenses, 'Food', 15.50);
    expenses = addExpense(expenses, 'Transport', 8.75);
    expenses = addExpense(expenses, 'Food', 12.25);
    
    // List expenses
    const listedExpenses = listExpenses(expenses);
    expect(listedExpenses).toHaveLength(3);
    expect(listedExpenses[0].category).toBe('Food');
    expect(listedExpenses[0].amount).toBe(15.50);
    
    // Summarize expenses
    const summary = summarizeExpenses(expenses);
    expect(summary.total).toBe(36.50);
    expect(summary.byCategory.Food).toBe(27.75);
    expect(summary.byCategory.Transport).toBe(8.75);
  });
});