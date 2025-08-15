import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, change, changeType, icon: Icon, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
            {title}
          </p>
          <motion.p 
            className="text-2xl font-bold text-slate-900 dark:text-white mt-1"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
          >
            {value}
          </motion.p>
        </div>
        <motion.div 
          className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20 group-hover:scale-110 transition-transform duration-200`}
          whileHover={{ rotate: 5 }}
        >
          <Icon size={24} className={`text-${color}-600 dark:text-${color}-400`} />
        </motion.div>
      </div>
      
      {change && (
        <motion.div 
          className="flex items-center mt-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.3, duration: 0.3 }}
        >
          {changeType === 'positive' ? (
            <ArrowUpRight size={16} className="text-green-500 mr-1" />
          ) : (
            <ArrowDownRight size={16} className="text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">from last month</span>
        </motion.div>
      )}
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default StatsCard; 