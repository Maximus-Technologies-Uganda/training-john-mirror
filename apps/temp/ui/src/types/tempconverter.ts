/**
 * Temperature Converter Type Definitions
 * 
 * Defines core types for the Temperature Converter UI application including:
 * - TemperatureState: Internal state representation
 * - ConversionError: Error information
 * - Temperature unit and conversion types
 */

/**
 * Supported temperature units
 */
export type TemperatureUnit = 'C' | 'F';

/**
 * Temperature conversion direction
 */
export type ConversionDirection = 'c-to-f' | 'f-to-c' | 'none';

/**
 * Represents conversion error information
 */
export interface ConversionError {
  /** Error type (same as key in error messages map) */
  type: ConversionErrorType;
  /** Human-readable error message */
  message: string;
  /** Field that caused the error (if applicable) */
  field?: 'input' | 'sourceUnit' | 'targetUnit';
  /** Timestamp when error occurred (ISO string) */
  timestamp: string;
}

/**
 * Types of errors that can occur during conversion
 */
export enum ConversionErrorType {
  /** Input is not a valid number */
  InvalidInput = 'INVALID_INPUT',
  /** Source and target units are identical */
  IdenticalUnits = 'IDENTICAL_UNITS',
  /** Invalid unit selected */
  InvalidUnit = 'INVALID_UNIT',
  /** Result out of acceptable range */
  ResultOutOfRange = 'RESULT_OUT_OF_RANGE',
  /** Generic conversion error */
  ConversionFailed = 'CONVERSION_FAILED',
  /** Generic error */
  Unknown = 'UNKNOWN',
}

/**
 * Internal state of the temperature converter
 */
export interface TemperatureState {
  /** Current input value as string (raw user input) */
  inputValue: string;
  /** Parsed numeric value of input (-1 if invalid) */
  inputNumber: number;
  /** Source temperature unit */
  sourceUnit: TemperatureUnit;
  /** Target temperature unit */
  targetUnit: TemperatureUnit;
  /** Conversion direction (derived from source/target) */
  direction: ConversionDirection;
  /** Conversion result in target unit (rounded to 2 decimals) */
  result: number | null;
  /** Whether result is valid */
  resultValid: boolean;
  /** Current error (null if no error) */
  error: ConversionError | null;
  /** Whether input has been validated (for on-blur validation) */
  inputTouched: boolean;
  /** Whether conversion has been attempted (for on-submit validation) */
  conversionAttempted: boolean;
}

/**
 * Public status information exposed to UI components
 * Derived from internal TemperatureState
 */
export interface TemperatureStatus {
  /** Whether input is valid for conversion */
  canConvert: boolean;
  /** Formatted input display */
  inputDisplay: string;
  /** Formatted result display */
  resultDisplay: string;
  /** Conversion direction for display */
  direction: ConversionDirection;
  /** Current error (null if none) */
  error: ConversionError | null;
  /** Whether error should be displayed (depends on validation state) */
  showError: boolean;
  /** Whether UI should be in loading state */
  isLoading: boolean;
}

/**
 * Configuration for temperature converter behavior
 */
export interface TemperatureConverterConfig {
  /** Decimal places to round results to (default: 2) */
  decimalPlaces?: number;
  /** Auto-dismiss error after N milliseconds (0 = no auto-dismiss) */
  errorAutoDismissMs?: number;
  /** Validate on-blur (default: true) */
  validateOnBlur?: boolean;
  /** Validate on-change (default: false) */
  validateOnChange?: boolean;
  /** Validate on-submit (default: true) */
  validateOnSubmit?: boolean;
}

/**
 * Hook return type for useTempConversion
 */
export interface UseTempConversionReturn {
  /** Current converter state */
  state: TemperatureState;
  /** Current public status */
  status: TemperatureStatus;
  
  /** Update input value */
  setInput: (value: string) => void;
  /** Set source temperature unit */
  setSourceUnit: (unit: TemperatureUnit) => void;
  /** Set target temperature unit */
  setTargetUnit: (unit: TemperatureUnit) => void;
  /** Perform conversion */
  convert: () => void;
  /** Mark input as touched (for on-blur validation) */
  markInputTouched: () => void;
  /** Clear current error */
  clearError: () => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Conversion result with metadata
 */
export interface ConversionResult {
  /** Input value */
  input: number;
  /** Source unit */
  sourceUnit: TemperatureUnit;
  /** Target unit */
  targetUnit: TemperatureUnit;
  /** Result value (rounded) */
  result: number;
  /** Whether conversion was successful */
  success: boolean;
  /** Error if conversion failed */
  error?: ConversionError;
}

/**
 * Validation result with details
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Error if validation failed */
  error?: ConversionError;
  /** Specific field that failed validation (if applicable) */
  failedField?: 'input' | 'sourceUnit' | 'targetUnit' | 'conversion';
}

/**
 * Custom error for temperature converter operations
 */
export class TemperatureConverterError extends Error {
  constructor(
    public type: ConversionErrorType,
    message: string,
    public field?: 'input' | 'sourceUnit' | 'targetUnit',
  ) {
    super(message);
    this.name = 'TemperatureConverterError';
  }
}
