import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const LoopFundButton = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'default',
  children,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  ...props
}, ref) => {
  const baseClasses = "relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-loopfund text-white shadow-loopfund hover:shadow-loopfund-md hover:scale-105 focus:ring-loopfund-emerald-500",
    secondary: "bg-loopfund-coral-500 text-white shadow-loopfund hover:shadow-loopfund-md hover:scale-105 focus:ring-loopfund-coral-500",
    ghost: "border-2 border-loopfund-electric-500 text-loopfund-electric-500 bg-transparent hover:bg-loopfund-electric-500 hover:text-white focus:ring-loopfund-electric-500",
    outline: "border-2 border-loopfund-emerald-500 text-loopfund-emerald-500 bg-transparent hover:bg-loopfund-emerald-500 hover:text-white focus:ring-loopfund-emerald-500",
    gold: "bg-gradient-gold text-loopfund-midnight-900 shadow-loopfund hover:shadow-loopfund-md hover:scale-105 focus:ring-loopfund-gold-500",
    pill: "bg-gradient-loopfund text-white shadow-loopfund hover:shadow-loopfund-md hover:scale-105 focus:ring-loopfund-emerald-500 rounded-full",
    trapezoid: "bg-gradient-coral text-white shadow-loopfund hover:shadow-loopfund-md hover:scale-105 focus:ring-loopfund-coral-500 clip-path-trapezoid"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    default: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
    xl: "px-10 py-5 text-xl rounded-3xl"
  };
  
  const iconSizes = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7"
  };
  
  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );
  
  const iconClasses = cn(
    iconSizes[size],
    iconPosition === 'left' ? 'mr-2' : 'ml-2'
  );
  
  const LoadingSpinner = () => (
    <motion.div
      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
  
  const handleClick = (e) => {
    if (disabled || loading) return;
    
    // Ripple effect
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('absolute', 'bg-white', 'bg-opacity-30', 'rounded-full', 'animate-ripple', 'pointer-events-none');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    onClick?.(e);
  };
  
  return (
    <motion.button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && (
        <span className={iconClasses}>{icon}</span>
      )}
      {!loading && children}
      {!loading && icon && iconPosition === 'right' && (
        <span className={iconClasses}>{icon}</span>
      )}
    </motion.button>
  );
});

LoopFundButton.displayName = "LoopFundButton";

export default LoopFundButton;
