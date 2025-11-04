import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with error handling and type safety
 *
 * Provides a localStorage-backed state that automatically persists and restores data.
 * Handles JSON serialization, error recovery, and localStorage quota management.
 *
 * @template T - The type of data to store
 * @param key - localStorage key to use for persistence
 * @param initialValue - Default value if key doesn't exist or data is corrupted
 * @returns Tuple of [storedValue, setValue] similar to useState
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      // Parse JSON data
      const parsed = JSON.parse(item);
      return parsed;
    } catch (error) {
      // Handle corrupted data or parsing errors
      console.warn(`useLocalStorage: Failed to parse localStorage key "${key}":`, error);
      // Remove corrupted data to prevent future errors
      try {
        window.localStorage.removeItem(key);
      } catch (removeError) {
        console.warn(`useLocalStorage: Failed to remove corrupted key "${key}":`, removeError);
      }
      return initialValue;
    }
  });

  // Function to update stored value and persist to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // Handle localStorage errors (quota exceeded, etc.)
        console.error(`useLocalStorage: Failed to save to localStorage key "${key}":`, error);

        // For quota exceeded errors, we might want to show user feedback
        if (error instanceof DOMException && (
          error.code === 22 || // QUOTA_EXCEEDED_ERR
          error.code === 1014 || // NS_ERROR_DOM_QUOTA_REACHED
          error.name === 'QuotaExceededError'
        )) {
          console.error('useLocalStorage: localStorage quota exceeded. Data will not persist.');
          // In a real app, you might want to show a user notification here
        }

        // Update state even if localStorage fails (optimistic update)
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
      }
    },
    [key, storedValue]
  );

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`useLocalStorage: Failed to parse storage event for key "${key}":`, error);
        }
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook for managing multiple localStorage keys with a common prefix
 * Useful for namespacing related data
 */
export function useLocalStorageNamespace(namespace: string) {
  const createKey = useCallback(
    (key: string) => `${namespace}:${key}`,
    [namespace]
  );

  const getItem = useCallback(
    <T>(key: string, defaultValue: T): T => {
      try {
        const namespacedKey = createKey(key);
        const item = window.localStorage.getItem(namespacedKey);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    [createKey]
  );

  const setItem = useCallback(
    <T>(key: string, value: T): void => {
      try {
        const namespacedKey = createKey(key);
        window.localStorage.setItem(namespacedKey, JSON.stringify(value));
      } catch (error) {
        console.error(`useLocalStorageNamespace: Failed to save ${key}:`, error);
      }
    },
    [createKey]
  );

  const removeItem = useCallback(
    (key: string): void => {
      try {
        const namespacedKey = createKey(key);
        window.localStorage.removeItem(namespacedKey);
      } catch (error) {
        console.error(`useLocalStorageNamespace: Failed to remove ${key}:`, error);
      }
    },
    [createKey]
  );

  return { getItem, setItem, removeItem };
}

/**
 * Utility function to check if localStorage is available
 * Useful for server-side rendering or environments without localStorage
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears all localStorage data (use with caution)
 */
export function clearAllLocalStorage(): void {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
