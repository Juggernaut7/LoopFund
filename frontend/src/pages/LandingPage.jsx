import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Target, 
  Users, 
  TrendingUp, 
  Shield,
  Zap,
  Award,
  CheckCircle,
  Star,
  ArrowDown,
  // Replace with more common icons:
  Home,
  Car,
  BookOpen,
  Plane,
  Gift,
  Heart,
  Play,
  Sparkles,
  Zap as Lightning
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import Lottie from 'lottie-react';
import heroAnimation from '../assets/hero-animation.json';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-50px" });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      // Calculate scroll progress
      const scrollTop = currentScrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
      
      // Determine scroll direction
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
    };
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [lastScrollY]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // GetAnchor-style falling animation variants
  const fallingStatsVariants = {
    hidden: {
      y: -200,
      opacity: 0,
      rotateX: 45,
      scale: 0.8
    },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        delay: i * 0.1,
        duration: 0.8
      }
    })
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const featuresVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const featureCardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const stats = [
    {
      icon: Target,
      value: "10,000+",
      label: "Goals Achieved",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      value: "5,000+",
      label: "Active Groups",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      value: "$2.5M+",
      label: "Total Saved",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Award,
      value: "98%",
      label: "Success Rate",
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Smart Goal Setting",
      description: "Set personalized savings goals with AI-powered recommendations",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Group Savings",
      description: "Save together with friends and family for shared goals",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Real-time analytics and insights to keep you motivated",
      color: "text-green-600"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level security to protect your financial data",
      color: "text-orange-600"
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "One-click payments and automated savings",
      color: "text-red-600"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Gamified experience with badges and milestones",
      color: "text-indigo-600"
    }
  ];

  const goalExamples = [
    { icon: Home, title: 'Home Down Payment', amount: '$50,000', type: 'individual' },
    { icon: Car, title: 'New Car', amount: '$25,000', type: 'individual' },
    { icon: BookOpen, title: 'Education Fund', amount: '$15,000', type: 'individual' },
    { icon: Plane, title: 'Family Vacation', amount: '$8,000', type: 'group' },
    { icon: Gift, title: 'Wedding Gift', amount: '$5,000', type: 'group' },
    { icon: Heart, title: 'Emergency Fund', amount: '$10,000', type: 'individual' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Individual Saver',
      content: 'I saved $15,000 for my dream vacation in just 8 months! The goal tracking kept me motivated.',
      avatar: 'SJ',
      type: 'individual'
    },
    {
      name: 'The Martinez Family',
      role: 'Group Savers',
      content: 'We saved together for our family trip to Europe. Everyone contributed and we reached our goal!',
      avatar: 'MF',
      type: 'group'
    },
    {
      name: 'David Chen',
      role: 'Student',
      content: 'Perfect for saving my part-time earnings for college expenses. The automation is amazing.',
      avatar: 'DC',
      type: 'individual'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation isScrolled={isScrolled} />
      
      {/* Unique Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full z-40">
        {/* Animated Progress Bar */}
        <div className="relative h-2 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 overflow-hidden">
          {/* Main Progress */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            style={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
          
          {/* Animated Shimmer Effect */}
          <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: [0, window.innerWidth + 100]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ 
              left: `${scrollProgress}%`,
              transform: 'translateX(-100%)'
            }}
          />
          
          {/* Floating Particles */}
          {scrollProgress > 10 && (
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2"
              style={{ left: `${scrollProgress}%` }}
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-4 h-4 text-white drop-shadow-lg" />
            </motion.div>
          )}
        </div>
        
        {/* Progress Percentage with Unique Design */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: scrollProgress > 5 ? 1 : 0,
            y: scrollProgress > 5 ? 0 : -20
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute top-3 right-4"
        >
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
            
            {/* Main Container */}
            <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full px-4 py-2 shadow-2xl border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center space-x-3">
                {/* Animated Icon */}
                <motion.div
                  animate={{
                    rotate: scrollDirection === 'down' ? [0, 10, 0] : [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <Lightning className="w-4 h-4 text-blue-500" />
                  <motion.div
                    className="absolute inset-0 bg-blue-500 rounded-full opacity-20"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0, 0.2]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                
                {/* Progress Text */}
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {Math.round(scrollProgress)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">%</span>
                </div>
                
                {/* Direction Indicator */}
                <motion.div
                  animate={{
                    y: scrollDirection === 'down' ? [0, 2, 0] : [0, -2, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight 
                    className={`w-3 h-3 text-slate-400 transform transition-transform duration-300 ${
                      scrollDirection === 'down' ? 'rotate-90' : '-rotate-90'
                    }`} 
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Percentage Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: scrollProgress > 5 ? 1 : 0,
          y: scrollProgress > 5 ? 0 : -20
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Hero Section - Clean and Focused */}
      <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  Save Individually or Together
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Your Financial Goals,{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Our Mission
                  </span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  Whether you're saving solo for personal dreams or collaborating with loved ones for shared goals, 
                  LoopFund makes achieving your financial aspirations simple, secure, and rewarding.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start Saving Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-lg">
                <Lottie animationData={heroAnimation} loop={true} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Moved from Hero */}
      <section ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Join our growing community of successful savers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={index}
                variants={fallingStatsVariants}
                initial="hidden"
                animate={isStatsInView ? "visible" : "hidden"}
                className="relative group"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 group-hover:scale-105">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Save Your Way
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Whether you prefer to save individually or collaborate with others, 
              LoopFund provides the perfect tools for your financial journey.
            </p>
          </motion.div>

          <motion.div
            variants={featuresVariants}
            initial="hidden"
            animate={isFeaturesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={featureCardVariants}
                className="group"
              >
                <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 hover:bg-white dark:hover:bg-slate-600 transition-all duration-300 border border-slate-200 dark:border-slate-600 group-hover:shadow-lg">
                  <div className={`w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Goal Examples Section */}
      <section className="py-24 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              What Are You Saving For?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              From personal dreams to shared adventures, discover how LoopFund helps you achieve any financial goal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goalExamples.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  goal.type === 'individual' 
                    ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${
                    goal.type === 'individual' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'
                  } flex items-center justify-center shadow-lg`}>
                    <goal.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    goal.type === 'individual' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {goal.type === 'individual' ? 'Individual' : 'Group'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {goal.title}
                </h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {goal.amount}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Loved by Thousands
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              See how LoopFund is helping people achieve their financial dreams, both individually and together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${
                    testimonial.type === 'individual' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'
                  } flex items-center justify-center text-white font-semibold text-lg mr-4 shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-lg">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    testimonial.type === 'individual' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {testimonial.type === 'individual' ? 'Individual Saver' : 'Group Saver'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Savings Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you're saving for personal goals or planning with others, 
              LoopFund is here to make your financial dreams a reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start Saving Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="text-xl font-bold">LoopFund</span>
            </div>
            <p className="text-slate-400">
              © 2024 LoopFund. All rights reserved. Academic Project.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Enhanced Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ 
          opacity: scrollProgress > 20 ? 1 : 0,
          scale: scrollProgress > 20 ? 1 : 0,
          rotate: scrollProgress > 20 ? 0 : -180
        }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut",
          type: "spring",
          stiffness: 200
        }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Scroll to top"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        
        {/* Main Button */}
        <div className="relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center overflow-hidden">
          {/* Animated Background Pattern */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: [-100, 100]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Icon Container */}
          <motion.div
            animate={{ 
              y: [0, -3, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <ArrowRight className="w-6 h-6 text-white transform rotate-[-90deg] group-hover:scale-110 transition-transform duration-200" />
          </motion.div>
          
          {/* Particle Effects */}
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full rounded-full border-2 border-white/30"></div>
          </motion.div>
        </div>
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          Back to top
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default LandingPage;
