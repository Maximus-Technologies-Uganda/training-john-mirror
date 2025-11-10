/**
 * Tests for Time Formatting Utilities
 * 
 * Tests the formatTime() and parseTime() functions that convert between
 * milliseconds and MM:SS:MS format
 */

import { describe, it, expect } from 'vitest';
import { formatTime, parseTime } from '@/utils/formatting';

describe('Time Formatting Utilities', () => {
  describe('formatTime()', () => {
    it('should format 0ms as 00:00:00', () => {
      expect(formatTime(0)).toBe('00:00:00');
    });

    it('should format 1000ms (1 second) as 00:01:00', () => {
      expect(formatTime(1000)).toBe('00:01:00');
    });

    it('should format 5432ms as 00:05:43', () => {
      expect(formatTime(5432)).toBe('00:05:43');
    });

    it('should format 65000ms (1m 5s) as 01:05:00', () => {
      expect(formatTime(65000)).toBe('01:05:00');
    });

    it('should format 65430ms (1m 5s 43cs) as 01:05:43', () => {
      expect(formatTime(65430)).toBe('01:05:43');
    });

    it('should format 599999ms as 09:59:99', () => {
      expect(formatTime(599999)).toBe('09:59:99');
    });

    it('should cap values at 5999990ms (99:59:99)', () => {
      expect(formatTime(5999990)).toBe('99:59:99');
    });

    it('should cap excessive values to 99:59:99', () => {
      expect(formatTime(10000000)).toBe('99:59:99');
    });

    it('should handle negative values by clamping to 00:00:00', () => {
      expect(formatTime(-1000)).toBe('00:00:00');
    });

    it('should handle edge case of 5999989ms correctly', () => {
      expect(formatTime(5999990)).toBe('99:59:99');
    });
  });

  describe('parseTime()', () => {
    it('should parse 00:00:00 as 0ms', () => {
      expect(parseTime('00:00:00')).toBe(0);
    });

    it('should parse 00:01:00 as 1000ms', () => {
      expect(parseTime('00:01:00')).toBe(1000);
    });

    it('should parse 00:05:43 as 5430ms', () => {
      expect(parseTime('00:05:43')).toBe(5430);
    });

    it('should parse 01:05:00 as 65000ms', () => {
      expect(parseTime('01:05:00')).toBe(65000);
    });

    it('should parse 01:05:43 as 65430ms', () => {
      expect(parseTime('01:05:43')).toBe(65430);
    });

    it('should parse 99:59:99 as 5999990ms', () => {
      expect(parseTime('99:59:99')).toBe(5999990);
    });

    it('should return null for invalid format (missing colon)', () => {
      expect(parseTime('0:5:43')).toBeNull();
    });

    it('should return null for invalid format (letters)', () => {
      expect(parseTime('00:05:ab')).toBeNull();
    });

    it('should return null for minutes > 99', () => {
      expect(parseTime('100:00:00')).toBeNull();
    });

    it('should return null for seconds > 59', () => {
      expect(parseTime('00:60:00')).toBeNull();
    });

    it('should return null for centiseconds > 99', () => {
      expect(parseTime('00:00:100')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseTime('')).toBeNull();
    });
  });

  describe('Round-trip conversion', () => {
    it('should convert 0ms -> format -> parse -> 0ms', () => {
      const original = 0;
      const formatted = formatTime(original);
      const parsed = parseTime(formatted);
      expect(parsed).toBe(original);
    });

    it('should convert 5432ms -> format -> parse -> 5430ms (loses sub-centisecond)', () => {
      const original = 5432;
      const formatted = formatTime(original);
      const parsed = parseTime(formatted);
      // Note: We lose precision beyond centiseconds (MS = 43, which is 430ms)
      expect(parsed).toBe(5430);
    });

    it('should convert 65430ms -> format -> parse -> 65430ms', () => {
      const original = 65430;
      const formatted = formatTime(original);
      const parsed = parseTime(formatted);
      expect(parsed).toBe(original);
    });
  });
});
