# npm ci Error Investigation Report

## Error Analysis

### Original Error
```
npm ci
shell: /usr/bin/bash -e {0}
Error: An error occurred trying to start process '/usr/bin/bash' with working directory '/home/runner/work/training-john/training-john/apps/temp/ui'. No such file or directory
```

**Root Cause:** This error indicates that a GitHub Actions workflow is attempting to run locally on Windows. The error shows:
- Linux bash path: `/usr/bin/bash`
- GitHub Actions runner path: `/home/runner/work/training-john/training-john/apps/temp/ui`
- This suggests you may be using `act` (GitHub Actions local runner) or there's a misconfiguration

### Current Error (After Attempting Local Run)
```
npm error EBUSY: resource busy or locked, unlink 'C:\Users\nsimb\Projects\training-john\training-john\node_modules\caniuse-lite\data\regions\VC.js'
```

**Root Cause:** Windows file locking issue - files in `node_modules` are locked by another process (IDE, antivirus, file explorer, etc.)

## Investigation Findings

### 1. Missing package-lock.json
- **Location:** `apps/temp/ui/`
- **Issue:** `npm ci` requires `package-lock.json` to exist
- **Status:** File does not exist in `apps/temp/ui/`

### 2. GitHub Actions Workflow Configuration
- **File:** `.github/workflows/playwright.yml`
- **Job:** `test-temp` (lines 80-110)
- **Configuration:** Correctly configured for Linux (`runs-on: ubuntu-latest`)
- **Issue:** If running locally with `act`, it may not handle Windows paths correctly

### 3. Workspace Structure
- Root workspace uses npm workspaces: `"workspaces": ["apps/*/ui"]`
- Each app (`expense`, `stopwatch`, `temp`) has its own `ui/` directory with `package.json`
- Root has `package-lock.json`, but individual apps may not

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

**For Local Development:**
1. Use `npm install` instead of `npm ci` in app directories that don't have `package-lock.json`
2. Run `npm ci` from the root directory (which has `package-lock.json`)
3. If you need `npm ci` in app directories, first run `npm install` to generate `package-lock.json`

**For CI/CD:**
- The GitHub Actions workflows are correctly configured
- They will run automatically on push/PR to `development` branch
- No local action needed - let GitHub Actions handle it

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

## Summary

- **Original Error:** GitHub Actions workflow trying to run locally on Windows
- **Current Error:** Windows file lock + missing package-lock.json
- **Solution:** Use `npm install` for local development, or generate `package-lock.json` first
- **CI/CD:** Workflows are correctly configured and will run automatically on GitHub

