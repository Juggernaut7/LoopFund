import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Calendar,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Loader,
  AlertCircle,
  Download,
  Filter,
  Calendar as CalendarIcon,
  CheckCircle
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedGoal, setSelectedGoal] = useState('all');
  const { toast } = useToast();

  // Fetch analytics data on component mount
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, selectedGoal]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch goals and contributions for analytics
      const [goalsResponse, profileResponse] = await Promise.all([
        dashboardService.getUserGoals(),
        dashboardService.getUserProfile()
      ]);
      
      const goals = goalsResponse.data || [];
      const allContributions = [];
      
      // Fetch contributions for all goals
      for (const goal of goals) {
        try {
          const contribResponse = await dashboardService.getGoalContributions(goal._id);
          const goalContributions = contribResponse.data || [];
          allContributions.push(...goalContributions.map(c => ({ ...c, goalName: goal.name, goalId: goal._id })));
        } catch (error) {
          console.log(`No contributions for goal: ${goal.name}`);
        }
      }
      
      // Calculate analytics
      const analyticsData = calculateAnalytics(goals, allContributions, timeRange);
      setAnalytics(analyticsData);
      
      console.log('Analytics calculated:', analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message);
      toast.error('Analytics Error', 'Failed to load analytics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (goals, contributions, range) => {
    const now = new Date();
    let startDate = new Date();
    
    // Calculate start date based on time range
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Filter contributions by date range
    const filteredContributions = contributions.filter(c => 
      new Date(c.createdAt) >= startDate
    );

    // Filter by selected goal if not 'all'
    const goalFilteredContributions = selectedGoal === 'all' 
      ? filteredContributions 
      : filteredContributions.filter(c => c.goalId === selectedGoal);

    // Calculate totals
    const totalContributed = goalFilteredContributions.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status !== 'completed').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;

    // Calculate contribution trends
    const contributionTrends = calculateContributionTrends(goalFilteredContributions, startDate, now);
    
    // Calculate goal progress
    const goalProgress = goals.map(goal => ({
      name: goal.name,
      current: goal.currentAmount || 0,
      target: goal.targetAmount || 0,
      percentage: goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0,
      isGroupGoal: goal.isGroupGoal || false
    }));

    // Calculate savings rate
    const savingsRate = calculateSavingsRate(goalFilteredContributions, range);

    return {
      summary: {
        totalContributed,
        totalGoals,
        activeGoals,
        completedGoals,
        savingsRate
      },
      trends: contributionTrends,
      goalProgress,
      contributions: goalFilteredContributions,
      timeRange: range
    };
  };

  const calculateContributionTrends = (contributions, startDate, endDate) => {
    const trends = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const dayContributions = contributions.filter(c => 
        c.createdAt && c.createdAt.split('T')[0] === dateStr
      );
      
      trends.push({
        date: dateStr,
        amount: dayContributions.reduce((sum, c) => sum + (c.amount || 0), 0),
        count: dayContributions.length
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return trends;
  };

  const calculateSavingsRate = (contributions, range) => {
    if (contributions.length === 0) return 0;
    
    const totalAmount = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
    const days = range === 'week' ? 7 : range === 'month' ? 30 : range === 'quarter' ? 90 : 365;
    
    return (totalAmount / days).toFixed(2);
  };

  const exportAnalytics = () => {
    try {
      const data = {
        analytics: analytics,
        exportDate: new Date().toISOString(),
        timeRange: timeRange
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loopfund-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Analytics Exported', 'Your analytics data has been exported successfully.');
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast.error('Export Error', 'Failed to export analytics. Please try again.');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading your analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Analytics & Insights
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Track your savings progress and financial insights
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            
            <button
              onClick={exportAnalytics}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Contributed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${analytics.summary.totalContributed.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Goals</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analytics.summary.activeGoals}
                </p>
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
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Completed Goals</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {analytics.summary.completedGoals}
                </p>
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
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Daily Savings Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${analytics.summary.savingsRate}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contribution Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Contribution Trends
            </h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {analytics.trends.slice(-7).map((trend, index) => (
                <div key={trend.date} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                    style={{ 
                      height: `${Math.max((trend.amount / Math.max(...analytics.trends.map(t => t.amount))) * 200, 4)}px` 
                    }}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Goal Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Goal Progress
            </h3>
            <div className="space-y-4">
              {analytics.goalProgress.slice(0, 5).map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {goal.name}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {goal.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>${goal.current.toLocaleString()}</span>
                    <span>${goal.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Contributions
          </h3>
          <div className="space-y-3">
            {analytics.contributions.slice(0, 10).map((contribution, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      ${contribution.amount?.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {contribution.goalName || 'Unknown Goal'}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(contribution.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage; 