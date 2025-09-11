import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNotificationsStore = create(
  persist(
    (set, get) => ({
      // State
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      preferences: {
        email: true,
        sms: false,
        push: true,
        reminderFrequency: 'daily'
      },

      // Actions
      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch('http://localhost:4000/api/notifications', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch notifications');
          }

          const notifications = await response.json();
          const unreadCount = notifications.filter(n => !n.read).length;
          
          set({ notifications, unreadCount, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: error.message });
        }
      },

      markAsRead: async (notificationId) => {
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to mark notification as read');
          }

          set(state => {
            const updatedNotifications = state.notifications.map(notification =>
              notification._id === notificationId
                ? { ...notification, read: true }
                : notification
            );
            
            const unreadCount = updatedNotifications.filter(n => !n.read).length;
            
            return {
              notifications: updatedNotifications,
              unreadCount
            };
          });
        } catch (error) {
          set({ error: error.message });
        }
      },

      markAllAsRead: async () => {
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch('http://localhost:4000/api/notifications/read-all', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to mark all notifications as read');
          }

          set(state => ({
            notifications: state.notifications.map(notification => ({
              ...notification,
              read: true
            })),
            unreadCount: 0
          }));
        } catch (error) {
          set({ error: error.message });
        }
      },

      deleteNotification: async (notificationId) => {
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch(`http://localhost:4000/api/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete notification');
          }

          set(state => {
            const updatedNotifications = state.notifications.filter(
              notification => notification._id !== notificationId
            );
            
            const unreadCount = updatedNotifications.filter(n => !n.read).length;
            
            return {
              notifications: updatedNotifications,
              unreadCount
            };
          });
        } catch (error) {
          set({ error: error.message });
        }
      },

      addNotification: (notification) => {
        set(state => {
          const updatedNotifications = [notification, ...state.notifications];
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount
          };
        });
      },

      updatePreferences: async (preferences) => {
        set({ isLoading: true, error: null });
        try {
          const { getToken } = await import('./useAuthStore');
          const token = getToken();
          
          const response = await fetch('http://localhost:4000/api/notifications/preferences', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(preferences)
          });

          if (!response.ok) {
            throw new Error('Failed to update notification preferences');
          }

          set({ preferences, isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: error.message });
        }
      },

      clearError: () => set({ error: null }),

      // Computed values
      getUnreadNotifications: () => {
        return get().notifications.filter(notification => !notification.read);
      },

      getReadNotifications: () => {
        return get().notifications.filter(notification => notification.read);
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter(notification => notification.type === type);
      },

      getRecentNotifications: (limit = 10) => {
        return get().notifications.slice(0, limit);
      },

      getNotificationsByDate: (date) => {
        const targetDate = new Date(date);
        return get().notifications.filter(notification => {
          const notificationDate = new Date(notification.createdAt);
          return notificationDate.toDateString() === targetDate.toDateString();
        });
      },

      // Getters
      getNotifications: () => get().notifications,
      getUnreadCount: () => get().unreadCount,
      getIsLoading: () => get().isLoading,
      getError: () => get().error,
      getPreferences: () => get().preferences,
    }),
    {
      name: 'notifications-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        preferences: state.preferences
      })
    }
  )
);

export default useNotificationsStore; 