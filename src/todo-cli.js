import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { manageTodos, getEndOfToday } from './todo-core.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const modulePath = fileURLToPath(import.meta.url);
const moduleBasename = path.basename(modulePath);

function resolveDataFile() {
  const override = process.env.TODO_DATA_FILE;

  if (override && String(override).trim()) {
    return path.isAbsolute(override) ? override : path.resolve(override);
  }

  return path.resolve(process.cwd(), 'todos.json');
}

const baseDataFile = resolveDataFile();
let dataFile = baseDataFile;
let cleanupFile = null;

function prepareDataFile() {
  if (process.env.TODO_DATA_FILE && String(process.env.TODO_DATA_FILE).trim()) {
    dataFile = path.resolve(process.env.TODO_DATA_FILE);
    ensureFileReady(dataFile);
    return;
  }

  if (process.env.VITEST) {
    dataFile = path.resolve(process.cwd(), 'todos.json');
    cleanupFile = null;
    ensureFileReady(dataFile);
    return;
  }

  ensureFileReady(baseDataFile);
}

function ensureFileReady(targetFile) {
  const directory = path.dirname(targetFile);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(targetFile)) {
    fs.writeFileSync(targetFile, '[]', 'utf8');
  }
}

prepareDataFile();

function loadTodos() {
  try {
    if (!fs.existsSync(dataFile)) {
      return [];
    }

    const raw = fs.readFileSync(dataFile, 'utf8') || '[]';
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error('Stored todos are not an array');
    }

    return parsed.map((todo) => ({
      ...todo,
      dueDate: todo?.dueDate ? new Date(todo.dueDate) : null
    }));
  } catch (error) {
    console.error('Error loading todos:', error.message);
    process.exit(1);
  }
}

function saveTodos(todos) {
  try {
    const serialisable = todos.map((todo) => ({
      ...todo,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString() : null
    }));

    fs.writeFileSync(dataFile, JSON.stringify(serialisable, null, 2));
  } catch (error) {
    console.error('Error saving todos:', error.message);
    process.exit(1);
  }
}

function resolveDueOption(argv) {
  if (argv.dueToday) {
    return getEndOfToday(new Date());
  }

  if (argv.due === undefined || argv.due === null) {
    return null;
  }

  if (String(argv.due).toLowerCase() === 'today') {
    return getEndOfToday(new Date());
  }

  return new Error('Error: Only "Today" is supported for --due flag');
}

function sanitizeArgv(argsList) {
  if (!Array.isArray(argsList)) {
    return [];
  }

  const sanitized = [...argsList];

  while (sanitized.length) {
    const first = sanitized[0];
    const lower = typeof first === 'string' ? first.toLowerCase() : '';
    const isNodeBinary = lower === 'node' || lower === 'node.exe' || lower === 'node.cmd';
    const isScriptPath = typeof first === 'string' && (
      first === moduleBasename ||
      first.endsWith(`/${moduleBasename}`) ||
      first.endsWith(`\\${moduleBasename}`)
    );

    if (isNodeBinary || isScriptPath) {
      sanitized.shift();
      continue;
    }

    break;
  }

  return sanitized;
}

function parseArgs(argv = process.argv) {
  const normalizedArgv = sanitizeArgv(hideBin(argv));

  return yargs(normalizedArgv)
    .scriptName('todo')
    .usage('Usage: $0 <command> [options]')
    .command('add <task>', 'Add a new task', (y) => y
      .positional('task', {
        describe: 'Task description',
        type: 'string'
      })
      .option('due', {
        alias: 'd',
        type: 'string',
        description: 'Set due date (only "Today" supported)'
      })
      .option('dueToday', {
        type: 'boolean',
        description: 'Convenience flag for due end of today'
      })
      .option('highPriority', {
        type: 'boolean',
        description: 'Mark the to-do as high priority'
      }))
    .command('done <id>', 'Mark a task as done', (y) => y
      .positional('id', {
        describe: 'Task ID to mark as done',
        type: 'number'
      }))
    .command('remove <id>', 'Remove a task', (y) => y
      .positional('id', {
        describe: 'Task ID to remove',
        type: 'number'
      }))
    .command('list', 'List all tasks', (y) => y
      .option('dueToday', {
        type: 'boolean',
        description: 'Filter tasks due by end of today'
      })
      .option('highPriority', {
        type: 'boolean',
        description: 'Only show high priority tasks'
      }))
    .help('h')
    .alias('h', 'help')
    .version()
    .demandCommand(1, 'You need to specify a command')
    .parse();
}

function buildOptions(command, args) {
  const options = {
    text: args.task,
    id: args.id,
    dueDate: null,
    highPriority: Boolean(args.highPriority)
  };

  const dueDateOrError = resolveDueOption(args);
  if (dueDateOrError instanceof Error) {
    console.error(dueDateOrError.message);
    process.exit(1);
  }

  options.dueDate = dueDateOrError;

  if (command === 'list') {
    options.filterDueDate = args.dueToday ? getEndOfToday(new Date()) : null;
    options.filterHighPriority = Boolean(args.highPriority);
  }

  return options;
}

function printList(todos) {
  if (!todos.length) {
    console.log('No tasks found.');
    return;
  }

  console.log('\nTasks:');
  todos.forEach((todo, index) => {
    const status = todo.done ? '✓' : '○';
    const dueInfo = todo.dueDate ? ` (due: ${new Date(todo.dueDate).toLocaleDateString()})` : '';
    const priorityInfo = todo.priority === 'high' ? ' [HIGH]' : '';
    console.log(`${index + 1}. ${status} ${todo.text}${priorityInfo}${dueInfo}`);
  });
}

function run(argv = process.argv) {
  const args = parseArgs(argv);
  const command = String(args._[0]);

  const todos = loadTodos();
  const options = buildOptions(command, args);

  const result = manageTodos(todos, command, options);

  if (!result.success) {
    console.error(result.error);
    process.exit(1);
  }

  const updatedTodos = result.data;

  if (command !== 'list') {
    saveTodos(updatedTodos);
  }

  switch (command) {
    case 'add': {
      const addedTodo = updatedTodos[updatedTodos.length - 1];
      const priorityInfo = addedTodo.priority === 'high' ? ' [HIGH]' : '';
      const dueInfo = addedTodo.dueDate ? ` (due: ${new Date(addedTodo.dueDate).toLocaleDateString()})` : '';
      console.log(`Added task: "${addedTodo.text}"${priorityInfo}${dueInfo}`);
      break;
    }
    case 'done':
      console.log(`Marked task ${args.id} as done`);
      break;
    case 'remove':
      console.log(`Removed task ${args.id}`);
      break;
    case 'list':
      printList(updatedTodos);
      break;
    default:
      break;
  }

  return 0;
}

export { run };

const isDirectCli = (() => {
  if (!Array.isArray(process.argv) || process.argv.length < 2) {
    return false;
  }

  try {
    const entryPath = path.resolve(process.argv[1]);
    return entryPath === modulePath;
  } catch {
    return false;
  }
})();

if (isDirectCli) {
  const exitCode = run(process.argv);
  process.exit(exitCode);
}


