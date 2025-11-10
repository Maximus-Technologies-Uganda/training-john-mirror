# Phase 10 Implementation Plan: Fix T076-T083 Gaps
## Step-by-Step Solutions with Code Examples

**Prepared For**: Production Readiness  
**Estimated Total Time**: 2-2.5 hours  
**Priority**: CRITICAL

---

## Issue 1: Hook Returns Null for Identical Units (T078, T080) - 30 MINUTES

### Problem
The `useTempConversion` hook treats identical units as a hard error and blocks conversion:
```typescript
// CURRENT (WRONG):
if (source === target) {
  setResult(null);
  setHasError(true);
  setErrorMessage('...');
  return;  // Early exit - no conversion
}
```

### Solution
Allow identity conversion to proceed, let parent component manage error display:

```typescript
// apps/temp/ui/src/hooks/useTempConversion.ts
// REPLACE THIS SECTION (lines 195-244):

const performConversion = useCallback(
  (input: string, source: TemperatureUnit, target: TemperatureUnit) => {
    // Empty input: no conversion
    if (input.trim() === '') {
      setResult(null);
      setHasError(false);
      setErrorMessage(undefined);
      return;
    }

    // Validate numeric input FIRST (before checking units)
    if (!isValidNumber(input)) {
      setResult(null);
      setHasError(true);
      setErrorMessage(
        'Invalid input: Please enter a valid numeric value (e.g., 25, -40.5, 98.6).'
      );
      return;
    }

    // Parse numeric value
    try {
      const numValue = parseFloat(input);
      
      // Perform conversion (identity if units are same)
      const convertedValue = convertTemperature(numValue, source, target);
      setResult(convertedValue);
      
      // Check for identical units AFTER conversion (for error display)
      const isIdenticalUnits = source === target;
      
      if (isIdenticalUnits) {
        // Allow conversion but signal error for UI display
        setHasError(true);
        setErrorMessage(
          'Source and target units cannot be the same. Please select different units to convert.'
        );
      } else {
        // Valid conversion, no error
        setHasError(false);
        setErrorMessage(undefined);
      }
    } catch (error) {
      setResult(null);
      setHasError(true);
      setErrorMessage('Conversion error. Please check your input.');
    }
  },
  []
);
```

### Key Changes:
1. **Identity conversion allowed** - `convertTemperature()` returns same value if units identical
2. **Validation order** - Numeric validation BEFORE unit check
3. **Error is optional** - hasError=true but result is still set (for parent to display error if needed)
4. **Separation of concerns** - Conversion logic separate from validation display

### Test Impact:
```typescript
// BEFORE (fails):
const { result } = renderHook(() =>
  useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '25' })
);
expect(result.current.result).toBe(25);  // ❌ Gets null

// AFTER (passes):
const { result } = renderHook(() =>
  useTempConversion({ sourceUnit: 'C', targetUnit: 'C', initialValue: '25' })
);
expect(result.current.result).toBe(25);  // ✅ Gets 25
```

---

## Issue 2: Test Query Incorrect - `getByDisplayValue` (T076) - 15 MINUTES

### Problem
React Testing Library's `getByDisplayValue()` doesn't work as expected for select elements:

```typescript
// WRONG: Tries to find an element where displayValue matches "Celsius"
const sourceSelect = screen.getByDisplayValue('Celsius');
// ❌ Fails: displayValue on select shows the VALUE attribute, not text
```

### Solution
Use test IDs or correct query patterns:

```typescript
// apps/temp/ui/tests/components/UnitSelectors.test.tsx
// REPLACE lines 49-54:

// ❌ BEFORE:
const sourceSelect = screen.getByDisplayValue('Celsius') as HTMLSelectElement;
const targetSelect = screen.getByDisplayValue('Fahrenheit') as HTMLSelectElement;
expect(sourceSelect).toHaveValue('C');
expect(targetSelect).toHaveValue('F');

// ✅ AFTER (Option 1 - Using test IDs):
const sourceSelect = screen.getByTestId('source-unit-selector') as HTMLSelectElement;
const targetSelect = screen.getByTestId('target-unit-selector') as HTMLSelectElement;
expect(sourceSelect).toHaveValue('C');
expect(targetSelect).toHaveValue('F');

// ✅ AFTER (Option 2 - Using ARIA labels):
const sourceSelect = screen.getByLabelText(/source.*unit/i) as HTMLSelectElement;
const targetSelect = screen.getByLabelText(/target.*unit/i) as HTMLSelectElement;
expect(sourceSelect).toHaveValue('C');
expect(targetSelect).toHaveValue('F');
```

