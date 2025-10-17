import { describe, it, expect } from 'vitest';
import { convertTemperature } from '../../temp-converter/src/temp-converter-core.js';

function expectConversion(value, from, to, expected) {
    const result = convertTemperature({ value, from, to });
    expect(result).toEqual({ success: true, data: expected });
}

function expectFailure(value, from, to, expectedError) {
    const result = convertTemperature({ value, from, to });
    expect(result).toEqual({ success: false, error: expectedError });
}

describe('Temperature Converter Enhanced Tests', () => {
    describe('Basic conversions', () => {
        it('converts 0°C to 32°F', () => {
            expectConversion(0, 'C', 'F', '0 C is 32 F');
        });

        it('converts 32°F to 0°C', () => {
            expectConversion(32, 'F', 'C', '32 F is 0 C');
        });

        it('converts 100°C to 212°F', () => {
            expectConversion(100, 'C', 'F', '100 C is 212 F');
        });

        it('converts 212°F to 100°C', () => {
            expectConversion(212, 'F', 'C', '212 F is 100 C');
        });
    });

    describe('Decimal precision', () => {
        it('handles decimal inputs correctly', () => {
            expectConversion(37.5, 'C', 'F', '37.5 C is 99.5 F');
        });

        it('handles negative decimals', () => {
            expectConversion(-40, 'C', 'F', '-40 C is -40 F');
        });

        it('rounds to 2 decimal places', () => {
            expectConversion(1, 'C', 'F', '1 C is 33.8 F');
        });
    });

    describe('Case insensitive units', () => {
        it('handles lowercase units', () => {
            expectConversion(0, 'c', 'f', '0 C is 32 F');
        });

        it('handles mixed case units', () => {
            expectConversion(0, 'C', 'f', '0 C is 32 F');
        });
    });

    describe('Edge cases', () => {
        it('handles absolute zero in Celsius', () => {
            expectConversion(-273.15, 'C', 'F', '-273.15 C is -459.67 F');
        });

        it('handles absolute zero in Fahrenheit', () => {
            expectConversion(-459.67, 'F', 'C', '-459.67 F is -273.15 C');
        });

        it('handles very high temperatures', () => {
            expectConversion(1000, 'C', 'F', '1000 C is 1832 F');
        });
    });

    describe('Error handling', () => {
        it('throws error for invalid value', () => {
            expectFailure('invalid', 'C', 'F', 'Value must be a valid number.');
        });

        it('throws error for missing fromUnit', () => {
            expectFailure(0, null, 'F', 'Both "from" and "to" units are required.');
        });

        it('throws error for missing toUnit', () => {
            expectFailure(0, 'C', null, 'Both "from" and "to" units are required.');
        });

        it('throws error for unsupported conversion', () => {
            expectFailure(0, 'K', 'F', 'Unsupported from unit "K". Use C or F.');
        });

        it('handles same unit conversion', () => {
            expectFailure(25, 'C', 'C', 'Conversion units must differ.');
        });
    });

    describe('Boundary testing', () => {
        it('handles zero correctly', () => {
            expectConversion(0, 'C', 'F', '0 C is 32 F');
            expectConversion(0, 'F', 'C', '0 F is -17.78 C');
        });

        it('handles very small numbers', () => {
            expectConversion(0.01, 'C', 'F', '0.01 C is 32.02 F');
        });

        it('handles negative numbers', () => {
            expectConversion(-10, 'C', 'F', '-10 C is 14 F');
            expectConversion(-10, 'F', 'C', '-10 F is -23.33 C');
        });
    });

    describe('Precision testing', () => {
        it('maintains precision for common temperatures', () => {
            // Body temperature
            expectConversion(36.5, 'C', 'F', '36.5 C is 97.7 F');
            
            // Room temperature
            expectConversion(20, 'C', 'F', '20 C is 68 F');
            
            // Freezing point
            expectConversion(32, 'F', 'C', '32 F is 0 C');
        });
    });
});
