// Use the yargs library to handle command-line arguments
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { formatGreeting } = require('./hello-core.js');

const argv = yargs(hideBin(process.argv))
  .option('shout', {
    type: 'boolean',
    default: false,
    description: 'Shout the greeting'
  })
  .help('h')
  .alias('h', 'help')
  .usage('Usage: $0 [name] [options]')
  .example('$0', 'Greet with default name "World"')
  .example('$0 John', 'Greet John')
  .example('$0 John --shout', 'Shout greeting to John')
  .argv;

// Get the name from positional arguments or default to 'World'
const name = argv._[0] || 'World';
const shout = argv.shout || false;

// Use the extracted formatGreeting function
const message = formatGreeting(name, shout);
console.log(message);