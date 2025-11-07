# Stopwatch UI

A React TypeScript application for stopwatch functionality with start, lap, stop, and reset controls.

## Project Structure

```
src/
├── components/        # React components (StopwatchDisplay, Controls, LapList, etc.)
├── hooks/             # Custom React hooks (useStopwatch)
├── types/             # TypeScript type definitions
└── utils/             # Utility functions (formatting, validation)

tests/
├── components/        # Component tests (Vitest + React Testing Library)
├── hooks/             # Hook tests
└── utils/             # Utility tests

e2e/                   # End-to-end tests (Playwright)
```

## Setup

### Prerequisites
- Node.js 18+ 
- npm 9+ (or yarn/pnpm)

### Installation

```bash
# Install dependencies
npm install

# Verify installation
npm run build
npm run test -- --run
```

## Available Scripts

### Development
```bash
npm run dev
# Start development server at http://localhost:5173
# Hot module replacement enabled
```

### Testing

```bash
# Run all tests
npm run test

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### E2E Testing
```bash
# Run Playwright tests (requires npm run dev in separate terminal)
npm run e2e

# Run E2E tests with UI
npm run e2e:ui
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

### Building

```bash
# Build for production
npm run build

# Output created in dist/ folder
```

## Testing Strategy

### Unit & Component Tests
- **Framework**: Vitest + React Testing Library
- **Location**: `tests/` directory
- **Target Coverage**: ≥50% statement coverage
- **Patterns**: TDD - tests written before implementation

### E2E Tests
- **Framework**: Playwright
- **Location**: `e2e/` directory
- **Browsers**: Chrome, Firefox, Safari
- **Purpose**: Smoke tests for critical user flows

## Development Workflow

1. **Feature Branch**: Create branch from main
2. **TDD**: Write failing tests first
3. **Implementation**: Write code to pass tests
4. **Type Safety**: Ensure TypeScript passes
5. **Linting**: Run eslint and prettier
6. **Coverage**: Maintain ≥50% coverage
7. **Pull Request**: Tests + linting must pass

## Troubleshooting

### Port 5173 already in use
```bash
# On Windows (PowerShell)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :5173
kill -9 <PID>
```

### Tests not running
- Ensure `tests/setup.ts` exists
- Check vitest.config.ts has setupFiles configured
- Run `npm install` to ensure dependencies installed

### ESLint errors
```bash
npm run format  # Auto-fix most issues
npm run lint    # Check remaining issues
```

## Technology Stack

- **React**: 18.2.0 (UI framework)
- **TypeScript**: 5.3.3 (type safety)
- **Vite**: 5.0.7 (build tool)
- **Vitest**: 1.0.4 (unit test framework)
- **React Testing Library**: 14.1.2 (component testing)
- **Playwright**: 1.40.0 (E2E testing)
- **ESLint**: 8.55.0 (code quality)
- **Prettier**: 3.1.0 (code formatting)

## Contributing

1. Follow TypeScript strict mode
2. Write tests for new features
3. Maintain accessibility (ARIA labels, keyboard navigation)
4. Run linter and formatter before committing
5. Ensure coverage targets met

## License

MIT
