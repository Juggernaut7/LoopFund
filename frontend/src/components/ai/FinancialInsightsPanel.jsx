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
  Clock
} from 'lucide-react';

const FinancialInsightsPanel = ({ activeInsight, recommendations, onInsightChange }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [activeInsight]);

  const loadInsights = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/analytics/user/summary', {
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
        { name: 'Food & Dining', value: 35, color: '#3B82F6' },
        { name: 'Transportation', value: 25, color: '#10B981' },
        { name: 'Entertainment', value: 20, color: '#F59E0B' },
        { name: 'Shopping', value: 15, color: '#EF4444' },
        { name: 'Utilities', value: 5, color: '#8B5CF6' }
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
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Financial Insights
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading insights...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderSpendingInsights = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Spending Breakdown</h3>
          <Clock className="w-5 h-5 text-green-600" />
        </div>
        <div className="h-40">
          <div className="flex items-center justify-center h-full text-slate-500">
            <PieChart className="w-12 h-12" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {(data?.spending?.categories || []).map((category, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                <span className="text-slate-600 dark:text-slate-400">{category.name}</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-white">{category.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSavingsInsights = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Savings Progress</h3>
          <Target className="w-5 h-5 text-green-600" />
        </div>
        <div className="h-40">
          <div className="flex items-center justify-center h-full text-slate-500">
            <LineChart className="w-12 h-12" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{data?.savings?.rate || 0}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Savings Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${data?.savings?.current || 0}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Current</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">${data?.savings?.goal || 0}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Goal</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvestmentInsights = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Portfolio Growth</h3>
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <div className="h-40">
          <div className="flex items-center justify-center h-full text-slate-500">
            <TrendingUp className="w-12 h-12" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data?.investments?.return || 0}%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Annual Return</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${data?.investments?.total || 0}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${data?.investments?.monthly || 0}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Monthly</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recommendations</h3>
      <div className="space-y-3">
        {[
          { title: 'Increase Emergency Fund', impact: 'High Impact', action: 'Start Now' },
          { title: 'Diversify Investments', impact: 'Medium Impact', action: 'Learn More' },
          { title: 'Reduce Dining Out', impact: 'Low Impact', action: 'Set Budget' }
        ].map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
          >
            <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">{rec.title}</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">{rec.impact}</span>
              <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                {rec.action}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Financial Insights
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Real-time financial data and recommendations
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Your Financial Snapshot
          </h3>
          <div className="flex space-x-2">
            {[
              { id: 'spending', label: 'Spending', icon: PieChart },
              { id: 'savings', label: 'Savings', icon: LineChart },
              { id: 'investments', label: 'Investments', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onInsightChange(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeInsight === tab.id
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

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
