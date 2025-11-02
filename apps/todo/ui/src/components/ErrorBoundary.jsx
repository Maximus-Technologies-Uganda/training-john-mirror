import React from 'react'

/**
 * Error Boundary component for catching and handling React errors gracefully
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 * @param {ReactNode} props.fallback - Fallback UI to show on error (optional)
 * @returns {JSX.Element} ErrorBoundary component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (in production, you might want to send to error reporting service)
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Store error details for debugging
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>We&apos;re sorry, but something unexpected happened. Please try refreshing the page.</p>

            <div className="error-boundary-actions">
              <button
                onClick={this.handleRetry}
                className="btn btn-primary"
                aria-label="Try again"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="btn btn-secondary"
                aria-label="Refresh the page"
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack || 'No component stack available'}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
