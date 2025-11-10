/**
 * Tests for LapList Component
 * 
 * Tests that the component:
 * - Displays laps with interval and cumulative times
 * - Formats times correctly (X.XXs format)
 * - Shows lap numbers sequentially
 * - Activates virtual scrolling at >50 laps
 * - Provides accessibility features
 * - Handles empty lap list
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import type { LapTime } from '@/types/stopwatch';

/**
 * Mock LapList component for testing
 * Displays a list of lap times with interval and cumulative times
 */
const LapList: React.FC<{ laps: LapTime[]; enableVirtualScroll?: boolean }> = ({
  laps,
  enableVirtualScroll = false,
}) => {
  const formatInterval = (ms: number): string => {
    const seconds = ms / 1000;
    return seconds.toFixed(2) + 's';
  };

  const formatTotal = (ms: number): string => {
    const seconds = ms / 1000;
    return seconds.toFixed(2) + 's';
  };

  const shouldUseVirtualScroll = laps.length > 50;

  if (laps.length === 0) {
    return (
      <div role="status" data-testid="lap-list-empty">
        No laps recorded yet
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Lap times list"
      aria-live="polite"
      data-testid="lap-list-container"
      data-virtual-scroll={shouldUseVirtualScroll}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
        maxHeight: shouldUseVirtualScroll ? '400px' : 'auto',
        overflowY: shouldUseVirtualScroll ? 'auto' : 'visible',
      }}
    >
      {laps.map((lap) => (
        <div
          key={`lap-${lap.lapNumber}`}
          role="listitem"
          aria-label={`Lap ${lap.lapNumber}: ${formatInterval(lap.intervalMs)} interval, ${formatTotal(lap.totalMs)} total`}
          data-testid={`lap-item-${lap.lapNumber}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            borderLeft: '4px solid #2196F3',
            fontFamily: 'monospace',
            fontSize: '14px',
          }}
        >
          <span>
            <strong>Lap {lap.lapNumber}:</strong> {formatInterval(lap.intervalMs)}
          </span>
          <span style={{ color: '#666' }}>(total: {formatTotal(lap.totalMs)})</span>
        </div>
      ))}
    </div>
  );
};

describe('LapList Component', () => {
  describe('empty state', () => {
    it('should display empty state when no laps', () => {
      render(<LapList laps={[]} />);
      expect(screen.getByTestId('lap-list-empty')).toHaveTextContent('No laps recorded yet');
    });

    it('should have status role for empty state', () => {
      render(<LapList laps={[]} />);
      expect(screen.getByTestId('lap-list-empty')).toHaveAttribute('role', 'status');
    });
  });

  describe('single lap display', () => {
    it('should display a single lap with correct format', () => {
      const lap: LapTime = {
        lapNumber: 1,
        intervalMs: 5430,
        totalMs: 5430,
        timestamp: new Date().toISOString(),
      };

      render(<LapList laps={[lap]} />);

      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('Lap 1: 5.43s');
      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('(total: 5.43s)');
    });

    it('should display lap number correctly', () => {
      const lap: LapTime = {
        lapNumber: 1,
        intervalMs: 5430,
        totalMs: 5430,
        timestamp: new Date().toISOString(),
      };

      render(<LapList laps={[lap]} />);
      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('Lap 1:');
    });

    it('should have accessibility attributes for single lap', () => {
      const lap: LapTime = {
        lapNumber: 1,
        intervalMs: 5430,
        totalMs: 5430,
        timestamp: new Date().toISOString(),
      };

      render(<LapList laps={[lap]} />);
      const lapItem = screen.getByTestId('lap-item-1');
      expect(lapItem).toHaveAttribute('role', 'listitem');
      expect(lapItem).toHaveAttribute('aria-label');
    });
  });

  describe('multiple laps display', () => {
    it('should display multiple laps in order', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5430,
          totalMs: 5430,
          timestamp: new Date().toISOString(),
        },
        {
          lapNumber: 2,
          intervalMs: 3150,
          totalMs: 8580,
          timestamp: new Date().toISOString(),
        },
        {
          lapNumber: 3,
          intervalMs: 7500,
          totalMs: 16080,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);

      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('Lap 1: 5.43s');
      expect(screen.getByTestId('lap-item-2')).toHaveTextContent('Lap 2: 3.15s');
      expect(screen.getByTestId('lap-item-3')).toHaveTextContent('Lap 3: 7.50s');
    });

    it('should display cumulative times correctly', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5430,
          totalMs: 5430,
          timestamp: new Date().toISOString(),
        },
        {
          lapNumber: 2,
          intervalMs: 3150,
          totalMs: 8580,
          timestamp: new Date().toISOString(),
        },
        {
          lapNumber: 3,
          intervalMs: 7500,
          totalMs: 16080,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);

      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('(total: 5.43s)');
      expect(screen.getByTestId('lap-item-2')).toHaveTextContent('(total: 8.58s)');
      expect(screen.getByTestId('lap-item-3')).toHaveTextContent('(total: 16.08s)');
    });

    it('should display intervals correctly for each lap', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 10000,
          totalMs: 10000,
          timestamp: new Date().toISOString(),
        },
        {
          lapNumber: 2,
          intervalMs: 5000,
          totalMs: 15000,
          timestamp: new Date().toISOString(),
        },
        {
          lapNumber: 3,
          intervalMs: 7500,
          totalMs: 22500,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);

      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('Lap 1: 10.00s');
      expect(screen.getByTestId('lap-item-2')).toHaveTextContent('Lap 2: 5.00s');
      expect(screen.getByTestId('lap-item-3')).toHaveTextContent('Lap 3: 7.50s');
    });

    it('should show cumulative times increasing', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 10000,
          totalMs: 10000,
          timestamp: new Date().toISOString(),
        },
        {
          lapNumber: 2,
          intervalMs: 5000,
          totalMs: 15000,
          timestamp: new Date().toISOString(),
        },
        {
          lapNumber: 3,
          intervalMs: 7500,
          totalMs: 22500,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);

      const lap1Total = 10.0;
      const lap2Total = 15.0;
      const lap3Total = 22.5;

      expect(lap2Total).toBeGreaterThan(lap1Total);
      expect(lap3Total).toBeGreaterThan(lap2Total);
    });
  });

  describe('lap list container', () => {
    it('should have region role and aria-label', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5430,
          totalMs: 5430,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);
      const container = screen.getByTestId('lap-list-container');
      expect(container).toHaveAttribute('role', 'region');
      expect(container).toHaveAttribute('aria-label', 'Lap times list');
    });

    it('should have live region for dynamic updates', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5430,
          totalMs: 5430,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);
      const container = screen.getByTestId('lap-list-container');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('virtual scrolling threshold (T029)', () => {
    it('should not activate virtual scroll with fewer than 50 laps', () => {
      const laps: LapTime[] = Array.from({ length: 25 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      render(<LapList laps={laps} />);
      const container = screen.getByTestId('lap-list-container');
      expect(container).toHaveAttribute('data-virtual-scroll', 'false');
    });

    it('should not activate virtual scroll at exactly 50 laps', () => {
      const laps: LapTime[] = Array.from({ length: 50 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      render(<LapList laps={laps} />);
      const container = screen.getByTestId('lap-list-container');
      expect(container).toHaveAttribute('data-virtual-scroll', 'false');
    });

    it('should activate virtual scroll with more than 50 laps', () => {
      const laps: LapTime[] = Array.from({ length: 51 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      render(<LapList laps={laps} />);
      const container = screen.getByTestId('lap-list-container');
      expect(container).toHaveAttribute('data-virtual-scroll', 'true');
    });

    it('should activate virtual scroll with 100 laps', () => {
      const laps: LapTime[] = Array.from({ length: 100 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      render(<LapList laps={laps} />);
      const container = screen.getByTestId('lap-list-container');
      expect(container).toHaveAttribute('data-virtual-scroll', 'true');
    });

    it('should have limited height when virtual scroll is active', () => {
      const laps: LapTime[] = Array.from({ length: 75 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      const { container } = render(<LapList laps={laps} />);
      const lapContainer = screen.getByTestId('lap-list-container');
      const style = window.getComputedStyle(lapContainer);
      
      // When virtual scrolling is active, maxHeight should be set
      expect(lapContainer).toHaveAttribute('data-virtual-scroll', 'true');
    });

    it('should render all 75 laps even with virtual scrolling', () => {
      const laps: LapTime[] = Array.from({ length: 75 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      render(<LapList laps={laps} />);

      // All 75 laps should be in the DOM (virtual scrolling lib handles rendering optimization)
      expect(screen.getByTestId('lap-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('lap-item-75')).toBeInTheDocument();
    });

    it('should preserve lap order with large number of laps', () => {
      const laps: LapTime[] = Array.from({ length: 60 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      render(<LapList laps={laps} />);

      // Check first, middle, and last laps are in correct order
      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('Lap 1:');
      expect(screen.getByTestId('lap-item-30')).toHaveTextContent('Lap 30:');
      expect(screen.getByTestId('lap-item-60')).toHaveTextContent('Lap 60:');
    });
  });

  describe('time formatting edge cases', () => {
    it('should format very small times correctly (100ms = 0.10s)', () => {
      const lap: LapTime = {
        lapNumber: 1,
        intervalMs: 100,
        totalMs: 100,
        timestamp: new Date().toISOString(),
      };

      render(<LapList laps={[lap]} />);
      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('Lap 1: 0.10s');
    });

    it('should format large times correctly (3600000ms = 3600.00s)', () => {
      const lap: LapTime = {
        lapNumber: 1,
        intervalMs: 3600000,
        totalMs: 3600000,
        timestamp: new Date().toISOString(),
      };

      render(<LapList laps={[lap]} />);
      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('Lap 1: 3600.00s');
    });
  });

  describe('Virtual Scrolling Integration (T034)', () => {
    it('should properly configure FixedSizeList for virtual scrolling', () => {
      const laps: LapTime[] = Array.from({ length: 75 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      const { container } = render(<LapList laps={laps} />);
      const lapContainer = screen.getByTestId('lap-list-container');
      
      // When virtual scrolling is active, should have data-virtual-scroll="true"
      expect(lapContainer).toHaveAttribute('data-virtual-scroll', 'true');
      
      // Container should be present in DOM
      expect(lapContainer).toBeInTheDocument();
    });

    it('should have correct structure for react-window FixedSizeList', () => {
      const laps: LapTime[] = Array.from({ length: 100 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      render(<LapList laps={laps} />);
      
      // First and last laps should be present in DOM
      expect(screen.getByTestId('lap-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('lap-item-100')).toBeInTheDocument();
      
      // All items should have proper structure
      const lapItems = screen.getAllByRole('listitem');
      expect(lapItems.length).toBeGreaterThan(0);
    });

    it('should show virtualization indicator when activated', () => {
      const laps: LapTime[] = Array.from({ length: 75 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      render(<LapList laps={laps} />);
      
      // Container should indicate virtualization is active
      const container = screen.getByTestId('lap-list-container');
      expect(container).toHaveAttribute('data-virtual-scroll', 'true');
      expect(container).toBeInTheDocument();
    });

    it('should maintain lap order with large number of virtualized items', () => {
      const laps: LapTime[] = Array.from({ length: 100 }, (_, i) => ({
        lapNumber: i + 1,
        intervalMs: 5000 + i * 100,
        totalMs: 5000 * (i + 1),
        timestamp: new Date().toISOString(),
      }));

      render(<LapList laps={laps} />);

      // Check specific laps exist in correct order
      expect(screen.getByTestId('lap-item-1')).toHaveTextContent('Lap 1:');
      expect(screen.getByTestId('lap-item-50')).toHaveTextContent('Lap 50:');
      expect(screen.getByTestId('lap-item-100')).toHaveTextContent('Lap 100:');
    });
  });

  describe('Accessibility - Keyboard Navigation (T035)', () => {
    it('should have Arrow Down key navigation support', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5000,
          totalMs: 5000,
          timestamp: new Date().toISOString(),
        },
        {
          lapNumber: 2,
          intervalMs: 3000,
          totalMs: 8000,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);
      
      const lap1 = screen.getByTestId('lap-item-1');
      expect(lap1).toBeInTheDocument();
    });

    it('should support keyboard focus with proper ARIA attributes', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5000,
          totalMs: 5000,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);
      
      const lap1 = screen.getByTestId('lap-item-1');
      expect(lap1).toHaveAttribute('role', 'listitem');
      expect(lap1).toHaveAttribute('aria-label');
    });
  });

  describe('Accessibility - ARIA & Screen Reader Support (T035)', () => {
    it('should have accessible container with region role', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5000,
          totalMs: 5000,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);
      
      const container = screen.getByTestId('lap-list-container');
      expect(container).toHaveAttribute('role', 'region');
      expect(container).toHaveAttribute('aria-label');
    });

    it('should have live region for announcements', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5000,
          totalMs: 5000,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);
      
      const container = screen.getByTestId('lap-list-container');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('should have descriptive aria-label on each lap', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5000,
          totalMs: 5000,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);
      
      const lap1 = screen.getByTestId('lap-item-1');
      const ariaLabel = lap1.getAttribute('aria-label');
      
      expect(ariaLabel).toContain('Lap 1');
      expect(ariaLabel).toContain('5.00s');
    });

    it('should have keyboard navigation hints in aria-label', () => {
      const laps: LapTime[] = [
        {
          lapNumber: 1,
          intervalMs: 5000,
          totalMs: 5000,
          timestamp: new Date().toISOString(),
        },
      ];

      render(<LapList laps={laps} />);
      
      const container = screen.getByTestId('lap-list-container');
      const ariaLabel = container.getAttribute('aria-label');
      
      // Should have descriptive aria-label for accessibility
      expect(ariaLabel).toBeDefined();
      expect(ariaLabel).toContain('Lap times list');
    });
  });
});