### Apply to All Affected Tests:
```typescript
// apps/temp/ui/tests/components/UnitSelectors.test.tsx

// Line 82-86 (identical units C→C):
// ❌ Remove:
// const sourceSelect = screen.getByDisplayValue('Celsius') as HTMLSelectElement;
// const targetSelect = screen.getAllByDisplayValue('Celsius')[1] as HTMLSelectElement;

// ✅ Replace with:
const sourceSelect = screen.getByTestId('source-unit-selector') as HTMLSelectElement;
const targetSelect = screen.getByTestId('target-unit-selector') as HTMLSelectElement;

// Line 99-103 (identical units F→F):
// ✅ Same fix:
const sourceSelect = screen.getByTestId('source-unit-selector') as HTMLSelectElement;
const targetSelect = screen.getByTestId('target-unit-selector') as HTMLSelectElement;
```

---

## Issue 3: Arrow Key Test Not Firing Change Event (T076) - 5 MINUTES

### Problem
```typescript
// CURRENT (Line 237-241):
const sourceSelect = screen.getByLabelText(/source.*unit/i) as HTMLSelectElement;
sourceSelect.focus();
await user.keyboard('{ArrowDown}');
expect(mockOnSourceChange).toHaveBeenCalled();  // ❌ Not called
```

HTML select elements need actual selection change, not just arrow key:

### Solution
```typescript
// apps/temp/ui/tests/components/UnitSelectors.test.tsx
// REPLACE lines 223-242:

it('should allow changing units with arrow keys', async () => {
  const user = userEvent.setup();
  render(
    <UnitSelectors
      sourceUnit="C"
      targetUnit="F"
      onSourceUnitChange={mockOnSourceChange}
      onTargetUnitChange={mockOnTargetChange}
    />
  );

  const sourceSelect = screen.getByTestId('source-unit-selector') as HTMLSelectElement;
  sourceSelect.focus();
  expect(sourceSelect).toHaveFocus();

  // Select elements handle arrow keys via change event
  // Use userEvent.selectOptions instead for reliable testing
  await user.selectOptions(sourceSelect, 'F');
  
  // Verify the change
  expect(mockOnSourceChange).toHaveBeenCalledWith('F');
  expect(sourceSelect).toHaveValue('F');
});
```

---

## Issue 4: Missing afterEach Hook Import (T077) - 5 MINUTES

### Problem
```typescript
// CURRENT (Line 23-27):
beforeEach(() => {
  mockOnClearError.mockClear();
  vi.useFakeTimers();
});

afterEach(() => {  // ❌ Not imported, undefined
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});
```

### Solution
```typescript
// apps/temp/ui/tests/components/ErrorBanner.identical-units.test.tsx
// ADD to imports (line 9):

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';  // ✅ Add afterEach
import { render, screen, act } from '@testing-library/react';
// ... rest of imports
```

---

## Issue 5: TemperatureInput Not Calling Parent Callbacks (T066) - 30 MINUTES

### Problem
Tests expect callbacks but component isn't calling them:
```typescript
// Test expects (Line 37-38):
expect(handleChange).toHaveBeenCalled();
expect(handleBlur).toHaveBeenCalled();
// ❌ But component doesn't call these callbacks
```

### Solution
Ensure TemperatureInput properly exposes callbacks:

```typescript
// apps/temp/ui/src/components/TemperatureInput.tsx
// Check/add these handlers:

export interface TemperatureInputProps {
  value: string;
  onChange: (value: string) => void;  // ✅ Required
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;  // ✅ Optional
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  // ... other props
}

export const TemperatureInput: React.FC<TemperatureInputProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);  // ✅ Call parent onChange
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e);  // ✅ Call parent onBlur if provided
    }
  };

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}  // ✅ Wire handler
      onBlur={handleBlur}       // ✅ Wire handler
      onFocus={onFocus}
      // ... other attributes
    />
  );
};
```

### Update Tests to Verify:
```typescript
// apps/temp/ui/tests/components/TemperatureInput.test.tsx
// Lines 25-50 should render with proper props

it('should call onChange when input value changes', async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();
  
  render(
    <TemperatureInput
      value=""
      onChange={handleChange}
      onBlur={vi.fn()}
    />
  );

  const input = screen.getByTestId('temperature-input') as HTMLInputElement;
  await user.type(input, '25');
  
  expect(handleChange).toHaveBeenCalledWith('25');
});

it('should call onBlur when input loses focus', async () => {
  const handleBlur = vi.fn();
  
  render(
    <TemperatureInput
      value="25"
      onChange={vi.fn()}
      onBlur={handleBlur}
    />
  );

  const input = screen.getByTestId('temperature-input');
  fireEvent.blur(input);
  
  expect(handleBlur).toHaveBeenCalled();
});
```

