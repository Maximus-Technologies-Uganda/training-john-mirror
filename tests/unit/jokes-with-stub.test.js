/* eslint-env browser, jest */
import { describe, it, expect, beforeEach } from 'vitest';
import { createJokeService, JokeService } from '../../src/jokes-core.js';
import { StubJokeProvider } from '../../src/jokes-provider.js';

describe('Jokes Core Functions with Stubbed Provider', () => {
  let jokeService;
  let stubProvider;

  beforeEach(() => {
    stubProvider = new StubJokeProvider();
    jokeService = new JokeService(stubProvider);
  });

  describe('JokeService with StubJokeProvider', () => {
    it('should return a formatted twopart joke using stubbed data', async () => {
      const joke = await jokeService.getJoke('Any', 'twopart');
      
      expect(joke.setup).toBe('Why did the scarecrow win an award?');
      expect(joke.punchline).toBe('Because he was outstanding in his field!');
      expect(joke.category).toBe('Misc');
      expect(joke.type).toBe('twopart');
      expect(joke.formatted).toBe('Why did the scarecrow win an award?\nBecause he was outstanding in his field!');
    });

    it('should return a single joke using stubbed data', async () => {
      const joke = await jokeService.getJoke('Any', 'single');
      
      expect(joke.setup).toBe('Why did the chicken cross the road?');
      expect(joke.punchline).toBe('');
      expect(joke.category).toBe('Misc');
      expect(joke.type).toBe('single');
      expect(joke.formatted).toBe('Why did the chicken cross the road?');
    });

    it('should throw an error for invalid category', async () => {
      await expect(jokeService.getJoke('InvalidCategory')).rejects.toThrow('Invalid category. Must be one of: Any, Programming, Misc, Dark, Pun, Spooky, Christmas');
    });

    it('should throw an error for invalid type', async () => {
      await expect(jokeService.getJoke('Any', 'invalid')).rejects.toThrow('Invalid type. Must be one of: single, twopart');
    });

    it('should handle provider errors', async () => {
      stubProvider.setShouldThrowError(true, 'Simulated network error');
      
      await expect(jokeService.getJoke('Any', 'single')).rejects.toThrow('Simulated network error');
    });

    it('should use custom joke data when configured', async () => {
      const customJoke = {
        joke: 'What do you call a fake noodle?',
        category: 'Programming'
      };
      
      stubProvider.setJokeData(customJoke, 'single');
      
      const joke = await jokeService.getJoke('Programming', 'single');
      
      expect(joke.setup).toBe('What do you call a fake noodle?');
      expect(joke.category).toBe('Programming');
      expect(joke.type).toBe('single');
    });

    it('should use custom twopart joke data when configured', async () => {
      const customJoke = {
        setup: 'Why do programmers prefer dark mode?',
        delivery: 'Because light attracts bugs!',
        category: 'Programming'
      };
      
      stubProvider.setJokeData(customJoke, 'twopart');
      
      const joke = await jokeService.getJoke('Programming', 'twopart');
      
      expect(joke.setup).toBe('Why do programmers prefer dark mode?');
      expect(joke.punchline).toBe('Because light attracts bugs!');
      expect(joke.category).toBe('Programming');
      expect(joke.type).toBe('twopart');
      expect(joke.formatted).toBe('Why do programmers prefer dark mode?\nBecause light attracts bugs!');
    });
  });

  describe('createJokeService factory function', () => {
    it('should create a service with the provided provider', () => {
      const service = createJokeService(stubProvider);
      expect(service).toBeInstanceOf(JokeService);
      expect(service.provider).toBe(stubProvider);
    });
  });

  describe('Business Logic Separation', () => {
    it('should validate inputs without making network calls', () => {
      // Test validation logic in isolation
      expect(() => jokeService.validateInputs('Any', 'single')).not.toThrow();
      expect(() => jokeService.validateInputs('Programming', 'twopart')).not.toThrow();
      expect(() => jokeService.validateInputs('Invalid', 'single')).toThrow();
      expect(() => jokeService.validateInputs('Any', 'invalid')).toThrow();
    });

    it('should format joke data correctly', () => {
      const singleJokeData = {
        joke: 'Test joke',
        category: 'Test'
      };
      
      const twopartJokeData = {
        setup: 'Test setup',
        delivery: 'Test delivery',
        category: 'Test'
      };

      const singleFormatted = jokeService.formatJoke(singleJokeData, 'single');
      expect(singleFormatted).toEqual({
        setup: 'Test joke',
        punchline: '',
        category: 'Test',
        type: 'single',
        formatted: 'Test joke'
      });

      const twopartFormatted = jokeService.formatJoke(twopartJokeData, 'twopart');
      expect(twopartFormatted).toEqual({
        setup: 'Test setup',
        punchline: 'Test delivery',
        category: 'Test',
        type: 'twopart',
        formatted: 'Test setup\nTest delivery'
      });
    });
  });
});
