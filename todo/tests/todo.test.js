import { describe, it, expect } from 'jest';
import { addTask, markTaskDone } from '../src/todo-core.js';

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
});
