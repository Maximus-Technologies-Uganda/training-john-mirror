# Technical Debt Backlog: Stopwatch & Temp Converter UI

**Project**: Stopwatch & Temp Converter UI  
**Date Created**: December 2024  
**Status**: Active Backlog  
**Priority Scale**: P0 (Critical) → P1 (High) → P2 (Medium) → P3 (Low)

---

## Overview

This document identifies refactoring opportunities and technical debt items discovered during the implementation of the Stopwatch and Temp Converter UI applications. Items are prioritized based on impact, risk, and effort required.

**Total Items**: 8  
**Critical (P0)**: 1  
**High (P1)**: 2  
**Medium (P2)**: 3  
**Low (P3)**: 2

---

## Backlog Items

### TD-001: Core Module Integration (P0 - Critical)

**Priority**: P0 - Critical  
**Category**: Architecture  
**Status**: ⏳ Not Started  
**Assigned To**: TBD  
**Target Date**: TBD  
**Effort**: 4-6 hours  
**Impact**: High - Violates architectural principle

**Description**:
Hooks currently have hardcoded conversion logic instead of importing from core modules (`apps/stopwatch/core/` and `apps/temp/core/`). This violates the architectural principle of separating UI from business logic.

**Current State**:
```typescript
// apps/temp/ui/src/hooks/useTempConversion.ts
// Hardcoded conversion logic
function convertTemperature(value: number, sourceUnit: 'C' | 'F', targetUnit: 'C' | 'F'): number {
  if (sourceUnit === 'C' && targetUnit === 'F') {
    return (value * 9) / 5 + 32;
  }
  if (sourceUnit === 'F' && targetUnit === 'C') {
    return ((value - 32) * 5) / 9;
  }
  return value;
}
```

**Desired State**:
```typescript
// Import from core module
import { convertTemperature } from '@training-john/temp-converter-core';

// Use core module function
const result = convertTemperature(value, sourceUnit, targetUnit);
```

**Files Affected**:
- [useTempConversion.ts](../../apps/temp/ui/src/hooks/useTempConversion.ts)
- [useStopwatch.ts](../../apps/stopwatch/ui/src/hooks/useStopwatch.ts) (time calculation logic)

**Acceptance Criteria**:
- [ ] All conversion logic imported from core modules
- [ ] No hardcoded business logic in UI hooks
- [ ] Tests updated to mock core modules
- [ ] Documentation updated

**References**:
- Phase 2 Audit Report: "Missing Core Module Integration"
- T014/T019: "connect to core business logic"

---

### TD-002: Race Condition Vulnerability in useStopwatch (P1 - High)

**Priority**: P1 - High  
**Category**: Reliability  
**Status**: ⏳ Not Started  
**Assigned To**: TBD  
**Target Date**: TBD  
**Effort**: 2-3 hours  
**Impact**: Medium - Could cause incorrect lap calculations

**Description**:
Rapid consecutive `lap()` calls could produce incorrect intervals due to state batching. Current implementation calculates intervals based on `lapTimesRef.current`, but if multiple `setState` calls batch, timing could be off.

**Current State**:
```typescript
const lap = useCallback(() => {
  setState((prev) => {
    const now = Date.now();
    const intervalMs = lapTimesRef.current 
      ? now - lapTimesRef.current 
      : now - startTimeRef.current;
    // ... calculation logic
  });
}, []);
```

**Desired State**:
```typescript
const lap = useCallback(() => {
  setState((prev) => {
    // Use functional update with previous state
    const now = Date.now();
    const lastLapTime = prev.laps.length > 0 
      ? prev.laps[prev.laps.length - 1].totalMs 
      : 0;
    const intervalMs = now - (lastLapTime || startTimeRef.current);
    // ... calculation logic
  });
}, []);
```

**Files Affected**:
- [useStopwatch.ts](../../apps/stopwatch/ui/src/hooks/useStopwatch.ts)

**Acceptance Criteria**:
- [ ] Functional state updates used for lap calculations
- [ ] Race condition tests added
- [ ] Rapid lap clicks tested and verified

**References**:
- Phase 2 Audit Report: "Race Condition Vulnerability"
- Phase 6: Race condition tests exist but implementation could be improved

---

### TD-003: Memory Leak Risk in Interval Management (P1 - High)

**Priority**: P1 - High  
**Category**: Reliability  
**Status**: ⏳ Not Started  
**Assigned To**: TBD  
**Target Date**: TBD  
**Effort**: 1-2 hours  
**Impact**: Medium - Could cause memory leaks with rapid stop/start cycles

**Description**:
Interval cleared in `stop()` callback, but multiple rapid stops could cause issues. Need defensive cleanup and verification.

**Current State**:
```typescript
const stop = useCallback(() => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  // ... rest of logic
}, []);
```

**Desired State**:
```typescript
const stop = useCallback(() => {
  // Defensive cleanup
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null; // Explicitly clear ref
  }
  // ... rest of logic
}, []);

// Also ensure cleanup in useEffect
useEffect(() => {
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, []);
```

