import { describe, it, expect } from 'vitest';

import {
  manageTodos,
  PRIORITY_HIGH
} from '../src/todo-core.js';

describe('manageTodos core logic', () => {
  it('filters tasks due today while respecting the end-of-day boundary', () => {
    const endOfToday = new Date('2025-06-15T23:59:59.999Z');

    const todos = [
      {
        id: 1,
        text: 'Boundary task',
        done: false,
        dueDate: '2025-06-15T23:59:59.999Z',
        priority: 'normal'
      },
      {
        id: 2,
        text: 'Same day start task',
        done: false,
        dueDate: '2025-06-15T00:00:00.000Z',
        priority: 'normal'
      },
      {
        id: 3,
        text: 'Future task',
        done: false,
        dueDate: '2025-06-16T00:00:00.000Z',
        priority: 'high'
      }
    ];

    const result = manageTodos(todos, 'list', {
      filterDueDate: new Date(endOfToday)
    });

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].id).toBe(2);
    expect(result.data[0].text).toBe('Same day start task');
    expect(result.data[1].id).toBe(1);
    expect(result.data[1].text).toBe('Boundary task');
  });

  it('marks a task as high priority when requested', () => {
    const result = manageTodos([], 'add', {
      text: 'Follow up with client',
      highPriority: true
    });

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].priority).toBe(PRIORITY_HIGH);
    expect(result.data[0].text).toBe('Follow up with client');
  });

  it('rejects duplicate tasks with identical text and due date', () => {
    const initial = manageTodos([], 'add', {
      text: 'Submit project report',
      dueDate: new Date('2025-07-01T23:59:59.999Z')
    });

    expect(initial.success).toBe(true);

    const duplicate = manageTodos(initial.data, 'add', {
      text: 'Submit project report',
      dueDate: new Date('2025-07-01T23:59:59.999Z')
    });

    expect(duplicate.success).toBe(false);
    expect(duplicate.error).toBe('Error: Duplicate to-do item found.');
  });
});


