import React from 'react';
import { TrendingUp, Target, Calendar } from 'lucide-react';

const SavingsOverview = () => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
        Savings Overview
      </h3>
      
      <div className="space-y-4">
        {/* Monthly Progress */}
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">This Month</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">$320</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-success-600 dark:text-success-400">+12%</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">vs last month</p>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mr-3" />
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Goal Progress</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">68%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">$2,450</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">of $3,600</p>
          </div>
        </div>

        {/* Next Milestone */}
        <div className="flex items-center justify-between p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-success-600 dark:text-success-400 mr-3" />
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Next Milestone</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">$3,000</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">$550 to go</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">~2 months</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">3</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Active Groups</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">12</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsOverview; 