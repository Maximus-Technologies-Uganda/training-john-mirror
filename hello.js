// Filter out the node and script paths to get only the real arguments
const args = process.argv.slice(2);

// Find the --shout flag and remove it from the arguments list
const shoutIndex = args.indexOf('--shout');
let shouldShout = false;
if (shoutIndex > -1) {
    shouldShout = true;
    args.splice(shoutIndex, 1); // Remove the flag from the array
}

// The first remaining argument is the name, or default to "World"
const name = args[0] || "World";

// Create the greeting message
let message = `Hello, ${name}!`;

// If the --shout flag was present, make the message uppercase
if (shouldShout) {
    message = message.toUpperCase();
}

console.log(message);