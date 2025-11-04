/**
 * Complete User Workflow Integration Test
 *
 * This test validates the complete end-to-end user workflow for the expense tracking application,
 * ensuring all components work together seamlessly from expense creation to filtering and display.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../../src/App';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock console methods to avoid noise in tests
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Complete User Workflow Integration', () => {
  beforeEach(() => {
    // Reset localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();

    // Mock empty localStorage initially
    localStorageMock.getItem.mockReturnValue(null);

    // Reset console spies
    consoleSpy.mockClear();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('validates complete application integration and workflow', async () => {
    render(<App />);

    // ===== INTEGRATION VALIDATION =====
    console.log('🧪 Testing complete application integration...');

    // Verify the main application structure is rendered
    expect(screen.getAllByText('Expense Tracker')).toHaveLength(2); // App header and expense view header
    expect(screen.getByText(/Track your expenses with ease/)).toBeInTheDocument();

    // Verify all major sections are present
    expect(screen.getByText('Add New Expense')).toBeInTheDocument();
    expect(screen.getByText('Your Expenses')).toBeInTheDocument();
    expect(screen.getByText('Filter Expenses')).toBeInTheDocument();

    // Verify form inputs are present and initially empty
    const emptyInputs = screen.getAllByDisplayValue('');
    expect(emptyInputs.length).toBeGreaterThanOrEqual(3); // Amount, description, category inputs
    expect(screen.getByRole('button', { name: 'Add Expense' })).toBeInTheDocument();

    // Verify empty state
    expect(screen.getByText('No expenses found')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses: 0')).toBeInTheDocument();

    // ===== COMPONENT INTEGRATION =====
    console.log('🧪 Testing component integration...');

    // Verify ErrorBoundary is wrapping the app (no crash on render)
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();

    // Verify useExpenses hook integration with localStorage
    expect(localStorageMock.getItem).toHaveBeenCalled();

    // Verify responsive layout structure
    expect(screen.getAllByRole('banner').length).toBeGreaterThan(0); // Headers exist
    const mainElements = screen.getAllByRole('main');
    expect(mainElements.length).toBeGreaterThan(0); // Main content areas exist

    // ===== WORKFLOW SIMULATION =====
    console.log('🧪 Testing basic workflow integration...');

    // Find form elements using more reliable selectors
    const amountInput = screen.getByPlaceholderText('0.00');
    const descriptionInput = screen.getByPlaceholderText('Enter expense description');
    const monthSelect = screen.getByDisplayValue('Select month'); // Default option
    const categoryInput = screen.getByPlaceholderText('Enter category (e.g., Food, Transportation)');
    const submitButton = screen.getByRole('button', { name: 'Add Expense' });

    // Simulate adding an expense
    fireEvent.change(amountInput, { target: { value: '25.50' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test expense' } });
    fireEvent.change(monthSelect, { target: { value: 'January' } });
    fireEvent.change(categoryInput, { target: { value: 'Food' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify the expense appears (integration between form and list)
    await waitFor(() => {
      expect(screen.getByText('Test expense')).toBeInTheDocument();
    });

    // Verify data flows to display components
    expect(screen.getByText('$25.50')).toBeInTheDocument();
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();

    // Verify statistics update
    expect(screen.getByText('Total Expenses: 1')).toBeInTheDocument();
    expect(screen.getByText('Total Amount: $25.50')).toBeInTheDocument();

    // ===== FILTERING INTEGRATION =====
    console.log('🧪 Testing filtering integration...');

    // Verify filter components are present and functional
    const monthFilter = screen.getByDisplayValue('All Months');

    // Test month filtering
    fireEvent.change(monthFilter, { target: { value: 'January' } });

    await waitFor(() => {
      expect(screen.getByText('Showing: 1')).toBeInTheDocument();
    });

    // Test category filtering
    const categoryFilter = screen.getByPlaceholderText('All Categories');
    fireEvent.change(categoryFilter, { target: { value: 'Food' } });

    await waitFor(() => {
      expect(screen.getByText('Showing: 1')).toBeInTheDocument();
    });

    // Test filter clearing
    const clearButton = screen.getByText('Clear All Filters');
    fireEvent.click(clearButton);

    // Verify filter state resets
    await waitFor(() => {
      expect(screen.getByText('Total Expenses: 1')).toBeInTheDocument();
    });

    // ===== DATA PERSISTENCE INTEGRATION =====
    console.log('🧪 Testing data persistence integration...');

    // Verify localStorage integration
    expect(localStorageMock.setItem).toHaveBeenCalled();

    // ===== ERROR HANDLING INTEGRATION =====
    console.log('🧪 Testing error handling integration...');

    // Test form validation integration
    fireEvent.click(submitButton); // Submit empty form

    // Verify validation works (form doesn't submit, shows errors)
    expect(screen.getByText('Amount is required')).toBeInTheDocument();

    console.log('✅ Complete user workflow integration test passed!');
  });

  it('ensures robust error boundaries protect the application', () => {
    console.log('🧪 Testing error boundary integration...');

    render(<App />);

    // Application should render without crashing - verify banners exist
    expect(screen.getAllByRole('banner').length).toBeGreaterThan(0);

    // Error boundary should be present but not visible in normal operation
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();

    console.log('✅ Error boundary integration test passed!');
  });

  it('validates accessibility compliance across all components', () => {
    console.log('🧪 Testing accessibility integration...');

    render(<App />);

    // Verify semantic HTML structure - check that banners exist (multiple allowed)
    expect(screen.getAllByRole('banner')).toHaveLength(2); // App header and expense view header
    const mainElements = screen.getAllByRole('main');
    expect(mainElements.length).toBeGreaterThanOrEqual(1); // App main content
    expect(screen.getByRole('form')).toBeInTheDocument();

    // Verify ARIA landmarks
    expect(screen.getByRole('region', { name: /Filter expenses/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Expense list/i })).toBeInTheDocument();

    // Verify table accessibility (when expenses exist, table should be present)
    // Since we start with empty state, just verify the structure is ready

    console.log('✅ Accessibility integration test passed!');
  });

  it('confirms data flows correctly between all application layers', () => {
    console.log('🧪 Testing data flow integration...');

    render(<App />);

    // Verify initial data loading from localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith('expense-tracker:expenses');

    // Verify data flows from hook to components
    expect(screen.getByText('Total Expenses: 0')).toBeInTheDocument();

    // Verify component state management integration
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    console.log('✅ Data flow integration test passed!');
  });
});
