/**
 * Expense Core Module Integration
 *
 * This module provides integration functions that connect the UI layer
 * to the expense core business logic module. It handles data transformation,
 * error handling, and provides a clean interface for UI components.
 *
 * All business logic is delegated to the core module to maintain separation
 * of concerns and enable independent testing of UI and business logic.
 *
 * @example
 * ```typescript
 * // Add a new expense
 * const expense = await addExpense({
 *   amount: 1050, // $10.50 in cents
 *   description: 'Lunch at restaurant',
 *   month: 'January',
 *   category: 'Food'
 * });
 *
 * // Get all expenses
 * const expenses = await getExpenses();
 *
 * // Filter expenses by month
 * const januaryExpenses = await filterExpenses(expenses, { month: 'January' });
 *
 * // Validate expense data
 * const validation = await validateExpense({
 *   amount: 2000,
 *   description: 'Dinner',
 *   month: 'February',
 *   category: 'Food'
 * });
 * ```
 */

// ============================================================================
// IMPORTS & TYPES
// ============================================================================

import {
  Expense,
  ExpenseFilter,
  ExpenseFormData,
  Month,
  AddExpenseRequest,
  FilterExpensesRequest,
  AddExpenseResponse,
  GetExpensesResponse,
  FilterExpensesResponse,
  ValidateExpenseRequest,
  ValidateExpenseResponse
} from '../types/expense';
import { ValidationError as ValidationErrorType } from '../types/expense';
import { toCents } from '../utils/currency';

// ============================================================================
// LOCALSTORAGE-BASED CORE IMPLEMENTATIONS
// ============================================================================

const EXPENSES_STORAGE_KEY = 'expense-tracker:expenses';

/**
 * Get all expenses from localStorage
 * @returns Array of stored expenses
 */
function getStoredExpenses(): Expense[] {
  try {
    const stored = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      console.warn('Invalid expenses data in localStorage, resetting to empty array');
      return [];
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load expenses from localStorage:', error);
    return [];
  }
}

/**
 * Save expenses to localStorage
 * @param expenses - Array of expenses to save
 */
function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Failed to save expenses to localStorage:', error);
    throw new Error('Failed to persist expense data');
  }
}

/**
 * Add a new expense via localStorage
 * @param expenseData - Expense data to add (amount in cents)
 * @returns Promise resolving to the created expense or error
 */
