import React, { useState, useRef, useEffect, useCallback } from 'react'
import { getAriaAttributes, announceError, announceSuccess } from '../utils/accessibility.js'
import { formatDateISO } from '../utils/dateUtils.js'

/**
 * Form component for adding new todo items
 * @param {object} props - Component props
 * @param {function} props.onSubmit - Callback when form is submitted (text, dueDate) => boolean
 * @param {function} props.onCancel - Optional callback when cancel is clicked
 * @returns {JSX.Element} AddTodoForm component
 */
function AddTodoForm({ onSubmit, onCancel }) {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textInputRef = useRef(null)
  const formId = useRef(`add-todo-form-${Date.now()}`)

  // Focus text input on mount
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus()
    }
  }, [])

  // Clear error when user starts typing
  const handleTextChange = useCallback((e) => {
    const value = e.target.value
    setText(value)
    if (error && value.trim()) {
      setError('')
    }
  }, [error])

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    // Validate text
    const trimmedText = text.trim()
    if (!trimmedText) {
      const errorMsg = 'Error: To-do text is required.'
      setError(errorMsg)
      announceError(errorMsg)
      return
    }

    // Clear any existing error
    setError('')
    setIsSubmitting(true)

    try {
      // Normalize due date to ISO string or null
      const normalizedDueDate = dueDate ? formatDateISO(dueDate) : null

      // Call onSubmit and wait for result
      const success = await onSubmit(trimmedText, normalizedDueDate)

      // Consider undefined as success (for backward compatibility with tests)
      // Only explicit false means failure
      if (success !== false) {
        // Reset form on success
        setText('')
        setDueDate('')
        announceSuccess('Todo added successfully')
      }
      // If success is false, the parent component should handle showing the error
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error submitting todo:', error)
      const errorMsg = 'Error: Failed to add todo item.'
      setError(errorMsg)
      announceError(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }, [text, dueDate, onSubmit])

  // Handle Enter key submission
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }, [handleSubmit])

  // Handle cancel
  const handleCancel = useCallback(() => {
    setText('')
    setDueDate('')
    setError('')
    if (onCancel) {
      onCancel()
    }
  }, [onCancel])

  // Generate ARIA attributes
  const textAriaAttributes = getAriaAttributes(
    'Task text',
    error ? `${formId.current}-error` : null,
    true,
    error ? `${formId.current}-error` : null
  )

  const dateAriaAttributes = getAriaAttributes(
    'Due date (optional)',
    null,
    false
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="add-todo-form"
      aria-labelledby={`${formId.current}-heading`}
    >
      <div className="form-group">
        <label
          htmlFor={`${formId.current}-text`}
          id={`${formId.current}-text-label`}
        >
          Task Text
        </label>
        <input
          {...textAriaAttributes}
          ref={textInputRef}
          id={`${formId.current}-text`}
          type="text"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          placeholder="Enter your task..."
          className={`form-input ${error ? 'form-input--error' : ''}`}
        />
        {error && (
          <div
            id={`${formId.current}-error`}
            className="form-error"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
      </div>

      <div className="form-group">
        <label
          htmlFor={`${formId.current}-date`}
          id={`${formId.current}-date-label`}
        >
          Due Date (Optional)
        </label>
        <input
          {...dateAriaAttributes}
          id={`${formId.current}-date`}
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isSubmitting}
          className="form-input"
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary ${isSubmitting ? 'btn--loading' : ''}`}
          aria-describedby={isSubmitting ? `${formId.current}-loading` : null}
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}

        {isSubmitting && (
          <span
            id={`${formId.current}-loading`}
            className="sr-only"
            aria-live="polite"
          >
            Submitting task...
          </span>
        )}
      </div>
    </form>
  )
}

export default React.memo(AddTodoForm)
