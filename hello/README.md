# Hello CLI

A simple command-line interface for generating personalized greetings.

## Features

- Generate personalized greetings
- Support for uppercase/shout mode
- Default fallback to "World"

## Installation

```bash
npm install
```

## Usage

```bash
# Basic greeting
node src/hello-core.js

# Personalized greeting
node src/hello-core.js --name "John"

# Shout greeting
node src/hello-core.js --name "John" --shout
```

## API

### formatGreeting(name, shout)
Generates a formatted greeting string.

**Parameters:**
- `name` (string): Name to greet (default: "World")
- `shout` (boolean): Whether to return uppercase greeting (default: false)

**Returns:** Formatted greeting string

### generateGreeting(name)
Generates a simple greeting string.

**Parameters:**
- `name` (string): Name to greet (default: "World")

**Returns:** Greeting string

## Testing

```bash
npm test
```

## License

MIT
