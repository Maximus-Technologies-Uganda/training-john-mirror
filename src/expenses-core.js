/**
 * Adds a new expense to the expenses array.
 * @param {Array<Object>} expenses - The array of expense objects.
 * @param {string} category - The category of the expense.
 * @param {number} amount - The amount of the expense.
 * @returns {Array<Object>} The updated expenses array.
 */
export function addExpense(expenses, category, amount) {
  const newExpense = {
    category,
    amount,
    date: new Date().toISOString()
  };
  return [...expenses, newExpense];
}

/**
 * Lists all expenses in a readable format.
 * @param {Array<Object>} expenses - The array of expense objects.
 * @returns {Array<Object>} A formatted list of expenses with readable dates.
 */
export function listExpenses(expenses) {
  return expenses.map(expense => ({
    category: expense.category,
    amount: expense.amount,
    date: new Date(expense.date).toLocaleDateString(),
    timestamp: expense.date
  }));
}

/**
 * Summarizes a list of expenses by total and by category.
 * @param {Array<Object>} expenses - The array of expense objects.
 * @returns {Object} An object containing the total and a category breakdown.
 */
export function summarizeExpenses(expenses) {
  const summary = expenses.reduce((acc, expense) => {
    // Add to the total amount
    acc.total += expense.amount;

    // Add to the category amount
    acc.byCategory[expense.category] = (acc.byCategory[expense.category] || 0) + expense.amount;
    
    return acc;
  }, { total: 0, byCategory: {} }); // Initial value for the accumulator

  return summary;
}