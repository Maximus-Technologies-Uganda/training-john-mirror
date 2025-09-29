import { describe, it, expect } from 'jest';
import { getAvailableCategories, getAvailableTypes } from '../src/jokes-core.js';

describe('Jokes Core Functions', () => {
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
