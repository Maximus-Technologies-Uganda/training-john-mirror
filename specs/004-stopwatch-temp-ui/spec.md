# Feature Specification: Stopwatch & Temp Converter UI (Edge States) & Spec-Kit Creation

**Feature Branch**: `004-stopwatch-temp-ui`  
**Created**: November 4, 2025  
**Status**: Draft  
**Input**: User description: "Thursday: Stopwatch & Temp UI (Edge States) & Spec-Kit Creation - Multi-part task including Spec-Kit creation for both apps, UI implementation with edge state handling, and comprehensive testing"

## Overview

This specification covers the implementation of two interconnected features:

1. **Stopwatch UI**: A timer application with start, lap, stop, and reset controls, displaying elapsed time and recorded laps with robust error handling for invalid state transitions.
2. **Temp Converter UI**: A temperature conversion tool supporting Celsius ↔ Fahrenheit conversions with validation for unit selection and numeric input.

Both features build upon existing Week 2 core logic and implement comprehensive error handling for edge cases (invalid state transitions, identical units, non-numeric input, etc.).

## Clarifications

### Session 2025-11-04

- Q: Should the lap list show interval time only, cumulative time only, or both? → A: Show BOTH interval and cumulative time in format "Lap 1: 5.32s (total: 5.32s)"
- Q: Where should error messages appear and how should they be dismissed? → A: Inline errors near the triggering control that auto-dismiss when the user fixes the issue
- Q: What is the maximum number of laps that can be recorded? → A: No hard limit; use virtual scrolling if list exceeds 50 laps for performance
- Q: What time format should the stopwatch display use? → A: MM:SS:MS (2-digit milliseconds); capped at 99:59 maximum elapsed time
- Q: When should the temperature converter validate input (real-time, on-submit, on-blur)? → A: Validate on-blur (when leaving field) AND on-submit (when attempting conversion)

## User Scenarios & Testing *(mandatory)*

### Stopwatch Feature

#### User Story 1 - Start and Track Time (Priority: P1)

As a user, I want to start a stopwatch and see the elapsed time update in real-time so that I can measure how long an activity takes.

**Why this priority**: Core functionality that enables the basic stopwatch feature. Without starting/tracking time, the application is non-functional.

**Independent Test**: Can be fully tested by clicking Start, waiting a moment, and verifying the elapsed time counter increments, delivering immediate stopwatch value.

**Acceptance Scenarios**:

1. **Given** the stopwatch is in the idle state, **When** I click Start, **Then** the timer begins and the elapsed time counter updates in real-time
2. **Given** the stopwatch is running, **When** I view the display, **Then** the elapsed time is shown in MM:SS:MS format (e.g., 01:23:45 for 1 minute, 23 seconds, 45 milliseconds)
3. **Given** the stopwatch is running, **When** I wait 5 seconds, **Then** the display shows approximately 5 seconds elapsed

---

#### User Story 2 - Record and View Laps (Priority: P1)

As a user, I want to record lap times while the stopwatch is running so that I can track multiple intervals.

**Why this priority**: Essential feature that distinguishes a stopwatch from a simple timer and enables interval tracking.

**Independent Test**: Can be fully tested by starting the stopwatch, recording multiple laps, and verifying all lap times appear in a list, delivering lap timing value.

**Acceptance Scenarios**:

1. **Given** the stopwatch is running, **When** I click Lap, **Then** the current elapsed time is recorded as a lap
2. **Given** I have recorded multiple laps, **When** I view the lap list, **Then** all recorded laps are displayed with both interval and cumulative time (e.g., "Lap 1: 5.32s (total: 5.32s)", "Lap 2: 3.15s (total: 8.47s)")
3. **Given** I have recorded laps, **When** I view the list, **Then** if more than 50 laps are recorded, the list uses virtual scrolling for performance
4. **Given** I record a lap, **When** the stopwatch continues running, **Then** the elapsed time counter continues from where it was

---

#### User Story 3 - Stop and Reset Stopwatch (Priority: P1)

As a user, I want to stop and reset the stopwatch so that I can control its operation and restart measurements.

**Why this priority**: Essential control functionality for managing stopwatch operation and starting fresh measurements.

**Independent Test**: Can be fully tested by starting the stopwatch, stopping it, resetting it, and verifying the display returns to 00:00:00, delivering full stopwatch control.

