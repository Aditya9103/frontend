/**
 * apiError.test.js — Unit tests for the apiError utility
 *
 * Pure function tests — no mocks, no DOM, no async.
 * Validates that every known error code maps to a non-empty string and
 * that unknown codes fall back to the provided message, then the default.
 */
import { ERROR_MESSAGES, extractApiError, getErrorMessage } from '../apiError';

describe('getErrorMessage', () => {
  it('returns the mapped message for a known code', () => {
    expect(getErrorMessage('ACCOUNT_LOCKED')).toBe(ERROR_MESSAGES.ACCOUNT_LOCKED);
    expect(getErrorMessage('INVALID_CREDENTIALS')).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
    expect(getErrorMessage('RATE_LIMIT_EXCEEDED')).toBe(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
    expect(getErrorMessage('OTP_EXPIRED')).toBe(ERROR_MESSAGES.OTP_EXPIRED);
  });

  it('returns the fallback message for an unknown code', () => {
    expect(getErrorMessage('UNKNOWN_CODE', 'Server exploded')).toBe('Server exploded');
  });

  it('returns the default message when both code and fallback are undefined', () => {
    const result = getErrorMessage(undefined, undefined);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns the mapped message even when a fallback is provided', () => {
    // Known code should take precedence over the fallback
    expect(getErrorMessage('FORBIDDEN', 'generic fallback')).toBe(ERROR_MESSAGES.FORBIDDEN);
  });

  it('every entry in ERROR_MESSAGES is a non-empty string', () => {
    Object.entries(ERROR_MESSAGES).forEach(([code, msg]) => {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0, `ERROR_MESSAGES.${code} is empty`);
    });
  });
});

describe('extractApiError (Envelope Extractor)', () => {
  it('extracts root formErrors from backend validation response', () => {
    const err = {
      response: {
        data: {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            formErrors: ['Passwords must match'],
          },
        },
      },
    };
    expect(extractApiError(err)).toBe('Passwords must match');
  });

  it('extracts field validation error from fields map', () => {
    const err = {
      response: {
        data: {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            fields: {
              email: ['Invalid email format'],
            },
          },
        },
      },
    };
    expect(extractApiError(err)).toBe('Invalid email format');
  });

  it('maps known error code to user-facing message', () => {
    const err = {
      response: {
        data: {
          success: false,
          error: {
            code: 'ACCOUNT_LOCKED',
            message: 'Account temporarily locked',
          },
        },
      },
    };
    expect(extractApiError(err)).toBe(ERROR_MESSAGES.ACCOUNT_LOCKED);
  });

  it('falls back to err.message when response has no structured error', () => {
    const err = new Error('Network timeout');
    expect(extractApiError(err)).toBe('Network timeout');
  });

  it('returns safe default message on null/undefined error', () => {
    expect(extractApiError(null)).toBe('Something went wrong. Please try again.');
  });
});
