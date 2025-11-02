# Todo UI Application

A modern, accessible, and performant Todo application built with React, Vite, and comprehensive testing.

![Todo App Screenshot](./docs/screenshot.png)

## 🚀 Features

### Core Functionality
- ✅ **Add Tasks** - Create new todo items with optional due dates
- ✅ **View Tasks** - Display all todos with completion status
- ✅ **Mark Complete** - Toggle task completion with visual feedback
- ✅ **Remove Tasks** - Delete tasks with confirmation dialog
- ✅ **Filter by Due Date** - Show only tasks due today

### Advanced Features
- ✅ **Duplicate Prevention** - Prevents adding identical tasks (case-insensitive, whitespace-trimmed)
- ✅ **Persistent Storage** - Saves todos to localStorage with graceful fallback
- ✅ **Error Boundaries** - Comprehensive error handling and recovery
- ✅ **Accessibility First** - Full WCAG compliance with ARIA support
- ✅ **Keyboard Navigation** - Complete keyboard accessibility
- ✅ **Screen Reader Support** - Live announcements for all interactions

### Technical Excellence
- ✅ **Performance Optimized** - React.memo, useCallback, useMemo throughout
- ✅ **Type-Safe Development** - ESLint with strict rules
- ✅ **Comprehensive Testing** - 280+ tests with 86%+ coverage
- ✅ **Cross-Browser Compatible** - Tested on Chrome, Firefox, Safari
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Modern Build Tools** - Vite for fast development and optimized production builds

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Hooks
- **Build Tool**: Vite
- **Testing Framework**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Code Quality**: ESLint (Flat Config)
- **Styling**: CSS with accessibility-first design
- **Package Manager**: npm
- **Storage**: localStorage with error handling

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-url>/apps/todo/ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🧪 Testing

### Unit & Component Tests
```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test tests/components/TodoApp.test.jsx
```

### End-to-End Tests
```bash
# Run E2E tests
npm run e2e

# Run E2E tests in headed mode (see browser)
npm run e2e:headed

# Run E2E tests in specific browser
npm run e2e -- --project=chromium
```

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── TodoApp.jsx          # Main application component
│   ├── AddTodoForm.jsx      # Form for adding new todos
│   ├── TodoList.jsx         # List container for todos
│   ├── TodoItem.jsx         # Individual todo item
│   ├── TodoFilters.jsx      # Filter controls
│   ├── ConfirmDialog.jsx    # Confirmation modal
│   └── ErrorBoundary.jsx    # Error boundary wrapper
├── hooks/
│   ├── useTodos.js          # Main todo state management
│   └── useLocalStorage.js   # localStorage persistence
├── utils/
│   ├── dateUtils.js         # Date formatting and validation
│   ├── accessibility.js     # Accessibility helpers
│   └── errorHandling.js     # Error handling utilities
├── index.jsx                # Application entry point
├── index.css                # Global styles
└── test-setup.js           # Test environment configuration
```

### State Management
- **useTodos Hook**: Central state management with localStorage persistence
- **useLocalStorage Hook**: Robust localStorage wrapper with error handling
- **Error Boundaries**: React error boundaries for graceful failure handling

### Data Flow
1. User interacts with UI components
2. Components call hook methods (addTodo, toggleTodo, etc.)
3. Hook validates input and updates state
4. State changes trigger localStorage persistence
5. UI re-renders with updated data
6. Screen readers announced changes via ARIA live regions

## 🎨 Styling & Accessibility

### Design Principles
- **Mobile-First**: Responsive design that works on all screen sizes
- **High Contrast**: Meets WCAG AA contrast requirements
- **Focus Management**: Clear focus indicators and logical tab order
- **Reduced Motion**: Respects user's motion preferences
- **Semantic HTML**: Proper heading hierarchy and ARIA attributes

### Accessibility Features
- **Keyboard Navigation**: All interactions work with keyboard
- **Screen Reader Support**: Live announcements for dynamic content
- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Skip Links**: Quick navigation for screen reader users
- **Error Announcements**: Immediate feedback for validation errors
- **Focus Trapping**: Modal dialogs trap focus appropriately

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm test                # Run unit tests
npm run test:coverage   # Run tests with coverage
npm run e2e             # Run E2E tests
npm run e2e:headed      # Run E2E tests with browser UI

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues automatically
```

### Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Run tests in watch mode**
   ```bash
   npm test -- --watch
   ```

4. **Check code quality**
   ```bash
   npm run lint
   ```

### Project Structure

```
apps/todo/ui/
├── src/                    # Source code
├── tests/                  # Test files
├── e2e/                    # End-to-end tests
├── docs/                   # Documentation
├── package.json            # Dependencies and scripts
├── vite.config.js          # Build configuration
├── vitest.config.js        # Test configuration
├── playwright.config.js    # E2E test configuration
├── eslint.config.js        # Linting configuration
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables
The application uses localStorage for persistence and doesn't require environment variables for basic functionality.

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Performance

### Bundle Analysis
- **Initial Bundle**: ~45KB gzipped
- **Lazy Loading**: No code splitting implemented (single-page app)
- **Runtime Performance**: Optimized with React.memo and useCallback

### Test Coverage
- **Statements**: 86.2%
- **Branches**: 86.66%
- **Functions**: 86.36%
- **Lines**: 86.2%

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm test && npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Code Standards

- **React**: Functional components with hooks
- **JavaScript**: Modern ES6+ syntax
- **Styling**: CSS with BEM-like naming convention
- **Testing**: RTL for components, Vitest for utilities
- **Accessibility**: WCAG AA compliance required

### Commit Convention

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style changes
- refactor: Code refactoring
- test: Testing
- chore: Maintenance
```

## 📚 Documentation

### Developer Documentation
- **[Architecture Overview](./docs/architecture.md)** - System design and patterns
- **[API Documentation](./docs/api.md)** - Components, hooks, and utilities
- **[Development Guide](./docs/development.md)** - Getting started and workflows
- **[Accessibility Guide](./docs/accessibility.md)** - A11y features and compliance

### Project Documentation
- **[Task Specifications](../../specs/002-todo-ui/tasks.md)** - Implementation plan
- **[Test Coverage](./coverage/lcov-report/index.html)** - Detailed test coverage
- **[Browser Compatibility](./docs/browser-compatibility.md)** - Cross-browser testing results

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the blazing fast build tool
- **Testing Library** for accessible testing utilities
- **Playwright** for reliable E2E testing

## 📞 Support

If you have questions or need help:

1. **Check the documentation** - This README and inline code comments
2. **Review existing tests** - They demonstrate expected behavior
3. **Check GitHub Issues** - Existing bugs and feature requests
4. **Create an Issue** - For bugs or feature requests

---

**Built with ❤️ using React, Vite, and modern web standards**
