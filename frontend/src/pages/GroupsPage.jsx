import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  DollarSign, 
  Banknote,
  Target,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  Eye,
  Loader,
  AlertCircle,
  Mail, 
  Users as UsersIcon, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Calendar as CalendarIcon,
  X, 
  Copy, 
  Link as LinkIcon,
  RefreshCw,
  MessageCircle,
  Loader2,
  CreditCard,
  Wallet,
  Sparkles,
  Trophy,
  Zap,
  Crown
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import InviteModal from '../components/invitations/InviteModal';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../components/ui';
import { formatCurrency, formatCurrencySimple } from '../utils/currency';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [contributionData, setContributionData] = useState({
    amount: '',
    description: ''
  });
  const navigate = useNavigate();

  // Fetch groups from backend
  useEffect(() => {
    fetchGroups();
  }, []);

  // Handle payment verification when returning from Paystack
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const reference = urlParams.get('reference');
    
    if (paymentStatus === 'success' && reference) {
      verifyPayment(reference);
    }
  }, []);

  const verifyPayment = async (reference) => {
    try {
      const response = await fetch(`http://localhost:4000/api/payments/verify-contribution/${reference}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const contributionAmount = data.data?.contributionAmount || data.data?.amount || 0;
          toast.success(`Contribution of ₦${contributionAmount.toLocaleString()} added successfully!`);
          // Refresh groups list
          await fetchGroups();
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          toast.error(data.error || 'Payment verification failed');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    }
  };

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:4000/api/groups', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch groups');
      }

      const data = await response.json();
      setGroups(data.data || []);
      
      console.log('Groups fetched:', data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError(error.message);
      toast.error('Groups Error', 'Failed to load groups. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to CreateGroupPage for payment integration
  const handleCreateGroup = () => {
    navigate('/create-group');
  };

  const deleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete group');
      }

      toast.success('Group Deleted', 'Your group has been successfully deleted.');
      fetchGroups(); // Refresh the list
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Delete Error', 'Failed to delete group. Please try again.');
    }
  };

  const getProgressPercentage = (group) => {
    if (!group.targetAmount || group.targetAmount === 0) return 0;
    return Math.min((group.currentAmount / group.targetAmount) * 100, 100);
  };

  const getStatusColor = (group) => {
    const progress = getProgressPercentage(group);
    if (progress >= 100) return 'text-loopfund-emerald-600 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20';
    if (progress >= 80) return 'text-loopfund-electric-600 bg-loopfund-electric-100 dark:bg-loopfund-electric-900/20';
    if (progress >= 50) return 'text-loopfund-gold-600 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/20';
    return 'text-loopfund-coral-600 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20';
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || group.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleInviteClick = (group) => {
    setSelectedGroup(group);
    setIsInviteModalOpen(true);
  };

  const handleContributeClick = (group) => {
    setSelectedGroup(group);
    setShowContributeModal(true);
  };

  const handleMessageClick = (group) => {
    navigate(`/groups/${group._id}`);
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    
    if (!contributionData.amount || parseFloat(contributionData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsContributing(true);
    try {
      // Initialize contribution payment with Paystack
      const response = await fetch('http://localhost:4000/api/payments/initialize-contribution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          groupId: selectedGroup._id,
          amount: parseFloat(contributionData.amount),
          description: contributionData.description
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // Redirect to Paystack payment page
          window.location.href = data.data.authorizationUrl;
        } else {
          toast.error(data.error || 'Failed to initialize payment');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error initializing contribution payment:', error);
      toast.error('Failed to initialize payment');
    } finally {
      setIsContributing(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'bank_transfer': return <Banknote className="w-4 h-4" />;
      case 'card_payment': return <CreditCard className="w-4 h-4" />;
      case 'cash': return <Wallet className="w-4 h-4" />;
      default: return <Banknote className="w-4 h-4" />;
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

  const handleInviteSent = () => {
    // Refresh groups or show success message
    fetchGroups();
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-loopfund rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Loading Groups
            </h3>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Fetching your collaborative savings groups...
            </p>
          </motion.div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20 rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <AlertCircle className="w-8 h-8 text-loopfund-coral-600" />
            </motion.div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Failed to Load Groups
            </h3>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              {error}
            </p>
            <LoopFundButton 
              onClick={fetchGroups}
              variant="primary"
              size="md"
              icon={<RefreshCw className="w-5 h-5" />}
            >
              Try Again
            </LoopFundButton>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="space-y-8 p-6">
          {/* Header */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-loopfund opacity-5 rounded-full blur-3xl animate-float" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-coral opacity-5 rounded-full blur-2xl animate-float-delayed" />
            </div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  My Groups
                </motion.h1>
                <motion.p 
                  className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Collaborate with others to achieve shared savings goals
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <LoopFundButton
                  onClick={handleCreateGroup}
                  variant="primary"
                  size="lg"
                  icon={<Plus className="w-5 h-5" />}
                >
                  Create Group
                </LoopFundButton>
              </motion.div>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex-1">
              <LoopFundInput
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
                className="w-full"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent transition-colors font-body text-body"
              >
                <option value="all">All Groups</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </motion.div>

          {/* Groups Grid */}
          <motion.div 
            className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="relative group"
              >
                <LoopFundCard variant="elevated" hover className="h-full min-h-[500px] w-full">
                  {/* Background Elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
                    <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float-delayed" />
                  </div>
                  
                  <div className="relative p-10">
                    {/* Group Header */}
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <motion.div 
                          className="w-16 h-16 bg-gradient-loopfund rounded-3xl flex items-center justify-center shadow-loopfund-lg flex-shrink-0"
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Users className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2 truncate">
                            {group.name}
                          </h3>
                          <span className="inline-block px-4 py-2 rounded-full text-sm font-body font-medium bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300">
                            {group.members?.length || 0} Members
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions Menu */}
                      <div className="flex items-center space-x-2 ml-4">
                        <motion.button 
                          onClick={() => deleteGroup(group._id)}
                          className="p-3 text-loopfund-neutral-500 hover:text-loopfund-coral-600 dark:text-loopfund-neutral-400 dark:hover:text-loopfund-coral-400 transition-colors rounded-xl hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleInviteClick(group)}
                          className="p-3 text-loopfund-neutral-500 hover:text-loopfund-emerald-600 dark:text-loopfund-neutral-400 dark:hover:text-loopfund-emerald-400 transition-colors rounded-xl hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Mail className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Group Description */}
                    {group.description && (
                      <div className="mb-8">
                        <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 leading-relaxed">
                          {group.description}
                        </p>
                      </div>
                    )}

                    {/* Progress Section */}
                    <div className="mb-10">
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Progress</span>
                        <span className="font-display text-h3 text-loopfund-emerald-600">
                          {getProgressPercentage(group).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-5 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-5 rounded-full bg-gradient-loopfund"
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgressPercentage(group)}%` }}
                          transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        />
                      </div>
                      {getProgressPercentage(group) >= 100 && (
                        <motion.div 
                          className="mt-4 text-center"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 }}
                        >
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-body font-medium bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Goal Achieved!
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Group Details */}
                    <div className="space-y-5 mb-10">
                      <div className="flex items-center justify-between py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl">
                        <span className="font-body text-body font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Current Balance:</span>
                        <span className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text whitespace-nowrap">
                          {formatCurrencySimple(group.currentAmount || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl">
                        <span className="font-body text-body font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Target Goal:</span>
                        <span className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text whitespace-nowrap">
                          {formatCurrencySimple(group.targetAmount || 0)}
                        </span>
                      </div>
                      {group.deadline && (
                        <div className="flex items-center justify-between py-3 px-4 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 rounded-2xl">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-loopfund-coral-600" />
                            <span className="font-body text-body font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Deadline:</span>
                          </div>
                          <span className="font-display text-h4 text-loopfund-coral-600 whitespace-nowrap">
                            {new Date(group.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Group Members */}
                    {group.members && group.members.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                            Members ({group.members.length})
                          </h4>
                          <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                            Max {group.settings?.maxMembers || 50}
                          </span>
                        </div>
                        <div className="flex -space-x-3">
                          {group.members.slice(0, 5).map((member, index) => (
                            <motion.div
                              key={member._id || index}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-loopfund-coral-500 to-loopfund-orange-500 flex items-center justify-center text-white text-sm font-medium border-2 border-white dark:border-loopfund-dark-surface shadow-loopfund"
                              title={member.user?.firstName ? `${member.user.firstName} ${member.user.lastName}` : 'Member'}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              {member.user?.firstName ? member.user.firstName.charAt(0).toUpperCase() : 'U'}
                            </motion.div>
                          ))}
                          {group.members.length > 5 && (
                            <motion.div 
                              className="w-10 h-10 rounded-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-600 flex items-center justify-center text-loopfund-neutral-600 dark:text-loopfund-neutral-400 text-sm font-medium border-2 border-white dark:border-loopfund-dark-surface shadow-loopfund"
                            >
                              +{group.members.length - 5}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Main Action Button */}
                    <div className="mb-8">
                      <LoopFundButton
                        onClick={() => handleContributeClick(group)}
                        variant="secondary"
                        size="lg"
                        icon={<Plus className="w-5 h-5" />}
                        className="w-full"
                      >
                        Contribute Now
                      </LoopFundButton>
                    </div>

                    {/* Group Actions */}
                    <div className="flex items-center justify-between pt-8 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                      <div className={`px-4 py-2 rounded-full text-sm font-body font-medium ${getStatusColor(group)} flex items-center space-x-2 flex-shrink-0`}>
                        <Zap className="w-4 h-4" />
                        <span>{group.status || 'active'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button 
                          onClick={() => navigate(`/groups/${group._id}`)}
                          className="p-3 text-loopfund-neutral-500 hover:text-loopfund-emerald-600 dark:text-loopfund-neutral-400 dark:hover:text-loopfund-emerald-400 transition-colors rounded-xl hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated"
                          title="View Group Details"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        <motion.button 
                          onClick={() => handleMessageClick(group)}
                          className="p-3 text-loopfund-neutral-500 hover:text-loopfund-coral-600 dark:text-loopfund-neutral-400 dark:hover:text-loopfund-coral-400 transition-colors rounded-xl hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated"
                          title="Message Group"
                          whileTap={{ scale: 0.9 }}
                        >
                          <MessageCircle className="w-5 h-5" />
                        </motion.button>
                        <motion.button 
                          onClick={() => handleInviteClick(group)}
                          className="p-3 text-loopfund-neutral-500 hover:text-loopfund-gold-600 dark:text-loopfund-neutral-400 dark:hover:text-loopfund-gold-400 transition-colors rounded-xl hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated"
                          title="Invite Members"
                          whileTap={{ scale: 0.9 }}
                        >
                          <UserPlus className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </LoopFundCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredGroups.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center py-16"
            >
              <motion.div
                className="w-20 h-20 bg-gradient-loopfund rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Users className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                No Groups Found
              </h3>
              <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8 max-w-md mx-auto">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filters to find groups'
                  : 'Start collaborating by creating your first group and invite friends to save together'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <LoopFundButton
                  onClick={handleCreateGroup}
                  variant="secondary"
                  size="lg"
                  icon={<Plus className="w-5 h-5" />}
                >
                  Create Your First Group
                </LoopFundButton>
              )}
            </motion.div>
          )}
        </div>

        {/* Invite Modal */}
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => {
            setIsInviteModalOpen(false);
            setSelectedGroup(null);
          }}
          group={selectedGroup}
          onInviteSent={handleInviteSent}
        />

        {/* Contribution Modal */}
        <AnimatePresence>
            {showContributeModal && selectedGroup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-md"
                >
                  <LoopFundCard variant="elevated" className="relative">
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-coral opacity-5 rounded-full blur-2xl animate-float" />
                    </div>
                    
                    <div className="relative p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund"
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Banknote className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                              Contribute to {selectedGroup.name}
                            </h3>
                            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                              Add your contribution to the group goal
                            </p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => setShowContributeModal(false)}
                          className="p-3 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-dark-surface rounded-xl transition-colors"
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                        </motion.button>
                      </div>

                      <form onSubmit={handleContribute} className="space-y-6">
                        <div>
                          <LoopFundInput
                            type="number"
                            step="0.01"
                            min="0.01"
                            label="Amount"
                            value={contributionData.amount}
                            onChange={(e) => setContributionData({ ...contributionData, amount: e.target.value })}
                            placeholder="1000.00"
                            icon={<Banknote className="w-5 h-5" />}
                            required
                          />
                        </div>

                        <div className="p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-xl border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                        <div>
                              <h4 className="font-body text-body font-medium text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                                Secure Payment via Paystack
                              </h4>
                              <p className="font-body text-body-xs text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
                                Your contribution will be processed securely through Paystack
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                            Description (Optional)
                          </label>
                          <textarea
                            value={contributionData.description}
                            onChange={(e) => setContributionData({ ...contributionData, description: e.target.value })}
                            placeholder="Add a note about this contribution..."
                            rows={3}
                            className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent resize-none font-body text-body"
                          />
                        </div>

                        <div className="flex space-x-4 pt-6">
                          <LoopFundButton
                            type="button"
                            onClick={() => setShowContributeModal(false)}
                            variant="outline"
                            size="lg"
                            className="flex-1"
                          >
                            Cancel
                          </LoopFundButton>
                          <LoopFundButton
                            type="submit"
                            disabled={isContributing}
                            variant="primary"
                            size="lg"
                            icon={isContributing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                            className="flex-1"
                          >
                            {isContributing ? 'Processing...' : 'Pay with Paystack'}
                          </LoopFundButton>
                        </div>
                      </form>
                    </div>
                  </LoopFundCard>
                </motion.div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
  );
};


export default GroupsPage; 