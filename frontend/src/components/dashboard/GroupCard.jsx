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
      <LoopFundCard className="h-full p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 bg-loopfund-emerald-100 rounded-full">
                <Users className="w-6 h-6 text-loopfund-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-h3 text-loopfund-neutral-900 mb-1 truncate">
                  {name}
                </h3>
                <div className="flex items-center text-loopfund-neutral-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-body text-body-sm">{members} members</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right ml-4">
            <p className="font-display text-h2 text-loopfund-neutral-900">
              {formatCurrencySimple(saved)}
            </p>
            <p className="font-body text-body-sm text-loopfund-neutral-600">
              of {formatCurrencySimple(target)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-body text-body font-medium text-loopfund-neutral-700">Progress</span>
            <span className="font-display text-h3 text-loopfund-emerald-600">{progress}%</span>
          </div>
          <div className="w-full bg-loopfund-neutral-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="bg-loopfund-emerald-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Next Contribution & Due Date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-loopfund-neutral-600">
            <div className="p-2 bg-loopfund-coral-100 rounded-lg mr-3">
              <Banknote className="w-4 h-4 text-loopfund-coral-600" />
            </div>
            <div>
              <p className="font-body text-body-sm font-medium">Next Contribution</p>
              <p className="font-display text-h4 text-loopfund-coral-600">{formatCurrencySimple(nextContribution)}</p>
            </div>
          </div>
          <div className="flex items-center text-loopfund-neutral-600">
            <div className="p-2 bg-loopfund-gold-100 rounded-lg mr-3">
              <Calendar className="w-4 h-4 text-loopfund-gold-600" />
            </div>
            <div className="text-right">
              <p className="font-body text-body-sm font-medium">Due Date</p>
              <p className="font-display text-h4 text-loopfund-gold-600">{dueDate}</p>
            </div>
          </div>
        </div>
      </LoopFundCard>
    </motion.div>
  );
};

export default GroupCard;