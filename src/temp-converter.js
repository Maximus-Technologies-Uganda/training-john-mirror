/**
 * Temperature Converter Module
 * Pure functions for temperature conversion with thin CLI wrapper
 * 
 * Rounding Strategy: All temperatures are rounded to 2 decimal places for precision
 * while maintaining readability. This provides sufficient accuracy for most use cases
 * without excessive decimal places.
 */

/**
 * Validates and normalizes temperature units
 * @param {string} unit - The unit to validate ('C' or 'F')
 * @returns {string} Normalized unit (uppercase)
 * @throws {Error} If unit is invalid
 */
export function validateUnit(unit) {
    if (!unit || typeof unit !== 'string') {
        throw new Error('Unit must be a non-empty string');
    }
    
    const normalized = unit.trim().toUpperCase();
    
    if (normalized !== 'C' && normalized !== 'F') {
        throw new Error(`Invalid unit '${unit}'. Must be 'C' or 'F'`);
    }
    
    return normalized;
}

/**
 * Validates temperature value
 * @param {any} value - The value to validate
 * @returns {number} Validated numeric value
 * @throws {Error} If value is invalid
 */
export function validateTemperature(value) {
    if (value === null || value === undefined) {
        throw new Error('Temperature value is required');
    }
    
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
        throw new Error('Temperature must be a valid number');
    }
    
    return numValue;
}

/**
 * Validates that units are different
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @throws {Error} If units are identical
 */
export function validateDifferentUnits(fromUnit, toUnit) {
    if (fromUnit === toUnit) {
        throw new Error(`Cannot convert from ${fromUnit} to ${toUnit} (identical units)`);
    }
}

/**
 * Converts Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit (rounded to 2 decimal places)
 */
export function celsiusToFahrenheit(celsius) {
    return Math.round(((celsius * 9/5) + 32) * 100) / 100;
}

/**
 * Converts Fahrenheit to Celsius
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} Temperature in Celsius (rounded to 2 decimal places)
 */
export function fahrenheitToCelsius(fahrenheit) {
    return Math.round(((fahrenheit - 32) * 5/9) * 100) / 100;
}

/**
 * Converts temperature from one unit to another with comprehensive validation
 * @param {any} value - The temperature value to convert
 * @param {string} fromUnit - The unit to convert from ('C' or 'F')
 * @param {string} toUnit - The unit to convert to ('C' or 'F')
 * @returns {number} The converted temperature
 * @throws {Error} If parameters are invalid
 */
export function convertTemperature(value, fromUnit, toUnit) {
    // Validate and normalize all inputs
    const validatedValue = validateTemperature(value);
    const validatedFromUnit = validateUnit(fromUnit);
    const validatedToUnit = validateUnit(toUnit);
    
    // Ensure units are different
    validateDifferentUnits(validatedFromUnit, validatedToUnit);

    // Use pure functions for conversion
    if (validatedFromUnit === 'C' && validatedToUnit === 'F') {
        return celsiusToFahrenheit(validatedValue);
    } else if (validatedFromUnit === 'F' && validatedToUnit === 'C') {
        return fahrenheitToCelsius(validatedValue);
    }
}

/**
 * Thin CLI wrapper - handles parsing input and printing output with comprehensive validation
 */
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('temp-converter.js')) {
    const args = process.argv.slice(2);
    
    // Parse command line arguments
    if (args.length < 3) {
        console.error('Error: Missing required arguments');
        console.error('Usage: node temp-converter.js <value> <fromUnit> <toUnit>');
        console.error('Example: node temp-converter.js 0 C F');
        console.error('Supported units: C (Celsius), F (Fahrenheit)');
        process.exit(1);
    }

    const value = args[0];
    const fromUnit = args[1];
    const toUnit = args[2];

    // Call pure function with comprehensive validation
    try {
        const result = convertTemperature(value, fromUnit, toUnit);
        console.log(`${value}°${fromUnit} = ${result}°${toUnit}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
