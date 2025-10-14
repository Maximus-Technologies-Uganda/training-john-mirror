import { describe, it, expect } from 'vitest';
import { loadQuotes, getRandomQuote, filterQuotesByAuthor, formatQuote, getQuote } from '../src/quote-core.js';
import { run as runCli } from '../src/quote-cli.js';
import path from 'path';
import { fileURLToPath } from 'url';

function fixturePath(rel) {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', rel);
}

describe('quote-core', () => {
  it('loads quotes from data file', () => {
    const quotes = loadQuotes(fixturePath('data/quotes.json'));
    expect(Array.isArray(quotes)).toBe(true);
    expect(quotes.length).toBeGreaterThan(0);
    expect(quotes[0]).toHaveProperty('author');
    expect(quotes[0]).toHaveProperty('quote');
  });

  it('returns null when getting random quote from empty array', () => {
    const q = getRandomQuote([]);
    expect(q).toBeNull();
  });

  it('returns deterministic random quote with provided rng', () => {
    const quotes = [
      { author: 'A', quote: 'Q1' },
      { author: 'B', quote: 'Q2' },
      { author: 'C', quote: 'Q3' }
    ];
    const rng = () => 0.7; // 0.7 * 3 = 2.1 => floor 2 => index 2
    const q = getRandomQuote(quotes, rng);
    expect(q).toEqual({ author: 'C', quote: 'Q3' });
  });

  it('filters by author (case-insensitive) when present', () => {
    const quotes = [
      { author: 'Maya Angelou', quote: 'Q1' },
      { author: 'Albert Einstein', quote: 'Q2' },
      { author: 'maya angelou', quote: 'Q3' }
    ];
    const res = filterQuotesByAuthor(quotes, 'mAyA aNgElOu');
    expect(res.map(q => q.quote)).toEqual(['Q1', 'Q3']);
  });

  it('returns empty array when author not found', () => {
    const quotes = [
      { author: 'A', quote: 'Q1' }
    ];
    const res = filterQuotesByAuthor(quotes, 'B');
    expect(res).toEqual([]);
  });

  it('handles empty or invalid source file gracefully', () => {
    const nonexistent = fixturePath('data/does-not-exist.json');
    const quotes = loadQuotes(nonexistent);
    expect(quotes).toEqual([]);
  });

  it('handles empty source file ([]) gracefully', () => {
    const emptyFixture = fixturePath('data/empty.json');
    const quotes = loadQuotes(emptyFixture);
    expect(Array.isArray(quotes)).toBe(true);
    expect(quotes).toEqual([]);
  });

  it('formats a quote correctly', () => {
    const str = formatQuote({ author: 'Yoda', quote: 'Do. Or do not. There is no try.' });
    expect(str).toBe('"Do. Or do not. There is no try." — Yoda');
  });

  it('filters by author (case-insensitive) for real data (oscar wilde)', () => {
    const quotes = loadQuotes(fixturePath('data/quotes.json'));
    const res = filterQuotesByAuthor(quotes, 'oscar wilde');
    expect(res.length).toBeGreaterThan(0);
    expect(res.every(q => (q.author || '').toLowerCase() === 'oscar wilde')).toBe(true);
  });

  it('getQuote returns formatted random quote when no author provided', () => {
    const quotes = [
      { author: 'Ada Lovelace', quote: 'The Analytical Engine weaves algebraic patterns.' },
      { author: 'Grace Hopper', quote: 'It is easier to ask forgiveness than it is to get permission.' }
    ];
    const result = getQuote({ quotes, rng: () => 0.6 });
    expect(result).toEqual({
      success: true,
      data: '"It is easier to ask forgiveness than it is to get permission." — Grace Hopper'
    });
  });

  it('getQuote returns header and quotes when author provided', () => {
    const quotes = [
      { author: 'Alan Turing', quote: 'We can only see a short distance ahead.' },
      { author: 'alan turing', quote: 'Those who can imagine anything, can create the impossible.' }
    ];
    const result = getQuote({ quotes, author: 'Alan Turing' });
    expect(result.success).toBe(true);
    const lines = result.data.split('\n');
    expect(lines[0]).toContain('Found 2 quotes by Alan Turing');
    expect(lines.length).toBe(3);
    expect(result.count).toBe(2);
  });

  it('getQuote returns failure when author not found', () => {
    const quotes = [
      { author: 'Someone', quote: 'Something' }
    ];
    const result = getQuote({ quotes, author: 'Nope' });
    expect(result).toEqual({
      success: false,
      data: 'No quotes found for author: Nope'
    });
  });

  it('CLI returns non-zero when author not found', () => {
    const code = runCli(['node', 'quote', '--by', 'author-that-does-not-exist']);
    expect(code).toBe(1);
  });

  it('CLI prints count header when filtering by author', () => {
    // Hijack console.log to capture output
    const originalLog = console.log;
    const lines = [];
    console.log = (msg) => { lines.push(String(msg)); };
    try {
      const code = runCli(['node', 'quote', '--by', 'oscar wilde']);
      expect(code).toBe(0);
      const output = lines.join('\n');
      expect(output.toLowerCase()).toContain('found');
      expect(output.toLowerCase()).toContain('quote');
      expect(output.toLowerCase()).toContain('oscar wilde');
      // Then at least one formatted quote line should follow
      expect(output.split('\n').slice(1).some(l => l.includes('—'))).toBe(true);
    } finally {
      console.log = originalLog;
    }
  });

  it('CLI prints count and quotes when --by and --count are used', () => {
    const originalLog = console.log;
    const outputs = [];
    console.log = (msg) => { outputs.push(String(msg)); };
    try {
      const code = runCli(['node', 'quote', '--by', 'oscar wilde', '--count']);
      expect(code).toBe(0);
      expect(outputs[0]).toMatch(/^\d+$/);
      expect(Number(outputs[0])).toBeGreaterThan(0);
      const combined = outputs.slice(1).join('\n');
      expect(combined.toLowerCase()).toContain('found');
      expect(combined.toLowerCase()).toContain('oscar wilde');
    } finally {
      console.log = originalLog;
    }
  });
});


