import React from 'react';
import { ExpenseFilter, EXPENSE_CATEGORIES, Month } from '../types/expense';
import { getValidMonths } from '../utils/validation';

interface ExpenseFiltersProps {
  filters: ExpenseFilter;
  onFilterChange: (filters: ExpenseFilter) => void;
}

/**
 * ExpenseFilters Component
 *
 * Provides filtering controls for expenses, allowing users to filter by month and category.
 *
 * Features:
 * - Month selection dropdown
 * - Category selection dropdown
 * - Clear individual filter functionality
 * - Combined filter status display
 * - Accessibility support
 * - Keyboard navigation
 */
export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters = {},
  onFilterChange
}) => {
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value || undefined;
    onFilterChange({
      ...filters,
      month: selectedMonth as Month | undefined
    });
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCategory = event.target.value || undefined;
    onFilterChange({
      ...filters,
      category: selectedCategory
    });
  };

  const clearMonthFilter = () => {
    onFilterChange({
      ...filters,
      month: undefined
    });
  };

  const clearCategoryFilter = () => {
    onFilterChange({
      ...filters,
      category: undefined
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = !!(filters.month || filters.category);
  const currentMonth = filters.month;
  const currentCategory = filters.category;

  return (
    <section className="expense-filters" role="region" aria-label="Filter expenses">
      <h3 className="expense-filters-title">Filter Expenses</h3>

      {hasActiveFilters && (
        <div className="filter-status" role="status" aria-live="polite">
          Filtering by: {[currentMonth, currentCategory].filter(Boolean).join(', ')}
        </div>
      )}

      <div className="filter-controls">
        {/* Month Filter */}
        <div className="filter-group">
          <label htmlFor="month-filter" className="filter-label">
            Month
          </label>
          <div className="filter-input-wrapper">
            <select
              id="month-filter"
              value={currentMonth || ''}
              onChange={handleMonthChange}
              className="filter-select"
              aria-describedby="month-filter-help"
              aria-required="false"
            >
              <option value="">All Months</option>
              {getValidMonths().map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            {currentMonth && (
              <button
                type="button"
                onClick={clearMonthFilter}
                className="clear-filter-button"
                aria-label={`Clear month filter (${currentMonth})`}
                title={`Clear month filter`}
              >
                ✕
              </button>
            )}
          </div>

          <div id="month-filter-help" className="sr-only">
            Select a month to filter expenses by that month only
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">
            Category
          </label>
          <div className="filter-input-wrapper">
            <input
              id="category-filter"
              type="text"
              value={currentCategory || ''}
              onChange={handleCategoryChange}
              className="filter-input"
              placeholder="All Categories"
              list="category-list"
              aria-describedby="category-filter-help"
              aria-required="false"
            />
            <datalist id="category-list">
              <option value="" />
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>

            {currentCategory && (
              <button
                type="button"
                onClick={clearCategoryFilter}
                className="clear-filter-button"
                aria-label={`Clear category filter (${currentCategory})`}
                title={`Clear category filter`}
              >
                ✕
              </button>
            )}
          </div>

          <div id="category-filter-help" className="sr-only">
            Enter or select a category to filter expenses by that category only. Predefined categories are available for quick selection.
          </div>
        </div>
      </div>

          {hasActiveFilters && (
            <div className="filter-actions">
              <button
                type="button"
                onClick={clearAllFilters}
                className="clear-all-filters-button"
                aria-label="Clear all filters"
              >
                Clear All Filters
              </button>
            </div>
          )}
    </section>
  );
};
