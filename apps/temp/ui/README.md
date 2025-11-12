# Temperature Converter UI

A React TypeScript application for converting between Celsius and Fahrenheit temperatures with validation and error handling. Features real-time conversion, input validation, error messages with auto-dismissal, and full keyboard accessibility.

## Features

### User Stories Implemented

- **US5: Convert Celsius to Fahrenheit** - Convert C→F with correct results (2 decimal places)
- **US6: Convert Fahrenheit to Celsius** - Convert F→C with correct results (2 decimal places)
- **US7: Handle Invalid Input** - Validate numeric input, show error for non-numeric, auto-dismiss on fix
- **US8: Prevent Identical Unit Conversion** - Block C→C or F→F conversions, show error, auto-dismiss on unit change
- **US9: Handle Invalid Unit Selection** - Ensure only valid units (C, F) are available and accepted

### Key Features

- 🌡️ **Bi-directional conversion** - Convert between Celsius and Fahrenheit
- ✅ **Input validation** - On-blur and on-submit validation
- ⚠️ **Error handling** - Inline error messages with auto-dismissal
- 🔢 **Precision** - Results rounded to 2 decimal places
- ⌨️ **Keyboard accessible** - Full keyboard navigation (Tab, Enter, Arrow keys)
- 🎯 **Screen reader support** - ARIA labels and live regions
- 🧪 **Comprehensive testing** - Unit, component, integration, and E2E tests
- ❄️ **Negative temperature support** - Handles negative values correctly (e.g., -40°C = -40°F)

## Project Structure

```
src/
├── components/        # React components
│   ├── TempConverter.tsx        # Main container component
│   ├── TemperatureInput.tsx    # Temperature input field
│   ├── UnitSelectors.tsx       # Source/target unit dropdowns
│   ├── ConversionResult.tsx    # Conversion result display
│   └── ErrorBanner.tsx         # Error message display
├── hooks/             # Custom React hooks
│   └── useTempConversion.ts    # Core conversion logic
├── types/             # TypeScript type definitions
│   └── tempconverter.ts        # TemperatureState, ConversionError
└── utils/             # Utility functions
    ├── formatting.ts           # Temperature formatting (2 decimal places)
    └── validation.ts           # Input validation (on-blur, on-submit)

tests/
├── components/        # Component tests (Vitest + React Testing Library)
│   ├── TempConverter.test.tsx
│   ├── TemperatureInput.test.tsx
│   ├── UnitSelectors.test.tsx
│   ├── ConversionResult.test.tsx
│   └── ErrorBanner.test.tsx
│   └── ErrorBanner.identical-units.test.tsx
├── hooks/             # Hook tests
│   ├── useTempConversion.test.ts
│   └── useTempConversion.identical-units.test.ts
├── utils/             # Utility tests
│   ├── formatting.test.ts
│   └── validation.test.ts
├── keyboard-navigation.test.tsx  # Keyboard accessibility tests
├── aria-labels.test.tsx          # ARIA labels tests
├── focus-management.test.tsx     # Focus management tests
└── setup.ts                      # Test setup file

e2e/                   # End-to-end tests (Playwright)
└── temp-converter.spec.ts  # E2E smoke tests
```

## Setup

### Prerequisites

- **Node.js**: 18+ 
- **npm**: 9+ (or yarn/pnpm)

### Installation

```bash
# Install dependencies
npm install

# Verify installation
npm run build
npm run test -- --run
```

## Usage

### Basic Usage

```tsx
import { TempConverter } from '@/components/TempConverter';

function App() {
  return (
    <div>
      <h1>Temperature Converter</h1>
      <TempConverter />
    </div>
  );
}
```

### Advanced Usage

```tsx
import { TempConverter } from '@/components/TempConverter';

function App() {
  const handleConversion = (value: number, sourceUnit: 'C' | 'F', targetUnit: 'C' | 'F') => {
    console.log(`Converted ${value}°${sourceUnit} to ${targetUnit}`);
  };

  return (
    <TempConverter
      autoDismissErrorMs={3000}  // Auto-dismiss errors after 3 seconds
      required={true}             // Make input required
      onSubmit={handleConversion} // Callback on successful conversion
      className="custom-class"    // Custom CSS class
      min={-273.15}               // Minimum value (absolute zero)
      max={10000}                 // Maximum value
    />
  );
}
```

