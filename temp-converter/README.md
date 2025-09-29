# Temperature Converter CLI

A command-line interface for converting temperatures between Celsius and Fahrenheit using `--from` and `--to` flags.

## Features

- Convert between Celsius and Fahrenheit
- Uses `--from` and `--to` flags for clear interface
- Input validation with proper error messages
- Precise calculations with rounding
- Non-zero exit codes on errors

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```bash
# Convert Celsius to Fahrenheit
node src/temp-converter.js 0 --from C --to F

# Convert Fahrenheit to Celsius
node src/temp-converter.js 32 --from F --to C

# Convert with decimal values
node src/temp-converter.js 25.5 --from C --to F
```

### Error Cases

```bash
# Missing temperature value
node src/temp-converter.js --from C --to F
# Error: Temperature value is required

# Missing --from flag
node src/temp-converter.js 0 --to F
# Error: --from flag is required

# Missing --to flag
node src/temp-converter.js 0 --from C
# Error: --to flag is required

# Invalid --from unit
node src/temp-converter.js 0 --from K --to F
# Error: Invalid --from unit 'K'. Must be 'C' or 'F'

# Invalid --to unit
node src/temp-converter.js 0 --from C --to K
# Error: Invalid --to unit 'K'. Must be 'C' or 'F'
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
