import React from 'react'
import TodoItem from './TodoItem.jsx'

/**
 * TodoList component - displays a collection of todo items
 * @param {object} props - Component props
 * @param {Array} props.todos - Array of todo objects to display
 * @param {function} props.onToggle - Callback when a todo's completion status should be toggled
 * @param {function} props.onRemove - Callback when a todo should be removed
 * @param {string} props.emptyStateMessage - Optional custom message for empty state
 * @returns {JSX.Element} TodoList component
 */
function TodoList({ todos, onToggle, onRemove, emptyStateMessage }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>{emptyStateMessage || 'No todos to display'}</p>
      </div>
    )
  }

  const todoCountText = todos.length === 1 ? '(1 todo)' : `(${todos.length} todos)`

  return (
    <div className="todo-list-container">
      <div className="todo-count" aria-live="polite">
        {todoCountText}
      </div>
      <ul
        role="list"
        aria-label="Todo items"
        className="todo-list"
      >
        {todos.map((todo) => (
          <li key={todo.id}>
            <TodoItem
              todo={todo}
              onToggle={onToggle}
              onRemove={onRemove}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default React.memo(TodoList)
