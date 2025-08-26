import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  Settings,
  Lightbulb,
  Zap,
  Calculator
} from 'lucide-react';
import GroupPricingCalculator from '../components/GroupPricingCalculator';
import RevenueAnalytics from '../components/RevenueAnalytics';
import RevenueDemo from '../components/RevenueDemo';
import useRevenueStore from '../store/useRevenueStore';

const RevenueDashboard = () => {
  const { analytics, transactions } = useRevenueStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCalculator, setShowCalculator] = useState(false);

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'calculator', 'analytics', 'insights'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
  };

  // Mock business metrics for demo
  const businessMetrics = {
    totalGroups: 47,
    activeUsers: 892,
    averageGoalAmount: 8750,
    completionRate: 78.5,
    monthlyGrowth: 23.4
  };

  // Revenue projections (mock)
  const projections = {
    nextMonth: analytics.monthlyRevenue * 1.15,
    nextQuarter: analytics.monthlyRevenue * 3.5,
    nextYear: analytics.monthlyRevenue * 12 * 1.25
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'calculator', label: 'Pricing Calculator', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'demo', label: 'Demo', icon: Zap }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Business Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Total Groups</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{businessMetrics.totalGroups}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Active Users</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{businessMetrics.activeUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Avg Goal Amount</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">${businessMetrics.averageGoalAmount.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Completion Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{businessMetrics.completionRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Revenue Projections */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Revenue Projections
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Next Month</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    ${projections.nextMonth.toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    +15% projected growth
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/40 rounded-lg">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Next Quarter</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    ${projections.nextQuarter.toFixed(2)}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Q3 2024 projection
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Next Year</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ${projections.nextYear.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    +25% annual growth
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCalculator(true)}
                  className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Calculate Group Fee</span>
                </button>
                <button
                  onClick={() => handleTabChange('analytics')}
                  className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'calculator':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Group Pricing Calculator
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Calculate fees for new group savings
                </p>
              </div>
              <button
                onClick={() => setShowCalculator(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Close Calculator
              </button>
            </div>
            <GroupPricingCalculator />
          </div>
        );

      case 'analytics':
        return <RevenueAnalytics />;

      case 'insights':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                Revenue Optimization Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    💡 Premium Feature Upselling
                  </h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Your premium features are generating ${analytics.premiumSubscriptions.toFixed(2)} monthly. 
                    Consider promoting group analytics and custom branding more prominently.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    🚀 Group Size Optimization
                  </h4>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Groups with 3-5 members have the highest completion rates. 
                    Consider incentives for optimal group sizes.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                    📊 Revenue Diversification
                  </h4>
                  <p className="text-purple-800 dark:text-purple-200 text-sm">
                    Your revenue is well-diversified across group fees (${analytics.groupFees.toFixed(2)}) 
                    and premium subscriptions (${analytics.premiumSubscriptions.toFixed(2)}).
                  </p>
                </div>
              </div>
            </div>
          </div>
                );

      case 'demo':
        return <RevenueDemo />;
        
        default:
          return null;
      }
    };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Revenue Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor your business performance and revenue streams
              </p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${analytics.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-slate-600 dark:text-slate-400">This Month</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                ${analytics.monthlyRevenue.toFixed(2)}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-slate-600 dark:text-slate-400">Transactions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {transactions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-6">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
