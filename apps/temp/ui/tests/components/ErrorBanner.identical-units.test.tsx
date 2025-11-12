/**
 * ErrorBanner Component Test Suite - Identical Unit Error Display
 * 
 * T077: Tests for error display on identical unit selection
 * Tests that ErrorBanner displays "Source and target units cannot be the same" error
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ConversionErrorType } from '@/types/tempconverter';

describe('ErrorBanner - Identical Unit Error Display (T077)', () => {
  const mockOnClearError = vi.fn();

  beforeEach(() => {
    mockOnClearError.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Identical Unit Error Display', () => {
    it('should display identical unit error message', () => {
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same. Please select different units.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      expect(screen.getByText(/cannot be the same/i)).toBeInTheDocument();
      expect(screen.getByText(/select different units/i)).toBeInTheDocument();
    });

    it('should have alert role for accessibility', () => {
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toBeInTheDocument();
      expect(alertElement).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have dismiss button', () => {
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      const dismissButton = screen.getByLabelText(/dismiss/i);
      expect(dismissButton).toBeInTheDocument();
    });

    it('should not display error when error prop is null', () => {
      render(
        <ErrorBanner
          error={null}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Error Dismissal', () => {
    it('should dismiss error when close button clicked', async () => {
      const user = userEvent.setup({ delay: null });
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      const dismissButton = screen.getByLabelText(/dismiss/i);
      await user.click(dismissButton);

      expect(mockOnClearError).toHaveBeenCalledTimes(1);
    });

    it('should dismiss error on Escape key press', async () => {
      const user = userEvent.setup({ delay: null });
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      const { container } = render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      const alertElement = container.querySelector('[role="alert"]') as HTMLElement;
      alertElement?.focus();

      await user.keyboard('{Escape}');

      expect(mockOnClearError).toHaveBeenCalledTimes(1);
    });

    it('should auto-dismiss after timeout', () => {
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={3000}
        />
      );

      expect(mockOnClearError).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockOnClearError).toHaveBeenCalledTimes(1);
    });

    it('should not auto-dismiss when autoDismissMs is 0', () => {
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={0}
        />
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockOnClearError).not.toHaveBeenCalled();
    });
  });

  describe('Error State Changes', () => {
    it('should handle transition from no error to error', () => {
      const { rerender } = render(
        <ErrorBanner
          error={null}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      rerender(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should handle transition from error to no error', () => {
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      const { rerender } = render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      rerender(
        <ErrorBanner
          error={null}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should replace timer when error changes', () => {
      const error1 = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      const error2 = {
        type: ConversionErrorType.InvalidInput,
        message: 'Please enter a valid numeric value.',
        field: 'input' as const,
        timestamp: new Date().toISOString(),
      };

      const { rerender } = render(
        <ErrorBanner
          error={error1}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      rerender(
        <ErrorBanner
          error={error2}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      // New timer should start, old timer cleared
      expect(mockOnClearError).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockOnClearError).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility Features', () => {
    it('should have aria-atomic attribute', () => {
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveAttribute('aria-atomic', 'true');
    });

    it('should have aria-live="assertive" for immediate announcement', () => {
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have proper button accessibility', () => {
      const error = {
        type: ConversionErrorType.IdenticalUnits,
        message: 'Source and target units cannot be the same.',
        field: 'sourceUnit' as const,
        timestamp: new Date().toISOString(),
      };

      render(
        <ErrorBanner
          error={error}
          onClearError={mockOnClearError}
          autoDismissMs={5000}
        />
      );

      const dismissButton = screen.getByLabelText(/dismiss/i);
      expect(dismissButton).toHaveAttribute('aria-label');
      expect(dismissButton.tagName).toBe('BUTTON');
    });
  });
});

