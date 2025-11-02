/**
 * Date utility functions for todo application
 * Handles date parsing, formatting, validation, and filtering operations
 */

/**
 * Parse a date string or Date object into a valid Date object
 * @param {string|Date|null} date - Date to parse
 * @returns {Date|null} Parsed Date object or null if invalid
 */
export function parseDate(date) {
  if (!date) return null;

  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }

  if (typeof date === 'string') {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

/**
 * Format a date as an ISO string for storage
 * @param {Date|string|null} date - Date to format
 * @returns {string|null} ISO date string or null
 */
export function formatDateISO(date) {
  const parsed = parseDate(date);
  return parsed ? parsed.toISOString() : null;
}

/**
 * Format a date for display (localized)
 * @param {Date|string|null} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string or empty string
 */
export function formatDateDisplay(date, options = {}) {
  const parsed = parseDate(date);
  if (!parsed) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };

  return parsed.toLocaleDateString(undefined, defaultOptions);
}

/**
 * Check if a date is today
 * @param {Date|string|null} date - Date to check
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {boolean} True if the date is today
 */
export function isToday(date, referenceDate = new Date()) {
  const parsed = parseDate(date);
  if (!parsed) return false;

  const ref = parseDate(referenceDate) || new Date();

  return parsed.toDateString() === ref.toDateString();
}

/**
 * Check if a date is in the past (before today)
 * @param {Date|string|null} date - Date to check
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {boolean} True if the date is in the past
 */
export function isOverdue(date, referenceDate = new Date()) {
  const parsed = parseDate(date);
  if (!parsed) return false;

  const ref = parseDate(referenceDate) || new Date();

  // Set time to start of day for fair comparison
  const parsedStartOfDay = new Date(parsed);
  parsedStartOfDay.setHours(0, 0, 0, 0);

  const refStartOfDay = new Date(ref);
  refStartOfDay.setHours(0, 0, 0, 0);

  return parsedStartOfDay < refStartOfDay;
}

/**
 * Check if a date is in the future (after today)
 * @param {Date|string|null} date - Date to check
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {boolean} True if the date is in the future
 */
export function isUpcoming(date, referenceDate = new Date()) {
  const parsed = parseDate(date);
  if (!parsed) return false;

  const ref = parseDate(referenceDate) || new Date();

  // Set time to start of day for fair comparison
  const parsedStartOfDay = new Date(parsed);
  parsedStartOfDay.setHours(0, 0, 0, 0);

  const refStartOfDay = new Date(ref);
  refStartOfDay.setHours(0, 0, 0, 0);

  return parsedStartOfDay > refStartOfDay;
}

/**
 * Get the start of today (00:00:00.000)
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {Date} Start of today
 */
export function getStartOfToday(referenceDate = new Date()) {
  const date = new Date(referenceDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Get the end of today (23:59:59.999)
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {Date} End of today
 */
export function getEndOfToday(referenceDate = new Date()) {
  const date = new Date(referenceDate);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * Check if a date falls within today's range
 * @param {Date|string|null} date - Date to check
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {boolean} True if the date is today
 */
export function isDueToday(date, referenceDate = new Date()) {
  const parsed = parseDate(date);
  if (!parsed) return false;

  const startOfToday = getStartOfToday(referenceDate);
  const endOfToday = getEndOfToday(referenceDate);

  return parsed >= startOfToday && parsed <= endOfToday;
}

/**
 * Check if a date is due today considering timezone offset
 * More robust version that handles timezone edge cases
 * @param {Date|string|null} date - Date to check
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {boolean} True if the date is due today (timezone-aware)
 */
export function isDueTodayTimezoneAware(date, referenceDate = new Date()) {
  const parsed = parseDate(date);
  if (!parsed) return false;

  const ref = parseDate(referenceDate) || new Date();

  // Get the date parts in local timezone to avoid timezone issues
  const parsedDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  const refDate = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());

  return parsedDate.getTime() === refDate.getTime();
}

/**
 * Get relative time description (e.g., "Today", "Tomorrow", "Yesterday")
 * @param {Date|string|null} date - Date to describe
 * @param {Date} referenceDate - Reference date (defaults to today)
 * @returns {string} Relative time description
 */
export function getRelativeTimeString(date, referenceDate = new Date()) {
  const parsed = parseDate(date);
  if (!parsed) return '';

  const ref = parseDate(referenceDate) || new Date();

  const diffTime = parsed.getTime() - ref.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  if (diffDays > 7) return 'Future';
  if (diffDays < -7) return 'Past';

  return formatDateDisplay(parsed);
}

/**
 * Validate if a date string is a valid ISO date
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid ISO date
 */
export function isValidISODate(dateString) {
  if (typeof dateString !== 'string') return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Create a date object from year, month, day
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day
 * @returns {Date} Date object
 */
export function createDate(year, month, day) {
  return new Date(year, month - 1, day);
}

/**
 * Compare two dates (ignoring time)
 * @param {Date|string|null} date1 - First date
 * @param {Date|string|null} date2 - Second date
 * @returns {number} -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export function compareDates(date1, date2) {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);

  if (!d1 && !d2) return 0;
  if (!d1) return -1;
  if (!d2) return 1;

  const start1 = getStartOfToday(d1);
  const start2 = getStartOfToday(d2);

  if (start1 < start2) return -1;
  if (start1 > start2) return 1;
  return 0;
}

/**
 * Sort dates in ascending order
 * @param {Array<Date|string|null>} dates - Array of dates to sort
 * @returns {Array<Date|string|null>} Sorted dates
 */
export function sortDates(dates) {
  return [...dates].sort(compareDates);
}
