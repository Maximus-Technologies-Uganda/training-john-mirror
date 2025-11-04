// Core expense entity stored in localStorage
export interface Expense {
  id: string;
  amount: number; // Amount in cents (e.g., 1050 for $10.50)
  description: string;
  month: Month;
  category: string;
}

// Valid month names (full names only)
export type Month =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

// Predefined expense categories
export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Other',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// Filtering criteria for expenses
export interface ExpenseFilter {
  month?: Month;
  category?: string;
}

// Form data for expense creation (decimal input)
export interface ExpenseFormData {
  amount: string; // Decimal format (e.g., "10.50")
  description: string;
  month: Month;
  category: string;
}

// Display data for expense rendering (formatted output)
export interface ExpenseDisplayData {
  id: string;
  amount: string; // Formatted decimal (e.g., "$10.50")
  description: string;
  month: Month;
  category: string;
}

// Validation error structure
export interface ValidationError {
  field: keyof ExpenseFormData;
  message: string;
  value: any;
}

// API response types for core module integration
export interface AddExpenseRequest {
  amount: number; // cents
  description: string;
  month: Month;
  category: string;
}

export interface AddExpenseResponse {
  success: boolean;
  expense?: Expense;
  error?: string;
}

export interface GetExpensesResponse {
  success: boolean;
  expenses?: Expense[];
  error?: string;
}

export interface FilterExpensesRequest {
  month?: Month;
  category?: string;
}

export interface FilterExpensesResponse {
  success: boolean;
  expenses?: Expense[];
  error?: string;
}

export interface ValidateExpenseRequest {
  amount: number; // cents
  description: string;
  month: Month;
  category: string;
}

export interface ValidateExpenseResponse {
  success: boolean;
  errors?: ValidationError[];
}

// Utility types for form handling
export type ExpenseFormErrors = Partial<Record<keyof ExpenseFormData, string>>;

// Constants for validation
export const VALIDATION_RULES = {
  amount: {
    min: 0.01,
    max: 999999.99,
  },
  description: {
    minLength: 1,
    maxLength: 200,
  },
  category: {
    minLength: 1,
    maxLength: 100,
  },
} as const;
