/**
 * StopwatchControls Component
 * 
 * Provides control buttons for the stopwatch (Start, Stop, Lap, Reset).
 * Fully functional for User Stories 1 & 2 (Start, Lap, Stop, Reset).
 * 
 * Features:
 * - Start button to begin/resume timing
 * - Lap button to record lap times (only enabled while running)
 * - Stop button to pause timing
 * - Reset button to clear all data
 * - Disabled states based on stopwatch mode
 * - Accessible keyboard navigation (Enter/Space)
 * - ARIA labels for screen readers
 * - Color-coded buttons for visual hierarchy
 */

import React from 'react';

export interface StopwatchControlsProps {
  /** Whether the stopwatch is currently running */
  isRunning: boolean;
  /** Callback when Start button clicked */
  onStart: () => void;
  /** Callback when Stop button clicked */
  onStop?: () => void;
  /** Callback when Lap button clicked */
  onLap?: () => void;
  /** Callback when Reset button clicked */
  onReset?: () => void;
  /** Current stopwatch mode */
  mode?: 'idle' | 'running' | 'stopped';
  /** Optional CSS class */
  className?: string;
}

/**
 * StopwatchControls Component
 * 
 * Renders control buttons for stopwatch operations.
 * Manages button states based on stopwatch mode.
 */
export const StopwatchControls: React.FC<StopwatchControlsProps> = ({
  isRunning,
  onStart,
  onStop,
  onLap,
  onReset,
  mode = 'idle',
  className = '',
}) => {
  const handleStartClick = () => {
    onStart();
  };

  const handleStopClick = () => {
    onStop?.();
  };

  const handleLapClick = () => {
    onLap?.();
  };

  const handleResetClick = () => {
    onReset?.();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent,
    disabled: boolean,
    handler: () => void
  ) => {
    if (disabled) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handler();
    }
  };

  return (
    <div
      className={`stopwatch-controls ${className}`}
      role="group"
      aria-label="Stopwatch controls"
      style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '16px',
      }}
    >
      {/* Start Button */}
      <button
        onClick={handleStartClick}
        onKeyDown={(e) => handleKeyDown(e, isRunning, handleStartClick)}
        aria-label={isRunning ? 'Start button disabled (stopwatch already running)' : 'Start stopwatch'}
        disabled={isRunning}
        type="button"
        data-testid="button-start"
        style={{
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: 'bold',
          backgroundColor: isRunning ? '#4CAF50' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          opacity: isRunning ? 0.6 : 1,
          transition: 'background-color 0.2s, opacity 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isRunning) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0b7dda';
          }
        }}
        onMouseLeave={(e) => {
          if (!isRunning) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2196F3';
          }
        }}
      >
        {isRunning ? 'Running' : 'Start'}
      </button>

      {/* Stop Button */}
      {onStop && (
        <button
          onClick={handleStopClick}
          onKeyDown={(e) => handleKeyDown(e, !isRunning, handleStopClick)}
          aria-label="Stop stopwatch"
          disabled={!isRunning}
          type="button"
          data-testid="button-stop"
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRunning ? 'pointer' : 'not-allowed',
            opacity: isRunning ? 1 : 0.6,
            transition: 'background-color 0.2s, opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            if (isRunning) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#da190b';
            }
          }}
          onMouseLeave={(e) => {
            if (isRunning) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f44336';
            }
          }}
        >
          Stop
        </button>
      )}

      {/* Lap Button */}
      {onLap && (
        <button
          onClick={handleLapClick}
          onKeyDown={(e) => handleKeyDown(e, false, handleLapClick)}
          aria-label="Record lap"
          type="button"
          data-testid="button-lap"
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isRunning ? 1 : 0.6,
            transition: 'background-color 0.2s, opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            if (isRunning) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e68900';
            }
          }}
          onMouseLeave={(e) => {
            if (isRunning) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FF9800';
            }
          }}
        >
          Lap
        </button>
      )}

      {/* Reset Button */}
      {onReset && (
        <button
          onClick={handleResetClick}
          onKeyDown={(e) => handleKeyDown(e, false, handleResetClick)}
          aria-label="Reset stopwatch"
          disabled={false}
          type="button"
          data-testid="button-reset"
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#9C27B0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#7b1fa2';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#9C27B0';
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
};

StopwatchControls.displayName = 'StopwatchControls';
