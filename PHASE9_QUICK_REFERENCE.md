# Phase 9 Quick Reference Card

**Phase**: User Story 7 - Handle Invalid Input (T066-T075)  
**Status**: 🟠 85% Structurally Complete, 64% Functionally Complete  
**Action**: 5 Blockers Need Fixing (1.5-2 hours estimated)

---

## 🎯 The Situation

✅ **What Works**: 146 tests passing (64%), validation logic correct, components structure sound  
❌ **What's Broken**: 82 tests failing (36%), test mocks not calling real code, props mismatch

---

## 🔴 5 Critical Blockers

### 1️⃣ validation.test.ts (45 test failures)
**Issue**: Mock functions instead of real imports  
**Fix**: Remove placeholder functions, add imports  
**Time**: 30-40 min  
**File**: `apps/temp/ui/tests/utils/validation.test.ts` lines 330-360

### 2️⃣ ErrorBanner.test.tsx (14 test failures)
**Issue**: `status` prop vs `error` prop mismatch  
**Fix**: Update props to use ConversionError structure  
**Time**: 20-30 min  
**File**: `apps/temp/ui/tests/components/ErrorBanner.test.tsx` lines 25-50+

### 3️⃣ On-Blur Validation Missing
**Issue**: Blur event doesn't trigger validation  
**Fix**: Add `validateOnBlur()` call to handler  
**Time**: 20-30 min  
**File**: `apps/temp/ui/src/components/TempConverter.tsx` line 108-124

### 4️⃣ On-Submit Validation Incomplete
**Issue**: Submit doesn't explicitly validate  
**Fix**: Add `validateOnSubmit()` call to handler  
**Time**: 15-20 min  
**File**: `apps/temp/ui/src/components/TempConverter.tsx` line 130-165

### 5️⃣ Missing sanitizeInput() Function
**Issue**: Function referenced but not implemented  
**Fix**: Add 4-line utility function  
**Time**: 5 min  
**File**: `apps/temp/ui/src/utils/validation.ts`

---

## 📋 Implementation Tiers

### Tier 1: CRITICAL (1 hour) 
- [ ] Fix validation.test.ts (30-40 min)
- [ ] Fix ErrorBanner.test.tsx (20-30 min)  
- [ ] Add sanitizeInput (5 min)
- [ ] Test: Run `npm run test`, expect ~40 new passes

### Tier 2: INTEGRATION (40 min)
- [ ] Add blur validation call (20-30 min)
- [ ] Add submit validation call (15-20 min)
- [ ] Test: Run `npm run test`, expect ~10 more passes

### Tier 3: CLEANUP (30 min)
- [ ] Fix edge case tests (10-15 min)
- [ ] Sync component tests (10-15 min)
- [ ] Test: Run `npm run test`, expect all 228 passing ✅

---

## 📖 Documentation Map

| Document | Purpose | Audience | Time |
|----------|---------|----------|------|
| PHASE9_INVESTIGATION_SUMMARY.md | Overview | Everyone | 5-10 min |
| PHASE9_IMPLEMENTATION_PLAN.md | Fix instructions | Developers | 15-20 min |
| PHASE9_EXECUTIVE_SUMMARY.md | Manager brief | Managers | 10-15 min |
| PHASE9_INVESTIGATION_REPORT.md | Deep dive | Technical leads | 20-30 min |
| This file | Quick ref | Quick lookup | 2-3 min |

---

## 🔧 Quick Code Changes

### Change 1: Fix Imports in validation.test.ts
```typescript
// REMOVE (lines 330-360):
function isValidNumericInput() { return false; }
function validateOnBlur() { return { isValid: false }; }
// ... all other mock functions

// ADD (at top after line 8):
import { isValidTemperatureInput as isValidNumericInput, ... } from '@/utils/formatting';
import { validateOnBlur, validateOnSubmit, ... } from '@/utils/validation';
```

