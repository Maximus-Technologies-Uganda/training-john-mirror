// Filter out node and script paths to get the real arguments
const args = process.argv.slice(2);

// Find and remove the --shout flag
const shoutIndex = args.indexOf('--shout');
let shouldShout = false;
if (shoutIndex > -1) {
    shouldShout = true;
    args.splice(shoutIndex, 1);
}

// Use the first remaining argument as the name, or default to "World"
const name = args[0] || "World";

let message = `Hello, ${name}!`;

if (shouldShout) {
    message = message.toUpperCase();
}

console.log(message);