import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import { fileURLToPath } from 'url';
import * as stopwatchCore from './stopwatch-core.js';
import { createStopwatchStorage } from './stopwatch-storage.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Only execute main logic if this file is run directly
if (import.meta.url.endsWith('stopwatch.js')) {
    // Main logic
    switch (command) {
    case 'start':
        try {
            const stopwatch = storage.load();
            const updatedStopwatch = stopwatchCore.startStopwatch(stopwatch);
            storage.save(updatedStopwatch);
            console.log('Stopwatch started at', new Date(updatedStopwatch.startTime).toLocaleTimeString());
        } catch (error) {
            console.error('Error starting stopwatch:', error.message);
        }
        break;

    case 'lap':
        try {
            const stopwatch = storage.load();
            const status = stopwatchCore.getStopwatchStatus(stopwatch);
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
            const updatedStopwatch = stopwatchCore.stopStopwatch(stopwatch);
            storage.save(updatedStopwatch);
            const status = stopwatchCore.getStopwatchStatus(updatedStopwatch);
            console.log(`Stopwatch stopped. Total elapsed time: ${status.formattedTime}`);
        } catch (error) {
            console.log('Error stopping stopwatch:', error.message);
        }
        break;

    case 'status':
        try {
            const stopwatch = storage.load();
            const status = stopwatchCore.getStopwatchStatus(stopwatch);
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
            const resetStopwatch = stopwatchCore.resetStopwatch(stopwatch);
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
}