/**
 * apiError.test.js — Unit tests for the apiError utility
 *
 * Pure function tests — no mocks, no DOM, no async.
 * Validates that every known error code maps to a non-empty string and
 * that unknown codes fall back to the provided message, then the default.
 */
import { ERROR_MESSAGES,getErrorMessage } from '../apiError';

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
