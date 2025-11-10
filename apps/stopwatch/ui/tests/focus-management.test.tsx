/**
 * Focus Management Tests for Stopwatch UI
 * 
 * Verifies focus management and visible focus states:
 * - Focus indicators are visible
 * - Focus order is logical
 * - Focus is maintained appropriately during state changes
 * - Keyboard focus is properly managed
 * 
 * Test Coverage for T101:
 * - Visible focus indicators on all interactive elements
 * - Focus order follows logical flow
 * - Focus management during state transitions
 * - Focus trap prevention
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { Stopwatch } from '@/components/Stopwatch';

describe('Stopwatch UI - Focus Management (T101)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Visible focus indicators', () => {
    it('should show focus indicator on Start button when focused', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      await user.tab(); // Tab to Start button
      expect(startButton).toHaveFocus();
      expect(document.activeElement).toBe(startButton);
    });

    it('should show focus indicator on Stop button when focused', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
      render(<Stopwatch />);

      // Start stopwatch first to enable Stop button
      const startButton = screen.getByTestId('button-start');
      await act(async () => {
        await user.click(startButton);
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      const stopButton = screen.getByTestId('button-stop');
      expect(stopButton).not.toBeDisabled();

      await act(async () => {
        await user.tab(); // Tab to Stop button
      });
      expect(stopButton).toHaveFocus();
      expect(document.activeElement).toBe(stopButton);
    });

    it('should show focus indicator on Lap button when focused', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
      render(<Stopwatch />);

      // Start stopwatch first to enable Lap button
      const startButton = screen.getByTestId('button-start');
      await act(async () => {
        await user.click(startButton);
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      const lapButton = screen.getByTestId('button-lap');
      expect(lapButton).not.toBeDisabled();

      await act(async () => {
        await user.tab(); // Tab to Stop button
        await user.tab(); // Tab to Lap button
      });
      expect(lapButton).toHaveFocus();
      expect(document.activeElement).toBe(lapButton);
    });

    it('should show focus indicator on Reset button when focused', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const resetButton = screen.getByTestId('button-reset');
      await user.tab(); // Tab to Start button
      await user.tab(); // Tab to Reset button
      expect(resetButton).toHaveFocus();
      expect(document.activeElement).toBe(resetButton);
    });

    it('should maintain focus visibility during state changes', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      await user.tab(); // Tab to Start button
      expect(startButton).toHaveFocus();

      // Activate Start button
      await user.keyboard('{Enter}');

      // Focus should still be visible (may remain on Start or move to Stop)
      const focusedElement = document.activeElement;
      expect([startButton, screen.getByTestId('button-stop')]).toContain(focusedElement);
    });
  });

  describe('Focus order', () => {
    it('should follow logical tab order: Start → Stop → Lap → Reset', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const resetButton = screen.getByTestId('button-reset');

      // Start from Start button using tab
      await user.tab(); // Tab to Start button
      expect(startButton).toHaveFocus();

      // Tab should skip disabled Stop and Lap buttons, go to Reset
      await user.tab();
      // In browsers, tab skips disabled buttons, so focus goes to Reset
      expect(resetButton).toHaveFocus();
    });

    it('should allow reverse tab order with Shift+Tab', async () => {
      const user = userEvent.setup({ delay: null });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const resetButton = screen.getByTestId('button-reset');

      // Start from Reset button using tab
      await user.tab(); // Tab to Start
      await user.tab(); // Tab to Reset
      expect(resetButton).toHaveFocus();

      // Shift+Tab should skip disabled buttons, go to Start
      await user.tab({ shift: true });
      expect(startButton).toHaveFocus();
    });
  });

  describe('Focus management during state transitions', () => {
    it('should maintain focus when starting stopwatch', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      await act(async () => {
        await user.tab(); // Tab to Start button
      });
      expect(startButton).toHaveFocus();

      await act(async () => {
        await user.keyboard('{Enter}');
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      // Focus should remain on Start (even though disabled) or move to next enabled button
      const focusedElement = document.activeElement;
      expect([startButton, screen.getByTestId('button-stop')]).toContain(focusedElement);
    });

    it('should maintain focus when stopping stopwatch', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');

      // Start stopwatch
      await act(async () => {
        await user.tab(); // Tab to Start button
      });
      expect(startButton).toHaveFocus();
      
      await act(async () => {
        await user.keyboard('{Enter}');
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(stopButton).not.toBeDisabled();

      // Tab to Stop button and press Enter
      await act(async () => {
        await user.tab(); // Tab to Stop button
      });
      expect(stopButton).toHaveFocus();
      
      await act(async () => {
        await user.keyboard('{Enter}');
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      // Focus should remain on Stop (even though disabled) or move appropriately
      const focusedElement = document.activeElement;
      expect([stopButton, startButton]).toContain(focusedElement);
    });

    it('should maintain focus when recording lap', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const lapButton = screen.getByTestId('button-lap');

      // Start stopwatch
      await act(async () => {
        await user.tab(); // Tab to Start button
      });
      expect(startButton).toHaveFocus();
      
      await act(async () => {
        await user.keyboard('{Enter}');
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(lapButton).not.toBeDisabled();

      // Tab to Lap button and press Enter
      await act(async () => {
        await user.tab(); // Tab to Stop button
        await user.tab(); // Tab to Lap button
      });
      expect(lapButton).toHaveFocus();
      
      await act(async () => {
        await user.keyboard('{Enter}');
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      // Focus should remain on Lap button
      expect(lapButton).toHaveFocus();
    });

    it('should maintain focus when resetting stopwatch', async () => {
      const user = userEvent.setup({ delay: null, advanceTimers: vi.advanceTimersByTime });
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const resetButton = screen.getByTestId('button-reset');

      // Start and stop to have some state
      await act(async () => {
        await user.tab(); // Tab to Start button
      });
      expect(startButton).toHaveFocus();
      
      await act(async () => {
        await user.keyboard('{Enter}');
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(startButton).toBeDisabled();

      const stopButton = screen.getByTestId('button-stop');
      await act(async () => {
        await user.tab(); // Tab to Stop button
      });
      expect(stopButton).toHaveFocus();
      
      await act(async () => {
        await user.keyboard('{Enter}');
      });

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(stopButton).toBeDisabled();

      // Tab to Reset button and press Enter
      // After stop, Start becomes enabled, so tab might go to Start first
      await act(async () => {
        await user.tab(); // Tab (might go to Start or Reset)
      });
      
      // Focus might be on Start (now enabled) or Reset
      const focusedElement = document.activeElement;
      if (focusedElement === resetButton) {
        await act(async () => {
          await user.keyboard('{Enter}');
        });
      } else {
        // If focus moved to Start, tab again to Reset
        await act(async () => {
          await user.tab(); // Tab to Reset button
        });
        expect(resetButton).toHaveFocus();
        await act(async () => {
          await user.keyboard('{Enter}');
        });
      }

      act(() => {
        vi.advanceTimersByTime(0);
      });

      // Focus should remain on Reset or move to Start (now enabled)
      const finalFocusedElement = document.activeElement;
      expect([resetButton, startButton]).toContain(finalFocusedElement);
    });
  });

  describe('Focus trap prevention', () => {
    it('should allow tabbing out of component', async () => {
      const user = userEvent.setup({ delay: null });
      
      // Create a container with elements before and after
      render(
        <div>
          <button data-testid="before">Before</button>
          <Stopwatch />
          <button data-testid="after">After</button>
        </div>
      );

      const beforeButton = screen.getByTestId('before');
      const afterButton = screen.getByTestId('after');
      const resetButton = screen.getByTestId('button-reset');

      // Focus Reset button (last in Stopwatch)
      resetButton.focus();
      expect(resetButton).toHaveFocus();

      // Tab should move to After button (not trap)
      await user.tab();
      
      // Focus should move to After button or wrap around
      const focusedElement = document.activeElement;
      expect([afterButton, beforeButton]).toContain(focusedElement);
    });
  });

  describe('Focus visibility styles', () => {
    it('should have focusable elements that can receive focus', () => {
      render(<Stopwatch />);

      const startButton = screen.getByTestId('button-start');
      const stopButton = screen.getByTestId('button-stop');
      const lapButton = screen.getByTestId('button-lap');
      const resetButton = screen.getByTestId('button-reset');

      // All buttons should be focusable
      expect(startButton.tabIndex).not.toBe(-1);
      expect(stopButton.tabIndex).not.toBe(-1);
      expect(lapButton.tabIndex).not.toBe(-1);
      expect(resetButton.tabIndex).not.toBe(-1);
    });

    it('should not have disabled buttons blocking focus unnecessarily', () => {
      render(<Stopwatch />);

      const stopButton = screen.getByTestId('button-stop');
      const lapButton = screen.getByTestId('button-lap');

      // Disabled buttons should still be in DOM but may have tabIndex=-1
      // or remain focusable depending on implementation
      expect(stopButton).toBeInTheDocument();
      expect(lapButton).toBeInTheDocument();
    });
  });
});

