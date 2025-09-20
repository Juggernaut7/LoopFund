import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, CheckCircle, AlertCircle, ExternalLink, Loader2, Wallet, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { LoopFundButton, LoopFundInput, LoopFundCard } from '../ui';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const AddMoneyModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('details'); // 'details', 'payment', 'success'
  const [paymentReference, setPaymentReference] = useState('');
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    reference: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/payments/initialize-wallet-deposit', {
        amount: parseFloat(formData.amount),
        description: formData.description || 'Wallet deposit',
        reference: formData.reference || `WALLET_${Date.now()}`,
        userEmail: user.email,
        userName: user.name || user.email
      });

      if (response.data.success) {
        setPaymentUrl(response.data.data.authorizationUrl);
        setPaymentReference(response.data.data.reference);
        setStep('payment');
        
        // Create a popup window for Paystack payment
        const paystackWindow = window.open(
          response.data.data.authorizationUrl, 
          'paystack-payment',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Monitor the popup window
        const checkClosed = setInterval(() => {
          if (paystackWindow.closed) {
            clearInterval(checkClosed);
            // Automatically verify payment when user returns
            handleVerification();
          }
        }, 1000);

        // Also listen for focus events to detect when user returns
        const handleFocus = () => {
          if (paystackWindow.closed) {
            handleVerification();
            window.removeEventListener('focus', handleFocus);
          }
        };
        window.addEventListener('focus', handleFocus);
      } else {
        setError(response.data.message || 'Failed to initialize payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!paymentReference) {
      setError('No payment reference found');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await api.post('/payments/verify-wallet-deposit', {
        reference: paymentReference
      });

      if (response.data.success) {
        setStep('success');
        toast.success('Deposit Successful', `₦${parseFloat(formData.amount).toLocaleString()} has been added to your wallet!`);
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      } else {
        setError(response.data.message || 'Payment verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setStep('details');
    setFormData({ amount: '', description: '', reference: '' });
    setError('');
    setPaymentUrl('');
    setPaymentReference('');
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Remove any event listeners if they exist
      window.removeEventListener('focus', () => {});
    };
  }, []);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₦0.00';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-loopfund-neutral-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-loopfund-neutral-50 dark:bg-loopfund-dark-surface rounded-3xl shadow-loopfund-xl w-full max-w-md relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-loopfund-neutral-600 dark:text-loopfund-neutral-400 hover:text-loopfund-coral-500 transition-colors"
            >
              <X size={24} />
            </button>

            {step === 'details' && (
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-h3 text-loopfund-neutral-900 dark:text-loopfund-dark-text">
                      Add Money to Wallet
                    </h2>
                    <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400">
                      Fund your wallet securely
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Amount (NGN) *
                    </label>
                    <LoopFundInput
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      min="100"
                      step="100"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Description (Optional)
                    </label>
                    <LoopFundInput
                      type="text"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g., Emergency fund"
                    />
                  </div>

                  <div>
                    <label htmlFor="reference" className="block text-sm font-medium text-loopfund-neutral-700 dark:text-loopfund-neutral-300 mb-2">
                      Reference (Optional)
                    </label>
                    <LoopFundInput
                      type="text"
                      id="reference"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      placeholder="Custom reference"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-loopfund-coral-600" />
                      <span className="font-body text-body-sm text-loopfund-coral-700 dark:text-loopfund-coral-300">
                        {error}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <LoopFundButton
                    variant="secondary"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </LoopFundButton>
                  <LoopFundButton
                    variant="primary"
                    onClick={handlePayment}
                    disabled={isLoading || !formData.amount}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay with Paystack
                      </>
                    )}
                  </LoopFundButton>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Payment in Progress
                </h3>
                <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                  Complete your payment on the Paystack page. We'll automatically verify your payment when you return.
                </p>

                <div className="bg-loopfund-neutral-100 dark:bg-loopfund-dark-card p-4 rounded-lg mb-6">
                  <div className="text-sm font-body text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-1">
                    Amount to Pay
                  </div>
                  <div className="font-display text-h4 text-loopfund-emerald-600">
                    {formatCurrency(formData.amount)}
                  </div>
                </div>

                <div className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-loopfund-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-body text-body-sm font-medium text-loopfund-emerald-700 dark:text-loopfund-emerald-300">
                      Waiting for payment completion...
                    </span>
                  </div>
                  <p className="font-body text-body-xs text-loopfund-emerald-600 dark:text-loopfund-emerald-400">
                    Please complete your payment and return to this page. We'll automatically verify your payment.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <LoopFundButton
                    variant="secondary"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </LoopFundButton>
                  <LoopFundButton
                    variant="primary"
                    onClick={handleVerification}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        I've Paid
                      </>
                    )}
                  </LoopFundButton>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-loopfund-coral-50 dark:bg-loopfund-coral-900/20 border border-loopfund-coral-200 dark:border-loopfund-coral-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-loopfund-coral-600" />
                      <span className="font-body text-body-sm text-loopfund-coral-700 dark:text-loopfund-coral-300">
                        {error}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'success' && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-loopfund-emerald-500 to-loopfund-mint-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-display text-h4 text-loopfund-neutral-900 dark:text-loopfund-dark-text mb-2">
                  Payment Successful!
                </h3>
                <p className="font-body text-body-md text-loopfund-neutral-600 dark:text-loopfund-neutral-400 mb-6">
                  Your wallet has been funded successfully.
                </p>

                <div className="bg-loopfund-emerald-50 dark:bg-loopfund-emerald-900/20 p-4 rounded-lg mb-6">
                  <div className="text-sm font-body text-loopfund-emerald-600 dark:text-loopfund-emerald-400 mb-1">
                    Amount Added
                  </div>
                  <div className="font-display text-h4 text-loopfund-emerald-600">
                    {formatCurrency(formData.amount)}
                  </div>
                </div>

                <LoopFundButton
                  variant="primary"
                  onClick={handleClose}
                  className="w-full"
                >
                  <TrendingUp className="w-4 h-4" />
                  Continue
                </LoopFundButton>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMoneyModal;