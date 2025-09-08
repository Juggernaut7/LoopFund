import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Users, 
  Calendar, 
  TrendingUp, 
  Award, 
  Plus, 
  Clock, 
  CheckCircle,
  X,
  Star,
  BarChart3,
  Trophy,
  Gift,
  Zap,
  Lightbulb,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  StopCircle
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';

const CommunityChallenges = () => {
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    category: 'savings_challenge',
    duration: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      durationDays: 7
    },
    goals: {
      targetAmount: 0,
      targetParticipants: 10
    },
    rules: [],
    tags: []
  });

  const categories = [
    { id: 'all', name: 'All Challenges', icon: Target, color: 'bg-gray-100 text-gray-800' },
    { id: 'savings_challenge', name: 'Savings', icon: TrendingUp, color: 'bg-green-100 text-green-800' },
    { id: 'debt_free_challenge', name: 'Debt Free', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
    { id: 'no_spend_challenge', name: 'No Spend', icon: X, color: 'bg-red-100 text-red-800' },
    { id: 'emotional_control', name: 'Emotional Control', icon: Heart, color: 'bg-purple-100 text-purple-800' },
    { id: 'habit_building', name: 'Habit Building', icon: Zap, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'financial_education', name: 'Education', icon: Lightbulb, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'mindset_shift', name: 'Mindset', icon: Star, color: 'bg-pink-100 text-pink-800' },
    { id: 'community_support', name: 'Community', icon: Users, color: 'bg-orange-100 text-orange-800' }
  ];

  const challengeStatuses = [
    { id: 'draft', name: 'Draft', color: 'bg-gray-500' },
    { id: 'active', name: 'Active', color: 'bg-green-500' },
    { id: 'completed', name: 'Completed', color: 'bg-blue-500' },
    { id: 'cancelled', name: 'Cancelled', color: 'bg-red-500' }
  ];

  useEffect(() => {
    loadChallenges();
    loadUserChallenges();
  }, [currentPage, selectedCategory, sortBy]);

  const loadChallenges = async () => {
    try {
      const filters = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: 'active'
      };
      
      const response = await communityService.getChallenges(currentPage, 10, filters);
      if (response.success) {
        if (currentPage === 1) {
          setChallenges(response.data.challenges);
        } else {
          setChallenges(prev => [...prev, ...response.data.challenges]);
        }
        setHasMore(response.data.pagination.hasNext);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserChallenges = async () => {
    try {
      const response = await communityService.getChallenges(1, 50, { 
        status: 'active',
        participant: user?.id 
      });
      if (response.success) {
        setUserChallenges(response.data.challenges);
      }
    } catch (error) {
      console.error('Error loading user challenges:', error);
    }
  };

  const handleCreateChallenge = async () => {
    try {
      const challengeData = {
        ...newChallenge,
        tags: newChallenge.tags.filter(tag => tag.trim() !== ''),
        rules: newChallenge.rules.filter(rule => rule.trim() !== '')
      };

      const response = await communityService.createChallenge(challengeData);
      if (response.success) {
        setChallenges(prev => [response.data.challenge, ...prev]);
        setShowCreateChallenge(false);
        setNewChallenge({
          title: '',
          description: '',
          category: 'savings_challenge',
          duration: {
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            durationDays: 7
          },
          goals: {
            targetAmount: 0,
            targetParticipants: 10
          },
          rules: [],
          tags: []
        });
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      const response = await communityService.joinChallenge(challengeId);
      if (response.success) {
        setChallenges(prev => prev.map(challenge => 
          challenge._id === challengeId 
            ? { ...challenge, participants: [...challenge.participants, { user: user?.id }] }
            : challenge
        ));
        loadUserChallenges();
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const handleUpdateProgress = async (challengeId, progress, milestone) => {
    try {
      const response = await communityService.updateChallengeProgress(challengeId, progress, milestone);
      if (response.success) {
        setUserChallenges(prev => prev.map(challenge => 
          challenge._id === challengeId 
            ? { ...challenge, userProgress: { ...challenge.userProgress, progress, milestone } }
            : challenge
        ));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = searchTerm === '' || 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'popular':
        return b.participants.length - a.participants.length;
      case 'ending_soon':
        return new Date(a.duration.endDate) - new Date(b.duration.endDate);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const getChallengeProgress = (challenge) => {
    const now = new Date();
    const start = new Date(challenge.duration.startDate);
    const end = new Date(challenge.duration.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Target;
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
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
                Community Challenges
              </h1>
              <p className="text-gray-600">
                Join challenges, build habits, and achieve your financial goals together
              </p>
            </div>
            <button
              onClick={() => setShowCreateChallenge(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Challenge</span>
            </button>
          </div>
        </motion.div>

        {/* User's Active Challenges */}
        {userChallenges.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Active Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userChallenges.map((challenge) => (
                <div key={challenge._id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {getTimeRemaining(challenge.duration.endDate)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{challenge.userProgress?.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${challenge.userProgress?.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{challenge.participants.length} participants</span>
                    <button
                      onClick={() => handleUpdateProgress(challenge._id, Math.min((challenge.userProgress?.progress || 0) + 10, 100), 'Updated progress')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Update Progress
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
                  placeholder="Search challenges..."
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
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="ending_soon">Ending Soon</option>
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

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedChallenges.map((challenge, index) => {
              const Icon = getCategoryIcon(challenge.category);
              const isParticipating = challenge.participants.some(p => p.user === user?.id);
              const progress = getChallengeProgress(challenge);
              
              return (
                <motion.div
                  key={challenge._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Challenge Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(challenge.category)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{challenge.participants.length} participants</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isParticipating && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Joined
                        </span>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {getTimeRemaining(challenge.duration.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Challenge Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {challenge.description}
                  </p>

                  {/* Challenge Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Challenge Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Challenge Goals */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {challenge.goals.targetAmount > 0 && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          ${challenge.goals.targetAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Target</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {challenge.goals.targetParticipants}
                      </div>
                      <div className="text-xs text-gray-600">Participants Goal</div>
                    </div>
                  </div>

                  {/* Tags */}
                  {challenge.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {challenge.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {challenge.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{challenge.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

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
                    {!isParticipating ? (
                      <button
                        onClick={() => handleJoinChallenge(challenge._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Join Challenge
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        View Progress
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
              Load More Challenges
            </button>
          </div>
        )}

        {/* Create Challenge Modal */}
        <AnimatePresence>
          {showCreateChallenge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateChallenge(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Challenge</h2>
                  <button
                    onClick={() => setShowCreateChallenge(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Challenge Title
                    </label>
                    <input
                      type="text"
                      value={newChallenge.title}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter challenge title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newChallenge.description}
                      onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your challenge..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={1000}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newChallenge.category}
                        onChange={(e) => setNewChallenge(prev => ({ ...prev, category: e.target.value }))}
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
                        Duration (days)
                      </label>
                      <input
                        type="number"
                        value={newChallenge.duration.durationDays}
                        onChange={(e) => {
                          const days = parseInt(e.target.value);
                          const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
                          setNewChallenge(prev => ({
                            ...prev,
                            duration: {
                              ...prev.duration,
                              durationDays: days,
                              endDate: endDate.toISOString().split('T')[0]
                            }
                          }));
                        }}
                        min="1"
                        max="365"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Amount ($)
                      </label>
                      <input
                        type="number"
                        value={newChallenge.goals.targetAmount}
                        onChange={(e) => setNewChallenge(prev => ({
                          ...prev,
                          goals: { ...prev.goals, targetAmount: parseFloat(e.target.value) || 0 }
                        }))}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Participants
                      </label>
                      <input
                        type="number"
                        value={newChallenge.goals.targetParticipants}
                        onChange={(e) => setNewChallenge(prev => ({
                          ...prev,
                          goals: { ...prev.goals, targetParticipants: parseInt(e.target.value) || 0 }
                        }))}
                        min="1"
                        max="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowCreateChallenge(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateChallenge}
                      disabled={!newChallenge.title || !newChallenge.description}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Challenge
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

export default CommunityChallenges; 