import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  LineChart,
  AreaChart,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Users,
  Crown,
  Target,
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  MoreVertical,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useToast } from '../../context/ToastContext';

const AdminRevenuePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const { toast } = useToast();

  // Mock revenue data
  const revenueData = {
    total: 456789.90,
    monthly: 45678.90,
    weekly: 12345.67,
    daily: 2345.67,
    growth: 23.5,
    subscriptions: 892,
    premiumUsers: 234,
    averageRevenue: 51.23,
    conversionRate: 12.8
  };

  const monthlyData = [
    { month: 'Jan', revenue: 35000, growth: 15.2 },
    { month: 'Feb', revenue: 42000, growth: 20.1 },
    { month: 'Mar', revenue: 38000, growth: -9.5 },
    { month: 'Apr', revenue: 45000, growth: 18.4 },
    { month: 'May', revenue: 52000, growth: 15.6 },
    { month: 'Jun', revenue: 48000, growth: -7.7 },
    { month: 'Jul', revenue: 55000, growth: 14.6 },
    { month: 'Aug', revenue: 58000, growth: 5.5 },
    { month: 'Sep', revenue: 62000, growth: 6.9 },
    { month: 'Oct', revenue: 59000, growth: -4.8 },
    { month: 'Nov', revenue: 65000, growth: 10.2 },
    { month: 'Dec', revenue: 45678, growth: -29.8 }
  ];

  const revenueSources = [
    { source: 'Premium Subscriptions', amount: 234567.89, percentage: 51.3, color: 'bg-blue-500' },
    { source: 'Group Contributions', amount: 123456.78, percentage: 27.0, color: 'bg-green-500' },
    { source: 'Transaction Fees', amount: 56789.12, percentage: 12.4, color: 'bg-purple-500' },
    { source: 'Advertisements', amount: 23456.78, percentage: 5.1, color: 'bg-orange-500' },
    { source: 'Other', amount: 18519.33, percentage: 4.2, color: 'bg-gray-500' }
  ];

  const recentTransactions = [
    { id: 1, user: 'John Doe', type: 'Premium Subscription', amount: 99.99, status: 'completed', date: '2024-01-20' },
    { id: 2, user: 'Jane Smith', type: 'Group Contribution', amount: 250.00, status: 'pending', date: '2024-01-20' },
    { id: 3, user: 'Mike Johnson', type: 'Premium Subscription', amount: 99.99, status: 'completed', date: '2024-01-19' },
    { id: 4, user: 'Sarah Wilson', type: 'Transaction Fee', amount: 5.99, status: 'completed', date: '2024-01-19' },
    { id: 5, user: 'David Brown', type: 'Group Contribution', amount: 150.00, status: 'failed', date: '2024-01-18' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">Completed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full text-xs font-medium">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs font-medium">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 rounded-full text-xs font-medium">Unknown</span>;
    }
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
              <DollarSign className="w-8 h-8 text-synergy-500" />
              Revenue Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Monitor financial performance, track revenue streams, and analyze growth patterns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-synergy-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </motion.button>
          </div>
        </motion.div>

        {/* Revenue Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${revenueData.total.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+{revenueData.growth}%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${revenueData.monthly.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+15.2%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Premium Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{revenueData.premiumUsers}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                <Crown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+12.3%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{revenueData.conversionRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">+2.1%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last month</span>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Revenue Trend Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Revenue Trend
            </h3>
            <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400">Revenue trend chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Revenue Distribution
            </h3>
            <div className="space-y-4">
              {revenueSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${source.color}`}></div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">${source.amount.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{source.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Transactions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{transaction.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white">{transaction.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">${transaction.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {transaction.date}
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
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminRevenuePage; 