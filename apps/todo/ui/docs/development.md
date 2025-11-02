# Development Guide

This guide provides comprehensive information for developers working on the Todo UI application.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - JavaScript runtime
- **npm** - Package manager (comes with Node.js)
- **Git** - Version control system
- **VS Code** (recommended) - IDE with React extensions

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-url>/apps/todo/ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm run lint    # Should pass without errors
   npm test        # Should run tests successfully
   npm run build   # Should build without errors
   ```

## 🏃 Development Workflow

### Starting Development

```bash
# Start development server with hot reload
npm run dev

# Server will be available at http://localhost:5173
```

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run e2e` | Run end-to-end tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |

### File Watching

The development server automatically watches for file changes and:
- **Hot reloads** React components
- **Rebuilds** the application
- **Refreshes** the browser

## 🧪 Testing Strategy

### Test Categories

#### Unit Tests (`*.test.js`)
- **Utility functions** in `src/utils/`
- **Custom hooks** in `src/hooks/`
- **Pure functions** and business logic

#### Component Tests (`*.test.jsx`)
- **Component rendering** with different props
- **User interactions** and event handling
- **Accessibility features** and ARIA attributes
- **Error states** and edge cases

#### End-to-End Tests (`e2e/*.spec.js`)
- **Complete user workflows**
- **Cross-browser compatibility**
- **Critical path validation**

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test tests/components/TodoApp.test.jsx

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run e2e

# Run E2E tests with browser UI
npm run e2e:headed
```

### Writing Tests

#### Component Test Example
```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '../src/components/TodoItem'

describe('TodoItem', () => {
  it('renders todo text', () => {
    const todo = { id: 1, text: 'Test todo', done: false, dueDate: null }
    render(<TodoItem todo={todo} onToggle={vi.fn()} onRemove={vi.fn()} />)

    expect(screen.getByText('Test todo')).toBeInTheDocument()
  })

  it('calls onToggle when toggle button is clicked', async () => {
    const user = userEvent.setup()
    const mockToggle = vi.fn()
    const todo = { id: 1, text: 'Test todo', done: false, dueDate: null }

    render(<TodoItem todo={todo} onToggle={mockToggle} onRemove={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /mark as complete/i }))

    expect(mockToggle).toHaveBeenCalledWith(1)
  })
})
```

#### Hook Test Example
```javascript
import { renderHook, act } from '@testing-library/react'
import useTodos from '../src/hooks/useTodos'

describe('useTodos', () => {
  it('adds a new todo', () => {
    const { result } = renderHook(() => useTodos())

    act(() => {
      result.current.addTodo('New todo')
    })

    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('New todo')
  })
})
```

### Test Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Statements | 80% | 86.2% ✅ |
| Branches | 80% | 86.66% ✅ |
| Functions | 80% | 86.36% ✅ |
| Lines | 80% | 86.2% ✅ |

## 🐛 Debugging

### React DevTools

1. **Install React DevTools** browser extension
2. **Open DevTools** in your browser
3. **Navigate to React tab** to inspect component tree
4. **Use Profiler** to analyze performance

### Browser DevTools

#### Console Logging
```javascript
// Development-only logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

#### Breakpoints
Set breakpoints in:
- Component lifecycle methods
- Event handlers
- Hook functions

#### Network Tab
Monitor:
- API calls (if any)
- localStorage operations
- Error reporting

### VS Code Debugging

1. **Install extensions**:
   - ES7+ React/Redux/React-Native snippets
   - Auto Rename Tag
   - Bracket Pair Colorizer
   - ESLint
   - Prettier

2. **Configure debugger** in `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug Todo App",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/apps/todo/ui/node_modules/.bin/vite",
         "args": ["--host", "localhost", "--port", "5173"]
       }
     ]
   }
   ```

## 🚀 Building for Production

### Build Process

```bash
# Create optimized production build
npm run build

# Build output will be in `dist/` directory
```

### Build Analysis

```bash
# Analyze bundle size
npm install -g vite-bundle-analyzer
vite-bundle-analyzer dist/
```

### Deployment

The `dist/` directory contains static files that can be deployed to:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Any static hosting service**

## 🔧 Code Quality

### Linting

```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix
```

### ESLint Configuration

The project uses ESLint flat config with rules for:
- React best practices
- Accessibility (jsx-a11y)
- Import/export consistency
- Code style consistency

### Pre-commit Hooks

The project uses Husky for pre-commit hooks:
- **ESLint** - Code quality checks
- **Tests** - Ensure tests pass
- **Type checking** - If TypeScript is added

## 📊 Performance Monitoring

### React DevTools Profiler

1. **Open React DevTools**
2. **Go to Profiler tab**
3. **Record interactions**
4. **Analyze render times**

### Lighthouse Audit

```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:5173 --output html
```

### Bundle Analysis

```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer dist/static/js/*.js
```

## 🎨 Styling Guidelines

### CSS Architecture

- **Component-scoped styles** - Each component has its own CSS
- **CSS custom properties** - For theming and consistency
- **BEM-like naming** - Block Element Modifier convention
- **Mobile-first responsive** - Design for mobile, enhance for desktop

### Accessibility Styling

```css
/* Focus indicators */
.todo-item:focus-within {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .todo-item {
    border: 1px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .confirm-dialog-overlay {
    animation: none;
  }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

#### Tests Fail
```bash
# Clear test cache
npm test -- --clearCache

# Run tests in verbose mode
npm test -- --verbose
```

#### Dev Server Issues
```bash
# Try different port
npm run dev -- --port 3000

# Clear browser cache
# Hard refresh (Ctrl+Shift+R)
```

#### localStorage Issues
```bash
# Clear localStorage in browser dev tools
console.clear()
localStorage.clear()
```

### Getting Help

1. **Check existing issues** on GitHub
2. **Read the documentation** in `docs/`
3. **Check test files** for usage examples
4. **Ask in discussions** or create an issue

## 📚 Learning Resources

### React
- [React Documentation](https://react.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React DevTools](https://react.dev/learn/react-developer-tools)

### Testing
- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com)
- [Playwright Documentation](https://playwright.dev)

### Accessibility
- [Web Accessibility Initiative](https://www.w3.org/WAI/)
- [WCAG Guidelines](https://www.w3.org/TR/WCAG21/)
- [React Accessibility](https://react.dev/learn/accessibility)

### Performance
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Bundle Analysis](https://web.dev/reduce-bundle-size/)

## 🤝 Contributing

See the main README.md for contribution guidelines.

### Code Review Checklist

- [ ] **Tests pass** - All tests are green
- [ ] **Linting passes** - No ESLint errors
- [ ] **Accessibility** - Screen reader tested
- [ ] **Performance** - No performance regressions
- [ ] **Documentation** - Code is well-documented
- [ ] **Cross-browser** - Tested in multiple browsers
