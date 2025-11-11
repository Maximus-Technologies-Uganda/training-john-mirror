# Week 3 Capstone: Playwright Configuration & CI/CD Setup Guide

## Overview

This guide documents the complete Playwright test setup for the Week 3 Capstone project, including local test execution and CI/CD artifact generation.

---

## ✅ 1. Configuration Status

### Playwright Configurations Updated ✅

All three apps now have **complete Playwright configurations**:

- ✅ **apps/expense/ui/playwright.config.ts** - Updated
- ✅ **apps/stopwatch/ui/playwright.config.ts** - Updated
- ✅ **apps/temp/ui/playwright.config.ts** - Updated

#### Key Configuration Details

Each config includes:

```typescript
outputDir: 'test-results/playwright',  // Where artifacts are stored
use: {
  baseURL: 'http://localhost:PORT',
  trace: 'on-first-retry',             // Capture traces on retry
  screenshot: 'only-on-failure',       // Capture screenshots on failure
  video: 'retain-on-failure',          // Record videos on failure
},
```

**Artifact Generation:**
- 📸 **Screenshots** - Generated only when tests fail
- 🎥 **Videos** - Recorded only when tests fail (saves disk space)
- 🔍 **Traces** - Captured on first retry for debugging
- 📊 **HTML Report** - Full test report with all details

---

## ✅ 2. CI/CD Workflow Setup

### GitHub Actions Pipeline Created ✅

New file: `.github/workflows/playwright.yml`

**Pipeline Structure:**
1. **Three parallel test jobs** (expense, stopwatch, temp)
2. **Each job:**
   - Checks out code
   - Installs dependencies
   - Installs Playwright browsers with system dependencies
   - Runs Playwright tests
   - Uploads individual artifacts
3. **Final publishing job:**
   - Downloads all artifacts
   - Organizes into `review-artifacts/playwright/`
   - Publishes consolidated artifact

**Key Features:**
- ✅ `if: always()` - Artifacts upload even if tests fail
- ✅ 30-day retention for individual runs
- ✅ 90-day retention for review artifacts
- ✅ Automatic browser installation
- ✅ Parallel test execution for speed

---

## 📋 3. Local Test Execution

### Prerequisites

Ensure you're in the correct app directory and dependencies are installed:

```bash
# Navigate to the app
cd apps/expense/ui
# OR
cd apps/stopwatch/ui
# OR
cd apps/temp/ui

# Install dependencies
npm install
```

### Run Tests Locally

#### Option 1: Run Tests and Generate Artifacts

```bash
npm run e2e
```

**What this does:**
- Starts the dev server automatically
- Runs all Playwright tests
- Generates HTML reports
- Captures screenshots (on failure only)
- Records videos (on failure only)
- Captures traces (on retry)

#### Option 2: Run Tests in UI Mode (Interactive)

```bash
npm run e2e:ui
```

**What this does:**
- Opens an interactive Playwright test runner
- Shows each test step-by-step
- Allows pausing and debugging
- No artifacts generated

#### Option 3: Run Specific Tests

```bash
# Run a specific test file
npx playwright test e2e/expense-workflow.spec.ts

# Run tests matching a pattern
npx playwright test --grep "validation"

# Run tests in specific browser
npx playwright test --project chromium
```

---

## 📁 4. Artifact Locations

### Local Artifact Path

After running tests locally, artifacts are stored in:

```
apps/[APP_NAME]/ui/test-results/playwright/
```

**Example:**
```
apps/expense/ui/test-results/playwright/
├── index.html                          # Main HTML report
├── test-results/
│   ├── trace-*.zip                     # Execution traces (for debugging)
│   └── chromium/
│       ├── expenses-11495-...
│       │   ├── test-finished.json
│       │   ├── screenshots/
│       │   │   └── *.png              # Failed test screenshots
│       │   └── video.webm             # Failed test videos
│       ├── firefox/
│       └── webkit/
└── data/
    └── *.json                          # Test metadata
```

### CI/CD Artifact Path

After running in GitHub Actions, artifacts are organized in:

```
review-artifacts/playwright/
├── expense/                           # Expense app artifacts
│   ├── index.html
│   ├── test-results/
│   └── ...
├── stopwatch/                         # Stopwatch app artifacts
│   ├── index.html
│   ├── test-results/
│   └── ...
└── temp/                              # Temp converter app artifacts
    ├── index.html
    ├── test-results/
    └── ...
```

---

## 🔍 5. Artifact Types & Usage

### HTML Report

**Location:** `test-results/playwright/index.html`

**What it contains:**
- Complete test execution summary
- Pass/fail status for each test
- Execution time for each test
- Browser and OS information
- Links to traces, videos, and screenshots

**How to view:**
```bash
# On Windows (from app directory)
start test-results/playwright/index.html

# On macOS
open test-results/playwright/index.html

# On Linux
xdg-open test-results/playwright/index.html
```

