import { useEffect, useRef, useState } from 'react';

/**
 * Hook for scroll-triggered animations
 * Uses Intersection Observer for performance
 */
export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0
  } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) setHasTriggered(true);
            }, delay);
          } else {
            setIsVisible(true);
            if (triggerOnce) setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay]);
  
  return {
    ref: elementRef,
    isVisible: triggerOnce ? (hasTriggered || isVisible) : isVisible
  };
};

/**
 * Hook for staggered animations
 * Animates children elements with delays
 */
export const useStaggerAnimation = (itemCount, options = {}) => {
  const {
    delay = 100,
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px'
  } = options;
  
  const [visibleItems, setVisibleItems] = useState(new Set());
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate items with stagger
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, i]));
            }, i * delay);
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    observer.observe(container);
    
    return () => {
      observer.unobserve(container);
    };
  }, [itemCount, delay, threshold, rootMargin]);
  
  return {
    ref: containerRef,
    visibleItems,
    isItemVisible: (index) => visibleItems.has(index)
  };
};

/**
 * Hook for parallax scrolling effects
 */
export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        setOffset(rate);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return {
    ref: elementRef,
    offset
  };
};

/**
 * Hook for counter animations
 */
export const useCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const animate = () => {
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = count;
    const difference = end - startValue;
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * easeOut);
      
      setCount(Math.floor(currentValue));
      
      if (progress === 1) {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, 16); // ~60fps
    
    return () => clearInterval(timer);
  };
  
  return {
    count,
    isAnimating,
    animate
  };
};

/**
 * Hook for mouse tracking (for custom cursor effects)
 */
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return mousePosition;
};

/**
 * Hook for reduced motion preference
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};
