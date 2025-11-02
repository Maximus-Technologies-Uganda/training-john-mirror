import React, { useCallback } from 'react'
import useTodos from '../hooks/useTodos.js'
import AddTodoForm from './AddTodoForm.jsx'
import TodoList from './TodoList.jsx'
import TodoFilters from './TodoFilters.jsx'
import { announceError, announceSuccess } from '../utils/accessibility.js'

/**
 * Main Todo Application Component
 * Provides the complete todo management interface
 */
function TodoApp() {
  const {
    todos,
    allTodos,
    filterDueToday,
    error,
    isStorageAvailable,
    todosCount,
    completedCount,
    pendingCount,
    addTodo,
    removeTodo,
    toggleTodo,
    setFilterDueToday,
    clearError
  } = useTodos()

  // Announce errors to screen readers
  React.useEffect(() => {
    if (error) {
      announceError(error)
    }
  }, [error])

  // Handle form submission for adding todos
  const handleAddTodo = useCallback((text, dueDate) => {
    return addTodo(text, dueDate)
  }, [addTodo])

  // Handle todo completion toggle
  const handleToggleTodo = useCallback((id) => {
    const success = toggleTodo(id)
    if (success) {
      const todo = allTodos.find(t => t.id === id)
      const action = todo.done ? 'marked complete' : 'marked incomplete'
      announceSuccess(`Todo ${action}`)
    }
  }, [toggleTodo, allTodos])

  // Handle todo removal
  const handleRemoveTodo = useCallback((id) => {
    const success = removeTodo(id)
    if (success) {
      announceSuccess('Todo removed')
    }
  }, [removeTodo])

  return (
    <div className="todo-app">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="todo-header">
        <h1>To-Do App</h1>
        <div className="todo-stats" aria-live="polite">
          <span>Total: {todosCount}</span>
          <span>Completed: {completedCount}</span>
          <span>Pending: {pendingCount}</span>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div
          className="todo-error"
          role="alert"
          aria-live="assertive"
        >
          <p>{error}</p>
          <button
            onClick={clearError}
            aria-label="Clear error message"
          >
            ×
          </button>
        </div>
      )}

      {/* Storage Warning */}
      {!isStorageAvailable && (
        <div
          className="todo-warning"
          role="alert"
          aria-live="polite"
        >
          <p>⚠️ Local storage is not available. Your todos will not be saved between sessions.</p>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className="todo-main">
        {/* Add Todo Form */}
        <section className="todo-add-section" aria-labelledby="add-todo-heading">
          <h2 id="add-todo-heading">Add New Todo</h2>
          <AddTodoForm onSubmit={handleAddTodo} />
        </section>

        {/* Todo Filters */}
        <TodoFilters
          filterDueToday={filterDueToday}
          onFilterChange={setFilterDueToday}
          todoCount={todosCount}
          filteredCount={todos.length}
        />

        {/* Todo List */}
        <section className="todo-list-section" aria-labelledby="todo-list-heading">
          <h2 id="todo-list-heading">
            {filterDueToday ? 'Todos Due Today' : 'All Todos'}
          </h2>
          <TodoList
            todos={todos}
            onToggle={handleToggleTodo}
            onRemove={handleRemoveTodo}
            emptyStateMessage={
              filterDueToday
                ? 'No todos are due today. Great job!'
                : 'No todos yet. Add your first todo above.'
            }
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="todo-footer">
        <p>Todo App - Manage your tasks efficiently</p>
      </footer>
    </div>
  )
}

export default React.memo(TodoApp)