# PHASE 6 Implementation Plan: Fix & Complete Invalid Operation Handling
**Target**: 100% test pass rate with production-ready error handling  
**Estimated Effort**: ~1.5 hours (critical fixes) + 5 hours (enhancements)  
**Complexity**: Medium  

---

## TIER 1: CRITICAL BLOCKING FIXES (1.5 hours) ⏱️

### Fix 1.1: Resolve useStopwatch.test.ts Parse Error
**Priority**: 🔴 P0 - BLOCKING  
**Time**: 15 minutes  
**File**: `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts`

**Current State**: 
```
Transform failed with 1 error: Unexpected end of file
```

**Investigation Steps**:
1. File ends at line 1765 with proper `});` - syntax is correct
2. Issue appears to be esbuild/Vitest caching issue
3. Solution: Clean build cache

**Step-by-Step Fix**:
```powershell
# From apps/stopwatch/ui directory
cd C:\Users\nsimb\Projects\training-john\training-john\apps\stopwatch\ui

# Clear Vitest cache
rm -r node_modules\.vite -Force
rm -r dist -Force

# Clear npm cache
npm cache clean --force

# Reinstall and rebuild
npm install
npm run build

# Run test to verify parse error is resolved
npm run test -- --run tests/hooks/useStopwatch.test.ts
```

**Verification**:
- ✅ `npm run test -- --run` loads without parse errors
- ✅ useStopwatch tests execute (may have failures, but file should parse)

---

### Fix 1.2: Correct Test ID Mismatch in Stopwatch.test.tsx
**Priority**: 🔴 P0 - BLOCKING  
**Time**: 10 minutes  
**File**: `apps/stopwatch/ui/tests/components/Stopwatch.test.tsx`

**Problem**: Tests search for `data-testid="display"` but component uses `data-testid="stopwatch-display"`

**All Test IDs to Update**:
```typescript
// OLD (current in tests)
screen.getByTestId('display')
screen.getByTestId('button-lap')
screen.getByTestId('button-stop')
screen.getByTestId('button-start')
screen.getByTestId('button-reset')

// NEW (matches StopwatchDisplay component)
screen.getByTestId('stopwatch-display')  // ✅ Component uses this
screen.getByTestId('button-lap')         // ✅ Already correct
screen.getByTestId('button-stop')        // ✅ Already correct
screen.getByTestId('button-start')       // ✅ Already correct
screen.getByTestId('button-reset')       // ✅ Already correct
```

**Lines to Update**:
- Line 36: `expect(screen.getByTestId('display')).toBeInTheDocument();`
- Line 50: `expect(screen.getByTestId('display')).toHaveTextContent('00:00:00');`
- Line 59: `const display = screen.getByTestId('display');`
- Line 78: `const display = screen.getByTestId('display');`
- Line 129: `const display = screen.getByTestId('display');`
- Line 214: `const display = screen.getByTestId('display');`
- Line 277: `const display = screen.getByTestId('display');`

**Search & Replace Command**:
```powershell
# From apps/stopwatch/ui directory
# Replace all occurrences
$file = "tests/components/Stopwatch.test.tsx"
$content = (Get-Content $file -Raw)
$content = $content -replace 'getByTestId\([''"]display[''"]\)', 'getByTestId("stopwatch-display")'
Set-Content $file $content -Encoding UTF8

# Verify replacement
grep 'stopwatch-display' tests/components/Stopwatch.test.tsx
```

**Verification**:
- ✅ `npm run test -- --run tests/components/Stopwatch.test.tsx` finds elements
- ✅ No more "Unable to find element" errors

---

### Fix 1.3: Add Disabled State Check to Keyboard Handlers
**Priority**: 🔴 P0 - BLOCKING  
**Time**: 20 minutes  
**File**: `apps/stopwatch/ui/src/components/StopwatchControls.tsx`

**Current Problem** (Lines 68-73):
```typescript
const handleKeyDown = (event: React.KeyboardEvent, handler: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handler();  // ❌ Bug: Called even if button is disabled
  }
};
```

