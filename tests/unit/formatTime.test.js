import { describe, it, expect } from 'vitest';
import { formatElapsedTime } from '../../src/stopwatch-core.js';

describe('formatElapsedTime utility function', () => {
  describe('Basic formatting', () => {
    it('should format zero milliseconds', () => {
      expect(formatElapsedTime(0)).toBe('0s');
    });

    it('should format seconds only', () => {
      expect(formatElapsedTime(1000)).toBe('1s');
      expect(formatElapsedTime(5000)).toBe('5s');
      expect(formatElapsedTime(59000)).toBe('59s');
    });

    it('should format minutes and seconds', () => {
      expect(formatElapsedTime(60000)).toBe('1m 0s');
      expect(formatElapsedTime(65000)).toBe('1m 5s');
      expect(formatElapsedTime(125000)).toBe('2m 5s');
      expect(formatElapsedTime(3599000)).toBe('59m 59s');
    });

    it('should format hours, minutes and seconds', () => {
      expect(formatElapsedTime(3600000)).toBe('1h 0m 0s');
      expect(formatElapsedTime(3665000)).toBe('1h 1m 5s');
      expect(formatElapsedTime(7325000)).toBe('2h 2m 5s');
      expect(formatElapsedTime(3661000)).toBe('1h 1m 1s');
    });
  });

  describe('Edge cases', () => {
    it('should handle fractional milliseconds correctly', () => {
      expect(formatElapsedTime(999)).toBe('0s');
      expect(formatElapsedTime(1001)).toBe('1s');
      expect(formatElapsedTime(59999)).toBe('59s');
      expect(formatElapsedTime(60001)).toBe('1m 0s');
    });

    it('should handle large time values', () => {
      expect(formatElapsedTime(86400000)).toBe('24h 0m 0s'); // 24 hours
      expect(formatElapsedTime(90061000)).toBe('25h 1m 1s'); // 25 hours
    });

    it('should handle very small values', () => {
      expect(formatElapsedTime(1)).toBe('0s');
      expect(formatElapsedTime(500)).toBe('0s');
    });
  });

  describe('Boundary conditions', () => {
    it('should handle exactly 60 seconds', () => {
      expect(formatElapsedTime(60000)).toBe('1m 0s');
    });

    it('should handle exactly 60 minutes', () => {
      expect(formatElapsedTime(3600000)).toBe('1h 0m 0s');
    });

    it('should handle 59 minutes 59 seconds', () => {
      expect(formatElapsedTime(3599000)).toBe('59m 59s');
    });

    it('should handle 1 hour 0 minutes 0 seconds', () => {
      expect(formatElapsedTime(3600000)).toBe('1h 0m 0s');
    });
  });

  describe('Real-world scenarios', () => {
    it('should format a typical workout time', () => {
      expect(formatElapsedTime(1800000)).toBe('30m 0s'); // 30 minutes
    });

    it('should format a long running session', () => {
      expect(formatElapsedTime(7200000)).toBe('2h 0m 0s'); // 2 hours
    });

    it('should format a quick lap time', () => {
      expect(formatElapsedTime(45000)).toBe('45s');
    });

    it('should format a marathon time', () => {
      expect(formatElapsedTime(9000000)).toBe('2h 30m 0s'); // 2.5 hours
    });
  });

  describe('Input validation', () => {
    it('should handle negative values gracefully', () => {
      expect(formatElapsedTime(-1000)).toBe('0s');
    });

    it('should handle non-integer values', () => {
      expect(formatElapsedTime(1500.5)).toBe('1s');
      expect(formatElapsedTime(1500.9)).toBe('1s');
    });
  });
});

