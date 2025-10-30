# To-Do UI Implementation Issue Sync (LIN-TODO)

**Status**: Ready for Linear Issue Creation
**Branch**: `001-implement-todo-ui`
**Generated**: 2025-10-30

## Main Feature Issue: LIN-TODO

### Title
**feat(todo-ui): Tuesday: To-Do UI Implementation (Deterministic & Boundaries)**

### Description
```
## Overview
Build a robust and deterministic To-Do UI that connects to Week 2 core logic, focusing on boundary conditions and error handling.

## Objectives
- ✅ Add, List, Done (mark complete), and Remove tasks with full accessibility
- ✅ Implement dueToday filter functionality
- ✅ Prevent duplicate tasks (text + due date) with clear error messaging
- ✅ Meet ≥60% RTL statement coverage
- ✅ Pass Playwright smoke test (add → mark done → filter due today → remove)

## Definition of Done
- To-Do UI fully functional per spec.md and Tuesday's goals
- RTL test coverage ≥60% with coverage index linked in PR
- Playwright smoke test passing with traces uploaded
- PR titled `feat(todo-ui): ... (LIN-TODO)` with screenshots, verification steps, and review packet links

## Priority: High
## Assignee: [Current Developer]
## Due Date: [Set based on Tuesday timeline]
```

### Subissues Structure

---

## Phase 1: Setup Infrastructure (LIN-TODO-1)

### Title
**setup: Establish shared packages and workspace structure**

