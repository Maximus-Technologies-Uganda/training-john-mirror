# Week 3 Capstone: Quick Start 🚀

## TL;DR - Run Tests Locally

### 1️⃣ Expense App
```bash
cd apps/expense/ui
npm install
npm run e2e
```
**View results:** Open `test-results/playwright/index.html` in your browser

### 2️⃣ Stopwatch App
```bash
cd apps/stopwatch/ui
npm install
npm run e2e
```
**View results:** Open `test-results/playwright/index.html` in your browser

### 3️⃣ Temp Converter App
```bash
cd apps/temp/ui
npm install
npm run e2e
```
**View results:** Open `test-results/playwright/index.html` in your browser

---

## Configuration ✅

**What's been configured:**

| Item | Status | Details |
|------|--------|---------|
| Playwright Configs | ✅ Updated | All apps have screenshots, videos, traces enabled |
| Output Directory | ✅ Set | `test-results/playwright/` in each app |
| GitHub Actions | ✅ Created | `.github/workflows/playwright.yml` |
| Artifact Upload | ✅ Configured | Uploads to GitHub + `review-artifacts/playwright/` |
| Package Scripts | ✅ Ready | `npm run e2e` works in all apps |

---

## Artifact Locations 📁

### Local (After Running Tests)
```
apps/[APP]/ui/test-results/playwright/
├── index.html              # Main report
├── test-results/           # Detailed results
│   ├── traces/
│   ├── screenshots/        # On failure only
│   └── videos/             # On failure only
└── data/
```

### CI/CD (After Pushing to GitHub)
```
GitHub Actions → Artifacts
└── review-artifacts/
    └── playwright/
        ├── expense/        # Expense app results
        ├── stopwatch/      # Stopwatch app results
        └── temp/           # Temp converter app results
```

---

## Files Created/Updated 📝

### New Files
- ✅ `.github/workflows/playwright.yml` - CI/CD Pipeline
- ✅ `WEEK3_CAPSTONE_GUIDE.md` - Full documentation
- ✅ `WEEK3_VERIFICATION_CHECKLIST.md` - Verification steps
- ✅ `WEEK3_QUICK_START.md` - This file

### Updated Files
- ✅ `apps/expense/ui/playwright.config.ts`
- ✅ `apps/stopwatch/ui/playwright.config.ts`
- ✅ `apps/temp/ui/playwright.config.ts`

---

## Next Steps 📋

1. **Run tests locally** to verify they work:
   ```bash
   cd apps/expense/ui && npm run e2e
   ```

2. **Review the HTML reports** generated:
   ```bash
   open test-results/playwright/index.html  # macOS
   start test-results/playwright/index.html # Windows
   ```

3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: configure playwright e2e tests"
   git push origin [your-branch]
   ```

4. **Monitor GitHub Actions**:
   - Go to your repo's Actions tab
   - Watch the "Playwright Tests" workflow run
   - Download artifacts when complete

---

## Interactive Testing 🎮

Want to see tests step-by-step?

```bash
cd apps/[APP]/ui
npm run e2e:ui
```

This opens the Playwright inspector where you can:
- See each test step
- Pause and debug
- Interact with the UI
- See element selectors

---

## Troubleshooting 🔧

| Problem | Solution |
|---------|----------|
| Port already in use | Stop the dev server or kill the process on that port |
| Tests not generating reports | Make sure tests actually ran (aren't all skipped) |
| Artifacts not on GitHub | Verify files are committed and pushed |
| Can't open HTML reports | Try a different browser |

---

## Key Endpoints

| App | Port | Dev Command |
|-----|------|-------------|
| Expense | 3000 | `cd apps/expense/ui && npm run dev` |
| Stopwatch | 5173 | `cd apps/stopwatch/ui && npm run dev` |
| Temp | 5173 | `cd apps/temp/ui && npm run dev` |

---

## Configuration Summary

All Playwright configs now include:

```typescript
outputDir: 'test-results/playwright',
use: {
  trace: 'on-first-retry',      // Debugging traces
  screenshot: 'only-on-failure', // Visual verification
  video: 'retain-on-failure',    // Full test video
}
```

This means:
- 📸 Screenshots are captured when tests fail
- 🎥 Videos are recorded when tests fail
- 🔍 Traces are saved for first retry (debugging)
- 📊 HTML report summarizes everything

---

## GitHub Actions Workflow

The `.github/workflows/playwright.yml` file:
1. ✅ Runs on push/PR to main/develop
2. ✅ Runs all 3 apps in parallel
3. ✅ Installs browsers automatically
4. ✅ Uploads artifacts (even if tests fail)
5. ✅ Organizes results in `review-artifacts/`
6. ✅ Keeps artifacts for 90 days

---

## Ready? 🎉

**Your Week 3 Capstone setup is complete!**

- ✅ Local testing configured
- ✅ CI/CD pipeline ready
- ✅ Artifacts configured
- ✅ Documentation complete

**Start testing:**
```bash
cd apps/expense/ui && npm run e2e
```

**Then check out:**
```bash
open test-results/playwright/index.html
```

For more details, see `WEEK3_CAPSTONE_GUIDE.md`

---

**Happy testing! 🚀**

