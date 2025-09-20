import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  Send,
  Mic,
  MicOff,
  BarChart3,
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb,
  Sparkles,
  Loader2,
  RefreshCw,
  Download,
  Share2,
  Settings,
  X,
  Plus,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuthStore } from '../store/useAuthStore';
import ModernAIFinancialAdvisor from '../components/ai/ModernAIFinancialAdvisor';
import FinancialInsightsPanel from '../components/ai/FinancialInsightsPanel';

const AIAdvisorPage = () => {
  const [showNewChat, setShowNewChat] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeInsight, setActiveInsight] = useState('spending');
  const { toast } = useToast();
  const { user } = useAuthStore();

  const recommendations = [
    {
      id: 1,
      title: "Reduce dining out expenses",
      description: "You're spending 35% on food. Try meal planning to save $200/month.",
      action: "Set Budget",
      priority: "high",
      impact: "Save $200/month"
    },
    {
      id: 2,
      title: "Increase emergency fund",
      description: "Build 3-6 months of expenses. You're currently at 1.2 months.",
      action: "Create Goal",
      priority: "medium",
      impact: "Financial security"
    },
    {
      id: 3,
      title: "Start investing",
      description: "Consider a low-cost index fund for long-term growth.",
      action: "Learn More",
      priority: "low",
      impact: "Build wealth"
    }
  ];

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user || data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set mock user profile for testing
      setUserProfile({
        firstName: 'Ahmad',
        lastName: 'Soliu Bolakale',
        email: 'juggernaut0700@gmail.com',
        income: 5000,
        age: 25
      });
    }
  };

  const handleNewChat = () => {
    setShowNewChat(false);
    // The ModernAIFinancialAdvisor component will handle its own conversation state
  };

  const handleInsightChange = (insightType) => {
    setActiveInsight(insightType);
  };

  return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  AI Financial Advisor
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Your personal AI-powered financial planning assistant
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowNewChat(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Modern AI Advisor Layout */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900">
          <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 min-h-0">
            
            {/* Left Panel - Chat Interface (70% width on large screens) */}
            <div className="flex-1 flex flex-col min-h-0 lg:max-w-none">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[600px] overflow-hidden">
                
                {/* Enhanced Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          AI Financial Advisor
                        </h2>
                        <p className="text-blue-100 text-sm">
                          Your personal financial guidance assistant
                        </p>
                      </div>
                    </div>
                    <div className="hidden lg:flex items-center space-x-3">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Chat Interface - Takes remaining space */}
                <div className="flex-1 flex flex-col min-h-0">
                  <ModernAIFinancialAdvisor 
                    onInsightUpdate={handleInsightChange}
                    userProfile={userProfile}
                  />
                </div>
              </div>
            </div>
            
            {/* Right Panel - Financial Insights (30% width on large screens) */}
            <div className="w-full lg:w-96 xl:w-[420px] flex flex-col min-h-0">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[600px] overflow-hidden">
                <FinancialInsightsPanel 
                  activeInsight={activeInsight}
                  recommendations={recommendations}
                  onInsightChange={handleInsightChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* New Chat Confirmation Modal */}
        <AnimatePresence>
          {showNewChat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewChat(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Start New Chat</h3>
                  <button
                    onClick={() => setShowNewChat(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Are you sure you want to start a new conversation? Your current chat history will be cleared.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewChat(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNewChat}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default AIAdvisorPage;
