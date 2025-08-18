import React, { useState } from 'react';
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

const TopNav = ({ toggleSidebar, isCollapsed, unreadCount = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuthWithToast();

  // For now, use empty notifications array until we implement the full context
  const notifications = [];

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/signin');
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
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Menu size={20} className="text-slate-600 dark:text-slate-300" />
          </button>

          {/* Page Title */}
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back, {user?.firstName || user?.name || 'User'}! Here's what's happening today.
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search goals, groups, or transactions..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {isDark ? (
              <Sun size={18} className="text-yellow-500" />
            ) : (
              <Moon size={18} className="text-slate-600" />
            )}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Bell size={18} className="text-slate-600 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

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
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.name || 'Guest'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.role || 'User'}
                </p>
              </div>
              <ChevronDown size={16} className="text-slate-600 dark:text-slate-300" />
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50"
                >
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user?.name || 'Guest'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {user?.email || 'No email available'}
                    </p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                      <User size={16} className="mr-3" />
                      Profile
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Settings size={16} className="mr-3" />
                      Settings
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                      <HelpCircle size={16} className="mr-3" />
                      Help & Support
                    </button>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 py-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut size={16} className="mr-3" />
                      Sign out
                    </button>
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