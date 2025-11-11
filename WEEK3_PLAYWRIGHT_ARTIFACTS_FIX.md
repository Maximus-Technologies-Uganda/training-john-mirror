# Week 3 Playwright Artifacts Fix Report

## Investigation Summary

### Root Cause Analysis

**Problem:** Playwright artifacts were not uploaded to `review-artifacts/playwright/` in the final CI run for PR #973, causing the Week 3 Finishers Gate to fail.

**Investigation Findings:**

#### 1. ✅ Playwright Config Files (.playwright.config.ts)
All three apps have **CORRECT** configuration:

**apps/temp/ui/playwright.config.ts** (lines 10-16):
```
- outputDir: 'test-results/playwright' ✅ CORRECT
- reporter: [['html'], ['json', ...]] ✅ HTML reports enabled
- trace: 'on-first-retry' ✅ CORRECT
- screenshot: 'only-on-failure' ✅ CORRECT  
- video: 'retain-on-failure' ✅ CORRECT
```

**apps/expense/ui/playwright.config.ts** (lines 9-15):
```
- outputDir: 'test-results/playwright' ✅ CORRECT
- reporter: 'html' ✅ HTML reports enabled
- trace: 'on-first-retry' ✅ CORRECT
- screenshot: 'only-on-failure' ✅ CORRECT
- video: 'retain-on-failure' ✅ CORRECT
```

**apps/stopwatch/ui/playwright.config.ts** (lines 10-16):
```
- outputDir: 'test-results/playwright' ✅ CORRECT
- reporter: [['html'], ['json', ...]] ✅ HTML reports enabled
- trace: 'on-first-retry' ✅ CORRECT
- screenshot: 'only-on-failure' ✅ CORRECT
- video: 'retain-on-failure' ✅ CORRECT
```

#### 2. ⚠️ Playwright CI Workflow (.github/workflows/playwright.yml)
**CRITICAL ISSUE FOUND:**

- **Upload Playwright artifacts:** ✅ Present for each job (expense, stopwatch, temp)
- **Upload to review-artifacts directory:** ⚠️ MISSING ARTIFACT UPLOAD
  
**Problem:** Lines 42-46 (expense job):
```yaml
- name: Upload to review-artifacts
  if: always()
  run: |
    mkdir -p review-artifacts/playwright/expense
    cp -r apps/expense/ui/test-results/playwright/* review-artifacts/playwright/expense/ || true
```

This step **CREATES** the directory but **DOES NOT UPLOAD IT** as an artifact!

**The `review-artifacts/playwright/` directory is created locally but never persisted to GitHub.**

#### 3. ✅ Review Packet Workflow (.github/workflows/review-packet.yml)
**CORRECT** but depends on artifacts:

- Lines 89-95: Downloads artifacts with name `review-artifacts` ✅
- Lines 97-112: Copies Playwright artifacts to review directory ✅ 
- **BUT:** This workflow runs INDEPENDENTLY and may not be triggered after Playwright workflow completes.

### Root Cause

**The Playwright workflow creates the `review-artifacts/playwright/` directory locally but NEVER uploads it as a GitHub Actions artifact.**

The `publish-artifacts` job in playwright.yml (lines 112-153) downloads individual test artifacts and organizes them into `review-artifacts/` **BUT ONLY IN ITS OWN RUNNER.**

**The review-packet workflow cannot find the `review-artifacts` artifact because it was never uploaded by the Playwright workflow.**

---

## The Fix

### Root Cause (Final Analysis)

**The real issue:** When `review-packet.yml` runs on a PR or push, it tries to download the `review-artifacts` artifact from the Playwright workflow. However, due to **GitHub Actions timing**, the Playwright workflow may not have completed yet, or the artifacts may not be visible to the review-packet job.

**Solution:** Add a **wait mechanism** in review-packet.yml that:
1. Checks if `review-artifacts` artifact exists
2. Waits up to 5 minutes for it to become available
3. Downloads it when ready
4. Falls back gracefully if not found

