/**
 * Utility functions for error handling and graceful degradation
 */

/**
 * Safely execute a function and return a fallback value on error
 * @param {function} fn - Function to execute
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
      console.warn(errorMessage, error)
    }
    return fallback
  }
}

/**
 * Check if localStorage is available and functional
 * @returns {boolean} True if localStorage is available
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Safely parse JSON with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed JSON or fallback value
 */
export function safeJsonParse(jsonString, fallback = null) {
  return safeExecute(
    () => JSON.parse(jsonString),
    fallback,
    'Error parsing JSON:'
  )
}

/**
 * Safely stringify JSON with fallback
 * @param {*} value - Value to stringify
 * @param {string} fallback - Fallback string if stringification fails
 * @returns {string} JSON string or fallback value
 */
export function safeJsonStringify(value, fallback = 'null') {
  return safeExecute(
    () => JSON.stringify(value),
    fallback,
    'Error stringifying JSON:'
  )
}

/**
 * Create a user-friendly error message from an error object
 * @param {Error|string} error - Error object or message
 * @param {string} fallback - Fallback message if error processing fails
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyErrorMessage(error, fallback = 'An unexpected error occurred') {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.name === 'QuotaExceededError') {
      return 'Storage limit exceeded. Please clear some space and try again.'
    }

    if (error.name === 'NetworkError') {
      return 'Network error. Please check your connection and try again.'
    }

    // Return the error message if it's user-friendly
    if (error.message && error.message.length < 100) {
      return error.message
    }
  }

  return fallback
}
