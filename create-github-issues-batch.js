#!/usr/bin/env node

// Script to create GitHub issues in batch using GitHub CLI
// Requires: GitHub CLI installed (gh)
// Run with: gh auth login (first time), then node create-github-issues-batch.js

import fs from 'fs';
import { execSync } from 'child_process';

function readTemplate(filePath) {
  return fs.readFileSync(`github-issues-templates/${filePath}`, 'utf8');
}

function extractLabels(content) {
  const labelMatch = content.match(/\*\*Labels:\*\* (.+)/);
  return labelMatch ? labelMatch[1].split(', ') : [];
}

function extractTitle(content) {
  const titleMatch = content.match(/^# (.+)/m);
  return titleMatch ? titleMatch[1] : 'Untitled';
}

function extractBody(content) {
  // Remove the title line and labels line
  return content.split('\n').slice(3).join('\n').trim();
}

async function createGitHubIssue(templateFile, epicNumber = null) {
  const content = readTemplate(templateFile);
  let processedContent = content;

  // Replace epic reference if provided
  if (epicNumber && content.includes('#EPIC_NUMBER_HERE')) {
    processedContent = content.replace('#EPIC_NUMBER_HERE', `#${epicNumber}`);
  }

  const title = extractTitle(processedContent);
  const labels = extractLabels(processedContent);
  const body = extractBody(processedContent);

  console.log(`\n=== Creating Issue: ${title} ===`);
  console.log(`Labels: ${labels.join(', ')}`);

  // Build gh command
  const labelArgs = labels.length > 0 ? labels.map(label => `--label "${label}"`).join(' ') : '';
  const command = `gh issue create --title "${title}" ${labelArgs} --body "${body.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '')}"`;

  console.log(`Command: ${command}`);

  try {
    const result = execSync(command, { encoding: 'utf8' });
    const issueUrl = result.trim();
    console.log(`✅ Created: ${issueUrl}`);

    // Extract issue number from URL
    const issueMatch = issueUrl.match(/\/issues\/(\d+)$/);
    return issueMatch ? parseInt(issueMatch[1]) : null;
  } catch (error) {
    console.error(`❌ Failed to create issue: ${error.message}`);
    return null;
  }
}

async function createAllIssues() {
  console.log('🚀 Creating GitHub issues for To-Do UI Implementation...\n');

  // Check if GitHub CLI is available
  try {
    execSync('gh --version', { stdio: 'pipe' });
    console.log('✅ GitHub CLI is available');
  } catch (_error) {
    console.error('❌ GitHub CLI not found. Please install it first:');
    console.error('   https://cli.github.com/');
    console.error('   Then run: gh auth login');
    process.exit(1);
  }

  // Check if authenticated
  try {
    execSync('gh auth status', { stdio: 'pipe' });
    console.log('✅ GitHub CLI is authenticated');
  } catch (_error) {
    console.error('❌ Not authenticated with GitHub CLI. Please run:');
    console.error('   gh auth login');
    process.exit(1);
  }

  // Create Epic Issue
  console.log('\n📋 Step 1: Creating Epic Issue...');
  const epicNumber = await createGitHubIssue('epic-todo-ui-implementation.md');

  if (!epicNumber) {
    console.error('❌ Failed to create epic issue. Aborting.');
    process.exit(1);
  }

  console.log(`\n🎯 Epic created with number: #${epicNumber}`);

  // Create Phase Issues
  console.log('\n📋 Step 2: Creating Phase Issues...');

  const phaseFiles = [
    'phase-1-phase-1-setup-shared-infrastructure.md',
    'phase-2-phase-2-foundational-blocking-prerequisites.md',
    'phase-3-phase-3-user-story-1-add-and-view-tasks-reliably-priority-p1-mvp.md',
    'phase-4-phase-4-user-story-2-complete-tasks-with-confidence-priority-p2.md',
    'phase-5-phase-5-user-story-3-focus-on-today-s-commitments-priority-p3.md',
    'phase-6-phase-6-polish-cross-cutting-concerns.md'
  ];

  const createdIssues = [];

  for (const phaseFile of phaseFiles) {
    const issueNumber = await createGitHubIssue(phaseFile, epicNumber);
    if (issueNumber) {
      createdIssues.push(issueNumber);
    }
  }

  // Summary
  console.log('\n🎉 All issues created successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   Epic: #${epicNumber}`);
  console.log(`   Phase Issues: ${createdIssues.map(n => `#${n}`).join(', ')}`);
  console.log(`   Total: ${createdIssues.length + 1} issues`);

  console.log('\n🔗 Next Steps:');
  console.log('   1. Review the created issues in GitHub');
  console.log('   2. Assign issues to team members if needed');
  console.log('   3. Start working on Phase 1 tasks');
  console.log('   4. Reference issues in your commits and PRs');
}

// Run the batch creation
createAllIssues().catch(console.error);

