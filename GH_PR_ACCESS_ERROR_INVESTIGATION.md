# GitHub PR Edit Error Investigation Report

## Executive Summary

**Status**: ✅ **IDENTIFIED**

The `gh pr edit 975 --add-project "training-john"` command failed with:
```
GraphQL: Resource not accessible by integration (repository.pullRequest)
```

This is a **GitHub token permission issue**, not a PR or project existence problem.

---

## Error Analysis

### Error Message
```
GraphQL: Resource not accessible by integration (repository.pullRequest)
Error: Process completed with exit code 1.
```

### What This Means
The GitHub token being used **does not have sufficient permissions** to:
- Access the pull request (PR #975)
- Query its details
- Modify it with the `--add-project` flag

---

## Root Causes (By Probability)

### 1️⃣ **Insufficient Token Permissions** (MOST LIKELY)
The `GITHUB_TOKEN` environment variable may lack required scopes:

**Required Scopes for `gh pr edit --add-project`:**
- ✅ `repo` (full repository access)
- ✅ `read:project` (read GitHub projects)
- ✅ `write:project` (write to GitHub projects)
- ✅ `pull-requests:read` (read PRs)
- ✅ `pull-requests:write` (edit PRs)

**Common Issues:**
- Token only has `actions:read` (CI/CD token)
- Token only has `contents:read` (read-only)
- Token is `GITHUB_TOKEN` from Actions (limited scope)

### 2️⃣ **PR #975 Not Found or Private**
- PR might not exist in this repository
- PR might be in a different repository
- User might not have access to the PR

### 3️⃣ **Project Name Incorrect**
- Project name "training-john" might not exist
- Project might be in a different organization/account
- Project name needs to be a project number (not string name)

### 4️⃣ **Token Has Expired**
- `GITHUB_TOKEN` might have expired
- Token might have been revoked
- Token might have insufficient lifetime

### 5️⃣ **Repository Access Issue**
- Token might not have access to this repository
- Repository might be private and token lacks permissions
- Repository might be in an organization without proper token setup

---

## How to Verify

### 1. Check GitHub Token Status
```bash
# Verify token is working at all
gh auth status

# Should show:
# ✓ Logged in to github.com as <username>
```

### 2. Check Token Permissions
```bash
# List current token scopes
gh auth token | xargs -I {} curl -H "Authorization: token {}" https://api.github.com/user

# Look for "X-OAuth-Scopes" header in response
```

### 3. Verify PR 975 Exists
```bash
# Check if PR 975 is accessible
gh pr view 975

# Should display PR details if accessible
```

### 4. Verify Project Exists
```bash
# List available projects
gh project list

# Should show "training-john" project
```

### 5. Check Repository Access
```bash
# Verify repo is accessible
gh repo view

# Should show repository details
```

---

## Solutions by Root Cause

### Solution #1: Use Personal Access Token (PAT)
Instead of `GITHUB_TOKEN` (Actions token), create a Personal Access Token:

**Steps:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Create new token with scopes:
   - ✅ `repo` (full)
   - ✅ `project` (read:project, write:project)
3. Export as environment variable:
   ```bash
   export GH_TOKEN="ghp_xxx..."
   ```

**Why:** Personal Access Tokens have broader permissions than Actions tokens.

### Solution #2: Use Fine-Grained Personal Access Token
Create a fine-grained PAT with specific permissions:

**Required Permissions:**
- Repository: Read and Write access to:
  - Pull Requests
  - Projects (read and write)

```bash
export GH_TOKEN="github_pat_xxx..."
```

### Solution #3: Use Correct Project Reference
The project might need to be referenced by number, not name:

```bash
# Instead of:
gh pr edit 975 --add-project "training-john"

# Try:
gh pr edit 975 --add-project "1"  # Project number
```

### Solution #4: Verify PR Number
Confirm PR 975 exists in this repository:

```bash
# List all PRs
gh pr list

# Search for specific PR
gh pr list --search "number:975"
```

### Solution #5: Create Project if Missing
If "training-john" project doesn't exist:

```bash
# Create the project
gh project create --title "training-john"

# Then add PR to it
gh pr edit 975 --add-project "training-john"
```

---

## GitHub Token Scopes Reference

### Minimum Required Scopes
```
repo:status      - Access commit status
repo_deployment  - Access deployment status
public_repo      - Access public repositories
repo:invite      - Accept repository invitations
pull_request     - Create pull requests
project          - Manage projects
```

### Full Scope for PR Project Management
```json
{
  "scopes": [
    "repo",           // Full repo access
    "read:project",   // Read GitHub projects
    "write:project"   // Write to GitHub projects
  ]
}
```

---

## CI/CD Context (GitHub Actions)

If running in GitHub Actions, the built-in `GITHUB_TOKEN` has limited scopes by default.

**Default GitHub Actions Token Scopes:**
```yaml
permissions:
  contents: read
  # ❌ Does NOT include: project access, PR write access
```

**To Fix in Workflow:**
```yaml
permissions:
  contents: read
  pull-requests: write    # ✅ Add this
  projects: write         # ✅ Add this
```

Or use a Personal Access Token instead:
```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN_PAT }}
```

---

## Step-by-Step Troubleshooting

### Step 1: Verify Token Works
```bash
gh auth status
```
Expected: ✓ Logged in to github.com

### Step 2: Test Basic PR Access
```bash
gh pr view 975
```
Expected: PR details displayed

### Step 3: Verify Project Exists
```bash
gh project list
```
Expected: "training-john" listed

### Step 4: Check Token Scopes
```bash
# Get token from environment
export TOKEN="$GH_TOKEN"

# Check scopes
curl -H "Authorization: token $TOKEN" https://api.github.com/user
```
Look for `X-OAuth-Scopes` header

### Step 5: Try with Project Number
```bash
# If project name fails, try number
gh project list | grep "training-john"
# Note the project number, then:
gh pr edit 975 --add-project "PROJECT_NUMBER"
```

---

## Most Likely Cause & Solution

**Most Probable**: The `GITHUB_TOKEN` environment variable in GitHub Actions has insufficient permissions.

**Quick Fix** (if in GitHub Actions):
```yaml
jobs:
  add-to-project:
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

Or use Personal Access Token:
```yaml
- run: gh pr edit 975 --add-project "training-john"
  env:
    GH_TOKEN: ${{ secrets.PAT_TOKEN }}
```

---

## Documentation & Resources

### Official GitHub CLI Documentation
- https://cli.github.com/manual/gh_pr_edit
- https://cli.github.com/manual/gh_project

### GitHub Token Scopes
- https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps

### GitHub Actions Permissions
- https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs

---

## Summary Table

| Issue | Symptom | Solution |
|-------|---------|----------|
| Insufficient permissions | "Resource not accessible" | Use Personal Access Token with full scopes |
| PR doesn't exist | PR view fails | Verify PR number exists |
| Project doesn't exist | Project add fails | Create project first |
| Token expired | Authentication fails | Generate new token |
| Wrong project reference | Project not found | Use project number instead of name |

---

## Recommended Action

### For GitHub Actions Workflow:

**Option A: Use Personal Access Token (Recommended)**
1. Create fine-grained PAT with project/PR write access
2. Add as repository secret: `PAT_TOKEN`
3. Use in workflow:
   ```yaml
   - run: gh pr edit 975 --add-project "training-john"
     env:
       GH_TOKEN: ${{ secrets.PAT_TOKEN }}
   ```

**Option B: Update Default Token Permissions**
```yaml
permissions:
  pull-requests: write
  projects: write
```

---

## Verification Checklist

- [ ] GitHub token has `repo` scope
- [ ] GitHub token has `read:project` scope
- [ ] GitHub token has `write:project` scope
- [ ] PR #975 exists and is accessible
- [ ] Project "training-john" exists
- [ ] Token has not expired
- [ ] Repository access is not restricted
- [ ] Running in correct repository context

---

**Generated**: 2025-11-12  
**Investigator**: AI Code Assistant  
**Status**: ✅ IDENTIFIED - Token Permission Issue