**Failing Tests**:
1. `should not respond to keyboard when disabled` (Lap button)
2. `should not respond to keyboard when stopped` (Stop button)

**Fix Solution**:

1. Update `handleKeyDown` signature to accept disabled state:
```typescript
const handleKeyDown = (
  event: React.KeyboardEvent,
  disabled: boolean,
  handler: () => void
) => {
  // ✅ New: Skip if button is disabled
  if (disabled) return;
  
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handler();
  }
};
```

2. Update all button keyboard handlers:

**Lap Button** (around line 161):
```typescript
// OLD
onKeyDown={(e) => handleKeyDown(e, handleLapClick)}

// NEW
onKeyDown={(e) => handleKeyDown(e, !isRunning, handleLapClick)}
```

**Stop Button** (around line 126):
```typescript
// OLD
onKeyDown={(e) => handleKeyDown(e, handleStopClick)}

// NEW
onKeyDown={(e) => handleKeyDown(e, !isRunning, handleStopClick)}
```

**Start Button** (around line 91):
```typescript
// Already has check: disabled={isRunning}
// onKeyDown already correct, just needs validation
onKeyDown={(e) => handleKeyDown(e, isRunning, handleStartClick)}
```

**Reset Button** (around line 198):
```typescript
// NEW: Add keyboard handler
onKeyDown={(e) => handleKeyDown(e, false, handleResetClick)}
```

**Complete Updated Code** (Lines 68-223):
```typescript
const handleKeyDown = (
  event: React.KeyboardEvent,
  disabled: boolean,
  handler: () => void
) => {
  if (disabled) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handler();
  }
};

// In JSX buttons:
<button
  onClick={handleStartClick}
  onKeyDown={(e) => handleKeyDown(e, isRunning, handleStartClick)}
  // ... rest of props
>
  Start
</button>

<button
  onClick={handleStopClick}
  onKeyDown={(e) => handleKeyDown(e, !isRunning, handleStopClick)}
  // ... rest of props
>
  Stop
</button>

<button
  onClick={handleLapClick}
  onKeyDown={(e) => handleKeyDown(e, !isRunning, handleLapClick)}
  // ... rest of props
>
  Lap
</button>

<button
  onClick={handleResetClick}
  onKeyDown={(e) => handleKeyDown(e, false, handleResetClick)}
  // ... rest of props
>
  Reset
</button>
```

**Verification**:
- ✅ `npm run test -- --run tests/components/StopwatchControls.test.tsx`
- ✅ Both failing keyboard tests pass
- ✅ `npm run lint` passes (no new violations)

---

### Fix 1.4: Un-skip Auto-Dismiss Tests in ErrorBanner
**Priority**: 🟠 P1 - HIGH  
**Time**: 30 minutes  
**File**: `apps/stopwatch/ui/tests/components/ErrorBanner.test.tsx`

**Current State**: 7 tests are skipped (.skip) for auto-dismiss functionality

**Tests to Un-skip**:
1. Line 98: `it.skip('should auto-dismiss after default timeout'...)`
2. Line 122: `it.skip('should auto-dismiss after custom timeout'...)`
3. Line 167: `it.skip('should reset auto-dismiss timer when error message changes'...)`
4. Line 210: `it.skip('should clear timeout when error is dismissed'...)`
5. Line 256: `it.skip('should call onClearError when dismiss button clicked'...)`
6. Line 276: `it.skip('should support keyboard dismissal with Escape key'...)`

**Why They Were Skipped**: Likely timing/flakiness issues with fake timers

**Fix Approach**:
1. Un-skip tests one at a time
2. Increase timeouts where needed
3. Ensure proper `act()` wrapping for timer advancement

**Line-by-Line Changes**:

**Line 98** - Default timeout test:
```typescript
// OLD
it.skip('should auto-dismiss after default timeout (5000ms)', async () => {

// NEW  
it('should auto-dismiss after default timeout (5000ms)', async () => {
```

**Line 122** - Custom timeout test:
```typescript
// OLD
it.skip('should auto-dismiss after custom timeout', async () => {

// NEW
it('should auto-dismiss after custom timeout', async () => {
```

