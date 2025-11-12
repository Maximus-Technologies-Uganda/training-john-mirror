# GitHub Personal Access Token (PAT) Setup Guide

Complete guide to create and configure a Personal Access Token for GitHub CLI operations.

---

## 📋 Quick Start

### Step 1: Create Personal Access Token
Visit: https://github.com/settings/tokens/new

**Token Settings:**
```
Token name: training-john-automation
Expiration: 90 days (recommended)
```

**Select Scopes:**
```
✅ repo (Full control of private repositories)
✅ read:project (Read access to projects)
✅ write:project (Write access to projects)
```

### Step 2: Copy Token
After clicking "Generate token", copy the displayed token. **You won't see it again!**

### Step 3: Use Token

**Option A: One-time use**
```bash
export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxx"
gh pr edit 975 --add-project "training-john"
```

**Option B: Add to ~/.bashrc or ~/.zshrc**
```bash
export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxx"
```

**Option C: Use with script**
```bash
./scripts/add-pr-to-project.sh 975 "training-john"
# (script reads GH_TOKEN from environment)
```

---

## 🔐 Full Setup Guide (Step-by-Step)

### Creating a Personal Access Token

#### Step 1: Access Token Settings
1. Go to GitHub.com
2. Click your avatar (top right)
3. Select **Settings**
4. In left sidebar, click **Developer settings**
5. Click **Personal access tokens**
6. Click **Tokens (classic)** (or **Fine-grained tokens** for more control)

#### Step 2: Generate New Token
- Click **Generate new token**
- Select **Generate new token (classic)** if prompted

#### Step 3: Configure Token

**Token Name:**
```
training-john-automation
```

**Expiration:**
```
90 days (recommended for security)
```

**Select Scopes:**
```
[✓] repo
    Full control of private repositories
    - [✓] repo:status
    - [✓] repo_deployment
    - [✓] public_repo
    - [✓] repo:invite
    - [✓] security_events

[✓] project
    - [✓] read:project
    - [✓] write:project
```

#### Step 4: Generate and Copy Token
- Click **Generate token**
- **IMPORTANT**: Copy the token immediately
- You won't be able to see it again!

Format:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 💾 Store Token Safely

### Option 1: GitHub Repository Secret (RECOMMENDED for CI/CD)

1. Go to Repository → Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Name: `GH_TOKEN`
4. Value: (paste your token)
5. Click **Add secret**

Use in GitHub Actions:
```yaml
env:
  GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

### Option 2: Local Environment Variable

```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.fish/config.fish
export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxx"

# Reload shell
source ~/.bashrc  # or your shell config file

# Verify
echo $GH_TOKEN
```

### Option 3: .env File (Development Only)

```bash
# Create .env in project root
echo 'GH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx' > .env

# Source in script
set -a
source .env
set +a
```

**⚠️ WARNING**: Add `.env` to `.gitignore`!
```bash
echo ".env" >> .gitignore
```

### Option 4: Git Credentials

Store in Git credential helper:
```bash
# macOS
git credential-osxkeychain store <<EOF
host=github.com
username=<your-username>
password=<your-token>
EOF

# Linux
git config --global credential.helper store
# Then run any git command and enter token when prompted
```

---

## ✅ Verify Token Works

### Test Token Validity
```bash
export GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxx"

# This should show your GitHub username
gh auth status

# Expected output:
# ✓ Logged in to github.com as <username>
```

### Test Project Access
```bash
# List projects
gh project list

# Should show available projects including "training-john"
```

### Test PR Access
```bash
# View a PR
gh pr view 975

# Should display PR details
```

### Test Full Command
```bash
# Run the actual command
gh pr edit 975 --add-project "training-john"

# Should output:
# ✓ Updated pull request #975
```

---

## 🚀 Use the Automation Script

### Prerequisites
```bash
# Verify gh CLI is installed
gh --version

# Verify token is set
echo $GH_TOKEN
```

### Run Script
```bash
# Make script executable
chmod +x scripts/add-pr-to-project.sh

# Run with PR and project name
./scripts/add-pr-to-project.sh 975 "training-john"

