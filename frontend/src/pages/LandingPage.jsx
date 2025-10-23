import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
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
  Zap as Lightning,
  Brain,
  Gamepad2,
  DollarSign,
  PiggyBank,
  TrendingDown,
  Wallet,
  // Social media icons
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import Lottie from 'lottie-react';
import heroAnimation from '../assets/hero-animation.json';
import logo1 from '../assets/logo1.jpg';
import LoopFundButton from '../components/ui/LoopFundButton';
import LoopFundCard from '../components/ui/LoopFundCard';
import AnimatedSection from '../components/animations/AnimatedSection';
import StaggeredList from '../components/animations/StaggeredList';
import AnimatedCounter from '../components/animations/AnimatedCounter';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);

  const handleWatchDemo = () => {
    // Could open a modal or navigate to demo page
    alert('Demo video coming soon!');
  };
  
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
      color: "from-loopfund-emerald-500 to-loopfund-mint-500"
    },
    {
      icon: Users,
      value: "5,000+",
      label: "Active Groups",
      color: "from-loopfund-coral-500 to-loopfund-orange-500"
    },
    {
      icon: TrendingUp,
      value: "$2.5M+",
      label: "Total Saved",
      color: "from-loopfund-gold-500 to-loopfund-electric-500"
    },
    {
      icon: Award,
      value: "98%",
      label: "Success Rate",
      color: "from-loopfund-lavender-500 to-loopfund-midnight-500"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Financial Therapist",
      description: "Revolutionary AI that understands your money psychology and provides personalized therapy",
      color: "text-loopfund-lavender-600"
    },
    {
      icon: Users,
      title: "Financial Wellness Community",
      description: "Anonymous peer support and shared financial struggles with AI insights",
      color: "text-loopfund-coral-600"
    },
    {
      icon: Shield,
      title: "Behavioral Micro-Interventions",
      description: "Real-time spending pause and emotional state detection to prevent impulse buying",
      color: "text-loopfund-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "Predictive Financial Health",
      description: "6-month forecasts and crisis prevention alerts to secure your financial future",
      color: "text-loopfund-orange-600"
    },
    {
      icon: Gamepad2,
      title: "Financial Therapy Games",
      description: "Gamified exercises to reduce financial anxiety and build money confidence",
      color: "text-loopfund-electric-600"
    },
    {
      icon: Target,
      title: "Smart Goal Setting",
      description: "Set personalized savings goals with AI-powered recommendations",
      color: "text-loopfund-gold-600"
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
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated relative overflow-hidden">
      {/* Revolutionary Mesh Background */}
      <div className="absolute inset-0 loopfund-mesh-bg opacity-30 dark:opacity-20" />
      
      {/* Floating Geometric Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-loopfund-emerald-500/10 dark:bg-loopfund-emerald-500/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-loopfund-coral-500/10 dark:bg-loopfund-coral-500/20 rounded-full blur-xl animate-float-delayed" />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-loopfund-gold-500/10 dark:bg-loopfund-gold-500/20 rounded-full blur-xl animate-float-slow" />
      
      <Navigation isScrolled={isScrolled} />
      
      {/* Unique Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full z-40">
        {/* Revolutionary Progress Bar */}
        <div className="relative h-2 bg-gradient-to-r from-loopfund-neutral-100 via-loopfund-neutral-200 to-loopfund-neutral-100 dark:from-loopfund-dark-surface dark:via-loopfund-dark-elevated dark:to-loopfund-dark-surface overflow-hidden">
          {/* Main Progress */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-loopfund-emerald-500 via-loopfund-coral-500 to-loopfund-gold-500"
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
            <div className="absolute inset-0 bg-gradient-to-r from-loopfund-emerald-500/20 to-loopfund-coral-500/20 blur-xl rounded-full"></div>
            
            {/* Main Container */}
            <div className="relative bg-loopfund-neutral-50/90 dark:bg-loopfund-dark-surface/90 backdrop-blur-md rounded-full px-4 py-2 shadow-2xl border border-loopfund-neutral-200/20 dark:border-loopfund-dark-elevated/50">
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
                  <Lightning className="w-4 h-4 text-loopfund-emerald-500" />
                  <motion.div
                    className="absolute inset-0 bg-loopfund-emerald-500 rounded-full opacity-20"
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
                  <span className="text-lg font-bold bg-gradient-to-r from-loopfund-emerald-600 to-loopfund-coral-600 bg-clip-text text-transparent">
                    {Math.round(scrollProgress)}
                  </span>
                  <span className="text-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400 font-medium">%</span>
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
        <div className="bg-white dark:bg-loopfund-dark-surface rounded-full px-4 py-2 shadow-lg border border-loopfund-neutral-200 dark:border-loopfund-dark-elevated">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-dark-text">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Revolutionary Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-6 flex flex-col justify-center h-full">
                <h1 className="font-display text-display-xl md:text-display-2xl text-loopfund-neutral-900 dark:text-loopfund-dark-text leading-tight">
                  Your Personal{' '}
                  <span className="bg-gradient-to-r from-loopfund-emerald-600 to-loopfund-coral-600 bg-clip-text text-transparent">
                    AI Financial Therapist
                  </span>
                </h1>
                <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 leading-relaxed max-w-xl">
                  The only app that understands your money psychology. Get AI therapy, community support, 
                  and behavioral interventions to transform your relationship with money.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <LoopFundButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="group"
                >
                  Start Your Financial Therapy
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200" />
                </LoopFundButton>
                <LoopFundButton
                  variant="secondary"
                  size="lg"
                  onClick={handleWatchDemo}
                  className="group"
                >
                  <Play className="w-4 h-4 mr-2 transition-transform duration-200" />
                  Watch Demo
                </LoopFundButton>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end items-center h-full"
            >
              <div className="w-full max-w-md">
                <Lottie animationData={heroAnimation} loop={true} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Revolutionary Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4">
              Trusted by Thousands
            </h2>
            <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
              Join our growing community of successful savers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                custom={index}
                variants={fallingStatsVariants}
                initial="hidden"
                animate={isStatsInView ? "visible" : "hidden"}
                className="relative group"
              >
                <LoopFundCard className="min-h-36 p-6 dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">{stat.label}</p>
                      <p className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {stat.value}
                      </p>
                    </div>
                    <div className="p-3 bg-loopfund-emerald-100 dark:bg-loopfund-emerald-900/30 rounded-full">
                      <stat.icon className="w-6 h-6 text-loopfund-emerald-600 dark:text-loopfund-emerald-400" />
                    </div>
                  </div>
                </LoopFundCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Features Section */}
      <section ref={featuresRef} className="py-20 bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-display-xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
              Revolutionary Financial Wellness Features
            </h2>
            <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-3xl mx-auto leading-relaxed">
              The only app that combines AI therapy, community support, and behavioral interventions 
              to transform your relationship with money.
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
                <LoopFundCard variant="elevated" className="p-6 transition-all duration-300 hover:shadow-loopfund-lg dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center shadow-loopfund mr-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {feature.description}
                  </p>
                </LoopFundCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Revolutionary Goal Examples Section */}
      <section className="py-24 bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-display-xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
              What Are You Saving For?
            </h2>
            <p className="font-body text-body-xl text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-3xl mx-auto leading-relaxed">
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
                className="group"
              >
                <LoopFundCard 
                  variant="elevated" 
                  className="p-8 transition-all duration-300 hover:shadow-loopfund-lg dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${
                      goal.type === 'individual' ? 'from-loopfund-emerald-500 to-loopfund-mint-500' : 'from-loopfund-coral-500 to-loopfund-orange-500'
                    } flex items-center justify-center shadow-loopfund transition-transform duration-300`}>
                      <goal.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      goal.type === 'individual' 
                          ? 'bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300' 
                          : 'bg-loopfund-coral-100 text-loopfund-coral-700 dark:bg-loopfund-coral-900/30 dark:text-loopfund-coral-300'
                    }`}>
                      {goal.type === 'individual' ? 'Individual' : 'Group'}
                    </span>
                  </div>
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                    {goal.title}
                  </h3>
                  <p className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    {goal.amount}
                  </p>
                </LoopFundCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-display-xl text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
              Loved by Thousands
            </h2>
            <p className="font-body text-body-xl text-loopfund-neutral-600 dark:text-loopfund-neutral-400 max-w-3xl mx-auto leading-relaxed">
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
                className="group"
              >
                <LoopFundCard variant="elevated" className="p-8 transition-all duration-300 hover:shadow-loopfund-lg dark:bg-loopfund-dark-surface dark:border-loopfund-dark-elevated">
                  <div className="flex items-center mb-6">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${
                        testimonial.type === 'individual' ? 'from-loopfund-emerald-500 to-loopfund-mint-500' : 'from-loopfund-coral-500 to-loopfund-orange-500'
                      } flex items-center justify-center text-white font-semibold text-lg mr-4 shadow-loopfund transition-transform duration-300`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                        <h4 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {testimonial.name}
                      </h4>
                        <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                    <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      testimonial.type === 'individual' 
                          ? 'bg-loopfund-emerald-100 text-loopfund-emerald-700 dark:bg-loopfund-emerald-900/30 dark:text-loopfund-emerald-300' 
                          : 'bg-loopfund-coral-100 text-loopfund-coral-700 dark:bg-loopfund-coral-900/30 dark:text-loopfund-coral-300'
                    }`}>
                      {testimonial.type === 'individual' ? 'Individual Saver' : 'Group Saver'}
                    </span>
                  </div>
                </LoopFundCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary CTA Section */}
      <section className="py-24 bg-gradient-to-r from-loopfund-emerald-600 via-loopfund-coral-600 to-loopfund-gold-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-display text-display-xl text-white mb-6">
              Ready to Start Your Savings Journey?
            </h2>
            <p className="font-body text-body-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you're saving for personal goals or planning with others, 
              LoopFund is here to make your financial dreams a reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <LoopFundButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                className="group bg-white text-loopfund-neutral-900 hover:bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface dark:text-loopfund-dark-text dark:hover:bg-loopfund-dark-elevated"
              >
                Start Saving Today
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-200" />
              </LoopFundButton>
              <LoopFundButton
                variant="secondary"
                size="lg"
                onClick={() => navigate('/signin')}
                className="border-2 border-white text-white hover:bg-white hover:text-loopfund-neutral-900 dark:border-loopfund-dark-elevated dark:text-loopfund-dark-text dark:hover:bg-loopfund-dark-elevated dark:hover:text-loopfund-dark-text"
              >
                Sign In
              </LoopFundButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary Footer */}
      <footer className="relative bg-gradient-to-br from-loopfund-neutral-900 via-loopfund-neutral-800 to-loopfund-neutral-900 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated text-white overflow-hidden">
        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              {/* Brand Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 rounded-xl flex items-center justify-center shadow-loopfund overflow-hidden">
                    <img src={logo1} alt="LoopFund" className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className="font-display text-display-sm text-white">LoopFund</span>
                </div>
                <p className="font-body text-body text-white/80 leading-relaxed mb-6">
                  Transform your financial future with AI-powered guidance, savings groups, and community support.
                </p>
                <div className="flex space-x-4">
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    href="#" className="w-10 h-10 bg-loopfund-neutral-700 dark:bg-loopfund-dark-elevated rounded-xl flex items-center justify-center transition-colors duration-200"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    href="#" className="w-10 h-10 bg-loopfund-neutral-700 dark:bg-loopfund-dark-elevated hover:bg-loopfund-coral-600 dark:hover:bg-loopfund-coral-500 rounded-xl flex items-center justify-center transition-colors duration-200"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    href="#" className="w-10 h-10 bg-loopfund-neutral-700 dark:bg-loopfund-dark-elevated hover:bg-loopfund-gold-600 dark:hover:bg-loopfund-gold-500 rounded-xl flex items-center justify-center transition-colors duration-200"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    href="#" className="w-10 h-10 bg-loopfund-neutral-700 dark:bg-loopfund-dark-elevated hover:bg-loopfund-lavender-600 dark:hover:bg-loopfund-lavender-500 rounded-xl flex items-center justify-center transition-colors duration-200"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </motion.a>
                </div>
              </motion.div>

              {/* Product Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <h3 className="font-display text-h4 mb-6 text-white">Product</h3>
                <ul className="space-y-4">
                  <li><Link to="/signup" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Get Started</Link></li>
                  <li><Link to="/#features" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Features</Link></li>
                  <li><Link to="/join-group" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Join Group</Link></li>
                  <li><Link to="/signin" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Sign In</Link></li>
                  <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Pricing</a></li>
                </ul>
              </motion.div>

              {/* Company Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <h3 className="font-display text-h4 mb-6 text-white">Company</h3>
                <ul className="space-y-4">
                  <li><Link to="/#about" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">About Us</Link></li>
                  <li><Link to="/#contact" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Contact</Link></li>
                  <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Blog</a></li>
                  <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Careers</a></li>
                  <li><a href="#" className="text-loopfund-neutral-300 hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Help Center</a></li>
                </ul>
              </motion.div>

              {/* Newsletter Signup */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <h3 className="font-display text-h4 mb-6 text-white">Stay Updated</h3>
                <p className="text-loopfund-neutral-300 text-body mb-6">
                  Get the latest financial tips and updates delivered to your inbox.
                </p>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 bg-loopfund-neutral-700 dark:bg-loopfund-dark-elevated border border-loopfund-neutral-600 dark:border-loopfund-dark-elevated rounded-xl sm:rounded-l-xl sm:rounded-r-none text-white placeholder-loopfund-neutral-400 dark:placeholder-loopfund-neutral-500 focus:outline-none focus:ring-2 focus:ring-loopfund-emerald-500 focus:border-transparent min-w-0 font-body text-body-sm"
                    />
                    <LoopFundButton
                      variant="primary"
                      size="md"
                      className="sm:rounded-l-none sm:rounded-r-xl whitespace-nowrap"
                    >
                      Subscribe
                    </LoopFundButton>
                  </div>
                  <p className="text-loopfund-neutral-400 text-body-sm">
                    Join 10,000+ users getting financial insights weekly.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-loopfund-neutral-700 dark:border-loopfund-dark-elevated">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <p className="text-loopfund-neutral-400 dark:text-loopfund-neutral-500 text-body">
                    © 2024 LoopFund. All rights reserved.
                  </p>
                  <div className="flex space-x-6">
                    <a href="#" className="text-loopfund-neutral-400 dark:text-loopfund-neutral-500 hover:text-loopfund-emerald-400 dark:hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Privacy Policy</a>
                    <a href="#" className="text-loopfund-neutral-400 dark:text-loopfund-neutral-500 hover:text-loopfund-emerald-400 dark:hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Terms of Service</a>
                    <a href="#" className="text-loopfund-neutral-400 dark:text-loopfund-neutral-500 hover:text-loopfund-emerald-400 dark:hover:text-loopfund-emerald-400 transition-colors duration-200 font-body text-body">Cookie Policy</a>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-loopfund-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-loopfund-neutral-400 dark:text-loopfund-neutral-500 font-body text-body">All systems operational</span>
                </div>
              </div>
            </div>
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
        <div className="absolute inset-0 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-coral-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
        
        {/* Main Button */}
        <div className="relative w-14 h-14 bg-gradient-to-r from-loopfund-emerald-600 to-loopfund-coral-600 hover:from-loopfund-emerald-700 hover:to-loopfund-coral-700 rounded-full shadow-2xl hover:shadow-loopfund-emerald-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center overflow-hidden">
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