# Quick Start: To-Do UI Implementation

**Date**: 2025-10-31
**Target**: `apps/todo/ui/`
**Goal**: Get the To-Do UI development environment running in under 15 minutes

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to the training-john repository
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

## Project Setup

### 1. Navigate to UI Directory
```bash
cd apps/todo/ui/
```

### 2. Initialize React Project
```bash
# Create Vite + React project
npm create vite@latest . -- --template react --yes

# Or with yarn
yarn create vite . --template react
```

### 3. Install Dependencies
```bash
npm install

# Add required dependencies for the feature
npm install @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @vitejs/plugin-react vite-plugin-eslint eslint-plugin-react-hooks
```

### 4. Configure Vite
Create/update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js']
  }
})
```

### 5. Set up Testing Configuration
Create `src/test-setup.js`:
```javascript
import '@testing-library/jest-dom'
```

Update `package.json` test scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Development Workflow

### Start Development Server
```bash
npm run dev
# Opens http://localhost:3000
```

### Run Tests
```bash
# Run tests in watch mode
npm run test

# Run tests once with coverage
npm run test:run

# Run tests with UI
npm run test:ui
```

### Build for Production
```bash
npm run build
npm run preview
```

## Implementation Order

Follow this sequence for incremental development:

### Phase 1: Core Infrastructure (Day 1)
1. **Set up project structure** (components/, hooks/, utils/)
2. **Create localStorage hook** (`useLocalStorage.js`)
3. **Create todo state hook** (`useTodos.js`)
4. **Build basic TodoApp component** (minimal UI)

### Phase 2: CRUD Operations (Day 2)
1. **Implement AddTodoForm component**
2. **Build TodoList and TodoItem components**
3. **Connect add/remove/done operations**
4. **Add form validation and error handling**

### Phase 3: Advanced Features (Day 3)
1. **Implement due date filtering**
2. **Add duplicate prevention**
3. **Implement accessibility features**
4. **Add loading states and visual feedback**

### Phase 4: Testing & Polish (Day 4)
1. **Write comprehensive component tests** (aim for ≥60% coverage)
2. **Implement Playwright smoke test**
3. **Performance optimization and final polish**
4. **Cross-browser testing and accessibility audit**

## Key Files to Create

```
apps/todo/ui/
├── src/
│   ├── components/
│   │   ├── TodoApp.jsx          # Main container
│   │   ├── TodoList.jsx         # List display
│   │   ├── TodoItem.jsx         # Individual item
│   │   ├── AddTodoForm.jsx      # Add form
│   │   └── TodoFilters.jsx      # Filter controls
│   ├── hooks/
│   │   ├── useTodos.js          # State management
│   │   └── useLocalStorage.js   # Persistence
│   ├── utils/
│   │   ├── dateUtils.js         # Date helpers
│   │   └── accessibility.js     # A11y helpers
│   ├── App.jsx                  # App entry point
│   └── main.jsx                 # React root
├── tests/
│   ├── components/              # RTL tests
│   └── hooks/                   # Hook tests
├── e2e/
│   └── todo-workflow.spec.js    # Playwright test
├── package.json
├── vite.config.js
└── index.html
```

## Import Core Logic

The UI must import business logic from the core module:

```javascript
import {
  addTask,
  markTaskDone,
  removeTask,
  listTasks,
  isDuplicateTask
} from '../../../src/todo-core.js';
```

## Testing Strategy

### Component Tests (Vitest + RTL)
- Test user interactions, not implementation details
- Use `getByRole`, `getByLabelText` for accessibility
- Mock localStorage in test setup
- Cover error states and edge cases

### E2E Tests (Playwright)
- Single smoke test covering: add → mark done → filter → remove
- Run in headless mode for CI
- Include accessibility checks with axe-playwright

## Common Issues & Solutions

### Issue: localStorage not working in tests
**Solution**: Mock localStorage in test setup:
```javascript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;
```

### Issue: Date objects in localStorage
**Solution**: Custom serialization:
```javascript
JSON.stringify(data, (key, value) =>
  value instanceof Date ? value.toISOString() : value
);
```

### Issue: Accessibility testing
**Solution**: Use jest-axe or axe-playwright:
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
```

## Success Criteria Check

- [ ] Development server starts without errors
- [ ] Basic TodoApp component renders
- [ ] Core hooks (useTodos, useLocalStorage) work
- [ ] Add task functionality works
- [ ] Tests pass with >60% coverage
- [ ] Playwright smoke test passes
- [ ] Accessibility requirements met
- [ ] Performance targets achieved (<200ms operations)

## Next Steps

After setup is complete:
1. Run `/speckit.tasks` to generate the implementation task breakdown
2. Start with Phase 1 infrastructure tasks
3. Implement incrementally with tests driving development
4. Use the spec's success criteria to validate completion

