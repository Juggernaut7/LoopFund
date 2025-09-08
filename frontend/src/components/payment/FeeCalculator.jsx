import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign, Percent } from 'lucide-react';
import api from '../../services/api';

const FeeCalculator = ({ targetAmount, durationMonths, onFeeCalculated }) => {
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
    if (months <= 3) return 'text-green-600 dark:text-green-400';
    if (months <= 6) return 'text-blue-600 dark:text-blue-400';
    if (months <= 12) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getDurationIcon = (months) => {
    if (months <= 3) return '⚡';
    if (months <= 6) return '📅';
    if (months <= 12) return '📊';
    return '🎯';
  };

  if (!targetAmount || targetAmount < 1000) {
    return (
      <div className="glass-card p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <Calculator className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Fee Calculator
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Enter a target amount (minimum ₦1,000) to see the creation fee
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Calculator className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Dynamic Fee Calculator
          </h3>
        </div>
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {feeData && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Main Fee Display */}
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                ₦{feeData.totalFee.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {feeData.percentage}% of target amount
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Percent className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Base Fee (2%)</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₦{feeData.baseFee.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="text-orange-600 dark:text-orange-400" size={16} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Duration Fee ({durationMonths} months)
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  ₦{feeData.durationFee.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Duration Indicator */}
            <div className={`flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg ${getDurationColor(durationMonths)}`}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getDurationIcon(durationMonths)}</span>
                <span className="text-sm font-medium">Duration</span>
              </div>
              <span className="font-semibold">{durationMonths} months</span>
            </div>

            {/* Savings Info */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="text-green-600 dark:text-green-400" size={16} />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  What you get
                </span>
              </div>
              <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                <li>• Full group management & analytics</li>
                <li>• AI-powered insights & recommendations</li>
                <li>• 24/7 support & priority assistance</li>
                <li>• Advanced security & data protection</li>
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default FeeCalculator; 