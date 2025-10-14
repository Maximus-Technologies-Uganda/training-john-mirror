const VALID_UNITS = new Set(['C', 'F']);

function formatNumber(value) {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }
  const asString = rounded.toFixed(2);
  if (!asString.includes('.')) {
    return asString;
  }
  const trimmed = asString.replace(/0+$/, '').replace(/\.$/, '');
  return trimmed.length > 0 ? trimmed : '0';
}

/**
 * Pure temperature conversion logic.
 * @param {{ value: number|string, from: string, to: string }} options
 * @returns {{ success: true, data: string } | { success: false, error: string }}
 */
export function convertTemperature(options = {}) {
  const { value, from, to } = options;

  if (from === undefined || to === undefined) {
    return {
      success: false,
      error: 'Both "from" and "to" units are required.'
    };
  }

  const fromUnit = String(from).trim().toUpperCase();
  const toUnit = String(to).trim().toUpperCase();

  if (!VALID_UNITS.has(fromUnit)) {
    return {
      success: false,
      error: `Unsupported from unit "${from}". Use C or F.`
    };
  }

  if (!VALID_UNITS.has(toUnit)) {
    return {
      success: false,
      error: `Unsupported to unit "${to}". Use C or F.`
    };
  }

  if (fromUnit === toUnit) {
    return {
      success: false,
      error: 'Conversion units must differ.'
    };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return {
      success: false,
      error: 'Value must be a valid number.'
    };
  }

  const numericValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numericValue)) {
    return {
      success: false,
      error: 'Value must be a valid number.'
    };
  }

  let converted;
  if (fromUnit === 'C' && toUnit === 'F') {
    converted = (numericValue * 9) / 5 + 32;
  } else {
    converted = (numericValue - 32) * 5 / 9;
  }

  const valueText = formatNumber(numericValue);
  const convertedText = formatNumber(converted);

  return {
    success: true,
    data: `${valueText} ${fromUnit} is ${convertedText} ${toUnit}`
  };
}
