# Week 3 Playwright Artifacts Fix - Verification Guide

## What Was Fixed

### Problem
- Playwright E2E test artifacts (videos, screenshots, traces, HTML reports) were not being included in the final `review-artifacts` GitHub Actions artifact
- This prevented the Week 3 Finishers Gate from passing because Playwright E2E test reports were missing from the review packet

### Root Cause
- **GitHub Actions timing issue:** The `review-packet.yml` workflow was attempting to download `review-artifacts` from the `playwright.yml` workflow before that workflow had completed
- The download would fail silently due to `continue-on-error: true`, resulting in empty Playwright test reports in the review packet

### Solution Applied
1. Added `workflow_dispatch:` trigger to `playwright.yml` for manual testing
2. Added a **5-minute wait loop** in `review-packet.yml` that:
   - Checks if `review-artifacts` artifact exists every 5 seconds
   - Waits up to 5 minutes (300 seconds) for the artifact to become available
   - Provides diagnostic logging showing wait progress
   - Falls back gracefully if artifact doesn't appear

---

## Verification Procedure

### Step 1: Push Branch and Create PR

```bash
# From your local machine
git push origin fix/week3-playwright-artifacts

# Then open a PR to development branch via GitHub UI
```

**PR Title:** `fix: Week 3 Playwright artifacts upload`
**Description:** This PR fixes the missing Playwright E2E test artifacts in the review packet

### Step 2: Monitor GitHub Actions

1. Go to: `https://github.com/YOUR_ORG/training-john/actions`

2. Find the workflow run for your PR (should show as "fix: add wait mechanism for...")

3. **Key Workflows to Check:**
   - `Playwright Tests` workflow
   - `Review Packet` workflow

### Step 3: Verify Playwright Tests Workflow ✅

**Expected Output:**

```
✅ test-expense job → PASSED
   - Install dependencies
   - Install Playwright browsers
   - Run Playwright tests
   - Upload Playwright artifacts (playwright-expense-artifacts)
   ✅ Upload final artifacts to review-artifacts

✅ test-stopwatch job → PASSED
   - Install dependencies
   - Install Playwright browsers
   - Run Playwright tests
   - Upload Playwright artifacts (playwright-stopwatch-artifacts)

✅ test-temp job → PASSED
   - Install dependencies
   - Install Playwright browsers
   - Run Playwright tests
   - Upload Playwright artifacts (playwright-temp-artifacts)

✅ publish-artifacts job → PASSED
   - Download all artifacts
   - Organize artifacts
   - Upload final artifacts to review-artifacts ← KEY STEP
```

**Verify Success:**
- All three test jobs should complete
- The `publish-artifacts` job should complete BEFORE `review-packet` starts
- Look for: "Upload final artifacts to review-artifacts" step succeeds

### Step 4: Verify Artifacts Are Uploaded

In the `publish-artifacts` job, you should see in the logs:

```
✅ uploaded 1 artifact
review-artifacts (90 days retention)
```

**Click on the `review-artifacts` artifact summary** → Verify it contains:
- `playwright/` directory
- `playwright/expense/index.html`
- `playwright/stopwatch/index.html`
- `playwright/temp/index.html`

### Step 5: Verify Review Packet Workflow ✅

**Expected Output:**

```
✅ review-packet job → PASSED
   - Checkout repository
   - Setup Node.js
   - Install Dependencies
   - Run Tests with Coverage
   - Upload Test Results (JUnit)
   - Gather Coverage Reports
   - Upload Coverage Reports
   
   → Wait for Playwright workflow and download artifacts
      ⏳ Checking for review-artifacts artifact...
      ✅ Playwright review-artifacts found!
   
   → Download Playwright Artifacts
   → Copy Playwright artifacts to review directory
      ✅ Found Playwright artifacts, copying to review packet...
      ✅ Playwright artifacts copied successfully
```

**Key Log Lines to Look For:**
```
✅ Playwright review-artifacts found!
✅ Found Playwright artifacts, copying to review packet...
✅ Playwright artifacts copied successfully
```

### Step 6: Verify Final Artifacts Include Playwright Tests

1. Go to the workflow run summary
2. Scroll to "Artifacts" section at bottom
3. Download: `review-packet-push-...` or `review-packet-pr-...` (depending on push vs PR)
4. Unzip and verify contents:

