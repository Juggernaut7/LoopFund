import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Banknote,
  Percent,
  Trophy,
  Zap,
  Star,
  User,
  Award,
  Loader,
  Bell,
  Brain, 
  MessageCircle, 
  Lightbulb, 
  Sparkles,
  Heart,
  Gamepad2,
  PiggyBank,
  Building2,
  CreditCard,
  PieChart,
  TrendingDown,
  UserPlus,
  Share2,
  Gift,
  BookOpen
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '../components/ui/StatsCard';
import ProgressRing from '../components/ui/ProgressRing';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import WeatherWidget from '../components/ui/WeatherWidget';
import dashboardService from '../services/dashboardService';
import { useToast } from '../context/ToastContext';
import QuickActions from '../components/dashboard/QuickActions';
import FinancialAdvisor from '../components/ai/FinancialAdvisor';
import AIFinancialAdvisor from '../components/ai/AIFinancialAdvisor';
import { formatCurrencySimple } from '../utils/currency';
import { useWallet } from '../hooks/useWallet';
import WalletCard from '../components/wallet/WalletCard';
import AddMoneyModal from '../components/wallet/AddMoneyModal';

const DashboardPage = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [error, setError] = useState(null);
  const [realAchievements, setRealAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const { toast } = useToast();
  const { wallet, fetchWallet } = useWallet();
  const navigate = useNavigate();

  // Wallet handlers
  const handleAddMoney = () => {
    setShowAddMoneyModal(true);
  };

  const handleAddMoneySuccess = async (data) => {
    // Refresh wallet data after successful deposit
    console.log('🔄 Refreshing wallet after successful deposit...');
    
    // Add a small delay to ensure backend has processed the payment
    setTimeout(async () => {
      await fetchWallet();
      console.log('✅ Wallet refreshed:', wallet);
    }, 1000);
    
    setShowAddMoneyModal(false);
  };

  const handleViewTransactions = () => {
    // TODO: Implement transaction history
    toast.info('Coming Soon', 'Transaction history will be available soon');
  };

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await dashboardService.getDashboardStats();
        setDashboardData(data.data); // Note: data.data because of the API response structure
        
        console.log('Dashboard data fetched:', data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
        toast.error('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Fetch real achievements from dashboard service
  useEffect(() => {
    const fetchRealAchievements = async () => {
      try {
        setAchievementsLoading(true);
        const [achievementsResponse, progressResponse] = await Promise.all([
          dashboardService.getUserAchievements(),
          dashboardService.getAchievementProgress()
        ]);
        
        const progressData = progressResponse.data || {};
        const achievements = progressData.achievements || [];
        
        // Take only the first 4 achievements for dashboard display
        setRealAchievements(achievements.slice(0, 4));
      } catch (error) {
        console.error('Error fetching achievements:', error);
        // Fallback to empty array if fetch fails
        setRealAchievements([]);
      } finally {
        setAchievementsLoading(false);
      }
    };

    if (dashboardData) {
      fetchRealAchievements();
    }
  }, [dashboardData]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-100 via-loopfund-neutral-50 to-loopfund-emerald-50/30 dark:from-loopfund-midnight-900 dark:via-loopfund-midnight-800 dark:to-loopfund-midnight-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Loading your revolutionary dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-100 via-loopfund-neutral-50 to-loopfund-coral-50/30 dark:from-loopfund-midnight-900 dark:via-loopfund-midnight-800 dark:to-loopfund-midnight-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-16 h-16 bg-gradient-to-br from-loopfund-coral-500 to-loopfund-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle className="w-8 h-8 text-white" />
          </motion.div>
          <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">Failed to load dashboard</p>
          <motion.button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 hover:from-loopfund-emerald-600 hover:to-loopfund-mint-600 text-white px-6 py-3 rounded-xl font-body text-body font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  // Update the stats array to use LoopFund design system
  const stats = dashboardData ? [
    {
      title: 'Total Contributed',
      value: formatCurrencySimple(dashboardData.stats.totalContributed),
      change: `+${Math.floor(Math.random() * 20) + 5}% vs last month`,
      changeType: 'positive',
      icon: Banknote,
      color: 'loopfund-emerald',
      gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500'
    },
    {
      title: 'Total Contributions',
      value: dashboardData.stats.totalContributions.toString(),
      change: `+${Math.floor(Math.random() * 15) + 3}% vs last month`,
      changeType: 'positive',
      icon: Target,
      color: 'loopfund-coral',
      gradient: 'from-loopfund-coral-500 to-loopfund-orange-500'
    },
    {
      title: 'Average Contribution',
      value: formatCurrencySimple(dashboardData.stats.averageContribution),
      change: `+${Math.floor(Math.random() * 10) + 2}% vs last month`,
      changeType: 'positive',
      icon: TrendingUp,
      color: 'loopfund-gold',
      gradient: 'from-loopfund-gold-500 to-loopfund-orange-500'
    },
    {
      title: 'This Month',
      value: formatCurrencySimple(dashboardData.stats.thisMonth),
      change: `+${Math.floor(Math.random() * 25) + 10}% vs last month`,
      changeType: 'positive',
      icon: Calendar,
      color: 'loopfund-electric',
      gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500'
    }
  ] : [];

  const recentGoals = dashboardData?.goals?.slice(0, 4) || [];
  const recentContributions = dashboardData?.recentContributions?.slice(0, 5) || [];

  // Generate recent activity from real contributions and goals
  const recentActivity = recentContributions.map((contribution, index) => ({
    id: contribution._id || index,
    type: 'contribution',
    title: `Contribution to ${contribution.goalName || 'Goal'}`,
    description: `Contributed ${formatCurrencySimple(contribution.amount)} to ${contribution.goalType || 'goal'}`,
    amount: contribution.amount,
    date: new Date(contribution.createdAt).toLocaleDateString(),
    icon: contribution.goalType === 'group' ? Users : Target,
    color: contribution.goalType === 'group' ? 'text-loopfund-coral-500' : 'text-loopfund-emerald-500',
    status: 'success' // Add status for proper icon display
  }));

  // Add goal milestones if any goals are close to completion
  const milestoneGoals = recentGoals.filter(goal => {
    const progress = (goal.currentAmount || 0) / (goal.targetAmount || 1);
    return progress >= 0.8 && progress < 1; // 80% to 99% complete
  });

  milestoneGoals.forEach((goal, index) => {
    recentActivity.push({
      id: `milestone-${goal._id}`,
      type: 'milestone',
      title: `${goal.name} milestone reached`,
      description: `Reached ${Math.round((goal.currentAmount / goal.targetAmount) * 100)}% of target`,
      amount: null,
      date: new Date(goal.updatedAt || goal.createdAt).toLocaleDateString(),
      icon: Award,
      color: 'text-loopfund-gold-500',
      status: 'success'
    });
  });

  // Sort by date and take top 5
  const sortedRecentActivity = recentActivity
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Generate upcoming payments from goals (using real data)
  const upcomingPayments = recentGoals.slice(0, 3).map((goal, index) => {
    const remainingAmount = (goal.targetAmount || 0) - (goal.currentAmount || 0);
    const suggestedAmount = Math.max(remainingAmount * 0.1, 10); // 10% of remaining or minimum ₦10
    
    return {
      id: goal._id || index,
      title: goal.name,
      amount: Math.floor(suggestedAmount),
      date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next few days
      type: goal.isGroupGoal ? 'group' : 'individual',
      status: 'scheduled'
    };
  });

  const achievements = realAchievements.length > 0 ? realAchievements : [
    {
      id: 1,
      title: 'First Goal',
      description: 'Created your first savings goal',
      icon: Target,
      color: 'bg-loopfund-emerald-500',
      type: 'individual'
    },
    {
      id: 2,
      title: 'Consistent Saver',
      description: 'Saved for 30 consecutive days',
      icon: Calendar,
      color: 'bg-loopfund-coral-500',
      type: 'individual'
    },
    {
      id: 3,
      title: 'Group Leader',
      description: 'Created and managed a successful group',
      icon: Users,
      color: 'bg-loopfund-gold-500',
      type: 'group'
    },
    {
      id: 4,
      title: 'Milestone Master',
      description: 'Reached 5 goal milestones',
      icon: Award,
      color: 'bg-loopfund-electric-500',
      type: 'both'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'text-loopfund-emerald-600 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/20';
      case 'warning':
        return 'text-loopfund-gold-600 bg-loopfund-gold-100 dark:bg-loopfund-gold-900/20';
      case 'info':
        return 'text-loopfund-electric-600 bg-loopfund-electric-100 dark:bg-loopfund-electric-900/20';
      default:
        return 'text-loopfund-neutral-600 bg-loopfund-neutral-100 dark:bg-loopfund-neutral-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      case 'info':
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'travel':
        return 'bg-loopfund-emerald-500';
      case 'technology':
        return 'bg-loopfund-electric-500';
      case 'emergency':
        return 'bg-loopfund-coral-500';
      default:
        return 'bg-loopfund-neutral-500';
    }
  };

  return (
    <div className="space-y-8">
        {/* Welcome Section with Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-gradient-to-br from-loopfund-emerald-500 via-loopfund-mint-500 to-loopfund-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden"
          >
            {/* Revolutionary Background Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 animate-float" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12 animate-float-slow" />
            
            <div className="relative z-10">
              <motion.h1 
                className="font-display text-display-lg mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome back, {dashboardData?.profile?.firstName || dashboardData?.profile?.name || 'User'}! 👋
              </motion.h1>
              <motion.p 
                className="font-body text-body-lg text-white/90"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                You're making great progress on your savings goals. Keep up the amazing work!
              </motion.p>
            </div>
          </motion.div>
          
          <WeatherWidget />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              color={stat.color}
              gradient={stat.gradient}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Wallet Card */}
        <div className="mb-8">
          {console.log('📊 DashboardPage wallet state:', wallet)}
          <WalletCard 
            wallet={wallet}
            onAddMoney={handleAddMoney}
            onViewTransactions={handleViewTransactions}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Goals */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Recent Goals
                </h3>
                <Link
                  to="/goals"
                  className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-body text-body-sm font-medium transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentGoals.map((goal, index) => (
                  <motion.div
                    key={goal._id || goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-6 rounded-xl bg-loopfund-neutral-50 dark:bg-loopfund-midnight-800/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className={`w-12 h-12 rounded-xl ${
                          goal.isGroupGoal ? 'bg-gradient-to-br from-loopfund-coral-500 to-loopfund-orange-500' : 'bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500'
                        } flex items-center justify-center shadow-lg`}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Target className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h4 className="font-body text-body-lg font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {goal.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            goal.isGroupGoal 
                              ? 'bg-loopfund-coral-100 text-loopfund-coral-700 dark:bg-loopfund-coral-900/30 dark:text-loopfund-coral-300' 
                              : 'bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300'
                          }`}>
                            {goal.isGroupGoal ? 'Group' : 'Individual'}
                          </span>
                          <span className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                            {goal.category || 'Personal'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-body text-body-lg font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {formatCurrencySimple(goal.currentAmount || 0)} / {formatCurrencySimple(goal.targetAmount || 0)}
                      </div>
                      <div className="w-32 h-3 bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full mt-3 overflow-hidden">
                        <motion.div
                          className={`h-3 rounded-full ${
                            goal.isGroupGoal ? 'bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500' : 'bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${goal.targetAmount > 0 ? ((goal.currentAmount || 0) / goal.targetAmount) * 100 : 0}%` 
                          }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Recent Activity
              </h2>
              <button className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium transition-colors">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {sortedRecentActivity.map((activity, index) => (
                <motion.div 
                  key={activity.id} 
                  className="flex items-start space-x-4 p-3 rounded-xl transition-all duration-300 group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div 
                    className={`p-3 rounded-xl ${getStatusColor(activity.status)}`}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {getStatusIcon(activity.status)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {activity.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        {activity.date}
                      </p>
                      {activity.amount && (
                        <p className="font-body text-body-xs font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          ${activity.amount}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Upcoming Payments
              </h2>
              <button className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium transition-colors">
                View calendar
              </button>
            </div>
            <div className="space-y-4">
              {upcomingPayments.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  className="p-6 border border-loopfund-neutral-200 dark:border-loopfund-neutral-600/30 rounded-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-body text-body-lg font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {payment.title}
                    </h3>
                    <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                      {new Date(payment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {formatCurrencySimple(payment.amount)}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium text-loopfund-coral-700 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20 dark:text-loopfund-coral-300 rounded-full">
                      Due Soon
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                Achievements
              </h2>
              <Link
                to="/achievements"
                className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 hover:text-loopfund-emerald-700 dark:hover:text-loopfund-emerald-300 font-medium transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievementsLoading ? (
                <div className="col-span-2 flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mr-3"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Loading achievements...</span>
                </div>
              ) : realAchievements.length > 0 ? (
                realAchievements.map((achievementData, index) => {
                  const { achievement, progress, unlocked } = achievementData;
                  if (!achievement) return null;
                  
                  return (
                    <motion.div
                      key={achievement._id || `achievement-${index}`}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        unlocked 
                          ? 'border-loopfund-emerald-200 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 dark:border-loopfund-emerald-800' 
                          : 'border-loopfund-neutral-200 bg-loopfund-neutral-50 dark:bg-loopfund-midnight-800/50 dark:border-loopfund-neutral-600/30'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`p-2 rounded-lg ${
                            unlocked 
                              ? 'bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/40' 
                              : 'bg-loopfund-neutral-100 dark:bg-loopfund-midnight-900/40'
                          }`}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <span className="text-lg">{achievement.icon}</span>
                        </motion.div>
                        <div>
                          <p className={`font-body text-body-sm font-medium ${
                            unlocked ? 'text-loopfund-emerald-800 dark:text-loopfund-emerald-200' : 'text-loopfund-neutral-500 dark:text-loopfund-neutral-400'
                          }`}>
                            {achievement.name}
                          </p>
                          <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                            {achievement.description}
                          </p>
                          {unlocked && (
                            <div className="flex items-center mt-1">
                              <CheckCircle className="w-3 h-3 text-loopfund-emerald-500 mr-1" />
                              <span className="font-body text-body-xs text-loopfund-emerald-600 dark:text-loopfund-emerald-400">Unlocked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className="p-4 rounded-xl border-2 border-loopfund-emerald-200 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 dark:border-loopfund-emerald-800 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="p-2 rounded-lg bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/40"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <achievement.icon 
                          size={20} 
                          className="text-loopfund-emerald-600 dark:text-loopfund-emerald-400" 
                        />
                      </motion.div>
                      <div>
                        <p className="font-body text-body-sm font-medium text-loopfund-emerald-800 dark:text-loopfund-emerald-200">
                          {achievement.title}
                        </p>
                        <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Overall Progress Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30 text-center"
        >
          <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
            Overall Progress
          </h2>
          <div className="flex justify-center">
            <ProgressRing 
              progress={dashboardData?.stats?.completionRate ? Math.round(dashboardData.stats.completionRate) : 0} 
              size={150} 
              strokeWidth={12} 
              color="#10B981" 
            />
          </div>
          <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mt-6">
            You're {dashboardData?.stats?.completionRate ? Math.round(dashboardData.stats.completionRate) : 0}% of the way to your total savings goal!
          </p>
        </motion.div>

        {/* AI Financial Advisor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-loopfund-dark-surface rounded-2xl p-8 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="p-3 bg-gradient-to-br from-loopfund-electric-500 to-loopfund-lavender-500 rounded-xl shadow-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  AI Financial Advisor
                </h2>
              </div>
              <Link 
                to="/ai-advisor" 
                className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 hover:text-loopfund-emerald-700 dark:hover:text-loopfund-emerald-300 font-medium transition-colors"
              >
                View Full Page →
              </Link>
            </div>
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
              Get personalized financial advice and savings plans from our AI advisor.
            </p>
            <AIFinancialAdvisor />
          </div>
        </motion.div>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Add Money Modal */}
      <AddMoneyModal
        isOpen={showAddMoneyModal}
        onClose={() => setShowAddMoneyModal(false)}
        onSuccess={handleAddMoneySuccess}
      />
    </div>
  );
};

export default DashboardPage;