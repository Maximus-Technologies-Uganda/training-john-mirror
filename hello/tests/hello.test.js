import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatGreeting, runCLI } from '../src/hello-core.js';

describe('formatGreeting', () => {
  it('defaults to World when no name is given', () => {
    expect(formatGreeting()).toBe('Hello, World!');
  });

  it('uses a custom name when provided', () => {
    expect(formatGreeting('John')).toBe('Hello, John!');
  });

  it('shouts when the shout flag is true', () => {
    expect(formatGreeting('John', true)).toBe('HELLO, JOHN!');
  });

  it('handles empty string name', () => {
    expect(formatGreeting('')).toBe('Hello, !');
  });

  it('handles special characters in name', () => {
    expect(formatGreeting('José')).toBe('Hello, José!');
  });

  it('handles numbers as name', () => {
    expect(formatGreeting('123')).toBe('Hello, 123!');
  });

  it('shouts with special characters', () => {
    expect(formatGreeting('José', true)).toBe('HELLO, JOSÉ!');
  });

  it('handles very long names', () => {
    const longName = 'A'.repeat(100);
    expect(formatGreeting(longName)).toBe(`Hello, ${longName}!`);
  });

  it('handles shout with empty name', () => {
    expect(formatGreeting('', true)).toBe('HELLO, !');
  });
});

describe('CLI', () => {
  let logSpy;
  let exitSpy;

  const runWithArgs = (args) => {
    try {
      runCLI(['node', 'hello-core.js', ...args]);
    } catch (error) {
      return error;
    }
    return null;
  };

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`EXIT_${code ?? 0}`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('prints default greeting with no name provided', () => {
    expect(runWithArgs([])).toBeNull();
    expect(logSpy).toHaveBeenCalledWith('Hello, World!');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('prints greeting with provided name flag', () => {
    expect(runWithArgs(['--name', 'Alice'])).toBeNull();
    expect(logSpy).toHaveBeenCalledWith('Hello, Alice!');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('prints greeting when positional name is supplied', () => {
    expect(runWithArgs(['Charlie'])).toBeNull();
    expect(logSpy).toHaveBeenCalledWith('Hello, Charlie!');
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('shouts greeting when --shout flag is provided', () => {
    expect(runWithArgs(['Dana', '--shout'])).toBeNull();
    expect(logSpy).toHaveBeenCalledWith('HELLO, DANA!');
    expect(exitSpy).not.toHaveBeenCalled();
  });
});
