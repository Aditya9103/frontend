/**
 * axiosInstance.js — Global Axios configuration
 *
 * Auth transport:
 *   - Access token: in-memory via tokenStore.js, sent as Authorization: Bearer header
 *   - Refresh token: httpOnly Secure cookie (no JS access)
 *
 * On 401: silently calls POST /auth/refresh, updates the token store,
 * retries the original request. Concurrent 401s queue against the single
 * in-flight refresh promise — only one refresh call is ever made at a time.
 *
 * Error shape: every rejected error has `err.code` attached from the backend
 * envelope's `error.code` field, so callers can branch on machine-readable
 * codes (e.g. 'ACCOUNT_LOCKED', 'RATE_LIMIT_EXCEEDED') instead of parsing
 * human-readable message strings.
 *
 * Envelope note: this interceptor does NOT unwrap the response envelope.
 * Services return the raw Axios response (`res`); thunks/callers read
 * `res.data.data` for the payload. This keeps services transparent and
 * makes the envelope shape explicit at the Redux slice boundary.
 */
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { clearAccessToken,getAccessToken, setAccessToken } from './tokenStore';

// ── Base URL ──────────────────────────────────────────────────────────────────
const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const BASE_URL = isLocal
  ? 'http://localhost:5001/api/v1'
  : import.meta.env.VITE_API_BASE_URL || 'https://learnify-backendrender.onrender.com/api/v1';

// ── Axios Instance ────────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required for the httpOnly refresh token cookie
  timeout: 40000,
});

// ── Request interceptor: attach Bearer token ─────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 → refresh → retry ───────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;

    if (!response) {
      toast.error('Network issue. Please check your internet connection.');
      return Promise.reject(error);
    }

    const { status, data } = response;

    // ── Attach machine-readable code to every error ───────────────────────────
    // Callers branch on err.code (e.g. 'ACCOUNT_LOCKED') — not message strings.
    const errorCode = data?.error?.code;
    if (errorCode) error.code = errorCode;

    // ── 401: Access token expired → attempt silent refresh ───────────────────
    if (status === 401 && !originalRequest._retry) {
      // Never retry the refresh endpoint itself
      if (originalRequest.url?.includes('/auth/refresh')) {
        clearAccessToken();
        if (!window.location.pathname.includes('/login')) {
          toast.error('Your session expired. Please log in again.');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue request until the in-flight refresh resolves
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axiosInstance.post('/auth/refresh');
        const newToken = refreshResponse.data?.data?.accessToken;
        setAccessToken(newToken); // notifies tokenStore listeners (e.g. socket.js)
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        if (!window.location.pathname.includes('/login')) {
          toast.error('Your session expired. Please log in again.');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── 403: Forbidden ────────────────────────────────────────────────────────
    if (status === 403) {
      toast.error("You don't have permission to do that.");
    }

    // ── 429: Rate limited ─────────────────────────────────────────────────────
    if (status === 429) {
      toast.error(data?.error?.message || 'Too many requests. Please slow down.');
    }

    // ── 5xx: Server error ─────────────────────────────────────────────────────
    if (status >= 500) {
      toast.error('Something went wrong on our end. Please try again shortly.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;