**Files Affected**:
- [useStopwatch.ts](../../apps/stopwatch/ui/src/hooks/useStopwatch.ts)

**Acceptance Criteria**:
- [ ] Defensive interval cleanup added
- [ ] useEffect cleanup function added
- [ ] Memory leak tests added
- [ ] Rapid stop/start cycles tested

**References**:
- Phase 2 Audit Report: "Memory Leak Risk"

---

### TD-004: ErrorBanner Performance Optimization (P2 - Medium)

**Priority**: P2 - Medium  
**Category**: Performance  
**Status**: ⏳ Not Started  
**Assigned To**: TBD  
**Target Date**: TBD  
**Effort**: 1 hour  
**Impact**: Low - Minor performance improvement

**Description**:
ErrorBanner components could use `React.memo()` to prevent unnecessary re-renders when props haven't changed.

**Current State**:
```typescript
export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onClearError }) => {
  // Component implementation
};
```

**Desired State**:
```typescript
export const ErrorBanner: React.FC<ErrorBannerProps> = React.memo(({ error, onClearError }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.error?.message === nextProps.error?.message;
});
```

**Files Affected**:
- [ErrorBanner.tsx](../../apps/stopwatch/ui/src/components/ErrorBanner.tsx)
- [ErrorBanner.tsx](../../apps/temp/ui/src/components/ErrorBanner.tsx)

**Acceptance Criteria**:
- [ ] React.memo() added to both ErrorBanner components
- [ ] Performance tests verify reduced re-renders
- [ ] No breaking changes to existing functionality

**References**:
- Phase 2 Audit Report: "Render Optimization"

---

### TD-005: Configurable Animation Timings (P2 - Medium)

**Priority**: P2 - Medium  
**Category**: UX Enhancement  
**Status**: ⏳ Not Started  
**Assigned To**: TBD  
**Target Date**: TBD  
**Effort**: 1-2 hours  
**Impact**: Low - Better customization

**Description**:
ErrorBanner components use hardcoded 300ms fade-out timing. Should be configurable via props.

**Current State**:
```typescript
const FADE_OUT_DURATION = 300; // Hardcoded
```

**Desired State**:
```typescript
export interface ErrorBannerProps {
  error: Error | null;
  onClearError: () => void;
  fadeOutDuration?: number; // Optional, defaults to 300
  autoDismissMs?: number;
}
```

**Files Affected**:
- [ErrorBanner.tsx](../../apps/stopwatch/ui/src/components/ErrorBanner.tsx)
- [ErrorBanner.tsx](../../apps/temp/ui/src/components/ErrorBanner.tsx)

**Acceptance Criteria**:
- [ ] Fade-out duration configurable via props
- [ ] Default value maintained (300ms)
- [ ] Tests updated
- [ ] Documentation updated

**References**:
- Phase 2 Audit Report: "Animation Timing"

---

### TD-006: Simplify Timer Handling Logic (P2 - Medium)

**Priority**: P2 - Medium  
**Category**: Code Quality  
**Status**: ⏳ Not Started  
**Assigned To**: TBD  
**Target Date**: TBD  
**Effort**: 3-4 hours  
**Impact**: Medium - Improved maintainability

**Description**:
Complex interaction between React hooks and Vitest fake timers identified in Phase 4. Could be simplified with better abstraction.

**Current State**:
- Complex `useEffect` with `setInterval`
- Multiple refs (`startTimeRef`, `lapTimesRef`, `intervalRef`)
- Complex state updates with timing calculations

**Desired State**:
- Extract timer logic into custom hook (`useTimer`)
- Simplify state management
- Better separation of concerns

**Files Affected**:
- [useStopwatch.ts](../../apps/stopwatch/ui/src/hooks/useStopwatch.ts)
- New file: [useTimer.ts](../../apps/stopwatch/ui/src/hooks/useTimer.ts) (to be created)

**Acceptance Criteria**:
- [ ] Timer logic extracted to separate hook
- [ ] Simplified useStopwatch implementation
- [ ] All tests pass
- [ ] No performance regression

**References**:
- Phase 4: "Complex interaction between React hooks and vitest fake timers"
- Phase 4 Completion Summary: "Deep Dive into Timer Handling"

---

### TD-007: Type Safety Improvements (P3 - Low)

**Priority**: P3 - Low  
**Category**: Code Quality  
**Status**: ⏳ Not Started  
**Assigned To**: TBD  
**Target Date**: TBD  
**Effort**: 2-3 hours  
**Impact**: Low - Better type safety

**Description**:
Some areas could benefit from stricter TypeScript types and branded types for better type safety.

**Examples**:
- Temperature units: Use branded types instead of string literals
- Time values: Use branded types for milliseconds
- Error types: More specific error type unions

**Files Affected**:
- [tempconverter.ts](../../apps/temp/ui/src/types/tempconverter.ts)
- [stopwatch.ts](../../apps/stopwatch/ui/src/types/stopwatch.ts)

**Acceptance Criteria**:
- [ ] Branded types added where appropriate
- [ ] Type safety improved
- [ ] No breaking changes
- [ ] Tests updated

