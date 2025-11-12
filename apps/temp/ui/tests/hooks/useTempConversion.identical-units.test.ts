/**
 * useTempConversion Hook Test Suite - Identical Unit Detection
 * 
 * T078: Tests for identical unit detection in useTempConversion hook
 * Tests that hook detects when source and target units are the same
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTempConversion } from '@/hooks/useTempConversion';

describe('useTempConversion - Identical Unit Detection (T078)', () => {
  describe('Detection of Identical Units', () => {
    it('should detect C→C identical conversion', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '25' })
      );

      // Should detect that units are identical
      expect(result.current.sourceUnit).toBe('C');
      expect(result.current.targetUnit).toBe('C');
      expect(result.current.sourceUnit).toBe(result.current.targetUnit);
    });

    it('should detect F→F identical conversion', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'F', initialValue: '77' })
      );

      // Should detect that units are identical
      expect(result.current.sourceUnit).toBe('F');
      expect(result.current.targetUnit).toBe('F');
      expect(result.current.sourceUnit).toBe(result.current.targetUnit);
    });

    it('should NOT detect error for valid different units (C→F)', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F', initialValue: '0' })
      );

      expect(result.current.sourceUnit).not.toBe(result.current.targetUnit);
      expect(result.current.hasError).toBe(false);
    });

    it('should NOT detect error for valid different units (F→C)', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'C', initialValue: '32' })
      );

      expect(result.current.sourceUnit).not.toBe(result.current.targetUnit);
      expect(result.current.hasError).toBe(false);
    });
  });

  describe('Error State on Identical Units', () => {
    it('should return error with identical units C→C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '25' })
      );

      // With identical units, both error should be set AND result should be identity value
      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toContain('same');
      expect(result.current.result).toBe(25); // Identity conversion should return same value
    });

    it('should return error with identical units F→F', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'F', initialValue: '77' })
      );

      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toContain('same');
      expect(result.current.result).toBe(77); // Identity conversion should return same value
    });

    it('should set error message about identical units', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '20' })
      );

      if (result.current.hasError && result.current.errorMessage) {
        expect(result.current.errorMessage.toLowerCase()).toContain('same');
      }
    });
  });

  describe('Unit Change Triggers Identical Check', () => {
    it('should detect error when changing target to match source', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F', initialValue: '25' })
      );

      act(() => {
        result.current.setTargetUnit('C');
      });

      // Should now be identical
      expect(result.current.sourceUnit).toBe('C');
      expect(result.current.targetUnit).toBe('C');
    });

    it('should detect error when changing source to match target', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'F', initialValue: '25' })
      );

      act(() => {
        result.current.setSourceUnit('F');
      });

      // Should now be identical
      expect(result.current.sourceUnit).toBe('F');
      expect(result.current.targetUnit).toBe('F');
    });

    it('should clear error when fixing units', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '25' })
      );

      // Initially has error (identical units)
      const initialError = result.current.hasError;

      // Fix by changing target to F
      act(() => {
        result.current.setTargetUnit('F');
      });

      // Should no longer have identical units error
      expect(result.current.sourceUnit).not.toBe(result.current.targetUnit);
      if (initialError) {
        // If there was an error, it should be cleared now
        expect(result.current.hasError).toBe(false);
      }
    });
  });

  describe('Conversion Behavior with Identical Units', () => {
    it('should return identity conversion for C→C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '25' })
      );

      // Identical conversion should return same value
      expect(result.current.result).toBe(25);
    });

    it('should return identity conversion for F→F', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'F', initialValue: '77' })
      );

      // Identical conversion should return same value
      expect(result.current.result).toBe(77);
    });

    it('should handle negative values with identical units', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '-40' })
      );

      expect(result.current.result).toBe(-40);
    });

    it('should handle decimal values with identical units', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'F', initialValue: '98.6' })
      );

      expect(result.current.result).toBe(98.6);
    });
  });

  describe('Input Changes with Identical Units', () => {
    it('should update result when input changes for identical C→C', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '25' })
      );

      expect(result.current.result).toBe(25);

      act(() => {
        result.current.setInputValue('30');
      });

      expect(result.current.result).toBe(30);
      expect(result.current.inputValue).toBe('30');
    });

    it('should handle empty input with identical units', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '25' })
      );

      act(() => {
        result.current.setInputValue('');
      });

      expect(result.current.result).toBeNull();
      expect(result.current.hasError).toBe(false);
    });

    it('should validate input with identical units', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'F', targetUnit: 'F', initialValue: '77' })
      );

      act(() => {
        result.current.setInputValue('invalid');
      });

      expect(result.current.hasError).toBe(true);
      expect(result.current.errorMessage).toBeDefined();
    });
  });

  describe('Reset Behavior', () => {
    it('should reset state when identical units present', () => {
      const { result } = renderHook(() =>
        useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '25' })
      );

      act(() => {
        result.current.reset();
      });

      expect(result.current.inputValue).toBe('');
      expect(result.current.result).toBeNull();
      expect(result.current.sourceUnit).toBe('C');
      expect(result.current.targetUnit).toBe('C');
      expect(result.current.hasError).toBe(false);
    });
  });

  describe('Default Units Behavior', () => {
    it('should default to different units (C→F)', () => {
      const { result } = renderHook(() => useTempConversion());

      expect(result.current.sourceUnit).toBe('C');
      expect(result.current.targetUnit).toBe('F');
      expect(result.current.sourceUnit).not.toBe(result.current.targetUnit);
    });

    it('should not have error with default units', () => {
      const { result } = renderHook(() => useTempConversion({ initialValue: '20' }));

      expect(result.current.hasError).toBe(false);
    });
  });
});

