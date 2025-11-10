/**
 * Stopwatch Container Component
 * 
 * Integrates all stopwatch sub-components:
 * - StopwatchDisplay: Shows elapsed time in MM:SS:MS format
 * - StopwatchControls: Start, Stop, Lap, Reset buttons
 * - LapList: Virtual scrolling list of recorded laps
 * - ErrorBanner: Inline error messages with auto-dismiss
 * 
 * Manages complete state flow for User Stories 1-4:
 * US1: Start and track time
 * US2: Record and view laps
 * US3: Stop and reset
 * US4: Handle invalid state transitions with error messages
 */

import React from 'react';
import { useStopwatch } from '@/hooks/useStopwatch';
import { StopwatchDisplay } from './StopwatchDisplay';
import { StopwatchControls } from './StopwatchControls';
import { LapList } from './LapList';
import { ErrorBanner } from './ErrorBanner';

export interface StopwatchProps {
  /** Optional CSS class for container */
  className?: string;
  /** Auto-dismiss error after N milliseconds (default: 5000) */
  autoDismissErrorMs?: number;
  /** Update interval in milliseconds (default: 100) */
  updateIntervalMs?: number;
}

/**
 * Stopwatch Container Component
 * 
 * Combines all stopwatch functionality into a single cohesive component.
 * Manages state orchestration and user interactions.
 * 
 * @example
 * const App = () => {
 *   return (
 *     <div>
 *       <h1>My Stopwatch</h1>
 *       <Stopwatch />
 *     </div>
 *   );
 * };
 */
export const Stopwatch: React.FC<StopwatchProps> = ({
  className = '',
  autoDismissErrorMs = 5000,
  updateIntervalMs = 100,
}) => {
  const {
    status,
    start,
    stop,
    lap,
    reset,
    clearError,
  } = useStopwatch(autoDismissErrorMs, updateIntervalMs);

  return (
    <div
      className={`stopwatch-container ${className}`}
      role="region"
      aria-label="Stopwatch application"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '32px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {/* Page Title */}
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
        Stopwatch
      </h1>

      {/* Error Banner - Displayed above time display */}
      {status.hasError && (
        <ErrorBanner
          status={status}
          onClearError={clearError}
          autoDismissMs={autoDismissErrorMs}
        />
      )}

      {/* Time Display - Large, prominent */}
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '32px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <StopwatchDisplay elapsedMs={status.elapsedMs} isRunning={status.isRunning} />
      </div>

      {/* Control Buttons */}
      <StopwatchControls
        isRunning={status.isRunning}
        onStart={start}
        onStop={stop}
        onLap={lap}
        onReset={reset}
      />

      {/* Lap List - Shows recorded laps with virtual scrolling for >50 laps */}
      {status.laps && status.laps.length > 0 && (
        <div
          role="region"
          aria-label="Lap list"
          aria-live="polite"
          style={{
            width: '100%',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: 0 }}>
            Laps ({status.laps.length})
          </h2>
          <LapList laps={status.laps} />
        </div>
      )}

      {/* Empty State Message */}
      {(!status.laps || status.laps.length === 0) && (
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            color: '#999',
            padding: '32px',
          }}
        >
          <p>No laps recorded yet. Click Start and then Lap to record times.</p>
        </div>
      )}
    </div>
  );
};

Stopwatch.displayName = 'Stopwatch';

