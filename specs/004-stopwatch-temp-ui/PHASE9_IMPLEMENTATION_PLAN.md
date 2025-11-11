# Phase 9 Implementation Plan: Handle Invalid Input - T066-T075

**Status**: Ready for Implementation  
**Estimated Effort**: 1.5-2 hours  
**Priority**: 🔴 CRITICAL - Blocking Phase 10  
**Success Criteria**: All 228 tests pass (0 failures, 100% pass rate)

---

## Overview

Phase 9 requires completing validation error handling for the Temperature Converter with proper integration between:
1. Validation utility functions (validation.ts)
2. Component error handling (TemperatureInput, TempConverter)
3. Error display (ErrorBanner)
4. Test suite synchronization

**Current State**: 82 failed / 146 passed (64% pass rate)  
**Target State**: 0 failed / 228 passed (100% pass rate)

---

## Implementation Tasks (Priority Order)

### TIER 1: Critical Blockers (1 hour - MUST FIX FIRST)

#### Task 1.1: Fix validation.test.ts (T069) - Remove Mock Functions
**File**: `apps/temp/ui/tests/utils/validation.test.ts`  
**Current Issue**: Test file defines placeholder functions at end instead of importing real implementations  
**Affected Tests**: 45 failures (all validation.test.ts tests)

**Steps**:

1. **Remove placeholder functions at end of file** (lines 330-360):
```typescript
// DELETE these lines:
function isValidNumericInput(value: string): boolean {
  return false;
}

function validateOnBlur(value: string): { isValid: boolean; error?: any } {
  return { isValid: false };
}

// ... and all other placeholder functions
```

2. **Add imports at top of test file** (after line 8):
```typescript
import {
  isValidTemperatureInput as isValidNumericInput,
  parseTemperatureInput,
  // ... other formatting functions
} from '@/utils/formatting';

import {
  validateOnBlur,
  validateOnSubmit,
  getErrorMessage,
  createError,
  validateDifferentUnits,
  validateUnit,
  shouldAutoDismissError,
  validateConversionState,
  canConvert,
  createInitialErrorState,
  clearError,
} from '@/utils/validation';
```

3. **Fix test function calls to match actual signatures**:

**Before**:
```typescript
it('should return error for non-numeric input', () => {
  const result = validateOnBlur('invalid');  // Wrong signature
  expect(result.isValid).toBe(false);  // Wrong property
  expect(result.error).toBeDefined();
});
```

**After**:
```typescript
it('should return error for non-numeric input', () => {
  const result = validateOnBlur('invalid', true);  // Add inputTouched = true
  expect(result).toBeDefined();  // validateOnBlur returns ConversionError | null
  expect(result?.type).toBe('INVALID_INPUT');  // Check error type
});
```

4. **Update test structure for validateOnSubmit**:

**Before**:
```typescript
it('should require non-empty value when required flag is true', () => {
  const result = validateOnSubmit('', { required: true });  // Wrong signature
  expect(result.isValid).toBe(false);
  expect(result.error?.type).toBe('required');
});
```

**After**:
```typescript
it('should require non-empty value when required flag is true', () => {
  const result = validateOnSubmit('');  // validateOnSubmit doesn't take options
  // validateOnSubmit returns null for empty (allowed on submit per spec)
  // Need to check: does empty input require validation?
  // Current implementation: validateOnSubmit('') returns null (no error for empty)
  // Test expectation: empty should error if required flag true
  
  // ACTION: Either fix implementation OR update test expectations
  // Based on task.md line 375 "handle empty input gracefully"
  // Recommendation: Empty input should be valid (show empty result)
});
```

5. **Add sanitizeInput function implementation** (if test references it):

Check if tests call `sanitizeInput()`. If yes, add implementation:
```typescript
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  return input.trim();
}
```

6. **Fix getErrorMessage test calls**:

**Before**:
```typescript
it('should return specific message for non-numeric error', () => {
  const message = getErrorMessage('non-numeric');  // Wrong key
  expect(message).toContain('numeric');
});
```

**After**:
```typescript
it('should return specific message for non-numeric error', () => {
  const message = getErrorMessage(ConversionErrorType.InvalidInput);  // Use enum
  expect(message).toContain('numeric');
});
```

**Estimated Time**: 30-40 minutes

---

#### Task 1.2: Fix ErrorBanner.test.tsx (T068) - Update Props Structure
**File**: `apps/temp/ui/tests/components/ErrorBanner.test.tsx`  
**Current Issue**: Tests pass `status` prop but implementation expects `error` prop  
**Affected Tests**: 14 failures (all ErrorBanner.test.tsx tests)

**Steps**:

1. **Replace all `status` prop with `error` prop**:

