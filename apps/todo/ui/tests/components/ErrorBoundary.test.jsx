import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from '../../src/components/ErrorBoundary'

// Mock console.error to avoid test output noise
const originalConsoleError = console.error
beforeAll(() => {
  console.error = vi.fn()
})

afterAll(() => {
  console.error = originalConsoleError
})

// Component that throws an error for testing
function ErrorComponent() {
  throw new Error('Test error')
  return null // eslint-disable-line no-unreachable
}

// Component that renders normally
function NormalComponent() {
  return <div>Normal component</div>
}

// Component that throws error on button click
function ErrorOnClickComponent() {
  const [shouldError, setShouldError] = React.useState(false)

  if (shouldError) {
    throw new Error('Error on click')
  }

  return (
    <button onClick={() => setShouldError(true)}>
      Trigger Error
    </button>
  )
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Normal component')).toBeInTheDocument()
  })

  it('catches errors and displays fallback UI', () => {
    // Suppress React error boundary console error in test
    const originalError = console.error
    console.error = vi.fn()

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText("We're sorry, but something unexpected happened. Please try refreshing the page.")).toBeInTheDocument()

    console.error = originalError
  })

  it('logs errors to console', () => {
    const originalError = console.error
    console.error = vi.fn()

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    )

    console.error = originalError
  })

  it('displays custom fallback UI when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('allows retry after error', async () => {
    const user = userEvent.setup()

    // Start with error component
    const { rerender } = render(
      <ErrorBoundary>
        <ErrorOnClickComponent />
      </ErrorBoundary>
    )

    // Trigger error
    const triggerButton = screen.getByRole('button', { name: 'Trigger Error' })
    await user.click(triggerButton)

    // Should show error UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Click retry button (using aria-label which matches the component)
    const retryButton = screen.getByRole('button', { name: 'Try again' })
    await user.click(retryButton)

    // Should go back to normal state (no error UI visible)
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('has accessible error UI', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    const errorContainer = screen.getByRole('alert')
    expect(errorContainer).toBeInTheDocument()
    expect(errorContainer).toHaveClass('error-boundary')
  })

  it('shows action buttons in error state', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refresh the page' })).toBeInTheDocument()
  })

  it('shows error details in development mode', () => {
    // Mock NODE_ENV
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error Details (Development Only)')).toBeInTheDocument()
    expect(screen.getByText(/Test error/)).toBeInTheDocument()

    // Restore original env
    process.env.NODE_ENV = originalEnv
  })

  it('hides error details in production mode', () => {
    // Mock NODE_ENV
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument()
    expect(screen.queryByText(/Test error/)).not.toBeInTheDocument()

    // Restore original env
    process.env.NODE_ENV = originalEnv
  })

  it('handles nested error boundaries', () => {
    render(
      <ErrorBoundary>
        <div>
          <ErrorBoundary>
            <ErrorComponent />
          </ErrorBoundary>
          <NormalComponent />
        </div>
      </ErrorBoundary>
    )

    // The inner error boundary should catch the error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    // Normal component should still render
    expect(screen.getByText('Normal component')).toBeInTheDocument()
  })

  it('maintains error state across re-renders', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    // Should show error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Rerender with normal component - ErrorBoundary should maintain error state
    rerender(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    )

    // Should still show error (ErrorBoundary doesn't auto-recover on prop changes)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.queryByText('Normal component')).not.toBeInTheDocument()
  })
})