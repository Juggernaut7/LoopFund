import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  ChevronRight,
  ChevronDown,
  ExternalLink,
  FileText,
  BarChart3,
  Users,
  Target,
  DollarSign,
  Shield,
  Brain,
  Gamepad2,
  TrendingUp,
  Award,
  Calendar,
  Bell,
  Settings,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Star,
  Heart
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useToast } from '../context/ToastContext';

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const { toast } = useToast();

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      items: [
        {
          id: 'welcome',
          title: 'Welcome to LoopFund',
          content: 'LoopFund is your AI-powered financial wellness platform that combines savings goals, group collaboration, and behavioral insights to help you achieve financial freedom.',
          steps: [
            'Create your first savings goal',
            'Join or create a savings group',
            'Set up your payment preferences',
            'Explore AI-powered insights'
          ]
        },
        {
          id: 'account-setup',
          title: 'Setting Up Your Account',
          content: 'Learn how to create and customize your LoopFund account for the best experience.',
          steps: [
            'Complete your profile information',
            'Verify your email address',
            'Set up payment methods',
            'Configure notification preferences'
          ]
        },
        {
          id: 'first-goal',
          title: 'Creating Your First Goal',
          content: 'Setting up your first savings goal is easy and takes just a few minutes.',
          steps: [
            'Click "Create Goal" from the dashboard',
            'Choose your goal type (individual or group)',
            'Set your target amount and deadline',
            'Add a description and motivation',
            'Pay the creation fee and start saving!'
          ]
        },
        {
          id: 'payment-setup',
          title: 'Payment Setup & Security',
          content: 'Secure payment processing with Paystack integration for all transactions.',
          steps: [
            'Add your bank account details',
            'Verify payment methods',
            'Set up automatic contributions',
            'Review transaction history'
          ]
        }
      ]
    },
    {
      id: 'reports-analytics',
      title: 'Reports & Analytics',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      items: [
        {
          id: 'analytics-overview',
          title: 'Understanding Your Analytics',
          content: 'Your analytics dashboard provides comprehensive insights into your financial progress and behavior patterns.',
          features: [
            'Total savings overview',
            'Group vs individual contributions',
            'Savings trend analysis',
            'Goal completion rates',
            'Financial health score'
          ]
        },
        {
          id: 'export-data',
          title: 'Exporting Your Data',
          content: 'Download your financial data in various formats for external analysis or record keeping.',
          formats: [
            'PDF reports for tax purposes',
            'CSV files for spreadsheet analysis',
            'JSON data for developers',
            'Custom date range exports'
          ]
        },
        {
          id: 'insights',
          title: 'AI-Powered Insights',
          content: 'Get personalized recommendations and predictions based on your financial behavior.',
          insights: [
            'Spending pattern analysis',
            'Optimal contribution timing',
            'Goal achievement predictions',
            'Risk assessment and mitigation'
          ]
        },
        {
          id: 'performance-tracking',
          title: 'Performance Tracking',
          content: 'Monitor your progress with detailed performance metrics and benchmarking.',
          metrics: [
            'Savings rate improvement',
            'Goal completion timeline',
            'Group participation score',
            'Financial wellness trends'
          ]
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      icon: MessageCircle,
      description: 'Get help from our support team',
      action: () => toast('Support contact feature coming soon!', 'info')
    },
    {
      title: 'Video Tutorials',
      icon: ExternalLink,
      description: 'Watch step-by-step guides',
      action: () => toast('Video tutorials coming soon!', 'info')
    },
    {
      title: 'Community Forum',
      icon: Users,
      description: 'Connect with other users',
      action: () => window.open('/community', '_blank')
    },
    {
      title: 'Feature Requests',
      icon: Lightbulb,
      description: 'Suggest new features',
      action: () => toast('Feature request form coming soon!', 'info')
    }
  ];

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Help Center
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Everything you need to know about LoopFund. Find answers, learn features, and get the most out of your financial wellness journey.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 text-left group"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <action.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {action.description}
                </p>
              </motion.button>
            ))}
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.title}</span>
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <AnimatePresence mode="wait">
              {filteredCategories.map((category) => (
                activeCategory === category.id && (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Category Header */}
                    <div className={`p-6 rounded-xl ${category.bgColor} border border-slate-200 dark:border-slate-700`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <category.icon className={`w-6 h-6 ${category.color}`} />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {category.title}
                        </h2>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">
                        {category.id === 'getting-started' 
                          ? 'Learn the basics and get started with LoopFund'
                          : 'Deep dive into analytics and reporting features'
                        }
                      </p>
                    </div>

                    {/* Category Items */}
                    <div className="space-y-4">
                      {category.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleExpanded(item.id)}
                            className="w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {item.title}
                              </h3>
                              {expandedItems[item.id] ? (
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {expandedItems[item.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700">
                                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    {item.content}
                                  </p>
                                  
                                  {/* Steps or Features */}
                                  {(item.steps || item.features || item.formats || item.insights || item.metrics) && (
                                    <div className="space-y-3">
                                      <h4 className="font-medium text-slate-900 dark:text-white">
                                        {item.steps ? 'Steps:' : 
                                         item.features ? 'Features:' :
                                         item.formats ? 'Available Formats:' :
                                         item.insights ? 'AI Insights:' :
                                         'Key Metrics:'}
                                      </h4>
                                      <ul className="space-y-2">
                                        {(item.steps || item.features || item.formats || item.insights || item.metrics).map((step, index) => (
                                          <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-600 dark:text-slate-400">{step}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-blue-100 mb-6">
                Can't find what you're looking for? Our support team is here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => toast('Email support coming soon!', 'info')}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email Support</span>
                </button>
                <button
                  onClick={() => toast('Live chat coming soon!', 'info')}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Live Chat</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpPage;
