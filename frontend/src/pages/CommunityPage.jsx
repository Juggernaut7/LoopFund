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
  ChevronRight
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import CommunityFeed from '../components/community/CommunityFeed';
import CommunityChallenges from '../components/community/CommunityChallenges';
import PeerSupportGroups from '../components/community/PeerSupportGroups';
import CommunityAnalytics from '../components/community/CommunityAnalytics';
import CommunitySearch from '../components/community/CommunitySearch';
import communityService from '../services/communityService';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('');

  const tabs = [
    { 
      id: 'feed', 
      name: 'Community Feed', 
      icon: MessageCircle, 
      description: 'Share stories and connect with others',
      color: 'bg-blue-500'
    },
    { 
      id: 'challenges', 
      name: 'Challenges', 
      icon: Target, 
      description: 'Join challenges and build habits together',
      color: 'bg-green-500'
    },
    { 
      id: 'groups', 
      name: 'Support Groups', 
      icon: Users, 
      description: 'Find your tribe and get support',
      color: 'bg-purple-500'
    },
    { 
      id: 'search', 
      name: 'Search', 
      icon: Search, 
      description: 'Find specific content and resources',
      color: 'bg-orange-500'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      description: 'Community insights and trends',
      color: 'bg-indigo-500'
    }
  ];

  const quickActions = [
    {
      id: 'post',
      name: 'Share Story',
      description: 'Share your financial wellness journey',
      icon: MessageCircle,
      color: 'bg-blue-500',
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
      color: 'bg-green-500',
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
      color: 'bg-purple-500',
      action: () => {
        setCreateType('group');
        setShowCreateModal(false);
        setActiveTab('groups');
      }
    }
  ];

  const [communityStats, setCommunityStats] = useState([
    { label: 'Active Members', value: 'Loading...', icon: Users, color: 'text-blue-600' },
    { label: 'Posts Today', value: 'Loading...', icon: MessageCircle, color: 'text-green-600' },
    { label: 'Active Challenges', value: 'Loading...', icon: Target, color: 'text-purple-600' },
    { label: 'Support Groups', value: 'Loading...', icon: Users, color: 'text-orange-600' }
  ]);

  useEffect(() => {
    loadCommunityStats();
  }, []);

  const loadCommunityStats = async () => {
    try {
      const response = await communityService.getCommunityStats();
      if (response.success) {
        setCommunityStats([
          { label: 'Active Members', value: response.data.totalMembers?.toString() || '0', icon: Users, color: 'text-blue-600' },
          { label: 'Posts Today', value: response.data.postsToday?.toString() || '0', icon: MessageCircle, color: 'text-green-600' },
          { label: 'Active Challenges', value: response.data.activeChallenges?.toString() || '0', icon: Target, color: 'text-purple-600' },
          { label: 'Support Groups', value: response.data.supportGroups?.toString() || '0', icon: Users, color: 'text-orange-600' }
        ]);
      } else {
        // Set fallback data if API fails
        setCommunityStats([
          { label: 'Active Members', value: '0', icon: Users, color: 'text-blue-600' },
          { label: 'Posts Today', value: '0', icon: MessageCircle, color: 'text-green-600' },
          { label: 'Active Challenges', value: '0', icon: Target, color: 'text-purple-600' },
          { label: 'Support Groups', value: '0', icon: Users, color: 'text-orange-600' }
        ]);
      }
    } catch (error) {
      console.error('Error loading community stats:', error);
      // Set fallback data on error
      setCommunityStats([
        { label: 'Active Members', value: '0', icon: Users, color: 'text-blue-600' },
        { label: 'Posts Today', value: '0', icon: MessageCircle, color: 'text-green-600' },
        { label: 'Active Challenges', value: '0', icon: Target, color: 'text-purple-600' },
        { label: 'Support Groups', value: '0', icon: Users, color: 'text-orange-600' }
      ]);
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Financial Wellness Community
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect, support, and grow together in your financial wellness journey
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </button>
            </div>
          </motion.div>

          {/* Community Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {communityStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-sm transition-all"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{action.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
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
                className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What would you like to create?</h2>
                  <div className="space-y-3">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => {
                            action.action();
                            setShowCreateModal(false);
                          }}
                          className="w-full flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-sm transition-all"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-white">{action.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="mt-4 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default CommunityPage; 