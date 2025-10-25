import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Target,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  BarChart3,
  PiggyBank,
  X,
  Crown,
  Zap
} from 'lucide-react';
import { LoopFundButton, LoopFundCard, LoopFundInput } from '../ui';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://loopfund.onrender.com/api';

const AIFinancialAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    income: 5000,
    age: 25,
    current_savings: 2000,
    goals: ['Emergency Fund', 'Vacation'],
    risk_tolerance: 'moderate'
  });
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Pre-built financial questions for quick access
  const quickQuestions = [
    "How much should I save each month?",
    "What's the best way to budget my income?",
    "How do I build an emergency fund?",
    "Should I invest or save more?",
    "How can I reduce my expenses?",
    "What's a good savings rate?"
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: conversation.map(msg => ({
            user: msg.type === 'user' ? msg.content : '',
            ai: msg.type === 'ai' ? msg.content : ''
          })),
          user_context: userProfile
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          type: 'ai',
          content: data.response,
          timestamp: new Date()
        };
        setConversation(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'ai',
        content: 'Sorry, I\'m having trouble processing your request. Please try again.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
    setActiveTab('chat');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content) => {
    // Convert emojis and format the message nicely
    return content.split('\n').map((line, index) => (
      <div key={index} className="mb-2">
        {line}
      </div>
    ));
  };

  const getSavingsPlan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ai/savings-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal_amount: 5000,
          timeline_months: 12,
          monthly_income: userProfile.income,
          monthly_expenses: userProfile.income * 0.7
        }),
      });

      const data = await response.json();
      if (data.success) {
        const aiMessage = {
          type: 'ai',
          content: data.plan,
          timestamp: new Date()
        };
        setConversation(prev => [...prev, aiMessage]);
        setActiveTab('chat');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBudgetAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ai/budget-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          income: userProfile.income,
          expenses: {
            'Rent': userProfile.income * 0.3,
            'Food': userProfile.income * 0.15,
            'Transport': userProfile.income * 0.1,
            'Entertainment': userProfile.income * 0.1,
            'Utilities': userProfile.income * 0.05
          },
          goals: userProfile.goals
        }),
      });

      const data = await response.json();
      if (data.success) {
        const aiMessage = {
          type: 'ai',
          content: data.advice,
          timestamp: new Date()
        };
        setConversation(prev => [...prev, aiMessage]);
        setActiveTab('chat');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 text-white p-4 rounded-full shadow-loopfund-lg hover:shadow-loopfund-xl transition-all duration-300 z-50"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            "0 10px 25px rgba(16, 185, 129, 0.3)",
            "0 15px 35px rgba(16, 185, 129, 0.4)",
            "0 10px 25px rgba(16, 185, 129, 0.3)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain className="w-6 h-6" />
        </motion.div>
      </motion.button>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface rounded-2xl shadow-loopfund-xl w-full max-w-4xl h-[80vh] flex flex-col border border-loopfund-neutral-200 dark:border-loopfund-neutral-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 text-white p-6 rounded-t-2xl relative overflow-hidden">
                {/* Floating background elements */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/10 rounded-full animate-float-delayed"></div>
                <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-white/5 rounded-full animate-float-slow"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Brain className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">LoopFund AI</h2>
                      <p className="text-loopfund-neutral-100 font-body">Your Personal Financial Advisor</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                <motion.button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-4 px-4 text-center transition-all duration-300 font-body ${
                    activeTab === 'chat'
                      ? 'border-b-2 border-loopfund-emerald-500 text-loopfund-emerald-600 dark:text-loopfund-emerald-400 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20'
                      : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-emerald-600 dark:hover:text-loopfund-emerald-400 hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm font-medium">Chat</span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('tools')}
                  className={`flex-1 py-4 px-4 text-center transition-all duration-300 font-body ${
                    activeTab === 'tools'
                      ? 'border-b-2 border-loopfund-coral-500 text-loopfund-coral-600 dark:text-loopfund-coral-400 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20'
                      : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-coral-600 dark:hover:text-loopfund-coral-400 hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calculator className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm font-medium">Tools</span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('tips')}
                  className={`flex-1 py-4 px-4 text-center transition-all duration-300 font-body ${
                    activeTab === 'tips'
                      ? 'border-b-2 border-loopfund-gold-500 text-loopfund-gold-600 dark:text-loopfund-gold-400 bg-loopfund-gold-50 dark:bg-loopfund-gold-900/20'
                      : 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-gold-600 dark:hover:text-loopfund-gold-400 hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookOpen className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm font-medium">Tips</span>
                </motion.button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-full">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {conversation.length === 0 && (
                        <motion.div 
                          className="text-center text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Brain className="w-16 h-16 mx-auto mb-4 text-loopfund-neutral-300" />
                          </motion.div>
                          <h3 className="text-xl font-display font-semibold mb-2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">Welcome to LoopFund AI!</h3>
                          <p className="mb-6 font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Ask me anything about your finances, savings, or investments.</p>
                          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                            {quickQuestions.slice(0, 4).map((question, index) => (
                              <motion.button
                                key={index}
                                onClick={() => handleQuickQuestion(question)}
                                className="text-sm font-body bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 text-loopfund-emerald-600 dark:text-loopfund-emerald-400 p-3 rounded-xl hover:bg-loopfund-emerald-100 dark:hover:bg-loopfund-emerald-900/30 transition-all duration-300 border border-loopfund-emerald-200 dark:border-loopfund-emerald-800"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {question}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {conversation.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-2xl ${
                              msg.type === 'user'
                                ? 'bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 text-white shadow-loopfund'
                                : 'bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated text-loopfund-neutral-900 dark:text-loopfund-dark-text border border-loopfund-neutral-200 dark:border-loopfund-neutral-700'
                            }`}
                          >
                            <div className="font-body text-body">{formatMessage(msg.content)}</div>
                            <div className={`text-xs mt-2 font-body ${
                              msg.type === 'user' ? 'text-loopfund-neutral-100' : 'text-loopfund-neutral-500 dark:text-loopfund-neutral-400'
                            }`}>
                              {msg.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated p-4 rounded-2xl border border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                            <div className="flex items-center space-x-3">
                              <Loader2 className="w-5 h-5 animate-spin text-loopfund-emerald-600" />
                              <span className="text-loopfund-neutral-600 dark:text-loopfund-neutral-400 font-body">AI is thinking...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-loopfund-neutral-200 dark:border-loopfund-neutral-700">
                      <div className="flex space-x-3">
                        <LoopFundInput
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me about your finances..."
                          disabled={isLoading}
                          className="flex-1"
                        />
                        <LoopFundButton
                          onClick={handleSendMessage}
                          disabled={!message.trim() || isLoading}
                          variant="primary"
                          size="lg"
                          icon={<Send className="w-5 h-5" />}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tools' && (
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <motion.div
                        className="p-2 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-xl shadow-loopfund"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Calculator className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">Financial Tools</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.button
                        onClick={getSavingsPlan}
                        disabled={isLoading}
                        className="p-6 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700 rounded-xl hover:border-loopfund-emerald-300 dark:hover:border-loopfund-emerald-600 hover:bg-loopfund-emerald-50 dark:hover:bg-loopfund-emerald-900/20 transition-all duration-300 text-left group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="p-3 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">Savings Plan Generator</h4>
                        <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Get a personalized savings plan</p>
                      </motion.button>
                      
                      <motion.button
                        onClick={getBudgetAnalysis}
                        disabled={isLoading}
                        className="p-6 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700 rounded-xl hover:border-loopfund-coral-300 dark:hover:border-loopfund-coral-600 hover:bg-loopfund-coral-50 dark:hover:bg-loopfund-coral-900/20 transition-all duration-300 text-left group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="p-3 bg-gradient-to-r from-loopfund-coral-500 to-loopfund-orange-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                          <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">Budget Analysis</h4>
                        <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Analyze your spending patterns</p>
                      </motion.button>
                      
                      <motion.button
                        className="p-6 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700 rounded-xl hover:border-loopfund-gold-300 dark:hover:border-loopfund-gold-600 hover:bg-loopfund-gold-50 dark:hover:bg-loopfund-gold-900/20 transition-all duration-300 text-left group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="p-3 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                          <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">Investment Advice</h4>
                        <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Get investment recommendations</p>
                      </motion.button>
                      
                      <motion.button
                        className="p-6 border border-loopfund-neutral-200 dark:border-loopfund-neutral-700 rounded-xl hover:border-loopfund-electric-300 dark:hover:border-loopfund-electric-600 hover:bg-loopfund-electric-50 dark:hover:bg-loopfund-electric-900/20 transition-all duration-300 text-left group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="p-3 bg-gradient-to-r from-loopfund-electric-500 to-loopfund-lavender-500 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                          <PiggyBank className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">Emergency Fund Calculator</h4>
                        <p className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Calculate your emergency fund needs</p>
                      </motion.button>
                    </div>
                  </div>
                )}

                {activeTab === 'tips' && (
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <motion.div
                        className="p-2 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-xl shadow-loopfund"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-display font-semibold text-loopfund-neutral-900 dark:text-loopfund-dark-text">Quick Financial Tips</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        "💰 Pay yourself first - save 20% of your income before spending",
                        "📊 Track your expenses for 30 days to identify spending patterns",
                        "🎯 Set SMART financial goals (Specific, Measurable, Achievable, Relevant, Time-bound)",
                        "💳 Use credit cards responsibly - pay off the full balance each month",
                        "🏦 Build an emergency fund covering 3-6 months of expenses",
                        "📈 Start investing early - compound interest is your friend",
                        "🎉 Celebrate small financial wins to stay motivated",
                        "📱 Use apps like LoopFund to automate your savings",
                        "🏠 Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
                        "🔄 Review and adjust your financial plan quarterly"
                      ].map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 border-l-4 border-loopfund-emerald-500 rounded-r-xl hover:bg-loopfund-emerald-100 dark:hover:bg-loopfund-emerald-900/30 transition-colors"
                        >
                          <p className="text-loopfund-neutral-800 dark:text-loopfund-dark-text font-body text-body">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIFinancialAdvisor; 