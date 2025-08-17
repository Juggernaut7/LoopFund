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
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';
import dashboardService from '../services/dashboardService';

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
    { id: 'savings', name: 'Savings', icon: DollarSign },
    { id: 'goals', name: 'Goals', icon: Target },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'streaks', name: 'Streaks', icon: Zap }
  ];

  // Fetch achievements and user stats on component mount
  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch user data for achievements
      const [goalsResponse, profileResponse] = await Promise.all([
        dashboardService.getUserGoals(),
        dashboardService.getUserProfile()
      ]);
      
      const goals = goalsResponse.data || [];
      const profile = profileResponse.data || profileResponse;
      
      // Calculate user stats
      const stats = calculateUserStats(goals, profile);
      setUserStats(stats);
      
      // Generate achievements based on stats
      const userAchievements = generateAchievements(stats);
      setAchievements(userAchievements);
      
      console.log('Achievements generated:', userAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError(error.message);
      toast.error('Achievements Error', 'Failed to load achievements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        color: 'from-green-500 to-emerald-500',
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
        color: 'from-blue-500 to-cyan-500',
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
        color: 'from-purple-500 to-pink-500',
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
        color: 'from-yellow-500 to-orange-500',
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
        color: 'from-indigo-500 to-purple-500',
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
        color: 'from-pink-500 to-rose-500',
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
        color: 'from-teal-500 to-cyan-500',
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
        color: 'from-amber-500 to-yellow-500',
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

  // Filter achievements by category
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  // Calculate achievement stats
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const completionRate = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading your achievements...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
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

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Achievements</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalAchievements}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Unlocked</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {unlockedAchievements}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {completionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>
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
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
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
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-200 ${
                achievement.unlocked ? 'ring-2 ring-green-500/20' : ''
              }`}
            >
              <div className="text-center">
                {/* Achievement Icon */}
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center mx-auto mb-4 ${
                  !achievement.unlocked ? 'grayscale opacity-50' : ''
                }`}>
                  <achievement.icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Achievement Info */}
                <h3 className={`text-lg font-semibold mb-2 ${
                  achievement.unlocked 
                    ? 'text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {achievement.title}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  achievement.unlocked 
                    ? 'text-slate-600 dark:text-slate-400' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {achievement.description}
                </p>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full mb-3">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${achievement.color}`}
                    style={{ width: `${Math.min(achievement.progress, 100)}%` }}
                  />
                </div>
                
                {/* Status */}
                <div className="flex items-center justify-center space-x-2">
                  {achievement.unlocked ? (
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
                        {achievement.progress.toFixed(0)}% Complete
                      </span>
                    </>
                  )}
                </div>
                
                {/* Unlock Date */}
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
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
    </Layout>
  );
};

export default AchievementsPage; 