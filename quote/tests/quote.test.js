import { describe, it, expect } from 'vitest';
import { loadQuotes, getRandomQuote, filterQuotesByAuthor, formatQuote } from '../src/quote-core.js';
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
      expect(lines[0].toLowerCase()).toContain('found');
      expect(lines[0].toLowerCase()).toContain('quote');
      expect(lines[0].toLowerCase()).toContain('oscar wilde');
      // Then at least one formatted quote line should follow
      expect(lines.slice(1).some(l => l.includes('—'))).toBe(true);
    } finally {
      console.log = originalLog;
    }
  });
});


