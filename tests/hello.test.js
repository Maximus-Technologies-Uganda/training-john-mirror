import { describe, it, expect } from 'vitest';
import { formatGreeting } from '../src/hello-core.js'; // We import the function here

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
});