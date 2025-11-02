import { useState, useEffect, useCallback } from 'react';
import { isLocalStorageAvailable, safeJsonParse, safeJsonStringify, getUserFriendlyErrorMessage } from '../utils/errorUtils.js';

/**
 * Custom hook for persistent localStorage state management with graceful error handling
 * @param {string} key - localStorage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @param {function} onError - Optional error callback function
 * @returns {[any, function, boolean]} - [current value, setter function, isStorageAvailable]
 */
function useLocalStorage(key, defaultValue, onError = null) {
  // Check if localStorage is available
  const isStorageAvailable = isLocalStorageAvailable();

  // Initialize state with value from localStorage or default
  const [storedValue, setStoredValue] = useState(() => {
    if (!isStorageAvailable) {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? safeJsonParse(item, defaultValue) : defaultValue;
    } catch (error) {
      const friendlyMessage = getUserFriendlyErrorMessage(error, `Failed to load saved data for "${key}"`);
       
      console.warn(`Error reading localStorage key "${key}":`, error);

      if (onError) {
        onError(friendlyMessage, error);
      }

      return defaultValue;
    }
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    if (!isStorageAvailable) {
      return;
    }

    try {
      const serializedValue = safeJsonStringify(storedValue);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      const friendlyMessage = getUserFriendlyErrorMessage(error, `Failed to save data for "${key}"`);
       
      console.warn(`Error setting localStorage key "${key}":`, error);

      if (onError) {
        onError(friendlyMessage, error);
      }
    }
  }, [key, storedValue, isStorageAvailable, onError]);

  // Enhanced setter that also handles errors
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
    } catch (error) {
      const friendlyMessage = getUserFriendlyErrorMessage(error, 'Failed to update application state');
       
      console.error('Error updating state:', error);

      if (onError) {
        onError(friendlyMessage, error);
      }
    }
  }, [onError]);

  return [storedValue, setValue, isStorageAvailable];
}

export default useLocalStorage;
