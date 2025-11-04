# Implementation Plan: Stopwatch & Temp Converter UI (Edge States)

**Branch**: `004-stopwatch-temp-ui` | **Date**: November 4, 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-stopwatch-temp-ui/spec.md`

**Note**: This plan covers two interconnected React UI features (Stopwatch + Temp Converter) built on existing Week 2 core logic, with comprehensive error handling and accessibility requirements.

## Summary

This feature implements two complementary UI applications connecting to existing core logic modules:

1. **Stopwatch UI** (`apps/stopwatch/ui/`): A timer with Start/Lap/Stop/Reset controls, real-time MM:SS:MS display, lap tracking with virtual scrolling (>50 laps), and comprehensive error handling for invalid state transitions (e.g., lap-before-start, stop-twice).

2. **Temp Converter UI** (`apps/temp/ui/`): A bidirectional temperature converter (C↔F) with on-blur and on-submit input validation, unit selection dropdowns, 2-decimal rounding, and error states for identical units, non-numeric input, and invalid selections.

Both applications prioritize accessibility (ARIA labels, keyboard navigation, visible focus states), inline error messaging with auto-dismiss behavior, and ≥50% test coverage via Vitest/RTL and Playwright smoke tests.

## Technical Context

**Language/Version**: TypeScript 5+ with React 18+ (per existing project stack)  
**Primary Dependencies**: React, React Hook Form (for form handling), Vitest, React Testing Library, Playwright  
**Storage**: None (in-memory state; no persistence per Week 2 design)  
**Testing**: Vitest + React Testing Library (unit/component), Playwright (E2E smoke tests)  
**Target Platform**: Web (modern browsers; desktop-first, mobile responsive optional)  
**Project Type**: Web - Single repository monorepo with multiple apps (`apps/stopwatch/ui`, `apps/temp/ui`)  
**Performance Goals**: 
- UI controls respond within 100ms (keyboard/mouse input)
- Real-time display updates ≤16ms latency (60fps for stopwatch)
- Lap list scrolls smoothly with 50+ entries (virtual scrolling mitigates)
- Temperature conversion result appears within 200ms (local logic only)

**Constraints**:
- No state persistence on page refresh (per Week 2 design)
- Error messages must appear/dismiss within 1 second
- All controls must be keyboard accessible (WCAG 2.1 AA compliant)
- No external API calls required

**Scale/Scope**: 
- 2 independent UI applications
- ~4 React components per app (display, controls, error messaging, list)
- ~20 functional requirements (9 Stopwatch, 11 Temp)
- ~23 acceptance scenarios
- 2 Playwright smoke tests (1 per app)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle 1: CLI Outcomes First ✅ PASS
- **Status**: N/A for UI apps (this feature is a React web UI, not a CLI tool)
- **Rationale**: UI applications deliver value through interactive interfaces, not CLI surfaces. Constitution principle is met at the feature suite level (core logic from Week 2 is CLI-testable; UIs are integration surfaces).
- **Justification**: Spec references core logic modules (`apps/stopwatch/core/`, `apps/temp/core/`) which should have CLI interfaces; UIs build on top.

### Principle 2: Test-Driven Delivery ✅ PASS
- **Status**: COMPLIANT
- **Requirements Met**:
  - Tests for all error states (stop-twice, lap-before-start, identical units, non-numeric input)
  - RTL component tests ≥50% statement coverage required (SC-006, SC-012)
  - Playwright E2E smoke tests required (SC-015)
  - Spec includes specific test scenarios mapped to user stories
- **Plan**: Tests written before implementation per TDD (failing tests → implementation → passing tests)

### Principle 3: Operational Transparency ✅ PASS
- **Status**: COMPLIANT
- **Requirements Met**:
  - Inline error messages with specific text (not generic)
  - Keyboard accessible (observable focus states)
  - ARIA labels for screen reader transparency
  - Test coverage reports via Vitest + Playwright
  - No external APIs (fully local, deterministic)
- **Plan**: Error messages, keyboard events, and test results provide observability

### Principle 4: Story-Centered Planning ✅ PASS
- **Status**: COMPLIANT
- **Requirements Met**:
  - 9 prioritized user stories (4 Stopwatch P1, 5 Temp: 4xP1, 1xP2)
  - Each story independently testable (can be built/demoed in sequence)
  - Acceptance scenarios map 1:1 to stories
  - Spec includes edge cases for each story
  - Success criteria measurable per story

### Principle 5: Sustainable Learning Cadence ✅ PASS
- **Status**: COMPLIANT
- **Requirements Met**:
  - Spec includes comprehensive documentation (20 FRs, 23 acceptance scenarios, 8 edge cases)
  - Accessibility considerations baked in (ARIA, keyboard, focus management)
  - Error handling patterns consistent (inline, auto-dismiss)
  - Testing patterns standardized (RTL + Playwright)
  - No unresolved TODOs; all clarifications resolved in Q&A session

### Additional Constraints ✅ PASS
- **TypeScript-first**: ✅ (React + TypeScript per project standard)
- **No external APIs**: ✅ (All logic local to core modules)
- **Offline-friendly**: ✅ (No persistence needed; tests use local state)
- **Artifact exclusion**: ✅ (No new credentials or CI artifacts to exclude)

---

**Gate Result**: ✅ **PASSED** - All principles met; no violations requiring justification.

---

## Project Structure

### Documentation (this feature)

```text
specs/004-stopwatch-temp-ui/
├── spec.md                          # Feature specification (COMPLETE)
├── plan.md                          # This file (Phase 1 output)
├── research.md                      # Phase 0 output (research findings)
├── data-model.md                    # Phase 1 output (entity definitions)
├── quickstart.md                    # Phase 1 output (setup & run guide)
├── SPEC_CREATION_SUMMARY.md         # Spec creation completion report
├── checklists/
│   └── requirements.md              # Quality validation checklist
└── contracts/
    ├── stopwatch-core-api.yaml      # Stopwatch core logic contract
    └── temp-core-api.yaml           # Temp core logic contract
