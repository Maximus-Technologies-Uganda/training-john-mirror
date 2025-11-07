/**
 * Tests for StopwatchDisplay Component
 * 
 * Tests that the component:
 * - Displays time in MM:SS:MS format
 * - Updates when elapsed time changes
 * - Handles edge cases (0ms, max time, etc.)
 * - Provides accessibility (ARIA labels)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock component (will be implemented in T024)
const StopwatchDisplay: React.FC<{ elapsedMs: number; isRunning: boolean }> = ({
  elapsedMs,
  isRunning,
}) => {
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Stopwatch display showing ${formatTime(elapsedMs)}`}
      data-testid="stopwatch-display"
    >
      {formatTime(elapsedMs)}
    </div>
  );
};

describe('StopwatchDisplay Component', () => {
  it('should display time in MM:SS:MS format', () => {
    render(<StopwatchDisplay elapsedMs={0} isRunning={false} />);
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('00:00:00');
  });

  it('should display 5 seconds as 00:05:00', () => {
    render(<StopwatchDisplay elapsedMs={5000} isRunning={false} />);
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('00:05:00');
  });

  it('should display 1 minute 5 seconds as 01:05:00', () => {
    render(<StopwatchDisplay elapsedMs={65000} isRunning={false} />);
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('01:05:00');
  });

  it('should display milliseconds correctly (5432ms = 00:05:43)', () => {
    render(<StopwatchDisplay elapsedMs={5432} isRunning={false} />);
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('00:05:43');
  });

  it('should display 1 minute 5 seconds 43 centiseconds (65430ms)', () => {
    render(<StopwatchDisplay elapsedMs={65430} isRunning={false} />);
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('01:05:43');
  });

  it('should cap time at maximum (99:59:99)', () => {
    render(<StopwatchDisplay elapsedMs={1000000} isRunning={false} />);
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('99:59:99');
  });

  it('should have accessibility role and aria-label', () => {
    render(<StopwatchDisplay elapsedMs={5000} isRunning={false} />);
    const display = screen.getByTestId('stopwatch-display');
    expect(display).toHaveAttribute('role', 'status');
    expect(display).toHaveAttribute('aria-live', 'polite');
    expect(display).toHaveAttribute('aria-label');
  });

  it('should update displayed time when elapsedMs prop changes', () => {
    const { rerender } = render(<StopwatchDisplay elapsedMs={0} isRunning={false} />);
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('00:00:00');

    rerender(<StopwatchDisplay elapsedMs={5000} isRunning={false} />);
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('00:05:00');
  });

  it('should handle negative time by displaying 00:00:00', () => {
    render(<StopwatchDisplay elapsedMs={-1000} isRunning={false} />);
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('00:00:00');
  });
});
