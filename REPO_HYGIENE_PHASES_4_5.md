# Repository Hygiene - Phases 4 & 5 Implementation Guide

**Status:** Phases 1-3 Complete ✅  
**Next:** Phases 4-5 (Tests + Documentation)

---

## Phase 4: Test Refactoring (In Progress)

### Current Status
- ✅ Expense CLI now supports `--storage` parameter
- ✅ Tests in `expenses/tests/` use core logic (no file I/O)
- ⚠️ Need to add temp directory pattern to integration tests
- ⚠️ Need to add fake clock to time-dependent tests

### Test Pattern to Implement

#### Temp Directory Pattern
```javascript
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { beforeEach, afterEach } from 'vitest';

describe('CLI with custom storage', () => {
  let tempDir;
  let testDataFile;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-expenses-'));
    testDataFile = path.join(tempDir, 'expenses.json');
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('should handle custom storage path', () => {
    // Test using --storage parameter
    // runCommand(['list', '--storage', testDataFile]);
  });
});
```

#### Fake Clock Pattern
```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Time-dependent logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set timestamp correctly', () => {
    const testDate = new Date('2025-01-15T10:30:00Z');
    vi.setSystemTime(testDate);
    
    // Test timestamp logic
    expect(Date.now()).toBe(testDate.getTime());
  });
});
```

### Files Identified for Phase 4

#### Expense Tests
- `expenses/tests/expenses.test.js` - ✅ Already unit tested (no changes needed)
- `expenses/tests/cli-month-flag-error.test.js` - Add temp dir pattern

#### Todo Tests
- `todo/tests/todo.test.js` - Add temp dir + fake clock
- Pattern: Use `--storage` with temp directory

#### Stopwatch Tests
- `stopwatch/tests/stopwatch-core.test.js` - Already good
- Integration: Use `--storage` with temp directory

### Implementation Steps

1. **Identify integration tests** - Tests that use file I/O
2. **Add temp directory setup** - Use `fs.mkdtemp()` in `beforeEach`
3. **Update test commands** - Pass `--storage <tempPath>`
4. **Add fake clock** - For tests checking timestamps
5. **Cleanup** - `fs.rm()` in `afterEach`
6. **Verify no side effects** - Check working directory clean after tests

---

## Phase 5: Documentation Updates

### README.md Updates

**Add Section:**
```markdown
## 📁 Data Directory Structure

Runtime data files are organized under the `data/` directory:

```
data/
├── time.json                    # Stopwatch state
├── persistence/
│   ├── todos.json              # Todo list items
│   ├── expenses.json           # Expense records
│   └── example.json            # Example template
└── example.json                # Template (if needed)
```

### Do Not Commit
All files under `data/` are `.gitignore`d except templates. Never commit:
- `data/time.json` - Contains active stopwatch state
- `data/persistence/todos.json` - Contains user tasks
- `data/persistence/expenses.json` - Contains user expenses

### CLI Storage Configuration

All CLI tools support the `--storage` parameter to specify a custom data file path:

```bash
# Use default path (data/persistence/expenses.json)
node expenses list

# Use custom path (useful for testing)
node expenses list --storage /tmp/test-expenses.json

# Use environment variable
export EXPENSES_DATA_FILE=/custom/path/expenses.json
node expenses list
```

### Custom Storage Priority
1. **CLI `--storage` argument** - Highest priority
2. **Environment variable** - `EXPENSES_DATA_FILE`
3. **Default path** - `data/persistence/expenses.json`
```

### CLI Help Text Updates

#### expenses-cli.js
```bash
Usage: node expenses [options]

Options:
  -s, --storage <path>   Custom storage file path
                         (default: data/persistence/expenses.json)
  -m, --month <number>   Filter expenses by month (1-12)
  -c, --category <text>  Filter expenses by category
  -h, --help            Show help text
  --version             Show version
```

#### todo-cli.js
```bash
Usage: node todo [options] <command> [args]

Options:
  -s, --storage <path>   Custom storage file path
                         (default: data/persistence/todos.json)
  -h, --help            Show help text

Commands:
  add <task>            Add new task
  list                  List all tasks
  done <id>             Mark task as done
  remove <id>           Remove task
```

