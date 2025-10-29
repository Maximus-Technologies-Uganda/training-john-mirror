# Tasks: Monday: UI Scaffolding, Spec-Kit Creation, and CI Configuration

**Input**: Design documents from `/specs/001-ui-scaffold-spec/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested; focus on implementation tasks with built-in validation steps.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare repository-wide configuration to support new UI workspaces.

- [x] T001 Update root workspace configuration in `package.json` to include `apps/*/ui` packages.
- [ ] T002 Document Node 18 and Playwright prerequisites in `README.md` under a new "UI Foundations" section.
- [ ] T003 Add build artifacts for UI apps to `.gitignore` (e.g., `apps/*/ui/dist`, `apps/*/ui/node_modules`).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create reusable scaffolding assets shared by all UI app shells.

- [ ] T004 Create a reusable UI template under `apps/_templates/ui/` (tsconfig base, vite base config, README stub).
- [ ] T005 Add a scaffold helper script `scripts/create-ui-shell.mjs` that copies the template into target app folders.
- [ ] T006 Extend `eslint.config.js` to lint React/TypeScript sources inside `apps/*/ui/`.

**Checkpoint**: Template + tooling ready; user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - UI scaffolding available for all apps (Priority: P1) 🎯 MVP

**Goal**: Provide consistent UI shell directories for To-Do, Expense, Stopwatch, and Temp apps.
**Independent Test**: Run `npm run test -- --project apps/<app>/ui` for each app to confirm lint/compile success.

### Implementation for User Story 1

- [ ] T007 [US1] Scaffold To-Do UI shell in `apps/todo/ui/` (package.json, tsconfig.json, vite.config.ts, src/main.tsx, README.md).
- [ ] T008 [P] [US1] Scaffold Expense UI shell in `apps/expense/ui/` mirroring the template structure.
- [ ] T009 [P] [US1] Scaffold Stopwatch UI shell in `apps/stopwatch/ui/` with placeholder component and README.
- [ ] T010 [P] [US1] Scaffold Temp UI shell in `apps/temp/ui/` with placeholder component and README.
- [ ] T011 [US1] Add UI workspace scripts (`ui:build`, `ui:test`) to root `package.json` referencing `apps/*/ui` packages.
- [ ] T012 [US1] Document app-level setup expectations in `apps/README.md` (lint, test, build instructions).

**Checkpoint**: Four UI shells compile and lint independently.

---

## Phase 4: User Story 2 - Spec-Kit ready for To-Do and Expense (Priority: P2)

**Goal**: Deliver Spec-Kits that capture goals, test matrices, and accessibility checklists for To-Do and Expense.
**Independent Test**: Open each Spec-Kit folder and verify `spec.md`, `test-matrix.csv`, and `ux-checklist.md` are complete and reviewer-ready.

### Implementation for User Story 2

- [ ] T013 [US2] Create To-Do Spec-Kit files in `specs/todo/` (spec.md, test-matrix.csv, ux-checklist.md) using scenarios from the feature spec.
- [ ] T014 [P] [US2] Create Expense Spec-Kit files in `specs/expense/` (spec.md, test-matrix.csv, ux-checklist.md).
- [ ] T015 [US2] Update `specs/001-ui-scaffold-spec/quickstart.md` with review steps for validating both Spec-Kits.
- [ ] T016 [US2] Add Spec-Kit review checklist references in `docs/guides/training-progress-summary.md` to align stakeholders.

**Checkpoint**: Spec-Kits ready for review without additional context.

---

## Phase 5: User Story 3 - CI validates UI experiences (Priority: P3)

**Goal**: Ensure CI runs Vitest UI coverage and Playwright smoke flows per app with artifacts in Review Packet paths.
**Independent Test**: Trigger CI (or run workflows locally) and verify coverage uploads to `review-artifacts/ui-coverage-<app>/` and Playwright artifacts under `review-artifacts/playwright/` with Review Packet links.

### Implementation for User Story 3

- [ ] T017 [US3] Update `.github/workflows/ci.yml` to add a Vitest UI job that collects per-app coverage in `review-artifacts/ui-coverage-<app>/`.
- [ ] T018 [P] [US3] Add `.github/workflows/playwright-smoke.yml` to run targeted smoke tests for all UI apps.
- [ ] T019 [P] [US3] Create shared Playwright configuration `playwright.smoke.config.ts` referencing the four UI shells.
- [ ] T020 [P] [US3] Author smoke specs for each app under `apps/<app>/ui/tests/playwright/<app>.spec.ts` covering one E2E journey.
- [ ] T021 [US3] Enhance `scripts/run-vitest.mjs` to publish per-app coverage and summary JSONs to `review-artifacts/ui-coverage-<app>/`.
- [ ] T022 [US3] Update `generate-review-packet.js` to link UI coverage folders and Playwright artifacts in the Review Packet output.
- [ ] T023 [US3] Ensure CI workflows block merges on UI or Playwright failure (remove `continue-on-error`, enforce required checks).
- [ ] T024 [US3] Measure Vitest + Playwright runtime and document the ≤15-minute SLA in Review Packet outputs.

**Checkpoint**: CI surfaces UI coverage and Playwright artifacts automatically, failing fast on regressions.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation, validation, and release readiness.

- [ ] T025 Record feature summary and CI updates in `CHANGELOG.md`.
- [ ] T026 Capture final verification steps in `specs/001-ui-scaffold-spec/quickstart.md` after running the new workflows.
- [ ] T027 Populate `PR_TEMPLATE.md` scopes, verification, and artifact links (referencing Review Packet).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → prerequisite for Foundational.
- **Foundational (Phase 2)** → prerequisite for all user stories.
- **User Story Phases (3-5)** → follow priority order (US1 → US2 → US3) but US2/US3 may run in parallel after US1 if dependencies satisfied.
- **Polish (Phase 6)** → after selected user stories complete.

### User Story Dependencies

- **US1**: depends on Phase 1-2; no further dependencies.
- **US2**: depends on Phase 1-3 completion to leverage scaffolding context.
- **US3**: depends on Phase 1-3 to ensure UI shells exist for testing.

### Within Each User Story

- Follow listed task order unless `[P]` indicates safe parallel execution.
- Ensure lint/test scripts exist (T011) before running coverage or Playwright tasks.

---

## Parallel Opportunities

- Phase 3: T008, T009, T010 can proceed concurrently once T007 completes.
- Phase 4: T014 may proceed alongside T013.
- Phase 5: T018, T019, T020 can run in parallel after T017; coordinate with T021/T024 sequencing.
- Phase 6 tasks can be parallelized after all user stories reach their checkpoints.

---

## Parallel Example: User Story 1

```bash
# After T007 completes, run parallel scaffolding for remaining apps:
Task: T008 [P] [US1] Scaffold Expense UI shell in apps/expense/ui/
Task: T009 [P] [US1] Scaffold Stopwatch UI shell in apps/stopwatch/ui/
Task: T010 [P] [US1] Scaffold Temp UI shell in apps/temp/ui/
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phases 1-2 (Setup + Foundational).
2. Deliver Phase 3 (US1) and verify UI shells compile and lint.
3. Share MVP branch for early feedback before expanding scope.

### Incremental Delivery
1. Finish Setup + Foundational.
2. Implement US1 → verify.
3. Implement US2 → reviewers can inspect Spec-Kits.
4. Implement US3 → CI artifacts available.
5. Complete Polish tasks.

### Parallel Team Strategy
- Developer A: Focus on US1 tasks (T007-T012).
- Developer B: Begin US2 (T013-T016) after US1 checkpoint.
- Developer C: Own US3 (T017-T024) once UI shells exist.
- Coordinate on Phase 6 for documentation and PR packaging.

---

## Notes

- `[P]` tasks are safe to execute concurrently when preceding dependencies are satisfied.
- Maintain independent verification per story using quickstart commands.
- Update quickstart and PR template as final documentation checkpoints.
