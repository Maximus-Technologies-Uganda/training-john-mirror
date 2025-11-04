import React, { Component, ReactNode } from 'react';

/**
 * Comprehensive Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * categorizes errors, logs them, and displays appropriate fallback UI
 * instead of crashing the entire application.
 *
 * Features:
 * - Catches rendering errors in child components
 * - Error categorization (network, validation, runtime, etc.)
 * - Intelligent recovery strategies based on error type
 * - User-friendly error messages with actionable guidance
 * - Error reporting integration ready
 * - Accessibility compliant with ARIA announcements
 * - Error retry with exponential backoff
 * - Development vs production error details
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorType: 'network' | 'validation' | 'runtime' | 'unknown';
  retryCount: number;
  lastErrorTime?: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  maxRetries?: number;
  onError?: (error: Error, errorInfo: React.ErrorInfo, errorType: string) => void;
  showErrorDetails?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorType: 'unknown',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorType: ErrorBoundary.categorizeError(error),
      lastErrorTime: Date.now()
    };
  }

  /**
   * Categorize error types for better user experience and recovery strategies
   */
  static categorizeError(error: Error): 'network' | 'validation' | 'runtime' | 'unknown' {
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch') ||
        errorMessage.includes('connection') || errorMessage.includes('timeout')) {
      return 'network';
    }

    // Validation errors
    if (errorMessage.includes('validation') || errorMessage.includes('invalid') ||
        errorMessage.includes('required') || errorName.includes('validation')) {
      return 'validation';
    }

    // Runtime errors (TypeError, ReferenceError, etc.)
    if (errorName.includes('typeerror') || errorName.includes('referenceerror') ||
        errorName.includes('syntaxerror')) {
      return 'runtime';
    }

    return 'unknown';
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorType = ErrorBoundary.categorizeError(error);

    // Log the error details for debugging
    console.error('Error Boundary caught an error:', error);
    console.error('Error Type:', errorType);
    console.error('Error Info:', errorInfo);

    // Update state with complete error information
    this.setState(() => ({
      hasError: true,
      error,
      errorInfo,
      errorType,
      lastErrorTime: Date.now()
    }));

    // Call the optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorType);
    }

    // In a production app, you might want to send this to an error reporting service
    // Example: logErrorToService(error, errorInfo, errorType);
  }

  /**
   * Handle retry with exponential backoff and max retry limits
   */
  handleRetry = () => {
    const maxRetries = this.props.maxRetries || 3;
    const currentRetryCount = this.state.retryCount;

    if (currentRetryCount >= maxRetries) {
      console.warn('Max retry attempts reached, forcing page reload');
      this.handleReload();
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, etc.
    const backoffDelay = Math.pow(2, currentRetryCount) * 1000;

    console.log(`Retrying in ${backoffDelay}ms (attempt ${currentRetryCount + 1}/${maxRetries})`);

    setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));
    }, backoffDelay);
  };

  /**
   * Force reload the entire page as a last resort
   */
  handleReload = () => {
    console.log('Performing full page reload');
    window.location.reload();
  };

  /**
   * Reset error state completely
   */
  resetErrorState = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorType: 'unknown',
      retryCount: 0,
      lastErrorTime: undefined
    });
  };

  /**
   * Get user-friendly error message based on error type
   */
  getErrorMessage(): { title: string; message: string; suggestion: string } {
    const { errorType } = this.state;

    switch (errorType) {
      case 'network':
        return {
          title: 'Connection Problem',
          message: 'Unable to connect to the server. This might be due to network issues or server maintenance.',
          suggestion: 'Check your internet connection and try again in a moment.'
        };

      case 'validation':
        return {
          title: 'Data Validation Error',
          message: 'There was an issue with the data format or validation rules.',
          suggestion: 'Please check your input and try again.'
        };

      case 'runtime':
        return {
          title: 'Application Error',
          message: 'A technical error occurred while running the application.',
          suggestion: 'Try refreshing the page or contact support if the problem continues.'
        };

      default:
        return {
          title: 'Something went wrong',
          message: 'We\'re sorry, but something unexpected happened. The application encountered an error.',
          suggestion: 'Try again or refresh the page. If this persists, contact support.'
        };
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { title, message, suggestion } = this.getErrorMessage();
      const { retryCount } = this.state;
      const maxRetries = this.props.maxRetries || 3;
      // Check if we should show error details (in development/test mode by default)
      const isDevelopment = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV === true;
      const showErrorDetails = this.props.showErrorDetails ?? isDevelopment;

      // Default error UI
      return (
        <div className="error-boundary" role="alert" aria-live="assertive">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">{title}</h1>
            <p className="error-boundary-message">{message}</p>

            {retryCount > 0 && retryCount < maxRetries && (
              <p className="error-boundary-retry-info">
                Retry attempt {retryCount} of {maxRetries}
              </p>
            )}

            {retryCount >= maxRetries && (
              <p className="error-boundary-max-retries">
                Maximum retry attempts reached. Reloading page...
              </p>
            )}

            {showErrorDetails && (
              <div className="error-boundary-details">
                <details className="error-boundary-details-toggle">
                  <summary>Technical Details</summary>
                  <pre className="error-boundary-error-text">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo && (
                      <>
                        {'\n\nComponent Stack:'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              </div>
            )}

            <div className="error-boundary-actions">
              {retryCount < maxRetries && (
                <button
                  type="button"
                  onClick={this.handleRetry}
                  className="error-boundary-retry-button"
                  aria-label="Try to reload the application"
                  disabled={retryCount >= maxRetries}
                >
                  Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
                </button>
              )}
              <button
                type="button"
                onClick={this.handleReload}
                className="error-boundary-reload-button"
                aria-label="Reload the entire page"
              >
                Reload Page
              </button>
            </div>

            <p className="error-boundary-help">
              {suggestion} If this problem persists, contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component that wraps children with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
