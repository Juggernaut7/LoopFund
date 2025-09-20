import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const LoopFundCard = React.forwardRef(({
  className,
  variant = 'standard',
  children,
  hover = true,
  onClick,
  ...props
}, ref) => {
  const baseClasses = "relative overflow-hidden transition-all duration-300";
  
  const variants = {
    standard: "bg-loopfund-neutral-50 border border-loopfund-neutral-300 rounded-2xl shadow-loopfund hover:shadow-loopfund-md",
    elevated: "bg-loopfund-neutral-50 border border-loopfund-neutral-300 rounded-2xl shadow-loopfund-lg",
    floating: "bg-loopfund-neutral-50 border border-loopfund-neutral-300 rounded-3xl shadow-loopfund-xl",
    asymmetric: "bg-loopfund-neutral-50 border border-loopfund-neutral-300 rounded-2xl shadow-loopfund clip-path-asymmetric",
    gradient: "bg-gradient-loopfund text-white rounded-2xl shadow-loopfund-lg",
    glass: "bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-loopfund",
    dark: "bg-loopfund-dark-surface border border-loopfund-dark-elevated rounded-2xl shadow-loopfund-lg"
  };
  
  const hoverEffects = hover ? {
    whileHover: { 
      y: -8, 
      scale: 1.02,
      rotate: 0, // Removed the rotation that was causing the bending effect
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    whileTap: { scale: 0.98 }
  } : {};
  
  const cardClasses = cn(
    baseClasses,
    variants[variant],
    onClick && "cursor-pointer",
    className
  );
  
  return (
    <motion.div
      ref={ref}
      className={cardClasses}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...hoverEffects}
      {...props}
    >
      {/* Top accent bar for standard cards */}
      {variant === 'standard' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-loopfund" />
      )}
      
      {/* Floating elements for elevated cards */}
      {variant === 'elevated' && (
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-loopfund opacity-10 rounded-full blur-xl" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Hover glow effect */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-loopfund opacity-0 hover:opacity-5 transition-opacity duration-300 rounded-2xl" />
      )}
    </motion.div>
  );
});

LoopFundCard.displayName = "LoopFundCard";

// Card Header Component
export const LoopFundCardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  >
    {children}
  </div>
));

LoopFundCardHeader.displayName = "LoopFundCardHeader";

// Card Title Component
export const LoopFundCardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn("text-h3 font-display font-semibold leading-none tracking-tight text-loopfund-neutral-800", className)}
    {...props}
  >
    {children}
  </h3>
));

LoopFundCardTitle.displayName = "LoopFundCardTitle";

// Card Description Component
export const LoopFundCardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn("text-body text-loopfund-neutral-600", className)}
    {...props}
  >
    {children}
  </p>
));

LoopFundCardDescription.displayName = "LoopFundCardDescription";

// Card Content Component
export const LoopFundCardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

LoopFundCardContent.displayName = "LoopFundCardContent";

// Card Footer Component
export const LoopFundCardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

LoopFundCardFooter.displayName = "LoopFundCardFooter";

export default LoopFundCard;