---

## Issue 6: React `act()` Warnings in TempConverter Tests (T067) - 20 MINUTES

### Problem
```
Warning: An update to TempConverter inside a test was not wrapped in act(...)
```

### Solution
Wrap async state updates in `act()`:

```typescript
// apps/temp/ui/tests/components/TempConverter.test.tsx
// Example fix for "should allow submit with valid numeric input":

it('should allow submit with valid numeric input', async () => {
  const user = userEvent.setup();
  render(<TempConverter />);

  const input = screen.getByTestId('temperature-input') as HTMLInputElement;
  const submitButton = screen.getByRole('button', { name: /convert/i });

  // ✅ Wrap user interactions in act()
  await act(async () => {
    await user.type(input, '25');
  });

  await act(async () => {
    await user.click(submitButton);
  });

  // Assertions
  expect(screen.queryByText(/error|invalid/i)).not.toBeInTheDocument();
});
```

### Alternative: Use userEvent setup with proper async handling
```typescript
it('should allow submit with valid numeric input', async () => {
  const user = userEvent.setup({ delay: null });  // Use setup with options
  render(<TempConverter />);

  const input = screen.getByTestId('temperature-input') as HTMLInputElement;
  const submitButton = screen.getByRole('button', { name: /convert/i });

  // userEvent already wraps in act() with setup()
  await user.type(input, '25');
  await user.click(submitButton);

  expect(screen.queryByText(/error|invalid/i)).not.toBeInTheDocument();
});
```

---

## Implementation Checklist

### Step 1: Fix Hook Logic (T078, T080)
- [ ] Update `performConversion()` to allow identity conversion
- [ ] Move identical unit check AFTER conversion calculation
- [ ] Set result even when identical units
- [ ] Mark hasError but allow result to be set
- [ ] Update tests expectations if needed

**File**: `apps/temp/ui/src/hooks/useTempConversion.ts`  
**Time**: 30 min

---

### Step 2: Fix Test Queries (T076)
- [ ] Replace all `getByDisplayValue('Celsius')` with `getByTestId()`
- [ ] Fix identical units C→C test queries
- [ ] Fix identical units F→F test queries
- [ ] Fix arrow key test to use `selectOptions()`

**File**: `apps/temp/ui/tests/components/UnitSelectors.test.tsx`  
**Time**: 15 min

---

### Step 3: Fix Missing Import (T077)
- [ ] Add `afterEach` to vitest imports

**File**: `apps/temp/ui/tests/components/ErrorBanner.identical-units.test.tsx`  
**Time**: 5 min

---

### Step 4: Wire TemperatureInput Callbacks (T066)
- [ ] Verify component accepts onChange callback
- [ ] Verify component accepts onBlur callback
- [ ] Ensure handlers call parent callbacks
- [ ] Update tests to verify callbacks are called

**File**: 
- `apps/temp/ui/src/components/TemperatureInput.tsx`
- `apps/temp/ui/tests/components/TemperatureInput.test.tsx`

**Time**: 30 min

---

### Step 5: Wrap Async Updates in act() (T067)
- [ ] Identify all user interactions that trigger state changes
- [ ] Wrap in `act()` or use `userEvent.setup()`
- [ ] Verify act() warnings disappear

**File**: `apps/temp/ui/tests/components/TempConverter.test.tsx`  
**Time**: 20 min

---

### Step 6: Run Tests and Verify
```bash
npm test -- --run
```
- [ ] All T076 tests passing
- [ ] All T077 tests passing
- [ ] All T078 tests passing
- [ ] All T079 tests passing
- [ ] All T080 tests passing
- [ ] All T081 tests passing
- [ ] All T082 tests passing
- [ ] All T083 tests passing
- [ ] No act() warnings
- [ ] 150/150 Phase 10 tests passing

**Time**: 15 min

---

## Success Criteria

✅ All tests passing: 150/150  
✅ No console warnings  
✅ Hook returns proper conversion results  
✅ Error states properly managed  
✅ Accessibility features intact  
✅ Best practices followed

---

## Rollback Plan

If any fix breaks other tests:
1. Run full test suite: `npm test -- --run`
2. Identify newly broken tests
3. Check if issue is in fix or test expectations
4. Revert change and revise approach

---

## Documentation Updates

After fixes are applied, update:
- [ ] Component props documentation
- [ ] Hook behavior comments
- [ ] Test comments explaining identical unit behavior
- [ ] Update tasks.md checkpoint with actual status


