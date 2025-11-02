import React, { useEffect, useRef, useCallback } from 'react'
import { trapFocus } from '../utils/accessibility.js'

/**
 * Confirmation dialog component for destructive actions
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether dialog is visible
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Confirmation message
 * @param {function} props.onConfirm - Callback when user confirms
 * @param {function} props.onCancel - Callback when user cancels
 * @param {string} [props.confirmText='Delete'] - Text for confirm button
 * @param {string} [props.cancelText='Cancel'] - Text for cancel button
 * @returns {JSX.Element|null} ConfirmDialog component or null if not open
 */
function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}) {
  const dialogRef = useRef(null)
  const confirmButtonRef = useRef(null)

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onConfirm()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
    }
  }, [onConfirm, onCancel])

  // Trap focus and prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      // Trap focus within dialog
      const cleanup = trapFocus(dialogRef.current, onCancel)

      // Focus confirm button initially
      if (confirmButtonRef.current) {
        confirmButtonRef.current.focus()
      }

      return () => {
        document.body.style.overflow = ''
        cleanup()
      }
    }
  }, [isOpen, onCancel])

  // Don't render if not open
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="confirm-dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        className="confirm-dialog"
      >
        <div className="confirm-dialog-header">
          <h2 id="confirm-dialog-title" className="confirm-dialog-title">
            {title}
          </h2>
        </div>

        <div className="confirm-dialog-body">
          <p id="confirm-dialog-message" className="confirm-dialog-message">
            {message}
          </p>
        </div>

        <div className="confirm-dialog-footer">
          <button
            type="button"
            className="confirm-dialog-cancel-btn"
            onClick={onCancel}
            aria-label={`Cancel ${title.toLowerCase()}`}
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className="confirm-dialog-confirm-btn"
            onClick={onConfirm}
            aria-label={`Confirm ${title.toLowerCase()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ConfirmDialog)
