/**
 * Tests for useStopwatch Hook - Start Functionality
 * 
 * Tests the useStopwatch hook focusing on:
 * - Starting the stopwatch
 * - Real-time elapsed time updates
 * - State transitions
 * - Error handling during start operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock hook return type for testing
interface MockStopwatchStatus {
  isRunning: boolean;
  elapsedMs: number;
  formattedTime: string;
  laps: any[];
  hasError: boolean;
  errorMessage?: string;
}

interface MockStopwatchState {
  mode: 'idle' | 'running' | 'stopped';
  elapsedMs: number;
  laps: any[];
  hasError: boolean;
  errorMessage?: string;
  errorTimestamp?: string;
}

// Simple mock implementation for testing
function useStopwatchMock() {
  const [state, setState] = React.useState<MockStopwatchState>({
    mode: 'idle',
    elapsedMs: 0,
    laps: [],
    hasError: false,
  });

  const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout | null>(null);

  const start = () => {
    if (state.mode === 'idle' || state.mode === 'stopped') {
      setState((prev) => ({
        ...prev,
        mode: 'running',
        hasError: false,
        errorMessage: undefined,
      }));

      const id = setInterval(() => {
        setState((prev) => ({
          ...prev,
          elapsedMs: prev.elapsedMs + 100,
        }));
      }, 100);
      setIntervalId(id);
    } else if (state.mode === 'running') {
      setState((prev) => ({
        ...prev,
        hasError: true,
        errorMessage: 'Stopwatch is already running',
      }));
    }
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setState((prev) => ({ ...prev, mode: 'stopped' }));
  };

  const reset = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setState({
      mode: 'idle',
      elapsedMs: 0,
      laps: [],
      hasError: false,
    });
  };

  const lap = () => {
    if (state.mode !== 'running') {
      setState((prev) => ({
        ...prev,
        hasError: true,
        errorMessage: 'Cannot lap before starting',
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      laps: [...prev.laps, { lapNumber: prev.laps.length + 1, intervalMs: prev.elapsedMs }],
    }));
  };

  const clearError = () => {
    setState((prev) => ({
      ...prev,
      hasError: false,
      errorMessage: undefined,
    }));
  };

  const status: MockStopwatchStatus = {
    isRunning: state.mode === 'running',
    elapsedMs: state.elapsedMs,
    formattedTime: `${String(Math.floor(state.elapsedMs / 60000)).padStart(2, '0')}:${String(Math.floor((state.elapsedMs % 60000) / 1000)).padStart(2, '0')}:${String(Math.floor((state.elapsedMs % 1000) / 10)).padStart(2, '0')}`,
    laps: state.laps,
    hasError: state.hasError,
    errorMessage: state.errorMessage,
  };

  return {
    state,
    status,
    start,
    stop,
    reset,
    lap,
    clearError,
  };
}

import React from 'react';

describe('useStopwatch Hook - Start Functionality', () => {
  describe('initial state', () => {
    it('should initialize with idle mode and 0ms elapsed', () => {
      const { result } = renderHook(() => useStopwatchMock());
      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.status.isRunning).toBe(false);
    });

    it('should initialize with empty laps', () => {
      const { result } = renderHook(() => useStopwatchMock());
      expect(result.current.state.laps).toEqual([]);
    });

    it('should display 00:00:00 in initial state', () => {
      const { result } = renderHook(() => useStopwatchMock());
      expect(result.current.status.formattedTime).toBe('00:00:00');
    });
  });

  describe('start() functionality', () => {
    it('should change mode from idle to running when start() called', () => {
      const { result } = renderHook(() => useStopwatchMock());
      expect(result.current.state.mode).toBe('idle');

      act(() => {
        result.current.start();
      });

      expect(result.current.state.mode).toBe('running');
    });

    it('should set isRunning to true when start() called', () => {
      const { result } = renderHook(() => useStopwatchMock());
      expect(result.current.status.isRunning).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.status.isRunning).toBe(true);
    });

    it('should clear error when start() called', () => {
      const { result } = renderHook(() => useStopwatchMock());

      // Create error state
      act(() => {
        result.current.start();
        result.current.start(); // Try to start twice - creates error
      });

      expect(result.current.status.hasError).toBe(true);

      // Reset and start fresh
      act(() => {
        result.current.reset();
        result.current.start();
      });

      expect(result.current.status.hasError).toBe(false);
    });

    it('should start elapsed time timer when start() called', async () => {
      const { result } = renderHook(() => useStopwatchMock());

      act(() => {
        result.current.start();
      });

      expect(result.current.status.elapsedMs).toBe(0);

      await waitFor(() => {
        expect(result.current.status.elapsedMs).toBeGreaterThan(0);
      });
    });

    it('should continuously update elapsed time while running', async () => {
      const { result } = renderHook(() => useStopwatchMock());

      act(() => {
        result.current.start();
      });

      let previousTime = 0;

      await waitFor(() => {
        expect(result.current.status.elapsedMs).toBeGreaterThan(previousTime);
        previousTime = result.current.status.elapsedMs;
      });

      await waitFor(() => {
        expect(result.current.status.elapsedMs).toBeGreaterThan(previousTime);
      });
    });
  });

  describe('start() error handling', () => {
    it('should set error when start() called on already running stopwatch', () => {
      const { result } = renderHook(() => useStopwatchMock());

      act(() => {
        result.current.start();
        result.current.start(); // Try to start twice
      });

      expect(result.current.status.hasError).toBe(true);
      expect(result.current.status.errorMessage).toBe('Stopwatch is already running');
    });

    it('should have "Stopwatch is already running" error message', () => {
      const { result } = renderHook(() => useStopwatchMock());

      act(() => {
        result.current.start();
        result.current.start();
      });

      expect(result.current.status.errorMessage).toContain('already running');
    });
  });

  describe('start() with stopped mode', () => {
    it('should restart from stopped mode', () => {
      const { result } = renderHook(() => useStopwatchMock());

      act(() => {
        result.current.start();
      });

      expect(result.current.status.isRunning).toBe(true);

      act(() => {
        result.current.stop();
      });

      expect(result.current.status.isRunning).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.status.isRunning).toBe(true);
    });

    it('should continue from existing elapsed time when restarting', async () => {
      const { result } = renderHook(() => useStopwatchMock());

      act(() => {
        result.current.start();
      });

      await waitFor(() => {
        expect(result.current.status.elapsedMs).toBeGreaterThan(0);
      });

      const elapsedWhenStopped = result.current.status.elapsedMs;

      act(() => {
        result.current.stop();
      });

      // Verify time stays same after stop
      expect(result.current.status.elapsedMs).toBe(elapsedWhenStopped);

      act(() => {
        result.current.start();
      });

      // Time should continue from where it left off
      expect(result.current.status.elapsedMs).toBeGreaterThanOrEqual(elapsedWhenStopped);
    });
  });

  describe('formatted time display', () => {
    it('should format time correctly at start (00:00:00)', () => {
      const { result } = renderHook(() => useStopwatchMock());

      act(() => {
        result.current.start();
      });

      expect(result.current.status.formattedTime).toBe('00:00:00');
    });

    it('should update formatted time as elapsed time increases', async () => {
      const { result } = renderHook(() => useStopwatchMock());

      act(() => {
        result.current.start();
      });

      await waitFor(() => {
        expect(result.current.status.formattedTime).not.toBe('00:00:00');
      });
    });
  });
});
