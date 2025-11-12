# Repository Hygiene Improvement Plan

**Date:** November 11, 2025  
**Objective:** Organize runtime files, clean .gitignore, and ensure all CLIs support --storage parameter

---

## Current State Assessment

### Runtime Files Currently Scattered
- ✅ `data/time.json` - Stopwatch state
- ✅ `data/persistence/todos.json` - Todo items
- ✅ `data/persistence/expenses.json` - Expense records
- ❌ `expenses.json` - In root (should be in /data)
- ❌ `todo.json` - Missing (likely needs /data location)

### .gitignore Status
- ✅ Has `data/**/*.json` rule
- ✅ Has exception: `!data/example.json`
- ⚠️ Root-level JSON files not captured (expenses.json)
- ⚠️ Needs explicit paths for runtime data

### CLI Storage Support
- ✅ `src/stopwatch-cli.js` - Has `--storage` parameter
- ❌ `src/expense.js` - Needs `--storage` support
- ❌ `src/todo.js` - Needs `--storage` support
- ❌ `src/hello.js` - No storage needed

### Test Files Status
- ⚠️ Unit tests may not be using temp directories
- ⚠️ Some tests may use real files instead of mocks
- ❌ Fake clock usage inconsistent

---

## Implementation Plan

### Phase 1: Update .gitignore

**Changes Needed:**
```gitignore
# Runtime data files (JSON persistence)
expenses.json
todo.json
stopwatch.json
data/**/*.json
!data/example.json
!data/persistence/example.json

# Test temporary directories
tmp/
temp/
.test-temp/
```

### Phase 2: Move Root JSON Files to /data

**Files to Move:**
- `expenses.json` → `data/expenses.json` (or `data/persistence/expenses.json`)
- Create proper directory structure under `data/persistence/`

**Verify Structure:**
```
data/
├── time.json (stopwatch)
├── persistence/
│   ├── todos.json
│   ├── expenses.json
│   └── example.json (template)
└── example.json (if needed)
```

### Phase 3: Add --storage Parameter to CLIs

#### `src/expense.js`
**Before:**
```javascript
const dataFile = path.join(process.cwd(), 'expenses.json');
```

**After:**
```javascript
// Parse --storage argument
let dataFile = path.join(process.cwd(), 'data', 'persistence', 'expenses.json');
const storageIndex = process.argv.indexOf('--storage');
if (storageIndex !== -1 && storageIndex + 1 < process.argv.length) {
  dataFile = process.argv[storageIndex + 1];
}
```

#### `src/todo.js`
**Before:**
```javascript
const DATA_FILE = 'todo.json';
```

**After:**
```javascript
// Parse --storage argument
let dataFile = path.join(process.cwd(), 'data', 'persistence', 'todos.json');
const storageIndex = process.argv.indexOf('--storage');
if (storageIndex !== -1 && storageIndex + 1 < process.argv.length) {
  dataFile = process.argv[storageIndex + 1];
}
```

### Phase 4: Update Tests to Use Temp Directories

**Test Pattern:**
```javascript
const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'test-'));
const testDataFile = path.join(tempDir, 'test-data.json');
// Use testDataFile in tests
// Cleanup: fs.promises.rmdir(tempDir, { recursive: true })
```

**Fake Clock Usage:**
```javascript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});
```

### Phase 5: Update Documentation

**Updates Needed:**
- Add `--storage <path>` to all CLI help messages
- Document `data/` directory structure in README
- Show examples of using `--storage` in tests

---

## Files to Modify

### Configuration Files
- [ ] `.gitignore` - Update runtime data rules

### Source Files
- [ ] `src/expense.js` - Add `--storage` support
- [ ] `src/todo.js` - Add `--storage` support
- [ ] `src/stopwatch-cli.js` - Verify existing `--storage` works
- [ ] `src/hello.js` - Add help text if needed

