const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running tests for stopwatch.js...');

const timeFile = path.join(__dirname, '../data/time.json');

function runTest(command, expectedOutput, description) {
  try {
    const output = execSync(command).toString().trim();
    if (output.includes(expectedOutput)) {
      console.log(`✅ PASS: ${description}`);
    } else {
      console.error(`❌ FAIL: ${description}`);
      console.error(`  - Expected to contain: "${expectedOutput}"`);
      console.error(`  - Actual output: "${output}"`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ ERROR: Command failed: '${command}'`);
    console.error(`  - Error: ${error.message}`);
    process.exit(1);
  }
}

function resetStopwatch() {
  try {
    // Reset the stopwatch state
    execSync('node src/stopwatch.js reset');
  } catch (error) {
    // Ignore errors during reset
  }
}

function checkTimeFile(expectedStartTime) {
  try {
    const content = fs.readFileSync(timeFile, 'utf8');
    const data = JSON.parse(content);
    if (data.startTime === expectedStartTime) {
      console.log(`✅ PASS: Time file state correct`);
    } else {
      console.error(`❌ FAIL: Time file state incorrect`);
      console.error(`  - Expected startTime: ${expectedStartTime}`);
      console.error(`  - Actual startTime: ${data.startTime}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ ERROR: Could not read time file: ${error.message}`);
    process.exit(1);
  }
}

// Test 1: Help/Usage message
console.log('\n--- Test 1: Help/Usage message ---');
runTest('node src/stopwatch.js', 'Usage: node stopwatch.js <command>', 'Shows usage message');

// Test 2: Reset stopwatch
console.log('\n--- Test 2: Reset stopwatch ---');
runTest('node src/stopwatch.js reset', 'Stopwatch reset', 'Reset command works');
checkTimeFile(null);

// Test 3: Start stopwatch
console.log('\n--- Test 3: Start stopwatch ---');
runTest('node src/stopwatch.js start', 'Stopwatch started at', 'Start command works');
// Check that startTime is not null (we can't predict the exact value)
try {
  const content = fs.readFileSync(timeFile, 'utf8');
  const data = JSON.parse(content);
  if (data.startTime !== null && typeof data.startTime === 'number') {
    console.log(`✅ PASS: Start time recorded in file`);
  } else {
    console.error(`❌ FAIL: Start time not recorded properly`);
    process.exit(1);
  }
} catch (error) {
  console.error(`❌ ERROR: Could not verify start time: ${error.message}`);
  process.exit(1);
}

// Test 4: Status when running
console.log('\n--- Test 4: Status when running ---');
runTest('node src/stopwatch.js status', 'Stopwatch is running', 'Status shows running');

// Test 5: Lap time
console.log('\n--- Test 5: Lap time ---');
runTest('node src/stopwatch.js lap', 'Lap time:', 'Lap command works');

// Test 6: Stop stopwatch
console.log('\n--- Test 6: Stop stopwatch ---');
runTest('node src/stopwatch.js stop', 'Stopwatch stopped', 'Stop command works');
checkTimeFile(null);

// Test 7: Status when stopped
console.log('\n--- Test 7: Status when stopped ---');
runTest('node src/stopwatch.js status', 'Stopwatch is not running', 'Status shows not running');

// Test 8: Error handling - lap without start
console.log('\n--- Test 8: Error handling - lap without start ---');
runTest('node src/stopwatch.js lap', 'Stopwatch has not been started', 'Lap without start shows error');

// Test 9: Error handling - stop without start
console.log('\n--- Test 9: Error handling - stop without start ---');
runTest('node src/stopwatch.js stop', 'Stopwatch has not been started', 'Stop without start shows error');

// Test 10: Invalid command
console.log('\n--- Test 10: Invalid command ---');
runTest('node src/stopwatch.js invalid', 'Usage: node stopwatch.js <command>', 'Invalid command shows usage');

console.log('\n🎉 All stopwatch tests passed!');
