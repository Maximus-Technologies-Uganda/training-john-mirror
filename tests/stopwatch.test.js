import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const timeFile = path.join(process.cwd(), 'data/time.json');

describe('Stopwatch CLI', () => {
  beforeEach(() => {
    // Reset stopwatch before each test
    try {
      execSync('node src/stopwatch.js reset');
    } catch (error) {
      // Ignore errors during reset
    }
  });

  afterEach(() => {
    // Clean up after each test
    try {
      execSync('node src/stopwatch.js reset');
    } catch (error) {
      // Ignore errors during cleanup
    }
  });

  it('should show usage message', () => {
    const output = execSync('node src/stopwatch.js').toString().trim();
    expect(output).toContain('Usage: node stopwatch.js <command>');
  });

  it('should reset stopwatch', () => {
    const output = execSync('node src/stopwatch.js reset').toString().trim();
    expect(output).toContain('Stopwatch reset');
    
    // Check that time file is reset
    const content = fs.readFileSync(timeFile, 'utf8');
    const data = JSON.parse(content);
    expect(data.startTime).toBeNull();
  });

  it('should start stopwatch', () => {
    const output = execSync('node src/stopwatch.js start').toString().trim();
    expect(output).toContain('Stopwatch started at');
    
    // Check that startTime is recorded
    const content = fs.readFileSync(timeFile, 'utf8');
    const data = JSON.parse(content);
    expect(data.startTime).not.toBeNull();
    expect(typeof data.startTime).toBe('number');
  });

  it('should show running status', () => {
    // Start the stopwatch first
    execSync('node src/stopwatch.js start');
    
    const output = execSync('node src/stopwatch.js status').toString().trim();
    expect(output).toContain('Stopwatch is running');
  });

  it('should record lap time', () => {
    // Start the stopwatch first
    execSync('node src/stopwatch.js start');
    
    const output = execSync('node src/stopwatch.js lap').toString().trim();
    expect(output).toContain('Lap time:');
  });

  it('should stop stopwatch', () => {
    // Start the stopwatch first
    execSync('node src/stopwatch.js start');
    
    const output = execSync('node src/stopwatch.js stop').toString().trim();
    expect(output).toContain('Stopwatch stopped');
    
    // Check that time file is reset
    const content = fs.readFileSync(timeFile, 'utf8');
    const data = JSON.parse(content);
    expect(data.startTime).toBeNull();
  });

  it('should show not running status when stopped', () => {
    const output = execSync('node src/stopwatch.js status').toString().trim();
    expect(output).toContain('Stopwatch is not running');
  });

  it('should show error for lap without start', () => {
    const output = execSync('node src/stopwatch.js lap').toString().trim();
    expect(output).toContain('Stopwatch has not been started');
  });

  it('should show error for stop without start', () => {
    const output = execSync('node src/stopwatch.js stop').toString().trim();
    expect(output).toContain('Stopwatch has not been started');
  });

  it('should show usage for invalid command', () => {
    const output = execSync('node src/stopwatch.js invalid').toString().trim();
    expect(output).toContain('Usage: node stopwatch.js <command>');
  });
});
