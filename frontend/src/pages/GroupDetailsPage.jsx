import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  DollarSign,
  Banknote, 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  UserPlus,
  Share2,
  MoreVertical,
  CreditCard,
  Wallet,
  X,
  CheckCircle,
  MessageCircle,
  AlertCircle,
  Loader2,
  Copy,
  Sparkles,
  Trophy,
  Zap,
  Crown,
  Eye
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';
import GroupContributionForm from '../components/contributions/GroupContributionForm';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../components/ui';
import GroupChat from '../components/chat/GroupChat';
import { formatCurrency, formatCurrencySimple } from '../utils/currency';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com/api';

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
    description: ''
  });

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
      fetchContributions();
    }
  }, [groupId]);

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
      const response = await fetch(`${API_BASE_URL}/payments/verify-contribution/${reference}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const contributionAmount = data.data?.contributionAmount || data.data?.amount || 0;
          toast.success(`Contribution of ₦${contributionAmount.toLocaleString()} added successfully!`);
          // Refresh group details and contributions
          await fetchGroupDetails();
          await fetchContributions();
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

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
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
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/contributions`, {
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

  const handleAddContribution = async (contributionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contributions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...contributionData,
          groupId: group?._id,
          type: 'group'
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Check if this is a direct Paystack payment
        if (data.data && data.data.authorizationUrl) {
          // Open Paystack payment page
          window.open(data.data.authorizationUrl, '_blank');
          toast.success('Success', 'Payment page opened. Complete payment to add contribution.');
        } else {
          // Wallet payment completed immediately
          toast.success('Success', 'Contribution added successfully!');
          setShowContributeModal(false);
          await fetchGroupDetails();
        }
      } else {
        toast.error('Error', data.error || 'Failed to add contribution');
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error('Error', 'Failed to add contribution. Please try again.');
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
      // Initialize contribution payment with Paystack
      const response = await fetch(`${API_BASE_URL}/payments/initialize-contribution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          groupId: groupId,
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

  if (isLoading) {
    return (
        <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-loopfund-emerald-100 rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Users className="w-8 h-8 text-loopfund-emerald-600" />
            </motion.div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              Loading Group Details
            </h3>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Fetching group information and contributions...
            </p>
          </motion.div>
        </div>
    );
  }

  if (!group) {
    return (
        <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg flex items-center justify-center">
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
            <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
              Group Not Found
            </h2>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              The group you're looking for doesn't exist or you don't have access to it.
            </p>
            <LoopFundButton
              onClick={() => navigate('/groups')}
              variant="primary"
              size="lg"
              icon={<ArrowLeft className="w-5 h-5" />}
            >
              Back to Groups
            </LoopFundButton>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
        <div className="space-y-8 p-6">
          {/* Header */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.button
                  onClick={() => navigate('/groups')}
                  className="p-3 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-xl transition-colors"
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ArrowLeft className="w-6 h-6 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                </motion.button>
                <div>
                  <motion.h1 
                    className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {group.name}
                  </motion.h1>
                  <motion.p 
                    className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {group.description || 'Group savings goal'}
                  </motion.p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <LoopFundButton
                    onClick={() => setShowChat(!showChat)}
                    variant={showChat ? "primary" : "secondary"}
                    size="lg"
                    icon={<MessageCircle className="w-5 h-5" />}
                  >
                    {showChat ? 'Hide Chat' : 'Show Chat'}
                  </LoopFundButton>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <LoopFundButton
                    onClick={() => setShowContributeModal(true)}
                    variant="secondary"
                    size="lg"
                    icon={<Plus className="w-5 h-5" />}
                  >
                    Contribute
                  </LoopFundButton>
                </motion.div>
                
                <motion.button 
                  className="p-3 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-xl transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <MoreVertical className="w-6 h-6 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Group Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              {
                icon: Banknote,
                label: 'Total Saved',
                value: formatCurrency(group.currentAmount || 0),
                subtext: group.targetAmount ? `of ${formatCurrency(group.targetAmount)} target` : null,
                iconBg: 'bg-loopfund-emerald-100',
                iconColor: 'text-loopfund-emerald-600',
                color: 'emerald'
              },
              {
                icon: Users,
                label: 'Members',
                value: group.members?.length || 0,
                subtext: `Max ${group.settings?.maxMembers || 50}`,
                iconBg: 'bg-loopfund-coral-100',
                iconColor: 'text-loopfund-coral-600',
                color: 'coral'
              },
              {
                icon: TrendingUp,
                label: 'Progress',
                value: `${group.progress?.percentage || 0}%`,
                subtext: null,
                iconBg: 'bg-loopfund-gold-100',
                iconColor: 'text-loopfund-gold-600',
                color: 'gold'
              },
              {
                icon: Clock,
                label: 'Days Left',
                value: group.progress?.daysRemaining || 0,
                subtext: group.endDate ? formatDate(group.endDate) : 'No end date',
                iconBg: 'bg-loopfund-electric-100',
                iconColor: 'text-loopfund-electric-600',
                color: 'electric'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <LoopFundCard className="h-full p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${stat.iconBg} rounded-full`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <span className="font-display text-h3 text-loopfund-neutral-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="font-body text-body-sm font-medium text-loopfund-neutral-700 mb-1">
                    {stat.label}
                  </p>
                  {stat.subtext && (
                    <p className="font-body text-body-sm text-loopfund-neutral-500">
                      {stat.subtext}
                    </p>
                  )}
                  {stat.label === 'Progress' && (
                    <div className="w-full bg-loopfund-neutral-200 rounded-full h-2 mt-3">
                      <motion.div 
                        className="bg-loopfund-emerald-500 h-2 rounded-full transition-all duration-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${group.progress?.percentage || 0}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  )}
                </LoopFundCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Members Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-loopfund-coral-100 rounded-full">
                    <Users className="w-6 h-6 text-loopfund-coral-600" />
                  </div>
                  <h2 className="font-display text-h3 text-loopfund-neutral-900">
                    Members
                  </h2>
                </div>
                <LoopFundButton
                  variant="outline"
                  size="sm"
                  icon={<UserPlus className="w-4 h-4" />}
                >
                  Invite
                </LoopFundButton>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.members?.map((member, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3 p-4 bg-loopfund-neutral-50 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-loopfund-coral-100 rounded-full flex items-center justify-center text-loopfund-coral-600 font-medium">
                      {member.user?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-body-sm font-medium text-loopfund-neutral-900 truncate">
                        {member.user?.firstName} {member.user?.lastName}
                      </p>
                      <p className="font-body text-body-xs text-loopfund-neutral-600 capitalize">
                        {member.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-body-sm font-medium text-loopfund-neutral-900">
                        {formatCurrency(member.totalContributed || 0)}
                      </p>
                      <p className="font-body text-body-xs text-loopfund-neutral-500">contributed</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Account Information Section */}
          {group.accountInfo && (group.accountInfo.bankName || group.accountInfo.accountNumber) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <LoopFundCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-loopfund-gold-100 rounded-full">
                      <CreditCard className="w-6 h-6 text-loopfund-gold-600" />
                    </div>
                    <h2 className="font-display text-h3 text-loopfund-neutral-900">
                      Payment Information
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-loopfund-gold-100 text-loopfund-gold-700 rounded-full font-body text-body-sm font-medium">
                    {group.accountInfo.paymentMethod?.replace('_', ' ').toUpperCase() || 'BANK TRANSFER'}
                  </span>
                </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {group.accountInfo.bankName && (
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-600 mb-2">
                          Bank Name
                        </label>
                        <p className="font-body text-body font-medium text-loopfund-neutral-900">
                          {group.accountInfo.bankName}
                        </p>
                      </div>
                    )}
                    
                    {group.accountInfo.accountName && (
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-600 mb-2">
                          Account Name
                        </label>
                        <p className="font-body text-body font-medium text-loopfund-neutral-900">
                          {group.accountInfo.accountName}
                        </p>
                      </div>
                    )}
                    
                    {group.accountInfo.accountNumber && (
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-600 mb-2">
                          Account Number
                        </label>
                        <div className="flex items-center space-x-3">
                          <p className="font-body text-body font-medium text-loopfund-neutral-900 font-mono">
                            {group.accountInfo.accountNumber}
                          </p>
                          <motion.button
                            onClick={() => {
                              navigator.clipboard.writeText(group.accountInfo.accountNumber);
                              toast.success('Account number copied to clipboard');
                            }}
                            className="p-2 hover:bg-loopfund-neutral-100 rounded-lg transition-colors"
                            title="Copy account number"
                            whileTap={{ scale: 0.9 }}
                          >
                            <Copy className="w-4 h-4 text-loopfund-neutral-600" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                    
                    {group.accountInfo.routingNumber && (
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-600 mb-2">
                          Routing Number
                        </label>
                        <p className="font-body text-body font-medium text-loopfund-neutral-900 font-mono">
                          {group.accountInfo.routingNumber}
                        </p>
                      </div>
                    )}
                    
                    {group.accountInfo.additionalInfo && (
                      <div className="md:col-span-2">
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-600 mb-2">
                          Additional Information
                        </label>
                        <p className="font-body text-body text-loopfund-neutral-900">
                          {group.accountInfo.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 p-4 bg-loopfund-gold-50 rounded-xl border border-loopfund-gold-200">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-loopfund-gold-100 rounded-lg flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4 text-loopfund-gold-600" />
                      </div>
                      <div>
                        <p className="font-body text-body-sm font-medium text-loopfund-gold-700 mb-1">
                          How to Contribute
                        </p>
                        <p className="font-body text-body-sm text-loopfund-gold-600">
                          Use the account information above to send your contributions directly to the group account. 
                          Make sure to include your name in the transaction reference so we can track your contribution.
                        </p>
                      </div>
                    </div>
                  </div>
              </LoopFundCard>
            </motion.div>
          )}

          {/* Recent Contributions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <LoopFundCard variant="elevated" className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-electric opacity-5 rounded-full blur-2xl animate-float" />
              </div>

              <div className="relative p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-electric rounded-2xl flex items-center justify-center shadow-loopfund"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Banknote className="w-6 h-6 text-white" />
                  </motion.div>
                  <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Recent Contributions
                  </h2>
                </div>
                
                {contributions.length > 0 ? (
                  <div className="space-y-4">
                    {contributions.slice(0, 10).map((contribution, index) => (
                      <motion.div 
                        key={contribution._id} 
                        className="flex items-center justify-between p-6 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20 rounded-xl">
                            {getPaymentMethodIcon(contribution.method)}
                          </div>
                          <div>
                            <p className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                              {contribution.user?.firstName} {contribution.user?.lastName}
                            </p>
                            <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                              {getPaymentMethodLabel(contribution.method)}
                              {contribution.description && ` • ${contribution.description}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-h4 text-loopfund-emerald-600">
                            +{formatCurrency(contribution.amount)}
                          </p>
                          <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                            {formatDate(contribution.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <motion.div
                      className="w-20 h-20 bg-gradient-loopfund rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Banknote className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                      No Contributions Yet
                    </h3>
                    <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                      Be the first to contribute to this group!
                    </p>
                    <LoopFundButton
                      onClick={() => setShowContributeModal(true)}
                      variant="secondary"
                      size="lg"
                      icon={<Plus className="w-5 h-5" />}
                    >
                      Make First Contribution
                    </LoopFundButton>
                  </motion.div>
                )}
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Contribution Modal */}
          <AnimatePresence>
            {showContributeModal && (
              <GroupContributionForm
                group={group}
                onSubmit={handleAddContribution}
                onClose={() => setShowContributeModal(false)}
              />
            )}
          </AnimatePresence>

          {/* Group Chat */}
          <AnimatePresence>
            {showChat && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="mt-8"
              >
                <LoopFundCard variant="elevated" className="h-96">
                  <div className="h-full">
                    <GroupChat groupId={groupId} groupName={group?.name} />
                  </div>
                </LoopFundCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};

export default GroupDetailsPage;