**Before** (line 25-28):
```typescript
render(
  <ErrorBanner
    status={{ hasError: true, errorMessage: 'Invalid input' }}
    onClearError={vi.fn()}
    autoDismissMs={0}
  />
);
```

**After**:
```typescript
render(
  <ErrorBanner
    error={{
      type: ConversionErrorType.InvalidInput,
      message: 'Invalid input',
      field: 'input',
      timestamp: new Date().toISOString(),
    }}
    onClearError={vi.fn()}
    autoDismissMs={0}
  />
);
```

2. **Create helper function for test error objects** (add near top of file):
```typescript
function createTestError(message: string, type: ConversionErrorType = ConversionErrorType.InvalidInput) {
  return {
    type,
    message,
    field: 'input' as const,
    timestamp: new Date().toISOString(),
  };
}
```

3. **Replace all error object creation calls**:
```typescript
// Before: status={{ hasError: true, errorMessage: 'text' }}
// After: error={createTestError('text')}
```

4. **Fix rerender calls**:

**Before**:
```typescript
rerender(
  <ErrorBanner
    status={{ hasError: false, errorMessage: undefined }}
    onClearError={vi.fn()}
    autoDismissMs={0}
  />
);
```

**After**:
```typescript
rerender(
  <ErrorBanner
    error={null}  // No error = null
    onClearError={vi.fn()}
    autoDismissMs={0}
  />
);
```

5. **Add import for ConversionErrorType**:
```typescript
import { ConversionErrorType } from '@/types/tempconverter';
```

**Estimated Time**: 20-30 minutes

---

#### Task 1.3: Implement sanitizeInput Utility Function
**File**: `apps/temp/ui/src/utils/validation.ts` (or formatting.ts)  
**Current Issue**: Tests reference sanitizeInput() but it's not implemented  
**Affected Tests**: Validation test failures

**Implementation**:
```typescript
/**
 * Sanitizes user input by trimming whitespace
 * @param input - The input string to sanitize
 * @returns Trimmed input string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  return input.trim();
}
```

**Location**: Add to `apps/temp/ui/src/utils/validation.ts` after imports

**Estimated Time**: 5 minutes

---

### TIER 2: Integration Fixes (30-40 minutes)

#### Task 2.1: Integrate Validation into TemperatureInput On-Blur Handler
**File**: `apps/temp/ui/src/components/TemperatureInput.tsx`  
**Current Issue**: On-blur callback doesn't perform validation  
**Tests Affected**: T066 (TemperatureInput.test.tsx)

**Current Code** (lines 95-104):
```typescript
const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
  if (onBlur) {
    onBlur(event);  // ← Just calls parent callback
  }
  
  event.currentTarget.style.borderColor = '#ddd';
  event.currentTarget.style.outline = 'none';
};
```

**Updated Code**:
```typescript
const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
  // NOTE: Actual validation logic should be in TempConverter, not here
  // TemperatureInput is a controlled component that just reports blur event
  // The parent (TempConverter) handles validation logic
  
  // Call optional onBlur callback for validation at parent level
  if (onBlur) {
    onBlur(event);
  }
  
  // Update styling
  event.currentTarget.style.borderColor = '#ddd';
  event.currentTarget.style.outline = 'none';
};
```

**Key Point**: TemperatureInput should be dumb component - validation happens in TempConverter

**Estimated Time**: 10 minutes (mostly documentation)

---

#### Task 2.2: Complete TempConverter On-Blur Validation Logic
**File**: `apps/temp/ui/src/components/TempConverter.tsx`  
**Current Issue**: handleInputBlur doesn't actually trigger validation  
**Tests Affected**: T067 (TempConverter.test.tsx) and T066

**Current Code** (lines 108-124):
```typescript
const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
  const value = event.currentTarget.value;

  if (!value) {
    clearError();
    return;
  }

  if (isNaN(parseFloat(value))) {
    // Error will be set by useTempConversion
  } else {
    clearError();
  }
};
```

**Updated Code**:
```typescript
import { validateOnBlur } from '@/utils/validation';

const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
  const value = event.currentTarget.value;

  // Validate using validation utility
  // Input needs to be marked as "touched" after blur
  const validationError = validateOnBlur(value, true);  // true = inputTouched
  
  if (validationError) {
    // Set error state from validation result
    // TODO: Add error state management to useTempConversion or component
    // For now, error is handled by useTempConversion during input change
  } else {
    // Clear error on valid input
    clearError();
  }
};
```

**Challenge**: Current state management is in useTempConversion hook which performs conversion, not validation. Need to decide:

