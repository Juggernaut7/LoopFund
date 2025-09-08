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
  Minus
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';

const CommunityAnalytics = () => {
  const { user } = useAuthStore();
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
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
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
    { id: 'emotional', name: 'Emotional Trends', icon: HeartIcon, color: 'bg-purple-500' },
    { id: 'health', name: 'Community Health', icon: TrendingUp, color: 'bg-green-500' }
  ];

  const getMetricIcon = (metric) => {
    const met = metrics.find(m => m.id === metric);
    return met ? met.icon : Activity;
  };

  const getMetricColor = (metric) => {
    const met = metrics.find(m => m.id === metric);
    return met ? met.color : 'bg-gray-500';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'excited': return <Smile className="w-5 h-5 text-green-600" />;
      case 'stressed': return <Frown className="w-5 h-5 text-red-600" />;
      case 'neutral': return <Meh className="w-5 h-5 text-yellow-600" />;
      default: return <Smile className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Community Analytics
              </h1>
              <p className="text-gray-600">
                Insights into community engagement, emotional trends, and overall health
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Metric Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex flex-wrap gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedMetric === metric.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{metric.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Engagement Analytics */}
        {selectedMetric === 'engagement' && analytics?.engagement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.engagement.totalPosts?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {getTrendIcon(analytics.engagement.postsTrend || 0)}
                  <span className={`text-sm ml-1 ${getTrendColor(analytics.engagement.postsTrend || 0)}`}>
                    {Math.abs(analytics.engagement.postsTrend || 0)}% from last period
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.engagement.activeUsers?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {getTrendIcon(analytics.engagement.usersTrend || 0)}
                  <span className={`text-sm ml-1 ${getTrendColor(analytics.engagement.usersTrend || 0)}`}>
                    {Math.abs(analytics.engagement.usersTrend || 0)}% from last period
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Interactions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.engagement.totalInteractions?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {getTrendIcon(analytics.engagement.interactionsTrend || 0)}
                  <span className={`text-sm ml-1 ${getTrendColor(analytics.engagement.interactionsTrend || 0)}`}>
                    {Math.abs(analytics.engagement.interactionsTrend || 0)}% from last period
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Session Time</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.engagement.avgSessionTime || 0}m
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {getTrendIcon(analytics.engagement.sessionTimeTrend || 0)}
                  <span className={`text-sm ml-1 ${getTrendColor(analytics.engagement.sessionTimeTrend || 0)}`}>
                    {Math.abs(analytics.engagement.sessionTimeTrend || 0)}% from last period
                  </span>
                </div>
              </div>
            </div>

            {/* Engagement Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Categories</h3>
                <div className="space-y-3">
                  {analytics.engagement.categoryBreakdown?.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
                <div className="space-y-3">
                  {analytics.engagement.userActivity?.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{activity.type}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{activity.count}</span>
                        <span className="text-xs text-gray-500">users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Emotional Trends */}
        {selectedMetric === 'emotional' && analytics?.emotional && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Mood Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.emotional.moodDistribution?.map((mood, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      {getMoodIcon(mood.name)}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{mood.name}</p>
                    <p className="text-lg font-bold text-gray-900">{mood.percentage}%</p>
                    <p className="text-xs text-gray-500">{mood.count} posts</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emotional Trends Over Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Levels</h3>
                <div className="space-y-3">
                  {analytics.emotional.stressTrends?.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{trend.period}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${trend.level}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{trend.level}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotional Spending</h3>
                <div className="space-y-3">
                  {analytics.emotional.spendingTriggers?.map((trigger, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{trigger.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">${trigger.amount}</span>
                        <span className="text-xs text-gray-500">avg</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Community Health */}
        {selectedMetric === 'health' && analytics?.health && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Health Score */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Community Health</h3>
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {analytics.health.overallScore || 0}
                      </div>
                      <div className="text-sm text-gray-600">out of 100</div>
                    </div>
                  </div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-transparent"
                    style={{
                      borderTopColor: '#10B981',
                      transform: 'rotate(-90deg)',
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                      background: `conic-gradient(#10B981 ${(analytics.health.overallScore || 0) * 3.6}deg, transparent 0deg)`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Support Quality</h4>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.health.supportQuality || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Positive interactions</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Activity Level</h4>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.health.activityLevel || 0}%
                  </div>
                  <p className="text-sm text-gray-600">Daily active users</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Retention Rate</h4>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analytics.health.retentionRate || 0}%
                  </div>
                  <p className="text-sm text-gray-600">30-day retention</p>
                </div>
              </div>
            </div>

            {/* Health Trends */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Trends</h3>
              <div className="space-y-4">
                {analytics.health.trends?.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{trend.metric}</p>
                      <p className="text-sm text-gray-600">{trend.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(trend.change)}
                      <span className={`text-sm font-medium ${getTrendColor(trend.change)}`}>
                        {Math.abs(trend.change)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommunityAnalytics; 
