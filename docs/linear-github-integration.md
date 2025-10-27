# Linear-GitHub Integration Setup Guide

## Overview

This guide provides step-by-step instructions for setting up and confirming the GitHub-Linear integration for the training-john project. The integration enables automatic linking between Linear issues and GitHub pull requests, branches, and commits.

## Prerequisites

- Access to Linear workspace admin settings
- Access to GitHub organization admin settings
- Repository access permissions

## Setup Steps

### 1. Linear Workspace Configuration

#### Install GitHub Integration
1. Navigate to Linear workspace settings
2. Go to "Integrations" → "GitHub"
3. Click "Connect GitHub" if not already connected
4. Authorize Linear to access your GitHub account
5. Grant necessary permissions for repository access

#### Configure Auto-Linking
1. In Linear Settings → Integrations → GitHub
2. Enable "Auto-link issues and pull requests"
3. Configure linking patterns:
   - Branch names: `feature/ISSUE-123-description`
   - PR titles: Include issue reference like `(ISSUE-123)`
   - Commit messages: Include issue reference

#### Set Up Workflow Automations
Create automation rules in Linear:
- **When PR is created**: Move issue to "In Progress"
- **When PR is merged**: Move issue to "Done"
- **When PR is closed without merge**: Move issue to "Cancelled"

### 2. GitHub Organization Configuration

#### Install Linear App
1. Go to GitHub organization settings
2. Navigate to "Third-party access" → "Installed GitHub Apps"
3. Search for and install "Linear" app
4. Grant necessary permissions:
   - Repository contents (read)
   - Issues (read and write)
   - Pull requests (read and write)
   - Metadata (read)

#### Configure Repository Access
1. Select repositories for Linear integration
2. Ensure Linear has access to the `training-john` repository
3. Verify webhook events are enabled

### 3. Team Configuration

#### Branch Naming Convention
Use the following pattern for branches:
```
feature/ISSUE-123-short-description
bugfix/ISSUE-456-fix-description
hotfix/ISSUE-789-urgent-fix
```

#### PR Title Convention
Include Linear issue reference in PR titles:
```
feat: Add new feature (ISSUE-123)
fix: Resolve bug in authentication (ISSUE-456)
docs: Update API documentation (ISSUE-789)
```

#### Commit Message Convention
Include Linear issue reference in commit messages:
```
feat: implement user authentication (ISSUE-123)
fix: resolve memory leak in data processing (ISSUE-456)
```

## Testing the Integration

### Test Procedure
1. Create a test Linear issue (e.g., `TEST-001`)
2. Create a branch: `git checkout -b feature/TEST-001-integration-test`
3. Make changes and commit: `git commit -m "feat: test integration (TEST-001)"`
4. Create PR with title: "Test Linear integration (TEST-001)"
5. Verify linking in both Linear and GitHub

### Expected Results
- Linear issue shows linked GitHub branch and PR
- GitHub PR shows linked Linear issue
- Issue status updates automatically based on PR lifecycle
- Comments sync between platforms

## Troubleshooting

### Common Issues

#### Integration Not Working
1. Check Linear workspace GitHub integration status
2. Verify GitHub app permissions
3. Ensure auto-linking patterns are correctly configured
4. Check for error messages in Linear or GitHub logs

## Automated Sub-Issue Sync

### Overview
- Workflow file: `.github/workflows/sync-linear-subtasks.yml`
- Script entry point: `npm run sync:linear` (runs `scripts/sync-linear-subtasks.mjs`)
- Trigger: Pushes to non-`main` branches that modify `specs/001-ui-scaffold-spec/tasks.md`; manual `workflow_dispatch` is available.

### Configuration
1. Add `LINEAR_API_KEY` secret to the repository (already configured).
2. Add `LINEAR_PARENT_ISSUE_ID` secret containing the Linear parent issue ID (e.g., `TEAM-123`).
3. Optional: Set `LINEAR_TASKS_FILE` secret/env if the tasks source file changes.

### Parent Issue Template Suggestion
- Title: `UI Scaffold Initiative: Linear Sync Tracker`
- Description: Outline Phase 1-6 objectives and specify that sub-issues are maintained automatically by GitHub Actions.

### Expected Behavior
- Each task line in `specs/001-ui-scaffold-spec/tasks.md` creates or updates a Linear sub-issue with consistent titling.
- Task completion toggles the Linear state between the team's `Unstarted` (or backlog-equivalent) and `Completed` states.
- Issue descriptions include phase/section metadata and reference the originating markdown line.

### Troubleshooting
- Review workflow logs for `Created/Updated` counts; zero indicates parsing or credential issues.
- Confirm the parent issue belongs to a team with both `Unstarted` and `Completed` states available.
- For manual re-syncs, trigger the workflow dispatch and optionally override the parent issue ID input.

#### Auto-Linking Not Working
1. Verify branch naming follows convention
2. Check PR titles include issue references
3. Ensure commit messages reference issues
4. Confirm Linear issue IDs are correct

#### Permission Issues
1. Verify GitHub app has necessary permissions
2. Check repository access settings
3. Ensure team members have access to both platforms
4. Verify webhook events are enabled

## Best Practices

### For Developers
1. Always include Linear issue reference in branch names
2. Reference issues in PR titles and commit messages
3. Update Linear issues when making significant changes
4. Use consistent naming conventions

### For Project Managers
1. Create Linear issues for all GitHub work
2. Use clear, descriptive issue titles
3. Assign appropriate labels and priorities
4. Monitor integration status regularly

### For Administrators
1. Regularly review integration permissions
2. Monitor webhook delivery status
3. Keep integration settings up to date
4. Train team on proper usage

## Monitoring and Maintenance

### Regular Checks
- Weekly: Verify integration is working correctly
- Monthly: Review and update permissions
- Quarterly: Assess integration effectiveness

### Key Metrics
- Number of linked issues and PRs
- Auto-linking success rate
- Issue status update accuracy
- Team adoption rate

## Support Resources

- [Linear GitHub Integration Documentation](https://linear.app/docs/github-integration)
- [GitHub Apps Documentation](https://docs.github.com/en/developers/apps)
- [Linear Support](https://linear.app/help)

## Contact Information

For integration issues or questions:
- Technical Lead: [Contact Information]
- Project Manager: [Contact Information]
- Linear Support: [Linear Support Contact]

