#!/usr/bin/env node

/**
 * Stopwatch CLI Tool
 * A command-line stopwatch application
 */

import fs from 'fs';
import path from 'path';
import {
    createStopwatch,
    startStopwatch,
    stopStopwatch,
    getElapsedTime,
    resetStopwatch,
    formatElapsedTime,
    getStopwatchStatus
} from './stopwatch-core.js';

const timeFile = path.join(process.cwd(), 'data/time.json');

// Helper function to load stopwatch state
function loadStopwatchState() {
    try {
        if (fs.existsSync(timeFile)) {
            const data = JSON.parse(fs.readFileSync(timeFile, 'utf8'));
            return {
                startTime: data.startTime,
                isRunning: data.isRunning || false,
                totalElapsed: data.totalElapsed || 0
            };
        }
    } catch (error) {
        console.error('Error loading stopwatch state:', error.message);
    }
    return createStopwatch();
}

// Helper function to save stopwatch state
function saveStopwatchState(stopwatch) {
    try {
        const dataDir = path.dirname(timeFile);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const data = {
            startTime: stopwatch.startTime,
            isRunning: stopwatch.isRunning,
            totalElapsed: stopwatch.totalElapsed
        };
        
        fs.writeFileSync(timeFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving stopwatch state:', error.message);
    }
}

// Main CLI logic
function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
        console.log('Usage: node stopwatch.js <command>');
        console.log('Commands:');
        console.log('  start   - Start the stopwatch');
        console.log('  stop    - Stop the stopwatch');
        console.log('  status  - Show current status');
        console.log('  lap     - Record a lap time');
        console.log('  reset   - Reset the stopwatch');
        return;
    }

    let stopwatch = loadStopwatchState();

    try {
        switch (command) {
            case 'start':
                if (stopwatch.isRunning) {
                    console.log('Stopwatch is already running');
                    return;
                }
                stopwatch = startStopwatch(stopwatch);
                saveStopwatchState(stopwatch);
                console.log(`Stopwatch started at ${new Date().toLocaleTimeString()}`);
                break;

            case 'stop':
                if (!stopwatch.isRunning) {
                    console.log('Stopwatch has not been started');
                    return;
                }
                stopwatch = stopStopwatch(stopwatch);
                saveStopwatchState(stopwatch);
                console.log('Stopwatch stopped');
                break;

            case 'status':
                const status = getStopwatchStatus(stopwatch);
                if (status.isRunning) {
                    console.log('Stopwatch is running');
                    console.log(`Elapsed time: ${status.formattedTime}`);
                } else {
                    console.log('Stopwatch is not running');
                    if (status.elapsedTime > 0) {
                        console.log(`Total elapsed time: ${status.formattedTime}`);
                    }
                }
                break;

            case 'lap':
                if (!stopwatch.isRunning) {
                    console.log('Stopwatch has not been started');
                    return;
                }
                const elapsed = getElapsedTime(stopwatch);
                console.log(`Lap time: ${formatElapsedTime(elapsed)}`);
                break;

            case 'reset':
                stopwatch = resetStopwatch(stopwatch);
                saveStopwatchState(stopwatch);
                console.log('Stopwatch reset');
                break;

            default:
                console.log('Usage: node stopwatch.js <command>');
                console.log('Commands:');
                console.log('  start   - Start the stopwatch');
                console.log('  stop    - Stop the stopwatch');
                console.log('  status  - Show current status');
                console.log('  lap     - Record a lap time');
                console.log('  reset   - Reset the stopwatch');
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