### Testing Documentation

**Add to README:**
```markdown
## 🧪 Running Tests

Tests use isolated temporary directories to prevent file system side effects.

### Unit Tests (Core Logic)
```bash
npm test
```

### Integration Tests (CLI with Custom Storage)
Tests use `--storage` parameter with temporary directories:

```bash
# Tests create temp dirs automatically
npm test -- expenses
npm test -- todo
```

### Deterministic Time Tests
Some tests use fake timers (`vi.useFakeTimers()`) for consistent results:

```javascript
beforeEach(() => {
  vi.useFakeTimers();  // Control system time
});

afterEach(() => {
  vi.useRealTimers();  // Restore real time
});
```

### Key Benefits
- ✅ Tests don't interfere with each other
- ✅ No side effects on working directory
- ✅ CI/CD safe (parallel test execution)
- ✅ Deterministic results (no timing issues)
```

---

## Implementation Checklist

### Phase 4: Test Refactoring
- [ ] Identify all integration tests that use file I/O
- [ ] Add temp directory pattern to `beforeEach()`
- [ ] Update test commands to use `--storage` parameter
- [ ] Add fake clock to time-dependent tests
- [ ] Verify cleanup in `afterEach()`
- [ ] Run all tests and verify passing
- [ ] Commit: `feat: implement temp directories and fake clock in tests`

### Phase 5: Documentation
- [ ] Update README.md with `/data` structure
- [ ] Add "Do Not Commit" section
- [ ] Document `--storage` parameter usage
- [ ] Add CLI help text examples
- [ ] Add testing documentation
- [ ] Update package.json scripts description if needed
- [ ] Commit: `docs: document data directory structure and test patterns`

---

## Benefits Summary

### Code Quality ✅
- Professional file organization
- Clear data vs. code separation
- Logical directory structure

### Testing ✅
- Isolated test environments
- No file system side effects
- Parallel test execution safe
- Deterministic results

### CI/CD ✅
- Consistent storage paths
- Flexible configuration
- Environment-specific overrides
- Easy to integrate

### Development ✅
- No accidental commits
- Clear git rules
- Professional standards
- Better collaboration

---

## Timeline

| Phase | Task | Est. Time | Status |
|-------|------|-----------|--------|
| 1 | Update .gitignore | 5 min | ✅ |
| 2 | Organize files | 10 min | ✅ |
| 3 | Add --storage param | 20 min | ✅ |
| 4 | Test refactoring | 30 min | ⏳ |
| 5 | Documentation | 10 min | ⏳ |
| | **TOTAL** | **75 min** | **80%** |

---

## Test Implementation Examples

### Expense Test with Temp Dir
```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { run } from '../src/expense-cli.js';

describe('Expense CLI with custom storage', () => {
  let tempDir, testFile;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-exp-'));
    testFile = path.join(tempDir, 'expenses.json');
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('should add expense to custom storage', () => {
    const result = run(['add', '10.50', 'Test', '--storage', testFile]);
    expect(result).toBe(0);
  });
});
```

### Todo Test with Fake Clock
```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Todo with timestamps', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set task timestamp correctly', () => {
    const testDate = new Date('2025-01-15');
    vi.setSystemTime(testDate);
    
    // Add task and verify timestamp
    expect(Date.now()).toBe(testDate.getTime());
  });
});
```

---

## Next Steps

1. **Phase 4:** Implement test pattern in 3-4 key test files
2. **Phase 5:** Update documentation with new structure
3. **Commit:** One commit per phase
4. **Push:** Create PR with all phases complete
5. **Merge:** Merge to development branch

---

## Notes

- All changes are backward compatible
- Default behavior unchanged
- Optional `--storage` for flexibility
- No breaking changes
- Tests remain isolated and clean

---

**Status:** 80% Complete (Phases 1-3 Done)  
**Ready for:** Phase 4-5 Implementation

