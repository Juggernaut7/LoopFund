import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign, Percent, Sparkles, Crown, Zap, Loader2 } from 'lucide-react';
import { LoopFundButton, LoopFundCard } from '../ui';
import api from '../../services/api';

const FeeCalculator = ({ targetAmount, durationMonths, maxMembers = 10, onFeeCalculated }) => {
  const [feeData, setFeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (targetAmount && targetAmount >= 1000) {
      calculateFee();
    } else {
      setFeeData(null);
    }
  }, [targetAmount, durationMonths]);

  const calculateFee = async () => {
    if (!targetAmount || targetAmount < 1000) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/payments/calculate-fee', {
        targetAmount: parseFloat(targetAmount),
        durationMonths: parseInt(durationMonths)
      });

      if (response.data.success) {
        setFeeData(response.data.data);
        onFeeCalculated?.(response.data.data);
      }
    } catch (err) {
      setError('Failed to calculate fee');
      console.error('Fee calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDurationColor = (months) => {
    if (months <= 3) return 'text-loopfund-emerald-600 dark:text-loopfund-emerald-400';
    if (months <= 6) return 'text-loopfund-electric-600 dark:text-loopfund-electric-400';
    if (months <= 12) return 'text-loopfund-coral-600 dark:text-loopfund-coral-400';
    return 'text-loopfund-gold-600 dark:text-loopfund-gold-400';
  };

  const getDurationGradient = (months) => {
    if (months <= 3) return 'bg-gradient-emerald';
    if (months <= 6) return 'bg-gradient-electric';
    if (months <= 12) return 'bg-gradient-coral';
    return 'bg-gradient-gold';
  };

  const getDurationIcon = (months) => {
    if (months <= 3) return Zap;
    if (months <= 6) return Clock;
    if (months <= 12) return TrendingUp;
    return Crown;
  };

  if (!targetAmount || targetAmount < 1000) {
    return (
      <LoopFundCard variant="elevated" className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-loopfund opacity-5 rounded-full blur-xl animate-float" />
        </div>

        <div className="relative p-6">
          <div className="flex items-center space-x-4 mb-4">
            <motion.div 
              className="w-10 h-10 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Calculator className="w-5 h-5 text-white" />
            </motion.div>
            <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
              Fee Calculator
            </h3>
          </div>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
            Enter a target amount (minimum ₦1,000) to see the creation fee
          </p>
        </div>
      </LoopFundCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <LoopFundCard variant="gradient" className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-gold opacity-5 rounded-full blur-xl animate-float" />
          <div className="absolute -bottom-5 -left-5 w-8 h-8 bg-gradient-electric opacity-5 rounded-full blur-lg animate-float-delayed" />
        </div>

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Calculator className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="font-display text-h3 text-white">
                Dynamic Fee Calculator
              </h3>
            </div>
            {isLoading && (
              <motion.div
                className="w-8 h-8 bg-white/20 rounded-2xl flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </div>

          {error && (
            <motion.div 
              className="mb-6 p-4 bg-loopfund-coral-500/20 border border-loopfund-coral-500/30 rounded-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="font-body text-body text-loopfund-coral-200">{error}</p>
            </motion.div>
          )}

          {feeData && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Main Fee Display */}
                <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-4xl font-display text-white mb-2">
                    ₦{feeData.totalFee.toLocaleString()}
                  </div>
                  <div className="font-body text-body text-white/90">
                    {feeData.percentage}% of target amount
                  </div>
                </div>

                {/* Fee Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-emerald rounded-xl flex items-center justify-center shadow-loopfund">
                        <Percent className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-body text-body text-white/90">Base Fee (2%)</span>
                    </div>
                    <span className="font-display text-h4 text-white">
                      ₦{feeData.baseFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-coral rounded-xl flex items-center justify-center shadow-loopfund">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-body text-body text-white/90">
                        Duration Fee ({durationMonths} months)
                      </span>
                    </div>
                    <span className="font-display text-h4 text-white">
                      ₦{feeData.durationFee.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Duration Indicator */}
                <div className={`flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 ${getDurationColor(durationMonths)}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${getDurationGradient(durationMonths)} rounded-xl flex items-center justify-center shadow-loopfund`}>
                      {React.createElement(getDurationIcon(durationMonths), { className: "w-4 h-4 text-white" })}
                    </div>
                    <span className="font-body text-body font-medium">Duration</span>
                  </div>
                  <span className="font-display text-h4">{durationMonths} months</span>
                </div>

                {/* Member Contribution Info */}
                <div className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-electric rounded-xl flex items-center justify-center shadow-loopfund">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display text-h4 text-white">
                      Member Contributions
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-body text-white/90">Total Target:</span>
                      <span className="font-display text-h4 text-white">₦{targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-body text-white/90">Max Members:</span>
                      <span className="font-display text-h4 text-white">{maxMembers}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/20 pt-3">
                      <span className="font-body text-body font-medium text-white">Per Member:</span>
                      <span className="font-display text-h3 text-loopfund-gold-400">
                        ₦{Math.ceil(targetAmount / maxMembers).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Savings Info */}
                <div className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-emerald rounded-xl flex items-center justify-center shadow-loopfund">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-display text-h4 text-white">
                      What you get
                    </span>
                  </div>
                  <ul className="font-body text-body text-white/90 space-y-2">
                    <li className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-loopfund-gold-400" />
                      <span>Full group management & analytics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-loopfund-gold-400" />
                      <span>AI-powered insights & recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-loopfund-gold-400" />
                      <span>24/7 support & priority assistance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Calculator className="w-4 h-4 text-loopfund-gold-400" />
                      <span>Advanced security & data protection</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </LoopFundCard>
    </motion.div>
  );
};

export default FeeCalculator;