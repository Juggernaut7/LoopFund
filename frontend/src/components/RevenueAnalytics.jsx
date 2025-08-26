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
  EyeOff
} from 'lucide-react';
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
    { label: 'Group Fees', value: analytics.groupFees, color: 'from-blue-500 to-blue-600' },
    { label: 'Premium Subscriptions', value: analytics.premiumSubscriptions, color: 'from-purple-500 to-purple-600' },
    { label: 'One-time Fees', value: analytics.oneTimeFees, color: 'from-green-500 to-green-600' }
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
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Revenue Analytics
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Track your business performance and revenue streams
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {showDetailedView ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showDetailedView ? 'Simple' : 'Detailed'}</span>
          </button>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={resetAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
        {['week', 'month', 'quarter', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === period
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Monthly Revenue</p>
              <p className="text-3xl font-bold">${analytics.monthlyRevenue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        {/* Growth Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Growth Rate</p>
              <p className="text-3xl font-bold">+{growthRate}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        {/* Transaction Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Transactions</p>
              <p className="text-3xl font-bold">{transactions.length}</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Revenue Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 text-blue-500 mr-2" />
            Revenue Breakdown
          </h3>
          <div className="space-y-4">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color}`}></div>
                  <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ${item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Key Insights
          </h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  insight.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                  insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                  'bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <span className={`text-lg font-bold ${
                    insight.type === 'success' ? 'text-green-600 dark:text-green-400' :
                    insight.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-blue-600 dark:text-blue-400'
                  }`}>
                    {insight.value}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {showDetailedView && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Transaction History ({filteredTransactions.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'group_fee' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        transaction.type === 'premium_subscription' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {transaction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                      {transaction.description}
                    </td>
                    <td className="py-3 px-4 text-right text-sm font-semibold text-slate-900 dark:text-white">
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RevenueAnalytics;
