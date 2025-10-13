import { run } from './src/todo-cli.js';

await run(['node', 'todo-cli.js', 'add', 'Test task']);
await run(['node', 'todo-cli.js', 'add', 'Test task']);
console.log('done');

