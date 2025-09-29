#!/usr/bin/env node

/**
 * Verification script to check branch protection and mirroring setup
 */

import https from 'https';

// Configuration
const REPO_OWNER = 'Maximus-Technologies-Uganda';
const REPO_NAME = 'training-john';
const BRANCH_NAME = 'development';
const MIRROR_REPO = 'training-john-mirror';

function makeGitHubRequest(path, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${REPO_OWNER}/${REPO_NAME}${path}`,
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Setup-Verification-Script'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
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
        } catch (e) {
          reject(new Error(`Failed to parse response: ${responseData}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });
    
    req.end();
  });
}

async function checkRepository() {
  try {
    console.log('🔍 Checking repository configuration...');
    
    const repo = await makeGitHubRequest('');
    console.log(`✅ Repository: ${repo.full_name}`);
    console.log(`✅ Default branch: ${repo.default_branch}`);
    console.log(`✅ Private: ${repo.private}`);
    console.log(`✅ Fork: ${repo.fork}`);
    
    if (repo.default_branch !== BRANCH_NAME) {
      console.log(`⚠️  Warning: Default branch is '${repo.default_branch}', expected '${BRANCH_NAME}'`);
    } else {
      console.log(`✅ Default branch is correctly set to '${BRANCH_NAME}'`);
    }
    
    return repo;
  } catch (error) {
    console.error(`❌ Failed to get repository info: ${error.message}`);
    throw error;
  }
}

async function checkBranchProtection(token) {
  try {
    console.log('\n🔍 Checking branch protection rules...');
    
    if (!token) {
      console.log('⚠️  No GitHub token provided, skipping branch protection check');
      return;
    }
    
    const protection = await makeGitHubRequest(`/branches/${BRANCH_NAME}/protection`, token);
    
    console.log('✅ Branch protection is enabled');
    console.log(`✅ Required status checks: ${protection.required_status_checks ? 'Yes' : 'No'}`);
    
    if (protection.required_status_checks) {
      console.log(`   - Strict: ${protection.required_status_checks.strict}`);
      console.log(`   - Contexts: ${protection.required_status_checks.contexts.join(', ')}`);
    }
    
    console.log(`✅ Required PR reviews: ${protection.required_pull_request_reviews ? 'Yes' : 'No'}`);
    if (protection.required_pull_request_reviews) {
      console.log(`   - Required approvals: ${protection.required_pull_request_reviews.required_approving_review_count}`);
      console.log(`   - Dismiss stale reviews: ${protection.required_pull_request_reviews.dismiss_stale_reviews}`);
    }
    
    console.log(`✅ Allow force pushes: ${protection.allow_force_pushes}`);
    console.log(`✅ Allow deletions: ${protection.allow_deletions}`);
    
  } catch (error) {
    if (error.message.includes('404')) {
      console.log(`❌ Branch protection is not configured for '${BRANCH_NAME}' branch`);
    } else {
      console.error(`❌ Failed to check branch protection: ${error.message}`);
    }
  }
}

async function checkWorkflows() {
  try {
    console.log('\n🔍 Checking GitHub Actions workflows...');
    
    const workflows = await makeGitHubRequest('/actions/workflows');
    
    console.log(`✅ Found ${workflows.total_count} workflows`);
    
    const workflowNames = workflows.workflows.map(w => w.name);
    console.log('Workflows:', workflowNames.join(', '));
    
    // Check for required workflows
    const requiredWorkflows = ['Quality Gate', 'Review Packet'];
    for (const workflowName of requiredWorkflows) {
      if (workflowNames.includes(workflowName)) {
        console.log(`✅ Found required workflow: ${workflowName}`);
      } else {
        console.log(`⚠️  Missing required workflow: ${workflowName}`);
      }
    }
    
  } catch (error) {
    console.error(`❌ Failed to check workflows: ${error.message}`);
  }
}

async function checkMirrorRepository() {
  try {
    console.log('\n🔍 Checking mirror repository...');
    
    const mirrorRepo = await makeGitHubRequest(`/repos/${REPO_OWNER}/${MIRROR_REPO}`);
    console.log(`✅ Mirror repository exists: ${mirrorRepo.full_name}`);
    console.log(`✅ Mirror is public: ${!mirrorRepo.private}`);
    console.log(`✅ Mirror default branch: ${mirrorRepo.default_branch}`);
    
  } catch (error) {
    if (error.message.includes('404')) {
      console.log(`❌ Mirror repository '${MIRROR_REPO}' does not exist`);
    } else {
      console.error(`❌ Failed to check mirror repository: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🚀 Verifying Branch Protection and Mirroring Setup\n');
  
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('⚠️  No GITHUB_TOKEN provided, some checks will be skipped');
  }
  
  try {
    await checkRepository();
    await checkBranchProtection(token);
    await checkWorkflows();
    await checkMirrorRepository();
    
    console.log('\n✅ Verification completed!');
    console.log('\nNext steps:');
    console.log('1. If branch protection is not configured, run: node setup-branch-protection.js');
    console.log('2. Test the setup by creating a PR to development branch');
    console.log('3. Verify that Quality Gate and Review Packet workflows run');
    console.log('4. Check that changes appear in the mirror repository after merging');
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

main();
