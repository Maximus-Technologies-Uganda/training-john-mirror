function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === 'C' && toUnit === 'F') {
      // Celsius to Fahrenheit formula: (C * 9/5) + 32
      return (value * 9/5) + 32;
    } else if (fromUnit === 'F' && toUnit === 'C') {
      // Fahrenheit to Celsius formula: (F - 32) * 5/9
      return (value - 32) * 5/9;
    }
  }
  
  // Export the function so the test file can use it
  module.exports = { convertTemperature };