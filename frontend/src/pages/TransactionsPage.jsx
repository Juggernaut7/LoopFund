import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { LoopFundCard, LoopFundButton, LoopFundInput } from '../components/ui';
import { formatCurrencySimple } from '../utils/currency';
import transactionService from '../services/transactionService';
import { useToast } from '../context/ToastContext';

const TransactionsPage = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    type: '',
    status: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getUserTransactions(filters);
      if (response.success) {
        setTransactions(response.data.transactions || []);
        setPagination(response.data.pagination || {});
      } else {
        setTransactions([]);
        setPagination({});
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
      setTransactions([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await transactionService.getTransactionStats('30');
      if (response.success) {
        setStats(response.data);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const response = await transactionService.getTransactionAnalytics('30');
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setAnalytics(null);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(null);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchStats();
    fetchAnalytics();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      type: '',
      status: '',
      paymentMethod: '',
      startDate: '',
      endDate: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  // Export transactions
  const handleExport = async () => {
    try {
      await transactionService.exportTransactions(filters);
      toast.success('Transactions exported successfully');
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error('Failed to export transactions');
    }
  };

  // View transaction details
  const viewTransactionDetails = async (transactionId) => {
    try {
      const response = await transactionService.getTransactionById(transactionId);
      if (response.success) {
        setSelectedTransaction(response.data);
        setShowTransactionDetails(true);
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      toast.error('Failed to fetch transaction details');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status icon
  const getStatusIcon = (status) => {
    if (!status) return <AlertCircle className="w-4 h-4" />;
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Revolutionary Header */}
          <motion.div 
            className="relative mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Transaction History
                </motion.h1>
                <motion.p 
                  className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Track all your financial activities and payment history
                </motion.p>
              </div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-right">
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Total Transactions
                  </p>
                  <p className="font-display text-h4 text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
                    {stats?.summary?.totalTransactions || 0}
                  </p>
                </div>
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CreditCard className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Revolutionary Transaction Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Total Transactions</p>
                    <p className="font-display text-h3 text-loopfund-neutral-900">
                      {stats?.summary?.totalTransactions || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-loopfund-emerald-100 rounded-full">
                    <CreditCard className="w-6 h-6 text-loopfund-emerald-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Total Amount</p>
                    <p className="font-display text-h3 text-loopfund-coral-600">
                      {formatCurrencySimple(stats?.summary?.totalAmount || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-loopfund-coral-100 rounded-full">
                    <Banknote className="w-6 h-6 text-loopfund-coral-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Success Rate</p>
                    <p className="font-display text-h3 text-loopfund-gold-600">
                      {analytics?.insights?.successRate || 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-loopfund-gold-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-loopfund-gold-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Average Amount</p>
                    <p className="font-display text-h3 text-loopfund-lavender-600">
                      {formatCurrencySimple(stats?.summary?.avgTransactionAmount || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-loopfund-lavender-100 rounded-full">
                    <TrendingDown className="w-6 h-6 text-loopfund-lavender-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          </motion.div>

          {/* Revolutionary Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="relative mb-8"
          >
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-loopfund-electric-100 rounded-lg">
                    <Filter className="w-5 h-5 text-loopfund-electric-600" />
                  </div>
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Filter Transactions
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-loopfund-emerald-500 rounded-full"></div>
                  <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {transactions.length} transactions
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <LoopFundInput
                    placeholder="Search transactions..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                  />
                </div>

                {/* Filter Toggle */}
                <LoopFundButton
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<Filter className="w-4 h-4" />}
                >
                  Filters
                </LoopFundButton>

                {/* Export */}
                <LoopFundButton
                  variant="secondary"
                  onClick={handleExport}
                  icon={<Download className="w-4 h-4" />}
                >
                  Export
                </LoopFundButton>
              </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-6 border-t border-loopfund-neutral-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-loopfund-neutral-300 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-loopfund-emerald-500"
                    >
                      <option value="">All Types</option>
                      <option value="contribution">Contribution</option>
                      <option value="withdrawal">Withdrawal</option>
                      <option value="refund">Refund</option>
                      <option value="fee">Fee</option>
                      <option value="bonus">Bonus</option>
                      <option value="transfer">Transfer</option>
                      <option value="adjustment">Adjustment</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-loopfund-neutral-300 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-loopfund-emerald-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="reversed">Reversed</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-loopfund-neutral-300 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-loopfund-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-loopfund-neutral-300 rounded-lg focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-loopfund-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <LoopFundButton
                    variant="outline"
                    onClick={clearFilters}
                    size="sm"
                  >
                    Clear Filters
                  </LoopFundButton>
                </div>
              </motion.div>
            )}
          </LoopFundCard>
        </motion.div>

          {/* Revolutionary Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
          <LoopFundCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-loopfund-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-body text-body-xs font-medium text-loopfund-neutral-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left font-body text-body-xs font-medium text-loopfund-neutral-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left font-body text-body-xs font-medium text-loopfund-neutral-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left font-body text-body-xs font-medium text-loopfund-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-body text-body-xs font-medium text-loopfund-neutral-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left font-body text-body-xs font-medium text-loopfund-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-loopfund-neutral-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 animate-spin text-loopfund-emerald-600 mr-2" />
                          <span className="text-loopfund-neutral-600">Loading transactions...</span>
                        </div>
                      </td>
                    </tr>
                  ) : !transactions || transactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <motion.div 
                          className="text-loopfund-neutral-500"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div
                            className="w-20 h-20 bg-gradient-to-r from-loopfund-neutral-400 to-loopfund-neutral-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <CreditCard className="w-10 h-10 text-white" />
                          </motion.div>
                          <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                            No transactions found
                          </h3>
                          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                            Your transaction history will appear here
                          </p>
                          <LoopFundButton
                            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                            variant="outline"
                            size="lg"
                            icon={<CreditCard className="w-5 h-5" />}
                          >
                            Clear Filters
                          </LoopFundButton>
                        </motion.div>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => {
                      if (!transaction || !transaction._id) return null;
                      
                      return (
                        <tr key={transaction._id} className="hover:bg-loopfund-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-body text-body-sm font-medium text-loopfund-neutral-900">
                                {transaction.transactionId || 'N/A'}
                              </div>
                              <div className="font-body text-body-sm text-loopfund-neutral-500">
                                {transaction.description || 'No description'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-body-xs font-medium ${transactionService.getTypeColor(transaction.type || 'contribution')}`}>
                              {transactionService.formatTransactionType(transaction.type || 'contribution')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-body text-body-sm font-medium text-loopfund-neutral-900">
                              {formatCurrencySimple(transaction.amount || 0)}
                            </div>
                            {(transaction.fee || 0) > 0 && (
                              <div className="font-body text-body-xs text-loopfund-neutral-500">
                                Fee: {formatCurrencySimple(transaction.fee || 0)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-body-xs font-medium ${transactionService.getStatusColor(transaction.status || 'pending')}`}>
                              {getStatusIcon(transaction.status || 'pending')}
                              <span className="ml-1">
                                {transactionService.formatTransactionStatus(transaction.status || 'pending')}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-body-sm text-loopfund-neutral-500">
                            {transaction.createdAt ? formatDate(transaction.createdAt) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-body text-body-sm font-medium">
                            <LoopFundButton
                              variant="outline"
                              size="sm"
                              onClick={() => viewTransactionDetails(transaction._id)}
                              icon={<Eye className="w-4 h-4" />}
                            >
                              View
                            </LoopFundButton>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-loopfund-neutral-200">
                <div className="flex items-center justify-between">
                  <div className="font-body text-body-sm text-loopfund-neutral-700">
                    Showing {(((pagination.page || 1) - 1) * (pagination.limit || 20)) + 1} to {Math.min((pagination.page || 1) * (pagination.limit || 20), pagination.total || 0)} of {pagination.total || 0} transactions
                  </div>
                  <div className="flex space-x-2">
                    <LoopFundButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', (pagination.page || 1) - 1)}
                      disabled={(pagination.page || 1) === 1}
                    >
                      Previous
                    </LoopFundButton>
                    <LoopFundButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', (pagination.page || 1) + 1)}
                      disabled={(pagination.page || 1) === (pagination.pages || 1)}
                    >
                      Next
                    </LoopFundButton>
                  </div>
                </div>
              </div>
            )}
          </LoopFundCard>
        </motion.div>

          {/* Revolutionary Transaction Details Modal */}
          {showTransactionDetails && selectedTransaction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-loopfund-dark-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-loopfund-lg"
              >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-body text-body-lg font-semibold text-loopfund-neutral-900">
                    Transaction Details
                  </h3>
                  <button
                    onClick={() => setShowTransactionDetails(false)}
                    className="text-loopfund-neutral-400 hover:text-loopfund-neutral-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700">Transaction ID</label>
                      <p className="text-sm text-loopfund-neutral-900">{selectedTransaction.transactionId}</p>
                    </div>
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700">Type</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-body-xs font-medium ${transactionService.getTypeColor(selectedTransaction.type || 'contribution')}`}>
                        {transactionService.formatTransactionType(selectedTransaction.type || 'contribution')}
                      </span>
                    </div>
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700">Amount</label>
                      <p className="text-sm text-loopfund-neutral-900">{formatCurrencySimple(selectedTransaction.amount || 0)}</p>
                    </div>
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-body-xs font-medium ${transactionService.getStatusColor(selectedTransaction.status || 'pending')}`}>
                        {getStatusIcon(selectedTransaction.status || 'pending')}
                        <span className="ml-1">
                          {transactionService.formatTransactionStatus(selectedTransaction.status || 'pending')}
                        </span>
                      </span>
                    </div>
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700">Created</label>
                      <p className="text-sm text-loopfund-neutral-900">{formatDate(selectedTransaction.createdAt)}</p>
                    </div>
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700">Completed</label>
                      <p className="text-sm text-loopfund-neutral-900">
                        {selectedTransaction.completedAt ? formatDate(selectedTransaction.completedAt) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {selectedTransaction.description && (
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700">Description</label>
                      <p className="text-sm text-loopfund-neutral-900">{selectedTransaction.description}</p>
                    </div>
                  )}

                  {selectedTransaction.goal && (
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700">Related Goal</label>
                      <p className="text-sm text-loopfund-neutral-900">{selectedTransaction.goal.name}</p>
                    </div>
                  )}

                  {selectedTransaction.group && (
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700">Related Group</label>
                      <p className="text-sm text-loopfund-neutral-900">{selectedTransaction.group.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
  );
};

export default TransactionsPage;
