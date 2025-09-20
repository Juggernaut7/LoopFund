import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  TrendingUp, 
  Brain 
} from 'lucide-react';
import FinancialTherapist from '../components/ai/FinancialTherapist';

const FinancialTherapistPage = () => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                AI Financial Therapist
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Your personal AI therapist that understands your money psychology and helps you 
                overcome emotional spending triggers through personalized interventions.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Emotional Analysis
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  AI analyzes your emotional state and identifies spending triggers in real-time
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Smart Interventions
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Personalized strategies to prevent emotional spending and build healthier habits
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Progress Tracking
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Monitor your emotional spending patterns and track improvement over time
                </p>
              </div>
            </motion.div>
          </div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">1</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Share Your Feelings</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tell the AI about your current emotional state and money concerns
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">2</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">AI Analysis</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  AI analyzes your emotional patterns and identifies spending triggers
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Get Interventions</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receive personalized strategies to prevent emotional spending
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">4</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Track Progress</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monitor your improvement and build healthier financial habits
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI Therapist Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
              Start Your Therapy Session
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              The AI Financial Therapist is ready to help you understand your money psychology 
              and overcome emotional spending triggers. Click the floating button to begin.
            </p>
            
            {/* Placeholder for the therapist component */}
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                The AI Financial Therapist component will appear as a floating button
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating AI Therapist Button */}
        <FinancialTherapist />
      </div>
  );
};

export default FinancialTherapistPage; 