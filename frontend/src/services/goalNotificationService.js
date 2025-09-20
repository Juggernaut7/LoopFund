import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class GoalNotificationService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Schedule payment reminder notifications
  async schedulePaymentReminder(goalId, reminderData) {
    try {
      const response = await this.api.post('/notifications/schedule-payment-reminder', {
        goalId,
        ...reminderData
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling payment reminder:', error);
      throw error;
    }
  }

  // Get upcoming payment reminders
  async getUpcomingReminders() {
    try {
      const response = await this.api.get('/notifications/upcoming-reminders');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming reminders:', error);
      throw error;
    }
  }

  // Send immediate payment due notification
  async sendPaymentDueNotification(goalId, amount, frequency) {
    try {
      const response = await this.api.post('/notifications/payment-due', {
        goalId,
        amount,
        frequency,
        type: 'payment_due',
        priority: 'high'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending payment due notification:', error);
      throw error;
    }
  }

  // Send email reminder
  async sendEmailReminder(goalId, reminderType = 'payment_due') {
    try {
      const response = await this.api.post('/notifications/send-email-reminder', {
        goalId,
        reminderType
      });
      return response.data;
    } catch (error) {
      console.error('Error sending email reminder:', error);
      throw error;
    }
  }

  // Update notification preferences
  async updateNotificationPreferences(preferences) {
    try {
      const response = await this.api.put('/notifications/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  // Get notification preferences
  async getNotificationPreferences() {
    try {
      const response = await this.api.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  }

  // Mark payment reminder as completed
  async markReminderCompleted(reminderId) {
    try {
      const response = await this.api.put(`/notifications/reminders/${reminderId}/completed`);
      return response.data;
    } catch (error) {
      console.error('Error marking reminder as completed:', error);
      throw error;
    }
  }

  // Get payment history for a goal
  async getPaymentHistory(goalId) {
    try {
      const response = await this.api.get(`/goals/${goalId}/payment-history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  // Schedule recurring notifications based on goal frequency
  async scheduleRecurringNotifications(goalId, goalData) {
    try {
      const response = await this.api.post('/notifications/schedule-recurring', {
        goalId,
        frequency: goalData.frequency,
        amount: goalData.amount,
        endDate: goalData.endDate,
        startDate: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling recurring notifications:', error);
      throw error;
    }
  }

  // Cancel scheduled notifications for a goal
  async cancelScheduledNotifications(goalId) {
    try {
      const response = await this.api.delete(`/notifications/cancel-scheduled/${goalId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling scheduled notifications:', error);
      throw error;
    }
  }
}

export default new GoalNotificationService();
