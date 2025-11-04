import { renderHook, act } from '@testing-library/react';
import { useLoadingState } from '../../src/components/LoadingState';

describe('useLoadingState Hook', () => {
  it('initializes with default loading state', () => {
    const { result } = renderHook(() => useLoadingState());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('initializes with custom loading state', () => {
    const { result } = renderHook(() => useLoadingState(true));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('startLoading sets loading to true and clears error', () => {
    const { result } = renderHook(() => useLoadingState());

    act(() => {
      result.current.startLoading();
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('stopLoading sets loading to false', () => {
    const { result } = renderHook(() => useLoadingState(true));

    act(() => {
      result.current.stopLoading();
    });

    expect(result.current.loading).toBe(false);
  });

  it('setLoadingError sets error and stops loading', () => {
    const { result } = renderHook(() => useLoadingState(true));
    const testError = new Error('Test error');

    act(() => {
      result.current.setLoadingError(testError);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(testError);
  });

  it('reset clears loading and error state', () => {
    const { result } = renderHook(() => useLoadingState(true));
    const testError = new Error('Test error');

    act(() => {
      result.current.setLoadingError(testError);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBe(null);

    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles rapid state transitions', () => {
    const { result } = renderHook(() => useLoadingState());

    act(() => {
      result.current.startLoading();
      result.current.stopLoading();
      result.current.startLoading();
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('handles multiple error updates', () => {
    const { result } = renderHook(() => useLoadingState());
    const error1 = new Error('First error');
    const error2 = new Error('Second error');

    act(() => {
      result.current.setLoadingError(error1);
    });

    expect(result.current.error?.message).toBe('First error');

    act(() => {
      result.current.setLoadingError(error2);
    });

    expect(result.current.error?.message).toBe('Second error');
  });

  it('clears error state when startLoading is called', () => {
    const { result } = renderHook(() => useLoadingState());
    const testError = new Error('Test error');

    act(() => {
      result.current.setLoadingError(testError);
    });

    expect(result.current.error).not.toBe(null);

    act(() => {
      result.current.startLoading();
    });

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(true);
  });

  it('preserves error when stopLoading is called', () => {
    const { result } = renderHook(() => useLoadingState());
    const testError = new Error('Test error');

    act(() => {
      result.current.setLoadingError(testError);
    });

    expect(result.current.error).toBe(testError);

    act(() => {
      result.current.stopLoading();
    });

    // Error should still be present
    expect(result.current.error).toBe(testError);
    expect(result.current.loading).toBe(false);
  });

  it('handles consecutive start and stop cycles', () => {
    const { result } = renderHook(() => useLoadingState());

    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.startLoading();
      });
      expect(result.current.loading).toBe(true);

      act(() => {
        result.current.stopLoading();
      });
      expect(result.current.loading).toBe(false);
    }
  });

  it('reset clears all state including custom initial state', () => {
    const { result } = renderHook(() => useLoadingState(true));
    const testError = new Error('Test error');

    act(() => {
      result.current.setLoadingError(testError);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(testError);

    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles error with long error messages', () => {
    const { result } = renderHook(() => useLoadingState());
    const longMessage = 'a'.repeat(1000);
    const testError = new Error(longMessage);

    act(() => {
      result.current.setLoadingError(testError);
    });

    expect(result.current.error?.message).toBe(longMessage);
    expect(result.current.error?.message.length).toBe(1000);
  });

  it('handles error with custom error objects', () => {
    const { result } = renderHook(() => useLoadingState());

    class CustomError extends Error {
      code: string;

      constructor(message: string, code: string) {
        super(message);
        this.code = code;
      }
    }

    const customError = new CustomError('Custom error', 'CUSTOM_CODE');

    act(() => {
      result.current.setLoadingError(customError);
    });

    expect(result.current.error).toBe(customError);
    expect((result.current.error as CustomError).code).toBe('CUSTOM_CODE');
  });

  it('maintains state across multiple re-renders', () => {
    const { result, rerender } = renderHook(() => useLoadingState());

    act(() => {
      result.current.startLoading();
    });

    expect(result.current.loading).toBe(true);

    rerender();

    expect(result.current.loading).toBe(true);
  });

  it('transitions from loading to error state correctly', () => {
    const { result } = renderHook(() => useLoadingState());

    act(() => {
      result.current.startLoading();
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    const testError = new Error('Loading failed');
    act(() => {
      result.current.setLoadingError(testError);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(testError);
  });

  it('provides stable callback references', () => {
    const { result, rerender } = renderHook(() => useLoadingState());

    const startLoadingRef = result.current.startLoading;
    const stopLoadingRef = result.current.stopLoading;
    const resetRef = result.current.reset;

    rerender();

    // Callbacks should be stable (same references)
    expect(result.current.startLoading).toBe(startLoadingRef);
    expect(result.current.stopLoading).toBe(stopLoadingRef);
    expect(result.current.reset).toBe(resetRef);
  });
});
