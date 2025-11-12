# GitHub Project Automation - Quick Setup (3 Steps)

**Problem Solved**: Automated PR to Project Assignment  
**Time Required**: ~2 minutes  
**Status**: Workflow ready, just need to create PAT + add secret

---

## 🚀 Quick Start (3 Steps)

### Step 1️⃣: Create Personal Access Token (PAT)

Go to: https://github.com/settings/tokens/new

**Fill form**:
- **Token name**: `training-john-automation`
- **Expiration**: 90 days
- **Scopes** (check these 3):
  - ☑ repo
  - ☑ read:project
  - ☑ write:project

Click **Generate token** → **Copy immediately** (can't see it again!)

```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ← Copy this
```

---

### Step 2️⃣: Add Token as GitHub Secret

Go to: https://github.com/Maximus-Technologies-Uganda/training-john/settings/secrets/actions

Click **New repository secret**:
- **Name**: `GH_PROJECT_TOKEN`
- **Secret**: (paste your token from Step 1)

Click **Add secret** ✅

---

### Step 3️⃣: Done! Workflow Is Ready

✅ Workflow file already created: `.github/workflows/add-pr-to-project-auto.yml`  
✅ Committed to `fix/ci-test-failures` branch  
✅ Pushed to GitHub  

**That's it!** Now:
- Any PR opened → **Automatically added to "training-john" project**
- No more manual `gh pr edit` commands needed
- Works for all future PRs on `development` or `main` branches

---

## 📋 What The Workflow Does

```
When: PR is opened or reopened
Against: development or main branches
Action: Automatically adds PR to "training-john" project
Uses: GH_PROJECT_TOKEN secret (your PAT)
```

---

## ✅ Complete Setup Checklist

```
Step 1: Create PAT
  ☐ Go to https://github.com/settings/tokens/new
  ☐ Name: training-john-automation
  ☐ Check: repo, read:project, write:project
  ☐ Generate and copy token (ghp_...)

Step 2: Add Secret to Repository
  ☐ Go to repo Settings → Secrets and variables → Actions
  ☐ Click "New repository secret"
  ☐ Name: GH_PROJECT_TOKEN
  ☐ Value: (paste your PAT)
  ☐ Add secret

Step 3: Verify
  ☐ Secret appears in list with ✅
  ☐ Workflow file exists: .github/workflows/add-pr-to-project-auto.yml
  ☐ Next PR will auto-add to project
```

---

## 🧪 Test It

After completing Steps 1-2:

1. Create any new PR against `development` or `main`
2. Go to PR → **Actions** tab
3. Look for **"Auto-Add PR to Project"** workflow
4. Should show ✅ Success
5. Check PR in project board - it should appear there!

---

## 📚 Detailed Documentation

For full setup guide with troubleshooting:
→ **SETUP_GITHUB_PROJECT_AUTOMATION.md**

---

## 🔐 Why This Works Now

**Before**: Used `GITHUB_TOKEN` (GitHub Actions built-in) → ❌ No project access  
**Now**: Uses `GH_PROJECT_TOKEN` (your PAT) → ✅ Full project access

---

## 💡 Pro Tips

- **Token expires**: Create new one, update secret, done
- **Need different project**: Edit workflow file, change project name
- **Only specific branches**: Edit `branches:` in workflow file
- **Rotate regularly**: Create new PAT every 90 days for security

---

**Status**: ✅ Ready to activate!

Just complete the 2 steps above and you're done. 🎉