**Line 167** - Reset timer test:
```typescript
// OLD
it.skip('should reset auto-dismiss timer when error message changes', async () => {

// NEW (increase timeout)
it('should reset auto-dismiss timer when error message changes', async () => {
  // ... existing test code but wrap all timer advancement in act()
}, 10000); // Add 10s timeout
```

**Line 210** - Clear timeout test:
```typescript
// OLD
it.skip('should clear timeout when error is dismissed', async () => {

// NEW
it('should clear timeout when error is dismissed', async () => {
```

**Line 256** - Dismiss button click:
```typescript
// OLD
it.skip('should call onClearError when dismiss button clicked', async () => {

// NEW
it('should call onClearError when dismiss button clicked', async () => {
```

**Line 276** - Escape key support:
```typescript
// OLD
it.skip('should support keyboard dismissal with Escape key', async () => {

// NEW
it('should support keyboard dismissal with Escape key', async () => {
```

**Verification**:
- ✅ `npm run test -- --run tests/components/ErrorBanner.test.tsx`
- ✅ All 7 previously skipped tests now pass
- ✅ No timing-related flakes (run 3-5 times to verify)

---

### TIER 1 Verification Checklist
- [ ] Clear cache and rebuild: `rm -r node_modules\.vite dist`
- [ ] Fix 1.1: useStopwatch.test.ts parses without errors
- [ ] Fix 1.2: All test IDs updated (`stopwatch-display`)
- [ ] Fix 1.3: Keyboard handlers check disabled state
- [ ] Fix 1.4: 7 auto-dismiss tests un-skipped and passing
- [ ] Run: `npm run test -- --run` → All tests should pass or only minor issues
- [ ] Run: `npm run lint` → 0 errors, warnings acceptable
- [ ] Run: `npm run build` → Success, no errors

**Expected After TIER 1**: ~150+ tests passing, 18 tests fixed

---

## TIER 2: ENHANCEMENT FIXES (2 hours) 🎯

### Enhancement 1: Add Inline Error Messages Next to Buttons
**Priority**: 🟠 P1 - HIGH  
**Time**: 2 hours  
**Benefit**: Better UX - users see error messages contextually near the problematic button

**Current Behavior**:
- User clicks Lap when stopwatch not running
- Error appears in ErrorBanner at TOP of page
- User must look away from button to see error

**Desired Behavior** (from spec):
- Error appears **near Lap button**: "Cannot lap before starting"
- Error appears **near Stop button**: "Stopwatch is already stopped"

**Implementation Steps**:

1. **Update StopwatchControls to accept error-specific messages**:

File: `apps/stopwatch/ui/src/components/StopwatchControls.tsx`

```typescript
export interface StopwatchControlsProps {
  // ... existing props
  lapErrorMessage?: string;   // Error message specific to Lap button
  stopErrorMessage?: string;  // Error message specific to Stop button
  onClearLapError?: () => void;
  onClearStopError?: () => void;
}

export const StopwatchControls: React.FC<StopwatchControlsProps> = ({
  // ... existing destructuring
  lapErrorMessage,
  stopErrorMessage,
  onClearLapError,
  onClearStopError,
}) => {
  // ... existing code
};
```

2. **Update Stopwatch.tsx to extract button-specific errors**:

File: `apps/stopwatch/ui/src/components/Stopwatch.tsx`

```typescript
const [lapError, setLapError] = useState<string | null>(null);
const [stopError, setStopError] = useState<string | null>(null);

const handleLap = () => {
  lap();
  // Extract lap-specific error from status
  if (status.hasError && status.errorMessage?.includes('Cannot lap')) {
    setLapError(status.errorMessage);
    setTimeout(() => setLapError(null), 5000);
  }
};

const handleStop = () => {
  stop();
  // Extract stop-specific error from status
  if (status.hasError && status.errorMessage?.includes('not running')) {
    setStopError(status.errorMessage);
    setTimeout(() => setStopError(null), 5000);
  }
};

return (
  <StopwatchControls
    // ... existing props
    lapErrorMessage={lapError}
    stopErrorMessage={stopError}
    onClearLapError={() => setLapError(null)}
    onClearStopError={() => setStopError(null)}
  />
);
```

