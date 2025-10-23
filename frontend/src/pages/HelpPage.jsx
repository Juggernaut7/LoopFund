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
  Heart,
  Sparkles,
  Crown,
  Zap,
  Trophy,
  Send,
  Copy,
  User,
  Clock,
  Smartphone
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../components/ui';

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [activeTab, setActiveTab] = useState('help');
  const [userMessage, setUserMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      color: 'emerald',
      gradient: 'from-loopfund-emerald-500 to-loopfund-mint-500',
      bgColor: 'bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20',
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
      color: 'coral',
      gradient: 'from-loopfund-coral-500 to-loopfund-orange-500',
      bgColor: 'bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20',
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

  // Support contact details
  const supportConfig = {
    whatsapp: {
      number: '07041946945',
      name: 'WhatsApp Support',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    telegram: {
      number: '07041946945',
      name: 'Telegram Support',
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    email: {
      address: 'abdulkabir0600@gmail.com',
      name: 'Email Support',
      icon: Mail,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };

  const handleSupportClick = (method) => {
    const config = supportConfig[method];
    let url = '';
    let message = '';

    if (userMessage.trim()) {
      message = `Hi! I need help with LoopFund. My issue is: ${userMessage.trim()}`;
    } else {
      message = 'Hi! I need help with LoopFund. My issue is: [Please describe your issue]';
    }

    switch (method) {
      case 'whatsapp':
        url = `https://wa.me/2347041946945?text=${encodeURIComponent(message)}`;
        break;
      case 'telegram':
        url = `https://t.me/+2347041946945?text=${encodeURIComponent(message)}`;
        break;
      case 'email':
        url = `mailto:${config.address}?subject=LoopFund Support Request&body=${encodeURIComponent(message)}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank');
    
    // Track support request
    console.log('Support request initiated:', { method, message });
    
    toast.success('Support Request', `Opening ${config.name}...`);
  };

  const copyContactInfo = (method) => {
    const config = supportConfig[method];
    let textToCopy = '';
    
    switch (method) {
      case 'whatsapp':
      case 'telegram':
        textToCopy = config.number;
        break;
      case 'email':
        textToCopy = config.address;
        break;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      toast.success('Copied!', `${config.name} contact copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const quickActions = [
    {
      title: 'Contact Support',
      icon: MessageCircle,
      description: 'Get help from our support team',
      action: () => setActiveTab('support')
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

  // FAQ Data
  const faqData = [
    {
      category: 'Getting Started',
      icon: HelpCircle,
      color: 'text-loopfund-emerald-500',
      questions: [
        {
          question: "How do I create my first savings goal?",
          answer: "Click the 'Create Goal' button on the dashboard, enter your goal details (name, target amount, deadline), and start contributing. You can also join existing group goals."
        },
        {
          question: "How do I join a group?",
          answer: "You can join a group by using an invite code shared by the group creator, or by clicking on a public group link. Enter the invite code when prompted."
        },
        {
          question: "Is LoopFund free to use?",
          answer: "Yes! LoopFund is free to use. We only charge small processing fees for payments (handled by Paystack) and optional premium features."
        }
      ]
    },
    {
      category: 'Payments & Billing',
      icon: CreditCard,
      color: 'text-loopfund-coral-500',
      questions: [
        {
          question: "How do I make a payment?",
          answer: "Click the 'Contribute' button on any group or goal, enter your amount, and you'll be redirected to Paystack for secure payment processing. We support all major Nigerian banks and payment methods."
        },
        {
          question: "Why is my payment not reflecting?",
          answer: "Payments may take 1-2 minutes to reflect. If it's been longer, please check your bank statement and contact support with your transaction reference number."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major Nigerian payment methods through Paystack: bank transfers, debit cards, USSD, and mobile money. All payments are secure and encrypted."
        },
        {
          question: "Are there any fees?",
          answer: "We charge a small processing fee (1-2%) for contributions, which goes to Paystack for payment processing. Group creation has a small fee based on the group size and duration."
        }
      ]
    },
    {
      category: 'Groups & Goals',
      icon: Users,
      color: 'text-loopfund-gold-500',
      questions: [
        {
          question: "How do I create a group?",
          answer: "Go to the Groups page, click 'Create Group', fill in the details (name, description, target amount, duration), and invite members using the generated invite code or link."
        },
        {
          question: "Can I leave a group?",
          answer: "Yes, you can leave a group at any time. However, you won't be able to withdraw contributions made while you were a member unless the group is dissolved."
        },
        {
          question: "What happens when a group reaches its target?",
          answer: "When a group reaches its target amount, all members are notified and the group is marked as completed. The group creator can then distribute the funds to members."
        },
        {
          question: "How many people can join a group?",
          answer: "Groups can have up to 50 members by default, but this can be customized when creating the group. Larger groups may have slightly higher creation fees."
        }
      ]
    },
    {
      category: 'Account & Security',
      icon: Shield,
      color: 'text-loopfund-electric-500',
      questions: [
        {
          question: "How do I reset my password?",
          answer: "Go to Settings > Security, enter your current password and new password. If you've forgotten your password, use the 'Forgot Password' link on the login page."
        },
        {
          question: "Is my data secure?",
          answer: "Yes! We use bank-level encryption and security measures. All payments are processed through Paystack, which is PCI DSS compliant. We never store your payment details."
        },
        {
          question: "Can I change my email address?",
          answer: "Yes, you can update your email address in Settings > Profile. You'll need to verify the new email address before it becomes active."
        },
        {
          question: "How do I delete my account?",
          answer: "Go to Settings > Data & Privacy and click 'Delete Account'. Note: This action is irreversible and you'll lose all your data and contributions."
        }
      ]
    },
    {
      category: 'Technical Issues',
      icon: Smartphone,
      color: 'text-loopfund-lavender-500',
      questions: [
        {
          question: "The app is not loading properly",
          answer: "Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, contact our support team."
        },
        {
          question: "I can't receive notifications",
          answer: "Check your browser notification settings and ensure LoopFund is allowed to send notifications. Also check your email spam folder for email notifications."
        },
        {
          question: "The app is slow or lagging",
          answer: "This might be due to a slow internet connection or browser issues. Try refreshing the page or using a different browser. Clear your browser cache if needed."
        },
        {
          question: "I'm having trouble on mobile",
          answer: "LoopFund works best on modern browsers. Try using Chrome, Safari, or Firefox. Make sure you have a stable internet connection and the latest browser version."
        }
      ]
    }
  ];

  const supportMethods = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Support',
      description: 'Get instant help via WhatsApp',
      responseTime: 'Usually within minutes',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    {
      id: 'telegram',
      title: 'Telegram Support',
      description: 'Quick support via Telegram',
      responseTime: 'Usually within minutes',
      icon: Send,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Detailed support via email',
      responseTime: 'Within 24 hours',
      icon: Mail,
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700'
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
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Revolutionary Header */}
          <motion.div 
            className="relative mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="font-display text-display-lg text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Help & Support
                </motion.h1>
                <motion.p 
                  className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Everything you need to know about LoopFund. Find answers, learn features, and get help from our support team.
                </motion.p>
              </div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-right">
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    Support Available
                  </p>
                  <p className="font-display text-h4 text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
                    24/7
                  </p>
                </div>
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <HelpCircle className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Revolutionary Support Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Help Articles</p>
                    <p className="font-display text-h3 text-loopfund-neutral-900">50+</p>
                  </div>
                  <div className="p-3 bg-loopfund-emerald-100 rounded-full">
                    <BookOpen className="w-6 h-6 text-loopfund-emerald-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Response Time</p>
                    <p className="font-display text-h3 text-loopfund-coral-600">&lt; 5min</p>
                  </div>
                  <div className="p-3 bg-loopfund-coral-100 rounded-full">
                    <Clock className="w-6 h-6 text-loopfund-coral-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Support Channels</p>
                    <p className="font-display text-h3 text-loopfund-gold-600">3</p>
                  </div>
                  <div className="p-3 bg-loopfund-gold-100 rounded-full">
                    <MessageCircle className="w-6 h-6 text-loopfund-gold-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="relative group"
            >
              <LoopFundCard className="min-h-36 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-body text-body-sm font-medium text-loopfund-neutral-600 mb-1">Success Rate</p>
                    <p className="font-display text-h3 text-loopfund-electric-600">98%</p>
                  </div>
                  <div className="p-3 bg-loopfund-electric-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-loopfund-electric-600" />
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <LoopFundInput
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="w-full"
            />
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex space-x-1 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl p-1 max-w-md mx-auto mb-8"
          >
            <button
              onClick={() => setActiveTab('help')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-body text-body-sm font-medium transition-all duration-200 ${
                activeTab === 'help'
                  ? 'bg-white dark:bg-loopfund-dark-surface text-loopfund-emerald-600 dark:text-loopfund-emerald-400 shadow-sm'
                  : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-neutral-900 dark:hover:text-loopfund-neutral-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help Center</span>
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-body text-body-sm font-medium transition-all duration-200 ${
                activeTab === 'support'
                  ? 'bg-white dark:bg-loopfund-dark-surface text-loopfund-emerald-600 dark:text-loopfund-emerald-400 shadow-sm'
                  : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-neutral-900 dark:hover:text-loopfund-neutral-200'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get Support</span>
            </button>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {activeTab === 'help' && (
              <>
                {/* Revolutionary Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="relative mb-8"
                >
                  <LoopFundCard className="p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-loopfund-electric-100 rounded-lg">
                          <Zap className="w-5 h-5 text-loopfund-electric-600" />
                        </div>
                        <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          Quick Actions
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-emerald-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Get help instantly
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {quickActions.map((action, index) => (
                        <motion.div
                          key={action.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }}
                        >
                          <LoopFundCard 
                            variant="elevated" 
                            className="p-6 hover:shadow-loopfund-lg transition-all duration-300 cursor-pointer group"
                            onClick={action.action}
                          >
                            <div className="flex items-center mb-4">
                              <motion.div 
                                className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center shadow-loopfund group-hover:scale-110 transition-transform"
                                whileHover={{ rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <action.icon className="w-6 h-6 text-white" />
                              </motion.div>
                            </div>
                            <h3 className="font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                              {action.title}
                            </h3>
                            <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                              {action.description}
                            </p>
                          </LoopFundCard>
                        </motion.div>
                      ))}
                    </div>
                  </LoopFundCard>
                </motion.div>

          {/* Revolutionary Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="relative mb-8"
          >
            <LoopFundCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-loopfund-gold-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-loopfund-gold-600" />
                  </div>
                  <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                    Help Categories
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-loopfund-gold-500 rounded-full"></div>
                  <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                    {categories.length} categories
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-3 rounded-xl font-body text-body-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                      activeCategory === category.id
                        ? `bg-loopfund-${category.color}-100 dark:bg-loopfund-${category.color}-900/20 text-loopfund-${category.color}-700 dark:text-loopfund-${category.color}-300 shadow-loopfund border-2 border-loopfund-${category.color}-200 dark:border-loopfund-${category.color}-800`
                        : 'bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated text-loopfund-neutral-700 dark:text-loopfund-neutral-300 hover:bg-loopfund-neutral-200 dark:hover:bg-loopfund-dark-surface border-2 border-transparent'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <category.icon className="w-5 h-5" />
                    <span>{category.title}</span>
                  </motion.button>
                ))}
              </div>
            </LoopFundCard>
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
                    <LoopFundCard variant="gradient" className={`p-8 ${category.bgColor} border border-loopfund-neutral-200 dark:border-loopfund-neutral-700`}>
                      <div className="flex items-center space-x-4 mb-4">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-xl flex items-center justify-center shadow-loopfund`}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <category.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {category.title}
                        </h2>
                      </div>
                      <p className="font-body text-body-lg text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        {category.id === 'getting-started' 
                          ? 'Learn the basics and get started with LoopFund'
                          : 'Deep dive into analytics and reporting features'
                        }
                      </p>
                    </LoopFundCard>

                    {/* Category Items */}
                    <div className="space-y-6">
                      {category.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.01, y: -2 }}
                        >
                          <LoopFundCard variant="elevated" className="overflow-hidden hover:shadow-loopfund-lg transition-all duration-300">
                            <button
                              onClick={() => toggleExpanded(item.id)}
                              className="w-full p-6 text-left hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                                  {item.title}
                                </h3>
                                <motion.div
                                  animate={{ rotate: expandedItems[item.id] ? 90 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {expandedItems[item.id] ? (
                                    <ChevronDown className="w-5 h-5 text-loopfund-neutral-400" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-loopfund-neutral-400" />
                                  )}
                                </motion.div>
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
                                <div className="px-6 pb-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                                  <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                                    {item.content}
                                  </p>
                                  
                                  {/* Steps or Features */}
                                  {(item.steps || item.features || item.formats || item.insights || item.metrics) && (
                                    <div className="space-y-4">
                                      <h4 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                                        {item.steps ? 'Steps:' : 
                                         item.features ? 'Features:' :
                                         item.formats ? 'Available Formats:' :
                                         item.insights ? 'AI Insights:' :
                                         'Key Metrics:'}
                                      </h4>
                                      <ul className="space-y-3">
                                        {(item.steps || item.features || item.formats || item.insights || item.metrics).map((step, index) => (
                                          <motion.li 
                                            key={index} 
                                            className="flex items-start space-x-3"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                          >
                                            <CheckCircle className="w-5 h-5 text-loopfund-emerald-500 mt-0.5 flex-shrink-0" />
                                            <span className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">{step}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          </LoopFundCard>
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
                  className="max-w-4xl mx-auto mt-12"
                >
                  <LoopFundCard variant="gradient" className="p-8 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 text-white">
                    <div className="text-center">
                      <motion.div
                        className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-loopfund mx-auto mb-6"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <MessageCircle className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="font-display text-h2 mb-4">Still Need Help?</h3>
                      <p className="font-body text-body-lg text-loopfund-neutral-100 mb-8">
                        Can't find what you're looking for? Our support team is here to help you succeed.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <LoopFundButton
                          onClick={() => setActiveTab('support')}
                          variant="secondary"
                          size="lg"
                          icon={<Mail className="w-5 h-5" />}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          Contact Support
                        </LoopFundButton>
                        <LoopFundButton
                          onClick={() => setActiveTab('support')}
                          variant="secondary"
                          size="lg"
                          icon={<MessageCircle className="w-5 h-5" />}
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          Get Help Now
                        </LoopFundButton>
                      </div>
                    </div>
                  </LoopFundCard>
                </motion.div>
              </>
            )}

            {activeTab === 'support' && (
              <div className="space-y-6">
                {/* Contact Info Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-2xl p-6 text-white shadow-loopfund"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-h4 mb-2">Need Immediate Help?</h3>
                      <p className="font-body text-body opacity-90">
                        Contact us directly for urgent issues
                      </p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <a
                        href="https://wa.me/2347041946945"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-body text-body-sm font-medium">WhatsApp</span>
                      </a>
                      <a
                        href="mailto:abdulkabir0600@gmail.com"
                        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="font-body text-body-sm font-medium">Email</span>
                      </a>
                      <a
                        href="tel:+2347041946945"
                        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        <span className="font-body text-body-sm font-medium">Call</span>
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Message Input */}
                <LoopFundCard variant="elevated" className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      Describe Your Issue
                    </h3>
                    <LoopFundInput
                      type="textarea"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder="Tell us what you need help with... (Optional - you can also describe your issue directly in the chat)"
                      className="min-h-24 resize-none"
                      icon={<User className="w-4 h-4" />}
                    />
                    <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                      💡 Tip: The more details you provide, the faster we can help you!
                    </p>
                  </div>
                </LoopFundCard>

                {/* Revolutionary Support Methods */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                  className="relative mb-8"
                >
                  <LoopFundCard className="p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-loopfund-coral-100 rounded-lg">
                          <MessageCircle className="w-5 h-5 text-loopfund-coral-600" />
                        </div>
                        <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          Contact Support
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-coral-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Available 24/7
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {supportMethods.map((method, index) => {
                        const Icon = method.icon;
                        const config = supportConfig[method.id];
                        
                        return (
                          <motion.div
                            key={method.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                          >
                            <LoopFundCard 
                              variant="elevated" 
                              className="p-6 cursor-pointer transition-all duration-300 hover:shadow-loopfund-lg"
                            >
                              <div className="text-center space-y-4">
                                {/* Icon */}
                                <motion.div
                                  className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${method.color} rounded-xl shadow-lg`}
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                  <Icon className="w-6 h-6 text-white" />
                                </motion.div>

                                {/* Title & Description */}
                                <div>
                                  <h3 className="font-display text-h6 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-1">
                                    {method.title}
                                  </h3>
                                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-2">
                                    {method.description}
                                  </p>
                                  <div className="flex items-center justify-center space-x-1 text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                                    <Clock className="w-3 h-3" />
                                    <span className="font-body text-body-xs">{method.responseTime}</span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                  <LoopFundButton
                                    onClick={() => handleSupportClick(method.id)}
                                    variant="primary"
                                    size="sm"
                                    className="w-full"
                                    icon={<ExternalLink className="w-4 h-4" />}
                                  >
                                    Contact Support
                                  </LoopFundButton>
                                  
                                  <LoopFundButton
                                    onClick={() => copyContactInfo(method.id)}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  >
                                    {copied ? 'Copied!' : 'Copy Contact'}
                                  </LoopFundButton>
                                </div>
                              </div>
                            </LoopFundCard>
                          </motion.div>
                        );
                      })}
                    </div>
                  </LoopFundCard>
                </motion.div>

                {/* Quick Help Tips */}
                <LoopFundCard variant="elevated" className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-display text-h5 text-loopfund-neutral-900 dark:text-loopfund-dark-text flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-loopfund-coral-500" />
                      <span>Quick Help Tips</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                          💳 Payment Issues
                        </h4>
                        <ul className="font-body text-body-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400 space-y-1">
                          <li>• Check your internet connection</li>
                          <li>• Ensure sufficient account balance</li>
                          <li>• Try a different payment method</li>
                          <li>• Contact your bank if issue persists</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300">
                          🔐 Account Issues
                        </h4>
                        <ul className="font-body text-body-xs text-loopfund-neutral-600 dark:text-loopfund-neutral-400 space-y-1">
                          <li>• Try resetting your password</li>
                          <li>• Check your email for verification</li>
                          <li>• Clear browser cache and cookies</li>
                          <li>• Try using a different browser</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </LoopFundCard>

                {/* Revolutionary FAQ Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  className="relative mb-8"
                >
                  <LoopFundCard variant="elevated" className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-loopfund-lavender-100 rounded-lg">
                          <HelpCircle className="w-5 h-5 text-loopfund-lavender-600" />
                        </div>
                        <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          Frequently Asked Questions
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-loopfund-lavender-500 rounded-full"></div>
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                          Quick answers
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {faqData.slice(0, 3).map((category, categoryIndex) => (
                        <motion.div 
                          key={categoryIndex} 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.6 + categoryIndex * 0.1 }}
                        >
                          <h4 className="font-body text-body-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 flex items-center space-x-2">
                            <category.icon className={`w-4 h-4 ${category.color}`} />
                            <span>{category.category}</span>
                          </h4>
                          <div className="space-y-2">
                            {category.questions.slice(0, 2).map((faq, faqIndex) => (
                              <motion.div 
                                key={faqIndex} 
                                className="pl-6 p-3 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-lg hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-surface transition-colors"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.7 + categoryIndex * 0.1 + faqIndex * 0.05 }}
                              >
                                <p className="font-body text-body-xs font-medium text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                                  Q: {faq.question}
                                </p>
                                <p className="font-body text-body-xs text-loopfund-neutral-500 dark:text-loopfund-neutral-500">
                                  A: {faq.answer}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="text-center pt-4">
                      <LoopFundButton
                        onClick={() => setActiveTab('help')}
                        variant="outline"
                        size="sm"
                        icon={<HelpCircle className="w-4 h-4" />}
                      >
                        View All FAQs
                      </LoopFundButton>
                    </div>
                  </LoopFundCard>
                </motion.div>

                {/* Contact Information */}
                <div className="text-center">
                  <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                    📞 Phone: <span className="font-medium">07041946945</span> | 
                    📧 Email: <span className="font-medium">abdulkabir0600@gmail.com</span>
                  </p>
                  <p className="font-body text-body-xs text-loopfund-neutral-400 dark:text-loopfund-neutral-500 mt-1">
                    Available 24/7 for urgent issues
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
  );
};

export default HelpPage;
