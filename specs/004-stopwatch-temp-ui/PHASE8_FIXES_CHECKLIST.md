# Phase 8: Quick Reference - Fixes Checklist

**Use this document as a step-by-step guide to fix all Phase 8 issues.**

---

## Pre-Work: Setup

- [ ] Read investigation report: `PHASE8_INVESTIGATION_REPORT.md`
- [ ] Read implementation plan: `PHASE8_IMPLEMENTATION_PLAN.md`
- [ ] Open terminal in: `apps/temp/ui/`
- [ ] Run baseline: `npm run test -- --run` (should show 113/144 passing)

---

## Fix 1: TemperatureInput onChange Handler [15 min]

**File**: `apps/temp/ui/src/components/TemperatureInput.tsx`

### Checklist

- [ ] Read current TemperatureInput.tsx implementation
- [ ] Verify component interface has proper onChange type
- [ ] Ensure input element has onChange handler bound
- [ ] Test: `npm run test -- TemperatureInput.test.tsx --run`
- [ ] Verify: Should show 7 PASSED (from 1 PASSED)

### Expected Changes
```
Before: onChange not called on input change
After:  Input accepts all values (positive, negative, decimal)
```

### Verification
```bash
npm run test -- TemperatureInput.test.tsx --run
# Look for:
# ✓ should accept positive numbers
# ✓ should accept negative numbers
# ✓ should accept decimal values
# ✓ should handle empty input
# ✓ should handle very large numbers
# ✓ should handle very small numbers
# ✓ should have proper ARIA label
```

---

## Fix 2: ConversionResult Test IDs [20 min]

**File**: `apps/temp/ui/src/components/ConversionResult.tsx` + tests

### Checklist

- [ ] Read ConversionResult.tsx implementation
- [ ] Identify all places where data-testid is used
- [ ] Ensure consistent test ID: always use "conversion-result"
- [ ] Use data-loading attribute for state instead
- [ ] Update any test queries to use correct selectors
- [ ] Test: `npm run test -- ConversionResult.test.tsx --run`
- [ ] Verify: Should show 27 PASSED (from 18 PASSED)

### Expected Changes
```
Before: data-testid switches between "conversion-result" and "conversion-result-loading"
After:  data-testid always "conversion-result", state tracked with data-loading attribute
```

### Verification
```bash
npm run test -- ConversionResult.test.tsx --run
# Look for:
# ✓ should include degree symbol if supported
# ✓ should display result label describing conversion direction
# ✓ should show loading indicator when isLoading is true
# ✓ should transition from loading to loaded
# [... and 23 more tests passing ...]
```

---

## Fix 3: useTempConversion Hook Callbacks [30 min]

**File**: `apps/temp/ui/src/hooks/useTempConversion.ts`

### Checklist

- [ ] Review handleSetSourceUnit function
  - [ ] Verify it calls performConversion with NEW sourceUnit
  - [ ] Ensure dependency array includes sourceUnit
  
- [ ] Review handleSetTargetUnit function
  - [ ] Verify it calls performConversion with NEW targetUnit
  - [ ] Ensure dependency array includes targetUnit

- [ ] Review handleSetInputValue function
  - [ ] Verify it calls performConversion immediately
  - [ ] Ensure conversion happens synchronously

- [ ] Test: `npm run test -- useTempConversion.test.ts --run`
- [ ] Verify: Should show 62 PASSED (from 60 PASSED)

### Expected Changes
```
Before: Changing units without input change → no recalculation
After:  Any unit change triggers immediate conversion
```

### Verification
```bash
npm run test -- useTempConversion.test.ts --run
# Look for:
# ✓ should recalculate when source unit changes
# ✓ should handle simultaneous unit and input changes
# [... and 60 more tests passing ...]
```

---

## Fix 4: Invalid Format Validation [5 min]

**File**: `apps/temp/ui/src/hooks/useTempConversion.ts`

### Checklist

- [ ] Locate isValidNumber function
- [ ] Add check: count decimal points, reject if > 1
- [ ] Test: `npm run test -- useTempConversion.test.ts --run`
- [ ] Verify: "should not convert invalid formats" passing

### Expected Changes
```
Before: "12.34.56" treated as 12.34 (valid)
After:  "12.34.56" rejected as invalid (hasError = true)
```

### Verification
```bash
npm run test -- useTempConversion.test.ts --run
# Look for:
# ✓ should not convert invalid formats
```

### Code Reference
```typescript
function isValidNumber(value: string): boolean {
  if (value.trim() === '') {
    return false;
  }
  
  // NEW: Count decimal points
  const decimalCount = (value.match(/\./g) || []).length;
  if (decimalCount > 1) {
    return false;  // Reject multiple decimals
  }
  
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
}
```

---

