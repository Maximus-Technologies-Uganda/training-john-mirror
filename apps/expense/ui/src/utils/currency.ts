/**
 * Currency utility functions for expense amount handling
 *
 * The UI displays amounts in decimal format (e.g., "10.50")
 * The core logic stores amounts in cents (e.g., 1050)
 */

/**
 * Converts a decimal string to cents (integer)
 * Handles rounding for amounts with more than 2 decimal places
 *
 * @param decimalString - Amount as decimal string (e.g., "10.50", "10.505")
 * @returns Amount in cents (e.g., 1050, 1051)
 * @throws Error if input is not a valid positive number
 */
export function toCents(decimalString: string): number {
  // Validate input
  if (!decimalString || typeof decimalString !== 'string') {
    throw new Error('Amount must be a non-empty string');
  }

  // Parse the decimal string
  const num = parseFloat(decimalString.trim());

  // Validate the parsed number
  if (isNaN(num)) {
    throw new Error('Amount must be a valid number');
  }

  if (num < 0) {
    throw new Error('Amount cannot be negative');
  }

  if (num > 999999.99) {
    throw new Error('Amount cannot exceed $999,999.99');
  }

  // Convert to cents with proper rounding
  // Handle floating point precision by working with the decimal string directly
  const decimalStr = decimalString.trim();
  const parts = decimalStr.split('.');
  let cents = 0;

  if (parts.length === 1) {
    // No decimal part
    cents = parseInt(parts[0]) * 100;
  } else {
    // Has decimal part
    const integerPart = parseInt(parts[0] || '0');
    const decimalPart = parts[1].substring(0, 2).padEnd(2, '0'); // Take first 2 digits, pad if needed

    cents = integerPart * 100 + parseInt(decimalPart);

    // Handle rounding if there are more than 2 decimal places
    if (parts[1].length > 2) {
      const thirdDigit = parseInt(parts[1][2]);
      if (thirdDigit >= 5) {
        cents += 1; // Round up
      }
    }
  }

  return cents;
}

/**
 * Converts cents to a formatted decimal string for display
 *
 * @param cents - Amount in cents (e.g., 1050)
 * @returns Formatted decimal string (e.g., "10.50")
 */
export function fromCents(cents: number): string {
  // Validate input
  if (typeof cents !== 'number' || isNaN(cents)) {
    throw new Error('Cents must be a valid number');
  }

  if (cents < 0) {
    throw new Error('Cents cannot be negative');
  }

  if (!Number.isInteger(cents)) {
    throw new Error('Cents must be an integer');
  }

  // Convert cents to dollars and format with 2 decimal places
  const dollars = cents / 100;
  return dollars.toFixed(2);
}

/**
 * Formats a decimal string for consistent display
 * Ensures exactly 2 decimal places
 *
 * @param decimalString - Decimal string to format
 * @returns Formatted decimal string with 2 decimal places
 */
export function formatDecimal(decimalString: string): string {
  if (!isValidCurrencyAmount(decimalString)) {
    return '0.00';
  }

  try {
    const cents = toCents(decimalString);
    return fromCents(cents);
  } catch {
    // If conversion fails, return a safe default
    return '0.00';
  }
}

/**
 * Validates if a string represents a valid currency amount
 *
 * @param amount - Amount string to validate
 * @returns True if valid currency amount
 */
export function isValidCurrencyAmount(amount: string): boolean {
  try {
    const cents = toCents(amount);
    return cents >= 0 && cents <= 99999999; // 0 to $999,999.99
  } catch {
    return false;
  }
}

/**
 * Gets the display currency symbol
 * Currently hardcoded to USD, but could be made configurable
 */
export function getCurrencySymbol(): string {
  return '$';
}

/**
 * Formats cents as a full currency string with symbol
 *
 * @param cents - Amount in cents
 * @returns Formatted currency string (e.g., "$10.50")
 */
export function formatCurrency(cents: number): string {
  const symbol = getCurrencySymbol();
  const amount = fromCents(cents);
  return `${symbol}${amount}`;
}

/**
 * Parses a currency string back to cents
 * Handles various currency formats
 *
 * @param currencyString - Currency string (e.g., "$10.50", "10.50", "CAD 10.50")
 * @returns Amount in cents
 */
export function parseCurrencyString(currencyString: string): number {
  // Remove currency symbols, currency codes, and extra spaces
  const cleaned = currencyString
    .replace(/[$€£¥₽₩₦₨₪₫₡₵₺₴₸₼₲₱₭₯₰₳₶₷₹₻₽₾₿]/g, '')
    .replace(/\b[A-Z]{3}\s*/g, '') // Remove 3-letter currency codes like "CAD ", "USD ", etc.
    .trim();

  // Validate that we have a valid number after cleaning
  if (!cleaned || cleaned === '') {
    throw new Error('Invalid currency string format');
  }

  return toCents(cleaned);
}

/**
 * Calculates the difference between two amounts in cents
 *
 * @param amount1 - First amount in cents
 * @param amount2 - Second amount in cents
 * @returns Difference in cents (amount1 - amount2)
 */
export function calculateDifference(amount1: number, amount2: number): number {
  return amount1 - amount2;
}

/**
 * Sums multiple amounts in cents
 *
 * @param amounts - Array of amounts in cents
 * @returns Total sum in cents
 */
export function sumAmounts(amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}

/**
 * Constants for currency handling
 */
export const CURRENCY_CONSTANTS = {
  MAX_AMOUNT: 99999999, // $999,999.99 in cents
  MIN_AMOUNT: 0,
  DECIMAL_PLACES: 2,
  CURRENCY_SYMBOL: '$',
} as const;
