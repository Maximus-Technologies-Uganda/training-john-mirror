export { run } from '../../src/todo-cli.js';

if (import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] && import.meta.url.endsWith('todo-cli.js') && process.argv[1].endsWith('todo-cli.js')))
{
  import('../../src/todo-cli.js').then(({ run }) => {
    const exitCode = run(process.argv);
    process.exit(exitCode);
  });
}


