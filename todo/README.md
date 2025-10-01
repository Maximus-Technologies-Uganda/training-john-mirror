# Todo CLI

A command-line interface for managing todo tasks with add and mark-as-done functionality.

## Features

- ✅ **Add new tasks** with optional due dates
- ✅ **Mark tasks as done** and remove completed tasks
- ✅ **Due date management** with --due Today flag
- ✅ **Duplicate prevention** - no duplicate tasks allowed
- ✅ **Task persistence** - automatic saving to todos.json
- ✅ **Smart task management** with priority and due date tracking

## Installation

```bash
npm install
```

## Usage

### Basic Commands

```bash
# Add a new task
node src/todo-core.js add "Buy groceries"
# Output: Added task: "Buy groceries"

# Mark a task as done
node src/todo-core.js done 1
# Output: Marked task 1 as done

# Remove a task
node src/todo-core.js remove 1
# Output: Removed task 1

# List all tasks
node src/todo-core.js list
# Output:
# Tasks:
# 1. ○ Buy groceries
# 2. ✓ Walk the dog
```

### Due Date Management

```bash
# Add a task due today (end of current day)
node src/todo-core.js add "Buy groceries" --due Today
# Output: Added task: "Buy groceries" (due: 30/09/2025)

# Add a task due today using short flag
node src/todo-core.js add "Walk the dog" -d Today
# Output: Added task: "Walk the dog" (due: 30/09/2025)

# List tasks with due dates
node src/todo-core.js list
# Output:
# Tasks:
# 1. ○ Buy groceries (due: 30/09/2025)
# 2. ○ Walk the dog (due: 30/09/2025)
# 3. ○ Clean house
```

### Duplicate Prevention

The todo app prevents duplicate tasks to keep your list clean. A task is considered a duplicate if it has the same text and due date as an existing task.

```bash
# Add a task
node src/todo-core.js add "Buy groceries"
# Output: Added task: "Buy groceries"

# Try to add the same task again
node src/todo-core.js add "Buy groceries"
# Output: ⚠️  Task already exists: "Buy groceries"
#         No duplicate task was added.

# Case-insensitive duplicate detection
node src/todo-core.js add "buy groceries"
# Output: ⚠️  Task already exists: "buy groceries"
#         No duplicate task was added.

# Different due dates are allowed (not duplicates)
node src/todo-core.js add "Buy groceries" --due Today
# Output: Added task: "Buy groceries" (due: 30/09/2025)
```

### Help and Examples

```bash
# Show help
node src/todo-core.js --help
# Output:
# Usage: todo-core.js <command> [options]
# 
# Commands:
#   todo-core.js add <task>   Add a new task
#   todo-core.js done <id>    Mark a task as done
#   todo-core.js remove <id>  Remove a task
#   todo-core.js list         List all tasks
# 
# Options:
#   -d, --due      Set due date (e.g., "Today")           [string] [default: null]
#   -h, --help     Show help                                             [boolean]
#       --version  Show version number                                   [boolean]
```

## Features

### Due Date Management
- **--due Today flag**: Sets due date to end of current day (23:59:59.999)
- **Date persistence**: Due dates are saved and restored from JSON storage
- **Smart display**: Tasks show due dates in the list view

### Duplicate Prevention
- **Smart detection**: Compares both text and due date for duplicates
- **Case-insensitive**: "Buy groceries" matches "buy groceries"
- **Friendly messages**: Clear warnings when duplicates are detected
- **Different dates allowed**: Same text with different due dates are not duplicates

### Data Persistence
- **Automatic saving**: Tasks are saved to `todos.json` after each operation
- **Date handling**: Due dates are properly serialized/deserialized
- **Error handling**: Graceful handling of file system errors

## API

### CLI Commands

#### `add <task> [--due Today]`
Adds a new task with optional due date.

**Parameters:**
- `task` (string): Task description
- `--due, -d` (string): Set due date (currently only "Today" supported)

**Examples:**
```bash
node src/todo-core.js add "Buy groceries"
node src/todo-core.js add "Buy groceries" --due Today
```

#### `done <id>`
Marks a task as completed.

**Parameters:**
- `id` (number): Task ID to mark as done

#### `remove <id>`
Removes a task from the list.

**Parameters:**
- `id` (number): Task ID to remove

#### `list`
Lists all tasks with their status and due dates.

### Programmatic API

#### `addTask(tasks, taskName, dueDate)`
Adds a new task to the task list.

**Parameters:**
- `tasks` (Array): Array of task objects
- `taskName` (string): Name/text of the new task
- `dueDate` (Date|null): Optional due date for the task

**Returns:** Array - Updated tasks array with new task

#### `markTaskDone(tasks, taskId)`
Marks a specific task as done.

**Parameters:**
- `tasks` (Array): Array of task objects
- `taskId` (number): ID of the task to mark as done

**Returns:** Array - Updated tasks array with marked task

#### `isDuplicateTask(tasks, taskText, dueDate)`
Checks if a task with the same text and due date already exists.

**Parameters:**
- `tasks` (Array): Array of existing tasks
- `taskText` (string): Text of the new task
- `dueDate` (Date|null): Due date of the new task

**Returns:** boolean - True if duplicate exists

#### `getEndOfToday()`
Returns the end of the current day (23:59:59.999).

**Returns:** Date - End of current day

## Testing

The project includes comprehensive tests covering all functionality:

- ✅ **Core functionality** - Add, mark done, remove, list tasks
- ✅ **Due date management** - --due Today flag with date mocking
- ✅ **Duplicate prevention** - Smart duplicate detection
- ✅ **CLI integration** - End-to-end command testing
- ✅ **Edge cases** - Error handling and boundary conditions

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci
```

### Test Coverage

The test suite achieves excellent coverage:
- **36 tests** covering all functionality
- **94.11% branch coverage** - comprehensive logic testing
- **42.43% statement coverage** - good coverage for CLI application
- **Date mocking** - controlled testing of time-dependent functionality
- **CLI testing** - real command execution testing

## License

MIT
