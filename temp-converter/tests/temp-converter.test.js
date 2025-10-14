import { convertTemperature } from '../src/temp-converter-core.js';

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

    it('should reject same unit conversion', () => {
      const result = convertTemperature({ value: 25, from: 'C', to: 'C' });
      expect(result).toEqual({ success: false, error: 'Conversion units must differ.' });
    });

    it('should handle case insensitive units', () => {
      const result = convertTemperature({ value: 0, from: 'c', to: 'f' });
      expect(result).toEqual({ success: true, data: '0 C is 32 F' });
    });
  });

  describe('Validation Tests', () => {
    it('should reject invalid value type', () => {
      const result = convertTemperature({ value: 'not a number', from: 'C', to: 'F' });
      expect(result).toEqual({ success: false, error: 'Value must be a valid number.' });
    });

    it('should reject missing from unit', () => {
      const result = convertTemperature({ value: 0, to: 'F' });
      expect(result).toEqual({ success: false, error: 'Both "from" and "to" units are required.' });
    });

    it('should reject missing to unit', () => {
      const result = convertTemperature({ value: 0, from: 'C' });
      expect(result).toEqual({ success: false, error: 'Both "from" and "to" units are required.' });
    });

    it('should reject unsupported conversion', () => {
      const result = convertTemperature({ value: 0, from: 'C', to: 'K' });
      expect(result).toEqual({ success: false, error: 'Unsupported to unit "K". Use C or F.' });
    });
  });
});
