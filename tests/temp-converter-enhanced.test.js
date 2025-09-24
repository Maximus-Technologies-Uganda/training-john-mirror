import { describe, it, expect } from 'vitest';
import { convertTemperature } from '../src/temp-converter.js';

describe('Temperature Converter Enhanced Tests', () => {
    describe('Basic conversions', () => {
        it('converts 0°C to 32°F', () => {
            expect(convertTemperature(0, 'C', 'F')).toBe(32);
        });

        it('converts 32°F to 0°C', () => {
            expect(convertTemperature(32, 'F', 'C')).toBe(0);
        });

        it('converts 100°C to 212°F', () => {
            expect(convertTemperature(100, 'C', 'F')).toBe(212);
        });

        it('converts 212°F to 100°C', () => {
            expect(convertTemperature(212, 'F', 'C')).toBe(100);
        });
    });

    describe('Decimal precision', () => {
        it('handles decimal inputs correctly', () => {
            expect(convertTemperature(37.5, 'C', 'F')).toBe(99.5);
        });

        it('handles negative decimals', () => {
            expect(convertTemperature(-40, 'C', 'F')).toBe(-40);
        });

        it('rounds to 2 decimal places', () => {
            const result = convertTemperature(1, 'C', 'F');
            expect(result).toBe(33.8);
        });
    });

    describe('Case insensitive units', () => {
        it('handles lowercase units', () => {
            expect(convertTemperature(0, 'c', 'f')).toBe(32);
        });

        it('handles mixed case units', () => {
            expect(convertTemperature(0, 'C', 'f')).toBe(32);
        });
    });

    describe('Edge cases', () => {
        it('handles absolute zero in Celsius', () => {
            expect(convertTemperature(-273.15, 'C', 'F')).toBe(-459.67);
        });

        it('handles absolute zero in Fahrenheit', () => {
            expect(convertTemperature(-459.67, 'F', 'C')).toBe(-273.15);
        });

        it('handles very high temperatures', () => {
            const result = convertTemperature(1000, 'C', 'F');
            expect(result).toBe(1832);
        });
    });

    describe('Error handling', () => {
        it('throws error for invalid value', () => {
            expect(() => convertTemperature('invalid', 'C', 'F')).toThrow('Value must be a valid number');
        });

        it('throws error for missing fromUnit', () => {
            expect(() => convertTemperature(0, null, 'F')).toThrow('Both fromUnit and toUnit must be specified');
        });

        it('throws error for missing toUnit', () => {
            expect(() => convertTemperature(0, 'C', null)).toThrow('Both fromUnit and toUnit must be specified');
        });

        it('throws error for unsupported conversion', () => {
            expect(() => convertTemperature(0, 'K', 'F')).toThrow('Conversion from K to F is not supported');
        });

        it('handles same unit conversion', () => {
            expect(convertTemperature(25, 'C', 'C')).toBe(25);
        });
    });

    describe('Boundary testing', () => {
        it('handles zero correctly', () => {
            expect(convertTemperature(0, 'C', 'F')).toBe(32);
            expect(convertTemperature(0, 'F', 'C')).toBe(-17.78);
        });

        it('handles very small numbers', () => {
            const result = convertTemperature(0.01, 'C', 'F');
            expect(result).toBe(32.02);
        });

        it('handles negative numbers', () => {
            expect(convertTemperature(-10, 'C', 'F')).toBe(14);
            expect(convertTemperature(-10, 'F', 'C')).toBe(-23.33);
        });
    });

    describe('Precision testing', () => {
        it('maintains precision for common temperatures', () => {
            // Body temperature
            expect(convertTemperature(36.5, 'C', 'F')).toBe(97.7);
            
            // Room temperature
            expect(convertTemperature(20, 'C', 'F')).toBe(68);
            
            // Freezing point
            expect(convertTemperature(32, 'F', 'C')).toBe(0);
        });
    });
});
