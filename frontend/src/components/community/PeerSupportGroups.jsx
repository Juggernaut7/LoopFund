import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Shield,
  Globe,
  Lock,
  Star,
  Heart,
  Share2,
  MoreHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  UserMinus,
  Settings,
  FileText,
  Video,
  Link,
  Download,
  Award,
  TrendingUp,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Zap,
  Flame,
  Trophy,
  Gift
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';

const PeerSupportGroups = () => {
  const { user } = useAuthStore();
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: 'debt_recovery',
    privacy: 'public',
    maxMembers: 100,
    rules: [],
    topics: []
  });

  const categories = [
    { id: 'all', name: 'All Groups', icon: Users, color: 'bg-gray-100 text-gray-800' },
    { id: 'debt_recovery', name: 'Debt Recovery', icon: TrendingUp, color: 'bg-green-100 text-green-800' },
    { id: 'savings_focus', name: 'Savings Focus', icon: Target, color: 'bg-blue-100 text-blue-800' },
    { id: 'emotional_spending', name: 'Emotional Spending', icon: Heart, color: 'bg-purple-100 text-purple-800' },
    { id: 'financial_anxiety', name: 'Financial Anxiety', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
    { id: 'budgeting_beginners', name: 'Budgeting Beginners', icon: BookOpen, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'investment_newbies', name: 'Investment Newbies', icon: TrendingUp, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'single_parents', name: 'Single Parents', icon: Users, color: 'bg-pink-100 text-pink-800' },
    { id: 'students', name: 'Students', icon: BookOpen, color: 'bg-orange-100 text-orange-800' },
    { id: 'entrepreneurs', name: 'Entrepreneurs', icon: Zap, color: 'bg-teal-100 text-teal-800' },
    { id: 'retirement_planning', name: 'Retirement Planning', icon: Calendar, color: 'bg-cyan-100 text-cyan-800' },
    { id: 'general_support', name: 'General Support', icon: Users, color: 'bg-gray-100 text-gray-800' }
  ];

  const privacyOptions = [
    { id: 'public', name: 'Public', icon: Globe, description: 'Anyone can join' },
    { id: 'private', name: 'Private', icon: Lock, description: 'Approval required' },
    { id: 'invite_only', name: 'Invite Only', icon: Shield, description: 'Invitation only' }
  ];

  useEffect(() => {
    loadGroups();
    loadUserGroups();
  }, [currentPage, selectedCategory, sortBy]);

  const loadGroups = async () => {
    try {
      const filters = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: 'active'
      };
      
      const response = await communityService.getGroups(currentPage, 10, filters);
      if (response.success) {
        if (currentPage === 1) {
          setGroups(response.data.groups);
        } else {
          setGroups(prev => [...prev, ...response.data.groups]);
        }
        setHasMore(response.data.pagination.hasNext);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserGroups = async () => {
    try {
      const response = await communityService.getGroups(1, 50, { 
        status: 'active',
        member: user?.id 
      });
      if (response.success) {
        setUserGroups(response.data.groups);
      }
    } catch (error) {
      console.error('Error loading user groups:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const groupData = {
        ...newGroup,
        topics: newGroup.topics.filter(topic => topic.trim() !== ''),
        rules: newGroup.rules.filter(rule => rule.trim() !== '')
      };

      const response = await communityService.createGroup(groupData);
      if (response.success) {
        setGroups(prev => [response.data.group, ...prev]);
        setShowCreateGroup(false);
        setNewGroup({
          name: '',
          description: '',
          category: 'debt_recovery',
          privacy: 'public',
          maxMembers: 100,
          rules: [],
          topics: []
        });
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await communityService.joinGroup(groupId);
      if (response.success) {
        setGroups(prev => prev.map(group => 
          group._id === groupId 
            ? { ...group, members: [...group.members, { user: user?.id }] }
            : group
        ));
        loadUserGroups();
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const response = await communityService.leaveGroup(groupId);
      if (response.success) {
        setGroups(prev => prev.map(group => 
          group._id === groupId 
            ? { ...group, members: group.members.filter(m => m.user !== user?.id) }
            : group
        ));
        setUserGroups(prev => prev.filter(group => group._id !== groupId));
      }
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = searchTerm === '' || 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.members.length - a.members.length;
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'active':
        return b.activeMemberCount - a.activeMemberCount;
      default:
        return b.members.length - a.members.length;
    }
  });

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Users;
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const getPrivacyIcon = (privacy) => {
    const option = privacyOptions.find(p => p.id === privacy);
    return option ? option.icon : Globe;
  };

  const getPrivacyColor = (privacy) => {
    switch (privacy) {
      case 'public': return 'text-green-600';
      case 'private': return 'text-yellow-600';
      case 'invite_only': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const isMember = (group) => {
    return group.members.some(m => m.user === user?.id);
  };

  const isCreator = (group) => {
    return group.creator === user?.id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Peer Support Groups
              </h1>
              <p className="text-gray-600">
                Connect with others on similar financial journeys and support each other
              </p>
            </div>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Group</span>
            </button>
          </div>
        </motion.div>

        {/* User's Groups */}
        {userGroups.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userGroups.map((group) => (
                <div key={group._id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <div className="flex items-center space-x-1">
                      {isCreator(group) && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          Creator
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${getPrivacyColor(group.privacy)}`}>
                        {privacyOptions.find(p => p.id === group.privacy)?.name}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{group.members.length} members</span>
                    <button
                      onClick={() => window.location.href = `/groups/${group._id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Group
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Recently Created</option>
                <option value="active">Most Active</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedGroups.map((group, index) => {
              const Icon = getCategoryIcon(group.category);
              const PrivacyIcon = getPrivacyIcon(group.privacy);
              const isUserMember = isMember(group);
              
              return (
                <motion.div
                  key={group._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Group Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(group.category)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{group.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{group.members.length}/{group.maxMembers} members</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isUserMember && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Member
                        </span>
                      )}
                      <PrivacyIcon className={`w-4 h-4 ${getPrivacyColor(group.privacy)}`} />
                    </div>
                  </div>

                  {/* Group Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {group.description}
                  </p>

                  {/* Group Topics */}
                  {group.topics.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {group.topics.slice(0, 3).map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                        {group.topics.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{group.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Group Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {group.discussions?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Discussions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {group.resources?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Resources</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {group.events?.length || 0}
                      </div>
                      <div className="text-xs text-gray-600">Events</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Discuss</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                    {!isUserMember ? (
                      <button
                        onClick={() => handleJoinGroup(group._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Join Group
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLeaveGroup(group._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Leave Group
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Load More Groups
            </button>
          </div>
        )}

        {/* Create Group Modal */}
        <AnimatePresence>
          {showCreateGroup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateGroup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Group</h2>
                  <button
                    onClick={() => setShowCreateGroup(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter group name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newGroup.description}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your group..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={500}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newGroup.category}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.slice(1).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Privacy
                      </label>
                      <select
                        value={newGroup.privacy}
                        onChange={(e) => setNewGroup(prev => ({ ...prev, privacy: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {privacyOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name} - {option.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Members
                    </label>
                    <input
                      type="number"
                      value={newGroup.maxMembers}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 100 }))}
                      min="2"
                      max="1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowCreateGroup(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateGroup}
                      disabled={!newGroup.name || !newGroup.description}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Group
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PeerSupportGroups; 
