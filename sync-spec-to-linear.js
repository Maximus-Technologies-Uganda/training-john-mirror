#!/usr/bin/env node

// Script to sync spec tasks to Linear issues
// Requires: npm install @linear/sdk
// Run with: LINEAR_API_KEY=your_key node sync-spec-to-linear.js

import { LinearClient } from '@linear/sdk';
import fs from 'fs';
import path from 'path';

const client = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

// Linear configuration - you'll need to update these
const TEAM_ID = '1987b7dc-f031-48ff-b180-970b0bd7dd2a'; // Your Linear team ID
const ASSIGNEE_ID = 'f1da566b-33d5-43ad-9f3e-2043fb1b2204'; // Your Linear user ID

async function readSpecFiles() {
  const specPath = 'specs/001-implement-todo-ui/spec.md';
  const tasksPath = 'specs/001-implement-todo-ui/tasks.md';

  const specContent = fs.readFileSync(specPath, 'utf8');
  const tasksContent = fs.readFileSync(tasksPath, 'utf8');

  return { specContent, tasksContent };
}

function parseTasks(tasksContent) {
  const phases = [];
  const lines = tasksContent.split('\n');

  let currentPhase = null;
  let phaseTasks = [];

  for (const line of lines) {
    // Phase headers
    if (line.startsWith('## Phase ')) {
      if (currentPhase) {
        phases.push({ ...currentPhase, tasks: phaseTasks });
      }
      const phaseMatch = line.match(/## (.+): (.+)/);
      if (phaseMatch) {
        const [, phaseNumber, phaseName] = phaseMatch;
        currentPhase = {
          title: `${phaseNumber}: ${phaseName}`,
          description: '',
          tasks: []
        };
        phaseTasks = [];
      }
    }
    // Task lines
    else if (line.startsWith('- [ ] T') && currentPhase) {
      const taskMatch = line.match(/- \[ \] (T\d+[a-z]?)(?: \[([^\]]+)\])? (.+)/);
      if (taskMatch) {
        const [, taskId, flags = '', description] = taskMatch;
        phaseTasks.push({
          id: taskId,
          flags: flags.split(' ').filter(f => f),
          description: description.trim(),
          completed: false
        });
      }
    }
    // Phase descriptions
    else if (line.startsWith('**Purpose**:') && currentPhase) {
      currentPhase.description = line.replace('**Purpose**:', '').trim();
    }
  }

  if (currentPhase) {
    phases.push({ ...currentPhase, tasks: phaseTasks });
  }

  return phases;
}

async function findOrCreateEpicIssue(specContent) {
  // Try to find existing epic
  const issues = await client.issues({
    filter: {
      title: { contains: 'To-Do UI Implementation' },
    },
  });

  if (issues.nodes.length > 0) {
    console.log(`Found existing epic: ${issues.nodes[0].title}`);
    return issues.nodes[0];
  }

  // Create new epic
  const epicBody = `# 🚀 Epic: To-Do UI Implementation (Deterministic & Boundaries)

This epic covers the complete implementation of the To-Do UI feature.

## Overview

${specContent.split('## Clarifications')[0].replace('# Feature Specification:', '').trim()}

## Implementation Phases

The implementation is broken down into phases that will be created as sub-issues.

## Success Criteria

- ✅ RTL test coverage ≥60%
- ✅ Playwright smoke test passing
- ✅ All accessibility requirements met
- ✅ CI green with artifacts uploaded

## Links

- [📋 Full Specification](./specs/001-implement-todo-ui/spec.md)
- [📝 Detailed Tasks](./specs/001-implement-todo-ui/tasks.md)

---
*Auto-generated from spec sync on ${new Date().toISOString()}*`;

  const epic = await client.createIssue({
    teamId: TEAM_ID,
    title: '🚀 Epic: To-Do UI Implementation (Deterministic & Boundaries)',
    description: epicBody,
    priority: 1,
    labels: ['Epic', 'UI', 'Feature', 'Spec-Sync'],
    assigneeId: ASSIGNEE_ID,
  });

  console.log(`Created epic: ${epic.title} - ${epic.url}`);
  return epic;
}

async function createPhaseSubissue(parentId, phase, phaseIndex) {
  const phaseBody = `# ${phase.title}

${phase.description ? `**Purpose**: ${phase.description}` : ''}

## Tasks

${phase.tasks.map(task => `- [ ] **${task.id}** ${task.flags.length > 0 ? `*${task.flags.join(', ')}*` : ''} ${task.description}`).join('\n')}

## Dependencies

${getPhaseDependencies(phase.title)}

## Files to Modify

${getPhaseFiles(phase.tasks)}

## Acceptance Criteria

${getPhaseAcceptanceCriteria(phase.title)}

---
*Part of epic: ${parentId}*

*Auto-generated from spec sync on ${new Date().toISOString()}*`;

  const priority = getPhasePriority(phase.title);

  const subissue = await client.createIssue({
    teamId: TEAM_ID,
    title: phase.title,
    description: phaseBody,
    parentId,
    priority,
    labels: getPhaseLabels(phase.title),
    assigneeId: ASSIGNEE_ID,
  });

  console.log(`Created subissue: ${phase.title} - ${subissue.url}`);
  return subissue;
}

