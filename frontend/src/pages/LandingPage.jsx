import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  User,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Star,
  DollarSign,
  Calendar,
  Bell,
  Heart,
  Gift,
  Home,
  Car,
  GraduationCap,
  Plane,
  Lock,
  Globe,
  Award,
  BarChart3
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import Lottie from 'lottie-react';
import heroAnimation from '../assets/hero-animation.json';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Total Saved', value: '$2.5M+', icon: DollarSign },
    { label: 'Goals Achieved', value: '15,000+', icon: Target },
    { label: 'Success Rate', value: '94%', icon: TrendingUp }
  ];

  const features = [
    {
      icon: User,
      title: 'Individual Savings',
      description: 'Save for your personal goals - vacations, gadgets, education, or anything you dream of.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Group Savings',
      description: 'Save together with friends and family for shared goals like trips, gifts, or investments.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set specific targets and track your progress with beautiful visualizations.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Bank-level security with complete privacy for your financial data.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'Smart Automation',
      description: 'Automated savings, reminders, and smart suggestions to help you reach goals faster.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Detailed insights and analytics to understand your saving patterns and optimize.',
      color: 'from-teal-500 to-blue-500'
    }
  ];

  const goalExamples = [
    { icon: Home, title: 'Home Down Payment', amount: '$50,000', type: 'individual' },
    { icon: Car, title: 'New Car', amount: '$25,000', type: 'individual' },
    { icon: GraduationCap, title: 'Education Fund', amount: '$15,000', type: 'individual' },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation isScrolled={isScrolled} />
      
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-4">
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
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
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
                  Watch Demo
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full max-w-lg mx-auto">
                <Lottie animationData={heroAnimation} loop={true} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Save Your Way
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Whether you prefer to save individually or collaborate with others, 
              LoopFund provides the perfect tools for your financial journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Goal Examples Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Are You Saving For?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              From personal dreams to shared adventures, discover how LoopFund helps you achieve any financial goal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goalExamples.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  goal.type === 'individual' 
                    ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
                    goal.type === 'individual' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'
                  } flex items-center justify-center`}>
                    <goal.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    goal.type === 'individual' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {goal.type === 'individual' ? 'Individual' : 'Group'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
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
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
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
                className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                    testimonial.type === 'individual' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'
                  } flex items-center justify-center text-white font-semibold mr-4`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
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
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you're saving for personal goals or planning with others, 
              LoopFund is here to make your financial dreams a reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
              >
                Start Saving Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LoopFund</h3>
              <p className="text-slate-400">
                Making financial goals achievable, one save at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Individual Savings</li>
                <li>Group Savings</li>
                <li>Goal Tracking</li>
                <li>Progress Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Help Center</li>
                <li>FAQs</li>
                <li>Community</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 LoopFund. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
