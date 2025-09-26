# Temperature Converter CLI

A command-line interface for converting temperatures between Celsius and Fahrenheit.

## Features

- Convert between Celsius and Fahrenheit
- Input validation
- Precise calculations with rounding
- CLI interface with error handling

## Installation

```bash
npm install
```

## Usage

```bash
# Convert Celsius to Fahrenheit
node src/temp-converter.js 0 C F

# Convert Fahrenheit to Celsius
node src/temp-converter.js 32 F C

# Convert with decimal values
node src/temp-converter.js 25.5 C F
```

## API

### convertTemperature(value, fromUnit, toUnit)
Converts temperature from one unit to another.

**Parameters:**
- `value` (number): Temperature value to convert
- `fromUnit` (string): Unit to convert from ('C' or 'F')
- `toUnit` (string): Unit to convert to ('C' or 'F')

**Returns:** number - Converted temperature (rounded to 2 decimal places)

**Throws:** Error if parameters are invalid

## Examples

```javascript
import { convertTemperature } from './src/temp-converter.js';

// Convert 0°C to Fahrenheit
const result = convertTemperature(0, 'C', 'F');
console.log(result); // 32

// Convert 100°F to Celsius
const result2 = convertTemperature(100, 'F', 'C');
console.log(result2); // 37.78
```

## Testing

```bash
npm test
```

## License

MIT
