import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  RefreshCw
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';
import InviteModal from '../components/invitations/InviteModal';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

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

  const createGroup = async (groupData) => {
    try {
      const response = await fetch('http://localhost:4000/api/groups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create group');
      }

      const data = await response.json();
      toast.success('Group Created', 'Your group has been successfully created.');
      fetchGroups(); // Refresh the list
      return data.data;
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Create Error', 'Failed to create group. Please try again.');
      throw error;
    }
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
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200"
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
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
                  <span className="font-medium text-slate-900 dark:text-white">
                    {getProgressPercentage(group).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${getProgressPercentage(group)}%` }}
                  />
                </div>
              </div>

              {/* Group Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Current:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ${(group.currentAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Target:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ${(group.targetAmount || 0).toLocaleString()}
                  </span>
                </div>
                {group.deadline && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Deadline:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {new Date(group.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Group Members */}
              {group.members && group.members.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Members
                  </h4>
                  <div className="flex -space-x-2">
                    {group.members.slice(0, 4).map((member) => (
                      <div
                        key={member._id}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-slate-800"
                        title={member.name}
                      >
                        {member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </div>
                    ))}
                    {group.members.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-400 text-xs font-medium border-2 border-white dark:border-slate-800">
                        +{group.members.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Group Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(group)}`}>
                  {group.status || 'active'}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 transition-colors">
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
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Create Your First Group
              </button>
            )}
          </motion.div>
        )}

        {/* Create Group Form Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <CreateGroupModal 
              onClose={() => setShowCreateForm(false)}
              onSubmit={createGroup}
            />
          )}
        </AnimatePresence>

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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200"
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