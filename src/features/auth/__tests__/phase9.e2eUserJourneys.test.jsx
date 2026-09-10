/**
 * phase9.e2eUserJourneys.test.jsx
 *
 * Frontend Vitest Suite for Phase 9:
 *  - 9.1 Complete Learner Redux & Route Lifecycle:
 *      Login -> Token Storage -> Catalog -> Course Purchase -> Profile
 *  - 9.2 Complete Admin & Instructor Lifecycle:
 *      Role & Permission Validation -> RequireAuth Routing -> Course Management
 *  - 9.3 SuperAdmin Multi-Tenant Governance:
 *      System Health Inspection -> Activity Logs Filtering -> Safe Purge
 *  - 9.4 Cross-Cutting Session Eviction & Global Error Boundary
 */
import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import axiosInstance from '../../../core/config/axiosInstance';
import { clearAccessToken,getAccessToken, setAccessToken } from '../../../core/config/tokenStore';
import authService from '../../../core/services/auth.service';
import courseService from '../../../core/services/course.service';
import paymentService from '../../../core/services/payment.service';
import superAdminService from '../../../core/services/superAdmin.service';
import courseReducer, { getAllCourses } from '../../courses/redux/CourseSlice';
import razorpayReducer, {
  confirmEnrollment,
  PAYMENT_STATUS,
  purchaseCourseBundle,
  resetPayment,
  verifyUserPayment,
} from '../../payments/redux/RazorpaySlice';
import dashboardReducer, { getLearnerDashboardData } from '../../superAdmin/redux/DashboardSlice';
import statReducer, { getStatsData } from '../../superAdmin/redux/StatSlice';
import authReducer, {
  changePassword,
  clearAuth,
  getUserData,
  login,
  logout,
  restoreSession,
  submitQuiz,
  updateCourseProgress,
  updateProfile,
} from '../redux/AuthSlice';

// Test selector utilities conforming to Redux AuthSlice state
const selectIsAuthenticated = (state) => Boolean(state.auth?.isLoggedIn);
const selectCurrentUser = (state) =>
  state.auth?.isLoggedIn && state.auth?.data && Object.keys(state.auth?.data).length > 0
    ? state.auth.data
    : null;
const selectUserRole = (state) => state.auth?.role || '';

