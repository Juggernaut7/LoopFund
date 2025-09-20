import React from 'react';
import { motion } from 'framer-motion';
import { useStaggerAnimation } from '../../hooks/useScrollAnimation';

const StaggeredList = ({
  children,
  staggerDelay = 100,
  animation = 'fadeInUp',
  className = '',
  threshold = 0.1,
  ...props
}) => {
  const { ref, isItemVisible } = useStaggerAnimation(React.Children.count(children), {
    delay: staggerDelay,
    threshold
  });
  
  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 }
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 }
    }
  };
  
  const selectedAnimation = animations[animation] || animations.fadeInUp;
  
  return (
    <div ref={ref} className={className} {...props}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={selectedAnimation.initial}
          animate={isItemVisible(index) ? selectedAnimation.animate : selectedAnimation.initial}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: index * (staggerDelay / 1000)
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export default StaggeredList;
