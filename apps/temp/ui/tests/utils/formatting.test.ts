/**
 * Temperature Formatting Utilities Test Suite
 * 
 * T085b: Tests for negative temperature conversion and special cases
 * Covers FR-017: handle negative temperature values correctly
 * Special case: -40°C = -40°F (unique convergence point)
 */

import { describe, it, expect } from 'vitest';
import {
  roundTemperature,
  formatTemperatureDisplay,
  formatTemperatureValue,
  parseTemperatureInput,
  isValidTemperatureInput,
  formatConversionDirection,
} from '@/utils/formatting';

describe('Temperature Formatting Utilities - Negative Values (T085b)', () => {
  describe('roundTemperature with negative values', () => {
    it('should round negative values to 2 decimal places', () => {
      expect(roundTemperature(-40.456)).toBe(-40.46);
      expect(roundTemperature(-32.125)).toBe(-32.12);
      expect(roundTemperature(-0.555)).toBe(-0.56);
    });

    it('should handle -40 (special convergence point)', () => {
      expect(roundTemperature(-40.0)).toBe(-40.0);
      expect(roundTemperature(-40.00)).toBe(-40.0);
    });

    it('should round negative values correctly with different decimal places', () => {
      expect(roundTemperature(-40.456, 1)).toBe(-40.5);
      expect(roundTemperature(-40.456, 3)).toBe(-40.456);
      expect(roundTemperature(-40.456, 0)).toBe(-40);
    });

    it('should handle negative near-zero values', () => {
      // Note: JavaScript's Math.round() rounds to nearest integer
      // -0.001 * 100 = -0.1, rounds to 0, then /100 = 0
      // -0.004 * 100 = -0.4, rounds to 0, then /100 = 0
      // -0.005 * 100 = -0.5, rounds to -0, then /100 = -0
      // -0.009 * 100 = -0.9, rounds to -1, then /100 = -0.01
      expect(Math.abs(roundTemperature(-0.001))).toBeLessThanOrEqual(0);
      expect(Math.abs(roundTemperature(-0.004))).toBeLessThanOrEqual(0);
      
      // -0.005 rounds to -0 (negative zero) due to Math.round behavior
      const result1 = roundTemperature(-0.005);
      expect(result1 === 0).toBe(true); // Accepts both +0 and -0 (they're equal)
      
      // -0.009 rounds to -0.01
      expect(roundTemperature(-0.009)).toBe(-0.01);
    });
  });

  describe('formatTemperatureDisplay with negative values', () => {
    it('should format negative Celsius correctly', () => {
      expect(formatTemperatureDisplay(-40, 'C')).toBe('-40.00°C');
      expect(formatTemperatureDisplay(-32.5, 'C')).toBe('-32.50°C');
      expect(formatTemperatureDisplay(-0.25, 'C')).toBe('-0.25°C');
    });

    it('should format negative Fahrenheit correctly', () => {
      expect(formatTemperatureDisplay(-40, 'F')).toBe('-40.00°F');
      expect(formatTemperatureDisplay(-32, 'F')).toBe('-32.00°F');
      expect(formatTemperatureDisplay(-0.5, 'F')).toBe('-0.50°F');
    });

    it('should handle the special -40 convergence point', () => {
      // -40°C = -40°F is the unique point where Celsius and Fahrenheit converge
      expect(formatTemperatureDisplay(-40, 'C')).toBe('-40.00°C');
      expect(formatTemperatureDisplay(-40, 'F')).toBe('-40.00°F');
    });

    it('should handle extreme negative values', () => {
      expect(formatTemperatureDisplay(-273.15, 'C')).toBe('-273.15°C'); // Absolute zero
      expect(formatTemperatureDisplay(-459.67, 'F')).toBe('-459.67°F'); // Absolute zero in F
    });

    it('should return dash for null/undefined negative values', () => {
      expect(formatTemperatureDisplay(null, 'C')).toBe('—');
      expect(formatTemperatureDisplay(null as unknown as number, 'F')).toBe('—');
    });
  });

  describe('formatTemperatureValue with negative values', () => {
    it('should format negative numeric values to 2 decimal places', () => {
      expect(formatTemperatureValue(-40)).toBe('-40.00');
      expect(formatTemperatureValue(-32.5)).toBe('-32.50');
      expect(formatTemperatureValue(-0.25)).toBe('-0.25');
    });

    it('should handle negative values with different decimal places', () => {
      expect(formatTemperatureValue(-40.123, 1)).toBe('-40.1');
      expect(formatTemperatureValue(-40.123, 3)).toBe('-40.123');
      expect(formatTemperatureValue(-40.123, 0)).toBe('-40');
    });

    it('should return empty string for null/undefined', () => {
      expect(formatTemperatureValue(null)).toBe('');
      expect(formatTemperatureValue(null as unknown as number)).toBe('');
    });
  });

  describe('parseTemperatureInput with negative values', () => {
    it('should parse negative numeric strings correctly', () => {
      expect(parseTemperatureInput('-40')).toBe(-40);
      expect(parseTemperatureInput('-32.5')).toBe(-32.5);
      expect(parseTemperatureInput('-0.25')).toBe(-0.25);
    });

    it('should parse negative values with whitespace', () => {
      expect(parseTemperatureInput('  -40  ')).toBe(-40);
      expect(parseTemperatureInput('-40')).toBe(-40);
      expect(parseTemperatureInput('  -32.5')).toBe(-32.5);
    });

    it('should handle negative zero', () => {
      // JavaScript preserves negative zero: parseFloat('-0') returns -0
      // Both -0 and +0 are equal with == and ===, but different with Object.is
      const result1 = parseTemperatureInput('-0');
      expect(result1 === 0).toBe(true); // Accepts both +0 and -0 (they're equal)
      
      const result2 = parseTemperatureInput('-0.0');
      expect(result2 === 0).toBe(true); // Accepts both +0 and -0 (they're equal)
    });

    it('should return null for invalid inputs', () => {
      expect(parseTemperatureInput('abc')).toBeNull();
      expect(parseTemperatureInput('')).toBeNull();
      expect(parseTemperatureInput('--40')).toBeNull();
    });
  });

  describe('isValidTemperatureInput with negative values', () => {
    it('should validate negative numeric inputs as valid', () => {
      expect(isValidTemperatureInput('-40')).toBe(true);
      expect(isValidTemperatureInput('-32.5')).toBe(true);
      expect(isValidTemperatureInput('-0.25')).toBe(true);
    });

    it('should reject invalid negative inputs', () => {
      expect(isValidTemperatureInput('--40')).toBe(false);
      expect(isValidTemperatureInput('-abc')).toBe(false);
      expect(isValidTemperatureInput('')).toBe(false);
    });
  });

  describe('formatConversionDirection with negative values', () => {
    it('should format conversion direction for negative temperatures', () => {
      // Note: formatConversionDirection doesn't care about the value, only units
      expect(formatConversionDirection('C', 'F')).toBe('Celsius to Fahrenheit');
      expect(formatConversionDirection('F', 'C')).toBe('Fahrenheit to Celsius');
    });

    it('should handle null units gracefully', () => {
      expect(formatConversionDirection(null, 'F')).toBe('');
      expect(formatConversionDirection('C', null)).toBe('');
      expect(formatConversionDirection(null, null)).toBe('');
    });
  });

  describe('Negative Temperature Edge Cases', () => {
    it('should handle rounding at negative boundary values', () => {
      // Test values just above/below rounding threshold
      // Math.round(-0.004 * 100) = Math.round(-0.4) = 0, then /100 = 0
      const result1 = roundTemperature(-0.004);
      expect(Math.abs(result1)).toBeLessThanOrEqual(0); // Should round toward zero
      
      // Math.round(-0.005 * 100) = Math.round(-0.5) = -0, then /100 = -0
      const result2 = roundTemperature(-0.005);
      expect(result2 === 0).toBe(true); // Accepts both +0 and -0 (they're equal)
      
      // Math.round(-0.006 * 100) = Math.round(-0.6) = -1, then /100 = -0.01
      expect(roundTemperature(-0.006)).toBe(-0.01);
    });

    it('should correctly format the -40 convergence point', () => {
      // Special case in thermodynamics: -40°C = -40°F
      // Verify both formatting and rounding work correctly
      expect(formatTemperatureDisplay(-40, 'C')).toBe('-40.00°C');
      expect(formatTemperatureDisplay(-40, 'F')).toBe('-40.00°F');
      expect(formatTemperatureValue(-40)).toBe('-40.00');
      expect(parseTemperatureInput('-40')).toBe(-40);
    });

    it('should handle negative values with extreme precision', () => {
      expect(roundTemperature(-40.12345678, 2)).toBe(-40.12);
      expect(roundTemperature(-40.12345678, 4)).toBe(-40.1235);
      expect(roundTemperature(-40.12345678, 8)).toBe(-40.12345678);
    });

    it('should maintain sign consistency for negative values', () => {
      // Verify negative sign is preserved through all operations
      const value = -32.5;
      const rounded = roundTemperature(value);
      expect(Object.is(rounded, -32.5)).toBe(true); // Checks sign bit
      
      const formatted = formatTemperatureDisplay(value, 'C');
      expect(formatted.startsWith('-')).toBe(true);
      
      const parsed = parseTemperatureInput('-32.5');
      expect(parsed).toBeLessThan(0);
    });
  });

  describe('Conversion Formula Verification with Negatives', () => {
    /**
     * Celsius to Fahrenheit: F = (C × 9/5) + 32
     * Fahrenheit to Celsius: C = (F - 32) × 5/9
     * 
     * Special cases:
     * -40°C = -40°F (convergence point)
     * -273.15°C = absolute zero in Celsius
     * -459.67°F = absolute zero in Fahrenheit
     */

    it('should handle negative Celsius conversions correctly', () => {
      // -40°C should convert to -40°F
      const negForty = roundTemperature(-40 * (9 / 5) + 32);
      expect(negForty).toBe(-40);

      // 0°C = 32°F (positive result from negative formula)
      const zero = roundTemperature(0 * (9 / 5) + 32);
      expect(zero).toBe(32);

      // -10°C = 14°F
      const negTen = roundTemperature(-10 * (9 / 5) + 32);
      expect(negTen).toBe(14);
    });

    it('should handle negative Fahrenheit conversions correctly', () => {
      // -40°F should convert to -40°C
      const negForty = roundTemperature((-40 - 32) * (5 / 9));
      expect(negForty).toBe(-40);

      // 32°F = 0°C
      const freezing = roundTemperature((32 - 32) * (5 / 9));
      expect(freezing).toBe(0);

      // -4°F = -20°C
      const negFour = roundTemperature((-4 - 32) * (5 / 9));
      expect(negFour).toBe(-20);
    });

    it('should verify -40 is the unique convergence point', () => {
      // Only temperature where C = F
      const c2f = -40 * (9 / 5) + 32; // Should equal -40
      const f2c = (-40 - 32) * (5 / 9); // Should equal -40
      
      expect(roundTemperature(c2f)).toBe(-40);
      expect(roundTemperature(f2c)).toBe(-40);
    });
  });
});

