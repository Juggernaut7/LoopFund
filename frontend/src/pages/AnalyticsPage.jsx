import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  Building2,
  User,
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';
import analyticsService from '../services/analyticsService';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30');
  const [selectedGoal, setSelectedGoal] = useState('all');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();

  // Analytics data will be fetched from the API

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, selectedGoal]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Fetching analytics for timeRange:', timeRange);
      const response = await analyticsService.getUserAnalytics(timeRange);
      console.log('📊 Analytics response:', response);
      
      if (response.success && response.data) {
        setAnalytics(response.data);
      } else {
        throw new Error('Invalid response format');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      setError(error.message);
      toast.error('Analytics Error', 'Failed to load analytics. Please try again.');
      setIsLoading(false);
    }
  };

  const exportAnalytics = async () => {
    try {
      await analyticsService.exportAnalytics(timeRange, 'json');
      toast.success('Analytics Exported', 'Your analytics data has been exported successfully.');
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast.error('Export Error', 'Failed to export analytics. Please try again.');
    }
  };

  const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading your financial overview...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">Failed to load analytics</p>
            <button 
              onClick={fetchAnalytics} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!analytics) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Your Financial Overview
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Track your savings progress and financial insights
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last Year</option>
                </select>
                
                <button
                  onClick={exportAnalytics}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Saved</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white break-words">
                    ${analytics.summary.totalSaved.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Group Contributions</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white break-words">
                    ${analytics.summary.groupContributions.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <Users className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">{analytics.summary.groupCount} groups</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Solo Savings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white break-words">
                    ${analytics.summary.soloSavings.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <PiggyBank className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">{analytics.summary.soloGoalCount} goals</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <PiggyBank className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Goals</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {analytics.summary.activeGoals}
                  </p>
                  <div className="flex items-center mt-2">
                    <Target className="w-4 h-4 text-purple-500 mr-1" />
                    <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">{analytics.summary.completedGoals} completed</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Savings Trend Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Savings Trend</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Group Savings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Individual Savings</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.savingsTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748B"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748B"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'groupSavings' ? 'Group Savings' : 'Individual Savings']}
                    />
                    <Area
                      type="monotone"
                      dataKey="groupSavings"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="individualSavings"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Goal Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Goal Progress</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {analytics.goalProgress.map((goal, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-white">{goal.name}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{goal.total}%</span>
                    </div>
                    <div className="flex space-x-1 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${goal.completed}%` }}
                        title={`Completed: ${goal.completed}%`}
                      ></div>
                      <div 
                        className="bg-blue-500" 
                        style={{ width: `${goal.progress}%` }}
                        title={`In Progress: ${goal.progress}%`}
                      ></div>
                      <div 
                        className="bg-orange-500" 
                        style={{ width: `${goal.pending}%` }}
                        title={`Pending: ${goal.pending}%`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Top Performers and Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Top Performers</h3>
              <div className="space-y-4">
                {analytics.topPerformers.slice(0, 4).map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        {performer.type === 'group' ? (
                          <Users className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{performer.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {performer.type === 'group' ? `${performer.members} members` : 'Individual Goal'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">${performer.amount.toLocaleString()}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">{performer.progress}% complete</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Performing Groups */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Top Performing Groups</h3>
              <div className="space-y-4">
                {analytics.goalProgress.slice(0, 2).map((group, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-white">{group.name}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">Group Balance</span>
                    </div>
                    <div className="flex space-x-1 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${group.completed}%` }}
                        title={`Completed: ${group.completed}%`}
                      ></div>
                      <div 
                        className="bg-blue-500" 
                        style={{ width: `${group.progress}%` }}
                        title={`In Progress: ${group.progress}%`}
                      ></div>
                      <div 
                        className="bg-orange-500" 
                        style={{ width: `${group.pending}%` }}
                        title={`Pending: ${group.pending}%`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Renewal: {group.progress}%</span>
                      <span>Group: {group.completed}%</span>
                      <span>Balance: {group.pending}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity and Financial Projections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity Feed</h3>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        {activity.type === 'contribution' ? (
                          <DollarSign className="w-4 h-4 text-white" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{activity.goal}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {activity.type === 'contribution' ? 'Contribution' : 'Goal Completed'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white">${activity.amount.toLocaleString()}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </button>
              </div>
            </motion.div>

            {/* Financial Projections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Financial Projections</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Projected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Actual</span>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.financialProjections}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748B"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748B"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'projected' ? 'Projected' : 'Actual']}
                    />
                    <Line
                      type="monotone"
                      dataKey="projected"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;