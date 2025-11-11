# Week 3 Capstone: Verification Checklist ✅

## Pre-Submission Verification

Use this checklist to verify your Playwright setup before submitting your Week 3 Capstone.

---

## 1. Configuration Verification

### Playwright Configs
- [ ] **Expense app config** - Check `apps/expense/ui/playwright.config.ts`
  - [ ] `outputDir: 'test-results/playwright'` is set
  - [ ] `trace: 'on-first-retry'` is configured
  - [ ] `screenshot: 'only-on-failure'` is configured
  - [ ] `video: 'retain-on-failure'` is configured
  - [ ] `baseURL: 'http://localhost:3000'` is correct
  - [ ] Three browser projects: chromium, firefox, webkit

- [ ] **Stopwatch app config** - Check `apps/stopwatch/ui/playwright.config.ts`
  - [ ] `outputDir: 'test-results/playwright'` is set
  - [ ] `trace: 'on-first-retry'` is configured
  - [ ] `screenshot: 'only-on-failure'` is configured
  - [ ] `video: 'retain-on-failure'` is configured
  - [ ] `baseURL: 'http://localhost:5173'` is correct
  - [ ] Three browser projects: chromium, firefox, webkit

- [ ] **Temp app config** - Check `apps/temp/ui/playwright.config.ts`
  - [ ] `outputDir: 'test-results/playwright'` is set
  - [ ] `trace: 'on-first-retry'` is configured
  - [ ] `screenshot: 'only-on-failure'` is configured
  - [ ] `video: 'retain-on-failure'` is configured
  - [ ] `baseURL: 'http://localhost:5173'` is correct
  - [ ] Three browser projects: chromium, firefox, webkit

---

## 2. CI/CD Workflow Verification

### GitHub Actions Setup
- [ ] File exists: `.github/workflows/playwright.yml`

### Workflow Structure
- [ ] Job: `test-expense` exists
  - [ ] Installs dependencies with `npm ci`
  - [ ] Installs browsers: `npx playwright install --with-deps`
  - [ ] Runs: `npm run e2e`
  - [ ] Upload step has `if: always()`
  - [ ] Artifacts uploaded to proper path

- [ ] Job: `test-stopwatch` exists
  - [ ] Installs dependencies with `npm ci`
  - [ ] Installs browsers: `npx playwright install --with-deps`
  - [ ] Runs: `npm run e2e`
  - [ ] Upload step has `if: always()`
  - [ ] Artifacts uploaded to proper path

- [ ] Job: `test-temp` exists
  - [ ] Installs dependencies with `npm ci`
  - [ ] Installs browsers: `npx playwright install --with-deps`
  - [ ] Runs: `npm run e2e`
  - [ ] Upload step has `if: always()`
  - [ ] Artifacts uploaded to proper path

- [ ] Job: `publish-artifacts` exists
  - [ ] Downloads all artifacts
  - [ ] Organizes into `review-artifacts/playwright/`
  - [ ] Has `if: always()` condition
  - [ ] 90-day retention set

