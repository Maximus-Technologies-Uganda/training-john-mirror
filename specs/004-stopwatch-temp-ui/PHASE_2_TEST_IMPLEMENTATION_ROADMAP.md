# Phase 2 Test Implementation Roadmap

**Status**: 2/7 test files complete ✅  
**Completed**: 
- ✅ `apps/stopwatch/ui/tests/utils/formatting.test.ts` (22 tests)
- ✅ `apps/stopwatch/ui/tests/utils/validation.test.ts` (50+ tests)
- ✅ `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts` (40+ tests)

**Remaining**: 5 test files (est. 10-14 hours with parallel execution)

---

## 📋 Remaining Test Files (Priority Order)

### 3️⃣ Stopwatch ErrorBanner Component Test
**File**: `apps/stopwatch/ui/tests/components/ErrorBanner.test.tsx`  
**Est. Time**: 1-2h  
**Type**: Component test (React Testing Library)

**Key Test Cases**:
- Rendering: displays when hasError=true, hidden when false
- Auto-dismiss: calls onClearError after autoDismissMs
- Button interactions: dismiss button works, onClick fires callback
- Accessibility: role="alert", aria-live="assertive"
- Edge cases: autoDismissMs=0 (no auto-dismiss), manual clearing

**Template Structure**:
```typescript
describe('ErrorBanner (Stopwatch)', () => {
  describe('rendering', () => { /* 5-6 tests */ })
  describe('auto-dismiss', () => { /* 3-4 tests */ })
  describe('interactions', () => { /* 2-3 tests */ })
  describe('accessibility', () => { /* 2-3 tests */ })
})
```

---

### 4️⃣ Temperature Formatting Tests
**File**: `apps/temp/ui/tests/utils/formatting.test.ts`  
**Est. Time**: 2-3h  
**Type**: Unit tests (same pattern as Stopwatch formatting tests)

**Key Functions to Test**:
- `roundTemperature()` - 2 decimal place rounding
- `formatTemperatureDisplay()` - display with unit symbol
- `parseTemperatureInput()` - parse user input
- `isValidTemperatureInput()` - validation check
- `formatConversionDirection()` - display direction text

**Test Cases** (per function):
- Happy path (valid inputs)
- Edge cases (null, undefined, NaN, Infinity)
- Negative numbers (-40°C)
- Large numbers
- Precision handling

**Est. Total Tests**: 35-40

---

### 5️⃣ Temperature Validation Tests
**File**: `apps/temp/ui/tests/utils/validation.test.ts`  
**Est. Time**: 2-3h  
**Type**: Unit tests

**Key Functions to Test**:
- `validateOnBlur()` - on-blur validation logic
- `validateOnSubmit()` - on-submit validation logic
- `validateDifferentUnits()` - prevent C-to-C, F-to-F
- `validateUnit()` - only C or F allowed
- `canConvert()` - overall validation
- `getErrorMessage()` - error message mapping

**Test Cases**:
- Valid inputs pass
- Invalid inputs fail with correct error
- Unit validation (C, F, invalid like K)
- Identical units detection
- Error message generation

**Est. Total Tests**: 40-50

---

### 6️⃣ Temperature useTempConversion Hook Test
**File**: `apps/temp/ui/tests/hooks/useTempConversion.test.ts`  
**Est. Time**: 3-4h  
**Type**: Integration test (renderHook + fake timers)

**Key Functionality to Test**:
- `setInput()` - update input value
- `setSourceUnit()` / `setTargetUnit()` - change units
- `convert()` - perform conversion
- `markInputTouched()` - mark input touched
- `reset()` - reset to initial
- `clearError()` - clear errors

**Test Scenarios**:
- Conversion accuracy (0°C = 32°F, 32°F = 0°C, -40°C = -40°F)
- Error handling (invalid input, identical units)
- State management (touched, attempted flags)
- Auto-dismiss errors
- Edge cases (negative temps, decimals)

