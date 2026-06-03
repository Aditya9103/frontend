import axiosInstance from '../config/axiosInstance';

class SuperAdminService {
  async getUsers() {
    return await axiosInstance.get('/super-admin/users');
  }

  async createAdmin(data) {
    return await axiosInstance.post('/super-admin/admin', data);
  }

  async updateRole(id, data) {
    return await axiosInstance.put(`/super-admin/role/${id}`, data);
  }

  async getStatsData() {
    return await axiosInstance.get('/admin/stats/users');
  }

  async getLearnerDashboardData() {
    return await axiosInstance.get('/dashboard/learner');
  }

  async getSuperAdminStats() {
    return await axiosInstance.get('/super-admin/stats');
  }

  async getSystemHealth() {
    return await axiosInstance.get('/super-admin/health');
  }

  async getActivityLogs() {
    return await axiosInstance.get('/super-admin/activities');
  }

  async requestLogDeletion(data) {
    return await axiosInstance.post('/super-admin/logs/deletion-request', data);
  }

  async executeLogDeletion(data) {
    return await axiosInstance.post('/super-admin/logs/deletion-execute', data);
  }
}

export default new SuperAdminService();
