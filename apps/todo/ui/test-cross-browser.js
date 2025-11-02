#!/usr/bin/env node

/**
 * Cross-Browser Compatibility Test Runner
 * This script runs cross-browser compatibility tests manually
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const browsers = ['chromium', 'firefox', 'webkit']
const mobileBrowsers = ['Mobile Chrome', 'Mobile Safari']

console.log('🧪 Running Cross-Browser Compatibility Tests\n')

// Check if dev server is running
function checkDevServer() {
  try {
    const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173', { encoding: 'utf8' })
    return result.trim() === '200'
  } catch (error) {
    return false
  }
}

// Start dev server if not running
function startDevServer() {
  console.log('🚀 Starting development server...')
  try {
    execSync('npm run dev', { stdio: 'inherit', timeout: 30000 })
  } catch (error) {
    console.log('⚠️ Dev server may already be running or failed to start')
  }
}

// Run tests for specific browser
function runBrowserTest(browser) {
  console.log(`\n🌐 Testing ${browser}...`)

  try {
    const command = `npx playwright test cross-browser-compatibility.spec.js --project="${browser}" --timeout=60000`
    execSync(command, { stdio: 'inherit' })
    console.log(`✅ ${browser} tests passed`)
    return true
  } catch (error) {
    console.log(`❌ ${browser} tests failed`)
    return false
  }
}

// Main test runner
async function runCompatibilityTests() {
  const results = {
    desktop: {},
    mobile: {},
    summary: { passed: 0, failed: 0, total: 0 }
  }

  // Check if dev server is running
  if (!checkDevServer()) {
    console.log('📡 Development server not detected, starting...')
    startDevServer()

    // Wait for server to start
    console.log('⏳ Waiting for server to be ready...')
    await new Promise(resolve => setTimeout(resolve, 5000))

    if (!checkDevServer()) {
      console.log('❌ Failed to start development server')
      process.exit(1)
    }
  }

  console.log('✅ Development server is running')

  // Run desktop browser tests
  console.log('\n💻 Running Desktop Browser Tests...')
  for (const browser of browsers) {
    results.desktop[browser] = runBrowserTest(browser)
    results.summary.total++
    if (results.desktop[browser]) {
      results.summary.passed++
    } else {
      results.summary.failed++
    }
  }

  // Run mobile browser tests
  console.log('\n📱 Running Mobile Browser Tests...')
  for (const browser of mobileBrowsers) {
    results.mobile[browser] = runBrowserTest(browser)
    results.summary.total++
    if (results.mobile[browser]) {
      results.summary.passed++
    } else {
      results.summary.failed++
    }
  }

  // Print summary
  console.log('\n📊 Cross-Browser Compatibility Test Results:')
  console.log('=' .repeat(50))

  console.log('\nDesktop Browsers:')
  Object.entries(results.desktop).forEach(([browser, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${browser}`)
  })

  console.log('\nMobile Browsers:')
  Object.entries(results.mobile).forEach(([browser, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${browser}`)
  })

  console.log('\nSummary:')
  console.log(`  Total Tests: ${results.summary.total}`)
  console.log(`  Passed: ${results.summary.passed}`)
  console.log(`  Failed: ${results.summary.failed}`)
  console.log(`  Success Rate: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%`)

  if (results.summary.failed === 0) {
    console.log('\n🎉 All cross-browser compatibility tests passed!')
    process.exit(0)
  } else {
    console.log('\n⚠️ Some cross-browser compatibility tests failed.')
    console.log('Check the Playwright report for details: npx playwright show-report')
    process.exit(1)
  }
}

// Run the tests
runCompatibilityTests().catch(error => {
  console.error('❌ Error running compatibility tests:', error)
  process.exit(1)
})
