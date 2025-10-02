import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addTask, markTaskDone, removeTask, listTasks, getEndOfToday, isDuplicateTask } from '../src/todo-core.js';
import { spawn } from 'child_process';
import path from 'path';

describe('addTask function', () => {
  it('should add a new task to an empty list', () => {
    const initialTasks = [];
    const newTaskName = 'Buy milk';

    const newTasks = addTask(initialTasks, newTaskName);

    // 1. Check that the new list has one item
    expect(newTasks).toHaveLength(1);

    // 2. Check that the new item has the correct text
    expect(newTasks[0].text).toBe(newTaskName);

    // 3. Check that the original list is still empty
    expect(initialTasks).toHaveLength(0);
  });

  it('should add a new task to a non-empty list', () => {
    const initialTasks = [
      { id: 1, text: 'First task', done: false }
    ];
    const newTaskName = 'Second task';

    const newTasks = addTask(initialTasks, newTaskName);

    expect(newTasks).toHaveLength(2);
    expect(newTasks[1].text).toBe(newTaskName);
    expect(newTasks[1].id).toBe(2);
    expect(newTasks[1].done).toBe(false);
  });

  it('should generate unique IDs for new tasks', () => {
    const initialTasks = [
      { id: 1, text: 'First task', done: false },
      { id: 2, text: 'Second task', done: false }
    ];

    const newTasks = addTask(initialTasks, 'Third task');

    expect(newTasks[2].id).toBe(3);
  });

  it('should not mutate the original array', () => {
    const initialTasks = [{ id: 1, text: 'First task', done: false }];
    const originalLength = initialTasks.length;

    addTask(initialTasks, 'Second task');

    expect(initialTasks).toHaveLength(originalLength);
    expect(initialTasks[0].text).toBe('First task');
  });
});

describe('markTaskDone function', () => {
  it('should mark the correct task as done', () => {
    const initialTasks = [
      { id: 1, text: 'First task', done: false },
      { id: 2, text: 'Second task', done: false }
    ];

    const updatedTasks = markTaskDone(initialTasks, 2);

    // Check the updated task
    expect(updatedTasks[1].done).toBe(true);

    // Check that the other task was not changed
    expect(updatedTasks[0].done).toBe(false);
  });

  it('should return a new array', () => {
    const initialTasks = [{ id: 1, text: 'First task', done: false }];
    const updatedTasks = markTaskDone(initialTasks, 1);

    // Check that the returned array is a different one in memory
    expect(updatedTasks).not.toBe(initialTasks);
  });

  it('should not mutate the original array', () => {
    const initialTasks = [
      { id: 1, text: 'First task', done: false },
      { id: 2, text: 'Second task', done: false }
    ];

    markTaskDone(initialTasks, 1);

    expect(initialTasks[0].done).toBe(false);
    expect(initialTasks[1].done).toBe(false);
  });

  it('should handle non-existent task ID gracefully', () => {
    const initialTasks = [
      { id: 1, text: 'First task', done: false }
    ];

    const updatedTasks = markTaskDone(initialTasks, 999);

    expect(updatedTasks).toEqual(initialTasks);
    expect(updatedTasks[0].done).toBe(false);
  });
});

describe('removeTask function', () => {
  it('should remove the correct task', () => {
    const initialTasks = [
      { id: 1, text: 'First task', done: false },
      { id: 2, text: 'Second task', done: false },
      { id: 3, text: 'Third task', done: false }
    ];

    const updatedTasks = removeTask(initialTasks, 2);

    expect(updatedTasks).toHaveLength(2);
    expect(updatedTasks.find(task => task.id === 2)).toBeUndefined();
    expect(updatedTasks[0].id).toBe(1);
    expect(updatedTasks[1].id).toBe(3);
  });

  it('should return a new array', () => {
    const initialTasks = [
      { id: 1, text: 'First task', done: false }
    ];
    const updatedTasks = removeTask(initialTasks, 1);

    expect(updatedTasks).not.toBe(initialTasks);
  });

  it('should not mutate the original array', () => {
    const initialTasks = [
      { id: 1, text: 'First task', done: false },
      { id: 2, text: 'Second task', done: false }
    ];

    removeTask(initialTasks, 1);

    expect(initialTasks).toHaveLength(2);
    expect(initialTasks[0].id).toBe(1);
  });

  it('should handle removing from empty list', () => {
    const initialTasks = [];
    const updatedTasks = removeTask(initialTasks, 1);

    expect(updatedTasks).toHaveLength(0);
    expect(updatedTasks).not.toBe(initialTasks);
  });

  it('should handle non-existent task ID gracefully', () => {
    const initialTasks = [
      { id: 1, text: 'First task', done: false }
    ];

    const updatedTasks = removeTask(initialTasks, 999);

    expect(updatedTasks).toEqual(initialTasks);
    expect(updatedTasks).toHaveLength(1);
  });
});

