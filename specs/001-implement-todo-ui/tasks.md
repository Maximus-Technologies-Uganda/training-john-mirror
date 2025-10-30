# Tasks: Tuesday: To-Do UI Implementation (Deterministic & Boundaries)

**Input**: Design documents from `/specs/001-implement-todo-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: RTL component coverage (≥60% statements) and Playwright smoke test are mandatory.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency)
- **[Story]**: User story label (`US1`, `US2`, `US3`)
- Include exact file paths for every implementation task

## Path Conventions

- Shared core wrapper: `apps/todo/core/`
- UI source: `apps/todo/ui/src/`
- UI component tests: `apps/todo/ui/tests/`
- Playwright smoke tests: `apps/todo/ui/playwright/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish shared packages, project skeleton, and workspace scripts.

- [ ] T001 Create TypeScript wrapper package for todo core exports in `apps/todo/core/{package.json,tsconfig.json,src/index.ts}`.
- [ ] T002 [P] Scaffold Vite React TypeScript UI skeleton in `apps/todo/ui/` (package.json, tsconfig.json, vite.config.ts, index.html, `src/main.tsx`, `src/App.tsx`, `src/styles/app.css`).
- [ ] T003 [P] Update root `package.json` and `apps/todo/ui/package.json` scripts for `dev`, `test`, `test:e2e`, and register the new workspace packages.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before user story implementation.

- [ ] T004 Configure Vitest + React Testing Library environment in `apps/todo/ui/vitest.config.ts` and `apps/todo/ui/tests/setup.ts` with coverage output to `review-artifacts/`.
- [ ] T005 [P] Configure Playwright project scaffold in `apps/todo/ui/playwright.config.ts` and add npm scripts for smoke runs and trace uploads.
- [ ] T006 [P] Implement deterministic `clockService` with override hooks in `apps/todo/ui/src/utils/clockService.ts`.
- [ ] T007 Implement reducer, action types, and state helpers backed by `@training/todo-core` in `apps/todo/ui/src/state/taskReducer.ts`.
- [ ] T008 [P] Build accessible `LiveRegion` component and message store in `apps/todo/ui/src/components/LiveRegion.tsx`.

---

## Phase 3: User Story 1 - Add and View Tasks Reliably (Priority: P1) 🎯 MVP

**Goal**: Users can add tasks with due dates, see them rendered once, and receive aria-live errors when duplicates occur.

**Independent Test**: Submitting a unique task increases list length and displays task details; repeating the same text/date surfaces an aria-live duplicate error without adding the task.

### Tests for User Story 1 (write first)

- [ ] T009 [P] [US1] Author RTL test for add flow increasing list length in `apps/todo/ui/tests/components/TodoApp.add.spec.tsx`.
- [ ] T010 [P] [US1] Extend component test to assert duplicate submissions announce aria-live errors in `apps/todo/ui/tests/components/TodoApp.add.spec.tsx`.

### Implementation for User Story 1

- [ ] T011 [US1] Implement controlled `AddTaskForm` with validation, aria labels, and submit handling in `apps/todo/ui/src/components/AddTaskForm.tsx`.
- [ ] T012 [P] [US1] Implement `TaskList` (and `TaskListItem`) rendering sorted tasks in `apps/todo/ui/src/components/TaskList.tsx`.
- [ ] T013 [US1] Compose reducer, LiveRegion, form, and list inside `apps/todo/ui/src/App.tsx`, ensuring duplicate errors push messages without mutating state.
- [ ] T014 [P] [US1] Apply base layout, empty-state messaging, and focus indicators in `apps/todo/ui/src/styles/app.css`.

**Checkpoint**: User Story 1 functional and test suite passing.

---

## Phase 4: User Story 2 - Complete Tasks with Confidence (Priority: P2)

**Goal**: Users can mark tasks done or undo completion while preserving list order and feedback.

**Independent Test**: Toggling a task updates its done state, announces completion, and reverting restores the previous state without duplicating entries.

### Tests for User Story 2 (write first)

- [ ] T015 [P] [US2] Author RTL tests proving toggle-on/toggle-off flows update status and persist after rerender in `apps/todo/ui/tests/components/TodoApp.interactions.spec.tsx`.
- [ ] T015a [P] [US2] Add RTL test ensuring removing a task decreases list length and announces removal in `apps/todo/ui/tests/components/TodoApp.interactions.spec.tsx`.

### Implementation for User Story 2

