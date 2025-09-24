import { describe, it, expect, vi } from 'vitest';
import { getJoke } from '../src/jokes-core.js';

// Mock the global fetch function
global.fetch = vi.fn();

describe('getJoke', () => {
  it('should return a formatted joke on a successful API call', async () => {
    // Create a fake successful response
    const mockJoke = { setup: 'Why did the scarecrow win an award?', punchline: 'Because he was outstanding in his field!' };
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockJoke),
    });

    const joke = await getJoke();
    expect(joke).toBe('Why did the scarecrow win an award?\nBecause he was outstanding in his field!');
  });

  it('should throw an error on a failed API call', async () => {
    // Create a fake failed response
    fetch.mockResolvedValue({
      ok: false,
      statusText: 'Server Error',
    });

    // Expect the getJoke function to throw an error
    await expect(getJoke()).rejects.toThrow('Failed to fetch joke from the API.');
  });
});