```

### Source Code (repository root)

```text
apps/
├── stopwatch/
│   └── ui/
│       ├── src/
│       │   ├── components/
│       │   │   ├── StopwatchDisplay.tsx       # Time display (MM:SS:MS)
│       │   │   ├── LapList.tsx                # Lap list with virtual scrolling
│       │   │   ├── StopwatchControls.tsx      # Start, Lap, Stop, Reset buttons
│       │   │   ├── ErrorBanner.tsx            # Inline error display
│       │   │   └── Stopwatch.tsx              # Main container component
│       │   ├── hooks/
│       │   │   └── useStopwatch.ts            # State management + core logic integration
│       │   ├── types/
│       │   │   └── stopwatch.ts               # TypeScript types
│       │   ├── utils/
│       │   │   ├── formatting.ts              # MM:SS:MS formatting
│       │   │   └── validation.ts              # State validation
│       │   ├── App.tsx
│       │   └── index.tsx
│       ├── tests/
│       │   ├── components/
│       │   │   ├── StopwatchDisplay.test.tsx
│       │   │   ├── LapList.test.tsx
│       │   │   ├── StopwatchControls.test.tsx
│       │   │   └── Stopwatch.test.tsx
│       │   ├── hooks/
│       │   │   └── useStopwatch.test.ts
│       │   └── utils/
│       │       ├── formatting.test.ts
│       │       └── validation.test.ts
│       ├── e2e/
│       │   └── stopwatch.spec.ts              # Playwright smoke test
│       ├── vitest.config.ts
│       ├── playwright.config.ts
│       └── package.json
│
└── temp/
    └── ui/
        ├── src/
        │   ├── components/
        │   │   ├── TemperatureInput.tsx       # Numeric input + validation
        │   │   ├── UnitSelectors.tsx          # Source/target dropdowns
        │   │   ├── ConversionResult.tsx       # Display result (2 decimals)
        │   │   ├── ErrorBanner.tsx            # Inline error display
        │   │   └── TempConverter.tsx           # Main container
        │   ├── hooks/
        │   │   └── useTempConversion.ts       # State + validation + core logic
        │   ├── types/
        │   │   └── tempconverter.ts           # TypeScript types
        │   ├── utils/
        │   │   ├── validation.ts              # on-blur + on-submit validation
        │   │   └── formatting.ts              # 2-decimal rounding
        │   ├── App.tsx
        │   └── index.tsx
        ├── tests/
        │   ├── components/
        │   │   ├── TemperatureInput.test.tsx
        │   │   ├── UnitSelectors.test.tsx
        │   │   ├── ConversionResult.test.tsx
        │   │   └── TempConverter.test.tsx
        │   ├── hooks/
        │   │   └── useTempConversion.test.ts
        │   └── utils/
        │       ├── validation.test.ts
        │       └── formatting.test.ts
        ├── e2e/
        │   └── temp-converter.spec.ts         # Playwright smoke test
        ├── vitest.config.ts
        ├── playwright.config.ts
        └── package.json
