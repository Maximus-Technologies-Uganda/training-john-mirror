const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const { 
    startStopwatch, 
    stopStopwatch, 
    getElapsedTime, 
    resetStopwatch, 
    getStopwatchStatus 
} = require('./stopwatch-core.js');
const { createStopwatchStorage } = require('./stopwatch-storage.js');

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
    .option('storage', {
        type: 'string',
        default: path.join(__dirname, '../data/time.json'),
        description: 'Path to storage file for stopwatch state'
    })
    .help('h')
    .alias('h', 'help')
    .usage('Usage: $0 <command> [options]')
    .example('$0 start', 'Start the stopwatch')
    .example('$0 start --storage /custom/path.json', 'Start with custom storage path')
    .argv;

const command = argv._[0];
const storagePath = argv.storage;

// Create storage manager
const storage = createStopwatchStorage(storagePath);

// Main logic
switch (command) {
    case 'start':
        try {
            const stopwatch = storage.load();
            const updatedStopwatch = startStopwatch(stopwatch);
            storage.save(updatedStopwatch);
            console.log('Stopwatch started at', new Date(updatedStopwatch.startTime).toLocaleTimeString());
        } catch (error) {
            console.error('Error starting stopwatch:', error.message);
        }
        break;

    case 'lap':
        try {
            const stopwatch = storage.load();
            const status = getStopwatchStatus(stopwatch);
            if (status.isRunning) {
                console.log(`Lap time: ${status.formattedTime}`);
            } else {
                console.log('Stopwatch has not been started. Use the "start" command first.');
            }
        } catch (error) {
            console.error('Error getting lap time:', error.message);
        }
        break;

    case 'stop':
        try {
            const stopwatch = storage.load();
            const updatedStopwatch = stopStopwatch(stopwatch);
            storage.save(updatedStopwatch);
            const status = getStopwatchStatus(updatedStopwatch);
            console.log(`Stopwatch stopped. Total elapsed time: ${status.formattedTime}`);
        } catch (error) {
            console.error('Error stopping stopwatch:', error.message);
        }
        break;

    case 'status':
        try {
            const stopwatch = storage.load();
            const status = getStopwatchStatus(stopwatch);
            if (status.isRunning) {
                console.log(`Stopwatch is running. Elapsed time: ${status.formattedTime}`);
            } else {
                console.log('Stopwatch is not running.');
            }
        } catch (error) {
            console.error('Error getting status:', error.message);
        }
        break;

    case 'reset':
        try {
            const stopwatch = storage.load();
            const resetStopwatch = resetStopwatch(stopwatch);
            storage.save(resetStopwatch);
            console.log('Stopwatch reset.');
        } catch (error) {
            console.error('Error resetting stopwatch:', error.message);
        }
        break;

    default:
        console.log('Usage: node stopwatch.js <command> [options]');
        console.log('Commands:');
        console.log('  start  - Start the stopwatch');
        console.log('  lap    - Show current elapsed time');
        console.log('  stop   - Stop the stopwatch and show total time');
        console.log('  status - Show current status and elapsed time');
        console.log('  reset  - Reset the stopwatch');
        console.log('');
        console.log('Options:');
        console.log('  --storage <path>  - Specify custom storage file path');
        console.log('  --help            - Show this help message');
        break;
}