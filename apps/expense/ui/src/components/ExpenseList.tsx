import React from 'react';
import { Expense } from '../types/expense';
import { fromCents } from '../utils/currency';
import './ExpenseList.css';

interface ExpenseListProps {
  expenses: Expense[];
}

/**
 * ExpenseList Component
 *
 * Displays a list of expenses with proper formatting and accessibility features.
 * Optimized with React.memo and useMemo for performance.
 *
 * Features:
 * - Currency formatting for amounts
 * - Empty state handling
 * - Accessibility support (ARIA labels, semantic HTML, proper table headers)
 * - Expense count and total summary
 * - Responsive design (mobile-first)
 * - Performance optimized with memoization
 *
 * Performance Notes:
 * - Wrapped in React.memo to prevent unnecessary re-renders
 * - Sorting and total calculation memoized
 * - For lists > 1000 items, consider virtualization
 */
export const ExpenseList: React.FC<ExpenseListProps> = React.memo(({ expenses }) => {
  // Sort expenses by ID in reverse chronological order (newer first)
  const sortedExpenses = React.useMemo(() =>
    [...expenses].sort((a, b) => b.id.localeCompare(a.id)),
    [expenses]
  );

  // Calculate total amount
  const totalAmount = React.useMemo(() =>
    sortedExpenses.reduce((total, expense) => total + expense.amount, 0),
    [sortedExpenses]
  );

  if (expenses.length === 0) {
    return (
      <div className="expense-list empty-state" role="region" aria-label="Expense list">
        <h2 className="expense-list-title">Your Expenses</h2>
        <div className="empty-state-content">
          <p className="empty-state-message">No expenses found</p>
          <p className="empty-state-subtitle">Add your first expense to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list" role="region" aria-label="Expense list">
      <header className="expense-list-header">
        <h2 className="expense-list-title">Your Expenses</h2>
        <div className="expense-summary" role="complementary" aria-label="Expense summary">
          <span className="expense-count" aria-label={`Total: ${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`}>
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </span>
          <span className="expense-total" aria-label={`Total amount: $${fromCents(totalAmount)}`}>
            Total: ${fromCents(totalAmount)}
          </span>
        </div>
      </header>

      <div className="expense-table-container">
        <table className="expense-table" aria-label="List of expenses">
          <thead className="expense-table-header">
            <tr>
              <th scope="col" className="expense-header-description">Description</th>
              <th scope="col" className="expense-header-amount">Amount</th>
              <th scope="col" className="expense-header-category">Category</th>
              <th scope="col" className="expense-header-month">Month</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((expense) => (
              <tr key={expense.id} className="expense-row">
                <td className="expense-description">
                  {expense.description}
                </td>
                <td className="expense-amount" data-label="Amount">
                  ${fromCents(expense.amount)}
                </td>
                <td className={`expense-category ${expense.category.toLowerCase()}`} data-label="Category">
                  {expense.category}
                </td>
                <td className="expense-month" data-label="Month">
                  {expense.month}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

// Add display name for better debugging
ExpenseList.displayName = 'ExpenseList';
