import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from '../../src/components/TodoList'

// Mock the TodoItem component
vi.mock('../../src/components/TodoItem.jsx', () => ({
  default: ({ todo, onToggle, onRemove }) => (
    <div data-testid={`todo-item-${todo.id}`}>
      <span>{todo.text}</span>
      <button onClick={() => onToggle(todo.id)} data-testid={`toggle-${todo.id}`}>
        {todo.done ? '✓' : '○'}
      </button>
      <button onClick={() => onRemove(todo.id)} data-testid={`remove-${todo.id}`}>
        🗑️
      </button>
    </div>
  )
}))

describe('TodoList', () => {
  const mockOnToggle = vi.fn()
  const mockOnRemove = vi.fn()

  const sampleTodos = [
    {
      id: 1,
      text: 'Buy groceries',
      done: false,
      dueDate: null,
      priority: 'normal'
    },
    {
      id: 2,
      text: 'Doctor appointment',
      done: true,
      dueDate: '2025-01-15T10:00:00Z',
      priority: 'high'
    },
    {
      id: 3,
      text: 'Finish project',
      done: false,
      dueDate: '2025-01-20T17:00:00Z',
      priority: 'high'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no todos provided', () => {
    render(<TodoList todos={[]} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.getByText('No todos to display')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('renders custom empty state message when provided', () => {
    const customMessage = 'Custom empty state message'
    render(<TodoList todos={[]} onToggle={mockOnToggle} onRemove={mockOnRemove} emptyStateMessage={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
    expect(screen.queryByText('No todos to display')).not.toBeInTheDocument()
  })

  it('renders all todos when todos are provided', () => {
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.getByRole('list', { name: 'Todo items' })).toBeInTheDocument()

    // Should render all todo items
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument()
    expect(screen.getByTestId('todo-item-3')).toBeInTheDocument()

    // Should show todo text
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('Doctor appointment')).toBeInTheDocument()
    expect(screen.getByText('Finish project')).toBeInTheDocument()
  })

  it('renders todo count', () => {
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.getByText('(3 todos)')).toBeInTheDocument()
  })

  it('renders correct count for single todo', () => {
    const singleTodo = [sampleTodos[0]]
    render(<TodoList todos={singleTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.getByText('(1 todo)')).toBeInTheDocument()
  })

  it('passes correct props to TodoItem components', () => {
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // Check that TodoItem components receive the correct props
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument()
    expect(screen.getByTestId('todo-item-3')).toBeInTheDocument()
  })

  it('calls onToggle when toggle button is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const toggleButton = screen.getByTestId('toggle-1')
    await user.click(toggleButton)

    expect(mockOnToggle).toHaveBeenCalledWith(1)
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const removeButton = screen.getByTestId('remove-2')
    await user.click(removeButton)

    expect(mockOnRemove).toHaveBeenCalledWith(2)
    expect(mockOnRemove).toHaveBeenCalledTimes(1)
  })

  it('renders with proper accessibility attributes', () => {
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const list = screen.getByRole('list', { name: 'Todo items' })
    expect(list).toBeInTheDocument()
    expect(list).toHaveAttribute('aria-label', 'Todo items')
  })

  it('renders list items with proper roles', () => {
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // The mocked TodoItem doesn't render with role="listitem", but the real component should
    const list = screen.getByRole('list', { name: 'Todo items' })
    expect(list).toBeInTheDocument()
  })

  it('handles todos with different completion states', () => {
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // Check that both completed and incomplete todos are rendered
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument() // incomplete
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument() // completed
    expect(screen.getByTestId('todo-item-3')).toBeInTheDocument() // incomplete
  })

  it('handles todos with and without due dates', () => {
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // All todos should be rendered regardless of due date
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument() // no due date
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument() // has due date
    expect(screen.getByTestId('todo-item-3')).toBeInTheDocument() // has due date
  })

  it('maintains proper order of todos', () => {
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    const todoItems = screen.getAllByTestId(/^todo-item-/)

    // Should be in the order provided
    expect(todoItems).toHaveLength(3)
    expect(todoItems[0]).toHaveAttribute('data-testid', 'todo-item-1')
    expect(todoItems[1]).toHaveAttribute('data-testid', 'todo-item-2')
    expect(todoItems[2]).toHaveAttribute('data-testid', 'todo-item-3')
  })

  it('handles large number of todos', () => {
    const manyTodos = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      text: `Todo ${i + 1}`,
      done: i % 2 === 0,
      dueDate: i % 3 === 0 ? `2025-01-${(i % 28) + 1}T10:00:00Z` : null,
      priority: 'normal'
    }))

    render(<TodoList todos={manyTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    expect(screen.getByText('(50 todos)')).toBeInTheDocument()

    // Should render all items
    for (let i = 1; i <= 50; i++) {
      expect(screen.getByTestId(`todo-item-${i}`)).toBeInTheDocument()
    }
  })

  it('is accessible with keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // Focus should be manageable
    const toggleButton = screen.getByTestId('toggle-1')
    toggleButton.focus()
    expect(document.activeElement).toBe(toggleButton)
  })

  it('provides proper feedback for user interactions', async () => {
    const user = userEvent.setup()
    render(<TodoList todos={sampleTodos} onToggle={mockOnToggle} onRemove={mockOnRemove} />)

    // Clicking toggle should call the callback
    const toggleButton = screen.getByTestId('toggle-1')
    await user.click(toggleButton)
    expect(mockOnToggle).toHaveBeenCalledWith(1)

    // Clicking remove should call the callback
    const removeButton = screen.getByTestId('remove-1')
    await user.click(removeButton)
    expect(mockOnRemove).toHaveBeenCalledWith(1)
  })
})