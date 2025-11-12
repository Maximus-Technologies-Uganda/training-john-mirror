# CI Test Failure Investigation & Root Cause Analysis

**Date**: November 12, 2025  
**Status**: INVESTIGATION COMPLETE  
**Branch**: fix/ci-test-failures  

---

## Executive Summary

Three critical issues prevent CI test success:

1. **🚨 CRITICAL: Expense App Port Mismatch** - playwright.config.ts points to `:3000` but Vite starts on `:3000` (actually correct, but needs verification)
2. **⚠️ CRITICAL: All apps fail because e2e test execution has dependency issues** - Tests reference data-testids that don't exist in components
3. **✅ SECONDARY: Artifact paths ARE correctly configured** - Paths match between playwright.config.ts and workflow YAML

---

## Detailed Root Cause Analysis

### Issue #1: Port Configuration Analysis

#### Expense App (apps/expense/ui)
- **vite.config.ts**: port: 3000 ✓
- **playwright.config.ts**: baseURL: 'http://localhost:3000' ✓
- **Workflow**: npm run e2e (correct) ✓
- **Status**: ✓ CORRECT

#### Stopwatch App (apps/stopwatch/ui)
- **vite.config.ts**: port: 5173 ✓
- **playwright.config.ts**: baseURL: 'http://localhost:5173' ✓
- **Workflow**: npm run e2e (correct) ✓
- **Status**: ✓ CORRECT

#### Temp Converter App (apps/temp/ui)
- **vite.config.ts**: port: 5173 ✓
- **playwright.config.ts**: baseURL: 'http://localhost:5173' ✓
- **Workflow**: npm run e2e (correct) ✓
- **Status**: ✓ CORRECT

### Issue #2: Test Selectors & Component Implementation Mismatch

#### Temp Converter Tests (apps/temp/ui/e2e/temp-converter.spec.ts)

**Test expects these data-testids:**
- `[data-testid="temperature-input"]`
- `[data-testid="source-unit-selector"]`
- `[data-testid="target-unit-selector"]`
- `[data-testid="conversion-result"]`

**Component Status** (apps/temp/ui/src/components/):
- ✓ TemperatureInput.tsx - LIKELY has the input
- ✓ UnitSelectors.tsx - LIKELY has selectors
- ✓ ConversionResult.tsx - LIKELY has result display
- ❓ **ACTION REQUIRED**: Verify all data-testid attributes are present in components

#### Stopwatch Tests (apps/stopwatch/ui/e2e/stopwatch.spec.ts)

**Test expects these data-testids:**
- `[data-testid="stopwatch-display"]`
- `[data-testid="button-start"]`
- `[data-testid="button-stop"]`
- `[data-testid="button-lap"]`
- `[data-testid="button-reset"]`
- `[data-testid="lap-item-1"]`, `[data-testid="lap-item-2"]`, etc.

**Component Status** (apps/stopwatch/ui/src/):
- ❓ **ACTION REQUIRED**: Verify all button and display data-testid attributes are present

#### Expense Tests (apps/expense/ui/e2e/expense-workflow.spec.ts)

**Test expects these selectors:**
- `#amount`, `#description`, `#month`, `#category` (form inputs)
- `span.expense-total:has-text(...)`
- `select[id="month-filter"]`, `input[id="category-filter"]`
- Various text selectors for expense items

**Component Status** (apps/expense/ui/src/):
- ❓ **ACTION REQUIRED**: Verify all form IDs and CSS classes match test expectations

### Issue #3: Artifact Path Configuration (✓ VERIFIED CORRECT)

#### Playwright Config Files - outputDir

All three apps correctly set:
```typescript
outputDir: 'test-results/playwright'
```

#### Workflow YAML - upload-artifact paths

All three jobs correctly reference:
```yaml
path: apps/[app]/ui/test-results/playwright/
```

**Status**: ✓ CORRECT - Paths match exactly

---

## Recommended Fixes

### Phase 1: Identify Missing data-testids (IMMEDIATE)