describe('listTasks function', () => {
  it('should return a copy of all tasks', () => {
    const tasks = [
      { id: 1, text: 'First task', done: false },
      { id: 2, text: 'Second task', done: true }
    ];

    const listedTasks = listTasks(tasks);

    expect(listedTasks).toEqual(tasks);
    expect(listedTasks).not.toBe(tasks); // Should be a different array
  });

  it('should handle empty list', () => {
    const tasks = [];
    const listedTasks = listTasks(tasks);

    expect(listedTasks).toEqual([]);
    expect(listedTasks).not.toBe(tasks);
  });

  it('should not mutate the original array', () => {
    const tasks = [
      { id: 1, text: 'First task', done: false }
    ];
    const originalLength = tasks.length;

    listTasks(tasks);

    expect(tasks).toHaveLength(originalLength);
    expect(tasks[0].text).toBe('First task');
  });
});

describe('addTask function with due dates', () => {
  it('should add a task with a due date', () => {
    const initialTasks = [];
    const taskName = 'Buy groceries';
    const dueDate = new Date('2025-12-25T23:59:59.999Z');

    const newTasks = addTask(initialTasks, taskName, dueDate);

    expect(newTasks).toHaveLength(1);
    expect(newTasks[0].text).toBe(taskName);
    expect(newTasks[0].dueDate).toEqual(dueDate);
    expect(newTasks[0].done).toBe(false);
  });

  it('should add a task without a due date (null)', () => {
    const initialTasks = [];
    const taskName = 'Walk the dog';

    const newTasks = addTask(initialTasks, taskName, null);

    expect(newTasks).toHaveLength(1);
    expect(newTasks[0].text).toBe(taskName);
    expect(newTasks[0].dueDate).toBeNull();
    expect(newTasks[0].done).toBe(false);
  });

  it('should add a task without specifying due date (defaults to null)', () => {
    const initialTasks = [];
    const taskName = 'Clean house';

    const newTasks = addTask(initialTasks, taskName);

    expect(newTasks).toHaveLength(1);
    expect(newTasks[0].text).toBe(taskName);
    expect(newTasks[0].dueDate).toBeNull();
  });
});

describe('addTask with high priority', () => {
  it('should store priority when provided', () => {
    const initialTasks = [];
    const tasks = addTask(initialTasks, 'Urgent task', null, 'high');
    expect(tasks[0].priority).toBe('high');
  });
});

describe('getEndOfToday function', () => {
  beforeEach(() => {
    // Mock the current date to a specific date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-09-30T14:30:00.000Z')); // 2:30 PM UTC
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return end of current day', () => {
    const endOfToday = getEndOfToday();
    
    // Should be 23:59:59.999 of the same day
    // Do not assert specific local date parts; only assert clock end-of-day
    expect(endOfToday.getHours()).toBe(23);
    expect(endOfToday.getMinutes()).toBe(59);
    expect(endOfToday.getSeconds()).toBe(59);
    expect(endOfToday.getMilliseconds()).toBe(999);
  });

  it('should return different times for different days', () => {
    const endOfToday = getEndOfToday();
    
    // Move to next day
    vi.setSystemTime(new Date('2025-10-01T10:00:00.000Z'));
    const endOfTomorrow = getEndOfToday();
    
    expect(endOfTomorrow.getTime()).not.toBe(endOfToday.getTime());
  });

  it('should compute end of day using local boundaries near midnight', () => {
    vi.setSystemTime(new Date('2025-09-30T23:58:00.000Z'));
    const endOfTodayLocal = getEndOfToday();
    expect(endOfTodayLocal.getHours()).toBe(23);
    expect(endOfTodayLocal.getMinutes()).toBe(59);
  });
});

describe('isDuplicateTask function', () => {
  const existingTasks = [
    { id: 1, text: 'Buy groceries', done: false, dueDate: new Date('2025-09-30T23:59:59.999Z') },
    { id: 2, text: 'Walk the dog', done: false, dueDate: null },
    { id: 3, text: 'Clean house', done: true, dueDate: new Date('2025-10-01T23:59:59.999Z') }
  ];

  it('should detect exact duplicate (same text and due date)', () => {
    const isDuplicate = isDuplicateTask(existingTasks, 'Buy groceries', new Date('2025-09-30T23:59:59.999Z'));
    expect(isDuplicate).toBe(true);
  });

  it('should detect duplicate with null due dates', () => {
    const isDuplicate = isDuplicateTask(existingTasks, 'Walk the dog', null);
    expect(isDuplicate).toBe(true);
  });

  it('should not detect duplicate with different text', () => {
    const isDuplicate = isDuplicateTask(existingTasks, 'Buy milk', new Date('2025-09-30T23:59:59.999Z'));
    expect(isDuplicate).toBe(false);
  });

  it('should not detect duplicate with different due date', () => {
    const isDuplicate = isDuplicateTask(existingTasks, 'Buy groceries', new Date('2025-10-01T23:59:59.999Z'));
    expect(isDuplicate).toBe(false);
  });

  it('should not detect duplicate with null due date when task has due date', () => {
    const isDuplicate = isDuplicateTask(existingTasks, 'Buy groceries', null);
    expect(isDuplicate).toBe(false);
  });

  it('should detect duplicate with case-insensitive text', () => {
    const isDuplicate = isDuplicateTask(existingTasks, 'buy groceries', new Date('2025-09-30T23:59:59.999Z'));
    expect(isDuplicate).toBe(true);
  });

  it('should detect duplicate with different case', () => {
    const isDuplicate = isDuplicateTask(existingTasks, 'WALK THE DOG', null);
    expect(isDuplicate).toBe(true);
  });

  it('should not detect duplicate in empty list', () => {
    const isDuplicate = isDuplicateTask([], 'Any task', null);
    expect(isDuplicate).toBe(false);
  });
});

