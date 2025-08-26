import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, Target } from 'lucide-react';

const ContributionStats = ({ stats }) => {
  // Calculate percentage changes from monthly stats
  const getPercentageChange = (current, previous) => {
    if (!previous || previous === 0) return '+0.0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const currentMonth = stats.monthlyStats?.[0]?.total || 0;
  const previousMonth = stats.monthlyStats?.[1]?.total || 0;
  const currentTotal = stats.totalContributed || 0;
  const previousTotal = stats.previousMonthTotal || 0;
  const currentCount = stats.totalContributions || 0;
  const previousCount = stats.previousMonthCount || 0;
  const currentAvg = stats.averageContribution || 0;
  const previousAvg = stats.previousMonthAverage || 0;

  const statCards = [
    {
      title: 'Total Contributed',
      value: `$${currentTotal.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      change: getPercentageChange(currentTotal, previousTotal),
      changeType: currentTotal >= previousTotal ? 'positive' : 'negative'
    },
    {
      title: 'Total Contributions',
      value: currentCount.toString(),
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      change: getPercentageChange(currentCount, previousCount),
      changeType: currentCount >= previousCount ? 'positive' : 'negative'
    },
    {
      title: 'Average Contribution',
      value: `$${Math.round(currentAvg).toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      change: getPercentageChange(currentAvg, previousAvg),
      changeType: currentAvg >= previousAvg ? 'positive' : 'negative'
    },
    {
      title: 'This Month',
      value: `$${currentMonth.toLocaleString()}`,
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      change: getPercentageChange(currentMonth, previousMonth),
      changeType: currentMonth >= previousMonth ? 'positive' : 'negative'
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