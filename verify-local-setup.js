#!/usr/bin/env node

/**
 * Local verification script to check branch protection and mirroring setup
 */

import fs from 'fs';
import { execSync } from 'child_process';

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function checkWorkflowContent(filePath, requiredElements) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return requiredElements.every(element => content.includes(element));
  } catch (error) {
    return false;
  }
}

function runGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('🚀 Verifying Local Branch Protection and Mirroring Setup\n');
  
  // Check current branch
  console.log('🔍 Checking current branch...');
  const currentBranch = runGitCommand('git branch --show-current');
  console.log(`✅ Current branch: ${currentBranch}`);
  
  if (currentBranch !== 'development') {
    console.log(`⚠️  Warning: Not on development branch. Current: ${currentBranch}`);
  }
  
  // Check remote configuration
  console.log('\n🔍 Checking remote configuration...');
  const remotes = runGitCommand('git remote -v');
  console.log('Remote repositories:');
  console.log(remotes);
  
  if (remotes.includes('mirror')) {
    console.log('✅ Mirror remote is configured');
  } else {
    console.log('⚠️  Mirror remote not found');
  }
  
  // Check workflow files
  console.log('\n🔍 Checking GitHub Actions workflows...');
  
  const workflows = [
    {
      path: '.github/workflows/quality-gate.yml',
      name: 'Quality Gate',
      requiredElements: ['name: Quality Gate', 'branches: [ development ]', 'npm run lint', 'npm run test:ci']
    },
    {
      path: '.github/workflows/review-packet.yml',
      name: 'Review Packet',
      requiredElements: ['name: Review Packet', 'needs-review-packet', 'Generate review packet']
    },
    {
      path: '.github/workflows/repo-mirror.yml',
      name: 'Repository Mirror',
      requiredElements: ['name: Mirror to training-john-mirror', 'branches: [ "**" ]', 'training-john-mirror.git']
    }
  ];
  
  for (const workflow of workflows) {
    if (checkFileExists(workflow.path)) {
      console.log(`✅ ${workflow.name} workflow exists`);
      
      if (checkWorkflowContent(workflow.path, workflow.requiredElements)) {
        console.log(`   ✅ ${workflow.name} workflow content looks correct`);
      } else {
        console.log(`   ⚠️  ${workflow.name} workflow may need updates`);
      }
    } else {
      console.log(`❌ ${workflow.name} workflow missing: ${workflow.path}`);
    }
  }
  
  // Check setup scripts
  console.log('\n🔍 Checking setup scripts...');
  
  const scripts = [
    'setup-branch-protection.js',
    'verify-setup.js',
    'verify-local-setup.js'
  ];
  
  for (const script of scripts) {
    if (checkFileExists(script)) {
      console.log(`✅ ${script} exists`);
    } else {
      console.log(`❌ ${script} missing`);
    }
  }
  
  // Check documentation
  console.log('\n🔍 Checking documentation...');
  
  if (checkFileExists('docs/branch-protection-setup.md')) {
    console.log('✅ Branch protection documentation exists');
  } else {
    console.log('❌ Branch protection documentation missing');
  }
  
  // Check package.json for required scripts
  console.log('\n🔍 Checking package.json scripts...');
  
  if (checkFileExists('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const scripts = packageJson.scripts || {};
      
      const requiredScripts = ['lint', 'test:ci'];
      for (const script of requiredScripts) {
        if (scripts[script]) {
          console.log(`✅ Script '${script}' is defined`);
        } else {
          console.log(`⚠️  Script '${script}' is missing`);
        }
      }
    } catch (error) {
      console.log('⚠️  Could not parse package.json');
    }
  }
  
  console.log('\n✅ Local verification completed!');
  console.log('\nNext steps for GitHub configuration:');
  console.log('1. Go to GitHub repository settings');
  console.log('2. Set default branch to "development"');
  console.log('3. Configure branch protection rules for development branch:');
  console.log('   - Require pull request reviews (1 approval)');
  console.log('   - Require status checks: "Quality Gate" and "Review Packet"');
  console.log('   - Dismiss stale reviews when new commits are pushed');
  console.log('   - Do not allow force pushes');
  console.log('4. Test by creating a PR to development branch');
  console.log('5. Verify mirroring works by checking the mirror repository');
  
  console.log('\nTo set up branch protection programmatically:');
  console.log('1. Set GITHUB_TOKEN environment variable');
  console.log('2. Run: node setup-branch-protection.js');
}

main().catch(console.error);
