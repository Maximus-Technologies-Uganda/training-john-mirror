import React from 'react';

/**
 * Loading State Components
 *
 * Provides consistent loading states and skeleton components across the application.
 * Includes skeleton loaders, spinners, and progress indicators for better UX.
 */

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

/**
 * Animated loading spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-solid border-r-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
  animate?: boolean;
}

/**
 * Skeleton loader component for content placeholders
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = true,
  animate = true
}) => {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${rounded ? 'rounded' : ''}
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
      style={{ width: widthStyle, height: heightStyle }}
      aria-hidden="true"
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}

/**
 * Skeleton text component for multi-line text placeholders
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = '',
  lastLineWidth = '60%'
}) => {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
};

interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

/**
 * Skeleton card component for list item placeholders
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  showAvatar = false,
  lines = 2
}) => {
  return (
    <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`} aria-hidden="true">
      <div className="flex items-start space-x-3">
        {showAvatar && (
          <Skeleton width={40} height={40} rounded className="flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <Skeleton width="60%" height="1.25rem" className="mb-2" />
          <SkeletonText lines={lines} />
        </div>
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  message?: string;
  className?: string;
  spinnerSize?: 'small' | 'medium' | 'large';
  spinnerColor?: 'primary' | 'secondary' | 'white';
}

/**
 * Full-screen loading overlay component
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Loading...',
  className = '',
  spinnerSize = 'large',
  spinnerColor = 'white'
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm mx-4 text-center">
        <LoadingSpinner size={spinnerSize} color={spinnerColor} className="mx-auto mb-4" />
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  spinnerSize?: 'small' | 'medium' | 'large';
}

/**
 * Button component with built-in loading state
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText = 'Loading...',
  spinnerSize = 'small',
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center ${className}`}
    >
      {loading && (
        <LoadingSpinner
          size={spinnerSize}
          color="white"
          className="mr-2"
        />
      )}
      {loading ? loadingText : children}
    </button>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * Skeleton table component for data table placeholders
 */
export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = ''
}) => {
  return (
    <div className={`overflow-x-auto ${className}`} aria-hidden="true">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {Array.from({ length: columns }, (_, index) => (
              <th key={index} className="px-6 py-3 text-left">
                <Skeleton width="80%" height="1rem" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  <Skeleton
                    width={colIndex === 0 ? '60%' : '40%'}
                    height="1rem"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ProgressBarProps {
  progress?: number; // 0-100
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  animated?: boolean;
}

/**
 * Progress bar component for showing loading progress
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  className = '',
  color = 'primary',
  animated = true
}) => {
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600'
  };

  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]} ${animated ? 'animate-pulse' : ''}`}
        style={{ width: `${clampedProgress}%` }}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

/**
 * Higher-order component that adds loading state to any component
 */
// eslint-disable-next-line react-refresh/only-export-components
export function withLoadingState<P extends object>(
  Component: React.ComponentType<P>,
  loadingComponent?: React.ComponentType<any>
) {
  const WrappedComponent = (props: P & { loading?: boolean }) => {
    const { loading, ...restProps } = props;

    if (loading) {
      if (loadingComponent) {
        const LoadingComp = loadingComponent;
        return <LoadingComp />;
      }
      return <LoadingSpinner />;
    }

    return <Component {...(restProps as P)} />;
  };

  WrappedComponent.displayName = `withLoadingState(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for managing loading states
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useLoadingState(initialLoading = false) {
  const [loading, setLoading] = React.useState(initialLoading);
  const [error, setError] = React.useState<Error | null>(null);

  const startLoading = React.useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = React.useCallback((err: Error) => {
    setLoading(false);
    setError(err);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset: () => {
      setLoading(false);
      setError(null);
    }
  };
}