### Using the Hook Directly

```tsx
import { useTempConversion } from '@/hooks/useTempConversion';

function CustomConverter() {
  const {
    inputValue,
    sourceUnit,
    targetUnit,
    result,
    error,
    handleSetInputValue,
    handleSetSourceUnit,
    handleSetTargetUnit,
    handleConvert,
    clearError,
  } = useTempConversion();

  return (
    <div>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => handleSetInputValue(e.target.value)}
      />
      <select value={sourceUnit} onChange={(e) => handleSetSourceUnit(e.target.value as 'C' | 'F')}>
        <option value="C">Celsius</option>
        <option value="F">Fahrenheit</option>
      </select>
      <select value={targetUnit} onChange={(e) => handleSetTargetUnit(e.target.value as 'C' | 'F')}>
        <option value="C">Celsius</option>
        <option value="F">Fahrenheit</option>
      </select>
      <button onClick={handleConvert}>Convert</button>
      {result !== null && <div>{result.toFixed(2)}°{targetUnit}</div>}
      {error && <div>{error.message}</div>}
    </div>
  );
}
```

## Available Scripts

### Development

```bash
# Start development server
npm run dev
# Opens at http://localhost:5173
# Hot module replacement enabled
```

### Testing

#### Run All Tests

```bash
# Run all tests in watch mode
npm run test

# Run all tests once (CI mode)
npm run test -- --run

# Run specific test file
npm run test -- tests/components/TempConverter.test.tsx

# Run tests matching pattern
npm run test -- --grep "should convert Celsius to Fahrenheit"
```

#### Test UI Dashboard

```bash
# Open Vitest UI dashboard
npm run test:ui
# Opens interactive test dashboard at http://localhost:51204
```

#### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Generate coverage report and view summary
npm run test:coverage:report

# View HTML coverage report
# Open coverage/index.html in browser
```

**Coverage Targets**: ≥50% (lines, functions, branches, statements)

### E2E Testing

```bash
# Run Playwright E2E tests (auto-starts dev server)
npm run e2e

# Run E2E tests with UI
npm run e2e:ui

# Run E2E tests in specific browser
npm run e2e -- --project=chromium
npm run e2e -- --project=firefox
npm run e2e -- --project=webkit
```

**Note**: E2E tests automatically start the dev server. No need to run `npm run dev` separately.

### Code Quality

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint -- --fix

# Format code with Prettier
npm run format

# Check formatting without fixing
npm run format -- --check
```

### Building

```bash
# Build for production
npm run build

# Output created in dist/ folder
# Includes optimized JS, CSS, and assets
```

## Testing Strategy

### Unit & Component Tests

- **Framework**: Vitest + React Testing Library
- **Location**: `tests/` directory
- **Target Coverage**: ≥50% statement coverage
- **Patterns**: TDD - tests written before implementation

#### Test Structure

```typescript
// Example test structure
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TempConverter } from '@/components/TempConverter';

describe('TempConverter Component', () => {
  it('should convert 0°C to 32°F', async () => {
    const user = userEvent.setup();
    render(<TempConverter />);
    
    const input = screen.getByTestId('temperature-input');
    const sourceSelector = screen.getByTestId('source-unit-selector');
    const targetSelector = screen.getByTestId('target-unit-selector');
    const convertButton = screen.getByRole('button', { name: /convert/i });
    
    await user.type(input, '0');
    await user.selectOptions(sourceSelector, 'C');
    await user.selectOptions(targetSelector, 'F');
    await user.click(convertButton);
    
    expect(screen.getByTestId('conversion-result')).toHaveTextContent('32.00°F');
  });
});
```

#### Running Specific Test Suites

```bash
# Run component tests only
npm run test -- tests/components/

# Run hook tests only
npm run test -- tests/hooks/

# Run utility tests only
npm run test -- tests/utils/

# Run accessibility tests
npm run test -- tests/aria-labels.test.tsx
npm run test -- tests/keyboard-navigation.test.tsx
npm run test -- tests/focus-management.test.tsx
```

### E2E Tests

- **Framework**: Playwright
- **Location**: `e2e/` directory
- **Browsers**: Chrome, Firefox, Safari (WebKit)
- **Purpose**: Smoke tests for critical user flows

#### E2E Test Coverage