// Helper function to run CLI commands
function runCLI(args) {
  return new Promise((resolve) => {
    const child = spawn('node', [path.join(process.cwd(), 'todo/src/todo-core.js'), ...args], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({
        exitCode: code,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });
  });
}

describe('CLI --due Today functionality', () => {
  beforeEach(() => {
    // Mock the current date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-09-30T14:30:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    // Clean up any test data files
    try {
      const fs = require('fs');
      if (fs.existsSync('todos.json')) {
        fs.unlinkSync('todos.json');
      }
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should add task with --due Today flag', async () => {
    const result = await runCLI(['add', 'Test task', '--due', 'Today']);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Added task: "Test task" (due:');
    expect(result.stdout).toContain('2025');
  });

  it('should add task without due date', async () => {
    const result = await runCLI(['add', 'Test task']);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Added task: "Test task"');
    expect(result.stdout).not.toContain('due:');
  });

  it('should show tasks with due dates in list', async () => {
    // Add a task with due date
    await runCLI(['add', 'Task with due date', '--due', 'Today']);
    
    const result = await runCLI(['list']);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Task with due date');
    expect(result.stdout).toContain('due:');
    expect(result.stdout).toContain('2025');
  });

  it('should add task with --dueToday flag (local)', async () => {
    const result = await runCLI(['add', 'Local due task', '--dueToday']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Local due task');
    expect(result.stdout).toContain('(due:');
  });
});

describe('CLI duplicate guard functionality', () => {
  beforeEach(() => {
    // Clean up any test data files
    try {
      const fs = require('fs');
      if (fs.existsSync('todos.json')) {
        fs.unlinkSync('todos.json');
      }
    } catch {
      // Ignore cleanup errors
    }
  });

  afterEach(() => {
    // Clean up any test data files
    try {
      const fs = require('fs');
      if (fs.existsSync('todos.json')) {
        fs.unlinkSync('todos.json');
      }
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should prevent adding exact duplicate task', async () => {
    // Add first task
    await runCLI(['add', 'Test task']);
    
    // Try to add same task again
    const result = await runCLI(['add', 'Test task']);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('⚠️  Task already exists: "Test task"');
    expect(result.stdout).toContain('No duplicate task was added.');
  });

  it('should prevent adding duplicate with case-insensitive text', async () => {
    // Add first task
    await runCLI(['add', 'Test task']);
    
    // Try to add same task with different case
    const result = await runCLI(['add', 'test task']);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('⚠️  Task already exists: "test task"');
  });

  it('should allow adding task with different due date', async () => {
    // Add task without due date
    await runCLI(['add', 'Test task']);
    
    // Add same task with due date (should be allowed)
    const result = await runCLI(['add', 'Test task', '--due', 'Today']);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Added task: "Test task" (due:');
    expect(result.stdout).not.toContain('Task already exists');
  });

  it('should prevent adding duplicate with same due date', async () => {
    // Add task with due date
    await runCLI(['add', 'Test task', '--due', 'Today']);
    
    // Try to add same task with same due date
    const result = await runCLI(['add', 'Test task', '--due', 'Today']);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('⚠️  Task already exists: "Test task" (due:');
  });
});

describe('CLI high priority behavior', () => {
  beforeEach(() => {
    try {
      const fs = require('fs');
      if (fs.existsSync('todos.json')) fs.unlinkSync('todos.json');
    } catch (e) { void e; }
  });

  it('should mark task as high priority when --highPriority is set', async () => {
    const result = await runCLI(['add', 'Pay bills', '--highPriority']);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Pay bills');
    expect(result.stdout).toContain('[HIGH]');
  });

  it('should list high priority tasks first', async () => {
    await runCLI(['add', 'Normal task']);
    await runCLI(['add', 'Urgent task', '--highPriority']);
    const result = await runCLI(['list']);
    const lines = result.stdout.split('\n').filter(l => /\d+\. /.test(l));
    expect(lines[0]).toContain('Urgent task');
    expect(lines[0]).toContain('[HIGH]');
  });
});
