#!/usr/bin/env node

// Script to generate GitHub issue templates from spec
// Run with: node generate-github-issues.js

import fs from 'fs';
import path from 'path';

function readSpecFiles() {
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

function generateIssueTemplates(phases, specContent) {
  const outputDir = 'github-issues-templates';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Generate main epic issue
  const epicTemplate = `# 🚀 Epic: To-Do UI Implementation (Deterministic & Boundaries)

**Labels:** epic, spec-sync, todo-ui, high-priority

---

## Overview

${specContent.split('## Clarifications')[0].replace('# Feature Specification:', '').trim()}

## Implementation Phases

${phases.map((phase, index) => `${index + 1}. **${phase.title}** (${phase.tasks.length} tasks)`).join('\n')}

## Success Criteria

- ✅ RTL test coverage ≥60%
- ✅ Playwright smoke test passing
- ✅ All accessibility requirements met
- ✅ CI green with artifacts uploaded
- ✅ PR includes screenshots, verification steps, and review packet links

## Links

- [📋 Full Specification](./specs/001-implement-todo-ui/spec.md)
- [📝 Detailed Tasks](./specs/001-implement-todo-ui/tasks.md)
- [🗂️ Data Model](./specs/001-implement-todo-ui/data-model.md)
- [🔗 API Contracts](./specs/001-implement-todo-ui/contracts/)
- [📖 Research](./specs/001-implement-todo-ui/research.md)

---
*Generated from spec sync on ${new Date().toISOString().split('T')[0]}*
`;

  fs.writeFileSync(path.join(outputDir, 'epic-todo-ui-implementation.md'), epicTemplate);

  // Generate phase issues
  phases.forEach((phase, index) => {
    const phaseTemplate = `# ${phase.title}

**Labels:** spec-sync, todo-ui${getPhaseLabels(phase.title).map(label => `, ${label}`).join('')}

---

${phase.description ? `## Purpose\n\n${phase.description}\n\n---\n\n` : ''}## Tasks

${phase.tasks.map(task => `- [ ] **${task.id}** ${task.flags.length > 0 ? `*${task.flags.join(', ')}*` : ''} ${task.description}`).join('\n')}

---

## Dependencies

${getPhaseDependencies(phase.title)}

## Files to Modify

${getPhaseFiles(phase.tasks)}

## Acceptance Criteria

${getPhaseAcceptanceCriteria(phase.title)}

---

*Part of epic: #EPIC_NUMBER_HERE*

*Generated from spec sync on ${new Date().toISOString().split('T')[0]}*
`;

    const filename = `phase-${index + 1}-${phase.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}.md`;
    fs.writeFileSync(path.join(outputDir, filename), phaseTemplate);
  });

  // Generate README for using templates
  const readmeTemplate = `# GitHub Issues Templates

This directory contains GitHub issue templates generated from the To-Do UI specification.

## How to Use

1. **Create the Epic Issue First:**
   - Copy the content from \`epic-todo-ui-implementation.md\`
   - Create a new issue in GitHub with this content
   - Note the issue number (e.g., #123)

2. **Create Phase Issues:**
   - For each phase file, copy the content
   - Replace \`#EPIC_NUMBER_HERE\` with the actual epic issue number
   - Create individual issues for each phase
   - Set appropriate labels and assignees

3. **Link Issues:**
   - Use the epic issue to track overall progress
   - Reference phase issues in related pull requests
   - Update issue status as work progresses

## Generated Issues

${phases.map((phase, index) => `- Phase ${index + 1}: ${phase.title} (${phase.tasks.length} tasks)`).join('\n')}

## Labels to Create

Create these labels in your GitHub repository:
- \`epic\` - For main feature epics
- \`spec-sync\` - Issues generated from specifications
- \`todo-ui\` - Related to To-Do UI implementation
- \`high-priority\` - High priority items
- \`setup\` - Infrastructure setup tasks
- \`foundational\` - Blocking prerequisite tasks
- \`user-story\` - User story implementation
- \`mvp\` - Minimum viable product features
- \`p1\`, \`p2\`, \`p3\` - Priority levels
- \`polish\` - Final polish and documentation
- \`accessibility\` - Accessibility-related tasks
- \`testing\` - Testing implementation

---
*Generated on ${new Date().toISOString().split('T')[0]}*
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), readmeTemplate);

  console.log(`Generated ${phases.length + 2} files in ${outputDir}/`);
  console.log('Copy these templates to create GitHub issues manually.');
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

function getPhaseLabels(phaseTitle) {
  const labels = [];

  if (phaseTitle.includes('Setup')) labels.push('setup', 'infrastructure');
  if (phaseTitle.includes('Foundational')) labels.push('foundational', 'blocking');
  if (phaseTitle.includes('User Story 1')) labels.push('user-story', 'mvp', 'p1');
  if (phaseTitle.includes('User Story 2')) labels.push('user-story', 'p2');
  if (phaseTitle.includes('User Story 3')) labels.push('user-story', 'p3');
  if (phaseTitle.includes('Polish')) labels.push('polish', 'accessibility', 'docs');

  return labels;
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

// Run the generator
console.log('Generating GitHub issue templates from spec...');
const { specContent, tasksContent } = readSpecFiles();
const phases = parseTasks(tasksContent);
generateIssueTemplates(phases, specContent);
console.log('✅ Issue templates generated successfully!');
console.log('📁 Check the github-issues-templates/ directory');
console.log('🔗 Copy templates to GitHub to create issues manually');

