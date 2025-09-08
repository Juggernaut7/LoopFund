import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  AlertTriangle, 
  Heart, 
  Brain, 
  Target,
  Zap,
  Shield,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  TrendingUp,
  Lightbulb,
  Timer,
  Bell,
  Settings,
  BarChart3,
  Calendar,
  Award,
  Sparkles,
  Plus
} from 'lucide-react';

const MicroInterventions = () => {
  const [isPauseActive, setIsPauseActive] = useState(false);
  const [pauseTime, setPauseTime] = useState(5);
  const [currentTime, setCurrentTime] = useState(pauseTime);
  const [interventionHistory, setInterventionHistory] = useState([]);
  const [emotionalTriggers, setEmotionalTriggers] = useState([]);
  const [habitStacking, setHabitStacking] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [interventionStats, setInterventionStats] = useState({
    totalInterventions: 0,
    successfulPauses: 0,
    emotionalTriggersDetected: 0,
    habitStacksCreated: 0
  });

  const pauseTimerRef = useRef(null);
  const emotionalAnalysisRef = useRef(null);

  // Sample emotional triggers
  useEffect(() => {
    const triggers = [
      { id: 1, trigger: 'Work stress', frequency: 8, lastDetected: '2 hours ago', intervention: '5-second pause' },
      { id: 2, trigger: 'Loneliness', frequency: 5, lastDetected: '1 day ago', intervention: 'Community support' },
      { id: 3, trigger: 'Celebration', frequency: 3, lastDetected: '3 days ago', intervention: 'Goal momentum' },
      { id: 4, trigger: 'Boredom', frequency: 6, lastDetected: '6 hours ago', intervention: 'Activity redirection' }
    ];
    setEmotionalTriggers(triggers);
  }, []);

  // Sample habit stacking
  useEffect(() => {
    const habits = [
      { id: 1, existingHabit: 'Morning coffee', newHabit: 'Check savings goals', time: '7:00 AM', status: 'active' },
      { id: 2, existingHabit: 'Lunch break', newHabit: 'Review daily spending', time: '12:00 PM', status: 'active' },
      { id: 3, existingHabit: 'Evening routine', newHabit: 'Transfer spare change', time: '8:00 PM', status: 'pending' }
    ];
    setHabitStacking(habits);
  }, []);

  // Start spending pause
  const startPause = () => {
    setIsPauseActive(true);
    setCurrentTime(pauseTime);
    
    pauseTimerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev <= 1) {
          clearInterval(pauseTimerRef.current);
          setIsPauseActive(false);
          setCurrentTime(pauseTime);
          
          // Record successful intervention
          const intervention = {
            id: Date.now(),
            type: 'spending_pause',
            duration: pauseTime,
            timestamp: new Date(),
            success: true
          };
          setInterventionHistory(prev => [intervention, ...prev]);
          setInterventionStats(prev => ({
            ...prev,
            totalInterventions: prev.totalInterventions + 1,
            successfulPauses: prev.successfulPauses + 1
          }));
          
          return pauseTime;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop pause
  const stopPause = () => {
    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
    }
    setIsPauseActive(false);
    setCurrentTime(pauseTime);
    
    // Record failed intervention
    const intervention = {
      id: Date.now(),
      type: 'spending_pause',
      duration: pauseTime - currentTime,
      timestamp: new Date(),
      success: false
    };
    setInterventionHistory(prev => [intervention, ...prev]);
    setInterventionStats(prev => ({
      ...prev,
      totalInterventions: prev.totalInterventions + 1
    }));
  };

  // Emotional state detection simulation
  const detectEmotionalState = () => {
    const emotionalStates = ['stressed', 'anxious', 'excited', 'sad', 'neutral'];
    const randomState = emotionalStates[Math.floor(Math.random() * emotionalStates.length)];
    
    // Simulate emotional trigger detection
    if (randomState === 'stressed' || randomState === 'anxious') {
      const newTrigger = {
        id: Date.now(),
        trigger: `${randomState} state detected`,
        frequency: 1,
        lastDetected: 'Just now',
        intervention: 'Immediate pause recommended'
      };
      setEmotionalTriggers(prev => [newTrigger, ...prev]);
      setInterventionStats(prev => ({
        ...prev,
        emotionalTriggersDetected: prev.emotionalTriggersDetected + 1
      }));
    }
    
    return randomState;
  };

  // Create new habit stack
  const createHabitStack = () => {
    const newHabit = {
      id: Date.now(),
      existingHabit: 'New routine',
      newHabit: 'Financial wellness action',
      time: '9:00 AM',
      status: 'pending'
    };
    setHabitStacking(prev => [...prev, newHabit]);
    setInterventionStats(prev => ({
      ...prev,
      habitStacksCreated: prev.habitStacksCreated + 1
    }));
  };

  // Get intervention effectiveness
  const getEffectiveness = () => {
    if (interventionStats.totalInterventions === 0) return 0;
    return Math.round((interventionStats.successfulPauses / interventionStats.totalInterventions) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Behavioral Micro-Interventions
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Real-time interventions to prevent emotional spending and build better habits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Spending Pause */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pause className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Spending Pause
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Take a moment before spending to make better decisions
                </p>
              </div>

              {/* Pause Timer */}
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="8"
                      strokeDasharray={`${(currentTime / pauseTime) * 283} 283`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {currentTime}s
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {!isPauseActive ? (
                    <button
                      onClick={startPause}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                    >
                      Start Pause
                    </button>
                  ) : (
                    <button
                      onClick={stopPause}
                      className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold"
                    >
                      Stop Pause
                    </button>
                  )}
                  
                  <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Timer className="w-4 h-4" />
                    <span>Default: {pauseTime} seconds</span>
                  </div>
                </div>
              </div>

              {/* Pause Settings */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Pause Duration</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 10].map((seconds) => (
                    <button
                      key={seconds}
                      onClick={() => setPauseTime(seconds)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        pauseTime === seconds
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {seconds}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Emotional Triggers */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Emotional Triggers
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Identify and manage spending triggers
                  </p>
                </div>
                <button
                  onClick={detectEmotionalState}
                  className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <Brain className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Triggers List */}
              <div className="space-y-3 mb-6">
                {emotionalTriggers.slice(0, 4).map((trigger) => (
                  <motion.div
                    key={trigger.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900 dark:text-white text-sm">
                        {trigger.trigger}
                      </span>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        {trigger.frequency}x
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{trigger.lastDetected}</span>
                      <span className="text-purple-600 dark:text-purple-400">
                        {trigger.intervention}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="w-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  High Risk Detected
                </button>
                <button className="w-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                  <Heart className="w-4 h-4 inline mr-2" />
                  Emotional Support
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Habit Stacking */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Habit Stacking
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Build financial habits on existing routines
                  </p>
                </div>
                <button
                  onClick={createHabitStack}
                  className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Habits List */}
              <div className="space-y-3 mb-6">
                {habitStacking.map((habit) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900 dark:text-white text-sm">
                        {habit.existingHabit}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        habit.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {habit.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      + {habit.newHabit}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{habit.time}</span>
                      <Target className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Habit Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Tip:</strong> Stack new financial habits onto existing routines for better success rates.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Statistics & History */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Intervention Statistics */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Intervention Effectiveness
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">{getEffectiveness()}%</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Success Rate</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">{interventionStats.totalInterventions}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Interventions</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Successful Pauses</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {interventionStats.successfulPauses}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Emotional Triggers</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {interventionStats.emotionalTriggersDetected}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Habit Stacks</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {interventionStats.habitStacksCreated}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Interventions */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Recent Interventions
            </h3>
            
            <div className="space-y-3">
              {interventionHistory.slice(0, 5).map((intervention) => (
                <div
                  key={intervention.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {intervention.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {intervention.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {intervention.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {intervention.duration}s
                  </div>
                </div>
              ))}
              
              {interventionHistory.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p>No interventions yet</p>
                  <p className="text-sm">Start using the spending pause to see your history</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicroInterventions; 