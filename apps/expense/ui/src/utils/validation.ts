import { z } from 'zod';
import { Month, ExpenseCategory } from '../types/expense';

/**
 * Validation schemas using Zod for type-safe form validation
 *
 * These schemas ensure data integrity and provide clear error messages
 * for both form inputs and stored data.
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/** Valid month names for validation */
export const VALID_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

/** Predefined expense categories */
export const VALID_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Other'
] as const;

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Month validation schema
 * Ensures month is one of the 12 valid month names
 */
export const monthSchema = z.enum(VALID_MONTHS, {
  errorMap: () => ({ message: 'Please select a valid month' })
});

/**
 * Category validation schema
 * Accepts predefined categories or custom input
 */
export const categorySchema = z.string()
  .min(1, 'Category is required')
  .max(100, 'Category must be 100 characters or less');

/**
 * Predefined category schema (strict validation)
 */
export const predefinedCategorySchema = z.enum(VALID_CATEGORIES, {
  errorMap: () => ({ message: 'Please select a valid category' })
});

// ============================================================================
// AMOUNT VALIDATION SCHEMAS
// ============================================================================

/**
 * Decimal amount input validation (for forms)
 * Accepts string input like "10.50" and validates currency format
 */
export const decimalAmountSchema = z.string()
  .min(1, 'Amount is required')
    .refine((val) => {
    // Additional regex validation for currency format
    const currencyRegex = /^-?\d+(\.\d{1,2})?$/;
    return currencyRegex.test(val.trim());
  }, {
    message: 'Amount must be in decimal format (e.g., 10.50)'
  })
  .refine((val) => {
    // Allow empty string (will be caught by min length)
    if (!val.trim()) return false;

    // Parse and validate as currency
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0.01 && num <= 999999.99;
  }, {
    message: 'Amount must be a positive number between 0.01 and 999,999.99'
  });

/**
 * Cents amount validation (for stored data)
 * Validates integer cents values
 */
export const centsAmountSchema = z.number()
  .int('Amount in cents must be an integer')
  .min(1, 'Amount must be at least 1 cent')
  .max(99999999, 'Amount cannot exceed $999,999.99');

// ============================================================================
// EXPENSE FORM VALIDATION
// ============================================================================

/**
 * Schema for expense form data (user input validation)
 * Used by React Hook Form for form validation
 */
export const expenseFormSchema = z.object({
  amount: decimalAmountSchema,
  description: z.string()
    .min(1, 'Description is required')
    .max(200, 'Description must be 200 characters or less')
    .refine(val => val.trim().length > 0, 'Description cannot be only whitespace'),
  month: monthSchema,
  category: categorySchema
    .refine(val => val.trim().length > 0, 'Category cannot be only whitespace')
});

/**
 * Type inference for expense form data
 */
export type ExpenseFormDataValidated = z.infer<typeof expenseFormSchema>;

// ============================================================================
// EXPENSE ENTITY VALIDATION
// ============================================================================

/**
 * Schema for stored expense entity validation
 * Validates the complete expense object as stored in localStorage
 */
export const expenseSchema = z.object({
  id: z.string()
    .min(1, 'Expense ID is required')
    .regex(/^exp-[\w-]+$/, 'Expense ID must follow format: exp-{identifier}'),
  amount: centsAmountSchema,
  description: z.string()
    .min(1, 'Description is required')
    .max(200, 'Description must be 200 characters or less'),
  month: monthSchema,
  category: categorySchema
});

/**
 * Type inference for validated expense entity
 */
export type ExpenseValidated = z.infer<typeof expenseSchema>;

// ============================================================================
// FILTER VALIDATION
// ============================================================================

/**
 * Schema for expense filter validation
 * Validates optional month and category filters
 */
export const expenseFilterSchema = z.object({
  month: monthSchema.optional(),
  category: categorySchema.optional()
}).refine(
  (data) => data.month !== undefined || data.category !== undefined,
  {
    message: 'At least one filter (month or category) must be provided',
    path: ['root']
  }
);

/**
 * Type inference for validated expense filter
 */
export type ExpenseFilterValidated = z.infer<typeof expenseFilterSchema>;

// ============================================================================
// API REQUEST/RESPONSE VALIDATION
// ============================================================================

/**
 * Schema for add expense API request validation
 */
export const addExpenseRequestSchema = z.object({
  amount: centsAmountSchema,
  description: z.string()
    .min(1, 'Description is required')
    .max(200, 'Description must be 200 characters or less'),
  month: monthSchema,
  category: categorySchema
});

/**
 * Schema for expense filter API request validation
 */
export const filterExpensesRequestSchema = z.object({
  month: monthSchema.optional(),
  category: categorySchema.optional()
});

/**
 * Schema for validate expense API request validation
 */
export const validateExpenseRequestSchema = addExpenseRequestSchema;

/**
 * Schema for API error response validation
 */
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional()
});

/**
 * Schema for validation errors response
 */
export const validationErrorsSchema = z.object({
  errors: z.array(z.object({
    field: z.enum(['amount', 'description', 'month', 'category']),
    message: z.string(),
    value: z.any()
  }))
});

/**
 * Schema for validation result response
 */
export const validationResultSchema = z.object({
  valid: z.boolean()
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates expense form data and returns typed result or error details
 */
export function validateExpenseForm(data: unknown): {
  success: true;
  data: ExpenseFormDataValidated;
} | {
  success: false;
  errors: z.ZodError;
} {
  const result = expenseFormSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Validates expense entity and returns typed result or error details
 */
export function validateExpense(data: unknown): {
  success: true;
  data: ExpenseValidated;
} | {
  success: false;
  errors: z.ZodError;
} {
  const result = expenseSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Validates expense filter and returns typed result or error details
 */
export function validateExpenseFilter(data: unknown): {
  success: true;
  data: ExpenseFilterValidated;
} | {
  success: false;
  errors: z.ZodError;
} {
  const result = expenseFilterSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

/**
 * Formats Zod errors into a user-friendly format for forms
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });

  return errors;
}

/**
 * Checks if a month string is valid
 */
export function isValidMonth(month: string): boolean {
  return VALID_MONTHS.includes(month as Month);
}

/**
 * Checks if a category is in the predefined list
 */
export function isPredefinedCategory(category: string): boolean {
  return VALID_CATEGORIES.includes(category as ExpenseCategory);
}

/**
 * Gets all valid months
 */
export function getValidMonths(): readonly string[] {
  return VALID_MONTHS;
}

/**
 * Gets all predefined categories
 */
export function getPredefinedCategories(): readonly string[] {
  return VALID_CATEGORIES;
}