- [ ] T016 [US2] Add accessible completion and removal controls with status text in `apps/todo/ui/src/components/TaskListItem.tsx`.
- [ ] T017 [P] [US2] Extend reducer actions in `apps/todo/ui/src/state/taskReducer.ts` for mark done, undo, and remove flows.
- [ ] T018 [US2] Surface completion success messaging and focus management in `apps/todo/ui/src/App.tsx`.

**Checkpoint**: User Stories 1 and 2 operate independently with passing tests.

---

## Phase 5: User Story 3 - Focus on Today’s Commitments (Priority: P3)

**Goal**: Users can filter to tasks due today (excluding completed items), observe boundary handling, and revert to the full list.

**Independent Test**: With a fixed clock, tasks from yesterday/today/tomorrow filter correctly; clearing the filter restores the complete list.

### Tests for User Story 3 (write first)

- [ ] T019 [P] [US3] Write RTL test covering yesterday/today/tomorrow boundaries using `vi.setSystemTime` in `apps/todo/ui/tests/components/TodoApp.filter.spec.tsx`.
- [ ] T019a [P] [US3] Add RTL test ensuring removing the sole filtered task reveals the empty-state message in `apps/todo/ui/tests/components/TodoApp.filter.spec.tsx`.

### Implementation for User Story 3

- [ ] T020 [US3] Implement accessible filter controls (toggle/clear) in `apps/todo/ui/src/components/DueFilterControls.tsx`.
- [ ] T021 [P] [US3] Add due-today selector utilities with hidden-count metadata in `apps/todo/ui/src/state/selectors.ts`.
- [ ] T022 [US3] Integrate filter controls, apply selector results, and announce active filter state in `apps/todo/ui/src/App.tsx`.
- [ ] T023 [US3] Implement Playwright smoke test for add → mark done → filter due today → remove in `apps/todo/ui/playwright/todo.smoke.spec.ts` (injecting fake clock).

**Checkpoint**: All user stories deliver independent value with automated coverage.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, documentation, and release readiness.

- [ ] T024 Run accessibility/focus audit and adjust `apps/todo/ui/src/components/AddTaskForm.tsx`, `apps/todo/ui/src/components/TaskListItem.tsx`, and `apps/todo/ui/src/styles/app.css` to satisfy the UX checklist.
- [ ] T025 [P] Update verification docs and quickstart instructions in `specs/001-implement-todo-ui/quickstart.md` and author `apps/todo/ui/README.md`.
- [ ] T026 Collect coverage reports, Playwright traces, and UI screenshots in `review-artifacts/` and summarize verification steps plus links in `PR_TEMPLATE.md` and `CHANGELOG.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → must complete before Foundational.
- **Foundational (Phase 2)** → blocks all user stories.
- **User Stories (Phases 3–5)** → execute in priority order (US1 ⚡ MVP → US2 → US3) once foundational tasks finish; individual stories can run in parallel if different owners.
- **Polish (Phase 6)** → after targeted user stories are complete.

### User Story Dependencies

- **US1** depends on Phase 2 only.
- **US2** depends on US1 components/reducer but maintains independent tests.
- **US3** depends on US1 base UI and clock utilities, can begin after selector scaffolding is available.

### Parallel Opportunities

- Setup tasks T002 and T003 can proceed alongside T001 once wrapper scaffolding begins.
- Foundational tasks marked [P] (T005, T006, T008) may run concurrently after Vitest config.
- Within each user story, tests marked [P] can be authored simultaneously, as can UI components vs selectors touching different files.
- Cross-story parallelism is viable after foundational work; assign separate developers per story to avoid merge conflicts.

---

## Implementation Strategy

### MVP First (User Story 1)
1. Complete Phase 1 & Phase 2 to establish infrastructure.
2. Deliver Phase 3 (US1) with passing RTL tests and duplicate handling.
3. Validate add/list flows manually and via automated tests before moving on.

### Incremental Delivery
1. After MVP, layer US2 to enable completion tracking with minimal overlap.
2. Add US3 for due-today focus and Playwright smoke coverage.
3. Finish with polish tasks to address accessibility, documentation, and release artifacts.

### Parallel Team Strategy
1. One developer owns core wrapper + reducer foundation.
2. Developer A focuses on US1 UI/UX, Developer B on US2 toggles, Developer C on US3 filter + Playwright once foundational utilities land.
3. Reconvene for polish to align documentation and artifacts.

---

## Notes

- Maintain ≥60% statement coverage in `apps/todo/ui/` before merge.
- Ensure aria-live messaging stays deterministic for both success and error flows.
- Playwright smoke test must upload traces to `review-artifacts/playwright/` for PR verification.
- Keep tasks atomic; commit after each completed item or logical group per story.