**Option A** (Recommended): Update validation to happen during conversion
```typescript
// In useTempConversion performConversion():
const performConversion = useCallback(
  (input: string, source: TemperatureUnit, target: TemperatureUnit) => {
    // Validate first
    const validationError = validateOnBlur(input, true);
    if (validationError) {
      setHasError(true);
      setErrorMessage(validationError.message);
      setResult(null);
      return;
    }
    
    // Then convert
    // ... existing conversion logic ...
  },
  []
);
```

**Option B**: Keep validation separate in TempConverter (more flexible)
```typescript
// Add validation state to TempConverter
const [validationError, setValidationError] = useState<ConversionError | null>(null);

const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
  const value = event.currentTarget.value;
  const error = validateOnBlur(value, true);
  setValidationError(error);
};
```

**Recommendation**: Use Option A (integrate into performConversion) for consistency

**Estimated Time**: 20-30 minutes (including option evaluation)

---

#### Task 2.3: Complete TempConverter On-Submit Validation
**File**: `apps/temp/ui/src/components/TempConverter.tsx`  
**Current Issue**: handleSubmit doesn't set validation errors explicitly  
**Tests Affected**: T067 (TempConverter.test.tsx)

**Current Code** (lines 130-165):
```typescript
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (required && !inputValue) {
    // Error will be shown
    return;
  }

  if (!inputValue) {
    setInputValue('');
    return;
  }

  const numValue = parseFloat(inputValue);
  if (isNaN(numValue)) {
    // Error already handled by useTempConversion
    return;
  }

  // ... rest of validation ...
};
```

**Updated Code**:
```typescript
import { validateOnSubmit } from '@/utils/validation';

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Validate using validation utility
  const validationError = validateOnSubmit(inputValue);
  
  if (validationError) {
    // Set error state to display error message
    // This should set error in useTempConversion hook
    // For now, conversion logic already sets error on invalid numeric
    return;
  }

  // Additional validation: required field
  if (required && !inputValue) {
    // Set custom error for required field
    // TODO: May need to extend validation utilities to handle required field
    return;
  }

  // Validation passed - conversion already performed
  if (onSubmit && result !== null) {
    onSubmit(result, targetUnit, sourceUnit);
  }
};
```

**Note**: Current implementation validates during input change (via useTempConversion). On-submit should re-validate to be safe.

**Estimated Time**: 15-20 minutes

---

### TIER 3: Minor Fixes & Edge Cases (20-30 minutes)

#### Task 3.1: Fix useTempConversion.test.ts Edge Case Failures (2 failures)
**File**: `apps/temp/ui/tests/hooks/useTempConversion.test.ts`  
**Issues**: 2 test failures in edge cases

**Failing Tests**:
1. "should recalculate when source unit changes" - Expected 0 to be less than 0
2. "should handle simultaneous unit and input changes" - Expected null to be +0

**Investigation**: These are likely minor rounding or state update issues. Once other fixes are done, run tests again to identify exact failures.

**Estimated Time**: 10-15 minutes

---

#### Task 3.2: Sync TemperatureInput.test.tsx with Implementation (if needed)
**File**: `apps/temp/ui/tests/components/TemperatureInput.test.tsx`  
**Status**: May have failures due to props or callback expectations