- C→F conversion: 0°C to 32°F
- F→C conversion: 32°F to 0°C
- Non-numeric input error handling
- Identical unit error handling (C→C, F→F)

## Test Coverage

### Coverage Reports

Generate coverage reports using:

```bash
# Generate coverage report
npm run test:coverage -- --run

# Generate coverage report with summary
npm run test:coverage:report
```

### Viewing Coverage

1. **HTML Report**: Open `coverage/index.html` in browser
2. **Text Summary**: Displayed in terminal after running coverage
3. **JSON Report**: Available at `coverage/coverage-final.json`
4. **LCOV Report**: Available at `coverage/lcov.info` (for CI/CD)

### Coverage Areas

- **Core Functionality**: C→F and F→C conversions
- **Edge Cases**: Negative temperatures, decimal values, identical units
- **Error Handling**: Invalid input, identical units, invalid units
- **Accessibility**: ARIA labels, keyboard navigation, focus management

## Development Workflow

1. **Feature Branch**: Create branch from main
2. **TDD**: Write failing tests first
3. **Implementation**: Write code to pass tests
4. **Type Safety**: Ensure TypeScript passes (`npx tsc --noEmit`)
5. **Linting**: Run eslint and prettier
6. **Coverage**: Maintain ≥50% coverage
7. **Pull Request**: Tests + linting must pass

## Troubleshooting

### Port 5173 Already in Use

```bash
# On Windows (PowerShell)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### Tests Not Running

- Ensure `tests/setup.ts` exists
- Check `vitest.config.ts` has `setupFiles: ['./tests/setup.ts']` configured
- Run `npm install` to ensure dependencies installed
- Check Node.js version: `node --version` (should be 18+)

### ESLint Errors

```bash
# Auto-fix most issues
npm run format

# Check remaining issues
npm run lint

# Fix specific rule violations
npm run lint -- --fix
```

### TypeScript Errors

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Common issues:
# - Missing type definitions: npm install --save-dev @types/<package>
# - Import path issues: Check tsconfig.json paths configuration
```

### Coverage Not Generating

- Ensure `@vitest/coverage-v8` is installed: `npm install --save-dev @vitest/coverage-v8`
- Check `vitest.config.ts` has coverage configuration
- Verify coverage provider: `provider: 'v8'`

### Playwright Tests Failing

- Ensure dev server can start: `npm run dev`
- Check Playwright browsers installed: `npx playwright install`
- Verify `playwright.config.ts` has correct `baseURL` and `webServer` configuration

## Technology Stack

- **React**: 18.2.0 (UI framework)
- **TypeScript**: 5.3.3 (type safety)
- **Vite**: 5.0.7 (build tool)
- **Vitest**: 1.6.1 (unit test framework)
- **React Testing Library**: 14.1.2 (component testing)
- **Playwright**: 1.40.0 (E2E testing)
- **ESLint**: 8.55.0 (code quality)
- **Prettier**: 3.1.0 (code formatting)

## Accessibility Features

- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Arrow keys)
- **Focus Management**: Visible focus indicators, logical tab order
- **Screen Reader Support**: ARIA live regions for dynamic content
- **Error Announcements**: Errors announced via `role="alert"`

## Edge Cases Covered

- **Negative Temperatures**: Handles negative values correctly (e.g., -40°C = -40°F)
- **Decimal Values**: Validates and rounds to 2 decimal places
- **Identical Units**: Prevents C→C or F→F conversions with error message
- **Invalid Input**: Validates non-numeric input with on-blur and on-submit validation
- **Special Cases**: Handles convergence point (-40°C = -40°F) and absolute zero

## Conversion Formulas

- **Celsius to Fahrenheit**: `F = (C × 9/5) + 32`
- **Fahrenheit to Celsius**: `C = (F - 32) × 5/9`

### Special Cases

- **Convergence Point**: -40°C = -40°F (only temperature where C = F)
- **Absolute Zero**: -273.15°C = -459.67°F
- **Freezing Point**: 0°C = 32°F
- **Boiling Point**: 100°C = 212°F

## Contributing

1. Follow TypeScript strict mode
2. Write tests for new features (TDD approach)
3. Maintain accessibility (ARIA labels, keyboard navigation)
4. Run linter and formatter before committing
5. Ensure coverage targets met (≥50%)
6. Update documentation for new features

## License

MIT
