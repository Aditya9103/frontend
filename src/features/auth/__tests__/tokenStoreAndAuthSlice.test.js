/**
 * tokenStoreAndAuthSlice.test.js — Frontend Authentication & In-Memory Token Store Tests
 *
 * Scope:
 *  - In-memory token store pub/sub and lifecycle (set, get, clear, subscribe, unsubscribe)
 *  - AuthSlice session restoration (silent refresh resolution)
 *  - AuthSlice credential cleanup (logout, clearAuth, session failure)
 *  - Auth success handlers (login, createAccount)
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearAccessToken,
  getAccessToken,
  onTokenChange,
  setAccessToken,
} from '../../../core/config/tokenStore';
import authReducer, {
  clearAuth,
  createAccount,
  login,
  logout,
  restoreSession,
} from '../redux/AuthSlice';

describe('=== Frontend Auth: TokenStore & In-Memory Transport ===', () => {
  beforeEach(() => {
    clearAccessToken();
    localStorage.clear();
  });

  it('initially returns null for getAccessToken', () => {
    expect(getAccessToken()).toBeNull();
  });

  it('stores token in memory and notifies subscribers via onTokenChange', () => {
    const subscriber = vi.fn();
    const unsubscribe = onTokenChange(subscriber);

    setAccessToken('jwt-access-token-12345');

    expect(getAccessToken()).toBe('jwt-access-token-12345');
    expect(subscriber).toHaveBeenCalledWith('jwt-access-token-12345');

    unsubscribe();
  });

  it('clears token in memory and notifies subscribers with null', () => {
    const subscriber = vi.fn();
    const unsubscribe = onTokenChange(subscriber);

    setAccessToken('jwt-token-active');
    clearAccessToken();

    expect(getAccessToken()).toBeNull();
    expect(subscriber).toHaveBeenLastCalledWith(null);

    unsubscribe();
  });

  it('does not notify subscriber after unsubscribe() is called', () => {
    const subscriber = vi.fn();
    const unsubscribe = onTokenChange(subscriber);

    unsubscribe();
    setAccessToken('new-token');

    expect(subscriber).not.toHaveBeenCalledWith('new-token');
  });
});

describe('=== Frontend Auth: Redux AuthSlice Session Lifecycle ===', () => {
  const initialAuthState = {
    isLoggedIn: false,
    data: {},
    role: '',
    permissions: [],
    authCheckComplete: false,
  };

  beforeEach(() => {
    clearAccessToken();
    localStorage.clear();
  });

  it('restoreSession with valid user updates state and marks authCheckComplete: true', () => {
    const user = {
      _id: 'user-id-123',
      fullName: 'John Doe',
      email: 'john@example.com',
      role: 'STUDENT',
    };

    const state = authReducer(
      initialAuthState,
      restoreSession({ user, permissions: ['course:read'] })
    );

    expect(state.isLoggedIn).toBe(true);
    expect(state.authCheckComplete).toBe(true);
    expect(state.data.email).toBe('john@example.com');
    expect(state.role).toBe('STUDENT');
    expect(state.permissions).toContain('course:read');
  });

  it('restoreSession with null (expired/revoked session) clears localStorage and marks authCheckComplete: true', () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', 'STUDENT');

    const state = authReducer(
      { ...initialAuthState, isLoggedIn: true, role: 'STUDENT' },
      restoreSession(null)
    );

    expect(state.isLoggedIn).toBe(false);
    expect(state.authCheckComplete).toBe(true);
    expect(state.role).toBe('');
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

  it('clearAuth action wipes token store, resets state, and cleans localStorage', () => {
    setAccessToken('some-secret-token');
    localStorage.setItem('isLoggedIn', 'true');

    const state = authReducer(
      { ...initialAuthState, isLoggedIn: true },
      clearAuth()
    );

    expect(state.isLoggedIn).toBe(false);
    expect(state.authCheckComplete).toBe(true);
    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
  });

  it('login.fulfilled updates Redux state and sets in-memory access token', () => {
    const payload = {
      data: {
        accessToken: 'access-jwt-token-999',
        user: {
          id: 'u-1',
          fullName: 'Alice Smith',
          email: 'alice@example.com',
          role: 'ADMIN',
          permissions: ['course:create', 'course:delete'],
        },
      },
    };

    const state = authReducer(
      initialAuthState,
      { type: login.fulfilled.type, payload }
    );

    expect(state.isLoggedIn).toBe(true);
    expect(state.role).toBe('ADMIN');
    expect(state.permissions).toContain('course:create');
    expect(getAccessToken()).toBe('access-jwt-token-999');
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
  });

  it('logout.fulfilled wipes in-memory token, cleans state, and removes localStorage flags', () => {
    setAccessToken('active-token-to-wipe');
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', 'USER');

    const state = authReducer(
      { ...initialAuthState, isLoggedIn: true, role: 'USER' },
      { type: logout.fulfilled.type }
    );

    expect(state.isLoggedIn).toBe(false);
    expect(state.role).toBe('');
    expect(getAccessToken()).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });
});
