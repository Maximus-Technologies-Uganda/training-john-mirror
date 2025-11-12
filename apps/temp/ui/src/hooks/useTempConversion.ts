/**
 * useTempConversion Hook
 * 
 * Core temperature conversion logic and state management.
 * Handles Celsius ↔ Fahrenheit bidirectional conversions.
 * 
 * Features:
 * - Bidirectional C↔F conversion
 * - Input validation (numeric only)
 * - Identical unit validation (T080: detect sourceUnit == targetUnit)
 * - Error auto-dismiss (T082: clear errors when units become different)
 * - Error state management with descriptive messages
 * - 2-decimal rounding precision
 * - State management (input, units, result, errors)
 */

import { useState, useCallback, useEffect } from 'react';

export type TemperatureUnit = 'C' | 'F';

/**
 * Valid temperature units (T086: restricted to C and F only)
 */
const VALID_TEMPERATURE_UNITS: readonly TemperatureUnit[] = ['C', 'F'] as const;

/**
 * Validates that a unit is valid (C or F only)
 * T087: Reject invalid units defensively
 */
function isValidTemperatureUnit(unit: string): unit is TemperatureUnit {
  return VALID_TEMPERATURE_UNITS.includes(unit as TemperatureUnit);
}

export interface UseTempConversionOptions {
  /** Initial source unit (default: 'C') */
  sourceUnit?: TemperatureUnit;
  
  /** Initial target unit (default: 'F') */
  targetUnit?: TemperatureUnit;
  
  /** Initial input value (default: '') */
  initialValue?: string;
}

export interface UseTempConversionReturn {
  /** Current input value as string */
  inputValue: string;
  
  /** Current source unit */
  sourceUnit: TemperatureUnit;
  
  /** Current target unit */
  targetUnit: TemperatureUnit;
  
  /** Converted result value */
  result: number | null;
  
  /** Whether there's an error */
  hasError: boolean;
  
  /** Error message (if any) */
  errorMessage?: string;
  
  /** Update input value */
  setInputValue: (value: string) => void;
  
  /** Update source unit */
  setSourceUnit: (unit: TemperatureUnit) => void;
  
  /** Update target unit */
  setTargetUnit: (unit: TemperatureUnit) => void;
  
