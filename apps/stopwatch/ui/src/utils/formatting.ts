/**
 * Time Formatting Utilities for Stopwatch
 * 
 * Provides functions to format elapsed time in MM:SS:MS format
 * where MM = minutes (0-99), SS = seconds (0-59), MS = milliseconds (00-99)
 */

/**
 * Formats elapsed time in milliseconds to MM:SS:MS string format
 * 
 * @param elapsedMs - Elapsed time in milliseconds
 * @param maxMs - Maximum milliseconds before capping (default: 99:59:99)
 * @returns Formatted time string in MM:SS:MS format
 * 
 * @example
 * formatTime(5432) => "00:05:43"
 * formatTime(65432) => "01:05:43"
 * formatTime(359999) => "99:59:99"
 */
export function formatTime(elapsedMs: number, maxMs: number = 359999): string {
  // Cap at maximum to prevent overflow
  const cappedMs = Math.min(Math.max(0, elapsedMs), maxMs);

  // Extract components
  const totalSeconds = Math.floor(cappedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((cappedMs % 1000) / 10); // Convert to centiseconds (0-99)

  // Format with leading zeros
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedMilliseconds = String(milliseconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
}

/**
 * Parses a formatted time string back to milliseconds
 * Inverse operation of formatTime
 * 
 * @param timeString - Time string in MM:SS:MS format
 * @returns Elapsed time in milliseconds, or null if invalid format
 * 
 * @example
 * parseTime("00:05:43") => 5430
 * parseTime("01:05:43") => 65430
 */
export function parseTime(timeString: string): number | null {
  const match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, minutesStr, secondsStr, millisecondsStr] = match;
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);
  const milliseconds = parseInt(millisecondsStr, 10) * 10; // Convert from centiseconds

  // Validate ranges
  if (minutes > 99 || seconds > 59 || milliseconds > 990) {
    return null;
  }

  return minutes * 60000 + seconds * 1000 + milliseconds;
}

/**
 * Formats lap interval time to human-readable format
 * Used for displaying individual lap times
 * 
 * @param intervalMs - Interval time in milliseconds
 * @returns Formatted interval string (e.g., "5.43s")
 * 
 * @example
 * formatInterval(5430) => "5.43s"
 * formatInterval(65430) => "65.43s"
 */
export function formatInterval(intervalMs: number): string {
  const seconds = intervalMs / 1000;
  return `${seconds.toFixed(2)}s`;
}

/**
 * Formats lap display string with interval and total time
 * 
 * @param lapNumber - Lap number (1-indexed)
 * @param intervalMs - Interval time for this lap
 * @param totalMs - Cumulative total time
 * @returns Formatted lap string
 * 
 * @example
 * formatLapDisplay(1, 5430, 5430) => "Lap 1: 5.43s (total: 5.43s)"
 * formatLapDisplay(2, 3150, 8580) => "Lap 2: 3.15s (total: 8.58s)"
 */
export function formatLapDisplay(
  lapNumber: number,
  intervalMs: number,
  totalMs: number,
): string {
  const intervalStr = formatInterval(intervalMs);
  const totalStr = formatInterval(totalMs);
  return `Lap ${lapNumber}: ${intervalStr} (total: ${totalStr})`;
}
