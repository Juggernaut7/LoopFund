import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create Group - Payment Required
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'details' && (
              <div className="space-y-6">
                {/* Group Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Group Details
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">{groupData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target:</span>
                      <span className="font-medium">₦{groupData.targetAmount?.toLocaleString()}</span>
                    </div>
                    {groupData.description && (
                      <div className="flex justify-between">
                        <span>Description:</span>
                        <span className="font-medium">{groupData.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="text-blue-600 dark:text-blue-400" size={20} />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Dynamic Group Creation Fee
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Based on amount and duration - Fair pricing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Shield size={16} />
                  <span>Secure payment powered by Paystack</span>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                  >
                    {isLoading ? 'Processing...' : 'Pay & Create Group'}
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 px-4 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="text-center space-y-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Payment in Progress
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please complete your payment on the Paystack page that opened.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={openPaymentPage}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    <ExternalLink size={20} />
                    <span>Open Payment Page</span>
                  </button>
                  
                  <button
                    onClick={handlePaymentSuccess}
                    disabled={isVerifying}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        <span>I've Completed Payment</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>Payment Reference: {paymentReference}</p>
                  <p>Keep this reference for verification</p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Payment Submitted!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isVerifying 
                      ? 'Verifying payment and creating your group...'
                      : 'Payment verified! Creating your group...'
                    }
                  </p>
                </div>
                {isVerifying && (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal; 