3. **Add error message display in StopwatchControls**:

Display small error tooltip/text under each button:

```typescript
// Under Lap Button
{lapErrorMessage && (
  <div
    role="alert"
    aria-live="polite"
    style={{
      fontSize: '12px',
      color: '#d32f2f',
      marginTop: '4px',
      minWidth: '150px',
    }}
  >
    {lapErrorMessage}
  </div>
)}

// Under Stop Button
{stopErrorMessage && (
  <div
    role="alert"
    aria-live="polite"
    style={{
      fontSize: '12px',
      color: '#d32f2f',
      marginTop: '4px',
      minWidth: '150px',
    }}
  >
    {stopErrorMessage}
  </div>
)}
```

**Testing**:
- ✅ Click Lap when idle → Error shows "Cannot lap before starting" below Lap button
- ✅ Start → Stop → Click Stop again → Error shows near Stop button
- ✅ Fix condition (Start for lap, Start for stop) → Error disappears

---

### Enhancement 2: Add Race Condition Test (T047b)
**Priority**: 🟠 P1 - MEDIUM  
**Time**: 1 hour  
**Purpose**: Verify rapid concurrent operations don't cause bugs

**File**: `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts`

**Add New Test Section** (after T047 tests, around line 1430):

```typescript
describe('T047b: Race conditions - rapid concurrent operations', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should handle rapid Lap + Stop without state corruption', () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(100);
    });

    // Simulate rapid clicks (Lap, Lap, Lap, Stop in quick succession)
    act(() => {
      result.current.lap();
      result.current.lap();
      result.current.lap();
      result.current.stop();
    });

    // Verify state integrity
    expect(result.current.state.mode).toBe('stopped');
    expect(result.current.state.laps.length).toBe(3);
    expect(result.current.state.elapsedMs).toBeGreaterThan(0);
    expect(result.current.state.hasError).toBe(false);
  });

  it('should handle Start-Stop-Start cycles', () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(100);
      result.current.stop();
      vi.advanceTimersByTime(50);
      result.current.start();
      vi.advanceTimersByTime(100);
    });

    expect(result.current.state.mode).toBe('running');
    expect(result.current.state.elapsedMs).toBeGreaterThan(100);
    expect(result.current.state.hasError).toBe(false);
  });

  it('should handle repeated lap before start errors', () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.lap();
      result.current.lap();
      result.current.lap();
    });

    expect(result.current.state.hasError).toBe(true);
    expect(result.current.state.laps.length).toBe(0);
  });

  it('should recover from race condition: lap + stop + lap', () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(100);
    });

    // Rapid: Lap, Stop, Lap (Lap after stop should error)
    act(() => {
      result.current.lap();
      result.current.stop();
      result.current.lap();
    });

    expect(result.current.state.mode).toBe('stopped');
    expect(result.current.state.laps.length).toBe(1); // Only first lap recorded
    expect(result.current.state.hasError).toBe(true); // Error from second lap
  });

  it('should handle maximum concurrent operations', () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(100);
    });

    // Simulate 100 rapid lap clicks
    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.lap();
      }
    });

    expect(result.current.state.laps.length).toBe(100);
    expect(result.current.state.hasError).toBe(false);
    expect(result.current.state.mode).toBe('running');
  });
});
```

**Verification**:
- ✅ `npm run test -- --run tests/hooks/useStopwatch.test.ts`
- ✅ All 5 new race condition tests pass
- ✅ No state corruption under stress

---

### Enhancement 3: Validate Error Message Wording
**Priority**: 🟡 P2 - MEDIUM  
**Time**: 30 minutes  
**Purpose**: Ensure error messages match specification exactly

**Spec Requirements** (from spec.md):
1. Lap error: "Cannot lap before starting the stopwatch"
2. Stop error: "Stopwatch is already stopped"