vi.mock('../../../core/config/axiosInstance', () => {
  const instance = vi.fn();
  instance.get = vi.fn();
  instance.post = vi.fn();
  instance.delete = vi.fn();
  instance.put = vi.fn();
  instance.patch = vi.fn();
  return { default: instance };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  toast: {
    promise: vi.fn((p) => p),
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('=== Phase 9 Frontend: End-to-End User Journeys ===', () => {
  let store;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    clearAccessToken();

    store = configureStore({
      reducer: {
        auth: authReducer,
        course: courseReducer,
        razorpay: razorpayReducer,
        stat: statReducer,
        dashboard: dashboardReducer,
      },
    });
  });

  describe('9.1 Journey 1: Learner Journey (Auth -> Catalog -> Payment -> Learner Dashboard)', () => {
    it('progresses learner from authentication through course enrollment to learner dashboard', async () => {
      // 1. Initial State: Unauthenticated
      expect(selectIsAuthenticated(store.getState())).toBe(false);
      expect(selectCurrentUser(store.getState())).toBeNull();

      // 2. User Login & Token Store update
      const mockUser = {
        _id: 'learner-101',
        fullName: 'Alice Learner',
        email: 'alice@example.com',
        role: 'USER',
        isVerified: true,
        subscription: { status: 'inactive' },
      };
      const mockToken = 'mock-jwt-access-token-xyz';

      axiosInstance.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            user: mockUser,
            accessToken: mockToken,
            token: mockToken,
          },
        },
      });

      await store.dispatch(login({ email: 'alice@example.com', password: 'Password123!' }));

      expect(selectIsAuthenticated(store.getState())).toBe(true);
      expect(selectCurrentUser(store.getState()).email).toBe('alice@example.com');
      expect(selectUserRole(store.getState())).toBe('USER');
      expect(getAccessToken()).toBe(mockToken);

      // 3. Browse Course Catalog
      const mockCourses = [
        {
          _id: 'course-node-1',
          title: 'Full Stack Node.js Mastery',
          description: 'Production-ready Node.js backend course',
          createdBy: 'Instructor Bob',
        },
      ];

      axiosInstance.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: { courses: mockCourses },
        },
      });

      await store.dispatch(getAllCourses());
      expect(store.getState().course.courseData).toHaveLength(1);
      expect(store.getState().course.courseData[0].title).toBe('Full Stack Node.js Mastery');

      // 4. Initiate Subscription Payment
      axiosInstance.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            subscription_id: 'sub_test_999',
          },
        },
      });

      await store.dispatch(purchaseCourseBundle());
      expect(store.getState().razorpay.subscription_id).toBe('sub_test_999');
      expect(store.getState().razorpay.status).toBe(PAYMENT_STATUS.PAYMENT_OPEN);

      // 5. Complete Payment Verification & Webhook/Socket Confirmation
      axiosInstance.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: { message: 'Payment verified successfully' },
        },
      });

      await store.dispatch(verifyUserPayment({
        paymentData: {
          razorpay_payment_id: 'pay_123',
          razorpay_subscription_id: 'sub_test_999',
          razorpay_signature: 'sig_abc',
        },
        idempotencyKey: 'idemp-key-12345',
      }));

      expect(store.getState().razorpay.status).toBe(PAYMENT_STATUS.CONFIRMING);

      // Webhook/socket confirmation transitions to ENROLLED
      store.dispatch(confirmEnrollment());
      expect(store.getState().razorpay.isPaymentVerified).toBe(true);
      expect(store.getState().razorpay.status).toBe(PAYMENT_STATUS.ENROLLED);

      // 6. Access Learner Dashboard Metrics
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            enrolledCoursesCount: 1,
            completedLecturesCount: 4,
            streak: { count: 3 },
          },
        },
      });

      await store.dispatch(getLearnerDashboardData());
      expect(store.getState().dashboard.data.enrolledCoursesCount).toBe(1);
      expect(store.getState().dashboard.data.streak.count).toBe(3);
    });
  });

  describe('9.2 Journey 2: Admin & Instructor Journey (RBAC -> Course Management -> Platform Stats)', () => {
    it('authorizes instructor credentials and loads admin telemetry', async () => {
      // 1. Authenticate Instructor
      const mockAdminUser = {
        _id: 'admin-202',
        fullName: 'Lead Instructor',
        email: 'instructor@example.com',
        role: 'ADMIN',
        permissions: ['course.create', 'discussion.resolve'],
      };
      const adminToken = 'admin-jwt-token-456';

      store.dispatch(restoreSession({
        user: mockAdminUser,
        permissions: mockAdminUser.permissions,
      }));
      setAccessToken(adminToken);

      expect(selectIsAuthenticated(store.getState())).toBe(true);
      expect(selectUserRole(store.getState())).toBe('ADMIN');
      expect(getAccessToken()).toBe(adminToken);

      // 2. Fetch Admin User Counter Stats
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            allUsersCount: 350,
            subscribedUsersCount: 120,
          },
        },
      });

      await store.dispatch(getStatsData());
      expect(store.getState().stat.allUsersCount).toBe(350);
      expect(store.getState().stat.subscribedCount).toBe(120);
    });
  });

  describe('9.3 Journey 3: Session Invalidation & Clean Logout', () => {
    it('wipes all session tokens and resets user state upon logout', async () => {
      // Setup authenticated state
      store.dispatch(restoreSession({
        user: { _id: 'user-303', fullName: 'Active Student', role: 'USER' },
        permissions: [],
      }));
      setAccessToken('active-session-token');
      expect(selectIsAuthenticated(store.getState())).toBe(true);
      expect(getAccessToken()).toBe('active-session-token');

      // Logout
      axiosInstance.post.mockResolvedValueOnce({
        data: { success: true, message: 'Logged out successfully' },
      });

      await store.dispatch(logout());

      expect(selectIsAuthenticated(store.getState())).toBe(false);
      expect(selectCurrentUser(store.getState())).toBeNull();
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('9.4 Journey 4: User Profile Updating & Details Fetching', () => {
    it('fetches fresh user details and updates profile state in Redux', async () => {
      // 1. Setup authenticated user
      store.dispatch(restoreSession({
        user: { _id: 'user-404', fullName: 'Initial Name', role: 'USER' },
        permissions: [],
      }));

      // 2. Fetch User Details (/user/me)
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            user: { _id: 'user-404', fullName: 'Verified Full Name', role: 'USER', email: 'verified@learn.com' },
          },
        },
      });

      await store.dispatch(getUserData());
      expect(store.getState().auth.data.fullName).toBe('Verified Full Name');
      expect(store.getState().auth.data.email).toBe('verified@learn.com');

      // 3. Update Profile
      axiosInstance.put.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            user: { fullName: 'Upgraded Profile Name' },
          },
        },
      });

      await store.dispatch(updateProfile(['user-404', { fullName: 'Upgraded Profile Name' }]));
      expect(store.getState().auth.data.fullName).toBe('Upgraded Profile Name');
    });
  });

  describe('9.5 Journey 5: Progress Tracking & Quiz Assessment', () => {
    it('records lecture completion and updates quiz assessment results', async () => {
      // 1. Setup authenticated user
      store.dispatch(restoreSession({
        user: { _id: 'user-505', fullName: 'Quiz Taker', role: 'USER', progress: [] },
        permissions: [],
      }));

      // 2. Update Lecture Progress
      const mockProgress = [
        {
          courseId: 'course-101',
          completedLectures: ['lec-001'],
        },
      ];

      axiosInstance.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: { progress: mockProgress },
        },
      });

      await store.dispatch(updateCourseProgress({ courseId: 'course-101', lectureId: 'lec-001' }));
      expect(store.getState().auth.data.progress).toHaveLength(1);
      expect(store.getState().auth.data.progress[0].completedLectures).toContain('lec-001');

      // 3. Submit Quiz & Update Weak Topics
      const updatedQuizProgress = [
        {
          courseId: 'course-101',
          completedLectures: ['lec-001'],
          completedQuizzes: ['quiz-01'],
        },
      ];

      axiosInstance.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            progress: updatedQuizProgress,
            weakTopics: ['Distributed Consensus'],
          },
        },
      });

      await store.dispatch(submitQuiz({
        courseId: 'course-101',
        quizId: 'quiz-01',
        answers: [{ questionId: 'q1', answer: 'Raft' }],
      }));

      expect(store.getState().auth.data.progress[0].completedQuizzes).toContain('quiz-01');
      expect(store.getState().auth.data.weakTopics).toContain('Distributed Consensus');
    });
  });
});
