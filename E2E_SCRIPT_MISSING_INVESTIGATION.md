# E2E Script Missing Error - Complete Investigation Report

## Executive Summary

**Status**: ✅ **IDENTIFIED & DOCUMENTED**

The error `npm error Missing script: "e2e"` occurs because the **root `package.json` doesn't have an `e2e` script**, but individual **workspace apps do**.

This is **by design** in monorepo configurations, not an error. The fix is understanding the proper command structure.

---

## Problem Statement

### Error Message
```
npm error Missing script: "e2e"
npm error
npm error To see a list of scripts, run:
npm error   npm run
```

### Error Context
- **Running From**: Root directory (or undefined workspace)
- **Expected**: E2E tests to run
- **Actual**: Script not found
- **Root Cause**: Root `package.json` has no `e2e` script

---

## Root Cause Analysis

### What Scripts ARE Available?

**Root package.json** (lines 9-16):
```json
"scripts": {
  "test": "node scripts/run-vitest.mjs",
  "test:ci": "npm run test -- --run --coverage",
  "lint": "eslint .",
  "sync:linear": "node scripts/sync-linear-subtasks.mjs",
  "sync:specs": "node scripts/sync-spec-to-linear.mjs",
  "sync:github": "node scripts/sync-github-subissues.mjs",
  "todo:remove": "node cli/todo.js remove"
}
```

**❌ Missing**: `"e2e"` script

### Where IS the E2E Script?

**Workspace Apps** - All have `e2e` scripts:

| App | Location | E2E Script |
|-----|----------|-----------|
| **expense-ui** | `apps/expense/ui/package.json` | ✅ `"e2e": "playwright test"` |
| **stopwatch-ui** | `apps/stopwatch/ui/package.json` | ✅ `"e2e": "playwright test"` |
| **temp-converter-ui** | `apps/temp/ui/package.json` | ✅ `"e2e": "playwright test"` |
| **todo-ui** | `apps/todo/ui/package.json` | ✅ `"e2e": "playwright test"` |

### Monorepo Structure

```
training-john/                          ← Root (no e2e script)
├── package.json                        ← Scripts: test, lint, sync:*
├── workspaces: ["apps/*/ui"]
├── apps/
│   ├── expense/ui/
│   │   └── package.json                ← Scripts: e2e ✅
│   ├── stopwatch/ui/
│   │   └── package.json                ← Scripts: e2e ✅
│   ├── temp/ui/
│   │   └── package.json                ← Scripts: e2e ✅
│   └── todo/ui/
│       └── package.json                ← Scripts: e2e ✅
```

---

## Why This Design?

### Monorepo Best Practice

In npm workspaces:
- **Root `package.json`**: Contains shared scripts that run across all apps (test, lint, etc.)
- **Workspace `package.json`**: Contains app-specific scripts (dev, e2e, build, etc.)

### Benefits of This Approach

1. ✅ **Clear Separation**: Root = shared, Workspace = app-specific
2. ✅ **Flexibility**: Each app can have different E2E setup
3. ✅ **Scalability**: Easy to add new apps with different requirements
4. ✅ **Isolation**: Running E2E in one app doesn't affect others

---

## THE FIX: Proper E2E Execution

### Current Behavior (❌ WRONG)
```bash
# From root directory
npm run e2e
# Error: Missing script: "e2e"
```

### Correct Behavior (✅ RIGHT)

#### Option 1: Run from Workspace Directory
```bash
# For expense app
cd apps/expense/ui
npm run e2e

# For stopwatch app
cd apps/stopwatch/ui
npm run e2e

# For temp app
cd apps/temp/ui
npm run e2e

# For todo app
cd apps/todo/ui
npm run e2e
```

#### Option 2: Use npm workspace syntax from root
```bash
# From root directory, run in specific workspace
npm run e2e -w expense-ui
npm run e2e -w @training-john/stopwatch-ui
npm run e2e -w @training-john/temp-converter-ui
npm run e2e -w todo-ui

# Or with full path syntax (npm 7.0+)
npm run -w apps/expense/ui e2e
npm run -w apps/stopwatch/ui e2e
npm run -w apps/temp/ui e2e
npm run -w apps/todo/ui e2e
```

#### Option 3: Run All E2E Tests (Create Root Script)
To support `npm run e2e` at root level, add to root `package.json`:

```json
"scripts": {
  "e2e": "npm run e2e -w expense-ui && npm run e2e -w @training-john/stopwatch-ui && npm run e2e -w @training-john/temp-converter-ui && npm run e2e -w todo-ui",
  "e2e:ci": "npm run e2e:ci -w expense-ui && npm run e2e:ci -w @training-john/stopwatch-ui && npm run e2e:ci -w @training-john/temp-converter-ui && npm run e2e:ci -w todo-ui"
}
```

Or more elegantly using a shell script:
```bash
#!/bin/bash
for app in expense stopwatch temp todo; do
  echo "Running E2E tests for $app..."
  npm run e2e -w "apps/$app/ui" || exit 1
done
```

---

## App Workspace Names

For `npm run -w` syntax, use these exact names:

| App | Package Name | Workspace Reference |
|-----|--------------|-------------------|
| **Expense** | `expense-ui` | `-w expense-ui` |
| **Stopwatch** | `@training-john/stopwatch-ui` | `-w @training-john/stopwatch-ui` |
| **Temp** | `@training-john/temp-converter-ui` | `-w @training-john/temp-converter-ui` |
| **Todo** | `todo-ui` | `-w todo-ui` |

