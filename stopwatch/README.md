# Stopwatch CLI

A command-line stopwatch application with persistent state storage and lap time functionality.

## Features

- Start, stop, and reset stopwatch
- Lap time recording
- Persistent state storage
- Formatted time display (hours, minutes, seconds)
- Status checking

## Installation

```bash
npm install
```

## Usage

```bash
# Start the stopwatch
node src/stopwatch-core.js start

# Stop the stopwatch
node src/stopwatch-core.js stop

# Check current status
node src/stopwatch-core.js status

# Record a lap time
node src/stopwatch-core.js lap

# Reset the stopwatch
node src/stopwatch-core.js reset
```

## API

### Core Functions

#### createStopwatch()
Creates a new stopwatch state.

**Returns:** Object - Initial stopwatch state

#### startStopwatch(stopwatch)
Starts the stopwatch.

**Parameters:**
- `stopwatch` (Object): Current stopwatch state

**Returns:** Object - Updated stopwatch state

#### stopStopwatch(stopwatch)
Stops the stopwatch.

**Parameters:**
- `stopwatch` (Object): Current stopwatch state

**Returns:** Object - Updated stopwatch state with total elapsed time

#### getElapsedTime(stopwatch)
Gets the current elapsed time.

**Parameters:**
- `stopwatch` (Object): Current stopwatch state

**Returns:** number - Elapsed time in milliseconds

#### resetStopwatch(stopwatch)
Resets the stopwatch.

**Parameters:**
- `stopwatch` (Object): Current stopwatch state

**Returns:** Object - Reset stopwatch state

#### formatElapsedTime(milliseconds)
Formats elapsed time in a human-readable format.

**Parameters:**
- `milliseconds` (number): Time in milliseconds

**Returns:** string - Formatted time string

#### getStopwatchStatus(stopwatch)
Gets the current status of the stopwatch.

**Parameters:**
- `stopwatch` (Object): Current stopwatch state

**Returns:** Object - Status information

## Testing

```bash
npm test
```

## License

MIT
