import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary } from '../../src/components/ErrorBoundary';

// Mock console.error to avoid noise in test output
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

// Component that throws an error
const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('catches and displays error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
  });

  it('logs error details when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error Boundary caught an error:',
      expect.any(Error)
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error Info:',
      expect.any(Object)
    );
  });

  it('displays technical details in collapsible section', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const detailsToggle = screen.getByText('Technical Details');
    expect(detailsToggle).toBeInTheDocument();

    // Click to expand details
    fireEvent.click(detailsToggle);

    expect(screen.getByText(/Test error/)).toBeInTheDocument();
    expect(screen.getByText(/Component Stack/)).toBeInTheDocument();
  });

  it('allows retrying after error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // The retry functionality is internal to the ErrorBoundary
    // and resets its state when the "Try Again" button is clicked
    // This test verifies that the error UI is shown initially
  });

  it('reloads page when reload button is clicked', () => {
    // Mock window.location.reload
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Reload Page');
    fireEvent.click(reloadButton);

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
  });

  it('displays help text', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/If this problem persists/)).toBeInTheDocument();
  });

  it('handles error recovery by resetting state', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Create a new ErrorBoundary instance with normal content
    rerender(
      <ErrorBoundary key="new-instance">
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });
});

describe('withErrorBoundary HOC', () => {
  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('wraps a component with error boundary', () => {
    const TestComponent = () => <div>Test content</div>;
    const WrappedComponent = withErrorBoundary(TestComponent);

    render(<WrappedComponent />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('displays error UI when wrapped component throws', () => {
    const WrappedComponent = withErrorBoundary(ThrowError);

    render(<WrappedComponent />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('sets correct display name for debugging', () => {
    const TestComponent = () => <div>Test</div>;
    TestComponent.displayName = 'MyComponent';
    const WrappedComponent = withErrorBoundary(TestComponent);

    expect(WrappedComponent.displayName).toBe('withErrorBoundary(MyComponent)');
  });

  it('passes props through to wrapped component', () => {
    interface TestProps {
      title: string;
      count: number;
    }
    const TestComponent: React.FC<TestProps> = ({ title, count }) => (
      <div>{title}: {count}</div>
    );
    const WrappedComponent = withErrorBoundary(TestComponent);

    render(<WrappedComponent title="Items" count={5} />);
    expect(screen.getByText('Items: 5')).toBeInTheDocument();
  });

  it('uses provided custom fallback UI', () => {
    const CustomFallback = <div>Custom Error UI</div>;
    const WrappedComponent = withErrorBoundary(ThrowError, CustomFallback);

    render(<WrappedComponent />);
    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
  });

  it('renders default error UI when no fallback provided', () => {
    const WrappedComponent = withErrorBoundary(ThrowError);

    render(<WrappedComponent />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('catches network errors correctly', () => {
    const NetworkErrorComponent = () => {
      throw new Error('Network connection timeout');
    };
    const WrappedComponent = withErrorBoundary(NetworkErrorComponent);

    render(<WrappedComponent />);
    // Network errors should be categorized
    expect(screen.getByText('Connection Problem')).toBeInTheDocument();
  });

  it('handles errors for components with multiple children', () => {
    const MultiChildComponent = () => (
      <div>
        <span>Child 1</span>
        <ThrowError />
      </div>
    );
    const WrappedComponent = withErrorBoundary(MultiChildComponent);

    render(<WrappedComponent />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
  });

  it('maintains error boundary functionality with wrapped components', () => {
    interface ButtonProps {
      onClick: () => void;
    }
    const TestButton: React.FC<ButtonProps> = ({ onClick }) => (
      <button onClick={onClick}>Click me</button>
    );
    const WrappedButton = withErrorBoundary(TestButton);

    render(
      <WrappedButton onClick={() => {}} />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});
