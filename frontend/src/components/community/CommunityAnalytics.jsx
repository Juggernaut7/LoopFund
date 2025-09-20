import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Eye,
  Calendar,
  Target,
  Award,
  Activity,
  Clock,
  Star,
  Flame,
  Trophy,
  Gift,
  Zap,
  Lightbulb,
  Heart as HeartIcon,
  Smile,
  Frown,
  Meh,
  ArrowUp,
  ArrowDown,
  Minus,
  PieChart,
  LineChart,
  BarChart,
  RefreshCw,
  Sparkles,
  Crown
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { LoopFundButton, LoopFundCard } from '../ui';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';

const CommunityAnalytics = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load engagement analytics
      const engagementResponse = await communityService.getEngagementAnalytics(period);
      const emotionalResponse = await communityService.getEmotionalTrends(period);
      const healthResponse = await communityService.getCommunityHealthMetrics();
      
      if (engagementResponse.success && emotionalResponse.success && healthResponse.success) {
        setAnalytics({
          engagement: engagementResponse.data,
          emotional: emotionalResponse.data,
          health: healthResponse.data
        });
      } else {
        // Set fallback data with real structure but empty values
        setAnalytics({
          engagement: {
            totalPosts: 0,
            totalLikes: 0,
            totalComments: 0,
            totalViews: 0,
            dailyActivity: [],
            topCategories: [],
            topPosts: []
          },
          emotional: {
            moodDistribution: [],
            sentimentTrends: [],
            emotionalInsights: []
          },
          health: {
            communityScore: 0,
            growthRate: 0,
            engagementRate: 0,
            retentionRate: 0
          }
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Set fallback data on error
      setAnalytics({
        engagement: {
          totalPosts: 0,
          totalLikes: 0,
          totalComments: 0,
          totalViews: 0,
          dailyActivity: [],
          topCategories: [],
          topPosts: []
        },
        emotional: {
          moodDistribution: [],
          sentimentTrends: [],
          emotionalInsights: []
        },
        health: {
          communityScore: 0,
          growthRate: 0,
          engagementRate: 0,
          retentionRate: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: '90d', name: 'Last 90 Days' },
    { id: '1y', name: 'Last Year' }
  ];

  const metrics = [
    { id: 'engagement', name: 'Engagement', icon: Activity, color: 'bg-gradient-loopfund' },
    { id: 'emotional', name: 'Emotional Trends', icon: HeartIcon, color: 'bg-gradient-coral' },
    { id: 'health', name: 'Community Health', icon: TrendingUp, color: 'bg-gradient-emerald' }
  ];

  const getMoodIcon = (mood) => {
    const moodIcons = {
      'excited': '😃',
      'hopeful': '🤗',
      'stressed': '😰',
      'frustrated': '😤',
      'proud': '😌',
      'anxious': '😟',
      'grateful': '🙏',
      'determined': '💪'
    };
    return moodIcons[mood] || '😊';
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      'excited': 'text-loopfund-emerald-600',
      'hopeful': 'text-loopfund-electric-600',
      'stressed': 'text-loopfund-coral-600',
      'frustrated': 'text-loopfund-orange-600',
      'proud': 'text-loopfund-lavender-600',
      'anxious': 'text-loopfund-gold-600',
      'grateful': 'text-loopfund-mint-600',
      'determined': 'text-loopfund-electric-600'
    };
    return moodColors[mood] || 'text-loopfund-neutral-600';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getPercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <motion.div
            className="w-12 h-12 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <BarChart3 className="w-6 h-6 text-white" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
      <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            {/* Background Elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float-delayed" />
            
            <div className="relative">
              <h1 className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                Community Analytics
              </h1>
              <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Insights into community engagement, emotional trends, and health metrics
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-body"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            
            <LoopFundButton
              onClick={loadAnalytics}
              variant="primary"
              size="lg"
              icon={<RefreshCw className="w-5 h-5" />}
            >
              Refresh
            </LoopFundButton>
          </div>
        </div>

        {/* Metric Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 ${
                  selectedMetric === metric.id
                    ? 'bg-loopfund-emerald-100 text-loopfund-emerald-700 border border-loopfund-emerald-200 dark:bg-loopfund-emerald-900/20 dark:text-loopfund-emerald-300 dark:border-loopfund-emerald-800'
                    : 'bg-loopfund-neutral-100 text-loopfund-neutral-700 hover:bg-loopfund-neutral-200 dark:bg-loopfund-dark-elevated dark:text-loopfund-neutral-300 dark:hover:bg-loopfund-dark-surface'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-8 h-8 ${metric.color} rounded-lg flex items-center justify-center shadow-loopfund`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-body text-body font-medium">{metric.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Engagement Analytics */}
      {selectedMetric === 'engagement' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-loopfund opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Posts</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {formatNumber(analytics?.engagement?.totalPosts || 0)}
                      </p>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <MessageCircle className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Likes</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {formatNumber(analytics?.engagement?.totalLikes || 0)}
                      </p>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Heart className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-emerald opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Comments</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {formatNumber(analytics?.engagement?.totalComments || 0)}
                      </p>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-loopfund"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <MessageCircle className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-lavender opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Views</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {formatNumber(analytics?.engagement?.totalViews || 0)}
                      </p>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-lavender rounded-2xl flex items-center justify-center shadow-loopfund"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Eye className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          </div>

          {/* Daily Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Activity className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Daily Activity Trend</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.engagement?.dailyActivity || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748B"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="posts" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Posts" />
                      <Area type="monotone" dataKey="likes" stackId="2" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Likes" />
                      <Area type="monotone" dataKey="comments" stackId="3" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Comments" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Top Categories Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <BarChart3 className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Top Categories</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={analytics?.engagement?.topCategories?.slice(0, 5) || []} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis type="number" stroke="#64748B" fontSize={12} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="#64748B" 
                        fontSize={12}
                        tickFormatter={(value) => value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        labelFormatter={(value) => value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      />
                      <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
        </div>
      )}

      {/* Emotional Trends */}
      {selectedMetric === 'emotional' && (
        <div className="space-y-6">
          {/* Mood Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float" />
              </div>

              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <HeartIcon className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Mood Distribution</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analytics?.emotional?.moodDistribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ mood, percent }) => `${mood} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {(analytics?.emotional?.moodDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value, name, props) => [
                          `${value} posts`,
                          props.payload.mood.charAt(0).toUpperCase() + props.payload.mood.slice(1)
                        ]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Sentiment Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-lavender opacity-5 rounded-full blur-xl animate-float" />
              </div>

              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-lavender rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <TrendingUp className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Sentiment Trends</h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={analytics?.emotional?.sentimentTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748B"
                        fontSize={12}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={3} name="Positive" />
                      <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={3} name="Negative" />
                      <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={3} name="Neutral" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Emotional Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-mint opacity-5 rounded-full blur-xl animate-float" />
              </div>

              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-mint rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Lightbulb className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Emotional Insights</h3>
                </div>
                <div className="space-y-4">
                  {analytics?.emotional?.emotionalInsights?.map((insight, index) => (
                    <motion.div 
                      key={index} 
                      className="p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-loopfund rounded-lg flex items-center justify-center flex-shrink-0 shadow-loopfund">
                          <Lightbulb className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-1">
                            {insight.title}
                          </p>
                          <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )) || (
                    <div className="text-center py-8">
                      <p className="font-body text-body text-loopfund-neutral-500 dark:text-loopfund-neutral-400">No emotional insights available</p>
                    </div>
                  )}
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
        </div>
      )}

      {/* Community Health */}
      {selectedMetric === 'health' && (
        <div className="space-y-6">
          {/* Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-emerald opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Community Score</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {analytics?.health?.communityScore || 0}/100
                      </p>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-loopfund"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Trophy className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-loopfund opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Growth Rate</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {analytics?.health?.growthRate || 0}%
                      </p>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <TrendingUp className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-lavender opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Engagement Rate</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {analytics?.health?.engagementRate || 0}%
                      </p>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-lavender rounded-2xl flex items-center justify-center shadow-loopfund"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Activity className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <LoopFundCard variant="elevated" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float" />
                </div>

                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Retention Rate</p>
                      <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {analytics?.health?.retentionRate || 0}%
                      </p>
                    </div>
                    <motion.div 
                      className="w-12 h-12 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          </div>

          {/* Health Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LoopFundCard variant="gradient" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-gold opacity-5 rounded-full blur-xl animate-float" />
              </div>

              <div className="relative p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Crown className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="font-display text-h3 text-white">Community Health Summary</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-emerald rounded-lg flex items-center justify-center shadow-loopfund">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-body text-body font-medium text-white">
                          Community is growing and engaging well
                        </p>
                        <p className="font-body text-body-sm text-white/90">
                          Members are actively participating and supporting each other
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CommunityAnalytics;