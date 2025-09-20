import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, RefreshCw, AlertCircle, Sparkles, Crown, Zap } from 'lucide-react';
import { LoopFundButton, LoopFundCard } from '../ui';
import api from '../../services/api';

const PaymentStatusChecker = ({ reference, onStatusChange, autoCheck = true }) => {
  const [status, setStatus] = useState('checking');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    if (reference && autoCheck) {
      checkStatus();
    }
  }, [reference, autoCheck]);

  const checkStatus = async () => {
    if (!reference) return;

    try {
      setStatus('checking');
      setError('');

      const response = await api.get(`/payments/status/${reference}`);
      
      if (response.data.success) {
        const payment = response.data.data;
        setPaymentData(payment);
        setStatus(payment.status);
        setLastChecked(new Date());
        
        // Notify parent component of status change
        onStatusChange?.(payment.status, payment);
      } else {
        setError(response.data.message || 'Failed to check status');
        setStatus('error');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check payment status');
      setStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="w-5 h-5 text-loopfund-emerald-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-loopfund-coral-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-loopfund-gold-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-loopfund-neutral-500" />;
      case 'checking':
        return <RefreshCw className="w-5 h-5 text-loopfund-electric-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-loopfund-coral-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-loopfund-neutral-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'successful':
        return 'text-loopfund-emerald-600 dark:text-loopfund-emerald-400';
      case 'failed':
        return 'text-loopfund-coral-600 dark:text-loopfund-coral-400';
      case 'pending':
        return 'text-loopfund-gold-600 dark:text-loopfund-gold-400';
      case 'cancelled':
        return 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400';
      case 'checking':
        return 'text-loopfund-electric-600 dark:text-loopfund-electric-400';
      case 'error':
        return 'text-loopfund-coral-600 dark:text-loopfund-coral-400';
      default:
        return 'text-loopfund-neutral-600 dark:text-loopfund-neutral-400';
    }
  };

  const getStatusGradient = () => {
    switch (status) {
      case 'successful':
        return 'bg-gradient-emerald';
      case 'failed':
        return 'bg-gradient-coral';
      case 'pending':
        return 'bg-gradient-gold';
      case 'cancelled':
        return 'bg-gradient-to-r from-loopfund-neutral-500 to-loopfund-neutral-600';
      case 'checking':
        return 'bg-gradient-electric';
      case 'error':
        return 'bg-gradient-coral';
      default:
        return 'bg-gradient-to-r from-loopfund-neutral-500 to-loopfund-neutral-600';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'successful':
        return 'Payment successful! Group created.';
      case 'failed':
        return 'Payment failed. Please try again.';
      case 'pending':
        return 'Payment is being processed...';
      case 'cancelled':
        return 'Payment was cancelled.';
      case 'checking':
        return 'Checking payment status...';
      case 'error':
        return 'Error checking status.';
      default:
        return 'Unknown status.';
    }
  };

  if (!reference) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <LoopFundCard variant="elevated" className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-loopfund opacity-5 rounded-full blur-xl animate-float" />
        </div>

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                className={`w-10 h-10 ${getStatusGradient()} rounded-2xl flex items-center justify-center shadow-loopfund`}
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {getStatusIcon()}
              </motion.div>
              <span className={`font-body text-body font-medium ${getStatusColor()}`}>
                Payment Status
              </span>
            </div>
            
            <motion.button
              onClick={checkStatus}
              disabled={status === 'checking'}
              className="p-2 hover:bg-loopfund-neutral-100 dark:hover:bg-loopfund-dark-elevated rounded-xl transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className="w-4 h-4 text-loopfund-electric-600" />
            </motion.button>
          </div>

          <div className="space-y-4">
            <p className={`font-body text-body ${getStatusColor()}`}>
              {getStatusMessage()}
            </p>
            
            {paymentData && (
              <div className="space-y-3">
                <div className="p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Reference:</span>
                      <span className="font-mono font-body text-body-sm text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        {paymentData.reference}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Amount:</span>
                      <span className="font-display text-h4 text-loopfund-emerald-600">
                        ₦{(paymentData.amount / 100).toLocaleString()}
                      </span>
                    </div>
                    {paymentData.metadata?.groupName && (
                      <div className="flex justify-between items-center">
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Group:</span>
                        <span className="font-body text-body-sm font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {paymentData.metadata.groupName}
                        </span>
                      </div>
                    )}
                    {lastChecked && (
                      <div className="flex justify-between items-center">
                        <span className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">Last checked:</span>
                        <span className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                          {lastChecked.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <motion.div 
                className="p-4 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-800 rounded-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-loopfund-coral-600" />
                  <p className="font-body text-body-sm text-loopfund-coral-600 dark:text-loopfund-coral-400">
                    Error: {error}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </LoopFundCard>
    </motion.div>
  );
};

export default PaymentStatusChecker;