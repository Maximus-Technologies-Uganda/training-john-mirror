# Repository Hygiene Improvement Plan - Summary

**Status:** Plan created and documented  
**Branch:** fix/week3-playwright-artifacts  
**Next Step:** Ready for implementation phase

---

## 🎯 Objectives

### 1. Move Runtime Files to /data Directory
- Move `expenses.json` from root to `data/persistence/`
- Verify `todos.json` is in `data/persistence/`
- Verify `time.json` is in `data/`
- Create clear `/data` directory structure

### 2. Update .gitignore
- Add explicit rules for runtime JSON files
- Protect all files under `data/**/*.json`
- Keep exceptions for example/template files
- Prevent accidental commits of runtime data

### 3. Add --storage Parameter to CLIs
- `expense.js` - Accept custom storage path
- `todo.js` - Accept custom storage path
- Verify `stopwatch-cli.js` already works
- Update help text for all CLIs

### 4. Improve Test Isolation
- Tests use temporary directories
- No side effects on working directory
- No file system conflicts
- Clean up after tests complete

### 5. Implement Fake Clock in Tests
- Time-dependent logic uses controlled time
- Deterministic test results
- No flaky timing issues
- Easy to test edge cases

---

## 📋 Files Identified for Changes

### Configuration
- `.gitignore` - Update runtime data rules

### Source Code
- `src/expense.js` - Add `--storage` support
- `src/todo.js` - Add `--storage` support
- `src/stopwatch-cli.js` - Verify/document existing support
- Help text in all CLIs

### Tests
- `tests/unit/*.test.js` - Implement temp dirs
- `todo/tests/*.js` - Add fake clock usage
- `expense/tests/*.js` - Use temp directories
- `stopwatch/tests/*.js` - Verify temp dir usage

### Documentation
- `README.md` - Document `/data` structure
- CLI help messages - Show `--storage` option
- REPO_HYGIENE_PLAN.md - Implementation guide

---

## 📊 Target Directory Structure

```
training-john/
├── data/
│   ├── time.json                    # Stopwatch runtime state
│   ├── persistence/
│   │   ├── todos.json              # Todo list items
│   │   ├── expenses.json           # Expense records
│   │   └── example.json            # Template
│   └── example.json                # Template
├── src/                            # CLI source code
├── tests/                          # Test files
├── apps/                           # UI applications
└── [other directories]
```

---

## ✅ Current Status

### ✅ Already Implemented
- `src/stopwatch-cli.js` has `--storage` parameter
- `.gitignore` has `data/**/*.json` rule
- `data/time.json` exists and is used
- `data/persistence/` directory exists

### ⚠️ Needs Implementation
- `src/expense.js` needs `--storage` support
- `src/todo.js` needs `--storage` support
- Tests need temp directory refactoring
- `expenses.json` in root should move to `data/`
- Documentation needs updates

### 📝 Documentation
- `REPO_HYGIENE_PLAN.md` - Comprehensive implementation guide
- Examples for test patterns
- .gitignore templates
- Help text examples

---

## 🚀 Implementation Timeline

**Phase 1: Configuration** (~5 min)
- Update `.gitignore`
- Document runtime data rules

**Phase 2: File Organization** (~10 min)
- Move runtime files to `/data`
- Verify directory structure
- Update paths in code

**Phase 3: CLI Updates** (~20 min)
- Add `--storage` to expense.js
- Add `--storage` to todo.js
- Verify stopwatch works
- Update help text

**Phase 4: Test Refactoring** (~30 min)
- Implement temp directory pattern
- Add fake clock usage
- Update test files
- Verify no breaking changes

**Phase 5: Documentation** (~10 min)
- Update README
- Document new structure
- Add examples

**Total Estimated Time:** 75 minutes

---

## 📚 Documentation Created

### REPO_HYGIENE_PLAN.md
- Current state assessment
- Detailed implementation plan
- Code examples for each phase
- Test patterns
- Verification checklist
- Benefits analysis

### This Summary
- Quick reference overview
- Status and next steps
- File organization
- Timeline

---

## Benefits Overview

### For Code Organization
- ✅ Clear separation of concerns
- ✅ Professional project structure
- ✅ Logical file grouping
- ✅ Easy to navigate

### For Testing
- ✅ Test isolation
- ✅ No side effects
- ✅ Parallel test safety
- ✅ Deterministic results
- ✅ Easy cleanup

### For CI/CD
- ✅ Consistent paths
- ✅ Custom storage support
- ✅ Flexible deployments
- ✅ Test environment separation

### For Development
- ✅ No accidental commits
- ✅ Clear what's tracked
- ✅ Better collaboration
- ✅ Professional standards

---

## 📞 How to Proceed

### If Implementing Now:
1. Read `REPO_HYGIENE_PLAN.md` for detailed steps
2. Follow Phase 1-5 implementation timeline
3. Use provided code examples
4. Run tests after each phase
5. Update documentation

### If Deferring:
1. Keep this plan for future reference
2. Commit `REPO_HYGIENE_PLAN.md` to repo
3. Reference when ready to implement
4. No urgent actions needed now

---

## 🔗 Related Documents

- `REPO_HYGIENE_PLAN.md` - Full implementation guide
- `.gitignore` - Will need updates
- `README.md` - Will need documentation
- `src/` - CLI files that need updates
- `tests/` - Test files that need refactoring

---

## Status: Ready for Implementation

All planning complete. Code examples and implementation steps are documented in `REPO_HYGIENE_PLAN.md`.

**Next Action:** Choose to implement now or defer to future phase.

---

**Created:** November 11, 2025  
**Plan Version:** 1.0  
**Status:** Ready for execution