**Acceptance Scenarios**:

1. **Given** the stopwatch is running, **When** I click Stop, **Then** the elapsed time counter stops updating
2. **Given** the stopwatch is stopped, **When** I click Reset, **Then** all elapsed time, laps, and display are cleared back to 00:00:00
3. **Given** the stopwatch is reset, **When** I click Start again, **Then** the stopwatch begins timing from 00:00:00

---

#### User Story 4 - Handle Invalid State Transitions (Priority: P1)

As a user, I want the stopwatch to prevent invalid operations so that I don't accidentally break its functionality through incorrect state transitions.

**Why this priority**: Critical for maintaining application stability and preventing confusing behavior from invalid operations.

**Independent Test**: Can be fully tested by attempting invalid operations (lap before start, stop twice) and verifying they are blocked, delivering robust error handling.

**Acceptance Scenarios**:

1. **Given** the stopwatch is idle (not running), **When** I attempt to record a lap, **Then** the lap operation is blocked and an inline error message appears near the Lap button: "Cannot lap before starting the stopwatch"
2. **Given** the stopwatch is stopped, **When** I attempt to stop again, **Then** the stop operation is blocked and an inline error message appears near the Stop button: "Stopwatch is already stopped"
3. **Given** an invalid state error is displayed, **When** the user fixes the issue (e.g., clicks Start before Lap, or clicks Start after Stop), **Then** the error message automatically disappears

---

### Temp Converter Feature

#### User Story 5 - Convert Celsius to Fahrenheit (Priority: P1)

As a user, I want to convert temperatures from Celsius to Fahrenheit so that I can understand temperatures in both scales.

**Why this priority**: Core functionality that enables temperature conversion, one of the two primary use cases.

**Independent Test**: Can be fully tested by entering a Celsius value, selecting C→F conversion, and verifying the correct Fahrenheit result appears, delivering conversion value.

**Acceptance Scenarios**:

1. **Given** I enter a numeric value (e.g., 0) in the input field and select C as source unit, **When** I select F as target unit, **Then** the converted value is calculated and displayed (32 for 0°C)
2. **Given** I enter 100 and select C→F conversion, **When** the conversion is calculated, **Then** the result is 212°F
3. **Given** the conversion is performed, **When** I view the result, **Then** it is displayed with proper rounding to 2 decimal places if needed

---

#### User Story 6 - Convert Fahrenheit to Celsius (Priority: P1)

As a user, I want to convert temperatures from Fahrenheit to Celsius so that I can convert temperatures in the other direction.

**Why this priority**: Core functionality that completes the bi-directional conversion requirement.

**Independent Test**: Can be fully tested by entering a Fahrenheit value, selecting F→C conversion, and verifying the correct Celsius result appears.

**Acceptance Scenarios**:

1. **Given** I enter a numeric value (e.g., 32) in the input field and select F as source unit, **When** I select C as target unit, **Then** the converted value is calculated and displayed (0 for 32°F)
2. **Given** I enter 212 and select F→C conversion, **When** the conversion is calculated, **Then** the result is 100°C
3. **Given** the conversion is performed, **When** I view the result, **Then** it is displayed with proper rounding

---

#### User Story 7 - Handle Invalid Input (Priority: P1)

As a user, I want the converter to validate my input so that I only see valid conversion results.

**Why this priority**: Critical for maintaining data integrity and providing clear feedback for invalid operations.

**Independent Test**: Can be fully tested by entering non-numeric input and verifying an error message appears.

**Acceptance Scenarios**:

1. **Given** I enter non-numeric characters (e.g., "abc") in the input field, **When** I leave the field or attempt to convert, **Then** an inline error message appears near the input: "Please enter a valid numeric value"
2. **Given** I enter an empty value, **When** I attempt to convert, **Then** the result field remains empty or shows "–"
3. **Given** an error state is active, **When** I clear the input and enter a valid number, **Then** the error message automatically disappears and conversion works normally

---

#### User Story 8 - Prevent Identical Unit Conversion (Priority: P1)

As a user, I want the converter to prevent selecting the same unit for both source and target so that I don't attempt meaningless conversions.

**Why this priority**: Essential validation to prevent user confusion and invalid operations (e.g., C→C).

**Independent Test**: Can be fully tested by selecting the same unit for both source and target and verifying an error message appears.

**Acceptance Scenarios**:

