import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  LineChart, 
  TrendingUp, 
  DollarSign, 
  Target, 
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react';
import { LoopFundCard, LoopFundButton } from '../ui';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com';

const FinancialInsightsPanel = ({ activeInsight, recommendations, onInsightChange }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [activeInsight]);

  const loadInsights = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/user/summary`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data.data);
      } else {
        console.warn('Analytics API not available, using mock data');
        setInsights(mockData);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
      setInsights(mockData);
    } finally {
      setLoading(false);
    }
  };

  const mockData = {
    spending: {
      categories: [
        { name: 'Food & Dining', value: 35, color: '#10B981' },
        { name: 'Transportation', value: 25, color: '#F59E0B' },
        { name: 'Entertainment', value: 20, color: '#EF4444' },
        { name: 'Shopping', value: 15, color: '#8B5CF6' },
        { name: 'Utilities', value: 5, color: '#06B6D4' }
      ],
      trend: [
        { month: 'Jan', amount: 2800 },
        { month: 'Feb', amount: 3200 },
        { month: 'Mar', amount: 2900 },
        { month: 'Apr', amount: 3500 },
        { month: 'May', amount: 3100 }
      ]
    },
    savings: {
      rate: 15,
      current: 8500,
      goal: 15000,
      trend: [
        { month: 'Jan', amount: 2000 },
        { month: 'Feb', amount: 4500 },
        { month: 'Mar', amount: 6200 },
        { month: 'Apr', amount: 7800 },
        { month: 'May', amount: 8500 }
      ]
    },
    investments: {
      return: 12.5,
      total: 25000,
      monthly: 500,
      growth: [
        { month: 'Jan', value: 22000 },
        { month: 'Feb', value: 22800 },
        { month: 'Mar', value: 23500 },
        { month: 'Apr', value: 24200 },
        { month: 'May', value: 25000 }
      ]
    }
  };

  const data = insights || mockData;

  if (loading) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="p-6 border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
          <h2 className="text-xl font-display font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Financial Insights
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-12 h-12 border-4 border-loopfund-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Loading insights...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const renderSpendingInsights = () => (
    <div className="space-y-6">
      <LoopFundCard variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">Spending Breakdown</h3>
          <motion.div
            className="p-2 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl shadow-loopfund"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Clock className="w-5 h-5 text-white" />
          </motion.div>
        </div>
        <div className="h-40 relative">
          <div className="flex items-center justify-center h-full text-loopfund-neutral-400">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <PieChart className="w-12 h-12" />
            </motion.div>
          </div>
          {/* Floating background elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-loopfund-emerald-500/20 to-loopfund-mint-500/20 rounded-full animate-float"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-loopfund-coral-500/20 to-loopfund-orange-500/20 rounded-full animate-float-delayed"></div>
        </div>
        <div className="mt-6 space-y-3">
          {(data?.spending?.categories || []).map((category, index) => (
            <motion.div 
              key={index} 
              className="flex items-center justify-between p-3 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: category.color }}></div>
                <span className="font-body text-body-sm text-loopfund-neutral-700 dark:text-loopfund-neutral-300">{category.name}</span>
              </div>
              <span className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">{category.value}%</span>
            </motion.div>
          ))}
        </div>
      </LoopFundCard>
    </div>
  );

  const renderSavingsInsights = () => (
    <div className="space-y-6">
      <LoopFundCard variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">Savings Progress</h3>
          <motion.div
            className="p-2 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-xl shadow-loopfund"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Target className="w-5 h-5 text-white" />
          </motion.div>
        </div>
        <div className="h-40 relative">
          <div className="flex items-center justify-center h-full text-loopfund-neutral-400">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <LineChart className="w-12 h-12" />
            </motion.div>
          </div>
          {/* Floating background elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-loopfund-coral-500/20 to-loopfund-orange-500/20 rounded-full animate-float"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-loopfund-gold-500/20 to-loopfund-orange-500/20 rounded-full animate-float-delayed"></div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <motion.div 
            className="text-center p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-2xl font-display font-bold text-loopfund-emerald-600">{data?.savings?.rate || 0}%</div>
            <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Savings Rate</div>
          </motion.div>
          <motion.div 
            className="text-center p-4 bg-loopfund-gold-50 dark:bg-loopfund-gold-900/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-display font-bold text-loopfund-gold-600">${data?.savings?.current || 0}</div>
            <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Current</div>
          </motion.div>
          <motion.div 
            className="text-center p-4 bg-loopfund-lavender-50 dark:bg-loopfund-lavender-900/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-2xl font-display font-bold text-loopfund-lavender-600">${data?.savings?.goal || 0}</div>
            <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Goal</div>
          </motion.div>
        </div>
      </LoopFundCard>
    </div>
  );

  const renderInvestmentInsights = () => (
    <div className="space-y-6">
      <LoopFundCard variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">Portfolio Growth</h3>
          <motion.div
            className="p-2 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-xl shadow-loopfund"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </motion.div>
        </div>
        <div className="h-40 relative">
          <div className="flex items-center justify-center h-full text-loopfund-neutral-400">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-12 h-12" />
            </motion.div>
          </div>
          {/* Floating background elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-loopfund-gold-500/20 to-loopfund-orange-500/20 rounded-full animate-float"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-r from-loopfund-electric-500/20 to-loopfund-lavender-500/20 rounded-full animate-float-delayed"></div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <motion.div 
            className="text-center p-4 bg-loopfund-lavender-50 dark:bg-loopfund-lavender-900/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-2xl font-display font-bold text-loopfund-lavender-600">{data?.investments?.return || 0}%</div>
            <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Annual Return</div>
          </motion.div>
          <motion.div 
            className="text-center p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-display font-bold text-loopfund-emerald-600">${data?.investments?.total || 0}</div>
            <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Total Value</div>
          </motion.div>
          <motion.div 
            className="text-center p-4 bg-loopfund-electric-50 dark:bg-loopfund-electric-900/20 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-2xl font-display font-bold text-loopfund-electric-600">${data?.investments?.monthly || 0}</div>
            <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Monthly</div>
          </motion.div>
        </div>
      </LoopFundCard>
    </div>
  );

  const renderRecommendations = () => (
    <LoopFundCard variant="elevated" className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <motion.div
          className="p-2 bg-gradient-to-r from-loopfund-electric-500 to-loopfund-lavender-500 rounded-xl shadow-loopfund"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        <h3 className="text-lg font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">Smart Recommendations</h3>
      </div>
      <div className="space-y-4">
        {[
          { title: 'Increase Emergency Fund', impact: 'High Impact', action: 'Start Now', color: 'emerald' },
          { title: 'Diversify Investments', impact: 'Medium Impact', action: 'Learn More', color: 'gold' },
          { title: 'Reduce Dining Out', impact: 'Low Impact', action: 'Set Budget', color: 'coral' }
        ].map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
          >
            <h4 className="font-display font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text text-sm mb-3">{rec.title}</h4>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-body font-medium text-loopfund-${rec.color}-600 dark:text-loopfund-${rec.color}-400`}>{rec.impact}</span>
              <LoopFundButton 
                variant={rec.color === 'emerald' ? 'primary' : rec.color === 'gold' ? 'gold' : 'coral'}
                size="sm"
                className="text-xs"
              >
                {rec.action}
              </LoopFundButton>
            </div>
          </motion.div>
        ))}
      </div>
    </LoopFundCard>
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-6 border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-display font-bold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
            Financial Insights
          </h2>
          <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Real-time financial data and smart recommendations
          </p>
        </motion.div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        <LoopFundCard variant="elevated" className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              className="p-2 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl shadow-loopfund"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Crown className="w-5 h-5 text-white" />
            </motion.div>
            <h3 className="text-lg font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Your Financial Snapshot
            </h3>
          </div>
          <div className="flex space-x-2">
            {[
              { id: 'spending', label: 'Spending', icon: PieChart, color: 'emerald' },
              { id: 'savings', label: 'Savings', icon: LineChart, color: 'coral' },
              { id: 'investments', label: 'Investments', icon: TrendingUp, color: 'gold' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => onInsightChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-body transition-all duration-300 ${
                  activeInsight === tab.id
                    ? `bg-loopfund-${tab.color}-100 dark:bg-loopfund-${tab.color}-900/20 text-loopfund-${tab.color}-600 dark:text-loopfund-${tab.color}-400 shadow-loopfund`
                    : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </LoopFundCard>

        <motion.div
          key={activeInsight}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeInsight === 'spending' && renderSpendingInsights()}
          {activeInsight === 'savings' && renderSavingsInsights()}
          {activeInsight === 'investments' && renderInvestmentInsights()}
        </motion.div>

        {renderRecommendations()}
      </div>
    </div>
  );
};

export default FinancialInsightsPanel;
