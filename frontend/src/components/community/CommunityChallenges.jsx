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
  Sparkles,
  Crown,
} from 'lucide-react';
import communityService from '../../services/communityService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../ui';

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
    { id: 'all', name: 'All Challenges', icon: Target, color: 'bg-loopfund-neutral-100 text-loopfund-neutral-800', gradient: 'from-loopfund-neutral-500 to-loopfund-neutral-600' },
    { id: 'savings_challenge', name: 'Savings', icon: Target, color: 'bg-loopfund-emerald-100 text-loopfund-emerald-800', gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500' },
    { id: 'debt_free_challenge', name: 'Debt Free', icon: CheckCircle, color: 'bg-loopfund-coral-100 text-loopfund-coral-800', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
    { id: 'no_spend_challenge', name: 'No Spend', icon: X, color: 'bg-loopfund-electric-100 text-loopfund-electric-800', gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500' },
    { id: 'emotional_control', name: 'Emotional Control', icon: Heart, color: 'bg-loopfund-coral-100 text-loopfund-coral-800', gradient: 'from-loopfund-coral-500 to-loopfund-orange-500' },
    { id: 'habit_building', name: 'Habit Building', icon: Zap, color: 'bg-loopfund-gold-100 text-loopfund-gold-800', gradient: 'from-loopfund-gold-500 to-loopfund-orange-500' },
    { id: 'financial_education', name: 'Education', icon: Lightbulb, color: 'bg-loopfund-lavender-100 text-loopfund-lavender-800', gradient: 'from-loopfund-lavender-500 to-loopfund-electric-500' },
    { id: 'mindset_shift', name: 'Mindset', icon: Star, color: 'bg-loopfund-mint-100 text-loopfund-mint-800', gradient: 'from-loopfund-mint-500 to-loopfund-emerald-500' }
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
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-loopfund-coral-500/10 to-loopfund-orange-500/10 rounded-full animate-float"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-loopfund-gold-500/10 to-loopfund-orange-500/10 rounded-full animate-float-delayed"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                Community Challenges
              </h1>
              <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                Join challenges, build habits, and achieve your financial goals together
              </p>
            </div>
            <LoopFundButton
              onClick={() => setShowCreateChallenge(true)}
              variant="primary"
              size="lg"
              icon={<Plus size={20} />}
            >
              Create Challenge
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
                placeholder="Search challenges..."
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
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="ending_soon">Ending Soon</option>
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

        {/* Create Challenge Modal */}
        <AnimatePresence>
          {showCreateChallenge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowCreateChallenge(false)}
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
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-loopfund-coral-500/10 to-loopfund-orange-500/10 rounded-full animate-float"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r from-loopfund-gold-500/10 to-loopfund-orange-500/10 rounded-full animate-float-delayed"></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Target size={24} className="text-white" />
                      </motion.div>
                      <div>
                        <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Create New Challenge</h2>
                        <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Inspire others to achieve their goals</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setShowCreateChallenge(false)}
                      className="w-10 h-10 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl flex items-center justify-center text-loopfund-neutral-500 hover:text-loopfund-neutral-700 dark:hover:text-loopfund-neutral-300 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  <form onSubmit={handleCreateChallenge} className="space-y-6">
                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                        Challenge Title *
                      </label>
                      <LoopFundInput
                        type="text"
                        value={newChallenge.title}
                        onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                        placeholder="What's your challenge about?"
                        maxLength={200}
                        required
                        className="w-full"
                        icon={<Target size={20} />}
                      />
                    </div>

                    <div>
                      <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                        Description *
                      </label>
                      <textarea
                        value={newChallenge.description}
                        onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                        placeholder="Describe your challenge, rules, and goals..."
                        rows={4}
                        className="w-full px-4 py-3 border border-loopfund-neutral-300 dark:border-loopfund-neutral-600 rounded-2xl bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent resize-none font-body text-body"
                        maxLength={1000}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                          Category
                        </label>
                        <select
                          value={newChallenge.category}
                          onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
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
                          Duration (Days)
                        </label>
                        <LoopFundInput
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
                          className="w-full"
                          icon={<Calendar size={20} />}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                          Target Amount ($)
                        </label>
                        <LoopFundInput
                          type="number"
                          value={newChallenge.goals.targetAmount}
                          onChange={(e) => setNewChallenge({
                            ...newChallenge,
                            goals: { ...newChallenge.goals, targetAmount: parseFloat(e.target.value) }
                          })}
                          min="0"
                          step="0.01"
                          className="w-full"
                          icon={<TrendingUp size={20} />}
                        />
                      </div>

                      <div>
                        <label className="block font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-3">
                          Max Participants
                        </label>
                        <LoopFundInput
                          type="number"
                          value={newChallenge.goals.targetParticipants}
                          onChange={(e) => setNewChallenge({
                            ...newChallenge,
                            goals: { ...newChallenge.goals, targetParticipants: parseInt(e.target.value) }
                          })}
                          min="1"
                          max="1000"
                          className="w-full"
                          icon={<Users size={20} />}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <LoopFundButton
                        type="button"
                        onClick={() => setShowCreateChallenge(false)}
                        variant="secondary"
                        size="lg"
                      >
                        Cancel
                      </LoopFundButton>
                      <LoopFundButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        icon={<Target size={18} />}
                      >
                        Create Challenge
                      </LoopFundButton>
                    </div>
                  </form>
                </LoopFundCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenges Grid */}
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
          ) : challenges.length === 0 ? (
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
                <Target size={48} className="mx-auto text-loopfund-neutral-400 mb-4" />
              </motion.div>
              <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">No challenges yet</h3>
              <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Be the first to create a community challenge!</p>
            </motion.div>
          ) : (
            challenges.map((challenge, index) => (
              <motion.div
                key={challenge._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LoopFundCard variant="elevated" className="p-0 overflow-hidden hover:shadow-loopfund-lg transition-all duration-300">
                  {/* Challenge Header with Gradient */}
                  <div className="relative h-20 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {getCategoryIcon(challenge.category)}
                        </motion.div>
                        <div>
                          <h3 className="font-display font-bold text-white text-base">
                            {challenge.title}
                          </h3>
                          <p className="text-white/80 font-body text-xs">
                            {categories.find(c => c.id === challenge.category)?.name}
                          </p>
                        </div>
                      </div>
                      <motion.div 
                        className="bg-loopfund-gold-500/20 backdrop-blur-sm rounded-lg px-3 py-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center space-x-1 text-white text-xs">
                          <Clock size={12} />
                          <span className="font-body">{getDaysRemaining(challenge.duration.endDate)}d left</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Challenge Content */}
                  <div className="p-5">
                    {/* Challenge Description */}
                    <p className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-4 line-clamp-2 leading-relaxed">
                      {challenge.description}
                    </p>

                    {/* Challenge Stats - Modern Cards */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <motion.div 
                        className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl p-3 text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center justify-center mb-1">
                          <Users size={16} className="text-loopfund-emerald-500" />
                        </div>
                        <div className="font-display text-h4 font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {challenge.participants?.length || 0}
                        </div>
                        <div className="font-body text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Participants</div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl p-3 text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center justify-center mb-1">
                          <Calendar size={16} className="text-loopfund-gold-500" />
                        </div>
                        <div className="font-display text-h4 font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {challenge.duration.durationDays}
                        </div>
                        <div className="font-body text-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Days</div>
                      </motion.div>
                    </div>

                    {/* Progress Bar - Modern Design */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between font-body text-sm mb-2">
                        <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 font-medium">Progress</span>
                        <span className="text-loopfund-neutral-900 dark:text-loopfund-dark-text font-bold">
                          {challenge.participants?.length || 0}/{challenge.goals?.targetParticipants || 0}
                        </span>
                      </div>
                      <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 h-3 rounded-full transition-all duration-500 ease-out"
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgressPercentage(challenge)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>

                    {/* Action Button - Modern Design */}
                    <LoopFundButton
                      onClick={() => {
                        const isParticipant = challenge.participants?.some(p => p.user === user?.id);
                        if (isParticipant) {
                          handleLeaveChallenge(challenge._id);
                        } else {
                          handleJoinChallenge(challenge._id);
                        }
                      }}
                      variant={challenge.participants?.some(p => p.user === user?.id) ? "coral" : "primary"}
                      size="lg"
                      className="w-full"
                      icon={challenge.participants?.some(p => p.user === user?.id) ? <X size={16} /> : <Play size={16} />}
                    >
                      {challenge.participants?.some(p => p.user === user?.id) ? 'Leave Challenge' : 'Join Challenge'}
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

export default CommunityChallenges;