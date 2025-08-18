import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
        setUnreadCount(data.data?.filter(n => !n.isRead).length || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch unread count for header badge
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch('http://localhost:4000/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.data?.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Create notification (for testing)
  const createNotification = async (notificationData) => {
    try {
      const response = await fetch('http://localhost:4000/api/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });

      if (response.ok) {
        await fetchNotifications(); // Refresh notifications
        await fetchUnreadCount(); // Refresh unread count
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Initialize with some sample notifications if none exist
  const initializeSampleNotifications = async () => {
    if (notifications.length === 0 && isAuthenticated) {
      const sampleNotifications = [
        {
          title: 'Welcome to LoopFund!',
          message: 'Start your savings journey by creating your first goal.',
          type: 'info',
          category: 'system',
          priority: 'medium'
        },
        {
          title: 'Goal Reminder',
          message: 'Your "Vacation Fund" goal is due in 2 days.',
          type: 'warning',
          category: 'goal',
          priority: 'high'
        },
        {
          title: 'Payment Success',
          message: 'Your contribution of $50 has been processed.',
          type: 'success',
          category: 'payment',
          priority: 'medium'
        }
      ];

      for (const notif of sampleNotifications) {
        await createNotification(notif);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
      initializeSampleNotifications();
    }
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}; 