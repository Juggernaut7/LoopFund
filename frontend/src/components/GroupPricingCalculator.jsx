import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Users, 
  Calendar, 
  Banknote, 
  TrendingUp,
  Info,
  AlertTriangle,
  CheckCircle,
  Crown,
  Zap,
  Sparkles,
  Target,
  Loader2
} from 'lucide-react';
import { LoopFundButton, LoopFundCard, LoopFundInput } from './ui';
import useRevenueStore from '../store/useRevenueStore';
import { formatCurrencySimple } from '../utils/currency';

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
  const [isProcessing, setIsProcessing] = useState(false);

  // Premium feature options
  const premiumOptions = [
    {
      id: 'groupAnalytics',
      name: 'Group Analytics',
      description: 'Advanced insights and reporting',
      price: 2.99,
      type: 'monthly',
      icon: TrendingUp,
      color: 'emerald'
    },
    {
      id: 'customBranding',
      name: 'Custom Branding',
      description: 'Personalized group appearance',
      price: 4.99,
      type: 'one-time',
      icon: Crown,
      color: 'gold'
    },
    {
      id: 'prioritySupport',
      name: 'Priority Support',
      description: '24/7 customer support',
      price: 1.99,
      type: 'monthly',
      icon: Zap,
      color: 'electric'
    },
    {
      id: 'advancedNotifications',
      name: 'Advanced Notifications',
      description: 'Smart reminders and alerts',
      price: 0.99,
      type: 'monthly',
      icon: Target,
      color: 'coral'
    },
    {
      id: 'exportData',
      name: 'Data Export',
      description: 'Export group data and reports',
      price: 1.49,
      type: 'per-export',
      icon: Calculator,
      color: 'mint'
    },
    {
      id: 'whiteLabel',
      name: 'White Label',
      description: 'Remove LoopFund branding',
      price: 19.99,
      type: 'monthly',
      icon: Sparkles,
      color: 'lavender'
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
      setIsProcessing(true);
      // Record transaction
      const transaction = recordTransaction({
        type: 'group_fee',
        amount: calculatedFee.totalFee,
        description: `Group creation fee for ${formatCurrencySimple(formData.goalAmount)} goal`,
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
    } finally {
      setIsProcessing(false);
    }
  };

  // Get recommendation icon
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-loopfund-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-loopfund-coral-500" />;
      case 'info': return <Info className="w-5 h-5 text-loopfund-electric-500" />;
      default: return <Info className="w-5 h-5 text-loopfund-neutral-500" />;
    }
  };

  return (
    <LoopFundCard variant="elevated" className="relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-loopfund opacity-5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-coral opacity-5 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <div className="relative p-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-loopfund rounded-3xl mb-6 shadow-loopfund-lg"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Calculator className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
            Group Pricing Calculator
          </h2>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Calculate fees based on your group parameters
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Goal Amount */}
          <div>
            <LoopFundInput
              type="number"
              label="Goal Amount"
              value={formData.goalAmount}
              onChange={(e) => handleInputChange('goalAmount', parseFloat(e.target.value) || 0)}
              placeholder="5000"
              min="100"
              icon={<DollarSign className="w-5 h-5" />}
            />
          </div>

          {/* Member Count */}
          <div>
            <LoopFundInput
              type="number"
              label="Members"
              value={formData.memberCount}
              onChange={(e) => handleInputChange('memberCount', parseInt(e.target.value) || 1)}
              placeholder="3"
              min="2"
              max="50"
              icon={<Users className="w-5 h-5" />}
            />
          </div>

          {/* Duration */}
          <div>
            <LoopFundInput
              type="number"
              label="Duration (Months)"
              value={formData.durationMonths}
              onChange={(e) => handleInputChange('durationMonths', parseInt(e.target.value) || 1)}
              placeholder="12"
              min="1"
              max="60"
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>
        </motion.div>

        {/* Premium Features */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <motion.div 
              className="w-10 h-10 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-loopfund"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Crown className="w-5 h-5 text-white" />
            </motion.div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Premium Features
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {premiumOptions.map((feature, index) => (
              <motion.label
                key={feature.id}
                className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                  formData.premiumFeatures.includes(feature.id)
                    ? 'border-loopfund-emerald-500 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 shadow-loopfund'
                    : 'border-loopfund-neutral-300 dark:border-loopfund-neutral-600 hover:border-loopfund-neutral-400 dark:hover:border-loopfund-neutral-500 hover:bg-loopfund-neutral-50 dark:hover:bg-loopfund-dark-elevated'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="checkbox"
                  checked={formData.premiumFeatures.includes(feature.id)}
                  onChange={() => togglePremiumFeature(feature.id)}
                  className="mr-4 w-5 h-5 text-loopfund-emerald-600 rounded focus:ring-loopfund-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r from-loopfund-${feature.color}-500 to-loopfund-${feature.color}-600 rounded-xl flex items-center justify-center shadow-loopfund`}>
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {feature.name}
                      </span>
                    </div>
                    <span className="font-display text-h4 text-loopfund-emerald-600">
                      {formatCurrencySimple(feature.price)}
                    </span>
                  </div>
                  <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                    {feature.description}
                  </p>
                  <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                    {feature.type}
                  </span>
                </div>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Fee Calculation */}
        <AnimatePresence>
          {calculatedFee && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <LoopFundCard variant="gradient" className="relative">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-gold opacity-5 rounded-full blur-2xl animate-float" />
                </div>

                <div className="relative p-8 text-center">
                  <h3 className="font-display text-h2 text-white mb-4">
                    Total Fee
                  </h3>
                  <div className="text-5xl font-display text-white mb-6">
                    {formatCurrencySimple(calculatedFee.totalFee)}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-6 text-white/90 mb-6">
                    <span className="font-body text-body">Base Fee: {formatCurrencySimple(calculatedFee.baseFee)}</span>
                    {calculatedFee.premiumCost > 0 && (
                      <span className="font-body text-body">+ Premium: {formatCurrencySimple(calculatedFee.premiumCost)}</span>
                    )}
                  </div>
                  
                  <LoopFundButton
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    variant="secondary"
                    size="sm"
                    icon={showBreakdown ? <Info className="w-4 h-4" /> : <Calculator className="w-4 h-4" />}
                  >
                    {showBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
                  </LoopFundButton>
                </div>
              </LoopFundCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Detailed Breakdown */}
        <AnimatePresence>
          {showBreakdown && calculatedFee && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <LoopFundCard variant="elevated">
                <div className="p-6">
                  <h4 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-6">
                    Fee Breakdown
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                      <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Goal Amount:</span>
                      <span className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">{formatCurrencySimple(calculatedFee.breakdown.goalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                      <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Base Fee ({calculatedFee.breakdown.baseFeePercentage}%):</span>
                      <span className="font-display text-h4 text-loopfund-emerald-600">{formatCurrencySimple(calculatedFee.baseFee)}</span>
                    </div>
                    {calculatedFee.breakdown.memberCount > 2 && (
                      <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                        <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Member Multiplier ({calculatedFee.breakdown.memberMultiplier}% per member):</span>
                        <span className="font-display text-h4 text-loopfund-coral-600">+{formatCurrencySimple((calculatedFee.breakdown.memberCount - 2) * 0.001 * calculatedFee.breakdown.goalAmount)}</span>
                      </div>
                    )}
                    {calculatedFee.breakdown.durationMonths > 1 && (
                      <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                        <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Duration Multiplier ({calculatedFee.breakdown.durationMultiplier}% per month):</span>
                        <span className="font-display text-h4 text-loopfund-gold-600">+{formatCurrencySimple((calculatedFee.breakdown.durationMonths - 1) * 0.0005 * calculatedFee.breakdown.goalAmount)}</span>
                      </div>
                    )}
                    {calculatedFee.premiumCost > 0 && (
                      <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                        <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Premium Features:</span>
                        <span className="font-display text-h4 text-loopfund-electric-600">+{formatCurrencySimple(calculatedFee.premiumCost)}</span>
                      </div>
                    )}
                    <div className="border-t border-loopfund-neutral-300 dark:border-loopfund-neutral-700 pt-4">
                      <div className="flex justify-between items-center py-3 px-4 bg-gradient-loopfund rounded-xl">
                        <span className="font-display text-h3 text-white">Total Fee:</span>
                        <span className="font-display text-h2 text-white">{formatCurrencySimple(calculatedFee.totalFee)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </LoopFundCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommendations */}
        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <motion.div 
                  className="w-10 h-10 bg-gradient-electric rounded-2xl flex items-center justify-center shadow-loopfund"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <TrendingUp className="w-5 h-5 text-white" />
                </motion.div>
                <h4 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                  Optimization Tips
                </h4>
              </div>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-start p-6 rounded-2xl ${
                      rec.type === 'success' ? 'bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 border border-loopfund-emerald-200 dark:border-loopfund-emerald-800' :
                      rec.type === 'warning' ? 'bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-800' :
                      'bg-loopfund-electric-50 dark:bg-loopfund-electric-900/20 border border-loopfund-electric-200 dark:border-loopfund-electric-800'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    {getRecommendationIcon(rec.type)}
                    <div className="ml-4 flex-1">
                      <p className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                        {rec.message}
                      </p>
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-2">
                        {rec.suggestion}
                      </p>
                      <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        {rec.impact}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Button */}
        <AnimatePresence>
          {calculatedFee && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LoopFundButton
                onClick={handlePayment}
                disabled={isProcessing}
                variant="primary"
                size="lg"
                icon={isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                className="w-full max-w-md"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ${formatCurrencySimple(calculatedFee.totalFee)} & Create Group`}
              </LoopFundButton>
              <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400 mt-4">
                Secure payment • No hidden fees • Instant group creation
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LoopFundCard>
  );
};

export default GroupPricingCalculator;