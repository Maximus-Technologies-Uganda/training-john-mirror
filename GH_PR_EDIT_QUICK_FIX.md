# GitHub PR Edit Error - Quick Fix Guide

## The Problem
```
gh pr edit 975 --add-project "training-john"
GraphQL: Resource not accessible by integration (repository.pullRequest)
```

**Root Cause**: GitHub token doesn't have required permissions for:
- Reading pull request details
- Adding PRs to projects

---

## Quick Solutions

### Solution 1: Use Personal Access Token (Recommended)
```bash
export GH_TOKEN="ghp_xxxxxxxxxx"  # Your PAT with project scopes
gh pr edit 975 --add-project "training-john"
```

**Required PAT Scopes:**
- ✅ `repo` (full repository access)
- ✅ `read:project` (read projects)
- ✅ `write:project` (write to projects)

### Solution 2: Fix GitHub Actions Workflow
Add permissions to your workflow:

```yaml
jobs:
  add-pr-to-project:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      projects: write
    steps:
      - uses: actions/checkout@v3
      - run: gh pr edit 975 --add-project "training-john"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Solution 3: Use Project Number Instead of Name
```bash
# List projects to find the number
gh project list

# Then use the number instead:
gh pr edit 975 --add-project "1"  # Replace 1 with actual project number
```

### Solution 4: Create Personal Access Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Check these scopes:
   - ✅ `repo`
   - ✅ `read:project`
   - ✅ `write:project`
4. Copy token and use:
   ```bash
   export GH_TOKEN="ghp_xxx..."
   gh pr edit 975 --add-project "training-john"
   ```

---

## Verify Solutions

### Check Token Permissions
```bash
gh auth status
# Shows current authentication status
```

### Verify PR Exists
```bash
gh pr view 975
# Should show PR details
```

### Verify Project Exists
```bash
gh project list
# Should list all available projects
```

---

## Common Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Resource not accessible" | Token missing permissions | Use PAT with project scopes |
| "Could not find PR" | PR doesn't exist | Check PR number is correct |
| "Could not find project" | Project doesn't exist | Create project first |
| "Permission denied" | Token lacks write access | Update PAT scopes |

---

## For GitHub Actions

**The Simplest Fix:**

Add this to your workflow's job section:
```yaml
permissions:
  pull-requests: write
  projects: write
```

That's it! The default `GITHUB_TOKEN` will now have the required permissions.

---

## Test Command
```bash
# This should work once token is fixed:
gh pr edit 975 --add-project "training-john"
```

Expected output:
```
✓ Updated pull request #975
```

---

**Status**: Token permission issue identified - Use Personal Access Token or update workflow permissions

