# Tasks: Stopwatch & Temp Converter UI (Edge States) & Spec-Kit Creation

**Input**: Design documents from `specs/004-stopwatch-temp-ui/`  
**Prerequisites**: spec.md (COMPLETE ✅), plan.md (COMPLETE ✅)

**Tests**: Tests are REQUIRED - feature specification mandates Vitest/RTL (≥50% coverage) and Playwright E2E smoke tests

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, etc.; omit for Setup/Foundational/Polish)
- Include exact file paths in descriptions

## Path Conventions

- **Stopwatch UI**: `apps/stopwatch/ui/src/` for implementation, `apps/stopwatch/ui/tests/` for tests, `apps/stopwatch/ui/e2e/` for Playwright
- **Temp UI**: `apps/temp/ui/src/` for implementation, `apps/temp/ui/tests/` for tests, `apps/temp/ui/e2e/` for Playwright

---

## Pre-Phase 1: Constitutional Verification Gate

**Purpose**: Verify prerequisites and constitutional compliance before project initialization

**⚠️ BLOCKING GATE**: Must complete before Phase 1. If any check fails, escalate and adjust plan.md.

- [ ] V001 Verify `apps/stopwatch/core/` has documented CLI interface (Principle 1: CLI Outcomes First compliance check)
- [ ] V002 Verify `apps/temp/core/` has documented CLI interface (Principle 1: CLI Outcomes First compliance check)
- [ ] V003 Confirm test environment supports Vitest + React Testing Library + Playwright (Principle 2 requirement)
- [ ] V004 Confirm monorepo structure allows independent app builds (Principle 4: Story-Centered Planning requirement)

**Checkpoint**: All verifications pass; proceed to Phase 1

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both UI applications

