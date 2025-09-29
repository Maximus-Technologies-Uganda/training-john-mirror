/* eslint-env jest */
import { describe, it, expect, beforeEach } from 'vitest';
import {
    createStopwatch,
    startStopwatch,
    stopStopwatch,
    getElapsedTime,
    resetStopwatch,
    formatElapsedTime,
    getStopwatchStatus
} from '../../src/stopwatch-core.js';

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

    describe('stopStopwatch', () => {
        it('stops a running stopwatch', async () => {
            const started = startStopwatch(stopwatch);
            // Add small delay to ensure measurable elapsed time
            // eslint-disable-next-line no-undef
            await new Promise(resolve => setTimeout(resolve, 10));
            const stopped = stopStopwatch(started);
            
            expect(stopped.isRunning).toBe(false);
            expect(stopped.startTime).toBeNull();
            expect(stopped.totalElapsed).toBeGreaterThan(0);
        });

        it('throws error when stopping a non-running stopwatch', () => {
            expect(() => stopStopwatch(stopwatch)).toThrow('Stopwatch has not been started');
        });

        it('accumulates elapsed time correctly', async () => {
            const started = startStopwatch(stopwatch);
            // Add small delay to ensure measurable elapsed time
            // eslint-disable-next-line no-undef
            await new Promise(resolve => setTimeout(resolve, 10));
            const stopped = stopStopwatch(started);
            const totalElapsed = stopped.totalElapsed;
            
            // Start again and stop
            const started2 = startStopwatch(stopped);
            // Add small delay to ensure measurable elapsed time
            // eslint-disable-next-line no-undef
            await new Promise(resolve => setTimeout(resolve, 10));
            const stopped2 = stopStopwatch(started2);
            
            expect(stopped2.totalElapsed).toBeGreaterThan(totalElapsed);
        });
    });

    describe('getElapsedTime', () => {
        it('returns total elapsed time when not running', () => {
            const started = startStopwatch(stopwatch);
            const stopped = stopStopwatch(started);
            
            expect(getElapsedTime(stopped)).toBe(stopped.totalElapsed);
        });

        it('returns current elapsed time when running', async () => {
            const started = startStopwatch(stopwatch);
            // Add small delay to ensure measurable elapsed time
            // eslint-disable-next-line no-undef
            await new Promise(resolve => setTimeout(resolve, 10));
            const elapsed = getElapsedTime(started);
            
            expect(elapsed).toBeGreaterThan(0);
        });
    });

    describe('resetStopwatch', () => {
        it('resets stopwatch to initial state', () => {
            const started = startStopwatch(stopwatch);
            const stopped = stopStopwatch(started);
            const reset = resetStopwatch(stopped);
            
            expect(reset.startTime).toBeNull();
            expect(reset.isRunning).toBe(false);
            expect(reset.totalElapsed).toBe(0);
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

        it('handles large time values', () => {
            expect(formatElapsedTime(3600000)).toBe('1h 0m 0s');
        });
    });

    describe('getStopwatchStatus', () => {
        it('returns correct status for new stopwatch', () => {
            const status = getStopwatchStatus(stopwatch);
            expect(status.isRunning).toBe(false);
            expect(status.elapsedTime).toBe(0);
            expect(status.formattedTime).toBe('0s');
        });

        it('returns correct status for running stopwatch', async () => {
            const started = startStopwatch(stopwatch);
            // Add small delay to ensure measurable elapsed time
            // eslint-disable-next-line no-undef
            await new Promise(resolve => setTimeout(resolve, 10));
            const status = getStopwatchStatus(started);
            
            expect(status.isRunning).toBe(true);
            expect(status.elapsedTime).toBeGreaterThan(0);
            expect(status.formattedTime).toMatch(/\d+s/);
        });

        it('returns correct status for stopped stopwatch', () => {
            const started = startStopwatch(stopwatch);
            const stopped = stopStopwatch(started);
            const status = getStopwatchStatus(stopped);
            
            expect(status.isRunning).toBe(false);
            expect(status.elapsedTime).toBe(stopped.totalElapsed);
        });
    });

    describe('error handling', () => {
        it('handles invalid stopwatch state gracefully', () => {
            const invalidStopwatch = { startTime: null, isRunning: true };
            expect(() => getElapsedTime(invalidStopwatch)).not.toThrow();
        });
    });
});