  /** Clear error state */
  clearError: () => void;
  
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Validate if a string is a valid numeric value
 */
function isValidNumber(value: string): boolean {
  if (value.trim() === '') {
    return false;
  }
  
  // Count decimal points - should be 0 or 1 (reject multiple decimals like "12.34.56")
  const decimalCount = (value.match(/\./g) || []).length;
  if (decimalCount > 1) {
    return false;
  }
  
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * Convert Celsius to Fahrenheit
 * Formula: (°C × 9/5) + 32
 */
function celsiusToFahrenheit(celsius: number): number {
  const fahrenheit = (celsius * 9) / 5 + 32;
  // Round to 2 decimal places
  return Math.round(fahrenheit * 100) / 100;
}

/**
 * Convert Fahrenheit to Celsius
 * Formula: (°F - 32) × 5/9
 */
function fahrenheitToCelsius(fahrenheit: number): number {
  const celsius = ((fahrenheit - 32) * 5) / 9;
  // Round to 2 decimal places
  return Math.round(celsius * 100) / 100;
}

/**
 * Perform temperature conversion based on source and target units
 */
function convertTemperature(
  value: number,
  sourceUnit: TemperatureUnit,
  targetUnit: TemperatureUnit
): number {
  // If source and target are the same, return the value as-is
  if (sourceUnit === targetUnit) {
    return value;
  }
  
  // Convert from source to target
  if (sourceUnit === 'C' && targetUnit === 'F') {
    return celsiusToFahrenheit(value);
  }
  
  if (sourceUnit === 'F' && targetUnit === 'C') {
    return fahrenheitToCelsius(value);
  }
  
  // Fallback (should not reach here with valid units)
  return value;
}

/**
 * useTempConversion Hook
 * 
 * Manages temperature conversion state and provides methods for:
 * - Converting between Celsius and Fahrenheit
 * - Switching units dynamically
 * - Validating numeric input
 * - Error handling with auto-recovery
 * - State persistence
 * 
 * @param options - Hook configuration options
 * @returns Object with state and methods for temperature conversion
 * 
 * @example
 * const {
 *   inputValue,
 *   sourceUnit,
 *   targetUnit,
 *   result,
 *   hasError,
 *   errorMessage,
 *   setInputValue,
 *   setSourceUnit,
 *   setTargetUnit,
 *   clearError,
 *   reset,
 * } = useTempConversion({ sourceUnit: 'C', targetUnit: 'F' });
 * 
 * // User enters input
 * setInputValue('25');
 * console.log(result); // 77 (25°C = 77°F)
 * 
 * // User switches units
 * setSourceUnit('F');
 * setTargetUnit('C');
 * setInputValue('32');
 * console.log(result); // 0 (32°F = 0°C)
 * 
 * // Error handling
 * setInputValue('invalid');
 * console.log(hasError); // true
 * console.log(errorMessage); // "Please enter a valid numeric value"
 * setInputValue('20');
 * console.log(hasError); // false (error cleared on valid input)
 */
export function useTempConversion(
  options: UseTempConversionOptions = {}
): UseTempConversionReturn {
  // T087: Validate initial units and fallback to defaults if invalid
  const initialSourceUnit = options.sourceUnit && isValidTemperatureUnit(options.sourceUnit)
    ? options.sourceUnit
    : 'C';
  const initialTargetUnit = options.targetUnit && isValidTemperatureUnit(options.targetUnit)
    ? options.targetUnit
    : 'F';
  
  const [inputValue, setInputValue] = useState<string>(options.initialValue || '');
  const [sourceUnit, setSourceUnit] = useState<TemperatureUnit>(initialSourceUnit);
  const [targetUnit, setTargetUnit] = useState<TemperatureUnit>(initialTargetUnit);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<number | null>(null);

  /**
   * Perform conversion when input, source unit, or target unit changes
   * 
   * Validation order:
   * 1. Empty input: allowed (no error, result cleared)
   * 2. Numeric validation: error if not valid number
   * 3. Conversion: always perform (identity conversion for same units)
   * 4. Identical units (T080): signal error but allow conversion result
   * 
   * Note: Conversion logic is separate from validation display logic.
   * The hook always calculates the conversion result, and optionally
   * signals an error state that the parent component can use for display.
   */
  const performConversion = useCallback(
    (input: string, source: TemperatureUnit, target: TemperatureUnit) => {
      // Empty input: no conversion
      if (input.trim() === '') {
        setResult(null);
        setHasError(false);
        setErrorMessage(undefined);
        return;
      }

      // Validate numeric input FIRST (before checking units)
      if (!isValidNumber(input)) {
        setResult(null);
        setHasError(true);
        setErrorMessage(
          'Invalid input: Please enter a valid numeric value (e.g., 25, -40.5, 98.6). Letters and special characters are not allowed.'
        );
        return;
      }

      // Parse and convert (always perform conversion, even for identical units)
      try {
        const numValue = parseFloat(input);
        const convertedValue = convertTemperature(numValue, source, target);
        setResult(convertedValue);
        
        // T080: Check for identical units AFTER conversion (for error display)
        // This allows identity conversion (C→C returns same value) while
        // still signaling to parent component that an error should be displayed
        const isIdenticalUnits = source === target;
        
        if (isIdenticalUnits) {
          // Allow conversion but signal error for UI display
          setHasError(true);
          setErrorMessage(
            'Source and target units cannot be the same. Please select different units to convert.'
          );
        } else {
          // Valid conversion, no error
          // T082: Auto-dismiss error on successful conversion
          // Error is cleared when:
          // 1. Units become different (identical unit error dismissed)
          // 2. Input becomes valid (numeric error dismissed)
          // 3. Conversion succeeds (all validations passed)
          setHasError(false);
          setErrorMessage(undefined);
        }
      } catch (error) {
        setResult(null);
        setHasError(true);
        setErrorMessage('Conversion error. Please check your input.');
      }
    },
    []
  );

  /**
   * Handle input value changes
   */
  const handleSetInputValue = useCallback(
    (value: string) => {
      setInputValue(value);
      performConversion(value, sourceUnit, targetUnit);
    },
    [sourceUnit, targetUnit, performConversion]
  );

  /**
   * Handle source unit changes
   * T082: When units change, performConversion re-validates
   * If units are now different → identical unit error is dismissed
   * If units are still identical → error remains
   * T087: Validate unit is valid (C or F) before accepting
   */
  const handleSetSourceUnit = useCallback(
    (unit: TemperatureUnit) => {
      // T087: Validate unit is valid before accepting
      if (!isValidTemperatureUnit(unit)) {
        setHasError(true);
        setErrorMessage(`Invalid source unit: "${unit}". Only Celsius (C) and Fahrenheit (F) are supported.`);
        console.warn(`Invalid source unit rejected: ${unit}. Only C and F are allowed.`);
        return; // Reject invalid unit
      }
      
      setSourceUnit(unit);
      performConversion(inputValue, unit, targetUnit);
    },
    [inputValue, targetUnit, performConversion]
  );

  /**
   * Handle target unit changes
   * T082: When units change, performConversion re-validates
   * If units are now different → identical unit error is dismissed
   * If units are still identical → error remains
   * T087: Validate unit is valid (C or F) before accepting
   */
  const handleSetTargetUnit = useCallback(
    (unit: TemperatureUnit) => {
      // T087: Validate unit is valid before accepting
      if (!isValidTemperatureUnit(unit)) {
        setHasError(true);
        setErrorMessage(`Invalid target unit: "${unit}". Only Celsius (C) and Fahrenheit (F) are supported.`);
        console.warn(`Invalid target unit rejected: ${unit}. Only C and F are allowed.`);
        return; // Reject invalid unit
      }
      
      setTargetUnit(unit);
      performConversion(inputValue, sourceUnit, unit);
    },
    [inputValue, sourceUnit, performConversion]
  );

  /**
   * Clear error state manually
   */
  const handleClearError = useCallback(() => {
    setHasError(false);
    setErrorMessage(undefined);
  }, []);

  /**
   * Reset to initial state
   * T087: Use validated initial units
   */
  const handleReset = useCallback(() => {
    setInputValue('');
    setSourceUnit(initialSourceUnit);
    setTargetUnit(initialTargetUnit);
    setResult(null);
    setHasError(false);
    setErrorMessage(undefined);
  }, [initialSourceUnit, initialTargetUnit]);

  /**
   * Perform conversion on mount if initialValue is provided
   */
  useEffect(() => {
    if (options.initialValue) {
      performConversion(options.initialValue, sourceUnit, targetUnit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    inputValue,
    sourceUnit,
    targetUnit,
    result,
    hasError,
    errorMessage,
    setInputValue: handleSetInputValue,
    setSourceUnit: handleSetSourceUnit,
    setTargetUnit: handleSetTargetUnit,
    clearError: handleClearError,
    reset: handleReset,
  };
}
