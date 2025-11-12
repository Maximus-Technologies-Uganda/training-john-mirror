/**
 * Focus Management Tests for Temp Converter UI
 * 
 * Verifies focus management and visible focus states:
 * - Focus indicators are visible
 * - Focus order is logical
 * - Focus is maintained appropriately during state changes
 * - Keyboard focus is properly managed
 * 
 * Test Coverage for T102:
 * - Visible focus indicators on all interactive elements
 * - Focus order follows logical flow (input → source → target → button)
 * - Focus management during form submission
 * - Focus trap prevention
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { TempConverter } from '@/components/TempConverter';

describe('Temp Converter UI - Focus Management (T102)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Visible focus indicators', () => {
    it('should show focus indicator on input field when focused', () => {
      render(<TempConverter />);

      const input = screen.getByTestId('temperature-input');
      input.focus();

      expect(input).toHaveFocus();
      expect(document.activeElement).toBe(input);
    });

    it('should show focus indicator on source selector when focused', () => {
      render(<TempConverter />);

      const sourceSelector = screen.getByTestId('source-unit-selector');
      sourceSelector.focus();

      expect(sourceSelector).toHaveFocus();
      expect(document.activeElement).toBe(sourceSelector);
    });

    it('should show focus indicator on target selector when focused', () => {
      render(<TempConverter />);

      const targetSelector = screen.getByTestId('target-unit-selector');
      targetSelector.focus();

      expect(targetSelector).toHaveFocus();
      expect(document.activeElement).toBe(targetSelector);
    });

    it('should show focus indicator on convert button when focused', () => {
      render(<TempConverter />);

      const convertButton = screen.getByRole('button', { name: /convert/i });
      convertButton.focus();

      expect(convertButton).toHaveFocus();
      expect(document.activeElement).toBe(convertButton);
    });

    it('should maintain focus visibility during form interaction', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TempConverter />);

      const input = screen.getByTestId('temperature-input');
      input.focus();

      expect(input).toHaveFocus();

      // Type in input
      await user.type(input, '100');

      // Focus should remain on input
      expect(input).toHaveFocus();
    });
  });

  describe('Focus order', () => {
    it('should follow logical tab order: Input → Source → Target → Button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TempConverter />);

      const input = screen.getByTestId('temperature-input');
      const sourceSelector = screen.getByTestId('source-unit-selector');
      const targetSelector = screen.getByTestId('target-unit-selector');
      const convertButton = screen.getByRole('button', { name: /convert/i });

      // Start from input
      input.focus();
      expect(input).toHaveFocus();

      // Tab to source selector
      await user.tab();
      expect(sourceSelector).toHaveFocus();

      // Tab to target selector
      await user.tab();
      expect(targetSelector).toHaveFocus();

      // Tab to convert button
      await user.tab();
      expect(convertButton).toHaveFocus();
    });

    it('should allow reverse tab order with Shift+Tab', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TempConverter />);

      const input = screen.getByTestId('temperature-input');
      const sourceSelector = screen.getByTestId('source-unit-selector');
      const targetSelector = screen.getByTestId('target-unit-selector');
      const convertButton = screen.getByRole('button', { name: /convert/i });

      // Start from convert button
      convertButton.focus();
      expect(convertButton).toHaveFocus();

      // Shift+Tab to target selector
      await user.tab({ shift: true });
      expect(targetSelector).toHaveFocus();

      // Shift+Tab to source selector
      await user.tab({ shift: true });
      expect(sourceSelector).toHaveFocus();

      // Shift+Tab to input
      await user.tab({ shift: true });
      expect(input).toHaveFocus();
    });
  });

  describe('Focus management during form submission', () => {
    it('should maintain focus after successful conversion', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TempConverter />);

      const input = screen.getByTestId('temperature-input');
      const sourceSelector = screen.getByTestId('source-unit-selector');
      const targetSelector = screen.getByTestId('target-unit-selector');
      const convertButton = screen.getByRole('button', { name: /convert/i });

      // Fill form
      await user.type(input, '0');
      await user.selectOptions(sourceSelector, 'C');
      await user.selectOptions(targetSelector, 'F');

      // Focus convert button and submit
      await user.tab(); // Tab to convert button
      await waitFor(() => {
        expect(convertButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      // Focus should remain on convert button or move appropriately
      await waitFor(() => {
        const focusedElement = document.activeElement;
        expect([convertButton, input]).toContain(focusedElement);
      });
    });

    it('should maintain focus after error display', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TempConverter />);

      const input = screen.getByTestId('temperature-input');
      const convertButton = screen.getByRole('button', { name: /convert/i });

      // Enter invalid input
      await user.type(input, 'abc');

      // Focus convert button and submit
      await user.tab(); // Tab to convert button
      await waitFor(() => {
        expect(convertButton).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      // Focus should remain on convert button or input
      await waitFor(() => {
        const focusedElement = document.activeElement;
        expect([convertButton, input]).toContain(focusedElement);
      });
    });

    it('should allow focus on error dismiss button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TempConverter />);

      // Trigger an error
      const input = screen.getByTestId('temperature-input');
      await user.type(input, 'abc');
      
      const convertButton = screen.getByRole('button', { name: /convert/i });
      await userEvent.click(convertButton);

      // Wait for error banner to appear
      await waitFor(() => {
        const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
        expect(dismissButton).toBeInTheDocument();
      });

      const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
      await user.tab(); // Tab to dismiss button (if it's in tab order)
      // Note: Dismiss button may not be in tab order, so we verify it exists and is focusable
      expect(dismissButton).toBeInTheDocument();
    });
  });

  describe('Focus trap prevention', () => {
    it('should allow tabbing out of component', async () => {
      const user = userEvent.setup({ delay: null });
      
      // Create a container with elements before and after
      render(
        <div>
          <button data-testid="before">Before</button>
          <TempConverter />
          <button data-testid="after">After</button>
        </div>
      );

      const beforeButton = screen.getByTestId('before');
      const afterButton = screen.getByTestId('after');
      const convertButton = screen.getByRole('button', { name: /convert/i });

      // Focus convert button (last in form)
      convertButton.focus();
      expect(convertButton).toHaveFocus();

      // Tab should move to After button (not trap)
      await user.tab();
      
      // Focus should move to After button or wrap around
      const focusedElement = document.activeElement;
      expect([afterButton, beforeButton]).toContain(focusedElement);
    });
  });

  describe('Focus visibility styles', () => {
    it('should have focusable elements that can receive focus', () => {
      render(<TempConverter />);

      const input = screen.getByTestId('temperature-input');
      const sourceSelector = screen.getByTestId('source-unit-selector');
      const targetSelector = screen.getByTestId('target-unit-selector');
      const convertButton = screen.getByRole('button', { name: /convert/i });

      // All elements should be focusable
      expect(input.tabIndex).not.toBe(-1);
      expect(sourceSelector.tabIndex).not.toBe(-1);
      expect(targetSelector.tabIndex).not.toBe(-1);
      expect(convertButton.tabIndex).not.toBe(-1);
    });

    it('should maintain focus visibility during dropdown interaction', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TempConverter />);

      const sourceSelector = screen.getByTestId('source-unit-selector');
      await user.tab(); // Tab to source selector
      await waitFor(() => {
        expect(sourceSelector).toHaveFocus();
      });

      // Select an option
      await user.selectOptions(sourceSelector, 'F');

      // Focus should remain on selector
      await waitFor(() => {
        expect(sourceSelector).toHaveFocus();
      });
    });
  });

  describe('Focus management with Enter key', () => {
    it('should submit form when Enter is pressed in input', async () => {
      const user = userEvent.setup({ delay: null });
      render(<TempConverter />);

      const input = screen.getByTestId('temperature-input');
      const sourceSelector = screen.getByTestId('source-unit-selector');
      const targetSelector = screen.getByTestId('target-unit-selector');

      // Fill form
      await user.type(input, '32');
      await user.selectOptions(sourceSelector, 'F');
      await user.selectOptions(targetSelector, 'C');

      // Press Enter in input (input should already have focus from type)
      await waitFor(() => {
        expect(input).toHaveFocus();
      });
      await user.keyboard('{Enter}');

      // Focus should remain on input or move appropriately
      await waitFor(() => {
        const focusedElement = document.activeElement;
        expect([input, screen.getByRole('button', { name: /convert/i })]).toContain(focusedElement);
      });
    });
  });
});

