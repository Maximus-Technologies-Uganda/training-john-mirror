import { useState, useMemo, useCallback } from 'react';
import useLocalStorage from './useLocalStorage.js';

// Constants
const PRIORITY_NORMAL = 'normal';

// Utility functions (simplified versions for now)
function normalizeText(text = '') {
  return String(text).trim().toLowerCase();
}

function normalizeDueDate(due) {
  if (!due) return null;
  if (typeof due === 'string') return due; // Already an ISO string
  if (due instanceof Date) return due.toISOString();
  const parsed = new Date(due);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function isDuplicate(todos, text, dueDate) {
  const normalizedText = normalizeText(text);
  const normalizedDue = normalizeDueDate(dueDate);

  return todos.some(todo => {
    const todoTextMatches = normalizeText(todo.text) === normalizedText;
    const todoDueMatches = normalizeDueDate(todo.dueDate) === normalizedDue;
    return todoTextMatches && todoDueMatches;
  });
}

function formatDuplicateError() {
  return 'Error: Duplicate to-do item found.';
}

function computeNextId(todos) {
  return todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
}

// Simplified core functions
function addTask(todos, text, dueDate = null, priority = PRIORITY_NORMAL) {
  if (!text?.trim()) {
    throw new Error('To-do text is required.');
  }

  if (isDuplicate(todos, text, dueDate)) {
    throw new Error(formatDuplicateError());
  }

  const newTodo = {
    id: computeNextId(todos),
    text: text.trim(),
    done: false,
    dueDate: normalizeDueDate(dueDate),
    priority
  };

  return [...todos, newTodo];
}

function markTaskDone(todos, id) {
  return todos.map(todo =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
}

function removeTask(todos, id) {
  return todos.filter(todo => todo.id !== id);
}

/**
 * Custom hook for managing todo state with persistence and error handling
 * @returns {Object} Todo state and actions
 * @returns {Array} .todos - Filtered todo items based on current filters
 * @returns {Array} .allTodos - All todo items without filtering
 * @returns {boolean} .filterDueToday - Whether due-today filter is active
 * @returns {string|null} .error - Current error message or null
 * @returns {boolean} .isStorageAvailable - Whether localStorage is available for persistence
 * @returns {number} .todosCount - Total number of todos
 * @returns {number} .completedCount - Number of completed todos
 * @returns {number} .pendingCount - Number of pending todos
 * @returns {Function} .addTodo - Add a new todo (text, dueDate?, priority?) => boolean
 * @returns {Function} .removeTodo - Remove todo by id => boolean
 * @returns {Function} .toggleTodo - Toggle completion status by id => boolean
 * @returns {Function} .setFilterDueToday - Set due-today filter => void
 * @returns {Function} .clearError - Clear current error message => void
 */
function useTodos() {
  // UI state
  const [filterDueToday, setFilterDueToday] = useState(false);
  const [error, setError] = useState(null);

  // Error handler for localStorage issues
  const handleStorageError = useCallback((friendlyMessage, originalError) => {
     
    console.error('Storage error:', originalError);
    setError(friendlyMessage);
  }, []);

  // Persistent storage for todos with error handling
  const [todos, setTodos, isStorageAvailable] = useLocalStorage('todo-tasks', [], handleStorageError);

  // Clear error after 5 seconds
  const clearError = useCallback(() => setError(null), []);

  // Add a new todo
  const addTodo = useCallback((text, dueDate = null, priority = PRIORITY_NORMAL) => {
    try {
      setError(null);

      // Validate input
      const trimmedText = text?.trim();
      if (!trimmedText) {
        setError('Error: To-do text is required.');
        return false;
      }

      // Check for duplicates
      if (isDuplicate(todos, text, dueDate)) {
        setError(formatDuplicateError());
        return false;
      }

      // Use core logic to add task
      const updatedTodos = addTask(todos, trimmedText, dueDate, priority);
      setTodos(updatedTodos);
      return true;
    } catch (err) {
       
      console.error('Error adding todo:', err);
      setError('Error: Failed to add task.');
      return false;
    }
  }, [todos]);

  // Remove a todo by ID
  const removeTodo = useCallback((id) => {
    try {
      setError(null);
      const updatedTodos = removeTask(todos, id);
      setTodos(updatedTodos);
      return true;
    } catch (err) {
       
      console.error('Error removing todo:', err);
      setError('Error: Failed to remove task.');
      return false;
    }
  }, [todos]);

  // Toggle todo completion status
  const toggleTodo = useCallback((id) => {
    try {
      setError(null);
      const updatedTodos = markTaskDone(todos, id);
      setTodos(updatedTodos);
      return true;
    } catch (err) {
       
      console.error('Error toggling todo:', err);
      setError('Error: Failed to update task.');
      return false;
    }
  }, [todos]);

  // Get filtered todos based on due date filter
  const filteredTodos = useMemo(() => {
    if (!filterDueToday) {
      return todos;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    return todos.filter(todo => {
      if (!todo.dueDate) return false;

      const dueDate = new Date(todo.dueDate);
      if (Number.isNaN(dueDate.getTime())) return false;

      // Check if due date is today (from start to end of today)
      return dueDate >= today && dueDate <= endOfToday;
    });
  }, [todos, filterDueToday]);

  // Get todos count for display (based on all todos, not filtered)
  const todosCount = todos.length;
  const completedCount = todos.filter(todo => todo.done).length;
  const pendingCount = todosCount - completedCount;

  return {
    // State
    todos: filteredTodos,
    allTodos: todos,
    filterDueToday,
    error,
    isStorageAvailable,

    // Counts
    todosCount,
    completedCount,
    pendingCount,

    // Actions
    addTodo,
    removeTodo,
    toggleTodo,
    setFilterDueToday,
    clearError
  };
}

export default useTodos;
