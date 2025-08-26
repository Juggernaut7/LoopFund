import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Zap } from 'lucide-react';
import usePremiumStore from '../store/usePremiumStore';
import PremiumUpgradeModal from './PremiumUpgradeModal';

const FeatureGate = ({ 
  children, 
  feature, 
  showUpgradePrompt = true, 
  fallback = null,
  className = ""
}) => {
  const { 
    isPremium, 
    canUseFeature, 
    getFeatureLimit, 
    getFeatureUsage, 
    getUsagePercentage,
    isFeatureAvailable 
  } = usePremiumStore();
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check if feature is available for the user's tier
  if (!isFeatureAvailable(feature)) {
    return (
      <div className={`relative ${className}`}>
        {children}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg text-center">
            <Lock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              This feature requires Premium
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
        
        <PremiumUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          triggerFeature={feature}
        />
      </div>
    );
  }

  // Check if user can use the feature (within limits)
  if (!canUseFeature(feature)) {
    if (fallback) {
      return fallback;
    }

    if (!showUpgradePrompt) {
      return null;
    }

    return (
      <div className={`relative ${className}`}>
        {children}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg text-center max-w-sm">
            <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              You've reached your monthly limit for this feature
            </p>
            <div className="text-xs text-slate-500 dark:text-slate-500 mb-3">
              {getFeatureUsage(feature)} / {getFeatureLimit(feature)} used this month
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Upgrade for Unlimited
            </button>
          </div>
        </div>
        
        <PremiumUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          triggerFeature={feature}
        />
      </div>
    );
  }

  // Feature is available and within limits
  return (
    <>
      {children}
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        triggerFeature={feature}
      />
    </>
  );
};

// Usage indicator component
export const UsageIndicator = ({ feature, className = "" }) => {
  const { 
    isPremium, 
    getFeatureLimit, 
    getFeatureUsage, 
    getUsagePercentage,
    isFeatureAvailable 
  } = usePremiumStore();

  if (!isFeatureAvailable(feature)) {
    return (
      <div className={`flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 ${className}`}>
        <Lock className="w-4 h-4" />
        <span>Premium Feature</span>
      </div>
    );
  }

  const usage = getFeatureUsage(feature);
  const limit = getFeatureLimit(feature);
  const percentage = getUsagePercentage(feature);

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {isPremium ? (
        <>
          <Crown className="w-4 h-4 text-yellow-500" />
          <span className="text-slate-600 dark:text-slate-400">Unlimited</span>
        </>
      ) : (
        <>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="text-slate-600 dark:text-slate-400">
              {usage}/{limit}
            </span>
          </div>
          {percentage > 80 && (
            <span className="text-orange-600 dark:text-orange-400 text-xs">
              {Math.round(percentage)}% used
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default FeatureGate;
