import { describe, it, expect } from 'jest';
import {
    createStopwatch,
    startStopwatch,
    formatElapsedTime
} from '../src/stopwatch-core.js';

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