### Description
```
## Tasks (3 total)
- [ ] T001 Create TypeScript wrapper package for todo core exports in `apps/todo/core/{package.json,tsconfig.json,src/index.ts}`
- [ ] T002 Scaffold Vite React TypeScript UI skeleton in `apps/todo/ui/` (package.json, tsconfig.json, vite.config.ts, index.html, `src/main.tsx`, `src/App.tsx`, `src/styles/app.css`)
- [ ] T003 Update root `package.json` and `apps/todo/ui/package.json` scripts for `dev`, `test`, `test:e2e`, and register new workspace packages

## Acceptance Criteria
- npm workspaces configured for `apps/todo/*`
- Core wrapper exports all `todo-core` functions with TypeScript types
- UI skeleton builds and serves without errors
- All workspace scripts functional

## Priority: High
## Parent: LIN-TODO
```

---

## Phase 2: Foundation Layer (LIN-TODO-2)

### Title
**foundation: Core infrastructure and testing setup**

### Description
```
## Tasks (5 total)
- [ ] T004 Configure Vitest + React Testing Library environment in `apps/todo/ui/vitest.config.ts` and `apps/todo/ui/tests/setup.ts` with coverage output to `review-artifacts/`
- [ ] T005 Configure Playwright project scaffold in `apps/todo/ui/playwright.config.ts` and add npm scripts for smoke runs and trace uploads
- [ ] T006 Implement deterministic `clockService` with override hooks in `apps/todo/ui/src/utils/clockService.ts`
- [ ] T007 Implement reducer, action types, and state helpers backed by `@training/todo-core` in `apps/todo/ui/src/state/taskReducer.ts`
- [ ] T008 Build accessible `LiveRegion` component and message store in `apps/todo/ui/src/components/LiveRegion.tsx`

## Acceptance Criteria
- Vitest runs with RTL and generates coverage reports
- Playwright scaffold configured for e2e testing
- Clock service allows deterministic time injection
- Reducer integrates with todo-core for all CRUD operations
- LiveRegion component announces success/error messages

## Priority: High
## Parent: LIN-TODO
```

---

## Phase 3: User Story 1 - MVP (LIN-TODO-3)

### Title
**feat: Add and View Tasks Reliably (US1) - MVP Core**

### Description
```
## Goal
Users can add tasks with due dates, see them rendered once, and receive aria-live errors when duplicates occur.

## Tasks (6 total)
### Tests (2)
- [ ] T009 Author RTL test for add flow increasing list length in `apps/todo/ui/tests/components/TodoApp.add.spec.tsx`
- [ ] T010 Extend component test to assert duplicate submissions announce aria-live errors in `apps/todo/ui/tests/components/TodoApp.add.spec.tsx`

### Implementation (4)
- [ ] T011 Implement controlled `AddTaskForm` with validation, aria labels, and submit handling in `apps/todo/ui/src/components/AddTaskForm.tsx`
- [ ] T012 Implement `TaskList` (and `TaskListItem`) rendering sorted tasks in `apps/todo/ui/src/components/TaskList.tsx`
- [ ] T013 Compose reducer, LiveRegion, form, and list inside `apps/todo/ui/src/App.tsx`, ensuring duplicate errors push messages without mutating state
- [ ] T014 Apply base layout, empty-state messaging, and focus indicators in `apps/todo/ui/src/styles/app.css`

## Independent Test Criteria
- Submitting unique task increases list length and displays task details
- Repeating same text/date surfaces aria-live duplicate error without adding task

## Acceptance Criteria
- Add form validates input and prevents duplicates
- Task list renders sorted items with proper accessibility
- Aria-live announces errors immediately
- Empty state shows when no tasks exist
- All tests pass with ≥60% coverage for new components

## Priority: Critical
## Parent: LIN-TODO
```

---

## Phase 4: User Story 2 - Completion (LIN-TODO-4)

### Title
**feat: Complete Tasks with Confidence (US2) - Toggle & Remove**

### Description
```
## Goal
Users can mark tasks done or undo completion while preserving list order and feedback. Users can also remove tasks entirely.

## Tasks (6 total)
### Tests (2)
- [ ] T015 Author RTL tests proving toggle-on/toggle-off flows update status and persist after rerender in `apps/todo/ui/tests/components/TodoApp.interactions.spec.tsx`
- [ ] T015a Add RTL test ensuring removing a task decreases list length and announces removal in `apps/todo/ui/tests/components/TodoApp.interactions.spec.tsx`

### Implementation (4)
- [ ] T016 Add accessible completion and removal controls with status text in `apps/todo/ui/src/components/TaskListItem.tsx`
- [ ] T017 Extend reducer actions in `apps/todo/ui/src/state/taskReducer.ts` for mark done, undo, and remove flows
- [ ] T018 Surface completion success messaging and focus management in `apps/todo/ui/src/App.tsx`

## Independent Test Criteria
- Toggling task updates done state, announces completion, reverting restores previous state
- Removing task decreases list length and announces removal
- No duplicate entries created during state transitions

## Acceptance Criteria
- Completion toggle works bidirectionally with proper status indicators
- Remove control available on all task items with confirmation
- State transitions persist and announce via aria-live
- Focus management prevents keyboard traps
- All interaction tests pass

## Priority: High
## Parent: LIN-TODO
```

---

## Phase 5: User Story 3 - Filtering (LIN-TODO-5)

### Title
**feat: Focus on Today's Commitments (US3) - Due Date Filter**

### Description
```
## Goal
Users can filter to tasks due today (excluding completed items), observe boundary handling, and revert to the full list.

## Tasks (7 total)
### Tests (3)
- [ ] T019 Write RTL test covering yesterday/today/tomorrow boundaries using `vi.setSystemTime` in `apps/todo/ui/tests/components/TodoApp.filter.spec.tsx`
- [ ] T019a Add RTL test ensuring removing the sole filtered task reveals the empty-state message in `apps/todo/ui/tests/components/TodoApp.filter.spec.tsx`

### Implementation (4)
- [ ] T020 Implement accessible filter controls (toggle/clear) in `apps/todo/ui/src/components/DueFilterControls.tsx`
- [ ] T021 Add due-today selector utilities with hidden-count metadata in `apps/todo/ui/src/state/selectors.ts`
- [ ] T022 Integrate filter controls, apply selector results, and announce active filter state in `apps/todo/ui/src/App.tsx`
- [ ] T023 Implement Playwright smoke test for add → mark done → filter due today → remove in `apps/todo/ui/playwright/todo.smoke.spec.ts` (injecting fake clock)

## Independent Test Criteria
- With fixed clock, tasks from yesterday/today/tomorrow filter correctly
- Clearing filter restores complete list
- Removing sole filtered task shows empty state

## Acceptance Criteria
- Due-today filter shows only incomplete tasks due today
- Filter state announced via aria-live
- Boundary conditions handled deterministically
- Playwright smoke test exercises full flow with traces
- All filter tests pass with fake clock

## Priority: High
## Parent: LIN-TODO
```

---

## Phase 6: Polish & Quality (LIN-TODO-6)

### Title
**polish: Accessibility, documentation, and release readiness**

### Description
```
## Tasks (3 total)
- [ ] T024 Run accessibility/focus audit and adjust components and styles per UX checklist in `specs/todo/ux-checklist.md`
- [ ] T025 Update verification docs and quickstart instructions in `specs/001-implement-todo-ui/quickstart.md` and author `apps/todo/ui/README.md`
- [ ] T026 Collect coverage reports, Playwright traces, and UI screenshots in `review-artifacts/` and summarize verification steps plus links in `PR_TEMPLATE.md` and `CHANGELOG.md`

## Acceptance Criteria
- All accessibility checklist items pass audit
- Documentation complete for setup and verification
- Artifacts collected for PR review packet
- Coverage meets ≥60% threshold
- Playwright traces uploaded and linked

## Priority: Medium
## Parent: LIN-TODO
```

---

## Issue Creation Instructions

### Step 1: Create Main Issue
1. In Linear, create issue **LIN-TODO** with the title and description above
2. Set priority to "High" and assign to current developer
3. Set due date based on Tuesday timeline

### Step 2: Create Subissues
1. Create 6 subissues under **LIN-TODO** using the phase descriptions above
2. Use issue IDs: **LIN-TODO-1** through **LIN-TODO-6**
3. Copy task checklists into issue descriptions
4. Set priorities as indicated (Critical for MVP, High for others, Medium for polish)

### Step 3: Branch Integration
1. Ensure branch follows pattern: `feature/LIN-TODO-implement-todo-ui`
2. PR title should include: `(LIN-TODO)`
3. Commit messages should reference: `(LIN-TODO)`

### Step 4: Task Progress Tracking
- Use Linear's checklist feature to track individual tasks within each subissue
- Move subissues to "In Progress" as phases begin
- Update task checkboxes as work completes

## Progress Tracking for Boss

### Current Status
- ✅ Specification complete with clarifications
- ✅ Implementation plan finalized
- ✅ Task breakdown complete (26 tasks across 6 phases)
- ✅ Ready for Linear issue creation and implementation start

### Key Milestones
1. **MVP Ready** (Phase 3 complete): Basic add/list/duplicate handling working
2. **Core Complete** (Phases 3-4 complete): Toggle and remove functionality added
3. **Feature Complete** (Phase 5 complete): Filtering and smoke tests working
4. **Production Ready** (Phase 6 complete): Accessibility audited, docs complete

### Quality Gates
- **RTL Coverage**: ≥60% statement coverage required
- **Accessibility**: All UX checklist items must pass
- **E2E**: Playwright smoke test must pass with traces
- **Documentation**: Quickstart and README must be complete

---

*Generated from `specs/001-implement-todo-ui/tasks.md` for professional issue tracking and stakeholder visibility.*
