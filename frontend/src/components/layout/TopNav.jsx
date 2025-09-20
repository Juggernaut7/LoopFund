import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  ChevronDown, 
  Menu,
  X,
  Sun,
  Moon,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuthWithToast } from '../../hooks/useAuthWithToast';
import NotificationsDropdown from '../notifications/NotificationsDropdown';
import { useAuthStore } from '../../store/useAuthStore';
import logo from '../../assets/logo.jpg';

const TopNav = ({ toggleSidebar, isCollapsed, unreadCount = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuthWithToast();
  const userMenuRef = useRef(null);

  // For now, use empty notifications array until we implement the full context
  const notifications = [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/signin');
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    navigate('/profile');
  };

  // Handle settings navigation
  const handleSettingsClick = () => {
    setIsUserMenuOpen(false);
    navigate('/settings');
  };

  // Handle help & support
  const handleHelpClick = () => {
    setIsUserMenuOpen(false);
    // You can implement help modal or navigate to help page
    console.log('Help & Support clicked');
  };

  // Get page title from current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/goals')) return 'Goals';
    if (path.startsWith('/groups')) return 'Groups';
    if (path.startsWith('/contributions')) return 'Contributions';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/achievements')) return 'Achievements';
    if (path.startsWith('/calendar')) return 'Calendar';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/notifications')) return 'Notifications';
    return 'LoopFund';
  };

  const handleViewAll = () => {
    setShowNotifications(false);
    navigate('/notifications');
  };

  const handleNotificationClick = (notification) => {
    // Navigate based on notification type
    if (notification.metadata?.goalId) {
      navigate(`/goals/${notification.metadata.goalId}`);
    } else if (notification.metadata?.groupId) {
      navigate(`/groups/${notification.metadata.groupId}`);
    } else if (notification.metadata?.contributionId) {
      navigate(`/contributions/${notification.metadata.contributionId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-loopfund-dark-surface border-b border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30 shadow-loopfund-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <motion.button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-loopfund-neutral-100 dark:bg-loopfund-midnight-800/50 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-midnight-700/50 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} className="text-loopfund-neutral-600 dark:text-loopfund-neutral-300" />
          </motion.button>

          {/* Page Title */}
          <div className="hidden sm:block">
            <h1 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              {getPageTitle()}
            </h1>
            <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
              Welcome back, {user?.firstName || user?.name || 'User'}! Here's what's happening today.
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-loopfund-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search goals, groups, or transactions..."
              className="w-full pl-10 pr-4 py-2 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-midnight-800/50 text-loopfund-neutral-900 dark:text-loopfund-dark-text placeholder-loopfund-neutral-500 dark:placeholder-loopfund-neutral-400 focus:outline-none focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-loopfund-neutral-100 dark:bg-loopfund-midnight-800/50 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-midnight-700/50 transition-all duration-200"
          >
            {isDark ? (
              <Sun size={18} className="text-loopfund-gold-500" />
            ) : (
              <Moon size={18} className="text-loopfund-neutral-600" />
            )}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-loopfund-neutral-100 dark:bg-loopfund-midnight-800/50 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-midnight-700/50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={18} className="text-loopfund-neutral-600 dark:text-loopfund-neutral-300" />
              {unreadCount > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-loopfund-coral-500 text-white text-xs rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <NotificationsDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  notifications={notifications}
                  onNotificationClick={handleNotificationClick}
                  onViewAll={handleViewAll}
                />
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <motion.button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-xl bg-loopfund-neutral-100 dark:bg-loopfund-midnight-800/50 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-midnight-700/50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-loopfund-coral-500 to-loopfund-orange-500 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <User size={16} className="text-white" />
              </motion.div>
              <div className="hidden sm:block text-left">
                <p className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'User'}
                </p>
                <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                  {user?.role || 'User'}
                </p>
              </div>
              <ChevronDown size={16} className="text-loopfund-neutral-600 dark:text-loopfund-neutral-300" />
            </motion.button>

            {/* User Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-loopfund-dark-surface rounded-xl shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30 z-50"
                >
                  <div className="p-4 border-b border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'User'}
                    </p>
                    <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                      {user?.email || 'No email available'}
                    </p>
                  </div>
                  <div className="py-2">
                    <motion.button 
                      onClick={handleProfileClick}
                      className="w-full flex items-center px-4 py-2 font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-midnight-800/50 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <User size={16} className="mr-3" />
                      Profile
                    </motion.button>
                    <motion.button 
                      onClick={handleSettingsClick}
                      className="w-full flex items-center px-4 py-2 font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-midnight-800/50 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <Settings size={16} className="mr-3" />
                      Settings
                    </motion.button>
                    <motion.button 
                      onClick={handleHelpClick}
                      className="w-full flex items-center px-4 py-2 font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-midnight-800/50 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <HelpCircle size={16} className="mr-3" />
                      Help & Support
                    </motion.button>
                  </div>
                  <div className="border-t border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30 py-2">
                    <motion.button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 font-body text-body-sm text-loopfund-coral-600 dark:text-loopfund-coral-400 hover:bg-loopfund-coral-50 dark:hover:bg-loopfund-coral-900/20 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign out
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;