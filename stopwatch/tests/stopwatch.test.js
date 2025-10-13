import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
    createStopwatch,
    startStopwatch,
    stopStopwatch,
    formatElapsedTime,
    getStopwatchStatus,
    formatStopwatchOutput
} from '../src/stopwatch-core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('stopwatch-core', () => {
    let stopwatch;

    beforeEach(() => {
        stopwatch = createStopwatch();
    });

    describe('createStopwatch', () => {
        it('creates a new stopwatch with default values', () => {
            expect(stopwatch.startTime).toBeNull();
            expect(stopwatch.isRunning).toBe(false);
            expect(stopwatch.totalElapsed).toBe(0);
        });
    });

    describe('startStopwatch', () => {
        it('starts a new stopwatch', () => {
            const started = startStopwatch(stopwatch);
            expect(started.isRunning).toBe(true);
            expect(started.startTime).toBeGreaterThan(0);
            expect(started.totalElapsed).toBe(0);
        });

        it('throws error when starting an already running stopwatch', () => {
            const started = startStopwatch(stopwatch);
            expect(() => startStopwatch(started)).toThrow('Stopwatch is already running');
        });
    });

    describe('formatElapsedTime', () => {
        it('formats seconds correctly', () => {
            expect(formatElapsedTime(5000)).toBe('5s');
        });

        it('formats minutes and seconds correctly', () => {
            expect(formatElapsedTime(65000)).toBe('1m 5s');
        });

        it('formats hours, minutes and seconds correctly', () => {
            expect(formatElapsedTime(3665000)).toBe('1h 1m 5s');
        });

        it('handles zero time', () => {
            expect(formatElapsedTime(0)).toBe('0s');
        });
    });
});

describe('formatStopwatchOutput - Golden File Tests', () => {
    it('matches empty state golden file', () => {
        const stopwatch = createStopwatch();
        const status = getStopwatchStatus(stopwatch);
        const output = formatStopwatchOutput(status);
        
        const goldenContent = readFileSync(join(__dirname, '..', 'test', 'output-empty.golden.txt'), 'utf8').trim();
        expect(output).toBe(goldenContent);
    });

    it('matches normal running state golden file', () => {
        const now = Date.now();
        const runningBase = {
            startTime: now - 32000,
            isRunning: true,
            totalElapsed: 0
        };
        const runningStatus = getStopwatchStatus(runningBase);
        const output = formatStopwatchOutput(runningStatus);
        
        const goldenContent = readFileSync(join(__dirname, '..', 'test', 'output-normal.golden.txt'), 'utf8').trim().replace(/\r\n/g, '\n');
        expect(output).toBe(goldenContent);
    });

    it('matches stopped state golden file', () => {
        const now = Date.now();
        const base = {
            startTime: now - 48000,
            isRunning: true,
            totalElapsed: 0
        };
        const stopped = stopStopwatch(base);
        const stoppedStatus = getStopwatchStatus(stopped);
        const output = formatStopwatchOutput(stoppedStatus);
        
        const goldenContent = readFileSync(join(__dirname, '..', 'test', 'output-stopped.golden.txt'), 'utf8').trim().replace(/\r\n/g, '\n');
        expect(output).toBe(goldenContent);
    });
});
