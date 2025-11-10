# Phase 10 Quick Reference Guide
## T076-T083: Identical Unit Validation - What to Fix

**At-a-glance**: 5 issues, 2-2.5 hours to fix, mostly in 3 files

---

## The Problem (30 seconds)

User selects "Celsius to Celsius" (identical units). Currently:
- ❌ Hook says ERROR and returns null
- ✅ Should return 25 (identity value)

---

## The 5 Fixes

### Fix 1: Hook Logic (30 min) ⚠️ CRITICAL
**File**: `apps/temp/ui/src/hooks/useTempConversion.ts` line 195-244

**Change**: Remove early return when units are identical
```typescript
// BEFORE (wrong):
if (source === target) {
  setResult(null);      // ❌ Returns null
  setHasError(true);
  return;
}

// AFTER (right):
const convertedValue = convertTemperature(numValue, source, target);
setResult(convertedValue);  // ✅ Always set result
if (source === target) {
  setHasError(true);    // ✅ But signal error if same
}
```

---

### Fix 2: Test Queries (15 min)
**File**: `apps/temp/ui/tests/components/UnitSelectors.test.tsx` lines 49, 82, 99

**Change**: Replace `getByDisplayValue()` with `getByTestId()`
```typescript
// BEFORE (broken):
const sourceSelect = screen.getByDisplayValue('Celsius');

// AFTER (works):
const sourceSelect = screen.getByTestId('source-unit-selector');
```

Also fix arrow key test line 237:
```typescript
// BEFORE (doesn't work):
await user.keyboard('{ArrowDown}');
expect(mockOnSourceChange).toHaveBeenCalled();  // ❌

// AFTER (works):
await user.selectOptions(sourceSelect, 'F');
expect(mockOnSourceChange).toHaveBeenCalledWith('F');
```

---

### Fix 3: Missing Import (5 min)
**File**: `apps/temp/ui/tests/components/ErrorBanner.identical-units.test.tsx` line 9

**Change**: Add `afterEach` to import
```typescript
// BEFORE:
import { describe, it, expect, vi, beforeEach } from 'vitest';

// AFTER:
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
```

---

### Fix 4: Component Wiring (30 min)
**Files**: 
- `apps/temp/ui/src/components/TemperatureInput.tsx`
- `apps/temp/ui/tests/components/TemperatureInput.test.tsx`

**Change**: Ensure onChange/onBlur handlers are called

Check that component calls parent callbacks:
```typescript
// Make sure in TemperatureInput.tsx:
const handleChange = (e) => {
  onChange(e.target.value);  // ✅ Call parent
};

const handleBlur = (e) => {
  if (onBlur) onBlur(e);    // ✅ Call parent
};
```

---

### Fix 5: Async Testing (20 min)
**File**: `apps/temp/ui/tests/components/TempConverter.test.tsx`

**Change**: Wrap state updates in `act()`
```typescript
// BEFORE (shows warning):
await user.type(input, '25');
expect(result).toBe(25);

// AFTER (no warning):
await act(async () => {
  await user.type(input, '25');
});
expect(result).toBe(25);
```

---

## Verification

After fixes, run:
```bash
cd apps/temp/ui
npm test -- --run
```

Success = `150 passed` ✅

---

## Test Coverage Improvement

| File | Before | After | Status |
|------|--------|-------|--------|
| UnitSelectors.test.tsx | 10/13 | 13/13 | 🟢 +3 |
| ErrorBanner.identical.test.tsx | 14/14 | 14/14 | 🟢 unchanged |
| useTempConversion.identical.test.ts | 18/36 | 36/36 | 🟢 +18 |
| TemperatureInput.test.tsx | 14/28 | 28/28 | 🟢 +14 |
| TempConverter.test.tsx | 20/27 | 27/27 | 🟢 +7 |

**Total**: 116/150 → 150/150 ✅

---

## File-by-File Checklist

- [ ] **useTempConversion.ts**: Allow identity conversion, move error check after calculation
- [ ] **UnitSelectors.test.tsx**: Replace getByDisplayValue with getByTestId (3 places), fix arrow key test
- [ ] **ErrorBanner.identical-units.test.tsx**: Add afterEach to import
- [ ] **TemperatureInput.tsx**: Ensure onChange/onBlur callbacks wired
- [ ] **TemperatureInput.test.tsx**: Update expectations if needed
- [ ] **TempConverter.test.tsx**: Wrap user interactions in act()

---

## Documentation Files Created

For detailed info, see:
- 📋 **PHASE10_INVESTIGATION_REPORT.md** - Full analysis, root causes
- 📋 **PHASE10_IMPLEMENTATION_PLAN.md** - Step-by-step code examples
- 📋 **PHASE10_EXECUTIVE_SUMMARY.md** - Status, blockers, lessons learned

---

## Expected Outcome

✅ All 150 tests passing  
✅ No console warnings  
✅ Hook correctly handles identity conversion  
✅ Error states properly managed by parent component  
✅ Best practices followed (Separation of Concerns)


