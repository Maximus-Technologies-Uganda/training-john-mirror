/* eslint-env browser, jest */
import { describe, it, expect, vi } from 'vitest';
import { getJoke, getJokeString, getAvailableCategories, getAvailableTypes } from '../../src/jokes-core.js';

// Mock the global fetch function
global.fetch = vi.fn();

describe('Jokes Core Functions', () => {
  // eslint-disable-next-line no-undef
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getJoke', () => {
    it('should return a formatted twopart joke on a successful API call', async () => {
      // Create a fake successful response for twopart joke
      const mockJokeData = { 
        setup: 'Why did the scarecrow win an award?', 
        delivery: 'Because he was outstanding in his field!',
        category: 'Misc'
      };
      // eslint-disable-next-line no-undef
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockJokeData),
      });

      const joke = await getJoke('Any', 'twopart');
      expect(joke.setup).toBe('Why did the scarecrow win an award?');
      expect(joke.punchline).toBe('Because he was outstanding in his field!');
      expect(joke.category).toBe('Misc');
      expect(joke.type).toBe('twopart');
      expect(joke.formatted).toBe('Why did the scarecrow win an award?\nBecause he was outstanding in his field!');
    });

    it('should return a single joke on a successful API call', async () => {
      // Create a fake successful response for single joke
      const mockJokeData = { 
        joke: 'Why did the chicken cross the road?',
        category: 'Misc'
      };
      // eslint-disable-next-line no-undef
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockJokeData),
      });

      const joke = await getJoke('Any', 'single');
      expect(joke.setup).toBe('Why did the chicken cross the road?');
      expect(joke.punchline).toBe('');
      expect(joke.category).toBe('Misc');
      expect(joke.type).toBe('single');
      expect(joke.formatted).toBe('Why did the chicken cross the road?');
    });

    it('should throw an error on a failed API call', async () => {
      // Create a fake failed response
      // eslint-disable-next-line no-undef
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Server Error',
      });

      // Expect the getJoke function to throw an error
      await expect(getJoke()).rejects.toThrow('Failed to fetch joke from the API. Status: 500');
    });

    it('should throw an error for invalid category', async () => {
      await expect(getJoke('InvalidCategory')).rejects.toThrow('Invalid category. Must be one of: Any, Programming, Misc, Dark, Pun, Spooky, Christmas');
    });

    it('should throw an error for invalid type', async () => {
      await expect(getJoke('Any', 'invalid')).rejects.toThrow('Invalid type. Must be one of: single, twopart');
    });

    it('should handle API error responses', async () => {
      const mockErrorData = { 
        error: true,
        message: 'No jokes found for this category'
      };
      // eslint-disable-next-line no-undef
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockErrorData),
      });

      await expect(getJoke('Programming')).rejects.toThrow('API Error: No jokes found for this category');
    });

    it('should handle network errors', async () => {
      // eslint-disable-next-line no-undef
      fetch.mockRejectedValue(new TypeError('fetch failed'));

      await expect(getJoke()).rejects.toThrow('Network error: Unable to connect to the joke API. Please check your internet connection.');
    });
  });

  describe('getJokeString', () => {
    it('should return a formatted joke string', async () => {
      const mockJokeData = { 
        setup: 'Why did the scarecrow win an award?', 
        delivery: 'Because he was outstanding in his field!',
        category: 'Misc'
      };
      // eslint-disable-next-line no-undef
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockJokeData),
      });

      const jokeString = await getJokeString('Any');
      expect(jokeString).toBe('Why did the scarecrow win an award?\nBecause he was outstanding in his field!');
    });
  });

  describe('getAvailableCategories', () => {
    it('should return an array of available categories', () => {
      const categories = getAvailableCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories).toContain('Any');
      expect(categories).toContain('Programming');
      expect(categories).toContain('Misc');
      expect(categories).toContain('Dark');
      expect(categories).toContain('Pun');
      expect(categories).toContain('Spooky');
      expect(categories).toContain('Christmas');
    });
  });

  describe('getAvailableTypes', () => {
    it('should return an array of available types', () => {
      const types = getAvailableTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types).toContain('single');
      expect(types).toContain('twopart');
    });
  });
});