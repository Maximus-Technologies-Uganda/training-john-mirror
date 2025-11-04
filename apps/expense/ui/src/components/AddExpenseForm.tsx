import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ExpenseFormData, EXPENSE_CATEGORIES } from '../types/expense';
import { expenseFormSchema, getValidMonths } from '../utils/validation';
import { toCents } from '../utils/currency';
import { useExpenses } from '../hooks/useExpenses';

// Form data type inferred from schema
type FormData = z.infer<typeof expenseFormSchema>;

/**
 * AddExpenseForm Component
 *
 * A form component for adding new expenses with robust validation,
 * accessibility features, and user-friendly error handling.
 *
 * Features:
 * - React Hook Form with Zod validation
 * - Accessibility (ARIA labels, roles, keyboard navigation)
 * - Amount conversion from decimal to cents
 * - Error display and loading states
 * - Form reset after successful submission
 */
export const AddExpenseForm: React.FC = () => {
  const { addExpense, isLoading, error } = useExpenses();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(expenseFormSchema),
    mode: 'onChange', // Validate on change for immediate feedback
    defaultValues: {
      amount: '',
      description: '',
      month: '' as any, // Will be set to valid month
      category: ''
    }
  });

  // Watch form values for dynamic behavior
  const watchedAmount = watch('amount');
  const watchedDescription = watch('description');

  const onSubmit = async (data: FormData) => {
    try {
      // Transform form data to expected format
      const expenseData: ExpenseFormData = {
        amount: data.amount,
        description: data.description,
        month: data.month,
        category: data.category
      };

      await addExpense(expenseData);
      reset(); // Reset form on successful submission
    } catch (err) {
      // Error handling is done at the hook level
      console.error('Form submission failed:', err);
    }
  };

  // Show cents preview if amount is valid
  const showCentsPreview = watchedAmount && !errors.amount;
  let centsValue = null;
  if (showCentsPreview) {
    try {
      centsValue = toCents(watchedAmount);
    } catch {
      // If toCents fails, don't show preview
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      role="form"
      aria-label="Add expense"
      className="add-expense-form"
      noValidate // We handle validation with React Hook Form
    >
      <fieldset disabled={isLoading || isSubmitting}>
        <legend className="sr-only">Expense Information</legend>

        {/* Amount Field */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount ($)
            <span className="required" aria-label="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              autoComplete="off"
              className={`form-input ${errors.amount ? 'error' : ''}`}
              {...register('amount')}
              aria-describedby={errors.amount ? 'amount-error' : 'amount-preview'}
              aria-invalid={!!errors.amount}
              aria-required="true"
            />
            {showCentsPreview && (
              <div id="amount-preview" className="cents-preview" aria-live="polite">
                {centsValue} cents
              </div>
            )}
          </div>
          {errors.amount && (
            <div id="amount-error" className="error-message" role="alert" aria-live="polite">
              {errors.amount.message}
            </div>
          )}
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
            <span className="required" aria-label="required">*</span>
          </label>
          <input
            id="description"
            type="text"
            placeholder="Enter expense description"
            className={`form-input ${errors.description ? 'error' : ''}`}
            {...register('description')}
            aria-describedby={errors.description ? 'description-error' : 'description-count'}
            aria-invalid={!!errors.description}
            aria-required="true"
          />
          {watchedDescription && (
            <div id="description-count" className="character-count" aria-live="polite">
              {watchedDescription.length}/200 characters
            </div>
          )}
          {errors.description && (
            <div id="description-error" className="error-message" role="alert" aria-live="polite">
              {errors.description.message}
            </div>
          )}
        </div>

        {/* Month Field */}
        <div className="form-group">
          <label htmlFor="month" className="form-label">
            Month
            <span className="required" aria-label="required">*</span>
          </label>
          <select
            id="month"
            className={`form-select ${errors.month ? 'error' : ''}`}
            {...register('month')}
            aria-describedby={errors.month ? 'month-error' : 'month-help'}
            aria-invalid={!!errors.month}
            aria-required="true"
          >
            <option value="">Select month</option>
            {getValidMonths().map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          {!errors.month && (
            <div id="month-help" className="sr-only">
              Select the month when this expense occurred
            </div>
          )}
          {errors.month && (
            <div id="month-error" className="error-message" role="alert" aria-live="polite">
              {errors.month.message}
            </div>
          )}
        </div>

        {/* Category Field */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
            <span className="required" aria-label="required">*</span>
          </label>
          <input
            id="category"
            type="text"
            placeholder="Enter category (e.g., Food, Transportation)"
            list="category-list"
            className={`form-input ${errors.category ? 'error' : ''}`}
            {...register('category')}
            aria-describedby={errors.category ? 'category-error' : 'category-help'}
            aria-invalid={!!errors.category}
            aria-required="true"
          />
          <datalist id="category-list">
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {!errors.category && (
            <div id="category-help" className="sr-only">
              Enter a category for this expense or select from suggestions
            </div>
          )}
          {errors.category && (
            <div id="category-error" className="error-message" role="alert" aria-live="polite">
              {errors.category.message}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="submit-button"
            aria-describedby={error ? 'form-error' : undefined}
          >
            {isSubmitting ? 'Adding Expense...' : 'Add Expense'}
          </button>
        </div>

        {/* Global Form Error */}
        {error && (
          <div id="form-error" className="form-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </fieldset>
    </form>
  );
};
