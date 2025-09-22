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

// CLI functionality
function runCLI() {
    const argv = yargs(hideBin(process.argv))
        .usage('Usage: $0 <value> <from-unit> <to-unit>')
        .example('$0 0 C F', 'Convert 0°C to Fahrenheit')
        .example('$0 32 F C', 'Convert 32°F to Celsius')
        .option('value', {
            type: 'number',
            description: 'Temperature value to convert'
        })
        .option('from', {
            type: 'string',
            description: 'Source temperature unit (C or F)'
        })
        .option('to', {
            type: 'string',
            description: 'Target temperature unit (C or F)'
        })
        .help('h')
        .alias('h', 'help')
        .argv;

    // Get arguments from positional parameters
    const value = argv._[0];
    const fromUnit = argv._[1];
    const toUnit = argv._[2];

    // Validate inputs
    if (value === undefined || fromUnit === undefined || toUnit === undefined) {
        console.error('Error: Missing required arguments');
        console.log('Usage: node temp-converter.js <value> <from-unit> <to-unit>');
        console.log('Example: node temp-converter.js 0 C F');
        process.exit(1);
    }

    try {
        const result = convertTemperature(parseFloat(value), fromUnit, toUnit);
        console.log(`${value}°${fromUnit.toUpperCase()} = ${result}°${toUnit.toUpperCase()}`);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Export the function so the test file can use it
module.exports = { convertTemperature };

// Run CLI if this file is executed directly
if (require.main === module) {
    runCLI();
}