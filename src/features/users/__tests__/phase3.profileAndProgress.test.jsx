/**
 * phase3.profileAndProgress.test.jsx
 *
 * Frontend Vitest Suite for Phase 3:
 *  - 3.1 Redux Profile & Session Synchronization (getUserData, updateProfile)
 *  - 3.2 Streak & Progress State Updates (updateCourseProgress, submitQuiz, submitAssignment)
 *  - 3.3 Profile Component Rendering (Displaying name, email, streak count)
 */
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import authReducer, {
  getUserData,
  submitAssignment,
  submitQuiz,
  updateCourseProgress,
  updateProfile,
} from '../../auth/redux/AuthSlice';
import Profile from '../pages/Profile';

// Mock HomeLayout to simplify component render tree
vi.mock('../../../shared/layouts/HomeLayout', () => ({
  default: ({ children }) => <div data-testid="mock-home-layout">{children}</div>,
}));

// Mock RazorpaySlice to avoid payment dependencies
vi.mock('../../payments/redux/RazorpaySlice', () => ({
  cancelCourseBundle: vi.fn(),
}));

describe('=== Phase 3 Frontend: Profile, Streak & Progress Management ===', () => {
  let store;

  beforeEach(() => {
    localStorage.clear();
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  describe('3.1 AuthSlice Profile State & LocalStorage Synchronization', () => {
    it('getUserData.fulfilled populates state and syncs to localStorage', () => {
      const mockUser = {
        _id: 'user_123',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        role: 'USER',
        streak: { count: 7, lastActivity: new Date().toISOString() },
        progress: [],
        weakTopics: ['Recursion'],
      };

      store.dispatch({
        type: getUserData.fulfilled.type,
        payload: {
          data: { user: mockUser },
        },
      });

      const state = store.getState().auth;
      expect(state.isLoggedIn).toBe(true);
      expect(state.data.fullName).toBe('Jane Doe');
      expect(state.data.streak.count).toBe(7);
      expect(state.data.weakTopics).toEqual(['Recursion']);

      // Check localStorage mirror
      const localData = JSON.parse(localStorage.getItem('data'));
      expect(localData.fullName).toBe('Jane Doe');
      expect(localData.streak.count).toBe(7);
    });

    it('updateProfile.fulfilled merges updated fields into state and localStorage', () => {
      // Pre-seed initial state
      store.dispatch({
        type: getUserData.fulfilled.type,
        payload: {
          data: {
            user: {
              _id: 'user_123',
              fullName: 'Initial Name',
              email: 'jane@example.com',
              avatar: { secure_url: 'https://cdn.example.com/old.jpg' },
            },
          },
        },
      });

      // Dispatch update
      store.dispatch({
        type: updateProfile.fulfilled.type,
        payload: {
          data: {
            user: {
              fullName: 'Updated Name',
              avatar: { secure_url: 'https://cdn.example.com/new.jpg' },
            },
          },
        },
      });

      const state = store.getState().auth;
      expect(state.data.fullName).toBe('Updated Name');
      expect(state.data.avatar.secure_url).toBe('https://cdn.example.com/new.jpg');
      expect(state.data.email).toBe('jane@example.com');

      const localData = JSON.parse(localStorage.getItem('data'));
      expect(localData.fullName).toBe('Updated Name');
      expect(localData.avatar.secure_url).toBe('https://cdn.example.com/new.jpg');
    });
  });

  describe('3.2 Progress, Quiz & Assignment State Transitions', () => {
    it('updateCourseProgress.fulfilled updates lecture completions in state.data.progress', () => {
      const mockProgress = [
        {
          courseId: 'course_1',
          completedLectures: ['lec_1', 'lec_2'],
        },
      ];

      store.dispatch({
        type: updateCourseProgress.fulfilled.type,
        payload: {
          data: { progress: mockProgress },
        },
      });

      const state = store.getState().auth;
      expect(state.data.progress).toEqual(mockProgress);
      const localData = JSON.parse(localStorage.getItem('data'));
      expect(localData.progress).toEqual(mockProgress);
    });

    it('submitQuiz.fulfilled updates progress and weakTopics', () => {
      const mockProgress = [
        {
          courseId: 'course_1',
          completedQuizzes: [{ quizId: 'quiz_1', score: 9, totalQuestions: 10 }],
        },
      ];

      store.dispatch({
        type: submitQuiz.fulfilled.type,
        payload: {
          data: {
            progress: mockProgress,
            weakTopics: ['Trees'],
          },
        },
      });

      const state = store.getState().auth;
      expect(state.data.progress).toEqual(mockProgress);
      expect(state.data.weakTopics).toEqual(['Trees']);
    });

    it('submitAssignment.fulfilled updates progress with assignment submissions', () => {
      const mockProgress = [
        {
          courseId: 'course_1',
          completedAssignments: [{ assignmentId: 'assign_1', status: 'SUBMITTED' }],
        },
      ];

      store.dispatch({
        type: submitAssignment.fulfilled.type,
        payload: {
          data: { progress: mockProgress },
        },
      });

      const state = store.getState().auth;
      expect(state.data.progress).toEqual(mockProgress);
    });
  });

  describe('3.3 Profile Component Rendering', () => {
    it('renders user details and streak counter accurately from store', () => {
      const preloadedStore = configureStore({
        reducer: {
          auth: authReducer,
        },
        preloadedState: {
          auth: {
            isLoggedIn: true,
            data: {
              _id: 'user_456',
              fullName: 'Alex Morgan',
              email: 'alex@example.com',
              role: 'USER',
              avatar: { secure_url: 'https://cdn.example.com/avatar.jpg' },
              streak: { count: 14 },
              subscription: { status: 'active' },
            },
          },
        },
      });

      render(
        <Provider store={preloadedStore}>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Alex Morgan')).toBeDefined();
      expect(screen.getByText('alex@example.com')).toBeDefined();
      expect(screen.getByText('14')).toBeDefined();
      expect(screen.getByText('Day Streak')).toBeDefined();
    });

    it('gracefully renders 0 day streak when streak is undefined', () => {
      const preloadedStore = configureStore({
        reducer: {
          auth: authReducer,
        },
        preloadedState: {
          auth: {
            isLoggedIn: true,
            data: {
              _id: 'user_789',
              fullName: 'Sam Rivers',
              email: 'sam@example.com',
              role: 'USER',
            },
          },
        },
      });

      render(
        <Provider store={preloadedStore}>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Sam Rivers')).toBeDefined();
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Day Streak')).toBeDefined();
    });
  });
});
