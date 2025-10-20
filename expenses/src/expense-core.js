// Core expense logic (pure, no side effects)

/**
 * Validates the provided options object.
 * @param {object} options
 * @returns {{ success: boolean, error?: string, value?: { month?: number, category?: string } }}
 */
export function validateOptions(options = {}) {
  const { month, category } = options;

  if (month !== undefined) {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return { success: false, error: 'Error: --month must be a number between 1 and 12' };
    }
  }

  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim() === '') {
      return { success: false, error: 'Category must be a non-empty string.' };
    }
  }

  return { success: true, value: { month, category: category?.trim() } };
}

function toCents(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return NaN;
  }
  return Math.round(numeric * 100);
}

function fromCents(cents) {
  return Number((Number(cents) / 100).toFixed(2));
}

/**
 * Adds a new expense to the expenses array without mutating the input.
 * @param {Array<Object>} expenses
 * @param {string} category
 * @param {number} amount
 * @param {Date} [date]
 * @returns {Array<Object>}
 */
export function addExpense(expenses, category, amount, date = new Date()) {
  const cents = toCents(amount);
  if (!Number.isFinite(cents)) {
    throw new Error('Amount must be a valid number.');
  }

  const newExpense = {
    category,
    amount: cents,
    date: date.toISOString()
  };

  return [...expenses, newExpense];
}

/**
 * Summarizes expenses by total amount and by category.
 * @param {Array<Object>} expenses
 * @returns {{ total: number, byCategory: Record<string, number> }}
 */
export function summarizeExpenses(expenses) {
  const accumulator = expenses.reduce(
    (acc, expense) => {
      const amount = typeof expense.amount === 'number' ? expense.amount : toCents(expense.amount) || 0;
      acc.total += amount;
      acc.byCategory[expense.category] = (acc.byCategory[expense.category] || 0) + amount;
      return acc;
    },
    { total: 0, byCategory: {} }
  );

  const summary = {
    total: fromCents(accumulator.total),
    byCategory: {}
  };

  for (const [category, value] of Object.entries(accumulator.byCategory)) {
    summary.byCategory[category] = fromCents(value);
  }

  return summary;
}

/**
 * Filters expenses according to the provided options.
 * @param {Array<Object>} expenses
 * @param {{ month?: number, category?: string }} options
 * @returns {Array<Object>}
 */
function filterExpenses(expenses, { month, category }) {
  return expenses.filter((expense) => {
    if (month !== undefined) {
      const expenseDate = new Date(expense.date);
      if (Number.isNaN(expenseDate.getTime()) || expenseDate.getMonth() + 1 !== month) {
        return false;
      }
    }

    if (category !== undefined && expense.category !== category) {
      return false;
    }

    return true;
  });
}

/**
 * Computes the expense summary for the given data set and options.
 * @param {Array<Object>} allExpenses
 * @param {{ month?: number, category?: string }} [options]
 * @returns {{ success: true, data: { total: number, byCategory: Record<string, number> } } | { success: false, error: string }}
 */
export function getExpenses(allExpenses, options = {}) {
  if (!Array.isArray(allExpenses)) {
    return { success: false, error: 'Expenses must be provided as an array.' };
  }

  const validation = validateOptions(options);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const filtered = filterExpenses(allExpenses, validation.value);
  const summary = summarizeExpenses(filtered);

  return {
    success: true,
    data: {
      summary,
      expenses: filtered.map((expense) => ({
        ...expense,
        amount: fromCents(expense.amount),
        timestamp: expense.date ?? null
      })),
      options: validation.value
    }
  };
}

export { fromCents, toCents };

