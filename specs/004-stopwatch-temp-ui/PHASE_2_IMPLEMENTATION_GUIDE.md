# Phase 2 Implementation Guide: Gap Remediation & Improvements

**Status**: In Progress  
**Priority**: BLOCKING - Completes Phase 2  
**Estimated Time**: 12-16 hours  

---

## Quick Start

This guide provides step-by-step instructions to complete Phase 2 implementation. Start with **Priority 1** items, then proceed to **Priority 2**.

### Directory Structure Reference

```
apps/stopwatch/ui/
├── src/
│   ├── types/stopwatch.ts         ✅ COMPLETE
│   ├── utils/
│   │   ├── formatting.ts          ✅ COMPLETE
│   │   └── validation.ts          ✅ COMPLETE
│   ├── hooks/
│   │   └── useStopwatch.ts        ✅ COMPLETE
│   └── components/
│       └── ErrorBanner.tsx        ✅ COMPLETE
├── tests/
│   ├── setup.ts                   ⚠️ PARTIAL
│   ├── utils/
│   │   ├── formatting.test.ts     ❌ MISSING
│   │   └── validation.test.ts     ❌ MISSING
│   ├── hooks/
│   │   └── useStopwatch.test.ts   ❌ MISSING
│   └── components/
│       └── ErrorBanner.test.tsx   ❌ MISSING

apps/temp/ui/
├── src/
│   ├── types/tempconverter.ts    ✅ COMPLETE
│   ├── utils/
│   │   ├── formatting.ts         ✅ COMPLETE
│   │   └── validation.ts         ✅ COMPLETE
│   ├── hooks/
│   │   └── useTempConversion.ts  ✅ COMPLETE (w/ core integration issue)
│   └── components/
│       └── ErrorBanner.tsx       ✅ COMPLETE
├── tests/
│   ├── setup.ts                  ⚠️ PARTIAL
│   ├── utils/
│   │   ├── formatting.test.ts    ❌ MISSING
│   │   └── validation.test.ts    ❌ MISSING
│   ├── hooks/
│   │   └── useTempConversion.test.ts ❌ MISSING
│   └── components/
│       └── ErrorBanner.test.tsx  ❌ MISSING
```

---

## Priority 1: BLOCKING (Must Complete)

### Task 1.1: Enhance Test Setup Files

**Files**: 
- `apps/stopwatch/ui/tests/setup.ts`
- `apps/temp/ui/tests/setup.ts`

**Current Content**: Minimal, only basic cleanup

**Improvement**: Add test fixtures, mock factories, custom render helpers

#### Implementation:

**Step 1**: Update Stopwatch setup.ts

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup, render as rtlRender } from '@testing-library/react';
import type {
  StopwatchState,
  LapTime,
  StopwatchStatus,
  UseStopwatchReturn,
} from '@/types/stopwatch';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ============================================================================
// TEST FIXTURES
// ============================================================================

/**
 * Creates a mock StopwatchState for testing
 */
export const createMockStopwatchState = (
  overrides?: Partial<StopwatchState>
): StopwatchState => ({
  mode: 'idle',
  elapsedMs: 0,
  laps: [],
  hasError: false,
  ...overrides,
});

/**
 * Creates a mock LapTime for testing
 */
export const createMockLapTime = (
  lapNumber: number,
  intervalMs: number,
  totalMs: number
): LapTime => ({
  lapNumber,
  intervalMs,
  totalMs,
  timestamp: new Date().toISOString(),
});

/**
 * Creates multiple mock laps for testing
 */
export const createMockLaps = (count: number): LapTime[] => {
  const laps: LapTime[] = [];
  let totalMs = 0;
  for (let i = 1; i <= count; i++) {
    const intervalMs = 1000 * i; // Each lap adds 1s
    totalMs += intervalMs;
    laps.push(createMockLapTime(i, intervalMs, totalMs));
  }
  return laps;
};

/**
 * Creates a mock StopwatchStatus for testing
 */
export const createMockStopwatchStatus = (
  overrides?: Partial<StopwatchStatus>
): StopwatchStatus => ({
  isRunning: false,
  elapsedMs: 0,
  formattedTime: '00:00:00',
  laps: [],
  hasError: false,
  ...overrides,
});

/**
 * Creates a mock UseStopwatchReturn for testing
 */
export const createMockUseStopwatch = (
  overrides?: Partial<UseStopwatchReturn>
): UseStopwatchReturn => ({
  state: createMockStopwatchState(),
  status: createMockStopwatchStatus(),
  start: vi.fn(),
  stop: vi.fn(),
  lap: vi.fn(),
  reset: vi.fn(),
  clearError: vi.fn(),
  ...overrides,
});

// ============================================================================
// CUSTOM RENDER FUNCTION
// ============================================================================

interface RenderOptions {
  [key: string]: any;
}

/**
 * Custom render function with common providers
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  return rtlRender(ui, { ...options });
};

// Re-export React Testing Library utilities
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
```

**Step 2**: Update Temp setup.ts (similar pattern)

```typescript
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup, render as rtlRender } from '@testing-library/react';
import type {
  TemperatureState,
  TemperatureStatus,
  ConversionError,
  ConversionErrorType,
  UseTempConversionReturn,
} from '@/types/tempconverter';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ============================================================================
// TEST FIXTURES
// ============================================================================

/**
 * Creates a mock TemperatureState for testing
 */
export const createMockTemperatureState = (
  overrides?: Partial<TemperatureState>
): TemperatureState => ({
  inputValue: '',
  inputNumber: -1,
  sourceUnit: 'C',
  targetUnit: 'F',
  direction: 'c-to-f',
  result: null,
  resultValid: false,
  error: null,
  inputTouched: false,
  conversionAttempted: false,
  ...overrides,
});

