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
  Sparkles,
  Crown,
  RefreshCw,
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';
import GroupDiscussions from './GroupDiscussions';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../ui';

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
    { id: 'all', name: 'All Groups', icon: Users, color: 'bg-loopfund-neutral-100 text-loopfund-neutral-800', gradient: 'from-loopfund-neutral-500 to-loopfund-neutral-600' },
    { id: 'debt_recovery', name: 'Debt Recovery', icon: Target, color: 'bg-loopfund-coral-100 text-loopfund-coral-800', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
    { id: 'savings_goals', name: 'Savings Goals', icon: Trophy, color: 'bg-loopfund-emerald-100 text-loopfund-emerald-800', gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500' },
    { id: 'budgeting', name: 'Budgeting', icon: BarChart3, color: 'bg-loopfund-electric-100 text-loopfund-electric-800', gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500' },
    { id: 'investment_learning', name: 'Investment Learning', icon: TrendingUp, color: 'bg-loopfund-gold-100 text-loopfund-gold-800', gradient: 'from-loopfund-gold-500 to-loopfund-orange-500' },
    { id: 'financial_education', name: 'Financial Education', icon: BookOpen, color: 'bg-loopfund-lavender-100 text-loopfund-lavender-800', gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500' },
    { id: 'emotional_support', name: 'Emotional Support', icon: Heart, color: 'bg-loopfund-coral-100 text-loopfund-coral-800', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
    { id: 'career_advancement', name: 'Career Advancement', icon: Award, color: 'bg-loopfund-mint-100 text-loopfund-mint-800', gradient: 'from-loopfund-mint-500 to-loopfund-emerald-500' }
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
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-6xl mx-auto p-6">
          {/* Group Header */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={handleBackToGroups}
              className="flex items-center space-x-2 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-emerald-600 dark:hover:text-loopfund-emerald-400 mb-4 transition-colors"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} />
              <span className="font-body text-body">Back to Groups</span>
            </motion.button>
            
            <LoopFundCard variant="elevated" className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-loopfund-lavender-500 to-loopfund-electric-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {(() => {
                      const cat = categories.find(c => c.id === selectedGroup.category);
                      const IconComponent = cat ? cat.icon : Users;
                      return <IconComponent size={32} className="text-white" />;
                    })()}
                  </motion.div>
                  <div>
                    <h1 className="font-display text-h1 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {selectedGroup.name}
                    </h1>
                    <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-1">
                      {selectedGroup.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-medium ${getCategoryColor(selectedGroup.category)}`}>
                        {categories.find(c => c.id === selectedGroup.category)?.name}
                      </span>
                      <span className="font-body text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        {selectedGroup.members?.length || 0} members
                      </span>
                      <span className="font-body text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        {selectedGroup.privacy === 'public' ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedGroup.members?.some(member => member.user === user?.id) ? (
                    <LoopFundButton
                      onClick={() => handleLeaveGroup(selectedGroup._id)}
                      variant="coral"
                      size="md"
                      icon={<UserMinus size={16} />}
                    >
                      Leave Group
                    </LoopFundButton>
                  ) : (
                    <LoopFundButton
                      onClick={() => handleJoinGroup(selectedGroup._id)}
                      variant="primary"
                      size="md"
                      icon={<UserPlus size={16} />}
                    >
                      Join Group
                    </LoopFundButton>
                  )}
                </div>
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Group Tabs */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <LoopFundCard variant="elevated" className="p-2">
              <nav className="flex space-x-2">
                {[
                  { id: 'overview', name: 'Overview', icon: Users, color: 'emerald' },
                  { id: 'discussions', name: 'Discussions', icon: MessageCircle, color: 'coral' },
                  { id: 'resources', name: 'Resources', icon: BookOpen, color: 'gold' },
                  { id: 'events', name: 'Events', icon: Calendar, color: 'lavender' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-4 rounded-xl font-body font-medium text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? `bg-loopfund-${tab.color}-100 text-loopfund-${tab.color}-700 dark:bg-loopfund-${tab.color}-900/20 dark:text-loopfund-${tab.color}-300 shadow-loopfund`
                        : 'text-loopfund-neutral-500 dark:text-loopfund-neutral-400 hover:text-loopfund-neutral-700 dark:hover:text-loopfund-neutral-300 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <tab.icon size={16} />
                    <span>{tab.name}</span>
                  </motion.button>
                ))}
              </nav>
            </LoopFundCard>
          </motion.div>

          {/* Tab Content */}
          <motion.div 
            className="min-h-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div 
                    className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl p-6 shadow-loopfund border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Users size={20} className="text-white" />
                      </motion.div>
                      <div>
                        <p className="font-body text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Members</p>
                        <p className="font-display text-h2 font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {selectedGroup.members?.length || 0}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl p-6 shadow-loopfund border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <MessageCircle size={20} className="text-white" />
                      </motion.div>
                      <div>
                        <p className="font-body text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Discussions</p>
                        <p className="font-display text-h2 font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {selectedGroup.discussions?.length || 0}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl p-6 shadow-loopfund border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <BookOpen size={20} className="text-white" />
                      </motion.div>
                      <div>
                        <p className="font-body text-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Resources</p>
                        <p className="font-display text-h2 font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {selectedGroup.resources?.length || 0}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          
            {activeTab === 'discussions' && (
              <GroupDiscussions groupId={selectedGroup._id} groupName={selectedGroup.name} />
            )}
            
            {activeTab === 'resources' && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BookOpen size={48} className="mx-auto text-loopfund-neutral-400 mb-4" />
                </motion.div>
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Resources Coming Soon
                </h3>
                <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Group resources and file sharing will be available soon.
                </p>
              </motion.div>
            )}
            
            {activeTab === 'events' && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Calendar size={48} className="mx-auto text-loopfund-neutral-400 mb-4" />
                </motion.div>
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Events Coming Soon
                </h3>
                <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Group events and meetups will be available soon.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Error boundary for the component
  if (!groups && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-6xl mx-auto p-6">
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle size={48} className="mx-auto text-loopfund-coral-500 mb-4" />
            </motion.div>
            <div className="font-body text-body text-loopfund-coral-600 dark:text-loopfund-coral-400 mb-4">⚠️ Error loading groups</div>
            <LoopFundButton
              onClick={loadGroups}
              variant="primary"
              size="lg"
              icon={<RefreshCw size={18} />}
            >
              Try Again
            </LoopFundButton>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Floating background elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-loopfund-emerald-500/10 to-loopfund-mint-500/10 rounded-full animate-float"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-loopfund-coral-500/10 to-loopfund-orange-500/10 rounded-full animate-float-delayed"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                Peer Support Groups
              </h1>
              <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Find your tribe, get support, and grow together in your financial journey
              </p>
            </div>
            <LoopFundButton
              onClick={() => setShowCreateGroup(true)}
              variant="primary"
              size="lg"
              icon={<Plus size={20} />}
            >
              Create Group
            </LoopFundButton>
          </div>

        {/* Search and Filters */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex-1 relative">
            <LoopFundInput
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} />}
              className="w-full"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-body"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="most_active">Most Active</option>
          </select>
        </motion.div>

          {/* Category Filters */}
          <motion.div 
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-2xl text-sm font-body font-medium transition-all duration-300 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? category.color + ' shadow-loopfund'
                    : 'bg-loopfund-neutral-100 text-loopfund-neutral-600 hover:bg-loopfund-neutral-200 dark:bg-loopfund-dark-elevated dark:text-loopfund-neutral-300 dark:hover:bg-loopfund-dark-surface'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <category.icon size={16} />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Create Group Modal */}
        <AnimatePresence>
          {showCreateGroup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowCreateGroup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <LoopFundCard variant="elevated" className="p-8">
                  {/* Floating background elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-loopfund-emerald-500/10 to-loopfund-mint-500/10 rounded-full animate-float"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-loopfund-coral-500/10 to-loopfund-orange-500/10 rounded-full animate-float-delayed"></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Users size={24} className="text-white" />
                      </motion.div>
                      <div>
                        <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Create New Group</h2>
                        <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Build a supportive community</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setShowCreateGroup(false)}
                      className="w-10 h-10 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl flex items-center justify-center text-loopfund-neutral-500 hover:text-loopfund-neutral-700 dark:hover:text-loopfund-neutral-300 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  <form onSubmit={handleCreateGroup} className="space-y-6">
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                        Group Name *
                      </label>
                      <LoopFundInput
                        type="text"
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        placeholder="What's your group called?"
                        maxLength={100}
                        required
                        className="w-full"
                        icon={<Users size={20} />}
                      />
                    </div>

                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                        Description *
                      </label>
                      <textarea
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                        placeholder="Describe your group's purpose and what members can expect..."
                        rows={4}
                        className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-2xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent resize-none font-body text-body"
                        maxLength={500}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                          Category
                        </label>
                        <select
                          value={newGroup.category}
                          onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
                          className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-2xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent font-body text-body"
                        >
                          {categories.slice(1).map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                          Max Members
                        </label>
                        <LoopFundInput
                          type="number"
                          value={newGroup.maxMembers}
                          onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) })}
                          min="2"
                          max="1000"
                          className="w-full"
                          icon={<Users size={20} />}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                        Privacy
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {privacyOptions.map((option) => (
                          <motion.label
                            key={option.id}
                            className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                              newGroup.privacy === option.id
                                ? 'border-loopfund-emerald-500 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 shadow-loopfund'
                                : 'border-loopfund-neutral-300 dark:border-loopfund-neutral-600 hover:border-loopfund-emerald-300 dark:hover:border-loopfund-emerald-600'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
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
                              <option.icon size={20} className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                              <div>
                                <p className="font-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">{option.name}</p>
                                <p className="font-body text-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">{option.description}</p>
                              </div>
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <LoopFundButton
                        type="button"
                        onClick={() => setShowCreateGroup(false)}
                        variant="secondary"
                        size="lg"
                      >
                        Cancel
                      </LoopFundButton>
                      <LoopFundButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        icon={<Users size={18} />}
                      >
                        Create Group
                      </LoopFundButton>
                    </div>
                  </form>
                </LoopFundCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Groups Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div 
                key={index} 
                className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl shadow-loopfund border border-loopfund-neutral-200 dark:border-loopfund-neutral-700 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-4 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded mb-4 animate-pulse"></div>
                <div className="h-3 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded mb-2 animate-pulse"></div>
                <div className="h-3 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded mb-4 animate-pulse"></div>
                <div className="h-8 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded animate-pulse"></div>
              </motion.div>
            ))
          ) : groups.length === 0 ? (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Users size={48} className="mx-auto text-loopfund-neutral-400 mb-4" />
              </motion.div>
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">No groups yet</h3>
              <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Be the first to create a support group!</p>
            </motion.div>
          ) : (
            groups.map((group, index) => (
              <motion.div
                key={group._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => handleGroupSelect(group)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LoopFundCard variant="elevated" className="p-0 overflow-hidden hover:shadow-loopfund-lg transition-all duration-300">
                  {/* Group Header with Gradient */}
                  <div className="relative h-24 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {getCategoryIcon(group.category)}
                        </motion.div>
                        <div>
                          <h3 className="font-display font-bold text-white text-lg">
                            {group.name}
                          </h3>
                          <p className="text-white/80 font-body text-sm">
                            {categories.find(c => c.id === group.category)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {group.privacy === 'public' ? (
                          <motion.div 
                            className="bg-loopfund-emerald-500/20 backdrop-blur-sm rounded-lg p-2"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Globe size={16} className="text-white" />
                          </motion.div>
                        ) : (
                          <motion.div 
                            className="bg-loopfund-coral-500/20 backdrop-blur-sm rounded-lg p-2"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Lock size={16} className="text-white" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Group Content */}
                  <div className="p-6">
                    {/* Group Description */}
                    <p className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-6 line-clamp-2 leading-relaxed">
                      {group.description}
                    </p>

                    {/* Group Stats - Modern Cards */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <motion.div 
                        className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl p-3 text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center justify-center mb-1">
                          <Users size={18} className="text-loopfund-emerald-500" />
                        </div>
                        <div className="font-display text-h4 font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {group.members?.length || 0}
                        </div>
                        <div className="font-body text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Members</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl p-3 text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center justify-center mb-1">
                          <MessageCircle size={18} className="text-loopfund-coral-500" />
                        </div>
                        <div className="font-display text-h4 font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {group.discussions?.length || 0}
                        </div>
                        <div className="font-body text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Discussions</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl p-3 text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center justify-center mb-1">
                          <Calendar size={18} className="text-loopfund-gold-500" />
                        </div>
                        <div className="font-display text-h4 font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {formatDate(group.createdAt).split(' ')[0]}
                        </div>
                        <div className="font-body text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Created</div>
                      </motion.div>
                    </div>

                    {/* Membership Progress - Modern Design */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between font-body text-sm mb-2">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 font-medium">Membership</span>
                        <span className="text-loopfund-neutral-900 dark:text-loopfund-dark-text font-bold">
                          {group.members?.length || 0}/{group.maxMembers || 100}
                        </span>
                      </div>
                      <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 h-3 rounded-full transition-all duration-500 ease-out"
                          initial={{ width: 0 }}
                          animate={{ width: `${getMembershipPercentage(group)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>

                    {/* Action Button - Modern Design */}
                    <LoopFundButton
                      onClick={(e) => {
                        e.stopPropagation();
                        const isMember = group.members?.some(m => m.user === user?.id);
                        if (isMember) {
                          handleLeaveGroup(group._id);
                        } else {
                          handleJoinGroup(group._id);
                        }
                      }}
                      variant={group.members?.some(m => m.user === user?.id) ? "coral" : "primary"}
                      size="lg"
                      className="w-full"
                      icon={group.members?.some(m => m.user === user?.id) ? <UserMinus size={16} /> : <UserPlus size={16} />}
                    >
                      {group.members?.some(m => m.user === user?.id) ? 'Leave Group' : 'Join Group'}
                    </LoopFundButton>
                  </div>
                </LoopFundCard>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PeerSupportGroups; 