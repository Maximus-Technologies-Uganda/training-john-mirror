const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { getJoke, getJokeString, getAvailableCategories, getAvailableTypes } = require('./jokes-core.js');

/**
 * Enhanced Jokes CLI with modern command-line interface
 * Features:
 * - Category selection
 * - Joke type selection (single or twopart)
 * - Help system
 * - Error handling
 * - Validation
 */

// CLI configuration
function runCLI() {
    const argv = yargs(hideBin(process.argv))
        .usage('Usage: $0 [options]')
        .example('$0', 'Get a random joke')
        .example('$0 --category Programming', 'Get a programming joke')
        .example('$0 --category Dark --type single', 'Get a single-line dark joke')
        .example('$0 --categories', 'List available categories')
        .example('$0 --types', 'List available joke types')
        .option('category', {
            type: 'string',
            description: 'Joke category',
            choices: getAvailableCategories(),
            default: 'Any'
        })
        .option('type', {
            type: 'string',
            description: 'Joke type (single or twopart)',
            choices: getAvailableTypes(),
            default: 'twopart'
        })
        .option('categories', {
            type: 'boolean',
            description: 'List available joke categories',
            default: false
        })
        .option('types', {
            type: 'boolean',
            description: 'List available joke types',
            default: false
        })
        .help('h')
        .alias('h', 'help')
        .strict()
        .argv;

    // Handle special commands
    if (argv.categories) {
        console.log('Available joke categories:');
        getAvailableCategories().forEach(category => {
            console.log(`  - ${category}`);
        });
        return;
    }

    if (argv.types) {
        console.log('Available joke types:');
        getAvailableTypes().forEach(type => {
            console.log(`  - ${type}`);
        });
        return;
    }

    // Main joke fetching logic
    (async () => {
        try {
            console.log(`Fetching a ${argv.type} joke from the '${argv.category}' category...`);
            
            const joke = await getJoke(argv.category, argv.type);
            
            console.log('\n' + '='.repeat(50));
            console.log(joke.formatted);
            console.log('='.repeat(50));
            
            if (joke.category !== argv.category && argv.category !== 'Any') {
                console.log(`\nNote: Joke is from '${joke.category}' category (closest match to '${argv.category}')`);
            }
            
        } catch (error) {
            console.error(`\nError: ${error.message}`);
            
            // Provide helpful suggestions
            if (error.message.includes('Invalid category')) {
                console.log('\nAvailable categories:');
                getAvailableCategories().forEach(category => {
                    console.log(`  - ${category}`);
                });
            } else if (error.message.includes('Invalid type')) {
                console.log('\nAvailable types:');
                getAvailableTypes().forEach(type => {
                    console.log(`  - ${type}`);
                });
            } else if (error.message.includes('Network error')) {
                console.log('\nTroubleshooting:');
                console.log('  - Check your internet connection');
                console.log('  - Try again in a few moments');
                console.log('  - The joke API might be temporarily unavailable');
            }
            
            process.exit(1);
        }
    })();
}

// Export for testing
module.exports = { runCLI };

// Only run CLI if this file is executed directly
if (require.main === module) {
    runCLI();
}
