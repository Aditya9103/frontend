/**
 * tokenStore.js — In-memory access token store
 *
 * The access token lives here, NOT in Redux state or localStorage.
 * - Redux DevTools would expose it to anyone with the browser extension
 * - localStorage is vulnerable to XSS
 *
 * This module is a plain singleton with a tiny pub/sub so other modules
 * (e.g. socket.js) can react to token changes without importing axiosInstance
 * directly (which would create circular-import risk between sibling config files).
 *
 * Usage:
 *   import { getAccessToken, setAccessToken, clearAccessToken, onTokenChange } from './tokenStore';
 */

let _token = null;
const _listeners = new Set();

/** Returns the current in-memory access token (or null if not set). */
export const getAccessToken = () => _token;

/**
 * Stores a new access token and notifies all subscribers.
 * Called by: AuthSlice thunks (on login/verify), axiosInstance (after refresh).
 */
export const setAccessToken = (token) => {
  _token = token;
  _listeners.forEach((fn) => fn(token));
};

/**
 * Clears the access token and notifies all subscribers with null.
 * Called by: logout thunk, axiosInstance (when refresh fails).
 */
export const clearAccessToken = () => {
  _token = null;
  _listeners.forEach((fn) => fn(null));
};

/**
 * Subscribes to token changes. Returns an unsubscribe function.
 *
 * Used by socket.js to re-authenticate when the token is refreshed:
 *   const unsub = onTokenChange((newToken) => {
 *     if (newToken) socket.auth = { token: newToken };
 *   });
 *
 * @param {(token: string | null) => void} fn
 * @returns {() => void} unsubscribe
 */
export const onTokenChange = (fn) => {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
};
