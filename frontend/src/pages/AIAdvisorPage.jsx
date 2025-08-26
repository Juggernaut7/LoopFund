import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  Target, 
  BarChart3, 
  TrendingUp,
  Lightbulb,
  Sparkles,
  Zap,
  Star,
  Award
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import AIFinancialAdvisor from '../components/AIFinancialAdvisor';

const AIAdvisorPage = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const features = [
    {
      icon: Brain,
      title: 'Smart Financial Advice',
      description: 'Get personalized financial guidance based on your goals and situation',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Target,
      title: 'Savings Plan Generator',
      description: 'AI-powered savings strategies tailored to your timeline and budget',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Budget Analysis',
      description: 'Deep insights into your spending patterns and optimization opportunities',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: TrendingUp,
      title: 'Investment Guidance',
      description: 'Age-appropriate investment advice and portfolio recommendations',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const quickActions = [
    {
      title: 'Create Savings Plan',
      description: 'Generate a personalized savings strategy',
      action: () => setActiveTab('plans'),
      icon: Target,
      color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      title: 'Analyze Budget',
      description: 'Get insights into your spending habits',
      action: () => setActiveTab('budget'),
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      title: 'Investment Tips',
      description: 'Get personalized investment advice',
      action: () => setActiveTab('investment'),
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      title: 'Chat with AI',
      description: 'Ask any financial question',
      action: () => setActiveTab('chat'),
      icon: MessageCircle,
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  AI Financial Advisor
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Your personal AI-powered financial planning assistant
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-300"
              >
                <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg w-fit mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 ${action.color}`}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-5 h-5" />
                    <div className="text-left">
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      <p className="text-xs opacity-80">{action.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* AI Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Chat with Your AI Financial Advisor
                  </h2>
                  <p className="text-blue-100">
                    Ask me anything about your finances, savings, or investments
                  </p>
                </div>
              </div>
            </div>
            
            {/* AI Component */}
            <div className="p-6">
              <AIFinancialAdvisor />
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg w-fit mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                24/7
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Available anytime, anywhere
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg w-fit mx-auto mb-4">
                <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                95%
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                User satisfaction rate
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg w-fit mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                AI-Powered
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                State-of-the-art technology
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAdvisorPage;
