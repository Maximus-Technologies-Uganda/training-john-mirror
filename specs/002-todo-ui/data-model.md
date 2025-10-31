# Data Model: To-Do UI Implementation

**Date**: 2025-10-31
**Context**: Data structures and validation rules for the To-Do UI feature

## Entities

### Task (Todo Item)

**Purpose**: Represents a single to-do item with all its properties and state.

**Fields**:
- `id` (number, required): Unique identifier, auto-incremented
- `text` (string, required): Task description, trimmed and validated
- `done` (boolean, required): Completion status, defaults to false
- `dueDate` (Date|null, optional): Due date, normalized to Date object or null
- `priority` (string, optional): Priority level, enum: 'normal' | 'high', defaults to 'normal'

**Validation Rules**:
- `text`: Must be non-empty string after trimming, max length TBD
- `dueDate`: Must be valid Date object or null/falsy
- `id`: Must be positive integer
- `done`: Must be boolean
- `priority`: Must be one of allowed enum values

**State Transitions**:
- Created → Active (initial state)
- Active ↔ Completed (toggle via mark done)
- Completed → Deleted (via remove)

**Relationships**: None (flat list structure)

### Task List (Collection)

**Purpose**: Ordered collection of Task entities with filtering and sorting capabilities.

**Fields**:
- `tasks` (Array<Task>, required): Array of Task objects

**Validation Rules**:
- Must be array of valid Task objects
- No duplicate tasks (based on text + dueDate combination)

**Operations**:
- Add: Append new Task, check for duplicates
- Remove: Filter out Task by ID
- Update: Modify Task properties (e.g., done status)
- Filter: Return subset based on criteria (due date, priority)
- Sort: Order by priority (high first), then by ID

### UI State

**Purpose**: Client-side state for UI interactions and user preferences.

**Fields**:
- `filterDueToday` (boolean, optional): Whether to show only today's tasks
- `isLoading` (boolean, optional): Loading state for async operations
- `error` (string|null, optional): Current error message for aria-live region
- `focusedTaskId` (number|null, optional): Currently focused task for keyboard navigation

**Validation Rules**:
- `error`: String or null
- `focusedTaskId`: Positive integer or null

## Data Flow

### Persistence Layer
- **Storage**: Browser localStorage
- **Format**: JSON serialization with Date handling
- **Key**: 'todo-tasks' (configurable)
- **Fallback**: In-memory state if localStorage unavailable/quota exceeded

### Business Logic Layer
- **Import**: All functions from `src/todo-core.js`
- **Operations**: addTask, markTaskDone, removeTask, listTasks
- **Validation**: Duplicate checking, required field validation
- **Error Handling**: Structured error responses with success/error fields

### UI Layer
- **State Management**: React hooks (useState, useEffect, useContext)
- **Data Binding**: Controlled components with validation
- **Updates**: Optimistic updates with error rollback
- **Synchronization**: localStorage sync on state changes

## Schema Contracts

### Task JSON Schema
```json
{
  "type": "object",
  "properties": {
    "id": { "type": "number", "minimum": 1 },
    "text": { "type": "string", "minLength": 1, "maxLength": 1000 },
    "done": { "type": "boolean" },
    "dueDate": { "type": ["string", "null"], "format": "date-time" },
    "priority": { "type": "string", "enum": ["normal", "high"] }
  },
  "required": ["id", "text", "done"]
}
```

### Task List JSON Schema
```json
{
  "type": "array",
  "items": { "$ref": "#/definitions/Task" },
  "uniqueItems": true
}
```

## Validation Rules Summary

| Rule Type | Implementation | Error Message |
|-----------|----------------|----------------|
| **Duplicate Task** | Compare normalized text + dueDate | "Error: Duplicate to-do item found." |
| **Empty Text** | Trim and check length > 0 | "Error: To-do text is required." |
| **Invalid ID** | Check positive integer | "Error: Valid numeric id is required..." |
| **Storage Error** | Try/catch localStorage operations | Graceful fallback to memory |

## Performance Considerations

- **List Rendering**: Memoize filtered/sorted results
- **Updates**: Debounce rapid operations (add/remove clicks)
- **Persistence**: Throttle localStorage writes (every 500ms)
- **Memory**: Limit to 100 tasks for performance
- **Search/Filter**: Client-side only, no server requests