**Est. Total Tests**: 45-50

---

### 7️⃣ Temperature ErrorBanner Component Test
**File**: `apps/temp/ui/tests/components/ErrorBanner.test.tsx`  
**Est. Time**: 1-2h  
**Type**: Component test

**Key Test Cases** (same as Stopwatch, adapted for ConversionError type):
- Rendering with error/without error
- Auto-dismiss timing
- Button interaction
- Keyboard support (Escape key)
- Accessibility

**Est. Total Tests**: 10-15

---

## 🎯 Implementation Strategy

### Phase A: Core Utilities (Parallel - 4-6h)
```
Developer 1: Temp formatting.test.ts
Developer 2: Temp validation.test.ts
```

### Phase B: Integration (Parallel - 3-4h)
```
Developer 1: Temp useTempConversion.test.ts
Developer 2: Stopwatch ErrorBanner.test.tsx + Temp ErrorBanner.test.tsx
```

### Phase C: Validation (Sequential - 1h)
```
Run full test suite
Generate coverage reports
Verify ≥50% coverage
Mark Phase 2 complete
```

---

## ✅ Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Test Files | 8/8 | 3/8 |
| Total Tests | ~180-200 | ~112 |
| Coverage | ≥50% | ~12% |
| All Passing | Yes | Yes (3/3 ✅) |

---

## 🚀 Next Actions

1. **Immediate**: Create remaining 5 test files
2. **Parallel**: Multiple developers work on different files
3. **Frequent**: Run tests after each file to catch issues early
4. **Final**: Coverage report + Phase 2 completion sign-off

---

## 📊 Completion Timeline

With 2-3 developers working in parallel:
- **Today**: Stopwatch ErrorBanner tests (~1-2h) ✅ Queued
- **Tomorrow (Phase A)**: Temp formatting + validation (~4-6h)
- **Day 3 (Phase B)**: Temp hook + remaining components (~3-4h)
- **Day 3 Afternoon**: Validation & coverage report (~1h)
- **Day 3 End**: Phase 2 COMPLETE → Phase 3 UNBLOCKED

**Estimated Total Time**: 10-14 hours (parallelizable)

---

## 📝 Code Patterns to Follow

All tests follow consistent structure established in completed files:

```typescript
// 1. Import vitest functions + library under test
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { functionToTest } from '@/path/to/file';

// 2. Test structure
describe('Module Name', () => {
  beforeEach(() => { /* setup */ });
  afterEach(() => { /* cleanup */ });
  
  describe('Feature Group', () => {
    it('should test specific behavior', () => {
      // AAA pattern: Arrange, Act, Assert
    });
  });
});

// 3. Use test fixtures from setup.ts
import { createMockState } from '../setup';
```

---

## 💡 Key Lessons from Completed Tests

1. **Test fixtures save time** - Use factories from setup.ts
2. **Fake timers needed** - For hooks with setTimeout/setInterval
3. **Test edge cases** - Not just happy path
4. **Test error states** - Invalid inputs, race conditions
5. **Test integration** - Complete workflows, not just units

---

## 🎓 Recommendations

1. **Pair Programming**: Have experienced tester work with developer
2. **Test-First**: Write tests before running them (TDD)
3. **Frequent Runs**: `npm run test -- --run` after each file
4. **Coverage Checks**: `npm run test:coverage` at end of each phase
5. **Document Issues**: Any failing tests = document before fixing

---

## 📞 Blockers & Support

- **Need help understanding test pattern?** → Refer to completed tests (T022-T023)
- **Test fails unexpectedly?** → Check if setup.ts fixtures are imported
- **Coverage not calculated?** → Verify vitest.config.ts has coverage settings
- **Parallel execution issues?** → Run sequentially first to debug

---

**Status**: Ready for implementation ✅  
**Blocking**: None - can proceed immediately  
**Unblocking**: Phase 3 after completion
