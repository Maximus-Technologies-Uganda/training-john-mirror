# Linear-GitHub Integration Test

## Test Plan for GitHub-Linear Integration

### Prerequisites
- [ ] Linear workspace has GitHub integration installed and active
- [ ] GitHub organization has Linear app installed with proper permissions
- [ ] Auto-linking features are enabled in Linear

### Test Steps

#### 1. Create Test Linear Issue
1. In Linear, create a new issue with ID (e.g., `TEST-123`)
2. Note the issue number and title

#### 2. Create Test Branch with Linear Reference
```bash
# Create branch with Linear issue reference
git checkout -b feature/TEST-123-test-linear-integration
```

#### 3. Make Test Changes
```bash
# Make a small change to test the integration
echo "# Linear Integration Test" >> test-linear-integration.md
git add test-linear-integration.md
git commit -m "feat: add Linear integration test (TEST-123)"
```

#### 4. Create Pull Request
1. Push the branch to GitHub
2. Create a pull request with title containing the Linear issue reference
3. Example PR title: "Add Linear integration test (TEST-123)"

#### 5. Verify Auto-Linking
1. Check if the Linear issue shows the linked GitHub branch/PR
2. Verify that the issue status updates appropriately
3. Check if GitHub shows the linked Linear issue in the PR

### Expected Results
- Linear issue should show linked GitHub branch and PR
- GitHub PR should show linked Linear issue
- Issue status should update based on PR lifecycle
- Comments and updates should sync between platforms

### Troubleshooting
If integration doesn't work:
1. Check Linear workspace GitHub integration status
2. Verify GitHub app permissions
3. Ensure auto-linking patterns are correctly configured
4. Check for any error messages in Linear or GitHub logs

## Integration Configuration Checklist

### Linear Workspace Settings
- [ ] GitHub integration installed and active
- [ ] Auto-linking enabled
- [ ] Workflow automations configured
- [ ] Repository connections established

### GitHub Organization Settings
- [ ] Linear app installed
- [ ] Proper permissions granted
- [ ] Repository access configured
- [ ] Webhook events enabled

### Team Configuration
- [ ] Team members have access to both Linear and GitHub
- [ ] Branch naming conventions established
- [ ] PR title conventions documented
- [ ] Issue linking patterns defined

