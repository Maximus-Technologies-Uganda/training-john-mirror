/**
 * Tests for Stopwatch Container Component
 * 
 * Integration tests verifying all sub-components work together:
 * - Display updates correctly
 * - Controls respond to user input
 * - Laps display and update
 * - Errors appear and auto-dismiss
 * 
 * Tests for T053 (Stopwatch container) and T090 (Final integration)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import { Stopwatch } from '@/components/Stopwatch';

describe('Stopwatch Container Component (T053, T090)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set a fixed system time so Date.now() advances with fake timers
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Component rendering', () => {
    it('should render all major sections', () => {
      render(<Stopwatch />);

      expect(screen.getByText('Stopwatch')).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Stopwatch application' })).toBeInTheDocument();
      expect(screen.getByTestId('stopwatch-display')).toBeInTheDocument();
      expect(screen.getByTestId('button-start')).toBeInTheDocument();
      expect(screen.getByTestId('button-stop')).toBeInTheDocument();
      expect(screen.getByTestId('button-lap')).toBeInTheDocument();
      expect(screen.getByTestId('button-reset')).toBeInTheDocument();
    });

    it('should display empty state initially', () => {
      render(<Stopwatch />);
      expect(screen.getByText(/No laps recorded/)).toBeInTheDocument();
    });

    it('should have initial time display of 00:00:00', () => {
      render(<Stopwatch />);
      expect(screen.getByTestId('stopwatch-display')).toHaveTextContent('00:00:00');
    });
  });

  describe('Start/Stop workflow', () => {
    it('should start stopwatch and update display', () => {
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const display = screen.getByTestId('stopwatch-display');
      const stopButton = screen.getByTestId('button-stop');

      act(() => {
        fireEvent.click(startButton);
      });

      expect(startButton).toBeDisabled();
      expect(stopButton).not.toBeDisabled();
      expect(display).toHaveTextContent('00:00:00');

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      // After advancing timers, the display should have updated
      expect(display).not.toHaveTextContent('00:00:00');
    });

    it('should stop stopwatch and freeze display', () => {
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');
      const display = screen.getByTestId('stopwatch-display');

      act(() => {
        fireEvent.click(startButton);
      });
      
      act(() => {
        vi.advanceTimersByTime(500);
      });
      
      const timeWhenRunning = display.textContent;
      expect(timeWhenRunning).not.toBe('00:00:00');

      act(() => {
        fireEvent.click(stopButton);
      });
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Time should be frozen (same as when stopped)
      expect(display.textContent).toBe(timeWhenRunning);
      expect(stopButton).toBeDisabled();
    });
  });

  describe('Lap recording', () => {
    it('should record laps while running', () => {
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const lapButton = screen.getByTestId('button-lap');

      act(() => {
        fireEvent.click(startButton);
      });
      
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      expect(startButton).toBeDisabled();
      
      act(() => {
        fireEvent.click(lapButton);
      });
      
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      act(() => {
        fireEvent.click(lapButton);
      });

      expect(screen.getByText('Laps (2)')).toBeInTheDocument();
    });

    it('should not record laps when not running', () => {
      render(<Stopwatch />);

      const lapButton = screen.getByTestId('button-lap');

      // Try to lap without starting
      act(() => {
        fireEvent.click(lapButton);
      });

      expect(screen.queryByText('Laps')).not.toBeInTheDocument();
      expect(screen.getByText(/No laps recorded/)).toBeInTheDocument();
    });
  });

  describe('Reset functionality', () => {
    it('should reset time and laps', () => {
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const lapButton = screen.getByTestId('button-lap');
      const resetButton = screen.getByTestId('button-reset');
      const display = screen.getByTestId('stopwatch-display');

      // Start, record lap, reset
      act(() => {
        fireEvent.click(startButton);
      });
      
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      expect(startButton).toBeDisabled();
      
      act(() => {
        fireEvent.click(lapButton);
      });
      
      expect(screen.getByText(/Laps/)).toBeInTheDocument();
      
      act(() => {
        fireEvent.click(resetButton);
      });

      expect(display).toHaveTextContent('00:00:00');
      expect(screen.queryByText('Laps')).not.toBeInTheDocument();
      expect(screen.getByText(/No laps recorded/)).toBeInTheDocument();
    });

    it('should re-enable start button after reset', () => {
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const resetButton = screen.getByTestId('button-reset');

      act(() => {
        fireEvent.click(startButton);
      });
      
      expect(startButton).toBeDisabled();

      act(() => {
        fireEvent.click(resetButton);
      });
      
      expect(startButton).not.toBeDisabled();
    });
  });

  describe('Error handling', () => {
    it('should display error when attempting invalid operation', async () => {
      render(<Stopwatch />);

      const lapButton = screen.getByTestId('button-lap');

      // Try to lap without starting - wrap in act to ensure React processes updates
      act(() => {
        fireEvent.click(lapButton);
      });

      // Force React to flush all pending updates synchronously
      // This ensures the state update from the hook is processed and component re-renders
      ReactDOM.flushSync(() => {
        // Empty callback - just forces flush
      });

      // Advance timers to allow useEffect to run (if any)
      act(() => {
        vi.advanceTimersByTime(0);
        vi.runOnlyPendingTimers();
      });

      // Flush again after timers
      ReactDOM.flushSync(() => {
        // Empty callback - just forces flush
      });

      // Error banner should be visible - status.hasError should be true
      // which causes ErrorBanner to render
      const errorMessage = screen.queryByText(/Cannot lap before starting/i);
      if (!errorMessage) {
        // Debug: log what's actually in the DOM
        screen.debug();
        throw new Error('Error message not found in DOM');
      }
      
      expect(errorMessage).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should auto-dismiss errors', async () => {
      render(<Stopwatch autoDismissErrorMs={100} />);

      const lapButton = screen.getByTestId('button-lap');

      act(() => {
        fireEvent.click(lapButton);
      });

      // Flush React updates and advance timers to allow useEffect to run
      act(() => {
        vi.advanceTimersByTime(0);
      });
      
      // Run all pending timers to process React effects
      act(() => {
        vi.runOnlyPendingTimers();
      });

      // Error banner should be visible
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Advance time past auto-dismiss timeout (100ms)
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Run pending timers to trigger auto-dismiss
      act(() => {
        vi.runOnlyPendingTimers();
      });

      // Advance time for fade-out animation (300ms)
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Run pending timers to complete fade-out
      act(() => {
        vi.runOnlyPendingTimers();
      });

      // Error should be dismissed
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should clear error on dismiss', async () => {
      render(<Stopwatch />);

      const lapButton = screen.getByTestId('button-lap');

      act(() => {
        fireEvent.click(lapButton);
      });

      // Flush React updates and advance timers to allow useEffect to run
      act(() => {
        vi.advanceTimersByTime(0);
      });
      
      // Run all pending timers to process React effects
      act(() => {
        vi.runOnlyPendingTimers();
      });

      // Error banner should be visible
      expect(screen.getByRole('alert')).toBeInTheDocument();

      const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
      act(() => {
        fireEvent.click(dismissButton);
      });

      // Flush React updates
      act(() => {
        vi.advanceTimersByTime(0);
      });

      // Advance timers for fade-out animation (300ms)
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Run pending timers to complete fade-out
      act(() => {
        vi.runOnlyPendingTimers();
      });

      // Error should be cleared
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Complete workflows', () => {
    it('should handle full workflow: Start → Lap → Lap → Stop → Reset', () => {
      render(<Stopwatch />);

      const startBtn = screen.getByTestId('button-start');
      const lapBtn = screen.getByTestId('button-lap');
      const stopBtn = screen.getByTestId('button-stop');
      const resetBtn = screen.getByTestId('button-reset');
      const display = screen.getByTestId('stopwatch-display');

      // Start
      act(() => {
        fireEvent.click(startBtn);
      });
      
      expect(startBtn).toBeDisabled();
      expect(display).toHaveTextContent('00:00:00');

      // Wait and lap
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      expect(display.textContent).not.toBe('00:00:00');
      
      act(() => {
        fireEvent.click(lapBtn);
      });
      
      expect(screen.getByText('Laps (1)')).toBeInTheDocument();

      // Wait and lap again
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      act(() => {
        fireEvent.click(lapBtn);
      });
      
      expect(screen.getByText('Laps (2)')).toBeInTheDocument();

      // Stop
      act(() => {
        fireEvent.click(stopBtn);
      });
      
      expect(stopBtn).toBeDisabled();
      
      const timeWhenStopped = display.textContent;

      // Verify time doesn't change after stop
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      expect(display.textContent).toBe(timeWhenStopped);

      // Reset
      act(() => {
        fireEvent.click(resetBtn);
      });
      
      expect(display).toHaveTextContent('00:00:00');
      expect(screen.queryByText('Laps')).not.toBeInTheDocument();
      expect(startBtn).not.toBeDisabled();
    });

    it('should handle error then successful operation flow', async () => {
      render(<Stopwatch />);

      const startBtn = screen.getByTestId('button-start');
      const lapBtn = screen.getByTestId('button-lap');

      // Try to lap without starting - should error
      act(() => {
        fireEvent.click(lapBtn);
      });
      
      // Flush React updates and advance timers to allow useEffect to run
      act(() => {
        vi.advanceTimersByTime(0);
      });
      
      // Run all pending timers to process React effects
      act(() => {
        vi.runOnlyPendingTimers();
      });

      // Error banner should be visible
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Start the stopwatch - error should clear
      act(() => {
        fireEvent.click(startBtn);
      });

      // Flush React updates
      act(() => {
        vi.advanceTimersByTime(0);
      });

      // Advance timers for fade-out animation (300ms)
      act(() => {
        vi.advanceTimersByTime(300);
      });

      // Run pending timers to complete fade-out
      act(() => {
        vi.runOnlyPendingTimers();
      });
      
      // Error should be cleared
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      // Now lap should work
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      act(() => {
        fireEvent.click(lapBtn);
      });

      // Flush React updates
      act(() => {
        vi.advanceTimersByTime(0);
      });
      
      // Run all pending timers to process React effects
      act(() => {
        vi.runOnlyPendingTimers();
      });

      // Lap should appear
      expect(screen.getByText('Laps (1)')).toBeInTheDocument();
    });

    it('should handle rapid Start-Stop cycles', () => {
      render(<Stopwatch />);

      const startBtn = screen.getByTestId('button-start');
      const stopBtn = screen.getByTestId('button-stop');
      const resetBtn = screen.getByTestId('button-reset');
      const display = screen.getByTestId('stopwatch-display');

      // First cycle
      act(() => {
        fireEvent.click(startBtn);
      });
      
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      expect(display.textContent).not.toBe('00:00:00');
      
      act(() => {
        fireEvent.click(stopBtn);
      });

      // Reset
      act(() => {
        fireEvent.click(resetBtn);
      });
      
      expect(display).toHaveTextContent('00:00:00');

      // Second cycle
      act(() => {
        fireEvent.click(startBtn);
      });
      
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      act(() => {
        fireEvent.click(stopBtn);
      });

      // Should have time recorded
      expect(display.textContent).not.toBe('00:00:00');
    });
  });

  describe('Keyboard navigation', () => {
    it('should handle keyboard controls', async () => {
      render(<Stopwatch />);

      const startBtn = screen.getByTestId('button-start');
      const resetBtn = screen.getByTestId('button-reset');

      // Start with keyboard
      act(() => {
        startBtn.focus();
      });
      
      expect(startBtn).toHaveFocus();

      // Tab should skip disabled buttons, go to Reset
      const user = userEvent.setup({ delay: null });
      await user.tab();
      
      expect(resetBtn).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Stopwatch />);

      expect(screen.getByRole('region', { name: 'Stopwatch application' })).toBeInTheDocument();
      expect(screen.getByTestId('button-start')).toHaveAttribute('aria-label');
      expect(screen.getByTestId('button-stop')).toHaveAttribute('aria-label');
      expect(screen.getByTestId('button-lap')).toHaveAttribute('aria-label');
      expect(screen.getByTestId('button-reset')).toHaveAttribute('aria-label');
    });

    it('should announce errors to screen readers', async () => {
      render(<Stopwatch />);

      const lapBtn = screen.getByTestId('button-lap');
      
      act(() => {
        fireEvent.click(lapBtn);
      });

      // Flush React updates and advance timers to allow useEffect to run
      act(() => {
        vi.advanceTimersByTime(0);
      });
      
      // Run all pending timers to process React effects
      act(() => {
        vi.runOnlyPendingTimers();
      });

      // Error banner should be visible with proper ARIA attributes
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
  });
});
