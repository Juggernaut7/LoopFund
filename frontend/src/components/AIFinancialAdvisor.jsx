import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePremiumStore from '../store/usePremiumStore';
import FeatureGate, { UsageIndicator } from './FeatureGate';

const AIFinancialAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { incrementUsage, canUseFeature } = usePremiumStore();
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const quickQuestions = [
    "How much should I save each month?",
    "What's the best way to budget my income?",
    "How do I build an emergency fund?",
    "Should I invest or save more?"
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Check if user can use AI feature
    if (!canUseFeature('aiMessages')) {
      return; // FeatureGate will handle the upgrade prompt
    }

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

          try {
        const response = await fetch('http://localhost:5001/ai/financial-advice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: message,
            userProfile: {}
          }),
        });

      const data = await response.json();

              if (data.success) {
          const aiMessage = {
            type: 'ai',
            content: data.data,
            timestamp: new Date()
          };
          setConversation(prev => [...prev, aiMessage]);
          
          // Increment usage after successful response
          incrementUsage('aiMessages');
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
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <FeatureGate feature="aiMessages" showUpgradePrompt={false}>
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🤖
        </motion.button>
      </FeatureGate>

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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[70vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🤖</div>
                    <div>
                      <h2 className="text-2xl font-bold">LoopFund AI</h2>
                      <p className="text-blue-100">Your Personal Financial Advisor</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <UsageIndicator feature="aiMessages" className="text-blue-100" />
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:text-blue-100 transition-colors text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="text-xl font-semibold mb-2">Welcome to LoopFund AI!</h3>
                    <p className="mb-4">Ask me anything about your finances, savings, or investments.</p>
                    <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                      {quickQuestions.map((question, index) => (
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
                      <div className="whitespace-pre-wrap">{msg.content}</div>
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
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
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
                    ➤
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIFinancialAdvisor;
