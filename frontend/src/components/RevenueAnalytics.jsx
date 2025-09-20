import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  Zap,
  Trophy,
  Star,
  Target,
  Activity
} from 'lucide-react';
import { LoopFundButton, LoopFundCard } from './ui';
import useRevenueStore from '../store/useRevenueStore';

const RevenueAnalytics = () => {
  const { analytics, transactions, getRevenueInsights, resetAnalytics } = useRevenueStore();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Revenue insights
  const insights = getRevenueInsights();

  // Calculate growth rate (mock data for demo)
  const growthRate = 15.7; // 15.7% growth this month

  // Chart data for revenue breakdown
  const revenueBreakdown = [
    { label: 'Group Fees', value: analytics.groupFees, color: 'bg-gradient-loopfund' },
    { label: 'Premium Subscriptions', value: analytics.premiumSubscriptions, color: 'bg-gradient-coral' },
    { label: 'One-time Fees', value: analytics.oneTimeFees, color: 'bg-gradient-emerald' }
  ];

  // Filter transactions by period
  const getFilteredTransactions = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => new Date(t.timestamp) >= filterDate);
  };

  const filteredTransactions = getFilteredTransactions();

  // Export data (mock)
  const exportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `loopfund-revenue-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
          <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float-delayed" />
          
          <div className="relative">
            <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Revenue Analytics
            </h2>
            <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Track your business performance and revenue streams
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <LoopFundButton
            onClick={() => setShowDetailedView(!showDetailedView)}
            variant="secondary"
            size="lg"
            icon={showDetailedView ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          >
            {showDetailedView ? 'Simple' : 'Detailed'}
          </LoopFundButton>
          <LoopFundButton
            onClick={exportData}
            variant="gold"
            size="lg"
            icon={<Download className="w-5 h-5" />}
          >
            Export
          </LoopFundButton>
          <LoopFundButton
            onClick={resetAnalytics}
            variant="coral"
            size="lg"
            icon={<RefreshCw className="w-5 h-5" />}
          >
            Reset
          </LoopFundButton>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-2 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl p-1">
        {['week', 'month', 'quarter', 'year'].map((period) => (
          <motion.button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-body text-body font-medium transition-all duration-200 ${
              selectedPeriod === period
                ? 'bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text shadow-loopfund'
                : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-neutral-900 dark:hover:text-loopfund-dark-text'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <LoopFundCard variant="gradient" className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-gold opacity-5 rounded-full blur-xl animate-float" />
            </div>

            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-body-sm text-white/90 font-medium">Total Revenue</p>
                  <p className="font-display text-h2 text-white">${analytics.totalRevenue.toFixed(2)}</p>
                </div>
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <DollarSign className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </div>
          </LoopFundCard>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <LoopFundCard variant="gradient" className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float" />
            </div>

            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-body-sm text-white/90 font-medium">Monthly Revenue</p>
                  <p className="font-display text-h2 text-white">${analytics.monthlyRevenue.toFixed(2)}</p>
                </div>
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </div>
          </LoopFundCard>
        </motion.div>

        {/* Growth Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <LoopFundCard variant="gradient" className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-emerald opacity-5 rounded-full blur-xl animate-float" />
            </div>

            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-body-sm text-white/90 font-medium">Growth Rate</p>
                  <p className="font-display text-h2 text-white">+{growthRate}%</p>
                </div>
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <BarChart3 className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </div>
          </LoopFundCard>
        </motion.div>

        {/* Transaction Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <LoopFundCard variant="gradient" className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-gold opacity-5 rounded-full blur-xl animate-float" />
            </div>

            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-body-sm text-white/90 font-medium">Transactions</p>
                  <p className="font-display text-h2 text-white">{transactions.length}</p>
                </div>
                <motion.div 
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-loopfund"
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

      {/* Revenue Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
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
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className="w-10 h-10 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <PieChart className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Revenue Breakdown
                </h3>
              </div>
              <div className="space-y-4">
                {revenueBreakdown.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">{item.label}</span>
                    </div>
                    <span className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      ${item.value.toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </LoopFundCard>
        </motion.div>

        {/* Insights */}
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
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className="w-10 h-10 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Key Insights
                </h3>
              </div>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl ${
                      insight.type === 'success' ? 'bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 border border-loopfund-emerald-200 dark:border-loopfund-emerald-800' :
                      insight.type === 'warning' ? 'bg-loopfund-gold-50 dark:bg-loopfund-gold-900/20 border border-loopfund-gold-200 dark:border-loopfund-gold-800' :
                      'bg-loopfund-electric-50 dark:bg-loopfund-electric-900/20 border border-loopfund-electric-200 dark:border-loopfund-electric-800'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {insight.title}
                      </h4>
                      <span className={`font-display text-h4 ${
                        insight.type === 'success' ? 'text-loopfund-emerald-600 dark:text-loopfund-emerald-400' :
                        insight.type === 'warning' ? 'text-loopfund-gold-600 dark:text-loopfund-gold-400' :
                        'text-loopfund-electric-600 dark:text-loopfund-electric-400'
                      }`}>
                        {insight.value}
                      </span>
                    </div>
                    <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      {insight.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </LoopFundCard>
        </motion.div>
      </div>

      {/* Transaction History */}
      {showDetailedView && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
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
                  <Activity className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Transaction History ({filteredTransactions.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                      <th className="text-left py-3 px-4 font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                        Description
                      </th>
                      <th className="text-right py-3 px-4 font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <motion.tr 
                        key={transaction.id} 
                        className="border-b border-loopfund-neutral-100 dark:border-loopfund-neutral-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                      >
                        <td className="py-3 px-4 font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full font-body text-body-sm font-medium ${
                            transaction.type === 'group_fee' ? 'bg-loopfund-emerald-100 text-loopfund-emerald-800 dark:bg-loopfund-emerald-900/20 dark:text-loopfund-emerald-400' :
                            transaction.type === 'premium_subscription' ? 'bg-loopfund-lavender-100 text-loopfund-lavender-800 dark:bg-loopfund-lavender-900/20 dark:text-loopfund-lavender-400' :
                            'bg-loopfund-coral-100 text-loopfund-coral-800 dark:bg-loopfund-coral-900/20 dark:text-loopfund-coral-400'
                          }`}>
                            {transaction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          {transaction.description}
                        </td>
                        <td className="py-3 px-4 text-right font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          ${transaction.amount.toFixed(2)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </LoopFundCard>
        </motion.div>
      )}
    </div>
  );
};

export default RevenueAnalytics;