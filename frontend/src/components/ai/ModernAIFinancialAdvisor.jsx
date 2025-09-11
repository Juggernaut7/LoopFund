import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send,
  Mic,
  MicOff,
  Loader2,
  Sparkles,
  Brain,
  MessageCircle,
  X,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { apiService } from '../../services/api';

const ModernAIFinancialAdvisor = ({ onInsightUpdate, userProfile }) => {
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // Smart prompts that adapt based on conversation context
  const getSmartPrompts = () => {
    const lastMessage = conversation[conversation.length - 1];
    
    if (!lastMessage) {
      return [
        "Analyze my spending habits",
        "How can I save for a vacation?",
        "What should my emergency fund be?",
        "Review my savings rate"
      ];
    }
    
    // Context-aware prompts based on last AI response
    if (lastMessage.content.toLowerCase().includes('spending')) {
      return [
        "How can I reduce my food expenses?",
        "What's a good budget for entertainment?",
        "Should I track every expense?",
        "Help me create a spending plan"
      ];
    } else if (lastMessage.content.toLowerCase().includes('save')) {
      return [
        "How much should I save each month?",
        "What's the best savings account?",
        "Should I save or invest first?",
        "How to build an emergency fund?"
      ];
    } else if (lastMessage.content.toLowerCase().includes('invest')) {
      return [
        "What are index funds?",
        "How much should I invest?",
        "What's my risk tolerance?",
        "Should I use a robo-advisor?"
      ];
    }
    
    return [
      "Tell me more about that",
      "What are the next steps?",
      "How do I get started?",
      "What should I avoid?"
    ];
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      // Use the standard api service like all other components
      console.log('🚀 Making AI request using api service...');
      const response = await apiService.getAIAdvice(message, userProfile, 'financial_advisor');
      
      console.log('✅ AI request successful:', response.data);
      const data = response.data;

      if (data.success) {
        const aiMessage = {
          type: 'ai',
          content: data.data.advice || data.data,
          timestamp: new Date(),
          insights: data.data.insights || null,
          confidence: data.data.confidence || 0.8
        };
        setConversation(prev => [...prev, aiMessage]);
        
        // Update insights in parent component
        if (onInsightUpdate && data.data.insightType) {
          onInsightUpdate(data.data.insightType);
        }
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('❌ AI Request Error:', error);
      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      // Provide fallback responses based on the query
      let fallbackResponse = 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.';
      
      if (message.toLowerCase().includes('save') || message.toLowerCase().includes('savings')) {
        fallbackResponse = 'I recommend starting with a 20% savings rate if possible. Begin with an emergency fund of 3-6 months of expenses, then focus on your specific goals.';
      } else if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('spending')) {
        fallbackResponse = 'Consider the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Track your expenses for a month to understand your spending patterns.';
      } else if (message.toLowerCase().includes('invest') || message.toLowerCase().includes('investment')) {
        fallbackResponse = 'Start with low-cost index funds or ETFs. Consider your risk tolerance and time horizon. Diversify your portfolio across different asset classes.';
      } else if (message.toLowerCase().includes('emergency') || message.toLowerCase().includes('fund')) {
        fallbackResponse = 'Build an emergency fund covering 3-6 months of essential expenses in a high-yield savings account. Start small - even $500 can help with unexpected expenses.';
      }
      
      const errorMessage = {
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date(),
        confidence: 0.7
      };
      setConversation(prev => [...prev, errorMessage]);
      
      if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
        toast.error('Connection Error', 'Backend server is not running. Using fallback responses.');
      } else {
        toast.error('AI Error', 'Failed to get response from AI advisor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    toast.info('Voice Input', 'Voice input feature coming soon!');
  };

  const startNewChat = () => {
    setConversation([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 && (
          <div className="text-center text-slate-500 dark:text-slate-400 mt-8">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2">Welcome to your AI Financial Advisor!</h3>
            <p className="mb-6">I'm here to help you make better financial decisions. What would you like to know?</p>
            
            {/* Smart Prompts */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {getSmartPrompts().map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-left"
                >
                  {prompt}
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
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-xs mt-2 flex items-center justify-between ${
                msg.type === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
              }`}>
                <span>{msg.timestamp.toLocaleTimeString()}</span>
                {msg.type === 'ai' && msg.confidence && (
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{Math.round(msg.confidence * 100)}%</span>
                  </span>
                )}
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
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-slate-600 dark:text-slate-400">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        {/* Smart Prompts (shown when conversation exists) */}
        {conversation.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {getSmartPrompts().slice(0, 3).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your finances..."
              className="w-full p-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              disabled={isLoading}
            />
            <button
              onClick={toggleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                isListening ? 'text-red-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernAIFinancialAdvisor;
