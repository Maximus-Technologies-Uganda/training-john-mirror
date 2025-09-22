const { convertTemperature } = require('./temp-converter.js');

console.log("Running tests for temperature converter...");

// Test Case 1: Should convert 0°C to 32°F
let result = convertTemperature(0, 'C', 'F');
console.assert(result === 32, "Test Failed: 0°C should be 32°F");
// Test Case 2: Should convert 32°F to 0°C
result = convertTemperature(32, 'F', 'C');
console.assert(result === 0, "Test Failed: 32°F should be 0°C");
console.log("✅ All temperature tests passed!");