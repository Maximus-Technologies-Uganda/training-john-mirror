// Pure to-do core logic (no I/O, no CLI parsing)

const PRIORITY_HIGH = 'high';
const PRIORITY_NORMAL = 'normal';

function normalizeText(text) {
  if (typeof text !== 'string') {
    throw new Error('Task text must be a string.');
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error('Task text cannot be empty.');
  }
  return trimmed;
}

function normalizeDueDate(dueDate) {
  if (dueDate == null || dueDate === '') {
    return null;
  }

  if (dueDate instanceof Date) {
    return new Date(dueDate.getTime());
  }

  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid due date.');
  }
  return parsed;
}

function getEndOfToday(now = new Date()) {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return end;
}

function isDuplicateTask(existing, text, dueDate) {
  const normalizedText = normalizeText(text).toLowerCase();
  const normalizedDueDate = dueDate ? normalizeDueDate(dueDate).getTime() : null;

  return existing.some((task) => {
    const taskText = typeof task.text === 'string' ? task.text.trim().toLowerCase() : '';
    const taskDue = task.dueDate ? normalizeDueDate(task.dueDate).getTime() : null;
    return taskText === normalizedText && taskDue === normalizedDueDate;
  });
}

function addTask(tasks, text, dueDate = null, priority = PRIORITY_NORMAL) {
  const normalizedText = normalizeText(text);
  const normalizedDueDate = normalizeDueDate(dueDate);

  if (isDuplicateTask(tasks, normalizedText, normalizedDueDate)) {
    throw new Error('Duplicate to-do item found.');
  }

  const nextId = tasks.reduce((max, task) => Math.max(max, task.id ?? 0), 0) + 1;

  return [
    ...tasks,
    {
      id: nextId,
      text: normalizedText,
      done: false,
      dueDate: normalizedDueDate,
      priority: priority === PRIORITY_HIGH ? PRIORITY_HIGH : PRIORITY_NORMAL
    }
  ];
}

function listTasks(tasks) {
  return tasks.map((task) => ({ ...task }));
}

function markTaskDone(tasks, taskId) {
  let updated = false;
  const mapped = tasks.map((task) => {
    if (task.id === taskId) {
      updated = true;
      return { ...task, done: true };
    }
    return task;
  });

  return updated ? mapped : tasks.slice();
}

function removeTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId).map((task) => ({ ...task }));
}

function sortTodosForList(todos) {
  return [...todos].sort((a, b) => {
    if (a.priority === PRIORITY_HIGH && b.priority !== PRIORITY_HIGH) {
      return -1;
    }
    if (a.priority !== PRIORITY_HIGH && b.priority === PRIORITY_HIGH) {
      return 1;
    }

    const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    if (aDue !== bDue) {
      return aDue - bDue;
    }

    return a.text.localeCompare(b.text, undefined, { sensitivity: 'base' });
  });
}

function manageTodos(todos, command, options = {}) {
  const normalizedTodos = Array.isArray(todos) ? todos.map((todo) => ({ ...todo })) : [];

  switch (command) {
    case 'add':
      try {
        const updated = addTask(
          normalizedTodos,
          options.text,
          options.dueDate,
          options.highPriority ? PRIORITY_HIGH : PRIORITY_NORMAL
        );

        return {
          success: true,
          data: updated
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          success: false,
          error: message.startsWith('Error:') ? message : `Error: ${message}`
        };
      }

    case 'list': {
      const filterDueDate = options.filterDueDate ? normalizeDueDate(options.filterDueDate) : null;
      const filterTime = filterDueDate ? filterDueDate.getTime() : null;

      const filtered = normalizedTodos.filter((todo) => {
        if (!filterTime) {
          return true;
        }
        if (!todo.dueDate) {
          return false;
        }
        const todoDue = normalizeDueDate(todo.dueDate);
        return todoDue.getTime() <= filterTime;
      });

      return {
        success: true,
        data: sortTodosForList(filtered)
      };
    }

    case 'clear': {
      const remaining = normalizedTodos.filter((todo) => !todo.done);
      return { success: true, data: remaining };
    }

    default:
      return { success: false, error: `Unknown command: ${command}` };
  }
}

export {
  addTask,
  markTaskDone,
  removeTask,
  listTasks,
  manageTodos,
  normalizeText,
  normalizeDueDate,
  getEndOfToday,
  isDuplicateTask,
  sortTodosForList,
  PRIORITY_HIGH,
  PRIORITY_NORMAL
};


