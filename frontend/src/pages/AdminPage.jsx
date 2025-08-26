import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Wallet, 
  BarChart3, 
  Settings, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Star, 
  Award, 
  Calendar, 
  FileText, 
  Database, 
  Server, 
  Globe, 
  Zap, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw, 
  MoreVertical,
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  Mail,
  Bell,
  Cog,
  HelpCircle,
  LogOut,
  Crown,
  BadgeCheck,
  AlertCircle,
  Info,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  PieChart,
  LineChart,
  BarChart,
  AreaChart
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import StatsCard from '../components/ui/StatsCard';
import { useToast } from '../context/ToastContext';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const adminStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 45678.90,
    monthlyGrowth: 23.5,
    totalGroups: 156,
    activeGoals: 892,
    systemHealth: 99.8,
    pendingActions: 12
  };

  const revenueData = {
    monthly: 45678.90,
    weekly: 12345.67,
    daily: 2345.67,
    growth: 23.5,
    subscriptions: 892,
    premiumUsers: 234,
    averageRevenue: 51.23
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending', joinDate: '2024-01-14', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'active', joinDate: '2024-01-13', avatar: 'MJ' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'suspended', joinDate: '2024-01-12', avatar: 'SW' },
    { id: 5, name: 'David Brown', email: 'david@example.com', status: 'active', joinDate: '2024-01-11', avatar: 'DB' }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'High server load detected', time: '2 min ago' },
    { id: 2, type: 'info', message: 'Database backup completed', time: '15 min ago' },
    { id: 3, type: 'success', message: 'New user registration spike', time: '1 hour ago' }
  ];

  const handleUserAction = (action, userId) => {
    toast.success(`${action} action performed successfully`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
    { id: 'system', label: 'System Health', icon: Server },
    { id: 'settings', label: 'Admin Settings', icon: Settings }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-500" />
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage your platform, monitor performance, and control system settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-synergy-500 to-velocity-500 text-white rounded-lg hover:from-synergy-600 hover:to-velocity-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatsCard
            title="Total Users"
            value={adminStats.totalUsers.toLocaleString()}
            change="+12.5%"
            changeType="positive"
            icon={Users}
            color="blue"
            delay={0.1}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${adminStats.totalRevenue.toLocaleString()}`}
            change="+23.5%"
            changeType="positive"
            icon={DollarSign}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="Active Groups"
            value={adminStats.totalGroups}
            change="+8.2%"
            changeType="positive"
            icon={Target}
            color="purple"
            delay={0.3}
          />
          <StatsCard
            title="System Health"
            value={`${adminStats.systemHealth}%`}
            change="+0.2%"
            changeType="positive"
            icon={Activity}
            color="emerald"
            delay={0.4}
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-synergy-600 dark:text-synergy-400 border-b-2 border-synergy-500 bg-synergy-50 dark:bg-synergy-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                    >
                      <UserPlus className="w-6 h-6 mb-2" />
                      <div className="text-left">
                        <h3 className="font-semibold">Add User</h3>
                        <p className="text-blue-100 text-sm">Create new user account</p>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                    >
                      <BarChart3 className="w-6 h-6 mb-2" />
                      <div className="text-left">
                        <h3 className="font-semibold">View Analytics</h3>
                        <p className="text-green-100 text-sm">Detailed performance metrics</p>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                    >
                      <Settings className="w-6 h-6 mb-2" />
                      <div className="text-left">
                        <h3 className="font-semibold">System Settings</h3>
                        <p className="text-purple-100 text-sm">Configure platform settings</p>
                      </div>
                    </motion.button>
                  </div>

                  {/* Recent Activity & Alerts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Recent Users
                      </h3>
                      <div className="space-y-3">
                        {recentUsers.slice(0, 5).map((user) => (
                          <motion.div
                            key={user.id}
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-synergy-500 to-velocity-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user.avatar}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {user.status}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* System Alerts */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        System Alerts
                      </h3>
                      <div className="space-y-3">
                        {systemAlerts.map((alert) => (
                          <motion.div
                            key={alert.id}
                            whileHover={{ x: 5 }}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                              alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                              'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                            }`}
                          >
                            {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" /> :
                             alert.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                             <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.message}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{alert.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* User Management Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">User Management</h3>
                      <p className="text-slate-600 dark:text-slate-400">Manage all platform users</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-synergy-500 to-velocity-500 text-white rounded-lg hover:from-synergy-600 hover:to-velocity-600 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </motion.button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-synergy-500 focus:border-transparent"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </motion.button>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Join Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {recentUsers.map((user) => (
                            <motion.tr
                              key={user.id}
                              whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                              className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-r from-synergy-500 to-velocity-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {user.avatar}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                }`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                {user.joinDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'revenue' && (
                <motion.div
                  key="revenue"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Revenue Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                      title="Monthly Revenue"
                      value={`$${revenueData.monthly.toLocaleString()}`}
                      change="+23.5%"
                      changeType="positive"
                      icon={TrendingUp}
                      color="green"
                    />
                    <StatsCard
                      title="Weekly Revenue"
                      value={`$${revenueData.weekly.toLocaleString()}`}
                      change="+15.2%"
                      changeType="positive"
                      icon={BarChart3}
                      color="blue"
                    />
                    <StatsCard
                      title="Daily Revenue"
                      value={`$${revenueData.daily.toLocaleString()}`}
                      change="+8.7%"
                      changeType="positive"
                      icon={Activity}
                      color="purple"
                    />
                    <StatsCard
                      title="Premium Users"
                      value={revenueData.premiumUsers}
                      change="+12.3%"
                      changeType="positive"
                      icon={Crown}
                      color="amber"
                    />
                  </div>

                  {/* Revenue Charts Placeholder */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <LineChart className="w-5 h-5" />
                        Revenue Trend
                      </h3>
                      <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-500 dark:text-slate-400">Revenue chart will be displayed here</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Revenue Distribution
                      </h3>
                      <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                          <p className="text-slate-500 dark:text-slate-400">Revenue distribution chart will be displayed here</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Metrics */}
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Revenue Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">${revenueData.averageRevenue}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Average Revenue per User</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{revenueData.subscriptions}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total Subscriptions</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{revenueData.growth}%</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Monthly Growth Rate</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'system' && (
                <motion.div
                  key="system"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* System Health Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                      title="Server Status"
                      value="Online"
                      change="99.8%"
                      changeType="positive"
                      icon={Server}
                      color="green"
                    />
                    <StatsCard
                      title="Database Health"
                      value="Healthy"
                      change="100%"
                      changeType="positive"
                      icon={Database}
                      color="blue"
                    />
                    <StatsCard
                      title="API Response"
                      value="245ms"
                      change="-12ms"
                      changeType="positive"
                      icon={Zap}
                      color="purple"
                    />
                    <StatsCard
                      title="Active Sessions"
                      value="1,247"
                      change="+23"
                      changeType="positive"
                      icon={Users}
                      color="emerald"
                    />
                  </div>

                  {/* System Monitoring */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        System Performance
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">CPU Usage</span>
                            <span className="text-slate-900 dark:text-white">45%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Memory Usage</span>
                            <span className="text-slate-900 dark:text-white">67%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">Disk Usage</span>
                            <span className="text-slate-900 dark:text-white">23%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Network Status
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <span className="text-slate-600 dark:text-slate-400">Uptime</span>
                          <span className="text-slate-900 dark:text-white font-medium">99.98%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <span className="text-slate-600 dark:text-slate-400">Response Time</span>
                          <span className="text-slate-900 dark:text-white font-medium">245ms</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <span className="text-slate-600 dark:text-slate-400">Requests/sec</span>
                          <span className="text-slate-900 dark:text-white font-medium">1,234</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Admin Settings */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Require 2FA for all users</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-synergy-500"
                          >
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                          </motion.button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Session Timeout</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Auto-logout after inactivity</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300 dark:bg-slate-600"
                          >
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notification Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Send admin alerts via email</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-synergy-500"
                          >
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                          </motion.button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">System Alerts</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Real-time system notifications</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-synergy-500"
                          >
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage; 