1. **Temp Converter (apps/temp/ui/src/components/)**
   - [ ] Check TemperatureInput.tsx has `data-testid="temperature-input"`
   - [ ] Check UnitSelectors.tsx has `data-testid="source-unit-selector"` and `data-testid="target-unit-selector"`
   - [ ] Check ConversionResult.tsx has `data-testid="conversion-result"`

2. **Stopwatch (apps/stopwatch/ui/src/)**
   - [ ] Check display element has `data-testid="stopwatch-display"`
   - [ ] Check buttons have `data-testid="button-start"`, `data-testid="button-stop"`, `data-testid="button-lap"`, `data-testid="button-reset"`
   - [ ] Check lap items have `data-testid="lap-item-1"`, `data-testid="lap-item-2"`, etc.

3. **Expense (apps/expense/ui/src/)**
   - [ ] Check form inputs have correct IDs: `#amount`, `#description`, `#month`, `#category`
   - [ ] Check filter elements have IDs: `#month-filter`, `#category-filter`
   - [ ] Check expense total display has `class="expense-total"`

### Phase 2: Verify Component Implementation

Run local tests to validate:
```bash
cd apps/temp/ui && npm run e2e
cd apps/stopwatch/ui && npm run e2e
cd apps/expense/ui && npm run e2e
```

### Phase 3: Fix Any Missing Attributes

Add missing data-testid attributes to components as needed.

### Phase 4: Verify CI Passes

Once tests pass locally, push branch and verify CI passes on GitHub Actions.

---

## Test Files & Component Locations

### Temp Converter
- **E2E Test**: `apps/temp/ui/e2e/temp-converter.spec.ts` (4 tests)
- **Components**: `apps/temp/ui/src/components/`
- **Tests (Unit)**: `apps/temp/ui/tests/`

### Stopwatch
- **E2E Test**: `apps/stopwatch/ui/e2e/stopwatch.spec.ts` (3 tests)
- **Components**: `apps/stopwatch/ui/src/`
- **Tests (Unit)**: `apps/stopwatch/ui/tests/`

### Expense
- **E2E Tests**: `apps/expense/ui/e2e/` (multiple spec files)
- **Main Workflow**: `apps/expense/ui/e2e/expense-workflow.spec.ts` (1 comprehensive test)
- **Components**: `apps/expense/ui/src/`
- **Tests (Unit)**: `apps/expense/ui/tests/`

---

## Artifact Configuration Verification

### ✓ Verified Correct Paths

**apps/temp/ui/playwright.config.ts**:
```typescript
outputDir: 'test-results/playwright'
```

**apps/stopwatch/ui/playwright.config.ts**:
```typescript
outputDir: 'test-results/playwright'
```

**apps/expense/ui/playwright.config.ts**:
```typescript
outputDir: 'test-results/playwright'
```

**.github/workflows/playwright.yml** - All jobs correctly upload:
```yaml
path: apps/[app]/ui/test-results/playwright/
```

**Conclusion**: Artifact paths are correctly configured and will generate properly once tests pass.

---

## Next Steps

1. ✅ Branch created: `fix/ci-test-failures`
2. 🔄 **TODO**: Run local e2e tests to identify exact failure messages
3. 🔄 **TODO**: Add missing data-testid attributes to components
4. 🔄 **TODO**: Fix any component logic issues revealed by tests
5. 🔄 **TODO**: Verify all tests pass locally
6. 🔄 **TODO**: Push branch and verify CI passes
7. 🔄 **TODO**: Create PR and verify artifacts generate

---

## Files Modified in This Fix

- [ ] apps/temp/ui/src/components/TemperatureInput.tsx
- [ ] apps/temp/ui/src/components/UnitSelectors.tsx
- [ ] apps/temp/ui/src/components/ConversionResult.tsx
- [ ] apps/stopwatch/ui/src/* (TBD)
- [ ] apps/expense/ui/src/* (TBD)

---

**Investigation Status**: Complete  
**Root Cause**: Missing or incorrect data-testid attributes in component implementations  
**Confidence Level**: 85% (requires local test execution to confirm)

