# Tasks: To-Do UI Implementation

**Input**: Design documents from `/specs/002-todo-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are required per specification (Vitest ≥60% coverage + Playwright smoke test)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize React project with Vite in apps/todo/ui/
- [ ] T003 [P] Configure testing environment (Vitest + RTL + Playwright)
- [ ] T004 [P] Set up ESLint and project dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create localStorage persistence hook in apps/todo/ui/src/hooks/useLocalStorage.js
- [ ] T006 Create todo state management hook in apps/todo/ui/src/hooks/useTodos.js
- [ ] T007 Create utility functions in apps/todo/ui/src/utils/dateUtils.js
- [ ] T008 Create accessibility helpers in apps/todo/ui/src/utils/accessibility.js
- [ ] T009 Set up basic TodoApp component structure in apps/todo/ui/src/components/TodoApp.jsx
- [ ] T010 Configure test setup and mocking in apps/todo/ui/src/test-setup.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to add new tasks with text and due date input

**Independent Test**: Can add a task and verify it appears in the list with proper validation feedback

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Component test for AddTodoForm validation in apps/todo/ui/tests/components/AddTodoForm.test.jsx
- [ ] T012 [P] [US1] Hook test for useTodos add functionality in apps/todo/ui/tests/hooks/useTodos.test.js

### Implementation for User Story 1

- [ ] T013 [US1] Implement AddTodoForm component with validation in apps/todo/ui/src/components/AddTodoForm.jsx
- [ ] T014 [US1] Integrate AddTodoForm into TodoApp component
- [ ] T015 [US1] Add form submission handling with error feedback
- [ ] T016 [US1] Implement empty text validation and user feedback

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Task List (Priority: P1)

**Goal**: Display all tasks in a list format with proper task information

**Independent Test**: Can view multiple tasks with text, due dates, and completion status

### Tests for User Story 2 ⚠️

- [ ] T017 [P] [US2] Component test for TodoList display in apps/todo/ui/tests/components/TodoList.test.jsx
- [ ] T018 [P] [US2] Component test for TodoItem rendering in apps/todo/ui/tests/components/TodoItem.test.jsx

### Implementation for User Story 2

- [ ] T019 [US2] Implement TodoItem component in apps/todo/ui/src/components/TodoItem.jsx
- [ ] T020 [US2] Implement TodoList component in apps/todo/ui/src/components/TodoList.jsx
- [ ] T021 [US2] Integrate TodoList into TodoApp component
- [ ] T022 [US2] Add empty state handling and messaging

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Tasks as Complete (Priority: P1)

**Goal**: Allow users to toggle task completion status with visual feedback

**Independent Test**: Can mark tasks as done and see visual state changes

### Tests for User Story 3 ⚠️

- [ ] T023 [P] [US3] Component test for TodoItem completion toggle in apps/todo/ui/tests/components/TodoItem.test.jsx
- [ ] T024 [P] [US3] Hook test for useTodos completion functionality in apps/todo/ui/tests/hooks/useTodos.test.js

### Implementation for User Story 3

- [ ] T025 [US3] Add completion toggle to TodoItem component
- [ ] T026 [US3] Implement visual styling for completed vs incomplete tasks
- [ ] T027 [US3] Connect toggle to useTodos state management
- [ ] T028 [US3] Add keyboard accessibility for completion toggle

**Checkpoint**: All P1 user stories should now be independently functional

---

## Phase 6: User Story 4 - Remove Tasks (Priority: P1)

**Goal**: Enable users to remove tasks from their list with confirmation

**Independent Test**: Can remove tasks and see them disappear from the list

### Tests for User Story 4 ⚠️

- [ ] T029 [P] [US4] Component test for TodoItem remove functionality in apps/todo/ui/tests/components/TodoItem.test.jsx
- [ ] T030 [P] [US4] Hook test for useTodos remove functionality in apps/todo/ui/tests/hooks/useTodos.test.js

### Implementation for User Story 4

- [ ] T031 [US4] Add remove button to TodoItem component
- [ ] T032 [US4] Implement confirmation dialog for task removal
- [ ] T033 [US4] Connect remove action to useTodos state management
- [ ] T034 [US4] Add keyboard accessibility for remove action

**Checkpoint**: All P1 user stories (core CRUD) should now be fully functional

---

## Phase 7: User Story 5 - Filter Tasks by Due Today (Priority: P2)

**Goal**: Provide filtering functionality to show only tasks due today

**Independent Test**: Can filter tasks by due date and toggle filter on/off

### Tests for User Story 5 ⚠️

- [ ] T035 [P] [US5] Component test for TodoFilters component in apps/todo/ui/tests/components/TodoFilters.test.jsx
- [ ] T036 [P] [US5] Hook test for due today filtering logic in apps/todo/ui/tests/hooks/useTodos.test.js

### Implementation for User Story 5

- [ ] T037 [US5] Implement TodoFilters component in apps/todo/ui/src/components/TodoFilters.jsx
- [ ] T038 [US5] Add due date filtering logic to useTodos hook
- [ ] T039 [US5] Integrate TodoFilters into TodoApp component
- [ ] T040 [US5] Implement filter toggle and clear functionality
- [ ] T041 [US5] Add visual feedback for active filters

**Checkpoint**: User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Prevent Duplicate Tasks (Priority: P2)

**Goal**: Prevent duplicate tasks and show clear error messages

**Independent Test**: Cannot add duplicate tasks and receives appropriate error feedback

### Tests for User Story 6 ⚠️

- [ ] T042 [P] [US6] Component test for duplicate error handling in apps/todo/ui/tests/components/AddTodoForm.test.jsx
- [ ] T043 [P] [US6] Hook test for duplicate detection in apps/todo/ui/tests/hooks/useTodos.test.js

### Implementation for User Story 6

- [ ] T044 [US6] Add duplicate detection to useTodos hook
- [ ] T045 [US6] Implement aria-live error messaging in TodoApp
- [ ] T046 [US6] Add error display and clearing logic
- [ ] T047 [US6] Integrate duplicate validation with AddTodoForm

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T048 [P] Implement comprehensive accessibility features across all components
- [ ] T049 [P] Add ARIA labels and keyboard navigation support
- [ ] T050 [P] Implement focus management and screen reader support
- [ ] T051 [P] Performance optimization and memoization
- [ ] T052 [P] Implement Playwright smoke test in apps/todo/ui/e2e/todo-workflow.spec.js
- [ ] T053 [P] Expand component tests to achieve ≥60% coverage
- [ ] T054 [P] Add error boundaries and graceful failure handling
- [ ] T055 [P] Documentation updates and README creation
- [ ] T056 [P] Cross-browser testing and compatibility validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - P1 stories (US1-US4) can proceed in parallel after foundational
  - P2 stories (US5-US6) can start after foundational, may depend on P1 completion
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - May use US1 components but independently testable
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - May use US1 components but independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Component implementation before integration
- Accessibility features added alongside core functionality
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Component test for AddTodoForm validation in apps/todo/ui/tests/components/AddTodoForm.test.jsx"
Task: "Hook test for useTodos add functionality in apps/todo/ui/tests/hooks/useTodos.test.js"

# Launch implementation components in parallel:
Task: "Implement AddTodoForm component with validation in apps/todo/ui/src/components/AddTodoForm.jsx"
Task: "Integrate AddTodoForm into TodoApp component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Add Tasks)
4. **STOP and VALIDATE**: Test User Story 1 independently - should be demoable MVP
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Complete Polish phase → Final validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1 & 2 (list and add functionality)
   - Developer B: User Stories 3 & 4 (complete and remove)
   - Developer C: User Stories 5 & 6 (filtering and duplicates)
3. Stories complete and integrate independently
4. Final integration and polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
