/**
 * phase4.coursesAndLectures.test.jsx
 *
 * Frontend Vitest Suite for Phase 4:
 *  - 4.1 Redux Course & Lecture State (CourseSlice, LectureSlice)
 *  - 4.2 RTK Query Course API & Cache Integration (courseApi + axiosInstance mock)
 *  - 4.3 CourseCard UI Rendering (Title, Category, Description, Instructor)
 */
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import axiosInstance from '../../../core/config/axiosInstance';
import { apiSlice } from '../../../core/query/apiSlice';
import courseApi from '../../../core/query/courseApi';
import CourseCard from '../../../shared/components/CourseCard';
import courseReducer, { getAllCourses } from '../redux/CourseSlice';
import lectureReducer, { addCourseLecture,getCourseLectures } from '../redux/LectureSlice';

vi.mock('../../../core/config/axiosInstance', () => {
  const instance = vi.fn();
  instance.get = vi.fn();
  instance.post = vi.fn();
  instance.delete = vi.fn();
  instance.put = vi.fn();
  return { default: instance };
});

describe('=== Phase 4 Frontend: Course Lifecycle & Video Content ===', () => {
  describe('4.1 CourseSlice & LectureSlice State Management', () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          courses: courseReducer,
          lecture: lectureReducer,
        },
      });
    });

    it('getAllCourses.fulfilled updates courseData in CourseSlice', () => {
      const mockCourses = [
        { _id: 'c1', title: 'React Masterclass', category: 'Frontend' },
        { _id: 'c2', title: 'Node.js Microservices', category: 'Backend' },
      ];

      store.dispatch({
        type: getAllCourses.fulfilled.type,
        payload: mockCourses,
      });

      const state = store.getState().courses;
      expect(state.courseData).toHaveLength(2);
      expect(state.courseData[0].title).toBe('React Masterclass');
    });

    it('getCourseLectures.fulfilled updates lectures in LectureSlice', () => {
      const mockLectures = [
        { _id: 'l1', title: 'Introduction & Setup' },
        { _id: 'l2', title: 'Components & Props' },
      ];

      store.dispatch({
        type: getCourseLectures.fulfilled.type,
        payload: { lectures: mockLectures },
      });

      const state = store.getState().lecture;
      expect(state.lectures).toHaveLength(2);
      expect(state.lectures[1].title).toBe('Components & Props');
    });

    it('addCourseLecture.fulfilled appends updated lectures list', () => {
      store.dispatch({
        type: addCourseLecture.fulfilled.type,
        payload: {
          course: {
            lectures: [{ _id: 'l3', title: 'State & Hooks' }],
          },
        },
      });

      const state = store.getState().lecture;
      expect(state.lectures).toHaveLength(1);
      expect(state.lectures[0].title).toBe('State & Hooks');
    });
  });

  describe('4.2 RTK Query Course API Cache & Transformation', () => {
    let store;

    beforeEach(() => {
      vi.clearAllMocks();
      store = configureStore({
        reducer: {
          [apiSlice.reducerPath]: apiSlice.reducer,
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(apiSlice.middleware),
      });
    });

    it('getCourses query unwraps courses from standard backend envelope', async () => {
      axiosInstance.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            courses: [
              { _id: 'c1', title: 'Fullstack Bootcamp' },
              { _id: 'c2', title: 'Docker for Devs' },
            ],
          },
          message: 'All courses',
        },
      });

      const result = await store.dispatch(courseApi.endpoints.getCourses.initiate());
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].title).toBe('Fullstack Bootcamp');
    });

    it('getCourseById query unwraps single course entity', async () => {
      axiosInstance.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            course: { _id: 'c1', title: 'Advanced GraphQL' },
          },
        },
      });

      const result = await store.dispatch(courseApi.endpoints.getCourseById.initiate('c1'));
      expect(result.data).toBeDefined();
      expect(result.data._id).toBe('c1');
      expect(result.data.title).toBe('Advanced GraphQL');
    });
  });

  describe('4.3 CourseCard UI Rendering', () => {
    it('renders course information accurately', () => {
      const courseData = {
        _id: 'c_abc_123',
        title: 'Kubernetes in Production',
        description: 'Learn cluster setup, Helm charts, and ingress controllers.',
        category: 'DevOps',
        createdBy: 'Alice DevOps',
        numberOfLectures: 18,
        thumbnail: {
          secure_url: 'https://cdn.example.com/k8s.jpg',
        },
      };

      render(
        <MemoryRouter>
          <CourseCard data={courseData} />
        </MemoryRouter>
      );

      expect(screen.getByText('Kubernetes in Production')).toBeDefined();
      expect(screen.getByText('DevOps')).toBeDefined();
      expect(screen.getByText(/cluster setup/i)).toBeDefined();
      expect(screen.getByText('Alice DevOps')).toBeDefined();
      expect(screen.getByText('18 Lectures')).toBeDefined();
    });
  });
});
