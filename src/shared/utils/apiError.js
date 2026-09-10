/**
 * apiError.js — Backend error code → user-facing message map
 *
 * Keeps every feature from inventing its own error-message switch statement.
 * The backend's machine-readable `error.code` values (from the Zod/AppError
 * response envelope) map to concise, actionable copy here.
 *
 * Usage:
 *   import { getErrorMessage } from '@/shared/utils/apiError';
 *   catch (err) {
 *     toast.error(getErrorMessage(err.code, err.message));
 *   }
 */

export const ERROR_MESSAGES = {
  // ── Auth ───────────────────────────────────────────────────────────────────
  INVALID_CREDENTIALS:   'Incorrect email or password.',
  ACCOUNT_LOCKED:        'Account locked after too many failed attempts. Try again in 15 minutes.',
  RATE_LIMIT_EXCEEDED:   'Too many attempts. Please wait before trying again.',
  INVALID_OTP:           'Incorrect OTP. Please try again.',
  OTP_EXPIRED:           'OTP has expired. Request a new one.',
  OTP_ALREADY_USED:      'This OTP has already been used.',
  UNAUTHORIZED:          'Please log in to continue.',
  FORBIDDEN:             "You don't have permission to do that.",
  TOKEN_EXPIRED:         'Your session has expired. Please log in again.',
  REFRESH_TOKEN_INVALID: 'Session invalid. Please log in again.',

  // ── Validation ─────────────────────────────────────────────────────────────
  VALIDATION_ERROR:      'Please check the highlighted fields and try again.',

  // ── Resources ──────────────────────────────────────────────────────────────
  USER_NOT_FOUND:        'User not found.',
  COURSE_NOT_FOUND:      'Course not found.',
  LECTURE_NOT_FOUND:     'Lecture not found.',
  ENROLLMENT_NOT_FOUND:  'You are not enrolled in this course.',
  ALREADY_ENROLLED:      'You are already enrolled in this course.',
  PAYMENT_NOT_FOUND:     'Payment record not found.',

  // ── Server ─────────────────────────────────────────────────────────────────
  INTERNAL_ERROR:        'Something went wrong on our end. Please try again.',
  SERVICE_UNAVAILABLE:   'The service is temporarily unavailable. Please try later.',
};

/**
 * Returns a user-facing message for a backend error code.
 *
 * @param {string | undefined} code  - err.code from the thrown error
 * @param {string | undefined} fallback - original err.message (used if no code match)
 * @returns {string}
 */
export const getErrorMessage = (code, fallback) =>
  ERROR_MESSAGES[code] ?? fallback ?? 'Something went wrong. Please try again.';

/**
 * Extracts a concise, actionable error message from an Axios error object
 * following the backend standard envelope shape: { success: false, error: { code, message, fields, formErrors } }.
 *
 * Priority:
 *  1. formErrors array (Zod root refinements, e.g. "Passwords must match")
 *  2. fields map (first field validation error message)
 *  3. Mapped ERROR_MESSAGES[code] (if non-generic)
 *  4. backend message or original error message
 *
 * @param {any} err - Caught Axios or runtime error
 * @returns {string}
 */
export const extractApiError = (err) => {
  if (!err) return 'Something went wrong. Please try again.';
  const backendError = err.response?.data?.error;
  if (backendError) {
    if (Array.isArray(backendError.formErrors) && backendError.formErrors.length > 0) {
      return backendError.formErrors[0];
    }
    if (backendError.fields && typeof backendError.fields === 'object') {
      const firstField = Object.values(backendError.fields)[0];
      if (Array.isArray(firstField) && firstField.length > 0) {
        return firstField[0];
      }
    }
    if (backendError.code && ERROR_MESSAGES[backendError.code] && backendError.code !== 'VALIDATION_ERROR') {
      return ERROR_MESSAGES[backendError.code];
    }
    if (backendError.message) {
      return backendError.message;
    }
  }
  return err.message || 'Something went wrong. Please try again.';
};
