import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Wallet, 
  Target, 
  Users, 
  Filter, 
  Search, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  RefreshCw
} from 'lucide-react';
import { LoopFundCard, LoopFundInput, LoopFundButton } from '../components/ui';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '../context/ToastContext';

const TransactionHistoryPage = () => {
  const { fetchTransactions, isLoading } = useWallet();
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [filters, currentPage]);

  const loadTransactions = async () => {
    try {
      console.log('🔄 Loading transactions with:', { currentPage, filters });
      const response = await fetchTransactions(currentPage, 20, filters);
      console.log('📊 Transaction response:', response);
      if (response) {
        console.log('📊 Full response:', response);
        console.log('📊 Response transactions:', response.transactions);
        console.log('📊 Response summary:', response.summary);
        setTransactions(response.transactions || []);
        setSummary(response.summary);
        console.log('📈 Summary set:', response.summary);
        console.log('📊 Transactions set:', response.transactions);
      } else {
        console.log('⚠️ No response received from fetchTransactions');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Error', 'Failed to load transaction history');
      setTransactions([]);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      startDate: '',
      endDate: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const getTransactionIcon = (type, status) => {
    const iconClass = "w-5 h-5";
    
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className={`${iconClass} text-loopfund-emerald-500`} />;
      case 'withdrawal':
        return <ArrowUpRight className={`${iconClass} text-loopfund-coral-500`} />;
      case 'contribution':
        return <Target className={`${iconClass} text-loopfund-blue-500`} />;
      case 'goal_release':
        return <TrendingUp className={`${iconClass} text-loopfund-gold-500`} />;
      case 'group_release':
        return <Users className={`${iconClass} text-loopfund-purple-500`} />;
      default:
        return <Wallet className={`${iconClass} text-loopfund-neutral-500`} />;
    }
  };

  const getTransactionColor = (type, status) => {
    if (status === 'pending') return 'text-loopfund-gold-600';
    if (status === 'failed') return 'text-loopfund-coral-600';
    
    switch (type) {
      case 'deposit':
      case 'goal_release':
      case 'group_release':
        return 'text-loopfund-emerald-600';
      case 'withdrawal':
        return 'text-loopfund-coral-600';
      case 'contribution':
        return 'text-loopfund-blue-600';
      default:
        return 'text-loopfund-neutral-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-loopfund-emerald-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-loopfund-gold-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-loopfund-coral-500" />;
      default:
        return <Clock className="w-4 h-4 text-loopfund-neutral-500" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdrawal': return 'Withdrawal';
      case 'contribution': return 'Contribution';
      case 'goal_release': return 'Goal Release';
      case 'group_release': return 'Group Release';
      default: return 'Transaction';
    }
  };

  return (
    <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Transaction History
              </h1>
              <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-2">
                Track all your wallet activities and transactions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <LoopFundButton
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter className="w-4 h-4" />}
              >
                Filters
              </LoopFundButton>
              <LoopFundButton
                variant="secondary"
                onClick={loadTransactions}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Refresh
              </LoopFundButton>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Total Transactions
                  </p>
                  <p className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {summary.totalTransactions}
                  </p>
                </div>
                <div className="w-10 h-10 bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-loopfund-neutral-600" />
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Total Deposits
                  </p>
                  <p className="font-display text-h3 text-loopfund-emerald-600">
                    {formatCurrency(summary.totalDeposits)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-loopfund-emerald-600" />
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Total Withdrawals
                  </p>
                  <p className="font-display text-h3 text-loopfund-coral-600">
                    {formatCurrency(summary.totalWithdrawals)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-loopfund-coral-600" />
                </div>
              </div>
            </LoopFundCard>

            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Pending Withdrawals
                  </p>
                  <p className="font-display text-h3 text-loopfund-gold-600">
                    {summary.pendingWithdrawals}
                  </p>
                </div>
                <div className="w-10 h-10 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-loopfund-gold-600" />
                </div>
              </div>
            </LoopFundCard>
          </div>
        )}

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <LoopFundCard className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Transaction Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="block w-full px-3 py-2 border border-loopfund-neutral-300 rounded-lg focus:ring-loopfund-emerald-500 focus:border-loopfund-emerald-500 dark:bg-loopfund-dark-input dark:border-loopfund-dark-border dark:text-loopfund-dark-text"
                    >
                      <option value="">All Types</option>
                      <option value="deposit">Deposits</option>
                      <option value="withdrawal">Withdrawals</option>
                      <option value="contribution">Contributions</option>
                      <option value="goal_release">Goal Releases</option>
                      <option value="group_release">Group Releases</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="block w-full px-3 py-2 border border-loopfund-neutral-300 rounded-lg focus:ring-loopfund-emerald-500 focus:border-loopfund-emerald-500 dark:bg-loopfund-dark-input dark:border-loopfund-dark-border dark:text-loopfund-dark-text"
                    >
                      <option value="">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Start Date
                    </label>
                    <LoopFundInput
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      End Date
                    </label>
                    <LoopFundInput
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-loopfund-neutral-400" />
                      <LoopFundInput
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <LoopFundButton
                    variant="secondary"
                    onClick={clearFilters}
                    icon={<X className="w-4 h-4" />}
                  >
                    Clear Filters
                  </LoopFundButton>
                </div>
              </LoopFundCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transactions List */}
        <LoopFundCard className="p-6">
          {console.log('🔍 Rendering transactions:', transactions, 'Length:', transactions?.length)}
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <RefreshCw className="w-8 h-8 animate-spin text-loopfund-emerald-500" />
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-card rounded-xl border border-loopfund-neutral-200 dark:border-loopfund-dark-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-loopfund-neutral-100 dark:bg-loopfund-neutral-800 rounded-lg flex items-center justify-center">
                      {getTransactionIcon(transaction.type, transaction.status)}
                    </div>
                    <div>
                      <h3 className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {getTransactionTypeLabel(transaction.type)}
                      </h3>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(transaction.status)}
                        <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400 capitalize">
                          {transaction.status}
                        </span>
                        <span className="text-loopfund-neutral-400">•</span>
                        <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                          {formatDate(transaction.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-display text-h5 ${getTransactionColor(transaction.type, transaction.status)}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    {transaction.reference && (
                      <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        Ref: {transaction.reference}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-loopfund-neutral-400 mx-auto mb-4" />
              <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                No Transactions Found
              </h3>
              <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Start by adding money to your wallet or making contributions to see your transaction history.
              </p>
            </div>
          )}
        </LoopFundCard>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
