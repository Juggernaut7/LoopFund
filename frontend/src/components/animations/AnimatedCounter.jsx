import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCounter } from '../../hooks/useScrollAnimation';

const AnimatedCounter = ({
  end,
  start = 0,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  format = 'number',
  trigger = true,
  ...props
}) => {
  const { count, isAnimating, animate } = useCounter(end, duration, start);
  const [hasTriggered, setHasTriggered] = useState(false);
  
  useEffect(() => {
    if (trigger && !hasTriggered) {
      animate();
      setHasTriggered(true);
    }
  }, [trigger, hasTriggered, animate]);
  
  const formatNumber = (num) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(num);
      case 'percentage':
        return `${num}%`;
      case 'compact':
        return new Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: 1
        }).format(num);
      default:
        return num.toLocaleString();
    }
  };
  
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...props}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
