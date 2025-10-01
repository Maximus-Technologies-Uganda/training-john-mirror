#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Local Review Packet Generator
 * Simulates the GitHub Actions review packet workflow locally
 */

function runGitCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', cwd: process.cwd() }).trim();
  } catch (error) {
    console.warn(`Warning: ${command} failed:`, error.message);
    return null;
  }
}

function getGitStats() {
  const stats = {
    currentBranch: runGitCommand('git branch --show-current'),
    lastCommit: runGitCommand('git log -1 --pretty=format:"%H %s"'),
    totalCommits: runGitCommand('git rev-list --count HEAD'),
    changedFiles: runGitCommand('git diff --name-only HEAD~1 HEAD'),
    addedLines: 0,
    deletedLines: 0,
    modifiedFiles: []
  };

  // Get diff stats
  try {
    const diffStats = runGitCommand('git diff --stat HEAD~1 HEAD');
    if (diffStats) {
      const lines = diffStats.split('\n');
      const lastLine = lines[lines.length - 1];
      if (lastLine.includes('insertions') && lastLine.includes('deletions')) {
        const match = lastLine.match(/(\d+) insertions?.*?(\d+) deletions?/);
        if (match) {
          stats.addedLines = parseInt(match[1]);
          stats.deletedLines = parseInt(match[2]);
        }
      }
    }
  } catch (error) {
    console.warn('Could not get diff stats:', error.message);
  }

  // Get modified files with details
  try {
    const files = runGitCommand('git diff --name-status HEAD~1 HEAD');
    if (files) {
      stats.modifiedFiles = files.split('\n').map(line => {
        const [status, filename] = line.split('\t');
        return { status, filename };
      });
    }
  } catch (error) {
    console.warn('Could not get file changes:', error.message);
  }

  return stats;
}

function getProjectStats() {
  const stats = {
    totalFiles: 0,
    totalLines: 0,
    testFiles: 0,
    sourceFiles: 0,
    configFiles: 0,
    documentationFiles: 0
  };

  function countFiles(dir, prefix = '') {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!item.startsWith('.') && item !== 'node_modules') {
            countFiles(fullPath, `${prefix}${item}/`);
          }
        } else {
          stats.totalFiles++;
          const ext = path.extname(item);
          const name = item.toLowerCase();
          
          if (name.includes('test') || ext === '.test.js' || ext === '.spec.js') {
            stats.testFiles++;
          } else if (ext === '.js' || ext === '.ts' || ext === '.jsx' || ext === '.tsx') {
            stats.sourceFiles++;
          } else if (name.includes('config') || name.includes('package') || name.includes('eslint')) {
            stats.configFiles++;
          } else if (ext === '.md' || ext === '.txt') {
            stats.documentationFiles++;
          }
          
          // Count lines
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            stats.totalLines += content.split('\n').length;
          } catch {
            // Skip binary files
          }
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  countFiles('.');
  return stats;
}