1. **Given** I select C as the source unit and C as the target unit, **When** I attempt to convert, **Then** an inline error message appears: "Source and target units cannot be the same (e.g., C → C)"
2. **Given** I select F as both source and target, **When** I attempt to convert, **Then** the same error message appears
3. **Given** an identical-unit error is shown, **When** I change one of the units to be different, **Then** the error automatically disappears and conversion can proceed

---

#### User Story 9 - Handle Invalid Unit Selection (Priority: P2)

As a user, I want the converter to validate unit selections so that only valid units (C, F) are accepted.

**Why this priority**: Important for maintaining application stability and providing clear feedback for invalid selections.

**Independent Test**: Can be fully tested by attempting to use invalid units and verifying error handling.

**Acceptance Scenarios**:

1. **Given** the UI provides unit dropdowns, **When** I view the available options, **Then** only valid units (Celsius, Fahrenheit) are displayed
2. **Given** a unit is selected, **When** the unit is applied, **Then** the system recognizes it as valid or shows an error if invalid

---

### Edge Cases (Combined for Both Features)

#### Stopwatch Edge Cases:

- What happens when the user rapidly clicks Lap multiple times? → Multiple laps are recorded in sequence without interference
- What happens if the stopwatch runs for 99:59.99 (near maximum)? → The display caps at MM:SS:MS format; advancing beyond 99:59 is prevented or wraps to 00:00:00 per implementation choice
- What happens if Stop is clicked while a Lap operation is pending? → One operation completes before the other begins; no race conditions
- What happens if the browser is refreshed while stopwatch is running? → State is NOT persisted (stopwatch resets) per Week 2 design intent
- What happens when more than 50 laps have been recorded? → The lap list uses virtual scrolling to maintain performance while displaying all recorded laps

#### Temp Converter Edge Cases:

- What happens if the user enters a very large number (e.g., 10000°C)? → The conversion is performed and displayed; no range limits imposed
- What happens if the user enters negative temperatures? → Negative values are converted correctly (e.g., -40°C = -40°F)
- What happens if the user enters decimal input (e.g., 98.6)? → The input is accepted and the result is properly rounded to 2 decimal places
- What happens if the user rapidly changes unit selections? → The last selection is used for conversion; no race conditions
- What happens if the user begins typing while an error is displayed? → If validation is on-blur, error remains until field loses focus; if validation is on-submit, error remains until corrected and converted again

---

## Requirements *(mandatory)*

### Functional Requirements

#### Stopwatch UI Requirements:

- **FR-001**: System MUST import all business logic from `apps/stopwatch/core/`
- **FR-002**: System MUST provide UI controls for Start, Lap, Stop, and Reset operations
- **FR-003**: System MUST display the current elapsed time in MM:SS:MS format (2-digit milliseconds) with maximum of 99:59.99
- **FR-004**: System MUST display a list of all recorded lap times with both interval and cumulative time (format: "Lap N: X.XXs (total: Y.YYs)"); use virtual scrolling if list exceeds 50 laps
- **FR-005**: System MUST prevent lap operations when stopwatch is not running and display inline error near Lap button: "Cannot lap before starting the stopwatch"; error auto-dismisses when user starts stopwatch
- **FR-006**: System MUST prevent stop operations when stopwatch is already stopped and display inline error near Stop button: "Stopwatch is already stopped"; error auto-dismisses when user clicks Start
- **FR-007**: System MUST handle rapid consecutive operations without race conditions
- **FR-008**: All UI controls MUST be keyboard navigable with visible focus states
- **FR-009**: System MUST implement ARIA labels for all interactive elements for screen reader support

#### Temp Converter UI Requirements:

- **FR-010**: System MUST import all business logic from `apps/temp/core/`
- **FR-011**: System MUST provide a numeric input field for temperature values
- **FR-012**: System MUST provide two dropdown menus for source and target unit selection (Celsius, Fahrenheit)
- **FR-013**: System MUST display the converted temperature result with proper rounding to 2 decimal places
- **FR-014**: System MUST validate that input is numeric; validate on-blur (when field loses focus) and on-submit (when attempting conversion); display inline error near input: "Please enter a valid numeric value"; error auto-dismisses when user enters valid number
- **FR-015**: System MUST prevent identical unit conversion (C→C or F→F) and display inline error: "Source and target units cannot be the same"; error auto-dismisses when user changes one unit
- **FR-016**: System MUST validate that source and target units are valid (C or F) and show error: "Invalid unit" if violated
- **FR-017**: System MUST handle negative temperature values correctly
- **FR-018**: System MUST handle decimal input (e.g., 98.6) and properly round the result to 2 decimal places
- **FR-019**: All UI controls MUST be keyboard navigable with visible focus states
- **FR-020**: System MUST implement ARIA labels for all input fields and buttons for screen reader support

