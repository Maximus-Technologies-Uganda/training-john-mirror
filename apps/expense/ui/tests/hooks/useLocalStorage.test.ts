import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useLocalStorageNamespace, isLocalStorageAvailable, clearAllLocalStorage } from '../../src/hooks/useLocalStorage';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    );

    expect(result.current[0]).toBe('default-value');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('returns stored value when localStorage has data', () => {
    const storedValue = { data: 'stored' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedValue));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    );

    expect(result.current[0]).toEqual(storedValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
  });

  it('handles corrupted JSON data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    );

    expect(result.current[0]).toBe('default-value');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'useLocalStorage: Failed to parse localStorage key "test-key":',
      expect.any(SyntaxError)
    );

    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('handles localStorage getItem errors', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    );

    expect(result.current[0]).toBe('default-value');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'useLocalStorage: Failed to parse localStorage key "test-key":',
      expect.any(Error)
    );

    consoleWarnSpy.mockRestore();
  });

  it('saves value to localStorage when setValue is called', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    );

    const newValue = 'new-value';
    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toBe(newValue);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify(newValue)
    );
  });

  it('supports functional updates', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('initial'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default')
    );

    act(() => {
      result.current[1]((prev) => `${prev}-updated`);
    });

    expect(result.current[0]).toBe('initial-updated');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('initial-updated')
    );
  });

  it('handles localStorage setItem errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    );

    act(() => {
      result.current[1]('new-value');
    });

    // State should still be updated optimistically
    expect(result.current[0]).toBe('new-value');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'useLocalStorage: Failed to save to localStorage key "test-key":',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('handles quota exceeded errors with specific message', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const quotaError = new DOMException('Quota exceeded', 'QuotaExceededError');
    // DOMException.code is read-only, so we need to use defineProperty
    Object.defineProperty(quotaError, 'code', {
      value: 22,
      writable: false,
      configurable: true
    });
    localStorageMock.setItem.mockImplementation(() => {
      throw quotaError;
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    );

    act(() => {
      result.current[1]('new-value');
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'useLocalStorage: localStorage quota exceeded. Data will not persist.'
    );

    consoleErrorSpy.mockRestore();
  });

  it('syncs with other tabs/windows via storage event', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('initial'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default')
    );

    const newValue = 'from-other-tab';
    act(() => {
      // Simulate storage event from another tab
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'test-key',
          newValue: JSON.stringify(newValue),
        })
      );
    });

    expect(result.current[0]).toBe(newValue);
  });

  it('ignores storage events for different keys', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('initial'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default')
    );

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'other-key',
          newValue: JSON.stringify('from-other-tab'),
        })
      );
    });

    expect(result.current[0]).toBe('initial');
  });

  it('handles corrupted data in storage events', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('initial'));
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default')
    );

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'test-key',
          newValue: 'invalid-json',
        })
      );
    });

    expect(result.current[0]).toBe('initial'); // Should not change
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'useLocalStorage: Failed to parse storage event for key "test-key":',
      expect.any(SyntaxError)
    );

    consoleWarnSpy.mockRestore();
  });

  it('works with complex objects', () => {
    const complexObject = {
      id: 1,
      data: [1, 2, 3],
      nested: { key: 'value' }
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(complexObject));

    const { result } = renderHook(() =>
      useLocalStorage('complex-key', {})
    );

    expect(result.current[0]).toEqual(complexObject);

    const updatedObject = { ...complexObject, updated: true };
    act(() => {
      result.current[1](updatedObject);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'complex-key',
      JSON.stringify(updatedObject)
    );
  });

  it('preserves type safety with TypeScript', () => {
    interface TestType {
      name: string;
      count: number;
    }

    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage<TestType>('typed-key', { name: 'default', count: 0 })
    );

    expect(result.current[0]).toEqual({ name: 'default', count: 0 });

    act(() => {
      result.current[1]({ name: 'updated', count: 1 });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'typed-key',
      JSON.stringify({ name: 'updated', count: 1 })
    );
  });
});

describe('useLocalStorageNamespace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('creates namespaced keys', () => {
    const { result } = renderHook(() =>
      useLocalStorageNamespace('my-namespace')
    );

    act(() => {
      result.current.setItem('test-key', 'test-value');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'my-namespace:test-key',
      JSON.stringify('test-value')
    );
  });

  it('gets items from namespaced keys', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('stored-value'));

    const { result } = renderHook(() =>
      useLocalStorageNamespace('my-namespace')
    );

    const value = result.current.getItem('test-key', 'default');

    expect(localStorageMock.getItem).toHaveBeenCalledWith('my-namespace:test-key');
    expect(value).toBe('stored-value');
  });

  it('returns default value when namespaced key not found', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorageNamespace('my-namespace')
    );

    const value = result.current.getItem('missing-key', 'default-value');

    expect(value).toBe('default-value');
  });

  it('removes items from namespaced keys', () => {
    const { result } = renderHook(() =>
      useLocalStorageNamespace('my-namespace')
    );

    act(() => {
      result.current.removeItem('test-key');
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('my-namespace:test-key');
  });

  it('handles errors gracefully in namespace operations', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorageNamespace('my-namespace')
    );

    const value = result.current.getItem('test-key', 'default');
    expect(value).toBe('default');

    act(() => {
      result.current.setItem('test-key', 'value');
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'useLocalStorageNamespace: Failed to save test-key:',
      expect.any(DOMException)
    );

    consoleErrorSpy.mockRestore();
  });
});

describe('isLocalStorageAvailable', () => {
  it('returns true when localStorage is available', () => {
    // Temporarily mock window.localStorage to work
    const originalLocalStorage = window.localStorage;
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    const result = isLocalStorageAvailable();
    expect(result).toBe(true);

    // Restore
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it('returns false when localStorage throws errors', () => {
    const originalLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: () => { throw new Error('Not available'); },
        getItem: () => { throw new Error('Not available'); },
        removeItem: () => { throw new Error('Not available'); },
      },
      writable: true,
    });

    const result = isLocalStorageAvailable();
    expect(result).toBe(false);

    // Restore
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });
});

describe('clearAllLocalStorage', () => {
  it('clears all localStorage data', () => {
    clearAllLocalStorage();

    expect(localStorageMock.clear).toHaveBeenCalled();
  });

  it('handles errors when clearing localStorage', () => {
    localStorageMock.clear.mockImplementation(() => {
      throw new Error('Clear failed');
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    clearAllLocalStorage();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to clear localStorage:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});




