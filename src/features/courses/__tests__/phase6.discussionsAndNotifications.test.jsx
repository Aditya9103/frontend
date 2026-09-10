/**
 * phase6.discussionsAndNotifications.test.jsx
 *
 * Frontend Vitest Suite for Phase 6:
 *  - 6.1 NotificationSlice State & Reducer Actions (Fetch, Push Socket, Mark Read, Clear)
 *  - 6.2 Discussion & Interaction Services (API contracts & deleteBookmark)
 *  - 6.3 Real-Time Discussion Socket Events & State Management
 */
import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import axiosInstance from '../../../core/config/axiosInstance';
import discussionService from '../../../core/services/discussion.service';
import interactionService from '../../../core/services/interaction.service';
import notificationReducer, {
  clearNotifications,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  pushNotification,
} from '../../notifications/redux/NotificationSlice';

vi.mock('../../../core/config/axiosInstance', () => {
  const instance = vi.fn();
  instance.get = vi.fn();
  instance.post = vi.fn();
  instance.patch = vi.fn();
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
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('=== Phase 6 Frontend: Real-Time Discussions & Notifications ===', () => {
  describe('6.1 NotificationSlice State Management', () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          notifications: notificationReducer,
        },
      });
    });

    it('initializes with empty list and zero unread count', () => {
      const state = store.getState().notifications;
      expect(state.list).toHaveLength(0);
      expect(state.unreadCount).toBe(0);
      expect(state.loading).toBe(false);
    });

    it('pushNotification prepends new notification and increments unreadCount', () => {
      const mockNotif = {
        _id: 'n1',
        type: 'ENROLLMENT_CREATED',
        message: 'You have enrolled in React Mastery',
        read: false,
      };

      store.dispatch(pushNotification(mockNotif));
      const state = store.getState().notifications;
      expect(state.list).toHaveLength(1);
      expect(state.list[0]._id).toBe('n1');
      expect(state.unreadCount).toBe(1);
    });

    it('fetchNotifications.fulfilled loads notification list and unread count', () => {
      store.dispatch({
        type: fetchNotifications.fulfilled.type,
        payload: {
          notifications: [
            { _id: 'n1', message: 'First', read: false },
            { _id: 'n2', message: 'Second', read: true },
          ],
          unreadCount: 1,
        },
      });

      const state = store.getState().notifications;
      expect(state.list).toHaveLength(2);
      expect(state.unreadCount).toBe(1);
    });

    it('markNotificationRead.fulfilled marks item as read and decrements unread count', () => {
      store.dispatch({
        type: fetchNotifications.fulfilled.type,
        payload: {
          notifications: [
            { _id: 'n1', message: 'First', read: false },
          ],
          unreadCount: 1,
        },
      });

      store.dispatch({
        type: markNotificationRead.fulfilled.type,
        payload: { notificationId: 'n1' },
      });

      const state = store.getState().notifications;
      expect(state.list[0].read).toBe(true);
      expect(state.unreadCount).toBe(0);
    });

    it('clearNotifications resets list and unread count on logout', () => {
      store.dispatch(pushNotification({ _id: 'n1', read: false }));
      store.dispatch(clearNotifications());

      const state = store.getState().notifications;
      expect(state.list).toHaveLength(0);
      expect(state.unreadCount).toBe(0);
    });
  });

  describe('6.2 Discussion & Interaction Services', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('discussionService.addQuestion posts question payload', async () => {
      const payload = {
        courseId: 'c1',
        lectureId: 'l1',
        question: 'What is hydration?',
        timestamp: 45,
      };
      axiosInstance.post.mockResolvedValueOnce({
        data: { success: true, data: { discussion: { _id: 'd1', ...payload } } },
      });

      const res = await discussionService.addQuestion(payload);
      expect(axiosInstance.post).toHaveBeenCalledWith('/discussions/question', payload);
      expect(res.data.data.discussion._id).toBe('d1');
    });

    it('discussionService.upvoteQuestion calls POST /discussions/:id/upvote', async () => {
      axiosInstance.post.mockResolvedValueOnce({
        data: { success: true, data: { discussion: { _id: 'd1', upvotes: 1 } } },
      });

      const res = await discussionService.upvoteQuestion('d1');
      expect(axiosInstance.post).toHaveBeenCalledWith('/discussions/d1/upvote');
      expect(res.data.data.discussion.upvotes).toBe(1);
    });

    it('interactionService.deleteBookmark calls DELETE /interaction/bookmark/:id (DEF-06-001)', async () => {
      axiosInstance.delete.mockResolvedValueOnce({
        data: { success: true, message: 'Bookmark deleted' },
      });

      await interactionService.deleteBookmark('b123');
      expect(axiosInstance.delete).toHaveBeenCalledWith('/interaction/bookmark/b123');
    });

    it('interactionService.deleteNote calls DELETE /interaction/note/:id', async () => {
      axiosInstance.delete.mockResolvedValueOnce({
        data: { success: true, message: 'Note deleted' },
      });

      await interactionService.deleteNote('note456');
      expect(axiosInstance.delete).toHaveBeenCalledWith('/interaction/note/note456');
    });
  });
});
