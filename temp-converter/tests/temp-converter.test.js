import { describe, it, expect } from 'jest';
import { convertTemperature } from '../src/temp-converter.js';

describe('Temperature Converter', () => {
  describe('Basic Conversion Tests', () => {
    it('should convert 0°C to 32°F', () => {
      const result = convertTemperature(0, 'C', 'F');
      expect(result).toBe(32);
    });

    it('should convert 32°F to 0°C', () => {
      const result = convertTemperature(32, 'F', 'C');
      expect(result).toBe(0);
    });

    it('should convert 100°C to 212°F', () => {
      const result = convertTemperature(100, 'C', 'F');
      expect(result).toBe(212);
    });

    it('should convert 212°F to 100°C', () => {
      const result = convertTemperature(212, 'F', 'C');
      expect(result).toBe(100);
    });
  });

  describe('Edge Case Tests', () => {
    it('should convert -40°C to -40°F (special case)', () => {
      const result = convertTemperature(-40, 'C', 'F');
      expect(result).toBe(-40);
    });

    it('should return same value for same unit conversion', () => {
      const result = convertTemperature(25, 'C', 'C');
      expect(result).toBe(25);
    });

    it('should handle case insensitive units', () => {
      const result = convertTemperature(0, 'c', 'f');
      expect(result).toBe(32);
    });
  });

  describe('Error Handling Tests', () => {
    it('should throw error for invalid value type', () => {
      expect(() => {
        convertTemperature("not a number", 'C', 'F');
      }).toThrow('Value must be a valid number');
    });

    it('should throw error for missing fromUnit', () => {
      expect(() => {
        convertTemperature(0, null, 'F');
      }).toThrow('Both fromUnit and toUnit must be specified');
    });

    it('should throw error for missing toUnit', () => {
      expect(() => {
        convertTemperature(0, 'C', null);
      }).toThrow('Both fromUnit and toUnit must be specified');
    });

    it('should throw error for unsupported conversion', () => {
      expect(() => {
        convertTemperature(0, 'C', 'K');
      }).toThrow('Conversion from C to K is not supported');
    });
  });
});
