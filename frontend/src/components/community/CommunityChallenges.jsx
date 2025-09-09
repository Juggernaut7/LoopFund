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
  StopCircle,
  User,
  Eye,
  Tag,
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';

const CommunityChallenges = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
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
    { id: 'savings_challenge', name: 'Savings', icon: Target, color: 'bg-green-100 text-green-800' },
    { id: 'debt_free_challenge', name: 'Debt Free', icon: CheckCircle, color: 'bg-red-100 text-red-800' },
    { id: 'no_spend_challenge', name: 'No Spend', icon: X, color: 'bg-blue-100 text-blue-800' },
    { id: 'emotional_control', name: 'Emotional Control', icon: Heart, color: 'bg-pink-100 text-pink-800' },
    { id: 'habit_building', name: 'Habit Building', icon: Zap, color: 'bg-purple-100 text-purple-800' },
    { id: 'financial_education', name: 'Education', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'mindset_shift', name: 'Mindset', icon: Star, color: 'bg-indigo-100 text-indigo-800' }
  ];

  useEffect(() => {
    loadChallenges();
  }, [selectedCategory, sortBy]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await communityService.getChallenges(1, 20, filters);
      
      if (response.success) {
        setChallenges(response.data.challenges || []);
      } else {
        toast.error('Failed to load challenges');
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    
    if (!newChallenge.title.trim() || !newChallenge.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await communityService.createChallenge(newChallenge);
      
      if (response.success) {
        toast.success('Challenge created successfully!');
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
        loadChallenges();
      } else {
        toast.error(response.error || 'Failed to create challenge');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error('Failed to create challenge');
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      const response = await communityService.joinChallenge(challengeId);
      if (response.success) {
        toast.success('Joined challenge successfully!');
        loadChallenges();
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast.error('Failed to join challenge');
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    try {
      const response = await communityService.leaveChallenge(challengeId);
      if (response.success) {
        toast.success('Left challenge successfully!');
        loadChallenges();
      }
    } catch (error) {
      console.error('Error leaving challenge:', error);
      toast.error('Failed to leave challenge');
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    const IconComponent = cat ? cat.icon : Target;
    return <IconComponent size={20} className="text-white" />;
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

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getProgressPercentage = (challenge) => {
    if (!challenge.goals?.targetParticipants) return 0;
    const participants = challenge.participants?.length || 0;
    return Math.min((participants / challenge.goals.targetParticipants) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Community Challenges
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join challenges, build habits, and achieve your financial goals together
            </p>
          </div>
          <button
            onClick={() => setShowCreateChallenge(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span>Create Challenge</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search challenges..."
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
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="ending_soon">Ending Soon</option>
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

      {/* Create Challenge Modal */}
      <AnimatePresence>
        {showCreateChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateChallenge(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Challenge</h2>
                <button
                  onClick={() => setShowCreateChallenge(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCreateChallenge} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Challenge Title *
                  </label>
                  <input
                    type="text"
                    value={newChallenge.title}
                    onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                    placeholder="What's your challenge about?"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={200}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    placeholder="Describe your challenge, rules, and goals..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    maxLength={1000}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newChallenge.category}
                      onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
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
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={newChallenge.duration.durationDays}
                      onChange={(e) => {
                        const days = parseInt(e.target.value);
                        const startDate = new Date(newChallenge.duration.startDate);
                        const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
                        setNewChallenge({
                          ...newChallenge,
                          duration: {
                            ...newChallenge.duration,
                            durationDays: days,
                            endDate: endDate.toISOString().split('T')[0]
                          }
                        });
                      }}
                      min="1"
                      max="365"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Amount ($)
                    </label>
                    <input
                      type="number"
                      value={newChallenge.goals.targetAmount}
                      onChange={(e) => setNewChallenge({
                        ...newChallenge,
                        goals: { ...newChallenge.goals, targetAmount: parseFloat(e.target.value) }
                      })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={newChallenge.goals.targetParticipants}
                      onChange={(e) => setNewChallenge({
                        ...newChallenge,
                        goals: { ...newChallenge.goals, targetParticipants: parseInt(e.target.value) }
                      })}
                      min="1"
                      max="1000"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateChallenge(false)}
                    className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                  >
                    Create Challenge
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenges Grid */}
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
        ) : challenges.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Target size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No challenges yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Be the first to create a community challenge!</p>
          </div>
        ) : (
          challenges.map((challenge) => (
            <motion.div
              key={challenge._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              {/* Challenge Header with Gradient */}
              <div className="relative h-20 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Target size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        {challenge.title}
                      </h3>
                      <p className="text-white text-opacity-80 text-xs">
                        {categories.find(c => c.id === challenge.category)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="bg-orange-500 bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="flex items-center space-x-1 text-white text-xs">
                      <Clock size={12} />
                      <span>{getDaysRemaining(challenge.duration.endDate)}d left</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenge Content */}
              <div className="p-5">
                {/* Challenge Description */}
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Challenge Stats - Modern Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users size={16} className="text-blue-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {challenge.participants?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Participants</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar size={16} className="text-purple-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {challenge.duration.durationDays}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
                  </div>
                </div>

                {/* Progress Bar - Modern Design */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      {challenge.participants?.length || 0}/{challenge.goals?.targetParticipants || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${getProgressPercentage(challenge)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button - Modern Design */}
                <button
                  onClick={() => {
                    const isParticipant = challenge.participants?.some(p => p.user === user?.id);
                    if (isParticipant) {
                      handleLeaveChallenge(challenge._id);
                    } else {
                      handleJoinChallenge(challenge._id);
                    }
                  }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                    challenge.participants?.some(p => p.user === user?.id)
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 border border-red-200 dark:border-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {challenge.participants?.some(p => p.user === user?.id) ? (
                    <div className="flex items-center justify-center space-x-2">
                      <X size={16} />
                      <span>Leave Challenge</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Play size={16} />
                      <span>Join Challenge</span>
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

export default CommunityChallenges;