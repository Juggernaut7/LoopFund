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
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-body text-body-xl font-bold text-loopfund-neutral-900 mb-2">
            Transaction History
          </h1>
          <p className="font-body text-body text-loopfund-neutral-600">
            Track all your financial activities and payment history
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-body-sm font-medium text-loopfund-neutral-600">Total Transactions</p>
                  <p className="font-body text-body-lg font-bold text-loopfund-neutral-900">
                    {stats.summary?.totalTransactions || 0}
                  </p>
                </div>
                <div className="p-3 bg-loopfund-emerald-100 rounded-full">
                  <CreditCard className="w-6 h-6 text-loopfund-emerald-600" />
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-body-sm font-medium text-loopfund-neutral-600">Total Amount</p>
                  <p className="font-body text-body-lg font-bold text-loopfund-neutral-900">
                    {formatCurrencySimple(stats.summary?.totalAmount || 0)}
                  </p>
                </div>
                <div className="p-3 bg-loopfund-coral-100 rounded-full">
                  <Banknote className="w-6 h-6 text-loopfund-coral-600" />
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-body-sm font-medium text-loopfund-neutral-600">Success Rate</p>
                  <p className="font-body text-body-lg font-bold text-loopfund-neutral-900">
                    {analytics?.insights?.successRate || 0}%
                  </p>
                </div>
                <div className="p-3 bg-loopfund-gold-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-loopfund-gold-600" />
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-body-sm font-medium text-loopfund-neutral-600">Average Amount</p>
                  <p className="font-body text-body-lg font-bold text-loopfund-neutral-900">
                    {formatCurrencySimple(stats.summary?.avgTransactionAmount || 0)}
                  </p>
                </div>
                <div className="p-3 bg-loopfund-lavender-100 rounded-full">
                  <TrendingDown className="w-6 h-6 text-loopfund-lavender-600" />
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <LoopFundCard className="p-6">
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

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                        <div className="text-loopfund-neutral-500">
                          <CreditCard className="w-12 h-12 mx-auto mb-4 text-loopfund-neutral-300" />
                          <p className="font-body text-body-lg font-medium">No transactions found</p>
                          <p className="font-body text-body-sm">Your transaction history will appear here</p>
                        </div>
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

        {/* Transaction Details Modal */}
        {showTransactionDetails && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