Source: Line 2 in each `apps/*/ui/package.json`

---

## All Available E2E Scripts in Apps

### Expense UI
```bash
npm run e2e              # Run tests
npm run e2e:ui           # Run with UI
```

### Stopwatch UI
```bash
npm run e2e              # Run tests
npm run e2e:ui           # Run with UI
```

### Temp Converter UI
```bash
npm run e2e              # Run tests
npm run e2e:ui           # Run with UI
```

### Todo UI (Extended E2E Options)
```bash
npm run e2e                          # Run all tests
npm run e2e:headed                   # With browser UI
npm run e2e:debug                    # Debug mode
npm run e2e:chromium                 # Chromium only
npm run e2e:firefox                  # Firefox only
npm run e2e:webkit                   # WebKit only
npm run e2e:mobile                   # Mobile browsers
npm run e2e:compatibility            # Cross-browser test
npm run e2e:compatibility:playwright # Playwright compatibility
npm run e2e:report                   # Show test report
```

---

## Step-by-Step: Run E2E Tests

### For Single App (Easiest)
```bash
# Navigate to app directory
cd apps/expense/ui

# Run E2E tests
npm run e2e

# Or with UI
npm run e2e:ui
```

### For Multiple Apps (From Root)
```bash
# Run expense E2E
npm run e2e -w expense-ui

# Run stopwatch E2E
npm run e2e -w @training-john/stopwatch-ui

# Run temp E2E
npm run e2e -w @training-john/temp-converter-ui

# Run todo E2E
npm run e2e -w todo-ui
```

### For All Apps (Recommended for CI/CD)
```bash
# Create and run script
bash scripts/run-all-e2e.sh
```

Or manually:
```bash
npm run e2e -w expense-ui && \
npm run e2e -w @training-john/stopwatch-ui && \
npm run e2e -w @training-john/temp-converter-ui && \
npm run e2e -w todo-ui
```

---

## Recommended Solution: Add Root E2E Script

To make `npm run e2e` work at root level (matching CI/CD expectations), add this to root `package.json`:

```json
{
  "scripts": {
    "test": "node scripts/run-vitest.mjs",
    "test:ci": "npm run test -- --run --coverage",
    "e2e": "npm run e2e -w expense-ui && npm run e2e -w @training-john/stopwatch-ui && npm run e2e -w @training-john/temp-converter-ui && npm run e2e -w todo-ui",
    "e2e:single": "npm run e2e -w",
    "lint": "eslint .",
    "sync:linear": "node scripts/sync-linear-subtasks.mjs",
    "sync:specs": "node scripts/sync-spec-to-linear.mjs",
    "sync:github": "node scripts/sync-github-subissues.mjs",
    "todo:remove": "node cli/todo.js remove"
  }
}
```

This enables:
```bash
# Run all E2E tests
npm run e2e

# Run single workspace
npm run e2e:single -- -w expense-ui
```

---

## Summary Table

| Command | Location | Result |
|---------|----------|--------|
| `npm run e2e` | Root | ❌ Missing (before fix) |
| `npm run e2e` | `apps/expense/ui/` | ✅ Works |
| `npm run e2e` | `apps/stopwatch/ui/` | ✅ Works |
| `npm run e2e` | `apps/temp/ui/` | ✅ Works |
| `npm run e2e` | `apps/todo/ui/` | ✅ Works |
| `npm run e2e -w expense-ui` | Root | ✅ Works (with workspace syntax) |

---

## Verification

### Check Available Scripts
```bash
# From root
npm run
# Should show: test, test:ci, lint, sync:*, todo:remove (no e2e)

# From apps/expense/ui
npm run
# Should show: dev, build, lint, test, test:ui, test:run, test:coverage, e2e, e2e:ui, etc.
```

### List Workspaces
```bash
npm ls -w
```

---

## Why This Wasn't Obvious

### Typical Single-App Project
```bash
npm run e2e  # Works fine (script in that package.json)
```

### Monorepo Project
```bash
npm run e2e           # ❌ Root doesn't have it
npm run e2e -w app    # ✅ Run in specific workspace
cd apps/app && npm run e2e  # ✅ Direct app execution
```

The error occurs because CI/CD typically runs from root, but this repo structure requires workspace awareness.

---

## Next Steps

### Immediate: Use Correct Command
```bash
# Test a single app
cd apps/expense/ui && npm run e2e

# Or from root with workspace syntax
npm run e2e -w expense-ui
```

### Recommended: Add Root E2E Script
Update `package.json` to add root-level `e2e` script that runs all workspace apps.

### CI/CD Integration
Update GitHub Actions workflow to:
```bash
npm run e2e  # Will run all E2E tests if root script is added
```

Or keep current approach:
```bash
npm run e2e -w expense-ui
npm run e2e -w @training-john/stopwatch-ui
npm run e2e -w @training-john/temp-converter-ui
npm run e2e -w todo-ui
```

---

## Summary

| Aspect | Details |
|--------|---------|
| **Problem** | Root `package.json` missing `e2e` script |
| **Root Cause** | Monorepo structure - scripts are per-app, not root |
| **Solution** | Use workspace syntax or navigate to app directory |
| **Recommended** | Add aggregated E2E script to root `package.json` |
| **Files to Update** | Root `package.json` (optional but recommended) |
| **Risk Level** | None (documentation/convenience fix) |
| **Production Ready** | ✅ Yes (already works in apps) |

---

**Generated**: 2025-11-12  
**Investigator**: AI Code Assistant  
**Status**: ✅ DOCUMENTED - Proper E2E execution method identified

