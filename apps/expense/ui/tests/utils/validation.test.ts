import {
  monthSchema,
  categorySchema,
  predefinedCategorySchema,
  decimalAmountSchema,
  centsAmountSchema,
  expenseFormSchema,
  expenseSchema,
  expenseFilterSchema,
  addExpenseRequestSchema,
  filterExpensesRequestSchema,
  validateExpenseRequestSchema,
  VALID_MONTHS,
  VALID_CATEGORIES,
  validateExpenseForm,
  validateExpense,
  validateExpenseFilter,
  formatValidationErrors,
  isValidMonth,
  isPredefinedCategory,
  getValidMonths,
  getPredefinedCategories,
  type ExpenseFormDataValidated,
  type ExpenseValidated,
  type ExpenseFilterValidated
} from '../../src/utils/validation';

describe('Validation Utilities', () => {
  describe('monthSchema', () => {
    it('validates correct months', () => {
      VALID_MONTHS.forEach(month => {
        expect(() => monthSchema.parse(month)).not.toThrow();
      });
    });

    it('rejects invalid months', () => {
      expect(() => monthSchema.parse('InvalidMonth')).toThrow();
      expect(() => monthSchema.parse('')).toThrow();
      expect(() => monthSchema.parse('january')).toThrow(); // case sensitive
      expect(() => monthSchema.parse(123)).toThrow();
    });

    it('provides custom error message', () => {
      try {
        monthSchema.parse('Invalid');
      } catch (error: any) {
        expect(error.errors[0].message).toBe('Please select a valid month');
      }
    });
  });

  describe('categorySchema', () => {
    it('validates correct categories', () => {
      expect(() => categorySchema.parse('Food')).not.toThrow();
      expect(() => categorySchema.parse('Custom Category')).not.toThrow();
      expect(() => categorySchema.parse('A')).not.toThrow();
    });

    it('rejects empty categories', () => {
      expect(() => categorySchema.parse('')).toThrow('Category is required');
    });

    it('rejects categories that are too long', () => {
      const longCategory = 'A'.repeat(101);
      expect(() => categorySchema.parse(longCategory)).toThrow('Category must be 100 characters or less');
    });

    it('accepts categories up to 100 characters', () => {
      const maxCategory = 'A'.repeat(100);
      expect(() => categorySchema.parse(maxCategory)).not.toThrow();
    });
  });

  describe('predefinedCategorySchema', () => {
    it('validates predefined categories', () => {
      VALID_CATEGORIES.forEach(category => {
        expect(() => predefinedCategorySchema.parse(category)).not.toThrow();
      });
    });

    it('rejects non-predefined categories', () => {
      expect(() => predefinedCategorySchema.parse('Custom Category')).toThrow();
      expect(() => predefinedCategorySchema.parse('')).toThrow();
    });
  });

  describe('decimalAmountSchema', () => {
    it('validates correct decimal amounts', () => {
      expect(() => decimalAmountSchema.parse('10.50')).not.toThrow();
      expect(() => decimalAmountSchema.parse('0.01')).not.toThrow();
      expect(() => decimalAmountSchema.parse('999999.99')).not.toThrow();
      expect(() => decimalAmountSchema.parse('100')).not.toThrow();
      expect(() => decimalAmountSchema.parse('100.0')).not.toThrow();
    });

    it('rejects invalid formats', () => {
      expect(() => decimalAmountSchema.parse('')).toThrow('Amount is required');
      expect(() => decimalAmountSchema.parse('abc')).toThrow('Amount must be in decimal format');
      expect(() => decimalAmountSchema.parse('10.505')).toThrow('Amount must be in decimal format');
      expect(() => decimalAmountSchema.parse('10.123')).toThrow('Amount must be in decimal format');
    });

    it('rejects amounts outside valid range', () => {
      try {
        decimalAmountSchema.parse('0.00');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.errors[0].message).toBe('Amount must be a positive number between 0.01 and 999,999.99');
      }

      try {
        decimalAmountSchema.parse('-10.50');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.errors[0].message).toBe('Amount must be a positive number between 0.01 and 999,999.99');
      }

      try {
        decimalAmountSchema.parse('1000000.00');
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.errors[0].message).toBe('Amount must be a positive number between 0.01 and 999,999.99');
      }
    });
  });

  describe('centsAmountSchema', () => {
    it('validates correct cents amounts', () => {
      expect(() => centsAmountSchema.parse(1050)).not.toThrow();
      expect(() => centsAmountSchema.parse(1)).not.toThrow();
      expect(() => centsAmountSchema.parse(99999999)).not.toThrow();
    });

    it('rejects non-integers', () => {
      expect(() => centsAmountSchema.parse(10.5)).toThrow('Amount in cents must be an integer');
      expect(() => centsAmountSchema.parse('1050')).toThrow();
    });

    it('rejects amounts outside valid range', () => {
      expect(() => centsAmountSchema.parse(0)).toThrow('Amount must be at least 1 cent');
      expect(() => centsAmountSchema.parse(-100)).toThrow('Amount must be at least 1 cent');
      expect(() => centsAmountSchema.parse(100000000)).toThrow('Amount cannot exceed $999,999.99');
    });
  });

  describe('expenseFormSchema', () => {
    it('validates complete valid expense forms', () => {
      const validForm = {
        amount: '10.50',
        description: 'Test expense',
        month: 'January',
        category: 'Food'
      };
      expect(() => expenseFormSchema.parse(validForm)).not.toThrow();
    });

    it('validates with custom category', () => {
      const validForm = {
        amount: '25.00',
        description: 'Custom expense',
        month: 'February',
        category: 'Custom Category'
      };
      expect(() => expenseFormSchema.parse(validForm)).not.toThrow();
    });

    it('rejects invalid forms', () => {
      const invalidForm = {
        amount: '',
        description: '',
        month: 'Invalid',
        category: ''
      };
      expect(() => expenseFormSchema.parse(invalidForm)).toThrow();
    });

    it('validates description constraints', () => {
      const longDescription = 'A'.repeat(201);
      const validForm = {
        amount: '10.50',
        description: longDescription,
        month: 'January',
        category: 'Food'
      };
      expect(() => expenseFormSchema.parse(validForm)).toThrow('Description must be 200 characters or less');

      const whitespaceOnly = {
        amount: '10.50',
        description: '   ',
        month: 'January',
        category: 'Food'
      };
      expect(() => expenseFormSchema.parse(whitespaceOnly)).toThrow('Description cannot be only whitespace');
    });
  });

  describe('expenseSchema', () => {
    it('validates complete valid expenses', () => {
      const validExpense = {
        id: 'exp-1234567890-abc123',
        amount: 1050,
        description: 'Test expense',
        month: 'January',
        category: 'Food'
      };
      expect(() => expenseSchema.parse(validExpense)).not.toThrow();
    });

    it('validates ID format', () => {
      const invalidId = {
        id: 'invalid-id',
        amount: 1050,
        description: 'Test',
        month: 'January',
        category: 'Food'
      };
      expect(() => expenseSchema.parse(invalidId)).toThrow('Expense ID must follow format: exp-{identifier}');
    });

    it('rejects invalid expenses', () => {
      const invalidExpense = {
        id: 'exp-123',
        amount: -100,
        description: '',
        month: 'Invalid',
        category: 'A'.repeat(101)
      };
      expect(() => expenseSchema.parse(invalidExpense)).toThrow();
    });
  });

  describe('expenseFilterSchema', () => {
    it('validates filters with month only', () => {
      const filter = { month: 'January' };
      expect(() => expenseFilterSchema.parse(filter)).not.toThrow();
    });

    it('validates filters with category only', () => {
      const filter = { category: 'Food' };
      expect(() => expenseFilterSchema.parse(filter)).not.toThrow();
    });

    it('validates filters with both month and category', () => {
      const filter = { month: 'January', category: 'Food' };
      expect(() => expenseFilterSchema.parse(filter)).not.toThrow();
    });

    it('rejects empty filters', () => {
      try {
        expenseFilterSchema.parse({});
        expect.fail('Should have thrown');
      } catch (error: any) {
        expect(error.errors[0].message).toBe('At least one filter (month or category) must be provided');
      }
    });
  });

  describe('API request schemas', () => {
    it('addExpenseRequestSchema matches expenseFormSchema requirements', () => {
      const validRequest = {
        amount: 1050,
        description: 'Test expense',
        month: 'January',
        category: 'Food'
      };
      expect(() => addExpenseRequestSchema.parse(validRequest)).not.toThrow();
    });

    it('filterExpensesRequestSchema allows optional filters', () => {
      expect(() => filterExpensesRequestSchema.parse({})).not.toThrow();
      expect(() => filterExpensesRequestSchema.parse({ month: 'January' })).not.toThrow();
      expect(() => filterExpensesRequestSchema.parse({ category: 'Food' })).not.toThrow();
    });

    it('validateExpenseRequestSchema matches addExpenseRequestSchema', () => {
      const validRequest = {
        amount: 1050,
        description: 'Test expense',
        month: 'January',
        category: 'Food'
      };
      expect(() => validateExpenseRequestSchema.parse(validRequest)).not.toThrow();
    });
  });

  describe('Validation utility functions', () => {
    describe('validateExpenseForm', () => {
      it('returns success for valid form data', () => {
        const validData = {
          amount: '10.50',
          description: 'Test expense',
          month: 'January',
          category: 'Food'
        };

        const result = validateExpenseForm(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validData);
        }
      });

      it('returns errors for invalid form data', () => {
        const invalidData = {
          amount: '',
          description: '',
          month: 'Invalid',
          category: ''
        };

        const result = validateExpenseForm(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.errors).toBeInstanceOf(Object);
          expect(result.errors.errors.length).toBeGreaterThan(0);
        }
      });
    });

    describe('validateExpense', () => {
      it('returns success for valid expense data', () => {
        const validData = {
          id: 'exp-1234567890-abc123',
          amount: 1050,
          description: 'Test expense',
          month: 'January',
          category: 'Food'
        };

        const result = validateExpense(validData);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validData);
        }
      });

      it('returns errors for invalid expense data', () => {
        const invalidData = {
          id: 'invalid',
          amount: -100,
          description: '',
          month: 'Invalid',
          category: ''
        };

        const result = validateExpense(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.errors).toBeInstanceOf(Object);
        }
      });
    });

    describe('validateExpenseFilter', () => {
      it('returns success for valid filter data', () => {
        const validFilter = { month: 'January', category: 'Food' };

        const result = validateExpenseFilter(validFilter);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validFilter);
        }
      });

      it('returns errors for invalid filter data', () => {
        const invalidFilter = { month: 'InvalidMonth' };

        const result = validateExpenseFilter(invalidFilter);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.errors).toBeInstanceOf(Object);
        }
      });
    });

    describe('formatValidationErrors', () => {
      it('formats Zod errors into user-friendly format', () => {
        const invalidData = {
          amount: '',
          description: '',
          month: 'Invalid',
          category: ''
        };

        const result = validateExpenseForm(invalidData);
        expect(result.success).toBe(false);

        if (!result.success) {
          const formatted = formatValidationErrors(result.errors);
        expect(typeof formatted).toBe('object');
        expect(Object.keys(formatted).length).toBeGreaterThan(0);

        // Check that each error has a string message
        Object.values(formatted).forEach(message => {
          expect(typeof message).toBe('string');
        });
        }
      });
    });

    describe('isValidMonth', () => {
      it('returns true for valid months', () => {
        VALID_MONTHS.forEach(month => {
          expect(isValidMonth(month)).toBe(true);
        });
      });

      it('returns false for invalid months', () => {
        expect(isValidMonth('Invalid')).toBe(false);
        expect(isValidMonth('')).toBe(false);
        expect(isValidMonth('january')).toBe(false);
      });
    });

    describe('isPredefinedCategory', () => {
      it('returns true for predefined categories', () => {
        VALID_CATEGORIES.forEach(category => {
          expect(isPredefinedCategory(category)).toBe(true);
        });
      });

      it('returns false for custom categories', () => {
        expect(isPredefinedCategory('Custom Category')).toBe(false);
        expect(isPredefinedCategory('')).toBe(false);
      });
    });

    describe('getValidMonths', () => {
      it('returns all valid months', () => {
        const months = getValidMonths();
        expect(months).toEqual(VALID_MONTHS);
        expect(months).toHaveLength(12);
      });
    });

    describe('getPredefinedCategories', () => {
      it('returns all predefined categories', () => {
        const categories = getPredefinedCategories();
        expect(categories).toEqual(VALID_CATEGORIES);
        expect(categories).toHaveLength(5);
      });
    });
  });

  describe('Type inference', () => {
    it('ExpenseFormDataValidated type matches schema', () => {
      const validData: ExpenseFormDataValidated = {
        amount: '10.50',
        description: 'Test',
        month: 'January',
        category: 'Food'
      };

      expect(validData).toBeDefined();
    });

    it('ExpenseValidated type matches schema', () => {
      const validData: ExpenseValidated = {
        id: 'exp-1234567890-abc123',
        amount: 1050,
        description: 'Test',
        month: 'January',
        category: 'Food'
      };

      expect(validData).toBeDefined();
    });

    it('ExpenseFilterValidated type matches schema', () => {
      const validData: ExpenseFilterValidated = {
        month: 'January',
        category: 'Food'
      };

      expect(validData).toBeDefined();
    });
  });

  describe('Constants', () => {
    it('VALID_MONTHS contains all 12 months', () => {
      expect(VALID_MONTHS).toHaveLength(12);
      expect(VALID_MONTHS[0]).toBe('January');
      expect(VALID_MONTHS[11]).toBe('December');
    });

    it('VALID_CATEGORIES contains predefined categories', () => {
      expect(VALID_CATEGORIES).toHaveLength(5);
      expect(VALID_CATEGORIES).toContain('Food');
      expect(VALID_CATEGORIES).toContain('Other');
    });
  });
});
