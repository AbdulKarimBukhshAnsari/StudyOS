/**
 * Validation utility functions
 */

/**
 * Validates if a string is not empty (after trimming)
 * @param value - String to validate
 * @returns true if string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns true if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password length
 * @param password - Password string
 * @param minLength - Minimum length (default: 8)
 * @returns true if password meets length requirement
 */
export function isValidPasswordLength(password: string, minLength: number = 8): boolean {
  return password.length >= minLength;
}

/**
 * Validates if two passwords match
 * @param password - First password
 * @param confirmPassword - Second password to compare
 * @returns true if passwords match
 */
export function doPasswordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

import { isDateInPast, isEndDateAfterStart, getDaysDifference } from './date';

/**
 * Validates semester date range
 * @param startDate - Semester start date
 * @param endDate - Semester end date
 * @param maxDays - Maximum allowed days (default: 730 for 2 years)
 * @returns Object with validation result and error message if invalid
 */
export function validateSemesterDateRange(
  startDate: Date,
  endDate: Date,
  maxDays: number = 730
): { isValid: boolean; error?: string } {
  if (isDateInPast(startDate)) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }

  if (!isEndDateAfterStart(startDate, endDate)) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  const daysDiff = getDaysDifference(startDate, endDate);
  if (daysDiff > maxDays) {
    return { isValid: false, error: `Semester duration cannot exceed ${maxDays / 365} years` };
  }

  return { isValid: true };
}

