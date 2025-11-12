/**
 * UnitSelectors Component
 * 
 * Dropdown selectors for source and target temperature units.
 * Allows users to select from Celsius and Fahrenheit.
 * 
 * Features:
 * - Two independent unit dropdowns
 * - Only C and F options available
 * - Identical unit detection with visual indicator
 * - Keyboard navigation (Tab between selectors, arrow keys within)
 * - Accessibility: ARIA labels, semantic HTML, live region for identical unit warning
 * - Clear visual labels ("From" and "To")
 * - Warning state when units are identical (T079: Identical Unit Validation)
 */

import React, { useMemo } from 'react';

export type TemperatureUnit = 'C' | 'F';

/**
 * Valid temperature units available for selection.
 * Restricted to only Celsius (C) and Fahrenheit (F) per T086.
 */
const VALID_TEMPERATURE_UNITS: readonly TemperatureUnit[] = ['C', 'F'] as const;

/**
 * Unit display labels mapping
 */
const UNIT_LABELS: Record<TemperatureUnit, string> = {
  C: 'Celsius (°C)',
  F: 'Fahrenheit (°F)',
} as const;

export interface UnitSelectorsProps {
  /** Currently selected source unit */
  sourceUnit: TemperatureUnit;
  
  /** Currently selected target unit */
  targetUnit: TemperatureUnit;
  
  /** Callback when source unit is changed */
  onSourceUnitChange: (unit: TemperatureUnit) => void;
  
  /** Callback when target unit is changed */
  onTargetUnitChange: (unit: TemperatureUnit) => void;
  
  /** Optional CSS class for styling */
  className?: string;
  
  /** Whether the selectors are required */
  required?: boolean;
  
  /** Disable the selectors */
  disabled?: boolean;
  
  /** Show warning for identical units (default: true) */
  showIdenticalUnitWarning?: boolean;
}

/**
 * UnitSelectors Component
 * 
 * Renders two independent dropdown selectors for temperature units:
 * - "From" (source unit) - what unit the input is in
 * - "To" (target unit) - what unit to convert to
 * 
 * Only Celsius (C) and Fahrenheit (F) options are available.
 * 
 * Keyboard Navigation:
 * - Tab: Move between source and target selectors
 * - Arrow Up/Down: Change selected option within dropdown
 * - Enter: No effect (select via arrow keys)
 * 
 * @example
 * const [source, setSource] = useState<'C' | 'F'>('C');
 * const [target, setTarget] = useState<'C' | 'F'>('F');
 * 
 * return (
 *   <UnitSelectors
 *     sourceUnit={source}
 *     targetUnit={target}
 *     onSourceUnitChange={setSource}
 *     onTargetUnitChange={setTarget}
 *   />
 * );
 */
