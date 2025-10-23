import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  Users, 
  DollarSign,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  Loader,
  AlertCircle,
  TrendingUp,
  Zap,
  Heart,
  Shield,
  Gift,
  Sparkles,
  Crown,
  Banknote,
  PiggyBank,
  Building2,
  User,
  Calendar as CalendarIcon,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';
import { useAuthStore } from '../store/useAuthStore';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../components/ui';
import { formatCurrencySimple } from '../utils/currency';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  // Achievement categories
  const categories = [
    { id: 'all', name: 'All Achievements', icon: Trophy },
    { id: 'savings', name: '$ Savings', icon: DollarSign },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'streaks', name: 'Streaks', icon: Zap }
  ];

  // Map backend categories to frontend categories
  const mapBackendCategoryToFrontend = (achievement) => {
    // Use the category directly from the backend if available
    if (achievement.category) {
      return achievement.category;
    }
    
    // Fallback to type-based mapping
    const type = achievement.type;
    switch (type) {
      case 'first_goal':
      case 'goal_completed':
        return 'goals';
      case 'first_contribution':
      case 'contribution_streak':
      case 'savings_milestone':
        return 'savings';
      case 'group_creator':
      case 'group_member':
        return 'social';
      case 'weekly_saver':
      case 'monthly_saver':
        return 'streaks';
      default:
        return 'goals'; // fallback
    }
  };

  // Filter achievements based on selected category
  const filteredAchievements = achievements.filter(achievementData => {
    if (selectedCategory === 'all') return true;
    
    const frontendCategory = mapBackendCategoryToFrontend(achievementData.achievement);
    return frontendCategory === selectedCategory;
  });

  // Debug logging
  console.log('Selected category:', selectedCategory);
  console.log('Total achievements:', achievements.length);
  console.log('Filtered achievements:', filteredAchievements.length);
  console.log('Filtered achievement names:', filteredAchievements.map(a => a.achievement?.name));
  console.log('All achievement categories:', achievements.map(a => ({
    name: a.achievement?.name,
    type: a.achievement?.type,
    category: a.achievement?.category,
    mappedCategory: mapBackendCategoryToFrontend(a.achievement)
  })));

  // Fetch achievements and user stats on component mount
  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching achievements...');
      
      // Check authentication status
      const authStore = useAuthStore.getState();
      console.log('🔐 Auth store state:', authStore);
      console.log('🔐 Is authenticated:', authStore.isAuthenticated);
      console.log('🔐 User data:', authStore.user);
      console.log('🔐 Token available:', !!authStore.token);
      
      // If not authenticated, try to get token from localStorage
      if (!authStore.isAuthenticated) {
        const localToken = localStorage.getItem('token');
        console.log('🔐 Local storage token:', localToken ? 'Available' : 'Not found');
        
        if (localToken) {
          // Try to decode the token to get user info
          try {
            const payload = JSON.parse(atob(localToken.split('.')[1]));
            console.log('🔐 Token payload:', payload);
            console.log('🔐 User ID from token:', payload.userId);
          } catch (e) {
            console.log('🔐 Could not decode token:', e);
          }
        }
      }
      
      // Fetch achievements from backend
      const [achievementsResponse, progressResponse] = await Promise.all([
        dashboardService.getUserAchievements(),
        dashboardService.getAchievementProgress()
      ]);
      
      console.log('📊 Achievements Response:', achievementsResponse);
      console.log('📈 Progress Response:', progressResponse);
      
      const userAchievements = achievementsResponse.data || [];
      const progressData = progressResponse.data || {};
      const achievements = progressData.achievements || [];
      const stats = progressData.stats || {};
      
      console.log('🎯 Processed Data:');
      console.log('- User Achievements:', userAchievements.length);
      console.log('- Progress Achievements:', achievements.length);
      console.log('- Stats:', stats);
      
      setUserStats(stats);
      setAchievements(achievements);
      
      console.log('✅ Achievements loaded successfully!');
      console.log('Achievement categories found:', achievements.map(a => ({
        name: a.achievement?.name,
        type: a.achievement?.type,
        category: a.achievement?.category
      })));
    } catch (error) {
      console.error('❌ Error fetching achievements:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(error.message);
      toast.error('Achievements Error', 'Failed to load achievements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check for new achievements when component mounts
  useEffect(() => {
    const checkNewAchievements = async () => {
      try {
        console.log('🔍 Checking for new achievements...');
        const response = await dashboardService.checkAchievements();
        console.log('🎉 Check achievements response:', response);
        if (response.data?.newlyUnlocked > 0) {
          toast.success('New Achievements!', response.message);
          // Refresh achievements after unlocking new ones
          fetchAchievements();
        }
      } catch (error) {
        console.error('❌ Error checking achievements:', error);
        console.error('Error details:', error.response?.data || error.message);
      }
    };

    // Only check if we have achievements loaded 
    if (achievements.length > 0) {
      checkNewAchievements();
    }
  }, [achievements.length]);

  const calculateUserStats = (goals, profile) => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const totalContributed = goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0);
    const totalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
    const groupGoals = goals.filter(g => g.isGroupGoal).length;
    const individualGoals = goals.filter(g => !g.isGroupGoal).length;
    
    // Calculate days since joining (assuming profile.createdAt exists)
    const joinDate = profile.createdAt ? new Date(profile.createdAt) : new Date();
    const daysSinceJoining = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));
    
    // Calculate completion rate
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    
    // Calculate average goal amount
    const avgGoalAmount = totalGoals > 0 ? totalTarget / totalGoals : 0;
    
    return {
      totalGoals,
      completedGoals,
      totalContributed,
      totalTarget,
      groupGoals,
      individualGoals,
      daysSinceJoining,
      completionRate,
      avgGoalAmount,
      profile
    };
  };

  const generateAchievements = (stats) => {
    const achievements = [];
    
    // Savings achievements
    if (stats.totalContributed >= 1000) {
      achievements.push({
        id: 'savings_1000',
        title: 'First Grand',
        description: 'Save your first $1,000',
        category: 'savings',
        icon: DollarSign,
        color: 'from-blue-500 to-blue-600',
        unlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString()
      });
    } else if (stats.totalContributed >= 500) {
      achievements.push({
        id: 'savings_500',
        title: 'Halfway There',
        description: 'Save your first $500',
        category: 'savings',
        icon: DollarSign,
        color: 'from-blue-500 to-blue-600',
        unlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString()
      });
    } else {
      achievements.push({
        id: 'savings_500',
        title: 'Halfway There',
        description: 'Save your first $500',
        category: 'savings',
        icon: DollarSign,
        color: 'from-slate-300 to-slate-400',
        unlocked: false,
        progress: (stats.totalContributed / 500) * 100,
        unlockedAt: null
      });
    }
    
    if (stats.totalContributed >= 5000) {
      achievements.push({
        id: 'savings_5000',
        title: 'Big Saver',
        description: 'Save $5,000 or more',
        category: 'savings',
        icon: DollarSign,
        color: 'from-blue-500 to-blue-600',
        unlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString()
      });
    } else {
      achievements.push({
        id: 'savings_5000',
        title: 'Big Saver',
        description: 'Save $5,000 or more',
        category: 'savings',
        icon: DollarSign,
        color: 'from-slate-300 to-slate-400',
        unlocked: false,
        progress: (stats.totalContributed / 5000) * 100,
        unlockedAt: null
      });
    }
    
    // Goal achievements
    if (stats.completedGoals >= 1) {
      achievements.push({
        id: 'goal_first',
        title: 'Goal Getter',
        description: 'Complete your first goal',
        category: 'goals',
        icon: Target,
        color: 'from-blue-500 to-blue-600',
        unlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString()
      });
    } else {
      achievements.push({
        id: 'goal_first',
        title: 'Goal Getter',
        description: 'Complete your first goal',
        category: 'goals',
        icon: Target,
        color: 'from-slate-300 to-slate-400',
        unlocked: false,
        progress: 0,
        unlockedAt: null
      });
    }
    
    if (stats.completedGoals >= 5) {
      achievements.push({
        id: 'goal_master',
        title: 'Goal Master',
        description: 'Complete 5 goals',
        category: 'goals',
        icon: Target,
        color: 'from-blue-500 to-blue-600',
        unlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString()
      });
    } else {
      achievements.push({
        id: 'goal_master',
        title: 'Goal Master',
        description: 'Complete 5 goals',
        category: 'goals',
        icon: Target,
        color: 'from-slate-300 to-slate-400',
        unlocked: false,
        progress: (stats.completedGoals / 5) * 100,
        unlockedAt: null
      });
    }
    
    // Social achievements
    if (stats.groupGoals >= 1) {
      achievements.push({
        id: 'social_group',
        title: 'Team Player',
        description: 'Join your first group goal',
        category: 'social',
        icon: Users,
        color: 'from-blue-500 to-blue-600',
        unlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString()
      });
    } else {
      achievements.push({
        id: 'social_group',
        title: 'Team Player',
        description: 'Join your first group goal',
        category: 'social',
        icon: Users,
        color: 'from-slate-300 to-slate-400',
        unlocked: false,
        progress: 0,
        unlockedAt: null
      });
    }
    
    // Streak achievements
    if (stats.daysSinceJoining >= 30) {
      achievements.push({
        id: 'streak_month',
        title: 'Month Warrior',
        description: 'Stay active for 30 days',
        category: 'streaks',
        icon: Calendar,
        color: 'from-blue-500 to-blue-600',
        unlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString()
      });
    } else {
      achievements.push({
        id: 'streak_month',
        title: 'Month Warrior',
        description: 'Stay active for 30 days',
        category: 'streaks',
        icon: Calendar,
        color: 'from-slate-300 to-slate-400',
        unlocked: false,
        progress: (stats.daysSinceJoining / 30) * 100,
        unlockedAt: null
      });
    }
    
    if (stats.daysSinceJoining >= 100) {
      achievements.push({
        id: 'streak_century',
        title: 'Century Club',
        description: 'Stay active for 100 days',
        category: 'streaks',
        icon: Calendar,
        color: 'from-blue-500 to-blue-600',
        unlocked: true,
        progress: 100,
        unlockedAt: new Date().toISOString()
      });
    } else {
      achievements.push({
        id: 'streak_century',
        title: 'Century Club',
        description: 'Stay active for 100 days',
        category: 'streaks',
        icon: Calendar,
        color: 'from-slate-300 to-slate-400',
        unlocked: false,
        progress: (stats.daysSinceJoining / 100) * 100,
        unlockedAt: null
      });
    }
    
    return achievements;
  };

  // Calculate stats from backend data
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const completionRate = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-loopfund rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Loading Your Achievements
          </h3>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Preparing your milestone celebrations...
          </p>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20 rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <AlertCircle className="w-10 h-10 text-loopfund-coral-600" />
          </motion.div>
          <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
            Failed to Load Achievements
          </h2>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
            {error}
          </p>
          <LoopFundButton
            onClick={fetchAchievements}
            variant="primary"
            size="lg"
            icon={<Trophy className="w-5 h-5" />}
          >
            Try Again
          </LoopFundButton>
        </motion.div>
      </div>
    );
  }

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'savings':
        return DollarSign;
      case 'goals':
        return Target;
      case 'social':
        return Users;
      case 'streaks':
        return Zap;
      default:
        return Trophy; // Fallback icon
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'bg-slate-200 dark:bg-slate-700 text-slate-500';
      case 'uncommon':
        return 'bg-blue-200 dark:bg-blue-700 text-blue-600';
      case 'rare':
        return 'bg-purple-200 dark:bg-purple-700 text-purple-600';
      case 'epic':
        return 'bg-indigo-200 dark:bg-indigo-700 text-indigo-600';
      case 'legendary':
        return 'bg-orange-200 dark:bg-orange-700 text-orange-600';
      case 'mythic':
        return 'bg-red-200 dark:bg-red-700 text-red-600';
      default:
        return 'bg-slate-200 dark:bg-slate-700 text-slate-500';
    }
  };

  const renderAchievement = (achievementData) => {
    const { achievement, progress, unlocked, unlockedAt } = achievementData;
    
    if (!achievement) return null;

    const Icon = getAchievementIcon(achievement.type);
    const rarityColor = getRarityColor(achievement.rarity);
    const progressPercentage = Math.min(progress || 0, 100);

    return (
      <motion.div
        key={achievement._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 transition-all duration-300 ${
          unlocked 
            ? 'border-green-200 dark:border-green-700 shadow-lg' 
            : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        {/* Achievement Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              unlocked 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                : 'bg-slate-200 dark:bg-slate-700'
            }`}>
              {achievement.icon || <Icon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${
                unlocked 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {achievement.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {achievement.description}
              </p>
            </div>
          </div>
          
          {/* Rarity Badge */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            unlocked ? rarityColor : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
          }`}>
            {achievement.rarity}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                unlocked 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-blue-400 to-blue-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Achievement Details */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-slate-600 dark:text-slate-400">
              Points: {achievement.points}
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Category: {achievement.category}
            </span>
          </div>
          
          {unlocked && unlockedAt && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Unlock Animation */}
        {unlocked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-loopfund-neutral-50 dark:bg-loopfund-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Revolutionary Header */}
        <motion.div 
          className="relative mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative flex items-center justify-between">
            <div>
              <motion.h1 
                className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Achievements & Milestones
              </motion.h1>
              <motion.p 
                className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Celebrate your financial victories and unlock amazing badges
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <LoopFundButton
                variant="gold"
                size="lg"
                icon={<Download className="w-5 h-5" />}
              >
                Export Achievements
              </LoopFundButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Revolutionary Achievement Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative group"
          >
            <LoopFundCard className="min-h-[140px] p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Total Achievements</p>
                  <p className="font-display text-h3 text-loopfund-neutral-900">{totalAchievements}</p>
                </div>
                <div className="p-3 bg-loopfund-emerald-100 rounded-full">
                  <Trophy className="w-6 h-6 text-loopfund-emerald-600" />
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative group"
          >
            <LoopFundCard className="min-h-[140px] p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Unlocked</p>
                  <p className="font-display text-h3 text-loopfund-gold-600">{unlockedAchievements}</p>
                </div>
                <div className="p-3 bg-loopfund-gold-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-loopfund-gold-600" />
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative group"
          >
            <LoopFundCard className="min-h-[140px] p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Completion Rate</p>
                  <p className="font-display text-h3 text-loopfund-coral-600">{Math.round(completionRate)}%</p>
                </div>
                <div className="p-3 bg-loopfund-coral-100 rounded-full">
                  <Target className="w-6 h-6 text-loopfund-coral-600" />
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative group"
          >
            <LoopFundCard className="min-h-[140px] p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Points Earned</p>
                  <p className="font-display text-h3 text-loopfund-electric-600">
                    {achievements.reduce((sum, a) => sum + (a.achievement?.points || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-loopfund-electric-100 rounded-full">
                  <Star className="w-6 h-6 text-loopfund-electric-600" />
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
        </motion.div>

        {/* Revolutionary Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="relative"
        >
          <LoopFundCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-loopfund-electric-100 rounded-lg">
                  <Filter className="w-5 h-5 text-loopfund-electric-600" />
                </div>
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Filter Achievements
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-loopfund-emerald-500 rounded-full"></div>
                <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                  {filteredAchievements.length} achievements
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-3 rounded-xl font-body text-body font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-loopfund-emerald-600 text-white shadow-lg'
                        : 'bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-dark-surface'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </LoopFundCard>
        </motion.div>

        {/* Revolutionary Achievements Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {filteredAchievements.map((achievementData, index) => {
            const { achievement, progress, unlocked, unlockedAt } = achievementData;
            
            if (!achievement) return null;

            const progressPercentage = Math.min(progress || 0, 100);
            const Icon = getAchievementIcon(achievement.type);

            return (
              <motion.div
                key={achievement._id || `achievement-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="group"
              >
                <LoopFundCard 
                  variant="elevated" 
                  className={`h-full transition-all duration-300 ${
                    unlocked 
                      ? 'ring-2 ring-loopfund-emerald-200 dark:ring-loopfund-emerald-800 shadow-loopfund-lg' 
                      : 'hover:shadow-loopfund'
                  }`}
                >
                  <div className="p-6">
                    {/* Achievement Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                            unlocked 
                              ? 'bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500' 
                              : 'bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700'
                          }`}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <span className="text-2xl">{achievement.icon}</span>
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-display text-h4 mb-1 truncate ${
                            unlocked 
                              ? 'text-loopfund-neutral-900 dark:text-loopfund-dark-text' 
                              : 'text-loopfund-neutral-500 dark:text-loopfund-neutral-400'
                          }`}>
                            {achievement.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              unlocked 
                                ? 'bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300' 
                                : 'bg-loopfund-neutral-100 text-loopfund-neutral-600 dark:bg-loopfund-neutral-800 dark:text-loopfund-neutral-400'
                            }`}>
                              {achievement.category}
                            </span>
                            <span className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                              {achievement.points} pts
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {unlocked && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-6 h-6 bg-loopfund-emerald-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>

                    {/* Achievement Description */}
                    <p className={`font-body text-body-sm mb-6 line-clamp-2 ${
                      unlocked 
                        ? 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400' 
                        : 'text-loopfund-neutral-400 dark:text-loopfund-neutral-500'
                    }`}>
                      {achievement.description}
                    </p>

                    {/* Progress Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Progress</span>
                        <span className="font-display text-h5 text-loopfund-emerald-600">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-2 rounded-full ${
                            unlocked 
                              ? 'bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500' 
                              : 'bg-gradient-to-r from-loopfund-electric-400 to-loopfund-electric-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Achievement Footer */}
                    <div className="pt-4 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {unlocked ? (
                            <>
                              <div className="w-2 h-2 bg-loopfund-emerald-500 rounded-full"></div>
                              <span className="font-body text-body-sm text-loopfund-emerald-600 font-medium">
                                Unlocked
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-loopfund-neutral-400 rounded-full"></div>
                              <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                                In Progress
                              </span>
                            </>
                          )}
                        </div>
                        
                        {unlocked && unlockedAt && (
                          <div className="text-right">
                            <span className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                              {new Date(unlockedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </LoopFundCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Revolutionary Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-loopfund-neutral-400" />
            </div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
              {selectedCategory === 'all' ? 'No Achievements Yet' : 'No achievements in this category'}
            </h3>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8 max-w-md mx-auto">
              {selectedCategory === 'all' 
                ? 'Start your financial journey to unlock amazing achievements and badges'
                : 'Try selecting a different category or complete more goals to unlock achievements'
              }
            </p>
            {selectedCategory === 'all' && (
              <LoopFundButton
                variant="primary"
                size="lg"
                icon={<Target className="w-5 h-5" />}
              >
                Start Your Journey
              </LoopFundButton>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage; 