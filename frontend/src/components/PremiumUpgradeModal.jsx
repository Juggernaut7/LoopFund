import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Headphones,
  BarChart3,
  Users,
  Bell,
  Crown
} from 'lucide-react';
import usePremiumStore from '../store/usePremiumStore';

const PremiumUpgradeModal = ({ isOpen, onClose, triggerFeature = null }) => {
  const { upgradeToPremium, subscriptionTier } = usePremiumStore();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    monthly: {
      name: 'Monthly Premium',
      price: 9.99,
      period: 'month',
      savings: null,
      popular: false
    },
    yearly: {
      name: 'Yearly Premium',
      price: 99.99,
      period: 'year',
      savings: 'Save 17%',
      popular: true
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Unlimited AI Conversations',
      description: 'Get personalized financial advice 24/7',
      free: '10/month',
      premium: 'Unlimited'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into your spending patterns',
      free: 'Basic',
      premium: 'Advanced'
    },
    {
      icon: Users,
      title: 'Group Savings',
      description: 'Collaborate with friends and family',
      free: 'Not available',
      premium: 'Available'
    },
    {
      icon: Bell,
      title: 'Custom Alerts',
      description: 'Personalized notifications and reminders',
      free: 'Basic',
      premium: 'Custom'
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      description: 'Get help when you need it most',
      free: 'Standard',
      premium: 'Priority'
    }
  ];

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Upgrade user
      upgradeToPremium({
        planId: selectedPlan,
        amount: plans[selectedPlan].price,
        currency: 'USD'
      });
      
      onClose();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getTriggerMessage = () => {
    if (!triggerFeature) return null;
    
    const messages = {
      aiMessages: 'You\'ve reached your monthly AI message limit',
      savingsPlans: 'You\'ve reached your monthly savings plan limit',
      budgetAnalyses: 'You\'ve reached your monthly budget analysis limit',
      investmentAdvice: 'You\'ve reached your monthly investment advice limit',
      groupSavings: 'Group savings is a premium feature',
      advancedAnalytics: 'Advanced analytics is a premium feature'
    };
    
    return messages[triggerFeature] || 'Upgrade to unlock premium features';
  };

  return (
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
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="relative p-8 border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Unlock Premium Features
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  {getTriggerMessage() || 'Get unlimited access to advanced financial planning tools'}
                </p>
              </div>
            </div>

            {/* Plans Selection */}
            <div className="p-8 border-b border-slate-200 dark:border-slate-700">
              <div className="flex gap-4 mb-6">
                {Object.entries(plans).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`flex-1 p-6 rounded-xl border-2 transition-all ${
                      selectedPlan === key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-center">
                      {plan.popular && (
                        <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                          Most Popular
                        </span>
                      )}
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                        ${plan.price}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 mb-2">
                        per {plan.period}
                      </div>
                      {plan.savings && (
                        <div className="text-green-600 dark:text-green-400 text-sm font-semibold">
                          {plan.savings}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features Comparison */}
            <div className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 text-center">
                What You Get
              </h3>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <feature.icon className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {feature.title}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {feature.free}
                      </div>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {feature.premium}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="text-center">
                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Upgrade to Premium - $${plans[selectedPlan].price}/${plans[selectedPlan].period}`}
                </button>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                  Cancel anytime. No commitment required.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumUpgradeModal;
