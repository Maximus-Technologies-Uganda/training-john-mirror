/**
 * Temperature Converter Module
 * Converts temperatures between Celsius and Fahrenheit
 */

/**
 * Converts temperature from one unit to another
 * @param {number} value - The temperature value to convert
 * @param {string} fromUnit - The unit to convert from ('C' or 'F')
 * @param {string} toUnit - The unit to convert to ('C' or 'F')
 * @returns {number} The converted temperature
 * @throws {Error} If parameters are invalid
 */
export function convertTemperature(value, fromUnit, toUnit) {
    // Validate input value
    if (typeof value !== 'number' || isNaN(value)) {
        throw new Error('Value must be a valid number');
    }

    // Validate units
    if (!fromUnit || !toUnit) {
        throw new Error('Both fromUnit and toUnit must be specified');
    }

    // Normalize units to uppercase
    const from = fromUnit.toUpperCase();
    const to = toUnit.toUpperCase();

    // Check if conversion is supported
    if ((from !== 'C' && from !== 'F') || (to !== 'C' && to !== 'F')) {
        throw new Error(`Conversion from ${from} to ${to} is not supported`);
    }

    // If same unit, return original value
    if (from === to) {
        return value;
    }

    let result;
    if (from === 'C' && to === 'F') {
        // Celsius to Fahrenheit: F = (C * 9/5) + 32
        result = (value * 9/5) + 32;
    } else if (from === 'F' && to === 'C') {
        // Fahrenheit to Celsius: C = (F - 32) * 5/9
        result = (value - 32) * 5/9;
    }

    // Round to 2 decimal places
    return Math.round(result * 100) / 100;
}

// CLI functionality
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.error('Missing required arguments');
        console.error('Usage: node temp-converter.js <value> <fromUnit> <toUnit>');
        console.error('Example: node temp-converter.js 0 C F');
        process.exit(1);
    }

    const value = parseFloat(args[0]);
    const fromUnit = args[1];
    const toUnit = args[2];

    try {
        const result = convertTemperature(value, fromUnit, toUnit);
        console.log(`${value}°${fromUnit} = ${result}°${toUnit}`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}
