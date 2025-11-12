# GitHub PR Edit Error - Complete Investigation Summary

## 🔴 The Error
```
gh pr edit 975 --add-project "training-john"

GraphQL: Resource not accessible by integration (repository.pullRequest)
Error: Process completed with exit code 1.
```

---

## ✅ Root Cause Identified

**Primary Issue**: GitHub token lacks required permissions to:
1. Access pull request #975 details
2. Add the PR to the "training-john" project

**Affected Scopes**: Token missing one or more of:
- `repo` (full repository access)
- `read:project` (read GitHub projects)
- `write:project` (write to GitHub projects)

---

## 🎯 Solutions (By Priority)

### Solution #1: Use Personal Access Token (RECOMMENDED)

**If you own the token:**
1. Create PAT at: GitHub → Settings → Developer settings → Personal access tokens
2. Check scopes:
   - ✅ `repo`
   - ✅ `read:project`
   - ✅ `write:project`
3. Use in command:
   ```bash
   export GH_TOKEN="ghp_xxxxxxxxxx"
   gh pr edit 975 --add-project "training-john"
   ```

### Solution #2: Fix GitHub Actions Workflow (IF IN CI/CD)

Add to workflow permissions section:
```yaml
permissions:
  pull-requests: write
  projects: write
```

Complete example:
```yaml
name: Add PR to Project
on: pull_request

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

### Solution #3: Use Fine-Grained PAT (Alternative)

Create fine-grained Personal Access Token with:
- **Repository**: This repository only
- **Permissions**: 
  - Read: Pull Requests
  - Write: Pull Requests + Projects

Then use:
```bash
export GH_TOKEN="github_pat_xxxxxxxxxx"
gh pr edit 975 --add-project "training-john"
```

### Solution #4: Verify Prerequisites

Before troubleshooting, confirm:
```bash
# 1. Token is working
gh auth status

# 2. PR 975 exists
gh pr view 975

# 3. Project exists
gh project list | grep "training-john"

# 4. Check token scopes
curl -H "Authorization: token $GH_TOKEN" \
  https://api.github.com/user \
  | grep "X-OAuth-Scopes"
```

---

## 📊 Token Permission Matrix

| Scope | Purpose | Current | Required |
|-------|---------|---------|----------|
| `repo` | Full repository access | ❌ ? | ✅ Yes |
| `read:project` | Read projects | ❌ ? | ✅ Yes |
| `write:project` | Write to projects | ❌ ? | ✅ Yes |
| `pull-requests` | PR access | ❌ ? | ✅ Yes |

---

## 🔍 Possible Secondary Issues

While primary issue is token permissions, verify:

### Issue: PR #975 Doesn't Exist
```bash
# Check if PR exists
gh pr list --search "number:975"
```

### Issue: Project Name Incorrect
```bash
# List all projects
gh project list

# Note: Use project number if name fails
gh pr edit 975 --add-project "1"  # Replace 1 with number
```

### Issue: Token Expired
```bash
# Create new token if old one expired
# GitHub PATs can expire - check expiration date
```

### Issue: Organization/Team Restrictions
```bash
# If private organization, verify token has org access
# May need to create token with org access explicitly
```

---

## 📋 Quick Reference: What's Needed

| Component | Status | Action |
|-----------|--------|--------|
| **GitHub Token** | ❓ Check | Get PAT with full scopes |
| **PR #975** | ❓ Check | Verify it exists with `gh pr view 975` |
| **Project "training-john"** | ❓ Check | List with `gh project list` |
| **Token Scopes** | ❌ Likely Missing | Add `repo`, `read:project`, `write:project` |

---

## 🚀 Step-by-Step Fix

### Step 1: Get Personal Access Token
```bash
# Visit: https://github.com/settings/tokens
# Create new token with these scopes:
# - repo
# - read:project
# - write:project
```

### Step 2: Test Token
```bash
export GH_TOKEN="ghp_your_token_here"
gh auth status
# Should show: ✓ Logged in to github.com as <username>
```

### Step 3: Verify PR
```bash
gh pr view 975
# Should display PR details
```

### Step 4: Verify Project
```bash
gh project list
# Should show: training-john project
```

### Step 5: Execute Command
```bash
gh pr edit 975 --add-project "training-john"
# Should display: ✓ Updated pull request #975
```

---

## 🔐 Security Notes

### If Using in GitHub Actions

**DO**: Use repository secrets
```yaml
env:
  GH_TOKEN: ${{ secrets.PAT_TOKEN }}
```

**DON'T**: Hardcode tokens in workflow files

### Creating PAT Safely

1. ✅ Use minimum required scopes
2. ✅ Set expiration date (e.g., 90 days)
3. ✅ Store in GitHub Secrets (not as env var)
4. ✅ Rotate regularly
5. ✅ Don't share or commit to repo

---

## 📚 Documentation References

- **GitHub CLI PR Edit**: https://cli.github.com/manual/gh_pr_edit
- **GitHub CLI Project**: https://cli.github.com/manual/gh_project
- **OAuth Scopes**: https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
- **Personal Access Tokens**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

---

## ✅ Verification Checklist

- [ ] GitHub token has `repo` scope
- [ ] GitHub token has `read:project` scope
- [ ] GitHub token has `write:project` scope
- [ ] Token is not expired
- [ ] PR #975 exists in repository
- [ ] Project "training-john" exists
- [ ] Token is accessible in current environment
- [ ] Correct repository is being targeted

---

## 🎯 Most Likely Scenario

**If this is running in GitHub Actions:**
- Default `GITHUB_TOKEN` has limited scopes
- Missing: `projects: write` permission
- Fix: Add to workflow permissions

**If running locally:**
- `GITHUB_TOKEN` environment variable not set properly
- OR token lacks required scopes
- Fix: Create and use Personal Access Token

---

## Summary

| Aspect | Details |
|--------|---------|
| **Error** | GraphQL: Resource not accessible by integration |
| **Root Cause** | GitHub token missing project/PR write scopes |
| **Primary Fix** | Use Personal Access Token with full scopes |
| **Secondary Fix** | Add workflow permissions (if in GitHub Actions) |
| **Verification** | Run `gh auth status` and `gh pr view 975` |
| **Time to Fix** | 5-10 minutes |

---

## 📞 Need More Help?

1. **Check token permissions**: `gh auth status`
2. **Verify PR exists**: `gh pr view 975`
3. **List available projects**: `gh project list`
4. **Check token scopes**: Look for X-OAuth-Scopes header
5. **Create new token**: https://github.com/settings/tokens

---

**Status**: ✅ INVESTIGATED - Solution documented  
**Next Step**: Apply recommended fix (#1 or #2 above)

