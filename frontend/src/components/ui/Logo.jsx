import React from 'react';
import { motion } from 'framer-motion';
import logoImage from '../../assets/logo.jpg';

const Logo = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  onClick = null,
  animated = true 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl'
  };

  const LogoContent = () => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-xl overflow-hidden shadow-lg border-2 border-white/20 dark:border-white/10`}>
        <img 
          src={logoImage} 
          alt="LoopFund Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <span className={`font-bold text-gradient-static ${textSizes[size]}`}>
          LoopFund
        </span>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={onClick}
        className={onClick ? 'cursor-pointer' : ''}
      >
        <LogoContent />
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      <LogoContent />
    </div>
  );
};

export default Logo;
