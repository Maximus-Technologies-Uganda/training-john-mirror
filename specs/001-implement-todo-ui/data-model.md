# Data Model: Tuesday: To-Do UI Implementation

## Entity: Task
- **Fields**:
  - `id: number` – Stable identifier assigned by `todo-core`.
  - `text: string` – Normalized description (trimmed, case-insensitive for duplicate checks).
  - `dueDate: Date | null` – JavaScript `Date` instance or ISO string in persisted snapshots.
  - `done: boolean` – Completion status toggled via UI.
  - `priority: "high" | "normal"` – Preserved from core (default `normal`).
- **Relationships**: Owned by the in-memory `TaskCollection`.
- **Validation**: Non-empty trimmed text, valid parseable due date, duplicates blocked on `text + dueDate` pair via `todo-core`.

## Entity: TaskCollection
- **Fields**:
  - `items: Task[]` – Source of truth managed by reducer.
  - `lastUpdated: Date` – Timestamp of most recent successful mutation (used for diagnostics).
- **Operations**:
  - `add(text, dueDate, priority)` → delegates to `todo-core.addTask`.
  - `toggleDone(taskId)` → uses `todo-core.markTaskDone` (with revert path via additional reducer action).
  - `remove(taskId)` → uses `todo-core.removeTask`.
  - `list()` → clones sorted array via `todo-core.sortTodosForList`.

## Entity: ViewState
- **Fields**:
  - `filter: "all" | "dueToday"` – Current filter selection.
  - `filteredTasks: Task[]` – Derived tasks; recomputed via selector.
  - `activeDate: Date` – “Now” value from `clockService` used for dueToday comparisons.
  - `liveMessage: FeedbackMessage | null` – Current aria-live payload.
  - `form: { text: string; dueDate: string }` – Controlled form inputs.
- **Transitions**:
  - `applyFilter(filter)` recalculates `filteredTasks` using `clockService.now()`.
  - `recordMessage(message)` updates `liveMessage` and auto-clears on next success.

## Entity: FeedbackMessage
- **Fields**:
  - `kind: "error" | "success" | "info"`
  - `text: string`
  - `timestamp: Date`
- **Usage**: Rendered inside `LiveRegion` component to satisfy aria-live requirements.

## Supporting Types
- `ClockService`: `{ now(): Date; setTestNow(date: Date): void; reset(): void }`
- `DueFilterResult`: `{ visible: Task[]; hiddenCount: number; label: string }`

