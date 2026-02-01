/**
 * Date utility functions
 */

/**
 * Converts a Date object to YYYY-MM-DD format (for HTML date inputs)
 * @param date - Date object or string
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
}

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export function getTodayDateString(): string {
  return formatDateForInput(new Date());
}

/**
 * Resets time to midnight (00:00:00.000) for date comparison
 * @param date - Date object
 * @returns New Date object with time reset to midnight
 */
export function resetTimeToMidnight(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Calculates the difference in days between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days difference
 */
export function getDaysDifference(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Validates if a date is in the past
 * @param date - Date to validate
 * @returns true if date is in the past
 */
export function isDateInPast(date: Date): boolean {
  const today = resetTimeToMidnight(new Date());
  const checkDate = resetTimeToMidnight(date);
  return checkDate < today;
}

/**
 * Validates if end date is after start date
 * @param startDate - Start date
 * @param endDate - End date
 * @returns true if end date is after start date
 */
export function isEndDateAfterStart(startDate: Date, endDate: Date): boolean {
  return endDate >= startDate; // semester end date and start date should not be same 
}

