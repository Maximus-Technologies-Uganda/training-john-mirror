# GitHub Project Automation Setup Guide

**Objective**: Automatically add PRs to the "training-john" project  
**Workflow File**: `.github/workflows/add-pr-to-project-auto.yml`  
**Status**: Ready to activate

---

## 📋 Prerequisites

Before setting up the automation, you need:

1. **GitHub Personal Access Token (PAT)** with project write access
2. **GitHub Repository** where workflow will run
3. **GitHub Project** named "training-john"
4. **Secret** stored in repository

---

## Step 1: Create a Personal Access Token

### What is a PAT?

A Personal Access Token (PAT) is a secure way to authenticate API calls without using your password.

### Create the Token

1. Go to: **https://github.com/settings/tokens/new**

2. **Fill out the form**:
   - **Token name**: `TRAINING_JOHN_PROJECT_TOKEN` (or similar)
   - **Expiration**: 90 days (recommended)
   - **Description**: "Token for automatically adding PRs to training-john project"

3. **Select Required Scopes**:
   ```
   ☑ repo
     └─ Full control of private repositories
   
   ☑ read:project
     └─ Read access to projects
   
   ☑ write:project
     └─ Write access to projects
   ```

4. **Click "Generate token"**

5. **Copy the token immediately** (you won't see it again!)
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## Step 2: Add Token as GitHub Secret

### In Your Repository

1. Go to your repository: **https://github.com/Maximus-Technologies-Uganda/training-john**

2. Click **Settings** (top right)

3. In left sidebar, click **Secrets and variables** → **Actions**

4. Click **New repository secret**

5. **Fill in the form**:
   - **Name**: `GH_PROJECT_TOKEN`
   - **Secret**: (paste the token you copied above)

6. Click **Add secret**

### Verification

You should see `GH_PROJECT_TOKEN` in your secrets list with a ✅ checkmark.

---

## Step 3: The Workflow Is Ready!

The workflow file `.github/workflows/add-pr-to-project-auto.yml` is already created and configured.

### What It Does

When a PR is created or reopened:

1. **Triggers on**: 
   - PR opened
   - PR reopened
   - Against `development` or `main` branches

2. **Performs**:
   - Checks out code
   - Uses the `GH_PROJECT_TOKEN` secret
   - Runs: `gh pr edit <PR#> --add-project "training-john"`
   - Logs success/failure

3. **Result**:
   - PR automatically added to "training-john" project
   - No manual action needed

---

## Step 4: Test It

### Test With Your Current PR

Your PR #976 (from `fix/ci-test-failures`) will automatically trigger the workflow:

1. Go to: **https://github.com/Maximus-Technologies-Uganda/training-john/pull/976**

2. Click **Actions** tab at top

3. Look for **"Auto-Add PR to Project"** workflow

4. Check if it:
   - ✅ Ran successfully, OR
   - ⚠️ Shows what needs to be fixed

### Monitor Future PRs

Once set up, **all future PRs** will automatically be added to the project when created/reopened.

---

## Troubleshooting

### ❌ Workflow Fails with "Token not found"

**Problem**: Secret `GH_PROJECT_TOKEN` not created yet

**Solution**: Follow Step 2 above to create the secret

### ❌ Workflow Fails with "Resource not accessible"

**Problem**: Token doesn't have `write:project` scope

**Solution**: Regenerate token with all three scopes:
- ☑ repo
- ☑ read:project
- ☑ write:project

### ❌ Workflow Runs but PR Not Added

**Problem**: Project name might be incorrect or token expired

**Solution**:
1. Verify project name is exactly "training-john"
2. Check if token is still valid (90-day limit)
3. Regenerate if needed

### ⚠️ Workflow Shows as "skipped"

**Problem**: Normal - workflow only runs on `development` or `main` branches

**Solution**: Merge `fix/ci-test-failures` to `development` and create new PR there

---

## Complete Setup Checklist

- [ ] **Step 1**: Create PAT at https://github.com/settings/tokens/new
  - [ ] Selected: repo
  - [ ] Selected: read:project
  - [ ] Selected: write:project
  - [ ] Copied token (ghp_...)

- [ ] **Step 2**: Add secret to repository
  - [ ] Secret name: `GH_PROJECT_TOKEN`
  - [ ] Secret value: (pasted PAT)
  - [ ] Confirmed in Settings → Secrets

- [ ] **Step 3**: Workflow file exists
  - [ ] File: `.github/workflows/add-pr-to-project-auto.yml`
  - [ ] Committed to repository

- [ ] **Step 4**: Test the workflow
  - [ ] Created or reopened a PR
  - [ ] Watched Actions tab
  - [ ] PR appeared in project

---

## How It Works (Technical Details)

### Workflow Trigger
```yaml
on:
  pull_request:
    types: [opened, reopened]  # Triggers when PR is opened or reopened
    branches:
      - development
      - main
```

### Secret Usage
```yaml
env:
  GH_TOKEN: ${{ secrets.GH_PROJECT_TOKEN }}  # Injects the PAT securely
```

### Command Executed
```bash
gh pr edit <PR#> --add-project "training-john"
```

### Why It Works Now

Previously, the workflow was trying to use `GITHUB_TOKEN` from GitHub Actions, which doesn't have project write access. Now it uses your PAT (`GH_PROJECT_TOKEN`) which has the necessary permissions.

---

## Advanced: Customize the Workflow

### Add PR to Project with Custom Fields

```yaml
# In add-pr-to-project-auto.yml, replace the gh command with:
gh pr edit $PR_NUMBER \
  --add-project "training-john" \
  --repo ${{ github.repository }}
```

### Filter by Label

```yaml
# Only add PRs with 'bug' label:
if: contains(github.event.pull_request.labels.*.name, 'bug')
```

### Filter by Author

```yaml
# Only for specific authors:
if: github.event.pull_request.user.login == 'your-username'
```

### Add Different Projects Based on Branch

```bash
if [[ "${{ github.event.pull_request.base.ref }}" == "main" ]]; then
  gh pr edit $PR_NUMBER --add-project "production"
else
  gh pr edit $PR_NUMBER --add-project "training-john"
fi
```

---

## Security Best Practices

✅ **Do**:
- Use repository secrets (not hardcoded)
- Set token expiration to 90 days
- Use minimal scopes needed (repo + read/write:project)
- Rotate tokens periodically
- Document token purpose

❌ **Don't**:
- Commit tokens to git
- Share tokens via email or chat
- Use indefinite expiration
- Grant excessive scopes
- Reuse tokens across projects

---

## FAQ

**Q: Will this work for all PRs or just specific ones?**  
A: Currently configured for PRs opened against `development` or `main` branches. Edit the workflow to add other branches.

**Q: What if the token expires?**  
A: Regenerate a new PAT and update the secret. Workflow will continue to work with the new token.

**Q: Can I use this for multiple projects?**  
A: Yes! Add more steps to the workflow with different project names.

**Q: Does this affect security?**  
A: No. The token is stored as a GitHub Secret (encrypted) and never exposed in logs.

**Q: Can I test this locally?**  
A: Yes, with `export GH_TOKEN="ghp_..." && gh pr edit 976 --add-project "training-john"`

---

## Next Steps

1. ✅ **Create PAT** at https://github.com/settings/tokens/new
2. ✅ **Add Secret** to repository settings (name: `GH_PROJECT_TOKEN`)
3. ✅ **Workflow Ready** - Already committed to repo
4. ✅ **Test** - Next PR will automatically be added to project

Once you complete steps 1-2, the automation is complete! 🎉

---

**Workflow Status**: Ready for activation  
**Required Action**: Create PAT and add as `GH_PROJECT_TOKEN` secret  
**Effort**: ~2 minutes to set up

