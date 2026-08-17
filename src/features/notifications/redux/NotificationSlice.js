/**
 * NotificationSlice.js — Phase 6 Notification state management
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

import axiosInstance from '../../../core/config/axiosInstance';

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async ({ limit = 20, skip = 0 } = {}) => {
    const res = await axiosInstance.get(`/notifications?limit=${limit}&skip=${skip}`);
    return res.data.data;
  }
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (notificationId) => {
    const res = await axiosInstance.patch(`/notifications/${notificationId}/read`);
    return { notificationId, data: res.data.data };
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async () => {
    await axiosInstance.patch('/notifications/read-all');
    return true;
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Called when a real-time socket event arrives
    pushNotification(state, action) {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },
    // Reset on logout
    clearNotifications(state) {
      state.list = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.notifications ?? [];
        state.unreadCount = action.payload?.unreadCount ?? 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const n = state.list.find((n) => n._id === notificationId);
        if (n && !n.read) {
          n.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list.forEach((n) => (n.read = true));
        state.unreadCount = 0;
        toast.success('All notifications marked as read');
      });
  },
});

export const { pushNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
