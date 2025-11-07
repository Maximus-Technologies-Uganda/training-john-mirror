/**
 * ErrorBanner Component
 * 
 * Displays inline error messages with auto-dismiss capability
 * Used to show validation errors and state transition errors to users
 */

import React, { useEffect, useState } from 'react';
import type { StopwatchStatus } from '../types/stopwatch';

export interface ErrorBannerProps {
  /** Stopwatch status containing error information */
  status: StopwatchStatus;
  /** Callback to clear the error */
  onClearError: () => void;
  /** Auto-dismiss timeout in milliseconds (0 = no auto-dismiss) */
  autoDismissMs?: number;
  /** Optional CSS class for styling */
  className?: string;
}

/**
 * ErrorBanner Component
 * 
 * Renders an error message banner if an error is present in the status.
 * Automatically dismisses the error after a specified timeout.
 * 
 * Features:
 * - Shows/hides based on status.hasError
 * - Auto-dismiss after configurable timeout
 * - Clear button for manual dismissal
 * - Accessible with ARIA attributes
 * - Smooth fade in/out animation
 */
export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  status,
  onClearError,
  autoDismissMs = 5000,
  className = '',
}) => {
  const [shouldRender, setShouldRender] = useState(status.hasError);
  const [isVisible, setIsVisible] = useState(status.hasError);

  // Handle error display and auto-dismiss
  useEffect(() => {
    if (status.hasError) {
      setShouldRender(true);
      setIsVisible(true);

      if (autoDismissMs > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setShouldRender(false);
            onClearError();
          }, 300); // Duration of fade-out animation
        }, autoDismissMs);

        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }
  }, [status.hasError, autoDismissMs, onClearError]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`error-banner ${isVisible ? 'visible' : 'hidden'} ${className}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        padding: '12px 16px',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '4px',
        color: '#c33',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        marginBottom: '16px',
      }}
    >
      <div
        className="error-message"
        style={{
          flex: 1,
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        {status.errorMessage}
      </div>
      <button
        className="error-dismiss-button"
        onClick={onClearError}
        aria-label="Dismiss error"
        style={{
          marginLeft: '12px',
          padding: '4px 8px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#c33',
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: 1,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.7';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        ✕
      </button>
    </div>
  );
};

ErrorBanner.displayName = 'ErrorBanner';
