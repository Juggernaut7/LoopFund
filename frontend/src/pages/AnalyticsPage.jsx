import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Banknote, 
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
  EyeOff,
  Sparkles,
  Crown,
  Zap,
  Trophy,
  Star
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
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';
import analyticsService from '../services/analyticsService';
import { formatCurrencySimple } from '../utils/currency';

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

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Loading state
  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-loopfund rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BarChart3 className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Loading Your Financial Overview
            </h3>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Analyzing your savings progress and financial insights...
            </p>
          </motion.div>
        </div>
    );
  }

  // Error state
  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20 rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <AlertCircle className="w-10 h-10 text-loopfund-coral-600" />
            </motion.div>
            <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
              Failed to Load Analytics
            </h2>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              {error}
            </p>
            <LoopFundButton
              onClick={fetchAnalytics}
              variant="primary"
              size="lg"
              icon={<BarChart3 className="w-5 h-5" />}
            >
              Try Again
            </LoopFundButton>
          </motion.div>
        </div>
    );
  }

  if (!analytics) return null;

  return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="relative">
                {/* Background Elements */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
                <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float-delayed" />
                
                <div className="relative">
                  <h1 className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                    Your Financial Overview
                  </h1>
                  <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Track your savings progress and financial insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors font-body text-body"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last Year</option>
                </select>
                
                <LoopFundButton
                  onClick={exportAnalytics}
                  variant="gold"
                  size="lg"
                  icon={<Download className="w-5 h-5" />}
                >
                  Export Data
                </LoopFundButton>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-emerald opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-2">Total Saved</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text break-words">
                        {formatCurrencySimple(analytics.summary.totalSaved)}
                      </p>
                      <div className="flex items-center mt-3">
                        <ArrowUpRight className="w-4 h-4 text-loopfund-emerald-500 mr-1" />
                        <span className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium">+12.5%</span>
                      </div>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-loopfund flex-shrink-0 ml-3"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Banknote className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-2">Group Contributions</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text break-words">
                        {formatCurrencySimple(analytics.summary.groupContributions)}
                      </p>
                      <div className="flex items-center mt-3">
                        <Users className="w-4 h-4 text-loopfund-coral-500 mr-1" />
                        <span className="font-body text-body-sm text-loopfund-coral-600 dark:text-loopfund-coral-400 font-medium">{analytics.summary.groupCount} groups</span>
                      </div>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund flex-shrink-0 ml-3"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-gold opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-2">Solo Savings</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text break-words">
                        {formatCurrencySimple(analytics.summary.soloSavings)}
                      </p>
                      <div className="flex items-center mt-3">
                        <PiggyBank className="w-4 h-4 text-loopfund-gold-500 mr-1" />
                        <span className="font-body text-body-sm text-loopfund-gold-600 dark:text-loopfund-gold-400 font-medium">{analytics.summary.soloGoalCount} goals</span>
                      </div>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-loopfund flex-shrink-0 ml-3"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <PiggyBank className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-electric opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-2">Active Goals</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {analytics.summary.activeGoals}
                      </p>
                      <div className="flex items-center mt-3">
                        <Target className="w-4 h-4 text-loopfund-electric-500 mr-1" />
                        <span className="font-body text-body-sm text-loopfund-electric-600 dark:text-loopfund-electric-400 font-medium">{analytics.summary.completedGoals} completed</span>
                      </div>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-electric rounded-2xl flex items-center justify-center shadow-loopfund flex-shrink-0 ml-3"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Target className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Savings Trend Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-loopfund opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <TrendingUp className="w-5 h-5 text-white" />
                      </motion.div>
                      <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Savings Trend</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-emerald-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Group Savings</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-coral-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Individual Savings</span>
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
                          tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value, name) => [`₦${value.toLocaleString()}`, name === 'groupSavings' ? 'Group Savings' : 'Individual Savings']}
                        />
                        <Area
                          type="monotone"
                          dataKey="groupSavings"
                          stackId="1"
                          stroke="#10B981"
                          fill="#10B981"
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
                </div>
              </LoopFundCard>
            </motion.div>

            {/* Goal Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Target className="w-5 h-5 text-white" />
                      </motion.div>
                      <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Goal Progress</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-emerald-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Completed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-electric-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Progress</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-gold-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Pending</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {analytics.goalProgress.map((goal, index) => (
                      <motion.div 
                        key={index} 
                        className="space-y-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">{goal.name}</span>
                          <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">{goal.total}%</span>
                        </div>
                        <div className="flex space-x-1 h-3 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-loopfund-emerald-500" 
                            style={{ width: `${goal.completed}%` }}
                            title={`Completed: ${goal.completed}%`}
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.completed}%` }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                          />
                          <motion.div 
                            className="bg-loopfund-electric-500" 
                            style={{ width: `${goal.progress}%` }}
                            title={`In Progress: ${goal.progress}%`}
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                          />
                          <motion.div 
                            className="bg-loopfund-gold-500" 
                            style={{ width: `${goal.pending}%` }}
                            title={`Pending: ${goal.pending}%`}
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.pending}%` }}
                            transition={{ delay: 1.0 + index * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          </div>

          {/* Top Performers and Groups */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-gold opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <motion.div 
                      className="w-10 h-10 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-loopfund"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Trophy className="w-5 h-5 text-white" />
                    </motion.div>
                    <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Top Performers</h3>
                  </div>
                  <div className="space-y-4">
                    {analytics.topPerformers.slice(0, 4).map((performer, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center justify-between p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            className="w-10 h-10 bg-gradient-loopfund rounded-xl flex items-center justify-center shadow-loopfund"
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            {performer.type === 'group' ? (
                              <Users className="w-5 h-5 text-white" />
                            ) : (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </motion.div>
                          <div>
                            <p className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">{performer.name}</p>
                            <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                              {performer.type === 'group' ? `${performer.members} members` : 'Individual Goal'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">{formatCurrencySimple(performer.amount)}</p>
                          <p className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400">{performer.progress}% complete</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            {/* Top Performing Groups */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-electric opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <motion.div 
                      className="w-10 h-10 bg-gradient-electric rounded-2xl flex items-center justify-center shadow-loopfund"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Star className="w-5 h-5 text-white" />
                    </motion.div>
                    <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Top Performing Groups</h3>
                  </div>
                  <div className="space-y-4">
                    {analytics.goalProgress.slice(0, 2).map((group, index) => (
                      <motion.div 
                        key={index} 
                        className="space-y-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">{group.name}</span>
                          <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Group Balance</span>
                        </div>
                        <div className="flex space-x-1 h-3 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-loopfund-emerald-500" 
                            style={{ width: `${group.completed}%` }}
                            title={`Completed: ${group.completed}%`}
                            initial={{ width: 0 }}
                            animate={{ width: `${group.completed}%` }}
                            transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                          />
                          <motion.div 
                            className="bg-loopfund-electric-500" 
                            style={{ width: `${group.progress}%` }}
                            title={`In Progress: ${group.progress}%`}
                            initial={{ width: 0 }}
                            animate={{ width: `${group.progress}%` }}
                            transition={{ delay: 1.0 + index * 0.1, duration: 0.8 }}
                          />
                          <motion.div 
                            className="bg-loopfund-gold-500" 
                            style={{ width: `${group.pending}%` }}
                            title={`Pending: ${group.pending}%`}
                            initial={{ width: 0 }}
                            animate={{ width: `${group.pending}%` }}
                            transition={{ delay: 1.1 + index * 0.1, duration: 0.8 }}
                          />
                        </div>
                        <div className="flex justify-between font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          <span>Renewal: {group.progress}%</span>
                          <span>Group: {group.completed}%</span>
                          <span>Balance: {group.pending}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          </div>

          {/* Recent Activity and Financial Projections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-lavender opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-lavender rounded-2xl flex items-center justify-center shadow-loopfund"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Activity className="w-5 h-5 text-white" />
                      </motion.div>
                      <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Recent Activity Feed</h3>
                    </div>
                    <motion.button 
                      className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-xl transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                    </motion.button>
                  </div>
                  
                  <div className="space-y-4">
                    {analytics.recentActivity.map((activity, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            className="w-8 h-8 bg-gradient-loopfund rounded-lg flex items-center justify-center shadow-loopfund"
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            {activity.type === 'contribution' ? (
                              <Banknote className="w-4 h-4 text-white" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </motion.div>
                          <div>
                            <p className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">{activity.goal}</p>
                            <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                              {activity.type === 'contribution' ? 'Contribution' : 'Goal Completed'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">{formatCurrencySimple(activity.amount)}</p>
                          <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                    <LoopFundButton
                      variant="gold"
                      size="lg"
                      icon={<Download className="w-5 h-5" />}
                      className="w-full"
                    >
                      Export Data
                    </LoopFundButton>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            {/* Financial Projections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-mint opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-mint rounded-2xl flex items-center justify-center shadow-loopfund"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <TrendingUp className="w-5 h-5 text-white" />
                      </motion.div>
                      <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Financial Projections</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-electric-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Projected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-emerald-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Actual</span>
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
                          tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value, name) => [`₦${value.toLocaleString()}`, name === 'projected' ? 'Projected' : 'Actual']}
                        />
                        <Line
                          type="monotone"
                          dataKey="projected"
                          stroke="#06B6D4"
                          strokeWidth={3}
                          dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2 }}
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
                </div>
              </LoopFundCard>
            </motion.div>
          </div>
        </div>
      </div>
  );
};

export default AnalyticsPage;