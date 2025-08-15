import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Target, 
  Users, 
  Wallet, 
  BarChart3, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { theme, toggleTheme, isDark } = useTheme();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      badge: null
    },
    {
      title: 'Goals',
      icon: Target,
      path: '/goals',
      badge: '3',
      submenu: [
        { title: 'My Goals', path: '/goals' },
        { title: 'Create Goal', path: '/goals/create' },
        { title: 'Goal Templates', path: '/goals/templates' }
      ]
    },
    {
      title: 'Groups',
      icon: Users,
      path: '/groups',
      badge: '2',
      submenu: [
        { title: 'My Groups', path: '/groups' },
        { title: 'Create Group', path: '/groups/create' },
        { title: 'Join Group', path: '/groups/join' }
      ]
    },
    {
      title: 'Contributions',
      icon: Wallet,
      path: '/contributions',
      badge: null,
      submenu: [
        { title: 'History', path: '/contributions' },
        { title: 'Make Payment', path: '/contributions/pay' },
        { title: 'Scheduled', path: '/contributions/scheduled' }
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      badge: null,
      submenu: [
        { title: 'Overview', path: '/analytics' },
        { title: 'Progress', path: '/analytics/progress' },
        { title: 'Insights', path: '/analytics/insights' }
      ]
    },
    {
      title: 'Achievements',
      icon: Award,
      path: '/achievements',
      badge: '5',
      submenu: [
        { title: 'My Badges', path: '/achievements' },
        { title: 'Leaderboard', path: '/achievements/leaderboard' },
        { title: 'Challenges', path: '/achievements/challenges' }
      ]
    },
    {
      title: 'Calendar',
      icon: Calendar,
      path: '/calendar',
      badge: null
    },
    {
      title: 'Reports',
      icon: FileText,
      path: '/reports',
      badge: null
    }
  ];

  const bottomMenuItems = [
    {
      title: 'Notifications',
      icon: Bell,
      path: '/notifications',
      badge: '3'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings'
    },
    {
      title: 'Help',
      icon: HelpCircle,
      path: '/help'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSubmenu = (title) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-xl flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-700/50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="text-white font-semibold text-lg">LoopFund</span>
            </div>
          )}
        </motion.div>
        
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Profile */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">John Doe</p>
              <p className="text-slate-400 text-xs truncate">Premium Member</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 min-h-0">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => (
            <div key={item.title}>
              <Link
                to={item.path}
                onClick={() => item.submenu && toggleSubmenu(item.title)}
                className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.submenu && (
                      <ChevronRight 
                        size={16} 
                        className={`ml-2 transition-transform duration-200 ${
                          activeSubmenu === item.title ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </>
                )}
              </Link>

              {/* Submenu */}
              {item.submenu && !isCollapsed && (
                <AnimatePresence>
                  {activeSubmenu === item.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 mt-1 space-y-1"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.path}
                          className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                            isActive(subItem.path)
                              ? 'text-blue-400 bg-blue-600/10'
                              : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="flex-shrink-0 p-4 border-t border-slate-700/50">
        <nav className="space-y-1">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-slate-700/50 text-white'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="ml-3 flex-1">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
          
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTheme}
            className="group flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
          >
            {isDark ? (
              <Sun size={20} className="flex-shrink-0 text-yellow-400" />
            ) : (
              <Moon size={20} className="flex-shrink-0" />
            )}
            {!isCollapsed && (
              <span className="ml-3">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </motion.button>
          
          {/* Logout */}
          <button className="group flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200">
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="flex-shrink-0 p-4 border-t border-slate-700/50">
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2">
            <Plus size={16} />
            <span>New Goal</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar; 