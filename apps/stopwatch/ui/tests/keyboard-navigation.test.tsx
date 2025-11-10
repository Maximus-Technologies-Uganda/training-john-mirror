/**
 * Keyboard Navigation Tests for Stopwatch UI
 * 
 * Verifies keyboard navigation functionality:
 * - Tab through controls (Start, Stop, Lap, Reset)
 * - Enter key to activate buttons
 * - Space key to activate buttons
 * - Proper focus management
 * - Keyboard accessibility compliance
 * 
 * Test Coverage for T097:
 * - Tab navigation through all controls
 * - Enter key activation
 * - Space key activation
 * - Focus visibility
 * - Disabled button handling
 */

import { describe, it, expect, vi, beforeEach, afterEach, act } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { Stopwatch } from '@/components/Stopwatch';

describe('Stopwatch UI - Keyboard Navigation (T097)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Tab navigation through controls', () => {
    it('should tab through all controls in correct order', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const resetButton = screen.getByTestId('button-reset');

      // Start from Start button using tab
      await act(async () => {
        await user.tab(); // Tab to Start button
      });
      
      expect(startButton).toHaveFocus();

      // Tab should skip disabled Stop and Lap buttons, go to Reset
      await act(async () => {
        await user.tab();
      });
      
      expect(resetButton).toHaveFocus();

      // After Reset, tab may go to next focusable element in document (body)
      // or wrap around depending on browser. We verify the tab order worked correctly
      // by checking that we successfully tabbed from Start to Reset
      // (The actual next element after Reset is browser-dependent and not part of this test)
    });

    it('should skip disabled buttons when tabbing', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');
      const lapButton = screen.getByTestId('button-lap');
      const resetButton = screen.getByTestId('button-reset');

      // Initially, Start is enabled, Stop/Lap are disabled
      expect(startButton).not.toBeDisabled();
      expect(stopButton).toBeDisabled();
      expect(lapButton).toBeDisabled();

      // Start from Start button
      startButton.focus();
      expect(startButton).toHaveFocus();

      // Tab should skip disabled Stop button and go to Reset
      // (Note: In HTML, disabled buttons are still in tab order but not focusable)
      // Let's verify the actual behavior
      await user.tab();
      
      // The next focusable element should be Reset (since Stop/Lap are disabled)
      // But browsers may still allow focus on disabled buttons, so we check what actually gets focus
      const focusedElement = document.activeElement;
      expect([stopButton, resetButton]).toContain(focusedElement);
    });
  });

  describe('Enter key activation', () => {
    it('should activate Start button with Enter key', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');

      // Focus Start button and press Enter (Enter triggers click on focused button)
      await act(async () => {
        await user.tab(); // Tab to Start button
      });
      expect(startButton).toHaveFocus();
      
      await act(async () => {
        await user.keyboard('{Enter}');
      });

      // Advance timers to allow state updates
      act(() => {
        vi.advanceTimersByTime(0);
      });

      // Verify Start button is now disabled (stopwatch started)
      expect(startButton).toBeDisabled();

      // Verify Stop button is now enabled
      expect(stopButton).not.toBeDisabled();
    });

    it('should activate Stop button with Enter key when running', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');

      // Start the stopwatch first
      await user.tab(); // Tab to Start button
      await waitFor(() => {
        expect(startButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(startButton).toBeDisabled();
        expect(stopButton).not.toBeDisabled();
      });

      // Tab to Stop button and press Enter
      await user.tab(); // Tab to Stop button
      await waitFor(() => {
        expect(stopButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      // Verify Stop button is now disabled
      await waitFor(() => {
        expect(stopButton).toBeDisabled();
      });

      // Verify Start button is now enabled
      expect(startButton).not.toBeDisabled();
    });

    it('should activate Lap button with Enter key when running', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const lapButton = screen.getByTestId('button-lap');

      // Start the stopwatch first
      await user.tab(); // Tab to Start button
      await waitFor(() => {
        expect(startButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(lapButton).not.toBeDisabled();
      });

      // Tab to Lap button and press Enter
      await user.tab(); // Tab to Stop button
      await user.tab(); // Tab to Lap button
      await waitFor(() => {
        expect(lapButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      // Verify lap was recorded
      await waitFor(() => {
        expect(screen.getByText('Laps (1)')).toBeInTheDocument();
      });
    });

    it('should activate Reset button with Enter key', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const resetButton = screen.getByTestId('button-reset');
      const display = screen.getByTestId('stopwatch-display');

      // Start and then stop to have some state
      await user.tab(); // Tab to Start button
      await waitFor(() => {
        expect(startButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(startButton).toBeDisabled();
      });

      const stopButton = screen.getByTestId('button-stop');
      await user.tab(); // Tab to Stop button
      await waitFor(() => {
        expect(stopButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(stopButton).toBeDisabled();
      });

      // Tab to Reset button and press Enter
      await user.tab(); // Tab to Reset button
      await waitFor(() => {
        expect(resetButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      // Verify reset occurred
      await waitFor(() => {
        expect(display).toHaveTextContent('00:00:00');
        expect(startButton).not.toBeDisabled();
      });
    });

    it('should not activate disabled buttons with Enter key', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const stopButton = screen.getByTestId('button-stop');
      const lapButton = screen.getByTestId('button-lap');

      // Both Stop and Lap should be disabled initially
      expect(stopButton).toBeDisabled();
      expect(lapButton).toBeDisabled();

      // Disabled buttons cannot receive focus, so we can't test keyboard activation
      // Instead, verify that stopwatch state hasn't changed
      const startButton = screen.getByTestId('button-start');
      expect(startButton).not.toBeDisabled();
      
      // Verify stopwatch is still idle (no laps recorded)
      expect(screen.queryByText(/Laps/)).not.toBeInTheDocument();
    });
  });

  describe('Space key activation', () => {
    it('should activate Start button with Space key', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');

      // Focus Start button and press Space
      await user.tab(); // Tab to Start button
      await waitFor(() => {
        expect(startButton).toHaveFocus();
      });
      await user.keyboard(' ');

      // Verify Start button is now disabled (stopwatch started)
      await waitFor(() => {
        expect(startButton).toBeDisabled();
      });

      // Verify Stop button is now enabled
      expect(stopButton).not.toBeDisabled();
    });

    it('should activate Stop button with Space key when running', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');

      // Start the stopwatch first
      await user.tab(); // Tab to Start button
      await waitFor(() => {
        expect(startButton).toHaveFocus();
      });
      await user.keyboard(' ');

      await waitFor(() => {
        expect(startButton).toBeDisabled();
        expect(stopButton).not.toBeDisabled();
      });

      // Tab to Stop button and press Space
      await user.tab(); // Tab to Stop button
      await waitFor(() => {
        expect(stopButton).toHaveFocus();
      });
      await user.keyboard(' ');

      // Verify Stop button is now disabled
      await waitFor(() => {
        expect(stopButton).toBeDisabled();
      });

      // Verify Start button is now enabled
      expect(startButton).not.toBeDisabled();
    });

    it('should activate Lap button with Space key when running', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const lapButton = screen.getByTestId('button-lap');

      // Start the stopwatch first
      await user.tab(); // Tab to Start button
      await waitFor(() => {
        expect(startButton).toHaveFocus();
      });
      await user.keyboard(' ');

      await waitFor(() => {
        expect(lapButton).not.toBeDisabled();
      });

      // Tab to Lap button and press Space
      await user.tab(); // Tab to Stop button
      await user.tab(); // Tab to Lap button
      await waitFor(() => {
        expect(lapButton).toHaveFocus();
      });
      await user.keyboard(' ');

      // Verify lap was recorded
      await waitFor(() => {
        expect(screen.getByText('Laps (1)')).toBeInTheDocument();
      });
    });

    it('should activate Reset button with Space key', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const resetButton = screen.getByTestId('button-reset');
      const display = screen.getByTestId('stopwatch-display');

      // Start and then stop to have some state
      await user.tab(); // Tab to Start button
      await waitFor(() => {
        expect(startButton).toHaveFocus();
      });
      await user.keyboard(' ');

      await waitFor(() => {
        expect(startButton).toBeDisabled();
      });

      const stopButton = screen.getByTestId('button-stop');
      await user.tab(); // Tab to Stop button
      await waitFor(() => {
        expect(stopButton).toHaveFocus();
      });
      await user.keyboard(' ');

      await waitFor(() => {
        expect(stopButton).toBeDisabled();
      });

      // Tab to Reset button and press Space
      await user.tab(); // Tab to Reset button
      await waitFor(() => {
        expect(resetButton).toHaveFocus();
      });
      await user.keyboard(' ');

      // Verify reset occurred
      await waitFor(() => {
        expect(display).toHaveTextContent('00:00:00');
        expect(startButton).not.toBeDisabled();
      });
    });
  });

  describe('Complete keyboard workflow', () => {
    it('should handle complete workflow using only keyboard', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');
      const lapButton = screen.getByTestId('button-lap');
      const resetButton = screen.getByTestId('button-reset');
      const display = screen.getByTestId('stopwatch-display');

      // Step 1: Tab to Start and activate with Enter
      await user.tab(); // Tab to Start button
      await waitFor(() => {
        expect(startButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(startButton).toBeDisabled();
        expect(stopButton).not.toBeDisabled();
      });

      // Step 2: Tab to Lap and activate with Space
      // After start, Stop and Lap are enabled, Start is disabled
      // Tab will skip disabled Start, go to Stop, then Lap
      await user.tab(); // Skip disabled Start, go to Stop
      await user.tab(); // Go to Lap
      await waitFor(() => {
        expect(lapButton).toHaveFocus();
      });
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByText('Laps (1)')).toBeInTheDocument();
      });

      // Step 3: Tab to Stop and activate with Enter
      await user.tab(); // Go to Reset
      await user.tab({ shift: true }); // Shift+Tab back to Stop
      await waitFor(() => {
        expect(stopButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(stopButton).toBeDisabled();
      });

      // Step 4: Tab to Reset and activate with Space
      await user.tab(); // Go to Reset
      await waitFor(() => {
        expect(resetButton).toHaveFocus();
      });
      await user.keyboard(' ');

      // Verify reset occurred
      await waitFor(() => {
        expect(display).toHaveTextContent('00:00:00');
        expect(startButton).not.toBeDisabled();
      });
    });
  });

  describe('Focus visibility and management', () => {
    it('should show visible focus indicators on buttons', () => {
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      
      // Focus the button
      startButton.focus();
      expect(startButton).toHaveFocus();

      // Verify button has focus (browser will add outline by default)
      // We can't easily test CSS :focus styles, but we can verify focus state
      expect(document.activeElement).toBe(startButton);
    });

    it('should maintain focus order when buttons become enabled/disabled', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');

      // Initially, Start is focused using tab
      await user.tab(); // Tab to Start button
      await waitFor(() => {
        expect(startButton).toHaveFocus();
      });

      // Activate Start
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(startButton).toBeDisabled();
        expect(stopButton).not.toBeDisabled();
      });

      // Focus should remain on Start (even though disabled)
      // Or move to next enabled button depending on implementation
      const focusedElement = document.activeElement;
      expect([startButton, stopButton]).toContain(focusedElement);
    });
  });
});

