/**
 * Utility functions for graceful error handling and fallbacks
 */

/**
 * Safely executes a function with error handling and fallback
 * @param {Function} fn - Function to execute
 * @param {*} fallback - Fallback value to return on error
 * @param {string} errorMessage - Optional error message for logging
 * @returns {*} Result of function or fallback value
 */
export function safeExecute(fn, fallback = null, errorMessage = '') {
  try {
    return fn()
  } catch (error) {
    if (errorMessage) {
      // eslint-disable-next-line no-console
      console.error(errorMessage, error)
    }
    return fallback
  }
}

/**
 * Safely parses JSON with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback
 */
export function safeJsonParse(jsonString, fallback = null) {
  return safeExecute(
    () => JSON.parse(jsonString),
    fallback,
    'Error parsing JSON:'
  )
}

/**
 * Safely stringifies object to JSON with fallback
 * @param {*} obj - Object to stringify
 * @param {string} fallback - Fallback string if stringify fails
 * @returns {string} JSON string or fallback
 */
export function safeJsonStringify(obj, fallback = '{}') {
  return safeExecute(
    () => JSON.stringify(obj),
    fallback,
    'Error stringifying JSON:'
  )
}

/**
 * Creates a retry mechanism for operations that might fail
 * @param {Function} operation - Operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} Promise that resolves with operation result or rejects
 */
export async function withRetry(operation, maxRetries = 3, delay = 1000) {
  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Handles localStorage operations with graceful fallbacks
 */
export const localStorageUtils = {
  /**
   * Safely gets an item from localStorage
   * @param {string} key - Storage key
   * @param {*} fallback - Fallback value
   * @returns {*} Stored value or fallback
   */
  getItem: (key, fallback = null) => {
    return safeExecute(
      () => {
        const item = localStorage.getItem(key)
        return item ? safeJsonParse(item, fallback) : fallback
      },
      fallback,
      `Error reading from localStorage key "${key}":`
    )
  },

  /**
   * Safely sets an item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  setItem: (key, value) => {
    return safeExecute(
      () => {
        localStorage.setItem(key, safeJsonStringify(value))
        return true
      },
      false,
      `Error writing to localStorage key "${key}":`
    )
  },

  /**
   * Safely removes an item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  removeItem: (key) => {
    return safeExecute(
      () => {
        localStorage.removeItem(key)
        return true
      },
      false,
      `Error removing localStorage key "${key}":`
    )
  },

  /**
   * Checks if localStorage is available
   * @returns {boolean} Whether localStorage is available
   */
  isAvailable: () => {
    return safeExecute(
      () => {
        const testKey = '__storage_test__'
        localStorage.setItem(testKey, 'test')
        localStorage.removeItem(testKey)
        return true
      },
      false,
      'localStorage is not available:'
    )
  }
}

/**
 * Creates a debounced version of a function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * Handles unhandled promise rejections
 * @param {Promise} promise - Promise to handle
 * @param {Function} onError - Error handler function
 * @returns {Promise} Promise with error handling
 */
export function handlePromiseRejection(promise, onError = () => {}) {
  return promise.catch(error => {
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection:', error)
    onError(error)
    return null // Return null to prevent further propagation
  })
}
