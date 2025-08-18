import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Loader,
  AlertCircle,
  UserPlus,
  Settings,
  X,
  DollarSign,
  Copy,
  Share2,
  QrCode,
  Link as LinkIcon,
  Download
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';
import InviteModal from '../components/modals/InviteModal';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    category: 'friends'
  });
  const { toast } = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await dashboardService.getUserGroups();
      setGroups(response.data || []);
      
      console.log('Groups fetched:', response);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError(error.message);
      toast.error('Groups Error', 'Failed to load groups. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount) {
      toast.error('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const groupData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount)
      };

      await createGroup(groupData);
      toast.success('Group Created', 'Your new group has been successfully created.');
      
      // Reset form and refresh groups
      setFormData({
        name: '',
        description: '',
        targetAmount: '',
        category: 'friends'
      });
      setShowCreateForm(false);
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Create Error', 'Failed to create group. Please try again.');
    }
  };

  const createGroup = async (groupData) => {
    const response = await fetch('http://localhost:4000/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(groupData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create group');
    }

    return response.json();
  };

  const cancelCreate = () => {
    setFormData({
      name: '',
      description: '',
      targetAmount: '',
      category: 'friends'
    });
    setShowCreateForm(false);
  };

  const handleInviteMembers = (group) => {
    setSelectedGroup(group);
    setShowInviteModal(true);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    setSelectedGroup(null);
  };

  // Show loading state
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

  // Show error state
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
              My Groups
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage your group savings and collaborations
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

        {/* Create Group Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Create New Group
                </h2>
                <button
                  onClick={cancelCreate}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Group Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Group Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., Family Vacation Fund"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="family">Family</option>
                      <option value="friends">Friends</option>
                      <option value="business">Business</option>
                      <option value="community">Community</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Target Amount */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Target Amount *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        name="targetAmount"
                        value={formData.targetAmount}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="5000"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Describe your group's purpose..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={cancelCreate}
                    className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Groups List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <motion.div
              key={group._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200"
            >
              {/* Group Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {group.name}
                    </h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      Group
                    </span>
                  </div>
                </div>
                
                {/* Actions Menu */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                    <UserPlus className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Group Description */}
              {group.description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  {group.description}
                </p>
              )}

              {/* Group Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {group.targetAmount > 0 ? Math.round((group.currentAmount / group.targetAmount) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ 
                      width: `${group.targetAmount > 0 ? (group.currentAmount / group.targetAmount) * 100 : 0}%` 
                    }}
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
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Members:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {group.members?.length || 0}
                  </span>
                </div>
              </div>

              {/* Group Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Created: {new Date(group.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {group.status || 'Active'}
                </span>
              </div>

              {/* Add invite button to each group card */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleInviteMembers(group)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Invite
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {groups.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No groups yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Start collaborating with friends and family by creating a group
            </p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Create Your First Group
            </button>
          </motion.div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && selectedGroup && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={closeInviteModal}
          groupId={selectedGroup._id}
          groupName={selectedGroup.name}
          currentMembers={selectedGroup.members || []}
        />
      )}
    </Layout>
  );
};

export default GroupsPage; 