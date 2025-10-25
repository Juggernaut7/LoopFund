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
  Archive,
  Sparkles,
  Zap,
  Crown,
  Trophy,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com';

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
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const data = await response.json();
      setNotifications(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error', 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
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
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
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
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
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
      const response = await fetch(`${API_BASE_URL}/notifications/archive`, {
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
      case 'success': return <CheckCircle className="w-5 h-5 text-loopfund-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-loopfund-gold-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-loopfund-coral-500" />;
      case 'info': return <Info className="w-5 h-5 text-loopfund-electric-500" />;
      case 'achievement': return <Trophy className="w-5 h-5 text-loopfund-gold-500" />;
      default: return <Bell className="w-5 h-5 text-loopfund-neutral-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'border-l-loopfund-emerald-500 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20';
      case 'warning': return 'border-l-loopfund-gold-500 bg-loopfund-gold-50 dark:bg-loopfund-gold-900/20';
      case 'error': return 'border-l-loopfund-coral-500 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20';
      case 'info': return 'border-l-loopfund-electric-500 bg-loopfund-electric-50 dark:bg-loopfund-electric-900/20';
      case 'achievement': return 'border-l-loopfund-gold-500 bg-loopfund-gold-50 dark:bg-loopfund-gold-900/20';
      default: return 'border-l-loopfund-neutral-500 bg-loopfund-neutral-50 dark:bg-loopfund-neutral-900/20';
    }
  };

  const filteredNotifications = (notifications || []).filter(notification => {
    if (!notification) return false;
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = (notification.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notification.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchived = showArchived ? notification.isArchived : !notification.isArchived;
    
    return matchesFilter && matchesSearch && matchesArchived;
  });

  const unreadCount = (notifications || []).filter(n => n && !n.isRead).length;
  const totalCount = (notifications || []).length;

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Bell className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Loading Notifications
            </h2>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Fetching your latest updates...
            </p>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Revolutionary Header */}
          <motion.div 
            className="relative mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Notifications
                </motion.h1>
                <motion.p 
                  className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Stay updated with your savings progress and achievements
                </motion.p>
              </div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {selectedNotifications.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <LoopFundButton
                      onClick={archiveNotifications}
                      variant="gold"
                      size="lg"
                      icon={<Archive className="w-5 h-5" />}
                    >
                      Archive ({selectedNotifications.length})
                    </LoopFundButton>
                  </motion.div>
                )}
                <LoopFundButton
                  onClick={markAllAsRead}
                  variant="primary"
                  size="lg"
                  icon={<Check className="w-5 h-5" />}
                >
                  Mark All Read
                </LoopFundButton>
              </motion.div>
            </div>
          </motion.div>

          {/* Revolutionary Notification Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Total Notifications</p>
                    <p className="font-display text-h3 text-loopfund-neutral-900">{totalCount}</p>
                  </div>
                  <div className="p-3 bg-loopfund-emerald-100 rounded-full">
                    <Bell className="w-6 h-6 text-loopfund-emerald-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Unread</p>
                    <p className="font-display text-h3 text-loopfund-coral-600">{unreadCount}</p>
                  </div>
                  <div className="p-3 bg-loopfund-coral-100 rounded-full">
                    <AlertCircle className="w-6 h-6 text-loopfund-coral-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Read</p>
                    <p className="font-display text-h3 text-loopfund-emerald-600">{totalCount - unreadCount}</p>
                  </div>
                  <div className="p-3 bg-loopfund-emerald-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-loopfund-emerald-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Achievements</p>
                    <p className="font-display text-h3 text-loopfund-gold-600">
                      {(notifications || []).filter(n => n && n.type === 'achievement').length}
                    </p>
                  </div>
                  <div className="p-3 bg-loopfund-gold-100 rounded-full">
                    <Trophy className="w-6 h-6 text-loopfund-gold-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          </motion.div>

          {/* Revolutionary Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="relative mb-8"
          >
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-loopfund-electric-100 rounded-lg">
                    <Filter className="w-5 h-5 text-loopfund-electric-600" />
                  </div>
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Filter Notifications
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-loopfund-emerald-500 rounded-full"></div>
                  <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {filteredNotifications.length} notifications
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                {/* Search */}
                <div className="flex-1">
                  <LoopFundInput
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-5 h-5" />}
                    className="w-full"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'all', label: 'All', count: totalCount, color: 'emerald' },
                    { id: 'unread', label: 'Unread', count: unreadCount, color: 'coral' },
                    { id: 'success', label: 'Success', count: (notifications || []).filter(n => n && n.type === 'success').length, color: 'emerald' },
                    { id: 'warning', label: 'Warning', count: (notifications || []).filter(n => n && n.type === 'warning').length, color: 'gold' },
                    { id: 'achievement', label: 'Achievements', count: (notifications || []).filter(n => n && n.type === 'achievement').length, color: 'gold' }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`px-4 py-3 rounded-xl font-body text-body font-medium transition-all duration-200 flex items-center space-x-2 ${
                        filter === tab.id
                          ? `bg-loopfund-${tab.color}-100 dark:bg-loopfund-${tab.color}-900/20 text-loopfund-${tab.color}-700 dark:text-loopfund-${tab.color}-300 shadow-loopfund border-2 border-loopfund-${tab.color}-200 dark:border-loopfund-${tab.color}-800`
                          : 'bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-dark-surface border-2 border-transparent'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{tab.label}</span>
                      <span className="px-2 py-1 bg-loopfund-neutral-200 dark:bg-loopfund-dark-surface rounded-full text-xs">
                        {tab.count}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Archive Toggle */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="showArchived"
                      checked={showArchived}
                      onChange={(e) => setShowArchived(e.target.checked)}
                      className="w-5 h-5 text-loopfund-emerald-600 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-loopfund-emerald-500 focus:ring-2 dark:ring-offset-loopfund-dark-bg"
                    />
                  </div>
                  <label htmlFor="showArchived" className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 cursor-pointer">
                    Show Archived
                  </label>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>


          {/* Revolutionary Notifications List */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="space-y-4"
          >
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <LoopFundCard variant="elevated" className="p-12">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-loopfund-neutral-400 to-loopfund-neutral-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Bell className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                    No notifications found
                  </h3>
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                    {searchTerm ? 'Try adjusting your search terms' : 'You\'re all caught up!'}
                  </p>
                  <LoopFundButton
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                    size="lg"
                    icon={<Bell className="w-5 h-5" />}
                  >
                    Clear Filters
                  </LoopFundButton>
                </LoopFundCard>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.05 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`p-6 rounded-2xl border-l-4 transition-all duration-300 hover:shadow-loopfund ${
                    getNotificationColor(notification.type)
                  } ${notification.isRead ? 'opacity-75' : ''} ${
                    selectedNotifications.includes(notification._id) 
                      ? 'ring-2 ring-loopfund-emerald-500 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/30' 
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
                      className="w-5 h-5 text-loopfund-emerald-600 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-lg focus:ring-loopfund-emerald-500 focus:ring-2 dark:ring-offset-loopfund-dark-bg mt-1"
                    />

                    {/* Icon */}
                    <motion.div 
                      className="flex-shrink-0 p-2 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {getNotificationIcon(notification.type)}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-body text-body-sm font-medium ${
                            notification.isRead 
                              ? 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400' 
                              : 'text-loopfund-neutral-900 dark:text-loopfund-dark-text'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="font-body text-body text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <motion.button
                              onClick={() => markAsRead(notification._id)}
                              className="p-2 hover:bg-loopfund-emerald-100 dark:hover:bg-loopfund-emerald-900/30 rounded-xl transition-colors"
                              title="Mark as read"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <CheckCircle className="w-4 h-4 text-loopfund-emerald-600" />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-2 hover:bg-loopfund-coral-100 dark:hover:bg-loopfund-coral-900/30 rounded-xl transition-colors"
                            title="Delete notification"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4 text-loopfund-coral-600" />
                          </motion.button>
                        </div>
                    </div>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 mt-4 text-xs font-body text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(notification.createdAt).toLocaleString()}</span>
                        </div>
                        {notification.category && (
                          <span className="px-3 py-1 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-full font-body text-body-sm">
                            {notification.category}
                          </span>
                        )}
                        {notification.priority && (
                          <span className={`px-3 py-1 rounded-full font-body text-body-sm ${
                            notification.priority === 'high' 
                              ? 'bg-loopfund-coral-100 text-loopfund-coral-700 dark:bg-loopfund-coral-900/30 dark:text-loopfund-coral-300'
                              : notification.priority === 'medium'
                              ? 'bg-loopfund-gold-100 text-loopfund-gold-700 dark:bg-loopfund-gold-900/30 dark:text-loopfund-gold-300'
                              : 'bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300'
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
          </motion.div>
        </div>
      </div>
  );
};

export default NotificationsPage; 