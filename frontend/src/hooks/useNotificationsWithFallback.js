import { useContext } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';

export const useNotificationsWithFallback = () => {
  try {
    return useContext(NotificationsContext);
  } catch (error) {
    // Return fallback values when context is not available
    return {
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      fetchNotifications: () => {},
      fetchUnreadCount: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      createNotification: () => {}
    };
  }
}; 