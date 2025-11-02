# Tasks: Expense UI Implementation (Validation & Filters)

**Input**: Design documents from `specs/003-expense-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED - feature specification mandates Vitest (≥60% coverage) and Playwright E2E smoke tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `apps/expense/ui/src/` for implementation, `apps/expense/ui/tests/` for tests
- **E2E tests**: `apps/expense/ui/e2e/` for Playwright tests

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan in apps/expense/ui/
- [ ] T002 Initialize TypeScript React project with required dependencies in apps/expense/ui/
- [ ] T003 [P] Configure Vitest testing framework in apps/expense/ui/vitest.config.ts
- [ ] T004 [P] Configure Playwright E2E testing in apps/expense/ui/playwright.config.ts
- [ ] T005 [P] Setup ESLint and Prettier configuration in apps/expense/ui/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create TypeScript type definitions in apps/expense/ui/src/types/expense.ts
- [ ] T007 [P] Implement currency utility functions in apps/expense/ui/src/utils/currency.ts
- [ ] T008 [P] Create localStorage hook in apps/expense/ui/src/hooks/useLocalStorage.ts
- [ ] T009 Setup Zod validation schemas in apps/expense/ui/src/utils/validation.ts
- [ ] T010 Create core module integration functions in apps/expense/ui/src/lib/expense-core.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Expense with Validation (Priority: P1) 🎯 MVP

**Goal**: Enable users to add new expenses with robust validation, form feedback, and cents conversion

**Independent Test**: Submit the add expense form with valid/invalid data and verify validation, cents conversion, and expense persistence

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T011 [P] [US1] Component test for AddExpenseForm validation in apps/expense/ui/tests/components/AddExpenseForm.test.tsx
- [ ] T012 [P] [US1] Hook test for useLocalStorage functionality in apps/expense/ui/tests/hooks/useLocalStorage.test.ts
- [ ] T013 [P] [US1] Utility test for currency conversion in apps/expense/ui/tests/utils/currency.test.ts
- [ ] T014 [P] [US1] Validation test for form schemas in apps/expense/ui/tests/utils/validation.test.ts

### Implementation for User Story 1

- [ ] T015 [US1] Create AddExpenseForm component with React Hook Form in apps/expense/ui/src/components/AddExpenseForm.tsx
- [ ] T016 [US1] Implement expense creation hook in apps/expense/ui/src/hooks/useExpenses.ts
- [ ] T017 [US1] Add accessibility features (ARIA labels, keyboard navigation) to AddExpenseForm
- [ ] T018 [US1] Integrate localStorage persistence with expense creation
- [ ] T019 [US1] Add error handling and user feedback for validation failures

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View All Expenses (Priority: P1)

**Goal**: Display all expenses in a clear, accessible list with proper currency formatting

**Independent Test**: Add multiple expenses and verify they appear correctly formatted in the list with empty state handling

### Tests for User Story 2 ⚠️

- [ ] T020 [P] [US2] Component test for ExpenseList display in apps/expense/ui/tests/components/ExpenseList.test.tsx
- [ ] T021 [P] [US2] Utility test for currency display formatting in apps/expense/ui/tests/utils/currency.test.ts

### Implementation for User Story 2

- [ ] T022 [US2] Create ExpenseList component in apps/expense/ui/src/components/ExpenseList.tsx
- [ ] T023 [US2] Implement expense retrieval in useExpenses hook
- [ ] T024 [US2] Add accessibility features to ExpenseList (table semantics, screen reader support)
- [ ] T025 [US2] Implement empty state for when no expenses exist
- [ ] T026 [US2] Add currency formatting display in expense list

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Filter Expenses by Month (Priority: P2)

**Goal**: Enable filtering expenses by month with proper state management and UI feedback

**Independent Test**: Add expenses across multiple months and verify month filtering works correctly with "All Months" option

### Tests for User Story 3 ⚠️

- [ ] T027 [P] [US3] Component test for month filtering in apps/expense/ui/tests/components/ExpenseFilters.test.tsx
- [ ] T028 [P] [US3] Hook test for filter state management in apps/expense/ui/tests/hooks/useExpenses.test.ts

### Implementation for User Story 3

- [ ] T029 [US3] Create ExpenseFilters component in apps/expense/ui/src/components/ExpenseFilters.tsx
- [ ] T030 [US3] Implement month filtering logic in useExpenses hook
- [ ] T031 [US3] Add accessibility features to filter controls
- [ ] T032 [US3] Integrate month filtering with ExpenseList display

**Checkpoint**: Month filtering should work independently alongside existing functionality

---

## Phase 6: User Story 4 - Filter Expenses by Category (Priority: P2)

**Goal**: Enable filtering expenses by category with predefined options and custom input support

**Independent Test**: Add expenses across different categories and verify category filtering works with "All Categories" option

### Tests for User Story 4 ⚠️

- [ ] T033 [P] [US4] Component test for category filtering in apps/expense/ui/tests/components/ExpenseFilters.test.tsx
- [ ] T034 [P] [US4] Hook test for category filter logic in apps/expense/ui/tests/hooks/useExpenses.test.ts

### Implementation for User Story 4

- [ ] T035 [US4] Add category filtering to ExpenseFilters component
- [ ] T036 [US4] Implement category filtering logic in useExpenses hook
- [ ] T037 [US4] Add predefined category options with custom input support
- [ ] T038 [US4] Integrate category filtering with ExpenseList display

**Checkpoint**: Category filtering should work independently alongside existing functionality

---

## Phase 7: User Story 5 - Filter by Month and Category Combined (Priority: P3)

**Goal**: Enable simultaneous filtering by both month and category for detailed expense analysis

**Independent Test**: Add expenses across months and categories, apply both filters, and verify only matching expenses appear

### Tests for User Story 5 ⚠️

- [ ] T039 [P] [US5] Component test for combined filtering in apps/expense/ui/tests/components/ExpenseFilters.test.tsx
- [ ] T040 [P] [US5] Hook test for combined filter logic in apps/expense/ui/tests/hooks/useExpenses.test.ts

### Implementation for User Story 5

- [ ] T041 [US5] Implement combined month and category filtering logic
- [ ] T042 [US5] Update ExpenseFilters component for combined filtering UI
- [ ] T043 [US5] Add filter combination validation and feedback
- [ ] T044 [US5] Test combined filtering edge cases and empty results

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: User Story 6 - Main App Integration (Priority: P1-P3)

**Goal**: Integrate all components into the main application with proper state management

**Independent Test**: Complete end-to-end workflow from adding expenses to filtering results

### Tests for User Story 6 ⚠️

- [ ] T045 [US6] Playwright E2E smoke test for complete workflow in apps/expense/ui/e2e/expense-workflow.spec.ts

### Implementation for User Story 6

- [ ] T046 [US6] Create main App component integrating all features in apps/expense/ui/src/App.tsx
- [ ] T047 [US6] Implement main application layout and navigation
- [ ] T048 [US6] Add global error boundaries and error handling
- [ ] T049 [US6] Test complete user workflow integration

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality assurance

- [ ] T050 [P] Implement comprehensive error boundaries in apps/expense/ui/src/components/ErrorBoundary.tsx
- [ ] T051 [P] Add loading states and skeleton components in apps/expense/ui/src/components/LoadingState.tsx
- [ ] T052 Run accessibility audit and fix any remaining issues
- [ ] T053 Verify 60%+ test coverage across all components and utilities
- [ ] T054 [P] Documentation updates in specs/003-expense-ui/
- [ ] T055 Performance optimization and bundle size optimization
- [ ] T056 Final E2E test validation for all user stories
- [ ] T057 Code cleanup and TypeScript strict mode compliance

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Stories 1-2 (P1) can proceed in parallel
  - User Stories 3-4 (P2) can proceed in parallel after P1 completion
  - User Story 5 (P3) after P2 completion
  - User Story 6 (Integration) after all individual stories
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - can start after Foundational
- **User Story 2 (P1)**: Independent - can start after Foundational
- **User Story 3 (P2)**: Independent - can start after Foundational
- **User Story 4 (P2)**: Independent - can start after Foundational
- **User Story 5 (P3)**: Independent - can start after Foundational
- **User Story 6 (Integration)**: Depends on US1-US5 completion

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD approach)
- Component/hook implementation before integration
- Core functionality before accessibility features
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, P1 stories (US1, US2) can start in parallel
- Once P1 stories complete, P2 stories (US3, US4) can start in parallel
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Component test for AddExpenseForm validation in apps/expense/ui/tests/components/AddExpenseForm.test.tsx"
Task: "Hook test for useLocalStorage functionality in apps/expense/ui/tests/hooks/useLocalStorage.test.ts"
Task: "Utility test for currency conversion in apps/expense/ui/tests/utils/currency.test.ts"
Task: "Validation test for form schemas in apps/expense/ui/tests/utils/validation.test.ts"

# Launch implementation tasks for User Story 1:
Task: "Create AddExpenseForm component with React Hook Form in apps/expense/ui/src/components/AddExpenseForm.tsx"
Task: "Implement expense creation hook in apps/expense/ui/src/hooks/useExpenses.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1-2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Add Expense)
4. Complete Phase 4: User Story 2 (View Expenses)
5. **STOP and VALIDATE**: Test the complete add → view workflow independently
6. Deploy/demo if ready - you have a working expense tracker!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Basic expense entry)
3. Add User Story 2 → Test independently → Deploy/Demo (Expense viewing)
4. Add User Stories 3-4 → Test independently → Deploy/Demo (Filtering capabilities)
5. Add User Story 5 → Test independently → Deploy/Demo (Advanced filtering)
6. Add User Story 6 → Test integration → Deploy/Demo (Complete app)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1 + 3 + 5 (Add + Month filtering + Combined)
   - Developer B: User Stories 2 + 4 (View + Category filtering)
   - Developer C: User Story 6 + Polish (Integration + Quality)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Test coverage target: ≥60% statement coverage
- E2E smoke test: add 3 expenses → filter by month/category → verify totals
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
