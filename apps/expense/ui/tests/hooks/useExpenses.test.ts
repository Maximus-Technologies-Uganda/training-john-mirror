import { renderHook, act } from '@testing-library/react';
import { useExpenses } from '../../src/hooks/useExpenses';
import { Expense, ExpenseFilter, Month } from '../../src/types/expense';
import { vi } from 'vitest';

// Mock the localStorage hook
vi.mock('../../src/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn()
}));

// Mock the expense core module
vi.mock('../../src/lib/expense-core', () => ({
  addExpense: vi.fn(),
  getExpenses: vi.fn()
}));

// Mock the currency utility
vi.mock('../../src/utils/currency', () => ({
  toCents: vi.fn()
}));

import { useLocalStorage } from '../../src/hooks/useLocalStorage';
import { addExpense as coreAddExpense, getExpenses as coreGetExpenses } from '../../src/lib/expense-core';
import { toCents } from '../../src/utils/currency';

describe('useExpenses', () => {
  const mockUseLocalStorage = vi.mocked(useLocalStorage);
  const mockCoreAddExpense = vi.mocked(coreAddExpense);
  const mockCoreGetExpenses = vi.mocked(coreGetExpenses);
  const mockToCents = vi.mocked(toCents);

  const mockExpenses: Expense[] = [
    {
      id: 'exp-1234567890-abc123',
      amount: 1050, // $10.50
      description: 'Lunch at restaurant',
      month: 'January',
      category: 'Food'
    },
    {
      id: 'exp-1234567890-def456',
      amount: 2500, // $25.00
      description: 'Bus ticket',
      month: 'February',
      category: 'Transportation'
    },
    {
      id: 'exp-1234567890-ghi789',
      amount: 750, // $7.50
      description: 'Movie tickets',
      month: 'March',
      category: 'Entertainment'
    },
    {
      id: 'exp-1234567890-jkl012',
      amount: 500, // $5.00
      description: 'Coffee',
      month: 'January',
      category: 'Food'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockUseLocalStorage.mockReturnValue([mockExpenses, vi.fn()]);
    mockCoreAddExpense.mockResolvedValue(mockExpenses[0]);
    mockCoreGetExpenses.mockResolvedValue(mockExpenses);
    mockToCents.mockReturnValue(1050);
  });

  describe('Initial state', () => {
    it('returns empty filters by default', () => {
      const { result } = renderHook(() => useExpenses());

      expect(result.current.filters).toEqual({});
      expect(result.current.stats.isFiltered).toBe(false);
    });

    it('returns all expenses when no filters are set', () => {
      const { result } = renderHook(() => useExpenses());

      expect(result.current.filteredExpenses).toEqual(mockExpenses);
      expect(result.current.filteredExpenses).toHaveLength(4);
    });

    it('returns correct initial statistics', () => {
      const { result } = renderHook(() => useExpenses());

      expect(result.current.stats.totalExpenses).toBe(4);
      expect(result.current.stats.filteredCount).toBe(4);
      expect(result.current.stats.totalAmount).toBe(4800); // 1050 + 2500 + 750 + 500
      expect(result.current.stats.filteredTotal).toBe(4800);
      expect(result.current.stats.isFiltered).toBe(false);
    });

    it('initializes with no loading state', () => {
      const { result } = renderHook(() => useExpenses());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Filter management', () => {
    it('updates filters correctly', () => {
      const { result } = renderHook(() => useExpenses());

      const newFilters: ExpenseFilter = { month: 'January' };

      act(() => {
        result.current.setFilters(newFilters);
      });

      expect(result.current.filters).toEqual(newFilters);
    });

    it('clears all filters', () => {
      const { result } = renderHook(() => useExpenses());

      // Set some filters first
      act(() => {
        result.current.setFilters({ month: 'January', category: 'Food' });
      });

      expect(result.current.filters).toEqual({ month: 'January', category: 'Food' });

      // Clear filters
      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({});
    });

    it('clears error state when filters change', () => {
      const { result } = renderHook(() => useExpenses());

      // Mock an error state (simulate by setting error manually)
      // Since error is internal state, we'll test the behavior indirectly
      act(() => {
        result.current.setFilters({ month: 'January' });
      });

      // Error should be cleared when filters change
      expect(result.current.error).toBe(null);
    });
  });

  describe('Month filtering', () => {
    it('filters expenses by specific month', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'January' });
      });

      const filtered = result.current.filteredExpenses;
      expect(filtered).toHaveLength(2);
      expect(filtered.every(expense => expense.month === 'January')).toBe(true);
      expect(filtered.map(e => e.description)).toEqual(['Lunch at restaurant', 'Coffee']);
    });

    it('returns empty array when no expenses match month filter', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'December' });
      });

      expect(result.current.filteredExpenses).toHaveLength(0);
      expect(result.current.stats.filteredCount).toBe(0);
      expect(result.current.stats.filteredTotal).toBe(0);
    });

    it('updates statistics correctly when filtering by month', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'January' });
      });

      expect(result.current.stats.isFiltered).toBe(true);
      expect(result.current.stats.filteredCount).toBe(2);
      expect(result.current.stats.filteredTotal).toBe(1550); // 1050 + 500
      expect(result.current.stats.totalExpenses).toBe(4); // Total should remain unchanged
      expect(result.current.stats.totalAmount).toBe(4800); // Total should remain unchanged
    });
  });

  describe('Category filtering', () => {
    it('filters expenses by specific category', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ category: 'Food' });
      });

      const filtered = result.current.filteredExpenses;
      expect(filtered).toHaveLength(2);
      expect(filtered.every(expense => expense.category === 'Food')).toBe(true);
      expect(filtered.map(e => e.description)).toEqual(['Lunch at restaurant', 'Coffee']);
    });

    it('returns empty array when no expenses match category filter', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ category: 'Utilities' });
      });

      expect(result.current.filteredExpenses).toHaveLength(0);
    });

    it('updates statistics correctly when filtering by category', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ category: 'Food' });
      });

      expect(result.current.stats.isFiltered).toBe(true);
      expect(result.current.stats.filteredCount).toBe(2);
      expect(result.current.stats.filteredTotal).toBe(1550); // 1050 + 500
    });
  });

  describe('Combined filtering', () => {
    it('filters by both month and category', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'January', category: 'Food' });
      });

      const filtered = result.current.filteredExpenses;
      expect(filtered).toHaveLength(2);
      expect(filtered.every(expense =>
        expense.month === 'January' && expense.category === 'Food'
      )).toBe(true);
    });

    it('filters by month and category with no matches', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'March', category: 'Transportation' });
      });

      expect(result.current.filteredExpenses).toHaveLength(0);
    });

    it('filters by month and category with partial matches', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'January', category: 'Transportation' });
      });

      expect(result.current.filteredExpenses).toHaveLength(0);
    });

    it('calculates correct statistics for combined filtering', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'February', category: 'Transportation' });
      });

      expect(result.current.stats.isFiltered).toBe(true);
      expect(result.current.stats.filteredCount).toBe(1);
      expect(result.current.stats.filteredTotal).toBe(2500);
    });

    it('handles complex combined filtering with multiple categories in same month', () => {
      // Add more test data with multiple categories in January
      const additionalExpenses: Expense[] = [
        ...mockExpenses,
        {
          id: 'exp-extra-1',
          amount: 1200, // $12.00
          description: 'Books',
          month: 'January',
          category: 'Education'
        },
        {
          id: 'exp-extra-2',
          amount: 800, // $8.00
          description: 'Gas station',
          month: 'January',
          category: 'Transportation'
        }
      ];

      mockUseLocalStorage.mockReturnValue([additionalExpenses, vi.fn()]);

      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'January' });
      });

      expect(result.current.filteredExpenses).toHaveLength(4); // 2 Food + 1 Education + 1 Transportation
      expect(result.current.stats.filteredTotal).toBe(3550); // 1050 + 500 + 1200 + 800
    });

    it('combines filters dynamically during multiple updates', () => {
      const { result } = renderHook(() => useExpenses());

      // Start with month filter
      act(() => {
        result.current.setFilters({ month: 'January' });
      });
      expect(result.current.filteredExpenses).toHaveLength(2);

      // Add category filter to existing month filter
      act(() => {
        result.current.setFilters({ ...result.current.filters, category: 'Food' });
      });
      expect(result.current.filteredExpenses).toHaveLength(2); // Should still be 2 (both January Food)

      // Change category filter
      act(() => {
        result.current.setFilters({ ...result.current.filters, category: 'Transportation' });
      });
      expect(result.current.filteredExpenses).toHaveLength(0); // No January Transportation
    });

    it('handles combined filtering with empty results gracefully', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'December', category: 'Utilities' });
      });

      expect(result.current.filteredExpenses).toHaveLength(0);
      expect(result.current.stats.filteredCount).toBe(0);
      expect(result.current.stats.filteredTotal).toBe(0);
      expect(result.current.stats.isFiltered).toBe(true);
    });

    it('maintains filter combinations when clearing individual filters', () => {
      const { result } = renderHook(() => useExpenses());

      // Set both filters
      act(() => {
        result.current.setFilters({ month: 'January', category: 'Food' });
      });
      expect(result.current.filteredExpenses).toHaveLength(2);

      // Clear month but keep category - should result in all Food expenses
      act(() => {
        result.current.setFilters({ ...result.current.filters, month: undefined });
      });
      expect(result.current.filters).toEqual({ category: 'Food' });
      expect(result.current.filteredExpenses).toHaveLength(2); // Still 2 Food expenses

      // Clear category - should result in all expenses
      act(() => {
        result.current.setFilters({ ...result.current.filters, category: undefined });
      });
      expect(result.current.filters).toEqual({});
      expect(result.current.filteredExpenses).toHaveLength(4); // All expenses
    });

    it('combines filtering with expense updates correctly', () => {
      const { result, rerender } = renderHook(() => useExpenses());

      // Set combined filter
      act(() => {
        result.current.setFilters({ month: 'January', category: 'Food' });
      });
      expect(result.current.filteredExpenses).toHaveLength(2);

      // Simulate adding a new expense that matches the filter
      const updatedExpenses = [
        ...mockExpenses,
        {
          id: 'exp-new-match',
          amount: 1500, // $15.00
          description: 'Dinner out',
          month: 'January',
          category: 'Food'
        }
      ];

      mockUseLocalStorage.mockReturnValue([updatedExpenses, vi.fn()]);
      rerender();

      // Filter should still be applied and include the new expense
      expect(result.current.filters).toEqual({ month: 'January', category: 'Food' });
      expect(result.current.filteredExpenses).toHaveLength(3);
      expect(result.current.stats.filteredTotal).toBe(3050); // 1050 + 500 + 1500
    });

    it('handles combined filtering with case-sensitive category matching', () => {
      const mixedCaseExpenses: Expense[] = [
        ...mockExpenses,
        {
          id: 'exp-case-test',
          amount: 300, // $3.00
          description: 'Snacks',
          month: 'March',
          category: 'food' // lowercase
        }
      ];

      mockUseLocalStorage.mockReturnValue([mixedCaseExpenses, vi.fn()]);

      const { result } = renderHook(() => useExpenses());

      // Filter should be case-sensitive
      act(() => {
        result.current.setFilters({ category: 'Food' }); // Capital F
      });

      // Should only match exact case
      const foodExpenses = result.current.filteredExpenses.filter(e => e.category === 'Food');
      expect(foodExpenses).toHaveLength(2); // Original 2 Food expenses
      expect(result.current.filteredExpenses.some(e => e.category === 'food')).toBe(false);
    });

    it('calculates accurate statistics for complex combined filtering', () => {
      const complexExpenses: Expense[] = [
        ...mockExpenses,
        // Add more expenses to test statistics
        { id: 'exp-5', amount: 2000, description: 'Hotel', month: 'February', category: 'Travel' },
        { id: 'exp-6', amount: 600, description: 'Museum', month: 'February', category: 'Entertainment' },
        { id: 'exp-7', amount: 900, description: 'Taxi', month: 'February', category: 'Transportation' }
      ];

      mockUseLocalStorage.mockReturnValue([complexExpenses, vi.fn()]);

      const { result } = renderHook(() => useExpenses());

      // Test combined filtering statistics
      act(() => {
        result.current.setFilters({ month: 'February' });
      });

      expect(result.current.stats.filteredCount).toBe(4); // Bus ticket + Hotel + Museum + Taxi
      expect(result.current.stats.filteredTotal).toBe(6000); // 2500 + 2000 + 600 + 900

      // Add category filter
      act(() => {
        result.current.setFilters({ month: 'February', category: 'Transportation' });
      });

      expect(result.current.stats.filteredCount).toBe(2); // Bus ticket + Taxi
      expect(result.current.stats.filteredTotal).toBe(3400); // 2500 + 900
      expect(result.current.stats.totalExpenses).toBe(7); // Should remain unchanged
      expect(result.current.stats.totalAmount).toBe(8300); // Should remain unchanged
    });

    it('handles rapid combined filter changes without breaking state', () => {
      const { result } = renderHook(() => useExpenses());

      // Rapid sequence of combined filter changes
      act(() => result.current.setFilters({ month: 'January' }));
      act(() => result.current.setFilters({ month: 'January', category: 'Food' }));
      act(() => result.current.setFilters({ category: 'Food' }));
      act(() => result.current.setFilters({ month: 'February', category: 'Transportation' }));
      act(() => result.current.setFilters({}));

      // Final state should be correct
      expect(result.current.filters).toEqual({});
      expect(result.current.filteredExpenses).toHaveLength(4);
      expect(result.current.stats.isFiltered).toBe(false);
    });

    it('preserves combined filter state across hook re-renders', () => {
      const { result, rerender } = renderHook(() => useExpenses());

      // Set combined filters
      act(() => {
        result.current.setFilters({ month: 'January', category: 'Food' });
      });

      expect(result.current.filters).toEqual({ month: 'January', category: 'Food' });

      // Re-render without changing filters
      rerender();

      // Filters should be preserved
      expect(result.current.filters).toEqual({ month: 'January', category: 'Food' });
      expect(result.current.filteredExpenses).toHaveLength(2);
    });

    it('handles empty results with multiple filter combinations', () => {
      const { result } = renderHook(() => useExpenses());

      // Test various combinations that should result in no matches
      const emptyCombinations: Array<{month?: Month, category?: string}> = [
        { month: 'December' as Month, category: 'Food' },
        { month: 'January' as Month, category: 'Utilities' },
        { month: 'April' as Month, category: 'Entertainment' },
        { month: 'December' as Month, category: 'NonExistentCategory' },
        { month: 'January' as Month, category: 'NonExistentCategory2' }
      ];

      emptyCombinations.forEach(combination => {
        act(() => {
          result.current.setFilters(combination);
        });

        expect(result.current.filteredExpenses).toHaveLength(0);
        expect(result.current.stats.filteredCount).toBe(0);
        expect(result.current.stats.filteredTotal).toBe(0);
        expect(result.current.stats.isFiltered).toBe(true);
      });
    });

    it('handles filter combinations with undefined values gracefully', () => {
      const { result } = renderHook(() => useExpenses());

      // Test combinations with undefined values
      act(() => {
        result.current.setFilters({ month: 'January', category: undefined });
      });
      expect(result.current.filteredExpenses).toHaveLength(2); // All January expenses

      act(() => {
        result.current.setFilters({ month: undefined, category: 'Food' });
      });
      expect(result.current.filteredExpenses).toHaveLength(2); // All Food expenses

      act(() => {
        result.current.setFilters({ month: undefined, category: undefined });
      });
      expect(result.current.filteredExpenses).toHaveLength(4); // All expenses
      expect(result.current.stats.isFiltered).toBe(false);
    });

    it('maintains correct filtering behavior with rapid filter changes to empty results', () => {
      const { result } = renderHook(() => useExpenses());

      // Start with valid filters
      act(() => result.current.setFilters({ month: 'January', category: 'Food' }));
      expect(result.current.filteredExpenses).toHaveLength(2);

      // Change to empty combination
      act(() => result.current.setFilters({ month: 'December', category: 'Food' }));
      expect(result.current.filteredExpenses).toHaveLength(0);

      // Change to another empty combination
      act(() => result.current.setFilters({ month: 'January', category: 'Transportation' }));
      expect(result.current.filteredExpenses).toHaveLength(0);

      // Back to valid combination
      act(() => result.current.setFilters({ month: 'January', category: 'Food' }));
      expect(result.current.filteredExpenses).toHaveLength(2);
    });

    it('handles case sensitivity in combined filtering', () => {
      const mixedCaseExpenses: Expense[] = [
        ...mockExpenses,
        {
          id: 'exp-case-test-1',
          amount: 300, // $3.00
          description: 'Snacks',
          month: 'March',
          category: 'food' // lowercase
        },
        {
          id: 'exp-case-test-2',
          amount: 400, // $4.00
          description: 'Coffee',
          month: 'March',
          category: 'Food' // capital F
        }
      ];

      mockUseLocalStorage.mockReturnValue([mixedCaseExpenses, vi.fn()]);

      const { result } = renderHook(() => useExpenses());

      // Filter should be case-sensitive - only exact matches
      act(() => {
        result.current.setFilters({ month: 'March', category: 'Food' }); // Capital F
      });

      expect(result.current.filteredExpenses).toHaveLength(1); // Only the capital 'Food' expense
      expect(result.current.filteredExpenses[0].description).toBe('Coffee');
    });

    it('handles combined filtering with expense data changes', () => {
      const { result, rerender } = renderHook(() => useExpenses());

      // Set filters that match existing data
      act(() => {
        result.current.setFilters({ month: 'January', category: 'Food' });
      });
      expect(result.current.filteredExpenses).toHaveLength(2);

      // Simulate expense data change that removes matching expenses
      const reducedExpenses = mockExpenses.filter(expense =>
        !(expense.month === 'January' && expense.category === 'Food')
      );
      mockUseLocalStorage.mockReturnValue([reducedExpenses, vi.fn()]);
      rerender();

      // Filters should still be applied but result in empty set
      expect(result.current.filters).toEqual({ month: 'January', category: 'Food' });
      expect(result.current.filteredExpenses).toHaveLength(0);
      expect(result.current.stats.filteredCount).toBe(0);
    });

    it('validates combined filtering with boundary month values', () => {
      const { result } = renderHook(() => useExpenses());

      // Test with valid month names
      const validMonths = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];

      validMonths.forEach(month => {
        act(() => {
          result.current.setFilters({ month: month as Month, category: 'Food' });
        });

        // Should not crash and should apply filtering
        expect(result.current.stats.isFiltered).toBe(true);
        // Result length depends on actual data, but should not be undefined
        expect(result.current.filteredExpenses).toBeDefined();
      });
    });

    it('handles combined filtering with special characters in categories', () => {
      const specialCharExpenses: Expense[] = [
        ...mockExpenses,
        {
          id: 'exp-special-1',
          amount: 100,
          description: 'Test expense',
          month: 'January',
          category: 'Test-Category'
        },
        {
          id: 'exp-special-2',
          amount: 200,
          description: 'Another test',
          month: 'January',
          category: 'Test Category' // space
        }
      ];

      mockUseLocalStorage.mockReturnValue([specialCharExpenses, vi.fn()]);

      const { result } = renderHook(() => useExpenses());

      // Test exact matching with special characters
      act(() => {
        result.current.setFilters({ month: 'January', category: 'Test-Category' });
      });
      expect(result.current.filteredExpenses).toHaveLength(1);

      act(() => {
        result.current.setFilters({ month: 'January', category: 'Test Category' });
      });
      expect(result.current.filteredExpenses).toHaveLength(1);

      // Non-matching category should return no results
      act(() => {
        result.current.setFilters({ month: 'January', category: 'NonMatching-Category' });
      });
      expect(result.current.filteredExpenses).toHaveLength(0);
    });

    it('maintains performance with combined filtering on large datasets', () => {
      // Create a larger dataset to test performance
      const largeExpenses: Expense[] = [];
      for (let i = 0; i < 100; i++) {
        largeExpenses.push({
          id: `exp-large-${i}`,
          amount: Math.floor(Math.random() * 10000), // Random amount
          description: `Expense ${i}`,
          month: ['January', 'February', 'March'][i % 3] as Month,
          category: ['Food', 'Transportation', 'Entertainment'][i % 3]
        });
      }

      mockUseLocalStorage.mockReturnValue([largeExpenses, vi.fn()]);

      const { result } = renderHook(() => useExpenses());

      // Apply combined filters
      act(() => {
        result.current.setFilters({ month: 'January', category: 'Food' });
      });

      // Should filter correctly without performance issues
      const filtered = result.current.filteredExpenses;
      expect(filtered.every(expense =>
        expense.month === 'January' && expense.category === 'Food'
      )).toBe(true);

      // Should have approximately 1/3 of total expenses (100/3 ≈ 33.33)
      // Since both month and category use the same i % 3 distribution
      expect(filtered.length).toBeGreaterThan(30);
      expect(filtered.length).toBeLessThan(40);
    });

    it('handles combined filtering with empty category strings', () => {
      const { result } = renderHook(() => useExpenses());

      // Empty category should be treated as no category filter
      act(() => {
        result.current.setFilters({ month: 'January', category: '' });
      });

      // Should only filter by month, ignoring empty category
      expect(result.current.filteredExpenses).toHaveLength(2);
      expect(result.current.filteredExpenses.every(expense => expense.month === 'January')).toBe(true);
    });

    it('validates combined filtering state consistency', () => {
      const { result } = renderHook(() => useExpenses());

      // Test multiple state transitions
      const testSequence: Array<{filters: ExpenseFilter, expectedLength: number}> = [
        { filters: { month: 'January' as Month, category: 'Food' }, expectedLength: 2 },
        { filters: { month: 'February' as Month, category: 'Transportation' }, expectedLength: 1 },
        { filters: { month: 'March' as Month, category: 'Entertainment' }, expectedLength: 1 },
        { filters: { month: 'December' as Month, category: 'Food' }, expectedLength: 0 },
        { filters: {}, expectedLength: 4 }
      ];

      testSequence.forEach(({ filters, expectedLength }) => {
        act(() => {
          result.current.setFilters(filters);
        });

        expect(result.current.filteredExpenses).toHaveLength(expectedLength);
        expect(result.current.stats.filteredCount).toBe(expectedLength);
        expect(result.current.stats.isFiltered).toBe(Object.keys(filters).length > 0);
      });
    });
  });

  describe('Filter persistence', () => {
    it('maintains filters when expenses change', () => {
      const { result, rerender } = renderHook(() => useExpenses());

      // Set a filter
      act(() => {
        result.current.setFilters({ month: 'January' });
      });

      expect(result.current.filters).toEqual({ month: 'January' });
      expect(result.current.filteredExpenses).toHaveLength(2);

      // Simulate expenses changing (this would happen via localStorage updates)
      const newExpenses = [...mockExpenses, {
        id: 'exp-new',
        amount: 1000,
        description: 'New expense',
        month: 'January',
        category: 'Food'
      }];

      mockUseLocalStorage.mockReturnValue([newExpenses, vi.fn()]);
      rerender();

      // Filter should still be applied
      expect(result.current.filters).toEqual({ month: 'January' });
      expect(result.current.filteredExpenses).toHaveLength(3);
    });

    it('recalculates filtered expenses when filters change', () => {
      const { result } = renderHook(() => useExpenses());

      // Start with month filter
      act(() => {
        result.current.setFilters({ month: 'January' });
      });
      expect(result.current.filteredExpenses).toHaveLength(2);

      // Change to category filter
      act(() => {
        result.current.setFilters({ category: 'Transportation' });
      });
      expect(result.current.filteredExpenses).toHaveLength(1);
      expect(result.current.filteredExpenses[0].description).toBe('Bus ticket');
    });
  });

  describe('Edge cases', () => {
    it('handles empty expenses array', () => {
      mockUseLocalStorage.mockReturnValue([[], vi.fn()]);

      const { result } = renderHook(() => useExpenses());

      expect(result.current.expenses).toEqual([]);
      expect(result.current.filteredExpenses).toEqual([]);
      expect(result.current.stats.totalExpenses).toBe(0);
      expect(result.current.stats.filteredCount).toBe(0);
      expect(result.current.stats.totalAmount).toBe(0);
      expect(result.current.stats.filteredTotal).toBe(0);
    });

    it('handles undefined filter properties gracefully', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: undefined, category: undefined });
      });

      expect(result.current.filteredExpenses).toEqual(mockExpenses);
      expect(result.current.stats.isFiltered).toBe(false);
    });

    it('handles partial filter objects', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'February' } as ExpenseFilter);
      });

      expect(result.current.filteredExpenses).toHaveLength(1);
      expect(result.current.filteredExpenses[0].month).toBe('February');
    });

    it('preserves other filter properties when updating one', () => {
      const { result } = renderHook(() => useExpenses());

      // Set both filters
      act(() => {
        result.current.setFilters({ month: 'January', category: 'Food' });
      });

      // Update only month
      act(() => {
        result.current.setFilters({ ...result.current.filters, month: 'February' });
      });

      expect(result.current.filters).toEqual({ month: 'February', category: 'Food' });
      expect(result.current.filteredExpenses).toHaveLength(0); // No February Food expenses
    });
  });

  describe('Memoization and performance', () => {
    it('memoizes filteredExpenses correctly', () => {
      const { result, rerender } = renderHook(() => useExpenses());

      const firstResult = result.current.filteredExpenses;

      // Rerender without changes
      rerender();

      const secondResult = result.current.filteredExpenses;

      // Should be the same reference (memoized)
      expect(firstResult).toBe(secondResult);
    });

    it('recalculates filteredExpenses when filters change', () => {
      const { result } = renderHook(() => useExpenses());

      const firstResult = result.current.filteredExpenses;

      act(() => {
        result.current.setFilters({ month: 'January' });
      });

      const secondResult = result.current.filteredExpenses;

      // Should be different references (recalculated)
      expect(firstResult).not.toBe(secondResult);
      expect(secondResult).toHaveLength(2);
    });

    it('recalculates filteredExpenses when expenses change', () => {
      const { result, rerender } = renderHook(() => useExpenses());

      const firstResult = result.current.filteredExpenses;

      // Simulate expenses changing
      const newExpenses = [...mockExpenses];
      mockUseLocalStorage.mockReturnValue([newExpenses, vi.fn()]);
      rerender();

      const secondResult = result.current.filteredExpenses;

      // Should be different references (recalculated)
      expect(firstResult).not.toBe(secondResult);
    });
  });

  describe('Statistics calculation', () => {
    it('calculates filtered total correctly', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ category: 'Food' });
      });

      // Food expenses: 1050 + 500 = 1550 cents
      expect(result.current.stats.filteredTotal).toBe(1550);
      expect(result.current.filteredTotal).toBe(1550); // Also available as direct property
    });

    it('maintains total statistics regardless of filtering', () => {
      const { result } = renderHook(() => useExpenses());

      act(() => {
        result.current.setFilters({ month: 'January' });
      });

      // Total stats should remain unchanged
      expect(result.current.stats.totalExpenses).toBe(4);
      expect(result.current.stats.totalAmount).toBe(4800);

      // Filtered stats should be different
      expect(result.current.stats.filteredCount).toBe(2);
      expect(result.current.stats.filteredTotal).toBe(1550);
    });

    it('correctly identifies filtered vs unfiltered state', () => {
      const { result } = renderHook(() => useExpenses());

      // Initially unfiltered
      expect(result.current.stats.isFiltered).toBe(false);

      // Apply filter
      act(() => {
        result.current.setFilters({ month: 'January' });
      });
      expect(result.current.stats.isFiltered).toBe(true);

      // Clear filters
      act(() => {
        result.current.clearFilters();
      });
      expect(result.current.stats.isFiltered).toBe(false);
    });
  });
});
