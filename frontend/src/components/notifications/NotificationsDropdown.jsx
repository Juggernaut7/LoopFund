import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  Clock, 
  AlertCircle, 
  Info, 
  Star,
  Trash2,
  Settings
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const NotificationsDropdown = ({ isOpen, onClose, notifications = [] }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [filter, setFilter] = useState('all');
  const dropdownRef = useRef(null);
  const { toast } = useToast();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
        setLocalNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        toast.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (response.ok) {
        setLocalNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

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
        setLocalNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <Check className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <X className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'achievement': return <Star className="w-5 h-5 text-purple-500" />;
      case 'contribution': return <Check className="w-5 h-5 text-green-500" />;
      case 'group_join': return <Check className="w-5 h-5 text-blue-500" />;
      case 'group_member_joined': return <Check className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'info': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'achievement': return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'contribution': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'group_join': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'group_member_joined': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20';
      default: return 'border-l-slate-500 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  const handleViewAll = () => {
    onClose();
    navigate('/notifications');
  };

  const handleNotificationClick = (notification) => {
    // Navigate based on notification type and data
    if (notification.data?.groupId || notification.relatedId) {
      const groupId = notification.data?.groupId || notification.relatedId;
      navigate(`/groups/${groupId}`);
    } else if (notification.metadata?.goalId) {
      navigate(`/goals/${notification.metadata.goalId}`);
    } else if (notification.metadata?.achievementId) {
      navigate('/achievements');
    } else if (notification.type === 'contribution' && notification.data?.groupId) {
      navigate(`/groups/${notification.data.groupId}`);
    } else if (notification.type === 'group_join' && notification.data?.groupId) {
      navigate(`/groups/${notification.data.groupId}`);
    } else if (notification.type === 'group_member_joined' && notification.data?.groupId) {
      navigate(`/groups/${notification.data.groupId}`);
    } else {
      navigate('/notifications');
    }
    
    // Mark as read if not already read
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    onClose();
  };

  const filteredNotifications = localNotifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = localNotifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        ref={dropdownRef}
        className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 p-2 bg-slate-50 dark:bg-slate-700/50">
          {[
            { id: 'all', label: 'All', count: localNotifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'success', label: 'Success', count: localNotifications.filter(n => n.type === 'success').length },
            { id: 'warning', label: 'Warning', count: localNotifications.filter(n => n.type === 'warning').length },
            { id: 'achievement', label: 'Achievements', count: localNotifications.filter(n => n.type === 'achievement').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">
                {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`mb-2 p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                    getNotificationColor(notification.type)
                  } ${notification.isRead ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        notification.isRead 
                          ? 'text-slate-600 dark:text-slate-400' 
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3 text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </span>
            <button 
              onClick={handleViewAll}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              View all
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationsDropdown; 