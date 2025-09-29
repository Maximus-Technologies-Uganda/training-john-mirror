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

// CLI functionality with --from and --to flags
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    

    // Parse command line arguments
    let value = null;
    let fromUnit = null;
    let toUnit = null;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--from' && i + 1 < args.length) {
            fromUnit = args[i + 1];
            i++; // Skip next argument
        } else if (args[i] === '--to' && i + 1 < args.length) {
            toUnit = args[i + 1];
            i++; // Skip next argument
        } else if (!isNaN(parseFloat(args[i])) && value === null) {
            value = parseFloat(args[i]);
        }
    }
    
    // Validate required arguments
    if (value === null) {
        console.error('Error: Temperature value is required');
        console.error('Usage: node temp-converter.js <value> --from <C|F> --to <C|F>');
        console.error('Example: node temp-converter.js 0 --from C --to F');
        process.exit(1);
    }
    
    if (!fromUnit) {
        console.error('Error: --from flag is required');
        console.error('Usage: node temp-converter.js <value> --from <C|F> --to <C|F>');
        console.error('Example: node temp-converter.js 0 --from C --to F');
        process.exit(1);
    }
    
    if (!toUnit) {
        console.error('Error: --to flag is required');
        console.error('Usage: node temp-converter.js <value> --from <C|F> --to <C|F>');
        console.error('Example: node temp-converter.js 0 --from C --to F');
        process.exit(1);
    }
    
    // Validate units
    if (fromUnit !== 'C' && fromUnit !== 'F') {
        console.error(`Error: Invalid --from unit '${fromUnit}'. Must be 'C' or 'F'`);
        process.exit(1);
    }
    
    if (toUnit !== 'C' && toUnit !== 'F') {
        console.error(`Error: Invalid --to unit '${toUnit}'. Must be 'C' or 'F'`);
        process.exit(1);
    }

    try {
        const result = convertTemperature(value, fromUnit, toUnit);
        console.log(`${value}°${fromUnit} = ${result}°${toUnit}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
