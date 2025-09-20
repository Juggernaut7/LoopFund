import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Banknote, Sparkles, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoopFundCard } from '../ui';
import { formatCurrencySimple } from '../../utils/currency';

const GroupCard = ({ name, members, saved, target, progress, nextContribution, dueDate, groupId = 1 }) => {
  const navigate = useNavigate();

  const handleGroupClick = () => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <motion.div
      onClick={handleGroupClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="cursor-pointer"
    >
      <LoopFundCard variant="elevated" hover className="h-full relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float-delayed" />
        </div>

        <div className="relative p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-loopfund rounded-xl flex items-center justify-center shadow-loopfund flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Users className="w-5 h-5 text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-1 truncate">
                    {name}
                  </h3>
                  <div className="flex items-center text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="font-body text-body-sm">{members} members</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right ml-4">
              <p className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                {formatCurrencySimple(saved)}
              </p>
              <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                of {formatCurrencySimple(target)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-body text-body font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Progress</span>
              <span className="font-display text-h3 text-loopfund-emerald-600">{progress}%</span>
            </div>
            <div className="w-full bg-loopfund-neutral-200 dark:bg-loopfund-neutral-700 rounded-full h-3 overflow-hidden">
              <motion.div 
                className="bg-gradient-loopfund h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Next Contribution & Due Date */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              <motion.div 
                className="w-8 h-8 bg-gradient-coral rounded-lg flex items-center justify-center mr-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Banknote className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <p className="font-body text-body-sm font-medium">Next Contribution</p>
                <p className="font-display text-h4 text-loopfund-coral-600">{formatCurrencySimple(nextContribution)}</p>
              </div>
            </div>
            <div className="flex items-center text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              <motion.div 
                className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center mr-3"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Calendar className="w-4 h-4 text-white" />
              </motion.div>
              <div className="text-right">
                <p className="font-body text-body-sm font-medium">Due Date</p>
                <p className="font-display text-h4 text-loopfund-gold-600">{dueDate}</p>
              </div>
            </div>
          </div>

          {/* Floating Sparkles on Hover */}
          <motion.div
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-5 h-5 text-loopfund-gold-500" />
          </motion.div>
        </div>
      </LoopFundCard>
    </motion.div>
  );
};

export default GroupCard;