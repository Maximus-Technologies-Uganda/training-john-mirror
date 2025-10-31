#!/usr/bin/env node

// Script to sync spec tasks to GitHub issues
// Requires: npm install @octokit/rest
// Run with: GITHUB_TOKEN=your_token node sync-spec-to-github.js

import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Repository details
const owner = 'Maximus-Technologies-Uganda';
const repo = 'training-john';

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
    if (line.startsWith('## Phase ') || line.startsWith('## Phase ')) {
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

async function createGitHubIssue(title, body, labels = []) {
  try {
    const issue = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels: ['spec-sync', 'todo-ui', ...labels]
    });
    console.log(`Created issue: ${title} - ${issue.data.html_url}`);
    return issue.data;
  } catch (error) {
    console.error(`Error creating issue "${title}":`, error.message);
  }
}

async function syncSpecToGitHub() {
  console.log('Reading spec files...');
  const { specContent, tasksContent } = await readSpecFiles();

  console.log('Parsing tasks...');
  const phases = parseTasks(tasksContent);

  console.log(`Found ${phases.length} phases with tasks`);

  // Create main epic issue
  const mainIssueBody = `# To-Do UI Implementation Epic

This epic covers the complete implementation of the To-Do UI feature as specified in \`specs/001-implement-todo-ui/\`.

## Overview

${specContent.split('## Clarifications')[0]}

## Phases and Tasks

The implementation is broken down into the following phases:

${phases.map(phase => `- **${phase.title}** (${phase.tasks.length} tasks)`).join('\n')}

## Links

- [Full Specification](./specs/001-implement-todo-ui/spec.md)
- [Detailed Tasks](./specs/001-implement-todo-ui/tasks.md)
- [Data Model](./specs/001-implement-todo-ui/data-model.md)
- [API Contracts](./specs/001-implement-todo-ui/contracts/)

## Success Criteria

- RTL test coverage ≥60%
- Playwright smoke test passing
- All accessibility requirements met
- CI green with artifacts uploaded

---
*Auto-generated from spec sync on ${new Date().toISOString()}*`;

  const mainIssue = await createGitHubIssue(
    '🚀 Epic: To-Do UI Implementation (Deterministic & Boundaries)',
    mainIssueBody,
    ['epic', 'high-priority']
  );

  // Create sub-issues for each phase
  for (const phase of phases) {
    const phaseBody = `# ${phase.title}

${phase.description ? `**Purpose**: ${phase.description}` : ''}

## Tasks

${phase.tasks.map(task => `- [ ] ${task.id} ${task.flags.length > 0 ? `[${task.flags.join(', ')}]` : ''} ${task.description}`).join('\n')}

## Dependencies

${getPhaseDependencies(phase.title)}

## Files to Modify

${getPhaseFiles(phase.tasks)}

---
*Part of epic: ${mainIssue.html_url}*

*Auto-generated from spec sync on ${new Date().toISOString()}*`;

    const labels = getPhaseLabels(phase.title);
    await createGitHubIssue(phase.title, phaseBody, labels);
  }

  console.log('Spec sync to GitHub completed!');
}

function getPhaseDependencies(phaseTitle) {
  const dependencies = {
    'Phase 1: Setup (Shared Infrastructure)': 'None - starts immediately',
    'Phase 2: Foundational (Blocking Prerequisites)': 'Must complete after Phase 1',
    'Phase 3: User Story 1 - Add and View Tasks Reliably': 'Depends on Phase 2 completion',
    'Phase 4: User Story 2 - Complete Tasks with Confidence': 'Depends on Phase 3 (reuses components)',
    'Phase 5: User Story 3 - Focus on Today\'s Commitments': 'Depends on Phase 3 + Phase 2 utilities',
    'Phase 6: Polish & Cross-Cutting Concerns': 'Depends on Phases 3-5 completion'
  };

  return dependencies[phaseTitle] || 'See main epic for dependencies';
}

function getPhaseFiles(tasks) {
  const filePatterns = tasks.map(task => {
    const description = task.description.toLowerCase();
    if (description.includes('package.json')) return 'package.json files';
    if (description.includes('tsconfig')) return 'TypeScript config files';
    if (description.includes('vite.config')) return 'Vite configuration';
    if (description.includes('vitest.config')) return 'Vitest configuration';
    if (description.includes('playwright.config')) return 'Playwright configuration';
    if (description.includes('src/main.tsx')) return 'React entry point';
    if (description.includes('src/app.tsx')) return 'Main App component';
    if (description.includes('src/styles/app.css')) return 'Application styles';
    if (description.includes('src/utils/clockservice')) return 'Clock service utilities';
    if (description.includes('src/state/taskreducer')) return 'State management';
    if (description.includes('src/components/')) return 'UI components';
    if (description.includes('tests/')) return 'Test files';
    if (description.includes('playwright/')) return 'E2E tests';
    return 'Various source files';
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

// Run the sync
syncSpecToGitHub().catch(console.error);

