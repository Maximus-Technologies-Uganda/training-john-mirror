/**
 * ConversionResult Component
 * 
 * Displays the temperature conversion result with proper formatting.
 * Shows results rounded to 2 decimal places with unit symbol.
 * 
 * Features:
 * - 2-decimal rounding precision
 * - Live region (ARIA role="status") for screen reader announcements
 * - Loading state support
 * - Empty state with placeholder
 * - Responsive layout with clear typography
 */

import React from 'react';

export interface ConversionResultProps {
  /** The converted temperature value */
  value: number | null | undefined;
  
  /** Source temperature unit */
  sourceUnit: 'C' | 'F';
  
  /** Target temperature unit */
  targetUnit: 'C' | 'F';
  
  /** Whether the result is loading */
  isLoading?: boolean;
  
  /** Optional CSS class for styling */
  className?: string;
}

/**
 * FormatTemperature
 * 
 * Formats a temperature value to 2 decimal places with unit symbol.
 * 
 * @param value - The temperature value to format
 * @param unit - The temperature unit (C or F)
 * @returns Formatted temperature string with unit symbol
 */
function formatTemperature(value: number, unit: 'C' | 'F'): string {
  const rounded = Math.round(value * 100) / 100;
  const unitSymbol = unit === 'C' ? '°C' : '°F';
  return `${rounded.toFixed(2)}${unitSymbol}`;
}

/**
 * ConversionResult Component
 * 
 * Displays the converted temperature value in a live region so that
 * screen readers announce changes automatically. Results are formatted
 * to exactly 2 decimal places (e.g., 32.00, 77.50, 212.37).
 * 
 * States:
 * - Loading: Shows "Calculating..." with spinner animation
 * - Empty: Shows "–" placeholder when no value provided
 * - Result: Shows formatted value with unit symbol
 * 
 * Keyboard Accessible:
 * - Full keyboard navigation support
 * - Result announced automatically via live region
 * - No interactive elements (display only)
 * 
 * @example
 * const [result, setResult] = useState(32);
 * 
 * return (
 *   <ConversionResult
 *     value={result}
 *     sourceUnit="C"
 *     targetUnit="F"
 *     isLoading={false}
 *   />
 * );
 */
export const ConversionResult: React.FC<ConversionResultProps> = ({
  value,
  sourceUnit,
  targetUnit,
  isLoading = false,
  className = '',
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '24px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    minHeight: '100px',
    justifyContent: 'center',
  };

  const resultTextStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: '700',
    color: '#1976D2',
    margin: '0',
    fontVariantNumeric: 'tabular-nums',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    margin: '0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const spinnerStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    border: '3px solid #e0e0e0',
    borderTop: '3px solid #1976D2',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  // Add CSS animation for spinner
  const styleSheet = document.styleSheets[0];
  if (styleSheet && !document.getElementById('spinner-animation')) {
    const style = document.createElement('style');
    style.id = 'spinner-animation';
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Render loading state
  if (isLoading) {
    return (
      <div
        data-testid="conversion-result"
        data-loading="true"
        className={`conversion-result conversion-result--loading ${className}`}
        style={containerStyle}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Conversion result"
        aria-description="The temperature conversion is being calculated"
      >
        <div style={spinnerStyle} />
        <p style={labelStyle}>Calculating...</p>
      </div>
    );
  }

  // Render empty state
  if (value === null || value === undefined || isNaN(value)) {
    return (
      <div
        data-testid="conversion-result"
        className={`conversion-result conversion-result--empty ${className}`}
        style={containerStyle}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Conversion result"
        aria-description="No conversion result available. Enter a value to convert."
      >
        <p style={resultTextStyle}>–</p>
        <p style={labelStyle}>Enter a value to convert</p>
      </div>
    );
  }

  // Format and display result
  const formattedValue = formatTemperature(value, targetUnit);
  const conversionDirection = `${sourceUnit}→${targetUnit}`;
  const ariaLabel = `Conversion result: ${formattedValue} when converting from ${sourceUnit} to ${targetUnit}`;

  return (
    <div
      data-testid="conversion-result"
      className={`conversion-result conversion-result--result ${className}`}
      style={containerStyle}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Conversion result"
      aria-description={ariaLabel}
    >
      <p style={resultTextStyle}>{formattedValue}</p>
      <p style={labelStyle}>{conversionDirection} Conversion</p>
    </div>
  );
};

ConversionResult.displayName = 'ConversionResult';

