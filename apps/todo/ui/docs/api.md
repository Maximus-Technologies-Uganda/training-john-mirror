# API Documentation

This document provides comprehensive API documentation for the Todo UI application's components, hooks, and utilities.

## 🎣 Hooks

### useTodos

The main hook for todo state management and business logic.

#### Signature
```javascript
const {
  todos,
  allTodos,
  filterDueToday,
  error,
  todosCount,
  completedCount,
  pendingCount,
  isStorageAvailable,
  addTodo,
  removeTodo,
  toggleTodo,
  setFilterDueToday,
  clearError
} = useTodos()
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `todos` | `Array<Todo>` | Filtered todo items based on current filters |
| `allTodos` | `Array<Todo>` | All todo items without filtering |
| `filterDueToday` | `boolean` | Whether due-today filter is active |
| `error` | `string \| null` | Current error message or null |
| `todosCount` | `number` | Total number of todos |
| `completedCount` | `number` | Number of completed todos |
| `pendingCount` | `number` | Number of pending todos |
| `isStorageAvailable` | `boolean` | Whether localStorage is available |
| `addTodo` | `function` | Add a new todo |
| `removeTodo` | `function` | Remove a todo by ID |
| `toggleTodo` | `function` | Toggle completion status |
| `setFilterDueToday` | `function` | Set due-today filter |
| `clearError` | `function` | Clear current error message |

#### Methods

##### addTodo(text, dueDate, priority)
Adds a new todo item.

**Parameters:**
- `text` (string): Todo description (required)
- `dueDate` (string): ISO date string or null
- `priority` (string): Priority level, defaults to 'normal'

**Returns:** `boolean` - Success status

**Throws:** Error if duplicate todo exists

##### removeTodo(id)
Removes a todo item by ID.

**Parameters:**
- `id` (number): Todo ID to remove

**Returns:** `boolean` - Success status

##### toggleTodo(id)
Toggles the completion status of a todo.

**Parameters:**
- `id` (number): Todo ID to toggle

**Returns:** `boolean` - Success status

##### setFilterDueToday(enabled)
Sets the due-today filter.

**Parameters:**
- `enabled` (boolean): Whether to filter by due today

##### clearError()
Clears the current error message.

### useLocalStorage

Custom hook for localStorage persistence with error handling.

#### Signature
```javascript
const [value, setValue, isStorageAvailable] = useLocalStorage(key, defaultValue, onError)
```

#### Parameters
- `key` (string): localStorage key
- `defaultValue` (any): Default value if key doesn't exist
- `onError` (function): Error handler function

#### Returns
- `value` (any): Current stored value
- `setValue` (function): Function to update value
- `isStorageAvailable` (boolean): Whether localStorage is available

## 🧩 Components

### TodoApp

Main application component that orchestrates all functionality.

#### Props
None - uses internal hooks for state management.

#### Structure
```jsx
<div className="todo-app">
  {/* Skip link for accessibility */}
  <a href="#main-content" className="skip-link">Skip to main content</a>

  {/* Header with title and statistics */}
  <header className="todo-header">
    <h1>To-Do App</h1>
    <div className="todo-stats" aria-live="polite">
      <span>Total: {todosCount}</span>
      <span>Completed: {completedCount}</span>
      <span>Pending: {pendingCount}</span>
    </div>
  </header>

  {/* Error display */}
  {error && (
    <div className="todo-error" role="alert" aria-live="assertive">
      <p>{error}</p>
      <button onClick={clearError} aria-label="Clear error message">×</button>
    </div>
  )}

  {/* Storage warning */}
  {!isStorageAvailable && (
    <div className="todo-warning" role="alert" aria-live="polite">
      <p>⚠️ Local storage is not available. Your todos will not be saved between sessions.</p>
    </div>
  )}

  {/* Main content */}
  <main id="main-content" className="todo-main">
    <AddTodoForm onSubmit={handleAddTodo} />
    <TodoFilters
      filterDueToday={filterDueToday}
      onFilterChange={setFilterDueToday}
      todoCount={todosCount}
      filteredCount={todos.length}
    />
    <TodoList
      todos={todos}
      onToggle={handleToggleTodo}
      onRemove={handleRemoveTodo}
      emptyStateMessage={/* contextual message */}
    />
  </main>

  {/* Footer */}
  <footer className="todo-footer">
    <p>Todo App - Manage your tasks efficiently</p>
  </footer>
