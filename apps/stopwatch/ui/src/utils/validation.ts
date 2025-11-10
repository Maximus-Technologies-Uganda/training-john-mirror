/**
 * Stopwatch State Validation Utilities
 * 
 * Provides functions to validate stopwatch state and prevent invalid transitions
 */

import type { StopwatchMode, StopwatchState } from '../types/stopwatch';
import { StopwatchErrorType } from '../types/stopwatch';

/**
 * Validates that the stopwatch can be started
 * 
 * @param mode - Current stopwatch mode
 * @returns Error type if invalid, null if valid
 */
export function validateStart(mode: StopwatchMode): StopwatchErrorType | null {
  if (mode === 'running') {
    return StopwatchErrorType.AlreadyRunning;
  }
  return null;
}

/**
 * Validates that the stopwatch can be stopped
 * 
 * @param mode - Current stopwatch mode
 * @returns Error type if invalid, null if valid
 */
export function validateStop(mode: StopwatchMode): StopwatchErrorType | null {
  if (mode === 'idle' || mode === 'stopped') {
    return StopwatchErrorType.NotRunning;
  }
  return null;
}

/**
 * Validates that a lap can be recorded
 * 
 * @param mode - Current stopwatch mode
 * @returns Error type if invalid, null if valid
 */
export function validateLap(mode: StopwatchMode): StopwatchErrorType | null {
  if (mode !== 'running') {
    return StopwatchErrorType.CannotLapWhileStopped;
  }
  return null;
}

/**
 * Validates that elapsed time is within acceptable range
 * 
 * @param elapsedMs - Elapsed time in milliseconds
 * @param maxMs - Maximum allowed milliseconds (default: 99:59:99 = 359999ms)
 * @returns Error type if invalid, null if valid
 */
export function validateElapsedTime(
  elapsedMs: number,
  maxMs: number = 359999,
): StopwatchErrorType | null {
  if (elapsedMs < 0 || elapsedMs > maxMs) {
    return StopwatchErrorType.InvalidTime;
  }
  return null;
}

/**
 * Validates complete stopwatch state
 * Performs comprehensive validation of all state fields
 * 
 * @param state - Stopwatch state to validate
 * @returns Array of error types found, empty if valid
 */
export function validateState(state: StopwatchState): StopwatchErrorType[] {
  const errors: StopwatchErrorType[] = [];

  // Validate elapsed time
  const timeError = validateElapsedTime(state.elapsedMs);
  if (timeError) {
    errors.push(timeError);
  }

  // Validate mode
  if (!['idle', 'running', 'stopped'].includes(state.mode)) {
    errors.push(StopwatchErrorType.Unknown);
  }

  // Validate laps array
  if (!Array.isArray(state.laps)) {
    errors.push(StopwatchErrorType.Unknown);
  } else {
    // Validate each lap
    for (const lap of state.laps) {
      if (lap.intervalMs < 0 || lap.totalMs < 0) {
        errors.push(StopwatchErrorType.InvalidTime);
        break;
      }
      // Cumulative time should be >= interval time
      if (lap.totalMs < lap.intervalMs) {
        errors.push(StopwatchErrorType.InvalidTime);
        break;
      }
    }
  }

  return errors;
}

/**
 * Checks if an error message exists and is valid
 * 
 * @param state - Stopwatch state
 * @returns true if state has valid error information
 */
export function hasValidError(state: StopwatchState): boolean {
  return state.hasError && Boolean(state.errorMessage) && Boolean(state.errorTimestamp);
}

/**
 * Checks if an error should be auto-dismissed based on timestamp
 * 
 * @param state - Stopwatch state
 * @param dismissAfterMs - Milliseconds after which to dismiss (default: 5000)
 * @returns true if error should be dismissed
 */
export function shouldDismissError(state: StopwatchState, dismissAfterMs: number = 5000): boolean {
  if (!state.errorTimestamp) {
    return false;
  }

  const errorTime = new Date(state.errorTimestamp).getTime();
  const now = Date.now();
  return now - errorTime > dismissAfterMs;
}

/**
 * Gets human-readable error message for error type
 * 
 * @param errorType - Error type from StopwatchErrorType
 * @returns User-friendly error message
 */
export function getErrorMessage(errorType: StopwatchErrorType): string {
  const messages: Record<StopwatchErrorType, string> = {
    [StopwatchErrorType.AlreadyRunning]: 'Stopwatch is already running',
    [StopwatchErrorType.NotRunning]: 'Stopwatch is not running',
    [StopwatchErrorType.CannotLapWhileStopped]: 'Cannot lap before starting the stopwatch',
    [StopwatchErrorType.InvalidTime]: 'Invalid time value',
    [StopwatchErrorType.Unknown]: 'An unknown error occurred',
  };

  return messages[errorType] || 'An unknown error occurred';
}

/**
 * Creates error state update from error type
 * 
 * @param errorType - Error type
 * @returns Partial state update with error information
 */
export function createErrorState(errorType: StopwatchErrorType): {
  hasError: boolean;
  errorMessage: string;
  errorTimestamp: string;
} {
  return {
    hasError: true,
    errorMessage: getErrorMessage(errorType),
    errorTimestamp: new Date().toISOString(),
  };
}
