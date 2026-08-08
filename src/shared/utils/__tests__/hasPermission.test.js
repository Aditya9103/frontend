/**
 * hasPermission.test.js — Unit tests for the permission check helpers
 *
 * Pure function tests — no mocks, no DOM.
 * Verifies the three functions (hasPermission, hasAnyPermission, hasAllPermissions)
 * and the Perms constants object.
 */
import { hasAllPermissions, hasAnyPermission, hasPermission, Perms } from '../hasPermission';

const ADMIN_PERMS = [Perms.COURSE_CREATE, Perms.COURSE_EDIT, Perms.USER_VIEW, Perms.ANALYTICS_VIEW];

// ── hasPermission ─────────────────────────────────────────────────────────────

describe('hasPermission', () => {
  it('returns true when the user has the permission', () => {
    expect(hasPermission(ADMIN_PERMS, Perms.COURSE_CREATE)).toBe(true);
  });

  it('returns false when the user lacks the permission', () => {
    expect(hasPermission(ADMIN_PERMS, Perms.PAYMENT_REFUND)).toBe(false);
  });

  it('returns false for an empty permissions array', () => {
    expect(hasPermission([], Perms.COURSE_CREATE)).toBe(false);
  });

  it('returns false when permissions is undefined', () => {
    expect(hasPermission(undefined, Perms.COURSE_CREATE)).toBe(false);
  });

  it('returns false when permissions is null', () => {
    expect(hasPermission(null, Perms.COURSE_CREATE)).toBe(false);
  });
});

// ── hasAnyPermission ──────────────────────────────────────────────────────────

describe('hasAnyPermission', () => {
  it('returns true if at least one permission matches', () => {
    expect(hasAnyPermission(ADMIN_PERMS, [Perms.PAYMENT_REFUND, Perms.COURSE_EDIT])).toBe(true);
  });

  it('returns false if no permissions match', () => {
    expect(hasAnyPermission(ADMIN_PERMS, [Perms.PAYMENT_REFUND, Perms.AUDIT_LOG_DELETE])).toBe(false);
  });

  it('returns false for an empty check list', () => {
    expect(hasAnyPermission(ADMIN_PERMS, [])).toBe(false);
  });
});

// ── hasAllPermissions ─────────────────────────────────────────────────────────

describe('hasAllPermissions', () => {
  it('returns true when the user has all of the required permissions', () => {
    expect(hasAllPermissions(ADMIN_PERMS, [Perms.COURSE_CREATE, Perms.USER_VIEW])).toBe(true);
  });

  it('returns false when the user is missing even one permission', () => {
    expect(hasAllPermissions(ADMIN_PERMS, [Perms.COURSE_CREATE, Perms.PAYMENT_REFUND])).toBe(false);
  });

  it('returns true for an empty requirement list (vacuous truth)', () => {
    expect(hasAllPermissions(ADMIN_PERMS, [])).toBe(true);
  });
});

// ── Perms constants ───────────────────────────────────────────────────────────

describe('Perms', () => {
  it('all Perms values are non-empty strings in the format "domain:action"', () => {
    Object.entries(Perms).forEach(([key, value]) => {
      expect(typeof value).toBe('string');
      expect(value).toMatch(/^[a-z_]+:[a-z_]+$/, `Perms.${key} has wrong format`);
    });
  });

  it('has no duplicate values', () => {
    const values = Object.values(Perms);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });
});
