import {
  toCents,
  fromCents,
  formatDecimal,
  isValidCurrencyAmount,
  getCurrencySymbol,
  formatCurrency,
  parseCurrencyString,
  calculateDifference,
  sumAmounts,
  CURRENCY_CONSTANTS
} from '../../src/utils/currency';

describe('Currency Utilities', () => {
  describe('toCents', () => {
    it('converts decimal string to cents correctly', () => {
      expect(toCents('10.50')).toBe(1050);
      expect(toCents('0.01')).toBe(1);
      expect(toCents('100')).toBe(10000);
      expect(toCents('0.00')).toBe(0);
    });

    it('handles rounding for more than 2 decimal places', () => {
      expect(toCents('10.505')).toBe(1051); // Rounds up
      expect(toCents('10.504')).toBe(1050); // Rounds down
      expect(toCents('1.005')).toBe(101); // Rounds up
    });

    it('handles whitespace trimming', () => {
      expect(toCents('  10.50  ')).toBe(1050);
      expect(toCents('\t10.50\n')).toBe(1050);
    });

    it('throws error for invalid input', () => {
      expect(() => toCents('')).toThrow('Amount must be a non-empty string');
      expect(() => toCents('abc')).toThrow('Amount must be a valid number');
      expect(() => toCents(null as any)).toThrow('Amount must be a non-empty string');
      expect(() => toCents(undefined as any)).toThrow('Amount must be a non-empty string');
    });

    it('throws error for negative amounts', () => {
      expect(() => toCents('-10.50')).toThrow('Amount cannot be negative');
      expect(() => toCents('-0.01')).toThrow('Amount cannot be negative');
    });

    it('throws error for amounts exceeding maximum', () => {
      expect(() => toCents('1000000.00')).toThrow('Amount cannot exceed $999,999.99');
      expect(() => toCents('999999.99')).not.toThrow(); // Should not throw
    });
  });

  describe('fromCents', () => {
    it('converts cents to decimal string correctly', () => {
      expect(fromCents(1050)).toBe('10.50');
      expect(fromCents(1)).toBe('0.01');
      expect(fromCents(10000)).toBe('100.00');
      expect(fromCents(0)).toBe('0.00');
    });

    it('throws error for invalid input', () => {
      expect(() => fromCents(NaN)).toThrow('Cents must be a valid number');
      expect(() => fromCents(null as any)).toThrow('Cents must be a valid number');
      expect(() => fromCents(undefined as any)).toThrow('Cents must be a valid number');
    });

    it('throws error for negative amounts', () => {
      expect(() => fromCents(-100)).toThrow('Cents cannot be negative');
    });

    it('throws error for non-integer amounts', () => {
      expect(() => fromCents(10.5)).toThrow('Cents must be an integer');
      expect(() => fromCents(100.9)).toThrow('Cents must be an integer');
    });
  });

  describe('formatDecimal', () => {
    it('formats valid decimal strings correctly', () => {
      expect(formatDecimal('10.50')).toBe('10.50');
      expect(formatDecimal('10.505')).toBe('10.51'); // Rounds up
      expect(formatDecimal('100')).toBe('100.00');
    });

    it('returns safe default for invalid input', () => {
      expect(formatDecimal('')).toBe('0.00');
      expect(formatDecimal('abc')).toBe('0.00');
      expect(formatDecimal('999999999999')).toBe('0.00'); // Would exceed max
    });
  });

  describe('isValidCurrencyAmount', () => {
    it('validates correct currency amounts', () => {
      expect(isValidCurrencyAmount('10.50')).toBe(true);
      expect(isValidCurrencyAmount('0.01')).toBe(true);
      expect(isValidCurrencyAmount('999999.99')).toBe(true);
      expect(isValidCurrencyAmount('100')).toBe(true);
    });

    it('rejects invalid currency amounts', () => {
      expect(isValidCurrencyAmount('')).toBe(false);
      expect(isValidCurrencyAmount('abc')).toBe(false);
      expect(isValidCurrencyAmount('-10.50')).toBe(false);
      expect(isValidCurrencyAmount('1000000.00')).toBe(false); // Exceeds max
      expect(isValidCurrencyAmount('10.505')).toBe(true); // Valid after rounding
    });
  });

  describe('getCurrencySymbol', () => {
    it('returns the correct currency symbol', () => {
      expect(getCurrencySymbol()).toBe('$');
    });
  });

  describe('formatCurrency', () => {
    it('formats cents as currency string', () => {
      expect(formatCurrency(1050)).toBe('$10.50');
      expect(formatCurrency(1)).toBe('$0.01');
      expect(formatCurrency(10000)).toBe('$100.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('throws error for invalid cents values', () => {
      expect(() => formatCurrency(-100)).toThrow('Cents cannot be negative');
      expect(() => formatCurrency(10.5)).toThrow('Cents must be an integer');
    });
  });

  describe('parseCurrencyString', () => {
    it('parses currency strings correctly', () => {
      expect(parseCurrencyString('$10.50')).toBe(1050);
      expect(parseCurrencyString('€10.50')).toBe(1050);
      expect(parseCurrencyString('£10.50')).toBe(1050);
      expect(parseCurrencyString('10.50')).toBe(1050);
      expect(parseCurrencyString('CAD 10.50')).toBe(1050);
    });

    it('handles various currency symbols', () => {
      expect(parseCurrencyString('¥100')).toBe(10000);
      expect(parseCurrencyString('₹500')).toBe(50000);
      expect(parseCurrencyString('₽1000')).toBe(100000);
    });

    it('handles whitespace', () => {
      expect(parseCurrencyString('  $10.50  ')).toBe(1050);
      expect(parseCurrencyString('\t€10.50\n')).toBe(1050);
    });

    it('throws error for invalid input', () => {
      expect(() => parseCurrencyString('')).toThrow();
      expect(() => parseCurrencyString('abc')).toThrow();
      expect(() => parseCurrencyString('$')).toThrow();
    });
  });

  describe('calculateDifference', () => {
    it('calculates difference correctly', () => {
      expect(calculateDifference(2000, 1500)).toBe(500); // 2000 - 1500 = 500
      expect(calculateDifference(1000, 1500)).toBe(-500); // 1000 - 1500 = -500
      expect(calculateDifference(1000, 1000)).toBe(0);
    });
  });

  describe('sumAmounts', () => {
    it('sums arrays of amounts correctly', () => {
      expect(sumAmounts([1000, 2000, 150])).toBe(3150);
      expect(sumAmounts([500])).toBe(500);
      expect(sumAmounts([])).toBe(0);
      expect(sumAmounts([100, -50, 25])).toBe(75);
    });
  });

  describe('CURRENCY_CONSTANTS', () => {
    it('has correct constant values', () => {
      expect(CURRENCY_CONSTANTS.MAX_AMOUNT).toBe(99999999); // $999,999.99 in cents
      expect(CURRENCY_CONSTANTS.MIN_AMOUNT).toBe(0);
      expect(CURRENCY_CONSTANTS.DECIMAL_PLACES).toBe(2);
      expect(CURRENCY_CONSTANTS.CURRENCY_SYMBOL).toBe('$');
    });
  });

  describe('Integration tests', () => {
    it('round-trip conversion works correctly', () => {
      const original = '10.50';
      const cents = toCents(original);
      const backToString = fromCents(cents);
      expect(backToString).toBe(original);
    });

    it('handles edge cases in conversion pipeline', () => {
      // Test rounding edge case
      const roundedUp = toCents('10.505'); // Should round to 1051
      expect(fromCents(roundedUp)).toBe('10.51');

      // Test zero handling
      expect(fromCents(toCents('0.00'))).toBe('0.00');

      // Test large amounts
      const largeAmount = '999999.99';
      expect(fromCents(toCents(largeAmount))).toBe(largeAmount);
    });

    it('formatCurrency uses consistent formatting', () => {
      const amounts = [1, 100, 1050, 10000, 99999999];
      amounts.forEach(amount => {
        const formatted = formatCurrency(amount);
        expect(formatted).toMatch(/^\$[0-9]+\.[0-9]{2}$/);
      });
    });
  });
});