/**
 * Creates a mock ConversionError for testing
 */
export const createMockConversionError = (
  type: ConversionErrorType,
  overrides?: Partial<ConversionError>
): ConversionError => ({
  type,
  message: `Test error: ${type}`,
  timestamp: new Date().toISOString(),
  ...overrides,
});

/**
 * Creates a mock TemperatureStatus for testing
 */
export const createMockTemperatureStatus = (
  overrides?: Partial<TemperatureStatus>
): TemperatureStatus => ({
  canConvert: true,
  inputDisplay: '',
  resultDisplay: '—',
  direction: 'none',
  error: null,
  showError: false,
  isLoading: false,
  ...overrides,
});

/**
 * Creates a mock UseTempConversionReturn for testing
 */
export const createMockUseTempConversion = (
  overrides?: Partial<UseTempConversionReturn>
): UseTempConversionReturn => ({
  state: createMockTemperatureState(),
  status: createMockTemperatureStatus(),
  setInput: vi.fn(),
  setSourceUnit: vi.fn(),
  setTargetUnit: vi.fn(),
  convert: vi.fn(),
  markInputTouched: vi.fn(),
  clearError: vi.fn(),
  reset: vi.fn(),
  ...overrides,
});

// ============================================================================
// CUSTOM RENDER FUNCTION
// ============================================================================

interface RenderOptions {
  [key: string]: any;
}

