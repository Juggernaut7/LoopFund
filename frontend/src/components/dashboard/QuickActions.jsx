import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Wallet, 
  Zap,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { LoopFundCard } from '../ui';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Goal',
      description: 'Create a new savings goal',
      icon: Target,
      iconBg: 'bg-loopfund-emerald-100',
      iconColor: 'text-loopfund-emerald-600',
      onClick: () => navigate('/goals/create')
    },
    {
      title: 'Create Group',
      description: 'Start a group savings',
      icon: Users,
      iconBg: 'bg-loopfund-coral-100',
      iconColor: 'text-loopfund-coral-600',
      onClick: () => navigate('/groups/create')
    },
    {
      title: 'Make Payment',
      description: 'Add money to wallet',
      icon: Wallet,
      iconBg: 'bg-loopfund-gold-100',
      iconColor: 'text-loopfund-gold-600',
      onClick: () => navigate('/contributions/pay')
    },
    {
      title: 'Quick Save',
      description: 'Instant contribution',
      icon: Zap,
      iconBg: 'bg-loopfund-lavender-100',
      iconColor: 'text-loopfund-lavender-600',
      onClick: () => navigate('/contributions/quick-save')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
          Quick Actions
        </h3>
        <motion.button 
          onClick={() => navigate('/dashboard')}
          className="font-body text-body-sm text-loopfund-emerald-600 dark:text-loopfund-emerald-400 font-medium flex items-center space-x-2 transition-colors"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="cursor-pointer"
          >
            <LoopFundCard className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-body text-body-sm font-medium text-loopfund-neutral-900 mb-1">
                    {action.title}
                  </h4>
                  <p className="font-body text-body-xs text-loopfund-neutral-600">
                    {action.description}
                  </p>
                </div>
                <div className={`p-3 ${action.iconBg} rounded-full`}>
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
              </div>
            </LoopFundCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;