**Check Points**:
1. Test expects `onBlur` callback to validate? (Component just calls callback, parent validates)
2. Test expects error prop? (TemperatureInput doesn't display errors, parent does)
3. Test expects test IDs to be present? (Currently uses "temperature-input")

**Estimated Time**: 10-15 minutes (if needed)

---

#### Task 3.3: Sync TempConverter.test.tsx with Implementation (if needed)
**File**: `apps/temp/ui/tests/components/TempConverter.test.tsx`  
**Status**: May have failures related to error display or form handling

**Check Points**:
1. Test tries to find error message element? (Should exist if error state set)
2. Test expects form role? (Form exists, but role might not be explicit)
3. Test expects submit button to be enabled/disabled based on validation? (Currently always enabled)

**Estimated Time**: 10-15 minutes (if needed)

---

## Detailed Code Changes by File

### 1. `apps/temp/ui/tests/utils/validation.test.ts`

**Changes**:
- Remove lines 330-360 (mock functions)
- Add imports at top
- Update all test calls to use correct function signatures
- Change error type checks from `.error.type` to use enum values

**Before** (length: 361 lines):
```typescript
describe('Validation Utils (T069)', () => {
  // ... tests using mock functions at bottom
});

// Mock functions (DELETE)
function isValidNumericInput(value: string): boolean { ... }
function validateOnBlur(value: string): { ... } { ... }
// etc.
```

**After** (length: ~320 lines):
```typescript
import { ConversionErrorType } from '@/types/tempconverter';
import { isValidTemperatureInput as isValidNumericInput, parseTemperatureInput, ... } from '@/utils/formatting';
import { validateOnBlur, validateOnSubmit, ... } from '@/utils/validation';

describe('Validation Utils (T069)', () => {
  // ... tests updated to call real functions
  // All mock functions REMOVED
});
```

---

### 2. `apps/temp/ui/tests/components/ErrorBanner.test.tsx`

**Changes**:
- Add ConversionErrorType import
- Create test helper for error objects
- Replace all `status` prop with `error` prop
- Update error object structure

**Search & Replace**:
```
Find: status={{ hasError: true, errorMessage: '
Replace: error={createTestError('

Find: status={{ hasError: false, errorMessage: undefined }}
Replace: error={null}

Find: status={{ hasError: false }}
Replace: error={null}
```

**Add Helper**:
```typescript
function createTestError(
  message: string,
  type: ConversionErrorType = ConversionErrorType.InvalidInput
) {
  return {
    type,
    message,
    field: 'input' as const,
    timestamp: new Date().toISOString(),
  };
}
```

---

### 3. `apps/temp/ui/src/utils/validation.ts`

**Addition**: Add sanitizeInput function
```typescript
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  return input.trim();
}
```

---

### 4. `apps/temp/ui/src/components/TempConverter.tsx`

**Changes**:
- Import validation utilities
- Update handleInputBlur to use validateOnBlur
- Update handleSubmit to use validateOnSubmit
- Ensure error state is set from validation results

**Key Import**:
```typescript
import { validateOnBlur, validateOnSubmit } from '@/utils/validation';
```

---

### 5. `apps/temp/ui/src/components/TemperatureInput.tsx`

**Changes**: Minor - mostly comments clarifying it's a dumb component

---

## Testing & Validation

### Before Starting
1. Note current test results: 82 failed / 146 passed
2. Run: `cd apps/temp/ui && npm run test -- --run`

### After Each Tier
**After Tier 1** (Critical Blockers):
- Expected: ~40 test failures resolved
- New result: Should be ~42 failed / 186 passed
- Tests: validation.test.ts (should have ~40 more passing)
- Tests: ErrorBanner.test.tsx (should have 14 passing)

**After Tier 2** (Integration Fixes):
- Expected: ~10-15 more test failures resolved
- New result: Should be ~27 failed / 201 passed
- Tests: TemperatureInput.test.tsx and TempConverter.test.tsx should improve

**After Tier 3** (Minor Fixes):
- Expected: Remaining test failures resolved
- New result: Should be 0 failed / 228 passed ✅
- All Phase 9 tests passing

### Final Verification
```bash
cd apps/temp/ui
npm run test -- --run
npm run lint
npm run build
```

Expected output:
```
✓ All tests passing
✓ No linting errors
✓ Build succeeds
```

---

## Success Criteria Checklist

- [ ] All validation.test.ts tests passing (45+ tests)
- [ ] All ErrorBanner.test.tsx tests passing (14 tests)
- [ ] All TemperatureInput.test.tsx tests passing (~15+ tests)
- [ ] All TempConverter.test.tsx tests passing (~15+ tests)
- [ ] No test failures across Phase 9 test files
- [ ] npm run lint passes with no errors
- [ ] npm run build succeeds
- [ ] All Phase 9 tasks (T066-T075) marked complete

**Overall**: 228 tests passing, 0 failures (100% pass rate)

---

## Quick Reference: File-by-File Summary

| File | Changes | Time |
|------|---------|------|
| validation.test.ts | Remove mocks, add imports, fix signatures | 30-40 min |
| ErrorBanner.test.tsx | Update props, add helper function | 20-30 min |
| validation.ts | Add sanitizeInput function | 5 min |
| TempConverter.tsx | Add validation calls to blur/submit | 20-30 min |
| TemperatureInput.tsx | Minor comments only | 5 min |
| useTempConversion.test.ts | Debug 2 edge case failures | 10-15 min |
| TemperatureInput.test.tsx | Sync if needed | 10-15 min |
| TempConverter.test.tsx | Sync if needed | 10-15 min |

**Total Estimated Time**: 1.5-2 hours

---

## Implementation Order

1. **Start with TIER 1** - These are blockers that prevent other work
2. **Complete TIER 2** - Integration of validation into components
3. **Finish TIER 3** - Edge cases and final synchronization
4. **Validate** - Run full test suite after each tier

**Recommended approach**: 
- 1st session: Complete all of Tier 1 (1 hour)
- 2nd session: Complete all of Tier 2 (40 minutes)
- 3rd session: Complete Tier 3 and validation (30 minutes)

This staggered approach allows testing between sessions and prevents accumulating errors.








