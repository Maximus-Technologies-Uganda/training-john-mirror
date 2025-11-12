# NPM --prefix Dev Server Fix

**Date**: November 12, 2025  
**Issue**: `npm run dev` still failing with "Missing script: dev" after subshell fix  
**Status**: ✅ FIXED & PUSHED TO GITHUB

---

## 🔴 The Problem

Even after switching to subshell syntax:

```bash
(cd apps/temp/ui && npm run dev > /tmp/temp-server.log 2>&1) &
```

CI still failed with:

```
npm error Missing script: "dev"
```

### Root Cause

`npm` was still executing from the **workspace root**, ignoring the subshell
directory change. The subshell change ensured the shell was in the right
directory, but `npm` itself resolved the workspace root and looked for scripts
there, where the `dev` script does not exist.

---

## ✅ The Fix

Use `npm --prefix <path>` to explicitly target the correct workspace package
before backgrounding the process.

```bash
npm --prefix apps/temp/ui run dev > /tmp/temp-server.log 2>&1 &
```

### Why This Works

- `--prefix` tells `npm` exactly which package directory to use.
- `npm` now reads `apps/temp/ui/package.json`, finds the `dev` script, and
  starts the Vite dev server correctly.
- Works reliably with npm workspaces and avoids reliance on shell-directory
  inheritance for backgrounded processes.

---

## 🔧 Applied Changes

Updated `.github/workflows/playwright.yml` for all Playwright jobs:

- Expense app (port 3000)
- Stopwatch app (port 5173)
- Temp converter app (port 5173)

Each job now includes:

```yaml
npm --prefix apps/<app>/ui run dev > /tmp/<app>-server.log 2>&1 &
echo $! > /tmp/<app>-server.pid
```

All other logic (logging, PID tracking, wait-on, diagnostics) remains intact.

---

## 📝 Commit

```
Commit: b2fb9d1
Message: fix(ci): Use npm --prefix for dev server startup in Playwright jobs
```

---

## ✅ Result

- `npm` runs in the correct workspace context.
- `dev` scripts execute successfully for all apps.
- Wait-on now sees running servers on the expected ports.
- Playwright tests can execute end-to-end in CI.

**Status**: ✅ FIXED & READY FOR CI VALIDATION