function getTestResults() {
  try {
    // Run tests and capture output
    const testOutput = runGitCommand('npm run test:ci');
    const coverageMatch = testOutput.match(/All files\s+\|\s+(\d+\.\d+)\s+\|\s+(\d+\.\d+)\s+\|\s+(\d+\.\d+)\s+\|\s+(\d+\.\d+)/);
    
    return {
      success: testOutput.includes('✓') || testOutput.includes('PASS'),
      coverage: coverageMatch ? {
        statements: parseFloat(coverageMatch[1]),
        branches: parseFloat(coverageMatch[2]),
        functions: parseFloat(coverageMatch[3]),
        lines: parseFloat(coverageMatch[4])
      } : null,
      output: testOutput
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function getLintResults() {
  try {
    const lintOutput = runGitCommand('npm run lint');
    return {
      success: true,
      output: lintOutput || 'No linting issues found'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: error.stdout || error.message
    };
  }
}

function generateReviewPacket() {
  console.log('🔍 Generating Review Packet for Development Branch...\n');
  
  const gitStats = getGitStats();
  const projectStats = getProjectStats();
  const testResults = getTestResults();
  const lintResults = getLintResults();
  
  // Create review directory
  const reviewDir = path.join(process.cwd(), '_review');
  if (!fs.existsSync(reviewDir)) {
    fs.mkdirSync(reviewDir, { recursive: true });
  }
  
  const summaryLines = [];
  
  // Header
  summaryLines.push('# Review Packet for Development Branch');
  summaryLines.push('');
  summaryLines.push(`- **Branch**: ${gitStats.currentBranch}`);
  summaryLines.push(`- **Last Commit**: ${gitStats.lastCommit}`);
  summaryLines.push(`- **Total Commits**: ${gitStats.totalCommits}`);
  summaryLines.push(`- **Generated**: ${new Date().toISOString()}`);
  summaryLines.push('');
  
  // Project Overview
  summaryLines.push('## Project Overview');
  summaryLines.push(`- **Total Files**: ${projectStats.totalFiles}`);
  summaryLines.push(`- **Total Lines**: ${projectStats.totalLines.toLocaleString()}`);
  summaryLines.push(`- **Source Files**: ${projectStats.sourceFiles}`);
  summaryLines.push(`- **Test Files**: ${projectStats.testFiles}`);
  summaryLines.push(`- **Config Files**: ${projectStats.configFiles}`);
  summaryLines.push(`- **Documentation Files**: ${projectStats.documentationFiles}`);
  summaryLines.push('');
  
  // Recent Changes
  if (gitStats.modifiedFiles.length > 0) {
    summaryLines.push('## Recent Changes');
    summaryLines.push(`- **Files Changed**: ${gitStats.modifiedFiles.length}`);
    summaryLines.push(`- **Lines Added**: +${gitStats.addedLines}`);
    summaryLines.push(`- **Lines Deleted**: -${gitStats.deletedLines}`);
    summaryLines.push('');
    
    summaryLines.push('### Modified Files');
    for (const file of gitStats.modifiedFiles) {
      summaryLines.push(`- **${file.status}**: ${file.filename}`);
    }
    summaryLines.push('');
  }
  
  // Test Results
  summaryLines.push('## Test Results');
  if (testResults.success) {
    summaryLines.push('✅ **Tests**: All tests passing');
    if (testResults.coverage) {
      summaryLines.push(`- **Coverage**: ${testResults.coverage.statements}% statements, ${testResults.coverage.branches}% branches, ${testResults.coverage.functions}% functions, ${testResults.coverage.lines}% lines`);
    }
  } else {
    summaryLines.push('❌ **Tests**: Some tests failing');
    if (testResults.error) {
      summaryLines.push(`- **Error**: ${testResults.error}`);
    }
  }
  summaryLines.push('');
  
  // Lint Results
  summaryLines.push('## Lint Results');
  if (lintResults.success) {
    summaryLines.push('✅ **Linting**: No issues found');
  } else {
    summaryLines.push('❌ **Linting**: Issues found');
    if (lintResults.error) {
      summaryLines.push(`- **Error**: ${lintResults.error}`);
    }
  }
  summaryLines.push('');
  
  // Quality Metrics
  summaryLines.push('## Quality Metrics');
  const testRatio = projectStats.testFiles / Math.max(projectStats.sourceFiles, 1);
  summaryLines.push(`- **Test Coverage Ratio**: ${(testRatio * 100).toFixed(1)}% (${projectStats.testFiles} tests / ${projectStats.sourceFiles} source files)`);
  summaryLines.push(`- **Documentation Ratio**: ${(projectStats.documentationFiles / Math.max(projectStats.totalFiles, 1) * 100).toFixed(1)}%`);
  summaryLines.push('');
  
  // Module Analysis
  summaryLines.push('## Module Analysis');
  const modules = ['hello', 'jokes', 'stopwatch', 'temp-converter', 'todo', 'expenses'];
  for (const module of modules) {
    const modulePath = path.join(process.cwd(), module);
    if (fs.existsSync(modulePath)) {
      const _packageJson = path.join(modulePath, 'package.json');
      const hasTests = fs.existsSync(path.join(modulePath, 'tests')) || fs.existsSync(path.join(modulePath, 'test'));
      const hasSrc = fs.existsSync(path.join(modulePath, 'src'));
      summaryLines.push(`- **${module}**: ${hasSrc ? '✅ Source' : '❌ No source'} | ${hasTests ? '✅ Tests' : '❌ No tests'}`);
    }
  }
  summaryLines.push('');
  
  // Recommendations
  summaryLines.push('## Review Focus & Recommendations');
  
  if (testResults.coverage && testResults.coverage.statements < 80) {
    summaryLines.push('- 🔍 **Low Test Coverage**: Consider adding more tests to improve coverage');
  }
  
  if (projectStats.testFiles < projectStats.sourceFiles) {
    summaryLines.push('- 🔍 **Missing Tests**: Some source files may not have corresponding tests');
  }
  
  if (gitStats.addedLines > 200) {
    summaryLines.push('- 🔍 **Large Changes**: Recent changes include significant additions - review carefully');
  }
  
  if (!lintResults.success) {
    summaryLines.push('- 🔍 **Linting Issues**: Address linting errors before merging');
  }
  
  summaryLines.push('- 🔍 **Code Quality**: Review code for maintainability and best practices');
  summaryLines.push('- 🔍 **Documentation**: Ensure all new features are properly documented');
  summaryLines.push('');
  
  // Write summary
  const summaryPath = path.join(reviewDir, 'summary.md');
  fs.writeFileSync(summaryPath, summaryLines.join('\n'));
  
  // Write detailed JSON data
  const detailedData = {
    git: gitStats,
    project: projectStats,
    tests: testResults,
    lint: lintResults,
    generated: new Date().toISOString()
  };
  
  const jsonPath = path.join(reviewDir, 'review-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(detailedData, null, 2));
  
  console.log('✅ Review packet generated successfully!');
  console.log(`📁 Output directory: ${reviewDir}`);
  console.log(`📄 Summary: ${summaryPath}`);
  console.log(`📊 Data: ${jsonPath}`);
  console.log('');
  
  // Display summary
  console.log('📋 Review Packet Summary:');
  console.log('=' .repeat(50));
  console.log(summaryLines.join('\n'));
  
  return { summaryPath, jsonPath, reviewDir };
}

// Run the generator
try {
  generateReviewPacket();
} catch (error) {
  console.error('❌ Error generating review packet:', error.message);
  process.exit(1);
}

export { generateReviewPacket };
