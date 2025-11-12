/**
 * TempConverter Container Component
 * 
 * Main temperature converter form component that integrates:
 * - TemperatureInput: User input field with on-blur validation
 * - UnitSelectors: Source/target unit selection
 * - ConversionResult: Displays conversion result
 * - ErrorBanner: Shows validation errors with auto-dismiss
 * - useTempConversion hook: Core conversion logic
 * 
 * Features:
 * - On-blur validation triggered when user leaves input field
 * - On-submit validation triggered when user clicks convert button
 * - Error auto-dismissal when valid input is entered
 * - Full keyboard accessibility
 * - ARIA live regions for error announcements
 */

import React, { useRef } from 'react';
import { useTempConversion } from '@/hooks/useTempConversion';
import { ConversionErrorType } from '@/types/tempconverter';
import { validateOnBlur, validateOnSubmit } from '@/utils/validation';
import { TemperatureInput } from './TemperatureInput';
import { UnitSelectors } from './UnitSelectors';
import { ConversionResult } from './ConversionResult';
import { ErrorBanner } from './ErrorBanner';

export interface TempConverterProps {
  /** Optional CSS class for styling */
  className?: string;
  
  /** Whether input is required (default: false) */
  required?: boolean;
  
  /** Optional callback on successful submit */
  onSubmit?: (value: number, sourceUnit: 'C' | 'F', targetUnit: 'C' | 'F') => void;
  
  /** Auto-dismiss error after N milliseconds (default: 5000) */
  autoDismissErrorMs?: number;
  
  /** Minimum allowed value (default: -273.15 for absolute zero) */
  min?: number;
  
  /** Maximum allowed value */
  max?: number;
}

/**
 * TempConverter Component
 * 
 * Main form component for temperature conversion with comprehensive validation:
 * 
 * Validation Flow:
 * 1. On-blur validation: Triggered when user leaves input field
 *    - Checks if input is numeric
 *    - Shows error if invalid
 * 
 * 2. On-submit validation: Triggered when user clicks convert button
 *    - Checks if input is not empty (if required)
 *    - Checks if input is numeric
 *    - Performs conversion if valid
 *    - Shows error if invalid
 * 
 * 3. Error auto-dismiss: Triggered when error state clears
 *    - When user enters valid input after error
 *    - Smooth fade-out animation
 *    - Auto-dismiss after timeout
 * 
 * @example
 * const TempConverterExample = () => {
 *   return (
 *     <TempConverter
 *       required={false}
 *       autoDismissErrorMs={5000}
 *       onSubmit={(value, src, tgt) => {
 *         console.log(`Convert ${value}${src} to ${tgt}`);
 *       }}
 *     />
 *   );
 * };
 */