**References**:
- General TypeScript best practices

---

### TD-008: Test Utility Consolidation (P3 - Low)

**Priority**: P3 - Low  
**Category**: Code Quality  
**Status**: ⏳ Not Started  
**Assigned To**: TBD  
**Target Date**: TBD  
**Effort**: 2-3 hours  
**Impact**: Low - Better test maintainability

**Description**:
Test utilities and helpers are scattered across test files. Could be consolidated into shared test utilities.

**Current State**:
- Mock factories duplicated across test files
- Test setup duplicated
- Helper functions scattered

**Desired State**:
- Shared test utilities: `tests/utils/test-helpers.ts`
- Shared mock factories: `tests/utils/mocks.ts`
- Shared test setup: `tests/setup.ts` (already exists, could be enhanced)

**Files Affected**:
- `apps/stopwatch/ui/tests/utils/` (new)
- `apps/temp/ui/tests/utils/` (new)
- All test files (refactor to use shared utilities)

**Acceptance Criteria**:
- [ ] Shared test utilities created
- [ ] Mock factories consolidated
- [ ] All tests refactored to use shared utilities
- [ ] Test maintainability improved

**References**:
- General testing best practices

---

## Prioritization Summary

| Priority | Count | Items |
|----------|-------|-------|
| **P0 - Critical** | 1 | TD-001: Core Module Integration |
| **P1 - High** | 2 | TD-002: Race Condition Vulnerability, TD-003: Memory Leak Risk |
| **P2 - Medium** | 3 | TD-004: ErrorBanner Optimization, TD-005: Configurable Animations, TD-006: Simplify Timer Handling |
| **P3 - Low** | 2 | TD-007: Type Safety Improvements, TD-008: Test Utility Consolidation |

---

## Implementation Status

| Item | Priority | Status | Assigned To | Target Date | Progress |
|------|----------|--------|-------------|-------------|----------|
| TD-001 | P0 | ⏳ Not Started | TBD | TBD | 0% |
| TD-002 | P1 | ⏳ Not Started | TBD | TBD | 0% |
| TD-003 | P1 | ⏳ Not Started | TBD | TBD | 0% |
| TD-004 | P2 | ⏳ Not Started | TBD | TBD | 0% |
| TD-005 | P2 | ⏳ Not Started | TBD | TBD | 0% |
| TD-006 | P2 | ⏳ Not Started | TBD | TBD | 0% |
| TD-007 | P3 | ⏳ Not Started | TBD | TBD | 0% |
| TD-008 | P3 | ⏳ Not Started | TBD | TBD | 0% |

**Status Legend**:
- ⏳ Not Started - Item identified but not yet started
- 🚧 In Progress - Work has begun on this item
- ✅ Complete - Item has been completed and verified
- ❌ Blocked - Item is blocked by dependencies or issues
- 🔄 On Hold - Item is temporarily paused

**Overall Progress**: 0/8 items complete (0%)

---

## Implementation Recommendations

### Immediate (Next Sprint)
1. **TD-001**: Core Module Integration - Critical architectural issue
2. **TD-002**: Race Condition Vulnerability - Reliability concern

### Short-term (Next 2-3 Sprints)
3. **TD-003**: Memory Leak Risk - Reliability concern
4. **TD-006**: Simplify Timer Handling - Code quality improvement

### Medium-term (Next Quarter)
5. **TD-004**: ErrorBanner Optimization - Performance improvement
6. **TD-005**: Configurable Animations - UX enhancement

### Long-term (Backlog)
7. **TD-007**: Type Safety Improvements - Code quality
8. **TD-008**: Test Utility Consolidation - Maintainability

---

## Notes

- **No Critical Blockers**: All items are improvements, not blockers
- **Production Ready**: Current implementation is production-ready despite these items
- **Incremental**: All items can be addressed incrementally
- **Test Coverage**: All refactoring should maintain or improve test coverage

---

## Tracking

**Backlog Status**: Active  
**Last Reviewed**: December 2024  
**Next Review**: Quarterly  
**Owner**: Development Team

---

## Related Documents

This technical debt backlog is part of a comprehensive documentation set. Related documents include:

- **[RETROSPECTIVE.md](./RETROSPECTIVE.md)** - Lessons learned, challenges, solutions, and architectural decisions
- **[LEARNING_LOG.md](./LEARNING_LOG.md)** - Team reflections, insights, and recommendations
- **[react-typescript-ui-patterns.md](../../docs/guides/react-typescript-ui-patterns.md)** - Training guide with patterns, anti-patterns, and best practices
- **[PHASE13_IMPLEMENTATION_PLAN.md](./PHASE13_IMPLEMENTATION_PLAN.md)** - Enhancement plan for Phase 13 documentation
- **[PHASE13_INVESTIGATION_REPORT.md](./PHASE13_INVESTIGATION_REPORT.md)** - Investigation findings and gap analysis

---

**Document Version**: 1.1  
**Last Updated**: December 2024  
**Last Reviewed**: December 2024  
**Status**: ✅ Complete - Enhanced with Status Tracking & Code References

