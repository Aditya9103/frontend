/**
 * socket.js — Phase 6 Socket.IO client
 *
 * Connects with the in-memory access token from tokenStore.
 * Re-authenticates automatically after every token refresh
 * (via the onTokenChange pub/sub listener).
 */
import { io } from 'socket.io-client';

import { getAccessToken, onTokenChange } from './tokenStore';

const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const SOCKET_URL = isLocal
  ? 'http://localhost:5001'
  : import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') ||
    'https://learnify-backendrender.onrender.com';

let socket = null;
let _unsubTokenChange = null;

/** Initialise Socket.IO. Call once after the user successfully logs in. */
export const initSocket = () => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token: getAccessToken() },
    transports: ['websocket', 'polling'],
    reconnectionDelayMax: 10_000,
    reconnectionAttempts: 10,
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.debug('[Socket] Connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.debug('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message);
  });

  // Re-authenticate when the access token is refreshed
  _unsubTokenChange = onTokenChange((newToken) => {
    if (socket && newToken) {
      socket.auth = { token: newToken };
      // Reconnect to pick up the new auth header
      if (!socket.connected) socket.connect();
    }
  });

  return socket;
};

/** Disconnect and clean up the socket + listener. Call on logout. */
export const destroySocket = () => {
  if (_unsubTokenChange) {
    _unsubTokenChange();
    _unsubTokenChange = null;
  }
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/** Returns the current socket instance (or null if not initialised). */
export const getSocket = () => socket;
