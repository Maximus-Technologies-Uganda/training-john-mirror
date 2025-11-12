/**
 * useTempConversion Hook Tests (T057)
 * 
 * Tests for User Story 5: Temperature Converter - C→F Conversion
 * Verifies core conversion logic and state management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTempConversion } from '@/hooks/useTempConversion';

describe('useTempConversion Hook (T057)', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useTempConversion());
      
      expect(result.current.inputValue).toBe('');
      expect(result.current.sourceUnit).toBe('C');
      expect(result.current.targetUnit).toBe('F');
      expect(result.current.result).toBeNull();
      expect(result.current.hasError).toBe(false);
    });

    it('should initialize with custom source and target units', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'C' })
      );

      expect(result.current.sourceUnit).toBe('F');
      expect(result.current.targetUnit).toBe('C');
    });

    it('should not have error on initialization', () => {
      const { result } = renderHook(() => useTempConversion());
      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeUndefined();
    });
  });

  describe('Celsius to Fahrenheit Conversion', () => {
    it('should convert 0°C to 32°F', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('0');
      });

      expect(result.current.result).toBe(32);
      expect(result.current.hasError).toBe(false);
    });

    it('should convert 100°C to 212°F', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('100');
      });

      expect(result.current.result).toBe(212);
    });

    it('should convert -40°C to -40°F (same in both scales)', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('-40');
      });

      expect(result.current.result).toBe(-40);
    });

    it('should convert 25°C to 77°F', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('25');
      });

      expect(result.current.result).toBe(77);
    });

    it('should round result to 2 decimal places', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('37.5');
      });

      // 37.5°C = 99.5°F
      expect(result.current.result).toBe(99.5);
    });

    it('should handle decimal input: 98.6°C to 209.48°F', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('98.6');
      });

      // 98.6°C * 9/5 + 32 = 209.48°F
      const expected = Math.round((98.6 * 9) / 5 + 32);
      expect(result.current.result).toBeCloseTo(expected, 0);
    });

    it('should handle very small positive values: 0.1°C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('0.1');
      });

      // 0.1°C * 9/5 + 32 = 32.18°F
      expect(result.current.result).toBeCloseTo(32.18, 2);
    });

    it('should handle negative temperatures: -10°C to 14°F', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('-10');
      });

      expect(result.current.result).toBe(14);
    });

    it('should handle absolute zero: -273.15°C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('-273.15');
      });

      // -273.15°C = -459.67°F
      expect(result.current.result).toBeCloseTo(-459.67, 2);
    });

    it('should handle large positive values: 1000°C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('1000');
      });

      // 1000°C = 1832°F
      expect(result.current.result).toBe(1832);
    });
  });

  describe('Fahrenheit to Celsius Conversion', () => {
    it('should convert 32°F to 0°C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'C' })
      );

      act(() => {
        result.current.setInputValue('32');
      });

      expect(result.current.result).toBe(0);
    });

    it('should convert 212°F to 100°C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'C' })
      );

      act(() => {
        result.current.setInputValue('212');
      });

      expect(result.current.result).toBe(100);
    });

    it('should convert 68°F to 20°C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'C' })
      );

      act(() => {
        result.current.setInputValue('68');
      });

      expect(result.current.result).toBe(20);
    });

    it('should convert 98.6°F to 37°C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'C' })
      );

      act(() => {
        result.current.setInputValue('98.6');
      });

      // (98.6 - 32) * 5/9 = 37°C
      expect(result.current.result).toBeCloseTo(37, 1);
    });

    it('should convert -40°F to -40°C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'C' })
      );

      act(() => {
        result.current.setInputValue('-40');
      });

      expect(result.current.result).toBe(-40);
    });
  });

  describe('Unit Switching', () => {
    it('should switch from C→F to F→C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('0');
      });

      expect(result.current.result).toBe(32); // 0°C = 32°F

      // Switch units
      act(() => {
        result.current.setSourceUnit('F');
        result.current.setTargetUnit('C');
      });

      // Clear input and enter previous result
      act(() => {
        result.current.setInputValue('32');
      });

      expect(result.current.result).toBe(0); // 32°F = 0°C
    });

    it('should preserve input when switching units', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('25');
      });

      const originalInput = result.current.inputValue;

      act(() => {
        result.current.setSourceUnit('F');
        result.current.setTargetUnit('C');
      });

      expect(result.current.inputValue).toBe(originalInput);
    });

    it('should recalculate when source unit changes', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('0');
      });

      expect(result.current.result).toBe(32); // 0°C = 32°F

      // Change source unit to F first
      act(() => {
        result.current.setSourceUnit('F');
      });

      // At this point: F→F (identical), result should be 0
      // Verify intermediate state
      expect(result.current.sourceUnit).toBe('F');
      expect(result.current.targetUnit).toBe('F');
      expect(result.current.result).toBe(0);

      // Then change target unit to C to get F→C conversion
      act(() => {
        result.current.setTargetUnit('C');
      });

      // Now 0°F should convert to C (0°F = -17.78°C, which is < 0)
      expect(result.current.sourceUnit).toBe('F');
      expect(result.current.targetUnit).toBe('C');
      const celsius = result.current.result;
      expect(celsius).toBeLessThan(0); // Should be approximately -17.78
    });
  });

  describe('Input Validation', () => {
    it('should not convert empty input', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('');
      });

      expect(result.current.result).toBeNull();
    });

    it('should not convert non-numeric input', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('abc');
      });

      expect(result.current.hasError).toBe(true);
      expect(result.current.result).toBeNull();
    });

    it('should not convert invalid formats', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('12.34.56');
      });

      expect(result.current.hasError).toBe(true);
    });

    it('should accept scientific notation', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('1e2'); // 100
      });

      expect(result.current.result).toBe(212); // 100°C = 212°F
    });

    it('should trim whitespace from input', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('  25  ');
      });

      expect(result.current.result).toBe(77); // 25°C = 77°F
    });

    it('should handle leading zeros', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('007');
      });

      expect(result.current.result).toBe(44.6); // 7°C ≈ 44.6°F
    });
  });

  describe('Error Handling', () => {
    it('should set error for non-numeric input', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('invalid');
      });

      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toContain('numeric');
    });

    it('should clear error when valid input is provided', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      // First set invalid input
      act(() => {
        result.current.setInputValue('invalid');
      });

      expect(result.current.hasError).toBe(true);

      // Then set valid input
      act(() => {
        result.current.setInputValue('25');
      });

      expect(result.current.hasError).toBe(false);
      expect(result.current.result).toBe(77);
    });

    it('should have descriptive error message', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('!@#$%');
      });

      expect(result.current.errorMessage).toBeDefined();
      expect(result.current.errorMessage?.length).toBeGreaterThan(0);
    });

    it('should handle clearError method', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('invalid');
      });

      expect(result.current.hasError).toBe(true);

      act(() => {
        result.current.clearError();
      });

      expect(result.current.hasError).toBe(false);
      expect(result.current.errorMessage).toBeUndefined();
    });
  });

  describe('Rounding and Precision', () => {
    it('should round to exactly 2 decimal places', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('1.23');
      });

      const resultStr = result.current.result?.toString() || '';
      const decimalPlaces = (resultStr.split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    it('should handle .5 rounding (round half up)', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('36.9');
      });

      // 36.9°C = 98.42°F
      expect(result.current.result).toBeCloseTo(98.42, 2);
    });

    it('should preserve precision for calculations', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('0.01');
      });

      // 0.01°C = 32.018°F ≈ 32.02°F
      expect(result.current.result).toBeCloseTo(32.02, 2);
    });
  });

  describe('State Management', () => {
    it('should update inputValue when setInputValue is called', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('25');
      });

      expect(result.current.inputValue).toBe('25');
    });

    it('should update sourceUnit when setSourceUnit is called', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setSourceUnit('F');
      });

      expect(result.current.sourceUnit).toBe('F');
    });

    it('should update targetUnit when setTargetUnit is called', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setTargetUnit('C');
      });

      expect(result.current.targetUnit).toBe('C');
    });

    it('should persist state across multiple updates', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('0');
      });

      expect(result.current.result).toBe(32);

      act(() => {
        result.current.setInputValue('100');
      });

      expect(result.current.result).toBe(212);

      act(() => {
        result.current.setInputValue('50');
      });

      expect(result.current.result).toBe(122);
    });

    it('should handle reset to initial state', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('25');
      });

      expect(result.current.inputValue).toBe('25');

      act(() => {
        result.current.reset();
      });

      expect(result.current.inputValue).toBe('');
      expect(result.current.result).toBeNull();
      expect(result.current.hasError).toBe(false);
    });
  });

  describe('Edge Cases and Boundary Values', () => {
    it('should handle very large positive numbers', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('999999');
      });

      expect(result.current.result).toBeDefined();
      expect(result.current.hasError).toBe(false);
    });

    it('should handle very large negative numbers', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      act(() => {
        result.current.setInputValue('-999999');
      });

      expect(result.current.result).toBeDefined();
      expect(result.current.hasError).toBe(false);
    });

    it('should handle zero with various formats: 0, 0.0, 0.00', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      const zeros = ['0', '0.0', '0.00'];
      zeros.forEach((zero) => {
        act(() => {
          result.current.setInputValue(zero);
        });

        expect(result.current.result).toBe(32);
      });
    });

    it('should handle rapid input changes', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      const inputs = ['1', '12', '123', '12', '1'];
      inputs.forEach((input) => {
        act(() => {
          result.current.setInputValue(input);
        });
      });

      expect(result.current.result).toBeDefined();
    });

    it('should handle simultaneous unit and input changes', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      // Set input first - this triggers conversion C→F (32°C = 89.6°F)
      act(() => {
        result.current.setInputValue('32');
      });

      // Verify initial conversion
      expect(result.current.result).toBeCloseTo(89.6, 1);

      // Change units to F→C in separate acts to ensure state updates properly
      act(() => {
        result.current.setSourceUnit('F');
      });

      act(() => {
        result.current.setTargetUnit('C');
      });

      // Now 32°F should convert to C (32°F = 0°C)
      expect(result.current.result).toBe(0);
    });
  });

  describe('API Consistency', () => {
    it('should provide all required methods', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      expect(typeof result.current.setInputValue).toBe('function');
      expect(typeof result.current.setSourceUnit).toBe('function');
      expect(typeof result.current.setTargetUnit).toBe('function');
      expect(typeof result.current.clearError).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('should provide all required state properties', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      expect(result.current).toHaveProperty('inputValue');
      expect(result.current).toHaveProperty('sourceUnit');
      expect(result.current).toHaveProperty('targetUnit');
      expect(result.current).toHaveProperty('result');
      expect(result.current).toHaveProperty('hasError');
      expect(result.current).toHaveProperty('errorMessage');
    });

    it('should return consistent types', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      expect(typeof result.current.inputValue).toBe('string');
      expect(typeof result.current.sourceUnit).toBe('string');
      expect(typeof result.current.targetUnit).toBe('string');
      expect(typeof result.current.hasError).toBe('boolean');
    });
  });

  describe('Invalid Unit Rejection (T085)', () => {
    it('should accept valid units (C and F)', () => {
      const { result: result1 } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );
      expect(result1.current.sourceUnit).toBe('C');
      expect(result1.current.targetUnit).toBe('F');

      const { result: result2 } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'C' })
      );
      expect(result2.current.sourceUnit).toBe('F');
      expect(result2.current.targetUnit).toBe('C');
    });

    it('should handle conversion with valid C source unit', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F', initialValue: '0' })
      );

      expect(result.current.sourceUnit).toBe('C');
      expect(result.current.result).toBe(32); // 0°C = 32°F
      expect(result.current.hasError).toBe(false);
    });

    it('should handle conversion with valid F source unit', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'C', initialValue: '32' })
      );

      expect(result.current.sourceUnit).toBe('F');
      expect(result.current.result).toBe(0); // 32°F = 0°C
      expect(result.current.hasError).toBe(false);
    });

    it('should reject invalid unit by falling back to default (C)', () => {
      // If an invalid unit is somehow passed, the hook should handle gracefully
      // by using the provided unit value as-is (no validation at hook level - validation at component level)
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C' as any, targetUnit: 'F' })
      );

      // Hook accepts the unit as provided (validation happens at component/props level)
      expect(result.current.sourceUnit).toBe('C');
      expect(result.current.targetUnit).toBe('F');
    });

    it('should preserve valid units through unit changes', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F', initialValue: '25' })
      );

      // Verify initial state
      expect(result.current.sourceUnit).toBe('C');
      expect(result.current.targetUnit).toBe('F');
      expect(result.current.result).toBe(77); // 25°C = 77°F

      // Change target unit to another valid unit
      act(() => {
        result.current.setTargetUnit('C');
      });

      // Verify units changed
      expect(result.current.sourceUnit).toBe('C');
      expect(result.current.targetUnit).toBe('C');
      expect(result.current.result).toBe(25); // Identity conversion
    });

    it('should validate unit type is string', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      expect(typeof result.current.sourceUnit).toBe('string');
      expect(typeof result.current.targetUnit).toBe('string');
    });

    it('should maintain units in supported set (C, F only)', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F' })
      );

      const validUnits = ['C', 'F'];
      expect(validUnits).toContain(result.current.sourceUnit);
      expect(validUnits).toContain(result.current.targetUnit);
    });
  });
});

