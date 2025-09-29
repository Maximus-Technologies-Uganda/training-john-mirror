import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const timeFile = path.join(process.cwd(), 'data/time.json');

// Helper function to safely reset the stopwatch
function safeReset() {
  try {
    // Ensure the data directory exists
    const dataDir = path.dirname(timeFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Reset the stopwatch
    execSync('node src/stopwatch.js reset', { stdio: 'pipe' });
    
    // Wait a bit to ensure file operations complete
    const start = Date.now();
    while (Date.now() - start < 10) {
      // Small delay to ensure file system operations complete
    }
  } catch {
    // If reset fails, manually reset the file
    try {
      const data = { startTime: null };
      fs.writeFileSync(timeFile, JSON.stringify(data, null, 2));
    } catch (writeError) {
      console.warn('Failed to reset time file:', writeError.message);
    }
  }
}

describe('Stopwatch CLI', () => {
  beforeEach(() => {
    // Reset stopwatch before each test
    safeReset();
  });

  afterEach(() => {
    // Clean up after each test
    safeReset();
  });

  it('should show usage message', () => {
    const output = execSync('node src/stopwatch.js', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Usage: node stopwatch.js <command>');
  });

  it('should reset stopwatch', () => {
    const output = execSync('node src/stopwatch.js reset', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Stopwatch reset');
    
    // Check that time file is reset
    const content = fs.readFileSync(timeFile, 'utf8');
    const data = JSON.parse(content);
    expect(data.startTime).toBeNull();
  });

  it('should start stopwatch', () => {
    const output = execSync('node src/stopwatch.js start', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Stopwatch started at');
    
    // Check that startTime is recorded
    const content = fs.readFileSync(timeFile, 'utf8');
    const data = JSON.parse(content);
    expect(data.startTime).not.toBeNull();
    expect(typeof data.startTime).toBe('number');
  });

  it('should show running status', () => {
    // Start the stopwatch first
    execSync('node src/stopwatch.js start', { stdio: 'pipe' });
    
    const output = execSync('node src/stopwatch.js status', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Stopwatch is running');
  });

  it('should record lap time', () => {
    // Start the stopwatch first
    execSync('node src/stopwatch.js start', { stdio: 'pipe' });
    
    const output = execSync('node src/stopwatch.js lap', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Lap time:');
  });

  it('should stop stopwatch', () => {
    // Start the stopwatch first
    execSync('node src/stopwatch.js start', { stdio: 'pipe' });
    
    const output = execSync('node src/stopwatch.js stop', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Stopwatch stopped');
    
    // Check that time file is reset
    const content = fs.readFileSync(timeFile, 'utf8');
    const data = JSON.parse(content);
    expect(data.startTime).toBeNull();
  });

  it('should show not running status when stopped', () => {
    const output = execSync('node src/stopwatch.js status', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Stopwatch is not running');
  });

  it('should show error for lap without start', () => {
    const output = execSync('node src/stopwatch.js lap', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Stopwatch has not been started');
  });

  it('should show error for stop without start', () => {
    const output = execSync('node src/stopwatch.js stop', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Stopwatch has not been started');
  });

  it('should show usage for invalid command', () => {
    const output = execSync('node src/stopwatch.js invalid', { stdio: 'pipe' }).toString().trim();
    expect(output).toContain('Usage: node stopwatch.js <command>');
  });
});