### Workflow Features
- [ ] Runs on push to main/develop
- [ ] Runs on pull requests to main/develop
- [ ] Parallel execution for all three jobs
- [ ] continue-on-error: true (tests don't fail CI)
- [ ] Artifact retention periods set:
  - [ ] Individual artifacts: 30 days
  - [ ] Review artifacts: 90 days

---

## 3. Local Testing Verification

### Expense App

Open terminal and navigate to expense app:
```bash
cd apps/expense/ui
```

Execute verification steps:
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev` (verify runs on localhost:3000)
- [ ] Run tests in new terminal: `npm run e2e`
- [ ] Tests complete without hanging
- [ ] HTML report generated: `test-results/playwright/index.html`
- [ ] Report is viewable in browser

### Stopwatch App

Open terminal and navigate to stopwatch app:
```bash
cd apps/stopwatch/ui
```

Execute verification steps:
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev` (verify runs on localhost:5173)
- [ ] Run tests in new terminal: `npm run e2e`
- [ ] Tests complete without hanging
- [ ] HTML report generated: `test-results/playwright/index.html`
- [ ] Report is viewable in browser

### Temp App

Open terminal and navigate to temp app:
```bash
cd apps/temp/ui
```

Execute verification steps:
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev` (verify runs on localhost:5173)
- [ ] Run tests in new terminal: `npm run e2e`
- [ ] Tests complete without hanging
- [ ] HTML report generated: `test-results/playwright/index.html`
- [ ] Report is viewable in browser

---

## 4. Artifact Generation Verification

### Local Artifacts

After running tests, verify artifacts exist in each app:

**Expense App: `apps/expense/ui/test-results/playwright/`**
- [ ] `index.html` exists and opens in browser
- [ ] Contains summary of all test results
- [ ] Shows pass/fail status for each test
- [ ] Browser/project information displayed

**Stopwatch App: `apps/stopwatch/ui/test-results/playwright/`**
- [ ] `index.html` exists and opens in browser
- [ ] Contains summary of all test results
- [ ] Shows pass/fail status for each test
- [ ] Browser/project information displayed

**Temp App: `apps/temp/ui/test-results/playwright/`**
- [ ] `index.html` exists and opens in browser
- [ ] Contains summary of all test results
- [ ] Shows pass/fail status for each test
- [ ] Browser/project information displayed

### Trace Artifacts

For any failed tests, verify:
- [ ] Trace files exist: `test-results/[browser]/[test-name]/trace.zip`
- [ ] Can be opened with: `npx playwright show-trace [trace-file]`

### Screenshot Artifacts

For any failed tests, verify:
- [ ] Screenshots exist: `test-results/[browser]/[test-name]/screenshots/`
- [ ] PNG files are viewable
- [ ] Show the UI state when test failed

### Video Artifacts

For any failed tests, verify:
- [ ] Videos exist: `test-results/[browser]/[test-name]/video.webm`
- [ ] Can be played in browser or video player
- [ ] Show test execution sequence

---

## 5. Package Scripts Verification

### Expense App - `apps/expense/ui/package.json`
```bash
cd apps/expense/ui
```
- [ ] `npm run e2e` runs tests
- [ ] `npm run e2e:ui` opens interactive UI
- [ ] `npm run dev` starts development server

### Stopwatch App - `apps/stopwatch/ui/package.json`
```bash
cd apps/stopwatch/ui
```
- [ ] `npm run e2e` runs tests
- [ ] `npm run e2e:ui` opens interactive UI
- [ ] `npm run dev` starts development server

### Temp App - `apps/temp/ui/package.json`
```bash
cd apps/temp/ui
```
- [ ] `npm run e2e` runs tests
- [ ] `npm run e2e:ui` opens interactive UI
- [ ] `npm run dev` starts development server

---

## 6. File Structure Verification

### Root Directory
- [ ] `.github/workflows/playwright.yml` exists
- [ ] `WEEK3_CAPSTONE_GUIDE.md` exists
- [ ] `WEEK3_VERIFICATION_CHECKLIST.md` exists

### App Directories
Each app should have:
```
apps/[APP]/ui/
├── playwright.config.ts          ✅ Updated
├── e2e/                          ✅ Test files
├── package.json                  ✅ With e2e scripts
└── test-results/
    └── playwright/               ✅ Generated after tests
        ├── index.html
        └── test-results/
```

- [ ] `apps/expense/ui/playwright.config.ts` updated
- [ ] `apps/stopwatch/ui/playwright.config.ts` updated
- [ ] `apps/temp/ui/playwright.config.ts` updated
- [ ] E2E test files exist in each app

---

## 7. Git Integration Verification

### Commit Changes
```bash
git status
```
- [ ] Changes staged properly
- [ ] No unintended files included

### Push to GitHub
```bash
git push origin [branch-name]
```
- [ ] Push successful
- [ ] No merge conflicts

### Verify GitHub Actions
1. Go to GitHub repository
2. Click **Actions** tab
- [ ] "Playwright Tests" workflow appears
- [ ] Workflow is triggered automatically
- [ ] All three jobs show in the run
- [ ] Jobs complete (may show ❌ if tests fail, that's OK)

### Download and Verify Artifacts
In GitHub Actions workflow run:
- [ ] Click **Artifacts** section
- [ ] `review-artifacts` available for download
- [ ] `playwright-expense-artifacts` available
- [ ] `playwright-stopwatch-artifacts` available
- [ ] `playwright-temp-artifacts` available

Download `review-artifacts`:
- [ ] Extract successfully
- [ ] Contains `playwright/` folder
- [ ] `playwright/` contains `expense/`, `stopwatch/`, `temp/` subfolders
- [ ] Each subfolder has `index.html`
- [ ] Each `index.html` opens and shows test results

---

## 8. Documentation Verification

### WEEK3_CAPSTONE_GUIDE.md
- [ ] Configuration details accurate
- [ ] Local test commands correct
- [ ] Artifact locations correct
- [ ] Commands tested and working

### Code Comments
- [ ] Playwright configs have comments explaining settings
- [ ] Workflow file has section comments

---

## 9. Final Pre-Submission Steps

- [ ] All local tests pass or generate expected artifacts
- [ ] All configurations match the guide
- [ ] CI/CD workflow has been triggered and runs successfully
- [ ] Artifacts are generated in correct locations
- [ ] HTML reports are viewable and contain test results
- [ ] Documentation is complete and accurate
- [ ] All files committed to git
- [ ] PR/branch pushed to GitHub
- [ ] GitHub Actions shows successful workflow execution

---

## 10. Ready for Submission?

If you've checked ALL boxes above, you're ready to submit! 🎉

**Final Submission Checklist:**
- [ ] All code changes pushed to GitHub
- [ ] CI/CD workflow has run successfully
- [ ] Artifacts are accessible in GitHub Actions
- [ ] Documentation is complete in repo
- [ ] Tests are configured for traces, videos, screenshots
- [ ] No linting errors
- [ ] Ready for review

---

## Quick Troubleshooting

### Issue: Tests not generating artifacts
**Solution:**
1. Verify `outputDir` is set in playwright.config.ts
2. Run: `npm run e2e`
3. Check: `test-results/playwright/` folder exists
4. Verify: `index.html` file is present

### Issue: GitHub Actions workflow not appearing
**Solution:**
1. Verify `.github/workflows/playwright.yml` is committed
2. Push to main or develop branch
3. Check Actions tab on GitHub
4. May take 1-2 minutes to appear

### Issue: Artifacts not uploading to GitHub
**Solution:**
1. Verify `if: always()` on upload steps
2. Check workflow has correct path: `test-results/playwright/`
3. Verify jobs are completing (not cancelled)

### Issue: Port already in use
**Solution (Windows PowerShell):**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

---

**Status:** ✅ Ready for Week 3 Capstone Submission

