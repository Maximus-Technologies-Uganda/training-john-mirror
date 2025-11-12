# E2E Test Fix - Quick Reference Guide

## The Problem
```
Error: Cannot find package '@playwright/test' imported from playwright.config.ts
```

## The Fix (Already Applied ✅)
Added missing dependency to `apps/expense/ui/package.json`:
```json
"@playwright/test": "^1.40.0"
```

## Next Steps

### 1. Verify Locally
```bash
cd apps/expense/ui
npm run e2e
```

### 2. Expected Behavior
- ✅ Playwright config loads successfully
- ✅ Test discovery runs (no import errors)
- ✅ E2E tests execute (may pass/fail based on environment)

### 3. If Tests Fail
Make sure the dev server is running:
```bash
npm run dev  # in another terminal
```

## What Was Changed
| File | Change |
|------|--------|
| `apps/expense/ui/package.json` | Added `@playwright/test: ^1.40.0` to devDependencies |
| `apps/expense/ui/package-lock.json` | Auto-updated by npm |

## Why This Happened
Playwright v1.40+ requires two separate packages:
- `playwright` - for browser automation
- `@playwright/test` - for test runner & config

Only `playwright` was declared, causing the config import to fail.

## Verification
The dependency is now properly installed and resolved in both:
- ✅ package.json
- ✅ package-lock.json
- ✅ node_modules/

---
**Status**: FIXED - E2E tests should now run successfully

