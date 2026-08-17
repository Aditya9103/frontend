import axiosInstance from '../config/axiosInstance';

const notificationService = {
  /** GET /api/v1/notifications */
  getNotifications: ({ limit = 20, skip = 0 } = {}) =>
    axiosInstance.get(`/notifications?limit=${limit}&skip=${skip}`),

  /** PATCH /api/v1/notifications/:id/read */
  markRead: (id) => axiosInstance.patch(`/notifications/${id}/read`),

  /** PATCH /api/v1/notifications/read-all */
  markAllRead: () => axiosInstance.patch('/notifications/read-all'),
};

export default notificationService;
