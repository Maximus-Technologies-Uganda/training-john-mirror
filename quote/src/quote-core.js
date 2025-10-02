import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Load and parse quotes JSON file. Returns an empty array on errors.
 * This function is pure with respect to outputs: it never throws; it returns data.
 *
 * @param {string} [sourcePath] Optional path to the JSON file.
 * @returns {Array<{ author: string, quote: string }>} Array of quotes
 */
export function loadQuotes(sourcePath) {
  try {
    const resolved = sourcePath
      ? path.resolve(sourcePath)
      : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'quotes.json');

    if (!fs.existsSync(resolved)) {
      return [];
    }

    const raw = fs.readFileSync(resolved, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(q => q && typeof q.author === 'string' && typeof q.quote === 'string')
      .map(q => ({ author: q.author, quote: q.quote }));
  } catch (_err) {
    return [];
  }
}

/**
 * Return a single random quote from the provided list.
 * If list is empty, returns null.
 * @param {Array<{ author: string, quote: string }>} quotes
 * @param {() => number} [rng] Optional RNG returning [0,1) for determinism in tests
 * @returns {{ author: string, quote: string } | null}
 */
export function getRandomQuote(quotes, rng) {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    return null;
  }
  const random = typeof rng === 'function' ? rng() : Math.random();
  const index = Math.floor(random * quotes.length);
  return quotes[index] || null;
}

/**
 * Filter quotes by author (case-insensitive). Returns an empty array if none.
 * @param {Array<{ author: string, quote: string }>} quotes
 * @param {string} author
 * @returns {Array<{ author: string, quote: string }>}
 */
export function filterQuotesByAuthor(quotes, author) {
  if (!Array.isArray(quotes) || !author || typeof author !== 'string') {
    return [];
  }
  const target = author.trim().toLowerCase();
  if (target.length === 0) return [];
  return quotes.filter(q => (q.author || '').toLowerCase() === target);
}

/**
 * Format a quote for display.
 * @param {{ author: string, quote: string }} quoteObj
 * @returns {string}
 */
export function formatQuote(quoteObj) {
  if (!quoteObj) return '';
  const text = quoteObj.quote || '';
  const author = quoteObj.author || '';
  return `"${text}" — ${author}`;
}


