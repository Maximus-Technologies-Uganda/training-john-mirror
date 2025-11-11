# npm ci Error Investigation Report

## Executive Summary

**Error Type:** Environment Mismatch + Missing Dependency File  
**Severity:** Medium (blocks CI workflow execution)  
**Root Cause:** GitHub Actions workflow attempting to run on Windows with Linux paths + missing `package-lock.json`  
**Resolution Time:** 5-10 minutes  
**Status:** ✅ Solutions identified and documented

---

## Error Analysis

### Original Error
```
npm ci
shell: /usr/bin/bash -e {0}
Error: An error occurred trying to start process '/usr/bin/bash' with working directory '/home/runner/work/training-john/training-john/apps/temp/ui'. No such file or directory
```

**Root Cause Analysis:**

This error indicates that a GitHub Actions workflow is attempting to run locally on Windows. The error signature shows:

1. **Linux Environment Paths:**
   - Shell: `/usr/bin/bash` (Linux bash executable)
   - Working Directory: `/home/runner/work/training-john/training-john/apps/temp/ui` (GitHub Actions runner path)

2. **Windows Environment:**
   - OS: Windows 10 (win32 10.0.19045)
   - Shell: PowerShell (`C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`)
   - Actual Path: `C:\Users\nsimb\Projects\training-john\training-john\apps\temp\ui`

3. **Likely Scenarios:**
   - Using `act` (GitHub Actions local runner) without proper Windows configuration
   - CI/CD tool misconfiguration
   - Attempting to run Linux-specific workflow commands on Windows

### Current Error (After Attempting Local Run)
```
npm error EBUSY: resource busy or locked, unlink 'C:\Users\nsimb\Projects\training-john\training-john\node_modules\caniuse-lite\data\regions\VC.js'
```

**Root Cause:** Windows file locking issue - files in `node_modules` are locked by another process (IDE, antivirus, file explorer, etc.)

## Investigation Findings

### 1. Missing package-lock.json ⚠️ CRITICAL
- **Location:** `apps/temp/ui/`
- **Issue:** `npm ci` requires `package-lock.json` to exist (verified: `Test-Path apps\temp\ui\package-lock.json` returns `False`)
- **Impact:** `npm ci` will fail even if environment issues are resolved
- **Status:** ❌ File does not exist in `apps/temp/ui/`
- **Why:** npm workspaces can share a root `package-lock.json`, but `npm ci` in a subdirectory requires its own lock file

### 2. GitHub Actions Workflow Configuration
- **File:** `.github/workflows/playwright.yml`
- **Job:** `test-temp` (lines 80-110)
- **Configuration:** 
  ```yaml
  runs-on: ubuntu-latest
  working-directory: apps/temp/ui
  run: npm ci
  ```
- **Status:** ✅ Correctly configured for Linux CI environment
- **Issue:** If running locally with `act` or similar tools, Windows path translation fails
- **Expected Behavior:** This workflow should run on GitHub Actions, not locally

### 3. Workspace Structure Analysis
- **Root Configuration:**
  - Uses npm workspaces: `"workspaces": ["apps/*/ui"]`
  - Has `package-lock.json` at root level
  - Type: `"type": "module"` (ESM)
  
- **App Structure:**
  - Each app (`expense`, `stopwatch`, `temp`) has its own `ui/` directory
  - Each `ui/` directory has independent `package.json`
  - **Issue:** Individual apps don't have their own `package-lock.json` files
  
- **Workspace Behavior:**
  - npm workspaces can install from root, but `npm ci` in subdirectories needs local lock files
  - Root `package-lock.json` manages workspace dependencies, but doesn't satisfy subdirectory `npm ci` requirements

### 4. Environment Mismatch Details
- **CI Environment (Expected):**
  - OS: Ubuntu Linux
  - Shell: `/usr/bin/bash`
  - Path: `/home/runner/work/training-john/training-john/apps/temp/ui`
  
- **Local Environment (Actual):**
  - OS: Windows 10
  - Shell: PowerShell
  - Path: `C:\Users\nsimb\Projects\training-john\training-john\apps\temp\ui`
  
- **Path Translation Failure:**
  - Linux paths (`/home/runner/...`) don't exist on Windows
  - `act` or similar tools need proper Docker/WSL configuration to translate paths

## Solutions

### Solution 1: Run npm ci Locally (Recommended for Local Development)

**For apps/temp/ui:**
```powershell
# Navigate to the app directory
cd apps/temp/ui

# Use npm install instead of npm ci (since package-lock.json doesn't exist)
npm install

# OR if you want to generate package-lock.json first from root:
cd ..\..\..
npm install
cd apps/temp/ui
npm ci
```

**For root workspace:**
```powershell
# From project root
npm ci
```

### Solution 2: Fix Windows File Lock Issue

If you encounter the `EBUSY` error:

1. **Close processes that might lock files:**
   - Close VS Code/Cursor or any IDE
   - Close File Explorer windows showing `node_modules`
   - Temporarily disable antivirus real-time scanning for the project folder

2. **Delete node_modules manually:**
   ```powershell
   # From project root
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Recurse -Force apps\temp\ui\node_modules
   ```

