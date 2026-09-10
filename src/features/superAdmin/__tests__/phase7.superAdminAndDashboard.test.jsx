/**
 * phase7.superAdminAndDashboard.test.jsx
 *
 * Frontend Vitest Suite for Phase 7:
 *  - 7.1 StatSlice State Machine & User Count Analytics
 *  - 7.2 DashboardSlice State Machine & Learner Metrics
 *  - 7.3 SuperAdminService HTTP Integration & RBAC Contracts
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

import statReducer, { getStatsData } from '../redux/StatSlice';
import dashboardReducer, { getLearnerDashboardData } from '../redux/DashboardSlice';
import superAdminService from '../../../core/services/superAdmin.service';
import axiosInstance from '../../../core/config/axiosInstance';

vi.mock('../../../core/config/axiosInstance', () => {
  const instance = vi.fn();
  instance.get = vi.fn();
  instance.post = vi.fn();
  instance.delete = vi.fn();
  instance.put = vi.fn();
  return { default: instance };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('=== Phase 7 Frontend: SuperAdmin Operations, Dashboard & RBAC ===', () => {
  describe('7.1 StatSlice State Machine', () => {
    let store;

    beforeEach(() => {
      vi.clearAllMocks();
      store = configureStore({
        reducer: {
          stat: statReducer,
        },
      });
    });

    it('initializes with default zero counts', () => {
      const state = store.getState().stat;
      expect(state.allUsersCount).toBe(0);
      expect(state.subscribedCount).toBe(0);
    });

    it('updates state upon fulfilled getStatsData with standard response envelope', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            allUsersCount: 142,
            subscribedUsersCount: 38,
          },
        },
      });

      await store.dispatch(getStatsData());
      const state = store.getState().stat;
      expect(state.allUsersCount).toBe(142);
      expect(state.subscribedCount).toBe(38);
    });

    it('defensively handles raw top-level stats envelope without crashing (DEF-07-001)', async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          allUsersCount: 99,
          subscribedUsersCount: 22,
        },
      });

      await store.dispatch(getStatsData());
      const state = store.getState().stat;
      expect(state.allUsersCount).toBe(99);
      expect(state.subscribedCount).toBe(22);
    });

    it('gracefully handles API errors without breaking state structure', async () => {
      axiosInstance.get.mockRejectedValueOnce({
        response: { data: { error: { message: 'Failed to retrieve stats' } } },
      });

      await store.dispatch(getStatsData());
      const state = store.getState().stat;
      expect(state.allUsersCount).toBe(0);
      expect(state.subscribedCount).toBe(0);
    });
  });

  describe('7.2 DashboardSlice State Machine', () => {
    let store;

    beforeEach(() => {
      vi.clearAllMocks();
      store = configureStore({
        reducer: {
          dashboard: dashboardReducer,
        },
      });
    });

    it('initializes with empty data object', () => {
      const state = store.getState().dashboard;
      expect(state.data).toEqual({});
    });

    it('stores learner dashboard metrics when getLearnerDashboardData is fulfilled', async () => {
      const mockDashboardData = {
        enrolledCoursesCount: 5,
        completedLecturesCount: 42,
        progress: [{ courseId: 'c1', percent: 80 }],
      };

      axiosInstance.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: mockDashboardData,
        },
      });

      await store.dispatch(getLearnerDashboardData());
      const state = store.getState().dashboard;
      expect(state.data.enrolledCoursesCount).toBe(5);
      expect(state.data.completedLecturesCount).toBe(42);
      expect(state.data.progress).toHaveLength(1);
    });
  });

  describe('7.3 SuperAdminService HTTP Integration', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('calls GET /super-admin/users for user management list', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
      await superAdminService.getUsers();
      expect(axiosInstance.get).toHaveBeenCalledWith('/super-admin/users');
    });

    it('calls POST /super-admin/admin with admin credentials', async () => {
      const payload = { fullName: 'Admin User', email: 'admin@test.com', password: 'securePassword123' };
      axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });
      await superAdminService.createAdmin(payload);
      expect(axiosInstance.post).toHaveBeenCalledWith('/super-admin/admin', payload);
    });

    it('calls PUT /super-admin/role/:id with target role and permissions', async () => {
      const payload = { role: 'ADMIN', permissions: ['course.create'] };
      axiosInstance.put.mockResolvedValueOnce({ data: { success: true } });
      await superAdminService.updateRole('user-999', payload);
      expect(axiosInstance.put).toHaveBeenCalledWith('/super-admin/role/user-999', payload);
    });

    it('calls GET /super-admin/stats for platform telemetry', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { success: true, data: {} } });
      await superAdminService.getSuperAdminStats();
      expect(axiosInstance.get).toHaveBeenCalledWith('/super-admin/stats');
    });

    it('calls GET /super-admin/health for infrastructure monitoring', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { success: true, data: {} } });
      await superAdminService.getSystemHealth();
      expect(axiosInstance.get).toHaveBeenCalledWith('/super-admin/health');
    });

    it('calls GET /super-admin/activities for audit logs', async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
      await superAdminService.getActivityLogs();
      expect(axiosInstance.get).toHaveBeenCalledWith('/super-admin/activities');
    });

    it('calls POST /super-admin/logs/deletion-request to preview eligible logs', async () => {
      axiosInstance.post.mockResolvedValueOnce({ data: { success: true, data: { count: 12 } } });
      await superAdminService.requestLogDeletion({ olderThanDays: 30 });
      expect(axiosInstance.post).toHaveBeenCalledWith('/super-admin/logs/deletion-request', { olderThanDays: 30 });
    });

    it('calls POST /super-admin/logs/deletion-execute to purge logs safely', async () => {
      axiosInstance.post.mockResolvedValueOnce({ data: { success: true, data: { deletedCount: 12 } } });
      await superAdminService.executeLogDeletion({ dateLimit: '2026-08-01T00:00:00.000Z' });
      expect(axiosInstance.post).toHaveBeenCalledWith('/super-admin/logs/deletion-execute', { dateLimit: '2026-08-01T00:00:00.000Z' });
    });
  });
});
