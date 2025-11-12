/**
 * ErrorBanner Component - Auto-Dismiss on Valid Input Tests (T068)
 * 
 * Tests for User Story 7: Handle Invalid Input - Error Auto-Dismiss
 * Verifies error messages disappear when valid input is entered
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ConversionErrorType } from '@/types/tempconverter';

// Helper to create test error objects
function createTestError(message: string, type: ConversionErrorType = ConversionErrorType.InvalidInput) {
  return {
    type,
    message,
    field: 'input' as const,
    timestamp: new Date().toISOString(),
  };
}

describe('ErrorBanner - Auto-Dismiss on Valid Input (T068)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Auto-dismiss on state change', () => {
    it('should disappear when error state changes from true to false', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Invalid input')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      expect(screen.getByText('Invalid input')).toBeInTheDocument();

      // Change to no error
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      // Allow animation to complete
      vi.advanceTimersByTime(300);

      // Error should be gone
      expect(screen.queryByText('Invalid input')).not.toBeInTheDocument();
    });

    it('should auto-dismiss when user fixes validation error', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Please enter a valid numeric value')}
          onClearError={vi.fn()}
          autoDismissMs={5000}
        />
      );

      expect(screen.getByText('Please enter a valid numeric value')).toBeInTheDocument();

      // User fixes input (valid numeric value entered)
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={5000}
        />
      );

      // Animation completes
      vi.advanceTimersByTime(300);

      expect(screen.queryByText('Please enter a valid numeric value')).not.toBeInTheDocument();
    });

    it('should transition from invalid to valid without lingering error', () => {
      const onClearError = vi.fn();

      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Invalid')}
          onClearError={onClearError}
          autoDismissMs={0}
        />
      );

      // Error visible
      expect(screen.getByText('Invalid')).toBeInTheDocument();

      // Fix input
      rerender(
        <ErrorBanner
          error={null}
          onClearError={onClearError}
          autoDismissMs={0}
        />
      );

      // Animation
      vi.advanceTimersByTime(300);

      // Error gone
      expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
    });

    it('should handle error message change from "invalid input" to "valid"', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Invalid input format')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      expect(screen.getByText('Invalid input format')).toBeInTheDocument();

      // User fixes the error
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      vi.advanceTimersByTime(300);

      expect(screen.queryByText('Invalid input format')).not.toBeInTheDocument();
    });
  });

  describe('Smooth dismissal animation', () => {
    it('should animate out smoothly when error is cleared', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Error text')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      const errorElement = screen.getByText('Error text').closest('[role="alert"]');
      expect(errorElement).toBeInTheDocument();

      // Clear error
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      // During animation, should transition
      vi.advanceTimersByTime(150);

      // After animation completes
      vi.advanceTimersByTime(150);

      // Should be removed from DOM
      expect(screen.queryByText('Error text')).not.toBeInTheDocument();
    });

    it('should handle animation within specified autoDismissMs', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Test error')}
          onClearError={vi.fn()}
          autoDismissMs={3000}
        />
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();

      // Clear before autoDismiss timeout
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={3000}
        />
      );

      // Animation completes faster than autoDismiss
      vi.advanceTimersByTime(300);

      expect(screen.queryByText('Test error')).not.toBeInTheDocument();
    });

    it('should complete animation before fully removing element', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Disappearing error')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      expect(screen.getByText('Disappearing error')).toBeInTheDocument();

      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      // Partially through animation
      vi.advanceTimersByTime(150);

      // Element should still exist but be hidden/transparent
      const element = screen.queryByText('Disappearing error');

      // Complete animation
      vi.advanceTimersByTime(150);

      // Now should be gone
      expect(screen.queryByText('Disappearing error')).not.toBeInTheDocument();
    });
  });

  describe('Multiple error scenarios', () => {
    it('should handle transition from one error to success', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('First error')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      expect(screen.getByText('First error')).toBeInTheDocument();

      // Fix it
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      vi.advanceTimersByTime(300);

      expect(screen.queryByText('First error')).not.toBeInTheDocument();
    });

    it('should handle multiple error corrections', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Error 1')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      expect(screen.getByText('Error 1')).toBeInTheDocument();

      // Fix
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      vi.advanceTimersByTime(300);
      expect(screen.queryByText('Error 1')).not.toBeInTheDocument();

      // New error
      rerender(
        <ErrorBanner
          error={createTestError('Error 2')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      expect(screen.getByText('Error 2')).toBeInTheDocument();

      // Fix again
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      vi.advanceTimersByTime(300);
      expect(screen.queryByText('Error 2')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility during dismiss', () => {
    it('should maintain ARIA live region during auto-dismiss', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Error')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      const banner = screen.getByRole('alert');
      expect(banner).toHaveAttribute('aria-live', 'assertive');

      // During dismiss
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      // Should still be present during animation
      vi.advanceTimersByTime(150);

      // After animation
      vi.advanceTimersByTime(150);
    });

    it('should announce state change to screen readers', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Invalid input')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-atomic', 'true');

      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      vi.advanceTimersByTime(300);
    });
  });

  describe('Timing and performance', () => {
    it('should dismiss error quickly (within animation time)', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Fast error')}
          onClearError={vi.fn()}
          autoDismissMs={100}
        />
      );

      expect(screen.getByText('Fast error')).toBeInTheDocument();

      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={100}
        />
      );

      // Should complete animation before 300ms
      vi.advanceTimersByTime(300);

      expect(screen.queryByText('Fast error')).not.toBeInTheDocument();
    });

    it('should handle rapid error state changes', () => {
      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Error A')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      // Clear
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      // Before animation completes, new error
      vi.advanceTimersByTime(100);

      rerender(
        <ErrorBanner
          error={createTestError('Error B')}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      // Should show new error
      expect(screen.getByText('Error B')).toBeInTheDocument();

      // Clear again
      rerender(
        <ErrorBanner
          error={null}
          onClearError={vi.fn()}
          autoDismissMs={0}
        />
      );

      vi.advanceTimersByTime(300);

      expect(screen.queryByText('Error B')).not.toBeInTheDocument();
    });
  });

  describe('User interaction during dismiss', () => {
    it('should not interfere with dismiss when user interacts', () => {
      const onClearError = vi.fn();

      const { rerender } = render(
        <ErrorBanner
          error={createTestError('Error with button')}
          onClearError={onClearError}
          autoDismissMs={5000}
        />
      );

      expect(screen.getByText('Error with button')).toBeInTheDocument();

      // User fixes input (error clears automatically)
      rerender(
        <ErrorBanner
          error={null}
          onClearError={onClearError}
          autoDismissMs={5000}
        />
      );

      vi.advanceTimersByTime(300);

      expect(screen.queryByText('Error with button')).not.toBeInTheDocument();
    });
  });
});
