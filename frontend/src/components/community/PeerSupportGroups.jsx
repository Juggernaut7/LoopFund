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
  Gift,
  User,
  Eye,
  Clock,
  Tag,
  BarChart3,
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';
import GroupDiscussions from './GroupDiscussions';

const PeerSupportGroups = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
    { id: 'debt_recovery', name: 'Debt Recovery', icon: Target, color: 'bg-red-100 text-red-800' },
    { id: 'savings_goals', name: 'Savings Goals', icon: Trophy, color: 'bg-green-100 text-green-800' },
    { id: 'budgeting', name: 'Budgeting', icon: BarChart3, color: 'bg-blue-100 text-blue-800' },
    { id: 'investment_learning', name: 'Investment Learning', icon: TrendingUp, color: 'bg-purple-100 text-purple-800' },
    { id: 'financial_education', name: 'Financial Education', icon: BookOpen, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'emotional_support', name: 'Emotional Support', icon: Heart, color: 'bg-pink-100 text-pink-800' },
    { id: 'career_advancement', name: 'Career Advancement', icon: Award, color: 'bg-indigo-100 text-indigo-800' }
  ];

  const privacyOptions = [
    { id: 'public', name: 'Public', icon: Globe, description: 'Anyone can join' },
    { id: 'private', name: 'Private', icon: Lock, description: 'Invite only' }
  ];

  useEffect(() => {
    loadGroups();
  }, [selectedCategory, sortBy]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await communityService.getGroups(1, 20, filters);
      
      console.log('Groups response:', response); // Debug log
      
      if (response.success) {
        setGroups(response.data.groups || []);
        } else {
        console.error('Groups API error:', response.error);
        toast.error('Failed to load groups');
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (!newGroup.name.trim() || !newGroup.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      console.log('Creating group with data:', newGroup);
      const response = await communityService.createGroup(newGroup);
      
      if (response.success) {
        toast.success('Group created successfully!');
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
        loadGroups();
      } else {
        console.error('Group creation failed:', response);
        toast.error(response.error || 'Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await communityService.joinGroup(groupId);
      if (response.success) {
        toast.success('Joined group successfully!');
        loadGroups();
        // Update selected group if it's the same group
        if (selectedGroup && selectedGroup._id === groupId) {
          setSelectedGroup(prev => ({
            ...prev,
            members: [...(prev.members || []), { user: user.id, role: 'member' }]
          }));
        }
      }
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const response = await communityService.leaveGroup(groupId);
      if (response.success) {
        toast.success('Left group successfully!');
        loadGroups();
        // Update selected group if it's the same group
        if (selectedGroup && selectedGroup._id === groupId) {
          setSelectedGroup(prev => ({
            ...prev,
            members: (prev.members || []).filter(member => member.user !== user.id)
          }));
        }
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const getCategoryIcon = (category) => {
    try {
    const cat = categories.find(c => c.id === category);
      const IconComponent = cat ? cat.icon : Users;
      return <IconComponent size={24} className="text-white" />;
    } catch (error) {
      console.error('Error rendering category icon:', error);
      return <Users size={24} className="text-white" />;
    }
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMembershipPercentage = (group) => {
    if (!group.maxMembers) return 0;
    const currentMembers = group.members?.length || 0;
    return Math.min((currentMembers / group.maxMembers) * 100, 100);
  };

  const handleGroupSelect = (group) => {
    try {
      console.log('Selecting group:', group);
      setSelectedGroup(group);
      setActiveTab('overview');
    } catch (error) {
      console.error('Error selecting group:', error);
      toast.error('Error opening group details');
    }
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
    setActiveTab('overview');
  };

  // If a group is selected, show group detail view
  if (selectedGroup) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Group Header */}
        <div className="mb-6">
          <button
            onClick={handleBackToGroups}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Groups</span>
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  {(() => {
                    const cat = categories.find(c => c.id === selectedGroup.category);
                    const IconComponent = cat ? cat.icon : Users;
                    return <IconComponent size={32} className="text-purple-600 dark:text-purple-400" />;
                  })()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedGroup.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedGroup.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedGroup.category)}`}>
                      {categories.find(c => c.id === selectedGroup.category)?.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedGroup.members?.length || 0} members
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedGroup.privacy === 'public' ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {selectedGroup.members?.some(member => member.user === user?.id) ? (
                  <button
                    onClick={() => handleLeaveGroup(selectedGroup._id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                  >
                    <UserMinus size={16} />
                    <span>Leave Group</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(selectedGroup._id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    <UserPlus size={16} />
                    <span>Join Group</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Group Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: Users },
                { id: 'discussions', name: 'Discussions', icon: MessageCircle },
                { id: 'resources', name: 'Resources', icon: BookOpen },
                { id: 'events', name: 'Events', icon: Calendar }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedGroup.members?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <MessageCircle size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Discussions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedGroup.discussions?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <BookOpen size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Resources</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedGroup.resources?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'discussions' && (
            <GroupDiscussions groupId={selectedGroup._id} groupName={selectedGroup.name} />
          )}
          
          {activeTab === 'resources' && (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Resources Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Group resources and file sharing will be available soon.
              </p>
            </div>
          )}
          
          {activeTab === 'events' && (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Events Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Group events and meetups will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error boundary for the component
  if (!groups && !loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">⚠️ Error loading groups</div>
          <button
            onClick={loadGroups}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
            <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Peer Support Groups
              </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find your tribe, get support, and grow together in your financial journey
              </p>
            </div>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span>Create Group</span>
            </button>
          </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="most_active">Most Active</option>
              </select>
          </div>

          {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.id
                  ? category.color
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
              <category.icon size={16} />
                    <span>{category.name}</span>
                  </button>
          ))}
                    </div>
                  </div>

        {/* Create Group Modal */}
        <AnimatePresence>
          {showCreateGroup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowCreateGroup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Group</h2>
                  <button
                    onClick={() => setShowCreateGroup(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                  <X size={20} className="text-gray-500" />
                  </button>
                </div>

              <form onSubmit={handleCreateGroup} className="space-y-6">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Group Name *
                    </label>
                    <input
                      type="text"
                      value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="What's your group called?"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={100}
                    required
                    />
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                    </label>
                    <textarea
                      value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="Describe your group's purpose and what members can expect..."
                      rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      maxLength={500}
                    required
                    />
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={newGroup.category}
                      onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {categories.slice(1).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Members
                    </label>
                    <input
                      type="number"
                      value={newGroup.maxMembers}
                      onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) })}
                      min="2"
                      max="1000"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Privacy
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {privacyOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          newGroup.privacy === option.id
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="privacy"
                          value={option.id}
                          checked={newGroup.privacy === option.id}
                          onChange={(e) => setNewGroup({ ...newGroup, privacy: e.target.value })}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <option.icon size={20} className="text-gray-600 dark:text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{option.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  </div>

                <div className="flex justify-end space-x-4">
                    <button
                    type="button"
                      onClick={() => setShowCreateGroup(false)}
                    className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                    >
                      Create Group
                    </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))
        ) : groups.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No groups yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Be the first to create a support group!</p>
          </div>
        ) : (
          groups.map((group) => (
            <motion.div
              key={group._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              onClick={() => handleGroupSelect(group)}
            >
              {/* Group Header with Gradient */}
              <div className="relative h-24 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      {getCategoryIcon(group.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        {group.name}
                      </h3>
                      <p className="text-white text-opacity-80 text-sm">
                        {categories.find(c => c.id === group.category)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {group.privacy === 'public' ? (
                      <div className="bg-green-500 bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                        <Globe size={16} className="text-white" />
                      </div>
                    ) : (
                      <div className="bg-orange-500 bg-opacity-20 backdrop-blur-sm rounded-lg p-2">
                        <Lock size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Group Content */}
              <div className="p-6">
                {/* Group Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-2 leading-relaxed">
                  {group.description}
                </p>

                {/* Group Stats - Modern Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users size={18} className="text-blue-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {group.members?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Members</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <MessageCircle size={18} className="text-green-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {group.discussions?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Discussions</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar size={18} className="text-purple-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatDate(group.createdAt).split(' ')[0]}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Created</div>
                  </div>
                </div>

                {/* Membership Progress - Modern Design */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Membership</span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      {group.members?.length || 0}/{group.maxMembers || 100}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${getMembershipPercentage(group)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button - Modern Design */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMember = group.members?.some(m => m.user === user?.id);
                    if (isMember) {
                      handleLeaveGroup(group._id);
                    } else {
                      handleJoinGroup(group._id);
                    }
                  }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    group.members?.some(m => m.user === user?.id)
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 border border-red-200 dark:border-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {group.members?.some(m => m.user === user?.id) ? (
                    <div className="flex items-center justify-center space-x-2">
                      <UserMinus size={16} />
                      <span>Leave Group</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <UserPlus size={16} />
                      <span>Join Group</span>
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          ))
          )}
      </div>
      </div>
    </div>
  );
};

export default PeerSupportGroups; 