/**
 * Custom render function with common providers
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  return rtlRender(ui, { ...options });
};

// Re-export React Testing Library utilities
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
```

**Effort**: 1-2 hours  
**Validation**: 
- ✅ Files contain test fixtures
- ✅ Factories are exported and importable
- ✅ Custom render helper available

---

### Task 1.2: Create Utility Function Tests

#### Stopwatch Formatting Tests

**File**: `apps/stopwatch/ui/tests/utils/formatting.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import {
  formatTime,
  parseTime,
  formatInterval,
  formatLapDisplay,
} from '@/utils/formatting';

describe('Stopwatch Formatting Utilities', () => {
  describe('formatTime', () => {
    // Happy path
    it('should format milliseconds to MM:SS:MS', () => {
      expect(formatTime(5432)).toBe('00:05:43');
      expect(formatTime(65432)).toBe('01:05:43');
    });

    it('should format time correctly at boundaries', () => {
      expect(formatTime(0)).toBe('00:00:00');
      expect(formatTime(1000)).toBe('00:01:00');
      expect(formatTime(60000)).toBe('01:00:00');
    });

    // Edge cases
    it('should cap at 99:59:99', () => {
      expect(formatTime(359999)).toBe('99:59:99');
      expect(formatTime(999999)).toBe('99:59:99');
    });

    it('should handle negative values by capping at 0', () => {
      expect(formatTime(-100)).toBe('00:00:00');
      expect(formatTime(-1000)).toBe('00:00:00');
    });

    it('should handle centisecond precision', () => {
      expect(formatTime(100)).toBe('00:00:10'); // 100ms = 10 centiseconds
      expect(formatTime(990)).toBe('00:00:99'); // 990ms = 99 centiseconds
    });

    // Non-finite values
    it('should handle non-finite numbers', () => {
      expect(formatTime(NaN)).toBe('00:00:00');
      expect(formatTime(Infinity)).toBe('99:59:99');
      expect(formatTime(-Infinity)).toBe('00:00:00');
    });
  });

  describe('parseTime', () => {
    it('should parse MM:SS:MS format to milliseconds', () => {
      expect(parseTime('00:05:43')).toBe(5430);
      expect(parseTime('01:05:43')).toBe(65430);
    });

    it('should return null for invalid format', () => {
      expect(parseTime('5:43')).toBeNull();
      expect(parseTime('00:05')).toBeNull();
      expect(parseTime('invalid')).toBeNull();
    });

    it('should validate ranges', () => {
      expect(parseTime('99:59:99')).toBe(359999);
      expect(parseTime('100:00:00')).toBeNull(); // Exceeds max minutes
      expect(parseTime('00:60:00')).toBeNull(); // Exceeds max seconds
      expect(parseTime('00:00:100')).toBeNull(); // Exceeds max centiseconds
    });
  });

  describe('formatInterval', () => {
    it('should format interval to seconds with 2 decimals', () => {
      expect(formatInterval(5430)).toBe('5.43s');
      expect(formatInterval(1000)).toBe('1.00s');
      expect(formatInterval(65430)).toBe('65.43s');
    });

    it('should handle edge cases', () => {
      expect(formatInterval(0)).toBe('0.00s');
      expect(formatInterval(100)).toBe('0.10s');
      expect(formatInterval(10)).toBe('0.01s');
    });
  });

  describe('formatLapDisplay', () => {
    it('should format lap display string', () => {
      expect(formatLapDisplay(1, 5430, 5430)).toBe(
        'Lap 1: 5.43s (total: 5.43s)'
      );
      expect(formatLapDisplay(2, 3150, 8580)).toBe(
        'Lap 2: 3.15s (total: 8.58s)'
      );
    });

    it('should handle multiple laps with cumulative totals', () => {
      const lap1 = formatLapDisplay(1, 10000, 10000);
      const lap2 = formatLapDisplay(2, 5000, 15000);
      expect(lap1).toBe('Lap 1: 10.00s (total: 10.00s)');
      expect(lap2).toBe('Lap 2: 5.00s (total: 15.00s)');
    });
  });
});
```

#### Stopwatch Validation Tests

**File**: `apps/stopwatch/ui/tests/utils/validation.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import {
  validateStart,
  validateStop,
  validateLap,
  validateElapsedTime,
  validateState,
  hasValidError,
  shouldDismissError,
  getErrorMessage,
  createErrorState,
} from '@/utils/validation';
import { StopwatchErrorType } from '@/types/stopwatch';
import { createMockStopwatchState } from '../setup';

describe('Stopwatch Validation Utilities', () => {
  describe('validateStart', () => {
    it('should allow start when idle', () => {
      expect(validateStart('idle')).toBeNull();
    });

    it('should allow start when stopped', () => {
      expect(validateStart('stopped')).toBeNull();
    });

    it('should prevent start when already running', () => {
      expect(validateStart('running')).toBe(
        StopwatchErrorType.AlreadyRunning
      );
    });
  });

  describe('validateStop', () => {
    it('should allow stop when running', () => {
      expect(validateStop('running')).toBeNull();
    });

    it('should prevent stop when idle', () => {
      expect(validateStop('idle')).toBe(StopwatchErrorType.NotRunning);
    });

    it('should prevent stop when already stopped', () => {
      expect(validateStop('stopped')).toBe(StopwatchErrorType.NotRunning);
    });
  });

  describe('validateLap', () => {
    it('should allow lap when running', () => {
      expect(validateLap('running')).toBeNull();
    });

    it('should prevent lap when idle', () => {
      expect(validateLap('idle')).toBe(
        StopwatchErrorType.CannotLapWhileStopped
      );
    });

    it('should prevent lap when stopped', () => {
      expect(validateLap('stopped')).toBe(
        StopwatchErrorType.CannotLapWhileStopped
      );
    });
  });

  describe('validateElapsedTime', () => {
    it('should allow valid elapsed times', () => {
      expect(validateElapsedTime(0)).toBeNull();
      expect(validateElapsedTime(5000)).toBeNull();
      expect(validateElapsedTime(359999)).toBeNull();
    });

    it('should reject negative times', () => {
      expect(validateElapsedTime(-100)).toBe(StopwatchErrorType.InvalidTime);
    });

    it('should reject times exceeding max', () => {
      expect(validateElapsedTime(360000)).toBe(StopwatchErrorType.InvalidTime);
    });
  });

  describe('validateState', () => {
    it('should return empty array for valid state', () => {
      const state = createMockStopwatchState({
        mode: 'running',
        elapsedMs: 5000,
        laps: [],
      });
      expect(validateState(state)).toEqual([]);
    });

    it('should detect invalid elapsed time', () => {
      const state = createMockStopwatchState({ elapsedMs: -100 });
      const errors = validateState(state);
      expect(errors).toContain(StopwatchErrorType.InvalidTime);
    });

    it('should detect invalid mode', () => {
      const state = createMockStopwatchState({
        mode: 'invalid' as any,
      });
      const errors = validateState(state);
      expect(errors).toContain(StopwatchErrorType.Unknown);
    });

    it('should detect invalid laps', () => {
      const state = createMockStopwatchState({
        laps: [{ lapNumber: 1, intervalMs: -100, totalMs: 0 } as any],
      });
      const errors = validateState(state);
      expect(errors).toContain(StopwatchErrorType.InvalidTime);
    });
  });

  describe('hasValidError', () => {
    it('should return true for valid error state', () => {
      const state = createMockStopwatchState({
        hasError: true,
        errorMessage: 'Error',
        errorTimestamp: new Date().toISOString(),
      });
      expect(hasValidError(state)).toBe(true);
    });

    it('should return false for incomplete error state', () => {
      expect(
        hasValidError(createMockStopwatchState({ hasError: true }))
      ).toBe(false);
    });
  });

  describe('shouldDismissError', () => {
    it('should not dismiss when dismissAfterMs not elapsed', () => {
      const now = new Date();
      const state = createMockStopwatchState({
        hasError: true,
        errorTimestamp: now.toISOString(),
      });
      expect(shouldDismissError(state, 5000)).toBe(false);
    });

    it('should dismiss when dismissAfterMs elapsed', () => {
      const pastTime = new Date(Date.now() - 6000);
      const state = createMockStopwatchState({
        hasError: true,
        errorTimestamp: pastTime.toISOString(),
      });
      expect(shouldDismissError(state, 5000)).toBe(true);
    });
  });

  describe('getErrorMessage', () => {
    it('should return appropriate error messages', () => {
      expect(
        getErrorMessage(StopwatchErrorType.AlreadyRunning)
      ).toBe('Stopwatch is already running');
      expect(
        getErrorMessage(StopwatchErrorType.NotRunning)
      ).toBe('Stopwatch is not running');
      expect(
        getErrorMessage(StopwatchErrorType.CannotLapWhileStopped)
      ).toBe('Cannot lap before starting the stopwatch');
    });
  });

  describe('createErrorState', () => {
    it('should create valid error state object', () => {
      const error = createErrorState(StopwatchErrorType.AlreadyRunning);
      expect(error.hasError).toBe(true);
      expect(error.errorMessage).toBe('Stopwatch is already running');
      expect(error.errorTimestamp).toBeDefined();
    });
  });
});
```

#### Temperature Formatting Tests

**File**: `apps/temp/ui/tests/utils/formatting.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import {
  roundTemperature,
  formatTemperatureDisplay,
  formatTemperatureValue,
  parseTemperatureInput,
  isValidTemperatureInput,
  formatConversionDirection,
} from '@/utils/formatting';

describe('Temperature Formatting Utilities', () => {
  describe('roundTemperature', () => {
    it('should round to 2 decimal places by default', () => {
      expect(roundTemperature(32.156)).toBe(32.16);
      expect(roundTemperature(0)).toBe(0);
      expect(roundTemperature(-40.156)).toBe(-40.16);
    });

    it('should handle different decimal places', () => {
      expect(roundTemperature(32.156, 1)).toBe(32.2);
      expect(roundTemperature(32.156, 3)).toBe(32.156);
    });

    it('should handle non-finite numbers', () => {
      expect(roundTemperature(NaN)).toBe(0);
      expect(roundTemperature(Infinity)).toBe(0);
    });
  });

  describe('formatTemperatureDisplay', () => {
    it('should format temperature with unit symbol', () => {
      expect(formatTemperatureDisplay(32, 'F')).toBe('32.00°F');
      expect(formatTemperatureDisplay(0, 'C')).toBe('0.00°C');
    });

    it('should handle negative temperatures', () => {
      expect(formatTemperatureDisplay(-40, 'C')).toBe('-40.00°C');
      expect(formatTemperatureDisplay(-40, 'F')).toBe('-40.00°F');
    });

    it('should return dash for null/undefined/invalid', () => {
      expect(formatTemperatureDisplay(null, 'C')).toBe('—');
      expect(formatTemperatureDisplay(undefined, 'F')).toBe('—');
      expect(formatTemperatureDisplay(NaN, 'C')).toBe('—');
    });
  });

  describe('formatTemperatureValue', () => {
    it('should format numeric value with decimals', () => {
      expect(formatTemperatureValue(32.156)).toBe('32.16');
      expect(formatTemperatureValue(0)).toBe('0.00');
    });

    it('should return empty string for null/invalid', () => {
      expect(formatTemperatureValue(null)).toBe('');
      expect(formatTemperatureValue(NaN)).toBe('');
    });
  });

  describe('parseTemperatureInput', () => {
    it('should parse valid numeric strings', () => {
      expect(parseTemperatureInput('32')).toBe(32);
      expect(parseTemperatureInput('32.5')).toBe(32.5);
      expect(parseTemperatureInput('-40')).toBe(-40);
    });

    it('should trim whitespace', () => {
      expect(parseTemperatureInput('  32  ')).toBe(32);
    });

    it('should return null for invalid input', () => {
      expect(parseTemperatureInput('abc')).toBeNull();
      expect(parseTemperatureInput('')).toBeNull();
      expect(parseTemperatureInput('  ')).toBeNull();
    });
  });

  describe('isValidTemperatureInput', () => {
    it('should validate numeric input', () => {
      expect(isValidTemperatureInput('32')).toBe(true);
      expect(isValidTemperatureInput('-40.5')).toBe(true);
    });

    it('should reject invalid input', () => {
      expect(isValidTemperatureInput('abc')).toBe(false);
      expect(isValidTemperatureInput('')).toBe(false);
    });
  });

  describe('formatConversionDirection', () => {
    it('should format conversion direction', () => {
      expect(formatConversionDirection('C', 'F')).toBe(
        'Celsius to Fahrenheit'
      );
      expect(formatConversionDirection('F', 'C')).toBe(
        'Fahrenheit to Celsius'
      );
    });

    it('should return empty string for null units', () => {
      expect(formatConversionDirection(null, 'F')).toBe('');
      expect(formatConversionDirection('C', null)).toBe('');
    });
  });
});
```

#### Temperature Validation Tests

**File**: `apps/temp/ui/tests/utils/validation.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import {
  getErrorMessage,
  createError,
  validateOnBlur,
  validateOnSubmit,
  validateDifferentUnits,
  validateUnit,
  validateConversionState,
  canConvert,
} from '@/utils/validation';
import { ConversionErrorType } from '@/types/tempconverter';
import { createMockTemperatureState } from '../setup';

describe('Temperature Validation Utilities', () => {
  describe('getErrorMessage', () => {
    it('should return appropriate error messages', () => {
      expect(
        getErrorMessage(ConversionErrorType.InvalidInput)
      ).toBe('Please enter a valid numeric value');
      expect(
        getErrorMessage(ConversionErrorType.IdenticalUnits)
      ).toBe('Source and target units cannot be the same');
    });
  });

  describe('createError', () => {
    it('should create error with timestamp', () => {
      const error = createError(ConversionErrorType.InvalidInput, 'input');
      expect(error.type).toBe(ConversionErrorType.InvalidInput);
      expect(error.field).toBe('input');
      expect(error.timestamp).toBeDefined();
    });
  });

  describe('validateOnBlur', () => {
    it('should not validate untouched input', () => {
      expect(validateOnBlur('abc', false)).toBeNull();
    });

    it('should not validate empty touched input', () => {
      expect(validateOnBlur('', true)).toBeNull();
    });

    it('should validate touched non-empty input', () => {
      expect(validateOnBlur('abc', true)).toBeDefined();
      expect(validateOnBlur('abc', true)?.type).toBe(
        ConversionErrorType.InvalidInput
      );
    });

    it('should not error on valid numeric input', () => {
      expect(validateOnBlur('32', true)).toBeNull();
    });
  });

  describe('validateOnSubmit', () => {
    it('should require input on submit', () => {
      expect(validateOnSubmit('')).toBeDefined();
      expect(validateOnSubmit('   ')).toBeDefined();
    });

    it('should validate numeric on submit', () => {
      expect(validateOnSubmit('abc')).toBeDefined();
    });

    it('should pass valid numeric input', () => {
      expect(validateOnSubmit('32')).toBeNull();
    });
  });

  describe('validateDifferentUnits', () => {
    it('should allow different units', () => {
      expect(validateDifferentUnits('C', 'F')).toBeNull();
      expect(validateDifferentUnits('F', 'C')).toBeNull();
    });

    it('should prevent identical units', () => {
      expect(validateDifferentUnits('C', 'C')).toBeDefined();
      expect(validateDifferentUnits('F', 'F')).toBeDefined();
    });

    it('should handle null units', () => {
      expect(validateDifferentUnits(null, 'F')).toBeNull();
      expect(validateDifferentUnits('C', null)).toBeNull();
    });
  });

  describe('validateUnit', () => {
    it('should accept valid units', () => {
      expect(validateUnit('C')).toBeNull();
      expect(validateUnit('F')).toBeNull();
    });

    it('should reject invalid units', () => {
      expect(validateUnit('K')).toBeDefined();
      expect(validateUnit('invalid')).toBeDefined();
    });
  });

  describe('validateConversionState', () => {
    it('should pass valid conversion state', () => {
      const state = createMockTemperatureState({
        inputValue: '32',
        sourceUnit: 'C',
        targetUnit: 'F',
      });
      const errors = validateConversionState(state);
      expect(errors.length).toBe(0);
    });

    it('should detect identical units error', () => {
      const state = createMockTemperatureState({
        sourceUnit: 'C',
        targetUnit: 'C',
      });
      const errors = validateConversionState(state);
      expect(errors.some(e => e.type === ConversionErrorType.IdenticalUnits)).toBe(true);
    });
  });

  describe('canConvert', () => {
    it('should return true for convertible state', () => {
      const state = createMockTemperatureState({
        inputValue: '32',
        sourceUnit: 'C',
        targetUnit: 'F',
        inputTouched: true,
      });
      expect(canConvert(state)).toBe(true);
    });

    it('should return false for non-convertible state', () => {
      const state = createMockTemperatureState({
        sourceUnit: 'C',
        targetUnit: 'C', // Identical units
      });
      expect(canConvert(state)).toBe(false);
    });
  });
});
```

**Effort**: 4-6 hours  
**Validation**:
- ✅ All test files created
- ✅ Tests cover happy path and edge cases
- ✅ Tests include negative/boundary conditions
- ✅ Tests can run with `npm test` command

---

### Task 1.3: Create Hook Tests

#### Stopwatch Hook Tests

**File**: `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useStopwatch } from '@/hooks/useStopwatch';
import { StopwatchErrorType } from '@/types/stopwatch';

describe('useStopwatch Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with idle mode and zero elapsed time', () => {
      const { result } = renderHook(() => useStopwatch());
      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.status.isRunning).toBe(false);
    });

    it('should initialize status with formatted time', () => {
      const { result } = renderHook(() => useStopwatch());
      expect(result.current.status.formattedTime).toBe('00:00:00');
    });
  });

  describe('start', () => {
    it('should start stopwatch from idle', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
      });
      expect(result.current.state.mode).toBe('running');
      expect(result.current.status.isRunning).toBe(true);
    });

    it('should prevent double start', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
        result.current.start(); // Attempt to start again
      });
      expect(result.current.state.hasError).toBe(true);
      expect(result.current.state.errorMessage).toContain('already running');
    });

    it('should allow restart after stop', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
        result.current.stop();
        result.current.start();
      });
      expect(result.current.state.mode).toBe('running');
    });
  });

  describe('stop', () => {
    it('should stop running stopwatch', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.stop();
      });
      expect(result.current.state.mode).toBe('stopped');
      expect(result.current.status.isRunning).toBe(false);
    });

    it('should prevent double stop', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
        result.current.stop();
        result.current.stop(); // Attempt to stop again
      });
      expect(result.current.state.hasError).toBe(true);
      expect(result.current.state.errorMessage).toContain('not running');
    });

    it('should accumulate elapsed time', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
        vi.advanceTimersByTime(5000);
        result.current.stop();
      });
      expect(result.current.state.elapsedMs).toBeGreaterThanOrEqual(5000);
    });
  });

  describe('lap', () => {
    it('should record lap while running', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
        vi.advanceTimersByTime(1000);
        result.current.lap();
      });
      expect(result.current.state.laps.length).toBe(1);
      expect(result.current.state.laps[0].lapNumber).toBe(1);
    });

    it('should prevent lap before start', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.lap();
      });
      expect(result.current.state.hasError).toBe(true);
      expect(result.current.state.errorMessage).toContain('Cannot lap');
    });

    it('should calculate correct lap intervals', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
        vi.advanceTimersByTime(1000);
        result.current.lap();
        vi.advanceTimersByTime(2000);
        result.current.lap();
      });
      const laps = result.current.state.laps;
      expect(laps[0].intervalMs).toBeGreaterThanOrEqual(1000);
      expect(laps[1].intervalMs).toBeGreaterThanOrEqual(2000);
    });

    it('should calculate cumulative total times', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
        vi.advanceTimersByTime(1000);
        result.current.lap();
        vi.advanceTimersByTime(1000);
        result.current.lap();
      });
      const laps = result.current.state.laps;
      expect(laps[0].totalMs).toBeLessThanOrEqual(laps[1].totalMs);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
        vi.advanceTimersByTime(5000);
        result.current.lap();
        result.current.reset();
      });
      expect(result.current.state.mode).toBe('idle');
      expect(result.current.state.elapsedMs).toBe(0);
      expect(result.current.state.laps.length).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should auto-dismiss errors after timeout', async () => {
      const { result } = renderHook(() => useStopwatch(1000)); // 1 second auto-dismiss
      act(() => {
        result.current.start();
        result.current.start(); // Trigger error
      });
      expect(result.current.state.hasError).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        expect(result.current.state.hasError).toBe(false);
      });
    });

    it('should clear error on clearError call', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
        result.current.start(); // Trigger error
      });
      expect(result.current.state.hasError).toBe(true);

      act(() => {
        result.current.clearError();
      });
      expect(result.current.state.hasError).toBe(false);
    });
  });

  describe('race conditions', () => {
    it('should handle rapid lap clicks without race conditions', () => {
      const { result } = renderHook(() => useStopwatch());
      act(() => {
        result.current.start();
      });

      // Rapid lap clicks
      act(() => {
        result.current.lap();
        result.current.lap();
        result.current.lap();
        vi.advanceTimersByTime(100);
      });

      expect(result.current.state.laps.length).toBe(3);
      // Verify all laps have correct cumulative ordering
      for (let i = 1; i < result.current.state.laps.length; i++) {
        expect(
          result.current.state.laps[i].totalMs >=
            result.current.state.laps[i - 1].totalMs
        ).toBe(true);
      }
    });
  });
});
```

#### Temperature Hook Tests

**File**: `apps/temp/ui/tests/hooks/useTempConversion.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTempConversion } from '@/hooks/useTempConversion';
import { ConversionErrorType } from '@/types/tempconverter';

describe('useTempConversion Hook', () => {
  describe('initialization', () => {
    it('should initialize with default C to F conversion', () => {
      const { result } = renderHook(() => useTempConversion());
      expect(result.current.state.sourceUnit).toBe('C');
      expect(result.current.state.targetUnit).toBe('F');
      expect(result.current.state.direction).toBe('c-to-f');
    });

    it('should initialize with empty input', () => {
      const { result } = renderHook(() => useTempConversion());
      expect(result.current.state.inputValue).toBe('');
      expect(result.current.state.result).toBeNull();
    });
  });

  describe('setInput', () => {
    it('should update input value', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setInput('32');
      });
      expect(result.current.state.inputValue).toBe('32');
      expect(result.current.state.inputNumber).toBe(32);
    });

    it('should handle invalid input', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setInput('abc');
      });
      expect(result.current.state.inputNumber).toBe(-1);
    });

    it('should clear input', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setInput('32');
        result.current.setInput('');
      });
      expect(result.current.state.inputValue).toBe('');
      expect(result.current.state.inputNumber).toBe(-1);
    });
  });

  describe('setSourceUnit', () => {
    it('should change source unit', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setSourceUnit('F');
      });
      expect(result.current.state.sourceUnit).toBe('F');
      expect(result.current.state.direction).toBe('f-to-c');
    });

    it('should detect identical units', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setSourceUnit('F');
        result.current.setTargetUnit('F');
      });
      expect(result.current.state.error?.type).toBe(
        ConversionErrorType.IdenticalUnits
      );
    });
  });

  describe('convert', () => {
    it('should convert C to F correctly', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setInput('0');
        result.current.convert();
      });
      expect(result.current.state.result).toBe(32);
      expect(result.current.state.resultValid).toBe(true);
    });

    it('should convert F to C correctly', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setSourceUnit('F');
        result.current.setTargetUnit('C');
        result.current.setInput('32');
        result.current.convert();
      });
      expect(result.current.state.result).toBe(0);
    });

    it('should handle negative temperatures', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setInput('-40');
        result.current.convert();
      });
      expect(result.current.state.result).toBe(-40);
    });

    it('should prevent conversion with identical units', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setInput('32');
        result.current.setSourceUnit('C');
        result.current.setTargetUnit('C');
        result.current.convert();
      });
      expect(result.current.state.error?.type).toBe(
        ConversionErrorType.IdenticalUnits
      );
      expect(result.current.state.resultValid).toBe(false);
    });

    it('should require valid input', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setInput('abc');
        result.current.convert();
      });
      expect(result.current.state.error?.type).toBe(
        ConversionErrorType.InvalidInput
      );
    });
  });

  describe('error handling', () => {
    it('should auto-dismiss errors after timeout', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useTempConversion(1000));
      
      act(() => {
        result.current.setInput('abc');
        result.current.convert();
      });
      expect(result.current.state.error).toBeDefined();

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      expect(result.current.state.error).toBeNull();
      vi.useRealTimers();
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useTempConversion());
      act(() => {
        result.current.setInput('32');
        result.current.convert();
        result.current.reset();
      });
      expect(result.current.state.inputValue).toBe('');
      expect(result.current.state.result).toBeNull();
      expect(result.current.state.error).toBeNull();
    });
  });
});
```

**Effort**: 3-4 hours  
**Validation**:
- ✅ Hook tests use renderHook from RTL
- ✅ Tests include state transitions
- ✅ Tests cover edge cases and errors
- ✅ Tests verify cleanup behavior

---

### Task 1.4: Create Component Tests

#### Stopwatch ErrorBanner Tests

**File**: `apps/stopwatch/ui/tests/components/ErrorBanner.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBanner } from '@/components/ErrorBanner';
import { createMockStopwatchStatus } from '../setup';

describe('ErrorBanner Component (Stopwatch)', () => {
  describe('rendering', () => {
    it('should not render when no error', () => {
      const status = createMockStopwatchStatus({ hasError: false });
      const { container } = render(
        <ErrorBanner status={status} onClearError={() => {}} />
      );
      expect(container.querySelector('.error-banner')).toBeNull();
    });

    it('should render error message', () => {
      const status = createMockStopwatchStatus({
        hasError: true,
        errorMessage: 'Test error message',
      });
      render(<ErrorBanner status={status} onClearError={() => {}} />);
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should have accessible alert role', () => {
      const status = createMockStopwatchStatus({
        hasError: true,
        errorMessage: 'Error',
      });
      const { container } = render(
        <ErrorBanner status={status} onClearError={() => {}} />
      );
      expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
      expect(container.querySelector('[aria-live="assertive"]')).toBeInTheDocument();
    });
  });

  describe('dismissal', () => {
    it('should call onClearError when dismiss button clicked', async () => {
      const user = userEvent.setup();
      const onClearError = vi.fn();
      const status = createMockStopwatchStatus({
        hasError: true,
        errorMessage: 'Error',
      });
      render(<ErrorBanner status={status} onClearError={onClearError} />);

      const button = screen.getByLabelText('Dismiss error');
      await user.click(button);
      expect(onClearError).toHaveBeenCalled();
    });

    it('should auto-dismiss after timeout', async () => {
      vi.useFakeTimers();
      const onClearError = vi.fn();
      const status = createMockStopwatchStatus({
        hasError: true,
        errorMessage: 'Error',
      });
      render(
        <ErrorBanner
          status={status}
          onClearError={onClearError}
          autoDismissMs={1000}
        />
      );

      vi.advanceTimersByTime(1100);

      await waitFor(() => {
        expect(onClearError).toHaveBeenCalled();
      });

      vi.useRealTimers();
    });

    it('should not auto-dismiss when autoDismissMs is 0', () => {
      vi.useFakeTimers();
      const onClearError = vi.fn();
      const status = createMockStopwatchStatus({
        hasError: true,
        errorMessage: 'Error',
      });
      render(
        <ErrorBanner
          status={status}
          onClearError={onClearError}
          autoDismissMs={0}
        />
      );

      vi.advanceTimersByTime(5000);
      expect(onClearError).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('accessibility', () => {
    it('should have dismiss button with aria-label', () => {
      const status = createMockStopwatchStatus({
        hasError: true,
        errorMessage: 'Error',
      });
      render(<ErrorBanner status={status} onClearError={() => {}} />);
      expect(
        screen.getByLabelText('Dismiss error')
      ).toBeInTheDocument();
    });
  });
});
```

#### Temperature ErrorBanner Tests

**File**: `apps/temp/ui/tests/components/ErrorBanner.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBanner } from '@/components/ErrorBanner';
import {
  ConversionErrorType,
  createMockConversionError,
} from '../setup';

describe('ErrorBanner Component (Temp)', () => {
  describe('rendering', () => {
    it('should not render when error is null', () => {
      const { container } = render(
        <ErrorBanner error={null} onClearError={() => {}} />
      );
      expect(container.querySelector('.error-banner')).toBeNull();
    });

    it('should render error message', () => {
      const error = createMockConversionError(ConversionErrorType.InvalidInput);
      render(<ErrorBanner error={error} onClearError={() => {}} />);
      expect(screen.getByText(error.message)).toBeInTheDocument();
    });

    it('should have accessible alert role', () => {
      const error = createMockConversionError(ConversionErrorType.InvalidInput);
      const { container } = render(
        <ErrorBanner error={error} onClearError={() => {}} />
      );
      expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
      expect(container.querySelector('[aria-live="assertive"]')).toBeInTheDocument();
    });
  });

  describe('dismissal', () => {
    it('should dismiss on button click', async () => {
      const user = userEvent.setup();
      const onClearError = vi.fn();
      const error = createMockConversionError(ConversionErrorType.InvalidInput);
      render(<ErrorBanner error={error} onClearError={onClearError} />);

      const button = screen.getByLabelText('Dismiss error');
      await user.click(button);
      expect(onClearError).toHaveBeenCalled();
    });

    it('should dismiss on Escape key', async () => {
      const user = userEvent.setup();
      const onClearError = vi.fn();
      const error = createMockConversionError(ConversionErrorType.InvalidInput);
      const { container } = render(
        <ErrorBanner error={error} onClearError={onClearError} />
      );

      const banner = container.querySelector('.error-banner');
      await user.keyboard('{Escape}');
      expect(onClearError).toHaveBeenCalled();
    });

    it('should auto-dismiss after timeout', async () => {
      vi.useFakeTimers();
      const onClearError = vi.fn();
      const error = createMockConversionError(ConversionErrorType.InvalidInput);
      render(
        <ErrorBanner
          error={error}
          onClearError={onClearError}
          autoDismissMs={1000}
        />
      );

      vi.advanceTimersByTime(1100);

      await waitFor(() => {
        expect(onClearError).toHaveBeenCalled();
      });

      vi.useRealTimers();
    });
  });
});
```

**Effort**: 2-3 hours  
**Validation**:
- ✅ Component tests use RTL
- ✅ Tests cover rendering and interactions
- ✅ Tests verify accessibility attributes
- ✅ Tests check event handlers

---

### Task 1.5: Run Tests & Verify Coverage

**Command**:
```bash
# Stopwatch
cd apps/stopwatch/ui
npm run test -- --run

# Temp
cd apps/temp/ui
npm run test -- --run
```

**Expected Output**:
```
✓ formatting.test.ts (15-20 tests)
✓ validation.test.ts (20-25 tests)
✓ useStopwatch.test.ts (15-20 tests)
✓ ErrorBanner.test.tsx (10-15 tests)

Total: 60-80 tests passing
```

**Coverage Check**:
```bash
npm run test:coverage

# Should show:
# - Lines: ≥50%
# - Functions: ≥50%
# - Branches: ≥50%
# - Statements: ≥50%
```

**Effort**: 1-2 hours  
**Validation**:
- ✅ All tests pass
- ✅ Coverage ≥50%
- ✅ No TypeScript errors

---

## Priority 2: IMPORTANT (Complete Before Phase 3)

### Task 2.1: Fix Core Module Integration

**Issue**: Temp converter has hardcoded convertTemperatureCore() instead of importing from core

**File**: `apps/temp/ui/src/hooks/useTempConversion.ts`

**Current** (lines 40-53):
```typescript
function convertTemperatureCore(value: number, fromUnit: 'C' | 'F', toUnit: 'C' | 'F'): number {
  // Hardcoded logic
  if (fromUnit === 'C' && toUnit === 'F') {
    return Math.round(((value * 9) / 5 + 32) * 100) / 100;
  } else if (fromUnit === 'F' && toUnit === 'C') {
    return Math.round(((value - 32) * 5) / 9 * 100) / 100;
  }
  throw new Error('Invalid conversion');
}
```

**Action**: Determine core module status and integrate:

**Option A - If core module exists**:
Replace with:
```typescript
import { convertTemperature } from '@temp-converter-core';
// Use imported function directly
```

**Option B - If core module doesn't exist**:
Keep current implementation but add comment:
```typescript
/**
 * Temperature conversion logic (inline until core module is created)
 * TODO: Move to @temp-converter-core when core module is initialized
 */