### Test Files
- [ ] `tests/unit/expense.test.js` - Use temp dir
- [ ] `tests/unit/todo.test.js` - Use temp dir + fake clock
- [ ] `tests/unit/stopwatch.test.js` - Use temp dir
- [ ] `hello/tests/*.js` - Use fake clock if needed
- [ ] `todo/tests/*.js` - Use temp dir + fake clock
- [ ] `expense/tests/*.js` - Use temp dir

### Documentation
- [ ] `README.md` - Document `/data` directory
- [ ] `src/expense.js` - Add help text for `--storage`
- [ ] `src/todo.js` - Add help text for `--storage`

---

## Data Directory Structure (Target)

```
data/
├── time.json                    # Stopwatch state
├── persistence/
│   ├── todos.json              # Todo items
│   ├── expenses.json           # Expense records
│   └── example.json            # Template file
└── example.json                # Template (if needed)
```

---

## .gitignore Changes

**Add:**
```gitignore
# Runtime persistence files
expenses.json
todo.json
stopwatch.json

# Test temporary files
.test-temp/
.test-data/
```

---

## CLI Help Text Examples

### expense.js
```
Usage: node expense.js [options] <command> [args]

Options:
  --storage <path>  Specify custom storage file path (default: data/persistence/expenses.json)

Commands:
  add <amount> <description>  Add new expense
  list                        List all expenses
  total                       Show total expenses
```

### todo.js
```
Usage: node todo.js [options] <command> [args]

Options:
  --storage <path>  Specify custom storage file path (default: data/persistence/todos.json)

Commands:
  add <task>                  Add new task
  list                        List all tasks
  done <id>                   Mark task as done
  remove <id>                 Remove task
```

---

## Test Implementation Pattern

### Using Temp Directory
```javascript
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

describe('Expense CLI', () => {
  let tempDir;
  let testDataFile;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-expense-'));
    testDataFile = path.join(tempDir, 'expenses.json');
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('should add expense', async () => {
    // Test using --storage parameter
    // runTest(['add', '10.50', 'Coffee', '--storage', testDataFile]);
  });
});
```

### Using Fake Clock
```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Todo CLI', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set task timestamp', () => {
    const now = new Date('2025-01-15');
    vi.setSystemTime(now);
    // Test timestamp logic
  });
});
```

---

## Benefits

### Code Cleanliness
- ✅ Runtime files organized under `/data`
- ✅ Clear separation of concerns
- ✅ Professional project structure

### Testing
- ✅ Tests use isolated temp directories
- ✅ No file system side effects
- ✅ Tests don't interfere with each other
- ✅ Fake clock for deterministic time tests

### Flexibility
- ✅ CLIs can specify custom storage paths
- ✅ Easy to integrate with other systems
- ✅ Better for CI/CD environments

### Git Hygiene
- ✅ Clear rules for what's tracked
- ✅ No accidental commits of runtime data
- ✅ Consistent across all projects

---

## Implementation Priority

1. **High** - Update .gitignore (prevents accidents)
2. **High** - Move runtime files to /data
3. **Medium** - Add --storage support to CLIs
4. **Medium** - Update tests to use temp dirs
5. **Low** - Update documentation

---

## Verification Checklist

- [ ] .gitignore has explicit rules for `data/**/*.json`
- [ ] All runtime JSON files under `data/` directory
- [ ] `expenses.js` supports `--storage` parameter
- [ ] `todo.js` supports `--storage` parameter
- [ ] Stopwatch `--storage` parameter verified working
- [ ] Unit tests use temp directories
- [ ] Tests use fake clock for time-dependent logic
- [ ] Help text documents `--storage` option
- [ ] README documents `/data` directory structure
- [ ] No test files pollute working directory

---

## Next Steps

1. Create git branch: `feat/repo-hygiene`
2. Implement changes in priority order
3. Run tests to verify no breaking changes
4. Update documentation
5. Create PR with all improvements
6. Merge to development branch

---

**Status:** Planning complete  
**Ready for:** Implementation phase

