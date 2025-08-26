import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Server, 
  Activity, 
  Database, 
  Globe, 
  Zap, 
  Bell, 
  Search, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  Lock,
  Unlock,
  Mail,
  HelpCircle,
  Cog,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  PieChart,
  LineChart,
  AreaChart,
  Target,
  Wallet,
  Award,
  Brain,
  MessageCircle,
  Lightbulb,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();

  // Mock admin user data
  const adminUser = {
    name: 'Admin User',
    email: 'admin@loopfund.com',
    role: 'Super Admin',
    avatar: 'AU'
  };

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const adminMenuItems = [
    {
      title: 'Dashboard',
      icon: BarChart3,
      path: '/admin',
      badge: null
    },
    {
      title: 'User Management',
      icon: Users,
      path: '/admin/users',
      badge: '12',
      submenu: [
        { title: 'All Users', path: '/admin/users' },
        { title: 'Active Users', path: '/admin/users/active' },
        { title: 'Pending Users', path: '/admin/users/pending' },
        { title: 'Suspended Users', path: '/admin/users/suspended' },
        { title: 'User Analytics', path: '/admin/users/analytics' }
      ]
    },
    {
      title: 'Revenue Analytics',
      icon: DollarSign,
      path: '/admin/revenue',
      badge: '💰',
      submenu: [
        { title: 'Overview', path: '/admin/revenue' },
        { title: 'Monthly Reports', path: '/admin/revenue/monthly' },
        { title: 'Subscription Analytics', path: '/admin/revenue/subscriptions' },
        { title: 'Payment History', path: '/admin/revenue/payments' },
        { title: 'Revenue Forecasting', path: '/admin/revenue/forecast' }
      ]
    },
    {
      title: 'System Health',
      icon: Server,
      path: '/admin/system',
      badge: '99.8%',
      submenu: [
        { title: 'Server Status', path: '/admin/system/servers' },
        { title: 'Database Health', path: '/admin/system/database' },
        { title: 'API Performance', path: '/admin/system/api' },
        { title: 'Network Status', path: '/admin/system/network' },
        { title: 'Error Logs', path: '/admin/system/logs' }
      ]
    },
    {
      title: 'Content Management',
      icon: FileText,
      path: '/admin/content',
      badge: null,
      submenu: [
        { title: 'Achievements', path: '/admin/content/achievements' },
        { title: 'Goal Templates', path: '/admin/content/goals' },
        { title: 'Notifications', path: '/admin/content/notifications' },
        { title: 'Help Articles', path: '/admin/content/help' }
      ]
    },
    {
      title: 'Analytics',
      icon: Activity,
      path: '/admin/analytics',
      badge: null,
      submenu: [
        { title: 'Platform Analytics', path: '/admin/analytics/platform' },
        { title: 'User Behavior', path: '/admin/analytics/behavior' },
        { title: 'Performance Metrics', path: '/admin/analytics/performance' },
        { title: 'Custom Reports', path: '/admin/analytics/reports' }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      path: '/admin/security',
      badge: '🔒',
      submenu: [
        { title: 'Access Control', path: '/admin/security/access' },
        { title: 'Audit Logs', path: '/admin/security/audit' },
        { title: 'Security Settings', path: '/admin/security/settings' },
        { title: 'Threat Monitoring', path: '/admin/security/threats' }
      ]
    }
  ];

  const bottomMenuItems = [
    {
      title: 'Notifications',
      icon: Bell,
      path: '/admin/notifications',
      badge: '3'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings'
    },
    {
      title: 'Help',
      icon: HelpCircle,
      path: '/admin/help'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSubmenu = (title) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex h-screen">
        {/* Admin Sidebar */}
        <motion.div
          initial={{ width: isSidebarCollapsed ? 80 : 280 }}
          animate={{ width: isSidebarCollapsed ? 80 : 280 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-xl flex flex-col"
        >
          {/* Admin Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-700/50">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              {!isSidebarCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-synergy-500 to-velocity-500 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-semibold text-lg">Admin Panel</span>
                </div>
              )}
            </motion.div>
            
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200"
            >
              {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Admin Profile */}
          <div className="flex-shrink-0 p-4 border-b border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-synergy-500 to-velocity-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{adminUser.avatar}</span>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {adminUser.name}
                  </p>
                  <p className="text-slate-300 text-xs truncate">
                    {adminUser.role}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4 min-h-0">
            <nav className="space-y-1 px-3">
              {adminMenuItems.map((item) => (
                <div key={item.title}>
                  <Link
                    to={item.path}
                    onClick={() => item.submenu && toggleSubmenu(item.title)}
                    className={`group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-synergy-600/20 text-synergy-400 border border-synergy-500/30'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="ml-3 flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto bg-synergy-600 text-white text-xs px-2 py-1 rounded-full">
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
                  {item.submenu && !isSidebarCollapsed && (
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
                                  ? 'text-synergy-400 bg-synergy-600/10'
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
                  {!isSidebarCollapsed && (
                    <>
                      <span className="ml-3 flex-1">{item.title}</span>
                                              {item.badge && (
                          <span className="ml-auto bg-synergy-600 text-white text-xs px-2 py-1 rounded-full">
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
                {!isSidebarCollapsed && (
                  <span className="ml-3">
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </span>
                )}
              </motion.button>
              
              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="group flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200"
              >
                <LogOut size={20} className="flex-shrink-0" />
                {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Admin Top Navigation */}
          <header className="flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <div className="hidden md:flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <span>•</span>
                  <span>Welcome back, {adminUser.name}</span>
                  <span>•</span>
                  <span>Last login: 2 hours ago</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search admin panel..."
                    className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
                  />
                </div>
                
                {/* Notifications */}
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Admin Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{adminUser.avatar}</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{adminUser.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{adminUser.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 