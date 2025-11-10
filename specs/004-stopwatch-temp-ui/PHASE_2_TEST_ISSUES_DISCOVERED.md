# Phase 2 Test Issues Discovered

**Date**: November 4, 2025  
**Test Run**: npm run test -- --run  
**Status**: 3/7 test files created (36 ✅ passing, 33 ❌ failing)

---

## 🔴 Critical Issues

### Issue 1: ErrorBanner Component Props Mismatch
**File**: `apps/stopwatch/ui/tests/components/ErrorBanner.test.tsx`  
**Severity**: CRITICAL  
**Status**: ❌ All 22 tests failing

**Problem**: 
- Test expects props: `hasError`, `message`, `onClearError` (individual props)
- Actual component expects: `status` (object), `onClearError`, `autoDismissMs`, `className`
- Component uses `status.errorMessage` not `message` prop

**Root Cause**: Test was written based on interface expectation, not actual implementation

**Solution**: Update test to match actual props:
```typescript
// WRONG (current):
<ErrorBanner hasError={true} message="Error" onClearError={vi.fn()} />

// CORRECT (should be):
<ErrorBanner 
  status={{hasError: true, errorMessage: "Error", ...otherProps}} 
  onClearError={vi.fn()}
/>
```

**Fix Effort**: 30 min (update all ~22 tests)

---

### Issue 2: useStopwatch Hook Behavior Doesn't Match Test Expectations
**File**: `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts`  
**Severity**: CRITICAL  
**Status**: ❌ 10+ tests failing

**Problems**:
1. `start()` doesn't transition to 'running' - Hook test expects mode='running' but gets 'idle'
2. `stop()` doesn't transition to 'stopped' - Hook test expects mode='stopped' but gets 'running'
3. Elapsed time not accumulating - `state.elapsedMs` stays 0 even after advancing timers
4. Error state not being set - `state.hasError` stays false even after error scenarios
5. Lap intervals not calculated - `laps[1].intervalMs` is 0 instead of expected 2000+

**Root Cause**: Likely mismatch between hook's actual async state update timing and test expectations. Tests may need:
- To wait for hook state updates
- To advance timers properly for interval updates
- To check if hook uses useState vs useReducer differently than expected

**Example Failing Test**:
```typescript
// Line 91 - expects 'stopped' but gets 'running'
expect(result.current.state.mode).toBe('stopped');  // ❌ FAILS
// Actual: mode is still 'running'
```

**Fix Effort**: 1-2 hours (debug hook behavior + adjust tests)

**Investigation Needed**:
- Check if `useStopwatch` hook actually implements stop() method
- Verify if state updates are synchronous or async
- Check if interval updates in hook trigger re-renders properly
- Look for race conditions between act() and state updates

---

### Issue 3: validation.test.ts Setup File CommonJS Error
**File**: `apps/stopwatch/ui/tests/setup.ts`  
**Severity**: CRITICAL  
**Status**: ❌ Blocks all validation tests

**Error**:
```
Vitest cannot be imported in a CommonJS module using require()
Error at tests/setup.js:4:16 (vitest import issue)
```

**Root Cause**: `setup.ts` is being compiled to CommonJS (`.js`) instead of ES modules

**Solution**: Check `vitest.config.ts`:
- Ensure `setupFiles` points to TypeScript file, not compiled JS
- Verify `esbuild` or similar isn't converting to CommonJS
- May need to disable TypeScript compilation for setup file or adjust config

**Fix Effort**: 15 min (verify vitest config)

---

## 📊 Test Status Summary

| Test File | Tests | Status | Issue |
|-----------|-------|--------|-------|
| formatting.test.ts | 22 | ✅ PASS | None |
| validation.test.ts | 50+ | ❌ FAIL | Setup file CommonJS error |
| useStopwatch.test.ts | 40+ | ❌ FAIL (50%) | Hook behavior mismatch |
| ErrorBanner.test.tsx | 22 | ❌ FAIL | Props interface mismatch |
| **Subtotal** | **134** | **36 ✅ / 98 ❌** | **3 Critical Issues** |

---

## 🎯 Immediate Action Items

### Priority 1: Fix Hook Behavior (1-2h)
```
1. Investigate useStopwatch actual implementation
2. Verify start(), stop(), lap(), reset() methods work
3. Check if hook state updates sync or async
4. Adjust tests to match actual behavior OR
5. Fix hook implementation if buggy
```

### Priority 2: Fix ErrorBanner Props (30m)
```
1. Update all 22 tests to use correct props signature
2. Change: hasError/message → status object
3. Verify component export (may need default export)
```

### Priority 3: Fix Setup File Issue (15m)
```
1. Check vitest.config.ts setupFiles path
2. Ensure TypeScript not being compiled to CommonJS
3. Test setup file loads correctly
```

---

## 🔍 Investigation Results Needed

**For Hook Tests**:
- [ ] Does `useStopwatch` return correct hook signature?
- [ ] Are state mutations synchronous or async?
- [ ] Does hook properly update `elapsedMs` on interval?
- [ ] Are validation checks inside hook or in component?

**For ErrorBanner Tests**:
- [ ] Is component exported as default or named export?
- [ ] Should tests match implementation or vice versa?
- [ ] Does component accept simple props or status object?

**For Setup File**:
- [ ] What is vitest.config.ts setupFiles configuration?
- [ ] Is setup.ts or setup.js being referenced?
- [ ] Can we verify import works in isolation?

---

## 📝 Recommendations

1. **Test First Approach**: Don't write tests against assumed interfaces
   - Check actual implementation FIRST
   - Then write tests that match reality
   - Better: Fix implementation if it doesn't match spec

2. **Verify Before Writing**:
   - Create small POC test file (1-2 tests) first
   - Run it to verify imports and basic structure work
   - Then expand full test suite

3. **Use Implementation as Source of Truth**:
   - Read the actual component/hook code
   - Understand prop interface and return types
   - Write tests around what code ACTUALLY does

---

## 🚀 Recovery Plan

**Option A: Quick Fix (2-3 hours)**
1. Fix ErrorBanner tests (30m) - update props
2. Fix useStopwatch tests (1.5h) - investigate behavior + adjust tests  
3. Fix setup file (15m) - verify vitest config
4. Run full suite again
5. Remaining 4 test files should work if pattern is correct

**Option B: Deep Fix (3-4 hours)**
1. Review useStopwatch implementation thoroughly
2. If buggy: Fix implementation issues
3. If correct: Fix test assumptions
4. Then complete remaining test files
5. Run coverage report

**Recommended**: Option A first (faster), escalate to Option B if tests still fail

---

## 📞 Next Steps

1. **Now**: Investigate root cause of each issue
2. **Fix Order**: 
   - Setup file issue (unblocks others)
   - ErrorBanner props (quick win)
   - Hook behavior (most complex)
3. **Then**: Create remaining 4 test files

**Blocking**: Phase 3 cannot start until Phase 2 tests are stable (≥80% passing)

---

**Created**: 2025-11-04  
**Updated**: [Will update after investigation]  
**Owner**: [Team lead for sign-off]
