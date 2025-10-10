import fs from 'fs';

const logs = [];
const errors = [];
let exitCode = 0;

const originalLog = console.log;
const originalError = console.error;
const originalExit = process.exit;
const originalArgv = process.argv.slice();

console.log = (...msgs) => {
  logs.push(msgs.join(' '));
};

console.error = (...msgs) => {
  errors.push(msgs.join(' '));
};

process.exit = (code) => {
  exitCode = Number(code) || 0;
  throw new Error(`EXIT_${exitCode}`);
};

if (fs.existsSync('todos.json')) {
  fs.unlinkSync('todos.json');
}

process.argv = ['node', 'todo-cli.js', 'add', 'Test task'];

try {
  const cliModule = await import('./todo/src/todo-cli.js');
  cliModule.run(process.argv);
} catch (error) {
  if (!(error instanceof Error && /^EXIT_\d+$/.test(error.message))) {
    throw error;
  }
}

console.log = originalLog;
console.error = originalError;
process.exit = originalExit;
process.argv = originalArgv;

console.log('captured logs:', logs);
console.log('captured errors:', errors);
console.log('exit code:', exitCode);

