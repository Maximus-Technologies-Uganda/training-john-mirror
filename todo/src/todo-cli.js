#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  markTaskDone,
  removeTask,
  manageTodos,
  getEndOfToday,
  PRIORITY_HIGH
} from './todo-core.js';

const DEFAULT_DATA_FILE = path.resolve(process.cwd(), 'data', 'persistence', 'todo.json');

function resolveDataFile() {
  const override = process.env.TODO_DATA_FILE;
  if (override && String(override).trim().length > 0) {
    return path.resolve(override);
  }
  return DEFAULT_DATA_FILE;
}

const DATA_FILE = resolveDataFile();

function ensureStorage(filePath) {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
  }
}

function loadTodos() {
  try {
    ensureStorage(DATA_FILE);

    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Stored todos data is not an array.');
    }

    return parsed.map((todo) => ({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : null
    }));
  } catch (error) {
    console.error('Failed to load todos:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function saveTodos(todos) {
  try {
    ensureStorage(DATA_FILE);
    const serializable = todos.map((todo) => ({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString() : null
    }));
    fs.writeFileSync(DATA_FILE, JSON.stringify(serializable, null, 2));
  } catch (error) {
    console.error('Failed to save todos:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function printTodos(_todos) {
  if (_todos.length === 0) {
    console.log('No tasks found.');
    return;
  }

  console.log('Tasks:');
  _todos.forEach((todo) => {
    const status = todo.done ? '✓' : '○';
    const priority = todo.priority === PRIORITY_HIGH ? ' [HIGH]' : '';
    const due = formatDueLabel(todo.dueDate);
    console.log(`${todo.id}. ${status} ${todo.text}${priority}${due}`);
  });
}

function formatDueLabel(dueDate) {
  if (!dueDate) {
    return '';
  }
  const date = dueDate instanceof Date ? dueDate : new Date(dueDate);
  return Number.isNaN(date.getTime()) ? '' : ` (due: ${date.toLocaleDateString()})`;
}

function resolveDueDate(args) {
  if (args.dueToday) {
    return getEndOfToday();
  }

  if (typeof args.due !== 'string') {
    return null;
  }

  const trimmedDue = args.due.trim();
  if (trimmedDue.length === 0) {
    return null;
  }

  if (trimmedDue.toLowerCase() === 'today') {
    return getEndOfToday();
  }

  const parsed = new Date(trimmedDue);
  if (Number.isNaN(parsed.getTime())) {
    console.error('Error: Only "Today" or ISO date strings are supported for --due flag');
    process.exit(1);
  }

  return parsed;
}

function assertPositiveInteger(value, errorMessage) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    console.error(errorMessage);
    process.exit(1);
  }
  return id;
}

function ensureTodoExists(todos, id, actionDescription) {
  if (!todos.some((todo) => todo.id === id)) {
    console.error(`Error: No task found with id ${id} to ${actionDescription}.`);
    process.exit(1);
  }
}

function run(argv = process.argv) {
  const todos = loadTodos();

  const parser = yargs(hideBin(argv))
    .scriptName('todo-cli.js')
    .usage('Usage: $0 <command> [options]')
    .command('add <text>', 'Add a new task', (y) => {
      return y
        .positional('text', {
          describe: 'Task description',
          type: 'string'
        })
        .option('due', {
          alias: 'd',
          type: 'string',
          describe: 'Due date string (supports "Today" keyword or ISO date)'
        })
        .option('dueToday', {
          type: 'boolean',
          describe: 'Set due date to the end of today'
        })
        .option('highPriority', {
          type: 'boolean',
          describe: 'Mark task as high priority'
        });
    }, (args) => {
      const dueDate = resolveDueDate(args);

      const result = manageTodos(todos, 'add', {
        text: args.text,
        dueDate,
        highPriority: Boolean(args.highPriority)
      });
      
      if (!result.success) {
        console.error(result.error);
        process.exit(1);
      }
      
      saveTodos(result.data);
      const highPriorityLabel = args.highPriority ? ' [HIGH]' : '';
      const dueLabel = formatDueLabel(dueDate);
      console.log(`Added task: "${args.text}"${highPriorityLabel}${dueLabel}`);
    })
    .command('done <id>', 'Mark a task as done', (y) => {
      return y.positional('id', {
        describe: 'Task id',
        type: 'number'
      });
    }, (args) => {
      const targetId = assertPositiveInteger(args.id, 'Error: Valid positive integer id is required to mark a to-do as done.');
      ensureTodoExists(todos, targetId, 'mark as done');
      const updated = markTaskDone(todos, targetId);
      saveTodos(updated);
      console.log(`Marked task ${targetId} as done.`);
    })
    .command('remove <id>', 'Remove a task', (y) => {
      return y.positional('id', {
        describe: 'Task id',
        type: 'number'
      });
    }, (args) => {
      const targetId = assertPositiveInteger(args.id, 'Error: Valid positive integer id is required to remove a to-do.');
      ensureTodoExists(todos, targetId, 'remove');
      const updated = removeTask(todos, targetId);
      saveTodos(updated);
      console.log(`Removed task ${targetId}.`);
    })
    .command('list', 'List all tasks', () => {
      return undefined;
    }, () => {
      const result = manageTodos(todos, 'list');
      if (!result.success) {
        console.error(result.error);
        process.exit(1);
      }
      printTodos(result.data);
    })
    .command('clear', 'Remove all completed tasks', () => {
      return undefined;
    }, () => {
      const result = manageTodos(todos, 'clear');
      saveTodos(result.data);
      console.log('Cleared completed tasks.');
    })
    .demandCommand(1, 'You need to specify a command.')
    .help('h')
    .alias('h', 'help')
    .version(false);

  parser.parse();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run(process.argv);
}

export { run };


