# Implementation Plan: Tuesday: To-Do UI Implementation (Deterministic & Boundaries)

**Branch**: `001-implement-todo-ui` | **Date**: 2025-10-30 | **Spec**: [`spec.md`](./spec.md)
**Input**: Feature specification from `/specs/001-implement-todo-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Ship an accessible React-based to-do dashboard that reuses the existing `todo-core` business logic for add, toggle, remove, and filter flows. The UI will run under Vite + TypeScript, enforce duplicate blocking with aria-live feedback, expose a due-today filter that only shows incomplete items, and deliver deterministic RTL + Playwright coverage meeting Tuesday’s acceptance targets.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.6 + React 18 (Vite)  
**Primary Dependencies**: `react`, `react-dom`, `@vitejs/plugin-react`, shared `todo-core` wrapper  
**Storage**: In-memory task list managed via `todo-core` helpers (no persistence)  
**Testing**: Vitest + React Testing Library, Playwright smoke workflow  
**Target Platform**: Modern desktop browsers (Chrome, Edge, Firefox) served via Vite dev/build outputs
**Project Type**: Web single-page UI under `apps/todo/ui`  
**Performance Goals**: Render add/toggle/remove updates in <500 ms and due-today filter transitions in <200 ms for responsive UX  
**Constraints**: Must import operations from `apps/todo/core`, satisfy accessibility checklist, surface aria-live feedback, and support deterministic fake-clock testing  
**Scale/Scope**: Single-user workload with ≤200 tasks in-memory; optimized for deterministic training stories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status | Notes |
|-----------|------|--------|-------|
| CLI Outcomes First | UI must reuse CLI business logic instead of forking behavior | ✅ | Wrap existing `todo-core` into `apps/todo/core` so CLI and UI share logic |
| Test-Driven Delivery | New RTL/Playwright suites precede UI wiring | ✅ | Plan writes failing tests for add/duplicate/done/filter before components |
| Operational Transparency | UI must expose observable feedback (aria-live + empty states) | ✅ | aria-live + empty-state requirements embedded in components and tests |
| Story-Centered Planning | Work slices align to prioritized user stories | ✅ | Tasks align with add/list, toggle, due-today flows |
| Sustainable Learning Cadence | Documentation & retros captured in feature docs | ✅ | Research + quickstart capture learnings; no TODOs left unresolved |

**Re-check (Post Phase 1)**: No new violations introduced; all gates remain satisfied after design artifact creation.

## Project Structure

### Documentation (this feature)

```text
specs/001-implement-todo-ui/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 findings
├── data-model.md        # Phase 1 entity definitions
├── quickstart.md        # Phase 1 onboarding
├── contracts/           # Phase 1 interaction contracts
└── tasks.md             # Created by /speckit.tasks later
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
apps/
└── todo/
    ├── core/
    │   ├── package.json
    │   └── src/
    │       └── index.ts             # TypeScript facade over existing todo-core logic
    └── ui/
        ├── package.json
        ├── src/
        │   ├── App.tsx
        │   ├── components/
        │   ├── hooks/
        │   └── styles/
        ├── tests/
        │   ├── components/
        │   └── setup.ts
        └── playwright/
            └── todo.smoke.spec.ts

todo/
└── src/
    └── todo-core.js                 # Legacy CLI source consumed by new core wrapper
```

**Structure Decision**: Adopt a nested `apps/todo/{core,ui}` workspace so the UI consumes a thin TypeScript wrapper around the existing CLI `todo-core` module, keeping CLI and UI behavior unified while isolating React code under Vite conventions.

## Complexity Tracking

No constitution violations identified; complexity tracking grid not required for this feature.
