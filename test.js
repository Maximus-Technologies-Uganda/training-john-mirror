// Test Case 1: Multiple expenses
let expenses1 = [
    { description: 'Lunch', amount: 15.50 },
    { description: 'Coffee', amount: 4.25 }
];
// ... test logic ...

// Test Case 2: No expenses
// ... test logic ...

// Test Case 2: No expenses
let expenses2 = [];
// No expenses to process, so total should be 0
let total2 = expenses2.reduce((sum, expense) => sum + expense.amount, 0);
console.assert(total2 === 0, 'Test Case 2 Failed: Total should be 0 for no expenses');