# Phase 1: Setup (Shared Infrastructure)

**Labels:** spec-sync, todo-ui, setup, infrastructure

---

## Purpose

Establish shared packages, project skeleton, and workspace scripts.

---

## Tasks

- [ ] **T001**  Create TypeScript wrapper package for todo core exports in `apps/todo/core/{package.json,tsconfig.json,src/index.ts}`.
- [ ] **T002** *P* Scaffold Vite React TypeScript UI skeleton in `apps/todo/ui/` (package.json, tsconfig.json, vite.config.ts, index.html, `src/main.tsx`, `src/App.tsx`, `src/styles/app.css`).
- [ ] **T003** *P* Update root `package.json` and `apps/todo/ui/package.json` scripts for `dev`, `test`, `test:e2e`, and register the new workspace packages.

---

## Dependencies

🚀 **None** - Can start immediately

## Files to Modify

📦 package.json files

## Acceptance Criteria

- ✅ Workspace scripts functional
- ✅ `npm run dev` launches basic app
- ✅ Shared packages properly configured

---

*Part of epic: #EPIC_NUMBER_HERE*

*Generated from spec sync on 2025-10-30*
