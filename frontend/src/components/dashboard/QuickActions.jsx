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

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Goal',
      icon: Target,
      gradient: 'from-loopfund-emerald-500 to-loopfund-emerald-600',
      hoverGradient: 'from-loopfund-emerald-600 to-loopfund-emerald-700',
      onClick: () => navigate('/goals/create')
    },
    {
      title: 'Create Group',
      icon: Users,
      gradient: 'from-loopfund-emerald-500 to-loopfund-emerald-600',
      hoverGradient: 'from-loopfund-emerald-600 to-loopfund-emerald-700',
      onClick: () => navigate('/groups/create')
    },
    {
      title: 'Make Payment',
      icon: Wallet,
      gradient: 'from-loopfund-emerald-500 to-loopfund-emerald-600',
      hoverGradient: 'from-loopfund-emerald-600 to-loopfund-emerald-700',
      onClick: () => navigate('/contributions/pay')
    },
    {
      title: 'Quick Save',
      icon: Zap,
      gradient: 'from-loopfund-emerald-500 to-loopfund-emerald-600',
      hoverGradient: 'from-loopfund-emerald-600 to-loopfund-emerald-700',
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
          <motion.button
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className={`w-full p-6 rounded-2xl bg-gradient-to-br ${action.gradient} text-white transition-all duration-300 shadow-loopfund flex flex-col items-center space-y-3 relative overflow-hidden group`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000" />
            
            {/* Revolutionary Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            
            <motion.div
              className="relative z-10"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <action.icon className="w-8 h-8" />
            </motion.div>
            <span className="font-body text-body-sm font-medium relative z-10">{action.title}</span>
            
            {/* Floating sparkle */}
            <motion.div
              className="absolute top-2 right-2 opacity-0 transition-opacity duration-300"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-white/80" />
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;