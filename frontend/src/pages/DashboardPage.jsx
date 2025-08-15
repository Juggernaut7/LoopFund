import React, { useState } from 'react';
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
  Star
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/ui/StatsCard';
import ProgressRing from '../components/ui/ProgressRing';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import WeatherWidget from '../components/ui/WeatherWidget';

const DashboardPage = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Mock data
  const stats = [
    {
      title: 'Total Savings',
      value: '$12,450',
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Active Goals',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Group Members',
      value: '24',
      change: '+5',
      changeType: 'positive',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'This Month',
      value: '$2,100',
      change: '+8.2%',
      changeType: 'positive',
      icon: Wallet,
      color: 'orange'
    }
  ];

  const recentGoals = [
    {
      id: 1,
      name: 'Vacation Fund',
      target: 5000,
      current: 3200,
      deadline: '2024-06-15',
      status: 'active',
      category: 'travel'
    },
    {
      id: 2,
      name: 'New Laptop',
      target: 1200,
      current: 1200,
      deadline: '2024-04-20',
      status: 'completed',
      category: 'technology'
    },
    {
      id: 3,
      name: 'Emergency Fund',
      target: 10000,
      current: 4500,
      deadline: '2024-12-31',
      status: 'active',
      category: 'emergency'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'contribution',
      title: 'Made contribution to Vacation Fund',
      amount: '$150',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'goal_completed',
      title: 'Completed New Laptop goal',
      amount: '$1200',
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'group_joined',
      title: 'Joined Family Savings group',
      amount: null,
      time: '2 days ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Vacation Fund payment due',
      amount: '$150',
      time: '3 days ago',
      status: 'warning'
    }
  ];

  const upcomingPayments = [
    {
      id: 1,
      goal: 'Vacation Fund',
      amount: 150,
      dueDate: '2024-03-25',
      status: 'pending'
    },
    {
      id: 2,
      goal: 'Emergency Fund',
      amount: 200,
      dueDate: '2024-03-28',
      status: 'pending'
    },
    {
      id: 3,
      goal: 'Family Savings',
      amount: 100,
      dueDate: '2024-03-30',
      status: 'pending'
    }
  ];

  const achievements = [
    { id: 1, title: 'First Goal', description: 'Created your first savings goal', icon: Target, earned: true },
    { id: 2, title: 'Consistent Saver', description: 'Made 10 consecutive contributions', icon: Trophy, earned: true },
    { id: 3, title: 'Group Leader', description: 'Created a savings group', icon: Users, earned: true },
    { id: 4, title: 'Goal Crusher', description: 'Completed 5 goals', icon: Star, earned: false },
    { id: 5, title: 'Power Saver', description: 'Saved $10,000 total', icon: Zap, earned: false }
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
              <h1 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={stat.title}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Goal Progress
              </h2>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {recentGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                const isCompleted = goal.status === 'completed';
                
                return (
                  <motion.div 
                    key={goal.id} 
                    className="space-y-2 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(goal.category)}`} />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {goal.name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Due {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900 dark:text-white">
                          ${goal.current.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          of ${goal.target.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        {progress.toFixed(1)}% complete
                      </span>
                      {isCompleted && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Completed! 🎉
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

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
              {recentActivity.map((activity) => (
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
                        {activity.time}
                      </p>
                      {activity.amount && (
                        <p className="text-xs font-medium text-slate-900 dark:text-white">
                          {activity.amount}
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
                      {payment.goal}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(payment.dueDate).toLocaleDateString()}
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
                    achievement.earned 
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' 
                      : 'border-slate-200 bg-slate-50 dark:bg-slate-700/50 dark:border-slate-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned 
                        ? 'bg-green-100 dark:bg-green-900/40' 
                        : 'bg-slate-100 dark:bg-slate-700'
                    }`}>
                      <achievement.icon 
                        size={20} 
                        className={achievement.earned ? 'text-green-600 dark:text-green-400' : 'text-slate-400'} 
                      />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        achievement.earned ? 'text-green-800 dark:text-green-200' : 'text-slate-500 dark:text-slate-400'
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
            <ProgressRing progress={64} size={150} strokeWidth={12} color="#3B82F6" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            You're 64% of the way to your total savings goal!
          </p>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </Layout>
  );
};

export default DashboardPage; 