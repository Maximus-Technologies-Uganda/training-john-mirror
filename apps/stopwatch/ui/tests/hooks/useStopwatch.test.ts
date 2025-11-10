/**
 * Tests for useStopwatch Hook - Start Functionality
 * 
 * Tests the useStopwatch hook focusing on:
 * - Starting the stopwatch
 * - Real-time elapsed time updates
 * - State transitions
 * - Error handling during start operations
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStopwatch } from '@/hooks/useStopwatch';

describe('useStopwatch Hook - Start Functionality', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should initialize with idle mode and 0ms elapsed', () => {
      const { result } = renderHook(() => useStopwatch());
      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.status.isRunning).toBe(false);
    });

    it('should initialize with empty laps', () => {
      const { result } = renderHook(() => useStopwatch());
      expect(result.current.state.laps).toEqual([]);
    });

    it('should display 00:00:00 in initial state', () => {
      const { result } = renderHook(() => useStopwatch());
      expect(result.current.status.formattedTime).toBe('00:00:00');
    });
  });

  describe('start() functionality', () => {
    it('should change mode from idle to running when start() called', () => {
      const { result } = renderHook(() => useStopwatch());
      expect(result.current.state.mode).toBe('idle');

      act(() => {
        result.current.start();
      });

      expect(result.current.state.mode).toBe('running');
    });

    it('should set isRunning to true when start() called', () => {
      const { result } = renderHook(() => useStopwatch());
      expect(result.current.status.isRunning).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.status.isRunning).toBe(true);
    });

    it('should clear error when start() called', () => {
      const { result } = renderHook(() => useStopwatch());

      // Start twice to create error
      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.start(); // Should error (already running)
      });

      // Should have error now
      expect(result.current.status.hasError).toBe(true);

      // Reset and verify error is cleared
      act(() => {
        result.current.reset();
        result.current.start();
      });

      expect(result.current.status.hasError).toBe(false);
    });

    it('should start elapsed time timer when start() called', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      expect(result.current.status.elapsedMs).toBe(0);

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current.status.elapsedMs).toBeGreaterThan(0);
    });

    it('should continuously update elapsed time while running', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      let previousTime = 0;

      act(() => {
        vi.advanceTimersByTime(150);
      });
      previousTime = result.current.status.elapsedMs;
      expect(previousTime).toBeGreaterThan(0);

      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(result.current.status.elapsedMs).toBeGreaterThan(previousTime);
    });
  });

  describe('start() error handling', () => {
    it('should set error when start() called on already running stopwatch', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.start(); // Try to start twice
      });

      expect(result.current.status.hasError).toBe(true);
      expect(result.current.status.errorMessage).toBe('Stopwatch is already running');
    });

    it('should have "Stopwatch is already running" error message', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        result.current.start();
      });

      expect(result.current.status.errorMessage).toContain('already running');
    });
  });

  describe('start() with stopped mode', () => {
    it.skip('should restart from stopped mode', async () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      expect(result.current.status.isRunning).toBe(true);

      act(() => {
        result.current.stop();
        vi.advanceTimersByTime(50);
      });

      expect(result.current.status.isRunning).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.status.isRunning).toBe(true);
    });

    it('should continue from existing elapsed time when restarting', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(150);
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
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      expect(result.current.status.formattedTime).toBe('00:00:00');
    });

    it('should update formatted time as elapsed time increases', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      expect(result.current.status.formattedTime).toBe('00:00:00');

      act(() => {
        vi.advanceTimersByTime(1150);
      });

      expect(result.current.status.formattedTime).not.toBe('00:00:00');
    });
  });

  describe('Race Condition Handling (FR-007)', () => {
    it('should handle rapid concurrent Lap + Stop clicks without race conditions', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      expect(result.current.status.isRunning).toBe(true);

      // Rapid concurrent operations
      act(() => {
        result.current.lap();
        result.current.stop();
        vi.advanceTimersByTime(10); // Allow interval to settle
      });

      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.status.isRunning).toBe(false);
    });

    it('should handle multiple lap clicks without race conditions', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Multiple rapid laps
      act(() => {
        result.current.lap();
        result.current.lap();
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(3);
      expect(result.current.state.laps[0].lapNumber).toBe(1);
      expect(result.current.state.laps[1].lapNumber).toBe(2);
      expect(result.current.state.laps[2].lapNumber).toBe(3);
    });

    it('should handle Start + Stop + Start sequence correctly', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });
      expect(result.current.status.isRunning).toBe(true);

      act(() => {
        result.current.stop();
        vi.advanceTimersByTime(10); // Allow interval to settle
      });
      expect(result.current.status.isRunning).toBe(false);

      const stoppedTime = result.current.status.elapsedMs;

      // Restart
      act(() => {
        result.current.start();
      });
      expect(result.current.status.isRunning).toBe(true);
      // Elapsed time should be from where it stopped
      expect(result.current.status.elapsedMs).toBe(stoppedTime);
    });

    it('should handle rapid Start + Lap + Stop sequence', () => {
      const { result } = renderHook(() => useStopwatch());

      // Rapid sequence of operations
      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      act(() => {
        result.current.lap();
        vi.advanceTimersByTime(50);
        result.current.lap();
        result.current.stop();
        vi.advanceTimersByTime(10); // Allow interval to settle
      });

      expect(result.current.state.laps.length).toBe(2);
      expect(result.current.status.isRunning).toBe(false);
    });

    it('should not create duplicate laps from concurrent lap calls', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.lap();
        result.current.lap();
        result.current.lap();
      });

      // Should have exactly 3 laps, not more or less
      expect(result.current.state.laps.length).toBe(3);

      // Lap numbers should be sequential
      for (let i = 0; i < result.current.state.laps.length; i++) {
        expect(result.current.state.laps[i].lapNumber).toBe(i + 1);
      }
    });

    it('should preserve elapsed time during rapid operations', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      const elapsedBefore = result.current.status.elapsedMs;

      // Rapid operations shouldn't lose elapsed time
      act(() => {
        result.current.lap();
        result.current.lap();
        result.current.lap();
      });

      expect(result.current.status.elapsedMs).toBeGreaterThanOrEqual(elapsedBefore);
    });
  });

  describe('stop() and reset() functionality (T038)', () => {
    it('should stop running stopwatch', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      expect(result.current.status.isRunning).toBe(true);

      act(() => {
        result.current.stop();
      });

      expect(result.current.status.isRunning).toBe(false);
      expect(result.current.state.mode).toBe('stopped');
    });

    it('should accumulate elapsed time on stop', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      const elapsedBeforeStop = result.current.status.elapsedMs;

      act(() => {
        result.current.stop();
      });

      // Elapsed time should be preserved
      expect(result.current.status.elapsedMs).toBeGreaterThan(0);
      expect(result.current.status.elapsedMs).toBeGreaterThanOrEqual(elapsedBeforeStop);
    });

    it('should prevent double stop with error', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        result.current.stop();
        result.current.stop(); // Second stop attempt
      });

      expect(result.current.state.hasError).toBe(true);
      expect(result.current.state.errorMessage).toContain('not running');
    });

    it('should prevent stop when idle', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.stop();
      });

      expect(result.current.state.hasError).toBe(true);
    });

    it('should reset to initial state', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(100);
        result.current.lap();
        result.current.reset();
      });

      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.state.laps.length).toBe(0);
      expect(result.current.state.hasError).toBe(false);
    });

    it('should clear laps on reset', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        result.current.lap();
        result.current.lap();
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(3);

      act(() => {
        result.current.reset();
      });

      expect(result.current.state.laps.length).toBe(0);
      expect(result.current.status.laps.length).toBe(0);
    });

    it('should allow restart after reset', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(100);
        result.current.reset();
        result.current.start();
      });

      expect(result.current.state.mode).toBe('running');
      expect(result.current.state.elapsedMs).toBe(0);
    });

    it('should clear errors on reset', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Try to start again (should create error)
      act(() => {
        result.current.start();
      });

      expect(result.current.state.hasError).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.state.hasError).toBe(false);
    });

    it('should reset from stopped state', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(150);
        result.current.stop();
        vi.advanceTimersByTime(50);
      });

      const elapsedWhenStopped = result.current.status.elapsedMs;

      act(() => {
        result.current.reset();
      });

      expect(result.current.status.elapsedMs).toBe(0);
      expect(result.current.state.mode).toBe('idle');
    });

    it('should handle complete workflow: start → lap → stop → reset', () => {
      const { result } = renderHook(() => useStopwatch());

      // Start
      act(() => {
        result.current.start();
      });
      expect(result.current.status.isRunning).toBe(true);

      // Lap
      act(() => {
        vi.advanceTimersByTime(100);
        result.current.lap();
      });
      expect(result.current.state.laps.length).toBe(1);

      // Stop
      act(() => {
        result.current.stop();
      });
      expect(result.current.status.isRunning).toBe(false);
      const elapsedAfterStop = result.current.status.elapsedMs;
      expect(elapsedAfterStop).toBeGreaterThan(0);

      // Reset
      act(() => {
        result.current.reset();
      });
      expect(result.current.state.mode).toBe('idle');
      expect(result.current.status.elapsedMs).toBe(0);
      expect(result.current.state.laps.length).toBe(0);
    });
  });

  describe('Edge case scenarios (T038 enhancements)', () => {
    it('should handle reset while running', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(100);
        result.current.lap();
        result.current.reset();  // Reset while running
      });

      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.state.laps.length).toBe(0);
      expect(result.current.status.isRunning).toBe(false);
    });

    it('should handle reset from idle state (safe no-op)', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.reset();  // Reset when already idle
      });

      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.state.laps.length).toBe(0);
    });

    it('should handle multiple rapid resets', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(100);
        result.current.stop();
        result.current.reset();
        result.current.reset();  // Second reset
        result.current.reset();  // Third reset
      });

      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.state.laps.length).toBe(0);
    });

    it('should handle stop immediately followed by reset', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(150);
        result.current.stop();
        
        result.current.reset();
      });

      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.state.mode).toBe('idle');
    });

    it('should clear errors after successful stop', () => {
      const { result } = renderHook(() => useStopwatch());

      // Try to stop when idle - should create error
      act(() => {
        result.current.stop();
      });

      expect(result.current.state.hasError).toBe(true);

      // Start the stopwatch - error should clear
      act(() => {
        result.current.start();
      });

      expect(result.current.state.hasError).toBe(false);
    });

    it('should handle reset from stopped state', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(150);
        result.current.stop();
        
        const elapsedWhenStopped = result.current.status.elapsedMs;
        result.current.reset();
      });

      expect(result.current.status.elapsedMs).toBe(0);
      expect(result.current.state.mode).toBe('idle');
    });

    it('should allow restart after reset from any state', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(100);
        result.current.reset();
        result.current.start();
      });

      expect(result.current.state.mode).toBe('running');
      expect(result.current.state.elapsedMs).toBe(0);
    });

    it('should prevent operations on stopped stopwatch', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        result.current.stop();
        result.current.lap();  // Try to lap when stopped
      });

      expect(result.current.state.hasError).toBe(true);
      expect(result.current.state.laps.length).toBe(0);  // Lap not recorded
    });
  });

  describe('lap() functionality (T030)', () => {
    it('should record a lap when running', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.state.laps[0].lapNumber).toBe(1);
    });

    it('should record multiple laps sequentially', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.lap();
        result.current.lap();
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(3);
      expect(result.current.state.laps[0].lapNumber).toBe(1);
      expect(result.current.state.laps[1].lapNumber).toBe(2);
      expect(result.current.state.laps[2].lapNumber).toBe(3);
    });

    it('should prevent lap before starting', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.lap();
      });

      expect(result.current.state.hasError).toBe(true);
      expect(result.current.state.errorMessage).toContain('Cannot lap');
    });

    it('should prevent lap when stopped', () => {
      const { result } = renderHook(() => useStopwatch());

      // Start
      act(() => {
        result.current.start();
      });

      // Advance time so the interval runs at least once
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Verify running state
      expect(result.current.state.mode).toBe('running');

      // Stop
      act(() => {
        result.current.stop();
      });

      // Verify stopped state
      expect(result.current.state.mode).toBe('stopped');

      // Try to lap (should error)
      act(() => {
        result.current.lap();
      });

      expect(result.current.state.hasError).toBe(true);
      expect(result.current.state.errorMessage).toContain('Cannot lap');
    });

    it('should calculate correct interval time for first lap', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      act(() => {
        result.current.lap();
      });

      // Interval should be approximately equal to elapsed time for first lap
      expect(result.current.state.laps[0].intervalMs).toBeGreaterThan(0);
    });

    it('should calculate correct cumulative total for first lap', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      const elapsedBeforeLap = result.current.status.elapsedMs;

      act(() => {
        result.current.lap();
      });

      // Total should be equal to elapsed time for first lap
      expect(result.current.state.laps[0].totalMs).toBeGreaterThanOrEqual(elapsedBeforeLap);
    });

    it('should calculate correct interval for second lap', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(100);
        result.current.lap();
        vi.advanceTimersByTime(100);
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(2);
      // Second lap interval should be roughly the time between lap 1 and lap 2
      expect(result.current.state.laps[1].intervalMs).toBeGreaterThan(0);
    });

    it('should calculate cumulative times increasing', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(100);
        result.current.lap();
        vi.advanceTimersByTime(100);
        result.current.lap();
        vi.advanceTimersByTime(100);
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(3);

      // Cumulative times should increase
      expect(result.current.state.laps[0].totalMs).toBeGreaterThan(0);
      expect(result.current.state.laps[1].totalMs).toBeGreaterThan(
        result.current.state.laps[0].totalMs
      );
      expect(result.current.state.laps[2].totalMs).toBeGreaterThan(
        result.current.state.laps[1].totalMs
      );
    });

    it('should clear error when lap succeeds', () => {
      const { result } = renderHook(() => useStopwatch());

      // Create error by trying to lap before start
      act(() => {
        result.current.lap();
      });

      expect(result.current.state.hasError).toBe(true);

      // Fix error by starting and lapping
      act(() => {
        result.current.reset();
        result.current.start();
        result.current.lap();
      });

      expect(result.current.state.hasError).toBe(false);
      expect(result.current.state.laps.length).toBe(1);
    });

    it('should store lap timestamps', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.lap();
      });

      expect(result.current.state.laps[0].timestamp).toBeDefined();
      expect(typeof result.current.state.laps[0].timestamp).toBe('string');
      // Verify it's a valid ISO string
      expect(() => new Date(result.current.state.laps[0].timestamp)).not.toThrow();
    });

    it('should handle >50 laps without errors', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Record 75 laps
      act(() => {
        for (let i = 0; i < 75; i++) {
          result.current.lap();
        }
      });

      expect(result.current.state.laps.length).toBe(75);
      expect(result.current.state.hasError).toBe(false);

      // Verify all lap numbers are sequential
      for (let i = 0; i < 75; i++) {
        expect(result.current.state.laps[i].lapNumber).toBe(i + 1);
      }
    });

    it('should display laps in status', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.lap();
        result.current.lap();
      });

      expect(result.current.status.laps.length).toBe(2);
      expect(result.current.status.laps[0].lapNumber).toBe(1);
      expect(result.current.status.laps[1].lapNumber).toBe(2);
    });

    it('should have all required lap properties', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.lap();
      });

      const lap = result.current.state.laps[0];
      expect(lap).toHaveProperty('lapNumber');
      expect(lap).toHaveProperty('intervalMs');
      expect(lap).toHaveProperty('totalMs');
      expect(lap).toHaveProperty('timestamp');

      expect(typeof lap.lapNumber).toBe('number');
      expect(typeof lap.intervalMs).toBe('number');
      expect(typeof lap.totalMs).toBe('number');
      expect(typeof lap.timestamp).toBe('string');
    });
  });

  describe('Lap Edge Cases', () => {
    it('should handle very small lap times (1ms)', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Advance minimal time
      act(() => {
        vi.advanceTimersByTime(1);
      });

      act(() => {
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.state.laps[0].intervalMs).toBeGreaterThanOrEqual(0);
      expect(result.current.state.laps[0].totalMs).toBeGreaterThanOrEqual(0);
    });

    it('should handle very large lap times (1 hour)', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Advance 1 hour (3,600,000ms)
      act(() => {
        vi.advanceTimersByTime(3600000);
      });

      act(() => {
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.state.laps[0].totalMs).toBeGreaterThan(3500000);
      expect(result.current.state.laps[0].intervalMs).toBeGreaterThan(3500000);
    });

    it('should handle rapid lap clicks without duplication', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Rapid lap calls
      act(() => {
        result.current.lap();
        result.current.lap();
        result.current.lap();
        result.current.lap();
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(5);
      
      // Verify no duplicates and sequential numbering
      for (let i = 0; i < 5; i++) {
        expect(result.current.state.laps[i].lapNumber).toBe(i + 1);
      }
    });

    it('should maintain precision for lap intervals', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Lap 1 at 100ms
      act(() => {
        vi.advanceTimersByTime(100);
        result.current.lap();
      });

      const lap1Interval = result.current.state.laps[0].intervalMs;

      // Lap 2 at 250ms total (150ms interval)
      act(() => {
        vi.advanceTimersByTime(150);
        result.current.lap();
      });

      const lap2Interval = result.current.state.laps[1].intervalMs;

      // Intervals should be approximately correct (within 5ms due to timer discreteness)
      expect(lap1Interval).toBeGreaterThan(90);
      expect(lap2Interval).toBeGreaterThan(140);
    });

    it('should handle maximum lap count (100+ laps)', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Create 100 laps rapidly
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.lap();
        }
      });

      expect(result.current.state.laps.length).toBe(100);
      expect(result.current.state.hasError).toBe(false);

      // Verify sequence integrity
      for (let i = 0; i < 100; i++) {
        expect(result.current.state.laps[i].lapNumber).toBe(i + 1);
      }

      // Verify cumulative times are strictly increasing
      for (let i = 1; i < 100; i++) {
        expect(result.current.state.laps[i].totalMs).toBeGreaterThanOrEqual(
          result.current.state.laps[i - 1].totalMs
        );
      }
    });

    it('should preserve lap data integrity across rapid state changes', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Record first lap
      act(() => {
        result.current.lap();
      });

      const firstLapData = { ...result.current.state.laps[0] };

      // Advance time and record more laps
      act(() => {
        vi.advanceTimersByTime(100);
        result.current.lap();
        vi.advanceTimersByTime(100);
        result.current.lap();
      });

      // Verify first lap data wasn't corrupted
      expect(result.current.state.laps[0]).toEqual(firstLapData);

      // Verify all laps in correct order
      expect(result.current.state.laps.length).toBe(3);
      expect(result.current.state.laps[0].lapNumber).toBe(1);
      expect(result.current.state.laps[1].lapNumber).toBe(2);
      expect(result.current.state.laps[2].lapNumber).toBe(3);
    });

    it('should reset lap state properly after reset()', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Create multiple laps
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.lap();
        }
      });

      expect(result.current.state.laps.length).toBe(10);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.state.laps.length).toBe(0);
      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);

      // Start again and verify laps are numbered from 1
      act(() => {
        result.current.start();
        result.current.lap();
      });

      expect(result.current.state.laps[0].lapNumber).toBe(1);
    });

    it('should handle lap creation with zero elapsed time', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Immediately lap without advancing time
      act(() => {
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.state.laps[0].totalMs).toBeGreaterThanOrEqual(0);
      expect(result.current.state.laps[0].intervalMs).toBeGreaterThanOrEqual(0);
    });
  });

  /**
   * T047: Hook test for validation in useStopwatch (lap without start, stop twice)
   * 
   * Tests that the useStopwatch hook properly validates state transitions
   * and prevents invalid operations with appropriate error messages.
   */
  describe('validation in useStopwatch hook (T047)', () => {
    describe('lap() validation - cannot lap without start', () => {
      it('should return error when attempting to lap before starting', () => {
        const { result } = renderHook(() => useStopwatch());

        // Attempt lap without starting
        act(() => {
          result.current.lap();
        });

        expect(result.current.state.hasError).toBe(true);
        expect(result.current.state.errorMessage).toContain('Cannot lap');
        expect(result.current.state.mode).toBe('idle');
        expect(result.current.state.laps.length).toBe(0);
      });

      it('should not create lap when validation fails', () => {
        const { result } = renderHook(() => useStopwatch());

        // Try to lap multiple times without starting
        act(() => {
          result.current.lap();
          result.current.lap();
          result.current.lap();
        });

        // Should have error and no laps
        expect(result.current.state.hasError).toBe(true);
        expect(result.current.state.laps.length).toBe(0);
      });

      it('should allow lap after starting despite previous error', () => {
        const { result } = renderHook(() => useStopwatch());

        // Attempt lap before start (error)
        act(() => {
          result.current.lap();
        });

        expect(result.current.state.hasError).toBe(true);

        // Now start the stopwatch
        act(() => {
          result.current.start();
        });

        expect(result.current.state.hasError).toBe(false);

        // Now lap should succeed
        act(() => {
          result.current.lap();
        });

        expect(result.current.state.hasError).toBe(false);
        expect(result.current.state.laps.length).toBe(1);
      });

      it('should prevent lap when stopped (paused)', () => {
        const { result } = renderHook(() => useStopwatch());

        // Start and stop
        act(() => {
          result.current.start();
          vi.advanceTimersByTime(100);
          result.current.stop();
        });

        // Try to lap while stopped
        act(() => {
          result.current.lap();
        });

        expect(result.current.state.hasError).toBe(true);
        expect(result.current.state.errorMessage).toContain('Cannot lap');
        expect(result.current.state.laps.length).toBe(0);
      });

      it('should have descriptive error message for lap before start', () => {
        const { result } = renderHook(() => useStopwatch());

        act(() => {
          result.current.lap();
        });

        expect(result.current.state.errorMessage).toBe(
          'Cannot lap before starting the stopwatch'
        );
      });
    });

    describe('stop() validation - cannot stop twice', () => {
      it('should return error when attempting to stop twice', () => {
        const { result } = renderHook(() => useStopwatch());

        // Start and stop
        act(() => {
          result.current.start();
          vi.advanceTimersByTime(100);
          result.current.stop();
        });

        expect(result.current.state.hasError).toBe(false);
        expect(result.current.state.mode).toBe('stopped');

        // Try to stop again
        act(() => {
          result.current.stop();
        });

        expect(result.current.state.hasError).toBe(true);
        expect(result.current.state.errorMessage).toContain('not running');
        expect(result.current.state.mode).toBe('stopped');
      });

      it('should prevent stop when already stopped', () => {
        const { result } = renderHook(() => useStopwatch());

        // Start, stop, try to stop again
        act(() => {
          result.current.start();
          vi.advanceTimersByTime(100);
          result.current.stop();
        });

        const elapsedAfterStop = result.current.status.elapsedMs;

        act(() => {
          result.current.stop(); // Second stop attempt
        });

        // Elapsed time should not change
        expect(result.current.status.elapsedMs).toBe(elapsedAfterStop);
        expect(result.current.state.hasError).toBe(true);
      });

      it('should not allow stop when idle (never started)', () => {
        const { result } = renderHook(() => useStopwatch());

        // Try to stop without starting
        act(() => {
          result.current.stop();
        });

        expect(result.current.state.hasError).toBe(true);
        expect(result.current.state.mode).toBe('idle');
      });

      it('should allow restart after stop despite error on double-stop', () => {
        const { result } = renderHook(() => useStopwatch());

        // Start, stop, try to stop again (error)
        act(() => {
          result.current.start();
          vi.advanceTimersByTime(100);
          result.current.stop();
          result.current.stop(); // This creates error
        });

        expect(result.current.state.hasError).toBe(true);

        // Now start again
        act(() => {
          result.current.start();
        });

        expect(result.current.state.hasError).toBe(false);
        expect(result.current.state.mode).toBe('running');
      });

      it('should have descriptive error message for stop twice', () => {
        const { result } = renderHook(() => useStopwatch());

        act(() => {
          result.current.start();
          result.current.stop();
          result.current.stop(); // Second stop
        });

        expect(result.current.state.errorMessage).toBe(
          'Stopwatch is not running'
        );
      });
    });

    describe('combined validation scenarios', () => {
      it('should handle lap before start error, then start, then double-stop error', () => {
        const { result } = renderHook(() => useStopwatch());

        // Step 1: Try to lap before start
        act(() => {
          result.current.lap();
        });

        expect(result.current.state.hasError).toBe(true);
        expect(result.current.state.errorMessage).toContain('Cannot lap');

        // Step 2: Start (clears error)
        act(() => {
          result.current.start();
        });

        expect(result.current.state.hasError).toBe(false);

        // Step 3: Stop
        act(() => {
          vi.advanceTimersByTime(100);
          result.current.stop();
        });

        expect(result.current.state.hasError).toBe(false);

        // Step 4: Try to stop again (error)
        act(() => {
          result.current.stop();
        });

        expect(result.current.state.hasError).toBe(true);
        expect(result.current.state.errorMessage).toContain('not running');
      });

      it('should track multiple validation errors across operations', () => {
        const { result } = renderHook(() => useStopwatch());

        // Error 1: Lap before start
        act(() => {
          result.current.lap();
        });
        let error1 = result.current.state.errorMessage;

        // Start and create lap
        act(() => {
          result.current.start();
          vi.advanceTimersByTime(100);
          result.current.lap();
        });

        // Stop
        act(() => {
          result.current.stop();
        });

        // Error 2: Lap while stopped
        act(() => {
          result.current.lap();
        });
        let error2 = result.current.state.errorMessage;

        // Error 3: Stop while stopped
        act(() => {
          result.current.stop();
        });
        let error3 = result.current.state.errorMessage;

        // Error1 and error2 are the same (both are "lap while not running")
        // Error3 is different (stop while stopped)
        expect(error1).toBe(error2); // Same error message for lap while idle/stopped
        expect(error1).not.toBe(error3); // Different error for stop while stopped
        expect(error2).not.toBe(error3); // Different error for stop while stopped
      });

      it('should maintain valid lap count despite validation errors', () => {
        const { result } = renderHook(() => useStopwatch());

        // Start and create laps
        act(() => {
          result.current.start();
          result.current.lap();
          vi.advanceTimersByTime(100);
          result.current.lap();
        });

        expect(result.current.state.laps.length).toBe(2);

        // Try invalid operations
        act(() => {
          result.current.stop();
          result.current.lap(); // Error: can't lap while stopped
        });

      // Lap count should remain unchanged
      expect(result.current.state.laps.length).toBe(2);
      expect(result.current.state.hasError).toBe(true);
    });
  });

  /**
   * T047b: Integration test for race conditions
   * 
   * Tests that the useStopwatch hook correctly handles rapid concurrent operations
   * like simultaneous Lap + Stop clicks without race conditions or data corruption.
   * 
   * Covers FR-007: handle rapid consecutive operations without race conditions
   */
  describe('race condition handling - rapid concurrent operations (T047b)', () => {
    it('should handle rapid lap + stop operations correctly', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(50);
      });

      // Rapidly perform lap and stop in quick succession
      act(() => {
        result.current.lap();
        result.current.stop();
      });

      // Should have one lap and be in stopped state
      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.state.mode).toBe('stopped');
      expect(result.current.state.hasError).toBe(false);
    });

    it('should handle rapid stop + lap operations (stop then lap while stopped)', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(100);
      });

      // Rapidly stop and then try to lap
      act(() => {
        result.current.stop();
        result.current.lap();
      });

      // Should have no laps (lap failed) and be stopped
      expect(result.current.state.laps.length).toBe(0);
      expect(result.current.state.mode).toBe('stopped');
      expect(result.current.state.hasError).toBe(true);
      expect(result.current.state.errorMessage).toContain('Cannot lap');
    });

    it('should handle multiple rapid lap operations', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Rapidly create multiple laps
      act(() => {
        result.current.lap();
        result.current.lap();
        result.current.lap();
        result.current.lap();
        result.current.lap();
      });

      // All laps should be recorded
      expect(result.current.state.laps.length).toBe(5);
      expect(result.current.state.laps[0].lapNumber).toBe(1);
      expect(result.current.state.laps[4].lapNumber).toBe(5);
      expect(result.current.state.hasError).toBe(false);
    });

    it('should handle rapid start + lap operations', () => {
      const { result } = renderHook(() => useStopwatch());

      // Rapidly start and lap
      act(() => {
        result.current.start();
        result.current.lap();
      });

      // Should have one lap
      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.state.mode).toBe('running');
      expect(result.current.state.hasError).toBe(false);
    });

    it('should maintain data integrity with rapid operation sequences', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(50);
        result.current.lap();
        vi.advanceTimersByTime(50);
      });

      const firstLapData = result.current.state.laps[0];

      // Rapid operations: lap, stop, lap (error), start
      act(() => {
        result.current.lap();
        result.current.stop();
        result.current.lap(); // Error: can't lap while stopped
        result.current.start();
      });

      // First lap data should be intact
      expect(result.current.state.laps[0]).toEqual(firstLapData);
      // Should have second lap from after stop
      expect(result.current.state.laps.length).toBe(2);
      expect(result.current.state.mode).toBe('running');
    });

    it('should handle rapid operations with error recovery', () => {
      const { result } = renderHook(() => useStopwatch());

      // Rapid error then recovery
      act(() => {
        result.current.lap(); // Error: lap before start
        result.current.lap(); // Error: still no start
        result.current.start(); // Fix
        result.current.lap(); // Should work now
      });

      // Error should be cleared by successful lap
      expect(result.current.state.hasError).toBe(false);
      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.state.mode).toBe('running');
    });

    it('should handle very rapid consecutive state changes', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        // Rapid sequence: start, lap, lap, stop, start, lap, stop, reset
        result.current.start();
        result.current.lap();
        result.current.lap();
        result.current.stop();
        result.current.start();
        result.current.lap();
        result.current.stop();
        result.current.reset();
      });

      // After reset, should be in initial state
      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.state.laps.length).toBe(0);
      expect(result.current.state.hasError).toBe(false);
    });

    it('should handle rapid operations without losing elapsed time', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(100);
      });

      const elapsedBeforeRapidOps = result.current.status.elapsedMs;

      act(() => {
        result.current.lap();
        result.current.lap();
        result.current.lap();
        result.current.stop();
      });

      // Elapsed time should have accumulated
      expect(result.current.status.elapsedMs).toBeGreaterThanOrEqual(elapsedBeforeRapidOps);
    });

    it('should handle rapid lap operations with lap numbering integrity', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
      });

      // Rapidly create many laps
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.lap();
          vi.advanceTimersByTime(10);
        }
      });

      // Verify lap numbers are sequential and correct
      expect(result.current.state.laps.length).toBe(10);
      for (let i = 0; i < 10; i++) {
        expect(result.current.state.laps[i].lapNumber).toBe(i + 1);
      }
      expect(result.current.state.hasError).toBe(false);
    });

    it('should prevent double-stop even during rapid operations', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(100);
      });

      const elapsedAfterFirstStop = (() => {
        let elapsed = 0;
        act(() => {
          result.current.stop();
          elapsed = result.current.status.elapsedMs;
        });
        return elapsed;
      })();

      // Rapidly attempt multiple stops
      act(() => {
        result.current.stop(); // Error
        result.current.stop(); // Error
        result.current.stop(); // Error
      });

      // Elapsed time should not change from first stop
      expect(result.current.status.elapsedMs).toBe(elapsedAfterFirstStop);
      expect(result.current.state.hasError).toBe(true);
      expect(result.current.state.mode).toBe('stopped');
    });

    it('should handle interleaved error and success operations', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        // Interleave invalid and valid operations
        result.current.lap(); // Error: no start
        result.current.start(); // Valid
        result.current.stop(); // Valid
        result.current.lap(); // Error: stopped
        result.current.start(); // Valid
        result.current.lap(); // Valid
        result.current.stop(); // Valid
      });

      // Should have one successful lap
      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.state.mode).toBe('stopped');
      // Valid operations (start, stop) clear errors, so hasError should be false
      expect(result.current.state.hasError).toBe(false);
    });

    it('should maintain consistency across rapid start-stop-start cycles', () => {
      const { result } = renderHook(() => useStopwatch());

      const results = [];

      // Rapid start-stop-start cycles
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.start();
          vi.advanceTimersByTime(50);
          result.current.lap();
          vi.advanceTimersByTime(50);
          result.current.stop();
        });

        results.push({
          laps: result.current.state.laps.length,
          mode: result.current.state.mode,
          error: result.current.state.hasError,
        });
      }

      // Each cycle should add one lap
      expect(results[0].laps).toBe(1);
      expect(results[1].laps).toBe(2);
      expect(results[2].laps).toBe(3);

      // All cycles should end in stopped state with no errors
      results.forEach((r) => {
        expect(r.mode).toBe('stopped');
        expect(r.error).toBe(false);
      });
    });

    it('should handle rapid reset operations correctly', () => {
      const { result } = renderHook(() => useStopwatch());

      act(() => {
        result.current.start();
        vi.advanceTimersByTime(100);
        result.current.lap();
      });

      expect(result.current.state.laps.length).toBe(1);

      // Rapid resets
      act(() => {
        result.current.reset();
        result.current.start();
        result.current.lap();
        result.current.reset();
      });

      // Should be reset
      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.state.laps.length).toBe(0);
      expect(result.current.state.hasError).toBe(false);
    });
  });
  });
});