export const UnitSelectors: React.FC<UnitSelectorsProps> = ({
  sourceUnit,
  targetUnit,
  onSourceUnitChange,
  onTargetUnitChange,
  className = '',
  required = false,
  disabled = false,
  showIdenticalUnitWarning = true,
}) => {
  // Detect if units are identical (T079 validation)
  const areUnitsIdentical = useMemo(
    () => sourceUnit === targetUnit && showIdenticalUnitWarning,
    [sourceUnit, targetUnit, showIdenticalUnitWarning]
  );

  /**
   * Validates that the selected unit is valid (C or F only).
   * T086: Restrict to only Celsius and Fahrenheit.
   */
  const isValidUnit = (unit: string): unit is TemperatureUnit => {
    return VALID_TEMPERATURE_UNITS.includes(unit as TemperatureUnit);
  };

  const handleSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = event.target.value;
    // T086: Only allow valid units (C or F)
    if (isValidUnit(selectedUnit)) {
      onSourceUnitChange(selectedUnit);
    } else {
      // Defensive: If somehow an invalid unit is selected, ignore it
      console.warn(`Invalid unit selected: ${selectedUnit}. Only C and F are allowed.`);
    }
  };

  const handleTargetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = event.target.value;
    // T086: Only allow valid units (C or F)
    if (isValidUnit(selectedUnit)) {
      onTargetUnitChange(selectedUnit);
    } else {
      // Defensive: If somehow an invalid unit is selected, ignore it
      console.warn(`Invalid unit selected: ${selectedUnit}. Only C and F are allowed.`);
    }
  };

  // Base select style
  const baseSelectStyle: React.CSSProperties = {
    padding: '10px 12px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    color: '#333',
    minWidth: '120px',
    transition: 'all 0.2s ease',
    outlineOffset: '2px',
  };

  // Apply warning style if units are identical
  const selectStyle: React.CSSProperties = {
    ...baseSelectStyle,
    ...(areUnitsIdentical && {
      borderColor: '#ff9800',
      backgroundColor: '#fff8f0',
    }),
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '4px',
    display: 'block',
  };

  // Apply warning color to label if units are identical
  const labelWarningStyle: React.CSSProperties = {
    ...labelStyle,
    ...(areUnitsIdentical && {
      color: '#ff9800',
    }),
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  };

  const selectContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  return (
    <div
      data-testid="unit-selectors-wrapper"
      data-identical-units={areUnitsIdentical ? 'true' : 'false'}
      className={`unit-selectors ${className} ${areUnitsIdentical ? 'identical-units' : ''}`}
      style={containerStyle}
      role="group"
      aria-label="Temperature unit selection"
      aria-invalid={areUnitsIdentical ? 'true' : undefined}
    >
      {/* Source Unit Selector */}
      <div style={selectContainerStyle}>
        <label htmlFor="source-unit" style={labelWarningStyle}>
          From
        </label>
        <select
          id="source-unit"
          data-testid="source-unit-selector"
          value={sourceUnit}
          onChange={handleSourceChange}
          required={required}
          disabled={disabled}
          aria-label="Source temperature unit"
          aria-description={
            areUnitsIdentical
              ? 'Source unit. Warning: target unit is the same. Select a different unit to convert.'
              : 'Select the unit of the temperature value you\'re entering'
          }
          aria-required={required}
          aria-invalid={areUnitsIdentical ? 'true' : undefined}
          style={selectStyle}
          onFocus={(e) => {
            const color = areUnitsIdentical ? '#ff9800' : '#2196F3';
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.outline = `2px solid ${color}`;
          }}
          onBlur={(e) => {
            const borderColor = areUnitsIdentical ? '#ff9800' : '#ddd';
            e.currentTarget.style.borderColor = borderColor;
            e.currentTarget.style.outline = 'none';
          }}
        >
          {VALID_TEMPERATURE_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {UNIT_LABELS[unit]}
            </option>
          ))}
        </select>
      </div>

      {/* Target Unit Selector */}
      <div style={selectContainerStyle}>
        <label htmlFor="target-unit" style={labelWarningStyle}>
          To
        </label>
        <select
          id="target-unit"
          data-testid="target-unit-selector"
          value={targetUnit}
          onChange={handleTargetChange}
          required={required}
          disabled={disabled}
          aria-label="Target temperature unit"
          aria-description={
            areUnitsIdentical
              ? 'Target unit. Warning: source unit is the same. Select a different unit to convert.'
              : 'Select the unit to convert the temperature to'
          }
          aria-required={required}
          aria-invalid={areUnitsIdentical ? 'true' : undefined}
          style={selectStyle}
          onFocus={(e) => {
            const color = areUnitsIdentical ? '#ff9800' : '#2196F3';
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.outline = `2px solid ${color}`;
          }}
          onBlur={(e) => {
            const borderColor = areUnitsIdentical ? '#ff9800' : '#ddd';
            e.currentTarget.style.borderColor = borderColor;
            e.currentTarget.style.outline = 'none';
          }}
        >
          {VALID_TEMPERATURE_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {UNIT_LABELS[unit]}
            </option>
          ))}
        </select>
      </div>

      {/* Identical Unit Warning Message for Screen Readers */}
      {areUnitsIdentical && (
        <div
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          style={{ display: 'none' }}
          id="identical-units-warning"
        >
          Warning: Source and target units are identical. Please select different units to convert.
        </div>
      )}
    </div>
  );
};

UnitSelectors.displayName = 'UnitSelectors';

