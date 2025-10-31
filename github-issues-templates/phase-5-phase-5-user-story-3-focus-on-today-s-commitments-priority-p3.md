# Phase 5: User Story 3 - Focus on Today’s Commitments (Priority: P3)

**Labels:** spec-sync, todo-ui, user-story, p3

---

## Tasks

- [ ] **T019** *P* [US3] Write RTL test covering yesterday/today/tomorrow boundaries using `vi.setSystemTime` in `apps/todo/ui/tests/components/TodoApp.filter.spec.tsx`.
- [ ] **T019a** *P* [US3] Add RTL test ensuring removing the sole filtered task reveals the empty-state message in `apps/todo/ui/tests/components/TodoApp.filter.spec.tsx`.
- [ ] **T020** *US3* Implement accessible filter controls (toggle/clear) in `apps/todo/ui/src/components/DueFilterControls.tsx`.
- [ ] **T021** *P* [US3] Add due-today selector utilities with hidden-count metadata in `apps/todo/ui/src/state/selectors.ts`.
- [ ] **T022** *US3* Integrate filter controls, apply selector results, and announce active filter state in `apps/todo/ui/src/App.tsx`.
- [ ] **T023** *US3* Implement Playwright smoke test for add → mark done → filter due today → remove in `apps/todo/ui/playwright/todo.smoke.spec.ts` (injecting fake clock).

---

## Dependencies

See epic for detailed dependencies

## Files to Modify

🧪 Test files, 🧩 UI components, 📝 Various source files, ⚛️ Main App component, 🎭 E2E tests

## Acceptance Criteria

- ✅ Phase requirements completed
- ✅ Tests passing
- ✅ Code review ready

---

*Part of epic: #EPIC_NUMBER_HERE*

*Generated from spec sync on 2025-10-30*
