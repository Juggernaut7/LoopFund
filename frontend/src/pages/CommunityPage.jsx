import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Target, 
  Users, 
  Search, 
  BarChart3,
  TrendingUp,
  Heart,
  Share2,
  Plus,
  Filter,
  Globe,
  Star,
  Zap,
  Lightbulb,
  Trophy,
  Gift,
  Activity,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  Sparkles,
  Crown,
  Gamepad2
} from 'lucide-react';
import CommunityFeed from '../components/community/CommunityFeed';
import CommunityChallenges from '../components/community/CommunityChallenges';
import PeerSupportGroups from '../components/community/PeerSupportGroups';
import CommunityAnalytics from '../components/community/CommunityAnalytics';
import CommunitySearch from '../components/community/CommunitySearch';
import communityService from '../services/communityService';
import { LoopFundButton, LoopFundCard } from '../components/ui';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('');
  const [loading, setLoading] = useState(true);

  const tabs = [
    { 
      id: 'feed', 
      name: 'Community Feed', 
      icon: MessageCircle, 
      description: 'Share stories and connect with others',
      color: 'emerald',
      gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500'
    },
    { 
      id: 'challenges', 
      name: 'Challenges', 
      icon: Target, 
      description: 'Join challenges and build habits together',
      color: 'coral',
      gradient: 'from-loopfund-coral-500 to-loopfund-orange-500'
    },
    { 
      id: 'groups', 
      name: 'Support Groups', 
      icon: Users, 
      description: 'Find your tribe and get support',
      color: 'lavender',
      gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500'
    },
    { 
      id: 'search', 
      name: 'Search', 
      icon: Search, 
      description: 'Find specific content and resources',
      color: 'gold',
      gradient: 'from-loopfund-gold-500 to-loopfund-orange-500'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      description: 'Community insights and trends',
      color: 'electric',
      gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500'
    }
  ];

  const quickActions = [
    {
      id: 'post',
      name: 'Share Story',
      description: 'Share your financial wellness journey',
      icon: MessageCircle,
      color: 'emerald',
      gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500',
      action: () => {
        setCreateType('post');
        setShowCreateModal(false);
        // Switch to feed tab to show the create post modal
        setActiveTab('feed');
      }
    },
    {
      id: 'challenge',
      name: 'Create Challenge',
      description: 'Start a community challenge',
      icon: Target,
      color: 'coral',
      gradient: 'from-loopfund-coral-500 to-loopfund-orange-500',
      action: () => {
        setCreateType('challenge');
        setShowCreateModal(false);
        setActiveTab('challenges');
      }
    },
    {
      id: 'group',
      name: 'Create Group',
      description: 'Start a support group',
      icon: Users,
      color: 'lavender',
      gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500',
      action: () => {
        setCreateType('group');
        setShowCreateModal(false);
        setActiveTab('groups');
      }
    },
    {
      id: 'therapy-game',
      name: 'Therapy Game',
      description: 'Interactive financial wellness therapy',
      icon: Gamepad2,
      color: 'electric',
      gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500',
      comingSoon: true,
      action: () => {
        // Coming soon - no action for now
        console.log('Therapy Game coming soon!');
      }
    }
  ];

  const [communityStats, setCommunityStats] = useState([
    { label: 'Active Members', value: 'Loading...', icon: Users, color: 'emerald', gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500' },
    { label: 'Posts Today', value: 'Loading...', icon: MessageCircle, color: 'coral', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
    { label: 'Active Challenges', value: 'Loading...', icon: Target, color: 'gold', gradient: 'from-loopfund-gold-500 to-loopfund-orange-500' },
    { label: 'Support Groups', value: 'Loading...', icon: Users, color: 'lavender', gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500' }
  ]);

  useEffect(() => {
    loadCommunityStats();
  }, []);

  const loadCommunityStats = async () => {
    try {
      setLoading(true);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );
      
      const response = await Promise.race([
        communityService.getCommunityStats(),
        timeoutPromise
      ]);
      
      if (response.success) {
        setCommunityStats([
          { label: 'Active Members', value: response.data.totalMembers?.toString() || '0', icon: Users, color: 'emerald', gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500' },
          { label: 'Posts Today', value: response.data.postsToday?.toString() || '0', icon: MessageCircle, color: 'coral', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
          { label: 'Active Challenges', value: response.data.activeChallenges?.toString() || '0', icon: Target, color: 'gold', gradient: 'from-loopfund-gold-500 to-loopfund-orange-500' },
          { label: 'Support Groups', value: response.data.supportGroups?.toString() || '0', icon: Users, color: 'lavender', gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500' }
        ]);
      } else {
        // Set fallback data if API fails
        setCommunityStats([
          { label: 'Active Members', value: '0', icon: Users, color: 'emerald', gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500' },
          { label: 'Posts Today', value: '0', icon: MessageCircle, color: 'coral', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
          { label: 'Active Challenges', value: '0', icon: Target, color: 'gold', gradient: 'from-loopfund-gold-500 to-loopfund-orange-500' },
          { label: 'Support Groups', value: '0', icon: Users, color: 'lavender', gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500' }
        ]);
      }
    } catch (error) {
      console.error('Error loading community stats:', error);
      // Set fallback data on error
      setCommunityStats([
        { label: 'Active Members', value: '0', icon: Users, color: 'emerald', gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500' },
        { label: 'Posts Today', value: '0', icon: MessageCircle, color: 'coral', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
        { label: 'Active Challenges', value: '0', icon: Target, color: 'gold', gradient: 'from-loopfund-gold-500 to-loopfund-orange-500' },
        { label: 'Support Groups', value: '0', icon: Users, color: 'lavender', gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Reset createType when tab changes
  useEffect(() => {
    setCreateType('');
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return <CommunityFeed autoShowCreatePost={createType === 'post'} />;
      case 'challenges':
        return <CommunityChallenges />;
      case 'groups':
        return <PeerSupportGroups />;
      case 'search':
        return <CommunitySearch />;
      case 'analytics':
        return <CommunityAnalytics />;
      default:
        return <FinancialWellnessCommunity />;
    }
  };

  // Loading state
  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Loading Your Community
                </h2>
                <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  Connecting you with your financial wellness community...
                </p>
              </motion.div>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="relative">
                {/* Floating background elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500/20 to-loopfund-mint-500/20 rounded-full animate-float"></div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-loopfund-coral-500/20 to-loopfund-orange-500/20 rounded-full animate-float-delayed"></div>
                
                <h1 className="text-3xl font-display font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2 relative z-10">
                  Financial Wellness Community
                </h1>
                <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 relative z-10">
                  Connect, support, and grow together in your financial wellness journey
                </p>
              </div>
              <LoopFundButton
                onClick={() => setShowCreateModal(true)}
                variant="primary"
                size="lg"
                icon={<Plus className="w-4 h-4" />}
              >
                Create
              </LoopFundButton>
            </div>
          </motion.div>

          {/* Community Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          >
            {communityStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={index} 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <LoopFundCard variant="elevated" className="p-6 hover:shadow-loopfund-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">{stat.label}</p>
                        <p className="text-2xl font-display font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">{stat.value}</p>
                      </div>
                      <motion.div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${stat.gradient} shadow-loopfund`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                    {/* Floating sparkles on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-4 h-4 text-loopfund-gold-500 animate-pulse" />
                    </div>
                  </LoopFundCard>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <LoopFundCard variant="elevated" className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  className="p-2 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-xl shadow-loopfund"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="text-lg font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.id}
                      onClick={action.action}
                      className={`group flex items-center space-x-4 p-6 rounded-xl border transition-all duration-300 ${
                        action.comingSoon 
                          ? 'border-loopfund-neutral-300 dark:border-loopfund-neutral-600 bg-loopfund-neutral-100 dark:bg-loopfund-dark-surface opacity-75 cursor-not-allowed' 
                          : 'border-loopfund-neutral-200 dark:border-loopfund-neutral-700 hover:border-loopfund-neutral-300 dark:hover:border-loopfund-neutral-600 hover:shadow-loopfund bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={action.comingSoon ? {} : { scale: 1.02 }}
                      whileTap={action.comingSoon ? {} : { scale: 0.98 }}
                    >
                      <motion.div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${action.gradient} shadow-loopfund transition-transform ${
                          action.comingSoon ? '' : 'group-hover:scale-110'
                        }`}
                        whileHover={action.comingSoon ? {} : { rotate: 5 }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="text-left flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-display font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">{action.name}</p>
                          {action.comingSoon && (
                            <span className="px-2 py-1 text-xs font-body font-medium bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 text-white rounded-full">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">{action.description}</p>
                      </div>
                      {!action.comingSoon && (
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ChevronRight className="w-5 h-5 text-loopfund-neutral-400 group-hover:text-loopfund-emerald-500 transition-colors" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <LoopFundCard variant="elevated" className="p-6">
              <div className="flex flex-wrap gap-3">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 font-body ${
                        activeTab === tab.id
                          ? `bg-loopfund-${tab.color}-100 dark:bg-loopfund-${tab.color}-900/20 text-loopfund-${tab.color}-600 dark:text-loopfund-${tab.color}-400 border-2 border-loopfund-${tab.color}-200 dark:border-loopfund-${tab.color}-800 shadow-loopfund`
                          : 'bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-dark-surface border-2 border-transparent hover:border-loopfund-neutral-300 dark:hover:border-loopfund-neutral-600'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className={`p-1 rounded-lg ${
                          activeTab === tab.id 
                            ? `bg-gradient-to-r ${tab.gradient}` 
                            : 'bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 group-hover:bg-loopfund-neutral-300 dark:group-hover:bg-loopfund-neutral-600'
                        }`}
                        whileHover={{ rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className={`w-4 h-4 ${
                          activeTab === tab.id ? 'text-white' : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400'
                        }`} />
                      </motion.div>
                      <span className="font-medium">{tab.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </LoopFundCard>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <LoopFundCard variant="elevated" className="p-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                      <motion.div
                        className="p-3 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl shadow-loopfund"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Crown className="w-6 h-6 text-white" />
                      </motion.div>
                      <h2 className="text-xl font-display font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">What would you like to create?</h2>
                    </div>
                    <div className="space-y-4">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                          <motion.button
                            key={action.id}
                            onClick={() => {
                              if (!action.comingSoon) {
                                action.action();
                                setShowCreateModal(false);
                              }
                            }}
                            className={`w-full flex items-center space-x-4 p-6 rounded-xl border transition-all duration-300 ${
                              action.comingSoon 
                                ? 'border-loopfund-neutral-300 dark:border-loopfund-neutral-600 bg-loopfund-neutral-100 dark:bg-loopfund-dark-surface opacity-75 cursor-not-allowed' 
                                : 'border-loopfund-neutral-200 dark:border-loopfund-neutral-700 hover:border-loopfund-neutral-300 dark:hover:border-loopfund-neutral-600 hover:shadow-loopfund bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated group'
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={action.comingSoon ? {} : { scale: 1.02 }}
                            whileTap={action.comingSoon ? {} : { scale: 0.98 }}
                          >
                            <motion.div 
                              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${action.gradient} shadow-loopfund transition-transform ${
                                action.comingSoon ? '' : 'group-hover:scale-110'
                              }`}
                              whileHover={action.comingSoon ? {} : { rotate: 5 }}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </motion.div>
                            <div className="text-left flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-display font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">{action.name}</p>
                                {action.comingSoon && (
                                  <span className="px-2 py-1 text-xs font-body font-medium bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 text-white rounded-full">
                                    Coming Soon
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">{action.description}</p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    <LoopFundButton
                      onClick={() => setShowCreateModal(false)}
                      variant="secondary"
                      size="lg"
                      className="mt-6"
                    >
                      Cancel
                    </LoopFundButton>
                  </div>
                </LoopFundCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default CommunityPage; 