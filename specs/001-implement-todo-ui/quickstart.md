# Quickstart: Tuesday: To-Do UI Implementation

## Prerequisites
- Node.js 20+
- pnpm or npm (repository default is npm)

## Setup
```bash
cd apps/todo/ui
npm install
```

If `apps/todo/core` is created for the first time, bootstrap its wrapper as well:
```bash
cd apps/todo/core
npm install
```

## Run the UI
```bash
cd apps/todo/ui
npm run dev
```
Navigate to http://localhost:5173/ to interact with the to-do dashboard.

## Run Component Tests
```bash
cd apps/todo/ui
npm run test       # Vitest run with coverage
```
Use `npm run test:watch` for local development. Coverage reports are emitted to `coverage/` and surfaced in the review packet.

## Run Playwright Smoke Test
```bash
cd apps/todo/ui
npm run test:e2e   # npm script defined during implementation
```
The command runs the add → mark done → filter due today → remove flow and uploads traces to `review-artifacts/playwright/`.

## Deterministic Clock Controls
- Component tests: call `vi.setSystemTime(new Date('2025-01-15'))` inside each scenario.
- Playwright: configure `page.addInitScript` (see `playwright/todo.smoke.spec.ts`) to freeze time to today.

## Accessibility Checklist
Execute `npm run lint:a11y` once the lint rule is wired to ensure all aria attributes, labels, and keyboard interactions remain compliant with `specs/todo/ux-checklist.md`.

