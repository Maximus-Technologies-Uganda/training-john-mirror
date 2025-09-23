import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('Hello CLI', () => {
  it('should output default greeting', () => {
    const output = execSync('node src/hello.js').toString().trim();
    expect(output).toBe('Hello, World!');
  });

  it('should output personalized greeting', () => {
    const output = execSync('node src/hello.js Preston').toString().trim();
    expect(output).toBe('Hello, Preston!');
  });

  it('should output shouted greeting with --shout flag', () => {
    const output = execSync('node src/hello.js Preston --shout').toString().trim();
    expect(output).toBe('HELLO, PRESTON!');
  });
});