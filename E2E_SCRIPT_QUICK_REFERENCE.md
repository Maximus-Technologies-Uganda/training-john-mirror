# E2E Script Commands - Quick Reference

## The Issue (FIXED ✅)

```
npm error Missing script: "e2e"
```

**Root Cause**: Running `npm run e2e` from root directory, but script only exists in workspace apps.

---

## The Solution (NOW AVAILABLE)

### Option 1: From App Directory (Always Works)
```bash
cd apps/expense/ui
npm run e2e

cd apps/stopwatch/ui
npm run e2e

cd apps/temp/ui
npm run e2e

cd apps/todo/ui
npm run e2e
```

### Option 2: From Root with Workspace Syntax
```bash
# Run specific app
npm run e2e -w expense-ui
npm run e2e -w @training-john/stopwatch-ui
npm run e2e -w @training-john/temp-converter-ui
npm run e2e -w todo-ui
```

### Option 3: From Root (NEW - Added to package.json)
```bash
# Run ALL E2E tests at once
npm run e2e
```

---

## What Changed

**File**: Root `package.json`

**Added Scripts**:
```json
"e2e": "npm run e2e -w expense-ui && npm run e2e -w @training-john/stopwatch-ui && npm run e2e -w @training-john/temp-converter-ui && npm run e2e -w todo-ui",
"e2e:single": "npm run e2e -w"
```

Now you can run `npm run e2e` from root and it will run E2E tests in all app workspaces!

---

## All E2E Commands

### Expense UI
```bash
npm run e2e                # Standard E2E tests
npm run e2e:ui             # With Playwright UI
```

### Stopwatch UI
```bash
npm run e2e                # Standard E2E tests
npm run e2e:ui             # With Playwright UI
```

### Temp Converter UI
```bash
npm run e2e                # Standard E2E tests
npm run e2e:ui             # With Playwright UI
```

### Todo UI (Extended)
```bash
npm run e2e                     # All tests
npm run e2e:headed              # With browser UI
npm run e2e:debug               # Debug mode
npm run e2e:chromium            # Chromium only
npm run e2e:firefox             # Firefox only
npm run e2e:webkit              # WebKit only
npm run e2e:mobile              # Mobile browsers
npm run e2e:compatibility       # Cross-browser
npm run e2e:report              # View test report
```

---

## Monorepo Structure

```
training-john/
├── package.json (ROOT - NOW HAS e2e script ✅)
├── apps/
│   ├── expense/ui/package.json      (has e2e script)
│   ├── stopwatch/ui/package.json    (has e2e script)
│   ├── temp/ui/package.json         (has e2e script)
│   └── todo/ui/package.json         (has e2e script)
```

---

## Verification

### List Available Scripts
```bash
npm run          # Shows all root scripts (now includes e2e!)
```

### Run E2E from Root
```bash
npm run e2e      # Runs all workspace E2E tests
```

---

**Status**: FIXED - Root e2e script now available

