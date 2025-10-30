#!/usr/bin/env node

// Script to create Linear subissues for LIN-TODO
// Requires: npm install @linear/sdk
// Run with: LINEAR_API_KEY=your_key node create-linear-subissues.js

import { LinearClient } from '@linear/sdk';

const client = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

async function createSubissue(parentId, title, description, priority) {
  try {
    const issue = await client.createIssue({
      teamId: '1987b7dc-f031-48ff-b180-970b0bd7dd2a', // Your Linear team ID
      title,
      description,
      parentId, // Links to LIN-TODO
      priority,
      labels: ['Feature', 'UI', 'Testing'],
      assigneeId: 'f1da566b-33d5-43ad-9f3e-2043fb1b2204', // Your Linear user ID
    });
    console.log(`Created subissue: ${title} - ${issue.url}`);
    return issue;
  } catch (error) {
    console.error(`Error creating ${title}:`, error.message);
  }
}

async function main() {
  // Find LIN-TODO issue
  const issues = await client.issues({
    filter: {
      title: { contains: 'LIN-TODO' },
    },
  });
  const parentIssue = issues.nodes.find(issue => issue.title.includes('LIN-TODO'));
  if (!parentIssue) {
    console.error('LIN-TODO issue not found');
    return;
  }

  const parentId = parentIssue.id;

  // Create subissues
  await createSubissue(parentId, 'Setup Infrastructure (Phase 1) - Establish Shared Packages and Project Skeleton', `
**Goal**: Establish shared packages, project skeleton, and workspace scripts to enable UI development.

**Tasks (Checklist)**:
- [ ] T001: Create TypeScript wrapper package for todo core exports in \`apps/todo/core/{package.json,tsconfig.json,src/index.ts}\`.
- [ ] T002: Scaffold Vite React TypeScript UI skeleton in \`apps/todo/ui/\` (package.json, tsconfig.json, vite.config.ts, index.html, \`src/main.tsx\`, \`src/App.tsx\`, \`src/styles/app.css\`).
- [ ] T003: Update root \`package.json\` and \`apps/todo/ui/package.json\` scripts for \`dev\`, \`test\`, \`test:e2e\`, and register the new workspace packages.

**Dependencies**: None (starts immediately).
**Checkpoint**: Workspace scripts functional; \`npm run dev\` launches a basic app.
**Priority**: High (enables all subsequent work).
  `, 1); // Highest priority

  await createSubissue(parentId, 'Foundational Prerequisites (Phase 2) - Build Core Infrastructure', `
**Goal**: Build core infrastructure (testing, state management, accessibility) that blocks user story implementation.

**Tasks (Checklist)**:
- [ ] T004: Configure Vitest + React Testing Library environment in \`apps/todo/ui/vitest.config.ts\` and \`apps/todo/ui/tests/setup.ts\` with coverage output to \`review-artifacts/\`.
- [ ] T005: Configure Playwright project scaffold in \`apps/todo/ui/playwright.config.ts\` and add npm scripts for smoke runs and trace uploads.
- [ ] T006: Implement deterministic \`clockService\` with override hooks in \`apps/todo/ui/src/utils/clockService.ts\`.
- [ ] T007: Implement reducer, action types, and state helpers backed by \`@training/todo-core\` in \`apps/todo/ui/src/state/taskReducer.ts\`.
- [ ] T008: Build accessible \`LiveRegion\` component and message store in \`apps/todo/ui/src/components/LiveRegion.tsx\`.

**Dependencies**: Blocks all user stories; completes after Subissue 1.
**Checkpoint**: RTL tests run, reducer handles core actions, and \`clockService\` supports fake clocks.
**Priority**: Critical (constitution gate).
  `, 1);

  await createSubissue(parentId, 'User Story 1 - Add and View Tasks (Phase 3, MVP) - Enable Task Addition and Viewing', `
**Goal**: Enable users to add tasks with due dates, view them without duplicates, and receive aria-live feedback—delivering the core MVP.

**Tasks (Checklist)**:
- [ ] T009: Author RTL test for add flow increasing list length in \`apps/todo/ui/tests/components/TodoApp.add.spec.tsx\`.
- [ ] T010: Extend component test to assert duplicate submissions announce aria-live errors in \`apps/todo/ui/tests/components/TodoApp.add.spec.tsx\`.
- [ ] T011: Implement controlled \`AddTaskForm\` with validation, aria labels, and submit handling in \`apps/todo/ui/src/components/AddTaskForm.tsx\`.
- [ ] T012: Implement \`TaskList\` (and \`TaskListItem\`) rendering sorted tasks in \`apps/todo/ui/src/components/TaskList.tsx\`.
- [ ] T013: Compose reducer, LiveRegion, form, and list inside \`apps/todo/ui/src/App.tsx\`, ensuring duplicate errors push messages without mutating state.
- [ ] T014: Apply base layout, empty-state messaging, and focus indicators in \`apps/todo/ui/src/styles/app.css\`.

**Dependencies**: Depends on Subissue 2; independent of other stories.
**Checkpoint**: User Story 1 functional with passing RTL tests (SC-001, SC-002 met).
**Priority**: Highest (MVP).
  `, 1);

  await createSubissue(parentId, 'User Story 2 - Complete Tasks (Phase 4) - Enable Task Completion and Removal', `
**Goal**: Allow users to mark tasks done/undo and remove them, with accessible controls and feedback.

**Tasks (Checklist)**:
- [ ] T015: Author RTL tests proving toggle-on/toggle-off flows update status and persist after rerender in \`apps/todo/ui/tests/components/TodoApp.interactions.spec.tsx\`.
- [ ] T015a: Add RTL test ensuring removing a task decreases list length and announces removal in \`apps/todo/ui/tests/components/TodoApp.interactions.spec.tsx\`.
- [ ] T016: Add accessible completion and removal controls with status text in \`apps/todo/ui/src/components/TaskListItem.tsx\`.
- [ ] T017: Extend reducer actions in \`apps/todo/ui/src/state/taskReducer.ts\` for mark done, undo, and remove flows.
- [ ] T018: Surface completion success messaging and focus management in \`apps/todo/ui/src/App.tsx\`.

**Dependencies**: Depends on Subissue 3 (reuses UI components); maintains independent tests.
**Checkpoint**: User Stories 1 and 2 operate with passing tests (FR-004, FR-005 met).
**Priority**: High.
  `, 2);

  await createSubissue(parentId, 'User Story 3 - Due Today Filter (Phase 5) - Enable Due-Today Filtering', `
**Goal**: Enable due-today filtering (excluding completed tasks) with boundary handling and Playwright coverage.

**Tasks (Checklist)**:
- [ ] T019: Write RTL test covering yesterday/today/tomorrow boundaries using \`vi.setSystemTime\` in \`apps/todo/ui/tests/components/TodoApp.filter.spec.tsx\`.
- [ ] T019a: Add RTL test ensuring removing the sole filtered task reveals the empty-state message in \`apps/todo/ui/tests/components/TodoApp.filter.spec.tsx\`.
- [ ] T020: Implement accessible filter controls (toggle/clear) in \`apps/todo/ui/src/components/DueFilterControls.tsx\`.
- [ ] T021: Add due-today selector utilities with hidden-count metadata in \`apps/todo/ui/src/state/selectors.ts\`.
- [ ] T022: Integrate filter controls, apply selector results, and announce active filter state in \`apps/todo/ui/src/App.tsx\`.
- [ ] T023: Implement Playwright smoke test for add → mark done → filter due today → remove in \`apps/todo/ui/playwright/todo.smoke.spec.ts\` (injecting fake clock).

**Dependencies**: Depends on Subissue 3 (base UI) and Subissue 2 (clock utilities); can start after selectors are scaffolded.
**Checkpoint**: All user stories deliver with RTL + Playwright coverage (SC-004, SC-006 met).
**Priority**: Medium.
  `, 3);

  await createSubissue(parentId, 'Polish and Release Readiness (Phase 6) - Final Accessibility and Documentation', `
**Goal**: Ensure accessibility compliance, documentation, and artifacts for PR submission.

**Tasks (Checklist)**:
- [ ] T024: Run accessibility/focus audit and adjust \`apps/todo/ui/src/components/AddTaskForm.tsx\`, \`apps/todo/ui/src/components/TaskListItem.tsx\`, and \`apps/todo/ui/src/styles/app.css\` to satisfy the UX checklist.
- [ ] T025: Update verification docs and quickstart instructions in \`specs/001-implement-todo-ui/quickstart.md\` and author \`apps/todo/ui/README.md\`.
- [ ] T026: Collect coverage reports, Playwright traces, and UI screenshots in \`review-artifacts/\` and summarize verification steps plus links in \`PR_TEMPLATE.md\` and \`CHANGELOG.md\`.

**Dependencies**: Depends on Subissues 3–5 completion.
**Checkpoint**: Full Definition of Done met (SC-003, SC-005, SC-007; RTL ≥60%, CI green).
**Priority**: Medium.
  `, 3);

  console.log('All subissues created!');
}

main().catch(console.error);