```

**Effort**: 0.5-1 hour  
**Validation**:
- ✅ Import path verified or documented
- ✅ Conversion logic matches core implementation

---

### Task 2.2: Add Readonly Modifiers

**Files**: 
- `apps/stopwatch/ui/src/types/stopwatch.ts`
- `apps/temp/ui/src/types/tempconverter.ts`

**Example Changes**:

Stopwatch types:
```typescript
export interface LapTime {
  readonly lapNumber: number;
  readonly intervalMs: number;
  readonly totalMs: number;
  readonly timestamp: string;
}
```

Temp types:
```typescript
export interface ConversionError {
  readonly type: ConversionErrorType;
  readonly message: string;
  readonly field?: 'input' | 'sourceUnit' | 'targetUnit';
  readonly timestamp: string;
}
```

**Effort**: 0.5-1 hour  
**Validation**:
- ✅ Types compile without errors
- ✅ Tests still pass

---

### Task 2.3: Add @throws JSDoc

**Files**:
- `apps/stopwatch/ui/src/utils/formatting.ts`
- `apps/stopwatch/ui/src/utils/validation.ts`
- `apps/temp/ui/src/utils/formatting.ts`
- `apps/temp/ui/src/utils/validation.ts`

**Example**:

```typescript
/**
 * Formats elapsed time in milliseconds to MM:SS:MS string format
 * 
 * @param elapsedMs - Elapsed time in milliseconds
 * @param maxMs - Maximum milliseconds before capping (default: 99:59:99)
 * @returns Formatted time string in MM:SS:MS format
 * @throws Never - always returns a valid string
 * 
 * @example
 * formatTime(5432) => "00:05:43"
 * formatTime(65432) => "01:05:43"
 * formatTime(359999) => "99:59:99"
 */