# Expected output:
# ========================================
# GitHub PR Project Automation
# ========================================
# PR: #975
# Project: training-john
# ...
# ✓ Successfully added PR #975 to project "training-john"
```

---

## 🔄 Use GitHub Actions Workflow

Workflow file already created: `.github/workflows/add-pr-to-project-workflow.yml`

### Automatic Trigger
The workflow automatically runs when:
- A new PR is opened
- A PR is reopened

### Manual Trigger
Go to: **Actions** → **Add PR to Project** → **Run workflow**

**Inputs:**
- PR Number (optional - uses current PR if empty)
- Project Name (optional - defaults to "training-john")

---

## 🔑 Token Scope Explanation

### Why These Scopes?

| Scope | Purpose | Why Needed |
|-------|---------|-----------|
| `repo` | Full repository access | Read PR details, access repo |
| `read:project` | Read GitHub projects | List and view projects |
| `write:project` | Write to projects | Add PR to project |

### Minimum Scopes

For this specific task, technically minimum is:
```
- repo (or repo:read for read-only)
- write:project
```

But we recommend full `repo` scope for flexibility.

### Fine-Grained Tokens (Alternative)

GitHub now offers Fine-grained tokens for minimal permissions:

1. Go to https://github.com/settings/tokens?type=beta
2. Click **Generate new token**
3. Select **Fine-grained token**
4. Set **Repository access**: This repository only
5. Under **Permissions**, set:
   - **Pull Requests**: Read and write
   - **Projects**: Read and write
6. Generate and copy token

---

## 🔒 Security Best Practices

### DO:
✅ Use Personal Access Tokens (not passwords)  
✅ Limit token scopes to minimum needed  
✅ Set reasonable expiration (90 days recommended)  
✅ Store in GitHub Secrets or credential manager  
✅ Rotate tokens regularly  
✅ Use fine-grained tokens for limited access  
✅ Review and remove unused tokens  

### DON'T:
❌ Commit tokens to repository  
❌ Share tokens via email or chat  
❌ Use tokens with `admin:write_hook` unless necessary  
❌ Create tokens that never expire  
❌ Reuse same token for multiple services  
❌ Store tokens in plaintext files  

---

## 🆘 Troubleshooting

### "GraphQL: Resource not accessible"
**Cause**: Token lacks required scopes  
**Fix**: Create new token with `repo`, `read:project`, `write:project` scopes

### "Could not find PR"
**Cause**: PR number doesn't exist or token can't access it  
**Fix**: Verify PR number with `gh pr list`

### "Could not find project"
**Cause**: Project name doesn't exist or is named differently  
**Fix**: List projects with `gh project list`

### "Not authorized to perform this action"
**Cause**: Token lacks write permission  
**Fix**: Create new token with `write:project` scope

### "Token is expired"
**Cause**: Token past its expiration date  
**Fix**: Create new token, update stored value

---

## 📚 Reference Commands

```bash
# List all available commands
gh --help

# List all projects
gh project list

# View specific project
gh project view <number>

# List all PRs
gh pr list

# View specific PR
gh pr view 975

# Edit PR (add to project)
gh pr edit 975 --add-project "training-john"

# View PR in browser
gh pr view 975 --web

# Check authentication
gh auth status

# List tokens (on github.com - not via CLI)
# Go to: https://github.com/settings/tokens
```

---

## ✨ One-Liner Quick Start

```bash
# 1. Create token at https://github.com/settings/tokens/new
# 2. Copy token to clipboard
# 3. Run these commands:

export GH_TOKEN="ghp_paste_your_token_here"
./scripts/add-pr-to-project.sh 975 "training-john"
```

---

## 📝 Checklist

- [ ] Created Personal Access Token on GitHub.com
- [ ] Selected required scopes: `repo`, `read:project`, `write:project`
- [ ] Copied token (it won't show again!)
- [ ] Stored token securely (GitHub Secret or credential manager)
- [ ] Verified token works: `gh auth status`
- [ ] Tested token on project: `gh project list`
- [ ] Ran automation script or workflow successfully
- [ ] Saved token for future use

---

**Status**: Ready to use GitHub automation  
**Next Step**: Follow "Quick Start" section above

