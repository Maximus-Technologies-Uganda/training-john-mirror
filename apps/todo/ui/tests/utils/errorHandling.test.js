import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  safeExecute,
  safeJsonParse,
  safeJsonStringify,
  withRetry,
  localStorageUtils,
  debounce,
  handlePromiseRejection
} from '../../src/utils/errorHandling';

// Mock console.error to avoid test output noise
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('safeExecute', () => {
  it('executes function successfully and returns result', () => {
    const result = safeExecute(() => 42);
    expect(result).toBe(42);
  });

  it('returns fallback value when function throws error', () => {
    const result = safeExecute(() => {
      throw new Error('Test error');
    }, 'fallback');
    expect(result).toBe('fallback');
  });

  it('returns null as default fallback', () => {
    const result = safeExecute(() => {
      throw new Error('Test error');
    });
    expect(result).toBeNull();
  });

  it('logs error message when provided', () => {
    safeExecute(() => {
      throw new Error('Test error');
    }, null, 'Test message');

    expect(console.error).toHaveBeenCalledWith('Test message', expect.any(Error));
  });

  it('does not log when no error message provided', () => {
    console.error.mockClear();
    safeExecute(() => {
      throw new Error('Test error');
    });

    expect(console.error).not.toHaveBeenCalled();
  });
});

describe('safeJsonParse', () => {
  it('parses valid JSON successfully', () => {
    const result = safeJsonParse('{"key": "value"}');
    expect(result).toEqual({ key: 'value' });
  });

  it('returns fallback for invalid JSON', () => {
    const result = safeJsonParse('{invalid json}', 'fallback');
    expect(result).toBe('fallback');
  });

  it('returns null as default fallback for invalid JSON', () => {
    const result = safeJsonParse('{invalid json}');
    expect(result).toBeNull();
  });

  it('logs error for invalid JSON', () => {
    safeJsonParse('{invalid json}');
    expect(console.error).toHaveBeenCalledWith('Error parsing JSON:', expect.any(SyntaxError));
  });
});

describe('safeJsonStringify', () => {
  it('stringifies object successfully', () => {
    const result = safeJsonStringify({ key: 'value' });
    expect(result).toBe('{"key":"value"}');
  });

  it('returns fallback for circular reference', () => {
    const circular = {};
    circular.self = circular;

    const result = safeJsonStringify(circular, 'fallback');
    expect(result).toBe('fallback');
  });

  it('returns "{}" as default fallback', () => {
    const circular = {};
    circular.self = circular;

    const result = safeJsonStringify(circular);
    expect(result).toBe('{}');
  });

  it('logs error for stringify failure', () => {
    const circular = {};
    circular.self = circular;

    safeJsonStringify(circular);
    expect(console.error).toHaveBeenCalledWith('Error stringifying JSON:', expect.any(TypeError));
  });
});

describe('withRetry', () => {
  it('returns result on first successful attempt', async () => {
    const operation = vi.fn().mockResolvedValue('success');
    const result = await withRetry(operation);
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce('success');

    const result = await withRetry(operation, 2, 1);
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('gives up after max retries', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('Always fails'));

    await expect(withRetry(operation, 2, 1)).rejects.toThrow('Always fails');
    expect(operation).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  it('uses default retry settings', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('Always fails'));

    await expect(withRetry(operation)).rejects.toThrow('Always fails');
    expect(operation).toHaveBeenCalledTimes(4); // initial + 3 retries (default)
  });
});

describe('localStorageUtils', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn()
  };

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    vi.clearAllMocks();
  });

  describe('getItem', () => {
    it('returns parsed value for valid stored item', () => {
      mockLocalStorage.getItem.mockReturnValue('{"key": "value"}');

      const result = localStorageUtils.getItem('testKey');
      expect(result).toEqual({ key: 'value' });
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('testKey');
    });

    it('returns fallback for missing item', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = localStorageUtils.getItem('testKey', 'fallback');
      expect(result).toBe('fallback');
    });

    it('returns fallback for invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('{invalid json}');

      const result = localStorageUtils.getItem('testKey', 'fallback');
      expect(result).toBe('fallback');
    });

    it('returns null as default fallback', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = localStorageUtils.getItem('testKey');
      expect(result).toBeNull();
    });

    it('handles localStorage errors', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = localStorageUtils.getItem('testKey', 'fallback');
      expect(result).toBe('fallback');
      expect(console.error).toHaveBeenCalledWith(
        'Error reading from localStorage key "testKey":',
        expect.any(Error)
      );
    });
  });

  describe('setItem', () => {
    it('successfully stores item', () => {
      mockLocalStorage.setItem.mockReturnValue(undefined);

      const result = localStorageUtils.setItem('testKey', { key: 'value' });
      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('testKey', '{"key":"value"}');
    });

    it('handles localStorage errors', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const result = localStorageUtils.setItem('testKey', { key: 'value' });
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error writing to localStorage key "testKey":',
        expect.any(Error)
      );
    });

    it('handles JSON stringify errors', () => {
      const circular = {};
      circular.self = circular;

      const result = localStorageUtils.setItem('testKey', circular);
      expect(result).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('successfully removes item', () => {
      mockLocalStorage.removeItem.mockReturnValue(undefined);

      const result = localStorageUtils.removeItem('testKey');
      expect(result).toBe(true);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('handles localStorage errors', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = localStorageUtils.removeItem('testKey');
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error removing localStorage key "testKey":',
        expect.any(Error)
      );
    });
  });

  describe('isAvailable', () => {
    it('returns true when localStorage is available', () => {
      mockLocalStorage.setItem.mockReturnValue(undefined);
      mockLocalStorage.removeItem.mockReturnValue(undefined);

      const result = localStorageUtils.isAvailable();
      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('__storage_test__', 'test');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('__storage_test__');
    });

    it('returns false when localStorage throws error', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const result = localStorageUtils.isAvailable();
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'localStorage is not available:',
        expect.any(Error)
      );
    });
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('cancels previous call when called again', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    vi.advanceTimersByTime(50);

    debouncedFunc(); // Cancel first call
    vi.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to debounced function', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledWith('arg1', 'arg2');
  });
});

describe('handlePromiseRejection', () => {
  it('returns resolved value for successful promise', async () => {
    const promise = Promise.resolve('success');
    const result = await handlePromiseRejection(promise);
    expect(result).toBe('success');
  });

  it('handles rejected promise and calls error handler', async () => {
    const errorHandler = vi.fn();
    const promise = Promise.reject(new Error('Test rejection'));

    const result = await handlePromiseRejection(promise, errorHandler);
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Unhandled promise rejection:', expect.any(Error));
    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
  });

  it('handles rejected promise with default error handler', async () => {
    const promise = Promise.reject(new Error('Test rejection'));

    const result = await handlePromiseRejection(promise);
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Unhandled promise rejection:', expect.any(Error));
  });
});
