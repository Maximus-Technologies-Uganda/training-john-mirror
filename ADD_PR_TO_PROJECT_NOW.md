# Add PR 975 to Project NOW - Quick Steps

## Do This Right Now (5 minutes)

### Step 1: Create GitHub Personal Access Token
1. Go to: https://github.com/settings/tokens/new
2. Name it: `training-john-automation`
3. Set expiration: 90 days
4. Check these boxes:
   ```
   ☑ repo (Full control of private repositories)
   ☑ read:project (Read access to projects)
   ☑ write:project (Write access to projects)
   ```
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Use the Token

Choose ONE option:

#### Option A: Quick Command (Easiest)
```bash
export GH_TOKEN="ghp_xxxxx_paste_your_token_here_xxxxx"
gh pr edit 975 --add-project "training-john"
```

#### Option B: Use the Automated Script
```bash
export GH_TOKEN="ghp_xxxxx_paste_your_token_here_xxxxx"
chmod +x scripts/add-pr-to-project.sh
./scripts/add-pr-to-project.sh 975 "training-john"
```

#### Option C: Store for Future Use
```bash
# Add to your shell config (~/.bashrc, ~/.zshrc, etc.)
export GH_TOKEN="ghp_xxxxx_paste_your_token_here_xxxxx"

# Reload
source ~/.bashrc

# Then use anytime
gh pr edit 975 --add-project "training-john"
```

---

## That's It!

If successful, you'll see:
```
✓ Updated pull request #975
```

---

## What If It Fails?

### Error: "Resource not accessible"
**Fix**: Token doesn't have right permissions
- Create NEW token with ALL three boxes checked:
  - ☑ repo
  - ☑ read:project  
  - ☑ write:project

### Error: "Could not find PR"
**Fix**: PR number doesn't exist
- Run: `gh pr list` to see available PRs
- Use correct PR number

### Error: "Could not find project"
**Fix**: Project name doesn't exist
- Run: `gh project list` to see available projects
- Use exact project name

---

## Verify Token Works First

```bash
export GH_TOKEN="ghp_xxxxx_paste_your_token_here_xxxxx"

# Test 1: Check authentication
gh auth status
# Should show: ✓ Logged in to github.com as <username>

# Test 2: List projects
gh project list
# Should show available projects

# Test 3: View PR
gh pr view 975
# Should show PR details

# Test 4: Run the command
gh pr edit 975 --add-project "training-john"
# Should show: ✓ Updated pull request #975
```

---

## Store Token for Future Use (Recommended)

Add to ~/.bashrc or ~/.zshrc:
```bash
export GH_TOKEN="ghp_xxxxx_paste_your_token_here_xxxxx"
```

Then reload:
```bash
source ~/.bashrc  # or ~/.zshrc
```

Now you can use GitHub CLI commands anytime:
```bash
gh pr edit 975 --add-project "training-john"
```

---

## For GitHub Actions (CI/CD)

If you want this to run automatically on new PRs:

1. Go to your repo → Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Name: `GH_TOKEN`
4. Value: (paste your token)
5. Click **Add secret**

The workflow `.github/workflows/add-pr-to-project-workflow.yml` is already set up!

---

## Summary

```
1. Create token at https://github.com/settings/tokens/new ✓
2. Copy token ✓
3. Run: export GH_TOKEN="ghp_..." ✓
4. Run: gh pr edit 975 --add-project "training-john" ✓
5. See: ✓ Updated pull request #975 ✓
```

**You're done!**

---

**Time**: 5 minutes  
**Difficulty**: Easy  
**Automation Level**: High (script + workflow ready)