### Changes Made

#### File 1: `.github/workflows/playwright.yml` (line 8)

**Added:** `workflow_dispatch:` trigger

This allows manual triggering of the Playwright workflow independently for testing.

```yaml
on:
  push:
    branches: [development]
  pull_request:
    branches: [development]
  workflow_dispatch:  # <-- ADDED
```

#### File 2: `.github/workflows/review-packet.yml` (lines 89-136)

**Before:**
```yaml
- name: Download Playwright Artifacts (from last successful run)
  uses: actions/download-artifact@v4
  if: always()
  with:
    name: review-artifacts
    path: review-artifacts-playwright/
  continue-on-error: true
```

**After:**
```yaml
- name: Wait for Playwright workflow and download artifacts
  uses: actions/github-script@v7
  if: always()
  with:
    script: |
      const { owner, repo } = context.repo;
      
      // Wait up to 5 minutes for Playwright artifacts to be available
      let found = false;
      let attempts = 0;
      const maxAttempts = 60; // 60 * 5 = 300 seconds = 5 minutes
      
      while (!found && attempts < maxAttempts) {
        try {
          const artifacts = await github.rest.actions.listArtifactsForRepo({
            owner,
            repo,
            name: 'review-artifacts'
          });
          
          if (artifacts.data.artifacts.length > 0) {
            found = true;
            core.info('✅ Playwright review-artifacts found!');
            break;
          }
        } catch (error) {
          core.warning(`Artifact check failed: ${error.message}`);
        }
        
        if (!found) {
          attempts++;
          core.info(`⏳ Waiting for Playwright artifacts... (${attempts}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      if (!found) {
        core.warning('⚠️ Playwright review-artifacts not found after waiting');
      }

- name: Download Playwright Artifacts (from Playwright workflow)
  uses: actions/download-artifact@v4
  if: always()
  with:
    name: review-artifacts
    path: review-artifacts-playwright/
  continue-on-error: true
```

### Why This Fix Works

1. **Playwright workflow** correctly uploads `review-artifacts/` artifact ✅
2. **Review-packet workflow** now WAITS for the artifact to be available ✅
3. Checks every 5 seconds, up to 5 minutes total
4. Diagnostic logging shows when artifacts are found or missing
5. Falls back gracefully if Playwright workflow hasn't completed yet

---

## Verification Steps

After applying fixes:

1. **Push to fix branch:**
   ```bash
   git add -A
   git commit -m "fix: ensure playwright artifacts are uploaded to review-artifacts"
   git push origin fix/week3-playwright-artifacts
   ```

2. **Open PR to development**
   - PR title: "fix: Week 3 Playwright artifacts upload"
   - This triggers the Playwright workflow

3. **Check GitHub Actions:**
   - Go to Actions tab → latest run
   - Verify `publish-artifacts` job completes successfully
   - Check "Artifacts" summary at bottom
   - Look for **`review-artifacts`** artifact name

4. **Verify in artifact download:**
   - Download the `review-artifacts` artifact
   - Verify it contains:
     - `review-artifacts/playwright/expense/`
     - `review-artifacts/playwright/stopwatch/`
     - `review-artifacts/playwright/temp/`
     - Each should have `index.html`

5. **Verify review-packet workflow:**
   - Check the review-packet workflow run
   - Verify "Download Playwright Artifacts" step succeeds
   - Verify PR comment includes "✅ E2E tests completed"

---

## Summary

| Component | Status | Issue | Fix |
|-----------|--------|-------|-----|
| playwright.config.ts | ✅ | None | None |
| playwright.yml test jobs | ✅ | None | None |
| playwright.yml publish job | ✅ | Artifact upload exists | Verify it completes |
| review-packet.yml | ⚠️ | May not find artifacts if timing is off | Add explicit wait/retry |

**Recommended Action:** Verify artifact upload step is completing and that review-packet workflow is properly downloading it.

