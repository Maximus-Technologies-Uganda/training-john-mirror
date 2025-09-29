# Branch Protection and Mirroring Setup

This document outlines the setup for branch protection rules and mirroring configuration for the `development` branch.

## Overview

The repository is configured with:
- **Default branch**: `development` (protected)
- **Branch protection rules**: Require Quality Gate and Review Packet checks
- **Mirror repository**: `training-john-mirror` (public mirror)

## Branch Protection Rules

The `development` branch is protected with the following rules:

### Required Status Checks
- ✅ **Quality Gate** - Must pass before merging
- ✅ **Review Packet** - Must pass before merging

### Pull Request Requirements
- ✅ **Required reviews**: At least 1 approval required
- ✅ **Dismiss stale reviews**: Stale reviews are dismissed when new commits are pushed
- ✅ **Force pushes**: Not allowed
- ✅ **Branch deletion**: Not allowed

## Workflows

### Quality Gate Workflow
- **File**: `.github/workflows/quality-gate.yml`
- **Triggers**: Pull requests to `development` branch
- **Checks**: Linting, testing, coverage reports

### Review Packet Workflow
- **File**: `.github/workflows/review-packet.yml`
- **Triggers**: PR labeled with `needs-review-packet` or manual dispatch
- **Output**: Comprehensive review packet with change analysis

### Mirror Workflow
- **File**: `.github/workflows/repo-mirror.yml`
- **Triggers**: Push to any branch
- **Target**: `training-john-mirror` repository

## Manual Setup Instructions

### 1. Set Default Branch to Development

```bash
# Verify current default branch
git remote show origin

# If not already set, change default branch in GitHub repository settings:
# 1. Go to repository Settings > General
# 2. Under "Default branch", change from 'main' to 'development'
# 3. Click "Update" and confirm
```

### 2. Configure Branch Protection Rules

#### Option A: Using GitHub CLI
```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Set up branch protection
gh api repos/:owner/:repo/branches/development/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Quality Gate","Review Packet"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

#### Option B: Using the Setup Script
```bash
# Set your GitHub token
export GITHUB_TOKEN=your_token_here

# Run the setup script
node setup-branch-protection.js
```

#### Option C: Using GitHub Web Interface
1. Go to repository Settings > Branches
2. Click "Add rule" or edit existing rule for `development`
3. Configure:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Dismiss stale PR approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
     - ✅ Quality Gate
     - ✅ Review Packet
   - ✅ Require branches to be up to date before merging
   - ❌ Allow force pushes
   - ❌ Allow deletions

### 3. Verify Mirror Repository

The mirror repository is configured to automatically sync with the main repository:

```bash
# Check mirror remote
git remote -v

# Test mirroring (manual trigger)
git push mirror development

# Verify mirror repository has latest changes
curl -s https://api.github.com/repos/Maximus-Technologies-Uganda/training-john-mirror/branches/development
```

## Verification Steps

### 1. Test Branch Protection
1. Create a new branch from `development`
2. Make some changes
3. Create a pull request to `development`
4. Verify that:
   - Quality Gate workflow runs
   - Review Packet can be triggered
   - PR cannot be merged without passing checks

### 2. Test Mirroring
1. Make changes to `development` branch
2. Push changes to origin
3. Verify changes appear in mirror repository
4. Check mirror repository URL: https://github.com/Maximus-Technologies-Uganda/training-john-mirror

### 3. Test Complete Flow
1. Create feature branch
2. Make changes
3. Create PR to `development`
4. Wait for Quality Gate to pass
5. Generate Review Packet
6. Get approval
7. Merge PR
8. Verify changes appear in mirror repository

## Troubleshooting

### Branch Protection Not Working
- Check that workflows are enabled in repository settings
- Verify that the workflow files are in the correct location
- Ensure the workflow names match exactly: "Quality Gate" and "Review Packet"

### Mirroring Not Working
- Check that `MIRROR_RAT` or `MIRROR_PAT` secrets are set
- Verify the mirror repository exists and is accessible
- Check workflow logs for errors

### Workflow Not Triggering
- Ensure workflows are in `.github/workflows/` directory
- Check that the workflow syntax is valid
- Verify trigger conditions are met

## Security Considerations

- Branch protection rules prevent direct pushes to `development`
- All changes must go through pull requests
- Required status checks ensure code quality
- Mirror repository provides public access to stable code

## Maintenance

- Regularly review and update branch protection rules
- Monitor workflow performance and adjust as needed
- Keep mirror repository in sync with main repository
- Update documentation when workflows change
