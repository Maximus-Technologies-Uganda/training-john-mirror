import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useLocalStorage from '../../src/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  const TEST_KEY = 'test-key'
  const TEST_VALUE = { id: 1, text: 'Test todo', completed: false }
  const DEFAULT_VALUE = []

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    localStorage.__store.clear()
    // Reset all mocks
    vi.clearAllMocks()
  })

  it('returns default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, DEFAULT_VALUE))

    expect(result.current[0]).toEqual(DEFAULT_VALUE)
    expect(result.current[2]).toBe(true) // isStorageAvailable
  })

  it('returns stored value from localStorage', () => {
    // Set up localStorage before rendering the hook
    localStorage.__store.set(TEST_KEY, JSON.stringify(TEST_VALUE))

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, DEFAULT_VALUE))

    expect(result.current[0]).toEqual(TEST_VALUE)
    expect(result.current[2]).toBe(true) // isStorageAvailable
  })

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, DEFAULT_VALUE))

    act(() => {
      result.current[1](TEST_VALUE)
    })

    expect(result.current[0]).toEqual(TEST_VALUE)
    expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(TEST_VALUE))
  })

  it('handles malformed JSON in localStorage gracefully', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    localStorage.__store.set(TEST_KEY, 'invalid json')

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, DEFAULT_VALUE))

    expect(result.current[0]).toEqual(DEFAULT_VALUE)
    expect(result.current[2]).toBe(true) // isStorageAvailable
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Error parsing JSON:',
      expect.any(SyntaxError)
    )

    consoleWarnSpy.mockRestore()
  })

  it.skip('handles localStorage setItem errors gracefully', () => {
    // Temporarily restore console.warn to spy on it
    const originalWarn = console.warn
    console.warn = vi.fn()

    const consoleWarnSpy = vi.spyOn(console, 'warn')

    // Create hook with working localStorage first
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, DEFAULT_VALUE))

    // Now mock localStorage.setItem to throw an error during operation
    const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    act(() => {
      result.current[1](TEST_VALUE)
    })

    expect(result.current[0]).toEqual(TEST_VALUE)
    expect(result.current[2]).toBe(true) // isStorageAvailable - was available initially
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Error setting localStorage key "${TEST_KEY}":`,
      expect.any(Error)
    )

    setItemSpy.mockRestore()
    console.warn = originalWarn
  })

  it.skip('handles localStorage getItem errors gracefully', () => {
    // Temporarily restore console.warn to spy on it
    const originalWarn = console.warn
    console.warn = vi.fn()

    const consoleWarnSpy = vi.spyOn(console, 'warn')

    // Create hook with working localStorage first
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, DEFAULT_VALUE))

    // Set a value first
    act(() => {
      result.current[1](TEST_VALUE)
    })

    // Now mock localStorage.getItem to throw an error during subsequent reads
    const getItemSpy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('localStorage is not available')
    })

    // Trigger a re-render to test getItem error - this should not change the current value
    act(() => {
      result.current[1](TEST_VALUE) // Setting the same value again
    })

    expect(result.current[0]).toEqual(TEST_VALUE)
    expect(result.current[2]).toBe(true) // isStorageAvailable - was available initially
    // The getItem error should be logged when trying to read during the effect
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `Error reading localStorage key "${TEST_KEY}":`,
      expect.any(Error)
    )

    getItemSpy.mockRestore()
    console.warn = originalWarn
  })

  it('persists changes across component re-renders', () => {
    const { result, rerender } = renderHook(() => useLocalStorage(TEST_KEY, DEFAULT_VALUE))

    act(() => {
      result.current[1](TEST_VALUE)
    })

    // Re-render the hook
    rerender()

    expect(result.current[0]).toEqual(TEST_VALUE)
    expect(result.current[2]).toBe(true) // isStorageAvailable
  })

  it('works with different data types', () => {
    const testCases = [
      'string value',
      42,
      true,
      null,
      { nested: { object: 'value' } },
      [1, 2, 3, 'four']
    ]

    testCases.forEach((testValue, index) => {
      const key = `${TEST_KEY}-${index}`
      const { result } = renderHook(() => useLocalStorage(key, 'default'))

      act(() => {
        result.current[1](testValue)
      })

      expect(result.current[0]).toEqual(testValue)
      expect(result.current[2]).toBe(true) // isStorageAvailable
      // Check that the value was stored (mock will have the JSON string)
      expect(localStorage.__store.get(key)).toBe(JSON.stringify(testValue))
    })
  })
})
