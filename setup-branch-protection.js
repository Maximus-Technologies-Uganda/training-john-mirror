#!/usr/bin/env node

/**
 * Script to set up branch protection rules for the development branch
 * This script configures GitHub branch protection rules that require:
 * - Quality Gate checks to pass
 * - Review Packet checks to pass
 * - At least one review before merging
 */

import https from 'https';
// import fs from 'fs'; // Unused import

// Configuration
const REPO_OWNER = 'Maximus-Technologies-Uganda';
const REPO_NAME = 'training-john';
const BRANCH_NAME = 'development';

// GitHub API configuration
const GITHUB_API_BASE = 'api.github.com';
const API_VERSION = '2022-11-28';

function makeGitHubRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      reject(new Error('GITHUB_TOKEN environment variable is required'));
      return;
    }

    const options = {
      hostname: GITHUB_API_BASE,
      port: 443,
      path: `/repos/${REPO_OWNER}/${REPO_NAME}${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': `application/vnd.github+json`,
        'X-GitHub-Api-Version': API_VERSION,
        'User-Agent': 'Branch-Protection-Setup-Script'
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`GitHub API error: ${res.statusCode} - ${parsed.message || responseData}`));
          }
        } catch {
          reject(new Error(`Failed to parse response: ${responseData}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function setupBranchProtection() {
  try {
    console.log(`Setting up branch protection for ${BRANCH_NAME} branch...`);
    
    // First, check if the branch exists
    console.log('Checking if branch exists...');
    try {
      await makeGitHubRequest(`/branches/${BRANCH_NAME}`);
      console.log(`✅ Branch ${BRANCH_NAME} exists`);
    } catch (error) {
      console.error(`❌ Branch ${BRANCH_NAME} does not exist or is not accessible`);
      throw error;
    }

    // Get the repository to check current settings
    console.log('Getting repository information...');
    const repo = await makeGitHubRequest('');
    console.log(`Repository: ${repo.full_name}`);
    console.log(`Default branch: ${repo.default_branch}`);

    // Set up branch protection rules
    const protectionRules = {
      required_status_checks: {
        strict: true,
        contexts: [
          'Quality Gate',
          'Review Packet'
        ]
      },
      enforce_admins: false,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        dismiss_stale_reviews: true,
        require_code_owner_reviews: false
      },
      restrictions: null,
      allow_force_pushes: false,
      allow_deletions: false
    };

    console.log('Applying branch protection rules...');
    console.log('Rules:', JSON.stringify(protectionRules, null, 2));
    
    const result = await makeGitHubRequest(`/branches/${BRANCH_NAME}/protection`, 'PUT', protectionRules);
    
    console.log('✅ Branch protection rules applied successfully!');
    console.log('Protection rules summary:');
    console.log(`- Required status checks: ${result.required_status_checks.contexts.join(', ')}`);
    console.log(`- Required reviews: ${result.required_pull_request_reviews.required_approving_review_count}`);
    console.log(`- Allow force pushes: ${result.allow_force_pushes}`);
    console.log(`- Allow deletions: ${result.allow_deletions}`);
    
  } catch (error) {
    console.error('❌ Failed to set up branch protection:', error.message);
    process.exit(1);
  }
}

// Check if GITHUB_TOKEN is provided
if (!process.env.GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable is required');
  console.log('Please set your GitHub token:');
  console.log('export GITHUB_TOKEN=your_token_here');
  process.exit(1);
}

// Run the setup
setupBranchProtection();
