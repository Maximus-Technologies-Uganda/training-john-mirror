// A simple test for the todo application's add functionality

console.log("Running tests for the 'add' feature...");

// This is a simple function that mimics adding a task.
// In a real application, you would import this from your todo.js file.
function addTask(tasks, newTask) {
  const newTasks = [...tasks, newTask];
  return newTasks;
}

// Test Case 1: Should add a new task to an empty list.
let initialTasks = [];
let updatedTasks = addTask(initialTasks, "Buy groceries");

console.assert(updatedTasks.length === 1, "Test Failed: The new list should have one task.");
console.assert(updatedTasks[0] === "Buy groceries", "Test Failed: The task content is incorrect.");

console.log("✅ All 'add' tests passed!");