```

**Structure Decision**: 
Monorepo with two independent React app folders (`apps/stopwatch/ui` and `apps/temp/ui`). Each app is self-contained with its own:
- Source tree (components, hooks, types, utils)
- Test tree (unit via Vitest/RTL, E2E via Playwright)
- Configuration (vitest.config.ts, playwright.config.ts)
- Package manifest (package.json with local dependencies)

This structure enables:
- Independent development and deployment of each UI
- Isolated test suites (failures in one don't block the other)
- Clear separation of concerns (Stopwatch logic separate from Temp logic)
- Shared tooling from monorepo root (linting, formatting, CI/CD)

---

## Complexity Tracking

| Area | Decision | Rationale |
|------|----------|-----------|
| Two UI apps (not one) | Build Stopwatch and Temp as separate React apps | Reduces coupling; enables independent iteration; matches core logic structure (separate modules) |
| Virtual scrolling for laps | Implement if >50 laps recorded | Performance requirement; large lists without virtualization cause lag; balances complexity with use case |
| Inline errors + auto-dismiss | Display near control, auto-dismiss on fix | Accessibility best practice (screen reader announces near control); auto-dismiss prevents alert fatigue |
| On-blur + on-submit validation | Double-check validation strategy | UX balance: field-level feedback without interrupting typing + form-level safety check |
| ≥50% test coverage (not 100%) | Aim for statement coverage, accept gaps in error paths | Practical coverage target; focuses on main flows while time-boxing; meets spec requirements |

---

## Phase 0: Research Tasks

**Prerequisites**: Spec completed ✅

Research tasks to resolve any unknowns before Phase 1 design:

1. **Virtual Scrolling Best Practices in React**
   - Find: React library recommendations (react-window, react-virtualized)
   - Determine: Configuration for 50+ lap entries, performance expectations
   - Output: decision in research.md

2. **React Hook Form Integration with Custom Validation**
   - Find: Best practices for on-blur + on-submit validation
   - Determine: Library usage patterns, error messaging, clearance on fix
   - Output: decision in research.md

3. **Vitest + React Testing Library Setup**
   - Find: Configuration for component testing, snapshot testing policies
   - Determine: Async handling, virtual scrolling test helpers, mock strategies
   - Output: decision in research.md

4. **Playwright E2E for React Apps**
   - Find: Best practices for smoke testing React UIs, locator strategies
   - Determine: Accessibility testing (keyboard, ARIA), error state validation
   - Output: decision in research.md

5. **WCAG 2.1 AA Keyboard Navigation**
   - Find: Standard patterns (Tab, Enter, Arrow keys, Esc)
   - Determine: Stopwatch (button focus order), Temp (form focus order)
   - Output: decision in research.md

---

## Phase 1: Design & Contracts (Outline)

**Prerequisites**: research.md ✅

### Data Model

To be generated in `data-model.md`:
- **Stopwatch State Entity**: elapsedTime, lapTimes, status
- **Temp Converter State Entity**: inputValue, sourceUnit, targetUnit, result, error
- Relationships to core logic modules
- State transition diagrams
- Validation constraints

### API Contracts

To be generated in `contracts/`:
- `stopwatch-core-api.yaml`: Expected interface from `apps/stopwatch/core/` (start, lap, stop, reset, getElapsedTime)
- `temp-core-api.yaml`: Expected interface from `apps/temp/core/` (convert, validate units)

### Quick Start Guide

To be generated in `quickstart.md`:
- Setup (install dependencies, environment setup)
- Run Stopwatch UI locally
- Run Temp Converter UI locally
- Run tests (Vitest, Playwright)
- Accessibility validation steps

---

## Next Steps

1. ✅ **Phase 0 Complete**: Research findings documented in research.md
2. ⏭️ **Phase 1**: Generate data-model.md, contracts, quickstart.md
3. ⏭️ **Phase 2**: Run `/speckit.tasks` to generate detailed task breakdown (tasks.md)
4. ⏭️ **Implementation**: Follow tasks.md with test-driven development (failing tests → implementation → passing)

---

## Sign-Off

✅ **Implementation Plan Approved for Phase 1 Design**

- Constitution check: PASSED (all 5 principles met)
- Technical context: Complete (React + TypeScript, Vitest + RTL + Playwright)
- Project structure: Defined (2 independent apps in monorepo)
- Complexity justified: Virtual scrolling, validation strategy, test coverage target
- Ready for: data-model.md, contracts, quickstart.md generation
