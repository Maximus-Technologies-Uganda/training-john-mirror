import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup, render as rtlRender } from '@testing-library/react';
import type {
  StopwatchState,
  LapTime,
  StopwatchStatus,
  UseStopwatchReturn,
} from '@/types/stopwatch';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ============================================================================
// TEST FIXTURES & FACTORIES
// ============================================================================

/**
 * Creates a mock StopwatchState for testing
 * @param overrides - Partial state to override defaults
 */
export const createMockStopwatchState = (
  overrides?: Partial<StopwatchState>
): StopwatchState => ({
  mode: 'idle',
  elapsedMs: 0,
  laps: [],
  hasError: false,
  ...overrides,
});

/**
 * Creates a mock LapTime for testing
 * @param lapNumber - Lap number (1-indexed)
 * @param intervalMs - Interval time for this lap
 * @param totalMs - Cumulative total time
 */
export const createMockLapTime = (
  lapNumber: number,
  intervalMs: number,
  totalMs: number
): LapTime => ({
  lapNumber,
  intervalMs,
  totalMs,
  timestamp: new Date().toISOString(),
});

/**
 * Creates multiple mock laps for testing
 * Each lap increases by 1 second interval
 */
export const createMockLaps = (count: number): LapTime[] => {
  const laps: LapTime[] = [];
  let totalMs = 0;
  for (let i = 1; i <= count; i++) {
    const intervalMs = 1000 * i; // Each lap adds progressively more time
    totalMs += intervalMs;
    laps.push(createMockLapTime(i, intervalMs, totalMs));
  }
  return laps;
};

/**
 * Creates a mock StopwatchStatus for testing
 * Derived status (calculated from state)
 */
export const createMockStopwatchStatus = (
  overrides?: Partial<StopwatchStatus>
): StopwatchStatus => ({
  isRunning: false,
  elapsedMs: 0,
  formattedTime: '00:00:00',
  laps: [],
  hasError: false,
  ...overrides,
});

/**
 * Creates a mock UseStopwatchReturn for testing
 * Complete hook return value with all functions mocked
 */
export const createMockUseStopwatch = (
  overrides?: Partial<UseStopwatchReturn>
): UseStopwatchReturn => ({
  state: createMockStopwatchState(),
  status: createMockStopwatchStatus(),
  start: vi.fn(),
  stop: vi.fn(),
  lap: vi.fn(),
  reset: vi.fn(),
  clearError: vi.fn(),
  ...overrides,
});

// ============================================================================
// CUSTOM RENDER FUNCTION
// ============================================================================

interface RenderOptions {
  [key: string]: any;
}

/**
 * Custom render function with common providers/setup
 * Use this instead of RTL's render for consistency
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  return rtlRender(ui, { ...options });
};

// ============================================================================
// RE-EXPORTS FOR TEST CONVENIENCE
// ============================================================================

// Re-export React Testing Library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