</div>
```

### AddTodoForm

Form component for adding new todo items.

#### Props
```javascript
interface AddTodoFormProps {
  onSubmit?: (text: string, dueDate: string | null) => boolean;
  onCancel?: () => void;
}
```

#### Features
- Text input with validation
- Optional due date picker
- Error display
- Loading states
- Keyboard submission (Enter)
- Accessibility labels

### TodoList

Container component for displaying a list of todos.

#### Props
```javascript
interface TodoListProps {
  todos: Array<Todo>;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  emptyStateMessage?: string;
}
```

#### Todo Interface
```javascript
interface Todo {
  id: number;
  text: string;
  done: boolean;
  dueDate: string | null; // ISO date string
  priority: 'normal' | 'high';
}
```

### TodoItem

Individual todo item component.

#### Props
```javascript
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}
```

#### Features
- Visual completion state
- Toggle button with proper ARIA attributes
- Remove button with confirmation dialog
- Due date display (formatted)
- Keyboard navigation support

### TodoFilters

Filter controls component.

#### Props
```javascript
interface TodoFiltersProps {
  filterDueToday: boolean;
  onFilterChange: (enabled: boolean) => void;
  todoCount: number;
  filteredCount: number;
}
```

#### Features
- Checkbox for due-today filter
- Dynamic count display
- Clear filter button
- Accessibility attributes

### ConfirmDialog

Modal confirmation dialog component.

#### Props
```javascript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}
```

#### Features
- Modal overlay
- Keyboard navigation (Enter/Escape)
- Focus trapping
- Accessible ARIA attributes

### ErrorBoundary

React error boundary component for graceful error handling.

#### Props
```javascript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

#### Features
- Catches JavaScript errors
- Fallback UI display
- Error logging
- Recovery options
- Development error details

## 🛠️ Utilities

### dateUtils

Date manipulation and formatting utilities.

#### Functions

##### formatDateISO(date)
Formats a date to ISO string.

**Parameters:** `date` (Date | string)
**Returns:** `string` - ISO date string

##### formatDateDisplay(date, options?)
Formats a date for display.

**Parameters:**
- `date` (string): ISO date string
- `options` (object): Formatting options
**Returns:** `string` - Formatted date string

##### isToday(date)
Checks if a date is today.

**Parameters:** `date` (Date | string)
**Returns:** `boolean`

##### isDueToday(dueDate)
Checks if a due date falls on today.

**Parameters:** `dueDate` (string | null)
**Returns:** `boolean`

### accessibility

Accessibility helper functions.

#### Functions

##### announceToScreenReader(message, priority, role)
Announces a message to screen readers.

**Parameters:**
- `message` (string): Message to announce
- `priority` ('polite' | 'assertive'): Announcement priority
- `role` (string): ARIA role for announcement

##### getAriaAttributes(label, describedBy, required, errorId)
Generates comprehensive ARIA attributes.

**Parameters:**
- `label` (string): Accessible label
- `describedBy` (string?): ID of describing element
- `required` (boolean?): Whether field is required
- `errorId` (string?): ID of error message element

**Returns:** Object with ARIA attributes

##### trapFocus(container, onEscape)
Traps focus within a container.

**Parameters:**
- `container` (HTMLElement): Container element
- `onEscape` (function): Escape key handler

**Returns:** Cleanup function

### errorHandling

Error handling and recovery utilities.

#### Functions

##### safeExecute(fn, fallback, errorMessage)
Safely executes a function with error handling.

**Parameters:**
- `fn` (function): Function to execute
- `fallback` (any): Fallback value
- `errorMessage` (string): Error message for logging

**Returns:** Result of function or fallback

##### safeJsonParse(jsonString, fallback)
Safely parses JSON.

**Parameters:**
- `jsonString` (string): JSON string to parse
- `fallback` (any): Fallback value

**Returns:** Parsed object or fallback

##### safeJsonStringify(obj, fallback)
Safely stringifies to JSON.

**Parameters:**
- `obj` (any): Object to stringify
- `fallback` (string): Fallback string

**Returns:** JSON string or fallback

##### localStorageUtils
Object with safe localStorage operations.

```javascript
const localStorageUtils = {
  getItem: (key, fallback?) => any,
  setItem: (key, value) => boolean,
  removeItem: (key) => boolean,
  isAvailable: () => boolean
}
```

##### withRetry(operation, maxRetries, delay)
Executes operation with retry logic.

**Parameters:**
- `operation` (function): Async operation to retry
- `maxRetries` (number): Maximum retry attempts
- `delay` (number): Delay between retries

**Returns:** Promise resolving to operation result

##### debounce(func, delay)
Creates a debounced version of a function.

**Parameters:**
- `func` (function): Function to debounce
- `delay` (number): Delay in milliseconds

**Returns:** Debounced function
