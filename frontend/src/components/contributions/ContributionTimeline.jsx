import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Target, Users, Calendar, CheckCircle } from 'lucide-react';

const ContributionTimeline = ({ contributions }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Calendar className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <CheckCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type) => {
    return type === 'group' ? <Users className="w-4 h-4" /> : <Target className="w-4 h-4" />;
  };

  if (contributions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm border border-slate-200 dark:border-slate-700">
        <DollarSign className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No contributions yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Start your savings journey by adding your first contribution!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
        Recent Contributions
      </h3>
      
      <div className="space-y-4">
        {contributions.map((contribution, index) => (
          <motion.div
            key={contribution._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    ${contribution.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {contribution.description || 'Contribution'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {contribution.goal?.name || 'Goal'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(contribution.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  {getTypeIcon(contribution.type)}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {contribution.type === 'group' ? 'Group' : 'Individual'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {getStatusIcon(contribution.status)}
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {contribution.status}
                  </span>
                </div>
                
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {contribution.method.replace('_', ' ')}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContributionTimeline; 