import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, CheckCircle, AlertCircle, ExternalLink, Sparkles, Crown, Zap, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { LoopFundButton, LoopFundCard } from '../ui';
import api from '../../services/api';

const PaymentModal = ({ isOpen, onClose, groupData, onSuccess }) => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('details'); // 'details', 'payment', 'success'
  const [paymentReference, setPaymentReference] = useState('');

  const handlePayment = async () => {
    if (!groupData.name || !groupData.targetAmount) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/payments/initialize', {
        groupName: groupData.name,
        targetAmount: parseFloat(groupData.targetAmount),
        durationMonths: parseInt(groupData.durationMonths),
        description: groupData.description,
        accountInfo: groupData.accountInfo,
        userEmail: user.email,
        userName: user.name || user.email
      });

      if (response.data.success) {
        setPaymentUrl(response.data.data.authorizationUrl);
        setPaymentReference(response.data.data.reference);
        setStep('payment');
        // Open Paystack payment page
        window.open(response.data.data.authorizationUrl, '_blank');
      } else {
        setError(response.data.message || 'Failed to initialize payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setIsVerifying(true);
    setStep('success');
    
    try {
      // Wait a bit for Paystack to process the payment
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Verify the payment
      if (paymentReference) {
        const response = await api.get(`/payments/verify/${paymentReference}`);
        
        if (response.data.success && response.data.data.status === 'success') {
          // Payment successful, call onSuccess to create group
          onSuccess();
          onClose();
        } else {
          // Payment verification failed, show error
          setError('Payment verification failed. Please contact support.');
          setStep('details');
        }
      } else {
        // No reference, just close
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Payment verification failed. Please contact support.');
      setStep('details');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    if (step === 'payment') {
      // If payment is in progress, ask for confirmation
      if (window.confirm('Payment is in progress. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const openPaymentPage = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setError('');
      setPaymentUrl('');
      setPaymentReference('');
      setIsVerifying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <LoopFundCard variant="elevated" className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
              <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float-delayed" />
            </div>

            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-loopfund-neutral-300 dark:border-loopfund-neutral-700">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CreditCard className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      Create Group - Payment Required
                    </h2>
                    <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      Complete payment to create your group
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="p-3 bg-loopfund-neutral-100 dark:bg-loopfund-dark-elevated rounded-xl transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-loopfund-neutral-600 dark:text-loopfund-neutral-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-8">
                {step === 'details' && (
                  <div className="space-y-8">
                    {/* Group Summary */}
                    <LoopFundCard variant="elevated" className="relative">
                      <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <motion.div 
                            className="w-10 h-10 bg-gradient-coral rounded-2xl flex items-center justify-center shadow-loopfund"
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Crown className="w-5 h-5 text-white" />
                          </motion.div>
                          <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                            Group Details
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                            <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Name:</span>
                            <span className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text">{groupData.name}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                            <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Target:</span>
                            <span className="font-display text-h4 text-loopfund-emerald-600">₦{groupData.targetAmount?.toLocaleString()}</span>
                          </div>
                          {groupData.description && (
                            <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                              <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Description:</span>
                              <span className="font-body text-body text-loopfund-neutral-900 dark:text-loopfund-dark-text">{groupData.description}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </LoopFundCard>

                    {/* Payment Info */}
                    <LoopFundCard variant="gradient" className="relative">
                      <div className="relative p-6">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-r from-loopfund-gold-500 to-loopfund-orange-500 rounded-2xl flex items-center justify-center shadow-loopfund"
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <CreditCard className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h4 className="font-display text-h3 text-white mb-2">
                              Dynamic Group Creation Fee
                            </h4>
                            <p className="font-body text-body text-white/90">
                              Based on amount and duration - Fair pricing
                            </p>
                          </div>
                        </div>
                      </div>
                    </LoopFundCard>

                    {/* Security Info */}
                    <div className="flex items-center space-x-4 p-4 bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 rounded-2xl border border-loopfund-emerald-200 dark:border-loopfund-emerald-800">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-emerald rounded-2xl flex items-center justify-center shadow-loopfund"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Shield className="w-5 h-5 text-white" />
                      </motion.div>
                      <span className="font-body text-body text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                        Secure payment powered by Paystack
                      </span>
                    </div>

                    {/* Error Display */}
                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          className="bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-800 rounded-2xl p-6"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <div className="flex items-center space-x-3">
                            <AlertCircle className="w-6 h-6 text-loopfund-coral-600" />
                            <span className="font-body text-body text-loopfund-coral-600 dark:text-loopfund-coral-400">{error}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <LoopFundButton
                        onClick={handlePayment}
                        disabled={isLoading}
                        variant="primary"
                        size="lg"
                        icon={isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CreditCard className="w-6 h-6" />}
                        className="w-full"
                      >
                        {isLoading ? 'Processing...' : 'Pay & Create Group'}
                      </LoopFundButton>
                      
                      <LoopFundButton
                        onClick={onClose}
                        variant="secondary"
                        size="lg"
                        className="w-full"
                      >
                        Cancel
                      </LoopFundButton>
                    </div>
                  </div>
                )}

                {step === 'payment' && (
                  <div className="text-center space-y-8">
                    <motion.div
                      className="w-20 h-20 bg-gradient-loopfund rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <CreditCard className="w-10 h-10 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                        Payment in Progress
                      </h3>
                      <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        Please complete your payment on the Paystack page that opened.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <LoopFundButton
                        onClick={openPaymentPage}
                        variant="primary"
                        size="lg"
                        icon={<ExternalLink className="w-6 h-6" />}
                        className="w-full"
                      >
                        Open Payment Page
                      </LoopFundButton>
                      
                      <LoopFundButton
                        onClick={handlePaymentSuccess}
                        disabled={isVerifying}
                        variant="coral"
                        size="lg"
                        icon={isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                        className="w-full"
                      >
                        {isVerifying ? 'Verifying...' : "I've Completed Payment"}
                      </LoopFundButton>
                    </div>

                    <div className="p-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-2xl">
                      <p className="font-body text-body-sm text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-2">
                        Payment Reference: <span className="font-mono font-medium">{paymentReference}</span>
                      </p>
                      <p className="font-body text-body-sm text-loopfund-neutral-500 dark:text-loopfund-neutral-400">
                        Keep this reference for verification
                      </p>
                    </div>
                  </div>
                )}

                {step === 'success' && (
                  <div className="text-center space-y-8">
                    <motion.div 
                      className="mx-auto w-20 h-20 bg-gradient-emerald rounded-3xl flex items-center justify-center shadow-loopfund-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
                        Payment Submitted!
                      </h3>
                      <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                        {isVerifying 
                          ? 'Verifying payment and creating your group...'
                          : 'Payment verified! Creating your group...'
                        }
                      </p>
                    </div>
                    {isVerifying && (
                      <motion.div
                        className="w-12 h-12 bg-gradient-loopfund rounded-2xl flex items-center justify-center shadow-loopfund mx-auto"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </LoopFundCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;