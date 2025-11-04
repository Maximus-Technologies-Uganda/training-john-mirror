# Expense UI Application

A modern, accessible React TypeScript application for expense tracking with robust validation, filtering capabilities, and comprehensive testing.

## 🚀 Features

### Core Functionality
- ✅ **Add Expenses** - Create new expense entries with validation
- ✅ **View Expenses** - Display all expenses in a clear list format
- ✅ **Filter by Month** - Filter expenses by selected month
- ✅ **Filter by Category** - Filter expenses by predefined categories
- ✅ **Combined Filtering** - Filter by both month and category simultaneously

### Technical Excellence
- ✅ **Form Validation** - Zod schema validation with React Hook Form
- ✅ **Currency Handling** - Proper cents conversion and formatting
- ✅ **Persistent Storage** - localStorage with error handling and fallbacks
- ✅ **Accessibility First** - WCAG 2.1 AA compliance with ARIA support
- ✅ **Type-Safe Development** - Full TypeScript with strict mode
- ✅ **Comprehensive Testing** - Vitest + RTL, Playwright E2E
- ✅ **Cross-Browser Compatible** - Tested on Chrome, Firefox, Safari
- ✅ **Modern Build Tools** - Vite for fast development and optimized production

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** with Hooks
- **TypeScript 5.x** with strict mode
- **Vite** for build tooling and dev server

### Testing & Quality
- **Vitest** + React Testing Library for unit/component tests
- **Playwright** for end-to-end testing
- **ESLint** with TypeScript support
- **Prettier** for code formatting

### Forms & Validation
- **React Hook Form** for performant form handling
- **Zod** for schema validation

### Storage
- **localStorage** with error boundaries and fallbacks

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start
```bash
# Navigate to the expense UI directory
cd apps/expense/ui

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
# Development
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build

# Testing
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report

# End-to-End Testing
npm run e2e          # Run Playwright E2E tests
npm run e2e:ui       # Run E2E tests with UI

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # Run TypeScript type checking

# Validation (combined)
npm run validate     # Run lint + type-check + tests
```

## 🏗️ Project Structure

```
apps/expense/ui/
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── lib/            # Core business logic imports
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   ├── index.css       # Global styles
│   └── test-setup.ts   # Test configuration
├── tests/              # Unit and component tests
│   ├── components/
│   ├── hooks/
│   └── utils/
├── e2e/                # End-to-end tests (Playwright)
├── public/             # Static assets
├── dist/               # Build output (generated)
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── eslint.config.js
├── tsconfig.json
└── README.md
```

## 🧪 Testing Strategy

### Unit Tests (Vitest + RTL)
- Component tests for UI behavior
- Hook tests for state management
- Utility tests for business logic
- 60%+ code coverage requirement

### End-to-End Tests (Playwright)
- Complete user workflows
- Cross-browser compatibility
- Smoke tests for critical paths

### Test Coverage Requirements
- Statements: ≥60%
- Branches: ≥60%
- Functions: ≥60%
- Lines: ≥60%

## 🎯 Development Workflow

1. **Setup**: Complete Phase 1 (setup) and Phase 2 (foundation)
2. **Development**: Follow user story progression (US1 → US2 → US3 → etc.)
3. **Testing**: Write tests first (TDD), then implementation
4. **Validation**: Run `npm run validate` before commits
5. **Integration**: Combine features in main App component

## 📋 Implementation Status

- **Phase 1 (Setup)**: ✅ Complete
- **Phase 2 (Foundation)**: 🔄 In Progress
- **Phase 3 (User Story 1)**: ⏳ Ready
- **Phase 4-7 (User Stories 2-5)**: ⏳ Pending
- **Phase 8 (Integration)**: ⏳ Pending
- **Phase 9 (Polish)**: ⏳ Pending

## 🤝 Contributing

1. Follow the established task progression in `specs/003-expense-ui/tasks.md`
2. Write tests before implementation (TDD approach)
3. Maintain 60%+ test coverage
4. Run validation scripts before committing
5. Follow TypeScript strict mode and ESLint rules

## 📄 License

This project is part of the training-john workspace. See root README for details.

## 🔗 Related Documentation

- [Expense UI Specification](../specs/003-expense-ui/spec.md)
- [Implementation Plan](../specs/003-expense-ui/plan.md)
- [Task Breakdown](../specs/003-expense-ui/tasks.md)
