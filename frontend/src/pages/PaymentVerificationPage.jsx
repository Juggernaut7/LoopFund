import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowRight, Sparkles, Crown, Zap, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { LoopFundButton, LoopFundCard } from '../components/ui';
import api from '../services/api';

const PaymentVerificationPage = () => {
  const { reference } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'failed', 'pending'
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (reference) {
      verifyPayment();
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      setVerificationStatus('verifying');
      setError('');

      console.log('Verifying payment with reference:', reference);
      const response = await api.get(`/payments/verify/${reference}`);
      
      console.log('Payment verification response:', response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        setPaymentData(data);
        console.log('Payment data:', data);
        
        if (data.status === 'success') {
          setVerificationStatus('success');
          
          console.log('Payment successful, checking for created items:', {
            groupId: data.groupId,
            goalId: data.goalId,
            fullData: data
          });
          
          // If group was created, redirect after a delay
          if (data.groupId) {
            setTimeout(() => {
              navigate(`/groups/${data.groupId}`);
            }, 3000);
          }
          
          // If goal was created, redirect to goals page
          if (data.goalId) {
            setTimeout(() => {
              navigate('/goals');
            }, 3000);
          }
        } else if (data.status === 'pending') {
          setVerificationStatus('pending');
        } else {
          setVerificationStatus('failed');
          setError('Payment was not successful');
        }
      } else {
        setVerificationStatus('failed');
        setError(response.data.message || 'Verification failed');
      }
    } catch (err) {
      setVerificationStatus('failed');
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  const retryVerification = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setTimeout(verifyPayment, 2000); // Wait 2 seconds before retrying
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-loopfund-emerald-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-loopfund-coral-500" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-loopfund-gold-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-loopfund-electric-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Verifying Payment...';
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'success':
        if (paymentData?.groupId) {
          return 'Your group has been created successfully! Redirecting...';
        } else if (paymentData?.goalId) {
          return 'Your goal has been created successfully! Redirecting...';
        } else {
          return 'Payment was successful but creation is pending. Please contact support.';
        }
      case 'failed':
        return 'Your payment could not be processed. Please try again or contact support.';
      case 'pending':
        return 'Your payment is being processed. This may take a few minutes.';
      default:
        return 'Please wait while we verify your payment...';
    }
  };

  const getStatusGradient = () => {
    switch (verificationStatus) {
      case 'success':
        return 'bg-gradient-emerald';
      case 'failed':
        return 'bg-gradient-coral';
      case 'pending':
        return 'bg-gradient-gold';
      default:
        return 'bg-gradient-electric';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'success':
        return 'bg-loopfund-emerald-50 border-loopfund-emerald-200 dark:bg-loopfund-emerald-900/20 dark:border-loopfund-emerald-800';
      case 'failed':
        return 'bg-loopfund-coral-50 border-loopfund-coral-200 dark:bg-loopfund-coral-900/20 dark:border-loopfund-coral-800';
      case 'pending':
        return 'bg-loopfund-gold-50 border-loopfund-gold-200 dark:bg-loopfund-gold-900/20 dark:border-loopfund-gold-800';
      default:
        return 'bg-loopfund-electric-50 border-loopfund-electric-200 dark:bg-loopfund-electric-900/20 dark:border-loopfund-electric-800';
    }
  };

  if (!reference) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-loopfund-coral-100 dark:bg-loopfund-coral-900/20 rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto mb-6"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <XCircle className="w-10 h-10 text-loopfund-coral-600" />
          </motion.div>
          <h1 className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-3">
            Invalid Payment Reference
          </h1>
          <p className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
            No payment reference provided for verification.
          </p>
          <LoopFundButton
            onClick={() => navigate('/dashboard')}
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Go to Dashboard
          </LoopFundButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopfund-neutral-50 via-loopfund-cream-50 to-loopfund-neutral-100 dark:from-loopfund-dark-bg dark:via-loopfund-dark-surface dark:to-loopfund-dark-elevated flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <LoopFundCard variant="elevated" className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-loopfund opacity-5 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-coral opacity-5 rounded-full blur-xl animate-float-delayed" />
          </div>

          <div className="relative p-8 text-center">
            {/* Status Icon */}
            <motion.div 
              className="mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className={`w-20 h-20 ${getStatusGradient()} rounded-3xl flex items-center justify-center shadow-loopfund-lg mx-auto`}
                animate={verificationStatus === 'verifying' ? { rotate: 360 } : {}}
                transition={verificationStatus === 'verifying' ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
              >
                {verificationStatus === 'verifying' ? (
                  <Loader2 className="w-10 h-10 text-white" />
                ) : (
                  getStatusIcon()
                )}
              </motion.div>
            </motion.div>

            {/* Status Title */}
            <motion.h1 
              className="font-display text-h2 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getStatusTitle()}
            </motion.h1>

            {/* Status Message */}
            <motion.p 
              className="font-body text-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {getStatusMessage()}
            </motion.p>

            {/* Payment Details */}
            {paymentData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <LoopFundCard variant="elevated" className="mb-8">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-loopfund"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Crown className="w-5 h-5 text-white" />
                      </motion.div>
                      <h3 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                        Payment Details
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                        <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Reference:</span>
                        <span className="font-mono font-body text-body text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                          {paymentData.reference}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                        <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Amount:</span>
                        <span className="font-display text-h4 text-loopfund-emerald-600">
                          ₦{(paymentData.amount / 100).toLocaleString()}
                        </span>
                      </div>
                      {paymentData.groupName && (
                        <div className="flex justify-between items-center py-3 px-4 bg-loopfund-neutral-50 dark:bg-loopfund-dark-elevated rounded-xl">
                          <span className="font-body text-body text-loopfund-neutral-700 dark:text-loopfund-neutral-300">Group:</span>
                          <span className="font-body text-body font-medium text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                            {paymentData.groupName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </LoopFundCard>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {verificationStatus === 'success' && paymentData?.groupId && (
                <LoopFundButton
                  onClick={() => navigate(`/groups/${paymentData.groupId}`)}
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="w-full"
                >
                  View Your Group
                </LoopFundButton>
              )}

              {verificationStatus === 'failed' && (
                <div className="space-y-4">
                  <LoopFundButton
                    onClick={retryVerification}
                    disabled={retryCount >= 3}
                    variant="primary"
                    size="lg"
                    icon={<Zap className="w-5 h-5" />}
                    className="w-full"
                  >
                    {retryCount >= 3 ? 'Max Retries Reached' : `Retry Verification (${3 - retryCount} left)`}
                  </LoopFundButton>
                  <LoopFundButton
                    onClick={() => navigate('/create-group')}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    Try Again
                  </LoopFundButton>
                </div>
              )}

              {verificationStatus === 'pending' && (
                <LoopFundButton
                  onClick={retryVerification}
                  variant="primary"
                  size="lg"
                  icon={<Clock className="w-5 h-5" />}
                  className="w-full"
                >
                  Check Again
                </LoopFundButton>
              )}

              <LoopFundButton
                onClick={() => navigate('/dashboard')}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Go to Dashboard
              </LoopFundButton>
            </motion.div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mt-6 p-4 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-800 rounded-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-loopfund-coral-600" />
                    <p className="font-body text-body text-loopfund-coral-600 dark:text-loopfund-coral-400">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LoopFundCard>
      </motion.div>
    </div>
  );
};

export default PaymentVerificationPage;