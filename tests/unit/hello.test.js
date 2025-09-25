import { describe, it, expect } from 'vitest';
import { formatGreeting } from '../../src/hello-core.js';

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