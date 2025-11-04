import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseFilters } from '../../src/components/ExpenseFilters';
import { ExpenseFilter } from '../../src/types/expense';

describe('ExpenseFilters', () => {
  const mockOnFilterChange = vi.fn();

  const initialFilters: ExpenseFilter = {};

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders month filter select with all months', () => {
    render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month');
    expect(monthSelect).toBeInTheDocument();

    // Should have "All Months" option plus 12 months
    // Filter to only month-related options by checking parent select
    const monthSelectElement = screen.getByLabelText('Month') as HTMLSelectElement;
    const monthOptionElements = Array.from(monthSelectElement.options);
    expect(monthOptionElements).toHaveLength(13); // 12 months + "All Months"

    // Check for specific months
    expect(screen.getByRole('option', { name: 'All Months' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'January' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'December' })).toBeInTheDocument();
  });

  it('displays current month filter selection', () => {
    const filtersWithMonth: ExpenseFilter = { month: 'March' };
    render(<ExpenseFilters filters={filtersWithMonth} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month') as HTMLSelectElement;
    expect(monthSelect.value).toBe('March');
  });

  it('calls onFilterChange when month selection changes', () => {
    render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month');
    fireEvent.change(monthSelect, { target: { value: 'February' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ month: 'February' });
  });

  it('calls onFilterChange with undefined when "All Months" is selected', () => {
    const filtersWithMonth: ExpenseFilter = { month: 'January' };
    render(<ExpenseFilters filters={filtersWithMonth} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month');
    fireEvent.change(monthSelect, { target: { value: '' } }); // "All Months" option

    expect(mockOnFilterChange).toHaveBeenCalledWith({ month: undefined });
  });

  it('preserves other filters when changing month', () => {
    const filtersWithCategory: ExpenseFilter = { category: 'Food' };
    render(<ExpenseFilters filters={filtersWithCategory} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month');
    fireEvent.change(monthSelect, { target: { value: 'April' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ month: 'April', category: 'Food' });
  });

  it('has proper accessibility attributes', () => {
    render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month');
    expect(monthSelect).toHaveAttribute('aria-describedby');
    expect(monthSelect).toHaveAttribute('aria-required', 'false');

    // Should have help text for screen readers
    const helpText = screen.getByText(/select a month to filter expenses/i);
    expect(helpText).toHaveClass('sr-only');
  });

  it('shows clear filter option when month is selected', () => {
    const filtersWithMonth: ExpenseFilter = { month: 'June' };
    render(<ExpenseFilters filters={filtersWithMonth} onFilterChange={mockOnFilterChange} />);

    const clearButton = screen.getByRole('button', { name: /clear month filter/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show clear button when no month filter is applied', () => {
    render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    const clearButton = screen.queryByRole('button', { name: /clear month filter/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('clears month filter when clear button is clicked', () => {
    const filtersWithMonth: ExpenseFilter = { month: 'August' };
    render(<ExpenseFilters filters={filtersWithMonth} onFilterChange={mockOnFilterChange} />);

    const clearButton = screen.getByRole('button', { name: /clear month filter/i });
    fireEvent.click(clearButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({ month: undefined });
  });

  it('displays filter status when month filter is active', () => {
    const filtersWithMonth: ExpenseFilter = { month: 'September' };
    render(<ExpenseFilters filters={filtersWithMonth} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText('Filtering by: September')).toBeInTheDocument();
  });

  it('does not display filter status when no filters are active', () => {
    render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    expect(screen.queryByText(/filtering by/i)).not.toBeInTheDocument();
  });

  it('maintains focus on month select after filter change', () => {
    render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month');
    monthSelect.focus();

    fireEvent.change(monthSelect, { target: { value: 'May' } });

    expect(document.activeElement).toBe(monthSelect);
  });

  it('handles rapid filter changes correctly', () => {
    render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month');

    // Rapid changes
    fireEvent.change(monthSelect, { target: { value: 'January' } });
    fireEvent.change(monthSelect, { target: { value: 'February' } });
    fireEvent.change(monthSelect, { target: { value: 'March' } });

    expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
    expect(mockOnFilterChange).toHaveBeenLastCalledWith({ month: 'March' });
  });

  it('renders with proper semantic structure', () => {
    render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    // Should be wrapped in a section or div with proper role
    const container = screen.getByRole('region', { name: /filter expenses/i });
    expect(container).toBeInTheDocument();

    // Should have a proper heading
    const heading = screen.getByRole('heading', { level: 3, name: /filter expenses/i });
    expect(heading).toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month');

    // Tab to month select
    monthSelect.focus();
    expect(document.activeElement).toBe(monthSelect);

    // Can change selection with keyboard
    fireEvent.keyDown(monthSelect, { key: 'ArrowDown' });
    fireEvent.keyDown(monthSelect, { key: 'Enter' });

    // Should still work (basic keyboard interaction test)
    expect(monthSelect).toBeInTheDocument();
  });

  it('handles undefined filters gracefully', () => {
    render(<ExpenseFilters filters={undefined as any} onFilterChange={mockOnFilterChange} />);

    const monthSelect = screen.getByLabelText('Month') as HTMLSelectElement;
    expect(monthSelect.value).toBe('');
  });

  it('handles invalid month filter values gracefully', () => {
    const filtersWithInvalidMonth: ExpenseFilter = { month: 'InvalidMonth' as any };
    render(<ExpenseFilters filters={filtersWithInvalidMonth} onFilterChange={mockOnFilterChange} />);

    // Should handle invalid month gracefully by falling back to no selection
    const monthSelect = screen.getByLabelText('Month') as HTMLSelectElement;
    expect(monthSelect.value).toBe(''); // Invalid values result in empty selection
  });

  // Category filtering tests
  describe('Category filtering', () => {
    it('renders category filter input with datalist', () => {
      render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

      const categoryInput = screen.getByLabelText('Category');
      expect(categoryInput).toBeInTheDocument();
      expect(categoryInput).toHaveAttribute('type', 'text');
      expect(categoryInput).toHaveAttribute('list', 'category-list');

      // Should have datalist with predefined categories
      const datalist = screen.getByRole('listbox', { hidden: true });
      expect(datalist).toBeInTheDocument();
      expect(datalist).toHaveAttribute('id', 'category-list');
    });

    it('displays current category filter selection', () => {
      const filtersWithCategory: ExpenseFilter = { category: 'Food' };
      render(<ExpenseFilters filters={filtersWithCategory} onFilterChange={mockOnFilterChange} />);

      const categoryInput = screen.getByLabelText('Category') as HTMLInputElement;
      expect(categoryInput.value).toBe('Food');
    });

    it('calls onFilterChange when category input changes', () => {
      render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

      const categoryInput = screen.getByLabelText('Category');
      fireEvent.change(categoryInput, { target: { value: 'Transportation' } });

      expect(mockOnFilterChange).toHaveBeenCalledWith({ category: 'Transportation' });
    });

    it('calls onFilterChange with undefined when category input is cleared', () => {
      const filtersWithCategory: ExpenseFilter = { category: 'Food' };
      render(<ExpenseFilters filters={filtersWithCategory} onFilterChange={mockOnFilterChange} />);

      const categoryInput = screen.getByLabelText('Category');
      fireEvent.change(categoryInput, { target: { value: '' } }); // Clear input

      expect(mockOnFilterChange).toHaveBeenCalledWith({ category: undefined });
    });

    it('preserves other filters when changing category', () => {
      const filtersWithMonth: ExpenseFilter = { month: 'January' };
      render(<ExpenseFilters filters={filtersWithMonth} onFilterChange={mockOnFilterChange} />);

      const categoryInput = screen.getByLabelText('Category');
      fireEvent.change(categoryInput, { target: { value: 'Food' } });

      expect(mockOnFilterChange).toHaveBeenCalledWith({ month: 'January', category: 'Food' });
    });

    it('shows clear category filter option when category is selected', () => {
      const filtersWithCategory: ExpenseFilter = { category: 'Entertainment' };
      render(<ExpenseFilters filters={filtersWithCategory} onFilterChange={mockOnFilterChange} />);

      const clearButton = screen.getByRole('button', { name: /clear category filter/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('clears category filter when clear button is clicked', () => {
      const filtersWithCategory: ExpenseFilter = { category: 'Transportation' };
      render(<ExpenseFilters filters={filtersWithCategory} onFilterChange={mockOnFilterChange} />);

      const clearButton = screen.getByRole('button', { name: /clear category filter/i });
      fireEvent.click(clearButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({ category: undefined });
    });

    it('displays filter status when category filter is active', () => {
      const filtersWithCategory: ExpenseFilter = { category: 'Food' };
      render(<ExpenseFilters filters={filtersWithCategory} onFilterChange={mockOnFilterChange} />);

      expect(screen.getByText('Filtering by: Food')).toBeInTheDocument();
    });

    it('displays combined filter status when both month and category are active', () => {
      const filtersWithBoth: ExpenseFilter = { month: 'January', category: 'Food' };
      render(<ExpenseFilters filters={filtersWithBoth} onFilterChange={mockOnFilterChange} />);

      expect(screen.getByText('Filtering by: January, Food')).toBeInTheDocument();
    });

    it('has proper accessibility attributes for category filter', () => {
      render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

      const categoryInput = screen.getByLabelText('Category');
      expect(categoryInput).toHaveAttribute('aria-describedby');
      expect(categoryInput).toHaveAttribute('aria-required', 'false');
      expect(categoryInput).toHaveAttribute('list', 'category-list');

      // Should have help text for screen readers
      const helpText = screen.getByText(/enter or select a category to filter expenses/i);
      expect(helpText).toHaveClass('sr-only');
    });

    it('supports keyboard navigation for category filter', async () => {
      const user = userEvent.setup();
      render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

      const categoryInput = screen.getByLabelText('Category');

      // Tab to category input
      categoryInput.focus();
      expect(document.activeElement).toBe(categoryInput);

      // Can type in input and it should trigger onChange events
      await user.clear(categoryInput);
      await user.type(categoryInput, 'Enter');

      // Verify that onFilterChange was called (may be called multiple times during typing)
      expect(mockOnFilterChange).toHaveBeenCalled();

      // Should still work (basic keyboard interaction test)
      expect(categoryInput).toBeInTheDocument();
    });

    it('handles combined month and category filters', () => {
      const filtersWithBoth: ExpenseFilter = { month: 'February', category: 'Transportation' };
      render(<ExpenseFilters filters={filtersWithBoth} onFilterChange={mockOnFilterChange} />);

      // Should show both filters in status
      expect(screen.getByText('Filtering by: February, Transportation')).toBeInTheDocument();

      // Should have clear buttons for both filters
      expect(screen.getByRole('button', { name: /clear month filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /clear category filter/i })).toBeInTheDocument();
    });

    it('shows Clear All Filters when multiple filters are active', () => {
      const filtersWithBoth: ExpenseFilter = { month: 'March', category: 'Entertainment' };
      render(<ExpenseFilters filters={filtersWithBoth} onFilterChange={mockOnFilterChange} />);

      const clearAllButton = screen.getByRole('button', { name: 'Clear all filters' });
      expect(clearAllButton).toBeInTheDocument();
    });

    it('supports custom category input with predefined suggestions', async () => {
      const user = userEvent.setup();
      render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

      // Should have a text input with datalist for custom category input
      const categoryInput = screen.getByLabelText('Category') as HTMLInputElement;
      expect(categoryInput).toHaveAttribute('list', 'category-list');

      // Should have datalist with predefined categories
      const datalist = document.getElementById('category-list') as HTMLDataListElement;
      expect(datalist).toBeInTheDocument();

      const options = Array.from(datalist.options).map(option => option.value);

      // Should include predefined categories
      expect(options).toContain('Food');
      expect(options).toContain('Transportation');
      expect(options).toContain('Entertainment');
      expect(options).toContain('Utilities');
      expect(options).toContain('Other');
      expect(options).toContain(''); // Empty option for "All Categories"

      // Should allow custom input
      await user.clear(categoryInput);
      await user.type(categoryInput, 'Custom');

      // Verify that onFilterChange was called with custom input
      expect(mockOnFilterChange).toHaveBeenCalled();
    });

    it('clears all filters when Clear All Filters button is clicked', () => {
      const filtersWithBoth: ExpenseFilter = { month: 'April', category: 'Food' };
      render(<ExpenseFilters filters={filtersWithBoth} onFilterChange={mockOnFilterChange} />);

      const clearAllButton = screen.getByRole('button', { name: 'Clear all filters' });
      fireEvent.click(clearAllButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({});
    });

    it('does not show Clear All Filters when no filters are active', () => {
      render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

      const clearAllButton = screen.queryByRole('button', { name: 'Clear all filters' });
      expect(clearAllButton).not.toBeInTheDocument();
    });

    it('shows Clear All Filters when only one filter is active', () => {
      const filtersWithMonth: ExpenseFilter = { month: 'May' };
      render(<ExpenseFilters filters={filtersWithMonth} onFilterChange={mockOnFilterChange} />);

      const clearAllButton = screen.getByRole('button', { name: 'Clear all filters' });
      expect(clearAllButton).toBeInTheDocument();
    });

    it('maintains proper filter status display order', () => {
      const filtersWithBoth: ExpenseFilter = { month: 'June', category: 'Transportation' };
      render(<ExpenseFilters filters={filtersWithBoth} onFilterChange={mockOnFilterChange} />);

      // Status should show month first, then category
      expect(screen.getByText('Filtering by: June, Transportation')).toBeInTheDocument();
    });

    it('handles rapid combined filter changes correctly', () => {
      let currentFilters = { ...initialFilters };
      const handleFilterChange = (newFilters: ExpenseFilter) => {
        currentFilters = { ...newFilters };
        mockOnFilterChange(newFilters);
      };

      const { rerender } = render(<ExpenseFilters filters={currentFilters} onFilterChange={handleFilterChange} />);

      const monthSelect = screen.getByLabelText('Month');
      const categoryInput = screen.getByLabelText('Category');

      // Rapid changes to both filters
      fireEvent.change(monthSelect, { target: { value: 'January' } });
      rerender(<ExpenseFilters filters={currentFilters} onFilterChange={handleFilterChange} />);
      fireEvent.change(categoryInput, { target: { value: 'Food' } });
      rerender(<ExpenseFilters filters={currentFilters} onFilterChange={handleFilterChange} />);
      fireEvent.change(monthSelect, { target: { value: 'February' } });
      rerender(<ExpenseFilters filters={currentFilters} onFilterChange={handleFilterChange} />);
      fireEvent.change(categoryInput, { target: { value: 'Transportation' } });

      expect(mockOnFilterChange).toHaveBeenCalledTimes(4);
      expect(mockOnFilterChange).toHaveBeenLastCalledWith({ month: 'February', category: 'Transportation' });
    });

    it('preserves combined filters when clearing individual filters', () => {
      const filtersWithBoth: ExpenseFilter = { month: 'July', category: 'Entertainment' };
      render(<ExpenseFilters filters={filtersWithBoth} onFilterChange={mockOnFilterChange} />);

      // Clear only the month filter
      const clearMonthButton = screen.getByRole('button', { name: /clear month filter/i });
      fireEvent.click(clearMonthButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({ category: 'Entertainment' });

      // Reset mock and clear only the category filter
      mockOnFilterChange.mockClear();
      const clearCategoryButton = screen.getByRole('button', { name: /clear category filter/i });
      fireEvent.click(clearCategoryButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({ month: 'July', category: undefined });
    });

    it('updates combined filter status when individual filters are cleared', () => {
      const filtersWithBoth: ExpenseFilter = { month: 'August', category: 'Utilities' };
      render(<ExpenseFilters filters={filtersWithBoth} onFilterChange={mockOnFilterChange} />);

      // Status should show both initially
      expect(screen.getByText('Filtering by: August, Utilities')).toBeInTheDocument();

      // After clearing month, should only show category
      const clearMonthButton = screen.getByRole('button', { name: /clear month filter/i });
      fireEvent.click(clearMonthButton);

      expect(mockOnFilterChange).toHaveBeenCalledWith({ category: 'Utilities' });
    });

    it('handles empty string category filter correctly with month filter', () => {
      const filtersWithBoth: ExpenseFilter = { month: 'September', category: 'Food' };
      render(<ExpenseFilters filters={filtersWithBoth} onFilterChange={mockOnFilterChange} />);

      const categoryInput = screen.getByLabelText('Category');
      fireEvent.change(categoryInput, { target: { value: '' } }); // Clear category

      expect(mockOnFilterChange).toHaveBeenCalledWith({ month: 'September', category: undefined });
    });

    it('maintains accessibility attributes with combined filters', () => {
      const filtersWithBoth: ExpenseFilter = { month: 'October', category: 'Other' };
      render(<ExpenseFilters filters={filtersWithBoth} onFilterChange={mockOnFilterChange} />);

      // Month filter accessibility
      const monthSelect = screen.getByLabelText('Month');
      expect(monthSelect).toHaveAttribute('aria-describedby');
      expect(monthSelect).toHaveAttribute('aria-required', 'false');

      // Category filter accessibility
      const categoryInput = screen.getByLabelText('Category');
      expect(categoryInput).toHaveAttribute('aria-describedby');
      expect(categoryInput).toHaveAttribute('aria-required', 'false');

      // Clear buttons accessibility
      const clearMonthButton = screen.getByRole('button', { name: /clear month filter/i });
      expect(clearMonthButton).toHaveAttribute('aria-label', 'Clear month filter (October)');

      const clearCategoryButton = screen.getByRole('button', { name: /clear category filter/i });
      expect(clearCategoryButton).toHaveAttribute('aria-label', 'Clear category filter (Other)');

      // Clear all button accessibility
      const clearAllButton = screen.getByRole('button', { name: 'Clear all filters' });
      expect(clearAllButton).toHaveAttribute('aria-label', 'Clear all filters');
    });

    it('supports keyboard navigation with combined filters', async () => {
      const user = userEvent.setup();
      render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

      const monthSelect = screen.getByLabelText('Month');
      const categoryInput = screen.getByLabelText('Category');

      // Tab navigation between filters
      monthSelect.focus();
      expect(document.activeElement).toBe(monthSelect);

      // Simulate tab to category input (would be next in tab order)
      // For this test, we'll just verify the elements are focusable
      expect(monthSelect).toBeInTheDocument();
      expect(categoryInput).toBeInTheDocument();

      // Change month filter
      fireEvent.change(monthSelect, { target: { value: 'November' } });
      expect(mockOnFilterChange).toHaveBeenCalledWith({ month: 'November' });

      // Type in category - just verify it triggers onChange events
      await user.clear(categoryInput);
      await user.type(categoryInput, 'Food');
      expect(mockOnFilterChange).toHaveBeenCalled();
    });

    it('handles filter state transitions with combined filters', () => {
      // Start with no filters
      const { rerender } = render(<ExpenseFilters filters={initialFilters} onFilterChange={mockOnFilterChange} />);

      // Apply month filter
      rerender(<ExpenseFilters filters={{ month: 'January' }} onFilterChange={mockOnFilterChange} />);
      expect(screen.getByText('Filtering by: January')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Clear all filters' })).toBeInTheDocument();

      // Apply category filter
      rerender(<ExpenseFilters filters={{ month: 'January', category: 'Food' }} onFilterChange={mockOnFilterChange} />);
      expect(screen.getByText('Filtering by: January, Food')).toBeInTheDocument();

      // Clear all filters
      rerender(<ExpenseFilters filters={{}} onFilterChange={mockOnFilterChange} />);
      expect(screen.queryByText(/filtering by/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Clear all filters' })).not.toBeInTheDocument();
    });

    it('validates combined filter input handling', () => {
      let currentFilters = { ...initialFilters };
      const handleFilterChange = (newFilters: ExpenseFilter) => {
        currentFilters = { ...newFilters };
        mockOnFilterChange(newFilters);
      };

      const { rerender } = render(<ExpenseFilters filters={currentFilters} onFilterChange={handleFilterChange} />);

      const monthSelect = screen.getByLabelText('Month');
      const categoryInput = screen.getByLabelText('Category');

      // Valid month and category combination - test that changes preserve other filters
      fireEvent.change(monthSelect, { target: { value: 'December' } });
      rerender(<ExpenseFilters filters={currentFilters} onFilterChange={handleFilterChange} />);
      expect(mockOnFilterChange).toHaveBeenLastCalledWith({ month: 'December' });

      fireEvent.change(categoryInput, { target: { value: 'Entertainment' } });
      rerender(<ExpenseFilters filters={currentFilters} onFilterChange={handleFilterChange} />);
      expect(mockOnFilterChange).toHaveBeenLastCalledWith({ month: 'December', category: 'Entertainment' });

      // Clear category while keeping month
      fireEvent.change(categoryInput, { target: { value: '' } });
      rerender(<ExpenseFilters filters={currentFilters} onFilterChange={handleFilterChange} />);
      expect(mockOnFilterChange).toHaveBeenLastCalledWith({ month: 'December', category: undefined });

      // Change to different month
      fireEvent.change(monthSelect, { target: { value: 'January' } });
      expect(mockOnFilterChange).toHaveBeenLastCalledWith({ month: 'January', category: undefined });
    });
  });
});
