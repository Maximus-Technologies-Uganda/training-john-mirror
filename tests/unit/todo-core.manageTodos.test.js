import { describe, it, expect } from 'vitest';

import {
  manageTodos,
  PRIORITY_HIGH
} from '../../todo/src/todo-core.js';

describe('manageTodos core behaviours', () => {
  it('filters tasks due today while respecting end-of-day boundary', () => {
    const targetEndOfDay = new Date('2025-06-15T23:59:59.999Z');

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
        text: 'Early same day task',
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

    const result = manageTodos(todos, 'list', { filterDueDate: new Date(targetEndOfDay) });

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].id).toBe(2);
    expect(result.data[0].text).toBe('Early same day task');
    expect(result.data[1].id).toBe(1);
    expect(result.data[1].text).toBe('Boundary task');
  });

  it('applies the high priority flag when adding a task', () => {
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
    const initialAdd = manageTodos([], 'add', {
      text: 'Submit project report',
      dueDate: new Date('2025-07-01T23:59:59.999Z'),
      highPriority: false
    });

    expect(initialAdd.success).toBe(true);

    const duplicateAttempt = manageTodos(initialAdd.data, 'add', {
      text: 'Submit project report',
      dueDate: new Date('2025-07-01T23:59:59.999Z')
    });

    expect(duplicateAttempt.success).toBe(false);
    expect(duplicateAttempt.error).toBe('Error: Duplicate to-do item found.');
  });
});


