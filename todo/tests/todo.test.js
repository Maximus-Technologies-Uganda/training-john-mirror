import { describe, it, expect } from 'jest';
import { addTask, markTaskDone, removeTask, listTasks } from '../src/todo-core.js';

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
