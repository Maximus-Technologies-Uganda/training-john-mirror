export function formatGreeting(name = "World", shout = false) {
    const text = `Hello, ${name}!`;
    return shout ? text.toUpperCase() : text;
  }
