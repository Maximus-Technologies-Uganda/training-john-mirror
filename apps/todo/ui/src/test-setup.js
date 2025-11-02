import '@testing-library/jest-dom'

// =============================================
// Comprehensive Test Setup and Mocking
// =============================================

// Mock localStorage with proper implementation
const localStorageStore = new Map()

const localStorageMock = {
  getItem: vi.fn((key) => {
    const value = localStorageStore.get(key)
    return value !== undefined ? value : null
  }),
  setItem: vi.fn((key, value) => {
    localStorageStore.set(key, value)
  }),
  removeItem: vi.fn((key) => {
    localStorageStore.delete(key)
  }),
  clear: vi.fn(() => {
    localStorageStore.clear()
  }),
  // Expose internal store for testing
  __store: localStorageStore,
  // Computed properties
  get length() {
    return localStorageStore.size
  },
  key: vi.fn((index) => {
    const keys = Array.from(localStorageStore.keys())
    return keys[index] || null
  })
}

global.localStorage = localStorageMock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
const sessionStorageStore = new Map()

const sessionStorageMock = {
  getItem: vi.fn((key) => {
    const value = sessionStorageStore.get(key)
    return value !== undefined ? value : null
  }),
  setItem: vi.fn((key, value) => {
    sessionStorageStore.set(key, value)
  }),
  removeItem: vi.fn((key) => {
    sessionStorageStore.delete(key)
  }),
  clear: vi.fn(() => {
    sessionStorageStore.clear()
  }),
  __store: sessionStorageStore,
  get length() {
    return sessionStorageStore.size
  },
  key: vi.fn((index) => {
    const keys = Array.from(sessionStorageStore.keys())
    return keys[index] || null
  })
}

global.sessionStorage = sessionStorageMock
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

// Mock matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16))
global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id))

// Mock getComputedStyle
const originalGetComputedStyle = window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn().mockImplementation((element) => {
    // Try to call original if available, otherwise provide mock
    try {
      return originalGetComputedStyle(element)
    } catch {
      // Provide mock implementation
      return {
        getPropertyValue: vi.fn((prop) => {
          // Return reasonable defaults for common properties
          const defaults = {
            'display': 'block',
            'visibility': 'visible',
            'position': 'static',
            'background-color': 'rgba(0, 0, 0, 0)',
            'color': 'rgb(0, 0, 0)',
          }
          return defaults[prop] || ''
        }),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        color: 'rgb(0, 0, 0)',
        visibility: 'visible',
        display: 'block',
        ...element?.style,
      }
    }
  }),
})

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

Object.defineProperty(window.Element.prototype, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// Mock getBoundingClientRect
const originalGetBoundingClientRect = window.Element.prototype.getBoundingClientRect
Object.defineProperty(window.Element.prototype, 'getBoundingClientRect', {
  writable: true,
  value: vi.fn().mockImplementation(function() {
    // Try to call original if available, otherwise provide mock
    try {
      return originalGetBoundingClientRect.call(this)
    } catch {
      // Provide mock implementation
      return {
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        bottom: 100,
        right: 100,
        x: 0,
        y: 0,
        toJSON: vi.fn(),
      }
    }
  }),
})

// Mock fetch for API testing
global.fetch = vi.fn()

// Mock URL.createObjectURL and revokeObjectURL for file handling
Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mock-object-url'),
})

Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
})

// Mock console methods to reduce noise in tests
// Suppress console warnings/errors during tests unless explicitly needed
global.console.warn = vi.fn()
global.console.error = vi.fn()
global.console.info = vi.fn()

// Keep console.log for debugging when needed
// global.console.log = vi.fn()

// Mock navigator for user agent testing
Object.defineProperty(window.navigator, 'userAgent', {
  writable: true,
  value: 'MockUserAgent/1.0 (Test Environment)',
})

// Mock performance.now
Object.defineProperty(window.performance, 'now', {
  writable: true,
  value: vi.fn(() => Date.now()),
})

// Mock crypto for random values
Object.defineProperty(window.crypto, 'getRandomValues', {
  writable: true,
  value: vi.fn((array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    return array
  }),
})

// Cleanup utilities for tests
global.testCleanup = () => {
  // Clear localStorage and sessionStorage
  localStorage.clear()
  sessionStorage.clear()

  // Clear fetch mocks
  fetch.mockClear()

  // Clear IntersectionObserver mocks
  if (global.IntersectionObserver.mockClear) {
    global.IntersectionObserver.mockClear()
  }

  // Clear ResizeObserver mocks
  if (global.ResizeObserver.mockClear) {
    global.ResizeObserver.mockClear()
  }
}

// Add custom matchers for testing
expect.extend({
  toBeValidDateString(received) {
    const pass = typeof received === 'string' && !isNaN(Date.parse(received))
    return {
      message: () => `expected ${received} to be a valid date string`,
      pass,
    }
  },
})

// Export utilities for tests
global.testUtils = {
  createMockEvent: (type, options = {}) => {
    return {
      type,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      ...options,
    }
  },

  createMockKeyboardEvent: (key, options = {}) => {
    return {
      key,
      code: key,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      ...options,
    }
  },

  waitForNextTick: () => new Promise(resolve => setTimeout(resolve, 0)),
}
