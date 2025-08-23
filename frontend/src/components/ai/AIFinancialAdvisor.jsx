import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AIFinancialAdvisor = () => {
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getAdvice = async () => {
    if (!query.trim()) {
      toast.error('Please enter your financial question');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/ai/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: query.trim(),
          userProfile: {
            // Add user profile data here
            income: 50000,
            expenses: 30000,
            savings: 10000
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAdvice(data.data);
        toast.success('AI advice generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to get advice');
      }
    } catch (error) {
      console.error('AI advice error:', error);
      toast.error('Failed to get AI advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            AI Financial Advisor
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Get personalized financial advice powered by AI
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Ask your financial question
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., How much should I save for a house down payment? How can I optimize my budget?"
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <button
          onClick={getAdvice}
          disabled={isLoading || !query.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Getting Advice...
            </>
          ) : (
            <>
              <Lightbulb className="w-5 h-5 mr-2" />
              Get AI Advice
            </>
          )}
        </button>

        {advice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700"
          >
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  AI Financial Advice
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                  {advice}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIFinancialAdvisor; 