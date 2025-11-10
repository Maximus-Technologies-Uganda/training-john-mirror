# React TypeScript UI Development: Patterns, Anti-Patterns & Best Practices

**Project**: Stopwatch & Temp Converter UI  
**Source**: Retrospective from 13-phase implementation  
**Last Updated**: December 2024

---

## Table of Contents

1. [Best Practices](#best-practices)
2. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
3. [Testing Patterns](#testing-patterns)
4. [Architecture Patterns](#architecture-patterns)
5. [Configuration Patterns](#configuration-patterns)
6. [Accessibility Patterns](#accessibility-patterns)
7. [Error Handling Patterns](#error-handling-patterns)

---

## Best Practices

### 1. Test-Driven Development (TDD)

**Practice**: Write tests before implementation.

**Why**:
- Tests serve as living documentation
- Catches design flaws early
- Ensures testability from the start

**Example**:
```typescript
// ✅ GOOD: Test first
describe('useStopwatch', () => {
  it('should start stopwatch', () => {
    const { result } = renderHook(() => useStopwatch());
    act(() => {
      result.current.start();
    });
    expect(result.current.status.isRunning).toBe(true);
  });
});

// Then implement to pass the test
```

**Reference**: Phase 9, Phase 10 - Tests caught design flaws early  
**Source**: [useStopwatch.test.ts](../../apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts)

---

### 2. Separation of Concerns

**Practice**: Keep business logic separate from validation and UI logic.

**Why**:
- Easier to test
- Easier to maintain
- Easier to refactor

**Example**:
```typescript
// ✅ GOOD: Hook performs operation, signals error separately
const result = performConversion(value, sourceUnit, targetUnit);
if (sourceUnit === targetUnit) {
  setError('Identical units'); // UI decides whether to show
}
return result; // Always returns conversion result

// ❌ BAD: Hook blocks operation based on validation
if (sourceUnit === targetUnit) {
  setError('Identical units');
  return null; // Blocks conversion
}
```

**Reference**: Phase 10 - Hook design violation resolved 18 failing tests  
**Source**: [useTempConversion.ts](../../apps/temp/ui/src/hooks/useTempConversion.ts)

---

### 3. Configuration Separation

**Practice**: One config file, one purpose.

**Why**:
- Clear separation of concerns
- Easier to maintain
- Prevents version mismatches

**Example**:
```typescript
// ✅ GOOD: vite.config.ts - Build configuration only
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});

// ✅ GOOD: vitest.config.ts - Test configuration only
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

**Reference**: T006 - Configuration duplication resolved  
**Source**: [vitest.config.ts](../../apps/temp/ui/vitest.config.ts), [vite.config.ts](../../apps/temp/ui/vite.config.ts)

---

### 4. Version Alignment

**Practice**: Explicitly align related package versions.

**Why**:
- Prevents version mismatches
- Ensures compatibility
- Easier debugging

**Example**:
```json
// ✅ GOOD: Aligned versions
{
  "devDependencies": {
    "vitest": "^1.6.1",
    "@vitest/coverage-v8": "^1.6.1",
    "@vitest/ui": "^1.6.1",
    "@testing-library/dom": "^9.3.4"
  }
}
```

**Verification**:
```bash
npm list vitest @vitest/coverage-v8 @vitest/ui
```

**Reference**: T103/T104 - Version mismatch resolved coverage issues  
**Source**: [package.json](../../apps/stopwatch/ui/package.json), [package.json](../../apps/temp/ui/package.json)

---

### 5. Test Query Patterns

**Practice**: Use `data-testid` attributes and `getByTestId()` for reliable queries.

**Why**:
- More reliable than text-based queries
- Works with all form controls
- Less brittle to UI changes

**Example**:
```typescript
// ✅ GOOD: Reliable test queries
const selector = screen.getByTestId('source-unit-selector');
await user.selectOptions(selector, 'C');

// ❌ BAD: Doesn't work for select elements
const selector = screen.getByDisplayValue('Celsius');
```

**Reference**: Phase 10 - Fixed 3 failing tests  
**Source**: [UnitSelectors.test.tsx](../../apps/temp/ui/tests/components/UnitSelectors.test.tsx)

---

### 6. Fake Timer Setup

**Practice**: Always configure fake timers completely.

**Why**:
- Prevents test timeouts
- Ensures consistent test behavior
- Tests time-dependent code correctly

**Example**:
```typescript
// ✅ GOOD: Complete fake timer setup
beforeEach(() => {
  vi.useFakeTimers({ 
    toFake: ['Date', 'setInterval', 'clearInterval'] 
  });
  vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});
```

**Reference**: Phase 5 - Resolved 22 test timeouts  
**Source**: [Stopwatch.test.tsx](../../apps/stopwatch/ui/tests/components/Stopwatch.test.tsx)

---

### 7. Accessibility First

**Practice**: Build accessibility in from the start.

**Why**:
- Easier than retrofitting
- Better UX for all users
- Catches issues early

**Example**:
```typescript
// ✅ GOOD: Accessibility built-in
<button
  aria-label="Start stopwatch"
  onClick={handleStart}
  disabled={isRunning}
>
  Start
</button>
```

**Reference**: Phase 12 - Comprehensive accessibility tests verified all features  
**Source**: [keyboard-navigation.test.tsx](../../apps/stopwatch/ui/tests/keyboard-navigation.test.tsx), [aria-labels.test.tsx](../../apps/stopwatch/ui/tests/aria-labels.test.tsx)

---

### 8. Multiple Validation Layers

**Practice**: Validate at multiple touchpoints (on-blur, on-submit, hook-level).

**Why**:
- Better user experience
- Catches errors early
- Provides clear feedback

**Example**:
```typescript
// ✅ GOOD: Multiple validation layers
const handleBlur = () => {
  const error = validateOnBlur(inputValue, touched);
  if (error) setError(error);
};

const handleSubmit = () => {
  const error = validateOnSubmit(inputValue);
  if (error) {
    setError(error);
    return;
  }
  performConversion();
};
```

**Reference**: Phase 9 - Comprehensive validation strategy  
**Source**: [validation.ts](../../apps/temp/ui/src/utils/validation.ts), [TemperatureInput.tsx](../../apps/temp/ui/src/components/TemperatureInput.tsx)

---

## Anti-Patterns to Avoid

### 1. ❌ Mock Functions in Tests Instead of Real Imports

**Problem**: Tests define mock functions instead of importing real implementations.

**Impact**: Tests don't validate actual code, 45 test failures (Phase 9)

**Anti-Pattern**:
```typescript
// ❌ BAD: Mock function in test
const validateInput = (value: string) => {
  return value.length > 0;
};

describe('validation', () => {
  it('should validate input', () => {
    expect(validateInput('test')).toBe(true);
  });
});
```

**Correct Pattern**:
```typescript
// ✅ GOOD: Import real function
import { validateInput } from '@/utils/validation';

describe('validation', () => {
  it('should validate input', () => {
    expect(validateInput('test')).toBe(true);
  });
});
```

**Prevention**: Always verify test imports match actual source files. Use IDE auto-import.  
**Source**: [validation.test.ts](../../apps/temp/ui/tests/utils/validation.test.ts) - See Phase 9 investigation

---

### 2. ❌ Mixing Validation with Business Logic

**Problem**: Hooks block operations based on validation instead of performing operations and signaling errors.

**Impact**: Violates separation of concerns, 18 failing tests (Phase 10)

**Anti-Pattern**:
```typescript
// ❌ BAD: Validation blocks operation
const convert = (value: number, source: 'C' | 'F', target: 'C' | 'F') => {
  if (source === target) {
    setError('Identical units');
    return null; // Blocks conversion
  }
  return performConversion(value, source, target);
};
```

**Correct Pattern**:
```typescript
// ✅ GOOD: Operation always happens, error signaled separately
const convert = (value: number, source: 'C' | 'F', target: 'C' | 'F') => {
  const result = performConversion(value, source, target);
  if (source === target) {
    setError('Identical units'); // UI decides whether to show
  }
  return result; // Always returns conversion result
};
```

**Prevention**: Keep hooks pure. Hooks should perform operations, not make UI decisions.  
**Source**: [useTempConversion.ts](../../apps/temp/ui/src/hooks/useTempConversion.ts) - See Phase 10 refactoring

---

### 3. ❌ Configuration Duplication

**Problem**: Test configuration duplicated in multiple config files.

**Impact**: Confusion about which config controls what (T006)

**Anti-Pattern**:
```typescript
// ❌ BAD: Test config in vite.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});
```

**Correct Pattern**:
```typescript
// ✅ GOOD: Test config only in vitest.config.ts
// vite.config.ts - Build configuration only
export default defineConfig({
  plugins: [react()],
});

// vitest.config.ts - Test configuration only
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});
```

**Prevention**: Understand tool purposes. One config file, one purpose.  
**Source**: [vitest.config.ts](../../apps/temp/ui/vitest.config.ts) - See T006 resolution

---

### 4. ❌ Incorrect Test Query Patterns

**Problem**: Using `getByDisplayValue()` for `<select>` elements.

**Impact**: 3 failing tests (Phase 10)

**Anti-Pattern**:
```typescript
// ❌ BAD: getByDisplayValue doesn't work for select
const selector = screen.getByDisplayValue('Celsius');
```

**Correct Pattern**:
```typescript
// ✅ GOOD: getByTestId works reliably
const selector = screen.getByTestId('source-unit-selector');
await user.selectOptions(selector, 'C');
```

**Prevention**: Use `data-testid` attributes for reliable test queries.  
**Source**: [UnitSelectors.test.tsx](../../apps/temp/ui/tests/components/UnitSelectors.test.tsx) - See Phase 10 fixes

---

### 5. ❌ Missing Fake Timer Configuration

**Problem**: Incomplete fake timer setup causes test timeouts.

**Impact**: 22 test failures (Phase 5)

**Anti-Pattern**:
```typescript
// ❌ BAD: Incomplete fake timer setup
beforeEach(() => {
  vi.useFakeTimers();
});
```

**Correct Pattern**:
```typescript
// ✅ GOOD: Complete fake timer setup
beforeEach(() => {
  vi.useFakeTimers({ 
    toFake: ['Date', 'setInterval', 'clearInterval'] 
  });
  vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});
```

**Prevention**: Always set system time when using fake timers. Document patterns.  
**Source**: [Stopwatch.test.tsx](../../apps/stopwatch/ui/tests/components/Stopwatch.test.tsx) - See Phase 5 resolution

---

## Testing Patterns

### Hook Testing Pattern

```typescript
import { renderHook, act } from '@testing-library/react';
import { useStopwatch } from '@/hooks/useStopwatch';

describe('useStopwatch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should start stopwatch', () => {
    const { result } = renderHook(() => useStopwatch());

    act(() => {
      result.current.start();
    });

    expect(result.current.status.isRunning).toBe(true);
  });
});
```

---

### Component Testing Pattern

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stopwatch } from '@/components/Stopwatch';

describe('Stopwatch Component', () => {
  it('should start when Start button clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Stopwatch />);

    const startButton = screen.getByTestId('button-start');
    await user.click(startButton);

    expect(startButton).toBeDisabled();
    expect(screen.getByTestId('stopwatch-display')).toHaveTextContent(/00:00:/);
  });
});
```

---

### Utility Testing Pattern

```typescript
import { describe, it, expect } from 'vitest';
import { formatTime } from '@/utils/formatting';

describe('formatTime', () => {
  it('should format time in MM:SS:MS format', () => {
    expect(formatTime(0)).toBe('00:00:00');
    expect(formatTime(1000)).toBe('00:01:00');
    expect(formatTime(61000)).toBe('01:01:00');
  });
});
```

---

## Architecture Patterns

### Custom Hook Pattern

```typescript
// ✅ GOOD: Custom hook for state management
export function useStopwatch(
  autoDismissErrorMs = 5000,
  updateIntervalMs = 100
): UseStopwatchReturn {
  const [state, setState] = useState<StopwatchState>(initialState);

  const start = useCallback(() => {
    // Business logic
  }, []);

  const stop = useCallback(() => {
    // Business logic
  }, []);

  return {
    state,
    status: deriveStatus(state),
    start,
    stop,
    lap,
    reset,
    clearError,
  };
}
```

---

### Component Composition Pattern

```typescript
// ✅ GOOD: Compose components from smaller pieces
export const Stopwatch: React.FC<StopwatchProps> = () => {
  const { status, start, stop, lap, reset } = useStopwatch();

  return (
    <div>
      <StopwatchDisplay elapsedMs={status.elapsedMs} />
      <StopwatchControls
        isRunning={status.isRunning}
        onStart={start}
        onStop={stop}
        onLap={lap}
        onReset={reset}
      />
      <LapList laps={status.laps} />
      {status.hasError && <ErrorBanner error={status.error} />}
    </div>
  );
};
```

---

### Utility Function Pattern

```typescript
// ✅ GOOD: Pure utility functions
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((milliseconds % 1000) / 10);
  
  return `${padZero(minutes)}:${padZero(seconds)}:${padZero(centiseconds)}`;
}
```

---

## Configuration Patterns

### Vitest Configuration

```typescript
// ✅ GOOD: Complete Vitest configuration
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50,
      },
    },
    include: ['tests/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

### Playwright Configuration

```typescript
// ✅ GOOD: Complete Playwright configuration
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['html'], ['json'], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Accessibility Patterns

### ARIA Labels Pattern

```typescript
// ✅ GOOD: Descriptive ARIA labels
<button
  aria-label="Start stopwatch"
  onClick={handleStart}
  disabled={isRunning}
>
  Start
</button>

<div
  role="status"
  aria-live="polite"
  aria-label="Stopwatch display"
>
  {formattedTime}
</div>
```

---

### Keyboard Navigation Pattern

```typescript
// ✅ GOOD: Keyboard event handling
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    if (!disabled) {
      e.preventDefault();
      onClick();
    }
  }
};

<button
  onKeyDown={handleKeyDown}
  disabled={disabled}
>
  {label}
</button>
```

---

### Focus Management Pattern

```typescript
// ✅ GOOD: Focus management
const handleSubmit = () => {
  if (isValid) {
    performAction();
    // Focus moves to result or next logical element
    resultRef.current?.focus();
  } else {
    // Focus stays on error field
    errorFieldRef.current?.focus();
  }
};
```

---

## Error Handling Patterns

### Multi-Layer Validation Pattern

```typescript
// ✅ GOOD: Multiple validation layers
const handleBlur = () => {
  const error = validateOnBlur(inputValue, touched);
  if (error) {
    setError(error);
  }
};

const handleSubmit = () => {
  const error = validateOnSubmit(inputValue);
  if (error) {
    setError(error);
    return;
  }
  performAction();
};
```

---

### Error State Management Pattern

```typescript
// ✅ GOOD: Error state management with auto-dismiss
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  if (error) {
    const timer = setTimeout(() => {
      setError(null);
    }, autoDismissMs);
    return () => clearTimeout(timer);
  }
}, [error, autoDismissMs]);

const clearError = () => {
  setError(null);
};
```

---

### Error Display Pattern

```typescript
// ✅ GOOD: Error display with accessibility
{error && (
  <div
    role="alert"
    aria-live="assertive"
    aria-label="Error message"
  >
    {error.message}
    <button
      aria-label="Dismiss error"
      onClick={clearError}
    >
      ×
    </button>
  </div>
)}
```

---

## Quick Reference Checklist

### Before Starting Development

- [ ] Write tests first (TDD)
- [ ] Set up proper project structure
- [ ] Configure testing tools correctly
- [ ] Align package versions
- [ ] Set up accessibility from the start

### During Development

- [ ] Keep business logic separate from validation
- [ ] Use `data-testid` for test queries
- [ ] Configure fake timers completely
- [ ] Implement multiple validation layers
- [ ] Add ARIA labels and keyboard support

### Before Committing

- [ ] All tests pass
- [ ] Coverage meets threshold (≥50%)
- [ ] Linting passes
- [ ] TypeScript compiles
- [ ] Accessibility verified

---

## Pattern Validation

This section provides instructions to verify that patterns documented here match the actual implementation in the codebase.

### Validation Checklist

- [ ] **Best Practices**: Verify all best practice examples match actual code
  - Check hook patterns match `useStopwatch.ts` and `useTempConversion.ts`
  - Verify component patterns match actual components
  - Confirm configuration patterns match actual config files

- [ ] **Anti-Patterns**: Verify anti-pattern examples reflect actual issues resolved
  - Check validation.test.ts matches Phase 9 resolution
  - Verify hook design matches Phase 10 refactoring
  - Confirm configuration separation matches T006 resolution

- [ ] **Testing Patterns**: Verify test patterns match actual test files
  - Check hook testing pattern matches `useStopwatch.test.ts`
  - Verify component testing pattern matches component tests
  - Confirm utility testing pattern matches utility tests

- [ ] **Architecture Patterns**: Verify architecture patterns match actual structure
  - Check custom hook pattern matches hook implementations
  - Verify component composition matches container components
  - Confirm utility function pattern matches utility files

- [ ] **Configuration Patterns**: Verify configuration patterns match actual configs
  - Check Vitest config pattern matches `vitest.config.ts` files
  - Verify Playwright config pattern matches `playwright.config.ts` files

- [ ] **Accessibility Patterns**: Verify accessibility patterns match actual components
  - Check ARIA labels match component implementations
  - Verify keyboard navigation matches actual handlers
  - Confirm focus management matches actual focus logic

- [ ] **Error Handling Patterns**: Verify error handling patterns match actual implementation
  - Check multi-layer validation matches validation utilities
  - Verify error state management matches hook implementations
  - Confirm error display matches ErrorBanner component

### Validation Process

1. **Quarterly Review**: Review patterns quarterly against codebase
2. **After Refactoring**: Update patterns after significant refactoring
3. **Before Releases**: Validate patterns before major releases
4. **On Request**: Validate when requested by team members

**Last Validated**: December 2024  
**Next Validation Due**: March 2025  
**Validation Status**: ✅ Validated

---

## Related Documentation

This training guide is part of a comprehensive documentation set. Related documents include:

- **[RETROSPECTIVE.md](../../specs/004-stopwatch-temp-ui/RETROSPECTIVE.md)** - Lessons learned, challenges, solutions, and architectural decisions
- **[LEARNING_LOG.md](../../specs/004-stopwatch-temp-ui/LEARNING_LOG.md)** - Team reflections, insights, and recommendations
- **[TECHNICAL_DEBT_BACKLOG.md](../../specs/004-stopwatch-temp-ui/TECHNICAL_DEBT_BACKLOG.md)** - Refactoring opportunities and technical debt items
- **[ERROR_PATH_COVERAGE.md](../../specs/004-stopwatch-temp-ui/ERROR_PATH_COVERAGE.md)** - Comprehensive error path test coverage verification
- **[EDGE_CASE_COVERAGE.md](../../specs/004-stopwatch-temp-ui/EDGE_CASE_COVERAGE.md)** - Edge case test coverage verification
- **[PHASE13_IMPLEMENTATION_PLAN.md](../../specs/004-stopwatch-temp-ui/PHASE13_IMPLEMENTATION_PLAN.md)** - Enhancement plan for Phase 13 documentation

---

## References

- **Retrospective**: [RETROSPECTIVE.md](../../specs/004-stopwatch-temp-ui/RETROSPECTIVE.md)
- **Error Path Coverage**: [ERROR_PATH_COVERAGE.md](../../specs/004-stopwatch-temp-ui/ERROR_PATH_COVERAGE.md)
- **Edge Case Coverage**: [EDGE_CASE_COVERAGE.md](../../specs/004-stopwatch-temp-ui/EDGE_CASE_COVERAGE.md)
- **Phase Reports**: `specs/004-stopwatch-temp-ui/PHASE*_EXECUTIVE_SUMMARY.md`

---

**Document Version**: 1.1  
**Last Updated**: December 2024  
**Last Validated**: December 2024  
**Status**: ✅ Complete - Enhanced with Code References & Validation

