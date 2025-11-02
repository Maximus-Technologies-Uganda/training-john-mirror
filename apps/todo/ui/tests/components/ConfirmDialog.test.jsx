import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from '../../src/components/ConfirmDialog'

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    confirmText: 'Delete',
    cancelText: 'Cancel'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dialog when isOpen is true', () => {
    render(<ConfirmDialog {...defaultProps} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete Item')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm delete item' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel delete item' })).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)

    const confirmButton = screen.getByRole('button', { name: 'Confirm delete item' })
    await user.click(confirmButton)

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)

    const cancelButton = screen.getByRole('button', { name: 'Cancel delete item' })
    await user.click(cancelButton)

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when Enter key is pressed', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    dialog.focus()
    await user.keyboard('{Enter}')

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape key is pressed', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    dialog.focus()
    await user.keyboard('{Escape}')

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
  })

  it('uses custom button text', () => {
    render(<ConfirmDialog {...defaultProps} confirmText="Yes" cancelText="No" />)

    expect(screen.getByRole('button', { name: 'Confirm delete item' })).toHaveTextContent('Yes')
    expect(screen.getByRole('button', { name: 'Cancel delete item' })).toHaveTextContent('No')
  })

  it('has proper ARIA attributes', () => {
    render(<ConfirmDialog {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'confirm-dialog-message')

    expect(screen.getByText('Delete Item')).toHaveAttribute('id', 'confirm-dialog-title')
    expect(screen.getByText('Are you sure you want to delete this item?')).toHaveAttribute('id', 'confirm-dialog-message')
  })

  it('renders with custom content', () => {
    const customProps = {
      ...defaultProps,
      title: 'Custom Title',
      message: 'Custom message with special characters: éñü',
      confirmText: 'Confirm',
      cancelText: 'Abort'
    }

    render(<ConfirmDialog {...customProps} />)

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom message with special characters: éñü')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm custom title' })).toHaveTextContent('Confirm')
    expect(screen.getByRole('button', { name: 'Cancel custom title' })).toHaveTextContent('Abort')
  })

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      isOpen: true,
      title: 'Test',
      message: 'Test message',
      onConfirm: vi.fn(),
      onCancel: vi.fn()
    }

    render(<ConfirmDialog {...minimalProps} />)

    expect(screen.getByRole('button', { name: 'Confirm test' })).toHaveTextContent('Delete')
    expect(screen.getByRole('button', { name: 'Cancel test' })).toHaveTextContent('Cancel')
  })

  it('focuses confirm button when dialog opens', () => {
    render(<ConfirmDialog {...defaultProps} />)

    const confirmButton = screen.getByRole('button', { name: 'Confirm delete item' })
    expect(document.activeElement).toBe(confirmButton)
  })
})
