# Research Findings: Expense UI Implementation

**Date**: November 2, 2025
**Feature**: Expense UI Implementation (Validation & Filters)
**Researcher**: AI Assistant

## Overview

This research phase addresses key unknowns in the technical implementation of the expense tracking UI. The focus areas include core logic integration, accessibility implementation, data persistence patterns, and validation strategies.

## Research Tasks Completed

### 1. Expense Core Logic Integration

**Decision**: Import functions from `apps/expense/core/` module
**Rationale**: Specification requires importing all business logic from the core module. Need to understand available functions for adding expenses, retrieving expenses, and any filtering logic.
**Alternatives considered**:
- Reimplement core logic in UI - Rejected due to spec requirement to import from core
- Create wrapper functions - Rejected as unnecessary abstraction layer

**Findings**:
- Core module should export functions for expense CRUD operations
- Need to identify exact function signatures and return types
- Core handles business logic, UI handles presentation and user interaction

### 2. React Accessibility Implementation

**Decision**: Use React Aria, Radix UI, or native HTML accessibility attributes
**Rationale**: Need WCAG 2.1 AA compliance for screen readers, keyboard navigation, focus management, color contrast, and ARIA labels as specified.
**Alternatives considered**:
- Custom accessibility implementation - Rejected due to complexity and maintenance burden
- Basic HTML attributes only - Rejected as insufficient for full compliance

**Findings**:
- React Aria provides comprehensive accessibility primitives
- Radix UI offers accessible component primitives
- Native HTML semantic elements with proper ARIA attributes as baseline
- Focus management requires explicit handling for form flows

### 3. localStorage Integration Patterns

**Decision**: Custom React hook with error handling and serialization
**Rationale**: Need reliable client-side persistence with session continuity. localStorage is specified in requirements.
**Alternatives considered**:
- Redux Persist - Rejected as overkill for simple data persistence
- Direct localStorage calls in components - Rejected due to tight coupling and lack of error handling

**Findings**:
- Custom `useLocalStorage` hook pattern common in React ecosystem
- Need JSON serialization/deserialization with error handling
- Should handle localStorage quota exceeded errors
- Consider data migration strategy for schema changes

### 4. Currency Validation and Cents Conversion

**Decision**: Client-side validation with cents conversion utility
**Rationale**: UI accepts decimal display (10.50) but passes cents (1050) to core logic as specified.
**Alternatives considered**:
- Server-side conversion - Rejected as violates spec requirement for UI to handle conversion
- String manipulation - Rejected due to floating point precision issues

**Findings**:
- Use integer math for cents to avoid floating point errors
- Validation should accept common currency formats (10.50, 10,50, etc.)
- Rounding strategy needed for inputs like 10.505
- Display formatting should show 2 decimal places consistently

### 5. Form Validation Strategy

**Decision**: React Hook Form with Zod schema validation
**Rationale**: Need robust form validation for expense fields with clear error messages and accessibility support.
**Alternatives considered**:
- Manual state management - Rejected due to complexity for multi-field validation
- Basic HTML validation - Rejected as insufficient for custom business rules

**Findings**:
- React Hook Form provides excellent accessibility and performance
- Zod offers type-safe schema validation with clear error messages
- Supports async validation for uniqueness constraints
- Integrates well with TypeScript and React patterns

### 6. Testing Patterns for Accessibility

**Decision**: Vitest + Testing Library + custom accessibility matchers
**Rationale**: Need ≥60% test coverage including accessibility behavior verification.
**Alternatives considered**:
- Manual accessibility testing only - Rejected due to spec requirements
- Jest snapshots for accessibility - Rejected as insufficient for behavior testing

**Findings**:
- Testing Library encourages accessible query patterns
- Custom matchers for ARIA attributes and focus management
- Playwright for E2E accessibility testing with axe-core integration
- Coverage tools should include accessibility-related code

## Implementation Recommendations

### Core Architecture
- Create custom hooks: `useExpenses`, `useExpenseFilters`, `useLocalStorage`
- Implement cents conversion utilities in `utils/currency.ts`
- Use React Hook Form + Zod for form validation
- Structure components: `AddExpenseForm`, `ExpenseList`, `ExpenseFilters`

### Accessibility Implementation
- Use semantic HTML elements (`<form>`, `<input>`, `<button>`)
- Implement proper ARIA labels and descriptions
- Ensure keyboard navigation (Tab order, Enter/Space activation)
- Add focus indicators and error announcements
- Test with screen readers and keyboard-only navigation

### Data Flow
- UI components handle user interaction and display
- Custom hooks manage state and side effects
- Core logic module handles business rules and data transformations
- localStorage for persistence with error handling

### Testing Strategy
- Unit tests for utilities and hooks
- Component tests with Testing Library for UI behavior
- E2E tests with Playwright for critical user journeys
- Accessibility testing integrated into all test levels

## Open Questions

1. What specific functions are available in the expense core module?
2. Are there any existing UI components or patterns to follow?
3. What is the exact data schema expected by the core module?
4. Are there any existing accessibility patterns in the codebase?

## Next Steps

Proceed to Phase 1 design with these research findings. Create data models, API contracts, and implementation guides based on the decisions above.
