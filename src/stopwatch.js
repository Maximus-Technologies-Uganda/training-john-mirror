#!/usr/bin/env node

/**
 * Stopwatch CLI Tool
 * A command-line stopwatch application
 */

// import fs from 'fs'; // Unused import
import path from 'path';
import {
    startStopwatch,
    stopStopwatch,
    getElapsedTime,
    resetStopwatch,
    formatElapsedTime,
    getStopwatchStatus
} from './stopwatch-core.js';
import { createStopwatchStorage } from './stopwatch-storage.js';
import { formatStopwatchData } from './exporter.js';

// Default storage path
const defaultTimeFile = path.join(process.cwd(), 'data/time.json');


// Main CLI logic
function main() {
    const args = process.argv.slice(2);
    
    // Parse --storage flag
    let storagePath = defaultTimeFile;
    let commandIndex = 0;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--storage' && i + 1 < args.length) {
            storagePath = args[i + 1];
            commandIndex = i + 2;
            break;
        }
    }
    
    const command = args[commandIndex];

    if (!command) {
        console.log('Usage: node stopwatch.js [--storage <path>] <command>');
        console.log('Commands:');
        console.log('  start   - Start the stopwatch');
        console.log('  stop    - Stop the stopwatch');
        console.log('  status  - Show current status');
        console.log('  lap     - Record a lap time');
        console.log('  reset   - Reset the stopwatch');
        console.log('Options:');
        console.log('  --storage <path> - Specify storage file path');
        return;
    }

    // Create storage manager
    const storage = createStopwatchStorage(storagePath);
    let stopwatch = storage.load();

    try {
        switch (command) {
            case 'start':
                if (stopwatch.isRunning) {
                    console.log('Stopwatch is already running. Use "status" to view elapsed time.');
                    return;
                }
                stopwatch = startStopwatch(stopwatch);
                storage.save(stopwatch);
                console.log(`Stopwatch started at ${new Date().toLocaleTimeString()}`);
                break;

            case 'stop':
                if (!stopwatch.isRunning) {
                    console.log('Stopwatch has not been started. Use "start" to begin.');
                    return;
                }
                stopwatch = stopStopwatch(stopwatch);
                storage.save(stopwatch);
                console.log('Stopwatch stopped');
                break;

            case 'status':
                const status = getStopwatchStatus(stopwatch);
                console.log(formatStopwatchData(status));
                break;

            case 'lap':
                if (!stopwatch.isRunning) {
                    console.log('Stopwatch has not been started. Use "start" to begin.');
                    return;
                }
                const elapsed = getElapsedTime(stopwatch);
                console.log(`Lap time: ${formatElapsedTime(elapsed)}`);
                break;

            case 'reset':
                stopwatch = resetStopwatch(stopwatch);
                storage.save(stopwatch);
                console.log('Stopwatch reset');
                break;

            default:
                console.log('Usage: node stopwatch.js [--storage <path>] <command>');
                console.log('Commands:');
                console.log('  start   - Start the stopwatch');
                console.log('  stop    - Stop the stopwatch');
                console.log('  status  - Show current status');
                console.log('  lap     - Record a lap time');
                console.log('  reset   - Reset the stopwatch');
                console.log('Options:');
                console.log('  --storage <path> - Specify storage file path');
                break;
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

// Run the CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('stopwatch.js')) {
    main();
}
