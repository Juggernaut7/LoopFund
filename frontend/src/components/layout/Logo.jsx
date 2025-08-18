import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Logo = ({ className = '', size = 'default', showText = true }) => {
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`${sizeClasses[size]} relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300`}
      >
        <img
          src="/src/assets/logo1jpp.png"
          alt="LoopFund Logo"
          className="w-full h-full object-cover"
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: [-100, 100]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {showText && (
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          <span className={`font-bold text-slate-900 dark:text-white ${textSizes[size]} leading-tight`}>
            LoopFund
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Smart Savings
          </span>
        </motion.div>
      )}
    </Link>
  );
};

export default Logo; 