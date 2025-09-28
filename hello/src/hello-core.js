import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export function formatGreeting(name = "World", shout = false) {
  const text = `Hello, ${name}!`;
  return shout ? text.toUpperCase() : text;
}

// CLI interface
function main() {
  const argv = yargs(hideBin(process.argv))
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

  const name = argv.name || 'World';
  const shout = argv.shout || false;
  
  const greeting = formatGreeting(name, shout);
  console.log(greeting);
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
