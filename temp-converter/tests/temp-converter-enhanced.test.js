import { describe, it, expect } from 'vitest';
import { convertTemperature } from '../src/temp-converter-core.js';

describe('Temperature Converter Enhanced Tests', () => {
  describe('Basic conversions', () => {
    it('converts 0°C to 32°F', () => {
      const result = convertTemperature({ value: 0, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '0 C is 32 F' });
    });

    it('converts 32°F to 0°C', () => {
      const result = convertTemperature({ value: 32, from: 'F', to: 'C' });
      expect(result).toEqual({ success: true, data: '32 F is 0 C' });
    });

    it('converts 100°C to 212°F', () => {
      const result = convertTemperature({ value: 100, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '100 C is 212 F' });
    });

    it('converts 212°F to 100°C', () => {
      const result = convertTemperature({ value: 212, from: 'F', to: 'C' });
      expect(result).toEqual({ success: true, data: '212 F is 100 C' });
    });
  });

  describe('Decimal precision', () => {
    it('handles decimal inputs correctly', () => {
      const result = convertTemperature({ value: 25.567, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '25.57 C is 78.02 F' });
    });

    it('handles negative decimals', () => {
      const result = convertTemperature({ value: -12.34, from: 'F', to: 'C' });
      expect(result).toEqual({ success: true, data: '-12.34 F is -24.63 C' });
    });

    it('rounds to 2 decimal places', () => {
      const result = convertTemperature({ value: 37.7777, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '37.78 C is 100 F' });
    });
  });

  describe('Case insensitive units', () => {
    it('handles lowercase units', () => {
      const result = convertTemperature({ value: 25, from: 'c', to: 'f' });
      expect(result).toEqual({ success: true, data: '25 C is 77 F' });
    });

    it('handles mixed case units', () => {
      const result = convertTemperature({ value: 32, from: 'C', to: 'f' });
      expect(result).toEqual({ success: true, data: '32 C is 89.6 F' });
    });
  });

  describe('Edge cases', () => {
    it('converts -40°C to -40°F', () => {
      const result = convertTemperature({ value: -40, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '-40 C is -40 F' });
    });

    it('converts -40°F to -40°C', () => {
      const result = convertTemperature({ value: -40, from: 'F', to: 'C' });
      expect(result).toEqual({ success: true, data: '-40 F is -40 C' });
    });
  });

  describe('Error handling', () => {
    it('rejects identical units', () => {
      const result = convertTemperature({ value: 0, from: 'C', to: 'C' });
      expect(result).toEqual({ success: false, error: 'Conversion units must differ.' });
    });

    it('rejects unsupported units', () => {
      const result = convertTemperature({ value: 0, from: 'C', to: 'K' });
      expect(result).toEqual({ success: false, error: 'Unsupported to unit "K". Use C or F.' });
    });

    it('rejects invalid numbers', () => {
      const result = convertTemperature({ value: 'abc', from: 'C', to: 'F' });
      expect(result).toEqual({ success: false, error: 'Value must be a valid number.' });
    });
  });
});
