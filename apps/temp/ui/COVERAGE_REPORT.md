# Temp Converter UI - Test Coverage Report

**Generated**: See coverage generation instructions below  
**Target**: ≥50% statement coverage  
**Status**: Coverage configuration ready, requires version alignment

## Coverage Configuration

The Temp Converter UI is configured with Vitest coverage using the following settings:

### Configuration File: `vitest.config.ts`

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  reportsDirectory: './coverage',
  exclude: [
    'node_modules/',
    'dist/',
    'build/',
    '**/*.config.*',
    '**/types/**',
  ],
  thresholds: {
    lines: 50,
    functions: 50,
    branches: 50,
    statements: 50,
  },
}
```

### Coverage Thresholds

- **Statements**: ≥50%
- **Branches**: ≥50%
- **Functions**: ≥50%
- **Lines**: ≥50%

## Generating Coverage Report

### Prerequisites

1. Ensure `@vitest/coverage-v8` is installed and matches Vitest version:
   ```bash
   npm install --save-dev @vitest/coverage-v8
   ```

2. Verify Vitest and coverage provider versions are compatible:
   ```bash
   npm list vitest @vitest/coverage-v8
   ```

### Generate Coverage Report

Run the coverage command:

```bash
npm run test:coverage
```

Or with the `--run` flag for CI:

```bash
npm run test:coverage -- --run
```

### Coverage Report Outputs

The coverage report will be generated in the `./coverage` directory with the following formats:

- **HTML Report**: `coverage/index.html` - Interactive HTML report (open in browser)
- **JSON Report**: `coverage/coverage-final.json` - Machine-readable JSON
- **LCOV Report**: `coverage/lcov.info` - LCOV format for CI/CD integration
- **Text Report**: Printed to console - Quick summary

### Viewing Coverage Reports

1. **HTML Report** (Recommended):
   ```bash
   # Open coverage/index.html in your browser
   # Or use a simple HTTP server:
   npx serve coverage
   ```

2. **Console Summary**:
   The text report is automatically displayed in the terminal after running the coverage command.

## Test Files Coverage

### Component Tests
- `tests/components/TempConverter.test.tsx` - Main container component
- `tests/components/TemperatureInput.test.tsx` - Input component
- `tests/components/UnitSelectors.test.tsx` - Unit selector component
- `tests/components/ConversionResult.test.tsx` - Result display component
- `tests/components/ErrorBanner.test.tsx` - Error banner component

### Hook Tests
- `tests/hooks/useTempConversion.test.ts` - Temperature conversion hook logic

### Utility Tests
- `tests/utils/formatting.test.ts` - Temperature formatting utilities
- `tests/utils/validation.test.ts` - Validation utilities

### Accessibility Tests
- `tests/keyboard-navigation.test.tsx` - Keyboard navigation
- `tests/aria-labels.test.tsx` - ARIA labels verification
- `tests/focus-management.test.tsx` - Focus management

## Coverage Areas

### Core Functionality
- ✅ Celsius to Fahrenheit conversion
- ✅ Fahrenheit to Celsius conversion
- ✅ Input validation (numeric, on-blur, on-submit)
- ✅ Error handling and display
- ✅ Unit selection and validation
- ✅ Result display and formatting

### Edge Cases
- ✅ Invalid input handling (non-numeric)
- ✅ Identical unit prevention (C→C, F→F)
- ✅ Invalid unit rejection
- ✅ Negative temperature values
- ✅ Decimal precision (2 decimal places)
- ✅ Empty input handling

### Accessibility
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus management
- ✅ Screen reader support
- ✅ Error announcements

## Current Status

**✅ RESOLVED**: Version mismatch has been fixed. All Vitest packages are now aligned:
- `vitest@^1.6.1`
- `@vitest/coverage-v8@^1.6.1`
- `@vitest/ui@^1.6.1`
- `@testing-library/dom@^9.3.4` (peer dependency)

**Coverage is now functional**. Run `npm run test:coverage -- --run` to generate reports.

## Coverage Goals

- **Target**: ≥50% statement coverage
- **Current**: To be measured after version alignment
- **Areas for Improvement**: Document any areas below threshold after generation

## CI/CD Integration

For continuous integration, use:

```bash
npm run test:coverage -- --run --reporter=json --reporter=text
```

The JSON report can be parsed by CI tools, and the text report provides human-readable output.

## Next Steps

1. Resolve version mismatch between Vitest and coverage provider (if present)
2. Generate coverage report: `npm run test:coverage -- --run`
3. Review HTML report: Open `coverage/index.html`
4. Identify areas below 50% threshold
5. Add tests to improve coverage where needed
6. Update this document with actual coverage percentages

