/**
 * useStopwatch Hook
 * 
 * Custom React hook for managing stopwatch state and operations
 * Integrates with the core stopwatch module (apps/stopwatch/core/)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { StopwatchState, StopwatchStatus, UseStopwatchReturn } from '../types/stopwatch';
import { StopwatchErrorType } from '../types/stopwatch';
import { formatTime } from '../utils/formatting';
import {
  validateStart,
  validateStop,
  validateLap,
  createErrorState,
  shouldDismissError,
} from '../utils/validation';

const initialState: StopwatchState = {
  mode: 'idle',
  elapsedMs: 0,
  laps: [],
  hasError: false,
};

/**
 * Custom hook for managing stopwatch state and operations
 * 
 * @param autoDismissErrorMs - Auto-dismiss error after N milliseconds (default: 5000)
 * @param updateIntervalMs - Update display interval in milliseconds (default: 100)
 * @returns Hook return value with state, status, and operation functions
 * 
 * @example
 * const { status, start, stop, lap, reset, clearError } = useStopwatch();
 * 
 * // Start the stopwatch
 * start();
 * 
 * // Record a lap
 * lap();
 * 
 * // Stop the stopwatch
 * stop();
 * 
 * // Reset to initial state
 * reset();
 * 
 * // Clear any error
 * clearError();
 */
export function useStopwatch(autoDismissErrorMs = 5000, updateIntervalMs = 100): UseStopwatchReturn {
  const [state, setState] = useState<StopwatchState>(initialState);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lapTimesRef = useRef<number[]>([]);
  const elapsedOffsetRef = useRef<number>(0);
  const lastRenderElapsedRef = useRef<number>(initialState.elapsedMs);

  // Derive public status from state
  const status: StopwatchStatus = {
    isRunning: state.mode === 'running',
    elapsedMs: state.elapsedMs,
    formattedTime: formatTime(state.elapsedMs),
    laps: state.laps,
    hasError: state.hasError,
    errorMessage: state.errorMessage,
  };

  // Handle auto-dismiss of errors
  useEffect(() => {
    if (state.hasError && shouldDismissError(state, autoDismissErrorMs)) {
      setState((prev) => ({
        ...prev,
        hasError: false,
        errorMessage: undefined,
        errorTimestamp: undefined,
      }));
    }
  }, [state, autoDismissErrorMs]);

  // Update elapsed time when running
  useEffect(() => {
    lastRenderElapsedRef.current = state.elapsedMs;
  }, [state.elapsedMs]);

  useEffect(() => {
    if (state.mode === 'running' && startTimeRef.current !== null) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.mode !== 'running' || startTimeRef.current === null) {
            return prev;
          }

          const elapsed =
            elapsedOffsetRef.current + (Date.now() - startTimeRef.current);

          if (elapsed === prev.elapsedMs) {
            return prev;
          }

          return {
            ...prev,
            elapsedMs: elapsed,
          };
        });
      }, updateIntervalMs);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.mode, updateIntervalMs]);

  // Start the stopwatch
  const start = useCallback(() => {
    setState((prev) => {
      // Validate
      const error = validateStart(prev.mode);
      if (error) {
        return {
          ...prev,
          ...createErrorState(error),
        };
      }

      // Set ref time only if not already set (defensive check)
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
        elapsedOffsetRef.current = prev.elapsedMs;
      }

      // Clear error and transition to running
      return {
        ...prev,
        mode: 'running',
        hasError: false,
        errorMessage: undefined,
        errorTimestamp: undefined,
      };
    });
  }, []);

  // Stop the stopwatch
  const stop = useCallback(() => {
    let shouldFinalize = false;
    let totalElapsed = elapsedOffsetRef.current;

    setState((prev) => {
      const error = validateStop(prev.mode);
      if (error) {
        return {
          ...prev,
          ...createErrorState(error),
        };
      }

      totalElapsed = lastRenderElapsedRef.current;
      shouldFinalize = true;

      return {
        ...prev,
        mode: 'stopped',
        elapsedMs: totalElapsed,
        hasError: false,
        errorMessage: undefined,
        errorTimestamp: undefined,
      };
    });

    if (shouldFinalize) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      elapsedOffsetRef.current = totalElapsed;
      startTimeRef.current = null;
    }
  }, []);

  // Record a lap
  const lap = useCallback(() => {
    setState((prev) => {
      // Validate
      const error = validateLap(prev.mode);
      if (error) {
        return {
          ...prev,
          ...createErrorState(error),
        };
      }

      // Calculate lap times
      const now = Date.now();
      const totalMs =
        startTimeRef.current !== null
          ? elapsedOffsetRef.current + (now - startTimeRef.current)
          : elapsedOffsetRef.current;
      const prevTotalMs = lapTimesRef.current.length > 0 ? lapTimesRef.current[lapTimesRef.current.length - 1] : 0;
      const intervalMs = totalMs - prevTotalMs;

      const newLap = {
        lapNumber: prev.laps.length + 1,
        intervalMs,
        totalMs,
        timestamp: new Date().toISOString(),
      };

      lapTimesRef.current.push(totalMs);

      return {
        ...prev,
        laps: [...prev.laps, newLap],
        elapsedMs: totalMs,
        hasError: false,
        errorMessage: undefined,
        errorTimestamp: undefined,
      };
    });
  }, []);

  // Reset the stopwatch
  const reset = useCallback(() => {
    // Stop any running interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    startTimeRef.current = null;
    elapsedOffsetRef.current = 0;
    lapTimesRef.current = [];

    setState(initialState);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasError: false,
      errorMessage: undefined,
      errorTimestamp: undefined,
    }));
  }, []);

  return {
    state,
    status,
    start,
    stop,
    lap,
    reset,
    clearError,
  };
}
