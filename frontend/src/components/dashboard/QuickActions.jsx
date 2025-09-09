import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Users, 
  Wallet, 
  Zap,
  Plus,
  ArrowRight
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Goal',
      icon: Target,
      color: 'bg-blue-600',
      hoverColor: 'bg-blue-700',
      onClick: () => navigate('/goals/create')
    },
    {
      title: 'Create Group',
      icon: Users,
      color: 'bg-blue-600',
      hoverColor: 'bg-blue-700',
      onClick: () => navigate('/groups/create')
    },
    {
      title: 'Make Payment',
      icon: Wallet,
      color: 'bg-blue-600',
      hoverColor: 'bg-blue-700',
      onClick: () => navigate('/contributions/pay')
    },
    {
      title: 'Quick Save',
      icon: Zap,
      color: 'bg-blue-600',
      hoverColor: 'bg-blue-700',
      onClick: () => navigate('/contributions/quick-save')
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Quick Actions
        </h3>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className={`w-full p-4 rounded-xl ${action.color} hover:${action.hoverColor} text-white transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center space-y-2`}
          >
            <action.icon className="w-6 h-6" />
            <span className="text-sm font-medium">{action.title}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 