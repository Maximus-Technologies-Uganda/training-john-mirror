/**
 * Stopwatch Type Definitions
 * 
 * Defines core types for the Stopwatch UI application including:
 * - StopwatchState: Internal state representation
 * - LapTime: Lap time recording
 * - StopwatchStatus: Public status information
 */

/**
 * Possible states of the stopwatch
 */
export type StopwatchMode = 'idle' | 'running' | 'stopped';

/**
 * Represents a single lap time recording
 */
export interface LapTime {
  /** Lap number (1-indexed) */
  lapNumber: number;
  /** Interval time for this lap in milliseconds */
  intervalMs: number;
  /** Cumulative time up to and including this lap in milliseconds */
  totalMs: number;
  /** Timestamp when lap was recorded (ISO string) */
  timestamp: string;
}

/**
 * Internal state of the stopwatch
 * Mirrors the core module state for UI synchronization
 */
export interface StopwatchState {
  /** Current mode of the stopwatch */
  mode: StopwatchMode;
  /** Total elapsed time in milliseconds */
  elapsedMs: number;
  /** Array of recorded lap times */
  laps: LapTime[];
  /** Whether there's a current error */
  hasError: boolean;
  /** Error message if hasError is true */
  errorMessage?: string;
  /** Timestamp when error occurred (for auto-dismiss) */
  errorTimestamp?: string;
}

/**
 * Public status information exposed to UI components
 * Derived from internal StopwatchState
 */
export interface StopwatchStatus {
  /** Whether the stopwatch is currently running */
  isRunning: boolean;
  /** Total elapsed time in milliseconds */
  elapsedMs: number;
  /** Formatted time string in MM:SS:MS format */
  formattedTime: string;
  /** Array of recorded laps */
  laps: LapTime[];
  /** Whether there's currently an error */
  hasError: boolean;
  /** Error message if hasError is true */
  errorMessage?: string;
}

/**
 * Configuration for stopwatch behavior
 */
export interface StopwatchConfig {
  /** Maximum elapsed time in milliseconds before capping at 99:59:99 */
  maxElapsedMs?: number;
  /** Threshold for enabling virtual scrolling in lap list */
  virtualScrollThreshold?: number;
  /** Auto-dismiss error after N milliseconds (0 = no auto-dismiss) */
  errorAutoDismissMs?: number;
  /** Update interval for display in milliseconds */
  updateIntervalMs?: number;
}

/**
 * Hook return type for useStopwatch
 */
export interface UseStopwatchReturn {
  /** Current stopwatch state */
  state: StopwatchState;
  /** Current public status */
  status: StopwatchStatus;
  
  /** Start the stopwatch */
  start: () => void;
  /** Stop the stopwatch */
  stop: () => void;
  /** Record a lap */
  lap: () => void;
  /** Reset the stopwatch to initial state */
  reset: () => void;
  /** Clear the current error */
  clearError: () => void;
}

/**
 * Stopwatch error types for better error handling
 */
export enum StopwatchErrorType {
  /** Already running when start was called */
  AlreadyRunning = 'ALREADY_RUNNING',
  /** Not running when stop was called */
  NotRunning = 'NOT_RUNNING',
  /** Attempted lap while stopwatch not running */
  CannotLapWhileStopped = 'CANNOT_LAP_WHILE_STOPPED',
  /** Invalid time value */
  InvalidTime = 'INVALID_TIME',
  /** Generic error */
  Unknown = 'UNKNOWN',
}

/**
 * Custom error for stopwatch operations
 */
export class StopwatchError extends Error {
  constructor(
    public type: StopwatchErrorType,
    message: string,
  ) {
    super(message);
    this.name = 'StopwatchError';
  }
}
