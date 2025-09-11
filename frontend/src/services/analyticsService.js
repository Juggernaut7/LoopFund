import api from './api';

const analyticsService = {
  // Get user analytics
  async getUserAnalytics(timeRange = '30') {
    try {
      const response = await api.get(`/analytics/user?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  },

  // Get analytics summary (quick data)
  async getAnalyticsSummary(timeRange = '30') {
    try {
      const response = await api.get(`/analytics/user/summary?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      throw error;
    }
  },

  // Get group analytics
  async getGroupAnalytics(groupId, timeRange = '30') {
    try {
      const response = await api.get(`/analytics/group/${groupId}?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group analytics:', error);
      throw error;
    }
  },

  // Get system analytics (admin only)
  async getSystemAnalytics(timeRange = '30') {
    try {
      const response = await api.get(`/analytics/system?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching system analytics:', error);
      throw error;
    }
  },

  // Export analytics data
  async exportAnalytics(timeRange = '30', format = 'json') {
    try {
      const response = await api.get(`/analytics/export?timeRange=${timeRange}&format=${format}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      if (format === 'csv') {
        // Handle CSV download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-${timeRange}days.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // Handle JSON download
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-${timeRange}days.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  },

  // Get dashboard analytics (for dashboard page)
  async getDashboardAnalytics() {
    try {
      const response = await api.get('/analytics/user/summary?timeRange=30');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  },

  // Get goal analytics
  async getGoalAnalytics() {
    try {
      const response = await api.get('/analytics/user?timeRange=30');
      return {
        data: {
          goalProgress: response.data.data.goalProgress,
          topPerformers: response.data.data.topPerformers
        }
      };
    } catch (error) {
      console.error('Error fetching goal analytics:', error);
      throw error;
    }
  },

  // Get contribution analytics
  async getContributionAnalytics() {
    try {
      const response = await api.get('/analytics/user?timeRange=30');
      return {
        data: {
          savingsTrend: response.data.data.savingsTrend,
          recentActivity: response.data.data.recentActivity
        }
      };
    } catch (error) {
      console.error('Error fetching contribution analytics:', error);
      throw error;
    }
  }
};

export default analyticsService;
