const { convertTemperature } = require('./temp-converter.js');

console.log("Running comprehensive tests for temperature converter...");
console.log("Following TDD principles: Red → Green → Refactor\n");

// Test helper function
function runTest(testName, testFunction) {
    try {
        testFunction();
        console.log(`✅ PASS: ${testName}`);
    } catch (error) {
        console.error(`❌ FAIL: ${testName}`);
        console.error(`  Error: ${error.message}`);
        process.exit(1);
    }
}

// Test helper for equality assertions
function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}. Expected: ${expected}, Actual: ${actual}`);
    }
}

// Test helper for error assertions
function assertThrows(testFunction, expectedError, message) {
    try {
        testFunction();
        throw new Error(`${message}. Expected error but none was thrown`);
    } catch (error) {
        if (!error.message.includes(expectedError)) {
            throw new Error(`${message}. Expected error containing "${expectedError}", got "${error.message}"`);
        }
    }
}

console.log("=== BASIC CONVERSION TESTS ===");

// Test 1: Celsius to Fahrenheit - Basic conversion
runTest("0°C to Fahrenheit", () => {
    const result = convertTemperature(0, 'C', 'F');
    assertEqual(result, 32, "0°C should equal 32°F");
});

// Test 2: Fahrenheit to Celsius - Basic conversion
runTest("32°F to Celsius", () => {
    const result = convertTemperature(32, 'F', 'C');
    assertEqual(result, 0, "32°F should equal 0°C");
});

// Test 3: Celsius to Fahrenheit - Boiling point
runTest("100°C to Fahrenheit", () => {
    const result = convertTemperature(100, 'C', 'F');
    assertEqual(result, 212, "100°C should equal 212°F");
});

// Test 4: Fahrenheit to Celsius - Boiling point
runTest("212°F to Celsius", () => {
    const result = convertTemperature(212, 'F', 'C');
    assertEqual(result, 100, "212°F should equal 100°C");
});

console.log("\n=== EDGE CASE TESTS ===");

// Test 5: Negative temperatures
runTest("-40°C to Fahrenheit", () => {
    const result = convertTemperature(-40, 'C', 'F');
    assertEqual(result, -40, "-40°C should equal -40°F (special case)");
});

// Test 6: Decimal precision
runTest("37.5°C to Fahrenheit", () => {
    const result = convertTemperature(37.5, 'C', 'F');
    assertEqual(result, 99.5, "37.5°C should equal 99.5°F");
});

// Test 7: Same unit conversion
runTest("25°C to Celsius", () => {
    const result = convertTemperature(25, 'C', 'C');
    assertEqual(result, 25, "25°C to C should remain 25°C");
});

// Test 8: Case insensitive units
runTest("Case insensitive: 0°c to f", () => {
    const result = convertTemperature(0, 'c', 'f');
    assertEqual(result, 32, "Case insensitive conversion should work");
});

console.log("\n=== ERROR HANDLING TESTS ===");

// Test 9: Invalid value type
runTest("Invalid value type", () => {
    assertThrows(
        () => convertTemperature("not a number", 'C', 'F'),
        "Value must be a valid number",
        "Should throw error for non-numeric value"
    );
});

// Test 10: Missing fromUnit
runTest("Missing fromUnit", () => {
    assertThrows(
        () => convertTemperature(0, null, 'F'),
        "Both fromUnit and toUnit must be specified",
        "Should throw error for missing fromUnit"
    );
});

// Test 11: Missing toUnit
runTest("Missing toUnit", () => {
    assertThrows(
        () => convertTemperature(0, 'C', null),
        "Both fromUnit and toUnit must be specified",
        "Should throw error for missing toUnit"
    );
});

// Test 12: Unsupported conversion
runTest("Unsupported conversion", () => {
    assertThrows(
        () => convertTemperature(0, 'C', 'K'),
        "Conversion from C to K is not supported",
        "Should throw error for unsupported unit conversion"
    );
});

// Test 13: NaN value
runTest("NaN value", () => {
    assertThrows(
        () => convertTemperature(NaN, 'C', 'F'),
        "Value must be a valid number",
        "Should throw error for NaN value"
    );
});

console.log("\n=== PRECISION TESTS ===");

// Test 14: Precision handling
runTest("Precision: 33.333°C to Fahrenheit", () => {
    const result = convertTemperature(33.333, 'C', 'F');
    // Should round to 2 decimal places
    assertEqual(result, 92, "Should round to 2 decimal places");
});

// Test 15: Precision: 92°F to Celsius
runTest("Precision: 92°F to Celsius", () => {
    const result = convertTemperature(92, 'F', 'C');
    // Should round to 2 decimal places
    assertEqual(result, 33.33, "Should round to 2 decimal places");
});

console.log("\n=== COMPREHENSIVE CONVERSION TESTS ===");

// Test 16: Room temperature
runTest("Room temperature: 20°C to Fahrenheit", () => {
    const result = convertTemperature(20, 'C', 'F');
    assertEqual(result, 68, "Room temperature conversion");
});

// Test 17: Body temperature
runTest("Body temperature: 98.6°F to Celsius", () => {
    const result = convertTemperature(98.6, 'F', 'C');
    assertEqual(result, 37, "Body temperature conversion");
});

// Test 18: Freezing point
runTest("Freezing point: 0°F to Celsius", () => {
    const result = convertTemperature(0, 'F', 'C');
    assertEqual(result, -17.78, "Freezing point conversion");
});

console.log("\n🎉 All temperature converter tests passed!");
console.log("✅ TDD workflow successfully demonstrated:");
console.log("   - Red: Tests written first to define requirements");
console.log("   - Green: Implementation written to make tests pass");
console.log("   - Refactor: Code improved while maintaining test coverage");
console.log("✅ Modular programming: Clean separation of implementation and testing");
console.log("✅ Comprehensive error handling and edge case coverage");