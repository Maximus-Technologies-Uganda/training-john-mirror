import { run } from './src/todo-cli.js';

const args = process.argv.slice(2);
const exitCode = run(['node', 'todo-cli.js', ...args]);
console.log('exit code', exitCode);

