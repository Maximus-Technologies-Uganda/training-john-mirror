/**
 * StopwatchDisplay Component
 * 
 * Displays the elapsed time in MM:SS:MS format.
 * Features:
 * - Real-time display updates
 * - MM:SS:MS format (minutes:seconds:centiseconds)
 * - Accessible with ARIA labels
 * - Proper role and live region for screen readers
 */

import React from 'react';
import { formatTime } from '../utils/formatting';

export interface StopwatchDisplayProps {
  /** Elapsed time in milliseconds */
  elapsedMs: number;
  /** Whether the stopwatch is currently running */
  isRunning?: boolean;
  /** Optional CSS class for styling */
  className?: string;
  /** Optional test id for testing */
  dataTestId?: string;
}

/**
 * StopwatchDisplay Component
 * 
 * Renders elapsed time in MM:SS:MS format with accessibility features.
 * Updates in real-time as time changes.
 */
export const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({
  elapsedMs,
  isRunning = false,
  className = '',
  dataTestId = 'stopwatch-display',
}) => {
  const formattedTime = formatTime(elapsedMs);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Stopwatch display showing ${formattedTime}${isRunning ? ' and running' : ''}`}
      data-testid={dataTestId}
      className={`stopwatch-display ${className}`}
      style={{
        fontSize: '48px',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '2px',
      }}
    >
      {formattedTime}
    </div>
  );
};

StopwatchDisplay.displayName = 'StopwatchDisplay';
