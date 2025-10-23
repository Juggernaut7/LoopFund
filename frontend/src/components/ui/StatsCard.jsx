import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, change, changeType, icon: Icon, color, gradient, delay = 0 }) => {
  // Map color to icon background classes
  const getIconBg = (color) => {
    switch (color) {
      case 'emerald': return 'bg-loopfund-emerald-100';
      case 'coral': return 'bg-loopfund-coral-100';
      case 'gold': return 'bg-loopfund-gold-100';
      case 'lavender': return 'bg-loopfund-lavender-100';
      case 'electric': return 'bg-loopfund-electric-100';
      case 'mint': return 'bg-loopfund-mint-100';
      default: return 'bg-loopfund-neutral-100';
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case 'emerald': return 'text-loopfund-emerald-600';
      case 'coral': return 'text-loopfund-coral-600';
      case 'gold': return 'text-loopfund-gold-600';
      case 'lavender': return 'text-loopfund-lavender-600';
      case 'electric': return 'text-loopfund-electric-600';
      case 'mint': return 'text-loopfund-mint-600';
      default: return 'text-loopfund-neutral-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2 }}
      className="group bg-white rounded-2xl p-6 shadow-loopfund border border-loopfund-neutral-200 hover:shadow-loopfund-lg transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">
            {title}
          </p>
          <motion.p 
            className="font-display text-h3 text-loopfund-neutral-900"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
          >
            {value}
          </motion.p>
        </div>
        <div className={`p-3 ${getIconBg(color)} rounded-full`}>
          <Icon size={24} className={getIconColor(color)} />
        </div>
      </div>
      
      {change && (
        <motion.div 
          className="flex items-center mt-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.3, duration: 0.3 }}
        >
          {changeType === 'positive' ? (
            <ArrowUpRight size={16} className="text-loopfund-emerald-500 mr-2" />
          ) : (
            <ArrowDownRight size={16} className="text-loopfund-coral-500 mr-2" />
          )}
          <span className={`font-body text-body-sm font-medium ${
            changeType === 'positive' ? 'text-loopfund-emerald-600' : 'text-loopfund-coral-600'
          }`}>
            {change}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatsCard;