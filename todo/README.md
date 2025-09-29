# Todo CLI

A command-line interface for managing todo tasks with add and mark-as-done functionality.

## Features

- Add new tasks
- Mark tasks as done
- Simple task management
- Task persistence

## Installation

```bash
npm install
```

## Usage

```bash
# Add a new task
node src/todo-core.js add "Buy groceries"

# Mark a task as done
node src/todo-core.js done 1

# List all tasks
node src/todo-core.js list
```

## API

### addTask(tasks, taskName)
Adds a new task to the task list.

**Parameters:**
- `tasks` (Array): Array of task objects
- `taskName` (string): Name/text of the new task

**Returns:** Array - Updated tasks array with new task

### markTaskDone(tasks, taskId)
Marks a specific task as done.

**Parameters:**
- `tasks` (Array): Array of task objects
- `taskId` (number): ID of the task to mark as done

**Returns:** Array - Updated tasks array with marked task

## Testing

```bash
npm test
```

## License

MIT
