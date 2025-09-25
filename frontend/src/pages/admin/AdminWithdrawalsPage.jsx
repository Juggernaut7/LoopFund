import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Banknote,
  Shield,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useToast } from '../../context/ToastContext';

const AdminWithdrawalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedWithdrawals, setSelectedWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock withdrawal data
  const withdrawals = [
    {
      id: 1,
      userId: 'user_001',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      amount: 50000,
      status: 'pending',
      requestDate: '2024-01-20',
      processedDate: null,
      method: 'bank_transfer',
      accountDetails: {
        bankName: 'First Bank',
        accountNumber: '****1234',
        accountName: 'John Doe'
      },
      reason: 'Emergency fund withdrawal',
      adminNotes: '',
      priority: 'normal'
    },
    {
      id: 2,
      userId: 'user_002',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      amount: 25000,
      status: 'approved',
      requestDate: '2024-01-19',
      processedDate: '2024-01-20',
      method: 'bank_transfer',
      accountDetails: {
        bankName: 'GTBank',
        accountNumber: '****5678',
        accountName: 'Jane Smith'
      },
      reason: 'Savings goal completion',
      adminNotes: 'Verified and approved',
      priority: 'high'
    },
    {
      id: 3,
      userId: 'user_003',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      amount: 100000,
      status: 'rejected',
      requestDate: '2024-01-18',
      processedDate: '2024-01-19',
      method: 'bank_transfer',
      accountDetails: {
        bankName: 'Access Bank',
        accountNumber: '****9012',
        accountName: 'Mike Johnson'
      },
      reason: 'Investment withdrawal',
      adminNotes: 'Insufficient documentation provided',
      priority: 'normal'
    },
    {
      id: 4,
      userId: 'user_004',
      userName: 'Sarah Wilson',
      userEmail: 'sarah@example.com',
      amount: 75000,
      status: 'processing',
      requestDate: '2024-01-17',
      processedDate: null,
      method: 'bank_transfer',
      accountDetails: {
        bankName: 'Zenith Bank',
        accountNumber: '****3456',
        accountName: 'Sarah Wilson'
      },
      reason: 'Medical emergency',
      adminNotes: 'Under review',
      priority: 'urgent'
    },
    {
      id: 5,
      userId: 'user_005',
      userName: 'David Brown',
      userEmail: 'david@example.com',
      amount: 30000,
      status: 'completed',
      requestDate: '2024-01-16',
      processedDate: '2024-01-17',
      method: 'bank_transfer',
      accountDetails: {
        bankName: 'UBA',
        accountNumber: '****7890',
        accountName: 'David Brown'
      },
      reason: 'Regular savings withdrawal',
      adminNotes: 'Successfully processed',
      priority: 'normal'
    }
  ];

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.id.toString().includes(searchTerm);
    const matchesFilter = selectedFilter === 'all' || withdrawal.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleWithdrawalAction = (action, withdrawalId) => {
    toast.success(`${action} action performed successfully`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="w-3 h-3" />Rejected</span>;
      case 'processing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs font-medium flex items-center gap-1"><RefreshCw className="w-3 h-3" />Processing</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full text-xs font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />Urgent</span>;
      case 'high':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded-full text-xs font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" />High</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs font-medium">Normal</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPendingAmount = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);

  const totalProcessedAmount = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const completedCount = withdrawals.filter(w => w.status === 'completed').length;

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
              <CreditCard className="w-8 h-8 text-synergy-500" />
              Withdrawal Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Review and process user withdrawal requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-synergy-500 to-velocity-500 text-white rounded-lg hover:from-synergy-600 hover:to-velocity-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Amount</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalPendingAmount)}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-yellow-600">{pendingCount} requests</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Processed Today</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalProcessedAmount)}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">{completedCount} completed</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Requests</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{withdrawals.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-blue-600">+8.2%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last week</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg. Processing Time</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2.4h</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">-15%</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">faster than last month</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by user name, email, or withdrawal ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-synergy-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-synergy-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Withdrawals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bank Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredWithdrawals.map((withdrawal) => (
                  <motion.tr
                    key={withdrawal.id}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-synergy-500 to-velocity-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {withdrawal.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{withdrawal.userName}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{withdrawal.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(withdrawal.amount)}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{withdrawal.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(withdrawal.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(withdrawal.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      <div>{formatDate(withdrawal.requestDate)}</div>
                      {withdrawal.processedDate && (
                        <div className="text-xs text-green-600 dark:text-green-400">
                          Processed: {formatDate(withdrawal.processedDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white">
                        <div>{withdrawal.accountDetails.bankName}</div>
                        <div className="text-slate-500 dark:text-slate-400">{withdrawal.accountDetails.accountNumber}</div>
                        <div className="text-slate-500 dark:text-slate-400">{withdrawal.accountDetails.accountName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          onClick={() => handleWithdrawalAction('View', withdrawal.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        {withdrawal.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-green-400 hover:text-green-600"
                              onClick={() => handleWithdrawalAction('Approve', withdrawal.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-red-400 hover:text-red-600"
                              onClick={() => handleWithdrawalAction('Reject', withdrawal.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                        {withdrawal.status === 'approved' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-blue-400 hover:text-blue-600"
                            onClick={() => handleWithdrawalAction('Process', withdrawal.id)}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </motion.button>
                        )}
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

export default AdminWithdrawalsPage;
