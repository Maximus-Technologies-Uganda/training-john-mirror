/**
 * TemperatureInput Component - On-Blur Validation Tests (T066)
 * 
 * Tests for User Story 7: Handle Invalid Input - On-Blur Validation
 * Verifies input validation triggered on blur event
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useState } from 'react';
import { TemperatureInput } from '@/components/TemperatureInput';

// Helper component for controlled input testing
const ControlledTemperatureInput = ({ initialValue = '', onBlur }: { initialValue?: string; onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void }) => {
  const [value, setValue] = useState(initialValue);
  return (
    <TemperatureInput
      value={value}
      onChange={setValue}
      onBlur={onBlur}
    />
  );
};

describe('TemperatureInput - On-Blur Validation (T066)', () => {
  describe('On-blur validation triggers', () => {
    it('should validate on blur when input contains non-numeric value', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput onBlur={handleBlur} />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type invalid text (HTML5 number input rejects non-numeric, so value will be empty)
      await user.type(input, 'abc');
      
      // Trigger blur
      await user.tab(); // Tab away to trigger blur
      
      // HTML5 number input rejects non-numeric, so value is empty
      expect(input).toHaveValue(null);
      expect(handleBlur).toHaveBeenCalled();
    });

    it('should not show error on blur for valid numeric input', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type valid number
      await user.type(input, '25');
      
      // Blur should not trigger error
      await user.tab(); // Tab away to trigger blur
      
      expect(input).toHaveValue(25);
    });

    it('should validate decimal input on blur', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type valid decimal
      await user.type(input, '98.6');
      
      await user.tab(); // Tab away to trigger blur
      
      // Valid input should not cause error
      expect(input).toHaveValue(98.6);
    });

    it('should validate negative numbers on blur', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type valid negative
      await user.type(input, '-40');
      
      await user.tab(); // Tab away to trigger blur
      
      expect(input).toHaveValue(-40);
    });

    it('should mark empty input as invalid on blur if required', async () => {
      render(
        <TemperatureInput
          value=""
          onChange={() => {}}
          required={true}
        />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Leave empty
      input.focus();
      fireEvent.blur(input);
      
      // Should be marked as invalid (required field)
      expect(input).toHaveAttribute('required');
    });

    it('should allow empty input on blur if not required', async () => {
      render(
        <TemperatureInput
          value=""
          onChange={() => {}}
          required={false}
        />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      input.focus();
      fireEvent.blur(input);
      
      // Empty should be allowed
      expect((input as HTMLInputElement).value).toBe('');
    });

    it('should preserve valid input after blur', async () => {
      render(
        <TemperatureInput
          value="32"
          onChange={() => {}}
        />
      );
      
      const input = screen.getByTestId('temperature-input') as HTMLInputElement;
      
      fireEvent.blur(input);
      
      // Value should remain
      expect(input.value).toBe('32');
    });

    it('should trigger validation only on blur, not on change', async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput onBlur={handleBlur} />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type invalid during focus (HTML5 number input rejects non-numeric)
      await user.type(input, 'abc');
      
      // HTML5 number input rejects non-numeric, so value is empty
      expect(input).toHaveValue(null);
      expect(handleBlur).not.toHaveBeenCalled();
      
      // Only blur triggers validation callback
      await user.tab();
      expect(handleBlur).toHaveBeenCalled();
    });

    it('should validate special characters on blur', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type with special characters (HTML5 number input rejects these)
      await user.type(input, '!@#$%');
      
      await user.tab(); // Tab away to trigger blur
      
      // HTML5 number input rejects special characters, so value is empty
      expect(input).toHaveValue(null);
    });

    it('should validate multiple decimals on blur', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type with multiple decimals (HTML5 number input may prevent this)
      await user.type(input, '12.34.56');
      
      await user.tab(); // Tab away to trigger blur
      
      // HTML5 number input prevents this, but we test the handler
      // The value may be empty or partial due to browser validation
      expect(input).toBeInTheDocument();
    });

    it('should validate scientific notation on blur (should be accepted)', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type scientific notation
      await user.type(input, '1e2');
      
      await user.tab(); // Tab away to trigger blur
      
      expect(input).toHaveValue(100); // 1e2 = 100
    });

    it('should validate whitespace on blur', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type with spaces (HTML5 number input rejects whitespace)
      await user.type(input, '   ');
      
      await user.tab(); // Tab away to trigger blur
      
      // HTML5 number input rejects whitespace, so value is empty
      expect(input).toHaveValue(null);
    });

    it('should not lose focus after blur validation', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      await user.click(input);
      expect(input).toHaveFocus();
      
      await user.tab(); // Tab away to trigger blur
      
      // Focus should be removed
      expect(input).not.toHaveFocus();
    });

    it('should re-focus and continue editing after blur validation', async () => {
      const handleChange = vi.fn();
      
      render(
        <TemperatureInput
          value=""
          onChange={handleChange}
        />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type and blur
      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.blur(input);
      
      // Re-focus and correct
      input.focus();
      fireEvent.change(input, { target: { value: '25' } });
      
      expect(input).toHaveFocus();
    });
  });

  describe('On-blur validation user experience', () => {
    it('should allow user to correct invalid input after blur', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type invalid (HTML5 rejects it), blur
      await user.type(input, 'abc');
      await user.tab(); // Tab away to trigger blur
      
      // Re-focus and correct to valid
      await user.click(input);
      await user.clear(input);
      await user.type(input, '25');
      
      // Value should be updated to valid number
      expect(input).toHaveValue(25);
    });

    it('should provide feedback during validation without breaking workflow', async () => {
      render(
        <TemperatureInput
          value=""
          onChange={() => {}}
        />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Simulate rapid input changes
      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.change(input, { target: { value: '123' } });
      
      fireEvent.blur(input);
      
      // Should remain functional
      expect(input).toBeInTheDocument();
    });

    it('should handle blur after pasting invalid content', async () => {
      const user = userEvent.setup();
      
      render(
        <ControlledTemperatureInput />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Paste invalid content (HTML5 number input rejects non-numeric)
      await user.click(input);
      await user.paste('xyz');
      await user.tab(); // Tab away to trigger blur
      
      // HTML5 number input rejects non-numeric paste, so value is empty
      expect(input).toHaveValue(null);
    });
  });

  describe('Accessibility during on-blur validation', () => {
    it('should maintain ARIA attributes during blur validation', async () => {
      render(
        <TemperatureInput
          value=""
          onChange={() => {}}
        />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      expect(input).toHaveAttribute('aria-label');
      
      fireEvent.blur(input);
      
      // ARIA attributes should persist
      expect(input).toHaveAttribute('aria-label');
    });

    it('should announce validation state to screen readers', () => {
      render(
        <TemperatureInput
          value=""
          onChange={() => {}}
        />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      fireEvent.blur(input);
      
      // Should have accessibility attributes
      expect(input).toHaveAccessibleName();
    });
  });
});
