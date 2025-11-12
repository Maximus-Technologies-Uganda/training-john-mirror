/**
 * Temperature Converter Validation Utilities
 * 
 * Provides functions for input validation with on-blur and on-submit patterns,
 * error detection, and error message generation.
 */

import {
  ConversionErrorType,
  ConversionError,
  TemperatureState,
  TemperatureUnit,
} from '../types/tempconverter';
import { parseTemperatureInput, isValidTemperatureInput } from './formatting';

/**
 * Error messages mapped to error types for consistent user communication
 */
const ERROR_MESSAGES: Record<ConversionErrorType, string> = {
  [ConversionErrorType.InvalidInput]: 'Please enter a valid numeric value',
  [ConversionErrorType.IdenticalUnits]: 'Source and target units cannot be the same',
  [ConversionErrorType.InvalidUnit]: 'Invalid unit selected',
  [ConversionErrorType.ResultOutOfRange]: 'Result is outside acceptable range',
  [ConversionErrorType.ConversionFailed]: 'Conversion failed. Please check your input.',
  [ConversionErrorType.Unknown]: 'An unknown error occurred',
};

/**
 * Gets the error message for a specific error type
 * @param errorType - The type of error
 * @returns The human-readable error message
 */
export function getErrorMessage(errorType: ConversionErrorType): string {
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ConversionErrorType.Unknown];
}

/**
 * Creates a ConversionError object with timestamp
 * @param type - The error type
 * @param field - The field that caused the error (optional)
 * @returns A ConversionError object
 */
export function createError(
  type: ConversionErrorType,
  field?: 'input' | 'sourceUnit' | 'targetUnit'
): ConversionError {
  return {
    type,
    message: getErrorMessage(type),
    field,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validates on-blur: only validate if input is touched and not empty
 * Empty input is allowed (user still typing), only validate if there's content
 * @param input - The input string value
 * @param inputTouched - Whether the input has been touched
 * @returns Error if validation fails, null otherwise
 */
export function validateOnBlur(
  input: string,
  inputTouched: boolean
): ConversionError | null {
  // Only validate if input is touched AND has content
  if (!inputTouched || !input || input.trim() === '') {
    return null;
  }

  // If there's content, validate it's a number
  if (!isValidTemperatureInput(input)) {
    return createError(ConversionErrorType.InvalidInput, 'input');
  }

  return null;
}

/**
 * Validates on-submit: stricter validation for form submission
 * Input must be provided and valid
 * @param input - The input string value
 * @returns Error if validation fails, null otherwise
 */
export function validateOnSubmit(input: string): ConversionError | null {
  // On submit, input is required
  if (!input || input.trim() === '') {
    return createError(ConversionErrorType.InvalidInput, 'input');
  }

  // Must be a valid number
  if (!isValidTemperatureInput(input)) {
    return createError(ConversionErrorType.InvalidInput, 'input');
  }

  return null;
}

/**
 * Validates that source and target units are different
 * @param sourceUnit - The source unit
 * @param targetUnit - The target unit
 * @returns Error if identical units, null otherwise
 */
export function validateDifferentUnits(
  sourceUnit: TemperatureUnit | null,
  targetUnit: TemperatureUnit | null
): ConversionError | null {
  if (!sourceUnit || !targetUnit) {
    return null;
  }

  if (sourceUnit === targetUnit) {
    return createError(ConversionErrorType.IdenticalUnits, 'targetUnit');
  }

  return null;
}

/**
 * Validates that a unit is valid (C or F)
 * @param unit - The unit to validate
 * @returns Error if invalid, null otherwise
 */
export function validateUnit(unit: TemperatureUnit | null): ConversionError | null {
  if (!unit) {
    return null;
  }

  if (unit !== 'C' && unit !== 'F') {
    return createError(ConversionErrorType.InvalidUnit, 'sourceUnit');
  }

  return null;
}

/**
 * Determines if error should be auto-dismissed based on state
 * Auto-dismiss when:
 * - Input error and input becomes valid
 * - Unit error and units become different
 * @param state - The current temperature state
 * @param previousError - The previous error (to detect changes)
 * @param dismissAfterMs - Milliseconds before auto-dismiss
 * @returns true if error should be auto-dismissed
 */
export function shouldAutoDismissError(
  state: TemperatureState,
  previousError: ConversionError | null,
  dismissAfterMs: number = 5000
): boolean {
  // No error to dismiss
  if (!previousError || !state.error) {
    return false;
  }

  // If error type changed, auto-dismiss old error
  if (previousError.type !== state.error.type) {
    return true;
  }

  // Input error: dismiss if input became valid and different
  if (previousError.type === ConversionErrorType.InvalidInput) {
    if (isValidTemperatureInput(state.inputValue)) {
      return true;
    }
  }

  // Identical units error: dismiss if units became different
  if (previousError.type === ConversionErrorType.IdenticalUnits) {
    if (state.sourceUnit !== state.targetUnit) {
      return true;
    }
  }

  return false;
}

/**
 * Comprehensive validation of conversion state
 * @param state - The temperature state to validate
 * @returns Array of all validation errors found
 */
export function validateConversionState(state: TemperatureState): ConversionError[] {
  const errors: ConversionError[] = [];

  // Validate input if touched or conversion attempted
  if (state.inputTouched || state.conversionAttempted) {
    const inputError = state.conversionAttempted
      ? validateOnSubmit(state.inputValue)
      : validateOnBlur(state.inputValue, state.inputTouched);

    if (inputError) {
      errors.push(inputError);
    }
  }

  // Validate units are different
  const unitError = validateDifferentUnits(state.sourceUnit, state.targetUnit);
  if (unitError) {
    errors.push(unitError);
  }

  // Validate units are valid
  const sourceUnitError = validateUnit(state.sourceUnit);
  if (sourceUnitError) {
    errors.push(sourceUnitError);
  }

  const targetUnitError = validateUnit(state.targetUnit);
  if (targetUnitError) {
    errors.push(targetUnitError);
  }

  return errors;
}

/**
 * Determines if conversion can proceed
 * Conversion can proceed if:
 * - Input is valid
 * - Units are different
 * - Units are valid
 * @param state - The temperature state to check
 * @returns true if conversion can proceed
 */
export function canConvert(state: TemperatureState): boolean {
  // Check for any validation errors
  const errors = validateConversionState(state);
  return errors.length === 0;
}

/**
 * Creates initial error state for a specific error type
 * @param errorType - The type of error to create
 * @returns Object with error and touched/attempted flags
 */
export function createInitialErrorState(errorType: ConversionErrorType): {
  error: ConversionError;
  inputTouched: boolean;
  conversionAttempted: boolean;
} {
  return {
    error: createError(errorType),
    inputTouched: true,
    conversionAttempted: errorType !== ConversionErrorType.InvalidInput,
  };
}

/**
 * Sanitizes user input by trimming whitespace
 * @param input - The input string to sanitize
 * @returns Trimmed input string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  return input.trim();
}

/**
 * Clears error by returning null
 * @returns null (no error)
 */
export function clearError(): null {
  return null;
}
