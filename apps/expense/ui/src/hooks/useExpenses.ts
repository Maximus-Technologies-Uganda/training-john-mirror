import { useState, useMemo, useCallback } from 'react';
import { Expense, ExpenseFilter, ExpenseFormData } from '../types/expense';
import { useLocalStorage } from './useLocalStorage';
import { addExpense as coreAddExpense, getExpenses as coreGetExpenses } from '../lib/expense-core';
import { toCents } from '../utils/currency';

/**
 * Custom hook for managing expense operations
 *
 * Provides a complete interface for expense management including:
 * - Adding new expenses with validation
 * - Retrieving stored expenses
 * - Filtering expenses by criteria
 * - Loading and error state management
 *
 * @returns Object with expenses state, filter state, and operation functions
 */
export function useExpenses() {
  // Local storage for expenses persistence
  // Use the same localStorage key as the core module for consistency
  const EXPENSES_STORAGE_KEY = 'expense-tracker:expenses';
  const [expenses, setExpenses] = useLocalStorage<Expense[]>(EXPENSES_STORAGE_KEY, []);

  // Filter state
  const [filters, setFilters] = useState<ExpenseFilter>({});

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Add a new expense with validation and error handling
   * Converts form data to core format and persists to localStorage
   */
  const addExpense = useCallback(async (formData: ExpenseFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Transform form data to core module format
      const expenseInput = {
        amount: toCents(formData.amount),
        description: formData.description.trim(),
        month: formData.month,
        category: formData.category.trim()
      };

      // Add expense via core module
      const newExpense = await coreAddExpense(expenseInput);

      // Update local state
      setExpenses(prevExpenses => [...prevExpenses, newExpense]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add expense';
      setError(errorMessage);
      throw err; // Re-throw for component-level error handling
    } finally {
      setIsLoading(false);
    }
  }, [setExpenses]);

  /**
   * Load expenses from core module (for initialization)
   * This ensures we have the latest data from any external sources
   */
  const loadExpenses = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedExpenses = await coreGetExpenses();
      setExpenses(loadedExpenses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load expenses';
      setError(errorMessage);
      console.error('Failed to load expenses:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setExpenses]);

  /**
   * Update filter criteria
   */
  const updateFilters = useCallback((newFilters: ExpenseFilter) => {
    setFilters(newFilters);
    setError(null); // Clear any previous errors when changing filters
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Get filtered expenses based on current filter criteria
   * Memoized to avoid unnecessary recalculations
   */
  const filteredExpenses = useMemo(() => {
    // If no filters are set, return all expenses
    if (!filters.month && !filters.category) {
      return expenses;
    }

    // Apply filters
    return expenses.filter(expense => {
      // Check month filter
      if (filters.month && expense.month !== filters.month) {
        return false;
      }

      // Check category filter
      if (filters.category && expense.category !== filters.category) {
        return false;
      }

      return true;
    });
  }, [expenses, filters]);

  /**
   * Get total amount of filtered expenses
   */
  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  }, [filteredExpenses]);

  /**
   * Get expense statistics
   */
  const stats = useMemo(() => {
    const totalExpenses = expenses.length;
    const filteredCount = filteredExpenses.length;
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

    return {
      totalExpenses,
      filteredCount,
      totalAmount,
      filteredTotal,
      isFiltered: !!(filters.month || filters.category)
    };
  }, [expenses, filteredExpenses, filteredTotal, filters]);

  return {
    // Data
    expenses,
    filteredExpenses,

    // Filters
    filters,
    setFilters: updateFilters,
    clearFilters,

    // Operations
    addExpense,
    loadExpenses,

    // State
    isLoading,
    error,

    // Computed values
    stats,
    filteredTotal
  };
}
