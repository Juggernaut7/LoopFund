import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  UserPlus,
  Share2,
  MoreVertical,
  Banknote,
  CreditCard,
  Wallet,
  X,
  CheckCircle,
  MessageCircle,
  AlertCircle,
  Loader2,
  Copy
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';
import GroupChat from '../components/chat/GroupChat';

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  
  const [group, setGroup] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [contributionData, setContributionData] = useState({
    amount: '',
    method: 'bank_transfer',
    description: ''
  });

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
      fetchContributions();
    }
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGroup(data.data);
      } else {
        throw new Error('Failed to fetch group details');
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
      toast.error('Failed to load group details');
    }
  };

  const fetchContributions = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/groups/${groupId}/contributions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContributions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    
    if (!contributionData.amount || parseFloat(contributionData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsContributing(true);
    try {
      const response = await fetch(`http://localhost:4000/api/groups/${groupId}/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(contributionData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Contribution added successfully!');
        setShowContributeModal(false);
        setContributionData({ amount: '', method: 'bank_transfer', description: '' });
        
        // Refresh group details and contributions
        await fetchGroupDetails();
        await fetchContributions();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add contribution');
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error(error.message || 'Failed to add contribution');
    } finally {
      setIsContributing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'bank_transfer': return <Banknote className="w-4 h-4" />;
      case 'card_payment': return <CreditCard className="w-4 h-4" />;
      case 'cash': return <Wallet className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'bank_transfer': return 'Bank Transfer';
      case 'card_payment': return 'Card Payment';
      case 'cash': return 'Cash';
      default: return 'Other';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  if (!group) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Group Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">The group you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/groups')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
          >
            Back to Groups
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/groups')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {group.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {group.description || 'Group savings goal'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChat(!showChat)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 ${
                showChat 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>{showChat ? 'Hide Chat' : 'Show Chat'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowContributeModal(true)}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Contribute</span>
            </motion.button>
            
            <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(group.currentAmount || 0)}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Total Saved</p>
            {group.targetAmount && (
              <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
                of {formatCurrency(group.targetAmount)} target
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {group.members?.length || 0}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Members</p>
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
              Max {group.settings?.maxMembers || 50}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {group.progress?.percentage || 0}%
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Progress</p>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${group.progress?.percentage || 0}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {group.progress?.daysRemaining || 0}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Days Left</p>
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">
              {group.endDate ? formatDate(group.endDate) : 'No end date'}
            </p>
          </motion.div>
        </div>

        {/* Members Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Members</h2>
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Invite</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.members?.map((member, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {member.user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {member.user?.firstName} {member.user?.lastName}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                    {member.role}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(member.totalContributed || 0)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">contributed</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Information Section */}
        {group.accountInfo && (group.accountInfo.bankName || group.accountInfo.accountNumber) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Payment Information</h2>
              </div>
              <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                {group.accountInfo.paymentMethod?.replace('_', ' ').toUpperCase() || 'BANK TRANSFER'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.accountInfo.bankName && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Bank Name
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {group.accountInfo.bankName}
                  </p>
                </div>
              )}
              
              {group.accountInfo.accountName && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Account Name
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {group.accountInfo.accountName}
                  </p>
                </div>
              )}
              
              {group.accountInfo.accountNumber && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Account Number
                  </label>
                  <div className="flex items-center space-x-2">
                    <p className="text-slate-900 dark:text-white font-medium font-mono">
                      {group.accountInfo.accountNumber}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(group.accountInfo.accountNumber);
                        // You could add a toast notification here
                      }}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title="Copy account number"
                    >
                      <Copy className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              )}
              
              {group.accountInfo.routingNumber && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Routing Number
                  </label>
                  <p className="text-slate-900 dark:text-white font-medium font-mono">
                    {group.accountInfo.routingNumber}
                  </p>
                </div>
              )}
              
              {group.accountInfo.additionalInfo && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Additional Information
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {group.accountInfo.additionalInfo}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div>
                  <p className="text-blue-800 dark:text-blue-200 text-sm font-medium mb-1">
                    How to Contribute
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Use the account information above to send your contributions directly to the group account. 
                    Make sure to include your name in the transaction reference so we can track your contribution.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Contributions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Recent Contributions</h2>
          
          {contributions.length > 0 ? (
            <div className="space-y-4">
              {contributions.slice(0, 10).map((contribution) => (
                <div key={contribution._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      {getPaymentMethodIcon(contribution.method)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {contribution.user?.firstName} {contribution.user?.lastName}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {getPaymentMethodLabel(contribution.method)}
                        {contribution.description && ` • ${contribution.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      +{formatCurrency(contribution.amount)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {formatDate(contribution.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Contributions Yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Be the first to contribute to this group!
              </p>
              <button
                onClick={() => setShowContributeModal(true)}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors"
              >
                Make First Contribution
              </button>
            </div>
          )}
        </motion.div>

        {/* Contribution Modal */}
        <AnimatePresence>
          {showContributeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Contribute to {group.name}
                  </h3>
                  <button
                    onClick={() => setShowContributeModal(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleContribute} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={contributionData.amount}
                      onChange={(e) => setContributionData({ ...contributionData, amount: e.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={contributionData.method}
                      onChange={(e) => setContributionData({ ...contributionData, method: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="card_payment">Card Payment</option>
                      <option value="cash">Cash</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={contributionData.description}
                      onChange={(e) => setContributionData({ ...contributionData, description: e.target.value })}
                      placeholder="Add a note about this contribution..."
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowContributeModal(false)}
                      className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isContributing}
                      className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isContributing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Contribute</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Group Chat */}
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6"
          >
            <div className="h-96">
              <GroupChat groupId={groupId} groupName={group?.name} />
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default GroupDetailsPage; 