import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Clock, AlertCircle, Info, Star } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const NotificationBadge = ({ count = 0, onClick }) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <motion.button
      onClick={onClick}
      className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Bell className="w-6 h-6" />
      {count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ${
            isPulsing ? 'animate-pulse' : ''
          }`}
        >
          {count > 99 ? '99+' : count}
        </motion.div>
      )}
    </motion.button>
  );
};

export default NotificationBadge; 