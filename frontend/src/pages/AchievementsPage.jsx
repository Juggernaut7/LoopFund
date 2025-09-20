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
  Gift
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';
import { useAuthStore } from '../store/useAuthStore';

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading your achievements...</p>
          </div>
        </div>
    );
  }

  // Show error state
  if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">Failed to load achievements</p>
            <button 
              onClick={fetchAchievements} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Achievements & Milestones
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Track your progress and unlock badges
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Total Achievements</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalAchievements}</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Unlocked</p>
                <p className="text-3xl font-bold text-green-600">{unlockedAchievements}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-600">{Math.round(completionRate)}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievementData, index) => {
            const { achievement, progress, unlocked, unlockedAt } = achievementData;
            
            if (!achievement) return null;

            return (
              <motion.div
                key={achievement._id || `achievement-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-200 ${
                  unlocked ? 'ring-2 ring-green-500/20' : ''
                }`}
              >
                <div className="text-center">
                  {/* Achievement Icon */}
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${
                    unlocked ? 'from-blue-500 to-blue-600' : 'from-slate-300 to-slate-400'
                  } flex items-center justify-center mx-auto mb-4 ${
                    !unlocked ? 'grayscale opacity-50' : ''
                  }`}>
                    <span className="text-3xl">{achievement.icon}</span>
                  </div>
                  
                  {/* Achievement Info */}
                  <h3 className={`text-lg font-semibold mb-2 ${
                    unlocked 
                      ? 'text-slate-900 dark:text-white' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {achievement.name}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${
                    unlocked 
                      ? 'text-slate-600 dark:text-slate-400' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full mb-3">
                    <div
                      className={`h-2 rounded-full ${
                        unlocked 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                          : 'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress || 0, 100)}%` }}
                    />
                  </div>
                  
                  {/* Criteria */}
                  {achievementData.criteria && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {achievementData.criteria}
                    </p>
                  )}
                  
                  {/* Status */}
                  <div className="flex items-center justify-center space-x-2">
                    {unlocked ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Unlocked
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {Math.round(progress || 0)}% Complete
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Unlock Date */}
                  {unlocked && unlockedAt && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Unlocked {new Date(unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No achievements in this category
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try selecting a different category or complete more goals to unlock achievements
            </p>
          </motion.div>
        )}
      </div>
  );
};

export default AchievementsPage; 