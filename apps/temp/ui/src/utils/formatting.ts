/**
 * Temperature Converter Formatting Utilities
 * 
 * Provides functions for rounding, formatting, and displaying temperature values
 * with proper decimal place handling (2 decimal places per spec).
 */

/**
 * Rounds a temperature value to 2 decimal places
 * @param value - The temperature value to round
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns The rounded temperature value
 */
export function roundTemperature(value: number, decimalPlaces: number = 2): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(value * factor) / factor;
}

/**
 * Formats a temperature value for display with proper unit and decimal places
 * @param value - The temperature value to format
 * @param unit - The temperature unit ('C' or 'F')
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted temperature string (e.g., "32.00°F")
 */
export function formatTemperatureDisplay(
  value: number | null,
  unit: 'C' | 'F',
  decimalPlaces: number = 2
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '—';
  }

  const rounded = roundTemperature(value, decimalPlaces);
  const formatted = rounded.toFixed(decimalPlaces);
  return `${formatted}°${unit}`;
}

/**
 * Formats just the numeric portion with proper decimal places
 * @param value - The temperature value to format
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted numeric string (e.g., "32.00")
 */
export function formatTemperatureValue(
  value: number | null,
  decimalPlaces: number = 2
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '';
  }

  const rounded = roundTemperature(value, decimalPlaces);
  return rounded.toFixed(decimalPlaces);
}

/**
 * Parses user input string to a temperature number
 * @param input - The user input string
 * @returns The parsed number or null if invalid
 */
export function parseTemperatureInput(input: string): number | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmed = input.trim();
  if (trimmed === '') {
    return null;
  }

  const parsed = parseFloat(trimmed);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

/**
 * Validates if a string is a valid numeric temperature input
 * @param input - The user input string to validate
 * @returns True if valid numeric input, false otherwise
 */
export function isValidTemperatureInput(input: string): boolean {
  return parseTemperatureInput(input) !== null;
}

/**
 * Formats conversion direction text for display
 * @param sourceUnit - Source temperature unit
 * @param targetUnit - Target temperature unit
 * @returns Direction text (e.g., "Celsius to Fahrenheit")
 */
export function formatConversionDirection(
  sourceUnit: 'C' | 'F' | null,
  targetUnit: 'C' | 'F' | null
): string {
  if (!sourceUnit || !targetUnit) {
    return '';
  }

  const sourceLabel = sourceUnit === 'C' ? 'Celsius' : 'Fahrenheit';
  const targetLabel = targetUnit === 'C' ? 'Celsius' : 'Fahrenheit';
  return `${sourceLabel} to ${targetLabel}`;
}
