import { describe, it, expect, vi } from 'vitest';
import {
  safeExecute,
  isLocalStorageAvailable,
  safeJsonParse,
  safeJsonStringify,
  getUserFriendlyErrorMessage
} from '../../src/utils/errorUtils';

describe('errorUtils', () => {
  describe('safeExecute', () => {
    it('returns result when function executes successfully', () => {
      const result = safeExecute(() => 42);
      expect(result).toBe(42);
    });

    it('returns fallback when function throws', () => {
      const result = safeExecute(() => {
        throw new Error('Test error');
      }, 'fallback');
      expect(result).toBe('fallback');
    });

    it('logs error message when provided', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      safeExecute(() => {
        throw new Error('Test error');
      }, 'fallback', 'Custom error message');

      expect(consoleSpy).toHaveBeenCalledWith('Custom error message', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('does not log when no error message provided', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      safeExecute(() => {
        throw new Error('Test error');
      }, 'fallback');

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it('returns false when localStorage.setItem throws', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage not available');
      });

      expect(isLocalStorageAvailable()).toBe(false);

      setItemSpy.mockRestore();
    });

    it('returns false when localStorage.removeItem throws', () => {
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('Access denied');
      });

      expect(isLocalStorageAvailable()).toBe(false);

      removeItemSpy.mockRestore();
    });

    it('returns false when localStorage is not defined', () => {
      delete window.localStorage;

      expect(isLocalStorageAvailable()).toBe(false);
    });
  });

  describe('safeJsonParse', () => {
    it('parses valid JSON successfully', () => {
      const result = safeJsonParse('{"key": "value"}');
      expect(result).toEqual({ key: 'value' });
    });

    it('returns fallback for invalid JSON', () => {
      const result = safeJsonParse('invalid json', { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it('logs error for invalid JSON', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      safeJsonParse('invalid json');

      expect(consoleSpy).toHaveBeenCalledWith('Error parsing JSON:', expect.any(SyntaxError));

      consoleSpy.mockRestore();
    });
  });

  describe('safeJsonStringify', () => {
    it('stringifies objects successfully', () => {
      const result = safeJsonStringify({ key: 'value' });
      expect(result).toBe('{"key":"value"}');
    });

    it('returns fallback for circular references', () => {
      const circular = { self: null };
      circular.self = circular;

      const result = safeJsonStringify(circular, 'fallback');
      expect(result).toBe('fallback');
    });

    it('logs error for problematic objects', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const circular = { self: null };
      circular.self = circular;

      safeJsonStringify(circular);

      expect(consoleSpy).toHaveBeenCalledWith('Error stringifying JSON:', expect.any(TypeError));

      consoleSpy.mockRestore();
    });
  });

  describe('getUserFriendlyErrorMessage', () => {
    it('returns string errors as-is', () => {
      expect(getUserFriendlyErrorMessage('Custom error')).toBe('Custom error');
    });

    it('handles QuotaExceededError', () => {
      const error = new Error('Storage quota exceeded');
      error.name = 'QuotaExceededError';

      expect(getUserFriendlyErrorMessage(error)).toBe('Storage limit exceeded. Please clear some space and try again.');
    });

    it('handles NetworkError', () => {
      const error = new Error('Network request failed');
      error.name = 'NetworkError';

      expect(getUserFriendlyErrorMessage(error)).toBe('Network error. Please check your connection and try again.');
    });

    it('returns short error messages', () => {
      const error = new Error('This is a short message');
      expect(getUserFriendlyErrorMessage(error)).toBe('This is a short message');
    });

    it('returns fallback for long error messages', () => {
      const longMessage = 'A'.repeat(101);
      const error = new Error(longMessage);
      expect(getUserFriendlyErrorMessage(error)).toBe('An unexpected error occurred');
    });

    it('returns custom fallback', () => {
      const error = new Error('Some very long error message that exceeds the 100 character limit and should therefore use the fallback instead of the error message');
      expect(getUserFriendlyErrorMessage(error, 'Custom fallback')).toBe('Custom fallback');
    });

    it('returns default fallback for non-Error objects', () => {
      expect(getUserFriendlyErrorMessage(null)).toBe('An unexpected error occurred');
      expect(getUserFriendlyErrorMessage(123)).toBe('An unexpected error occurred');
      expect(getUserFriendlyErrorMessage({})).toBe('An unexpected error occurred');
    });
  });
});
