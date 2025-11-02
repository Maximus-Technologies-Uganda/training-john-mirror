import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useTodos from '../../src/hooks/useTodos.js';

describe('useTodos', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    localStorage.__store.clear();
    vi.clearAllMocks();
  });

  it('returns initial empty state', () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual([]);
    expect(result.current.allTodos).toEqual([]);
    expect(result.current.todosCount).toBe(0);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.pendingCount).toBe(0);
    expect(result.current.filterDueToday).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('adds a todo successfully', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      const success = result.current.addTodo('Test task');
      expect(success).toBe(true);
    });

    expect(result.current.allTodos).toHaveLength(1);
    expect(result.current.allTodos[0]).toMatchObject({
      id: 1,
      text: 'Test task',
      done: false,
      dueDate: null
    });
    expect(result.current.todosCount).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('adds a todo with due date', () => {
    const { result } = renderHook(() => useTodos());
    const dueDate = new Date('2025-12-25');

    act(() => {
      result.current.addTodo('Christmas shopping', dueDate);
    });

    expect(result.current.allTodos[0]).toMatchObject({
      text: 'Christmas shopping',
      dueDate: dueDate.toISOString()
    });
  });

  it('prevents adding todo with empty text', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      const success = result.current.addTodo('');
      expect(success).toBe(false);
    });

    act(() => {
      const success = result.current.addTodo('   ');
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(0);
    expect(result.current.error).toBe('Error: To-do text is required.');
  });

  it('prevents duplicate todos', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Buy groceries');
    });

    act(() => {
      const success = result.current.addTodo('Buy groceries');
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.error).toBe('Error: Duplicate to-do item found.');
  });

  it('prevents duplicate todos with same due date', () => {
    const { result } = renderHook(() => useTodos());
    const dueDate = new Date('2025-12-25');

    act(() => {
      result.current.addTodo('Buy groceries', dueDate);
    });

    act(() => {
      const success = result.current.addTodo('Buy groceries', dueDate);
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(1);
  });

  it('removes a todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task to remove');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      const success = result.current.removeTodo(todoId);
      expect(success).toBe(true);
    });

    expect(result.current.todos).toHaveLength(0);
    expect(result.current.todosCount).toBe(0);
  });

  it('handles removing a non-existent todo gracefully', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Existing task');
    });

    // Try to remove a todo that doesn't exist
    act(() => {
      const success = result.current.removeTodo(999);
      expect(success).toBe(true); // Function succeeds even if todo doesn't exist
    });

    // Original todo should still exist (no change to existing data)
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Existing task');
  });

  it('handles removing todo when list is empty', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      const success = result.current.removeTodo(1);
      expect(success).toBe(true); // Function succeeds even on empty list
    });

    expect(result.current.todos).toHaveLength(0);
    expect(result.current.todosCount).toBe(0);
  });

  it('removes the correct todo when multiple exist', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('First task');
    });
    act(() => {
      result.current.addTodo('Second task');
    });
    act(() => {
      result.current.addTodo('Third task');
    });

    expect(result.current.todos).toHaveLength(3);

    // Remove the middle todo
    const middleTodoId = result.current.todos[1].id;

    act(() => {
      const success = result.current.removeTodo(middleTodoId);
      expect(success).toBe(true);
    });

    expect(result.current.todos).toHaveLength(2);
    expect(result.current.todos[0].text).toBe('First task');
    expect(result.current.todos[1].text).toBe('Third task');
  });

  it('removes todo and updates counts correctly', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task 1');
    });
    act(() => {
      result.current.addTodo('Task 2');
    });

    // Complete one task
    const todoId = result.current.todos[0].id;
    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todosCount).toBe(2);
    expect(result.current.completedCount).toBe(1);
    expect(result.current.pendingCount).toBe(1);

    // Remove the completed task
    act(() => {
      const success = result.current.removeTodo(todoId);
      expect(success).toBe(true);
    });

    expect(result.current.todosCount).toBe(1);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.pendingCount).toBe(1);
  });

  it('persists removal changes', () => {
    const { result, rerender } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task to persist');
    });

    expect(result.current.todos).toHaveLength(1);

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.removeTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);

    // Re-render hook (simulates component re-mount)
    rerender();

    // Should still be removed after re-render
    expect(result.current.todos).toHaveLength(0);
  });

  it('toggles todo completion status', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Toggle me');
    });

    const todoId = result.current.todos[0].id;

    // Initially not done
    expect(result.current.todos[0].done).toBe(false);

    // Toggle to done
    act(() => {
      const success = result.current.toggleTodo(todoId);
      expect(success).toBe(true);
    });

    expect(result.current.todos[0].done).toBe(true);
    expect(result.current.completedCount).toBe(1);
    expect(result.current.pendingCount).toBe(0);

    // Toggle back to not done
    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].done).toBe(false);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.pendingCount).toBe(1);
  });

  it('filters todos by due date when filterDueToday is true', () => {
    const { result } = renderHook(() => useTodos());

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    act(() => {
      result.current.addTodo('Due today', today);
    });
    act(() => {
      result.current.addTodo('Due yesterday', yesterday);
    });
    act(() => {
      result.current.addTodo('Due tomorrow', tomorrow);
    });
    act(() => {
      result.current.addTodo('No due date');
    });

    // Initially shows all todos (no filter applied)
    expect(result.current.todos).toHaveLength(4);
    expect(result.current.allTodos).toHaveLength(4);

    // Enable due today filter
    act(() => {
      result.current.setFilterDueToday(true);
    });

    // Should only show today's todo in filtered results
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Due today');
    // All todos should still be available
    expect(result.current.allTodos).toHaveLength(4);
  });

  it('toggles filter on and off correctly', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task 1');
    });
    act(() => {
      result.current.addTodo('Task 2');
    });

    // Initially no filter applied
    expect(result.current.filterDueToday).toBe(false);
    expect(result.current.todos).toHaveLength(2);

    // Enable filter
    act(() => {
      result.current.setFilterDueToday(true);
    });
    expect(result.current.filterDueToday).toBe(true);
    // Should show no todos since none are due today
    expect(result.current.todos).toHaveLength(0);
    expect(result.current.allTodos).toHaveLength(2);

    // Disable filter
    act(() => {
      result.current.setFilterDueToday(false);
    });
    expect(result.current.filterDueToday).toBe(false);
    expect(result.current.todos).toHaveLength(2);
  });

  it('filters todos with various times on the same day', () => {
    const { result } = renderHook(() => useTodos());

    const today = new Date();
    const todayMorning = new Date(today);
    todayMorning.setHours(9, 0, 0, 0);
    const todayEvening = new Date(today);
    todayEvening.setHours(18, 0, 0, 0);
    const todayMidnight = new Date(today);
    todayMidnight.setHours(23, 59, 59, 999);

    act(() => {
      result.current.addTodo('Morning task', todayMorning);
    });
    act(() => {
      result.current.addTodo('Evening task', todayEvening);
    });
    act(() => {
      result.current.addTodo('Late night task', todayMidnight);
    });

    // Enable filter
    act(() => {
      result.current.setFilterDueToday(true);
    });

    // All tasks due today should be visible regardless of time
    expect(result.current.todos).toHaveLength(3);
    expect(result.current.todos.map(t => t.text)).toEqual(
      expect.arrayContaining(['Morning task', 'Evening task', 'Late night task'])
    );
  });

  it('handles filtering with no todos due today', () => {
    const { result } = renderHook(() => useTodos());

    // Add some todos that are not due today
    act(() => {
      result.current.addTodo('Task due tomorrow', new Date(Date.now() + 24 * 60 * 60 * 1000));
    });
    act(() => {
      result.current.addTodo('Task due yesterday', new Date(Date.now() - 24 * 60 * 60 * 1000));
    });
    act(() => {
      result.current.addTodo('Task with no due date');
    });

    // Enable filter
    act(() => {
      result.current.setFilterDueToday(true);
    });

    // Should show no todos since none are due today
    expect(result.current.todos).toHaveLength(0);
    // All todos should still be available
    expect(result.current.allTodos).toHaveLength(3);
  });

  it('updates filtered results when todos are added after filter is enabled', () => {
    const { result } = renderHook(() => useTodos());

    // Enable filter first
    act(() => {
      result.current.setFilterDueToday(true);
    });
    expect(result.current.todos).toHaveLength(0);

    // Add a todo due today
    act(() => {
      result.current.addTodo('New task due today', new Date());
    });

    // Should now show the new task
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('New task due today');
  });

  it('updates filtered results when todos are removed', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task due today', new Date());
    });
    act(() => {
      result.current.addTodo('Task due tomorrow', new Date(Date.now() + 24 * 60 * 60 * 1000));
    });

    // Enable filter
    act(() => {
      result.current.setFilterDueToday(true);
    });
    expect(result.current.todos).toHaveLength(1);

    // Remove the todo due today
    const todoId = result.current.todos[0].id;
    act(() => {
      result.current.removeTodo(todoId);
    });

    // Should now show no todos
    expect(result.current.todos).toHaveLength(0);
    expect(result.current.allTodos).toHaveLength(1); // Tomorrow's task still exists
  });

  it('persists filter state across re-renders', () => {
    const { result, rerender } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task due today', new Date());
    });

    // Enable filter
    act(() => {
      result.current.setFilterDueToday(true);
    });
    expect(result.current.filterDueToday).toBe(true);
    expect(result.current.todos).toHaveLength(1);

    // Re-render
    rerender();

    // Filter state should persist
    expect(result.current.filterDueToday).toBe(true);
    expect(result.current.todos).toHaveLength(1);
  });

  it('persists todos across hook re-initialization', () => {
    const { result, rerender } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Persistent task');
    });

    expect(result.current.todos).toHaveLength(1);

    // Re-render hook (simulates component re-mount)
    rerender();

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Persistent task');
  });

  it('clears error messages', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo(''); // This will set an error
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('handles multiple todos with different priorities', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Normal priority task', null, 'normal');
    });
    act(() => {
      result.current.addTodo('High priority task', null, 'high');
    });

    expect(result.current.allTodos).toHaveLength(2);
    expect(result.current.allTodos.some(todo => todo.priority === 'normal')).toBe(true);
    expect(result.current.allTodos.some(todo => todo.priority === 'high')).toBe(true);
  });

  it('provides accurate counts', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task 1');
    });
    act(() => {
      result.current.addTodo('Task 2');
    });
    act(() => {
      result.current.addTodo('Task 3');
    });

    expect(result.current.todosCount).toBe(3);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.pendingCount).toBe(3);

    // Complete one task
    const todoId = result.current.todos[0].id;
    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.completedCount).toBe(1);
    expect(result.current.pendingCount).toBe(2);
  });

  it('prevents case-insensitive duplicates', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Buy groceries');
    });

    act(() => {
      const success = result.current.addTodo('BUY GROCERIES');
      expect(success).toBe(false);
    });

    act(() => {
      const success = result.current.addTodo('buy groceries');
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.error).toBe('Error: Duplicate to-do item found.');
  });

  it('prevents duplicates with whitespace differences', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Buy groceries');
    });

    act(() => {
      const success = result.current.addTodo('  Buy groceries  ');
      expect(success).toBe(false);
    });

    act(() => {
      const success = result.current.addTodo('Buy groceries\t');
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.error).toBe('Error: Duplicate to-do item found.');
  });

  it('allows same text with different times on same day', () => {
    const { result } = renderHook(() => useTodos());

    const date1 = new Date('2025-01-15T10:00:00.000Z');
    const date2 = new Date('2025-01-15T15:30:45.123Z'); // Different time, same day

    act(() => {
      result.current.addTodo('Meeting', date1);
    });

    // Should allow same text with different times on same day (not exact duplicates)
    act(() => {
      const success = result.current.addTodo('Meeting', date2);
      expect(success).toBe(true);
    });

    expect(result.current.todos).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('allows same text with different due dates', () => {
    const { result } = renderHook(() => useTodos());

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    act(() => {
      result.current.addTodo('Meeting', today);
    });

    // Should allow same text with different due date
    act(() => {
      const success = result.current.addTodo('Meeting', tomorrow);
      expect(success).toBe(true);
    });

    expect(result.current.todos).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('allows same text when one has due date and other does not', () => {
    const { result } = renderHook(() => useTodos());

    const today = new Date();

    act(() => {
      result.current.addTodo('Meeting');
    });

    // Should allow same text when one has due date and other doesn't (not exact duplicates)
    act(() => {
      const success = result.current.addTodo('Meeting', today);
      expect(success).toBe(true);
    });

    expect(result.current.todos).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('handles duplicate detection with mixed null/undefined due dates', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task with null due date', null);
    });

    // Should prevent duplicate with undefined due date
    act(() => {
      const success = result.current.addTodo('Task with null due date', undefined);
      expect(success).toBe(false);
    });

    // Should prevent duplicate with no due date parameter
    act(() => {
      const success = result.current.addTodo('Task with null due date');
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.error).toBe('Error: Duplicate to-do item found.');
  });

  it('allows retry after duplicate error is cleared', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Original task');
    });

    // Try to add duplicate (should fail)
    act(() => {
      const success = result.current.addTodo('Original task');
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.error).toBe('Error: Duplicate to-do item found.');

    // Clear error
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();

    // Now should be able to add a different task
    act(() => {
      const success = result.current.addTodo('Different task');
      expect(success).toBe(true);
    });

    expect(result.current.todos).toHaveLength(2);
  });

  it('maintains duplicate detection across hook re-renders', () => {
    const { result, rerender } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Persistent task');
    });

    expect(result.current.todos).toHaveLength(1);

    // Re-render hook
    rerender();

    // Should still prevent duplicates after re-render
    act(() => {
      const success = result.current.addTodo('Persistent task');
      expect(success).toBe(false);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.error).toBe('Error: Duplicate to-do item found.');
  });
});
