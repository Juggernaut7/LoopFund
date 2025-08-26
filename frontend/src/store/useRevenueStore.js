import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRevenueStore = create(
  persist(
    (set, get) => ({
      // Revenue configuration
      pricing: {
        baseFeePercentage: 0.01, // 1% base fee
        memberMultiplier: 0.001, // +0.1% per additional member
        durationMultiplier: 0.0005, // +0.05% per month
        minFee: 5.00, // Minimum $5 fee
        maxFee: 100.00, // Maximum $100 fee
        memberThreshold: 2, // Start charging after 2 members
        durationThreshold: 1 // Start charging after 1 month
      },
      
      // Premium features pricing
      premiumFeatures: {
        groupAnalytics: 2.99, // Monthly subscription
        customBranding: 4.99, // One-time fee
        prioritySupport: 1.99, // Monthly subscription
        advancedNotifications: 0.99, // Monthly subscription
        exportData: 1.49, // Per export
        whiteLabel: 19.99 // Monthly subscription
      },
      
      // Transaction history
      transactions: [],
      
      // Revenue analytics
      analytics: {
        totalRevenue: 0,
        monthlyRevenue: 0,
        groupFees: 0,
        premiumSubscriptions: 0,
        oneTimeFees: 0
      },
      
      // Actions
      calculateGroupFee: (goalAmount, memberCount, durationMonths, premiumFeatures = []) => {
        const { pricing } = get();
        
        // Base calculation
        let feePercentage = pricing.baseFeePercentage;
        
        // Member multiplier (after threshold)
        if (memberCount > pricing.memberThreshold) {
          const additionalMembers = memberCount - pricing.memberThreshold;
          feePercentage += additionalMembers * pricing.memberMultiplier;
        }
        
        // Duration multiplier (after threshold)
        if (durationMonths > pricing.durationThreshold) {
          const additionalMonths = durationMonths - pricing.durationThreshold;
          feePercentage += additionalMonths * pricing.durationMultiplier;
        }
        
        // Calculate fee amount
        let feeAmount = goalAmount * feePercentage;
        
        // Apply min/max constraints
        feeAmount = Math.max(pricing.minFee, Math.min(pricing.maxFee, feeAmount));
        
        // Add premium feature costs
        let premiumCost = 0;
        premiumFeatures.forEach(feature => {
          if (get().premiumFeatures[feature]) {
            premiumCost += get().premiumFeatures[feature];
          }
        });
        
        const totalFee = feeAmount + premiumCost;
        
        return {
          baseFee: feeAmount,
          premiumCost: premiumCost,
          totalFee: totalFee,
          feePercentage: (feePercentage * 100).toFixed(2),
          breakdown: {
            goalAmount,
            memberCount,
            durationMonths,
            baseFeePercentage: (pricing.baseFeePercentage * 100).toFixed(2),
            memberMultiplier: (pricing.memberMultiplier * 100).toFixed(2),
            durationMultiplier: (pricing.durationMultiplier * 100).toFixed(2),
            premiumFeatures
          }
        };
      },
      
      // Get pricing recommendations
      getPricingRecommendations: (goalAmount, memberCount, durationMonths) => {
        const { pricing } = get();
        
        const recommendations = [];
        
        // Member optimization
        if (memberCount > 8) {
          recommendations.push({
            type: 'warning',
            message: 'Large groups may have coordination challenges',
            suggestion: 'Consider breaking into smaller subgroups',
            impact: 'May increase fees due to member count'
          });
        }
        
        // Duration optimization
        if (durationMonths > 24) {
          recommendations.push({
            type: 'info',
            message: 'Long-term goals have higher fees',
            suggestion: 'Consider shorter milestones',
            impact: `+${((durationMonths - pricing.durationThreshold) * pricing.durationMultiplier * 100).toFixed(2)}% fee increase`
          });
        }
        
        // Goal amount optimization
        if (goalAmount > 10000) {
          recommendations.push({
            type: 'success',
            message: 'Large goals are more cost-effective',
            suggestion: 'Good value for money',
            impact: 'Lower percentage fees due to cap'
          });
        }
        
        return recommendations;
      },
      
      // Record transaction
      recordTransaction: (transaction) => {
        const { transactions, analytics } = get();
        
        const newTransaction = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ...transaction
        };
        
        // Update analytics
        const newAnalytics = { ...analytics };
        
        if (transaction.type === 'group_fee') {
          newAnalytics.groupFees += transaction.amount;
        } else if (transaction.type === 'premium_subscription') {
          newAnalytics.premiumSubscriptions += transaction.amount;
        } else if (transaction.type === 'one_time_fee') {
          newAnalytics.oneTimeFees += transaction.amount;
        }
        
        newAnalytics.totalRevenue += transaction.amount;
        
        // Update monthly revenue
        const currentMonth = new Date().getMonth();
        const transactionMonth = new Date(transaction.timestamp).getMonth();
        
        if (currentMonth === transactionMonth) {
          newAnalytics.monthlyRevenue += transaction.amount;
        }
        
        set({
          transactions: [...transactions, newTransaction],
          analytics: newAnalytics
        });
        
        return newTransaction;
      },
      
      // Get revenue insights
      getRevenueInsights: () => {
        const { analytics, transactions } = get();
        
        const insights = [];
        
        // Revenue trends
        if (analytics.monthlyRevenue > 0) {
          insights.push({
            type: 'success',
            title: 'Monthly Revenue',
            value: `$${analytics.monthlyRevenue.toFixed(2)}`,
            description: 'Revenue generated this month'
          });
        }
        
        // Group fee insights
        if (analytics.groupFees > 0) {
          insights.push({
            type: 'info',
            title: 'Group Fees',
            value: `$${analytics.groupFees.toFixed(2)}`,
            description: 'Total revenue from group creation'
          });
        }
        
        // Premium insights
        if (analytics.premiumSubscriptions > 0) {
          insights.push({
            type: 'warning',
            title: 'Premium Subscriptions',
            value: `$${analytics.premiumSubscriptions.toFixed(2)}`,
            description: 'Recurring premium revenue'
          });
        }
        
        return insights;
      },
      
      // Reset analytics (for testing)
      resetAnalytics: () => {
        set({
          transactions: [],
          analytics: {
            totalRevenue: 0,
            monthlyRevenue: 0,
            groupFees: 0,
            premiumSubscriptions: 0,
            oneTimeFees: 0
          }
        });
      }
    }),
    {
      name: 'loopfund-revenue-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        analytics: state.analytics
      })
    }
  )
);

export default useRevenueStore;
