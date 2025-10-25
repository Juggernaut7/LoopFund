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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com/api';
import GroupContributionForm from '../components/contributions/GroupContributionForm';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../components/ui';
import { formatCurrency, formatCurrencySimple, formatCompactCurrency } from '../utils/currency';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [contributionData, setContributionData] = useState({
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchGroups();
    
    // Check if user is returning from a payment verification
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to the tab, refresh groups data
        fetchGroups();
      }
    };
    
    const handleFocus = () => {
      // User focused the window, refresh groups data
      fetchGroups();
    };
    
    // Listen for tab visibility changes and window focus
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    // Listen for payment completion events
    const handlePaymentCompleted = (event) => {
      console.log('🔄 Payment completed event received:', event.detail);
      if (event.detail.type === 'groups' || event.detail.type === 'group') {
        console.log('🔄 Refreshing groups data after payment completion...');
        fetchGroups();
      }
    };
    
    window.addEventListener('paymentCompleted', handlePaymentCompleted);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('paymentCompleted', handlePaymentCompleted);
    };
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/groups`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      });

      if (response.ok) {
      const data = await response.json();
      setGroups(data.data || []);
      } else {
        setError('Failed to load groups');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = () => {
    navigate('/create-group');
  };

  const handleInviteClick = (group) => {
    setSelectedGroup(group);
    setIsInviteModalOpen(true);
  };

  const handleContributeClick = (group) => {
    setSelectedGroup(group);
    setShowContributeModal(true);
  };

  const handleAddContribution = async (contributionData) => {
    try {
      console.log('🚀 Group contribution data:', contributionData);
      
      const response = await fetch(`${API_BASE_URL}/contributions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...contributionData,
          type: 'group'
        })
      });

      const data = await response.json();
      console.log('📊 Group contribution response:', data);
      console.log('📊 Response data structure:', JSON.stringify(data, null, 2));
      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (response.ok) {
        // Check if this is a direct Paystack payment
        console.log('🔍 Checking for authorizationUrl:', {
          hasData: !!data.data,
          hasAuthorizationUrl: !!(data.data && data.data.authorizationUrl),
          hasNestedData: !!(data.data && data.data.data),
          hasNestedAuthorizationUrl: !!(data.data && data.data.data && data.data.data.authorizationUrl),
          dataKeys: data.data ? Object.keys(data.data) : 'no data',
          nestedDataKeys: data.data && data.data.data ? Object.keys(data.data.data) : 'no nested data',
          fullData: data
        });
        
        // Check for nested structure first (data.data.data.authorizationUrl)
        if (data.data && data.data.data && data.data.data.authorizationUrl) {
          console.log('💳 Opening Paystack payment page (nested):', data.data.data.authorizationUrl);
          // Open Paystack payment page
          window.open(data.data.data.authorizationUrl, '_blank');
          toast.success('Success', 'Payment page opened. Complete payment to add contribution.');
        } else if (data.data && data.data.authorizationUrl) {
          console.log('💳 Opening Paystack payment page (direct):', data.data.authorizationUrl);
          // Open Paystack payment page
          window.open(data.data.authorizationUrl, '_blank');
          toast.success('Success', 'Payment page opened. Complete payment to add contribution.');
        } else {
          console.log('✅ Wallet payment completed, refreshing groups...');
          console.log('🔍 Data structure check:', {
            hasData: !!data.data,
            hasAuthorizationUrl: !!(data.data && data.data.authorizationUrl),
            dataKeys: data.data ? Object.keys(data.data) : 'no data'
          });
          // Wallet payment completed immediately
          toast.success('Success', 'Contribution added successfully!');
          setShowContributeModal(false);
          await fetchGroups();
        }
      } else {
        console.error('❌ Group contribution failed:', data);
        toast.error('Error', data.error || 'Failed to add contribution');
      }
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error('Error', 'Failed to add contribution. Please try again.');
    }
  };

  const handleMessageClick = (group) => {
    navigate(`/groups/${group._id}`);
  };

  const handleInviteSent = () => {
    setIsInviteModalOpen(false);
    setSelectedGroup(null);
    toast.success('Invitation Sent', 'Group invitation has been sent successfully!');
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'active') return matchesSearch && group.status === 'active';
    if (filterType === 'completed') return matchesSearch && group.status === 'completed';
    if (filterType === 'paused') return matchesSearch && group.status === 'paused';
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-loopfund-emerald-600 mx-auto mb-4" />
          <p className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Loading groups...</p>
        </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
              onClick={fetchGroups}
            className="mt-4 px-4 py-2 bg-loopfund-emerald-600 text-white rounded-lg hover:bg-loopfund-emerald-700 transition-colors"
            >
              Try Again
          </button>
        </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-background">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
          </motion.div>

          {/* Groups Grid */}
          <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {filteredGroups.map((group, index) => (
              <motion.div
                key={group._id}
              initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
            >
              <LoopFundCard className="h-full p-6">
                <div className="flex flex-col h-full">
                  {/* Group Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="p-3 bg-loopfund-emerald-100 rounded-full flex-shrink-0">
                        <Users className="w-6 h-6 text-loopfund-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-h4 text-loopfund-neutral-900 mb-1 truncate">
                          {group.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-loopfund-emerald-100 text-loopfund-emerald-700">
                            {group.members?.length || 0} members
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-loopfund-neutral-100 text-loopfund-neutral-600">
                            {group.status || 'active'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-loopfund-neutral-100 rounded-xl transition-colors flex-shrink-0">
                      <MoreVertical className="w-5 h-5 text-loopfund-neutral-500" />
                    </button>
                  </div>

                  {/* Group Description */}
                  <p className="font-body text-body-sm text-loopfund-neutral-600 mb-6 line-clamp-2 min-h-[2.5rem]">
                    {group.description || 'No description provided'}
                  </p>

                  {/* Group Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="text-center p-3 bg-loopfund-neutral-50 rounded-xl">
                      <div className="font-display text-h5 text-loopfund-emerald-600 mb-1 truncate">
                        {formatCurrencySimple(group.currentAmount || 0)}
                      </div>
                      <div className="font-body text-body-sm text-loopfund-neutral-600">
                        Total Saved
                      </div>
                    </div>
                    <div className="text-center p-3 bg-loopfund-neutral-50 rounded-xl">
                      <div className="font-display text-h5 text-loopfund-neutral-900 mb-1 truncate">
                        {group.targetAmount ? formatCurrencySimple(group.targetAmount) : 'N/A'}
                      </div>
                      <div className="font-body text-body-sm text-loopfund-neutral-600">
                        Target
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {group.targetAmount && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-body text-body-sm font-medium text-loopfund-neutral-700">
                          Progress
                        </span>
                        <span className="font-display text-body-sm font-medium text-loopfund-emerald-600">
                          {Math.round(((group.currentAmount || 0) / group.targetAmount) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-loopfund-neutral-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-loopfund-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(((group.currentAmount || 0) / group.targetAmount) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 mt-auto">
                    <div className="flex space-x-2">
                      <LoopFundButton
                        onClick={() => handleContributeClick(group)}
                        variant="primary"
                        size="sm"
                        icon={<Plus className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Contribute
                      </LoopFundButton>
                      <LoopFundButton
                        onClick={() => handleInviteClick(group)}
                        variant="outline"
                        size="sm"
                        icon={<UserPlus className="w-4 h-4" />}
                        className="flex-1"
                      >
                        Invite
                      </LoopFundButton>
                    </div>
                    <LoopFundButton
                      onClick={() => handleMessageClick(group)}
                      variant="outline"
                      size="sm"
                      icon={<Eye className="w-4 h-4" />}
                      className="w-full"
                    >
                      View Details
                    </LoopFundButton>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
        {filteredGroups.length === 0 && (
            <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
          >
            <div className="w-24 h-24 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-loopfund-neutral-400" />
            </div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
              {searchTerm ? 'No groups found' : 'No groups yet'}
              </h3>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first group to start collaborating with others'
                }
              </p>
            {!searchTerm && (
                <LoopFundButton
                  onClick={handleCreateGroup}
                variant="primary"
                  size="lg"
                  icon={<Plus className="w-5 h-5" />}
                >
                  Create Your First Group
                </LoopFundButton>
              )}
            </motion.div>
          )}

        {/* Modals */}
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
            <GroupContributionForm
              group={selectedGroup}
              onSubmit={handleAddContribution}
              onClose={() => setShowContributeModal(false)}
            />
            )}
        </AnimatePresence>
      </div>
      </div>
  );
};

export default GroupsPage;