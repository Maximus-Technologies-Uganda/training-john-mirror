import React, { useState } from 'react'
import { formatDateDisplay } from '../utils/dateUtils.js'
import ConfirmDialog from './ConfirmDialog.jsx'

/**
 * Individual todo item component
 * Displays a single todo with toggle and remove functionality
 * @param {object} props - Component props
 * @param {object} props.todo - Todo item data
 * @param {number} props.todo.id - Unique todo identifier
 * @param {string} props.todo.text - Todo description text
 * @param {boolean} props.todo.done - Completion status
 * @param {string|null} props.todo.dueDate - Due date in ISO string format
 * @param {string} props.todo.priority - Priority level ('normal' | 'high')
 * @param {function} props.onToggle - Callback when toggle button is clicked (receives todo.id)
 * @param {function} props.onRemove - Callback when remove button is clicked (receives todo.id)
 * @returns {JSX.Element} TodoItem component
 */
function TodoItem({ todo, onToggle, onRemove }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleToggle = () => {
    onToggle(todo.id)
  }

  const handleRemoveClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmRemove = () => {
    onRemove(todo.id)
    setShowConfirmDialog(false)
  }

  const handleCancelRemove = () => {
    setShowConfirmDialog(false)
  }

  const handleToggleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle()
    }
  }

  const handleRemoveKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleRemoveClick()
    }
  }

  return (
    <div
      className={`todo-item ${todo.done ? 'completed' : ''}`}
      role="listitem"
    >
      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>
        {todo.dueDate && (
          <span className="todo-due-date">
            Due: {formatDateDisplay(todo.dueDate)}
          </span>
        )}
      </div>
      <div className="todo-actions">
        <button
          className="todo-toggle-btn"
          onClick={handleToggle}
          onKeyDown={handleToggleKeyDown}
          aria-label={todo.done ? 'Mark as incomplete' : 'Mark as complete'}
          aria-pressed={todo.done}
          type="button"
        >
          {todo.done ? '✓' : '○'}
        </button>
        <button
          className="todo-remove-btn"
          onClick={handleRemoveClick}
          onKeyDown={handleRemoveKeyDown}
          aria-label="Remove todo"
          type="button"
        >
          🗑️
        </button>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Todo"
        message={`Are you sure you want to delete "${todo.text}"? This action cannot be undone.`}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default React.memo(TodoItem)
