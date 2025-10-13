// Core to-do management logic (pure, no I/O)

const PRIORITY_HIGH = 'high';
const PRIORITY_NORMAL = 'normal';

function normalizeText(text = '') {
  return String(text).trim().toLowerCase();
}

function normalizeDueDate(due) {
  if (!due) {
    return null;
  }

  if (due instanceof Date) {
    return due;
  }

  const parsed = new Date(due);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function computeNextId(todos) {
  const maxId = todos.reduce((acc, todo) => Math.max(acc, todo.id ?? 0), 0);
  return maxId + 1;
}

function buildTodo({ id, text, dueDate = null, priority = PRIORITY_NORMAL }) {
  return {
    id,
    text,
    done: false,
    dueDate,
    priority
  };
}

function formatDuplicateError() {
  return 'Error: Duplicate to-do item found.';
}

function isDuplicate(todos, text, dueDate) {
  const normalizedText = normalizeText(text);

  return todos.some((todo) => {
    const todoTextMatches = normalizeText(todo.text) === normalizedText;
    const todoDueMatches = (todo.dueDate === null && dueDate === null) ||
      (todo.dueDate && dueDate && new Date(todo.dueDate).toISOString() === dueDate.toISOString());

    return todoTextMatches && todoDueMatches;
  });
}

function addTodo(todos, options = {}) {
  const text = options.text;

  if (!text || !text.trim()) {
    return { success: false, error: 'Error: To-do text is required.' };
  }

  const dueDate = normalizeDueDate(options.dueDate ?? null);

  if (isDuplicate(todos, text, dueDate)) {
    return { success: false, error: formatDuplicateError() };
  }

  const id = computeNextId(todos);
  const priority = options.highPriority ? PRIORITY_HIGH : PRIORITY_NORMAL;

  const newTodo = buildTodo({ id, text: text.trim(), dueDate, priority });
  const updatedTodos = [...todos, newTodo];

  return { success: true, data: updatedTodos };
}

function markDone(todos, options = {}) {
  const id = Number(options.id);

  if (!Number.isInteger(id)) {
    return { success: false, error: 'Error: Valid numeric id is required to mark a to-do as done.' };
  }

  const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, done: true } : todo));
  return { success: true, data: updatedTodos };
}

function removeTodo(todos, options = {}) {
  const id = Number(options.id);

  if (!Number.isInteger(id)) {
    return { success: false, error: 'Error: Valid numeric id is required to remove a to-do.' };
  }

  const updatedTodos = todos.filter((todo) => todo.id !== id);
  return { success: true, data: updatedTodos };
}

function sortTodosForList(todos) {
  return [...todos].sort((a, b) => {
    const aPriority = a.priority === PRIORITY_HIGH ? 1 : 0;
    const bPriority = b.priority === PRIORITY_HIGH ? 1 : 0;

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    return a.id - b.id;
  });
}

function filterTodos(todos, options = {}) {
  let filtered = [...todos];

  if (options.filterDueDate instanceof Date) {
    const targetIso = options.filterDueDate.toISOString();
    filtered = filtered.filter((todo) => {
      const todoDue = normalizeDueDate(todo.dueDate);
      return todoDue && todoDue.toISOString() === targetIso;
    });
  }

  if (options.filterHighPriority) {
    filtered = filtered.filter((todo) => todo.priority === PRIORITY_HIGH);
  }

  return filtered;
}

function listTodos(todos, options = {}) {
  const filtered = filterTodos(todos, options);
  const sorted = sortTodosForList(filtered);
  return { success: true, data: sorted };
}

const COMMANDS = {
  add: addTodo,
  done: markDone,
  remove: removeTodo,
  list: listTodos
};

export function manageTodos(todos = [], command = '', options = {}) {
  const handler = COMMANDS[command];

  if (!handler) {
    return { success: false, error: `Error: Unsupported command "${command}".` };
  }

  return handler(todos, options);
}

export function getEndOfToday(baseDate = new Date()) {
  const endOfDay = new Date(baseDate);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}

export function isDuplicateTask(todos, text, dueDate) {
  const normalizedDue = normalizeDueDate(dueDate);
  return isDuplicate(todos, text, normalizedDue);
}

export function addTask(todos, text, dueDate = null, priority = PRIORITY_NORMAL) {
  const result = manageTodos(todos, 'add', {
    text,
    dueDate,
    highPriority: priority === PRIORITY_HIGH
  });

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export function markTaskDone(todos, id) {
  const result = manageTodos(todos, 'done', { id });

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export function removeTask(todos, id) {
  const result = manageTodos(todos, 'remove', { id });

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export function listTasks(todos, options = {}) {
  const result = manageTodos(todos, 'list', options);

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}

export {
  PRIORITY_HIGH,
  PRIORITY_NORMAL,
  normalizeText,
  normalizeDueDate,
  sortTodosForList
};


