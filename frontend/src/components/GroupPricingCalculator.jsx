import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Info,
  AlertTriangle,
  CheckCircle,
  Crown,
  Zap
} from 'lucide-react';
import useRevenueStore from '../store/useRevenueStore';

const GroupPricingCalculator = ({ onFeeCalculated, initialValues = {} }) => {
  const { calculateGroupFee, getPricingRecommendations, recordTransaction } = useRevenueStore();
  
  const [formData, setFormData] = useState({
    goalAmount: initialValues.goalAmount || 5000,
    memberCount: initialValues.memberCount || 3,
    durationMonths: initialValues.durationMonths || 12,
    premiumFeatures: []
  });
  
  const [calculatedFee, setCalculatedFee] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Premium feature options
  const premiumOptions = [
    {
      id: 'groupAnalytics',
      name: 'Group Analytics',
      description: 'Advanced insights and reporting',
      price: 2.99,
      type: 'monthly'
    },
    {
      id: 'customBranding',
      name: 'Custom Branding',
      description: 'Personalized group appearance',
      price: 4.99,
      type: 'one-time'
    },
    {
      id: 'prioritySupport',
      name: 'Priority Support',
      description: '24/7 customer support',
      price: 1.99,
      type: 'monthly'
    },
    {
      id: 'advancedNotifications',
      name: 'Advanced Notifications',
      description: 'Smart reminders and alerts',
      price: 0.99,
      type: 'monthly'
    },
    {
      id: 'exportData',
      name: 'Data Export',
      description: 'Export group data and reports',
      price: 1.49,
      type: 'per-export'
    },
    {
      id: 'whiteLabel',
      name: 'White Label',
      description: 'Remove LoopFund branding',
      price: 19.99,
      type: 'monthly'
    }
  ];

  // Calculate fee when form data changes
  useEffect(() => {
    if (formData.goalAmount > 0 && formData.memberCount > 0 && formData.durationMonths > 0) {
      const fee = calculateGroupFee(
        formData.goalAmount,
        formData.memberCount,
        formData.durationMonths,
        formData.premiumFeatures
      );
      setCalculatedFee(fee);
      
      // Get recommendations
      const recs = getPricingRecommendations(
        formData.goalAmount,
        formData.memberCount,
        formData.durationMonths
      );
      setRecommendations(recs);
      
      // Notify parent component
      if (onFeeCalculated) {
        onFeeCalculated(fee);
      }
    }
  }, [formData, calculateGroupFee, getPricingRecommendations, onFeeCalculated]);

  // Handle form changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle premium feature toggle
  const togglePremiumFeature = (featureId) => {
    setFormData(prev => ({
      ...prev,
      premiumFeatures: prev.premiumFeatures.includes(featureId)
        ? prev.premiumFeatures.filter(id => id !== featureId)
        : [...prev.premiumFeatures, featureId]
    }));
  };

  // Handle payment (mock)
  const handlePayment = async () => {
    if (!calculatedFee) return;
    
    try {
      // Record transaction
      const transaction = recordTransaction({
        type: 'group_fee',
        amount: calculatedFee.totalFee,
        description: `Group creation fee for $${formData.goalAmount.toLocaleString()} goal`,
        metadata: {
          goalAmount: formData.goalAmount,
          memberCount: formData.memberCount,
          durationMonths: formData.durationMonths,
          premiumFeatures: formData.premiumFeatures
        }
      });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Payment successful! Transaction ID: ${transaction.id}`);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // Get recommendation icon
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Group Pricing Calculator
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Calculate fees based on your group parameters
        </p>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Goal Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Goal Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              value={formData.goalAmount}
              onChange={(e) => handleInputChange('goalAmount', parseFloat(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="5000"
              min="100"
            />
          </div>
        </div>

        {/* Member Count */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Members
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              value={formData.memberCount}
              onChange={(e) => handleInputChange('memberCount', parseInt(e.target.value) || 1)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="3"
              min="2"
              max="50"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Duration (Months)
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              value={formData.durationMonths}
              onChange={(e) => handleInputChange('durationMonths', parseInt(e.target.value) || 1)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="12"
              min="1"
              max="60"
            />
          </div>
        </div>
      </div>

      {/* Premium Features */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <Crown className="w-5 h-5 text-yellow-500 mr-2" />
          Premium Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumOptions.map((feature) => (
            <label
              key={feature.id}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.premiumFeatures.includes(feature.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.premiumFeatures.includes(feature.id)}
                onChange={() => togglePremiumFeature(feature.id)}
                className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {feature.name}
                  </span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    ${feature.price}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {feature.description}
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {feature.type}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Fee Calculation */}
      {calculatedFee && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Total Fee
            </h3>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              ${calculatedFee.totalFee.toFixed(2)}
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <span>Base Fee: ${calculatedFee.baseFee.toFixed(2)}</span>
              {calculatedFee.premiumCost > 0 && (
                <span>+ Premium: ${calculatedFee.premiumCost.toFixed(2)}</span>
              )}
            </div>
            
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {showBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
            </button>
          </div>
        </motion.div>
      )}

      {/* Detailed Breakdown */}
      <AnimatePresence>
        {showBreakdown && calculatedFee && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                Fee Breakdown
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Goal Amount:</span>
                  <span>${calculatedFee.breakdown.goalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Fee ({calculatedFee.breakdown.baseFeePercentage}%):</span>
                  <span>${calculatedFee.baseFee.toFixed(2)}</span>
                </div>
                {calculatedFee.breakdown.memberCount > 2 && (
                  <div className="flex justify-between">
                    <span>Member Multiplier ({calculatedFee.breakdown.memberMultiplier}% per member):</span>
                    <span>+${((calculatedFee.breakdown.memberCount - 2) * 0.001 * calculatedFee.breakdown.goalAmount).toFixed(2)}</span>
                  </div>
                )}
                {calculatedFee.breakdown.durationMonths > 1 && (
                  <div className="flex justify-between">
                    <span>Duration Multiplier ({calculatedFee.breakdown.durationMultiplier}% per month):</span>
                    <span>+${((calculatedFee.breakdown.durationMonths - 1) * 0.0005 * calculatedFee.breakdown.goalAmount).toFixed(2)}</span>
                  </div>
                )}
                {calculatedFee.premiumCost > 0 && (
                  <div className="flex justify-between">
                    <span>Premium Features:</span>
                    <span>+${calculatedFee.premiumCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 font-semibold">
                  <div className="flex justify-between">
                    <span>Total Fee:</span>
                    <span>${calculatedFee.totalFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            Optimization Tips
          </h4>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`flex items-start p-3 rounded-lg ${
                  rec.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                  rec.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                  'bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                {getRecommendationIcon(rec.type)}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {rec.message}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {rec.suggestion}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {rec.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Button */}
      {calculatedFee && (
        <div className="text-center">
          <button
            onClick={handlePayment}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center mx-auto"
          >
            <Zap className="w-5 h-5 mr-2" />
            Pay ${calculatedFee.totalFee.toFixed(2)} & Create Group
          </button>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            Secure payment • No hidden fees • Instant group creation
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupPricingCalculator;
