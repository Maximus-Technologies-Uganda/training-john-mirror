// Get the third item from the command line arguments, or default to "World"
const name = process.argv[2] || "World";

// Check if the --shout flag exists
const shouldShout = process.argv.includes('--shout');

// Create the greeting message
let message = `Hello, ${name}!`;

// If the --shout flag is present, make the message uppercase
if (shouldShout) {
  message = message.toUpperCase();
}

// Print the final message
console.log(message);