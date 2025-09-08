import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard,
  Calendar,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import api from '../../services/api';

const AdminRevenuePage = () => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    averageAmount: 0,
    revenueByType: []
  });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // 7, 30, 90, all
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchRevenueData();
    fetchTransactions();
  }, [dateRange, selectedType]);

  const fetchRevenueData = async () => {
    try {
      const response = await api.get(`/admin/revenue?days=${dateRange}`);
      if (response.data.success) {
        setRevenueData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (dateRange !== 'all') params.append('days', dateRange);
      if (selectedType !== 'all') params.append('type', selectedType);
      
      const response = await api.get(`/admin/transactions?${params.toString()}`);
      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Reference', 'User', 'Type', 'Amount', 'Status', 'Description'],
      ...transactions.map(t => [
        formatDate(t.createdAt),
        t.reference,
        t.userId?.email || 'N/A',
        t.type,
        formatCurrency(t.amount),
        t.status,
        t.metadata?.groupName || t.metadata?.description || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-dark-bg dark:to-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Revenue Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Track your earnings and payment transactions
          </p>
        </motion.div>

        {/* Revenue Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Revenue */}
          <div className="glass-card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(revenueData.totalRevenue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full">
                <DollarSign className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {revenueData.totalTransactions}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                <CreditCard className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          {/* Average Amount */}
          <div className="glass-card p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Average Amount
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(revenueData.averageAmount)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="glass-card p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Revenue Growth
                </p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  +12.5%
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                <Users className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue by Type Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Revenue by Type
          </h3>
          <div className="space-y-4">
            {revenueData.revenueByType.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300 capitalize">
                    {item._id.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {formatCurrency(item.totalRevenue)}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {item.totalTransactions} transactions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
        >
          <div className="flex items-center space-x-4">
            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-neutral-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-gray-800 text-neutral-900 dark:text-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-neutral-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-gray-800 text-neutral-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="group_creation">Group Creation</option>
                <option value="premium_upgrade">Premium Upgrade</option>
                <option value="challenge_access">Challenge Access</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={exportTransactions}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Recent Transactions
            </h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-neutral-500">Loading transactions...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-neutral-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-neutral-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-white">
                        {transaction.userId?.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 capitalize">
                          {transaction.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900 dark:text-white">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {transactions.length === 0 && (
                <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                  No transactions found for the selected filters.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRevenuePage; 