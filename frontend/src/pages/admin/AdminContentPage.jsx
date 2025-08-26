import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Award, 
  Target, 
  Bell, 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Star, 
  Users, 
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useToast } from '../../context/ToastContext';

const AdminContentPage = () => {
  const [activeTab, setActiveTab] = useState('achievements');
  const { toast } = useToast();

  // Mock content data
  const achievements = [
    { id: 1, name: 'First Goal', description: 'Complete your first savings goal', category: 'Milestone', usersEarned: 1247, icon: '🎯', status: 'active' },
    { id: 2, name: 'Group Leader', description: 'Lead a group to achieve their goal', category: 'Leadership', usersEarned: 234, icon: '👑', status: 'active' },
    { id: 3, name: 'Consistency King', description: 'Make contributions for 30 consecutive days', category: 'Consistency', usersEarned: 567, icon: '🔥', status: 'active' },
    { id: 4, name: 'Big Saver', description: 'Save over $1000 in a single goal', category: 'Milestone', usersEarned: 89, icon: '💰', status: 'draft' }
  ];

  const goalTemplates = [
    { id: 1, name: 'Emergency Fund', description: 'Build a 6-month emergency fund', category: 'Emergency', usageCount: 892, status: 'active', difficulty: 'Beginner' },
    { id: 2, name: 'Vacation Fund', description: 'Save for your dream vacation', category: 'Travel', usageCount: 456, status: 'active', difficulty: 'Intermediate' },
    { id: 3, name: 'Home Down Payment', description: 'Save for a house down payment', category: 'Housing', usageCount: 234, status: 'active', difficulty: 'Advanced' },
    { id: 4, name: 'Wedding Fund', description: 'Save for your special day', category: 'Life Event', usageCount: 123, status: 'draft', difficulty: 'Intermediate' }
  ];

  const notifications = [
    { id: 1, title: 'Welcome Message', content: 'Welcome to LoopFund! Start your savings journey today.', type: 'welcome', status: 'active', sentCount: 1247 },
    { id: 2, title: 'Goal Reminder', content: 'Don\'t forget to contribute to your goal this week!', type: 'reminder', status: 'active', sentCount: 892 },
    { id: 3, title: 'Achievement Unlocked', content: 'Congratulations! You\'ve earned a new achievement.', type: 'achievement', status: 'active', sentCount: 567 },
    { id: 4, title: 'Group Update', content: 'Your group has reached 50% of their goal!', type: 'group', status: 'draft', sentCount: 0 }
  ];

  const helpArticles = [
    { id: 1, title: 'Getting Started Guide', content: 'Learn how to create your first savings goal...', category: 'Getting Started', views: 2345, status: 'published', author: 'Admin Team' },
    { id: 2, title: 'How to Join a Group', content: 'Step-by-step guide to joining savings groups...', category: 'Groups', views: 1234, status: 'published', author: 'Admin Team' },
    { id: 3, title: 'Understanding Achievements', content: 'Learn about the achievement system...', category: 'Achievements', views: 890, status: 'published', author: 'Admin Team' },
    { id: 4, title: 'Advanced Goal Strategies', content: 'Tips for maximizing your savings...', category: 'Advanced', views: 456, status: 'draft', author: 'Admin Team' }
  ];

  const tabs = [
    { id: 'achievements', label: 'Achievements', icon: Award, count: achievements.length },
    { id: 'templates', label: 'Goal Templates', icon: Target, count: goalTemplates.length },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.length },
    { id: 'help', label: 'Help Articles', icon: HelpCircle, count: helpArticles.length }
  ];

  const handleAction = (action, itemId) => {
    toast.success(`${action} action performed successfully`);
  };

  const getStatusBadge = (status) => {
    return status === 'active' || status === 'published' 
      ? <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">Active</span>
      : <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full text-xs font-medium">Draft</span>;
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Advanced': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty]}`}>{difficulty}</span>;
  };

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
              <FileText className="w-8 h-8 text-synergy-500" />
              Content Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage platform content, achievements, templates, and help articles
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-synergy-500 to-velocity-500 text-white rounded-lg hover:from-synergy-600 hover:to-velocity-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </motion.button>
          </div>
        </motion.div>

        {/* Content Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Achievements</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{achievements.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+12.5%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Goal Templates</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{goalTemplates.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+8.2%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Notifications</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{notifications.filter(n => n.status === 'active').length}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+15.3%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Help Articles</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{helpArticles.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+5.7%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last month</span>
            </div>
          </div>
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
                <span className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Achievements</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-synergy-500 to-velocity-500 text-white rounded-lg hover:from-synergy-600 hover:to-velocity-600 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{achievement.icon}</span>
                        {getStatusBadge(achievement.status)}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{achievement.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{achievement.description}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <span>{achievement.category}</span>
                        <span>{achievement.usersEarned} users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          onClick={() => handleAction('View', achievement.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          onClick={() => handleAction('Edit', achievement.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-red-400 hover:text-red-600"
                          onClick={() => handleAction('Delete', achievement.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Goal Templates</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-synergy-500 to-velocity-500 text-white rounded-lg hover:from-synergy-600 hover:to-velocity-600 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Template
                  </motion.button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Template</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Difficulty</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {goalTemplates.map((template) => (
                          <motion.tr
                            key={template.id}
                            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-white">{template.name}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{template.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                              {template.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getDifficultyBadge(template.difficulty)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                              {template.usageCount} times
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(template.status)}
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

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-synergy-500 to-velocity-500 text-white rounded-lg hover:from-synergy-600 hover:to-velocity-600 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Notification
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{ x: 5 }}
                      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-synergy-500 to-velocity-500 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{notification.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{notification.type}</p>
                          </div>
                        </div>
                        {getStatusBadge(notification.status)}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">{notification.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Sent to {notification.sentCount} users
                        </span>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'help' && (
              <motion.div
                key="help"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Help Articles</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-synergy-500 to-velocity-500 text-white rounded-lg hover:from-synergy-600 hover:to-velocity-600 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Write Article
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {helpArticles.map((article) => (
                    <motion.div
                      key={article.id}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
                          {article.category}
                        </span>
                        {getStatusBadge(article.status)}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{article.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{article.content}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <span>By {article.author}</span>
                        <span>{article.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminContentPage; 