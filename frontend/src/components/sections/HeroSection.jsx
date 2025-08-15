import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Star,
  Play,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';

// Floating Element Component
const FloatingElement = ({ children, delay = 0, duration = 3 }) => {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);
  const navigate = useNavigate();

  const handleStartSaving = () => {
    navigate('/signup');
  };

  const handleWatchDemo = () => {
    // Could open a modal or navigate to demo page
    alert('Demo video coming soon!');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24">
      {/* Animated Background Elements */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-gentle"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-gentle floating-delayed"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-success-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-gentle floating-slow"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8"
        >
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <FloatingElement delay={0.5} duration={4}>
              <div className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-100 via-secondary-100 to-primary-100 dark:from-primary-900/40 dark:via-secondary-900/40 dark:to-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-primary-200/50 dark:border-primary-700/30">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 via-secondary-400/20 to-primary-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Sparkle effects */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -left-1"
                >
                  <Sparkles className="w-3 h-3 text-primary-500" />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-1 -right-1"
                >
                  <Sparkles className="w-3 h-3 text-secondary-500" />
                </motion.div>
                
                {/* Badge content */}
                <div className="relative flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Logo size="xs" showText={false} animated={false} />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  </motion.div>
                  <span className="relative z-10">
                    Trusted by <span className="font-bold text-primary-800 dark:text-primary-200">10,000+</span> users worldwide
                  </span>
                </div>
                
                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary-300/50 dark:group-hover:border-primary-600/50 transition-all duration-300"></div>
              </div>
            </FloatingElement>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-responsive-xl font-bold text-neutral-900 dark:text-white leading-tight"
          >
            Save Together,{' '}
            <span className="text-gradient">Achieve Together</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-responsive-md text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed"
          >
            LoopFund makes group savings simple, transparent, and rewarding. 
            Set goals, invite friends, and track progress together without the awkward money talks.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button 
              onClick={handleStartSaving}
              className="btn-primary group"
            >
              Start Saving Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleWatchDemo}
              className="btn-secondary group"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-4 md:gap-8 pt-6 md:pt-8"
          >
            <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <span className="text-sm">Bank-level Security</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <span className="text-sm">No Hidden Fees</span>
            </div>
            <div className="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 text-neutral-500 dark:text-neutral-400"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
