/* eslint-env browser, jest */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { getJoke } from '../../jokes/src/jokes-core.js';

describe('Jokes Core Functions with Stubbed Provider', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns a formatted twopart joke using stubbed fetch data', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        error: false,
        category: 'Misc',
        type: 'twopart',
        setup: 'Why did the scarecrow win an award?',
        delivery: 'Because he was outstanding in his field!'
      })
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const joke = await getJoke('Any', 'twopart');

    expect(global.fetch).toHaveBeenCalledWith('https://v2.jokeapi.dev/joke/Any?type=twopart');
    expect(joke).toEqual({
      setup: 'Why did the scarecrow win an award?',
      punchline: 'Because he was outstanding in his field!',
      category: 'Misc',
      type: 'twopart',
      formatted: 'Why did the scarecrow win an award?\nBecause he was outstanding in his field!'
    });
  });

  it('returns a formatted single joke using stubbed fetch data', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        error: false,
        category: 'Misc',
        type: 'single',
        joke: 'Why did the chicken cross the road?'
      })
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const joke = await getJoke('Any', 'single');

    expect(global.fetch).toHaveBeenCalledWith('https://v2.jokeapi.dev/joke/Any?type=single');
    expect(joke).toEqual({
      setup: 'Why did the chicken cross the road?',
      punchline: '',
      category: 'Misc',
      type: 'single',
      formatted: 'Why did the chicken cross the road?'
    });
  });

  it('throws when the provider returns an error flag', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ error: true, message: 'No jokes found' })
    };

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(getJoke('Programming', 'single')).rejects.toThrow('API Error: No jokes found');
  });

  it('propagates provider failures', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

    await expect(getJoke('Any', 'single')).rejects.toThrow('network down');
  });
});
