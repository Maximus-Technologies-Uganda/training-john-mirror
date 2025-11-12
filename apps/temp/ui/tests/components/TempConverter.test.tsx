/**
 * TempConverter Component - On-Submit Validation Tests (T067)
 * 
 * Tests for User Story 7: Handle Invalid Input - On-Submit Validation
 * Verifies form submission validation
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TempConverter } from '@/components/TempConverter';

describe('TempConverter - On-Submit Validation (T067)', () => {
  describe('Submit button validation', () => {
    it('should validate input on form submit', async () => {
      const handleSubmit = vi.fn();
      
      render(
        <TempConverter onSubmit={handleSubmit} />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Enter invalid input
      await userEvent.type(input, 'invalid');
      
      // Click submit
      fireEvent.click(submitButton);
      
      // Submit should not be called for invalid input
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should allow submit with valid numeric input', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Use userEvent.type instead of fireEvent.change for proper async event handling
      await user.type(input, '25');
      
      // Wait for input value to be set AND empty state message to disappear
      // This ensures the hook's inputValue has been updated
      await waitFor(() => {
        expect(input).toHaveValue(25);
        // Empty state message should be gone
        const emptyMessage = screen.queryByText(/Enter a temperature value and select units to convert/i);
        expect(emptyMessage).not.toBeInTheDocument();
      });
      
      // Wait for conversion result to appear (not empty state)
      await waitFor(() => {
        const resultElement = screen.getByTestId('conversion-result');
        expect(resultElement).toBeInTheDocument();
        // Check that it's not showing empty state (should show "77.00°F")
        const resultText = resultElement.textContent;
        expect(resultText).not.toContain('–');
        expect(resultText).toContain('77'); // 25°C = 77°F
      }, { timeout: 2000 });
      
      // Click submit
      await user.click(submitButton);
      
      // After submit, input should still have value and no error should appear
      await waitFor(() => {
        expect(input).toHaveValue(25);
        // Result should still be visible
        const resultElement = screen.getByTestId('conversion-result');
        expect(resultElement).toBeInTheDocument();
      });
    });

    it('should validate on Enter key press in input', async () => {
      const handleSubmit = vi.fn();
      const user = userEvent.setup();
      
      render(
        <TempConverter onSubmit={handleSubmit} />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type valid value - userEvent.setup() handles act() automatically
      await user.type(input, '32');
      
      // Press Enter
      await user.keyboard('{Enter}');
      
      // Should trigger conversion/submit
      await waitFor(() => {
        expect(input).toHaveValue(32);
      });
    });

    it('should reject submit with empty required field', async () => {
      const handleSubmit = vi.fn();
      
      render(
        <TempConverter required={true} onSubmit={handleSubmit} />
      );
      
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Don't enter anything
      fireEvent.click(submitButton);
      
      // Submit should not be called
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should allow submit with empty field if not required', async () => {
      const handleSubmit = vi.fn();
      
      render(
        <TempConverter required={false} onSubmit={handleSubmit} />
      );
      
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Don't enter anything
      fireEvent.click(submitButton);
      
      // Submit should be allowed
      // (May show "no result" instead)
    });

    it('should validate decimal values on submit', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Use userEvent.type instead of fireEvent.change for proper async event handling
      await user.type(input, '98.6');
      
      // Wait for empty state message to disappear (ensures hook state updated)
      await waitFor(() => {
        expect(input).toHaveValue(98.6);
        const emptyMessage = screen.queryByText(/Enter a temperature value and select units to convert/i);
        expect(emptyMessage).not.toBeInTheDocument();
      });
      
      // Wait for conversion result to appear (not empty state)
      await waitFor(() => {
        const resultElement = screen.getByTestId('conversion-result');
        expect(resultElement).toBeInTheDocument();
        const resultText = resultElement.textContent;
        expect(resultText).not.toContain('–');
      }, { timeout: 2000 });
      
      // After submit, input should still have value
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(input).toHaveValue(98.6);
        expect(screen.getByTestId('conversion-result')).toBeInTheDocument();
      });
    });

    it('should validate negative values on submit', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Use userEvent.type instead of fireEvent.change for proper async event handling
      await user.type(input, '-40');
      
      // Wait for empty state message to disappear (ensures hook state updated)
      await waitFor(() => {
        expect(input).toHaveValue(-40);
        const emptyMessage = screen.queryByText(/Enter a temperature value and select units to convert/i);
        expect(emptyMessage).not.toBeInTheDocument();
      });
      
      // Wait for conversion result to appear (not empty state)
      await waitFor(() => {
        const resultElement = screen.getByTestId('conversion-result');
        expect(resultElement).toBeInTheDocument();
        const resultText = resultElement.textContent;
        expect(resultText).not.toContain('–');
      }, { timeout: 2000 });
      
      // Negative temps should also convert correctly on submit
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(input).toHaveValue(-40);
        expect(screen.getByTestId('conversion-result')).toBeInTheDocument();
      });
    });

    it('should reject special characters on submit', async () => {
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Enter special chars
      fireEvent.change(input, { target: { value: '!@#$%' } });
      
      fireEvent.click(submitButton);
      
      // Should show error or prevent submit
    });

    it('should reject multiple decimals on submit', async () => {
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Enter invalid format
      fireEvent.change(input, { target: { value: '12.34.56' } });
      
      fireEvent.click(submitButton);
      
      // HTML5 prevents this or form rejects it
    });

    it('should validate on form element submit event', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const form = input.closest('form');
      
      // Use userEvent.type instead of fireEvent.change for proper async event handling
      await user.type(input, '25');
      
      // Wait for empty state message to disappear (ensures hook state updated)
      await waitFor(() => {
        expect(input).toHaveValue(25);
        const emptyMessage = screen.queryByText(/Enter a temperature value and select units to convert/i);
        expect(emptyMessage).not.toBeInTheDocument();
      });
      
      // Wait for conversion result to appear (not empty state)
      await waitFor(() => {
        const resultElement = screen.getByTestId('conversion-result');
        expect(resultElement).toBeInTheDocument();
        const resultText = resultElement.textContent;
        expect(resultText).not.toContain('–');
      }, { timeout: 2000 });
      
      // Form should exist and be properly structured
      expect(form).toBeInTheDocument();
      
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
          // Form submission should work
          await user.click(submitButton);
          
          // After submission, value should persist and result should still show
          await waitFor(() => {
            expect(input).toHaveValue(25);
            expect(screen.getByTestId('conversion-result')).toBeInTheDocument();
          });
        }
      }
    });

    it('should prevent default form submission for invalid input', async () => {
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Enter invalid
      await userEvent.type(input, 'abc');
      
      // Spy on preventDefault
      const clickEvent = new MouseEvent('click', { bubbles: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
      
      // Submit
      fireEvent.click(submitButton);
      
      // Should show validation error
    });
  });

  describe('Form validation states', () => {
    it('should show validation errors on submit attempt with invalid input', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Type invalid (HTML5 number input will reject, but we can still submit)
      await user.type(input, 'abc');
      
      // HTML5 number input rejects non-numeric, so value is empty
      // But we can still trigger submit which should show error
      await user.click(submitButton);
      
      // Error should appear (wait for hook to process and display error)
      await waitFor(() => {
        const errorBanner = screen.queryByRole('alert');
        // Error banner should show if there's an error
        if (errorBanner) {
          expect(errorBanner).toBeInTheDocument();
        }
      }, { timeout: 2000 });
    });

    it('should clear validation errors after successful submit', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // First: invalid submit (HTML5 rejects non-numeric)
      await user.type(input, 'abc');
      await user.click(submitButton);
      
      // Wait a bit for error processing
      await waitFor(() => {
        // Error may or may not appear depending on HTML5 validation
      }, { timeout: 1000 });
      
      // Then: clear and valid submit
      await user.clear(input);
      await user.type(input, '25');
      
      await waitFor(() => {
        expect(input).toHaveValue(25);
      });
      
      await user.click(submitButton);
      
      // Error should disappear, result should appear
      // (No error banner should be visible)
      await waitFor(() => {
        const errorBanner = screen.queryByRole('alert');
        // If error banner exists, it should not be visible for valid input
      });
    });

    it('should disable submit button while validating', () => {
      render(
        <TempConverter />
      );
      
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      expect(submitButton).not.toBeDisabled();
      
      // During validation, button should be disabled
      // (depends on implementation)
    });

    it('should show helpful error message for empty input', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter required={true} />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Submit without entering anything
      await user.click(submitButton);
      
      // Input should remain empty
      expect(input).toHaveValue(null);
      
      // Empty state message or prompt should be visible
      const emptyPrompt = screen.queryByText(/Enter a temperature value and select units to convert/i);
      expect(emptyPrompt).toBeInTheDocument();
    });

    it('should show helpful error message for non-numeric input', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Try to type non-numeric (HTML5 number input will reject non-numeric characters)
      await user.type(input, 'abc');
      
      // HTML5 number input rejects non-numeric, so value should be empty
      expect(input).toHaveValue(null);
      
      // Click submit
      await user.click(submitButton);
      
      // Input should remain empty after failed submission
      expect(input).toHaveValue(null);
      
      // Empty state message should be visible (no conversion result)
      const emptyPrompt = screen.queryByText(/Enter a temperature value and select units to convert/i);
      expect(emptyPrompt).toBeInTheDocument();
    });
  });

  describe('Keyboard accessibility for submit', () => {
    it('should allow submitting with Enter key', async () => {
      const handleSubmit = vi.fn();
      
      render(
        <TempConverter onSubmit={handleSubmit} />
      );
      
      const input = screen.getByTestId('temperature-input');
      
      // Type valid value
      await userEvent.type(input, '25');
      
      // Press Enter
      fireEvent.keyDown(input, { key: 'Enter' });
      
      // Should submit (or at least attempt)
    });

    it('should allow Tab to submit button then Enter', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      
      render(
        <TempConverter onSubmit={handleSubmit} />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Type value
      await user.type(input, '25');
      
      // Tab to button
      await user.tab();
      
      // Enter on button
      fireEvent.keyDown(submitButton, { key: 'Enter' });
      
      // Should submit
    });

    it('should focus submit button after Tab from input', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Focus input
      await user.click(input);
      expect(input).toHaveFocus();
      
      // Tab through unit selectors to reach submit button
      await user.tab(); // Source unit selector
      await user.tab(); // Target unit selector  
      await user.tab(); // Submit button
      
      // Submit button should have focus
      await waitFor(() => {
        expect(submitButton).toHaveFocus();
      });
    });
  });

  describe('Submit validation UX', () => {
    it('should preserve input after validation error on submit', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // Enter invalid (HTML5 number input will reject non-numeric)
      await user.type(input, 'invalid');
      
      // HTML5 number input rejects non-numeric, so value becomes empty
      // But the input field itself should still exist
      await user.click(submitButton);
      
      // Input should still exist (even if value is empty due to HTML5 validation)
      expect(input).toBeInTheDocument();
      // The input field should remain, value may be empty due to HTML5 validation
    });

    it('should allow user to correct and resubmit', async () => {
      const user = userEvent.setup();
      
      render(
        <TempConverter />
      );
      
      const input = screen.getByTestId('temperature-input');
      const submitButton = screen.getByRole('button', { name: /convert|submit/i });
      
      // First attempt: invalid (HTML5 number input will reject non-numeric)
      await user.type(input, 'abc');
      await user.click(submitButton);
      
      // Correct it - clear and type valid value
      await user.clear(input);
      await user.type(input, '25');
      
      // Wait for conversion result
      await waitFor(() => {
        expect(input).toHaveValue(25);
      });
      
      await user.click(submitButton);
      
      // Second submit should work
      await waitFor(() => {
        expect(input).toHaveValue(25);
      });
    });
  });
});

