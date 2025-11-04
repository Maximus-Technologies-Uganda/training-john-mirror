import React from 'react';
import { ExpenseList } from './ExpenseList';
import { ExpenseFilters } from './ExpenseFilters';
import { useExpenses } from '../hooks/useExpenses';

/**
 * ExpenseView Component
 *
 * Integrates expense filtering and display functionality.
 * Provides a complete expense management interface with filtering capabilities.
 *
 * Features:
 * - Expense list display with filtering
 * - Month-based filtering controls
 * - Real-time filter application
 * - Loading and error states
 * - Statistics display
 * - Accessibility support (ARIA labels, semantic HTML)
 */
export const ExpenseView: React.FC = () => {
  const {
    filteredExpenses,
    filters,
    setFilters,
    isLoading,
    error,
    stats
  } = useExpenses();

  if (isLoading) {
    return (
      <div className="expense-view loading" role="status" aria-live="polite" aria-busy="true">
        <div className="loading-message">Loading expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="expense-view error" role="alert" aria-live="assertive">
        <h2>Error Loading Expenses</h2>
        <p>{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="retry-button"
          aria-label="Retry loading expenses"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="expense-view">
      <header className="expense-view-header">
        <h1 className="expense-view-title">Expense Tracker</h1>
        <div className="expense-stats" role="status" aria-live="polite" aria-label="Expense statistics">
          <span className="stat-item">
            <span className="stat-label">Total Expenses:</span>
            <span className="stat-value">{stats.totalExpenses}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">Showing:</span>
            <span className="stat-value">{stats.filteredCount}</span>
          </span>
          {stats.isFiltered && (
            <span className="stat-item filtered" title="Filters are currently active">
              Filtered
            </span>
          )}
        </div>
      </header>

      <div className="expense-view-content">
        <aside className="expense-filters-sidebar" aria-label="Expense filters">
          <ExpenseFilters
            filters={filters}
            onFilterChange={setFilters}
          />
        </aside>

        <main className="expense-list-main">
          {stats.isFiltered && (
            <div className="filter-feedback" role="status" aria-live="polite" aria-label="Filter results">
              {stats.filteredCount === 0 ? (
                <div className="filter-feedback-warning">
                  <p>No expenses match your current filters.</p>
                  <p>Try adjusting your filters or clearing them to see all expenses.</p>
                </div>
              ) : (
                <div className="filter-feedback-info">
                  <p>
                    Found {stats.filteredCount} expense{stats.filteredCount !== 1 ? 's' : ''} matching your filters
                    {stats.filteredCount !== stats.totalExpenses && (
                      <span> (out of {stats.totalExpenses} total)</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
          <ExpenseList expenses={filteredExpenses} />
        </main>
      </div>
    </div>
  );
};
