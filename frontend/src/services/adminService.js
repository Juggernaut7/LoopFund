import api from './api';

const adminService = {
  // Dashboard Stats
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin dashboard stats:', error);
      throw error;
    }
  },

  // User Management
  async getAllUsers() {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  async getUsersWithFilters(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/admin/users/filter?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered users:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  async updateUser(userId, updateData) {
    try {
      const response = await api.put(`/admin/users/${userId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async suspendUser(userId) {
    try {
      const response = await api.post(`/admin/users/${userId}/suspend`);
      return response.data;
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  },

  async activateUser(userId) {
    try {
      const response = await api.post(`/admin/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  },

  // Revenue Analytics
  async getRevenueAnalytics(period = 'monthly') {
    try {
      const response = await api.get(`/admin/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  },

  // System Health
  async getSystemHealth() {
    try {
      const response = await api.get('/admin/system/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  },

  // Goals and Contributions (existing endpoints)
  async getAllGoals() {
    try {
      const response = await api.get('/admin/goals');
      return response.data;
    } catch (error) {
      console.error('Error fetching all goals:', error);
      throw error;
    }
  },

  async getAllContributions() {
    try {
      const response = await api.get('/admin/contributions');
      return response.data;
    } catch (error) {
      console.error('Error fetching all contributions:', error);
      throw error;
    }
  }
};

export default adminService; 