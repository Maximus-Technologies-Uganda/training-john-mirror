/**
 * Adds a new expense to a list of expenses.
 * @param {Array<Object>} expenses - The existing array of expense objects.
 * @param {string} category - The category of the new expense.
 * @param {number} amount - The amount of the new expense.
 * @returns {Array<Object>} A new array with the new expense added.
 */
export function addExpense(expenses, category, amount) {
    const newExpense = {
      id: expenses.length + 1,
      category: category,
      amount: amount,
      timestamp: new Date().toISOString(),
    };
  
    // Return a new array containing all old expenses plus the new one
    return [...expenses, newExpense];
  }