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
  Banknote,
  CreditCard,
  Wallet
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';
import InviteModal from '../components/invitations/InviteModal';

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
    method: 'bank_transfer',
    description: ''
  });
  const navigate = useNavigate();

  // Fetch groups from backend
  useEffect(() => {
    fetchGroups();
  }, []);

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
    if (progress >= 100) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (progress >= 80) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    if (progress >= 50) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
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
      const response = await fetch(`http://localhost:4000/api/groups/${selectedGroup._id}/contributions`, {
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
        
        // Refresh groups list
        await fetchGroups();
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

  const handleInviteSent = () => {
    // Refresh groups or show success message
    fetchGroups();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading your groups...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">Failed to load groups</p>
            <button 
              onClick={fetchGroups} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Groups
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Collaborate with others to achieve shared savings goals
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateGroup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Create Group</span>
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Groups</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <motion.div
              key={group._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
            >
              {/* Group Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {group.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {group.members?.length || 0} members
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => deleteGroup(group._id)}
                    className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleInviteClick(group)}
                    className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Group Description */}
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                {group.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {getProgressPercentage(group).toFixed(1)}% Complete
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${getProgressPercentage(group)}%` }}
                  />
                </div>
                {getProgressPercentage(group) >= 100 && (
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Goal Achieved!
                    </span>
                  </div>
                )}
              </div>

              {/* Group Details */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center min-w-0">
                    <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white break-words">
                      ${(group.currentAmount || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Current Balance</div>
                  </div>
                  <div className="text-center min-w-0">
                    <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white break-words">
                      ${(group.targetAmount || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Target Goal</div>
                  </div>
                </div>
                {group.deadline && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-500 dark:text-slate-400">Deadline:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {new Date(group.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Group Members */}
              {group.members && group.members.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Members ({group.members.length})
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Max {group.settings?.maxMembers || 50}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 5).map((member, index) => (
                      <div
                        key={member._id || index}
                        className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-slate-800 shadow-sm"
                        title={member.user?.firstName ? `${member.user.firstName} ${member.user.lastName}` : 'Member'}
                      >
                        {member.user?.firstName ? member.user.firstName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    ))}
                    {group.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 text-xs font-medium border-2 border-white dark:border-slate-800 shadow-sm">
                        +{group.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Main Action Button */}
              <div className="mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContributeClick(group)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Contribute Now</span>
                </motion.button>
              </div>

              {/* Group Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(group)}`}>
                  {group.status || 'active'}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => navigate(`/groups/${group._id}`)}
                    className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                    title="View Group Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleMessageClick(group)}
                    className="p-2 text-slate-500 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 transition-colors"
                    title="Message Group"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleInviteClick(group)}
                    className="p-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
                    title="Invite Members"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No groups found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start collaborating by creating your first group'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <button
                onClick={handleCreateGroup}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Your First Group
              </button>
            )}
          </motion.div>
        )}

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
                    Contribute to {selectedGroup.name}
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
      </div>
    </Layout>
  );
};

// Create Group Modal Component
const CreateGroupModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    deadline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount)
      });
      onClose();
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Create New Group
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Describe your group goal"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Target Amount *
            </label>
            <input
              type="number"
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default GroupsPage; 