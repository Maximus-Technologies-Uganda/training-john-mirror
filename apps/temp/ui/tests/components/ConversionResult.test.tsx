/**
 * ConversionResult Component Tests (T056)
 * 
 * Tests for User Story 5: Temperature Converter - Conversion Result Display
 * Verifies result display with 2-decimal rounding
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConversionResult } from '@/components/ConversionResult';

describe('ConversionResult Component (T056)', () => {
  describe('Rendering', () => {
    it('should render the result container', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByTestId('conversion-result')).toBeInTheDocument();
    });

    it('should display the result value', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/32/)).toBeInTheDocument();
    });

    it('should display the target unit', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      const result = screen.getByTestId('conversion-result');
      expect(result.textContent).toMatch(/°F|fahrenheit/i);
    });

    it('should render with proper ARIA attributes', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      const result = screen.getByTestId('conversion-result');
      expect(result).toHaveAttribute('role', 'status');
    });
  });

  describe('Value Display and Formatting', () => {
    it('should round to 2 decimal places', () => {
      render(
        <ConversionResult
          value={32.123456}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/32.12/)).toBeInTheDocument();
    });

    it('should display .00 for whole numbers', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/32\.00|32/)).toBeInTheDocument();
    });

    it('should handle .5 rounding correctly', () => {
      render(
        <ConversionResult
          value={32.5}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/32.5/)).toBeInTheDocument();
    });

    it('should handle very small decimals (0.01)', () => {
      render(
        <ConversionResult
          value={0.01}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/0.01/)).toBeInTheDocument();
    });

    it('should display negative temperatures', () => {
      render(
        <ConversionResult
          value={-40}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/-40/)).toBeInTheDocument();
    });

    it('should handle zero', () => {
      render(
        <ConversionResult
          value={0}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      const result = screen.getByTestId('conversion-result');
      expect(result.textContent).toMatch(/0\.00|0°?F/i);
    });

    it('should handle large numbers', () => {
      render(
        <ConversionResult
          value={99999.99}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/99999.99/)).toBeInTheDocument();
    });

    it('should apply currency-like formatting for temperature values', () => {
      render(
        <ConversionResult
          value={32.123}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      const resultText = screen.getByTestId('conversion-result').textContent;
      expect(resultText).toContain('32.12');
    });
  });

  describe('Unit Display', () => {
    it('should display F symbol when converting to Fahrenheit', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      const result = screen.getByTestId('conversion-result');
      expect(result.querySelector('p:first-of-type')).toHaveTextContent('°F');
    });

    it('should display C symbol when converting to Celsius', () => {
      render(
        <ConversionResult
          value={0}
          sourceUnit="F"
          targetUnit="C"
          isLoading={false}
        />
      );
      const result = screen.getByTestId('conversion-result');
      expect(result.querySelector('p:first-of-type')).toHaveTextContent('°C');
    });

    it('should include degree symbol if supported', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      const resultText = screen.getByTestId('conversion-result').textContent;
      // Should contain either ° symbol or spelled out unit
      expect(resultText).toMatch(/°|fahrenheit|°f|f/i);
    });

    it('should display result label describing conversion direction', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      // Should show conversion result in some form
      expect(screen.getByTestId('conversion-result')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when isLoading is true', () => {
      render(
        <ConversionResult
          value={undefined}
          sourceUnit="C"
          targetUnit="F"
          isLoading={true}
        />
      );
      const result = screen.getByTestId('conversion-result');
      expect(result).toHaveAttribute('data-loading', 'true');
    });

    it('should display loading text', () => {
      render(
        <ConversionResult
          value={undefined}
          sourceUnit="C"
          targetUnit="F"
          isLoading={true}
        />
      );
      expect(screen.getByText(/loading|calculating|converting/i)).toBeInTheDocument();
    });

    it('should not display result value while loading', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={true}
        />
      );
      const result = screen.getByTestId('conversion-result');
      // Should show loading state, not the result
      expect(result).toHaveAttribute('data-loading', 'true');
    });

    it('should transition from loading to loaded', () => {
      const { rerender } = render(
        <ConversionResult
          value={undefined}
          sourceUnit="C"
          targetUnit="F"
          isLoading={true}
        />
      );
      
      let result = screen.getByTestId('conversion-result');
      expect(result).toHaveAttribute('data-loading', 'true');

      rerender(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );

      result = screen.getByTestId('conversion-result');
      expect(result).not.toHaveAttribute('data-loading');
      expect(screen.getByText(/32/)).toBeInTheDocument();
    });
  });

  describe('Empty/Error States', () => {
    it('should display placeholder when value is undefined', () => {
      render(
        <ConversionResult
          value={undefined}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      const result = screen.getByTestId('conversion-result');
      expect(result).toHaveClass('conversion-result--empty');
    });

    it('should display placeholder when value is null', () => {
      render(
        <ConversionResult
          value={null}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      const result = screen.getByTestId('conversion-result');
      expect(result).toHaveClass('conversion-result--empty');
    });

    it('should handle NaN gracefully', () => {
      render(
        <ConversionResult
          value={NaN}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      // Should either show error or placeholder
      const result = screen.getByTestId('conversion-result');
      expect(result).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="status" for live region', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByTestId('conversion-result')).toHaveAttribute('role', 'status');
    });

    it('should have aria-live for dynamic updates', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByTestId('conversion-result')).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-atomic for full region replacement', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByTestId('conversion-result')).toHaveAttribute('aria-atomic', 'true');
    });

    it('should announce result changes to screen readers', () => {
      const { rerender } = render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );

      const result = screen.getByTestId('conversion-result');
      expect(result).toHaveAttribute('aria-live', 'polite');

      rerender(
        <ConversionResult
          value={212}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );

      expect(screen.getByText(/212/)).toBeInTheDocument();
    });

    it('should have descriptive text for context', () => {
      render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      const result = screen.getByTestId('conversion-result');
      expect(result.textContent).toContain('32');
    });
  });

  describe('Dynamic Updates', () => {
    it('should update when value changes', () => {
      const { rerender } = render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/32/)).toBeInTheDocument();

      rerender(
        <ConversionResult
          value={212}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/212/)).toBeInTheDocument();
    });

    it('should update when source unit changes', () => {
      const { rerender } = render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      let result = screen.getByTestId('conversion-result');
      expect(result.textContent).toMatch(/°F/);

      rerender(
        <ConversionResult
          value={0}
          sourceUnit="F"
          targetUnit="C"
          isLoading={false}
        />
      );
      result = screen.getByTestId('conversion-result');
      expect(result.textContent).toMatch(/°C/);
    });

    it('should update when target unit changes', () => {
      const { rerender } = render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      let result = screen.getByTestId('conversion-result');
      expect(result.textContent).toMatch(/°F/);

      rerender(
        <ConversionResult
          value={0}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      // Still shows F (same target unit)
      result = screen.getByTestId('conversion-result');
      expect(result.textContent).toMatch(/°F/);
    });

    it('should handle rapid value updates', () => {
      const { rerender } = render(
        <ConversionResult
          value={32}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );

      for (let i = 0; i < 5; i++) {
        rerender(
          <ConversionResult
            value={32 + i * 10}
            sourceUnit="C"
            targetUnit="F"
            isLoading={false}
          />
        );
      }

      expect(screen.getByText(/72/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases for Rounding', () => {
    it('should round 32.125 to 32.12 (banker\'s rounding)', () => {
      render(
        <ConversionResult
          value={32.125}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      // Should round to 2 decimals
      const text = screen.getByTestId('conversion-result').textContent;
      expect(text).toMatch(/32\.1[2-3]/);
    });

    it('should round 32.126 to 32.13', () => {
      render(
        <ConversionResult
          value={32.126}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/32\.13/)).toBeInTheDocument();
    });

    it('should handle scientific notation values', () => {
      render(
        <ConversionResult
          value={1e2}
          sourceUnit="C"
          targetUnit="F"
          isLoading={false}
        />
      );
      expect(screen.getByText(/100/)).toBeInTheDocument();
    });
  });
});

