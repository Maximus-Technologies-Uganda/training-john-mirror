import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseView } from '../../src/components/ExpenseView';
import { Expense } from '../../src/types/expense';
import { vi } from 'vitest';

// Mock the useExpenses hook
vi.mock('../../src/hooks/useExpenses', () => ({
  useExpenses: vi.fn()
}));

import { useExpenses as mockUseExpenses } from '../../src/hooks/useExpenses';

describe('ExpenseView', () => {
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
    }
  ];

  const mockFilteredExpenses = mockExpenses.slice(0, 2); // First 2 expenses

  const defaultMockReturn = {
    expenses: mockExpenses,
    filteredExpenses: mockExpenses,
    filters: {},
    setFilters: vi.fn(),
    clearFilters: vi.fn(),
    addExpense: vi.fn(),
    loadExpenses: vi.fn(),
    isLoading: false,
    error: null,
    stats: {
      totalExpenses: 3,
      filteredCount: 3,
      totalAmount: 4300,
      filteredTotal: 4300,
      isFiltered: false
    },
    filteredTotal: 4300
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (mockUseExpenses as any).mockReturnValue(defaultMockReturn);
  });

  describe('Initial render', () => {
    it('renders the expense view with title and stats', () => {
      render(<ExpenseView />);

      expect(screen.getByText('Expense Tracker')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses: 3')).toBeInTheDocument();
      expect(screen.getByText('Showing: 3')).toBeInTheDocument();
    });

    it('renders ExpenseFilters and ExpenseList components', () => {
      render(<ExpenseView />);

      // Check for filter controls
      expect(screen.getByLabelText('Month')).toBeInTheDocument();

      // Check for expense list
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('passes filtered expenses to ExpenseList', () => {
      render(<ExpenseView />);

      // Should show all expenses initially
      expect(screen.getByText('Lunch at restaurant')).toBeInTheDocument();
      expect(screen.getByText('Bus ticket')).toBeInTheDocument();
      expect(screen.getByText('Movie tickets')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('shows loading message when isLoading is true', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true
      });

      render(<ExpenseView />);

      expect(screen.getByText('Loading expenses...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('does not show expense content when loading', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true
      });

      render(<ExpenseView />);

      expect(screen.queryByText('Expense Tracker')).not.toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('shows error message when error exists', () => {
      const errorMessage = 'Failed to load expenses';
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        error: errorMessage
      });

      render(<ExpenseView />);

      expect(screen.getByText('Error Loading Expenses')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows retry button in error state', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        error: 'Network error'
      });

      render(<ExpenseView />);

      const retryButton = screen.getByRole('button', { name: 'Retry' });
      expect(retryButton).toBeInTheDocument();
    });

    it('does not show expense content when error exists', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        error: 'Database error'
      });

      render(<ExpenseView />);

      expect(screen.queryByText('Expense Tracker')).not.toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('Filtering integration', () => {
    it('applies month filter and updates display', () => {
      // Create filtered expenses for January only
      const januaryExpenses = mockExpenses.filter(exp => exp.month === 'January');
      const mockSetFilters = vi.fn();
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        filteredExpenses: januaryExpenses,
        filters: { month: 'January' },
        setFilters: mockSetFilters,
        stats: {
          ...defaultMockReturn.stats,
          filteredCount: 1,
          filteredTotal: 1050,
          isFiltered: true
        }
      });

      render(<ExpenseView />);

      // Should show filtered stats
      expect(screen.getByText('Showing: 1')).toBeInTheDocument();
      expect(screen.getByText('Filtered')).toBeInTheDocument();

      // Should show filtered expenses (only January)
      expect(screen.getByText('Lunch at restaurant')).toBeInTheDocument();
      expect(screen.queryByText('Bus ticket')).not.toBeInTheDocument();
      expect(screen.queryByText('Movie tickets')).not.toBeInTheDocument();
    });

    it('calls setFilters when filter changes', () => {
      const mockSetFilters = vi.fn();
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        setFilters: mockSetFilters
      });

      render(<ExpenseView />);

      const monthSelect = screen.getByLabelText('Month');
      fireEvent.change(monthSelect, { target: { value: 'February' } });

      expect(mockSetFilters).toHaveBeenCalledWith({ month: 'February' });
    });

    it('updates stats display when filters are applied', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        filters: { month: 'February' },
        stats: {
          ...defaultMockReturn.stats,
          filteredCount: 1,
          filteredTotal: 2500,
          isFiltered: true
        }
      });

      render(<ExpenseView />);

      expect(screen.getByText('Total Expenses: 3')).toBeInTheDocument();
      expect(screen.getByText('Showing: 1')).toBeInTheDocument();
      expect(screen.getByText('Filtered')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<ExpenseView />);

      // Filter controls should be accessible
      expect(screen.getByLabelText('Month')).toBeInTheDocument();

      // Stats should be announced as status
      expect(screen.getByRole('status')).toBeInTheDocument();

      // Should have region roles for semantic structure
      expect(screen.getByRole('region', { name: 'Filter expenses' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Expense list' })).toBeInTheDocument();
    });

    it('provides live updates for stats', () => {
      render(<ExpenseView />);

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });

    it('shows error state with proper alert role', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        error: 'Test error'
      });

      render(<ExpenseView />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows loading state with proper status role', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        isLoading: true
      });

      render(<ExpenseView />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Empty state', () => {
    it('handles empty expense list', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        expenses: [],
        filteredExpenses: [],
        stats: {
          ...defaultMockReturn.stats,
          totalExpenses: 0,
          filteredCount: 0,
          totalAmount: 0,
          filteredTotal: 0,
          isFiltered: false
        }
      });

      render(<ExpenseView />);

      expect(screen.getByText('Total Expenses: 0')).toBeInTheDocument();
      expect(screen.getByText('Showing: 0')).toBeInTheDocument();
      expect(screen.getByText('No expenses found')).toBeInTheDocument();
    });

    it('handles filtered empty results', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        filteredExpenses: [],
        filters: { month: 'December' },
        stats: {
          ...defaultMockReturn.stats,
          filteredCount: 0,
          filteredTotal: 0,
          isFiltered: true
        }
      });

      render(<ExpenseView />);

      expect(screen.getByText('Total Expenses: 3')).toBeInTheDocument();
      expect(screen.getByText('Showing: 0')).toBeInTheDocument();
      expect(screen.getByText('Filtered')).toBeInTheDocument();
      expect(screen.getByText('No expenses found')).toBeInTheDocument();
    });
  });

  describe('Statistics display', () => {
    it('shows correct statistics for unfiltered view', () => {
      render(<ExpenseView />);

      expect(screen.getByText('Total Expenses: 3')).toBeInTheDocument();
      expect(screen.getByText('Showing: 3')).toBeInTheDocument();
      expect(screen.queryByText('Filtered')).not.toBeInTheDocument();
    });

    it('shows filtered indicator when filters are active', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        filters: { month: 'January' },
        stats: {
          ...defaultMockReturn.stats,
          isFiltered: true
        }
      });

      render(<ExpenseView />);

      expect(screen.getByText('Filtered')).toBeInTheDocument();
    });

    it('updates showing count when filtered', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        filteredExpenses: mockFilteredExpenses,
        stats: {
          ...defaultMockReturn.stats,
          filteredCount: 2
        }
      });

      render(<ExpenseView />);

      expect(screen.getByText('Showing: 2')).toBeInTheDocument();
    });
  });

  describe('Filter feedback', () => {
    it('shows filter feedback when results are found', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        filters: { month: 'January' },
        stats: {
          ...defaultMockReturn.stats,
          filteredCount: 2,
          totalExpenses: 4,
          isFiltered: true
        }
      });

      render(<ExpenseView />);

      // The filter feedback should contain the success message
      expect(screen.getByText(/Found 2 expenses matching your filters/)).toBeInTheDocument();
      expect(screen.queryByText('No expenses match your current filters')).not.toBeInTheDocument();
    });

    it('shows filter feedback with singular form for one result', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        filters: { category: 'Food' },
        stats: {
          ...defaultMockReturn.stats,
          filteredCount: 1,
          totalExpenses: 3,
          isFiltered: true
        }
      });

      render(<ExpenseView />);

      // The filter feedback should contain the singular form message
      expect(screen.getByText(/Found 1 expense matching your filters/)).toBeInTheDocument();
    });

    it('shows warning feedback when no results match filters', () => {
      (mockUseExpenses as any).mockReturnValue({
        ...defaultMockReturn,
        filters: { month: 'December' },
        stats: {
          ...defaultMockReturn.stats,
          filteredCount: 0,
          totalExpenses: 3,
          isFiltered: true
        }
      });

      render(<ExpenseView />);

      expect(screen.getByText('No expenses match your current filters.')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters or clearing them to see all expenses.')).toBeInTheDocument();
      expect(screen.queryByText('Found')).not.toBeInTheDocument();
    });

    it('does not show filter feedback when no filters are applied', () => {
      render(<ExpenseView />);

      expect(screen.queryByText('Found')).not.toBeInTheDocument();
      expect(screen.queryByText('No expenses match')).not.toBeInTheDocument();
    });
  });

  describe('Layout and structure', () => {
    it('has proper semantic structure', () => {
      render(<ExpenseView />);

      // Should have main content areas
      expect(screen.getByRole('main')).toBeInTheDocument(); // main content

      // Should have proper headings
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Expense Tracker');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Filter Expenses');
    });

    it('organizes content in logical sections', () => {
      render(<ExpenseView />);

      // Header with title and stats
      const header = screen.getByText('Expense Tracker').closest('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Total Expenses: 3');

      // Should have expense list with its own header
      expect(screen.getByText('Your Expenses')).toBeInTheDocument();

      // Should have filter controls
      expect(screen.getByText('Filter Expenses')).toBeInTheDocument();
    });
  });
});
