import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTodoForm from '../../src/components/AddTodoForm'

// Mock the accessibility utilities
vi.mock('../../src/utils/accessibility.js', () => ({
  getAriaAttributes: vi.fn((label, describedBy, required, errorId) => ({
    'aria-label': label,
    'aria-required': required,
    ...(describedBy && { 'aria-describedby': describedBy }),
    ...(errorId && { 'aria-invalid': true, 'aria-describedby': errorId })
  })),
  announceError: vi.fn(),
  announceSuccess: vi.fn()
}))

import { announceSuccess, announceError } from '../../src/utils/accessibility.js'

describe('AddTodoForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with text input and due date input', () => {
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/task text|todo text/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add|submit|save/i })).toBeInTheDocument()
  })

  it('renders optional cancel button when onCancel provided', () => {
    render(<AddTodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('submits form with valid text and no due date', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, 'Buy groceries')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith('Buy groceries', null)
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
  })

  it('submits form with valid text and due date', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const dateInput = screen.getByLabelText(/due date/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, 'Doctor appointment')
    await user.type(dateInput, '2025-01-15')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith('Doctor appointment', '2025-01-15T00:00:00.000Z')
  })

  it('prevents submission with empty text', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.click(submitButton)

    expect(mockOnSubmit).not.toHaveBeenCalled()
    expect(screen.getByText(/required|cannot be empty/i)).toBeInTheDocument()
  })

  it('prevents submission with whitespace-only text', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, '   ')
    await user.click(submitButton)

    expect(mockOnSubmit).not.toHaveBeenCalled()
    expect(screen.getByText(/required|cannot be empty/i)).toBeInTheDocument()
  })

  it('shows validation error when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    // Form should show error on submit
    await user.click(submitButton)

    expect(screen.getByText(/required|cannot be empty/i)).toBeInTheDocument()
  })

  it('clears validation error when user starts typing', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    // Submit empty form to show error
    await user.click(submitButton)
    expect(screen.getByText(/required|cannot be empty/i)).toBeInTheDocument()

    // Start typing to clear error
    await user.type(textInput, 'a')
    expect(screen.queryByText(/required|cannot be empty/i)).not.toBeInTheDocument()
  })

  it('handles form submission via Enter key', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)

    await user.type(textInput, 'Task from Enter key{enter}')

    expect(mockOnSubmit).toHaveBeenCalledWith('Task from Enter key', null)
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const dateInput = screen.getByLabelText(/due date/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    // Fill and submit form
    await user.type(textInput, 'Test task')
    await user.type(dateInput, '2025-01-15')
    await user.click(submitButton)

    // Form should be reset
    expect(textInput.value).toBe('')
    expect(dateInput.value).toBe('')
  })

  it('maintains form values when submission fails', async () => {
    const user = userEvent.setup()

    // Mock onSubmit to always fail
    const failingOnSubmit = vi.fn(() => false)
    render(<AddTodoForm onSubmit={failingOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, 'Should remain')
    await user.click(submitButton)

    // Values should remain
    expect(textInput.value).toBe('Should remain')
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('handles invalid date input gracefully', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const dateInput = screen.getByLabelText(/due date/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, 'Task with invalid date')
    await user.type(dateInput, 'invalid-date')
    await user.click(submitButton)

    // Should still submit but date might be normalized or null
    expect(mockOnSubmit).toHaveBeenCalled()
  })

  it('disables submit button while processing', async () => {
    const user = userEvent.setup()

    // Mock onSubmit to return a promise that resolves after a delay
    const slowOnSubmit = vi.fn(() => new Promise(resolve => setTimeout(() => resolve(true), 100)))
    render(<AddTodoForm onSubmit={slowOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, 'Async task')
    await user.click(submitButton)

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled()

    // Wait for submission to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('shows loading state during async submission', async () => {
    const user = userEvent.setup()

    const slowOnSubmit = vi.fn(() => new Promise(resolve => setTimeout(() => resolve(true), 100)))
    render(<AddTodoForm onSubmit={slowOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, 'Async task')
    await user.click(submitButton)

    // Should show loading text
    expect(screen.getByText(/adding|loading|processing/i)).toBeInTheDocument()

    // Loading state should clear after submission
    await waitFor(() => {
      expect(screen.queryByText(/adding|loading|processing/i)).not.toBeInTheDocument()
    })
  })

  it('maintains focus management', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)

    // Focus should be on text input initially
    expect(document.activeElement).toBe(textInput)
  })

  it('provides proper ARIA labels and descriptions', () => {
    render(<AddTodoForm onSubmit={mockOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const dateInput = screen.getByLabelText(/due date/i)

    expect(textInput).toHaveAttribute('aria-required', 'true')
    expect(dateInput).toHaveAttribute('aria-required', 'false')
  })

  it('maintains form values when onSubmit returns false (duplicate error)', async () => {
    const user = userEvent.setup()

    // Mock onSubmit to return false (indicating duplicate)
    const duplicateOnSubmit = vi.fn(() => false)
    render(<AddTodoForm onSubmit={duplicateOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const dateInput = screen.getByLabelText(/due date/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, 'Duplicate task')
    await user.type(dateInput, '2025-01-15')
    await user.click(submitButton)

    // Form values should remain unchanged (no reset)
    expect(textInput.value).toBe('Duplicate task')
    expect(dateInput.value).toBe('2025-01-15')
    expect(duplicateOnSubmit).toHaveBeenCalledWith('Duplicate task', '2025-01-15T00:00:00.000Z')
  })

  it('handles duplicate task submission without showing internal error', async () => {
    const user = userEvent.setup()

    // Mock onSubmit to return false (duplicate)
    const duplicateOnSubmit = vi.fn(() => false)
    render(<AddTodoForm onSubmit={duplicateOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, 'Duplicate task')
    await user.click(submitButton)

    // Should not show any validation error (parent handles duplicate error)
    expect(screen.queryByText(/required|cannot be empty|duplicate|error/i)).not.toBeInTheDocument()
    expect(duplicateOnSubmit).toHaveBeenCalledWith('Duplicate task', null)
  })

  it('does not announce success when onSubmit returns false', async () => {
    const user = userEvent.setup()

    // Mock onSubmit to return false (duplicate)
    const duplicateOnSubmit = vi.fn(() => false)
    render(<AddTodoForm onSubmit={duplicateOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    await user.type(textInput, 'Duplicate task')
    await user.click(submitButton)

    // Should not announce success
    expect(announceSuccess).not.toHaveBeenCalled()
    expect(duplicateOnSubmit).toHaveBeenCalledWith('Duplicate task', null)
  })

  it('maintains form state during duplicate submission and allows retry', async () => {
    const user = userEvent.setup()

    // Mock onSubmit to return false first, then true on retry
    const retryOnSubmit = vi.fn()
      .mockReturnValueOnce(false) // First call returns false (duplicate)
      .mockReturnValueOnce(true)   // Second call returns true (success)

    render(<AddTodoForm onSubmit={retryOnSubmit} />)

    const textInput = screen.getByLabelText(/task text|todo text/i)
    const dateInput = screen.getByLabelText(/due date/i)
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })

    // First attempt - duplicate
    await user.type(textInput, 'Test task')
    await user.type(dateInput, '2025-01-15')
    await user.click(submitButton)

    // Form should not reset after first failed submission
    expect(textInput.value).toBe('Test task')
    expect(dateInput.value).toBe('2025-01-15')

    // Second attempt - success (after user modifies task)
    await user.clear(textInput)
    await user.type(textInput, 'Modified test task')
    await user.click(submitButton)

    // Form should reset after successful submission
    expect(textInput.value).toBe('')
    expect(dateInput.value).toBe('')
  })

})