## Fix 5: Add Integration Test Note [5 min]

**File**: `apps/temp/ui/tests/components/UnitSelectors.test.tsx`

### Checklist

- [ ] Add comment after T065 test section
- [ ] Note that full integration testing deferred to Phase 12
- [ ] Confirm component-level tests complete

### Expected Changes
```
Add documentation note:
"Full end-to-end keyboard navigation test will be added 
when TempConverter container is created (Phase 12 task T089)."
```

---

## Final Verification: Full Test Suite

- [ ] Run full test: `npm run test -- --run`
- [ ] Expected: 144 PASSED, 0 FAILED
- [ ] Verify: All 4 test files show 100% pass rate

### Breakdown Expected
```
useTempConversion.test.ts  ............. 62/62 ✅
UnitSelectors.test.tsx     ............. 23/23 ✅
ConversionResult.test.tsx  ............. 27/27 ✅
TemperatureInput.test.tsx  ............. 7/7 ✅
Other tests               ............. 25/25 ✅
─────────────────────────────────────────────────
TOTAL                     ............. 144/144 ✅
```

---

## Quality Checks

- [ ] Linting: `npm run lint`
  - [ ] Should show: 0 errors

- [ ] Build: `npm run build`
  - [ ] Should complete without errors

- [ ] Coverage: Check test coverage > 50%
  - [ ] All components covered

- [ ] TypeScript: `npx tsc --noEmit`
  - [ ] Should show: 0 errors

---

## Sign-Off Checklist

When all fixes complete:

- [ ] 144/144 tests passing (100%)
- [ ] 0 linting errors
- [ ] 0 TypeScript errors
- [ ] Build succeeds
- [ ] F→C conversion verified
- [ ] Keyboard navigation verified
- [ ] ARIA accessibility verified
- [ ] No warnings in console

---

## Time Tracking

| Fix # | Task | Estimated | Actual | Status |
|-------|------|-----------|--------|--------|
| 1 | TemperatureInput onChange | 15 min | ___ | ⬜ |
| 2 | ConversionResult test IDs | 20 min | ___ | ⬜ |
| 3 | useTempConversion callbacks | 30 min | ___ | ⬜ |
| 4 | Invalid format validation | 5 min | ___ | ⬜ |
| 5 | Integration test note | 5 min | ___ | ⬜ |
| 6 | Final verification | 15 min | ___ | ⬜ |
| | **TOTAL** | **90 min** | ___ | ⬜ |

---

## If Issues Arise

### Issue: TemperatureInput tests still fail after onChange fix
- [ ] Verify input element exists with data-testid="temperature-input"
- [ ] Verify onChange prop is being passed correctly
- [ ] Verify event handler calls onChange(e.target.value)
- [ ] Check if input is disabled or has other restrictions

### Issue: ConversionResult tests still fail after test ID fix
- [ ] Verify data-testid="conversion-result" on ALL states
- [ ] Verify tests use correct selector for state checking
- [ ] Check if conditional rendering is using right IDs
- [ ] Run single test to debug: `npm run test -- "should show loading"` --run`

### Issue: Hook tests still fail after callback fix
- [ ] Verify performConversion is called in each handler
- [ ] Verify dependency arrays are correct
- [ ] Check if state updates are synchronous
- [ ] Look for race conditions in act() blocks

---

## Success Criteria

Phase 8 is **COMPLETE** when:

1. ✅ All 144 tests passing
2. ✅ No linting errors
3. ✅ No TypeScript errors
4. ✅ Build succeeds
5. ✅ F→C conversion accurate (5/5 tests)
6. ✅ Keyboard navigation works (23+ tests)
7. ✅ ARIA labels correct
8. ✅ Input validation robust
9. ✅ Edge cases handled
10. ✅ Ready for Phase 9

---

## Next Steps After Phase 8 Complete

- [ ] Commit changes with message: "fix: Phase 8 F→C conversion and keyboard nav"
- [ ] Update tasks.md to mark T063-T065 as COMPLETE
- [ ] Proceed to Phase 9: Input Validation (T066-T075)
- [ ] Verify Phase 7 (C→F) still working
- [ ] Plan Phase 12 (Integration) as follow-up

---

## Resources

| Document | Purpose |
|----------|---------|
| PHASE8_INVESTIGATION_REPORT.md | Detailed gap analysis |
| PHASE8_IMPLEMENTATION_PLAN.md | Step-by-step solutions |
| PHASE8_EXECUTIVE_SUMMARY.md | Overview and risks |
| PHASE8_FIXES_CHECKLIST.md | Quick reference (this file) |

---

## Emergency Contact Info

If stuck:
1. Review specific fix section above
2. Check corresponding file in implementation plan
3. Review test file to understand expectations
4. Search for similar patterns in passing tests





