import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  Lightbulb, 
  TrendingUp,
  Loader,
  Sparkles,
  Target,
  DollarSign
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com/api';

const FinancialAdvisor = () => {
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [contextType, setContextType] = useState('general');
  const { user } = useAuthStore();
  const { toast } = useToast();

  const contextOptions = [
    { value: 'general', label: 'General Advice', icon: Lightbulb },
    { value: 'savings_plan', label: 'Savings Plan', icon: Target },
    { value: 'goal_setting', label: 'Goal Setting', icon: TrendingUp },
    { value: 'budget_advice', label: 'Budgeting', icon: DollarSign }
  ];

  const getAdvice = async () => {
    if (!query.trim()) {
      toast.error('Please enter a question first');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ai/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query: query.trim(),
          context_type: contextType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const newAdvice = {
          id: Date.now(),
          query: query.trim(),
          advice: data.data.advice,
          context: contextType,
          timestamp: new Date().toISOString(),
          confidence: data.data.confidence
        };
        
        setAdvice(newAdvice);
        setConversationHistory(prev => [newAdvice, ...prev.slice(0, 4)]);
        setQuery('');
        
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getAdvice();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            🤖 AI Financial Advisor
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get personalized financial advice powered by AI
          </p>
        </div>
      </div>

      {/* Context Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Advice Context
        </label>
        <div className="flex flex-wrap gap-2">
          {contextOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setContextType(option.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  contextType === option.value
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your finances... (e.g., 'How much should I save for a house down payment?')"
            className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            rows={3}
          />
          <button
            onClick={getAdvice}
            disabled={isLoading || !query.trim()}
            className="absolute right-3 bottom-3 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <MessageCircle className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Current Advice */}
      <AnimatePresence>
        {advice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      AI Advice
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {advice.confidence * 100}% confidence
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {advice.advice}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recent Conversations
          </h4>
          <div className="space-y-3">
            {conversationHistory.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3"
              >
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {item.query}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FinancialAdvisor; 