const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Core conversion function
function convertTemperature(value, fromUnit, toUnit) {
    // Input validation
    if (typeof value !== 'number' || isNaN(value)) {
        throw new Error('Value must be a valid number');
    }
    
    if (!fromUnit || !toUnit) {
        throw new Error('Both fromUnit and toUnit must be specified');
    }
    
    const upperFromUnit = fromUnit.toUpperCase();
    const upperToUnit = toUnit.toUpperCase();
    
    if (upperFromUnit === 'C' && upperToUnit === 'F') {
        // Celsius to Fahrenheit formula: (C * 9/5) + 32
        return Math.round(((value * 9/5) + 32) * 100) / 100; // Round to 2 decimal places
    } else if (upperFromUnit === 'F' && upperToUnit === 'C') {
        // Fahrenheit to Celsius formula: (F - 32) * 5/9
        return Math.round(((value - 32) * 5/9) * 100) / 100; // Round to 2 decimal places
    } else if (upperFromUnit === upperToUnit) {
        return value; // Same unit, no conversion needed
    } else {
        throw new Error(`Conversion from ${upperFromUnit} to ${upperToUnit} is not supported`);
    }
}

// Enhanced validation function
function validateTemperatureInput(value, fromUnit, toUnit) {
    const errors = [];
    
    // Validate value
    if (value === undefined || value === null || value === '') {
        errors.push('Temperature value is required');
    } else if (isNaN(parseFloat(value))) {
        errors.push('Temperature value must be a valid number');
    } else if (parseFloat(value) < -273.15 && fromUnit.toUpperCase() === 'C') {
        errors.push('Temperature cannot be below absolute zero (-273.15°C)');
    } else if (parseFloat(value) < -459.67 && fromUnit.toUpperCase() === 'F') {
        errors.push('Temperature cannot be below absolute zero (-459.67°F)');
    }
    
    // Validate from unit
    if (!fromUnit || typeof fromUnit !== 'string') {
        errors.push('Source unit (--from) is required');
    } else if (!['C', 'F', 'c', 'f'].includes(fromUnit)) {
        errors.push('Source unit must be C or F');
    }
    
    // Validate to unit
    if (!toUnit || typeof toUnit !== 'string') {
        errors.push('Target unit (--to) is required');
    } else if (!['C', 'F', 'c', 'f'].includes(toUnit)) {
        errors.push('Target unit must be C or F');
    }
    
    // Check if units are the same
    if (fromUnit && toUnit && fromUnit.toUpperCase() === toUnit.toUpperCase()) {
        errors.push('Source and target units cannot be the same');
    }
    
    return errors;
}

// CLI functionality
function runCLI() {
    const argv = yargs(hideBin(process.argv))
        .usage('Usage: $0 --value <number> --from <unit> --to <unit>')
        .example('$0 --value 0 --from C --to F', 'Convert 0°C to Fahrenheit')
        .example('$0 --value 32 --from F --to C', 'Convert 32°F to Celsius')
        .option('value', {
            type: 'number',
            description: 'Temperature value to convert',
            demandOption: true
        })
        .option('from', {
            type: 'string',
            description: 'Source temperature unit (C or F)',
            choices: ['C', 'F', 'c', 'f'],
            demandOption: true
        })
        .option('to', {
            type: 'string',
            description: 'Target temperature unit (C or F)',
            choices: ['C', 'F', 'c', 'f'],
            demandOption: true
        })
        .help('h')
        .alias('h', 'help')
        .strict()
        .argv;

    // Validate inputs
    const validationErrors = validateTemperatureInput(argv.value, argv.from, argv.to);
    if (validationErrors.length > 0) {
        console.error('Validation errors:');
        validationErrors.forEach(error => console.error(`  - ${error}`));
        console.log('\nUsage: node temp-converter.js --value <number> --from <unit> --to <unit>');
        console.log('Example: node temp-converter.js --value 0 --from C --to F');
        process.exit(1);
    }

    try {
        const result = convertTemperature(argv.value, argv.from, argv.to);
        console.log(`${argv.value}°${argv.from.toUpperCase()} = ${result}°${argv.to.toUpperCase()}`);
    } catch (error) {
        console.error('Conversion error:', error.message);
        process.exit(1);
    }
}

// Export the function so the test file can use it
module.exports = { convertTemperature };

// Run CLI if this file is executed directly
if (require.main === module) {
    runCLI();
}