- [X] T001 Create Stopwatch UI project structure per implementation plan in `apps/stopwatch/ui/`
- [X] T002 Create Temp Converter UI project structure per implementation plan in `apps/temp/ui/`
- [X] T003 [P] Initialize TypeScript React Stopwatch project with required dependencies in `apps/stopwatch/ui/package.json`
- [X] T004 [P] Initialize TypeScript React Temp project with required dependencies in `apps/temp/ui/package.json`
- [X] T005 [P] Configure Vitest testing framework in `apps/stopwatch/ui/vitest.config.ts`
- [X] T006 [P] Configure Vitest testing framework in `apps/temp/ui/vitest.config.ts`
- [X] T007 [P] Configure Playwright E2E testing in `apps/stopwatch/ui/playwright.config.ts`
- [X] T008 [P] Configure Playwright E2E testing in `apps/temp/ui/playwright.config.ts`
- [X] T009 [P] Setup ESLint and Prettier configuration in `apps/stopwatch/ui/`
- [X] T010 [P] Setup ESLint and Prettier configuration in `apps/temp/ui/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Stopwatch Foundational Tasks

- [ ] T011 Create TypeScript type definitions in `apps/stopwatch/ui/src/types/stopwatch.ts` (StopwatchState, LapTime, StopwatchStatus)
- [ ] T012 [P] Implement time formatting utility (MM:SS:MS format) in `apps/stopwatch/ui/src/utils/formatting.ts`
- [ ] T013 [P] Create stopwatch state validation utility in `apps/stopwatch/ui/src/utils/validation.ts` (status checks, time validation)
- [ ] T014 Implement core module integration in `apps/stopwatch/ui/src/hooks/useStopwatch.ts` to connect to `apps/stopwatch/core/` business logic
- [ ] T015 [P] Create ErrorBanner component in `apps/stopwatch/ui/src/components/ErrorBanner.tsx` (displays inline errors with auto-dismiss)

### Temp Converter Foundational Tasks

- [ ] T016 Create TypeScript type definitions in `apps/temp/ui/src/types/tempconverter.ts` (TemperatureState, ConversionError)
- [ ] T017 [P] Implement temperature rounding utility (2 decimal places) in `apps/temp/ui/src/utils/formatting.ts`
- [ ] T018 [P] Create validation utility with on-blur and on-submit logic in `apps/temp/ui/src/utils/validation.ts`
- [ ] T019 Implement core module integration in `apps/temp/ui/src/hooks/useTempConversion.ts` to connect to `apps/temp/core/` business logic
- [ ] T020 [P] Create ErrorBanner component in `apps/temp/ui/src/components/ErrorBanner.tsx` (displays inline errors with auto-dismiss)

**Checkpoint**: Foundation complete - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Stopwatch: Start and Track Time (Priority: P1)

**Goal**: Enable users to start stopwatch and see elapsed time update in real-time in MM:SS:MS format

**Independent Test**: Start stopwatch, verify display increments, stop → test passes independently

### Tests for US1 (TDD - Write these FIRST, ensure they FAIL)

- [ ] T021 [P] [US1] Component test for StopwatchDisplay in MM:SS:MS format in `apps/stopwatch/ui/tests/components/StopwatchDisplay.test.tsx`
- [ ] T022 [P] [US1] Utility test for time formatting MM:SS:MS in `apps/stopwatch/ui/tests/utils/formatting.test.ts`
- [ ] T023 [P] [US1] Hook test for useStopwatch start() functionality in `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts`

### Implementation for US1

- [ ] T024 [US1] Create StopwatchDisplay component in `apps/stopwatch/ui/src/components/StopwatchDisplay.tsx` (displays MM:SS:MS)
- [ ] T025 [US1] Implement Start button control in `apps/stopwatch/ui/src/components/StopwatchControls.tsx`
- [ ] T026 [US1] Implement useStopwatch hook with start() method in `apps/stopwatch/ui/src/hooks/useStopwatch.ts`
- [ ] T027 [US1] Add accessibility (ARIA labels, keyboard navigation) to StopwatchDisplay and Start button

**Checkpoint**: At this point, User Story 1 (Start & Track) should be fully functional and testable independently

---

## Phase 4: User Story 2 - Stopwatch: Record and View Laps (Priority: P1)

**Goal**: Enable users to record lap times while stopwatch running, display laps with interval + cumulative time

**Independent Test**: Start stopwatch, record 3 laps, verify all displayed with interval and cumulative times

### Tests for US2 (TDD - Write these FIRST)

- [ ] T028 [P] [US2] Component test for LapList with interval and cumulative times in `apps/stopwatch/ui/tests/components/LapList.test.tsx`
- [ ] T029 [P] [US2] Test for virtual scrolling activation at >50 laps in `apps/stopwatch/ui/tests/components/LapList.test.tsx`
- [ ] T030 [P] [US2] Hook test for useStopwatch lap() functionality in `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts`

### Implementation for US2

- [ ] T031 [US2] Create LapList component with virtual scrolling in `apps/stopwatch/ui/src/components/LapList.tsx` (display "Lap N: X.XXs (total: Y.YYs)")
- [ ] T032 [US2] Implement Lap button control in `apps/stopwatch/ui/src/components/StopwatchControls.tsx`
- [ ] T033 [US2] Implement useStopwatch hook with lap() method in `apps/stopwatch/ui/src/hooks/useStopwatch.ts` (calculate intervals)
- [ ] T034 [US2] Add virtual scrolling library configuration (react-window) in `apps/stopwatch/ui/src/components/LapList.tsx`
- [ ] T035 [US2] Add accessibility to LapList (keyboard navigation, ARIA labels for lap items)

**Checkpoint**: User Stories 1 & 2 should work together: start → lap multiple times → see list

---

## Phase 5: User Story 3 - Stopwatch: Stop and Reset (Priority: P1)

**Goal**: Enable users to stop stopwatch and reset all data

**Independent Test**: Start → Stop → verify display frozen → Reset → verify display clears to 00:00:00

### Tests for US3 (TDD - Write these FIRST)

- [ ] T036 [P] [US3] Component test for Stop button behavior in `apps/stopwatch/ui/tests/components/StopwatchControls.test.tsx`
- [ ] T037 [P] [US3] Component test for Reset button clears elapsed time and laps in `apps/stopwatch/ui/tests/components/Stopwatch.test.tsx`
- [ ] T038 [P] [US3] Hook test for useStopwatch stop() and reset() methods in `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts`

### Implementation for US3

- [ ] T039 [US3] Implement Stop button control in `apps/stopwatch/ui/src/components/StopwatchControls.tsx`
- [ ] T040 [US3] Implement Reset button control in `apps/stopwatch/ui/src/components/StopwatchControls.tsx`
- [ ] T041 [US3] Implement useStopwatch hook with stop() method in `apps/stopwatch/ui/src/hooks/useStopwatch.ts`
- [ ] T042 [US3] Implement useStopwatch hook with reset() method in `apps/stopwatch/ui/src/hooks/useStopwatch.ts` (clear elapsed time and laps)
- [ ] T043 [US3] Add accessibility to Stop and Reset buttons (ARIA labels, keyboard navigation)

**Checkpoint**: User Stories 1, 2, & 3 complete: full stopwatch control (start, lap, stop, reset)

---

## Phase 6: User Story 4 - Stopwatch: Handle Invalid State Transitions (Priority: P1)

**Goal**: Prevent invalid operations (lap before start, stop twice) and display inline errors

**Independent Test**: Attempt lap before start → error appears → fix (start) → error disappears

### Tests for US4 (TDD - Write these FIRST)

- [ ] T044 [P] [US4] Component test for "Cannot lap before starting" error in `apps/stopwatch/ui/tests/components/StopwatchControls.test.tsx`
- [ ] T045 [P] [US4] Component test for "Stopwatch is already stopped" error in `apps/stopwatch/ui/tests/components/StopwatchControls.test.tsx`
- [ ] T046 [P] [US4] Component test for error auto-dismissal on state fix in `apps/stopwatch/ui/tests/components/ErrorBanner.test.tsx`
- [ ] T047 [P] [US4] Hook test for validation in useStopwatch (lap without start, stop twice) in `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts`
- [ ] T047b [P] [US4] Integration test for race conditions: rapid concurrent Lap + Stop clicks in `apps/stopwatch/ui/tests/hooks/useStopwatch.test.ts` (Covers FR-007: handle rapid consecutive operations without race conditions)

### Implementation for US4

- [ ] T048 [US4] Add validation to Lap button: prevent if status != 'running' in `apps/stopwatch/ui/src/components/StopwatchControls.tsx`
- [ ] T049 [US4] Add validation to Stop button: prevent if status == 'stopped' in `apps/stopwatch/ui/src/components/StopwatchControls.tsx`
- [ ] T050 [US4] Implement error state management in useStopwatch with auto-dismiss logic in `apps/stopwatch/ui/src/hooks/useStopwatch.ts`
- [ ] T051 [US4] Display inline error messages near buttons using ErrorBanner in `apps/stopwatch/ui/src/components/StopwatchControls.tsx`
- [ ] T052 [US4] Add keyboard accessibility to error messages (ARIA live regions for announcements)
- [ ] T053 [US4] Create initial Stopwatch container component in `apps/stopwatch/ui/src/components/Stopwatch.tsx` connecting Start/Lap/Stop/Reset controls, display, lap list, and error state management (US1-4 integration point - Stage 1)

**Checkpoint**: Stopwatch UI complete with full error handling (all 4 user stories)

---

## Phase 7: User Story 5 - Temp Converter: Convert Celsius to Fahrenheit (Priority: P1)

**Goal**: Enable users to convert C→F with correct results

**Independent Test**: Enter 0°C, select C→F → display 32°F

### Tests for US5 (TDD - Write these FIRST)

- [ ] T054 [P] [US5] Component test for TemperatureInput in `apps/temp/ui/tests/components/TemperatureInput.test.tsx`
- [ ] T055 [P] [US5] Component test for UnitSelectors (source/target dropdowns) in `apps/temp/ui/tests/components/UnitSelectors.test.tsx`
- [ ] T056 [P] [US5] Component test for ConversionResult display in `apps/temp/ui/tests/components/ConversionResult.test.tsx`
- [ ] T057 [P] [US5] Hook test for C→F conversion in useTempConversion in `apps/temp/ui/tests/hooks/useTempConversion.test.ts`

### Implementation for US5

- [ ] T058 [US5] Create TemperatureInput component in `apps/temp/ui/src/components/TemperatureInput.tsx` (numeric input field)
- [ ] T059 [US5] Create UnitSelectors component in `apps/temp/ui/src/components/UnitSelectors.tsx` (Celsius/Fahrenheit dropdowns)
- [ ] T060 [US5] Create ConversionResult component in `apps/temp/ui/src/components/ConversionResult.tsx` (displays result with 2-decimal rounding)
- [ ] T061 [US5] Implement useTempConversion hook with C→F conversion logic in `apps/temp/ui/src/hooks/useTempConversion.ts`
- [ ] T062 [US5] Add accessibility (ARIA labels for input, dropdowns, result display)

**Checkpoint**: User Story 5 (C→F conversion) complete and testable

---

## Phase 8: User Story 6 - Temp Converter: Convert Fahrenheit to Celsius (Priority: P1)

**Goal**: Enable users to convert F→C with correct results

**Independent Test**: Enter 32°F, select F→C → display 0°C

### Tests for US6 (TDD - Write these FIRST)

- [ ] T063 [P] [US6] Hook test for F→C conversion in useTempConversion in `apps/temp/ui/tests/hooks/useTempConversion.test.ts`

### Implementation for US6

- [ ] T064 [US6] Implement useTempConversion hook with F→C conversion logic in `apps/temp/ui/src/hooks/useTempConversion.ts`
- [ ] T065 [US6] Test keyboard navigation between unit selectors (Tab through C and F options)

**Checkpoint**: User Stories 5 & 6 complete: bi-directional conversion working

---

## Phase 9: User Story 7 - Temp Converter: Handle Invalid Input (Priority: P1)

**Goal**: Validate numeric input, show error for non-numeric, auto-dismiss on fix

**Independent Test**: Enter "abc" → error "Please enter a valid numeric value" → enter "25" → error disappears

### Tests for US7 (TDD - Write these FIRST)

- [ ] T066 [P] [US7] Component test for on-blur validation in TemperatureInput in `apps/temp/ui/tests/components/TemperatureInput.test.tsx`
- [ ] T067 [P] [US7] Component test for on-submit validation in `apps/temp/ui/tests/components/TempConverter.test.tsx`
- [ ] T068 [P] [US7] Component test for error auto-dismiss on valid input in `apps/temp/ui/tests/components/ErrorBanner.test.tsx`
- [ ] T069 [P] [US7] Utility test for validation logic (numeric, on-blur, on-submit) in `apps/temp/ui/tests/utils/validation.test.ts`

### Implementation for US7

- [ ] T070 [US7] Implement on-blur validation in TemperatureInput component in `apps/temp/ui/src/components/TemperatureInput.tsx`
- [ ] T071 [US7] Implement on-submit validation in `apps/temp/ui/src/components/TempConverter.tsx` (main container)
- [ ] T072 [US7] Display inline error "Please enter a valid numeric value" using ErrorBanner near input
- [ ] T073 [US7] Implement error auto-dismiss when user enters valid numeric value
- [ ] T074 [US7] Add keyboard accessibility to error messages (ARIA live regions)
- [ ] T075 [US7] Handle empty input gracefully (display empty result or "–")

**Checkpoint**: Input validation complete with error handling and auto-dismiss

---

## Phase 10: User Story 8 - Temp Converter: Prevent Identical Unit Conversion (Priority: P1)

**Goal**: Block C→C or F→F conversions, show error, auto-dismiss on unit change

**Independent Test**: Select C source and C target → error appears → change target to F → error disappears

### Tests for US8 (TDD - Write these FIRST)

- [ ] T076 [P] [US8] Component test for identical unit validation in UnitSelectors in `apps/temp/ui/tests/components/UnitSelectors.test.tsx`
- [ ] T077 [P] [US8] Component test for error display on identical unit in `apps/temp/ui/tests/components/ErrorBanner.test.tsx`
- [ ] T078 [P] [US8] Hook test for identical unit detection in useTempConversion in `apps/temp/ui/tests/hooks/useTempConversion.test.ts`

### Implementation for US8

- [ ] T079 [US8] Implement identical unit validation in UnitSelectors component in `apps/temp/ui/src/components/UnitSelectors.tsx`
- [ ] T080 [US8] Add validation logic to useTempConversion hook to detect sourceUnit == targetUnit
- [ ] T081 [US8] Display inline error "Source and target units cannot be the same" when identical units detected
- [ ] T082 [US8] Implement error auto-dismiss when user changes one unit to be different
- [ ] T083 [US8] Add keyboard accessibility to unit selector changes (ARIA live regions)

**Checkpoint**: Identical unit validation complete with error handling

---

## Phase 11: User Story 9 - Temp Converter: Handle Invalid Unit Selection (Priority: P2)

**Goal**: Ensure only valid units (C, F) are available and accepted

**Independent Test**: Open unit dropdowns → only C and F options visible

### Tests for US9 (TDD - Write these FIRST)

- [ ] T084 [P] [US9] Component test for UnitSelectors showing only C and F options in `apps/temp/ui/tests/components/UnitSelectors.test.tsx`
- [ ] T085 [P] [US9] Hook test for invalid unit rejection in useTempConversion in `apps/temp/ui/tests/hooks/useTempConversion.test.ts`
- [ ] T085b [P] [US9] Utility test for negative temperature conversion (-40°C = -40°F) in `apps/temp/ui/tests/utils/formatting.test.ts` (Covers FR-017: handle negative temperature values correctly)

### Implementation for US9

- [ ] T086 [US9] Restrict UnitSelectors dropdown options to only Celsius and Fahrenheit in `apps/temp/ui/src/components/UnitSelectors.tsx`
- [ ] T087 [US9] Add validation in useTempConversion to reject invalid units (if somehow selected)
- [ ] T088 [US9] Display error "Invalid unit" if invalid unit somehow gets selected (defensive check)

**Checkpoint**: Unit validation complete (US 5-9 complete: full Temp Converter)

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, accessibility verification, and E2E testing

### Container Components & Integration

- [ ] T089 Create final TempConverter container component tree in `apps/temp/ui/src/components/TempConverter.tsx` connecting TemperatureInput, UnitSelectors, ConversionResult, and error state management (US5-9 integration point - Final Stage)
- [ ] T090 Integrate all Stopwatch sub-components: StopwatchDisplay + StopwatchControls + LapList + ErrorBanner into main Stopwatch component in `apps/stopwatch/ui/src/components/Stopwatch.tsx` (Stage 2 - Final integration after T053 foundational container)
- [ ] T091 [P] Create App.tsx entry point for Stopwatch UI in `apps/stopwatch/ui/src/App.tsx`
- [ ] T092 [P] Create App.tsx entry point for Temp UI in `apps/temp/ui/src/App.tsx`
- [ ] T093 [P] Create index.tsx root entry for Stopwatch UI in `apps/stopwatch/ui/src/index.tsx`
- [ ] T094 [P] Create index.tsx root entry for Temp UI in `apps/temp/ui/src/index.tsx`

### E2E Smoke Tests (Playwright)

- [ ] T095 Create Playwright smoke test for Stopwatch UI in `apps/stopwatch/ui/e2e/stopwatch.spec.ts`
  - Start stopwatch, record 3 laps, stop, reset
  - Test error state (lap before start)
  - Verify MM:SS:MS display format

- [ ] T096 Create Playwright smoke test for Temp Converter UI in `apps/temp/ui/e2e/temp-converter.spec.ts`
  - Convert 0°C to F (expect 32)
  - Convert 32°F to C (expect 0)
  - Test non-numeric error
  - Test identical unit error

### Accessibility & Keyboard Navigation

- [ ] T097 [P] Verify Stopwatch UI keyboard navigation (Tab through controls, Enter to activate) in `apps/stopwatch/ui/tests/`
- [ ] T098 [P] Verify Temp Converter UI keyboard navigation (Tab through input, dropdowns, Enter to convert) in `apps/temp/ui/tests/`
- [ ] T099 [P] Verify ARIA labels on all Stopwatch controls in `apps/stopwatch/ui/tests/`
- [ ] T100 [P] Verify ARIA labels on all Temp controls in `apps/temp/ui/tests/`
- [ ] T101 [P] Verify focus management and visible focus states in Stopwatch UI
- [ ] T102 [P] Verify focus management and visible focus states in Temp UI

### Coverage & Test Reports

- [ ] T103 Generate Vitest coverage report for Stopwatch UI (target ≥50% statement coverage) in `apps/stopwatch/ui/`
- [ ] T104 Generate Vitest coverage report for Temp UI (target ≥50% statement coverage) in `apps/temp/ui/`
- [ ] T105 Verify all error paths are tested (lap before start, stop twice, non-numeric, identical units, race conditions)
- [ ] T106 Verify all edge cases are tested (>50 laps virtual scrolling, extended times, negative temps, decimals)

### Documentation

- [ ] T107 Create README.md for Stopwatch UI with usage and test instructions in `apps/stopwatch/ui/README.md`
- [ ] T108 Create README.md for Temp Converter UI with usage and test instructions in `apps/temp/ui/README.md`

---

## Phase 13: Learning & Continuous Improvement (Sustainable Learning Cadence - Principle 5)

**Purpose**: Post-implementation retrospective and knowledge capture for sustainable learning

- [ ] T109 Conduct retrospective meeting: document lessons learned, challenges, solutions, and architectural decisions in `specs/004-stopwatch-temp-ui/RETROSPECTIVE.md`
- [ ] T110 Update training artifacts: capture patterns, anti-patterns, and best practices discovered during implementation in project wiki/docs
- [ ] T111 Identify refactoring opportunities and create backlog items for technical debt (if any) in project tracking system
- [ ] T112 Journal session: update `specs/004-stopwatch-temp-ui/LEARNING_LOG.md` with team reflections and recommendations for future features

---

## Dependencies & Parallel Opportunities

### User Story Dependency Graph

```
Phase 1: Setup
  ↓
