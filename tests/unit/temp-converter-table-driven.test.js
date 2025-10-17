/**
 * Table-Driven Tests for Temperature Converter Validation
 * Tests all validation scenarios using data-driven approach
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { convertTemperature } from '../../temp-converter/src/temp-converter-core.js';

function convertValue(options) {
  const result = convertTemperature(options);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

function getErrorMessage(options) {
  const result = convertTemperature(options);
  return result.success ? undefined : result.error;
}

describe('Temperature Converter - Table-Driven Validation Tests', () => {
  
  // Table of valid conversion test cases
  const validConversionTests = [
    {
      name: 'Celsius to Fahrenheit - basic',
      args: ['0', 'C', 'F'],
      expectedOutput: '0°C = 32°F',
      expectedExitCode: 0
    },
    {
      name: 'Fahrenheit to Celsius - basic', 
      args: ['32', 'F', 'C'],
      expectedOutput: '32°F = 0°C',
      expectedExitCode: 0
    },
    {
      name: 'Celsius to Fahrenheit - decimal',
      args: ['25.5', 'C', 'F'],
      expectedOutput: '25.5°C = 77.9°F',
      expectedExitCode: 0
    },
    {
      name: 'Fahrenheit to Celsius - decimal',
      args: ['98.6', 'F', 'C'],
      expectedOutput: '98.6°F = 37°C',
      expectedExitCode: 0
    },
    {
      name: 'Negative temperature C to F',
      args: ['-40', 'C', 'F'],
      expectedOutput: '-40°C = -40°F',
      expectedExitCode: 0
    },
    {
      name: 'Negative temperature F to C',
      args: ['-40', 'F', 'C'],
      expectedOutput: '-40°F = -40°C',
      expectedExitCode: 0
    }
  ];

  // Table of error test cases
  const errorTests = [
    {
      name: 'Identical units C to C',
      args: ['0', 'C', 'C'],
      expectedError: 'Error: Conversion units must differ.',
      expectedExitCode: 1
    },
    {
      name: 'Identical units F to F',
      args: ['32', 'F', 'F'],
      expectedError: 'Error: Conversion units must differ.',
      expectedExitCode: 1
    },
    {
      name: 'Invalid unit K',
      args: ['0', 'K', 'F'],
      expectedError: 'Error: Unsupported from unit "K". Use C or F.',
      expectedExitCode: 1
    },
    {
      name: 'Invalid unit X',
      args: ['0', 'C', 'X'],
      expectedError: 'Error: Unsupported to unit "X". Use C or F.',
      expectedExitCode: 1
    },
    {
      name: 'Non-numeric value',
      args: ['abc', 'C', 'F'],
      expectedError: 'Error: Value must be a valid number.',
      expectedExitCode: 1
    },
    {
      name: 'Empty string value',
      args: ['', 'C', 'F'],
      expectedError: 'Usage: node temp-converter-cli.js <value> --from <C|F> --to <C|F>',
      expectedExitCode: 1
    },
    {
      name: 'NaN value',
      args: ['NaN', 'C', 'F'],
      expectedError: 'Error: Value must be a valid number.',
      expectedExitCode: 1
    },
    {
      name: 'Missing arguments',
      args: [],
      expectedError: 'Usage: node temp-converter-cli.js <value> --from <C|F> --to <C|F>',
      expectedExitCode: 1
    },
    {
      name: 'Insufficient arguments - only value',
      args: ['0'],
      expectedError: 'Usage: node temp-converter-cli.js <value> --from <C|F> --to <C|F>',
      expectedExitCode: 1
    },
    {
      name: 'Insufficient arguments - value and fromUnit',
      args: ['0', 'C'],
      expectedError: 'Usage: node temp-converter-cli.js <value> --from <C|F> --to <C|F>',
      expectedExitCode: 1
    }
  ];

  // Table of lowercase handling test cases
  const lowercaseTests = [
    {
      name: 'Lowercase c to f',
      args: ['0', 'c', 'f'],
      expectedOutput: '0°c = 32°f',
      expectedExitCode: 0
    },
    {
      name: 'Mixed case C to f',
      args: ['32', 'C', 'f'],
      expectedOutput: '32°C = 89.6°f',
      expectedExitCode: 0
    },
    {
      name: 'Mixed case c to F',
      args: ['100', 'c', 'F'],
      expectedOutput: '100°c = 212°F',
      expectedExitCode: 0
    }
  ];

  // Table of whitespace handling test cases
  const whitespaceTests = [
    {
      name: 'Whitespace around units',
      args: [' 0 ', ' C ', ' F '],
      expectedOutput: '0°C = 32°F',
      expectedExitCode: 0
    },
    {
      name: 'Whitespace around value',
      args: ['  25.5  ', 'C', 'F'],
      expectedOutput: '25.5°C = 77.9°F',
      expectedExitCode: 0
    }
  ];

  // Helper function to run CLI command
  function runCLI(args) {
    try {
      const result = execSync(`node temp-converter/src/temp-converter-cli.js ${args.join(' ')}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return {
        stdout: result.trim(),
        stderr: '',
        exitCode: 0
      };
    } catch (error) {
      // In our CLI, error messages go to stdout via console.error
      const errorOutput = error.stdout ? error.stdout.trim() : '';
      return {
        stdout: errorOutput,
        stderr: error.stderr ? error.stderr.trim() : '',
        exitCode: error.status || 1
      };
    }
  }

  // Test valid conversions
  describe('Valid Conversions', () => {
    validConversionTests.forEach(testCase => {
      it(testCase.name, () => {
        const result = runCLI(testCase.args);
        
        expect(result.exitCode).toBe(testCase.expectedExitCode);
        expect(result.stdout).toBe(convertValue({ value: testCase.args[0], from: testCase.args[1], to: testCase.args[2] }));
      });
    });
  });

  // Test error cases (negative tests)
  describe('Error Cases (Negative Tests)', () => {
    errorTests.forEach(testCase => {
      it(testCase.name, () => {
        const result = runCLI(testCase.args);
        
        expect(result.exitCode).toBe(testCase.expectedExitCode);
        const output = result.stderr || result.stdout;
        if (testCase.expectedError.startsWith('Usage:')) {
          expect(output).toContain('Usage: node temp-converter-cli.js');
        } else {
          const expected = getErrorMessage({ value: testCase.args[0], from: testCase.args[1], to: testCase.args[2] });
          expect(output).toContain(expected);
        }
      });
    });
  });

  // Test lowercase handling
  describe('Lowercase Unit Handling', () => {
    lowercaseTests.forEach(testCase => {
      it(testCase.name, () => {
        const result = runCLI(testCase.args);
        
        expect(result.exitCode).toBe(testCase.expectedExitCode);
        expect(result.stdout).toBe(convertValue({ value: testCase.args[0], from: testCase.args[1], to: testCase.args[2] }));
      });
    });
  });

  // Test whitespace handling
  describe('Whitespace Handling', () => {
    whitespaceTests.forEach(testCase => {
      it(testCase.name, () => {
        const result = runCLI(testCase.args);
        
        expect(result.exitCode).toBe(testCase.expectedExitCode);
        expect(result.stdout).toBe(convertValue({ value: testCase.args[0], from: testCase.args[1], to: testCase.args[2] }));
      });
    });
  });

  // Test pure function validation
  describe('Pure Function Validation', () => {
    const pureFunctionTests = [
      {
        name: 'Valid C to F conversion',
        value: 0,
        fromUnit: 'C',
        toUnit: 'F',
        expectedResult: 32,
        shouldThrow: false
      },
      {
        name: 'Valid F to C conversion',
        value: 32,
        fromUnit: 'F',
        toUnit: 'C',
        expectedResult: 0,
        shouldThrow: false
      },
      {
        name: 'Identical units should throw',
        value: 25,
        fromUnit: 'C',
        toUnit: 'C',
        expectedError: 'Conversion units must differ.',
        shouldThrow: true
      },
      {
        name: 'Invalid unit should throw',
        value: 0,
        fromUnit: 'K',
        toUnit: 'F',
        expectedError: 'Unsupported from unit "K". Use C or F.',
        shouldThrow: true
      },
      {
        name: 'Non-numeric value should throw',
        value: 'abc',
        fromUnit: 'C',
        toUnit: 'F',
        expectedError: 'Value must be a valid number.',
        shouldThrow: true
      },
      {
        name: 'Lowercase units should work',
        value: 0,
        fromUnit: 'c',
        toUnit: 'f',
        expectedResult: 32,
        shouldThrow: false
      }
    ];

    pureFunctionTests.forEach(testCase => {
      it(testCase.name, () => {
        if (testCase.shouldThrow) {
          const error = getErrorMessage({ value: testCase.value, from: testCase.fromUnit, to: testCase.toUnit });
          expect(error).toBe(testCase.expectedError);
        } else {
          const formatted = convertValue({ value: testCase.value, from: testCase.fromUnit, to: testCase.toUnit });
          expect(formatted).toBe(`${testCase.value} ${String(testCase.fromUnit).trim().toUpperCase()} is ${testCase.expectedResult} ${String(testCase.toUnit).trim().toUpperCase()}`);
        }
      });
    });
  });

  // Test edge cases
  describe('Edge Cases', () => {
    const edgeCaseTests = [
    {
      name: 'Very small decimal',
      args: ['0.001', 'C', 'F'],
      expectedOutput: '0.001°C = 32°F',
      expectedExitCode: 0
    },
      {
        name: 'Very large number',
        args: ['1000', 'C', 'F'],
        expectedOutput: '1000°C = 1832°F',
        expectedExitCode: 0
      },
      {
        name: 'Zero value',
        args: ['0', 'C', 'F'],
        expectedOutput: '0°C = 32°F',
        expectedExitCode: 0
      },
      {
        name: 'Negative zero',
        args: ['-0', 'C', 'F'],
        expectedOutput: '-0°C = 32°F',
        expectedExitCode: 0
      }
    ];

    edgeCaseTests.forEach(testCase => {
      it(testCase.name, () => {
        const result = runCLI(testCase.args);
        
        expect(result.exitCode).toBe(testCase.expectedExitCode);
        expect(result.stdout).toBe(convertValue({ value: testCase.args[0], from: testCase.args[1], to: testCase.args[2] }));
      });
    });
  });
});
