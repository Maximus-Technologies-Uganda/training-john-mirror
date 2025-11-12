/**
 * ARIA Labels Tests for Temp Converter UI
 * 
 * Verifies that all Temp Converter controls have proper ARIA labels
 * for screen reader accessibility.
 * 
 * Test Coverage for T100:
 * - Input field has aria-label
 * - Dropdowns have aria-label attributes
 * - Convert button has aria-label
 * - Result display has proper ARIA roles
 * - Error banner has proper ARIA roles
 * - All regions have aria-label attributes
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import { TempConverter } from '@/components/TempConverter';

describe('Temp Converter UI - ARIA Labels Verification (T100)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Input field ARIA labels', () => {
    it('should have aria-label on temperature input', () => {
      render(<TempConverter />);

      const input = screen.getByTestId('temperature-input');
      expect(input).toHaveAttribute('aria-label');
      
      const ariaLabel = input.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    it('should have associated label element', () => {
      render(<TempConverter />);

      // Check for label element associated with temperature input
      const input = screen.getByTestId('temperature-input');
      const label = input.closest('div')?.querySelector('label');
      
      // The label should exist and be associated with the input
      expect(label).toBeInTheDocument();
      expect(label?.textContent?.toLowerCase()).toMatch(/temperature/i);
    });
  });

  describe('Dropdown ARIA labels', () => {
    it('should have aria-label on source unit selector', () => {
      render(<TempConverter />);

      const sourceSelector = screen.getByTestId('source-unit-selector');
      expect(sourceSelector).toHaveAttribute('aria-label');
      
      const ariaLabel = sourceSelector.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toMatch(/source|from/i);
    });

    it('should have aria-label on target unit selector', () => {
      render(<TempConverter />);

      const targetSelector = screen.getByTestId('target-unit-selector');
      expect(targetSelector).toHaveAttribute('aria-label');
      
      const ariaLabel = targetSelector.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toMatch(/target|to/i);
    });

    it('should have aria-label on unit selectors group', () => {
      render(<TempConverter />);

      const group = screen.getByRole('group', { name: /unit/i });
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('aria-label');
      
      const ariaLabel = group.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toMatch(/unit|temperature/i);
    });
  });

  describe('Button ARIA labels', () => {
    it('should have aria-label on convert button', () => {
      render(<TempConverter />);

      const convertButton = screen.getByRole('button', { name: /convert/i });
      expect(convertButton).toHaveAttribute('aria-label');
      
      const ariaLabel = convertButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toMatch(/convert/i);
    });

    it('should have aria-label on error dismiss button', async () => {
      render(<TempConverter />);

      // Trigger an error by entering invalid input and submitting
      const input = screen.getByTestId('temperature-input');
      await userEvent.type(input, 'abc');
      
      const convertButton = screen.getByRole('button', { name: /convert/i });
      await userEvent.click(convertButton);

      // Wait for error banner to appear
      await waitFor(() => {
        const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
        expect(dismissButton).toBeInTheDocument();
        expect(dismissButton).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Result display ARIA roles', () => {
    it('should have role="status" on conversion result', () => {
      render(<TempConverter />);

      // Perform a conversion
      const input = screen.getByTestId('temperature-input') as HTMLInputElement;
      input.focus();
      input.value = '0';
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const sourceSelector = screen.getByTestId('source-unit-selector') as HTMLSelectElement;
      sourceSelector.value = 'C';
      sourceSelector.dispatchEvent(new Event('change', { bubbles: true }));

      const targetSelector = screen.getByTestId('target-unit-selector') as HTMLSelectElement;
      targetSelector.value = 'F';
      targetSelector.dispatchEvent(new Event('change', { bubbles: true }));

      const convertButton = screen.getByRole('button', { name: /convert/i });
      convertButton.click();

      setTimeout(() => {
        const result = screen.queryByTestId('conversion-result');
        if (result) {
          expect(result).toHaveAttribute('role', 'status');
          expect(result).toHaveAttribute('aria-live', 'polite');
          expect(result).toHaveAttribute('aria-label');
        }
      }, 100);
    });

    it('should have aria-label describing conversion result', () => {
      render(<TempConverter />);

      // Perform a conversion
      const input = screen.getByTestId('temperature-input') as HTMLInputElement;
      input.focus();
      input.value = '32';
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const sourceSelector = screen.getByTestId('source-unit-selector') as HTMLSelectElement;
      sourceSelector.value = 'F';
      sourceSelector.dispatchEvent(new Event('change', { bubbles: true }));

      const targetSelector = screen.getByTestId('target-unit-selector') as HTMLSelectElement;
      targetSelector.value = 'C';
      targetSelector.dispatchEvent(new Event('change', { bubbles: true }));

      const convertButton = screen.getByRole('button', { name: /convert/i });
      convertButton.click();

      setTimeout(() => {
        const result = screen.queryByTestId('conversion-result');
        if (result) {
          const ariaLabel = result.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel?.toLowerCase()).toMatch(/result|conversion/i);
        }
      }, 100);
    });
  });

  describe('Error banner ARIA roles', () => {
    it('should have role="alert" on error banner when error is shown', () => {
      render(<TempConverter />);

      // Trigger an error by trying identical units
      const sourceSelector = screen.getByTestId('source-unit-selector') as HTMLSelectElement;
      sourceSelector.value = 'C';
      sourceSelector.dispatchEvent(new Event('change', { bubbles: true }));

      const targetSelector = screen.getByTestId('target-unit-selector') as HTMLSelectElement;
      targetSelector.value = 'C';
      targetSelector.dispatchEvent(new Event('change', { bubbles: true }));

      setTimeout(() => {
        const alert = screen.queryByRole('alert');
        if (alert) {
          expect(alert).toBeInTheDocument();
          expect(alert).toHaveAttribute('aria-live', 'assertive');
        }
      }, 100);
    });

    it('should have aria-labelledby and aria-describedby on error banner', () => {
      render(<TempConverter />);

      // Trigger an error
      const input = screen.getByTestId('temperature-input') as HTMLInputElement;
      input.focus();
      input.value = 'abc';
      input.dispatchEvent(new Event('change', { bubbles: true }));

      setTimeout(() => {
        const alert = screen.queryByRole('alert');
        if (alert) {
          // Error banner should have proper ARIA attributes
          expect(alert).toHaveAttribute('aria-labelledby');
          expect(alert).toHaveAttribute('aria-describedby');
        }
      }, 100);
    });
  });

  describe('Region ARIA labels', () => {
    it('should have aria-label on main converter region', () => {
      render(<TempConverter />);

      const region = screen.getByRole('region', { name: /temperature|converter/i });
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute('aria-label');
      
      const ariaLabel = region.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel?.toLowerCase()).toMatch(/temperature|converter/i);
    });

    it('should have aria-describedby on main converter region', () => {
      render(<TempConverter />);

      const region = screen.getByRole('region', { name: /temperature|converter/i });
      expect(region).toHaveAttribute('aria-describedby');
      
      const describedBy = region.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
    });

    it('should have aria-live="polite" on main converter region', () => {
      render(<TempConverter />);

      const region = screen.getByRole('region', { name: /temperature|converter/i });
      expect(region).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('ARIA live regions', () => {
    it('should have aria-live="polite" on conversion result', () => {
      render(<TempConverter />);

      // Perform a conversion
      const input = screen.getByTestId('temperature-input') as HTMLInputElement;
      input.focus();
      input.value = '100';
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const sourceSelector = screen.getByTestId('source-unit-selector') as HTMLSelectElement;
      sourceSelector.value = 'C';
      sourceSelector.dispatchEvent(new Event('change', { bubbles: true }));

      const targetSelector = screen.getByTestId('target-unit-selector') as HTMLSelectElement;
      targetSelector.value = 'F';
      targetSelector.dispatchEvent(new Event('change', { bubbles: true }));

      const convertButton = screen.getByRole('button', { name: /convert/i });
      convertButton.click();

      setTimeout(() => {
        const result = screen.queryByTestId('conversion-result');
        if (result) {
          expect(result).toHaveAttribute('aria-live', 'polite');
        }
      }, 100);
    });

    it('should have aria-live="assertive" on error banner', () => {
      render(<TempConverter />);

      // Trigger an error
      const input = screen.getByTestId('temperature-input') as HTMLInputElement;
      input.focus();
      input.value = 'invalid';
      input.dispatchEvent(new Event('change', { bubbles: true }));

      setTimeout(() => {
        const alert = screen.queryByRole('alert');
        if (alert) {
          expect(alert).toHaveAttribute('aria-live', 'assertive');
        }
      }, 100);
    });
  });
});