### Screenshots

**Location:** `test-results/playwright/test-results/[browser]/[test-name]/screenshots/`

**What they show:**
- Visual state of the application when a test failed
- Useful for verifying UI changes
- Generated only on test failure

### Videos

**Location:** `test-results/playwright/test-results/[browser]/[test-name]/video.webm`

**What they show:**
- Full video recording of the failed test execution
- Every interaction and result
- Generated only on test failure (saves storage)

### Traces

**Location:** `test-results/playwright/test-results/[browser]/[test-name]/trace.zip`

**What they contain:**
- Detailed execution log
- DOM snapshots at each step
- Network requests
- Console logs

**How to view traces:**
```bash
# Use Playwright Inspector
npx playwright show-trace test-results/playwright/test-results/[browser]/[test-name]/trace.zip
```

---

## 🚀 6. Quick Command Reference

### For Expense App
```bash
cd apps/expense/ui

# Run tests
npm run e2e

# Run in UI mode
npm run e2e:ui

# Run with specific browser
npx playwright test --project chromium

# View local results
start test-results/playwright/index.html
```

### For Stopwatch App
```bash
cd apps/stopwatch/ui

# Run tests
npm run e2e

# Run in UI mode
npm run e2e:ui

# View local results
start test-results/playwright/index.html
```

### For Temp Converter App
```bash
cd apps/temp/ui

# Run tests
npm run e2e

# Run in UI mode
npm run e2e:ui

# View local results
start test-results/playwright/index.html
```

---

## 📊 7. Verifying CI/CD Setup

### Step 1: Push Changes

```bash
git add .
git commit -m "feat: setup playwright ci/cd pipeline"
git push origin [your-branch]
```

### Step 2: Monitor GitHub Actions

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Find the "Playwright Tests" workflow
4. Click to see individual job status

### Step 3: Download Artifacts

1. Click on a completed workflow run
2. Scroll to **Artifacts** section
3. Download `review-artifacts` or `playwright-[app]-artifacts`
4. Extract and view the HTML reports

---

## 🔧 8. Configuration Reference

### Expense App (Port 3000)
- **Config:** `apps/expense/ui/playwright.config.ts`
- **Tests:** `apps/expense/ui/e2e/`
- **Dev Server:** `npm run dev` → http://localhost:3000
- **Output:** `apps/expense/ui/test-results/playwright/`

### Stopwatch App (Port 5173)
- **Config:** `apps/stopwatch/ui/playwright.config.ts`
- **Tests:** `apps/stopwatch/ui/e2e/`
- **Dev Server:** `npm run dev` → http://localhost:5173
- **Output:** `apps/stopwatch/ui/test-results/playwright/`

### Temp Converter App (Port 5173)
- **Config:** `apps/temp/ui/playwright.config.ts`
- **Tests:** `apps/temp/ui/e2e/`
- **Dev Server:** `npm run dev` → http://localhost:5173
- **Output:** `apps/temp/ui/test-results/playwright/`

---

## ✨ Summary

Your Week 3 Capstone now has:

✅ **Complete Playwright Configuration**
- Screenshots, videos, and traces enabled
- Proper output directories configured
- All three apps set up identically

✅ **CI/CD Pipeline**
- GitHub Actions workflow for automatic testing
- Artifact upload on all runs (including failures)
- 30-day retention for individual runs
- 90-day retention for review artifacts
- Parallel test execution

✅ **Local Testing**
- Simple `npm run e2e` command
- Artifacts available in `test-results/playwright/`
- Full HTML reports for review

✅ **Artifact Management**
- Screenshots on failure
- Videos on failure (bandwidth efficient)
- Traces for debugging
- HTML reports with full test details

---

## 📝 Next Steps

1. **Run local tests:**
   ```bash
   cd apps/expense/ui && npm run e2e
   ```

2. **Review artifacts:**
   - Open `test-results/playwright/index.html`
   - Check screenshots and videos in subfolders

3. **Push to GitHub:**
   - Commit and push your changes
   - Monitor the Actions workflow
   - Download and review CI artifacts

4. **Iterate:**
   - Fix any failing tests
   - Re-run locally to verify
   - Push again to trigger CI

---

## 🆘 Troubleshooting

### Tests not starting server
```bash
# Make sure dev server is running manually first
npm run dev

# In another terminal
npm run e2e
```

### Browser installation issues
```bash
# Reinstall browsers
npx playwright install --with-deps
```

### Port already in use
```bash
# Kill process on port 5173 (macOS/Linux)
lsof -ti:5173 | xargs kill -9

# Kill process on port 5173 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

### Artifacts not generated
- Ensure `outputDir` is set in playwright.config.ts
- Check that tests actually ran (not skipped)
- Verify directory permissions

---

**Last Updated:** Week 3 Capstone
**Status:** ✅ Complete and Ready for Production