```
_review/
├── summary.md
├── pr.json
├── files.json
├── commits.json
├── review-artifacts/
│   ├── index.html  (coverage index)
│   ├── coverage-*/ (coverage reports)
│   └── playwright/  ← THIS SHOULD NOW EXIST
│       ├── expense/
│       │   ├── index.html
│       │   ├── data/
│       │   └── ... (traces, videos, screenshots)
│       ├── stopwatch/
│       │   ├── index.html
│       │   └── ...
│       └── temp/
│           ├── index.html
│           └── ...
└── test-results/
    └── junit.xml
```

### Step 7: View the PR Comment

Check the PR for an automated comment that includes:

```markdown
## Playwright E2E Tests

- **expense**: ✅ E2E tests completed - [View Report](...)
- **stopwatch**: ✅ E2E tests completed - [View Report](...)
- **temp**: ✅ E2E tests completed - [View Report](...)
```

**Before fix:** Would show: `- **Status**: E2E tests did not run - check Playwright workflow`
**After fix:** Should show: ✅ E2E tests completed for each app

---

## Success Criteria

✅ **Fix is successful when:**

1. Playwright workflow completes and uploads `review-artifacts` artifact
2. Review-packet workflow shows: "✅ Playwright review-artifacts found!"
3. Final review-packet artifact includes `review-artifacts/playwright/` directory
4. Review packet markdown comment shows ✅ E2E tests completed for all three apps
5. Each app's Playwright HTML report is viewable (expense, stopwatch, temp)

---

## Troubleshooting

### If Playwright artifacts still missing:

**Check 1:** Playwright tests actually running?
- Look for: `npm run e2e` output in workflow logs
- Should see: "X passed" or test failures
- If no output, E2E tests aren't being found

**Check 2:** Is `publish-artifacts` job receiving test artifacts?
- Look in logs for: `Downloaded playwright-*-artifacts`
- Should be three downloads (expense, stopwatch, temp)

**Check 3:** Is `review-packet` actually waiting?
- Look for: `⏳ Waiting for Playwright artifacts...` messages
- Look for: `✅ Playwright review-artifacts found!` message
- If not found message, artifact name may be wrong

**Check 4:** Artifact timing issue?
- If review-packet still fails to find artifact after 5 minutes, check:
  - Is Playwright workflow still running?
  - Is there a Playwright workflow failure?
  - Run `workflow_dispatch` on Playwright workflow manually to test

### If workflow_dispatch not available:

- Push the fix branch first
- Go to Actions → Playwright Tests → "Run workflow" button should appear
- Select branch: `fix/week3-playwright-artifacts`
- Click "Run workflow"

---

## Testing Manually with workflow_dispatch

You can manually trigger just the Playwright workflow without PR:

1. Go to: `https://github.com/YOUR_ORG/training-john/actions`
2. Click: `Playwright Tests` workflow
3. Click: `Run workflow` (top right button)
4. Select branch: `fix/week3-playwright-artifacts`
5. Click: `Run workflow` (green button)
6. Wait for completion (~5 minutes)
7. Verify `review-artifacts` artifact appears in summary

This is useful for testing without creating a PR.

---

## Expected Timeline

| Step | Time | What Happens |
|------|------|--------------|
| Push PR | Immediate | GitHub triggers Playwright + Review-Packet workflows |
| Playwright Tests | ~3-5 min | Three test jobs run in parallel, publish-artifacts job runs after |
| Review-Packet | ~2-3 min | Waits for Playwright, then generates coverage + comment |
| **Total** | **5-8 min** | Both workflows complete, all artifacts available |

---

## Success Screenshot Checklist

- [ ] Playwright workflow shows green checkmark (all jobs passed)
- [ ] `publish-artifacts` job shows "Upload final artifacts to review-artifacts" succeeded
- [ ] Artifacts summary shows `review-artifacts` artifact listed
- [ ] Review-packet workflow shows "✅ Playwright review-artifacts found!"
- [ ] PR comment includes "✅ E2E tests completed" for all three apps
- [ ] Downloaded review-packet contains `playwright/` subdirectories with HTML reports

---

## Questions?

If verification fails at any step, check:

1. **Workflow files were committed:** `git log --oneline` should show the fix commit
2. **Files are correct:** Check `.github/workflows/playwright.yml` and `.github/workflows/review-packet.yml` have the changes
3. **Branch is pushed:** `git branch -vv` should show `fix/week3-playwright-artifacts` tracking origin
4. **No merge conflicts:** Merge PR cleanly to development after verification

Once verified, you can merge this PR to development and use it for your Week 4 Day 0 Gate!

