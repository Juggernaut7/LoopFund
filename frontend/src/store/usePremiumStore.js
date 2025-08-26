import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePremiumStore = create(
  persist(
    (set, get) => ({
      // Premium state
      isPremium: false,
      subscriptionTier: 'free', // 'free', 'premium', 'enterprise'
      subscriptionStatus: 'inactive', // 'active', 'cancelled', 'expired'
      
      // Feature limits
      limits: {
        free: {
          aiMessagesPerMonth: 10,
          savingsPlansPerMonth: 3,
          budgetAnalysesPerMonth: 2,
          investmentAdvicePerMonth: 1,
          groupSavings: false,
          advancedAnalytics: false,
          prioritySupport: false,
          customAlerts: false
        },
        premium: {
          aiMessagesPerMonth: 100,
          savingsPlansPerMonth: 20,
          budgetAnalysesPerMonth: 15,
          investmentAdvicePerMonth: 10,
          groupSavings: true,
          advancedAnalytics: true,
          prioritySupport: true,
          customAlerts: true
        }
      },
      
      // Usage tracking
      usage: {
        aiMessagesThisMonth: 0,
        savingsPlansThisMonth: 0,
        budgetAnalysesThisMonth: 0,
        investmentAdviceThisMonth: 0
      },
      
      // Subscription details
      subscription: {
        planId: null,
        startDate: null,
        endDate: null,
        amount: null,
        currency: 'USD',
        autoRenew: true
      },
      
      // Actions
      upgradeToPremium: (planDetails) => {
        set({
          isPremium: true,
          subscriptionTier: 'premium',
          subscriptionStatus: 'active',
          subscription: {
            ...get().subscription,
            ...planDetails,
            startDate: new Date().toISOString()
          }
        });
      },
      
      cancelSubscription: () => {
        set({
          subscriptionStatus: 'cancelled',
          subscription: {
            ...get().subscription,
            endDate: new Date().toISOString()
          }
        });
      },
      
      resetToFree: () => {
        set({
          isPremium: false,
          subscriptionTier: 'free',
          subscriptionStatus: 'inactive',
          subscription: {
            planId: null,
            startDate: null,
            endDate: null,
            amount: null,
            currency: 'USD',
            autoRenew: false
          },
          usage: {
            aiMessagesThisMonth: 0,
            savingsPlansThisMonth: 0,
            budgetAnalysesThisMonth: 0,
            investmentAdviceThisMonth: 0
          }
        });
      },
      
      incrementUsage: (feature) => {
        const currentUsage = get().usage;
        const newUsage = {
          ...currentUsage,
          [`${feature}ThisMonth`]: currentUsage[`${feature}ThisMonth`] + 1
        };
        set({ usage: newUsage });
      },
      
      canUseFeature: (feature) => {
        const { subscriptionTier, limits, usage } = get();
        const tierLimits = limits[subscriptionTier];
        const currentUsage = usage[`${feature}ThisMonth`];
        const monthlyLimit = tierLimits[`${feature}PerMonth`];
        
        return currentUsage < monthlyLimit;
      },
      
      getFeatureLimit: (feature) => {
        const { subscriptionTier, limits } = get();
        return limits[subscriptionTier][`${feature}PerMonth`];
      },
      
      getFeatureUsage: (feature) => {
        const { usage } = get();
        return usage[`${feature}ThisMonth`];
      },
      
      getUsagePercentage: (feature) => {
        const { subscriptionTier, limits, usage } = get();
        const tierLimits = limits[subscriptionTier];
        const currentUsage = usage[`${feature}ThisMonth`];
        const monthlyLimit = tierLimits[`${feature}PerMonth`];
        
        return monthlyLimit > 0 ? (currentUsage / monthlyLimit) * 100 : 0;
      },
      
      isFeatureAvailable: (feature) => {
        const { subscriptionTier, limits } = get();
        return limits[subscriptionTier][feature] || false;
      }
    }),
    {
      name: 'loopfund-premium-storage',
      partialize: (state) => ({
        isPremium: state.isPremium,
        subscriptionTier: state.subscriptionTier,
        subscriptionStatus: state.subscriptionStatus,
        subscription: state.subscription,
        usage: state.usage
      })
    }
  )
);

export default usePremiumStore;