export const TempConverter: React.FC<TempConverterProps> = ({
  className = '',
  required = false,
  onSubmit,
  autoDismissErrorMs = 5000,
  min = -273.15, // Absolute zero in Celsius
  max,
}) => {
  const {
    inputValue,
    sourceUnit,
    targetUnit,
    result,
    hasError,
    errorMessage,
    setInputValue,
    setSourceUnit,
    setTargetUnit,
    clearError,
  } = useTempConversion();

  const inputRef = useRef<HTMLInputElement>(null);
  
  // Track whether input has been touched for blur validation
  const [inputTouched, setInputTouched] = React.useState(false);

  /**
   * Handle on-blur validation
   * Triggered when user leaves the input field
   */
  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    
    // Mark input as touched
    setInputTouched(true);

    // Validate using validateOnBlur utility
    const validationError = validateOnBlur(value, true);
    
    // If validation passes, clear error
    // If validation fails, error will be set by useTempConversion during its conversion attempt
    if (!validationError && !value) {
      // Empty input is allowed on blur
      clearError();
    } else if (!validationError && value) {
      // Valid input, conversion will happen automatically via hook
      clearError();
    }
    // If there's an error, the hook will set it during conversion
  };

  /**
   * Handle form submission
   * Triggered when user clicks "Convert" button or presses Enter in input
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate using validateOnSubmit utility
    const validationError = validateOnSubmit(inputValue);
    
    // If validation fails, return early (error is already set by hook)
    if (validationError) {
      return;
    }

    // Check required field (additional check beyond numeric validation)
    if (required && !inputValue) {
      return;
    }

    // Empty input is allowed (shows no result)
    if (!inputValue) {
      clearError();
      return;
    }

    // Validate against min/max if provided
    const numValue = parseFloat(inputValue);
    if (min !== undefined && numValue < min) {
      return;
    }

    if (max !== undefined && numValue > max) {
      return;
    }

    // Valid conversion - trigger callback if provided
    if (onSubmit && result !== null) {
      onSubmit(result, sourceUnit, targetUnit);
    }
  };

  /**
   * Handle unit change
   * T081: Let useTempConversion re-validate with new units
   * (may set error if new units are identical, or clear if different)
   */
  const handleSourceUnitChange = (unit: 'C' | 'F') => {
    setSourceUnit(unit);
    // Don't clear error immediately - let hook re-validate
    // The hook will call performConversion which will:
    // 1. Detect if units are now identical (T080) → set error
    // 2. Or clear error if units are now different
  };

  const handleTargetUnitChange = (unit: 'C' | 'F') => {
    setTargetUnit(unit);
    // Don't clear error immediately - let hook re-validate
    // The hook will call performConversion which will:
    // 1. Detect if units are now identical (T080) → set error
    // 2. Or clear error if units are now different
  };

  return (
    <div
      className={`temp-converter ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '32px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
      role="region"
      aria-label="Temperature converter"
      aria-live="polite"
      aria-describedby="converter-instructions"
    >
      {/* Page Title */}
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
        Temperature Converter
      </h1>

      {/* Hidden instructions for screen readers */}
      <p
        id="converter-instructions"
        style={{
          display: 'none',
        }}
      >
        Enter a temperature value, select source and target units, then click Convert or press Enter.
        Errors will be announced automatically. Press Escape to dismiss errors.
      </p>

      {/* Error Banner - Displayed above input with auto-dismiss */}
      <ErrorBanner
        error={
          hasError && errorMessage
            ? {
                // T081, T088: Determine error type based on message content
                type: errorMessage.includes('cannot be the same')
                  ? ConversionErrorType.IdenticalUnits
                  : errorMessage.includes('Invalid unit')
                  ? ConversionErrorType.InvalidUnit
                  : ConversionErrorType.InvalidInput,
                message: errorMessage,
                field:
                  errorMessage.includes('cannot be the same')
                    ? 'sourceUnit'
                    : errorMessage.includes('Invalid unit')
                    ? errorMessage.includes('source unit')
                      ? 'sourceUnit'
                      : 'targetUnit'
                    : 'input',
                timestamp: new Date().toISOString(),
              }
            : null
        }
        onClearError={clearError}
        autoDismissMs={autoDismissErrorMs}
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Input Field */}
        <TemperatureInput
          ref={inputRef}
          id="temp-input"
          value={inputValue}
          onChange={setInputValue}
          onBlur={handleInputBlur}
          placeholder="Enter temperature value"
          required={required}
          min={min}
          max={max}
          step={0.1}
          label="Temperature Value"
        />

        {/* Unit Selectors */}
        <UnitSelectors
          sourceUnit={sourceUnit}
          targetUnit={targetUnit}
          onSourceUnitChange={handleSourceUnitChange}
          onTargetUnitChange={handleTargetUnitChange}
        />

        {/* Convert Button */}
        <button
          type="submit"
          aria-label="Convert temperature (press Enter or click)"
          title="Click to convert, or press Enter from any field"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1976D2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2196F3';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid #2196F3';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          Convert
        </button>
      </form>

      {/* Conversion Result */}
      {inputValue && !hasError && sourceUnit !== targetUnit && (
        <ConversionResult
          value={result}
          sourceUnit={sourceUnit}
          targetUnit={targetUnit}
          isLoading={false}
        />
      )}

      {/* Empty State Message */}
      {!inputValue && (
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            color: '#999',
            padding: '32px',
          }}
        >
          <p>Enter a temperature value and select units to convert.</p>
        </div>
      )}
    </div>
  );
};

TempConverter.displayName = 'TempConverter';

