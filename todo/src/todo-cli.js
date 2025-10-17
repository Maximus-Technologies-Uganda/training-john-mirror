#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  markTaskDone,
  removeTask,
  manageTodos,
  normalizeDueDate,
  getEndOfToday,
  PRIORITY_HIGH
} from './todo-core.js';

const DATA_FILE = path.resolve(process.cwd(), 'todos.json');

function loadTodos() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((todo) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : null
        }));
      }
    }
  } catch (error) {
    console.error('Failed to load todos:', error.message);
  }
  return [];
}

function saveTodos(_todos) {
  try {
    const serializable = _todos.map((todo) => ({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString() : null
    }));
    fs.writeFileSync(DATA_FILE, JSON.stringify(serializable, null, 2));
  } catch (error) {
    console.error('Failed to save todos:', error.message);
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
      let dueDate = null;

      if (args.dueToday) {
        dueDate = getEndOfToday();
      } else if (typeof args.due === 'string') {
        const trimmedDue = args.due.trim();
        if (trimmedDue.length > 0) {
          if (trimmedDue.toLowerCase() === 'today') {
            dueDate = getEndOfToday();
          } else {
            console.error('Error: Only "Today" is supported for --due flag');
            process.exit(1);
          }
        }
      }

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
      const updated = markTaskDone(todos, args.id);
      if (updated === todos) {
        console.log('Task not found.');
        process.exit(1);
      }
      saveTodos(updated);
      console.log(`Marked task ${args.id} as done.`);
    })
    .command('remove <id>', 'Remove a task', (y) => {
      return y.positional('id', {
        describe: 'Task id',
        type: 'number'
      });
    }, (args) => {
      const updated = removeTask(todos, args.id);
      if (updated.length === todos.length) {
        console.log('Task not found.');
        process.exit(1);
      }
      saveTodos(updated);
      console.log(`Removed task ${args.id}.`);
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


