# Architecture Overview

## System Architecture

The Todo UI application follows a modern React architecture with clear separation of concerns, comprehensive error handling, and accessibility-first design.

## 🏗️ Architectural Patterns

### Component Architecture
- **Container/Presentational Pattern**: Components are divided into logic-heavy containers and UI-focused presentational components
- **Compound Components**: Related components work together through shared context
- **Render Props**: Flexible component composition where needed

### State Management
- **Custom Hooks**: Business logic encapsulated in reusable hooks
- **Local State**: Component-level state for UI concerns
- **Persistent State**: localStorage-backed state with error handling

### Error Handling
- **Error Boundaries**: React error boundaries for crash recovery
- **Graceful Degradation**: App continues functioning when storage fails
- **User Feedback**: Clear error messages and recovery options

## 📁 Directory Structure

```
src/
├── components/          # UI components
│   ├── TodoApp.jsx     # Main app container
│   ├── AddTodoForm.jsx # Form component
│   ├── TodoList.jsx    # List container
│   ├── TodoItem.jsx    # List item
│   ├── TodoFilters.jsx # Filter controls
│   ├── ConfirmDialog.jsx # Modal dialog
│   └── ErrorBoundary.jsx # Error boundary
├── hooks/              # Custom hooks
│   ├── useTodos.js     # Main business logic
│   └── useLocalStorage.js # Storage abstraction
├── utils/              # Utility functions
│   ├── dateUtils.js    # Date operations
│   ├── accessibility.js # A11y helpers
│   └── errorHandling.js # Error utilities
└── *.test.js          # Colocated tests
```

## 🔄 Data Flow

### State Flow
```
User Interaction → Component → Hook Method → State Update → localStorage → Re-render → Screen Reader
```

### Error Flow
```
Error Occurs → Error Boundary → Fallback UI → User Action → Recovery Attempt
```

## 🧩 Component Relationships

### TodoApp (Container)
- **Purpose**: Main application orchestrator
- **Responsibilities**:
  - State management coordination
  - Error display
  - Layout structure
  - Accessibility announcements
- **Dependencies**: All hooks and child components

### AddTodoForm (Form)
- **Purpose**: Todo creation interface
- **Responsibilities**:
  - Input validation
  - Form submission
  - Error display
  - Accessibility
- **Dependencies**: useTodos hook, accessibility utils

### TodoList (Container)
- **Purpose**: Todo display container
- **Responsibilities**:
  - Empty state handling
  - List rendering
  - Count display
  - ARIA labeling
- **Dependencies**: TodoItem component

### TodoItem (Presentational)
- **Purpose**: Individual todo display
- **Responsibilities**:
  - Visual representation
  - Interaction handling
  - Confirmation dialogs
  - Keyboard navigation
- **Dependencies**: ConfirmDialog, accessibility utils

### TodoFilters (Presentational)
- **Purpose**: Filter controls
- **Responsibilities**:
  - Filter state display
  - User interaction
  - Count calculations
  - ARIA attributes
- **Dependencies**: None (pure component)

## 🔧 Key Design Decisions

### Custom Hooks for Logic Separation
```javascript
// Business logic separated from UI concerns
function useTodos() {
  // State management
  // Validation logic
  // Persistence logic
  // Error handling
}
```

### Error Boundaries for Resilience
```javascript
// Wrap entire app for crash recovery
<ErrorBoundary>
  <TodoApp />
</ErrorBoundary>
```

### Accessibility-First Development
```javascript
// Every component includes accessibility features
function TodoItem({ todo, onToggle, onRemove }) {
  return (
    <div role="listitem">
      <button
        aria-label={`Mark as ${todo.done ? 'incomplete' : 'complete'}`}
        aria-pressed={todo.done}
      >
        {/* Content */}
      </button>
    </div>
  )
}
```

### Comprehensive Testing Strategy
```javascript
// Unit tests for utilities
// Component tests for UI
// Integration tests for workflows
// E2E tests for critical paths
```

## 🚀 Performance Optimizations

### React Optimizations
- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Stabilizes function references
- **useMemo**: Caches expensive computations

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Dynamic imports where beneficial
- **Minification**: Production build optimization

### Runtime Performance
- **Debounced Operations**: Rate limiting for performance
- **Efficient Updates**: Targeted state updates
- **Memory Management**: Cleanup in useEffect

## 🔒 Security Considerations

### Content Security Policy
- **Script Injection Prevention**: Proper input sanitization
- **XSS Protection**: React's automatic escaping
- **Safe JSON Operations**: Error-handled parsing

### Data Protection
- **Local Storage Security**: Sensitive data not stored
- **Input Validation**: All user inputs validated
- **Error Information**: Stack traces hidden in production

## 🧪 Testing Strategy

### Unit Testing
- **Utility Functions**: Pure functions tested comprehensively
- **Custom Hooks**: State logic tested in isolation
- **Error Handling**: Failure scenarios covered

### Component Testing
- **Rendering**: Correct output for all props
- **Interactions**: User events handled properly
- **Accessibility**: ARIA attributes and keyboard navigation
- **Error States**: Graceful error handling

### Integration Testing
- **Component Communication**: Props and callbacks
- **Hook Integration**: State management workflows
- **Error Boundaries**: Error recovery scenarios

### End-to-End Testing
- **Critical User Journeys**: Complete workflows
- **Cross-Browser**: Compatibility validation
- **Accessibility**: Screen reader compatibility

## 📊 Quality Metrics

### Code Quality
- **ESLint**: Strict linting rules enforced
- **TypeScript**: Type safety where beneficial
- **Code Coverage**: 86%+ test coverage required

### Performance Metrics
- **Bundle Size**: Monitored and optimized
- **Runtime Performance**: React DevTools profiling
- **Accessibility Score**: Automated auditing

### Maintainability
- **Documentation**: Comprehensive inline and external docs
- **Modular Architecture**: Clear separation of concerns
- **Consistent Patterns**: Established conventions followed
