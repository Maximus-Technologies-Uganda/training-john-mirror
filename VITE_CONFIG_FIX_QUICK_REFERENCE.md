# Vite ESM Config Fix - Quick Reference

## The Problem (FIXED ✅)

E2E tests were failing because Vite config files had ESM/CommonJS issues:

```
ReferenceError: exports is not defined in ES module scope
Error: failed to load config from vite.config.js
```

## Two Issues Found & Fixed

### Issue 1: Stopwatch vite.config.js (CommonJS in ESM Package)
- **Problem**: Using `require()` and `exports.default` while `"type": "module"` is set
- **Fix**: Converted entire file to ESM syntax

**Before** (❌ CommonJS):
```javascript
const vite_1 = require("vite");
exports.default = (0, vite_1.defineConfig)({...});
```

**After** (✅ ESM):
```javascript
import { defineConfig } from 'vite';
export default defineConfig({...});
```

### Issue 2: Temp vite.config.ts (Missing __dirname)
- **Problem**: Used `__dirname` without defining it in ESM context
- **Fix**: Added `__dirname` reconstruction from `import.meta.url`

**Before** (❌ Undefined):
```typescript
path.resolve(__dirname, 'src')  // __dirname is undefined!
```

**After** (✅ Defined):
```typescript
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
path.resolve(__dirname, 'src')  // Works correctly
```

## Files Changed

| File | Fix |
|------|-----|
| `apps/stopwatch/ui/vite.config.js` | ✅ Converted CommonJS → ESM + Added __dirname |
| `apps/temp/ui/vite.config.ts` | ✅ Added __dirname |

## Verification

Run tests to verify:
```bash
cd apps/stopwatch/ui && npm run e2e
cd apps/temp/ui && npm run e2e
```

Expected: ✅ Dev server starts successfully

## Why This Matters

When `package.json` has `"type": "module"`:
- ✅ All `.js` and `.ts` files are ES modules
- ✅ Must use `import/export` syntax (no `require/exports`)
- ✅ `__dirname` must be reconstructed from `import.meta.url`

---
**Status**: FIXED - All Vite configs now ESM-compliant

