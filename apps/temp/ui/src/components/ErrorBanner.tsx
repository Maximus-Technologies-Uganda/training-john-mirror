/**
 * ErrorBanner Component for Temperature Converter
 * 
 * Displays inline error messages with auto-dismiss functionality.
 * Used to show validation errors and conversion failures with clear,
 * dismissible messaging.
 */

import React, { useEffect, useCallback } from 'react';
import { ConversionError } from '../types/tempconverter';

export interface ErrorBannerProps {
  /** The error to display (null = no error) */
  error: ConversionError | null;
  /** Callback to clear/dismiss the error */
  onClearError: () => void;
  /** Time in milliseconds before auto-dismiss (0 = no auto-dismiss) */
  autoDismissMs?: number;
  /** Optional CSS class for styling */
  className?: string;
}

/**
 * ErrorBanner Component
 * Displays temperature converter errors with auto-dismiss
 * 
 * Accessibility Features:
 * - ARIA live region with assertive politeness level
 * - Automatic announcements for error state changes
 * - Keyboard dismissal (Escape key) with ARIA labels
 * - Semantic alert role for screen readers
 * - Screen reader-only status text
 * 
 * Features:
 * - Displays ConversionError messages
 * - Auto-dismisses after specified time
 * - Accessible (ARIA live region with announcements)
 * - Keyboard dismissible (Escape key)
 * - Visual feedback with error styling
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  error,
  onClearError,
  autoDismissMs = 5000,
  className = '',
}) => {
  // Auto-dismiss on timer
  useEffect(() => {
    if (!error || autoDismissMs <= 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onClearError();
    }, autoDismissMs);

    return () => clearTimeout(timeoutId);
  }, [error, autoDismissMs, onClearError]);

  // Keyboard dismiss (Escape key)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && error) {
        onClearError();
      }
    },
    [error, onClearError]
  );

  // Don't render if no error
  if (!error) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      aria-labelledby="error-banner-title"
      aria-describedby="error-banner-message"
      className={`error-banner ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{
        padding: '12px 16px',
        marginBottom: '16px',
        borderRadius: '4px',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        color: '#c00',
        fontSize: '14px',
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {/* Hidden title for screen readers */}
      <span id="error-banner-title" style={{ display: 'none' }}>
        Validation Error
      </span>
      
      {/* Main error message with ID for aria-describedby */}
      <span 
        id="error-banner-message"
        style={{ flex: 1 }}
      >
        {error.message}
      </span>
      <button
        onClick={onClearError}
        aria-label="Dismiss error"
        type="button"
        style={{
          background: 'none',
          border: 'none',
          color: '#c00',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '0.7';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '1';
        }}
      >
        ×
      </button>
    </div>
  );
};

ErrorBanner.displayName = 'ErrorBanner';