function getPhaseDependencies(phaseTitle) {
  const dependencies = {
    'Phase 1: Setup (Shared Infrastructure)': '🚀 **None** - Can start immediately',
    'Phase 2: Foundational (Blocking Prerequisites)': '⏳ **Blocks all user stories** - Must complete after Phase 1',
    'Phase 3: User Story 1 - Add and View Tasks Reliably': '🔗 **Depends on Phase 2** - Independent of other stories',
    'Phase 4: User Story 2 - Complete Tasks with Confidence': '🔗 **Depends on Phase 3** - Reuses UI components',
    'Phase 5: User Story 3 - Focus on Today\'s Commitments': '🔗 **Depends on Phase 3 + Phase 2 utilities** - Can start after selector scaffolding',
    'Phase 6: Polish & Cross-Cutting Concerns': '🔗 **Depends on Phases 3-5 completion** - Final accessibility and documentation'
  };

  return dependencies[phaseTitle] || 'See epic for detailed dependencies';
}

function getPhaseFiles(tasks) {
  const filePatterns = tasks.map(task => {
    const description = task.description.toLowerCase();
    if (description.includes('package.json')) return '📦 package.json files';
    if (description.includes('tsconfig')) return '⚙️ TypeScript config files';
    if (description.includes('vite.config')) return '⚙️ Vite configuration';
    if (description.includes('vitest.config')) return '🧪 Vitest configuration';
    if (description.includes('playwright.config')) return '🎭 Playwright configuration';
    if (description.includes('src/main.tsx')) return '⚛️ React entry point';
    if (description.includes('src/app.tsx')) return '⚛️ Main App component';
    if (description.includes('src/styles/app.css')) return '🎨 Application styles';
    if (description.includes('src/utils/clockservice')) return '🕐 Clock service utilities';
    if (description.includes('src/state/taskreducer')) return '🔄 State management';
    if (description.includes('src/components/')) return '🧩 UI components';
    if (description.includes('tests/')) return '🧪 Test files';
    if (description.includes('playwright/')) return '🎭 E2E tests';
    if (description.includes('README.md')) return '📖 Documentation';
    return '📝 Various source files';
  });

  return [...new Set(filePatterns)].join(', ');
}

function getPhaseAcceptanceCriteria(phaseTitle) {
  const criteria = {
    'Phase 1: Setup (Shared Infrastructure)': '- ✅ Workspace scripts functional\n- ✅ \`npm run dev\` launches basic app\n- ✅ Shared packages properly configured',
    'Phase 2: Foundational (Blocking Prerequisites)': '- ✅ RTL tests run successfully\n- ✅ Reducer handles core actions\n- ✅ Clock service supports fake clocks\n- ✅ LiveRegion component provides feedback',
    'Phase 3: User Story 1 - Add and View Tasks Reliably': '- ✅ User Story 1 functional with passing RTL tests\n- ✅ SC-001, SC-002 met\n- ✅ Duplicate prevention working\n- ✅ Aria-live feedback operational',
    'Phase 4: User Story 2 - Complete Tasks with Confidence': '- ✅ User Stories 1 and 2 operate with passing tests\n- ✅ FR-004, FR-005 met\n- ✅ Task completion and removal working\n- ✅ Focus management implemented',
    'Phase 5: User Story 3 - Focus on Today\'s Commitments': '- ✅ All user stories deliver with RTL + Playwright coverage\n- ✅ SC-004, SC-006 met\n- ✅ Due-today filtering working\n- ✅ Boundary conditions handled',
    'Phase 6: Polish & Cross-Cutting Concerns': '- ✅ Full Definition of Done met\n- ✅ SC-003, SC-005, SC-007 satisfied\n- ✅ Accessibility audit passed\n- ✅ Documentation and artifacts ready'
  };

  return criteria[phaseTitle] || '- ✅ Phase requirements completed\n- ✅ Tests passing\n- ✅ Code review ready';
}

function getPhasePriority(phaseTitle) {
  if (phaseTitle.includes('User Story 1') || phaseTitle.includes('Setup') || phaseTitle.includes('Foundational')) return 1;
  if (phaseTitle.includes('User Story 2')) return 2;
  return 3; // User Story 3 and Polish
}

function getPhaseLabels(phaseTitle) {
  const labels = ['UI', 'Feature', 'Spec-Sync'];

  if (phaseTitle.includes('Setup')) labels.push('Setup', 'Infrastructure');
  if (phaseTitle.includes('Foundational')) labels.push('Foundational', 'Prerequisites');
  if (phaseTitle.includes('User Story 1')) labels.push('User-Story', 'MVP', 'P1');
  if (phaseTitle.includes('User Story 2')) labels.push('User-Story', 'P2');
  if (phaseTitle.includes('User Story 3')) labels.push('User-Story', 'P3');
  if (phaseTitle.includes('Polish')) labels.push('Polish', 'Accessibility', 'Documentation');

  return labels;
}

async function syncSpecToLinear() {
  console.log('Reading spec files...');
  const { specContent, tasksContent } = await readSpecFiles();

  console.log('Parsing tasks...');
  const phases = parseTasks(tasksContent);

  console.log(`Found ${phases.length} phases with tasks`);

  console.log('Finding or creating epic issue...');
  const epic = await findOrCreateEpicIssue(specContent);

  console.log('Creating phase sub-issues...');
  for (const phase of phases) {
    await createPhaseSubissue(epic.id, phase);
  }

  console.log('✅ Spec sync to Linear completed!');
  console.log(`Epic: ${epic.url}`);
}

// Run the sync
syncSpecToLinear().catch(console.error);

