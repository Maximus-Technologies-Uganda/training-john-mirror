/**
 * TemperatureInput Component
 * 
 * Numeric input field for temperature values with keyboard support.
 * Accepts positive, negative, and decimal values.
 * 
 * Features:
 * - Numeric input with decimal support
 * - Keyboard navigation (arrow keys for increment/decrement)
 * - Accessibility: ARIA labels and screen reader support
 * - Optional step attribute for fine-tuning
 * - Responsive placeholder text
 */

import React, { forwardRef, useId } from 'react';
import { sanitizeInput } from '@/utils/validation';
import { parseTemperatureInput } from '@/utils/formatting';

export interface TemperatureInputProps {
  /** Current temperature value */
  value: number | string;

  /** Unique identifier for the input element */
  id?: string;

  /** Visible label text */
  label?: string;
  
  /** Callback when input value changes */
  onChange: (value: string) => void;
  
  /** Optional callback when input loses focus (blur event) */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  
  /** Optional CSS class for styling */
  className?: string;
  
  /** Step size for arrow key increments (default: 1) */
  step?: number;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Minimum value allowed */
  min?: number;
  
  /** Maximum value allowed */
  max?: number;
  
  /** ARIA label for screen readers */
  ariaLabel?: string;
  
  /** Disable the input */
  disabled?: boolean;
}

/**
 * TemperatureInput Component
 * 
 * Renders a numeric input field for temperature entry with:
 * - Decimal support for precise temperature values
 * - Keyboard arrow key support for increment/decrement
 * - Full keyboard accessibility (Tab navigation, focus management)
 * - ARIA labels for screen reader announcements
 * - Visual feedback and responsive design
 * 
 * @example
 * const [temp, setTemp] = useState('20');
 * 
 * return (
 *   <TemperatureInput
 *     value={temp}
 *     onChange={setTemp}
 *     placeholder="Enter temperature"
 *     step={0.1}
 *   />
 * );
 */
export const TemperatureInput = forwardRef<HTMLInputElement, TemperatureInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      className = '',
      step = 1,
      required = false,
      placeholder = 'Enter temperature value',
      min,
      max,
      ariaLabel = 'Temperature input field',
      disabled = false,
      id,
      label = 'Temperature Value',
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = sanitizeInput(event.target.value);
      onChange(sanitizedValue);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      // Call optional onBlur callback for validation
      if (onBlur) {
        onBlur(event);
      }

      const rawValue = event.currentTarget.value;
      const sanitizedValue = sanitizeInput(rawValue);
      const parsedValue = parseTemperatureInput(sanitizedValue);

      let nextValue = sanitizedValue;

      if (parsedValue !== null) {
        nextValue = parsedValue.toString();
      }

      if (nextValue !== rawValue) {
        onChange(nextValue);
        event.currentTarget.value = nextValue;
      }
      
      // Update styling
      event.currentTarget.style.borderColor = '#ddd';
      event.currentTarget.style.outline = 'none';
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow default browser behavior for arrow keys
      // (number input automatically increments/decrements)
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        // Let browser handle it
        return;
      }
    };

    // Convert value to string for controlled component
    let displayValue: string | number = '';

    if (typeof value === 'number') {
      displayValue = value;
    } else if (typeof value === 'string') {
      const sanitizedPropValue = sanitizeInput(value);

      if (sanitizedPropValue === '') {
        displayValue = '';
      } else {
        const parsedPropValue = parseTemperatureInput(sanitizedPropValue);
        if (
          parsedPropValue !== null &&
          sanitizedPropValue === parsedPropValue.toString()
        ) {
          displayValue = parsedPropValue;
        } else {
          displayValue = sanitizedPropValue;
        }
      }
    }

    return (
      <div
        className={`temperature-input-wrapper ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#555',
          }}
        >
          {label}
          {required && <span style={{ color: '#f44336' }}>*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-description="Enter a numeric temperature value. Use arrow keys to increment or decrement."
          aria-required={required}
          data-testid="temperature-input"
          style={{
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            cursor: disabled ? 'not-allowed' : 'text',
            backgroundColor: disabled ? '#f5f5f5' : '#fff',
            opacity: disabled ? 0.6 : 1,
            color: '#333',
            outlineOffset: '2px',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#2196F3';
            e.currentTarget.style.outline = '2px solid #2196F3';
          }}
          onBlur={handleBlur}
        />
      </div>
    );
  }
);

TemperatureInput.displayName = 'TemperatureInput';

