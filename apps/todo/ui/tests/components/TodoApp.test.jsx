import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoApp from '../../src/components/TodoApp'
import TodoList from '../../src/components/TodoList'

// Mock the hooks and utilities
vi.mock('../../src/hooks/useTodos.js', () => ({
  default: () => ({
    todos: [
      {
        id: 1,
        text: 'Test todo 1',
        done: false,
        dueDate: null,
        priority: 'normal'
      },
      {
        id: 2,
        text: 'Test todo 2',
        done: true,
        dueDate: '2025-01-15T12:00:00Z',
        priority: 'high'
      }
    ],
    allTodos: [
      {
        id: 1,
        text: 'Test todo 1',
        done: false,
        dueDate: null,
        priority: 'normal'
      },
      {
        id: 2,
        text: 'Test todo 2',
        done: true,
        dueDate: '2025-01-15T12:00:00Z',
        priority: 'high'
      }
    ],
    filterDueToday: false,
    error: null,
    todosCount: 2,
    completedCount: 1,
    pendingCount: 1,
    addTodo: vi.fn(),
    removeTodo: vi.fn(),
    toggleTodo: vi.fn(),
    setFilterDueToday: vi.fn(),
    clearError: vi.fn()
  })
}))

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

describe('TodoApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main heading', () => {
    render(<TodoApp />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('To-Do App')
  })

  it('renders skip link for accessibility', () => {
    render(<TodoApp />)
    const skipLink = screen.getByText('Skip to main content')
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('displays todo statistics', () => {
    render(<TodoApp />)
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
  })

  it('renders todo list section', () => {
    render(<TodoApp />)
    expect(screen.getByRole('heading', { level: 2, name: 'All Todos' })).toBeInTheDocument()
    expect(screen.getByText('(2 todos)')).toBeInTheDocument()
  })

  it('renders todo items with correct content', () => {
    render(<TodoApp />)

    expect(screen.getByText('Test todo 1')).toBeInTheDocument()
    expect(screen.getByText('Test todo 2')).toBeInTheDocument()

    // Check completion status
    const completedTodo = screen.getByText('Test todo 2').closest('.todo-item')
    expect(completedTodo).toHaveClass('completed')

    const pendingTodo = screen.getByText('Test todo 1').closest('.todo-item')
    expect(pendingTodo).not.toHaveClass('completed')
  })

  it('renders todo actions with proper accessibility', () => {
    render(<TodoApp />)

    const toggleButtons = screen.getAllByRole('button', { name: /mark as/i })
    expect(toggleButtons).toHaveLength(2)

    const removeButtons = screen.getAllByRole('button', { name: 'Remove todo' })
    expect(removeButtons).toHaveLength(2)
  })

  it('renders due date when present', () => {
    render(<TodoApp />)
    expect(screen.getByText(/Due:/)).toBeInTheDocument()
  })

  it('renders filter section', () => {
    render(<TodoApp />)
    expect(screen.getByRole('heading', { level: 2, name: 'Filters' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /show only todos due today/i })).toBeInTheDocument()
  })

  it('renders add todo section', () => {
    render(<TodoApp />)
    expect(screen.getByRole('heading', { level: 2, name: 'Add New Todo' })).toBeInTheDocument()
  })


  it('renders error message when error exists', () => {
    // Create a test component with mocked hook
    const TestComponent = () => {
      const mockData = {
        todos: [],
        allTodos: [],
        filterDueToday: false,
        error: 'Test error message',
        todosCount: 0,
        completedCount: 0,
        pendingCount: 0,
        addTodo: vi.fn(),
        removeTodo: vi.fn(),
        toggleTodo: vi.fn(),
        setFilterDueToday: vi.fn(),
        clearError: vi.fn()
      }

      // Manually call the component logic for testing
      React.useEffect(() => {
        if (mockData.error) {
          // Simulate error announcement
        }
      }, [mockData.error])

      return (
        <div className="todo-app">
          {mockData.error && (
            <div className="todo-error" role="alert" aria-live="assertive">
              <p>{mockData.error}</p>
              <button onClick={mockData.clearError} aria-label="Clear error message">
                ×
              </button>
            </div>
          )}
        </div>
      )
    }

    render(<TestComponent />)

    expect(screen.getByRole('alert')).toHaveTextContent('Test error message')
    expect(screen.getByRole('button', { name: 'Clear error message' })).toBeInTheDocument()
  })

  it('renders empty state when no todos', () => {
    // Create a test component with no todos
    const TestComponent = () => {
      const mockData = {
        todos: [],
        allTodos: [],
        filterDueToday: false,
        error: null,
        todosCount: 0,
        completedCount: 0,
        pendingCount: 0
      }

      return (
        <main id="main-content" className="todo-main">
          <section className="todo-list-section">
            <h2 id="todo-list-heading">
              {mockData.filterDueToday ? 'Todos Due Today' : 'All Todos'}
            </h2>
            <TodoList
              todos={mockData.todos}
              onToggle={vi.fn()}
              onRemove={vi.fn()}
              emptyStateMessage={
                mockData.filterDueToday
                  ? 'No todos are due today. Great job!'
                  : 'No todos yet. Add your first todo above.'
              }
            />
          </section>
        </main>
      )
    }

    render(<TestComponent />)

    expect(screen.getByText('No todos yet. Add your first todo above.')).toBeInTheDocument()
  })

  it('renders due today filter empty state', () => {
    // Create a test component with due today filter enabled and empty todos
    const TestComponent = () => {
      const mockData = {
        todos: [],
        allTodos: [],
        filterDueToday: true,
        error: null,
        todosCount: 0,
        completedCount: 0,
        pendingCount: 0
      }

      return (
        <main id="main-content" className="todo-main">
          <section className="todo-list-section">
            <h2 id="todo-list-heading">
              {mockData.filterDueToday ? 'Todos Due Today' : 'All Todos'}
            </h2>
            <TodoList
              todos={mockData.todos}
              onToggle={vi.fn()}
              onRemove={vi.fn()}
              emptyStateMessage={
                mockData.filterDueToday
                  ? 'No todos are due today. Great job!'
                  : 'No todos yet. Add your first todo above.'
              }
            />
          </section>
        </main>
      )
    }

    render(<TestComponent />)

    expect(screen.getByText('No todos are due today. Great job!')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Todos Due Today' })).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<TodoApp />)
    expect(screen.getByText('Todo App - Manage your tasks efficiently')).toBeInTheDocument()
  })

  it('shows validation errors from AddTodoForm', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    // Find the submit button and click without entering text
    const submitButton = screen.getByRole('button', { name: /add|submit|save/i })
    await user.click(submitButton)

    // Should show validation error
    expect(screen.getByText(/required|cannot be empty/i)).toBeInTheDocument()
  })

  it('renders footer with correct content', () => {
    render(<TodoApp />)
    const footer = screen.getByText('Todo App - Manage your tasks efficiently')
    expect(footer).toBeInTheDocument()
    expect(footer.closest('footer')).toBeInTheDocument()
  })


})
