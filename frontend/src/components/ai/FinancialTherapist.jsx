import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  AlertTriangle, 
  Lightbulb, 
  TrendingDown,
  Shield,
  MessageCircle,
  Clock,
  Target,
  Zap,
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';

const FinancialTherapist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [emotionalState, setEmotionalState] = useState('neutral');
  const [spendingTriggers, setSpendingTriggers] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessionHistory]);

  // Emotional state detection based on user input
  const analyzeEmotionalState = (text) => {
    const stressWords = ['stressed', 'anxious', 'worried', 'overwhelmed', 'frustrated', 'angry'];
    const happyWords = ['happy', 'excited', 'confident', 'motivated', 'proud', 'grateful'];
    const sadWords = ['sad', 'depressed', 'lonely', 'hopeless', 'tired', 'empty'];
    
    const lowerText = text.toLowerCase();
    let stressScore = 0;
    let happyScore = 0;
    let sadScore = 0;
    
    stressWords.forEach(word => {
      if (lowerText.includes(word)) stressScore += 2;
    });
    
    happyWords.forEach(word => {
      if (lowerText.includes(word)) happyScore += 2;
    });
    
    sadWords.forEach(word => {
      if (lowerText.includes(word)) sadScore += 2;
    });
    
    // Analyze spending triggers
    const spendingTriggers = [];
    if (lowerText.includes('shopping') || lowerText.includes('buy')) spendingTriggers.push('retail therapy');
    if (lowerText.includes('food') || lowerText.includes('eat')) spendingTriggers.push('emotional eating');
    if (lowerText.includes('drink') || lowerText.includes('alcohol')) spendingTriggers.push('stress relief');
    if (lowerText.includes('online') || lowerText.includes('amazon')) spendingTriggers.push('impulse buying');
    
    setSpendingTriggers(spendingTriggers);
    
    // Determine emotional state
    if (stressScore > happyScore && stressScore > sadScore) {
      setEmotionalState('stressed');
      return 'stressed';
    } else if (happyScore > stressScore && happyScore > sadScore) {
      setEmotionalState('happy');
      return 'happy';
    } else if (sadScore > stressScore && sadScore > happyScore) {
      setEmotionalState('sad');
      return 'sad';
    } else {
      setEmotionalState('neutral');
      return 'neutral';
    }
  };

  // Generate personalized interventions
  const generateInterventions = (emotionalState, triggers) => {
    const interventionMap = {
      stressed: [
        {
          type: 'pause',
          title: '5-Second Spending Pause',
          description: 'Take 5 deep breaths before any purchase',
          icon: Clock,
          color: 'text-orange-500',
          action: 'Start Pause Timer'
        },
        {
          type: 'redirect',
          title: 'Stress Relief Alternatives',
          description: 'Try free stress relief activities instead',
          icon: Heart,
          color: 'text-red-500',
          action: 'Show Alternatives'
        }
      ],
      sad: [
        {
          type: 'micro-savings',
          title: 'Emotional Savings Boost',
          description: 'Save the money you would spend on comfort',
          icon: Target,
          color: 'text-blue-500',
          action: 'Start Micro-Savings'
        },
        {
          type: 'community',
          title: 'Community Support',
          description: 'Connect with others feeling similar',
          icon: MessageCircle,
          color: 'text-green-500',
          action: 'Join Support Group'
        }
      ],
      happy: [
        {
          type: 'celebration',
          title: 'Celebration Savings',
          description: 'Channel your positive energy into savings',
          icon: Sparkles,
          color: 'text-yellow-500',
          action: 'Boost Savings'
        },
        {
          type: 'goal-setting',
          title: 'Goal Momentum',
          description: 'Use your motivation to set new goals',
          icon: Target,
          color: 'text-purple-500',
          action: 'Set New Goal'
        }
      ]
    };
    
    const baseInterventions = [
      {
        type: 'awareness',
        title: 'Spending Trigger Alert',
        description: 'Get notified when you\'re about to spend emotionally',
        icon: AlertTriangle,
        color: 'text-red-500',
        action: 'Enable Alerts'
      }
    ];
    
    const emotionalInterventions = interventionMap[emotionalState] || [];
    setInterventions([...emotionalInterventions, ...baseInterventions]);
  };

  // Start therapy session
  const startSession = () => {
    const session = {
      id: Date.now(),
      startTime: new Date(),
      emotionalState: 'neutral',
      interventions: [],
      notes: []
    };
    setCurrentSession(session);
    setSessionHistory(prev => [...prev, session]);
  };

  // Handle user input and analysis
  const handleUserInput = async (input) => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    
    // Add user message to session
    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setSessionHistory(prev => [...prev, userMessage]);
    
    // Analyze emotional state
    const detectedState = analyzeEmotionalState(input);
    
    // Generate interventions
    generateInterventions(detectedState, spendingTriggers);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(detectedState, spendingTriggers);
      const aiMessage = {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        emotionalState: detectedState,
        interventions: interventions
      };
      
      setSessionHistory(prev => [...prev, aiMessage]);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Generate AI response based on emotional state
  const generateAIResponse = (state, triggers) => {
    const responses = {
      stressed: `I can see you're feeling stressed right now. This is a common trigger for emotional spending. I've identified ${triggers.length > 0 ? triggers.join(', ') : 'some potential spending triggers'}. Let me help you with some interventions to prevent stress-based spending.`,
      sad: `I understand you're feeling down. Emotional spending often happens when we're sad as we seek comfort. I've prepared some gentle interventions to help you channel these feelings into positive financial actions instead.`,
      happy: `It's wonderful that you're feeling positive! This is actually a great time to build momentum with your financial goals. Let me show you how to channel this energy into lasting financial wellness.`,
      neutral: `I'm here to help you maintain your financial wellness. Let me analyze your current state and provide some proactive interventions to keep you on track.`
    };
    
    return responses[state] || responses.neutral;
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Brain className="w-6 h-6" />
      </motion.button>

      {/* Main Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">AI Financial Therapist</h2>
                      <p className="text-primary-100">Your emotional spending coach</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex h-[600px]">
                {/* Left Panel - Session History */}
                <div className="flex-1 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Therapy Session</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Share your feelings about money</p>
                  </div>
                  
                  {/* Session History */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {sessionHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">Start your financial therapy session</p>
                        <button
                          onClick={startSession}
                          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Begin Session
                        </button>
                      </div>
                    ) : (
                      sessionHistory.map((message, index) => (
                        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                              <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {isAnalyzing && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Analyzing your emotional state...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Share your feelings about money..."
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleUserInput(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector('input');
                          if (input && input.value.trim()) {
                            handleUserInput(input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Analysis & Interventions */}
                <div className="w-80 bg-slate-50 dark:bg-slate-800 p-4 space-y-4">
                  {/* Emotional State */}
                  <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Current Emotional State</h4>
                    <div className={`text-center p-3 rounded-lg ${
                      emotionalState === 'stressed' ? 'bg-orange-100 text-orange-800' :
                      emotionalState === 'sad' ? 'bg-blue-100 text-blue-800' :
                      emotionalState === 'happy' ? 'bg-green-100 text-green-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      <div className="text-2xl font-bold capitalize">{emotionalState}</div>
                      <div className="text-sm opacity-80">
                        {emotionalState === 'stressed' ? 'High spending risk' :
                         emotionalState === 'sad' ? 'Comfort spending likely' :
                         emotionalState === 'happy' ? 'Good for goal setting' :
                         'Stable financial state'}
                      </div>
                    </div>
                  </div>

                  {/* Spending Triggers */}
                  {spendingTriggers.length > 0 && (
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Identified Triggers</h4>
                      <div className="space-y-2">
                        {spendingTriggers.map((trigger, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            <span className="text-slate-700 dark:text-slate-300 capitalize">{trigger}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interventions */}
                  {interventions.length > 0 && (
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Recommended Interventions</h4>
                      <div className="space-y-3">
                        {interventions.map((intervention, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 bg-slate-50 dark:bg-slate-600 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-500 transition-colors"
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <intervention.icon className={`w-4 h-4 ${intervention.color}`} />
                              <span className="font-medium text-slate-900 dark:text-white text-sm">
                                {intervention.title}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                              {intervention.description}
                            </p>
                                                  <button className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700 transition-colors">
                        {intervention.action}
                      </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FinancialTherapist; 