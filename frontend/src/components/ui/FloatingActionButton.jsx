import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Target, 
  Users, 
  Wallet, 
  X,
  Sparkles
} from 'lucide-react';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: Target,
      label: 'New Goal',
      gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500',
      hoverGradient: 'from-loopfund-emerald-600 to-loopfund-mint-600',
      action: () => {
        navigate('/goals/create');
        setIsOpen(false);
      }
    },
    {
      icon: Users,
      label: 'Create Group',
      gradient: 'from-loopfund-coral-500 to-loopfund-orange-500',
      hoverGradient: 'from-loopfund-coral-600 to-loopfund-orange-600',
      action: () => {
        navigate('/groups/create');
        setIsOpen(false);
      }
    },
    {
      icon: Wallet,
      label: 'Make Payment',
      gradient: 'from-loopfund-gold-500 to-loopfund-orange-500',
      hoverGradient: 'from-loopfund-gold-600 to-loopfund-orange-600',
      action: () => {
        navigate('/contributions/pay');
        setIsOpen(false);
      }
    },
    {
      icon: Sparkles,
      label: 'Quick Save',
      gradient: 'from-loopfund-electric-500 to-loopfund-lavender-500',
      hoverGradient: 'from-loopfund-electric-600 to-loopfund-lavender-600',
      action: () => {
        navigate('/contributions/quick-save');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.action}
                className={`bg-gradient-to-r ${action.gradient} hover:bg-gradient-to-r hover:${action.hoverGradient} text-white p-3 rounded-full shadow-loopfund hover:shadow-loopfund-lg transition-all duration-300 flex items-center space-x-3 group relative overflow-hidden`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <motion.div
                  className="relative z-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <action.icon size={20} />
                </motion.div>
                <span className="font-body text-body-sm font-medium whitespace-nowrap relative z-10">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-loopfund-emerald-500 to-loopfund-mint-500 hover:from-loopfund-emerald-600 hover:to-loopfund-mint-600 text-white p-4 rounded-full shadow-loopfund hover:shadow-loopfund-lg transition-all duration-300 relative overflow-hidden group"
      >
        {/* Revolutionary Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <Plus size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;