// Use the yargs library to handle command-line arguments
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
  .option('shout', {
    type: 'boolean',
    default: false,
    description: 'Shout the greeting'
  })
  .positional('name', {
    type: 'string',
    default: 'World',
    description: 'Name to greet'
  })
  .argv;

// Get the name from positional arguments or default to 'World'
const name = argv._[0] || argv.name || 'World';
const shout = argv.shout || false;

let message = `Hello, ${name}!`;

if (shout) {
  message = message.toUpperCase();
}

console.log(message);