**Current Implementation Check**:

File: `apps/stopwatch/ui/src/utils/validation.ts`

Check error type to message mapping:
```typescript
export const ErrorMessages: Record<StopwatchErrorType, string> = {
  [StopwatchErrorType.CannotLapWhileStopped]: 'Cannot lap before starting the stopwatch',
  [StopwatchErrorType.NotRunning]: 'Stopwatch is not running',  // ⚠️ May need update
  [StopwatchErrorType.AlreadyRunning]: 'Stopwatch is already running',
  [StopwatchErrorType.InvalidTime]: 'Invalid time value',
  [StopwatchErrorType.Unknown]: 'An unknown error occurred',
};
```

**Action Items**:
- [ ] Verify "Cannot lap..." message exactly matches spec
- [ ] Change "Stopwatch is not running" → "Stopwatch is already stopped" if needed
- [ ] Create test to verify exact wording

**Add Test** (in `apps/stopwatch/ui/tests/utils/validation.test.ts`):
```typescript
describe('error message wording (specification compliance)', () => {
  it('should display "Cannot lap before starting the stopwatch" when lapping before start', () => {
    const error = validateLap('idle');
    expect(error).toBe(StopwatchErrorType.CannotLapWhileStopped);
    
    const message = ErrorMessages[error];
    expect(message).toBe('Cannot lap before starting the stopwatch');
  });

  it('should display "Stopwatch is already stopped" when stopping twice', () => {
    const error = validateStop('stopped');
    expect(error).toBe(StopwatchErrorType.NotRunning);
    
    const message = ErrorMessages[error];
    expect(message).toBe('Stopwatch is already stopped');
  });
});
```

---

### TIER 2 Verification Checklist
- [ ] Enhancement 1: Inline error messages display correctly
  - [ ] Click Lap when idle → Error below Lap button
  - [ ] Click Stop when stopped → Error below Stop button
- [ ] Enhancement 2: Race condition tests all pass
  - [ ] 5 new tests in useStopwatch.test.ts passing
- [ ] Enhancement 3: Error message wording verified
  - [ ] Messages match spec exactly
  - [ ] New test verifies wording
- [ ] Run: `npm run test -- --run` → All tests passing
- [ ] Run: `npm run lint` → 0 errors

**Expected After TIER 2**: Enhanced UX, verified spec compliance, race condition protection

---

## TIER 3: VALIDATION & DOCUMENTATION (1 hour) 📋

### Validation 1: Full Test Suite Pass
**Steps**:
```powershell
cd C:\Users\nsimb\Projects\training-john\training-john\apps\stopwatch\ui

# Run all tests
npm run test -- --run

# Check for passing/failing
# Expected: All tests passing or only acceptable skips
```

**Expected Output**:
```
Test Files  8 passed (8)
     Tests  175+ passed (175+)
   Start at  HH:MM:SS
   Duration  ~2 minutes
```

---

### Validation 2: Build & Lint Success
**Steps**:
```powershell
# Check for linting errors
npm run lint

# Build for production
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Run coverage report
npm run test:coverage
```

**Expected Results**:
- ✅ 0 linting errors
- ✅ Build succeeds
- ✅ 0 TypeScript errors
- ✅ Coverage ≥50%

---

### Validation 3: Manual Testing
**Steps**:
1. Start dev server: `npm run dev`
2. Open browser: `http://localhost:5173`
3. Test error scenarios:
   - [ ] Click Lap when idle → Error appears
   - [ ] Click Stop when already stopped → Error appears
   - [ ] Start button works after error
   - [ ] Errors disappear on state fix
   - [ ] Error disappears after ~5 seconds

---

### Documentation 1: Update PHASE6 Status
**File**: `specs/004-stopwatch-temp-ui/tasks.md`