### Change 2: Fix Props in ErrorBanner.test.tsx
```typescript
// BEFORE:
render(<ErrorBanner status={{ hasError: true, errorMessage: 'text' }} />)

// AFTER:
render(<ErrorBanner error={{ type: 'INVALID_INPUT', message: 'text', field: 'input', timestamp: '...' }} />)
```

### Change 3: Add sanitizeInput Function
```typescript
// Add to apps/temp/ui/src/utils/validation.ts:
export function sanitizeInput(input: string): string {
  return input?.trim() || '';
}
```

### Change 4: Add On-Blur Validation
```typescript
// In TempConverter.tsx handleInputBlur():
const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
  const value = event.currentTarget.value;
  const error = validateOnBlur(value, true);
  if (error) {
    // Handle error...
  }
};
```

### Change 5: Add On-Submit Validation
```typescript
// In TempConverter.tsx handleSubmit():
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const error = validateOnSubmit(inputValue);
  if (error) {
    // Handle error...
    return;
  }
  // Proceed with conversion...
};
```

---

## ✅ Success Checklist

- [ ] All 5 blockers identified ✅
- [ ] Root causes understood ✅
- [ ] Implementation plan documented ✅
- [ ] Code examples provided ✅
- [ ] Time estimates realistic ✅
- [ ] Ready to implement

**Next**: Begin Tier 1 fixes (1 hour)

---

## 📊 Expected Results

| Milestone | Tests | Pass Rate | Time |
|-----------|-------|-----------|------|
| Start | 146/228 | 64% | 0h |
| After Tier 1 | ~186/228 | 82% | 1h |
| After Tier 2 | ~201/228 | 88% | 1.75h |
| After Tier 3 | 228/228 | 100% ✅ | 2.25h |

---

## 🚀 Go/No-Go Decision

**GO** ✅ - All blockers identified, solutions clear, ready to implement

**Confidence**: 95%  
**Risk**: LOW (straightforward integration fixes)  
**Complexity**: MODERATE (test synchronization)  
**Time**: 1.5-2 hours

---

## 📍 File Locations

**Test Files to Fix**:
```
apps/temp/ui/tests/utils/validation.test.ts
apps/temp/ui/tests/components/ErrorBanner.test.tsx
```

**Source Files to Fix**:
```
apps/temp/ui/src/components/TempConverter.tsx
apps/temp/ui/src/components/TemperatureInput.tsx
apps/temp/ui/src/utils/validation.ts
```

**May Need Sync**:
```
apps/temp/ui/tests/components/TemperatureInput.test.tsx
apps/temp/ui/tests/components/TempConverter.test.tsx
apps/temp/ui/tests/hooks/useTempConversion.test.ts
```

---

## 💬 FAQs

**Q: Start with what?**  
A: Tier 1 fixes (1 hour) - these unblock everything else

**Q: How to know if I'm done?**  
A: Run `npm run test -- --run` and see 228/228 passing ✅

**Q: What if something goes wrong?**  
A: Check PHASE9_INVESTIGATION_REPORT.md for detailed analysis

**Q: Which document should I read?**  
A: Developers → PHASE9_IMPLEMENTATION_PLAN.md  
   Managers → PHASE9_EXECUTIVE_SUMMARY.md

---

## 🎯 Your Next Action

1. **Read** PHASE9_IMPLEMENTATION_PLAN.md (15 min)
2. **Implement** Tier 1 fixes (1 hour)
3. **Test** - Run `npm run test`, verify passes increase
4. **Implement** Tier 2 & 3 fixes (1 hour 10 min)
5. **Verify** - All 228 tests passing ✅
6. **Complete** - Mark Phase 9 done!

**Total Time: ~2.5 hours from start to finish**

---

**Investigation Status**: ✅ Complete  
**Implementation Status**: 🔴 Ready to Start  
**Confidence**: 🟢 95%







