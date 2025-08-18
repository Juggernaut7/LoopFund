import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  Clock, 
  AlertCircle, 
  Info, 
  Star,
  Trash2,
  Settings,
  Filter,
  Search,
  Download,
  Archive
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:4000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const data = await response.json();
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error', 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

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
        toast.success('Success', 'Notification marked as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Error', 'Failed to mark notification as read');
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
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        toast.success('Success', 'All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Error', 'Failed to mark all notifications as read');
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
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        toast.success('Success', 'Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Error', 'Failed to delete notification');
    }
  };

  const archiveNotifications = async () => {
    if (selectedNotifications.length === 0) {
      toast.error('Error', 'Please select notifications to archive');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/notifications/archive', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationIds: selectedNotifications })
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif._id)));
        setSelectedNotifications([]);
        toast.success('Success', 'Notifications archived successfully');
      }
    } catch (error) {
      console.error('Error archiving notifications:', error);
      toast.error('Error', 'Failed to archive notifications');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <Check className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'achievement': return <Star className="w-5 h-5 text-purple-500" />;
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
      default: return 'border-l-slate-500 bg-slate-50 dark:bg-slate-900/20';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchived = showArchived ? notification.isArchived : !notification.isArchived;
    
    return matchesFilter && matchesSearch && matchesArchived;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalCount = notifications.length;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Notifications
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Stay updated with your savings progress and achievements
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {selectedNotifications.length > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={archiveNotifications}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Archive className="w-4 h-4" />
                <span>Archive ({selectedNotifications.length})</span>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Read</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Unread</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Read</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCount - unreadCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Achievements</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {notifications.filter(n => n.type === 'achievement').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
              {[
                { id: 'all', label: 'All', count: totalCount },
                { id: 'unread', label: 'Unread', count: unreadCount },
                { id: 'success', label: 'Success', count: notifications.filter(n => n.type === 'success').length },
                { id: 'warning', label: 'Warning', count: notifications.filter(n => n.type === 'warning').length },
                { id: 'achievement', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filter === tab.id
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Archive Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showArchived"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="showArchived" className="text-sm text-slate-600 dark:text-slate-400">
                Show Archived
              </label>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {searchTerm ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md ${
                  getNotificationColor(notification.type)
                } ${notification.isRead ? 'opacity-75' : ''} ${
                  selectedNotifications.includes(notification._id) 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                    : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedNotifications(prev => [...prev, notification._id]);
                      } else {
                        setSelectedNotifications(prev => prev.filter(id => id !== notification._id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
                  />

                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          notification.isRead 
                            ? 'text-slate-600 dark:text-slate-400' 
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      </div>
                      {notification.category && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                          {notification.category}
                        </span>
                      )}
                      {notification.priority && (
                        <span className={`px-2 py-1 rounded-full ${
                          notification.priority === 'high' 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : notification.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {notification.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage; 