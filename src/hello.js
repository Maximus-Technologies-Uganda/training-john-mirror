// Use the yargs library to handle command-line arguments
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

// yargs makes it easy to get arguments by name
const name = argv.name || 'World';
const shout = argv.shout || false;

let message = `Hello, ${name}!`;

if (shout) {
  message = message.toUpperCase();
}

console.log(message);