Update PHASE 6 section:
```markdown
## Phase 6: User Story 4 - Stopwatch: Handle Invalid State Transitions (Priority: P1)

**Goal**: Prevent invalid operations (lap before start, stop twice) and display inline errors

**Status**: ✅ COMPLETE - All 10 tasks implemented and tested

### Tests for US4 (T044-T047b)
- [x] T044: Component test for "Cannot lap before starting" error ✅ COMPLETE
- [x] T045: Component test for "Stopwatch is already stopped" error ✅ COMPLETE
- [x] T046: Component test for error auto-dismissal on state fix ✅ COMPLETE
- [x] T047: Hook test for validation in useStopwatch ✅ COMPLETE
- [x] T047b: Integration test for race conditions ✅ COMPLETE

### Implementation for US4 (T048-T053)
- [x] T048: Validation to Lap button ✅ COMPLETE
- [x] T049: Validation to Stop button ✅ COMPLETE
- [x] T050: Error state management in useStopwatch ✅ COMPLETE
- [x] T051: Display error messages using ErrorBanner ✅ COMPLETE
- [x] T052: Keyboard accessibility to error messages ✅ COMPLETE
- [x] T053: Stopwatch container component integration ✅ COMPLETE

**Test Results**: 175+ tests passing | 0 failing

**Checkpoint**: Stopwatch UI complete with full error handling and inline messages
```

---

### Documentation 2: Create PHASE6 Completion Summary
**File**: `specs/004-stopwatch-temp-ui/PHASE6_COMPLETION_SUMMARY.md`

```markdown
# PHASE 6 Completion Summary

## Overview
PHASE 6 (T044-T053) implements invalid operation prevention and inline error handling for the Stopwatch application.

## Acceptance Criteria Met
✅ Prevent lap before start - Users cannot record laps when stopwatch is idle
✅ Prevent stop twice - Users cannot stop when stopwatch is already stopped
✅ Display inline errors - Error messages appear contextually near problematic buttons
✅ Auto-dismiss errors - Error messages disappear when user fixes the invalid state
✅ Keyboard accessibility - Errors announced to screen readers, keyboard navigation works
✅ Race condition protection - Rapid concurrent operations handled safely

## Test Coverage
- **Unit Tests**: 50+ tests covering all validation scenarios
- **Integration Tests**: 15+ tests covering component workflows
- **Accessibility Tests**: 10+ tests for ARIA labels and keyboard navigation
- **Edge Cases**: 10+ tests for race conditions and extreme scenarios

## Key Implementation Details

### Error Types
- `LAP_NOT_RUNNING`: Cannot lap while stopwatch is idle or stopped
- `NOT_RUNNING`: Cannot stop when stopwatch is not running
- `ALREADY_RUNNING`: Cannot start when already running

### Error Flow
1. User attempts invalid operation (e.g., lap before start)
2. Validation function returns error type
3. Error state updated with message and timestamp
4. ErrorBanner displays message
5. Inline error appears near button
6. Error auto-dismisses after 5 seconds OR when user fixes state

### Button Validation
- **Start Button**: Disabled when `isRunning === true`
- **Lap Button**: Disabled when `isRunning === false` (idle or stopped)
- **Stop Button**: Disabled when `isRunning === false`
- **Reset Button**: Always enabled

## Files Modified
- `src/components/StopwatchControls.tsx` - Added keyboard handler validation
- `src/components/Stopwatch.tsx` - Added inline error tracking (enhanced)
- `tests/components/StopwatchControls.test.tsx` - All validation tests passing
- `tests/components/ErrorBanner.test.tsx` - Auto-dismiss tests enabled
- `tests/components/Stopwatch.test.tsx` - Integration tests passing
- `tests/hooks/useStopwatch.test.ts` - Hook validation tests passing

## Quality Metrics
- **Test Pass Rate**: 100% (175+ tests)
- **Code Coverage**: ≥50% (target met)
- **Linting**: 0 errors, 0 warnings
- **Accessibility**: WCAG AA compliant
- **Build**: Production ready

## Recommendations for Future Phases
1. Add analytics to track which errors occur most frequently
2. Consider localizing error messages for internationalization
3. Add error recovery suggestions (e.g., "Click Start to begin...")
4. Implement error state persistence for debugging
5. Add visual animation for error transitions

## Sign-Off
✅ All PHASE 6 tasks complete and tested  
✅ Ready for PHASE 7 (Temperature Converter Implementation)
```

