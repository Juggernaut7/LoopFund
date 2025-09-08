import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import useRevenueStore from '../store/useRevenueStore';

const RevenueDemo = () => {
  const { calculateGroupFee } = useRevenueStore();

  // Example scenarios
  const examples = [
    {
      title: "Small Family Group",
      description: "3 members saving for vacation",
      goalAmount: 3000,
      memberCount: 3,
      durationMonths: 1,
      premiumFeatures: ['groupAnalytics']
    },
    {
      title: "Medium Business Team",
      description: "8 employees saving for equipment",
      goalAmount: 15000,
      memberCount: 8,
      durationMonths: 18,
      premiumFeatures: ['groupAnalytics', 'customBranding', 'prioritySupport']
    },
    {
      title: "Large Community Project",
      description: "25 neighbors saving for park renovation",
      goalAmount: 50000,
      memberCount: 25,
      durationMonths: 36,
      premiumFeatures: ['groupAnalytics', 'customBranding', 'prioritySupport', 'whiteLabel']
    }
  ];

  const calculateExampleFee = (example) => {
    return calculateGroupFee(
      example.goalAmount,
      example.memberCount,
      example.durationMonths,
      example.premiumFeatures
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-6">
          <DollarSign className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Revenue Model Demo
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          See how our dynamic pricing model scales with your group size, goal amount, and premium features
        </p>
      </div>

      {/* Pricing Formula */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 text-center">
          💰 Dynamic Pricing Formula
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Base Fee</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">of goal amount</div>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">+0.1%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Per Member</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">after 2 members</div>
          </div>
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">+0.05%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Per Month</div>
            <div className="text-xs text-slate-500 dark:text-slate-500">after 1 month</div>
          </div>
        </div>
      </div>

      {/* Example Scenarios */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">
          📊 Real-World Examples
        </h3>
        
        {examples.map((example, index) => {
          const fee = calculateExampleFee(example);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {example.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {example.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${example.goalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{example.memberCount} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{example.durationMonths} months</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${fee.totalFee.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-500">
                    Total Fee
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="bg-white dark:bg-slate-600 rounded-lg p-4">
                <h5 className="font-medium text-slate-900 dark:text-white mb-3">Fee Breakdown:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Fee ({fee.breakdown.baseFeePercentage}%):</span>
                      <span className="font-medium">${fee.baseFee.toFixed(2)}</span>
                    </div>
                    {fee.breakdown.memberCount > 2 && (
                      <div className="flex justify-between">
                        <span>Member Multiplier:</span>
                        <span className="font-medium">+${((fee.breakdown.memberCount - 2) * 0.001 * fee.breakdown.goalAmount).toFixed(2)}</span>
                      </div>
                    )}
                    {fee.breakdown.durationMonths > 1 && (
                      <div className="flex justify-between">
                        <span>Duration Multiplier:</span>
                        <span className="font-medium">+${((fee.breakdown.durationMonths - 1) * 0.0005 * fee.breakdown.goalAmount).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Premium Features:</span>
                      <span className="font-medium">+${fee.premiumCost.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Fee:</span>
                        <span>${fee.totalFee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Features */}
              {example.premiumFeatures.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    Premium Features:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {example.premiumFeatures.map((feature, featureIndex) => (
                      <span
                        key={featureIndex}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium"
                      >
                        {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Key Benefits */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 text-center">
          🚀 Why This Model Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Scalable Revenue</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Fees grow proportionally with group value and complexity
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Fair Pricing</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Larger goals pay more but get better value per dollar
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Premium Upselling</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Multiple revenue streams from feature subscriptions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Predictable Growth</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Revenue scales with user engagement and group success
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all">
          <Zap className="w-5 h-5" />
          <span>Start Earning Revenue Today</span>
        </button>
        <p className="text-slate-600 dark:text-slate-400 mt-3">
          No upfront costs • Instant setup • Scalable growth
        </p>
      </div>
    </div>
  );
};

export default RevenueDemo;
