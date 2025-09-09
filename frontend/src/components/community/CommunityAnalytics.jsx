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
  RefreshCw
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
    { id: 'engagement', name: 'Engagement', icon: Activity, color: 'bg-blue-500' },
    { id: 'emotional', name: 'Emotional Trends', icon: HeartIcon, color: 'bg-pink-500' },
    { id: 'health', name: 'Community Health', icon: TrendingUp, color: 'bg-green-500' }
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
      'excited': 'text-green-600',
      'hopeful': 'text-blue-600',
      'stressed': 'text-red-600',
      'frustrated': 'text-orange-600',
      'proud': 'text-purple-600',
      'anxious': 'text-yellow-600',
      'grateful': 'text-teal-600',
      'determined': 'text-indigo-600'
    };
    return moodColors[mood] || 'text-gray-600';
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Community Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Insights into community engagement, emotional trends, and health metrics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Metric Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedMetric === metric.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Icon size={16} />
                <span>{metric.name}</span>
              </button>
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
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(analytics?.engagement?.totalPosts || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(analytics?.engagement?.totalLikes || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(analytics?.engagement?.totalComments || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(analytics?.engagement?.totalViews || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Daily Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Activity Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.engagement?.dailyActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="posts" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Posts" />
                  <Area type="monotone" dataKey="likes" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Likes" />
                  <Area type="monotone" dataKey="comments" stackId="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Comments" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Categories Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Categories</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={analytics?.engagement?.topCategories?.slice(0, 5) || []} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#6B7280" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#6B7280" 
                    fontSize={12}
                    tickFormatter={(value) => value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    labelFormatter={(value) => value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
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
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mood Distribution</h3>
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
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value, name, props) => [
                      `${value} posts`,
                      props.payload.mood.charAt(0).toUpperCase() + props.payload.mood.slice(1)
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Sentiment Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sentiment Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={analytics?.emotional?.sentimentTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
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
          </motion.div>

          {/* Emotional Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Emotional Insights</h3>
            <div className="space-y-4">
              {analytics?.emotional?.emotionalInsights?.map((insight, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {insight.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No emotional insights available</p>
                </div>
              )}
            </div>
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
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Community Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics?.health?.communityScore || 0}/100
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics?.health?.growthRate || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics?.health?.engagementRate || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics?.health?.retentionRate || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Health Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Community Health Summary</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-200">
                      Community is growing and engaging well
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Members are actively participating and supporting each other
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CommunityAnalytics;