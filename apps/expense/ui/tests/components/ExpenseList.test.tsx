import { render, screen } from '@testing-library/react';
import { ExpenseList } from '../../src/components/ExpenseList';
import { Expense } from '../../src/types/expense';

describe('ExpenseList', () => {
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

  it('renders all expenses correctly', () => {
    render(<ExpenseList expenses={mockExpenses} />);

    // Check that all expenses are displayed
    expect(screen.getByText('Lunch at restaurant')).toBeInTheDocument();
    expect(screen.getByText('Bus ticket')).toBeInTheDocument();
    expect(screen.getByText('Movie tickets')).toBeInTheDocument();

    // Check amounts are formatted correctly
    expect(screen.getByText('$10.50')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByText('$7.50')).toBeInTheDocument();

    // Check categories are displayed
    expect(screen.getAllByText('Food')).toHaveLength(1);
    expect(screen.getAllByText('Transportation')).toHaveLength(1);
    expect(screen.getAllByText('Entertainment')).toHaveLength(1);

    // Check months are displayed
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('February')).toBeInTheDocument();
    expect(screen.getByText('March')).toBeInTheDocument();
  });

  it('displays expenses in a table format', () => {
    render(<ExpenseList expenses={mockExpenses} />);

    // Should have a table with multiple expense rows
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Should have table rows for each expense
    const tableRows = screen.getAllByRole('row');
    // Note: getAllByRole('row') includes the header row, so we expect 4 total (1 header + 3 data)
    expect(tableRows).toHaveLength(4);
  });

  it('shows proper currency formatting for different amounts', () => {
    const testExpenses: Expense[] = [
      {
        id: 'exp-1',
        amount: 100, // $1.00
        description: 'Small expense',
        month: 'January',
        category: 'Other'
      },
      {
        id: 'exp-2',
        amount: 10000, // $100.00
        description: 'Large expense',
        month: 'January',
        category: 'Other'
      },
      {
        id: 'exp-3',
        amount: 505, // $5.05
        description: 'Decimal expense',
        month: 'January',
        category: 'Other'
      }
    ];

    render(<ExpenseList expenses={testExpenses} />);

    expect(screen.getByText('$1.00')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$5.05')).toBeInTheDocument();
  });

  it('handles empty expense list', () => {
    render(<ExpenseList expenses={[]} />);

    // Should show empty state message
    expect(screen.getByText(/no expenses/i)).toBeInTheDocument();
    expect(screen.getByText(/add your first expense/i)).toBeInTheDocument();
  });

  it('displays expense details with proper labels', () => {
    render(<ExpenseList expenses={[mockExpenses[0]]} />);

    // Check that expense details are properly labeled
    expect(screen.getByText('$10.50')).toBeInTheDocument();
    expect(screen.getByText('Lunch at restaurant')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('January')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ExpenseList expenses={mockExpenses} />);

    // Should have proper heading structure
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/expenses/i);

    // Should have a table role
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('aria-label', 'Expenses table');

    // Should have table header cells (even if visually hidden)
    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells).toHaveLength(4); // Description, Amount, Category, Month

    // Should have table rows for each expense
    const tableRows = screen.getAllByRole('row');
    expect(tableRows).toHaveLength(4); // 1 header + 3 data rows
  });

  it('displays expenses in reverse chronological order by default', () => {
    // Create expenses with different timestamps in IDs (simulating creation order)
    const orderedExpenses: Expense[] = [
      {
        id: 'exp-1735689600000-abc123', // Newer expense
        amount: 500,
        description: 'Recent expense',
        month: 'January',
        category: 'Food'
      },
      {
        id: 'exp-1735603200000-def456', // Older expense
        amount: 300,
        description: 'Older expense',
        month: 'January',
        category: 'Food'
      }
    ];

    render(<ExpenseList expenses={orderedExpenses} />);

    // Newer expense should appear first - check by finding the description cells
    const expenseDescriptions = screen.getAllByText(/expense/);
    // Filter to get only the description cells (not the summary text)
    const descriptionCells = expenseDescriptions.filter(element =>
      element.classList.contains('expense-description')
    );
    expect(descriptionCells[0]).toHaveTextContent('Recent expense');
    expect(descriptionCells[1]).toHaveTextContent('Older expense');
  });

  it('renders expense amounts with proper ARIA labels for screen readers', () => {
    render(<ExpenseList expenses={[mockExpenses[0]]} />);

    const amountElement = screen.getByText('$10.50');
    expect(amountElement).toHaveAttribute('aria-label', 'Amount: $10.50');
  });

  it('shows expense count summary', () => {
    render(<ExpenseList expenses={mockExpenses} />);

    expect(screen.getByText('3 expenses')).toBeInTheDocument();
  });

  it('handles single expense correctly', () => {
    render(<ExpenseList expenses={[mockExpenses[0]]} />);

    expect(screen.getByText('1 expense')).toBeInTheDocument();
    expect(screen.getByText('Lunch at restaurant')).toBeInTheDocument();
    expect(screen.getByText('$10.50')).toBeInTheDocument();
  });

  it('displays category with proper styling or icons', () => {
    render(<ExpenseList expenses={[mockExpenses[0]]} />);

    const categoryElement = screen.getByText('Food');
    expect(categoryElement).toHaveClass('expense-category');
  });

  it('formats long descriptions appropriately', () => {
    const longDescriptionExpense: Expense = {
      id: 'exp-test',
      amount: 1000,
      description: 'This is a very long description that might need to be truncated or wrapped appropriately in the UI',
      month: 'January',
      category: 'Other'
    };

    render(<ExpenseList expenses={[longDescriptionExpense]} />);

    expect(screen.getByText(longDescriptionExpense.description)).toBeInTheDocument();
  });

  it('handles expenses with zero amount', () => {
    const zeroAmountExpense: Expense = {
      id: 'exp-zero',
      amount: 0,
      description: 'Free item',
      month: 'January',
      category: 'Other'
    };

    render(<ExpenseList expenses={[zeroAmountExpense]} />);

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('displays total amount of all expenses', () => {
    render(<ExpenseList expenses={mockExpenses} />);

    // 1050 + 2500 + 750 = 4300 cents = $43.00
    expect(screen.getByText('Total: $43.00')).toBeInTheDocument();
  });
});
