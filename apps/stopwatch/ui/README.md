# Stopwatch UI

A React TypeScript application for stopwatch functionality with start, lap, stop, and reset controls. Features real-time time tracking, lap recording with virtual scrolling, error handling, and full keyboard accessibility.

## Features

### User Stories Implemented

- **US1: Start and Track Time** - Start stopwatch and see elapsed time update in real-time (MM:SS:MS format)
- **US2: Record and View Laps** - Record lap times while stopwatch is running, display laps with interval and cumulative time
- **US3: Stop and Reset** - Stop stopwatch and reset all data
- **US4: Handle Invalid State Transitions** - Prevent invalid operations (lap before start, stop twice) and display inline errors

### Key Features

- ⏱️ **Real-time time tracking** - Updates every 100ms in MM:SS:MS format
- 📊 **Lap recording** - Record unlimited laps with interval and cumulative times
- 🚀 **Virtual scrolling** - Automatic performance optimization for >50 laps
- ⚠️ **Error handling** - Inline error messages with auto-dismissal
- ⌨️ **Keyboard accessible** - Full keyboard navigation (Tab, Enter, Space)
- 🎯 **Screen reader support** - ARIA labels and live regions
- 🧪 **Comprehensive testing** - Unit, component, integration, and E2E tests

## Project Structure

```
src/
├── components/        # React components
│   ├── Stopwatch.tsx          # Main container component
│   ├── StopwatchDisplay.tsx   # Time display (MM:SS:MS)
│   ├── StopwatchControls.tsx  # Control buttons (Start, Stop, Lap, Reset)
│   ├── LapList.tsx            # Lap list with virtual scrolling
│   └── ErrorBanner.tsx        # Error message display
├── hooks/             # Custom React hooks
│   └── useStopwatch.ts        # Core stopwatch logic
├── types/             # TypeScript type definitions
│   └── stopwatch.ts           # StopwatchState, LapTime, StopwatchStatus
└── utils/             # Utility functions
    ├── formatting.ts          # Time formatting (MM:SS:MS)
    └── validation.ts          # State validation

tests/
├── components/        # Component tests (Vitest + React Testing Library)
│   ├── Stopwatch.test.tsx
│   ├── StopwatchDisplay.test.tsx
│   ├── StopwatchControls.test.tsx
│   ├── LapList.test.tsx
│   └── ErrorBanner.test.tsx
├── hooks/             # Hook tests
│   └── useStopwatch.test.ts
├── utils/             # Utility tests
│   ├── formatting.test.ts
│   └── validation.test.ts
├── keyboard-navigation.test.tsx  # Keyboard accessibility tests
├── aria-labels.test.tsx         # ARIA labels tests
├── focus-management.test.tsx    # Focus management tests
└── setup.ts                     # Test setup file

e2e/                   # End-to-end tests (Playwright)
└── stopwatch.spec.ts  # E2E smoke tests
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
import { Stopwatch } from '@/components/Stopwatch';

function App() {
  return (
    <div>
      <h1>My Stopwatch</h1>
      <Stopwatch />
    </div>
  );
}
```

### Advanced Usage

```tsx
import { Stopwatch } from '@/components/Stopwatch';

function App() {
  return (
    <Stopwatch
      autoDismissErrorMs={3000}  // Auto-dismiss errors after 3 seconds
      updateIntervalMs={50}      // Update display every 50ms (faster updates)
      className="custom-class"   // Custom CSS class
    />
  );
}
```

### Using the Hook Directly

```tsx
import { useStopwatch } from '@/hooks/useStopwatch';

function CustomStopwatch() {
  const { status, start, stop, lap, reset, clearError } = useStopwatch();

  return (
    <div>
      <div>{status.formattedTime}</div>
      <button onClick={start} disabled={status.isRunning}>Start</button>
      <button onClick={stop} disabled={!status.isRunning}>Stop</button>
      <button onClick={lap} disabled={!status.isRunning}>Lap</button>
      <button onClick={reset}>Reset</button>
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
npm run test -- tests/components/Stopwatch.test.tsx

# Run tests matching pattern
npm run test -- --grep "should start stopwatch"
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
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stopwatch } from '@/components/Stopwatch';

describe('Stopwatch Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start stopwatch when Start button clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<Stopwatch />);
    
    const startButton = screen.getByTestId('button-start');
    await user.click(startButton);
    
    expect(startButton).toBeDisabled();
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

- Complete workflow: Start → Lap (3x) → Stop → Reset
- Error handling: Lap before start
- Format verification: MM:SS:MS display format

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

- **Core Functionality**: Start, stop, lap, reset operations
- **Edge Cases**: >50 laps virtual scrolling, extended times
- **Error Handling**: Invalid state transitions, error messages
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
- **react-window**: 1.8.10 (virtual scrolling)
- **ESLint**: 8.55.0 (code quality)
- **Prettier**: 3.1.0 (code formatting)

## Accessibility Features

- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Space)
- **Focus Management**: Visible focus indicators, logical tab order
- **Screen Reader Support**: ARIA live regions for dynamic content
- **Error Announcements**: Errors announced via `role="alert"`

## Edge Cases Covered

- **>50 Laps**: Virtual scrolling automatically activates
- **Extended Times**: Handles very small (1ms) and very large (1 hour) times
- **Maximum Display**: Caps at 99:59:99 format
- **Race Conditions**: Handles rapid concurrent operations safely
- **Error Recovery**: Errors auto-dismiss when state is fixed

## Contributing

1. Follow TypeScript strict mode
2. Write tests for new features (TDD approach)
3. Maintain accessibility (ARIA labels, keyboard navigation)
4. Run linter and formatter before committing
5. Ensure coverage targets met (≥50%)
6. Update documentation for new features

## License

MIT
