const { execSync } = require('child_process');

console.log('Running tests for hello.js...');

function runTest(command, expectedOutput) {
  try {
    const output = execSync(command).toString().trim();
    if (output === expectedOutput) {
      console.log(`✅ PASS: '${command}'`);
    } else {
      console.error(`❌ FAIL: '${command}'`);
      console.error(`  - Expected: "${expectedOutput}"`);
      console.error(`  - Actual:   "${output}"`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`❌ ERROR: Command failed: '${command}'`);
    process.exit(1);
  }
}

// Test cases
runTest('node src/hello.js', 'Hello, World!');
runTest('node src/hello.js Preston', 'Hello, Preston!');
runTest('node src/hello.js Preston --shout', 'HELLO, PRESTON!');