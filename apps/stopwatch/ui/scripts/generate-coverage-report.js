#!/usr/bin/env node
/**
 * Coverage Report Generator Script for Stopwatch UI
 * 
 * This script generates a Vitest coverage report and creates a summary document.
 * 
 * Usage:
 *   node scripts/generate-coverage-report.js
 * 
 * Prerequisites:
 *   - npm run test:coverage must work
 *   - @vitest/coverage-v8 must be installed
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const COVERAGE_DIR = './coverage';
const COVERAGE_JSON = join(COVERAGE_DIR, 'coverage-final.json');
const SUMMARY_FILE = './COVERAGE_SUMMARY.md';

function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  try {
    // Check if coverage directory exists
    if (!existsSync(COVERAGE_DIR)) {
      console.log('📁 Coverage directory does not exist. Generating coverage report...');
      return false;
    }
    
    // Check if coverage JSON exists
    if (!existsSync(COVERAGE_JSON)) {
      console.log('📊 Coverage JSON not found. Generating coverage report...');
      return false;
    }
    
    console.log('✅ Coverage data found.');
    return true;
  } catch (error) {
    console.error('❌ Error checking prerequisites:', error);
    return false;
  }
}

function generateCoverage() {
  console.log('📊 Generating coverage report...');
  
  try {
    execSync('npm run test:coverage -- --run', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    console.log('✅ Coverage report generated successfully.');
    return true;
  } catch (error) {
    console.error('❌ Error generating coverage report:', error);
    console.log('\n💡 Tip: Ensure @vitest/coverage-v8 is installed and versions match.');
    return false;
  }
}

function parseCoverageData() {
  console.log('📖 Parsing coverage data...');
  
  try {
    const coverageData = JSON.parse(readFileSync(COVERAGE_JSON, 'utf-8'));
    
    let totalStatements = 0;
    let coveredStatements = 0;
    let totalBranches = 0;
    let coveredBranches = 0;
    let totalFunctions = 0;
    let coveredFunctions = 0;
    let totalLines = 0;
    let coveredLines = 0;
    
    const fileCoverage = [];
    
    for (const [file, coverage] of Object.entries(coverageData)) {
      /** @type {any} */
      const fileData = coverage;
      
      const statements = fileData.s || {};
      const branches = fileData.b || {};
      const functions = fileData.f || {};
      const lines = fileData.statementMap || {};
      
      const fileStatements = Object.keys(statements).length;
      const fileCoveredStatements = Object.values(statements).filter((v) => v > 0).length;
      
      const fileBranches = Object.keys(branches).length;
      const fileCoveredBranches = Object.values(branches).filter((v) => Array.isArray(v) && v.some((b) => b > 0)).length;
      
      const fileFunctions = Object.keys(functions).length;
      const fileCoveredFunctions = Object.values(functions).filter((v) => v > 0).length;
      
      const fileLines = Object.keys(lines).length;
      const fileCoveredLines = Object.values(statements).filter((v) => v > 0).length;
      
      totalStatements += fileStatements;
      coveredStatements += fileCoveredStatements;
      totalBranches += fileBranches;
      coveredBranches += fileCoveredBranches;
      totalFunctions += fileFunctions;
      coveredFunctions += fileCoveredFunctions;
      totalLines += fileLines;
      coveredLines += fileCoveredLines;
      
      if (fileStatements > 0) {
        const statementPercent = (fileCoveredStatements / fileStatements) * 100;
        const branchPercent = fileBranches > 0 ? (fileCoveredBranches / fileBranches) * 100 : 100;
        const functionPercent = fileFunctions > 0 ? (fileCoveredFunctions / fileFunctions) * 100 : 100;
        const linePercent = fileLines > 0 ? (fileCoveredLines / fileLines) * 100 : 100;
        
        fileCoverage.push({
          file: file.replace(process.cwd(), '.').replace(/\\/g, '/'),
          statements: statementPercent.toFixed(1),
          branches: branchPercent.toFixed(1),
          functions: functionPercent.toFixed(1),
          lines: linePercent.toFixed(1),
        });
      }
    }
    
    const overallStatements = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0;
    const overallBranches = totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0;
    const overallFunctions = totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0;
    const overallLines = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;
    
    return {
      overall: {
        statements: overallStatements.toFixed(1),
        branches: overallBranches.toFixed(1),
        functions: overallFunctions.toFixed(1),
        lines: overallLines.toFixed(1),
      },
      files: fileCoverage.sort((a, b) => parseFloat(b.statements) - parseFloat(a.statements)),
    };
  } catch (error) {
    console.error('❌ Error parsing coverage data:', error);
    return null;
  }
}

/**
 * @param {any} coverageData
 */
function generateSummary(coverageData) {
  console.log('📝 Generating coverage summary...');
  
  const summary = `# Stopwatch UI - Coverage Summary

**Generated**: ${new Date().toISOString()}  
**Target**: ≥50% statement coverage

## Overall Coverage

| Metric | Coverage | Target | Status |
|--------|----------|--------|--------|
| Statements | ${coverageData.overall.statements}% | ≥50% | ${parseFloat(coverageData.overall.statements) >= 50 ? '✅' : '❌'} |
| Branches | ${coverageData.overall.branches}% | ≥50% | ${parseFloat(coverageData.overall.branches) >= 50 ? '✅' : '❌'} |
| Functions | ${coverageData.overall.functions}% | ≥50% | ${parseFloat(coverageData.overall.functions) >= 50 ? '✅' : '❌'} |
| Lines | ${coverageData.overall.lines}% | ≥50% | ${parseFloat(coverageData.overall.lines) >= 50 ? '✅' : '❌'} |

## File-by-File Coverage

| File | Statements | Branches | Functions | Lines |
|------|------------|----------|-----------|-------|
${coverageData.files.map((f) => 
  `| ${f.file} | ${f.statements}% | ${f.branches}% | ${f.functions}% | ${f.lines}% |`
).join('\n')}

## Coverage Report Location

- **HTML Report**: \`coverage/index.html\` (open in browser)
- **JSON Report**: \`coverage/coverage-final.json\`
- **LCOV Report**: \`coverage/lcov.info\`

## Next Steps

${parseFloat(coverageData.overall.statements) < 50 
  ? `⚠️ Statement coverage is below 50% target. Review files with low coverage and add tests.`
  : '✅ Statement coverage meets target. Continue maintaining test coverage.'}
`;

  writeFileSync(SUMMARY_FILE, summary, 'utf-8');
  console.log(`✅ Coverage summary written to ${SUMMARY_FILE}`);
}

function main() {
  console.log('🚀 Starting coverage report generation...\n');
  
  // Check if coverage already exists
  if (!checkPrerequisites()) {
    // Generate coverage
    if (!generateCoverage()) {
      console.error('\n❌ Failed to generate coverage report.');
      process.exit(1);
    }
  }
  
  // Parse coverage data
  const coverageData = parseCoverageData();
  if (!coverageData) {
    console.error('\n❌ Failed to parse coverage data.');
    process.exit(1);
  }
  
  // Generate summary
  generateSummary(coverageData);
  
  console.log('\n✅ Coverage report generation complete!');
  console.log(`📊 View HTML report: open coverage/index.html`);
  console.log(`📝 View summary: cat ${SUMMARY_FILE}`);
}

main();