export function formatTime(elapsedMs: number, maxMs: number = 359999): string {
  // ...
}
```

**Effort**: 1 hour  
**Validation**:
- ✅ All functions have @throws documented
- ✅ Examples added where applicable

---

### Task 2.4: Fix Memory Leak Risk

**File**: `apps/stopwatch/ui/src/hooks/useStopwatch.ts`

**Issue**: intervalRef not always cleared safely

**Current** (line 124-125):
```typescript
if (intervalRef.current) {
  clearInterval(intervalRef.current);
}
```

**Improved**:
```typescript
if (intervalRef.current !== null) {
  clearInterval(intervalRef.current);
  intervalRef.current = null;  // Explicitly set to null
}
```

Apply to:
- Line 124-125 in stop()
- Line 195-196 in reset()

**Effort**: 0.5 hour  
**Validation**:
- ✅ Tests still pass
- ✅ No TypeScript errors

---

## Priority 3: NICE-TO-HAVE (Polish)

### Task 3.1: Memoize ErrorBanner Components

**Files**:
- `apps/stopwatch/ui/src/components/ErrorBanner.tsx`
- `apps/temp/ui/src/components/ErrorBanner.tsx`

**Change**:
```typescript
// Before
export const ErrorBanner: React.FC<ErrorBannerProps> = ({ ... }) => {

// After
export const ErrorBanner = React.memo(
  (props: ErrorBannerProps) => {
    // Component implementation
  }
);
```

**Effort**: 0.5 hour  
**Validation**:
- ✅ Component still renders correctly
- ✅ Tests pass

---

## Completion Checklist

- [ ] Test setup files enhanced (Task 1.1)
- [ ] All utility test files created (Task 1.2)
- [ ] All hook test files created (Task 1.3)
- [ ] All component test files created (Task 1.4)
- [ ] Tests run and pass with ≥50% coverage (Task 1.5)
- [ ] Core module integration verified (Task 2.1)
- [ ] Readonly modifiers added (Task 2.2)
- [ ] @throws JSDoc added (Task 2.3)
- [ ] Memory leak fix applied (Task 2.4)
- [ ] ErrorBanner memoization applied (Task 3.1)

---

## Final Validation

Once all tasks complete, verify:

```bash
# Navigate to each project
cd apps/stopwatch/ui
npm run lint        # Should pass
npm run format --check  # Should pass
npm run test -- --run   # ≥50% coverage
npm run build       # Should succeed

# Repeat for apps/temp/ui
```

**Success Criteria**:
- ✅ All tests passing
- ✅ Coverage ≥50% for all modules
- ✅ No lint or type errors
- ✅ Build succeeds
- ✅ Phase 2 validation checklist complete

---

## Next Steps

Once Phase 2 is complete:
1. Update tasks.md: Mark T011-T020 as VALIDATED ✅
2. Update tasks.md: Mark Phase 2 completion criteria as DONE
3. Proceed to Phase 3: User Story 1 Implementation
