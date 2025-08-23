import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, Target } from 'lucide-react';

const ContributionStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Contributed',
      value: `$${stats.totalContributed.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Contributions',
      value: stats.totalContributions.toString(),
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Average Contribution',
      value: `$${Math.round(stats.averageContribution).toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      change: '+5.1%',
      changeType: 'positive'
    },
    {
      title: 'This Month',
      value: `$${stats.monthlyStats?.[0]?.total?.toLocaleString() || '0'}`,
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      change: '+15.3%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stat.value}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">vs last month</span>
              </div>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ContributionStats; 