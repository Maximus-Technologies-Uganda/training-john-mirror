# Jokes CLI

A command-line interface for fetching random jokes from the JokeAPI with support for different categories and types.

## Features

- Fetch random jokes from various categories
- Support for single and two-part jokes
- Category filtering (Programming, Misc, Dark, Pun, Spooky, Christmas)
- Error handling and validation
- CLI interface with yargs

## Installation

```bash
npm install
```

## Usage

```bash
# Get a random joke
node src/joke.js

# Get a joke from a specific category
node src/joke.js --category Programming

# Available categories: Any, Programming, Misc, Dark, Pun, Spooky, Christmas
node src/joke.js --category Dark
```

## API

### getJoke(category, type)
Fetches a random joke from the API.

**Parameters:**
- `category` (string): Joke category (default: 'Any')
- `type` (string): Joke type - 'single' or 'twopart' (default: 'single')

**Returns:** Promise<Object> - Joke object with setup, punchline, and metadata

### getJokeString(category)
Gets a formatted joke string (backward compatibility).

**Parameters:**
- `category` (string): Joke category (default: 'Any')

**Returns:** Promise<string> - Formatted joke string

### getAvailableCategories()
Returns array of available joke categories.

**Returns:** Array<string> - Available categories

### getAvailableTypes()
Returns array of available joke types.

**Returns:** Array<string> - Available types

## Testing

```bash
npm test
```

## License

MIT