async function coreAddExpense(expenseData: AddExpenseRequest): Promise<AddExpenseResponse> {
  try {
    const expenses = getStoredExpenses();

    // Create new expense with generated ID
    const newExpense: Expense = {
      id: generateExpenseId(),
      amount: expenseData.amount,
      description: expenseData.description.trim(),
      month: expenseData.month,
      category: expenseData.category.trim(),
    };

    // Check for duplicates
    if (isDuplicateExpense(newExpense, expenses)) {
      return {
        success: false,
        error: 'An expense with the same amount, description, and month already exists'
      };
    }

    // Add to expenses array
    expenses.push(newExpense);
    saveExpenses(expenses);

    return {
      success: true,
      expense: newExpense
    };
  } catch (error) {
    console.error('coreAddExpense failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get all expenses via localStorage
 * @returns Promise resolving to all expenses
 */
async function coreGetExpenses(): Promise<GetExpensesResponse> {
  try {
    const expenses = getStoredExpenses();
    return {
      success: true,
      expenses
    };
  } catch (error) {
    console.error('coreGetExpenses failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve expenses'
    };
  }
}

/**
 * Filter expenses via localStorage
 * @param expenses - Array of expenses to filter
 * @param filter - Filter criteria
 * @returns Promise resolving to filtered expenses
 */
async function coreFilterExpenses(expenses: Expense[], filter: FilterExpensesRequest): Promise<FilterExpensesResponse> {
  try {
    let filteredExpenses = expenses;

    // Apply month filter
    if (filter.month) {
      filteredExpenses = filteredExpenses.filter(expense => expense.month === filter.month);
    }

    // Apply category filter
    if (filter.category) {
      filteredExpenses = filteredExpenses.filter(expense => expense.category === filter.category);
    }

    return {
      success: true,
      expenses: filteredExpenses
    };
  } catch (error) {
    console.error('coreFilterExpenses failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to filter expenses'
    };
  }
}

/**
 * Validate expense data
 * @param expenseData - Expense data to validate
 * @returns Promise resolving to validation result
 */
async function coreValidateExpense(expenseData: ValidateExpenseRequest): Promise<ValidateExpenseResponse> {
  try {
    const errors: ValidationErrorType[] = [];

    // Validate amount (must be positive integer in cents)
    if (!Number.isInteger(expenseData.amount) || expenseData.amount <= 0) {
      errors.push({
        field: 'amount',
        message: 'Amount must be a positive number in cents',
        value: expenseData.amount
      });
    }

    // Validate description
    const trimmedDesc = expenseData.description.trim();
    if (!trimmedDesc) {
      errors.push({
        field: 'description',
        message: 'Description is required',
        value: expenseData.description
      });
    } else if (trimmedDesc.length > 200) {
      errors.push({
        field: 'description',
        message: 'Description must be 200 characters or less',
        value: expenseData.description
      });
    }

    // Validate month
    const validMonths = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    if (!validMonths.includes(expenseData.month)) {
      errors.push({
        field: 'month',
        message: 'Please select a valid month',
        value: expenseData.month
      });
    }

    // Validate category
    const trimmedCat = expenseData.category.trim();
    if (!trimmedCat) {
      errors.push({
        field: 'category',
        message: 'Category is required',
        value: expenseData.category
      });
    } else if (trimmedCat.length > 100) {
      errors.push({
        field: 'category',
        message: 'Category must be 100 characters or less',
        value: expenseData.category
      });
    }

    return {
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('coreValidateExpense failed:', error);
    return {
      success: false,
      errors: [{
        field: 'amount' as keyof ExpenseFormData, // Use a valid field key
        message: 'Validation failed due to an unexpected error',
        value: null
      }]
    };
  }
}

// ============================================================================
// INTEGRATION FUNCTIONS
// ============================================================================

/**
 * Add a new expense with error handling and type safety
 *
 * @param expenseData - Expense data from form (amount in cents)
 * @returns Promise resolving to the created expense
 * @throws ValidationError if expense data is invalid
 * @throws DuplicateError if expense already exists
 * @throws CoreError if core module operation fails
 */
export async function addExpense(expenseData: AddExpenseRequest): Promise<Expense> {
  try {
    const response = await coreAddExpense(expenseData);

    if (response.success && response.expense) {
      return response.expense;
    } else {
      const error = response.error || 'Unknown error occurred while adding expense';
      throw new Error(error);
    }
  } catch (error) {
    // Re-throw core module errors with additional context
    if (error instanceof Error) {
      throw new Error(`Failed to add expense: ${error.message}`);
    }
    throw new Error('Failed to add expense: Unknown error');
  }
}

/**
 * Retrieve all expenses with error handling
 *
 * @returns Promise resolving to array of all expenses
 * @throws CoreError if core module operation fails
 */
export async function getExpenses(): Promise<Expense[]> {
  try {
    const response = await coreGetExpenses();

    if (response.success && response.expenses) {
      return response.expenses;
    } else {
      const error = response.error || 'Unknown error occurred while retrieving expenses';
      throw new Error(error);
    }
  } catch (error) {
    // Re-throw core module errors with additional context
    if (error instanceof Error) {
      throw new Error(`Failed to retrieve expenses: ${error.message}`);
    }
    throw new Error('Failed to retrieve expenses: Unknown error');
  }
}

/**
 * Filter expenses by criteria with error handling
 *
 * @param expenses - Array of expenses to filter
 * @param filter - Filter criteria (month and/or category)
 * @returns Promise resolving to filtered expenses array
 * @throws CoreError if core module operation fails
 */
export async function filterExpenses(expenses: Expense[], filter: ExpenseFilter): Promise<Expense[]> {
  // Validate filter has at least one criterion
  if (!filter.month && !filter.category) {
    throw new Error('Filter must specify at least one criterion (month or category)');
  }

  try {
    const response = await coreFilterExpenses(expenses, filter);

    if (response.success && response.expenses) {
      return response.expenses;
    } else {
      const error = response.error || 'Unknown error occurred while filtering expenses';
      throw new Error(error);
    }
  } catch (error) {
    // Re-throw core module errors with additional context
    if (error instanceof Error) {
      throw new Error(`Failed to filter expenses: ${error.message}`);
    }
    throw new Error('Failed to filter expenses: Unknown error');
  }
}

/**
 * Validate expense data without creating the expense
 *
 * @param expenseData - Expense data to validate
 * @returns Promise resolving to validation result
 * @throws CoreError if core module operation fails
 */
export async function validateExpense(expenseData: ValidateExpenseRequest): Promise<{
  valid: boolean;
  errors?: ValidationErrorType[];
}> {
  try {
    const response = await coreValidateExpense(expenseData);

    return {
      valid: response.success,
      errors: response.errors
    };
  } catch (error) {
    // Re-throw core module errors with additional context
    if (error instanceof Error) {
      throw new Error(`Failed to validate expense: ${error.message}`);
    }
    throw new Error('Failed to validate expense: Unknown error');
  }
}

/**
 * Check if an expense already exists (duplicate detection)
 *
 * @param newExpense - New expense data to check
 * @param existingExpenses - Array of existing expenses
 * @returns True if expense already exists
 */
export function isDuplicateExpense(
  newExpense: Omit<Expense, 'id'>,
  existingExpenses: Expense[]
): boolean {
  return existingExpenses.some(expense =>
    expense.amount === newExpense.amount &&
    expense.description === newExpense.description &&
    expense.month === newExpense.month
  );
}

/**
 * Generate a unique ID for a new expense
 * This is a simple implementation - in production, use UUID or similar
 *
 * @returns Unique expense identifier
 */
export function generateExpenseId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `exp-${timestamp}-${random}`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Transform form data to core module format
 * Handles cents conversion and data normalization
 *
 * @param formData - Form data with decimal amount string
 * @returns Core module request format with amount in cents
 */
export function transformFormDataToExpenseInput(formData: {
  amount: string;
  description: string;
  month: string;
  category: string;
}): AddExpenseRequest {
  return {
    amount: toCents(formData.amount),
    description: formData.description.trim(),
    month: formData.month as Month,
    category: formData.category.trim()
  };
}

/**
 * Calculate total amount from array of expenses
 *
 * @param expenses - Array of expenses
 * @returns Total amount in cents
 */
export function calculateTotalAmount(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

/**
 * Group expenses by month
 *
 * @param expenses - Array of expenses
 * @returns Map of month to expenses array
 */
export function groupExpensesByMonth(expenses: Expense[]): Map<string, Expense[]> {
  const grouped = new Map<string, Expense[]>();

  expenses.forEach(expense => {
    const month = expense.month;
    if (!grouped.has(month)) {
      grouped.set(month, []);
    }
    grouped.get(month)!.push(expense);
  });

  return grouped;
}

/**
 * Group expenses by category
 *
 * @param expenses - Array of expenses
 * @returns Map of category to expenses array
 */
export function groupExpensesByCategory(expenses: Expense[]): Map<string, Expense[]> {
  const grouped = new Map<string, Expense[]>();

  expenses.forEach(expense => {
    const category = expense.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(expense);
  });

  return grouped;
}

// ============================================================================
// ERROR CLASSES
// ============================================================================

/**
 * Custom error for validation failures
 */
export class ExpenseValidationError extends Error {
  constructor(
    public field: string,
    message: string,
    public value?: any
  ) {
    super(message);
    this.name = 'ExpenseValidationError';
  }
}

/**
 * Custom error for duplicate expense detection
 */
export class DuplicateExpenseError extends Error {
  constructor(message: string = 'Expense already exists') {
    super(message);
    this.name = 'DuplicateExpenseError';
  }
}

/**
 * Custom error for core module integration failures
 */
export class CoreIntegrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CoreIntegrationError';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  type AddExpenseRequest,
  type FilterExpensesRequest,
  type AddExpenseResponse,
  type GetExpensesResponse,
  type FilterExpensesResponse,
  type ValidateExpenseRequest,
  type ValidateExpenseResponse
} from '../types/expense';
