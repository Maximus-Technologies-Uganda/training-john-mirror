// Import the function we want to test from todo.js
const { addTask } = require('./todo.js');

console.log("Running tests for the 'add' feature...");

// Test Case 1: Should add a new task to an empty list.
let initialTasks = [];
let updatedTasks = addTask(initialTasks, "Buy groceries");

console.assert(updatedTasks.length === 1, "Test Failed: The new list should have one task.");
console.assert(updatedTasks[0] === "Buy groceries", "Test Failed: The task content is incorrect.");

console.log("✅ All 'add' tests passed!");