---

## IMPLEMENTATION CHECKLIST

### Pre-Implementation
- [ ] Read this entire plan
- [ ] Back up current code (git branch)
- [ ] Clear build cache: `rm -r node_modules\.vite dist`

### TIER 1 (Critical Fixes) - 1.5 hours
- [ ] Fix 1.1: Resolve useStopwatch.test.ts parse error (15 min)
- [ ] Fix 1.2: Correct test ID mismatch (10 min)
- [ ] Fix 1.3: Add disabled check to keyboard handlers (20 min)
- [ ] Fix 1.4: Un-skip auto-dismiss tests (30 min)
- [ ] Tier 1 verification: `npm run test -- --run` (15 min)

### TIER 2 (Enhancements) - 2 hours
- [ ] Enhancement 1: Add inline error messages (60 min)
- [ ] Enhancement 2: Add race condition tests (60 min)
- [ ] Enhancement 3: Validate error message wording (30 min)
- [ ] Tier 2 verification (10 min)

### TIER 3 (Validation) - 1 hour
- [ ] Validation 1: Full test suite pass (30 min)
- [ ] Validation 2: Build, lint, coverage (15 min)
- [ ] Validation 3: Manual testing (15 min)
- [ ] Documentation: Update status docs (10 min)

### Post-Implementation
- [ ] Commit changes with clear message
- [ ] Push to remote
- [ ] Create PR with detailed description
- [ ] Request code review
- [ ] Merge to main branch

---

## Success Criteria

### Immediate (After TIER 1)
- ✅ All 175+ tests passing
- ✅ 0 linting errors
- ✅ Build succeeds
- ✅ No parse errors

### Complete (After TIER 1 + TIER 2)
- ✅ All PHASE 6 tasks implemented
- ✅ Inline error messages displayed
- ✅ Race conditions handled
- ✅ Error messages match spec
- ✅ Keyboard accessibility verified

### Production Ready (After TIER 3)
- ✅ Manual testing successful
- ✅ Coverage reports generated
- ✅ Documentation updated
- ✅ Ready for PHASE 7

---

## Estimated Timeline

| Tier | Activity | Duration | Status |
|------|----------|----------|--------|
| 1.1 | Parse error fix | 15 min | 🔴 TODO |
| 1.2 | Test ID fix | 10 min | 🔴 TODO |
| 1.3 | Keyboard handler fix | 20 min | 🔴 TODO |
| 1.4 | Un-skip tests | 30 min | 🔴 TODO |
| **Tier 1 Subtotal** | | **75 min** | 🔴 TODO |
| 2.1 | Inline errors | 60 min | 🔴 TODO |
| 2.2 | Race condition tests | 60 min | 🔴 TODO |
| 2.3 | Message validation | 30 min | 🔴 TODO |
| **Tier 2 Subtotal** | | **150 min** | 🔴 TODO |
| 3 | Validation & docs | 60 min | 🔴 TODO |
| **TOTAL** | **All Tiers** | **~5 hours** | 🔴 TODO |

---

## Questions & Troubleshooting

**Q: Tests still timing out after fixes?**
A: Increase test timeout: `it('test name', () => { ... }, 10000);`

**Q: Build still failing?**
A: Clear cache: `rm -r node_modules\.vite dist && npm install && npm run build`

**Q: Keyboard handler fix causing other issues?**
A: Verify disabled prop is passed correctly to all buttons

**Q: Auto-dismiss tests still flaky?**
A: Ensure all timer calls wrapped in `act()` and use `vi.runOnlyPendingTimers()`

---

## Next Steps After PHASE 6

Once PHASE 6 is complete:
1. Move to PHASE 7: Temperature Converter (US5 - C→F Conversion)
2. Apply lessons learned from Stopwatch to Temp UI
3. Ensure same error handling patterns in Temp UI
4. Target PHASE 7-11 for Temp Converter implementation
5. Plan PHASE 12 for Polish & Integration





