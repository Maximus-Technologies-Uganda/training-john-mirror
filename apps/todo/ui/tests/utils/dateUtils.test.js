import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  parseDate,
  formatDateISO,
  formatDateDisplay,
  isToday,
  isOverdue,
  isUpcoming,
  getStartOfToday,
  getEndOfToday,
  isDueToday,
  getRelativeTimeString,
  isValidISODate,
  createDate,
  compareDates,
  sortDates
} from '../../src/utils/dateUtils.js';

describe('dateUtils', () => {
  let mockDate;

  beforeEach(() => {
    // Mock Date.now to return a consistent date for testing
    mockDate = new Date('2025-01-15T12:00:00Z');
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('parseDate', () => {
    it('parses valid Date object', () => {
      const date = new Date('2025-01-15');
      expect(parseDate(date)).toEqual(date);
    });

    it('parses valid ISO string', () => {
      const isoString = '2025-01-15T12:00:00Z';
      const result = parseDate(isoString);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2025-01-15T12:00:00.000Z');
    });

    it('returns null for invalid date string', () => {
      expect(parseDate('invalid')).toBeNull();
      expect(parseDate('')).toBeNull();
    });

    it('returns null for null/undefined', () => {
      expect(parseDate(null)).toBeNull();
      expect(parseDate(undefined)).toBeNull();
    });

    it('returns null for invalid Date object', () => {
      const invalidDate = new Date('invalid');
      expect(parseDate(invalidDate)).toBeNull();
    });
  });

  describe('formatDateISO', () => {
    it('formats Date object to ISO string', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      expect(formatDateISO(date)).toBe('2025-01-15T12:00:00.000Z');
    });

    it('formats ISO string to ISO string', () => {
      const isoString = '2025-01-15T12:00:00Z';
      expect(formatDateISO(isoString)).toBe('2025-01-15T12:00:00.000Z');
    });

    it('returns null for invalid dates', () => {
      expect(formatDateISO('invalid')).toBeNull();
      expect(formatDateISO(null)).toBeNull();
    });
  });

  describe('formatDateDisplay', () => {
    it('formats date for display', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const result = formatDateDisplay(date);
      expect(result).toMatch(/\d{1,2} \w+ \d{4}/); // e.g., "15 Jan 2025"
    });

    it('returns empty string for invalid dates', () => {
      expect(formatDateDisplay('invalid')).toBe('');
      expect(formatDateDisplay(null)).toBe('');
    });

    it('accepts format options', () => {
      const date = new Date('2025-01-15T12:00:00Z');
      const result = formatDateDisplay(date, { month: 'long', day: 'numeric', year: undefined });
      expect(result).toBe('15 January');
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
      expect(isToday(today.toISOString())).toBe(true);
    });

    it('returns false for other dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(isToday(yesterday)).toBe(false);
      expect(isToday(tomorrow)).toBe(false);
    });

    it('returns false for invalid dates', () => {
      expect(isToday('invalid')).toBe(false);
      expect(isToday(null)).toBe(false);
    });

    it('uses reference date when provided', () => {
      const referenceDate = new Date('2025-01-10');
      const testDate = new Date('2025-01-10');
      expect(isToday(testDate, referenceDate)).toBe(true);
    });
  });

  describe('isOverdue', () => {
    it('returns true for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isOverdue(yesterday)).toBe(true);
    });

    it('returns false for today and future dates', () => {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(isOverdue(today)).toBe(false);
      expect(isOverdue(tomorrow)).toBe(false);
    });

    it('returns false for invalid dates', () => {
      expect(isOverdue('invalid')).toBe(false);
      expect(isOverdue(null)).toBe(false);
    });
  });

  describe('isUpcoming', () => {
    it('returns true for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isUpcoming(tomorrow)).toBe(true);
    });

    it('returns false for today and past dates', () => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      expect(isUpcoming(today)).toBe(false);
      expect(isUpcoming(yesterday)).toBe(false);
    });

    it('returns false for invalid dates', () => {
      expect(isUpcoming('invalid')).toBe(false);
      expect(isUpcoming(null)).toBe(false);
    });
  });

  describe('getStartOfToday and getEndOfToday', () => {
    it('returns correct start and end of today', () => {
      const startOfToday = getStartOfToday();
      const endOfToday = getEndOfToday();

      expect(startOfToday.getHours()).toBe(0);
      expect(startOfToday.getMinutes()).toBe(0);
      expect(startOfToday.getSeconds()).toBe(0);
      expect(startOfToday.getMilliseconds()).toBe(0);

      expect(endOfToday.getHours()).toBe(23);
      expect(endOfToday.getMinutes()).toBe(59);
      expect(endOfToday.getSeconds()).toBe(59);
      expect(endOfToday.getMilliseconds()).toBe(999);
    });

    it('works with reference dates', () => {
      const referenceDate = new Date('2025-01-10');
      const startOfRef = getStartOfToday(referenceDate);
      const endOfRef = getEndOfToday(referenceDate);

      // Check that hours are set correctly in local timezone
      expect(startOfRef.getHours()).toBe(0);
      expect(startOfRef.getMinutes()).toBe(0);
      expect(startOfRef.getSeconds()).toBe(0);
      expect(startOfRef.getMilliseconds()).toBe(0);

      expect(endOfRef.getHours()).toBe(23);
      expect(endOfRef.getMinutes()).toBe(59);
      expect(endOfRef.getSeconds()).toBe(59);
      expect(endOfRef.getMilliseconds()).toBe(999);
    });
  });

  describe('isDueToday', () => {
    it('returns true for dates within today', () => {
      const startOfToday = getStartOfToday();
      const endOfToday = getEndOfToday();
      const middleOfToday = new Date(startOfToday.getTime() + (endOfToday.getTime() - startOfToday.getTime()) / 2);

      expect(isDueToday(startOfToday)).toBe(true);
      expect(isDueToday(endOfToday)).toBe(true);
      expect(isDueToday(middleOfToday)).toBe(true);
    });

    it('returns false for dates outside today', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(isDueToday(yesterday)).toBe(false);
      expect(isDueToday(tomorrow)).toBe(false);
    });
  });

  describe('getRelativeTimeString', () => {
    it('returns correct relative strings', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const future = new Date(today);
      future.setDate(today.getDate() + 10);

      expect(getRelativeTimeString(today)).toBe('Today');
      expect(getRelativeTimeString(yesterday)).toBe('Yesterday');
      expect(getRelativeTimeString(tomorrow)).toBe('Tomorrow');
      expect(getRelativeTimeString(future)).toBe('Future');
    });

    it('returns "Past" for far past dates', () => {
      const farPast = new Date('2020-01-01');
      const result = getRelativeTimeString(farPast);
      expect(result).toBe('Past');
    });

    it('returns empty string for invalid dates', () => {
      expect(getRelativeTimeString('invalid')).toBe('');
      expect(getRelativeTimeString(null)).toBe('');
    });
  });

  describe('isValidISODate', () => {
    it('returns true for valid ISO dates', () => {
      expect(isValidISODate('2025-01-15T12:00:00.000Z')).toBe(true);
      expect(isValidISODate('2025-01-15T12:00:00Z')).toBe(true);
    });

    it('returns false for invalid strings', () => {
      expect(isValidISODate('invalid')).toBe(false);
      expect(isValidISODate('2025-13-45')).toBe(false);
      expect(isValidISODate('')).toBe(false);
      expect(isValidISODate(null)).toBe(false);
      expect(isValidISODate(123)).toBe(false);
    });
  });

  describe('createDate', () => {
    it('creates date from year, month, day', () => {
      const date = createDate(2025, 1, 15);
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getDate()).toBe(15);
    });
  });

  describe('compareDates', () => {
    it('compares dates correctly', () => {
      const date1 = new Date('2025-01-15');
      const date2 = new Date('2025-01-16');
      const date3 = new Date('2025-01-15');

      expect(compareDates(date1, date2)).toBe(-1);
      expect(compareDates(date2, date1)).toBe(1);
      expect(compareDates(date1, date3)).toBe(0);
    });

    it('handles null dates', () => {
      const date = new Date('2025-01-15');
      expect(compareDates(null, date)).toBe(-1);
      expect(compareDates(date, null)).toBe(1);
      expect(compareDates(null, null)).toBe(0);
    });
  });

  describe('sortDates', () => {
    it('sorts dates in ascending order', () => {
      const dates = [
        new Date('2025-01-15'),
        new Date('2025-01-10'),
        new Date('2025-01-20')
      ];

      const sorted = sortDates(dates);
      expect(sorted[0].getDate()).toBe(10);
      expect(sorted[1].getDate()).toBe(15);
      expect(sorted[2].getDate()).toBe(20);
    });

    it('handles mixed valid and invalid dates', () => {
      const dates = [
        new Date('2025-01-15'),
        null,
        new Date('2025-01-10')
      ];

      const sorted = sortDates(dates);
      expect(sorted[0]).toBe(null);
      expect(sorted[1].getDate()).toBe(10);
      expect(sorted[2].getDate()).toBe(15);
    });
  });
});
