# Phase 2: Foundational (Blocking Prerequisites)

**Labels:** spec-sync, todo-ui, foundational, blocking

---

## Purpose

Core infrastructure required before user story implementation.

---

## Tasks

- [ ] **T004**  Configure Vitest + React Testing Library environment in `apps/todo/ui/vitest.config.ts` and `apps/todo/ui/tests/setup.ts` with coverage output to `review-artifacts/`.
- [ ] **T005** *P* Configure Playwright project scaffold in `apps/todo/ui/playwright.config.ts` and add npm scripts for smoke runs and trace uploads.
- [ ] **T006** *P* Implement deterministic `clockService` with override hooks in `apps/todo/ui/src/utils/clockService.ts`.
- [ ] **T007**  Implement reducer, action types, and state helpers backed by `@training/todo-core` in `apps/todo/ui/src/state/taskReducer.ts`.
- [ ] **T008** *P* Build accessible `LiveRegion` component and message store in `apps/todo/ui/src/components/LiveRegion.tsx`.

---

## Dependencies

⏳ **Blocks all user stories** - Must complete after Phase 1

## Files to Modify

🧪 Vitest configuration, 🎭 Playwright configuration, 🕐 Clock service utilities, 🔄 State management, 🧩 UI components

## Acceptance Criteria

- ✅ RTL tests run successfully
- ✅ Reducer handles core actions
- ✅ Clock service supports fake clocks
- ✅ LiveRegion component provides feedback

---

*Part of epic: #EPIC_NUMBER_HERE*

*Generated from spec sync on 2025-10-31*
