# Research Log: Tuesday: To-Do UI Implementation

## Decision 1: Shared core packaging strategy
- **Decision**: Publish a thin ESM + TypeScript wrapper under `apps/todo/core/src/index.ts` that re-exports the existing `todo/src/todo-core.js` functions (and accompanying types) for UI consumption.
- **Rationale**: Keeps CLI and UI behavior in lockstep, centralizes duplicate detection rules, and permits TypeScript-aware imports inside the Vite app without copying logic.
- **Alternatives considered**:
  - _Direct relative imports into UI_: Rejected because deep `../../../todo/src/todo-core.js` paths are brittle and do not provide TypeScript typings.
  - _Rewrite core in TypeScript_: Higher risk of regressions and unnecessary churn before UI deadline.

## Decision 2: UI state management approach
- **Decision**: Manage tasks via a `useReducer` hook whose actions delegate to the `todo-core` helpers (`addTask`, `markTaskDone`, `removeTask`) and keep derived views (dueToday filter) as memoized selectors.
- **Rationale**: `useReducer` enables deterministic state transitions that mirror CLI commands and simplifies testing of add/toggle/remove flows with dispatch events.
- **Alternatives considered**:
  - `useState` with inline mutations: Harder to ensure atomic updates and increases duplicate business logic in components.
  - External store libraries (Zustand, Redux): Adds dependencies and boilerplate without benefits at the Week 3 scope.

## Decision 3: Deterministic clock handling
- **Decision**: Centralize “current day” evaluation in a `clockService` module that exposes `now()` and `setTestNow()` helpers, using `vi.setSystemTime` in Vitest and Playwright’s `page.addInitScript` to pin dates during automation.
- **Rationale**: Ensures due-today filters, empty states, and error messaging operate predictably across component and e2e tests, matching the specification’s fake-clock requirement.
- **Alternatives considered**:
  - Rely directly on `new Date()`: Breaks deterministic tests and complicates due-today boundary assertions.
  - Introduce heavy date libraries (moment.js): Unnecessary weight given the light calendar needs.

## Decision 4: Accessibility feedback channel
- **Decision**: Implement a dedicated `LiveRegion` component that renders `role="status" aria-live="polite"` messages driven by reducer state (success/error/info), cleared on next successful action.
- **Rationale**: Guarantees compliance with the accessibility checklist, keeps aria-live messaging consistent, and provides a single location for RTL assertions.
- **Alternatives considered**:
  - Inline alerts per form: Risks multiple simultaneous aria-live announcements and inconsistent screen-reader focus.
  - Toast libraries: Overkill and may violate keyboard focus expectations without extra work.

