import { describe, it, expect } from 'vitest';
import { convertTemperature } from '../../temp-converter/src/temp-converter-core.js';

describe('Temperature Converter', () => {
  describe('Basic Conversion Tests', () => {
    it('should convert 0°C to 32°F', () => {
      const result = convertTemperature({ value: 0, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '0 C is 32 F' });
    });

    it('should convert 32°F to 0°C', () => {
      const result = convertTemperature({ value: 32, from: 'F', to: 'C' });
      expect(result).toEqual({ success: true, data: '32 F is 0 C' });
    });

    it('should convert 100°C to 212°F', () => {
      const result = convertTemperature({ value: 100, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '100 C is 212 F' });
    });

    it('should convert 212°F to 100°C', () => {
      const result = convertTemperature({ value: 212, from: 'F', to: 'C' });
      expect(result).toEqual({ success: true, data: '212 F is 100 C' });
    });
  });

  describe('Edge Case Tests', () => {
    it('should convert -40°C to -40°F (special case)', () => {
      const result = convertTemperature({ value: -40, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '-40 C is -40 F' });
    });

    it('should convert 37.5°C to 99.5°F', () => {
      const result = convertTemperature({ value: 37.5, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '37.5 C is 99.5 F' });
    });

    it('should reject identical unit conversion', () => {
      const result = convertTemperature({ value: 25, from: 'C', to: 'C' });
      expect(result).toEqual({ success: false, error: 'Conversion units must differ.' });
    });

    it('should handle case insensitive units', () => {
      const result = convertTemperature({ value: 0, from: 'c', to: 'f' });
      expect(result).toEqual({ success: true, data: '0 C is 32 F' });
    });
  });

  describe('Error Handling Tests', () => {
    it('should reject invalid value type', () => {
      const result = convertTemperature({ value: 'not a number', from: 'C', to: 'F' });
      expect(result).toEqual({ success: false, error: 'Value must be a valid number.' });
    });

    it('should reject missing fromUnit', () => {
      const result = convertTemperature({ value: 0, to: 'F' });
      expect(result).toEqual({ success: false, error: 'Both "from" and "to" units are required.' });
    });

    it('should reject missing toUnit', () => {
      const result = convertTemperature({ value: 0, from: 'C' });
      expect(result).toEqual({ success: false, error: 'Both "from" and "to" units are required.' });
    });

    it('should reject unsupported conversion', () => {
      const result = convertTemperature({ value: 0, from: 'C', to: 'K' });
      expect(result).toEqual({ success: false, error: 'Unsupported to unit "K". Use C or F.' });
    });

    it('should reject NaN value', () => {
      const result = convertTemperature({ value: NaN, from: 'C', to: 'F' });
      expect(result).toEqual({ success: false, error: 'Value must be a valid number.' });
    });
  });

  describe('Precision Tests', () => {
    it('should handle 33.333°C conversion', () => {
      const result = convertTemperature({ value: 33.333, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '33.33 C is 92 F' });
    });

    it('should handle 92°F conversion', () => {
      const result = convertTemperature({ value: 92, from: 'F', to: 'C' });
      expect(result).toEqual({ success: true, data: '92 F is 33.33 C' });
    });
  });

  describe('Comprehensive Conversion Tests', () => {
    it('should convert room temperature 20°C to 68°F', () => {
      const result = convertTemperature({ value: 20, from: 'C', to: 'F' });
      expect(result).toEqual({ success: true, data: '20 C is 68 F' });
    });

    it('should convert body temperature 98.6°F to 37°C', () => {
      const result = convertTemperature({ value: 98.6, from: 'F', to: 'C' });
      expect(result).toEqual({ success: true, data: '98.6 F is 37 C' });
    });

    it('should convert freezing point 0°F to -17.78°C', () => {
      const result = convertTemperature({ value: 0, from: 'F', to: 'C' });
      expect(result).toEqual({ success: true, data: '0 F is -17.78 C' });
    });
  });
});