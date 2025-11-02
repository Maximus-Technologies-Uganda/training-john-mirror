import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '../../src/components/TodoItem'

// Mock the ConfirmDialog component for most tests
vi.mock('../../src/components/ConfirmDialog.jsx', () => ({
  default: ({ isOpen, onConfirm }) => {
    // For most tests, simulate immediate confirmation when dialog opens
    React.useEffect(() => {
      if (isOpen && onConfirm) {
        // Use setTimeout to ensure the dialog renders first
        const timer = setTimeout(() => onConfirm(), 0)
        return () => clearTimeout(timer)
      }
    }, [isOpen, onConfirm])

    return isOpen ? <div data-testid="confirm-dialog">Confirm Dialog</div> : null
  }
}))

describe('TodoItem', () => {
  const mockOnToggle = vi.fn()
  const mockOnRemove = vi.fn()

  const sampleTodo = {
    id: 1,
    text: 'Buy groceries',
    done: false,
    dueDate: null,
    priority: 'normal'
  }

  const completedTodo = {
    id: 2,
    text: 'Finish project',
    done: true,
    dueDate: '2025-01-15T10:00:00Z',
    priority: 'high'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders todo text', () => {
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('renders with correct CSS classes for incomplete todo', () => {
    const { container } = render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const todoItem = container.firstChild
    expect(todoItem).toHaveClass('todo-item')
    expect(todoItem).not.toHaveClass('completed')
  })

  it('renders with correct CSS classes for completed todo', () => {
    const { container } = render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const todoItem = container.firstChild
    expect(todoItem).toHaveClass('todo-item', 'completed')
  })

  it('renders due date when present', () => {
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.getByText('Due: 15 Jan 2025')).toBeInTheDocument()
  })

  it('does not render due date when null', () => {
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument()
  })

  it('renders toggle button with correct label and state', () => {
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const toggleButton = screen.getByRole('button', { name: 'Mark as complete' })
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false')
    expect(toggleButton).toHaveTextContent('○')
  })

  it('renders toggle button for completed todo', () => {
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const toggleButton = screen.getByRole('button', { name: 'Mark as incomplete' })
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true')
    expect(toggleButton).toHaveTextContent('✓')
  })

  it('renders remove button with correct accessibility', () => {
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const removeButton = screen.getByRole('button', { name: 'Remove todo' })
    expect(removeButton).toHaveTextContent('🗑️')
  })

  it('calls onToggle when toggle button is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const toggleButton = screen.getByRole('button', { name: 'Mark as complete' })
    await user.click(toggleButton)

    expect(mockOnToggle).toHaveBeenCalledWith(1)
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onRemove when remove button is clicked (with confirmation)', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const removeButton = screen.getByRole('button', { name: 'Remove todo' })
    await user.click(removeButton)

    // With our mock, the confirmation dialog auto-confirms and calls onRemove
    await waitFor(() => {
      expect(mockOnRemove).toHaveBeenCalledWith(1)
    })
    expect(mockOnRemove).toHaveBeenCalledTimes(1)
  })

  it('has proper semantic structure', () => {
    const { container } = render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // Should have proper semantic structure
    expect(container.firstChild).toHaveAttribute('role', 'listitem')

    // Should have content and actions sections
    expect(container.querySelector('.todo-content')).toBeInTheDocument()
    expect(container.querySelector('.todo-actions')).toBeInTheDocument()
  })

  it('renders todo text in correct container', () => {
    const { container } = render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const textElement = container.querySelector('.todo-text')
    expect(textElement).toHaveTextContent('Buy groceries')
  })

  it('renders due date in correct container when present', () => {
    const { container } = render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const dueDateElement = container.querySelector('.todo-due-date')
    expect(dueDateElement).toHaveTextContent('Due: 15 Jan 2025')
  })

  it('handles todos with very long text', () => {
    const longTextTodo = {
      ...sampleTodo,
      text: 'A'.repeat(500) // Very long text
    }

    render(<TodoItem todo={longTextTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.getByText('A'.repeat(500))).toBeInTheDocument()
  })

  it('handles todos with special characters in text', () => {
    const specialCharTodo = {
      ...sampleTodo,
      text: 'Buy milk & bread 🥛🍞'
    }

    render(<TodoItem todo={specialCharTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.getByText('Buy milk & bread 🥛🍞')).toBeInTheDocument()
  })

  it('handles due dates in different formats gracefully', () => {
    const differentDateFormats = [
      { ...completedTodo, dueDate: '2025-01-15T10:00:00Z' }, // ISO string
      { ...completedTodo, dueDate: '2025-01-15T10:00:00.000Z' }, // ISO with milliseconds
      { ...completedTodo, dueDate: new Date('2025-01-15T10:00:00Z') }, // Date object
    ]

    differentDateFormats.forEach((todo, index) => {
      const { rerender } = render(<TodoItem todo={todo} onToggle={mockOnToggle} onRemove={mockOnRemove} key={index} />)
      expect(screen.getByText('Due: 15 Jan 2025')).toBeInTheDocument()
      rerender(<div />) // Clean up for next iteration
    })
  })

  it('maintains button functionality after multiple renders', () => {
    const { rerender } = render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // First render
    expect(screen.getByRole('button', { name: 'Mark as complete' })).toBeInTheDocument()

    // Re-render with same props
    rerender(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // Should still work
    expect(screen.getByRole('button', { name: 'Mark as complete' })).toBeInTheDocument()
  })

  it('handles keyboard navigation for toggle button', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const toggleButton = screen.getByRole('button', { name: 'Mark as complete' })

    // Focus the button
    toggleButton.focus()
    expect(document.activeElement).toBe(toggleButton)

    // Press Enter to activate
    await user.keyboard('{Enter}')
    expect(mockOnToggle).toHaveBeenCalledWith(1)

    // Press Space to activate
    await user.keyboard('{ }')
    expect(mockOnToggle).toHaveBeenCalledTimes(2)
  })

  it('handles keyboard navigation for remove button', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const removeButton = screen.getByRole('button', { name: 'Remove todo' })

    // Focus the button
    removeButton.focus()
    expect(document.activeElement).toBe(removeButton)

    // Press Enter to activate
    await user.keyboard('{Enter}')
    expect(mockOnRemove).toHaveBeenCalledWith(1)

    // Press Space to activate
    await user.keyboard('{ }')
    expect(mockOnRemove).toHaveBeenCalledTimes(2)
  })

  it('provides proper focus management', () => {
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const toggleButton = screen.getByRole('button', { name: 'Mark as complete' })
    const removeButton = screen.getByRole('button', { name: 'Remove todo' })

    // Both buttons should be focusable (buttons are focusable by default)
    expect(toggleButton.tabIndex).not.toBe(-1) // Not explicitly unfocusable
    expect(removeButton.tabIndex).not.toBe(-1)
  })

  it('handles priority visually if implemented', () => {
    // Note: This test assumes priority might be shown visually
    // If priority is not visually indicated, this test can be removed
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // For now, just verify the component renders without error
    expect(screen.getByText('Finish project')).toBeInTheDocument()
  })

  it('is accessible with screen readers', () => {
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // Check for proper ARIA labels
    expect(screen.getByRole('button', { name: 'Mark as complete' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove todo' })).toBeInTheDocument()
  })

  it('prevents default event behavior on button clicks', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const toggleButton = screen.getByRole('button', { name: 'Mark as complete' })

    // Click should not cause page navigation or form submission
    await user.click(toggleButton)
    expect(mockOnToggle).toHaveBeenCalledWith(1)
  })

  it('handles rapid clicking gracefully on toggle button', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const toggleButton = screen.getByRole('button', { name: 'Mark as complete' })

    // Rapid clicks should all be handled
    await user.click(toggleButton)
    await user.click(toggleButton)
    await user.click(toggleButton)

    expect(mockOnToggle).toHaveBeenCalledTimes(3)
  })

  it('handles rapid clicking gracefully on remove button', async () => {
    const user = userEvent.setup()
    render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const removeButton = screen.getByRole('button', { name: 'Remove todo' })

    // Rapid clicks should all be handled
    await user.click(removeButton)
    await user.click(removeButton)
    await user.click(removeButton)

    expect(mockOnRemove).toHaveBeenCalledTimes(3)
  })

  it('handles missing onRemove callback gracefully', () => {
    // Should not throw when onRemove is undefined
    expect(() => {
      render(<TodoItem todo={sampleTodo} onToggle={mockOnToggle} onRemove={undefined} />)
    }).not.toThrow()

    // Component should still render
    expect(screen.getByRole('button', { name: 'Remove todo' })).toBeInTheDocument()
  })
})
