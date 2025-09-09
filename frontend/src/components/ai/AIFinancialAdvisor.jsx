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
  PiggyBank
} from 'lucide-react';

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
      const response = await fetch('http://localhost:5000/api/ai/chat', {
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
      const response = await fetch('http://localhost:5000/api/ai/savings-plan', {
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
      const response = await fetch('http://localhost:5000/api/ai/budget-analysis', {
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
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Brain className="w-6 h-6" />
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-8 h-8" />
                    <div>
                      <h2 className="text-2xl font-bold">LoopFund AI</h2>
                      <p className="text-blue-100">Your Personal Financial Advisor</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-blue-100 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 px-4 text-center transition-colors ${
                    activeTab === 'chat'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 mx-auto mb-1" />
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`flex-1 py-3 px-4 text-center transition-colors ${
                    activeTab === 'tools'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Calculator className="w-5 h-5 mx-auto mb-1" />
                  Tools
                </button>
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`flex-1 py-3 px-4 text-center transition-colors ${
                    activeTab === 'tips'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-blue-600'
                  }`}
                >
                  <BookOpen className="w-5 h-5 mx-auto mb-1" />
                  Tips
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-full">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {conversation.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                          <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-xl font-semibold mb-2">Welcome to LoopFund AI!</h3>
                          <p className="mb-4">Ask me anything about your finances, savings, or investments.</p>
                          <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                            {quickQuestions.slice(0, 4).map((question, index) => (
                              <button
                                key={index}
                                onClick={() => handleQuickQuestion(question)}
                                className="text-sm bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
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
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {formatMessage(msg.content)}
                            <div className={`text-xs mt-2 ${
                              msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
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
                          <div className="bg-gray-100 p-4 rounded-2xl">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                              <span className="text-gray-600">AI is thinking...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me about your finances..."
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoading}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!message.trim() || isLoading}
                          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tools' && (
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Financial Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={getSavingsPlan}
                        disabled={isLoading}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      >
                        <Target className="w-8 h-8 text-blue-600 mb-2" />
                        <h4 className="font-semibold">Savings Plan Generator</h4>
                        <p className="text-sm text-gray-600">Get a personalized savings plan</p>
                      </button>
                      
                      <button
                        onClick={getBudgetAnalysis}
                        disabled={isLoading}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      >
                        <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                        <h4 className="font-semibold">Budget Analysis</h4>
                        <p className="text-sm text-gray-600">Analyze your spending patterns</p>
                      </button>
                      
                      <button
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      >
                        <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                        <h4 className="font-semibold">Investment Advice</h4>
                        <p className="text-sm text-gray-600">Get investment recommendations</p>
                      </button>
                      
                      <button
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      >
                        <PiggyBank className="w-8 h-8 text-orange-600 mb-2" />
                        <h4 className="font-semibold">Emergency Fund Calculator</h4>
                        <p className="text-sm text-gray-600">Calculate your emergency fund needs</p>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'tips' && (
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Quick Financial Tips</h3>
                    <div className="space-y-3">
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
                          className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg"
                        >
                          <p className="text-gray-800">{tip}</p>
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