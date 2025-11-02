import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoFilters from '../../src/components/TodoFilters'

describe('TodoFilters', () => {
  const defaultProps = {
    filterDueToday: false,
    onFilterChange: vi.fn(),
    todoCount: 5,
    filteredCount: 5
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders filter checkbox with correct label', () => {
    render(<TodoFilters {...defaultProps} />)

    expect(screen.getByRole('checkbox', { name: /show only todos due today/i })).toBeInTheDocument()
    expect(screen.getByText('Show only todos due today')).toBeInTheDocument()
  })

  it('displays checkbox unchecked when filterDueToday is false', () => {
    render(<TodoFilters {...defaultProps} filterDueToday={false} />)

    const checkbox = screen.getByRole('checkbox', { name: /show only todos due today/i })
    expect(checkbox).not.toBeChecked()
  })

  it('displays checkbox checked when filterDueToday is true', () => {
    render(<TodoFilters {...defaultProps} filterDueToday={true} />)

    const checkbox = screen.getByRole('checkbox', { name: /show only todos due today/i })
    expect(checkbox).toBeChecked()
  })

  it('calls onFilterChange when checkbox is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoFilters {...defaultProps} />)

    const checkbox = screen.getByRole('checkbox', { name: /show only todos due today/i })
    await user.click(checkbox)

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(true)
    expect(defaultProps.onFilterChange).toHaveBeenCalledTimes(1)
  })

  it('calls onFilterChange with false when unchecking', async () => {
    const user = userEvent.setup()
    render(<TodoFilters {...defaultProps} filterDueToday={true} />)

    const checkbox = screen.getByRole('checkbox', { name: /show only todos due today/i })
    await user.click(checkbox)

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(false)
    expect(defaultProps.onFilterChange).toHaveBeenCalledTimes(1)
  })

  it('displays total todo count', () => {
    render(<TodoFilters {...defaultProps} todoCount={10} filteredCount={10} />)

    expect(screen.getByText('Total: 10 todos')).toBeInTheDocument()
  })

  it('displays filtered count when different from total', () => {
    render(<TodoFilters {...defaultProps} todoCount={10} filteredCount={3} />)

    expect(screen.getByText('Showing 3 of 10 todos')).toBeInTheDocument()
  })

  it('displays only total count when counts are the same', () => {
    render(<TodoFilters {...defaultProps} todoCount={5} filteredCount={5} />)

    expect(screen.getByText('Total: 5 todos')).toBeInTheDocument()
    expect(screen.queryByText(/showing/i)).not.toBeInTheDocument()
  })

  it('handles singular todo count', () => {
    render(<TodoFilters {...defaultProps} todoCount={1} filteredCount={1} />)

    expect(screen.getByText('Total: 1 todo')).toBeInTheDocument()
  })

  it('handles zero todos', () => {
    render(<TodoFilters {...defaultProps} todoCount={0} filteredCount={0} />)

    expect(screen.getByText('Total: 0 todos')).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    const { container } = render(<TodoFilters {...defaultProps} />)

    // Should have a section with proper heading
    const section = container.firstChild
    expect(section).toHaveAttribute('aria-labelledby')

    // Should have heading that matches aria-labelledby
    const headingId = section.getAttribute('aria-labelledby')
    expect(screen.getByRole('heading', { name: 'Filters' })).toHaveAttribute('id', headingId)
  })

  it('provides descriptive text for screen readers', () => {
    render(<TodoFilters {...defaultProps} />)

    expect(screen.getByText('When enabled, only shows todos that are due today. Todos without due dates are hidden.')).toBeInTheDocument()
  })

  it('is keyboard accessible', async () => {
    const user = userEvent.setup()
    render(<TodoFilters {...defaultProps} />)

    const checkbox = screen.getByRole('checkbox', { name: /show only todos due today/i })

    // Focus the checkbox
    checkbox.focus()
    expect(document.activeElement).toBe(checkbox)

    // Press space to toggle
    await user.keyboard('{ }')
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(true)
  })

  it('handles rapid clicking', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<TodoFilters {...defaultProps} />)

    const checkbox = screen.getByRole('checkbox', { name: /show only todos due today/i })

    // First click - should call onFilterChange with true
    await user.click(checkbox)
    expect(defaultProps.onFilterChange).toHaveBeenLastCalledWith(true)

    // Re-render with updated state
    rerender(<TodoFilters {...defaultProps} filterDueToday={true} />)

    // Second click - should call onFilterChange with false
    await user.click(checkbox)
    expect(defaultProps.onFilterChange).toHaveBeenLastCalledWith(false)

    // Re-render with updated state
    rerender(<TodoFilters {...defaultProps} filterDueToday={false} />)

    // Third click - should call onFilterChange with true
    await user.click(checkbox)
    expect(defaultProps.onFilterChange).toHaveBeenLastCalledWith(true)

    expect(defaultProps.onFilterChange).toHaveBeenCalledTimes(3)
  })

  it('shows clear filter button when filter is active', () => {
    render(<TodoFilters {...defaultProps} filterDueToday={true} />)

    expect(screen.getByRole('button', { name: 'Clear filter and show all todos' })).toBeInTheDocument()
  })

  it('hides clear filter button when filter is inactive', () => {
    render(<TodoFilters {...defaultProps} filterDueToday={false} />)

    expect(screen.queryByRole('button', { name: 'Clear filter and show all todos' })).not.toBeInTheDocument()
  })

  it('calls onFilterChange with false when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoFilters {...defaultProps} filterDueToday={true} />)

    const clearButton = screen.getByRole('button', { name: 'Clear filter and show all todos' })
    await user.click(clearButton)

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith(false)
    expect(defaultProps.onFilterChange).toHaveBeenCalledTimes(1)
  })

  it('updates display when props change', () => {
    const { rerender, container } = render(<TodoFilters {...defaultProps} filterDueToday={false} />)

    expect(screen.getByRole('checkbox', { name: /show only todos due today/i })).not.toBeChecked()
    expect(screen.queryByRole('button', { name: 'Clear filter and show all todos' })).not.toBeInTheDocument()
    expect(container.querySelector('.todo-filters')).not.toHaveClass('todo-filters--active')

    rerender(<TodoFilters {...defaultProps} filterDueToday={true} />)

    expect(screen.getByRole('checkbox', { name: /show only todos due today/i })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Clear filter and show all todos' })).toBeInTheDocument()
    expect(container.querySelector('.todo-filters')).toHaveClass('todo-filters--active')
  })

  it('shows visual feedback when filter is active', () => {
    const { container } = render(<TodoFilters {...defaultProps} filterDueToday={true} />)

    const filtersContainer = container.querySelector('.todo-filters')
    expect(filtersContainer).toHaveClass('todo-filters--active')
  })

  it('does not show visual feedback when filter is inactive', () => {
    const { container } = render(<TodoFilters {...defaultProps} filterDueToday={false} />)

    const filtersContainer = container.querySelector('.todo-filters')
    expect(filtersContainer).not.toHaveClass('todo-filters--active')
  })
})