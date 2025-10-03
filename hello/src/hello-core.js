import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export function formatGreeting(name = "World", shout = false) {
  const text = `Hello, ${name}!`;
  return shout ? text.toUpperCase() : text;
}

// CLI interface
export function runCLI(argvInput = process.argv) {
  const argv = yargs(hideBin(argvInput))
    .usage('Usage: $0 [options] [name]')
    .option('shout', {
      alias: 's',
      type: 'boolean',
      description: 'Shout the greeting (uppercase)',
      default: false
    })
    .positional('name', {
      type: 'string',
      description: 'Name to greet',
      default: 'World'
    })
    .help('h')
    .alias('h', 'help')
    .version()
    .example('$0', 'Say hello to World')
    .example('$0 John', 'Say hello to John')
    .example('$0 --shout Alice', 'Shout hello to Alice')
    .example('$0 -s Bob', 'Shout hello to Bob (short flag)')
    .argv;

  const positionalName = Array.isArray(argv._) && typeof argv._[0] === 'string' && argv._[0].length > 0
    ? argv._[0]
    : undefined;

  const flagName = typeof argv.name === 'string' && argv.name.length > 0 ? argv.name : undefined;

  const name = positionalName ?? flagName ?? 'World';
  const shout = argv.shout === true;
  
  const greeting = formatGreeting(name, shout);
  console.log(greeting);
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI(process.argv);
}
