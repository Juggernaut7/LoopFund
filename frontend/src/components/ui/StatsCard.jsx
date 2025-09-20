import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, change, changeType, icon: Icon, color, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group bg-white dark:bg-loopfund-dark-surface rounded-2xl p-6 shadow-loopfund border border-loopfund-neutral-200/20 dark:border-loopfund-neutral-600/30 hover:shadow-loopfund-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      {/* Revolutionary Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300D4AA' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className={`absolute top-4 right-4 w-8 h-8 bg-${color}-500/10 rounded-full blur-xl animate-float`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400 group-hover:text-loopfund-neutral-700 dark:group-hover:text-loopfund-neutral-300 transition-colors">
              {title}
            </p>
            <motion.p 
              className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mt-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, duration: 0.3 }}
            >
              {value}
            </motion.p>
          </div>
          <motion.div 
            className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Icon size={24} className="text-white" />
          </motion.div>
        </div>
        
        {change && (
          <motion.div 
            className="flex items-center mt-6"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3, duration: 0.3 }}
          >
            {changeType === 'positive' ? (
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ArrowUpRight size={16} className="text-loopfund-emerald-500 mr-2" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ArrowDownRight size={16} className="text-loopfund-coral-500 mr-2" />
              </motion.div>
            )}
            <span className={`font-body text-body-sm font-medium ${
              changeType === 'positive' ? 'text-loopfund-emerald-600 dark:text-loopfund-emerald-400' : 'text-loopfund-coral-600 dark:text-loopfund-coral-400'
            }`}>
              {change}
            </span>
          </motion.div>
        )}
      </div>
      
      {/* Hover effect overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-${color}-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
    </motion.div>
  );
};

export default StatsCard;