Phase 2: Foundational (Stopwatch + Temp in parallel)
  ↓
Phase 3: US1 (Stopwatch Start/Track) ─┐
Phase 4: US2 (Stopwatch Laps)         │
Phase 5: US3 (Stopwatch Stop/Reset)   ├─ Can run in parallel (separate files)
Phase 6: US4 (Stopwatch Errors)       │
  ↓                                   │
Phase 7: US5 (Temp C→F)         ─┐   │
Phase 8: US6 (Temp F→C)         │   │
Phase 9: US7 (Temp Input Valid)  ├─ Can run in parallel
Phase 10: US8 (Temp Same Units)  │   │
Phase 11: US9 (Temp Unit Valid)  │   │
  ↓                              ↓   ↓
Phase 12: Polish & Integration
  ↓
Phase 13: Learning & Continuous Improvement
```

### Parallel Execution Examples

**During Phase 2 (Foundational)**: 100% parallelizable after T011
- T011-T015 (Stopwatch) parallel with T016-T020 (Temp)

**During Phase 3-6 (Stopwatch Stories)**: 70% parallelizable
- All test tasks can run in parallel
- Most component implementations can run in parallel

**During Phase 7-11 (Temp Stories)**: 75% parallelizable
- All test tasks can run in parallel
- Most component implementations can run in parallel

**During Phase 12 (Polish)**: 85% parallelizable
- E2E tests, verification tasks, accessibility checks mostly parallel

---

## Implementation Strategy

### MVP Scope (Week 1)

Focus on **User Story 1 (Stopwatch Start/Track)** + **User Story 5 (Temp C→F)**:

1. Pre-Phase 1 Verification: V001-V004
2. Setup (Phase 1): T001-T010
3. Foundational (Phase 2): T011-T020
4. US1 (Phase 3): T021-T027
5. US5 (Phase 7): T054-T062

**MVP Demo**: Click Start on Stopwatch, watch MM:SS:MS increment. Enter 0 in Temp, select C→F, see 32°F.

### Incremental Delivery

- **Week 1 (MVP)**: Pre-Phase 1 + Setup + Foundational + US1 + US5 (basic functionality)
- **Week 2 (Core Complete)**: Add US2, US3, US4 (Stopwatch complete) + US6, US7, US8 (Temp near complete)
- **Week 3 (Polish)**: US9 (edge case) + Phase 12 (accessibility + Playwright smoke tests)
- **Week 4 (Learning)**: Phase 13 (retrospective + training artifacts)

---

## Test Coverage Tracking

| Component | Target Coverage | Status |
|-----------|-----------------|--------|
| StopwatchDisplay | ≥50% | ⏳ Pending |
| LapList | ≥50% | ⏳ Pending |
| StopwatchControls | ≥50% | ⏳ Pending |
| TemperatureInput | ≥50% | ⏳ Pending |
| UnitSelectors | ≥50% | ⏳ Pending |
| ConversionResult | ≥50% | ⏳ Pending |
| useStopwatch hook | ≥50% | ⏳ Pending |
| useTempConversion hook | ≥50% | ⏳ Pending |
| **Overall** | **≥50%** | ⏳ Pending |

---

## Definition of Done

- [ ] Pre-Phase 1 verification passed (V001-V004)
- [ ] All 112 tasks completed (Phase 1-13)
- [ ] Vitest component tests pass for both UIs (≥50% statement coverage)
- [ ] Playwright E2E smoke tests pass for both UIs
- [ ] All error states tested and working (5 Stopwatch + 4 Temp error scenarios including race conditions)
- [ ] All edge cases handled (>50 laps virtual scrolling, extended times, negative temps, decimals, race conditions)
- [ ] Keyboard navigation verified for all controls
- [ ] ARIA labels verified for screen reader support
- [ ] Both UIs run locally without errors
- [ ] Coverage reports generated and reviewed
- [ ] READMEs written with test instructions
- [ ] Retrospective completed with lessons learned (Phase 13)
- [ ] Training artifacts updated (Phase 13)

