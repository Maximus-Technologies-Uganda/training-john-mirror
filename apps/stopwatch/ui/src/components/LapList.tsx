/**
 * LapList Component
 * 
 * Displays a list of recorded lap times with:
 * - Lap number and interval time
 * - Cumulative total time
 * - Virtual scrolling for >50 laps (using react-window)
 * - Full accessibility support with keyboard navigation
 * 
 * Format: "Lap N: X.XXs (total: Y.YYs)"
 * 
 * Virtual Scrolling:
 * - Automatically enabled when >50 laps
 * - Uses FixedSizeList from react-window for performance
 * - Renders only visible items (~10-15 at a time)
 * - Reduces DOM nodes and improves responsiveness
 * 
 * Accessibility Features:
 * - Full keyboard navigation (Arrow keys, Home/End)
 * - Focus management with visible focus indicators
 * - ARIA labels and roles for screen readers
 * - Live region updates for new laps
 * - Semantic HTML structure
 */

import React, { useMemo, useState, useRef, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { LapTime } from '../types/stopwatch';
import { formatInterval, formatLapDisplay } from '../utils/formatting';

export interface LapListProps {
  /** Array of recorded lap times */
  laps: LapTime[];
  /** Whether to enable virtual scrolling (automatic for >50 laps) */
  enableVirtualScroll?: boolean;
  /** Optional CSS class for styling */
  className?: string;
  /** Virtual scrolling threshold (default: 50) */
  virtualScrollThreshold?: number;
}

/**
 * LapList Component
 * 
 * Renders a list of lap times with accessibility features.
 * Automatically enables virtual scrolling for large datasets (>50 laps).
 */
export const LapList: React.FC<LapListProps> = ({
  laps,
  enableVirtualScroll = false,
  className = '',
  virtualScrollThreshold = 50,
}) => {
  // State for keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  // Determine if virtual scrolling should be active
  const shouldUseVirtualScroll = laps.length > virtualScrollThreshold;

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      let newIndex: number | null = null;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          newIndex = Math.min(index + 1, laps.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          newIndex = Math.max(index - 1, 0);
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = laps.length - 1;
          break;
        default:
          return;
      }

      if (newIndex !== null) {
        setFocusedIndex(newIndex);
        // Focus the item after state updates
        setTimeout(() => {
          const element = itemRefs.current.get(newIndex);
          if (element) {
            element.focus();
          }
        }, 0);
      }
    },
    [laps.length]
  );

  // Announce when new lap is added
  const announceLapAddition = useCallback(() => {
    if (laps.length > 0) {
      const lastLap = laps[laps.length - 1];
      const announcement = `Lap ${lastLap.lapNumber} recorded: ${formatInterval(lastLap.intervalMs)}`;
      // Announce to screen readers
      const ariaLive = containerRef.current?.querySelector('[aria-live]');
      if (ariaLive) {
        ariaLive.textContent = announcement;
      }
    }
  }, [laps]);

  // Format interval time (e.g., "5.43s")
  const formatLapInterval = (ms: number): string => {
    const seconds = ms / 1000;
    return seconds.toFixed(2) + 's';
  };

  // Format total time (e.g., "5.43s")
  const formatLapTotal = (ms: number): string => {
    const seconds = ms / 1000;
    return seconds.toFixed(2) + 's';
  };

  // Handle empty state
  if (laps.length === 0) {
    return (
      <div
        role="status"
        aria-label="Lap list is empty"
        data-testid="lap-list-empty"
        className={`lap-list-empty ${className}`}
        style={{
          padding: '24px',
          textAlign: 'center',
          color: '#999',
          fontSize: '14px',
          fontStyle: 'italic',
        }}
      >
        No laps recorded yet. Start the stopwatch and click "Lap" to record times.
      </div>
    );
  }

  // Render a single lap item for the virtual list
  const renderLapItem = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const lap = laps[index];
    const intervalDisplay = formatLapInterval(lap.intervalMs);
    const totalDisplay = formatLapTotal(lap.totalMs);
    const ariaLabel = `Lap ${lap.lapNumber}: ${intervalDisplay} interval, ${totalDisplay} total`;
    const isFocused = focusedIndex === index;

    return (
      <div
        ref={(el) => {
          if (el) {
            itemRefs.current.set(index, el);
          }
        }}
        role="listitem"
        aria-label={ariaLabel}
        tabIndex={isFocused ? 0 : -1}
        data-testid={`lap-item-${lap.lapNumber}`}
        className="lap-item"
        onKeyDown={(e) => handleKeyDown(e, index)}
        onFocus={() => setFocusedIndex(index)}
        style={{
          ...style,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: isFocused ? '#e3f2fd' : '#f9f9f9',
          border: isFocused ? '2px solid #2196F3' : '1px solid #e8e8e8',
          borderLeft: '4px solid #2196F3',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '13px',
          transition: 'background-color 0.2s, box-shadow 0.2s, border 0.2s',
          cursor: 'pointer',
          boxSizing: 'border-box',
          outline: isFocused ? '2px solid #2196F3' : 'none',
          outlineOffset: '2px',
        }}
        onMouseEnter={(e) => {
          if (!isFocused) {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f7ff';
          }
          (e.currentTarget as HTMLElement).style.boxShadow =
            '0 2px 4px rgba(33, 150, 243, 0.1)';
        }}
        onMouseLeave={(e) => {
          if (!isFocused) {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#f9f9f9';
          }
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {/* Lap number and interval */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              minWidth: '50px',
              color: '#2196F3',
              fontWeight: 'bold',
            }}
          >
            Lap {lap.lapNumber}:
          </span>
          <span style={{ color: '#333', fontWeight: 'normal' }}>
            {intervalDisplay}
          </span>
        </div>

        {/* Cumulative total */}
        <div
          style={{
            color: '#666',
            fontSize: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          (total: {totalDisplay})
        </div>
      </div>
    );
  };

  // Use virtual scrolling for large lists
  if (shouldUseVirtualScroll) {
    return (
      <div
        ref={containerRef}
        role="region"
        aria-label="Lap times list (virtualized). Use arrow keys to navigate, Home and End to jump to first or last lap."
        aria-live="polite"
        aria-atomic="false"
        data-testid="lap-list-container"
        data-virtual-scroll="true"
        className={`lap-list-container ${className}`}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {/* Hidden aria-live region for lap announcements */}
        <div
          role="status"
          aria-live="assertive"
          aria-atomic="true"
          style={{
            position: 'absolute',
            left: '-10000px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        />
      
        <List
          height={400}
          itemCount={laps.length}
          itemSize={66} // Height per item: 12px (margin) + 16px (padding) + line height
          width="100%"
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            overflowX: 'hidden',
          }}
        >
          {renderLapItem}
        </List>

        {/* Virtual scrolling indicator */}
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            fontSize: '11px',
            color: '#999',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            textAlign: 'center',
          }}
          aria-label={`Virtual scrolling enabled: ${laps.length} laps`}
        >
          Showing {laps.length} laps (virtual scrolling enabled)
        </div>
      </div>
    );
  }

  // Standard rendering for small lists
  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Lap times list. Use arrow keys to navigate, Home and End to jump to first or last lap."
      aria-live="polite"
      aria-atomic="false"
      data-testid="lap-list-container"
      data-virtual-scroll="false"
      className={`lap-list-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
      }}
    >
      {/* Hidden aria-live region for lap announcements */}
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      />
    
      {laps.map((_, index) => renderLapItem({ index, style: {} }))}
    </div>
  );
};

LapList.displayName = 'LapList';

