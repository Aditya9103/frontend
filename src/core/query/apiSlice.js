/**
 * apiSlice.js — Base RTK Query API slice (Phase 5)
 *
 * All feature-specific API slices (courseApi, userApi, etc.) are injected
 * into this base slice via `injectEndpoints`. This keeps a single shared
 * cache, tag-invalidation graph, and request de-duplication pool.
 *
 * The `baseQuery` delegates to the existing axiosInstance so that:
 *   - The 401 → refresh → retry interceptor applies automatically
 *   - The Authorization header is injected by the request interceptor
 *   - err.code is available on rejected queries for branching in components
 */
import { createApi } from '@reduxjs/toolkit/query/react';
import axiosInstance from '../config/axiosInstance';

/**
 * Thin wrapper around axiosInstance that matches the shape RTK Query expects:
 *   { data }     on success
 *   { error }    on failure
 */
const axiosBaseQuery = () => async ({ url, method = 'GET', data, params }) => {
  try {
    const result = await axiosInstance({ url, method, data, params });
    // axiosInstance returns the full Axios response; RTK Query expects { data }
    return { data: result.data };
  } catch (axiosError) {
    return {
      error: {
        status: axiosError?.response?.status,
        code: axiosError?.code,                        // machine-readable error code
        message: axiosError?.response?.data?.error?.message || axiosError.message,
        data: axiosError?.response?.data,
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  // Global tags — feature slices add their own in injectEndpoints
  tagTypes: ['Course', 'Courses', 'User', 'Notifications', 'Discussion'],
  endpoints: () => ({}),
});

export default apiSlice;
