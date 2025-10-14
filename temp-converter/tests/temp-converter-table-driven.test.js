/**
 * Table-Driven Tests for Temperature Converter Validation
 * Tests all validation scenarios using data-driven approach
 */

import { describe, it, expect } from 'vitest';
import { convertTemperature } from '../src/temp-converter-core.js';

describe('Temperature Converter - Table-Driven Validation Tests', () => {
  const validConversionTests = [
    {
      name: 'Celsius to Fahrenheit - basic',
      options: { value: 0, from: 'C', to: 'F' },
      expectedData: '0 C is 32 F'
    },
    {
      name: 'Fahrenheit to Celsius - basic',
      options: { value: 32, from: 'F', to: 'C' },
      expectedData: '32 F is 0 C'
    },
    {
      name: 'Celsius to Fahrenheit - decimal',
      options: { value: 25.5, from: 'C', to: 'F' },
      expectedData: '25.5 C is 77.9 F'
    },
    {
      name: 'Fahrenheit to Celsius - decimal',
      options: { value: 98.6, from: 'F', to: 'C' },
      expectedData: '98.6 F is 37 C'
    },
    {
      name: 'Negative temperature C to F',
      options: { value: -40, from: 'C', to: 'F' },
      expectedData: '-40 C is -40 F'
    },
    {
      name: 'Negative temperature F to C',
      options: { value: -40, from: 'F', to: 'C' },
      expectedData: '-40 F is -40 C'
    }
  ];

  const errorTests = [
    {
      name: 'Identical units C to C',
      options: { value: 0, from: 'C', to: 'C' },
      expectedError: 'Conversion units must differ.'
    },
    {
      name: 'Identical units F to F',
      options: { value: 32, from: 'F', to: 'F' },
      expectedError: 'Conversion units must differ.'
    },
    {
      name: 'Invalid unit K',
      options: { value: 0, from: 'K', to: 'F' },
      expectedError: 'Unsupported from unit "K". Use C or F.'
    },
    {
      name: 'Invalid unit X',
      options: { value: 0, from: 'C', to: 'X' },
      expectedError: 'Unsupported to unit "X". Use C or F.'
    },
    {
      name: 'Non-numeric value',
      options: { value: 'abc', from: 'C', to: 'F' },
      expectedError: 'Value must be a valid number.'
    },
    {
      name: 'Empty string value',
      options: { value: '', from: 'C', to: 'F' },
      expectedError: 'Value must be a valid number.'
    },
    {
      name: 'NaN value',
      options: { value: NaN, from: 'C', to: 'F' },
      expectedError: 'Value must be a valid number.'
    },
    {
      name: 'Missing arguments',
      options: {},
      expectedError: 'Both "from" and "to" units are required.'
    },
    {
      name: 'Missing to unit',
      options: { value: 0, from: 'C' },
      expectedError: 'Both "from" and "to" units are required.'
    },
    {
      name: 'Missing from unit',
      options: { value: 0, to: 'F' },
      expectedError: 'Both "from" and "to" units are required.'
    }
  ];

  const lowercaseTests = [
    {
      name: 'Lowercase c to f',
      options: { value: 0, from: 'c', to: 'f' },
      expectedData: '0 C is 32 F'
    },
    {
      name: 'Mixed case C to f',
      options: { value: 32, from: 'C', to: 'f' },
      expectedData: '32 C is 89.6 F'
    },
    {
      name: 'Mixed case c to F',
      options: { value: 100, from: 'c', to: 'F' },
      expectedData: '100 C is 212 F'
    }
  ];

  const whitespaceTests = [
    {
      name: 'Whitespace around units',
      options: { value: ' 0 ', from: ' C ', to: ' F ' },
      expectedData: '0 C is 32 F'
    },
    {
      name: 'Whitespace around value',
      options: { value: '  25.5  ', from: 'C', to: 'F' },
      expectedData: '25.5 C is 77.9 F'
    }
  ];

  describe('Valid Conversions', () => {
    validConversionTests.forEach(testCase => {
      it(testCase.name, () => {
        const result = convertTemperature(testCase.options);
        expect(result).toEqual({ success: true, data: testCase.expectedData });
      });
    });
  });

  describe('Error Cases (Negative Tests)', () => {
    errorTests.forEach(testCase => {
      it(testCase.name, () => {
        const result = convertTemperature(testCase.options);
        expect(result).toEqual({ success: false, error: testCase.expectedError });
      });
    });
  });

  describe('Lowercase Unit Handling', () => {
    lowercaseTests.forEach(testCase => {
      it(testCase.name, () => {
        const result = convertTemperature(testCase.options);
        expect(result).toEqual({ success: true, data: testCase.expectedData });
      });
    });
  });

  describe('Whitespace Handling', () => {
    whitespaceTests.forEach(testCase => {
      it(testCase.name, () => {
        const result = convertTemperature(testCase.options);
        expect(result).toEqual({ success: true, data: testCase.expectedData });
      });
    });
  });
});