### Key Entities

#### Stopwatch Entity:

- **Stopwatch State**: Represents the current state of the stopwatch (idle, running, stopped) with elapsed time and lap times
  - Attributes: `elapsedTime` (milliseconds), `lapTimes` (array of {interval, cumulative} pairs), `status` (idle|running|stopped)
  - Relationship: Directly calls core logic from `apps/stopwatch/core/`
  - Constraints: `elapsedTime` capped at 99:59.99 (MM:SS:MS); `lapTimes` array supports unlimited entries with virtual scrolling for display

#### Temp Converter Entity:

- **Temperature Conversion**: Represents the conversion operation with source/target values and units
  - Attributes: `inputValue` (numeric), `sourceUnit` (C|F), `targetUnit` (C|F), `result` (numeric|null), `error` (string|null)
  - Relationship: Directly calls core logic from `apps/temp/core/`
  - Constraints: `inputValue` accepts negative and decimal values; `sourceUnit` and `targetUnit` must be different; `result` rounded to 2 decimal places

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

#### Stopwatch Success Criteria:

- **SC-001**: Users can start the stopwatch and see elapsed time updating in real-time in MM:SS:MS format
- **SC-002**: Users can record multiple laps and view all recorded lap times with both interval and cumulative time
- **SC-003**: Users can stop and reset the stopwatch to clear all data
- **SC-004**: Invalid state transitions are blocked with inline error messages appearing to the user within 1 second and auto-dismissing when issue is fixed
- **SC-005**: 100% of stopwatch controls (Start, Lap, Stop, Reset) are keyboard accessible and have visible focus states
- **SC-006**: Component test coverage for Stopwatch UI is ≥50% statement coverage

#### Temp Converter Success Criteria:

- **SC-007**: Users can perform C→F conversions with correct results (e.g., 0°C = 32°F)
- **SC-008**: Users can perform F→C conversions with correct results (e.g., 32°F = 0°C)
- **SC-009**: Invalid input (non-numeric) is caught on blur and on submit, with inline error message appearing within 1 second and auto-dismissing when fixed
- **SC-010**: Identical unit selection (C→C or F→F) is prevented with inline error message that auto-dismisses on unit change
- **SC-011**: 100% of temp converter controls (input, selects) are keyboard accessible and have visible focus states
- **SC-012**: Component test coverage for Temp Converter UI is ≥50% statement coverage

#### Testing Success Criteria:

- **SC-013**: Vitest/RTL tests for Stopwatch UI verify: stop-twice error, lap-before-start blocked, golden text display in MM:SS:MS format, virtual scrolling with >50 laps
- **SC-014**: Vitest/RTL tests for Temp Converter UI verify: correct conversion (C→F, F→C), identical-unit error, invalid-unit error, non-numeric input error, on-blur and on-submit validation
- **SC-015**: Playwright smoke tests for both UIs are implemented and passing
- **SC-016**: Both Spec-Kits are created (spec.md, test-matrix.csv, ux-checklist.md) for Stopwatch and Temp
- **SC-017**: PR is submitted to branch 004-stopwatch-temp-ui with LIN-SW and LIN-TEMP references

---

## Assumptions

- State persistence is NOT required; both applications reset on page refresh per Week 2 design
- Core logic modules (`apps/stopwatch/core/` and `apps/temp/core/`) are available and functional from Week 2
- Error messages are displayed inline in the UI; no modal dialogs required
- Errors auto-dismiss when the user fixes the underlying issue (e.g., starts stopwatch, enters valid input, changes unit)
- Keyboard navigation should follow standard web accessibility patterns (Tab, Enter, Arrow keys)
- Mobile responsiveness is optional; desktop-first design is acceptable
- No external API calls required; all logic is self-contained

---

## Open Questions / [NEEDS CLARIFICATION]

All critical ambiguities have been resolved in the Clarifications section above. No outstanding clarifications remain.
