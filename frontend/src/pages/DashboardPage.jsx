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
  Percent,
  Trophy,
  Zap,
  Star,
  User,
  Award,
  Loader,
  Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/ui/StatsCard';
import ProgressRing from '../components/ui/ProgressRing';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import WeatherWidget from '../components/ui/WeatherWidget';
import dashboardService from '../services/dashboardService';
import { useToast } from '../context/ToastContext';
import QuickActions from '../components/dashboard/QuickActions';

const DashboardPage = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await dashboardService.getDashboardStats();
        setDashboardData(data);
        
        console.log('Dashboard data fetched:', data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
        toast.error('Dashboard Error', 'Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
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
            <p className="text-slate-600 dark:text-slate-400 mb-4">Failed to load dashboard</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Use real data or fallback to empty arrays
  const stats = dashboardData ? [
    {
      title: 'Total Saved',
      value: `$${dashboardData.stats.totalSaved.toLocaleString()}`,
      change: `+$${Math.floor(dashboardData.stats.totalSaved * 0.1).toLocaleString()}`,
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Active Goals',
      value: dashboardData.stats.activeGoals.toString(),
      change: `+${Math.floor(dashboardData.stats.activeGoals * 0.2)}`,
      changeType: 'positive',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Group Contributions',
      value: `$${dashboardData.stats.groupSavings.toLocaleString()}`,
      change: `+$${Math.floor(dashboardData.stats.groupSavings * 0.15).toLocaleString()}`,
      changeType: 'positive',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Individual Savings',
      value: `$${dashboardData.stats.individualSavings.toLocaleString()}`,
      change: `+$${Math.floor(dashboardData.stats.individualSavings * 0.12).toLocaleString()}`,
      changeType: 'positive',
      icon: User,
      color: 'from-orange-500 to-red-500'
    }
  ] : [];

  const recentGoals = dashboardData?.goals?.slice(0, 4) || [];
  const recentContributions = dashboardData?.recentContributions?.slice(0, 5) || [];

  // Generate recent activity from real contributions and goals
  const recentActivity = recentContributions.map((contribution, index) => ({
    id: contribution._id || index,
    type: 'contribution',
    title: `Contribution to ${contribution.goalName || 'Goal'}`,
    description: `Contributed $${contribution.amount} to ${contribution.goalType || 'goal'}`,
    amount: contribution.amount,
    date: new Date(contribution.createdAt).toLocaleDateString(),
    icon: contribution.goalType === 'group' ? Users : Target,
    color: contribution.goalType === 'group' ? 'text-purple-500' : 'text-blue-500',
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
      color: 'text-yellow-500',
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
    const suggestedAmount = Math.max(remainingAmount * 0.1, 10); // 10% of remaining or minimum $10
    
    return {
      id: goal._id || index,
      title: goal.name,
      amount: Math.floor(suggestedAmount),
      date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next few days
      type: goal.isGroupGoal ? 'group' : 'individual',
      status: 'scheduled'
    };
  });

  const achievements = [
    {
      id: 1,
      title: 'First Goal',
      description: 'Created your first savings goal',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      type: 'individual'
    },
    {
      id: 2,
      title: 'Consistent Saver',
      description: 'Saved for 30 consecutive days',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      type: 'individual'
    },
    {
      id: 3,
      title: 'Group Leader',
      description: 'Created and managed a successful group',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      type: 'group'
    },
    {
      id: 4,
      title: 'Milestone Master',
      description: 'Reached 5 goal milestones',
      icon: Award,
      color: 'from-orange-500 to-red-500',
      type: 'both'
    },
    {
      id: 5,
      title: 'Savings Champion',
      description: 'Saved over $10,000 total',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      type: 'both'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'info':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
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
        return 'bg-blue-500';
      case 'technology':
        return 'bg-purple-500';
      case 'emergency':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section with Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {dashboardData?.profile?.firstName || dashboardData?.profile?.name || 'User'}! 👋
              </h1>
              <p className="text-blue-100">
                You're making great progress on your savings goals. Keep up the amazing work!
              </p>
            </div>
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
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
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Goals */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Recent Goals
                </h3>
                <Link
                  to="/goals"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentGoals.map((goal) => (
                  <motion.div
                    key={goal._id || goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                        goal.isGroupGoal ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-cyan-500'
                      } flex items-center justify-center`}>
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          {goal.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            goal.isGroupGoal 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {goal.isGroupGoal ? 'Group' : 'Individual'}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {goal.category || 'Personal'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        ${(goal.currentAmount || 0).toLocaleString()} / ${(goal.targetAmount || 0).toLocaleString()}
                      </div>
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            goal.isGroupGoal ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}
                          style={{ 
                            width: `${goal.targetAmount > 0 ? ((goal.currentAmount || 0) / goal.targetAmount) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Activity
              </h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {sortedRecentActivity.map((activity) => (
                <motion.div 
                  key={activity.id} 
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {activity.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.date}
                      </p>
                      {activity.amount && (
                        <p className="text-xs font-medium text-slate-900 dark:text-white">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Upcoming Payments
              </h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">
                View calendar
              </button>
            </div>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {payment.title}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(payment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      ${payment.amount}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
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
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Achievements
              </h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    achievement.type === 'individual' 
                      ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800' 
                      : 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.type === 'individual' 
                        ? 'bg-blue-100 dark:bg-blue-900/40' 
                        : 'bg-purple-100 dark:bg-purple-900/40'
                    }`}>
                      <achievement.icon 
                        size={20} 
                        className={achievement.type === 'individual' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'} 
                      />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        achievement.type === 'individual' ? 'text-blue-800 dark:text-blue-200' : 'text-purple-800 dark:text-purple-200'
                      }`}>
                        {achievement.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Overall Progress Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Overall Progress
          </h2>
          <div className="flex justify-center">
            <ProgressRing 
              progress={dashboardData?.stats?.completionRate ? Math.round(dashboardData.stats.completionRate) : 0} 
              size={150} 
              strokeWidth={12} 
              color="#3B82F6" 
            />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            You're {dashboardData?.stats?.completionRate ? Math.round(dashboardData.stats.completionRate) : 0}% of the way to your total savings goal!
          </p>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </Layout>
  );
};

export default DashboardPage; 