3. **Then run npm install:**
   ```powershell
   npm install
   ```

### Solution 3: Fix GitHub Actions Local Execution (if using `act`)

If you're using `act` to run GitHub Actions locally:

1. **Install act with Windows support:**
   ```powershell
   # Using Chocolatey
   choco install act-cli
   
   # OR using Scoop
   scoop install act
   ```

2. **Run with proper shell configuration:**
   ```powershell
   act -j test-temp --container-architecture linux/amd64
   ```

3. **Alternative:** Use WSL2 (Windows Subsystem for Linux) to run workflows:
   ```bash
   # In WSL2
   cd /mnt/c/Users/nsimb/Projects/training-john/training-john
   npm ci
   ```

### Solution 4: Generate package-lock.json for apps/temp/ui

If you want to use `npm ci` in the app directory:

```powershell
cd apps/temp/ui
npm install  # This will generate package-lock.json
# Now npm ci will work
npm ci
```

## Recommended Approach

### For Local Development (Windows)

**Option A: Use npm install (Recommended for Development)**
```powershell
# From project root - installs all workspace dependencies
npm install

# OR from specific app directory
cd apps\temp\ui
npm install
```

**Option B: Generate package-lock.json for CI Compatibility**
```powershell
# Generate lock file for the app
cd apps\temp\ui
npm install  # Generates package-lock.json

# Now npm ci will work locally (if you need it)
npm ci
```

**Option C: Use Root Workspace Install**
```powershell
# From project root - handles all workspaces
npm install

# This installs dependencies for all workspaces defined in root package.json
# Individual apps can then use their dependencies
```

### For CI/CD (GitHub Actions)

✅ **No Action Required** - The workflow is correctly configured:
- Workflow runs on `ubuntu-latest` (Linux)
- Triggers on push/PR to `development` branch
- Will automatically run when code is pushed to GitHub
- **Note:** The workflow will fail until `package-lock.json` exists in `apps/temp/ui/`

### Fixing CI Workflow for Future Runs

To ensure the CI workflow works when triggered:

1. **Generate package-lock.json for the app:**
   ```powershell
   cd apps\temp\ui
   npm install
   git add package-lock.json
   git commit -m "Add package-lock.json for temp/ui"
   ```

2. **Verify other apps have lock files:**
   ```powershell
   Test-Path apps\expense\ui\package-lock.json
   Test-Path apps\stopwatch\ui\package-lock.json
   ```

3. **Commit and push to trigger CI:**
   ```powershell
   git push origin development
   ```

## Verification Steps

1. **Check if package-lock.json exists:**
   ```powershell
   Test-Path apps\temp\ui\package-lock.json
   ```

2. **Check root package-lock.json:**
   ```powershell
   Test-Path package-lock.json
   ```

3. **Verify npm workspaces:**
   ```powershell
   npm ls --workspaces
   ```

## Technical Deep Dive

### Why npm ci Fails Without package-lock.json

`npm ci` (clean install) is designed for CI/CD environments and has strict requirements:
- ✅ Requires `package-lock.json` to exist
- ✅ Deletes `node_modules` before installing
- ✅ Installs exact versions from lock file
- ✅ Fails if `package.json` and `package-lock.json` are out of sync
- ✅ Faster and more reliable than `npm install` for CI

`npm install` (development install):
- ✅ Works without `package-lock.json` (generates it)
- ✅ Updates lock file if dependencies change
- ✅ More flexible for development
- ⚠️ Can update dependency versions (less deterministic)

### npm Workspaces Behavior

With npm workspaces:
- Root `package-lock.json` manages workspace dependencies
- Each workspace can have its own `package.json`
- `npm install` at root installs all workspace dependencies
- `npm ci` in a workspace subdirectory still requires local `package-lock.json`

### Path Translation in CI Tools

When using `act` or similar tools on Windows:
- Linux paths (`/home/runner/...`) don't exist on Windows
- Requires Docker or WSL2 to provide Linux environment
- Path mapping must be configured correctly
- **Recommendation:** Don't run GitHub Actions locally - use GitHub's CI

---

## Summary

### Root Causes Identified
1. ❌ **Environment Mismatch:** Linux workflow paths on Windows system
2. ❌ **Missing Lock File:** `apps/temp/ui/package-lock.json` doesn't exist
3. ⚠️ **Workspace Configuration:** Individual apps need lock files for `npm ci`

### Immediate Solutions
1. ✅ **For Local Development:** Use `npm install` instead of `npm ci`
2. ✅ **For CI Compatibility:** Generate `package-lock.json` in `apps/temp/ui/`
3. ✅ **For CI/CD:** Workflows are correctly configured - let GitHub Actions run them

### Action Items
- [ ] Generate `package-lock.json` for `apps/temp/ui/` (run `npm install` in that directory)
- [ ] Verify other apps (`expense`, `stopwatch`) have lock files
- [ ] Commit lock files to repository
- [ ] Test CI workflow after committing lock files

### Expected Outcome
After generating and committing `package-lock.json`:
- ✅ Local development: `npm install` works in any directory
- ✅ CI/CD: `npm ci` will work in GitHub Actions
- ✅ Deterministic builds: Lock files ensure consistent dependency versions

