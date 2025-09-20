import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const AnimatedSection = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
  stagger = 0,
  ...props
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce,
    delay
  });
  
  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, ease: "easeOut" }
    },
    fadeInDown: {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, ease: "easeOut" }
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, ease: "easeOut" }
    },
    fadeInRight: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, ease: "easeOut" }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration, ease: "easeOut" }
    },
    flipIn: {
      initial: { opacity: 0, rotateY: -90 },
      animate: { opacity: 1, rotateY: 0 },
      transition: { duration, ease: "easeOut" }
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, ease: "easeOut" }
    }
  };
  
  const selectedAnimation = animations[animation] || animations.fadeInUp;
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={selectedAnimation.initial}
      animate={isVisible ? selectedAnimation.animate : selectedAnimation.initial}
      transition={{
        ...selectedAnimation.transition,
        delay: stagger
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
