/**
 * courseApi.js — Course catalog RTK Query endpoints (Phase 5)
 *
 * Initial migration scope (catalog reads only):
 *   - getCourses      → GET /courses           (replaces CourseSlice thunk for reads)
 *   - getCourseById   → GET /courses/:id
 *
 * These endpoints are injected into the shared `apiSlice`, inheriting its
 * axiosInstance baseQuery, tag system, and cache store.
 *
 * Usage:
 *   import { useGetCoursesQuery, useGetCourseByIdQuery } from './courseApi';
 *   const { data, isLoading, isFetching, error } = useGetCoursesQuery();
 *
 * Cache TTL:
 *   keepUnusedDataFor: 300  → 5 minutes (matches backend Redis TTL for catalog)
 *   Invalidated by:         'Courses' tag — dispatched on publish/unpublish mutations
 */
import { apiSlice } from './apiSlice';

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /courses — full catalog list
     * Returns: { success, data: { courses[] } }
     */
    getCourses: builder.query({
      query: () => ({ url: '/courses' }),
      providesTags: (result) =>
        result?.data?.courses
          ? [
              ...result.data.courses.map(({ _id }) => ({ type: 'Course', id: _id })),
              { type: 'Courses', id: 'LIST' },
            ]
          : [{ type: 'Courses', id: 'LIST' }],
      keepUnusedDataFor: 300, // 5 min — mirrors backend Redis catalog TTL
      // Select only the courses array from the full response envelope
      transformResponse: (response) => response?.data?.courses ?? [],
    }),

    /**
     * GET /courses/:id — single course detail
     * Returns: { success, data: { course } }
     */
    getCourseById: builder.query({
      query: (id) => ({ url: `/courses/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Course', id }],
      keepUnusedDataFor: 300,
      transformResponse: (response) => response?.data?.course ?? null,
    }),
  }),
  overrideExisting: false,
});

export const { useGetCoursesQuery, useGetCourseByIdQuery } = courseApi;
export default courseApi;
