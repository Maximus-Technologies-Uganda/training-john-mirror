import { describe, it, expect } from 'vitest';
import {
  validateStart,
  validateStop,
  validateLap,
  validateElapsedTime,
  validateState,
  hasValidError,
  shouldDismissError,
  getErrorMessage,
  createErrorState,
} from '@/utils/validation';
import { StopwatchErrorType } from '@/types/stopwatch';
import { createMockStopwatchState } from '../setup';

describe('Stopwatch Validation Utilities', () => {
  describe('validateStart', () => {
    it('should allow start when idle', () => {
      expect(validateStart('idle')).toBeNull();
    });

    it('should allow start when stopped', () => {
      expect(validateStart('stopped')).toBeNull();
    });

    it('should prevent start when already running', () => {
      expect(validateStart('running')).toBe(StopwatchErrorType.AlreadyRunning);
    });
  });

  describe('validateStop', () => {
    it('should allow stop when running', () => {
      expect(validateStop('running')).toBeNull();
    });

    it('should prevent stop when idle', () => {
      expect(validateStop('idle')).toBe(StopwatchErrorType.NotRunning);
    });

    it('should prevent stop when already stopped', () => {
      expect(validateStop('stopped')).toBe(StopwatchErrorType.NotRunning);
    });
  });

  describe('validateLap', () => {
    it('should allow lap when running', () => {
      expect(validateLap('running')).toBeNull();
    });

    it('should prevent lap when idle', () => {
      expect(validateLap('idle')).toBe(StopwatchErrorType.CannotLapWhileStopped);
    });

    it('should prevent lap when stopped', () => {
      expect(validateLap('stopped')).toBe(
        StopwatchErrorType.CannotLapWhileStopped
      );
    });
  });

  describe('validateElapsedTime', () => {
    it('should allow valid elapsed times', () => {
      expect(validateElapsedTime(0)).toBeNull();
      expect(validateElapsedTime(5000)).toBeNull();
      expect(validateElapsedTime(359999)).toBeNull();
    });

    it('should reject negative times', () => {
      expect(validateElapsedTime(-100)).toBe(StopwatchErrorType.InvalidTime);
    });

    it('should reject times exceeding max (359999ms)', () => {
      expect(validateElapsedTime(360000)).toBe(StopwatchErrorType.InvalidTime);
    });

    it('should accept custom max value', () => {
      expect(validateElapsedTime(500000, 600000)).toBeNull();
      expect(validateElapsedTime(700000, 600000)).toBe(
        StopwatchErrorType.InvalidTime
      );
    });
  });

  describe('validateState', () => {
    it('should return empty array for valid state', () => {
      const state = createMockStopwatchState({
        mode: 'running',
        elapsedMs: 5000,
        laps: [],
      });
      expect(validateState(state)).toEqual([]);
    });

    it('should detect invalid elapsed time', () => {
      const state = createMockStopwatchState({ elapsedMs: -100 });
      const errors = validateState(state);
      expect(errors).toContain(StopwatchErrorType.InvalidTime);
    });

    it('should detect invalid mode', () => {
      const state = createMockStopwatchState({
        mode: 'invalid' as any,
      });
      const errors = validateState(state);
      expect(errors).toContain(StopwatchErrorType.Unknown);
    });

    it('should detect invalid laps', () => {
      const state = createMockStopwatchState({
        laps: [{ lapNumber: 1, intervalMs: -100, totalMs: 0, timestamp: '' } as any],
      });
      const errors = validateState(state);
      expect(errors).toContain(StopwatchErrorType.InvalidTime);
    });

    it('should detect lap with totalMs < intervalMs', () => {
      const state = createMockStopwatchState({
        laps: [{ lapNumber: 1, intervalMs: 5000, totalMs: 3000, timestamp: '' }],
      });
      const errors = validateState(state);
      expect(errors).toContain(StopwatchErrorType.InvalidTime);
    });
  });

  describe('hasValidError', () => {
    it('should return true for valid error state', () => {
      const state = createMockStopwatchState({
        hasError: true,
        errorMessage: 'Test error',
        errorTimestamp: new Date().toISOString(),
      });
      expect(hasValidError(state)).toBe(true);
    });

    it('should return false when hasError is true but message missing', () => {
      const state = createMockStopwatchState({
        hasError: true,
        errorTimestamp: new Date().toISOString(),
      });
      expect(hasValidError(state)).toBe(false);
    });

    it('should return false when hasError is true but timestamp missing', () => {
      const state = createMockStopwatchState({
        hasError: true,
        errorMessage: 'Test error',
      });
      expect(hasValidError(state)).toBe(false);
    });

    it('should return false when hasError is false', () => {
      expect(hasValidError(createMockStopwatchState({ hasError: false }))).toBe(
        false
      );
    });
  });

  describe('shouldDismissError', () => {
    it('should not dismiss when dismissAfterMs not elapsed', () => {
      const now = new Date();
      const state = createMockStopwatchState({
        hasError: true,
        errorTimestamp: now.toISOString(),
      });
      expect(shouldDismissError(state, 5000)).toBe(false);
    });

    it('should dismiss when dismissAfterMs elapsed', () => {
      const pastTime = new Date(Date.now() - 6000);
      const state = createMockStopwatchState({
        hasError: true,
        errorTimestamp: pastTime.toISOString(),
      });
      expect(shouldDismissError(state, 5000)).toBe(true);
    });

    it('should use default dismissAfterMs of 5000', () => {
      const pastTime = new Date(Date.now() - 5100);
      const state = createMockStopwatchState({
        hasError: true,
        errorTimestamp: pastTime.toISOString(),
      });
      expect(shouldDismissError(state)).toBe(true);
    });

    it('should return false if no errorTimestamp', () => {
      const state = createMockStopwatchState({
        hasError: true,
      });
      expect(shouldDismissError(state, 5000)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should return appropriate error messages', () => {
      expect(getErrorMessage(StopwatchErrorType.AlreadyRunning)).toBe(
        'Stopwatch is already running'
      );
      expect(getErrorMessage(StopwatchErrorType.NotRunning)).toBe(
        'Stopwatch is not running'
      );
      expect(getErrorMessage(StopwatchErrorType.CannotLapWhileStopped)).toBe(
        'Cannot lap before starting the stopwatch'
      );
      expect(getErrorMessage(StopwatchErrorType.InvalidTime)).toBe(
        'Invalid time value'
      );
      expect(getErrorMessage(StopwatchErrorType.Unknown)).toBe(
        'An unknown error occurred'
      );
    });

    it('should handle unknown error types gracefully', () => {
      const result = getErrorMessage('INVALID' as any);
      expect(result).toBe('An unknown error occurred');
    });
  });

  describe('createErrorState', () => {
    it('should create valid error state object', () => {
      const error = createErrorState(StopwatchErrorType.AlreadyRunning);
      expect(error.hasError).toBe(true);
      expect(error.errorMessage).toBe('Stopwatch is already running');
      expect(error.errorTimestamp).toBeDefined();
      expect(typeof error.errorTimestamp).toBe('string');
    });

    it('should include timestamp in ISO format', () => {
      const error = createErrorState(StopwatchErrorType.NotRunning);
      const timestamp = new Date(error.errorTimestamp);
      expect(timestamp instanceof Date).toBe(true);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });

    it('should work with all error types', () => {
      Object.values(StopwatchErrorType).forEach((errorType) => {
        const error = createErrorState(errorType);
        expect(error.hasError).toBe(true);
        expect(error.errorMessage).toBeDefined();
        expect(error.errorMessage.length).toBeGreaterThan(0);
        expect(error.errorTimestamp).toBeDefined();
      });
    });
  });

  describe('validation integration', () => {
    it('should prevent invalid state transitions', () => {
      // Cannot start if already running
      const runningError = validateStart('running');
      expect(runningError).toBe(StopwatchErrorType.AlreadyRunning);

      // Cannot stop if not running
      const notRunningError = validateStop('idle');
      expect(notRunningError).toBe(StopwatchErrorType.NotRunning);

      // Cannot lap if not running
      const cannotLapError = validateLap('stopped');
      expect(cannotLapError).toBe(StopwatchErrorType.CannotLapWhileStopped);
    });

    it('should validate complete state transitions', () => {
      // Initial state: idle
      const initialState = createMockStopwatchState({ mode: 'idle' });
      expect(validateState(initialState)).toEqual([]);

      // After start: running
      const runningState = createMockStopwatchState({
        mode: 'running',
        elapsedMs: 5000,
      });
      expect(validateState(runningState)).toEqual([]);

      // After stop: stopped
      const stoppedState = createMockStopwatchState({
        mode: 'stopped',
        elapsedMs: 5000,
      });
      expect(validateState(stoppedState)).toEqual([]);
    });

    it('should allow error state recovery', () => {
      // Create error state
      const errorState = createErrorState(StopwatchErrorType.AlreadyRunning);
      expect(errorState.hasError).toBe(true);

      // Verify error would eventually auto-dismiss
      const pastTime = new Date(Date.now() - 6000);
      const staleErrorState = {
        ...createMockStopwatchState(),
        hasError: true,
        errorTimestamp: pastTime.toISOString(),
      };
      expect(shouldDismissError(staleErrorState, 5000)).toBe(true);
    });
  });
});
