# Temperature Converter CLI

A command-line interface for converting temperatures between Celsius and Fahrenheit with comprehensive validation and error handling.

## Features

- Convert between Celsius and Fahrenheit
- Comprehensive input validation with clear error messages
- Handles lowercase units (c, f) and whitespace
- Rejects identical units (C→C, F→F)
- Precise calculations with 2-decimal-place rounding
- Non-zero exit codes on all validation failures
- Pure function architecture with thin CLI wrapper

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```bash
# Convert Celsius to Fahrenheit
node src/temp-converter.js 0 C F

# Convert Fahrenheit to Celsius  
node src/temp-converter.js 32 F C

# Convert with decimal values
node src/temp-converter.js 25.5 C F

# Handle lowercase units
node src/temp-converter.js 100 c f

# Handle whitespace
node src/temp-converter.js " 0 " " C " " F "
```

### Error Cases

```bash
# Missing arguments
node src/temp-converter.js
# Error: Missing required arguments
# Usage: node temp-converter.js <value> <fromUnit> <toUnit>
# Example: node temp-converter.js 0 C F
# Supported units: C (Celsius), F (Fahrenheit)

# Identical units (not allowed)
node src/temp-converter.js 0 C C
# Error: Cannot convert from C to C (identical units)

# Invalid units
node src/temp-converter.js 0 K F
# Error: Invalid unit 'K'. Must be 'C' or 'F'

# Non-numeric values
node src/temp-converter.js abc C F
# Error: Temperature must be a valid number

# Insufficient arguments
node src/temp-converter.js 0
# Error: Missing required arguments
```

## API

### Pure Functions

#### celsiusToFahrenheit(celsius)
Converts Celsius to Fahrenheit.

**Parameters:**
- `celsius` (number): Temperature in Celsius

**Returns:** number - Temperature in Fahrenheit (rounded to 2 decimal places)

#### fahrenheitToCelsius(fahrenheit)
Converts Fahrenheit to Celsius.

**Parameters:**
- `fahrenheit` (number): Temperature in Fahrenheit

**Returns:** number - Temperature in Celsius (rounded to 2 decimal places)

#### convertTemperature(value, fromUnit, toUnit)
Converts temperature from one unit to another with comprehensive validation.

**Parameters:**
- `value` (any): Temperature value to convert (will be validated)
- `fromUnit` (string): Unit to convert from ('C' or 'F', case-insensitive)
- `toUnit` (string): Unit to convert to ('C' or 'F', case-insensitive)

**Returns:** number - Converted temperature (rounded to 2 decimal places)

**Throws:** Error if parameters are invalid:
- Identical units (C→C, F→F)
- Invalid units (not 'C' or 'F')
- Non-numeric values
- Missing parameters

### Validation Functions

#### validateUnit(unit)
Validates and normalizes temperature units.

#### validateTemperature(value)
Validates temperature values.

#### validateDifferentUnits(fromUnit, toUnit)
Ensures units are different.

## Examples

### CLI Usage

```bash
# Successful conversions
node src/temp-converter.js 0 C F
# Output: 0°C = 32°F

node src/temp-converter.js 32 F C  
# Output: 32°F = 0°C

node src/temp-converter.js 25.5 c f
# Output: 25.5°c = 77.9°f
```

### Programmatic Usage

```javascript
import { 
  convertTemperature, 
  celsiusToFahrenheit, 
  fahrenheitToCelsius 
} from './src/temp-converter.js';

// Using pure functions
const result1 = celsiusToFahrenheit(0);
console.log(result1); // 32

const result2 = fahrenheitToCelsius(32);
console.log(result2); // 0

// Using main conversion function
const result3 = convertTemperature(100, 'F', 'C');
console.log(result3); // 37.78

// Error handling
try {
  convertTemperature(0, 'C', 'C');
} catch (error) {
  console.error(error.message); // Cannot convert from C to C (identical units)
}
```

## Validation Features

The temperature converter includes comprehensive validation:

### Input Validation
- **Numeric Values**: Only valid numbers accepted (rejects strings, NaN, etc.)
- **Unit Validation**: Only 'C' and 'F' units supported (case-insensitive)
- **Identical Units**: Rejects conversions like C→C or F→F
- **Whitespace Handling**: Automatically trims whitespace from inputs
- **Case Insensitive**: Accepts 'c', 'f', 'C', 'F' (all normalized)

### Error Handling
- **Exit Codes**: All validation failures exit with code 1
- **Clear Messages**: Descriptive error messages for each failure type
- **Usage Help**: Shows usage information on argument errors

### Rounding Strategy
All temperatures are rounded to 2 decimal places for precision while maintaining readability.

## Testing

The project includes comprehensive table-driven tests covering all validation scenarios:

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- tests/unit/temp-converter.test.js
npm test -- tests/unit/temp-converter-table-driven.test.js
```

### Test Coverage
- ✅ Valid conversions (C→F, F→C)
- ✅ Error cases with proper exit codes
- ✅ Lowercase unit handling
- ✅ Whitespace handling
- ✅ Edge cases (very small/large numbers)
- ✅ Pure function validation
- ✅ CLI integration tests

## Architecture

The temperature converter follows a clean architecture pattern:

- **Pure Functions**: `celsiusToFahrenheit()` and `fahrenheitToCelsius()` contain only business logic
- **Thin CLI Wrapper**: Handles argument parsing and output formatting
- **Comprehensive Validation**: Separate validation functions for each concern
- **Separation of Concerns**: Business logic separated from CLI concerns

## License

MIT
