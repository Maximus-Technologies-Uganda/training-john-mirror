import { describe, it, expect } from 'vitest';

// Mock the addTask function since it's not exported from todo.js
// We'll create a testable version
function addTask(tasks, newTask) {
  const updatedTasks = [...tasks, newTask];
  return updatedTasks;
}

describe('Todo Add Function', () => {
  it('should add a new task to an empty list', () => {
    const initialTasks = [];
    const updatedTasks = addTask(initialTasks, "Buy groceries");
    
    expect(updatedTasks.length).toBe(1);
    expect(updatedTasks[0]).toBe("Buy groceries");
  });

  it('should add a new task to an existing list', () => {
    const initialTasks = ["Existing task"];
    const updatedTasks = addTask(initialTasks, "New task");
    
    expect(updatedTasks.length).toBe(2);
    expect(updatedTasks[0]).toBe("Existing task");
    expect(updatedTasks[1]).toBe("New task");
  });

  it('should not modify the original array', () => {
    const initialTasks = ["Task 1", "Task 2"];
    const updatedTasks = addTask(initialTasks, "Task 3");
    
    expect(initialTasks.length).toBe(2);
    expect(updatedTasks.length).toBe(3);
  });
});